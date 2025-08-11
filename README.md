# Aura RMT (Request Management Tool)

A modern web-based Request Management Tool built with Flask and SQLite. This application provides a comprehensive dashboard for managing add, transfer, and terminate requests with a beautiful, responsive interface.

## Features

### 🎯 Core Functionality
- **Dashboard**: Clean, intuitive dashboard with quick access to all features
- **Request Management**: Create, view, and manage three types of requests:
  - Add Requests
  - Transfer Requests  
  - Terminate Requests
- **Status Tracking**: Track request status (Pending, Approved, Rejected, Completed)
- **Priority Management**: Set and manage request priorities (Low, Medium, High)
- **Search & Filter**: Advanced search and filtering capabilities
- **Reports**: Analytics and reporting functionality (expandable)

### 🎨 Design
- Modern dark theme matching the provided screenshot
- Responsive design for desktop and mobile
- Professional blue header with sidebar navigation
- Interactive buttons and smooth animations
- Clean, accessible user interface

### 🛠 Technical Features
- Flask backend with SQLite database
- RESTful API endpoints
- Real-time status updates
- Form validation and error handling
- Secure database operations
- Modular template system

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Quick Start

1. **Clone or download the project files**
   ```bash
   # If you have git:
   git clone <repository-url>
   cd RMTVibecodingProject
   
   # Or extract the downloaded files to RMTVibecodingProject folder
   ```

2. **Set up virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
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
   Open your web browser and go to: `http://localhost:5000`

### Alternative Startup (Windows)
You can also use the provided startup script:
```bash
run_app.bat
```

## Project Structure

```
RMTVibecodingProject/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── run_app.bat           # Windows startup script
├── rmt_database.db       # SQLite database (created automatically)
├── templates/            # HTML templates
│   ├── base.html         # Base template with navigation
│   ├── dashboard.html    # Main dashboard
│   ├── add_request.html  # Add request form
│   ├── transfer_request.html # Transfer request form
│   ├── terminate_request.html # Terminate request form
│   ├── view_all_requests.html # View all requests
│   ├── view_requests.html # Generic request viewer
│   ├── view_by_status.html # Status-based view
│   └── reports.html      # Reports and analytics
└── static/               # Static assets
    ├── css/
    │   └── styles.css    # Main stylesheet
    └── js/
        └── app.js        # JavaScript functionality
```

## Database Schema

The application uses SQLite with three main tables:

### Requests Table
- `id` - Primary key
- `type` - Request type (add, transfer, terminate)
- `title` - Request title
- `description` - Detailed description
- `status` - Current status (pending, approved, rejected, completed)
- `priority` - Priority level (low, medium, high)
- `created_by` - User who created the request
- `assigned_to` - User assigned to handle the request
- `created_date` - Creation timestamp
- `updated_date` - Last update timestamp
- `comments` - Additional comments

### Users Table (for future expansion)
- `id` - Primary key
- `username` - Unique username
- `email` - User email
- `role` - User role (admin, manager, user)
- `created_date` - Creation timestamp

### Audit Log Table
- `id` - Primary key
- `request_id` - Foreign key to requests
- `action` - Action performed
- `performed_by` - User who performed the action
- `timestamp` - Action timestamp
- `details` - Action details

## Usage Guide

### Creating Requests
1. Click on the appropriate request type button from the dashboard
2. Fill in the required information:
   - Title (required)
   - Description (required)
   - Priority level
   - Your name
3. Click "Submit Request"

### Viewing Requests
- **View All Requests**: See complete list with search and filter options
- **View by Type**: See specific request types (Add, Transfer, Terminate)
- **View by Status**: Organize requests by their current status

### Managing Requests
- Use the dropdown in the Actions column to change request status
- Search requests using the search bar
- Filter by status using the status dropdown
- Click on request details for more information

### Reports
- Access basic analytics from the Reports page
- View request statistics and trends
- Generate custom reports (feature planned for future updates)

## API Endpoints

### Request Management
- `POST /api/submit-request` - Submit a new request
- `PUT /api/requests/{id}/update-status` - Update request status

### Web Routes
- `GET /` - Dashboard
- `GET /add-request` - Add request form
- `GET /transfer-request` - Transfer request form
- `GET /terminate-request` - Terminate request form
- `GET /view-all-requests` - View all requests
- `GET /view-add-requests` - View add requests
- `GET /view-transfer-requests` - View transfer requests
- `GET /view-terminate-requests` - View terminate requests
- `GET /view-by-status` - View by status
- `GET /reports` - Reports page

## Customization

### Styling
- Edit `static/css/styles.css` to modify the appearance
- The design uses CSS custom properties for easy theme customization
- Responsive breakpoints are defined for mobile compatibility

### Functionality
- Add new request types by modifying the database schema and forms
- Extend the API by adding new routes in `app.py`
- Add new pages by creating templates and routes

### Database
- The SQLite database is automatically created on first run
- Add new fields by modifying the `init_database()` function
- Create database migrations for production deployments

## Future Enhancements

The application is designed to be easily expandable. Planned features include:

- User authentication and authorization
- Email notifications for status changes
- File attachments for requests
- Advanced reporting with charts
- Export functionality (PDF, Excel, CSV)
- Admin panel for user management
- API documentation with Swagger
- Docker containerization
- Database backup and restore

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `app.py`:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)  # Use different port
   ```

2. **Database not created**: Ensure you have write permissions in the project directory

3. **Templates not loading**: Verify the `templates/` folder exists with all HTML files

4. **Static files not loading**: Check that the `static/` folder contains `css/` and `js/` subdirectories

### Logs and Debugging
- Enable debug mode in `app.py` (already enabled by default)
- Check the console output for error messages
- Verify all dependencies are installed correctly

## Production Deployment

### Environment Setup
1. **Set environment variables**:
   ```bash
   export SECRET_KEY="your-production-secret-key"
   export FLASK_ENV="production"
   export DEBUG="False"
   ```

2. **Use a production WSGI server**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

3. **Database backup**:
   ```bash
   # Regular backup of SQLite database
   cp rmt_database.db rmt_database_backup_$(date +%Y%m%d_%H%M%S).db
   ```

### Security Considerations
- Change the default secret key
- Use HTTPS in production
- Implement user authentication (planned feature)
- Regular database backups
- Monitor application logs

## Support

For questions or issues:
1. Check this README for common solutions
2. Review the code comments for implementation details
3. Test individual components using the web interface

## License

This project is provided as-is for educational and business use. Feel free to modify and extend according to your needs.

---

**Aura RMT** - Professional Request Management Made Simple 