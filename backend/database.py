import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "environment.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT,
            avatar TEXT
        );

        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            content TEXT,
            pdf_path TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            severity TEXT,
            message TEXT,
            city TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS image_analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT,
            prediction TEXT,
            confidence REAL,
            explanation TEXT,
            action TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            filename TEXT,
            rows INTEGER,
            columns INTEGER,
            uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            user_message TEXT,
            ai_response TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Seed admin user
    try:
        from auth import get_password_hash
        cursor.execute("""
            INSERT OR IGNORE INTO users (username, email, hashed_password, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        """, ("admin", "admin@ecowatch.ai", get_password_hash("admin123"), "System Admin", "admin"))
    except Exception:
        pass

    # Seed sample alerts
    sample_alerts = [
        ("AQI", "danger", "Air Quality Index has reached hazardous levels in Delhi", "Delhi"),
        ("Temperature", "warning", "Heatwave alert: Temperature exceeds 42°C in Rajasthan", "Jaipur"),
        ("Rainfall", "info", "Heavy rainfall expected in Mumbai over next 24 hours", "Mumbai"),
        ("Fire", "danger", "Forest fire detected in Uttarakhand region", "Dehradun"),
        ("Flood", "warning", "Flood risk elevated in Kerala coastal areas", "Kochi"),
    ]
    for alert in sample_alerts:
        cursor.execute("""
            INSERT OR IGNORE INTO alerts (type, severity, message, city)
            VALUES (?, ?, ?, ?)
        """, alert)

    conn.commit()
    conn.close()
    print("Database initialized successfully")
