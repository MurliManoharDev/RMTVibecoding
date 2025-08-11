"""
Configuration settings for Aura RMT application
"""
import os
from pathlib import Path

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-change-in-production'
    DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rmt_database.db')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file upload
    
    # Flask settings
    FLASK_ENV = os.environ.get('FLASK_ENV') or 'development'
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # Application settings
    APP_NAME = 'Aura RMT'
    VERSION = '1.0.0'

class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG = True
    DATABASE_PATH = 'rmt_database_dev.db'

class ProductionConfig(Config):
    """Production environment configuration"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable must be set in production")

class TestingConfig(Config):
    """Testing environment configuration"""
    TESTING = True
    DATABASE_PATH = ':memory:'  # Use in-memory database for testing

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 