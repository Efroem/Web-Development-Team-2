using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using EmailExample;

namespace StarterKit.Services
{
    public class ReservationService : IReservationService
    {
        private readonly DatabaseContext _dbContext;
        private readonly MailSender _mailSender;

        public ReservationService(DatabaseContext dbContext, MailSender mailSender)
        {
            _dbContext = dbContext;
            _mailSender = mailSender;
        }

        public async Task<ReservationResponse> MakeReservationAsync(ReservationRequest request)
        {
            decimal totalPrice = 0;
            TheatreShow theatreShow = null;
            TheatreShowDate showDate = null;
            Venue venue = null;

            foreach (var reservationItem in request.Reservations)
            {
                showDate = await _dbContext.TheatreShowDate
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservationItem.ShowDateId);

                if (showDate == null || showDate.DateAndTime < DateTime.Now)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Invalid or past show date." };
                }

                theatreShow = await _dbContext.TheatreShow
                    .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);

                if (theatreShow == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Associated show not found." };
                }

                venue = await _dbContext.Venue
                    .FirstOrDefaultAsync(v => v.VenueId == theatreShow.VenueId);

                if (venue == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Associated venue not found." };
                }

                var reservedTickets = await _dbContext.Reservation
                    .Where(r => r.TheatreShowDateId == reservationItem.ShowDateId)
                    .SumAsync(r => r.AmountOfTickets);

                var availableTickets = venue.Capacity - reservedTickets;

                if (availableTickets < reservationItem.TicketCount)
                {
                    return new ReservationResponse
                    {
                        Success = false,
                        ErrorMessage = $"Not enough tickets for {theatreShow.Title} on {showDate.DateAndTime:dd-MM-yyyy HH:mm}."
                    };
                }

                totalPrice += reservationItem.TicketCount * (decimal)theatreShow.Price;
            }

            var customer = await _dbContext.Customer.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                customer = new Customer { FirstName = request.FirstName, LastName = request.LastName, Email = request.Email };
                await _dbContext.Customer.AddAsync(customer);
            }

            var newReservation = new Reservation
            {
                Customer = customer,
                AmountOfTickets = request.Reservations.Sum(r => r.TicketCount),
                TheatreShowDateId = request.Reservations[0].ShowDateId
            };

            await _dbContext.Reservation.AddAsync(newReservation);
            await _dbContext.SaveChangesAsync();

            // Send confirmation email after successful reservation
            await _mailSender.SendEmailAsync(
                toEmail: request.Email,
                customerName: $"{request.FirstName} {request.LastName}",
                showTitle: theatreShow.Title,
                venueName: venue.Name,  // Pass venue name here
                showDate: showDate.DateAndTime,
                totalPrice: totalPrice
            );

            return new ReservationResponse { Success = true, TotalPrice = totalPrice };
        }

    }
}
