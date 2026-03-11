using System.Text;
using System.Text.Json;
using API.Models;

namespace API.Services;

public partial class OllamaService(HttpClient http, IConfiguration config)
{
    private readonly string _model = config["Ollama:Model"] ?? "llama3.2:3b";
    private readonly string _baseUrl = config["Ollama:BaseUrl"] ?? "http://localhost:11434";

    [System.Text.RegularExpressions.GeneratedRegex(@"\{[\s\S]*\}")]
    private static partial System.Text.RegularExpressions.Regex MyRegex();

    private static readonly JsonSerializerOptions jsonSerializerOptions = new() { PropertyNameCaseInsensitive = true };

    private const string SystemPrompt = """
        You are a plant measurement database assistant.
        When the user asks for data, respond ONLY with a JSON tool call and nothing else.
        When the user asks a general question, respond normally in plain text.

        Available tools:
        - queryRecords: query plant measurement records
        - getRecord: get a single record by ID

        Tool call format (use this when querying data):
        {"tool":"queryRecords","args":{"greenhouse":"Greenhouse 1","block":null,"targetKind":"Aphid","limit":10}}

        Filterable fields: greenhouse, block, targetKind. All filters are optional.
        If no filter matches the question, use null for that field.

        Examples:
        User: "show all aphid records" → {"tool":"queryRecords","args":{"targetKind":"Aphid"}}
        User: "records from greenhouse 2" → {"tool":"queryRecords","args":{"greenhouse":"Greenhouse 2"}}
        User: "get record 5" → {"tool":"getRecord","args":{"id":5}}
        User: "how are you?" → respond in plain text
        """;

    public async Task<(string message, object? data)> ChatAsync(
        string userMessage,
        List<ChatMessage> history)
    {
        var messages = BuildMessages(history, userMessage);
        var llmResponse = await CallOllamaAsync(messages);

        // Try to parse as tool call
        var toolCall = TryParseToolCall(llmResponse);
        if (toolCall is not null)
            return (llmResponse, toolCall);

        return (llmResponse, null);
    }

    private static List<object> BuildMessages(List<ChatMessage> history, string userMessage)
    {
        var messages = new List<object>
        {
            new { role = "system", content = SystemPrompt }
        };

        foreach (var msg in history)
            messages.Add(new { role = msg.Role, content = msg.Content });

        messages.Add(new { role = "user", content = userMessage });
        return messages;
    }

    private async Task<string> CallOllamaAsync(List<object> messages)
    {
        var payload = new
        {
            model = _model,
            stream = false,
            messages
        };

        var json = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var response = await http.PostAsync($"{_baseUrl}/api/chat", content);

        response.EnsureSuccessStatusCode();
        var responseJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(responseJson);
        return doc.RootElement
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? string.Empty;
    }

    private static ToolCall? TryParseToolCall(string response)
    {
        try
        {
            // Extract JSON from response
            var match = MyRegex().Match(response);
            if (!match.Success) return null;

            return JsonSerializer.Deserialize<ToolCall>(match.Value, jsonSerializerOptions);
        }
        catch
        {
            return null;
        }
    }
}
