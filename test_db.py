import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

try:
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    print("SUCCESS: Connected to MySQL")
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
