public class ReservationRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public List<ReservationItem> Reservations { get; set; }
}

public class ReservationItem
{
    public int ShowDateId { get; set; }
    public int TicketCount { get; set; }
}
