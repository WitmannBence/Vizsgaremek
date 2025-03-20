using System;
using System.Collections.Generic;

namespace Admin.Models;

public partial class Privilege
{
    public int Id { get; set; }

    public string Nev { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Szint { get; set; }
    public override string ToString()
    {
        return $"{Nev} - {Szint}"; 
    }
}
