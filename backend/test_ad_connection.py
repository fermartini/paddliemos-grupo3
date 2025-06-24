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

        # Get credentials from user
        print("\n=== Authentication Test ===")
        print("Please enter credentials for an existing AD user:")

        username = input("Username (without domain): ").strip()
        password = input("Password: ").strip()

        if username and password:
            print(f"\nTesting authentication for user: {username}")
            user_info = authenticator.authenticate_user(username, password)

            if user_info:
                print("✅ Authentication successful!")
                print(f"User info: {user_info}")
            else:
                print("❌ Authentication failed")
                print("\nPossible issues:")
                print("1. Username or password is incorrect")
                print("2. User account is locked or disabled")
                print("3. User doesn't exist in AD")
        else:
            print("❌ No credentials provided")
    else:
        print("❌ Connection failed")

if __name__ == "__main__":
    test_ad_connection()