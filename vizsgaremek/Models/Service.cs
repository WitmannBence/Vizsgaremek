using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

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
    [JsonIgnore]
    public virtual Category? Category { get; set; }
    [JsonIgnore]
    public virtual ICollection<UserService> UserServices { get; set; } = new List<UserService>();
}
