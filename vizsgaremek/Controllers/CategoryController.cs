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
        [HttpGet("CategorySearch")]
        public IActionResult CategorySearch(string Name)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var keres = context.Categories.Where(c =>c.CategoryName == Name).ToList();
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
