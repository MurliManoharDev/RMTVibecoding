# RMT Flask Application

A Flask-based web application for managing Resource Management Team (RMT) requests with SQLite database support for both development and production environments on Azure App Service.

## Features

- **Request Management**: Add, Transfer, and Terminate requests
- **Status Tracking**: Track requests through different statuses (pending, approved, rejected, completed)
- **Priority Levels**: Low, Medium, High priority assignment
- **Audit Logging**: Complete audit trail of all actions
- **Reports**: Generate reports and view requests by type and status
- **SQLite Database**: Persistent database storage in both dev and production

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/MurliManoharDev/RMTVibecoding.git
   cd RMTVibecodingProject
   ```

2. **Set up Python environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   Open your browser to `http://localhost:5000`

## Azure Deployment

This application is configured for deployment to Azure App Service (Linux) with persistent SQLite storage.

### Deployment Methods

#### 1. Automated Deployment (Recommended)

**Windows PowerShell:**
```powershell
.\deploy-to-azure.ps1
```

**Linux/Mac:**
```bash
chmod +x deploy-to-azure.sh
./deploy-to-azure.sh
```

The deployment scripts automatically:
- Create all necessary Azure resources
- Set up persistent storage for SQLite
- Configure the Linux App Service
- Deploy your application
- Enable logging and HTTPS

#### 2. Manual Deployment

See `AZURE_DEPLOYMENT_GUIDE.md` for detailed manual deployment instructions.

### Key Features for Production

- **Persistent SQLite Storage**: Database persists across deployments using Azure Files
- **Automatic Backups**: Via Azure Storage redundancy
- **Performance Optimizations**: WAL mode enabled for better concurrency
- **Security**: HTTPS-only, encrypted storage, secure secret key management

## Project Structure

```
RMTVibecodingProject/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── db_utils.py              # Database management utilities
├── templates/               # HTML templates
│   ├── base.html
│   ├── dashboard.html
│   ├── add_request.html
│   └── ...
├── static/                  # Static files (CSS, JS)
│   ├── css/
│   └── js/
├── deploy-to-azure.ps1      # Windows deployment script
├── deploy-to-azure.sh       # Linux/Mac deployment script
├── AZURE_DEPLOYMENT_GUIDE.md # Manual deployment guide
└── SQLITE_AZURE_GUIDE.md    # SQLite configuration guide
```

## Database Management

### Local Development

The SQLite database (`rmt_database.db`) is created automatically on first run.

### Production (Azure)

The database is stored at `/home/data/rmt_database.db` on persistent Azure Files storage.

### Database Utilities

Use the included `db_utils.py` script for database management:

```bash
# Create backup
python db_utils.py backup

# Show database info
python db_utils.py info

# Check integrity
python db_utils.py check

# Optimize database
python db_utils.py vacuum

# Restore from backup
python db_utils.py restore --file backups/rmt_database_backup_20240101_120000.db
```

## API Endpoints

- `GET /` - Dashboard
- `GET /add-request` - Add request form
- `GET /transfer-request` - Transfer request form
- `GET /terminate-request` - Terminate request form
- `GET /view-all-requests` - View all requests
- `GET /view-add-requests` - View add requests
- `GET /view-transfer-requests` - View transfer requests
- `GET /view-terminate-requests` - View terminate requests
- `GET /view-by-status` - View requests by status
- `GET /reports` - Reports page
- `POST /api/submit-request` - Submit new request (JSON)
- `PUT /api/requests/<id>/update-status` - Update request status (JSON)

## Environment Variables

- `SECRET_KEY` - Flask secret key (auto-generated in production)
- `DATABASE_PATH` - Database file path (auto-configured for Azure)
- `WEBSITE_HOSTNAME` - Azure-specific, used to detect production environment

## Database Schema

### requests
- `id` - Primary key
- `type` - Request type (add/transfer/terminate)
- `title` - Request title
- `description` - Request description
- `status` - Current status
- `created_date` - Creation timestamp
- `updated_date` - Last update timestamp
- `created_by` - Creator username
- `assigned_to` - Assigned user
- `priority` - Priority level
- `comments` - Additional comments

### users
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `role` - User role (admin/manager/user)
- `created_date` - Creation timestamp

### audit_log
- `id` - Primary key
- `request_id` - Related request ID
- `action` - Action performed
- `performed_by` - User who performed action
- `timestamp` - Action timestamp
- `details` - Additional details

## Troubleshooting

### Azure Deployment Issues

1. **Check logs:**
   ```bash
   az webapp log tail --resource-group RMTResourceGroup --name your-app-name
   ```

2. **SSH into container:**
   ```bash
   az webapp ssh --resource-group RMTResourceGroup --name your-app-name
   ```

3. **Verify database mount:**
   ```bash
   ls -la /home/data/
   ```

### Database Issues

1. **Database locked:** Enable WAL mode (already configured in app.py)
2. **Permission errors:** Check Azure Files mount configuration
3. **Data loss:** Ensure Azure Files storage is properly mounted

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the deployment guides (`AZURE_DEPLOYMENT_GUIDE.md`, `SQLITE_AZURE_GUIDE.md`)
2. Review troubleshooting sections
3. Create an issue on GitHub 