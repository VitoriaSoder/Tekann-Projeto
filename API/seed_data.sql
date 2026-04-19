-- =============================================================
-- SportsCourt — Seed Data
-- Popula admin de exemplo + 15 quadras disponíveis
-- =============================================================
-- SENHA DO ADMIN: Admin@2026!
-- Hash BCrypt (cost 11) gerado para essa senha.
-- Se o login não funcionar, registre o admin via POST /api/auth/register
-- com o mesmo e-mail e atualize o PasswordHash aqui.
-- =============================================================

-- 1. Garantir coluna ImageUrl
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('booking.Courts') AND name = 'ImageUrl')
BEGIN
    ALTER TABLE booking.Courts ADD ImageUrl NVARCHAR(500) NULL;
END
GO

-- 2. Limpar dados existentes
DELETE FROM booking.Bookings;
DELETE FROM booking.Courts;
DELETE FROM booking.Users;
GO

-- 3. Admin de exemplo
INSERT INTO booking.Users (Name, Email, PasswordHash, Role)
VALUES (
    'Admin SportsCourt',
    'admin@sportscourt.com',
    '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm',
    'ADMIN'
);
GO

-- 4. Usuários de exemplo
INSERT INTO booking.Users (Name, Email, PasswordHash, Role) VALUES
    ('João Silva',     'joao@exemplo.com',     '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm', 'USER'),
    ('Maria Costa',   'maria@exemplo.com',    '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm', 'USER'),
    ('Pedro Lima',    'pedro@exemplo.com',    '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm', 'USER'),
    ('Ana Beatriz',   'ana@exemplo.com',      '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm', 'USER'),
    ('Carlos Souza',  'carlos@exemplo.com',   '$2a$11$8K1p/a0dhrx3qL5nZxJCFuBQM6InSOzMkHvHG6gQnvZJPjHRbx8xm', 'USER');
GO

-- 5. Quadras (15 no total, tipos variados)
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT Id FROM booking.Users WHERE Email = 'admin@sportscourt.com');

INSERT INTO booking.Courts (Name, Type, Region, Capacity, OpeningTime, ClosingTime, SlotDuration, CancellationDeadlineHours, ImageUrl, CreatedBy)
VALUES
    ('Arena Padel Centro',      'Padle',        'Centro',     4,  '07:00', '23:00', 60, 1, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Padel Norte Premium',     'Padle',        'Norte',      4,  '08:00', '22:00', 60, 2, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Padel Premium Oeste',     'Padle',        'Oeste',      4,  '06:00', '23:00', 60, 2, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Tênis Clube Sul',         'Tennis',       'Sul',        4,  '07:00', '21:00', 60, 2, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Court Tennis Centro',     'Tennis',       'Centro',     4,  '06:00', '22:00', 60, 1, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Tennis Club Leste',       'Tennis',       'Leste',      4,  '07:00', '23:00', 60, 2, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Beach Tennis Leste',      'Beach Tennis', 'Leste',      4,  '07:00', '20:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Beach Arena Oeste',       'Beach Tennis', 'Oeste',      6,  '07:00', '20:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Beach Court Prime Sul',   'Beach Tennis', 'Sul',        4,  '07:00', '21:00', 60, 1, 'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Quadra Futsal Norte',     'Futsal',       'Norte',      10, '08:00', '23:00', 60, 1, 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Futsal Arena Sul',        'Futsal',       'Sul',        10, '08:00', '22:00', 90, 1, 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Arena Society Centro',    'Futsal',       'Centro',     12, '09:00', '23:00', 90, 2, 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Basketball Centro',       'Basketball',   'Centro',     10, '08:00', '21:00', 60, 1, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Basket Park Norte',       'Basketball',   'Norte',      10, '07:00', '22:00', 60, 1, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&q=80', @AdminId),
    ('Vôlei Praia Leste',       'Volleyball',   'Leste',      8,  '07:00', '20:00', 60, 1, 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop&q=80', @AdminId);
GO

-- 6. Verificação final
SELECT 'Users'    AS Tabela, COUNT(*) AS Total FROM booking.Users;
SELECT 'Courts'   AS Tabela, COUNT(*) AS Total FROM booking.Courts;
SELECT 'Bookings' AS Tabela, COUNT(*) AS Total FROM booking.Bookings;
GO
