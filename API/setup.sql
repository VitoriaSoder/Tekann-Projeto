-- =============================================================
-- SportsCourt — Setup Script
-- Recria schema, tabelas, índices, trigger e seed data
-- =============================================================
-- SENHAS SEED: hashes BCrypt abaixo são placeholders.
-- Gere hashes reais via POST /api/auth/register ou substitua
-- com BCrypt.Net.BCrypt.HashPassword("suaSenha") no DbSeeder.
-- =============================================================

IF EXISTS (SELECT * FROM sys.schemas WHERE name = 'booking')
BEGIN
    DROP TABLE IF EXISTS booking.Bookings;
    DROP TABLE IF EXISTS booking.Courts;
    DROP TABLE IF EXISTS booking.Users;
END
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'booking')
    EXEC('CREATE SCHEMA booking');
GO

-- =============================================================
-- USERS
-- =============================================================
CREATE TABLE booking.Users (
    Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Name         NVARCHAR(100)    NOT NULL,
    Email        NVARCHAR(255)    NOT NULL,
    PasswordHash NVARCHAR(255)    NOT NULL,
    Role         NVARCHAR(10)     NOT NULL DEFAULT 'USER',
    IsActive     BIT              NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT PK_Users       PRIMARY KEY (Id),
    CONSTRAINT UQ_Users_Email UNIQUE      (Email),
    CONSTRAINT CK_Users_Role  CHECK       (Role IN ('ADMIN', 'USER'))
);
GO

-- =============================================================
-- COURTS
-- =============================================================
CREATE TABLE booking.Courts (
    Id                        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    Name                      NVARCHAR(100)    NOT NULL,
    Type                      NVARCHAR(50)     NOT NULL,
    Region                    NVARCHAR(100)    NOT NULL,
    Capacity                  INT              NOT NULL DEFAULT 10,
    OpeningTime               TIME             NOT NULL,
    ClosingTime               TIME             NOT NULL,
    SlotDuration              INT              NOT NULL DEFAULT 60,
    CancellationDeadlineHours INT              NOT NULL DEFAULT 1,
    ImageUrl                  NVARCHAR(500)    NULL,
    IsActive                  BIT              NOT NULL DEFAULT 1,
    CreatedAt                 DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy                 UNIQUEIDENTIFIER NOT NULL,

    CONSTRAINT PK_Courts              PRIMARY KEY (Id),
    CONSTRAINT FK_Courts_Users        FOREIGN KEY (CreatedBy) REFERENCES booking.Users(Id),
    CONSTRAINT CK_Courts_Hours        CHECK       (ClosingTime > OpeningTime),
    CONSTRAINT CK_Courts_SlotDuration CHECK       (SlotDuration > 0),
    CONSTRAINT CK_Courts_Capacity     CHECK       (Capacity > 0)
);
GO

-- =============================================================
-- BOOKINGS
-- =============================================================
CREATE TABLE booking.Bookings (
    Id             UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    CourtId        UNIQUEIDENTIFIER NOT NULL,
    UserId         UNIQUEIDENTIFIER NOT NULL,
    ClientName     NVARCHAR(100)    NOT NULL,
    NumberOfPeople INT              NOT NULL DEFAULT 1,
    Date           DATE             NOT NULL,
    StartTime      TIME             NOT NULL,
    EndTime        TIME             NOT NULL,
    Status         NVARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    CreatedAt      DATETIME2        NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt      DATETIME2        NULL,

    CONSTRAINT PK_Bookings        PRIMARY KEY (Id),
    CONSTRAINT FK_Bookings_Court  FOREIGN KEY (CourtId) REFERENCES booking.Courts(Id),
    CONSTRAINT FK_Bookings_User   FOREIGN KEY (UserId)  REFERENCES booking.Users(Id),
    CONSTRAINT CK_Bookings_Time   CHECK       (EndTime > StartTime),
    CONSTRAINT CK_Bookings_Status CHECK       (Status IN ('ACTIVE', 'CANCELLED')),
    CONSTRAINT CK_Bookings_People CHECK       (NumberOfPeople > 0)
);
GO

-- =============================================================
-- INDEXES
-- =============================================================
CREATE NONCLUSTERED INDEX IX_Bookings_Court_Date
    ON booking.Bookings (CourtId, Date, Status)
    INCLUDE (StartTime, EndTime, UserId, ClientName, NumberOfPeople);

CREATE NONCLUSTERED INDEX IX_Bookings_User
    ON booking.Bookings (UserId, Status)
    INCLUDE (CourtId, Date, StartTime, EndTime);

CREATE NONCLUSTERED INDEX IX_Courts_Type_Region
    ON booking.Courts (Type, Region, IsActive);

CREATE NONCLUSTERED INDEX IX_Users_Email
    ON booking.Users (Email)
    INCLUDE (PasswordHash, Role, IsActive);
GO

-- =============================================================
-- CONFLICT CHECK TRIGGER
-- Garante que não existam dois bookings ACTIVE com sobreposição
-- de horário na mesma quadra/data no nível do banco de dados.
-- =============================================================
CREATE OR ALTER TRIGGER booking.TR_Bookings_NoTimeConflict
ON booking.Bookings
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM   booking.Bookings b
        INNER JOIN inserted i ON  b.CourtId = i.CourtId
                              AND b.Date    = i.Date
                              AND b.Id     != i.Id
                              AND b.Status  = 'ACTIVE'
                              AND i.Status  = 'ACTIVE'
        WHERE  i.StartTime < b.EndTime
          AND  i.EndTime   > b.StartTime
    )
    BEGIN
        RAISERROR('Conflito de horário: já existe uma reserva ativa neste período.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- =============================================================
-- SEED — USERS
-- Substitua os PasswordHash por BCrypt reais antes de usar em produção.
-- Hash placeholder abaixo NÃO funcionará para autenticação.
-- Use POST /api/auth/register para criar usuários com hashes reais.
-- =============================================================
INSERT INTO booking.Users (Name, Email, PasswordHash, Role) VALUES
    ('Admin Sistema', 'admin@sportscourt.com', '$HASH_PLACEHOLDER$', 'ADMIN'),
    ('João Silva',    'joao@email.com',      '$HASH_PLACEHOLDER$', 'USER'),
    ('Maria Costa',  'maria@email.com',      '$HASH_PLACEHOLDER$', 'USER'),
    ('Pedro Lima',   'pedro@email.com',      '$HASH_PLACEHOLDER$', 'USER');
GO

-- =============================================================
-- SEED — COURTS
-- 10 quadras com tipos e regiões variados + imagens
-- =============================================================
DECLARE @AdminId UNIQUEIDENTIFIER = (SELECT Id FROM booking.Users WHERE Email = 'admin@sportscourt.com');

INSERT INTO booking.Courts (Name, Type, Region, Capacity, OpeningTime, ClosingTime, SlotDuration, CancellationDeadlineHours, ImageUrl, CreatedBy)
VALUES
    (
        'Arena Padel Centro',
        'Padle',
        'Centro',
        4,
        '07:00', '23:00',
        60, 1,
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Padel Norte Premium',
        'Padle',
        'Norte',
        4,
        '08:00', '22:00',
        60, 2,
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Tênis Clube Sul',
        'Tennis',
        'Sul',
        4,
        '07:00', '21:00',
        60, 2,
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Court Tennis Centro',
        'Tennis',
        'Centro',
        4,
        '06:00', '22:00',
        60, 1,
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Beach Tennis Leste',
        'Beach Tennis',
        'Leste',
        4,
        '07:00', '20:00',
        60, 1,
        'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Beach Arena Oeste',
        'Beach Tennis',
        'Oeste',
        6,
        '07:00', '20:00',
        60, 1,
        'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Quadra Futsal Norte',
        'Futsal',
        'Norte',
        10,
        '08:00', '23:00',
        60, 1,
        'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Futsal Arena Sul',
        'Futsal',
        'Sul',
        10,
        '08:00', '22:00',
        90, 1,
        'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Basketball Centro',
        'Basketball',
        'Centro',
        10,
        '08:00', '21:00',
        60, 1,
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Vôlei Praia Leste',
        'Volleyball',
        'Leste',
        '8',
        '07:00', '20:00',
        60, 1,
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Arena Padel Oeste',
        'Padle',
        'Oeste',
        '4',
        '08:00', '22:00',
        60, 1,
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Tênis Prime Norte',
        'Tennis',
        'Norte',
        '4',
        '07:00', '23:00',
        60, 2,
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Beach Tennis Centro',
        'Beach Tennis',
        'Centro',
        '4',
        '08:00', '22:00',
        60, 1,
        'https://images.unsplash.com/photo-1529911600019-9b7f9f5cc1b3?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Society Sul Arena',
        'Futsal',
        'Sul',
        '12',
        '09:00', '23:00',
        90, 1,
        'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=400&fit=crop&q=80',
        @AdminId
    ),
    (
        'Basket Park Norte',
        'Basketball',
        'Norte',
        '10',
        '07:00', '22:00',
        60, 1,
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&q=80',
        @AdminId
    );
GO

-- =============================================================
-- SEED — BOOKINGS (exemplos para hoje e amanhã)
-- =============================================================
DECLARE @UserId1  UNIQUEIDENTIFIER = (SELECT Id FROM booking.Users  WHERE Email = 'joao@email.com');
DECLARE @UserId2  UNIQUEIDENTIFIER = (SELECT Id FROM booking.Users  WHERE Email = 'maria@email.com');
DECLARE @Court1   UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM booking.Courts WHERE Name = 'Arena Padel Centro');
DECLARE @Court3   UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM booking.Courts WHERE Name = 'Tênis Clube Sul');
DECLARE @Today    DATE             = CAST(GETUTCDATE() AS DATE);
DECLARE @Tomorrow DATE             = DATEADD(DAY, 1, CAST(GETUTCDATE() AS DATE));

INSERT INTO booking.Bookings (CourtId, UserId, ClientName, NumberOfPeople, Date, StartTime, EndTime)
VALUES
    (@Court1, @UserId1, 'João Silva',  2, @Today,    '09:00', '10:00'),
    (@Court1, @UserId2, 'Maria Costa', 4, @Today,    '11:00', '12:00'),
    (@Court3, @UserId1, 'João Silva',  2, @Today,    '08:00', '09:00'),
    (@Court1, @UserId1, 'João Silva',  4, @Tomorrow, '10:00', '11:00'),
    (@Court3, @UserId2, 'Maria Costa', 2, @Tomorrow, '09:00', '10:00'),
    (@Court1, @UserId2, 'Maria Costa', 2, @Today,    '14:00', '15:00'),
    (@Court3, @UserId1, 'João Silva',  4, @Today,    '16:00', '17:00');
GO

-- =============================================================
-- VERIFY
-- =============================================================
SELECT 'Users'    AS Tabela, COUNT(*) AS Total FROM booking.Users;
SELECT 'Courts'   AS Tabela, COUNT(*) AS Total FROM booking.Courts;
SELECT 'Bookings' AS Tabela, COUNT(*) AS Total FROM booking.Bookings;
GO
