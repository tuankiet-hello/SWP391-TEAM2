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
    public class AppoinmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppoinmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appoinments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appoinment>>> GetAppoinments()
        {
            return await _context.Appoinments.ToListAsync();
        }

        // GET: api/Appoinments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appoinment>> GetAppoinment(int id)
        {
            var appoinment = await _context.Appoinments.FindAsync(id);

            if (appoinment == null)
            {
                return NotFound();
            }

            return appoinment;
        }

        // PUT: api/Appoinments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppoinment(int id, Appoinment appoinment)
        {
            if (id != appoinment.AppointmentID)
            {
                return BadRequest();
            }

            _context.Entry(appoinment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppoinmentExists(id))
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

        // POST: api/Appoinments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Appoinment>> PostAppoinment(Appoinment appoinment)
        {
            _context.Appoinments.Add(appoinment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppoinment", new { id = appoinment.AppointmentID }, appoinment);
        }

        // DELETE: api/Appoinments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppoinment(int id)
        {
            var appoinment = await _context.Appoinments.FindAsync(id);
            if (appoinment == null)
            {
                return NotFound();
            }

            _context.Appoinments.Remove(appoinment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppoinmentExists(int id)
        {
            return _context.Appoinments.Any(e => e.AppointmentID == id);
        }
    }
}
