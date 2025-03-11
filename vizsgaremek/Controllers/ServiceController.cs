using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Bcpg;
using System.Linq.Expressions;
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
        [HttpGet("ServicesByUSERID/{id}")]
        public IActionResult GetServices(int id)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var keres = context.Services
                        .Where(x => x.UserId == id)
                        .Select(service => new
                        {
                            service.ServiceId,
                            service.UserId,
                            service.ServiceName,
                            service.TimeCost,
                            service.Description,
                            service.CreatedAt,
                            service.CategoryId,
                            FelhasznaloNev = context.Users
                                .Where(user => user.UserId == service.UserId)
                                .Select(user => user.FelhasznaloNev)
                                .FirstOrDefault(),
                            CategoryName = context.Categories.Where(cat=> cat.CategoryId == service.CategoryId).Select(cat=> cat.CategoryName).FirstOrDefault(),
                        })
                        .ToList();

                    if (keres == null || keres.Count == 0)
                    {
                        return NotFound("Nem találtunk szolgáltatást");
                    }

                    return Ok(keres);
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
                   
                    
                       var services = context.Services.Select(service => new
                        {
                            service.ServiceId,
                            service.UserId,
                            service.ServiceName,
                            service.TimeCost,
                            service.Description,
                            service.CreatedAt,
                            service.CategoryId,
                            FelhasznaloNev = context.Users
                                .Where(user => user.UserId == service.UserId)
                                .Select(user => user.FelhasznaloNev)
                                .FirstOrDefault(),
                            CategoryName = context.Categories.Where(cat => cat.CategoryId == service.CategoryId).Select(cat => cat.CategoryName).FirstOrDefault(),
                        }).ToList();
                        

                    
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
                    var keres = context.Services
                        .Where(x => x.ServiceId == id)
                        .Select(service => new
                        {
                            service.ServiceId,
                            service.UserId,
                            service.ServiceName,
                            service.TimeCost,
                            service.Description,
                            service.CreatedAt,
                            service.CategoryId,
                            FelhasznaloNev = context.Users
                                .Where(user => user.UserId == service.UserId)
                                .Select(user => user.FelhasznaloNev)
                                .FirstOrDefault(),
                            CategoryName = context.Categories.Where(cat => cat.CategoryId == service.CategoryId).Select(cat => cat.CategoryName).FirstOrDefault(),
                        }).FirstOrDefault();
                        

                    if (keres == null)
                    {
                        return NotFound("Nem találtunk szolgáltatást");
                    }
                    return Ok(keres);

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
            [HttpDelete]
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
        
            [HttpPut("{id}")]
            public async Task<IActionResult> UpdateService(int id, Service updatedService, string uId)
            {
                using (var context = new VizsgaremekContext())
                {
                    try
                    {
                        if (id != updatedService.ServiceId)
                        {
                            return BadRequest("ID mismatch.");
                        }

                        var existingService = await context.Services.FindAsync(id);
                        if (existingService == null)
                        {
                            return NotFound();
                        }

                        int userID = Program.LoggedInUsers[uId].UserId;
                        int jog = Program.LoggedInUsers[uId].Jogosultsag;

                        if (existingService.UserId != userID && jog != 9)
                        {
                            return Unauthorized("Ez nem a te szolgáltatásod!");
                        }


                        existingService.ServiceName = updatedService.ServiceName;
                        existingService.TimeCost = updatedService.TimeCost;
                        existingService.Description = updatedService.Description;
                        existingService.CategoryId = updatedService.CategoryId;
                        existingService.CreatedAt = updatedService.CreatedAt;

                        await context.SaveChangesAsync();

                        return Ok(existingService);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
            }
        [HttpGet("SearchService")]
        public IActionResult SearchService(string input)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var services = context.Services
                        .Where(s => s.ServiceName.Contains(input) || s.Description.Contains(input))
                        .Distinct()
                        .ToList();

                    return Ok(services);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


    }
} 




