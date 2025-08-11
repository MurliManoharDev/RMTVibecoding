# Azure Deployment Script for RMT Flask App (Linux)
# Run this script in PowerShell with: .\deploy-to-azure.ps1

Write-Host "Azure App Service Deployment Script for RMT Flask App" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Configuration - Update these values
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$APP_NAME = "rmt-flask-app-$timestamp"  # Adds timestamp to ensure uniqueness
$RESOURCE_GROUP = "RMTResourceGroup"
$LOCATION = "eastus"
$PLAN_NAME = "RMTAppServicePlan"
$STORAGE_ACCOUNT = "rmtstorage$($timestamp -replace '\D', '')"  # Remove non-digits for storage account name

# Function to check if command succeeded
function Check-Status {
    param($Message)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $Message completed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ $Message failed" -ForegroundColor Red
        exit 1
    }
}

# Check if Azure CLI is installed
try {
    $azVersion = az --version
    Write-Host "Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "Azure CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
    exit 1
}

# Login to Azure
Write-Host "`nStep 1: Logging into Azure..." -ForegroundColor Yellow
az login
Check-Status "Azure login"

# Create Resource Group
Write-Host "`nStep 2: Creating Resource Group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION
Check-Status "Resource Group creation"

# Create App Service Plan (Linux)
Write-Host "`nStep 3: Creating Linux App Service Plan..." -ForegroundColor Yellow
az appservice plan create `
    --name $PLAN_NAME `
    --resource-group $RESOURCE_GROUP `
    --sku B1 `
    --is-linux
Check-Status "App Service Plan creation"

# Create Web App
Write-Host "`nStep 4: Creating Web App..." -ForegroundColor Yellow
az webapp create `
    --resource-group $RESOURCE_GROUP `
    --plan $PLAN_NAME `
    --name $APP_NAME `
    --runtime "PYTHON:3.11"
Check-Status "Web App creation"

# Create Storage Account for SQLite persistence
Write-Host "`nStep 5: Creating Storage Account for SQLite database..." -ForegroundColor Yellow
az storage account create `
    --name $STORAGE_ACCOUNT `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --sku Standard_LRS `
    --kind StorageV2
Check-Status "Storage Account creation"

# Create File Share
Write-Host "`nStep 6: Creating File Share..." -ForegroundColor Yellow
$STORAGE_KEY = $(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query '[0].value' -o tsv)
az storage share create `
    --name data `
    --account-name $STORAGE_ACCOUNT `
    --account-key $STORAGE_KEY `
    --quota 1
Check-Status "File Share creation"

# Mount Storage to Web App
Write-Host "`nStep 7: Mounting Storage to Web App..." -ForegroundColor Yellow
az webapp config storage-account add `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --custom-id data `
    --storage-type AzureFiles `
    --share-name data `
    --account-name $STORAGE_ACCOUNT `
    --access-key $STORAGE_KEY `
    --mount-path /home/data
Check-Status "Storage mounting"

# Generate secure secret key
try {
    $SECRET_KEY = python -c 'import secrets; print(secrets.token_hex(32))'
} catch {
    # Fallback to .NET if Python is not available
    Add-Type -AssemblyName System.Web
    $SECRET_KEY = [System.Web.Security.Membership]::GeneratePassword(64, 16)
}

# Configure App Settings
Write-Host "`nStep 8: Configuring App Settings..." -ForegroundColor Yellow
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --settings `
        SECRET_KEY="$SECRET_KEY" `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true `
        PYTHONPATH="/home/site/wwwroot" `
        DATABASE_PATH="/home/data/rmt_database.db"
Check-Status "App Settings configuration"

# Set startup command
Write-Host "`nStep 9: Setting startup command..." -ForegroundColor Yellow
az webapp config set `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 app:app"
Check-Status "Startup command configuration"

# Create deployment package
Write-Host "`nStep 10: Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "deploy.zip") {
    Remove-Item "deploy.zip"
}

# Create zip file excluding unnecessary files
Compress-Archive -Path * -DestinationPath deploy.zip -Force -CompressionLevel Optimal
Check-Status "Deployment package creation"

# Deploy the application
Write-Host "`nStep 11: Deploying application..." -ForegroundColor Yellow
az webapp deployment source config-zip `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --src deploy.zip
Check-Status "Application deployment"

# Enable logging
Write-Host "`nStep 12: Enabling application logs..." -ForegroundColor Yellow
az webapp log config `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --application-logging filesystem `
    --level information `
    --web-server-logging filesystem
Check-Status "Logging configuration"

# Enable HTTPS only
Write-Host "`nStep 13: Enabling HTTPS only..." -ForegroundColor Yellow
az webapp update `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --https-only true
Check-Status "HTTPS configuration"

# Get the URL
$APP_URL = "https://${APP_NAME}.azurewebsites.net"

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nYour app is available at: $APP_URL" -ForegroundColor Cyan
Write-Host "`nSQLite database is persisted at: /home/data/rmt_database.db" -ForegroundColor Green
Write-Host "`nUseful commands:" -ForegroundColor Yellow
Write-Host "- View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
Write-Host "- SSH into container: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME"
Write-Host "- Restart app: az webapp restart --resource-group $RESOURCE_GROUP --name $APP_NAME"
Write-Host "`nResource details saved to: deployment-info.txt" -ForegroundColor Green

# Save deployment information
@"
Azure Deployment Information
============================
Date: $(Get-Date)
App Name: $APP_NAME
Resource Group: $RESOURCE_GROUP
URL: $APP_URL
Storage Account: $STORAGE_ACCOUNT
Secret Key: $SECRET_KEY

SQLite Database Configuration:
- Database Path (in container): /home/data/rmt_database.db
- Storage Mount Path: /home/data
- File Share Name: data

Azure CLI Commands:
- View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME
- SSH into container: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME
- Restart app: az webapp restart --resource-group $RESOURCE_GROUP --name $APP_NAME
- Delete resources: az group delete --name $RESOURCE_GROUP --yes

To access your SQLite database via SSH:
1. SSH into container: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME
2. Navigate to database: cd /home/data
3. Use sqlite3: sqlite3 rmt_database.db
"@ | Out-File -FilePath "deployment-info.txt"

# Clean up
Remove-Item -Path "deploy.zip" -ErrorAction SilentlyContinue

# Open in default browser
Write-Host "`nOpening your app in the browser..." -ForegroundColor Cyan
Start-Process $APP_URL 