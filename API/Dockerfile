FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar apenas os projetos necessários para a execução
COPY Gateway/WebAPI/WebAPI.csproj Gateway/WebAPI/
COPY Application/Application/Application.csproj Application/Application/
COPY Application/Application.Dto/Application.Dto.csproj Application/Application.Dto/
COPY Domain/Project/Project.csproj Domain/Project/
COPY Infra/Repositories/Repositories.csproj Infra/Repositories/
COPY Infra/SqlServer/SqlServer.csproj Infra/SqlServer/

# Restaurar apenas o projeto da WebAPI (ele buscará as dependências)
RUN dotnet restore Gateway/WebAPI/WebAPI.csproj

# Copiar o restante dos arquivos
COPY . .

# Publicar apenas a WebAPI
RUN dotnet publish Gateway/WebAPI/WebAPI.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "WebAPI.dll"]
