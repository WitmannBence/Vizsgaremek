using System;
using System.Collections.Generic;

namespace vizsgaremek.Models;

public partial class Service
{
    public int ServiceId { get; set; }

    public int UserId { get; set; }

    public string ServiceName { get; set; } = null!;

    public decimal? TimeCost { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public int? CategoryId { get; set; }

    public virtual Category? Category { get; set; }

    public virtual UserService? UserService { get; set; }
}
