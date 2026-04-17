using Domain.Project.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Domain.Project.Mappings;

public class CourtMapping : IEntityTypeConfiguration<Court>
{
    public void Configure(EntityTypeBuilder<Court> builder)
    {
        builder.ToTable("Courts", "booking");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasDefaultValueSql("NEWSEQUENTIALID()");

        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Type).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Region).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Capacity).IsRequired().HasDefaultValue(10);

        builder.Property(x => x.OpeningTime).IsRequired();
        builder.Property(x => x.ClosingTime).IsRequired();
        builder.Property(x => x.SlotDuration).IsRequired().HasDefaultValue(60);
        builder.Property(x => x.CancellationDeadlineHours).IsRequired().HasDefaultValue(1);
        builder.Property(x => x.ImageUrl).HasMaxLength(500);

        builder.Property(x => x.IsActive).IsRequired().HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");

        // Relacionamento com Admin (User)
        builder.HasOne(x => x.Admin)
               .WithMany(u => u.CreatedCourts)
               .HasForeignKey(x => x.CreatedBy)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
