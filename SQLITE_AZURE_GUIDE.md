# SQLite Configuration Guide for Azure App Service (Linux)

## Overview
This guide explains how to use SQLite in both development and production environments with Azure App Service for Linux. The key challenge is that Azure containers are ephemeral - files are lost on restart or redeploy. We solve this by mounting Azure Files storage.

## Architecture

```
Azure App Service (Linux Container)
│
├── /home/site/wwwroot/     ← Your application code (ephemeral)
│   ├── app.py
│   ├── templates/
│   └── static/
│
└── /home/data/             ← Azure Files mount (persistent)
    └── rmt_database.db     ← Your SQLite database
```

## How It Works

1. **Development Environment**
   - SQLite database stored locally as `rmt_database.db`
   - Direct file access, no special configuration needed

2. **Production Environment (Azure)**
   - Azure Files storage account created and mounted at `/home/data/`
   - SQLite database stored at `/home/data/rmt_database.db`
   - Data persists across deployments and container restarts
   - Automatic backup via Azure Storage redundancy

## Deployment Process

The deployment scripts (`deploy-to-azure.ps1` or `deploy-to-azure.sh`) automatically:

1. Create an Azure Storage Account
2. Create a File Share named "data"
3. Mount the File Share to your Web App at `/home/data/`
4. Configure the app to use `/home/data/rmt_database.db` as the database path

## Database Management

### Accessing Your Database

1. **Via SSH**:
   ```bash
   # SSH into your container
   az webapp ssh --resource-group RMTResourceGroup --name your-app-name
   
   # Navigate to database directory
   cd /home/data
   
   # Use SQLite CLI
   sqlite3 rmt_database.db
   ```

2. **Download Database Locally**:
   ```bash
   # Get storage account details
   STORAGE_ACCOUNT=$(az webapp config storage-account list --resource-group RMTResourceGroup --name your-app-name --query '[0].accountName' -o tsv)
   
   # Download the database
   az storage file download --account-name $STORAGE_ACCOUNT --share-name data --path rmt_database.db --dest ./backup_database.db
   ```

3. **Upload Database**:
   ```bash
   # Upload a local database to Azure
   az storage file upload --account-name $STORAGE_ACCOUNT --share-name data --source ./local_database.db --path rmt_database.db
   ```

### Backup Strategy

1. **Automatic Backups** (via Azure Storage):
   - Azure Storage provides built-in redundancy
   - Configure storage account backup if needed

2. **Manual Backups**:
   ```bash
   # Create a backup script
   DATE=$(date +%Y%m%d_%H%M%S)
   az storage file download --account-name $STORAGE_ACCOUNT --share-name data --path rmt_database.db --dest "./backups/rmt_database_$DATE.db"
   ```

## Performance Considerations

### SQLite on Azure Files
- **Latency**: Network storage has higher latency than local disk
- **Concurrency**: SQLite's file locking works over SMB/Azure Files
- **Good for**: Low to medium traffic applications
- **Not ideal for**: High-concurrency scenarios

### Performance Tips
1. Use connection pooling in your app
2. Enable WAL mode for better concurrency:
   ```python
   conn = sqlite3.connect(DATABASE)
   conn.execute('PRAGMA journal_mode=WAL')
   ```
3. Consider caching frequently accessed data

## Monitoring

### Check Database Size
```bash
az storage file show --account-name $STORAGE_ACCOUNT --share-name data --path rmt_database.db --query contentLength
```

### Monitor Storage Usage
```bash
az storage share show --account-name $STORAGE_ACCOUNT --name data --query usage
```

## Troubleshooting

### Database Locked Errors
- Usually caused by long-running transactions
- Enable WAL mode (see Performance Tips)
- Ensure proper connection closing

### Permission Issues
- The app runs as non-root user
- Azure Files mount handles permissions automatically
- If issues persist, check mount configuration

### Database Not Found
1. Verify mount is active:
   ```bash
   az webapp config storage-account list --resource-group RMTResourceGroup --name your-app-name
   ```
2. Check if database exists:
   ```bash
   # SSH into container
   ls -la /home/data/
   ```

## Migration Path

If you outgrow SQLite, consider:
1. **Azure Database for PostgreSQL** - Minimal code changes
2. **Azure SQL Database** - Enterprise features
3. **Cosmos DB** - Global distribution

Migration steps:
1. Export SQLite data
2. Transform schema if needed
3. Import to new database
4. Update connection string

## Cost Optimization

- Storage Account (Standard_LRS): ~$0.05/GB/month
- File Share: Minimal cost for small databases
- No additional database licensing costs

## Security Best Practices

1. **Encryption**: Azure Storage encrypts data at rest
2. **Access Control**: Use managed identities when possible
3. **Connection String**: Store in App Settings, not code
4. **Backups**: Regular backups to separate storage

## Example Code

```python
# app.py configuration
import os
import sqlite3

# Detect environment
if 'WEBSITE_HOSTNAME' in os.environ:
    # Production - use mounted storage
    DATABASE = '/home/data/rmt_database.db'
else:
    # Development - use local file
    DATABASE = 'rmt_database.db'

# Connection with best practices
def get_db_connection():
    conn = sqlite3.connect(DATABASE, timeout=30)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA journal_mode=WAL')  # Better concurrency
    conn.execute('PRAGMA synchronous=NORMAL')  # Better performance
    return conn
```

## Summary

Using SQLite with Azure App Service is viable for many applications when configured correctly. The mounted Azure Files storage provides persistence, while SQLite's simplicity keeps deployment and maintenance straightforward. Monitor your usage and be ready to migrate if your needs grow beyond SQLite's capabilities. 