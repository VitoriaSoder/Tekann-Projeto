-- 1. Garantir que a coluna ImageUrl existe
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('booking.Courts') AND name = 'ImageUrl')
BEGIN
    ALTER TABLE booking.Courts ADD ImageUrl NVARCHAR(500) NULL;
END
GO

-- 2. Limpar dados existentes (Mantendo apenas o Admin)
DELETE FROM booking.Bookings;
DELETE FROM booking.Courts;
DELETE FROM booking.Users WHERE Role != 'ADMIN';
GO

-- 3. Popular USERS
INSERT INTO booking.Users (Name, Email, PasswordHash, Role) VALUES
    ('Carlos Eduardo', 'carlos@exemplo.com',  '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Ana Beatriz',    'ana@exemplo.com',     '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Roberto Alves',  'roberto@exemplo.com', '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Fernanda Lima',  'fernanda@exemplo.com','$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Juliana Santos', 'juliana@exemplo.com', '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Marcos Oliveira','marcos@exemplo.com',  '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Clara Nunes',    'clara@exemplo.com',   '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Gustavo Rocha',  'gustavo@exemplo.com', '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Lucia Ferreira', 'lucia@exemplo.com',   '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER'),
    ('Bruno Souza',    'bruno@exemplo.com',    '$2a$11$qR7E8UfS4f5f5f5f5f5f5euR7E8UfS4f5f5f5f5f5f5e', 'USER');
GO

-- 4. Popular COURTS
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM booking.Users WHERE Role = 'ADMIN' ORDER BY CreatedAt ASC);

INSERT INTO booking.Courts (Name, Type, Region, Capacity, OpeningTime, ClosingTime, SlotDuration, CancellationDeadlineHours, ImageUrl, CreatedBy)
VALUES
    ('Grand Slam Padel', 'Padle', 'Zona Sul', 4, '06:00', '23:00', 60, 2, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8', @AdminId),
    ('Master Court Tennis', 'Tennis', 'Zona Norte', 4, '07:00', '22:00', 60, 1, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6', @AdminId),
    ('Praia Arena 1', 'Beach Tennis', 'Centro', 6, '08:00', '20:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3', @AdminId),
    ('Praia Arena 2', 'Beach Tennis', 'Centro', 4, '08:00', '20:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3', @AdminId),
    ('Vila Olímpica Futsal', 'Futsal', 'Zona Oeste', 12, '09:00', '23:00', 90, 4, 'https://images.unsplash.com/photo-1552667466-07770ae110d0', @AdminId),
    ('Basketball Pro', 'Basketball', 'Zona Leste', 10, '08:00', '21:00', 60, 2, 'https://images.unsplash.com/photo-1546519638-68e109498ffc', @AdminId),
    ('Vôlei de Areia Sul', 'Volleyball', 'Zona Sul', 8, '07:00', '19:00', 60, 1, 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1', @AdminId),
    ('Padel Premium Oeste', 'Padle', 'Zona Oeste', 4, '06:00', '23:00', 60, 2, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8', @AdminId),
    ('Centro Esportivo Norte', 'Futsal', 'Zona Norte', 14, '08:00', '22:00', 90, 2, 'https://images.unsplash.com/photo-1552667466-07770ae110d0', @AdminId),
    ('Beach Court Prime', 'Beach Tennis', 'Zona Sul', 4, '07:00', '21:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3', @AdminId),
    ('Tennis Club Leste', 'Tennis', 'Zona Leste', 4, '06:00', '22:00', 60, 1, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6', @AdminId),
    ('Arena Society Centro', 'Futsal', 'Centro', 14, '08:00', '23:30', 90, 2, 'https://images.unsplash.com/photo-1552667466-07770ae110d0', @AdminId),
    ('Vôlei Indoor Pro', 'Volleyball', 'Zona Oeste', 12, '08:00', '22:00', 60, 2, 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1', @AdminId),
    ('Basket Street Norte', 'Basketball', 'Zona Norte', 10, '07:00', '22:00', 60, 1, 'https://images.unsplash.com/photo-1546519638-68e109498ffc', @AdminId),
    ('Padel Station Leste', 'Padle', 'Zona Leste', 4, '07:00', '23:00', 60, 1, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8', @AdminId);
GO

-- 5. Popular BOOKINGS (50 reservas fictícias)
DECLARE @Counter INT = 1;
DECLARE @TotalUsers INT = (SELECT COUNT(*) FROM booking.Users);
DECLARE @TotalCourts INT = (SELECT COUNT(*) FROM booking.Courts);

WHILE @Counter <= 50
BEGIN
    DECLARE @RandomUserOffset INT = (ABS(CHECKSUM(NEWID())) % @TotalUsers);
    DECLARE @RandomCourtOffset INT = (ABS(CHECKSUM(NEWID())) % @TotalCourts);
    
    DECLARE @UserId  UNIQUEIDENTIFIER = (SELECT Id FROM booking.Users ORDER BY Id OFFSET @RandomUserOffset ROWS FETCH NEXT 1 ROWS ONLY);
    DECLARE @CourtId UNIQUEIDENTIFIER = (SELECT Id FROM booking.Courts ORDER BY Id OFFSET @RandomCourtOffset ROWS FETCH NEXT 1 ROWS ONLY);
    
    DECLARE @Name NVARCHAR(100) = (SELECT Name FROM booking.Users WHERE Id = @UserId);
    
    DECLARE @RandomDays INT = (ABS(CHECKSUM(NEWID())) % 22) - 15;
    DECLARE @BookingDate DATE = DATEADD(DAY, @RandomDays, CAST(GETUTCDATE() AS DATE));
    
    DECLARE @Open TIME, @Close TIME, @Duration INT;
    SELECT @Open = OpeningTime, @Close = ClosingTime, @Duration = SlotDuration FROM booking.Courts WHERE Id = @CourtId;
    
    DECLARE @OpenMin INT = DATEDIFF(MINUTE, '00:00', @Open);
    DECLARE @CloseMin INT = DATEDIFF(MINUTE, '00:00', @Close);
    DECLARE @AvailableRange INT = (@CloseMin - @OpenMin) - @Duration;
    
    IF @AvailableRange > 0
    BEGIN
        DECLARE @RandomStartMin INT = @OpenMin + ((ABS(CHECKSUM(NEWID())) % (@AvailableRange / @Duration + 1)) * @Duration);
        DECLARE @StartTime TIME = DATEADD(MINUTE, @RandomStartMin, '00:00');
        DECLARE @EndTime   TIME = DATEADD(MINUTE, @Duration, @StartTime);
        
        DECLARE @Status NVARCHAR(20) = CASE WHEN (ABS(CHECKSUM(NEWID())) % 10) = 0 THEN 'CANCELLED' ELSE 'ACTIVE' END;
        
        IF NOT EXISTS (
            SELECT 1 FROM booking.Bookings 
            WHERE CourtId = @CourtId AND Date = @BookingDate AND Status = 'ACTIVE'
            AND StartTime < @EndTime AND EndTime > @StartTime
        )
        BEGIN
            INSERT INTO booking.Bookings (CourtId, UserId, ClientName, NumberOfPeople, Date, StartTime, EndTime, Status)
            VALUES (@CourtId, @UserId, @Name, (ABS(CHECKSUM(NEWID())) % 4) + 1, @BookingDate, @StartTime, @EndTime, @Status);
            
            SET @Counter = @Counter + 1;
        END
    END
    ELSE
    BEGIN
        -- Fallback simples para evitar loop infinito se a quadra tiver horários inválidos
        SET @Counter = @Counter + 0; -- Apenas para manter a lógica
    END
END;
GO

-- 6. VERIFICAÇÃO FINAL
SELECT 'Users' AS Tabela, COUNT(*) AS Total FROM booking.Users;
SELECT 'Courts' AS Tabela, COUNT(*) AS Total FROM booking.Courts;
SELECT 'Bookings' AS Tabela, COUNT(*) AS Total FROM booking.Bookings;
GO
