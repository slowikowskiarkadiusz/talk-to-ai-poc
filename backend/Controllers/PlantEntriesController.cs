using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlantEntriesController(AppDbContext db) : ControllerBase
{
    // GET api/plantentries
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? greenhouse,
        [FromQuery] string? block,
        [FromQuery] string? targetKind)
    {
        var query = db.PlantEntries.AsQueryable();

        if (!string.IsNullOrEmpty(greenhouse))
            query = query.Where(e => e.Greenhouse == greenhouse);
        if (!string.IsNullOrEmpty(block))
            query = query.Where(e => e.Block == block);
        if (!string.IsNullOrEmpty(targetKind))
            query = query.Where(e => e.TargetKind == targetKind);

        return Ok(await query.OrderByDescending(e => e.CreatedAt).ToListAsync());
    }

    // GET api/plantentries/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var entry = await db.PlantEntries.FindAsync(id);
        return entry is null ? NotFound() : Ok(entry);
    }

    // POST api/plantentries
    [HttpPost]
    public async Task<IActionResult> Create(PlantEntry entry)
    {
        entry.Id = 0; // ensure EF assigns ID
        entry.CreatedAt = DateTime.UtcNow;
        db.PlantEntries.Add(entry);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
    }

    // PUT api/plantentries/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PlantEntry entry)
    {
        if (id != entry.Id) return BadRequest();

        var existing = await db.PlantEntries.FindAsync(id);
        if (existing is null) return NotFound();

        existing.Greenhouse = entry.Greenhouse;
        existing.Block = entry.Block;
        existing.TargetKind = entry.TargetKind;
        existing.PlantHeight = entry.PlantHeight;
        existing.StemWidth = entry.StemWidth;
        existing.LeafWidth = entry.LeafWidth;
        existing.BedDepth = entry.BedDepth;

        await db.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE api/plantentries/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entry = await db.PlantEntries.FindAsync(id);
        if (entry is null) return NotFound();

        db.PlantEntries.Remove(entry);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
