using Admin.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.ObjectModel;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Admin
{

    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();
            using (var context = new VizsgaremekContext())
            {
                var jogosultsagok = context.Privileges
                    .Select(j => new Privilege { Nev = j.Nev, Szint = j.Szint })
                    .ToList();

               
                foreach (var jogosultsag in jogosultsagok)
                {
                    cbJogosultsagok.Items.Add(jogosultsag);
                }
            }

        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            
        }

        private void btnFelhasznalok_Click(object sender, RoutedEventArgs e)
        {
            using (var context = new VizsgaremekContext()) 
            {
                var users = context.Users.ToList();
                dtgAdatok.ItemsSource = users;
            }
        }

        private void btnMegjelenit_Click(object sender, RoutedEventArgs e)
        {
            using (var context = new VizsgaremekContext())
            {
                var services = context.Services
        
                    .Select(service => new
                    {
                        Service = service,  
                        service.ServiceId,
                        service.UserId,
                        service.ServiceName,
                        service.TimeCost,
                        service.Description,
                        service.CreatedAt,
                        service.CategoryId,
                        FelhasznaloNev = context.Users
                    .Where(user => user.UserId == service.UserId)
                    .Select(user => user.FelhasznaloNev)
                    .FirstOrDefault(),
                        CategoryName = context.Categories
                    .Where(cat => cat.CategoryId == service.CategoryId)
                    .Select(cat => cat.CategoryName)
                    .FirstOrDefault(),
                    })
            .ToList();


                dtgAdatok.ItemsSource = services;
            }
        }



        private async void btnTorol_Click(object sender, RoutedEventArgs e)
        {
            
            var selectedService = dtgAdatok.SelectedItem as dynamic;  

            if (selectedService == null)
            {
                MessageBox.Show("Válassz ki valamit!");
                return;
            }

            var kivalasztott = selectedService.Service as Service;

            if (kivalasztott == null)
            {
                MessageBox.Show("A kiválasztott elem nem érvényes!");
                return;
            }

            var result = MessageBox.Show($"Biztos ki akarod törölni ezt a szolgáltatást?: {kivalasztott.ServiceName}?",
                                         "Törlés", MessageBoxButton.YesNo);

            if (result == MessageBoxResult.No)
            {
                return;
            }

            using (var context = new VizsgaremekContext())
            {
                context.Services.Remove(kivalasztott);

                try
                {
                    await context.SaveChangesAsync();
                    MessageBox.Show("Sikeres törlés");

                    
                    btnMegjelenit_Click(null, null);  
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }

        private void cbJogosultsagok_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

        }

        private async void  btnJogosultsag_Click(object sender, RoutedEventArgs e)
        {
            using (var context = new VizsgaremekContext()) 
            {
                var kivalasztott = dtgAdatok.SelectedItem as User;
                if (kivalasztott == null) 
                {
                    MessageBox.Show("Válassz ki egy felhasználót!");
                    return;
                }
                var kivalasztottSzint = cbJogosultsagok.SelectedItem as Privilege;
                if (kivalasztottSzint == null)
                {
                    MessageBox.Show("Válassz ki egy jogosultsági szintet!");
                    return;
                }

               
                kivalasztott.Jogosultsag = kivalasztottSzint.Szint;
                context.Users.Update(kivalasztott);
                
                await context.SaveChangesAsync();

                
                MessageBox.Show("A felhasználó jogosultsága frissítve lett.");
            }
        }
    }
    }