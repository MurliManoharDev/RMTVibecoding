from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'rmt-new-dev-key-' + str(hash(os.urandom(32))))

# Database configuration
DATABASE = 'rmt_new_database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    
    # Create requests table with additional fields for the new design
    conn.execute('''
        CREATE TABLE IF NOT EXISTS requests (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL CHECK(type IN ('Add', 'Transfer', 'Terminate')),
            company TEXT,
            status TEXT DEFAULT 'Pending',
            user_name TEXT,
            start_date DATE,
            location TEXT,
            racf_id TEXT,
            details TEXT,
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            form_data TEXT
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
    
    # Insert sample data if table is empty
    existing_requests = conn.execute('SELECT COUNT(*) FROM requests').fetchone()[0]
    if existing_requests == 0:
        sample_requests = [
            ('R001', 'Add', 'Cognizant', 'PMO Review', 'Jaya Shankar Alapati', '2025-04-15', 'Hyderabad', 'JA12345', 
             '{"firstName": "Jaya Shankar", "lastName": "Alapati", "project": "Project Alpha"}'),
            ('R002', 'Add', 'Cognizant', 'Approved', 'Hemalatha Sivakumar', '2025-04-16', 'Chennai', 'HS67890',
             '{"firstName": "Hemalatha", "lastName": "Sivakumar", "project": "Project Beta"}'),
            ('R003', 'Transfer', 'Infosys', 'Approved', 'Sugapriya Manikandan', '2025-05-05', 'Bangalore', 'SM11223',
             '{"firstName": "Sugapriya", "lastName": "Manikandan", "newRole": "Senior Developer"}'),
            ('R004', 'Terminate', 'Wipro', 'Pending HR', 'Neelima Nimmagadda', '2025-04-28', 'Hyderabad', 'NN33445',
             '{"firstName": "Neelima", "lastName": "Nimmagadda", "reason": "Contract End"}'),
        ]
        
        for req in sample_requests:
            conn.execute('''
                INSERT INTO requests (id, type, company, status, user_name, start_date, location, racf_id, details)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', req)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

@app.route('/')
def index():
    """Main application page - single page app"""
    return render_template('index.html')

@app.route('/api/requests')
def api_get_requests():
    """API endpoint to get all requests"""
    try:
        conn = get_db_connection()
        requests = conn.execute('''
            SELECT id, type, company, status, user_name, start_date, location, racf_id, details 
            FROM requests ORDER BY created_date DESC
        ''').fetchall()
        conn.close()
        
        # Convert to list of dictionaries for JSON response
        requests_list = []
        for req in requests:
            req_dict = dict(req)
            # Parse details JSON if it exists
            if req_dict['details']:
                try:
                    req_dict['details'] = json.loads(req_dict['details'])
                except:
                    req_dict['details'] = {}
            else:
                req_dict['details'] = {}
            requests_list.append(req_dict)
            
        return jsonify({'success': True, 'requests': requests_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/requests/<request_type>')
def api_get_requests_by_type(request_type):
    """API endpoint to get requests by type"""
    try:
        conn = get_db_connection()
        if request_type.lower() == 'all':
            requests = conn.execute('''
                SELECT id, type, company, status, user_name, start_date, location, racf_id, details 
                FROM requests ORDER BY created_date DESC
            ''').fetchall()
        else:
            requests = conn.execute('''
                SELECT id, type, company, status, user_name, start_date, location, racf_id, details 
                FROM requests WHERE type = ? ORDER BY created_date DESC
            ''', (request_type.title(),)).fetchall()
        conn.close()
        
        # Convert to list of dictionaries for JSON response
        requests_list = []
        for req in requests:
            req_dict = dict(req)
            # Parse details JSON if it exists
            if req_dict['details']:
                try:
                    req_dict['details'] = json.loads(req_dict['details'])
                except:
                    req_dict['details'] = {}
            else:
                req_dict['details'] = {}
            requests_list.append(req_dict)
            
        return jsonify({'success': True, 'requests': requests_list})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/submit-request', methods=['POST'])
def api_submit_request():
    """API endpoint to submit a new request"""
    conn = None
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('type'):
            return jsonify({'success': False, 'message': 'Request type is required'}), 400
            
        if data.get('type') not in ['Add', 'Transfer', 'Terminate']:
            return jsonify({'success': False, 'message': 'Invalid request type'}), 400
        
        # Generate new request ID
        conn = get_db_connection()
        last_id = conn.execute('SELECT MAX(CAST(SUBSTR(id, 2) AS INTEGER)) FROM requests WHERE id LIKE "R%"').fetchone()[0]
        new_id_num = (last_id or 0) + 1
        new_id = f'R{new_id_num:03d}'
        
        # Extract key fields from form data
        form_data = data.get('formData', {})
        user_name = form_data.get('firstName', '') + ' ' + form_data.get('lastName', '')
        company = form_data.get('company', '')
        location = form_data.get('currentLocation', form_data.get('workspaceLocation', ''))
        racf_id = form_data.get('racfId', '')
        start_date = form_data.get('startDate', form_data.get('transferDate', form_data.get('effectiveDate', '')))
        
        conn.execute('''
            INSERT INTO requests (id, type, company, status, user_name, start_date, location, racf_id, details, form_data)
            VALUES (?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?)
        ''', (new_id, data['type'], company, user_name.strip(), start_date, location, racf_id, 
              json.dumps(form_data), json.dumps(form_data)))
        conn.commit()
        
        return jsonify({'success': True, 'message': 'Request submitted successfully', 'request_id': new_id})
    except sqlite3.Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/requests/<request_id>/status', methods=['PUT'])
def api_update_request_status(request_id):
    """API endpoint to update request status"""
    conn = None
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'success': False, 'message': 'Status is required'}), 400
            
        new_status = data['status']
        
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

@app.errorhandler(404)
def not_found_error(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 