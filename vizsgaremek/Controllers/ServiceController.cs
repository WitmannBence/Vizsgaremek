using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using vizsgaremek.DTOs;
using vizsgaremek.Models;

namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateService(Service service, string uId)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(uId))
                    {
                        return Unauthorized("Nem vagy bejelentkezve");
                    }

                    if (service == null)
                    {
                        return BadRequest("Üres objektum");
                    }

                    int userId = Program.LoggedInUsers[uId].UserId;


                    var userExists = await context.Users.AnyAsync(u => u.UserId == userId);
                    if (!userExists)
                    {
                        return BadRequest("A felhasználó nem található az adatbázisban.");
                    }


                    service.UserId = userId;

                    context.Services.Add(service);
                    await context.SaveChangesAsync();
                    var userservice = new UserService
                    {
                        UserId = userId,
                        ServiceId = service.ServiceId
                    };
                    context.UserServices.Add(userservice);
                    await context.SaveChangesAsync();

                    return Ok("Sikeres rögzítés");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("ServicesByUSERID")]
        public IActionResult GetServices(int id)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {

                    var keres = context.Services.Where(x => x.UserId == id).ToList();
                    if (keres == null || keres.Count == 0)
                    {
                        return NotFound("Nem találtunk szolgáltatást");
                    }
                    else { return Ok(keres); }


                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("AllService")]
        public IActionResult GetUsers()
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    List<Service> services = new List<Service>();
                    {
                        services = context.Services.ToList();

                    }
                    return Ok(services);
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("ServiceBySERVICEID/{id}")]
        public IActionResult GetServiceBYID(int id)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {

                    var keres = context.Services.FirstOrDefault(x => x.ServiceId == id);
                    if (keres == null)
                    {
                        return NotFound("Még nincs ilyen szolgáltatás ezzel az azonosítóval");
                    }
                    else { return Ok(keres); }


                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int serviceId, string uId)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(uId))
                    {
                        return Unauthorized("Nem vagy bejelentkezve");
                    }

                    var loggedInUser = Program.LoggedInUsers[uId];
                    int userId = Program.LoggedInUsers[uId].UserId;
                    int userPermissionLevel = Program.LoggedInUsers[uId].Jogosultsag;

                    var service = await context.Services.FindAsync(serviceId);
                    if (service == null)
                    {
                        return NotFound("A szolgáltatás nem található.");
                    }

                    if (service.UserId != userId && userPermissionLevel != 9)
                    {
                        return Forbid("Nincs jogosultságod ennek a szolgáltatásnak a törlésére.");
                    }

                    
                    var userServices = context.UserServices.Where(us => us.ServiceId == serviceId);
                    context.UserServices.RemoveRange(userServices);
                    context.Services.Remove(service);
                    await context.SaveChangesAsync();

                    return Ok("Szolgáltatás sikeresen törölve.");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


    }
}



