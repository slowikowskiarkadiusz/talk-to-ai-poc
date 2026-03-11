namespace API.Models;

public record ChatRequest(string Message, List<ChatMessage> History);

public record ChatMessage(string Role, string Content);

public record ChatResponse(string Message, object? Data = null);

public record ToolCall(string Tool, QueryFilters? Args);

public record QueryFilters(
    string? Greenhouse,
    string? Block,
    string? TargetKind,
    string? Target,
    int? Limit
);
