# Azure App Service Deployment Guide for RMT Flask App (Linux)

## Prerequisites
1. Azure Account with active subscription
2. Azure CLI installed locally (or use Azure Cloud Shell)
3. Git repository (optional but recommended)

## Deployment Steps

### 1. Login to Azure CLI
```bash
az login
```

### 2. Create Resource Group (if not exists)
```bash
az group create --name RMTResourceGroup --location "East US"
```

### 3. Create Linux App Service Plan
```bash
az appservice plan create --name RMTAppServicePlan --resource-group RMTResourceGroup --sku B1 --is-linux
```

### 4. Create Web App for Linux
```bash
az webapp create --resource-group RMTResourceGroup --plan RMTAppServicePlan --name rmt-flask-app --runtime "PYTHON:3.11" --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 app:app"
```
Note: Replace `rmt-flask-app` with a unique name as it will be part of your URL

### 5. Configure App Settings
```bash
# Set secret key for production
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings SECRET_KEY="your-secure-secret-key-here"

# Set Python path
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings PYTHONPATH="/home/site/wwwroot"

# Optional: Set custom database path
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings DATABASE_PATH="/home/site/wwwroot/rmt_database.db"

# Enable build automation
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### 6. Deploy using ZIP deployment

#### Option A: Using Azure CLI (Recommended)
```bash
# First, create a ZIP file of your project (excluding venv)
# On Windows PowerShell:
Compress-Archive -Path * -DestinationPath deploy.zip -Force -CompressionLevel Optimal

# On Linux/Mac:
# zip -r deploy.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.db"

# Deploy the ZIP file
az webapp deployment source config-zip --resource-group RMTResourceGroup --name rmt-flask-app --src deploy.zip
```

#### Option B: Using Git deployment
```bash
# Configure deployment credentials
az webapp deployment user set --user-name <username> --password <password>

# Get deployment URL
az webapp deployment source config-local-git --name rmt-flask-app --resource-group RMTResourceGroup

# Add Azure remote to your git repository
git remote add azure <deployment-url-from-previous-command>

# Push to Azure
git push azure main
```

#### Option C: Deploy from GitHub
```bash
# Configure GitHub deployment
az webapp deployment source config --name rmt-flask-app --resource-group RMTResourceGroup --repo-url https://github.com/MurliManoharDev/RMTVibecoding.git --branch main
```

### 7. Enable Application Logs
```bash
az webapp log config --resource-group RMTResourceGroup --name rmt-flask-app --application-logging filesystem --level information --web-server-logging filesystem
```

### 8. View logs in real-time
```bash
az webapp log tail --resource-group RMTResourceGroup --name rmt-flask-app
```

### 9. SSH into the container (for debugging)
```bash
az webapp ssh --resource-group RMTResourceGroup --name rmt-flask-app
```

## Post-Deployment Configuration

### 1. Initialize Database
Since SQLite database won't persist across deployments in Linux containers, consider:
- Using Azure Database for PostgreSQL (recommended for production)
- Using Azure SQL Database
- Mounting Azure Files for persistent storage

To mount Azure Files for SQLite persistence:
```bash
# Create storage account
az storage account create --name rmtstorage --resource-group RMTResourceGroup --sku Standard_LRS

# Create file share
az storage share create --name data --account-name rmtstorage

# Get storage key
STORAGE_KEY=$(az storage account keys list --resource-group RMTResourceGroup --account-name rmtstorage --query '[0].value' -o tsv)

# Mount storage to web app
az webapp config storage-account add --resource-group RMTResourceGroup --name rmt-flask-app --custom-id data --storage-type AzureFiles --share-name data --account-name rmtstorage --access-key $STORAGE_KEY --mount-path /home/data

# Update DATABASE_PATH to use mounted storage
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings DATABASE_PATH="/home/data/rmt_database.db"
```

### 2. Custom Domain (Optional)
```bash
az webapp config hostname add --webapp-name rmt-flask-app --resource-group RMTResourceGroup --hostname www.yourdomain.com
```

### 3. Enable HTTPS Only
```bash
az webapp update --resource-group RMTResourceGroup --name rmt-flask-app --https-only true
```

### 4. Configure Continuous Deployment (Optional)
```bash
az webapp deployment container config --enable-cd true --name rmt-flask-app --resource-group RMTResourceGroup
```

## Linux-Specific Notes

1. **File Permissions**: Linux App Service runs as non-root user. Ensure your app doesn't require root permissions.

2. **Path Differences**: 
   - App location: `/home/site/wwwroot/`
   - Temp files: `/tmp/`
   - Persistent storage (if mounted): `/home/`

3. **Startup Command**: The startup command is executed from `/home/site/wwwroot/`. You can also create a custom startup script.

4. **Python Virtual Environment**: Azure automatically creates and activates a virtual environment.

## Monitoring and Performance

### Enable Application Insights
```bash
# Create Application Insights
az monitor app-insights component create --app rmt-flask-insights --location "East US" --resource-group RMTResourceGroup

# Get the instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show --app rmt-flask-insights --resource-group RMTResourceGroup --query instrumentationKey -o tsv)

# Configure web app to use Application Insights
az webapp config appsettings set --resource-group RMTResourceGroup --name rmt-flask-app --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

## Troubleshooting

### Check deployment status
```bash
az webapp show --name rmt-flask-app --resource-group RMTResourceGroup --query state
```

### View deployment logs
```bash
az webapp log deployment show --name rmt-flask-app --resource-group RMTResourceGroup
```

### Download all logs
```bash
az webapp log download --resource-group RMTResourceGroup --name rmt-flask-app --log-file logs.zip
```

### Restart the app
```bash
az webapp restart --name rmt-flask-app --resource-group RMTResourceGroup
```

### Check container logs
```bash
az webapp log show --resource-group RMTResourceGroup --name rmt-flask-app
```

## Your App URL
Once deployed, your app will be available at:
```
https://rmt-flask-app.azurewebsites.net
```

Replace `rmt-flask-app` with your chosen app name.

## Quick Deploy Script

Save this as `deploy.sh` for quick deployment:
```bash
#!/bin/bash
APP_NAME="rmt-flask-app"
RESOURCE_GROUP="RMTResourceGroup"
LOCATION="East US"

# Create resources
az group create --name $RESOURCE_GROUP --location "$LOCATION"
az appservice plan create --name "${APP_NAME}-plan" --resource-group $RESOURCE_GROUP --sku B1 --is-linux
az webapp create --resource-group $RESOURCE_GROUP --plan "${APP_NAME}-plan" --name $APP_NAME --runtime "PYTHON:3.11"

# Configure
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings SECRET_KEY="$SECRET_KEY" SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Deploy
zip -r deploy.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.db"
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src deploy.zip

echo "Deployment complete! Visit: https://${APP_NAME}.azurewebsites.net"
``` 