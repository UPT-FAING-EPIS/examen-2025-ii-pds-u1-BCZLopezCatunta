# Guía de Despliegue - Sistema de Exámenes en Línea

## 📋 Resumen del Proyecto

El Sistema de Exámenes en Línea es una aplicación web completa desarrollada con tecnologías modernas para la gestión y realización de exámenes académicos. El sistema incluye paneles para estudiantes y docentes, con funcionalidades avanzadas como temporizador automático, múltiples tipos de preguntas y análisis de resultados.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Frontend (React)**
   - React 18 con TypeScript
   - Material-UI para componentes
   - React Router para navegación
   - Axios para comunicación con API

2. **Backend (.NET Core)**
   - ASP.NET Core 9.0 Web API
   - Entity Framework Core
   - SQL Server como base de datos
   - Swagger para documentación API

3. **Infraestructura (Azure)**
   - Azure App Service para hosting
   - Azure SQL Database
   - Azure Storage Account
   - Terraform para infraestructura como código

4. **CI/CD (GitHub Actions)**
   - Despliegue automático
   - Análisis de calidad de código
   - Pruebas automatizadas
   - Generación de documentación

## 🚀 Guía de Despliegue Paso a Paso

### Prerrequisitos

#### Software Requerido
- **Azure CLI** (versión 2.0+)
- **Terraform** (versión 1.0+)
- **.NET 9.0 SDK**
- **Node.js** (versión 18+)
- **Git** para clonar el repositorio

#### Cuenta de Azure
- Suscripción de Azure activa
- Permisos de administrador o colaborador
- Límites de recursos suficientes

### Paso 1: Configuración del Entorno

#### 1.1 Clonar el Repositorio
```bash
git clone https://github.com/UPT-FAING-EPIS/examen-2025-ii-pds-u1-BCZLopezCatunta.git
cd examen-2025-ii-pds-u1-BCZLopezCatunta
```

#### 1.2 Configurar Azure CLI
```bash
# Instalar Azure CLI (si no está instalado)
# Windows: https://aka.ms/installazurecliwindows
# macOS: brew install azure-cli
# Linux: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Iniciar sesión en Azure
az login

# Configurar suscripción
az account set --subscription "tu-subscription-id"
```

#### 1.3 Configurar Terraform
```bash
# Verificar instalación de Terraform
terraform --version

# Si no está instalado, descargar desde: https://www.terraform.io/downloads.html
```

### Paso 2: Configuración de Variables

#### 2.1 Configurar Variables de Terraform
```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
```

#### 2.2 Editar terraform.tfvars
```hcl
# Configuración del entorno
environment = "dev"
location     = "East US"

# Configuración de la VM
vm_size        = "Standard_B2s"
admin_username = "azureuser"

# Generar SSH Key (si no tienes uno)
# ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"
ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... tu-email@ejemplo.com"

# Configuración de SQL Server
sql_admin_username = "sqladmin"
sql_admin_password = "TuPasswordSeguro123!"
```

#### 2.3 Configurar Secretos de GitHub
En el repositorio de GitHub, ir a Settings > Secrets and variables > Actions y agregar:

```
AZURE_CREDENTIALS: {
  "clientId": "tu-client-id",
  "clientSecret": "tu-client-secret",
  "subscriptionId": "tu-subscription-id",
  "tenantId": "tu-tenant-id"
}

AZURE_SUBSCRIPTION_ID: tu-subscription-id
AZURE_RESOURCE_GROUP: rg-exam-system-dev
AZURE_BACKEND_APP_NAME: app-exam-backend-dev
AZURE_FRONTEND_APP_NAME: app-exam-frontend-dev
CONNECTION_STRING: Server=tu-sql-server.database.windows.net;Database=tu-database;User Id=sqladmin;Password=TuPasswordSeguro123!;TrustServerCertificate=true;
```

### Paso 3: Despliegue de Infraestructura

#### 3.1 Inicializar Terraform
```bash
cd infrastructure
terraform init
```

#### 3.2 Planificar el Despliegue
```bash
terraform plan
```

#### 3.3 Aplicar la Configuración
```bash
terraform apply
```

#### 3.4 Verificar Despliegue
```bash
terraform output
```

### Paso 4: Configuración de Aplicaciones

#### 4.1 Configurar Backend
```bash
# Obtener información de la base de datos
az sql server show --resource-group rg-exam-system-dev --name sql-exam-system-dev

# Configurar cadena de conexión
az webapp config connection-string set \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=sql-exam-system-dev.database.windows.net;Database=sqldb-exam-system-dev;User Id=sqladmin;Password=TuPasswordSeguro123!;TrustServerCertificate=true;"
```

#### 4.2 Configurar Frontend
```bash
# Configurar URL de la API
az webapp config appsettings set \
  --resource-group rg-exam-system-dev \
  --name app-exam-frontend-dev \
  --settings REACT_APP_API_URL="https://app-exam-backend-dev.azurewebsites.net/api"
```

### Paso 5: Despliegue de Aplicaciones

#### 5.1 Despliegue Automático (Recomendado)
El despliegue automático se ejecuta mediante GitHub Actions cuando se hace push a la rama main:

```bash
# Hacer push de los cambios
git add .
git commit -m "Initial deployment"
git push origin main
```

#### 5.2 Despliegue Manual

##### Backend
```bash
cd backend/ExamSystem.API

# Restaurar dependencias
dotnet restore

# Compilar aplicación
dotnet build --configuration Release

# Publicar aplicación
dotnet publish -c Release -o ./publish --self-contained false

# Crear paquete de despliegue
zip -r backend-deployment.zip ./publish/*

# Desplegar a Azure App Service
az webapp deployment source config-zip \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --src backend-deployment.zip
```

##### Frontend
```bash
cd frontend/exam-system-frontend

# Instalar dependencias
npm install

# Compilar aplicación
npm run build

# Crear paquete de despliegue
zip -r frontend-deployment.zip ./build/*

# Desplegar a Azure App Service
az webapp deployment source config-zip \
  --resource-group rg-exam-system-dev \
  --name app-exam-frontend-dev \
  --src frontend-deployment.zip
```

### Paso 6: Configuración de Base de Datos

#### 6.1 Ejecutar Migraciones
```bash
# Conectar a la aplicación
az webapp ssh --resource-group rg-exam-system-dev --name app-exam-backend-dev

# Ejecutar migraciones
cd /home/site/wwwroot
dotnet ef database update
```

#### 6.2 Verificar Base de Datos
```bash
# Verificar conexión
az sql db show \
  --resource-group rg-exam-system-dev \
  --server sql-exam-system-dev \
  --name sqldb-exam-system-dev
```

### Paso 7: Verificación del Despliegue

#### 7.1 Verificar Backend
```bash
# Verificar estado de la aplicación
curl https://app-exam-backend-dev.azurewebsites.net/health

# Verificar documentación API
# Abrir en navegador: https://app-exam-backend-dev.azurewebsites.net/swagger
```

#### 7.2 Verificar Frontend
```bash
# Verificar estado de la aplicación
curl https://app-exam-frontend-dev.azurewebsites.net

# Abrir en navegador: https://app-exam-frontend-dev.azurewebsites.net
```

#### 7.3 Verificar Base de Datos
```bash
# Conectar a SQL Server
sqlcmd -S sql-exam-system-dev.database.windows.net -U sqladmin -P TuPasswordSeguro123! -d sqldb-exam-system-dev

# Verificar tablas
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
```

## 🔧 Configuración Avanzada

### Configuración de CORS
```bash
# Configurar CORS para el backend
az webapp config cors add \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --allowed-origins "https://app-exam-frontend-dev.azurewebsites.net"
```

### Configuración de SSL
```bash
# Configurar SSL para el dominio personalizado (si aplica)
az webapp config ssl bind \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --certificate-thumbprint "tu-certificate-thumbprint"
```

### Configuración de Monitoreo
```bash
# Habilitar Application Insights
az monitor app-insights component create \
  --resource-group rg-exam-system-dev \
  --app exam-system-insights \
  --location eastus

# Configurar alertas
az monitor metrics alert create \
  --resource-group rg-exam-system-dev \
  --name "High CPU Usage" \
  --condition "avg Percentage CPU > 80" \
  --target "app-exam-backend-dev"
```

## 🚨 Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión a Base de Datos
```bash
# Verificar firewall de SQL Server
az sql server firewall-rule create \
  --resource-group rg-exam-system-dev \
  --server sql-exam-system-dev \
  --name "Allow Azure Services" \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### 2. Error de CORS
```bash
# Verificar configuración de CORS
az webapp config cors show \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev
```

#### 3. Error de Despliegue
```bash
# Verificar logs de despliegue
az webapp log tail \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev
```

### Comandos de Diagnóstico

#### Verificar Estado de Recursos
```bash
# Verificar estado de App Service
az webapp show --resource-group rg-exam-system-dev --name app-exam-backend-dev

# Verificar estado de SQL Server
az sql server show --resource-group rg-exam-system-dev --name sql-exam-system-dev

# Verificar logs de aplicación
az webapp log tail --resource-group rg-exam-system-dev --name app-exam-backend-dev
```

#### Verificar Configuración
```bash
# Verificar configuración de la aplicación
az webapp config appsettings list \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev

# Verificar configuración de CORS
az webapp config cors show \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev
```

## 📊 Monitoreo y Mantenimiento

### Configuración de Alertas
```bash
# Crear alerta de disponibilidad
az monitor metrics alert create \
  --resource-group rg-exam-system-dev \
  --name "App Service Down" \
  --condition "avg Availability < 99" \
  --target "app-exam-backend-dev"
```

### Backup de Base de Datos
```bash
# Configurar backup automático
az sql db ltr-policy set \
  --resource-group rg-exam-system-dev \
  --server sql-exam-system-dev \
  --database sqldb-exam-system-dev \
  --weekly-retention "P4W" \
  --monthly-retention "P6M" \
  --yearly-retention "P1Y"
```

### Actualización de Aplicaciones
```bash
# Actualizar backend
cd backend/ExamSystem.API
dotnet publish -c Release -o ./publish
zip -r backend-update.zip ./publish/*
az webapp deployment source config-zip \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --src backend-update.zip

# Actualizar frontend
cd frontend/exam-system-frontend
npm run build
zip -r frontend-update.zip ./build/*
az webapp deployment source config-zip \
  --resource-group rg-exam-system-dev \
  --name app-exam-frontend-dev \
  --src frontend-update.zip
```

## 🔒 Seguridad

### Configuración de Seguridad
```bash
# Configurar HTTPS obligatorio
az webapp config set \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --https-only true

# Configurar firewall de SQL Server
az sql server firewall-rule create \
  --resource-group rg-exam-system-dev \
  --server sql-exam-system-dev \
  --name "Allow Specific IP" \
  --start-ip-address "tu-ip-publica" \
  --end-ip-address "tu-ip-publica"
```

### Rotación de Secretos
```bash
# Rotar contraseña de SQL Server
az sql server update \
  --resource-group rg-exam-system-dev \
  --name sql-exam-system-dev \
  --admin-password "NuevaPasswordSegura123!"

# Actualizar cadena de conexión
az webapp config connection-string set \
  --resource-group rg-exam-system-dev \
  --name app-exam-backend-dev \
  --connection-string-type SQLServer \
  --settings DefaultConnection="Server=sql-exam-system-dev.database.windows.net;Database=sqldb-exam-system-dev;User Id=sqladmin;Password=NuevaPasswordSegura123!;TrustServerCertificate=true;"
```

## 📈 Escalabilidad

### Escalado Horizontal
```bash
# Configurar auto-scaling
az monitor autoscale create \
  --resource-group rg-exam-system-dev \
  --resource app-exam-backend-dev \
  --resource-type Microsoft.Web/sites \
  --name "exam-system-autoscale" \
  --min-count 1 \
  --max-count 10 \
  --count 2
```

### Escalado Vertical
```bash
# Actualizar plan de App Service
az appservice plan update \
  --resource-group rg-exam-system-dev \
  --name asp-exam-system-dev \
  --sku S1
```

## 🧹 Limpieza

### Eliminar Recursos
```bash
# Eliminar toda la infraestructura
cd infrastructure
terraform destroy

# Eliminar recursos específicos
az group delete --name rg-exam-system-dev --yes
```

## 📞 Soporte

### Recursos de Ayuda
- **Documentación de Azure**: https://docs.microsoft.com/azure/
- **Documentación de Terraform**: https://www.terraform.io/docs/
- **Documentación de .NET**: https://docs.microsoft.com/dotnet/
- **Documentación de React**: https://reactjs.org/docs/

### Contacto
- **GitHub Issues**: Para reportar bugs y solicitar features
- **Documentación**: Guías completas en el repositorio
- **Comunidad**: Foros de desarrolladores y Stack Overflow

---

**Última actualización**: $(date)
**Versión**: 1.0.0
**Autor**: Sistema de Exámenes en Línea Team
