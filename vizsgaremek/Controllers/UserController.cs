using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vizsgaremek.Models;

namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("AllUsers")]
        public IActionResult GetUsers() 
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    List<User> userList = new List<User>();
                    {
                        userList = context.Users.ToList();

                    }
                    return Ok(userList);
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpPost("Registry")]
        public async Task<IActionResult> Registry(User user)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    if (context.Users.FirstOrDefault(u => u.FelhasznaloNev == user.FelhasznaloNev) != null)
                    {
                        return BadRequest("A felhasználónév már foglalt");
                    }
                    if (context.Users.FirstOrDefault(u => u.Email == user.Email) != null)
                    {
                        return BadRequest("Az email cím már foglalt!");
                    }
                    user.Aktiv = 0;
                    user.Jogosultsag = 0;
                    user.TimeBalance = 0;
                    user.Hash = Program.CreateSHA256(user.Hash);
                    await context.Users.AddAsync(user);
                    await context.SaveChangesAsync();
                    await  Program.SendEmail(user.Email, "Regisztráció", $"A következő linkre kattintva véglegesítse a regisztrációját: \nhttp://localhost:5293/api/User/Aktivacio?Felhasznalonev={user.FelhasznaloNev}&email={user.Email}");
                    return Ok("Sikeres regisztráció! Az aktiváláshoz ellenőrizze az email fiókját!");
                }
                catch (Exception ex)
                {
                    
                    if (ex.InnerException != null)
                        return BadRequest(($"Inner Exception: {ex.InnerException.Message}"));
                    return BadRequest($"Error: {ex.Message}");
                }
            }
        }
        [HttpGet("Aktivacio")]
        
        public async Task<IActionResult> Activate(string Felhasznalonev, string email)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var user = context.Users.FirstOrDefault(u => u.FelhasznaloNev == Felhasznalonev && u.Email == email);
                    if (user == null)
                    {
                        return BadRequest("Sikertelen aktiválás.");
                    }
                    user.Aktiv = 1;
                    user.Jogosultsag = 1;
                    user.TimeBalance += 30;
                    context.Users.Update(user);
                    await context.SaveChangesAsync();
                    return Ok("Sikeres aktiválás!");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("userbyusername")]
        public IActionResult GetUserbyUsername(string keres)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {

                    var felhasznalo = context.Users.FirstOrDefault(u => u.FelhasznaloNev == keres);
                    if (keres == null)
                    {
                        return NotFound("Nincs ilyen felhasználó");
                    }
                    return Ok(felhasznalo);
                    
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("userbyuserid/{keres}")]
        public IActionResult GetUserbyUserId(int keres, string uId)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    
                     if (!Program.LoggedInUsers.ContainsKey(uId))
                        {
                            return Unauthorized("Nem vagy bejelentkezve");
                        }
                        var felhasznalo = context.Users.FirstOrDefault(u => u.UserId == keres);
                    if (keres == null)
                    {
                        return NotFound("Nincs ilyen felhasználó");
                    }
                    return Ok(felhasznalo);

                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
    }
}
