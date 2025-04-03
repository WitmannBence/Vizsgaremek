using System;
using System.Collections.Generic;

namespace vizsgaremek.Models;

public partial class Transaction
{
    public int TransactionId { get; set; }

    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    public int UserServiceId { get; set; }

    public decimal? TimeAmount { get; set; }

    public string? Description { get; set; }

    public DateTime? TransactionDate { get; set; }

    public string TransactionCode { get; set; } = null!;

    public virtual User? Sender { get; set; } = null!;
}

