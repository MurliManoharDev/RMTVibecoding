#!/usr/bin/env python3
"""
SQLite Database Utility Script for RMT Flask App
Usage: python db_utils.py [command]

Commands:
  backup     - Create a backup of the database
  restore    - Restore database from backup
  info       - Show database information
  vacuum     - Optimize database file size
  check      - Check database integrity
"""

import sqlite3
import os
import sys
import shutil
from datetime import datetime
import argparse

# Import database path from app
from app import DATABASE

def create_backup():
    """Create a timestamped backup of the database"""
    if not os.path.exists(DATABASE):
        print(f"Error: Database {DATABASE} not found!")
        return False
    
    # Create backups directory if it doesn't exist
    backup_dir = "backups"
    os.makedirs(backup_dir, exist_ok=True)
    
    # Generate backup filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"rmt_database_backup_{timestamp}.db"
    backup_path = os.path.join(backup_dir, backup_name)
    
    # Copy database file
    try:
        shutil.copy2(DATABASE, backup_path)
        print(f"✓ Backup created: {backup_path}")
        print(f"  Size: {os.path.getsize(backup_path):,} bytes")
        return True
    except Exception as e:
        print(f"✗ Backup failed: {e}")
        return False

def restore_backup(backup_file):
    """Restore database from a backup file"""
    if not os.path.exists(backup_file):
        print(f"Error: Backup file {backup_file} not found!")
        return False
    
    # Create a safety backup first
    if os.path.exists(DATABASE):
        print("Creating safety backup of current database...")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safety_backup = f"{DATABASE}.before_restore_{timestamp}"
        shutil.copy2(DATABASE, safety_backup)
        print(f"✓ Safety backup created: {safety_backup}")
    
    # Restore the backup
    try:
        shutil.copy2(backup_file, DATABASE)
        print(f"✓ Database restored from: {backup_file}")
        return True
    except Exception as e:
        print(f"✗ Restore failed: {e}")
        return False

def show_database_info():
    """Display database information and statistics"""
    if not os.path.exists(DATABASE):
        print(f"Error: Database {DATABASE} not found!")
        return False
    
    print(f"\nDatabase Information")
    print("=" * 50)
    print(f"Path: {DATABASE}")
    print(f"Size: {os.path.getsize(DATABASE):,} bytes")
    print(f"Modified: {datetime.fromtimestamp(os.path.getmtime(DATABASE))}")
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    try:
        # Get table information
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        print(f"\nTables ({len(tables)}):")
        for table in tables:
            table_name = table[0]
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"  - {table_name}: {count:,} rows")
        
        # Get database settings
        print("\nDatabase Settings:")
        cursor.execute("PRAGMA journal_mode")
        print(f"  - Journal Mode: {cursor.fetchone()[0]}")
        cursor.execute("PRAGMA synchronous")
        print(f"  - Synchronous: {cursor.fetchone()[0]}")
        cursor.execute("PRAGMA page_size")
        print(f"  - Page Size: {cursor.fetchone()[0]} bytes")
        
    except Exception as e:
        print(f"Error reading database: {e}")
    finally:
        conn.close()
    
    return True

def vacuum_database():
    """Optimize database file size by running VACUUM"""
    if not os.path.exists(DATABASE):
        print(f"Error: Database {DATABASE} not found!")
        return False
    
    print("Starting database optimization...")
    size_before = os.path.getsize(DATABASE)
    
    try:
        conn = sqlite3.connect(DATABASE)
        conn.execute("VACUUM")
        conn.close()
        
        size_after = os.path.getsize(DATABASE)
        saved = size_before - size_after
        
        print(f"✓ Database optimized!")
        print(f"  Size before: {size_before:,} bytes")
        print(f"  Size after: {size_after:,} bytes")
        print(f"  Space saved: {saved:,} bytes ({saved/size_before*100:.1f}%)")
        return True
    except Exception as e:
        print(f"✗ Optimization failed: {e}")
        return False

def check_database_integrity():
    """Check database integrity"""
    if not os.path.exists(DATABASE):
        print(f"Error: Database {DATABASE} not found!")
        return False
    
    print("Checking database integrity...")
    
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute("PRAGMA integrity_check")
        result = cursor.fetchone()[0]
        
        if result == "ok":
            print("✓ Database integrity check passed!")
            
            # Additional checks
            cursor.execute("PRAGMA foreign_key_check")
            fk_issues = cursor.fetchall()
            if fk_issues:
                print("⚠ Foreign key issues found:")
                for issue in fk_issues:
                    print(f"  - {issue}")
            else:
                print("✓ No foreign key issues found")
        else:
            print(f"✗ Integrity check failed: {result}")
            return False
        
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Integrity check error: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="SQLite Database Utility for RMT Flask App")
    parser.add_argument("command", choices=["backup", "restore", "info", "vacuum", "check"],
                       help="Command to execute")
    parser.add_argument("--file", help="Backup file path (for restore command)")
    
    args = parser.parse_args()
    
    # Execute command
    if args.command == "backup":
        create_backup()
    elif args.command == "restore":
        if not args.file:
            print("Error: Please specify backup file with --file option")
            sys.exit(1)
        restore_backup(args.file)
    elif args.command == "info":
        show_database_info()
    elif args.command == "vacuum":
        vacuum_database()
    elif args.command == "check":
        check_database_integrity()

if __name__ == "__main__":
    main() 