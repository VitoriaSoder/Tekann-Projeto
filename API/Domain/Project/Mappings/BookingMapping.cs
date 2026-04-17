using Domain.Project.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Domain.Project.Constants;

namespace Domain.Project.Mappings;

public class BookingMapping : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> builder)
    {
        builder.ToTable("Bookings", "booking");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(x => x.ClientName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.NumberOfPeople).IsRequired().HasDefaultValue(1);
        builder.Property(x => x.Date).IsRequired();
        builder.Property(x => x.StartTime).IsRequired();
        builder.Property(x => x.EndTime).IsRequired();
        builder.Property(x => x.Status).IsRequired().HasMaxLength(20).HasDefaultValue(BookingStatusConstants.Active);
        builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

        // Relacionamento com Court
        builder.HasOne(x => x.Court)
               .WithMany(c => c.Bookings)
               .HasForeignKey(x => x.CourtId)
               .OnDelete(DeleteBehavior.Restrict);

        // Relacionamento com User
        builder.HasOne(x => x.User)
               .WithMany(u => u.Bookings)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
