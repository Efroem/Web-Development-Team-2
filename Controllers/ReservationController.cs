using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

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
            var response = await _reservationService.MakeReservationAsync(request);
            
            if (response.Success)
            {
                return Ok(new { TotalPrice = response.TotalPrice });
            }
            return BadRequest(new { Message = response.ErrorMessage });
        }
    }
}
