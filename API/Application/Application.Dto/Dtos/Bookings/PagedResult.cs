namespace Application.Dto.Dtos.Bookings;

public class PagedResult<T>
{
    public IEnumerable<T> Data { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
}
