#!/bin/bash

# Azure Deployment Script for RMT Flask App (Linux)
# Make sure to run: chmod +x deploy-to-azure.sh

echo "Azure App Service Deployment Script for RMT Flask App"
echo "====================================================="

# Configuration - Update these values
APP_NAME="rmt-flask-app-$(date +%s)"  # Adds timestamp to ensure uniqueness
RESOURCE_GROUP="RMTResourceGroup"
LOCATION="eastus"
PLAN_NAME="RMTAppServicePlan"
STORAGE_ACCOUNT="rmtstorage$(date +%s | tr -d '\n')"  # Storage account name

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 completed successfully${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login to Azure
echo "Step 1: Logging into Azure..."
az login
check_status "Azure login"

# Create Resource Group
echo "Step 2: Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION
check_status "Resource Group creation"

# Create App Service Plan (Linux)
echo "Step 3: Creating Linux App Service Plan..."
az appservice plan create \
    --name $PLAN_NAME \
    --resource-group $RESOURCE_GROUP \
    --sku B1 \
    --is-linux
check_status "App Service Plan creation"

# Create Web App
echo "Step 4: Creating Web App..."
az webapp create \
    --resource-group $RESOURCE_GROUP \
    --plan $PLAN_NAME \
    --name $APP_NAME \
    --runtime "PYTHON:3.11"
check_status "Web App creation"

# Create Storage Account for SQLite persistence
echo "Step 5: Creating Storage Account for SQLite database..."
az storage account create \
    --name $STORAGE_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --kind StorageV2
check_status "Storage Account creation"

# Create File Share
echo "Step 6: Creating File Share..."
STORAGE_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query '[0].value' -o tsv)
az storage share create \
    --name data \
    --account-name $STORAGE_ACCOUNT \
    --account-key "$STORAGE_KEY" \
    --quota 1
check_status "File Share creation"

# Mount Storage to Web App
echo "Step 7: Mounting Storage to Web App..."
az webapp config storage-account add \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --custom-id data \
    --storage-type AzureFiles \
    --share-name data \
    --account-name $STORAGE_ACCOUNT \
    --access-key "$STORAGE_KEY" \
    --mount-path /home/data
check_status "Storage mounting"

# Generate secure secret key
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))' 2>/dev/null || openssl rand -hex 32)

# Configure App Settings
echo "Step 8: Configuring App Settings..."
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --settings \
        SECRET_KEY="$SECRET_KEY" \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        PYTHONPATH="/home/site/wwwroot" \
        DATABASE_PATH="/home/data/rmt_database.db"
check_status "App Settings configuration"

# Set startup command
echo "Step 9: Setting startup command..."
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 app:app"
check_status "Startup command configuration"

# Create deployment package
echo "Step 10: Creating deployment package..."
if [ -f "deploy.zip" ]; then
    rm deploy.zip
fi

# Check OS and use appropriate zip command
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    powershell -command "Compress-Archive -Path * -DestinationPath deploy.zip -Force"
else
    # Linux/Mac
    zip -r deploy.zip . -x "venv/*" "*.pyc" "__pycache__/*" ".git/*" "*.db" "deploy.zip"
fi
check_status "Deployment package creation"

# Deploy the application
echo "Step 11: Deploying application..."
az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --src deploy.zip
check_status "Application deployment"

# Enable logging
echo "Step 12: Enabling application logs..."
az webapp log config \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --application-logging filesystem \
    --level information \
    --web-server-logging filesystem
check_status "Logging configuration"

# Enable HTTPS only
echo "Step 13: Enabling HTTPS only..."
az webapp update \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --https-only true
check_status "HTTPS configuration"

# Get the URL
APP_URL="https://${APP_NAME}.azurewebsites.net"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your app is available at: $APP_URL"
echo "SQLite database is persisted at: /home/data/rmt_database.db"
echo ""
echo "Useful commands:"
echo "- View logs: az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo "- SSH into container: az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo "- Restart app: az webapp restart --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""
echo "Resource details saved to: deployment-info.txt"

# Save deployment information
cat > deployment-info.txt << EOF
Azure Deployment Information
============================
Date: $(date)
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
EOF

# Clean up
rm -f deploy.zip

echo ""
echo "Opening your app in the browser..."
# Open in default browser
if command -v xdg-open &> /dev/null; then
    xdg-open $APP_URL
elif command -v open &> /dev/null; then
    open $APP_URL
elif command -v start &> /dev/null; then
    start $APP_URL
fi 