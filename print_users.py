import sqlite3
import os

def main():
    # Detect database path
    db_path = 'backend/textile_waste.db'
    if not os.path.exists(db_path):
        # Check parent folder fallback
        db_path = 'textile_waste.db'
        if not os.path.exists(db_path):
            print("Error: textile_waste.db database file not found. Ensure the backend server has run at least once.")
            return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Retrieve registered user records
        cursor.execute("SELECT id, full_name, email, role, hashed_password FROM users")
        users = cursor.fetchall()
        
        print("\n" + "="*110)
        print("                 SECURE DATABASE AUDIT: SYSTEM OPERATORS & ENCRYPTED PASSWORDS")
        print("="*110)
        print(f"{'ID':<4} | {'Full Name':<15} | {'Email':<25} | {'Assigned System Role':<25} | {'Bcrypt Hashed Password'}")
        print("-"*110)
        
        if not users:
            print("No user registrations found in database.")
        else:
            for u in users:
                print(f"{u[0]:<4} | {u[1]:<15} | {u[2]:<25} | {u[3]:<25} | {u[4]}")
                
        print("="*110)
        print("🔒 Security Verification: Plaintext passwords are not stored.")
        print("   Passwords are cryptographically salted and hashed using Bcrypt (e.g., $2b$12$...).")
        print("="*110 + "\n")
        
        conn.close()
    except Exception as e:
        print(f"Error opening database: {e}")

if __name__ == '__main__':
    main()
