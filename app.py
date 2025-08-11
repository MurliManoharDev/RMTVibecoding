from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-key-change-in-production-' + str(hash(os.urandom(32))))

# Database configuration
DATABASE = 'rmt_database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    
    # Create requests table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('add', 'transfer', 'terminate')),
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'completed')),
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by TEXT,
            assigned_to TEXT,
            priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
            comments TEXT
        )
    ''')
    
    # Create users table for basic user management
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'manager', 'user')),
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create audit log table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id INTEGER,
            action TEXT NOT NULL,
            performed_by TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            details TEXT,
            FOREIGN KEY (request_id) REFERENCES requests (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

@app.route('/')
def dashboard():
    """Main dashboard page"""
    return render_template('dashboard.html')

@app.route('/add-request')
def add_request():
    """Add new request page"""
    return render_template('add_request.html')

@app.route('/transfer-request')
def transfer_request():
    """Transfer request page"""
    return render_template('transfer_request.html')

@app.route('/terminate-request')
def terminate_request():
    """Terminate request page"""
    return render_template('terminate_request.html')

@app.route('/view-all-requests')
def view_all_requests():
    """View all requests page"""
    try:
        conn = get_db_connection()
        requests = conn.execute('SELECT * FROM requests ORDER BY created_date DESC').fetchall()
        conn.close()
        return render_template('view_all_requests.html', requests=requests)
    except sqlite3.Error as e:
        flash(f'Database error: {str(e)}', 'error')
        return render_template('view_all_requests.html', requests=[])

@app.route('/view-add-requests')
def view_add_requests():
    """View add requests page"""
    conn = get_db_connection()
    requests = conn.execute('SELECT * FROM requests WHERE type = "add" ORDER BY created_date DESC').fetchall()
    conn.close()
    return render_template('view_requests.html', requests=requests, request_type='Add')

@app.route('/view-transfer-requests')
def view_transfer_requests():
    """View transfer requests page"""
    conn = get_db_connection()
    requests = conn.execute('SELECT * FROM requests WHERE type = "transfer" ORDER BY created_date DESC').fetchall()
    conn.close()
    return render_template('view_requests.html', requests=requests, request_type='Transfer')

@app.route('/view-terminate-requests')
def view_terminate_requests():
    """View terminate requests page"""
    conn = get_db_connection()
    requests = conn.execute('SELECT * FROM requests WHERE type = "terminate" ORDER BY created_date DESC').fetchall()
    conn.close()
    return render_template('view_requests.html', requests=requests, request_type='Terminate')

@app.route('/view-by-status')
def view_by_status():
    """View requests by status page"""
    return render_template('view_by_status.html')

@app.route('/reports')
def reports():
    """Reports page"""
    return render_template('reports.html')

@app.route('/api/submit-request', methods=['POST'])
def submit_request():
    """API endpoint to submit a new request"""
    conn = None
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({'success': False, 'message': 'Title and description are required'}), 400
            
        if data.get('type') not in ['add', 'transfer', 'terminate']:
            return jsonify({'success': False, 'message': 'Invalid request type'}), 400
        
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO requests (type, title, description, created_by, priority)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['type'], data['title'], data['description'], 
              data.get('created_by', 'System'), data.get('priority', 'medium')))
        conn.commit()
        
        return jsonify({'success': True, 'message': 'Request submitted successfully'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/requests/<int:request_id>/update-status', methods=['PUT'])
def update_request_status(request_id):
    """API endpoint to update request status"""
    conn = None
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'success': False, 'message': 'Status is required'}), 400
            
        new_status = data['status']
        if new_status not in ['pending', 'approved', 'rejected', 'completed']:
            return jsonify({'success': False, 'message': 'Invalid status value'}), 400
        
        conn = get_db_connection()
        
        # Check if request exists
        existing = conn.execute('SELECT id FROM requests WHERE id = ?', (request_id,)).fetchone()
        if not existing:
            return jsonify({'success': False, 'message': 'Request not found'}), 404
        
        # Update the status
        conn.execute('''
            UPDATE requests 
            SET status = ?, updated_date = CURRENT_TIMESTAMP 
            WHERE id = ?
        ''', (new_status, request_id))
        conn.commit()
        
        return jsonify({'success': True, 'message': 'Status updated successfully'})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 