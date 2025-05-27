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
    public class ConsultantsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConsultantsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Consultants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consultant>>> GetConsultants()
        {
            return await _context.Consultants.ToListAsync();
        }

        // GET: api/Consultants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Consultant>> GetConsultant(int id)
        {
            var consultant = await _context.Consultants.FindAsync(id);

            if (consultant == null)
            {
                return NotFound();
            }

            return consultant;
        }

        // PUT: api/Consultants/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsultant(int id, Consultant consultant)
        {
            if (id != consultant.ConsultantID)
            {
                return BadRequest();
            }

            _context.Entry(consultant).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultantExists(id))
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

        // POST: api/Consultants
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Consultant>> PostConsultant(Consultant consultant)
        {
            _context.Consultants.Add(consultant);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsultant", new { id = consultant.ConsultantID }, consultant);
        }

        // DELETE: api/Consultants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultant(int id)
        {
            var consultant = await _context.Consultants.FindAsync(id);
            if (consultant == null)
            {
                return NotFound();
            }

            _context.Consultants.Remove(consultant);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultantExists(int id)
        {
            return _context.Consultants.Any(e => e.ConsultantID == id);
        }
    }
}
