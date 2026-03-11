using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Services;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController(OllamaService ollama, AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Chat(ChatRequest request)
    {
        var (llmMessage, toolCallObj) = await ollama.ChatAsync(request.Message, request.History);

        // LLM returned a tool call – execute it and return data
        if (toolCallObj is ToolCall toolCall)
        {
            var data = await ExecuteToolAsync(toolCall);
            return Ok(new ChatResponse("Here are the results.", data));
        }

        // Plain text response
        return Ok(new ChatResponse(llmMessage));
    }

    private async Task<object?> ExecuteToolAsync(ToolCall toolCall)
    {
        return toolCall.Tool switch
        {
            "queryRecords" => await QueryRecordsAsync(toolCall.Args),
            "getRecord"    => await GetRecordAsync(toolCall.Args),
            _              => null
        };
    }

    private async Task<List<PlantEntry>> QueryRecordsAsync(QueryFilters? filters)
    {
        var query = db.PlantEntries.AsQueryable();

        if (filters is null)
            return await query.OrderByDescending(e => e.CreatedAt).Take(50).ToListAsync();

        if (!string.IsNullOrEmpty(filters.Greenhouse))
            query = query.Where(e => e.Greenhouse == filters.Greenhouse);
        if (!string.IsNullOrEmpty(filters.Block))
            query = query.Where(e => e.Block == filters.Block);
        if (!string.IsNullOrEmpty(filters.TargetKind))
            query = query.Where(e => e.TargetKind == filters.TargetKind);

        var limit = filters.Limit ?? 50;
        return await query.OrderByDescending(e => e.CreatedAt).Take(limit).ToListAsync();
    }

    private async Task<PlantEntry?> GetRecordAsync(QueryFilters? filters)
    {
        // LLM passes id as a filter field – read from args JSON directly
        // TODO: extend QueryFilters with Id field if needed
        return await db.PlantEntries.OrderByDescending(e => e.CreatedAt).FirstOrDefaultAsync();
    }
}
