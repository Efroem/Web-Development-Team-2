namespace StarterKit.Services
{
    public interface IReservationService
    {
        Task<ReservationResponse> MakeReservationAsync(ReservationRequest request);
    }
}
