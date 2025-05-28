import os
import requests
import ssl
import urllib3
from urllib3.util.ssl_ import create_urllib3_context

def test_connection():
    # Test direct HTTPS connection
    print("Testing direct HTTPS connection to TMDB...")
    try:
        response = requests.get('https://api.themoviedb.org', timeout=10)
        print(f"Direct HTTPS connection successful. Status code: {response.status_code}")
    except Exception as e:
        print(f"Direct HTTPS connection failed: {str(e)}")
    
    # Test with custom SSL context
    print("\nTesting with custom SSL context...")
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        response = requests.get('https://api.themoviedb.org', timeout=10, verify=False)
        print(f"Connection with verify=False successful. Status code: {response.status_code}")
    except Exception as e:
        print(f"Connection with custom SSL context failed: {str(e)}")
    
    # Test with urllib3
    print("\nTesting with urllib3...")
    try:
        http = urllib3.PoolManager(
            cert_reqs='CERT_NONE',
            assert_hostname=False
        )
        response = http.request('GET', 'https://api.themoviedb.org', timeout=10.0)
        print(f"urllib3 connection successful. Status code: {response.status}")
    except Exception as e:
        print(f"urllib3 connection failed: {str(e)}")

if __name__ == "__main__":
    test_connection()
