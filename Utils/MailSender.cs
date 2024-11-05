using System;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EmailExample
{
    public class MailSender
    {
        public void SendEmail()
        {

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Theatershow Ahoy", "hello@demomailtrap.com"));
            email.To.Add(new MailboxAddress("TestVincent", "altijdwerkers@gmail.com"));
            email.Subject = "Reservation for the movie";

            var builder = new BodyBuilder
            {
                HtmlBody = "<h1>Bedankt voor je reservering!</h1><p>Beste {naam bezoeker},</p><p>Je reservering voor de theatershow is succesvol ontvangen. We kijken ernaar uit om je te verwelkomen!</p><p><strong>Details:</strong></p><ul><li><strong>Locatie:</strong> Rotterdam</li><li><strong>Datum:</strong> {datum van de theather}</li><li><strong>Tijd:</strong> 20:00 uur</li></ul><p>Mocht je vragen hebben, neem gerust contact met ons op via onze website.</p><p>Met vriendelijke groet,<br/>De Altijd Volle bak Theather</p>"
            };


            email.Body = builder.ToMessageBody();

            // Hier connect hij met de Mailtrap server
            using (var smtp = new SmtpClient())
            {   
                try
                {

                    smtp.Connect("live.smtp.mailtrap.io", 587, SecureSocketOptions.StartTls);

                    smtp.Authenticate("api", "eed7caddbdb3c8fcbee4082f001579a0");

                    smtp.Send(email);
                    Console.WriteLine("Email sent successfully!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email: {ex.Message}");
                }
                finally
                {
                    smtp.Disconnect(true);
                }
            }
        }
    }
}
