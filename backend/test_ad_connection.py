import os
from dotenv import load_dotenv
from app.ad_auth import ADAuthenticator

load_dotenv()

def test_ad_connection():
    authenticator = ADAuthenticator()

    print("Testing AD connection...")
    print(f"Server: {authenticator.ad_server}")
    print(f"Port: {authenticator.ad_port}")
    print(f"Domain: {authenticator.ad_domain}")
    print(f"Base DN: {authenticator.ad_base_dn}")
    print(f"Use SSL: {authenticator.use_ssl}")

    # Test basic connection
    if authenticator.test_connection():
        print("✅ Basic connection successful!")

        # Test authentication (replace with real credentials)
        test_username = "testuser"  # Replace with actual AD username
        test_password = "testpass"  # Replace with actual AD password

        print(f"\nTesting authentication for user: {test_username}")
        user_info = authenticator.authenticate_user(test_username, test_password)

        if user_info:
            print("✅ Authentication successful!")
            print(f"User info: {user_info}")
        else:
            print("❌ Authentication failed")
    else:
        print("❌ Connection failed")

if __name__ == "__main__":
    test_ad_connection()