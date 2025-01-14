using System;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;

namespace EmailExample
{
    public class MailSender
    {
        public async Task SendEmailAsync(string toEmail, string customerName, string showTitle, string venueName, DateTime showDate, decimal totalPrice)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Altijd Volle Bak Theater", "altijdvollebak@boendermaker.com"));
            email.To.Add(new MailboxAddress(customerName, toEmail));
            email.Subject = $"Reserveringsbevestiging voor {showTitle}";

            var builder = new BodyBuilder
            {
                HtmlBody = $"<h1>Bedankt voor je reservering!</h1>" +
                           $"<p>Beste {customerName},</p>" +
                           $"<p>Uw reservering voor <strong>{showTitle}</strong> in <strong>{venueName}</strong> is bevestigd. Wij kijken ernaar uit om u te verwelkomen!</p>" +
                           $"<p><strong>Details:</strong></p>" +
                           $"<ul>" +
                           $"<li><strong>Locatie:</strong> Wijnhaven 107, Rotterdam</li>" +
                           $"<li><strong>Datum:</strong> {showDate:dddd, MMMM d, yyyy}</li>" +
                           $"<li><strong>Tijd:</strong> {showDate:HH:mm}</li>" +
                           $"<li><strong>Prijs:</strong> €{totalPrice:F2}</li>" +
                           $"</ul>" +
                           $"<p><strong>'Altijd Volle Bak Theater - Altijd uitverkocht, altijd onvergetelijk'<strong></p>"
            };

            email.Body = builder.ToMessageBody();

            using (var smtp = new SmtpClient())
            {
                try
                {
                    await smtp.ConnectAsync("boendermaker.com", 465, SecureSocketOptions.SslOnConnect);
                    await smtp.AuthenticateAsync("altijdvollebak@boendermaker.com", "3Vpi69%i7");
                    await smtp.SendAsync(email);
                    Console.WriteLine("Email sent successfully!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
                finally
                {
                    await smtp.DisconnectAsync(true);
                }
            }
        }
    }
}
