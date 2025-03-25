using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using vizsgaremek.Models;
using vizsgaremek.DTOs;
using Microsoft.EntityFrameworkCore;
namespace vizsgaremek.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        [HttpPost("purchase")]
        
        public async Task<IActionResult> PurchaseService(Transaction transaction, string uId)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    if (!Program.LoggedInUsers.ContainsKey(uId))
                    {
                        return Unauthorized("Nem vagy bejelentkezve");
                    }
                    string transactionCode = GenerateTransactionCode();

                    var newTransaction = new Transaction
                    {
                        SenderId = transaction.SenderId,
                        ReceiverId = transaction.ReceiverId,
                        UserServiceId = transaction.UserServiceId,
                        TimeAmount = transaction.TimeAmount,
                        Description = "Service reserved",
                        TransactionDate = DateTime.UtcNow,
                        TransactionCode = transactionCode
                    };
                    
                    var seller = await context.Users.FirstOrDefaultAsync(u => u.UserId == newTransaction.ReceiverId);
                    if (seller != null)
                    {
                        context.Transactions.Add(newTransaction);
                        await context.SaveChangesAsync();
                        await Program.SendEmail(context.Users.Where(u => u.UserId == newTransaction.ReceiverId).Select(u => u.Email).FirstOrDefault(), "Tranzakció", $"Megvették a(z) {context.Services
                                            .Where(s => s.ServiceId == newTransaction.UserServiceId)
                                            .Select(s => s.ServiceName)
                                            .FirstOrDefault()} szolgáltatásodat!:");
                        await Program.SendEmail(context.Users.Where(u => u.UserId == newTransaction.SenderId).Select(u => u.Email).FirstOrDefault(), "Tranzakció", $"Megvásároltád a(z) szolgáltatást!:");
                        return Ok(new
                        {
                            SellerEmail = seller.Email,
                            TransactionCode = transactionCode
                        });
                    }
                    return NotFound("Hibás eladó");
                }

                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }



        [HttpGet("transaction-history/{userId}")]
        public async Task<IActionResult> GetTransactionHistory(int userId)
        {
            using (var context = new VizsgaremekContext())
            {
                try
                {
                    var transactions = await context.Transactions
                        .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                        .OrderByDescending(t => t.TransactionDate) 
                        .Select(t => new
                        {
                            TransactionID = t.TransactionId,
                            ServiceName = context.Services
                                            .Where(s => s.ServiceId == t.UserServiceId)
                                            .Select(s => s.ServiceName)
                                            .FirstOrDefault(),
                            TimeAmount = t.TimeAmount,
                            TransactionDate = t.TransactionDate,
                            TransactionCode = t.TransactionCode,
                            Type = t.SenderId == userId ? "Purchase" : "Sale",
                            CounterpartyEmail = t.SenderId == userId
                                ? context.Users.Where(u => u.UserId == t.ReceiverId).Select(u => u.Email).FirstOrDefault()
                                : context.Users.Where(u => u.UserId == t.SenderId).Select(u => u.Email).FirstOrDefault()
                        })
                        .ToListAsync();

                    return Ok(transactions);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        private string GenerateTransactionCode()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
