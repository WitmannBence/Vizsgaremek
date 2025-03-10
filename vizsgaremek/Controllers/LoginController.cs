using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using vizsgaremek.Models;
using vizsgaremek.DTOs;

namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpPost("GetSalt/{felhasznaloNev}")]
        public async Task<IActionResult> GetSalt(string felhasznaloNev)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    User response = await context.Users.FirstOrDefaultAsync(u => u.FelhasznaloNev == felhasznaloNev);
                    if (response == null)
                    {
                        return NotFound("Felhasználó nem található");
                    }
                    return Ok(response.Salt);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost] 
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    string hash = Program.CreateSHA256(loginDTO.TmpHash);
                    User response = await context.Users.FirstOrDefaultAsync(u => u.FelhasznaloNev == loginDTO.LoginName && u.Hash == hash);
                    if (response != null && response.Aktiv == 1)
                    {
                        string token = Guid.NewGuid().ToString();
                        lock (Program.LoggedInUsers)
                        {
                            Program.LoggedInUsers.Add(token, response);
                        }
                        return Ok(new LoggedInUser()
                        {
                            Token = token,
                            FelhasznaloNev = response.FelhasznaloNev,
                            userID = response.UserId,
                            TimeBalance = response.TimeBalance,
                            Jogosultsag = response.Jogosultsag,
                            TeljesNev = response.TeljesNev,
                            Email = response.Email,
                            ProfilKepUtvonal = response.ProfilKepUtvonal
                        });

                    }
                    return NotFound("Felhasználó nem található vagy nem aktív");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
    }
}
