namespace API.Models;

public class PlantEntry
{
    public int Id { get; set; }
    public string Greenhouse { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public string TargetKind { get; set; } = string.Empty;
    public double PlantHeight { get; set; }
    public double StemWidth { get; set; }
    public double LeafWidth { get; set; }
    public double BedDepth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
