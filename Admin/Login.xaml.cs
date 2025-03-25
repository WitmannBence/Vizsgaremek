using Admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Admin
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class Login : Window
    {
        public Login()
        {
            InitializeComponent();
        }

       private void btnLogin_Click(object sender, RoutedEventArgs e)
{
    string username = tbFelhasznalonev.Text;
    string password = tbJelszo.Text;

    using (var context = new VizsgaremekContext())
    {
        var user = context.Users
            .Where(u => u.FelhasznaloNev == username && u.Jogosultsag == 9)
            .FirstOrDefault();

        if (user != null)
        {
            string storedHashedPassword = user.Hash; 
            string storedSalt = user.Salt; 

            if (string.IsNullOrEmpty(storedSalt) || string.IsNullOrEmpty(storedHashedPassword))
            {
                MessageBox.Show("Hibás jelszó formátum!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            
            string hashedInputPassword = CreateSHA256(CreateSHA256(password + storedSalt));

                    if (hashedInputPassword == storedHashedPassword)
                     {
                MessageBox.Show("Sikeres bejelentkezés!");
                        
                        MainWindow adminPanel = new MainWindow();
                adminPanel.Show();
                this.Close();
                     }
            else
            {
                        MessageBox.Show("Stored Hash: " + storedHashedPassword);
                        MessageBox.Show("Computed Hash: " + hashedInputPassword);
                        MessageBox.Show("Hibás bejelentkezés vagy nincs jogosultságod!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        else
        {
            
            MessageBox.Show("Hibás felhasználónév vagy nincs jogosultságod!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }
}

        public static string CreateSHA256(string input)
                    {
                using (SHA256 sha256 = SHA256.Create())
                {
                byte[] data = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                var sBuilder = new StringBuilder();
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }
                return sBuilder.ToString();
            }
                    }
    }
}
