namespace vizsgaremek.DTOs
{
    public class LoggedInUser
    {
        public string Token { get; set; } = null!;
        public string FelhasznaloNev { get; set; } = null!;
        public int userID { get; set; } 
        public decimal? TimeBalance { get; set; }
        public int Jogosultsag { get; set; }
        public string TeljesNev {  get; set; } = null!;
        public string Email {  get; set; } = null!;
        public string ProfilKepUtvonal {  get; set; } = null!;
    }
}
