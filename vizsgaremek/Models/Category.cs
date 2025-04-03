using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace vizsgaremek.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string Categoryimg { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}
