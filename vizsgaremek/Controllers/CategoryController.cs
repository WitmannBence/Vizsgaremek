using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vizsgaremek.Models;

namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        [HttpGet("CategoryList")]
        public IActionResult GetCategories() 
        {
            using (var context = new VizsgaremekContext()) 
            {
                try
                {
                    var keres = context.Categories.ToList();
                    return Ok(keres);
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
        [HttpGet("CategorySearch/{CategoryID}")]
        public IActionResult CategorySearch(int CategoryID)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var keres = context.Services.Where(c =>c.CategoryId == CategoryID).Select(service => new
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
                        Categoryimg = context.Categories.Where(cat => cat.CategoryId == service.CategoryId).Select(cat => cat.Categoryimg).FirstOrDefault(),
                    }).ToList();
                    if (keres.Count == 0)
                    {
                        return NotFound("Még nincs ilyen kategóriával szolgáltatás!");
                    }
                    return Ok(keres);

                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
        }
    }
}
