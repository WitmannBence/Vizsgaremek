using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vizsgaremek.Models;

namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        [HttpGet("CategorySearch")]
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
    }
}
