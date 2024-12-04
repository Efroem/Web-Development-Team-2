using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;
using System.Text.RegularExpressions;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/v1/Reservations")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpPost]
        public async Task<IActionResult> MakeReservation([FromBody] ReservationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || !IsValidEmail(request.Email))
            {
                return BadRequest(new { Message = "Invalid email address." });
            }

            if (string.IsNullOrWhiteSpace(request.FirstName))
            {
                return BadRequest(new { Message = "Enter your first name." });
            }

            if (string.IsNullOrEmpty(request.LastName))
            {
                return BadRequest(new { Message = "Enter your last name." });
            }

            var response = await _reservationService.MakeReservationAsync(request);
            
            if (response.Success)
            {
                return Ok(new { TotalPrice = response.TotalPrice });
            }
            return BadRequest(new { Message = response.ErrorMessage });
        }

        private bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

    }
}
