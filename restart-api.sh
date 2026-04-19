#!/bin/bash
cd /home/vitoria-soder/Documentos/tekann/API
sudo snap run docker build -t tekann-api .
cd /home/vitoria-soder/Documentos/tekann
sudo snap run docker stop tekann-api-prod
sudo snap run docker rm tekann-api-prod
sudo snap run docker run -d \
  --name tekann-api-prod \
  --network host \
  --restart unless-stopped \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e "ConnectionStrings__DefaultConnection=Server=localhost;Database=TekannDb;User Id=sa;Password=mssql_BsTici;TrustServerCertificate=True;Encrypt=False;" \
  -e "Jwt__Secret=SportsCourt_JWT_SuperSecret_Key_2026_Pro!" \
  -e "Jwt__Issuer=tekann-api" \
  -e "Jwt__Audience=tekann-app" \
  -e "Jwt__ExpirationHours=24" \
  tekann-api
