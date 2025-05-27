using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI;
using HealthCareAPI.Entities;

namespace HealthCareAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class Menstrual_cycleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public Menstrual_cycleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Menstrual_cycle
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Menstrual_cycle>>> GetMenstrual_Cycles()
        {
            return await _context.Menstrual_Cycles.ToListAsync();
        }

        // GET: api/Menstrual_cycle/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Menstrual_cycle>> GetMenstrual_cycle(int id)
        {
            var menstrual_cycle = await _context.Menstrual_Cycles.FindAsync(id);

            if (menstrual_cycle == null)
            {
                return NotFound();
            }

            return menstrual_cycle;
        }

        // PUT: api/Menstrual_cycle/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenstrual_cycle(int id, Menstrual_cycle menstrual_cycle)
        {
            if (id != menstrual_cycle.CycleID)
            {
                return BadRequest();
            }

            _context.Entry(menstrual_cycle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Menstrual_cycleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Menstrual_cycle
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Menstrual_cycle>> PostMenstrual_cycle(Menstrual_cycle menstrual_cycle)
        {
            _context.Menstrual_Cycles.Add(menstrual_cycle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMenstrual_cycle", new { id = menstrual_cycle.CycleID }, menstrual_cycle);
        }

        // DELETE: api/Menstrual_cycle/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenstrual_cycle(int id)
        {
            var menstrual_cycle = await _context.Menstrual_Cycles.FindAsync(id);
            if (menstrual_cycle == null)
            {
                return NotFound();
            }

            _context.Menstrual_Cycles.Remove(menstrual_cycle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Menstrual_cycleExists(int id)
        {
            return _context.Menstrual_Cycles.Any(e => e.CycleID == id);
        }
    }
}
