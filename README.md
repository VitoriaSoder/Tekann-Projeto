# 🏆 SportsCourt - Gestão de Quadras Esportivas

<div align="center">
  <a href="https://sportscourt.site/" target="_blank">
    <img src="https://img.shields.io/badge/VER_DEMO_AO_VIVO-Acesse_Agora-0078D4?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Ver Demo" />
  </a>
</div>

<br />

O **SportsCourt** é uma plataforma completa para gestão de quadras, agendamentos e reservas, focada em simplicidade e eficiência para gestores e jogadores.

![Preview do Projeto](./home_preview.png)

---

## 🚀 Tecnologias

### Backend
- **C# / .NET 9** (Web API)
- **SQL Server** (Persistência de Dados)
- **Entity Framework Core**
- **xUnit & FluentAssertions** (Testes Automatizados)
- **FluentValidation** (Validação de Dados)
- **JWT** (Autenticação e Autorização)
- **Docker** (Conteinerização)

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (Estilização)
- **Lucide React** (Ícones)
- **i18next** (Suporte Multi-idioma: PT/EN)
- **Framer Motion** (Animações)

---

## 📦 Como Rodar o Projeto

### 1. Clonando o Repositório
```bash
git clone https://github.com/VitoriaSoder/Tekann-Projeto.git
cd Tekann-Projeto
```

### 2. Rodando o Backend (API)
Navegue até a pasta da API:
```bash
cd API
```
**Pré-requisitos:** SDK do .NET 9 e SQL Server rodando.
```bash
# Restaurar dependências
dotnet restore

# Executar a aplicação
dotnet run --project Gateway/WebAPI/WebAPI.csproj
```
> A API estará disponível em: `http://localhost:5000`

### 3. Rodando o Frontend (React)
Navegue até a pasta do React:
```bash
cd React
```
**Pré-requisitos:** Node.js e Yarn/NPM.
```bash
# Instalar dependências
yarn install

# Iniciar o servidor de desenvolvimento
yarn dev
```
> O Frontend estará disponível em: `http://localhost:5173`

---

## 🧪 Testes

O projeto possui uma suíte completa de testes automatizados (Unidade e Integração).

Para rodar todos os testes do backend:
```bash
cd API
dotnet test
```

---

## 🐳 Rodando com Docker (Produção)

Para subir o ambiente completo (Banco + API + Frontend):
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins de teste técnico.
Desenvolvido por [Vitoria Eduarda Soder](https://github.com/VitoriaSoder).
