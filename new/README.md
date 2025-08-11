# RMT New - Resource Management Tool

A modern, responsive web-based Resource Management Tool built with Flask and Tailwind CSS. This application provides a comprehensive single-page application for managing employee add, transfer, and terminate requests with a beautiful, modern interface.

## Features

### 🎯 Core Functionality
- **Single-Page Application**: Smooth navigation without page reloads
- **Employee Request Management**: Create, view, and manage three types of requests:
  - Add Employee Requests
  - Transfer Employee Requests  
  - Terminate Employee Requests
- **Real-time Status Updates**: Update request statuses dynamically
- **Advanced Search & Filtering**: Filter requests by type, status, and search terms
- **Detailed Form Handling**: Complex forms with various field types
- **Sample Data Population**: Quick form filling for testing purposes

### 🎨 Modern Design
- **Tailwind CSS**: Modern utility-first CSS framework
- **Light Theme**: Clean, professional light theme with sky blue accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and hover effects
- **Professional Layout**: Card-based design with proper spacing and typography

### 🛠 Technical Features
- **Flask Backend**: Robust Python web framework
- **SQLite Database**: Lightweight database with proper schema
- **RESTful API**: Clean API endpoints for data management
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling throughout
- **Sample Data**: Pre-populated sample data for demonstration

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Quick Start

1. **Navigate to the new directory**
   ```bash
   cd new/
   ```

2. **Set up virtual environment (recommended)**
   ```bash
   python -m venv venv_new
   
   # On Windows:
   venv_new\Scripts\activate
   
   # On macOS/Linux:
   source venv_new/bin/activate
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
   Open your web browser and go to: `http://localhost:5001`

### Alternative Startup (Windows)
You can also use the provided startup script:
```bash
run_rmt_new.bat
```

## Project Structure

```
new/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── README.md                # This file
├── run_rmt_new.bat          # Windows startup script
├── rmt_new_database.db      # SQLite database (created automatically)
├── templates/               # HTML templates
│   └── index.html           # Main single-page application template
└── static/                  # Static assets
    └── js/
        └── app.js           # Comprehensive JavaScript application
```

## Database Schema

The application uses SQLite with enhanced schema:

### Requests Table
- `id` - Text primary key (R001, R002, etc.)
- `type` - Request type (Add, Transfer, Terminate)
- `company` - Company name
- `status` - Current status (Pending, PMO Review, Approved, etc.)
- `user_name` - Employee name
- `start_date` - Start/effective date
- `location` - Employee location
- `racf_id` - RACF identifier
- `details` - JSON details
- `form_data` - Complete form data as JSON
- `created_date` - Creation timestamp
- `updated_date` - Last update timestamp

### Users Table (for future expansion)
- `id` - Primary key
- `username` - Unique username
- `email` - User email
- `role` - User role (admin, manager, user)
- `created_date` - Creation timestamp

## API Endpoints

### Request Management
- `GET /api/requests` - Get all requests
- `GET /api/requests/<type>` - Get requests by type (all, add, transfer, terminate)
- `POST /api/submit-request` - Submit a new request
- `PUT /api/requests/<id>/status` - Update request status

### Web Routes
- `GET /` - Main single-page application
- All other routes return the main page (SPA routing)

## Usage Guide

### Creating Requests
1. Click on the appropriate request type card from the home screen
2. Fill in the comprehensive form with all required information
3. Use "Fill Sample Data" button for quick testing
4. Submit the request

### Viewing Requests
- **View All Requests**: See complete list with search and filter options
- **View by Type**: See specific request types (Add, Transfer, Terminate)
- **Real-time Updates**: Status changes are reflected immediately

### Managing Requests
- Use the status dropdown to change request status
- Search requests using the search bar
- Expand rows to see detailed information
- Sort columns by clicking headers

### Sample Data
- Each form has a "Fill Sample Data" button
- Automatically populates realistic sample data
- Great for testing and demonstration purposes

## Key Features

### Form Field Types Supported
- **Text Input**: Standard text fields
- **Select Dropdown**: Single selection from options
- **Radio Buttons**: Single selection with visual options
- **Checkboxes**: Multiple selections
- **Checkbox Groups**: Complex grouped checkboxes
- **Date Picker**: Date selection with calendar
- **Textarea**: Multi-line text input
- **Number Input**: Numeric values
- **Phone Input**: Formatted phone numbers

### Request Types

#### Add Employee Request
- Employee personal information
- Company and project details
- Workspace and equipment requirements
- Role and skill assignments
- EPPIC integration details

#### Transfer Employee Request
- Current employee information
- Transfer details and effective date
- New assignment information
- Role/skill/rate changes
- EPPIC update requirements

#### Terminate Employee Request
- Employee information
- Termination details and reasons
- Equipment return procedures
- Workspace management
- EPPIC separation requirements

## Customization

### Styling
- Built with Tailwind CSS for easy customization
- Light theme with sky blue accent colors
- Responsive breakpoints for all device sizes
- Custom CSS for specific component styling

### Functionality
- Add new request types by extending form fields
- Customize status options and workflow
- Extend API endpoints for additional features
- Add new form field types as needed

### Database
- SQLite database created automatically
- Sample data populated on first run
- Easy to extend schema for new requirements
- JSON fields for flexible data storage

## Production Deployment

### Environment Setup
1. **Set environment variables**:
   ```bash
   export SECRET_KEY="your-production-secret-key"
   export FLASK_ENV="production"
   ```

2. **Use a production WSGI server**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   ```

3. **Database backup**:
   ```bash
   # Regular backup of SQLite database
   cp rmt_new_database.db rmt_new_backup_$(date +%Y%m%d_%H%M%S).db
   ```

## Differences from Original

This new version offers several improvements over the original:

### Design Changes
- **Light Theme**: Professional light theme instead of dark
- **Tailwind CSS**: Modern utility-first CSS framework
- **Better Typography**: Improved fonts and text hierarchy
- **Enhanced Cards**: Better card design with proper shadows

### Technical Improvements
- **Single-Page Application**: No page reloads for better UX
- **Enhanced Database**: Better schema with JSON field support
- **Improved API**: More robust API with better error handling
- **Form Validation**: Both client-side and server-side validation

### User Experience
- **Smoother Navigation**: Instant page transitions
- **Better Forms**: More intuitive form layouts and field types
- **Sample Data**: Quick form population for testing
- **Real-time Updates**: Immediate feedback on all actions

## Troubleshooting

### Common Issues

1. **Port already in use**: The application runs on port 5001 by default
2. **Database not created**: Ensure write permissions in the project directory
3. **Templates not loading**: Verify the `templates/` folder exists
4. **Static files not loading**: Check that the `static/js/` folder contains `app.js`

### Logs and Debugging
- Enable debug mode in `app.py` (enabled by default in development)
- Check the console output for error messages
- Verify all dependencies are installed correctly

## Future Enhancements

- User authentication and authorization
- Email notifications for status changes
- File upload functionality for requests
- Advanced reporting with charts and analytics
- Export functionality (PDF, Excel, CSV)
- Admin panel for user and system management
- Mobile app using the existing API
- Integration with external HR systems

## Support

For questions or issues:
1. Check this README for common solutions
2. Review the code comments for implementation details
3. Test individual components using the web interface

---

**RMT New** - Modern Resource Management Made Simple 