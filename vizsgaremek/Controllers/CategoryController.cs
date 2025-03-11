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
        [HttpGet("CategorySearch/{categoryId}")]
        public IActionResult CategorySearch(int CategoryID)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var keres = context.Services.Where(c =>c.CategoryId == CategoryID).ToList();
                    if (keres == null || keres.Count == 0)
                    {
                        return NotFound("Ehhez a kategóriához még nem készült szolgáltatás");
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
