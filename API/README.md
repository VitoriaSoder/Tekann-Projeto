# Tekann API 🎾

Uma API robusta desenvolvida em **.NET 9** para o gerenciamento e agendamento de reservas em quadras esportivas. Este projeto foi construído com foco em boas práticas, arquitetura modular e alta cobertura de testes.

## 🚀 Tecnologias e Padrões Utilizados
- **.NET 9 (C#)**: Framework robusto e de alta performance.
- **Entity Framework Core (SQL Server)**: ORM para modelagem e acesso a dados.
- **xUnit, Moq & FluentAssertions**: Stack completa para os testes automatizados (Unitários e de Integração).
- **JWT (JSON Web Tokens)**: Autenticação e controle de acesso baseado em roles (RBAC).
- **BCrypt.Net**: Hashing e validação segura de senhas.
- **Swagger/OpenAPI**: Documentação interativa dos endpoints.

---

## 📁 Estrutura da Solução (N-Tier)

A arquitetura foi dividida para garantir a separação de responsabilidades (SoC) e facilitar a manutenção e os testes:

- `Gateway/WebAPI`: A porta de entrada da aplicação (Endpoints e Controllers).
- `Application`: Regras de negócio, interfaces de Serviços e DTOs.
- `Domain`: Entidades principais do domínio (Models).
- `Infra`: Repositórios (`Repository Pattern`), Contexto do EF Core e Mapeamentos/Migrations.
- `Tests`: Cobertura completa através de Testes Unitários e Testes de Integração E2E.

---

## ⚙️ Como rodar a aplicação (Desenvolvimento)

### Pré-requisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download) instalado.
- Banco de dados SQL Server (ou Docker instalado para subir o container).

### Configurando a Infraestrutura (Banco de Dados)
O projeto fornece um arquivo `docker-compose.yml` na raiz da API para facilitar o ambiente local:
```bash
# Na pasta principal (API):
docker-compose up -d
```

As tabelas (Migrations) serão criadas e aplicadas automaticamente assim que a API rodar a primeira vez (devido à injeção no `Program.cs`), ou você pode aplicar manualmente:
```bash
cd Infra/SqlServer
dotnet ef database update --startup-project ../../Gateway/WebAPI
```

### Inicializando a API
```bash
cd Gateway/WebAPI
dotnet run
```
A API iniciará. Você pode testar os endpoints acessando o **Swagger** no navegador (normalmente em `https://localhost:7198/swagger`).

---

## 🧪 Como rodar os Testes Automatizados

A aplicação possui uma bateria completa com **64 testes automatizados**, cobrindo desde unidades isoladas de negócio até requisições HTTP ponta a ponta.

Para executá-los, basta abrir o terminal na pasta principal (`API`) e rodar:
```bash
dotnet test API.sln
```

**Nota sobre a infraestrutura de testes:**
*Não é necessário ter um banco de dados rodando para executar os testes de integração.* A aplicação usa um `CustomWebApplicationFactory` que isola a injeção do SQL Server e sobe um banco **InMemory** efêmero a cada teste, garantindo execuções limpas e rápidas independentemente do ambiente.

---
