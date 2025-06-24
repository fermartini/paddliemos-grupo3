import ldap3 
from ldap3 import Server, Connection, ALL, SIMPLE, NTLM
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class ADAuthenticator:
    def __init__(self):
        # AD Server configuration - update these with your VM details
        self.ad_server = os.getenv('AD_SERVER', 'your-ad-server.com')
        self.ad_port = int(os.getenv('AD_PORT', '389'))
        self.ad_domain = os.getenv('AD_DOMAIN', 'yourdomain.com')
        self.ad_base_dn = os.getenv('AD_BASE_DN', 'DC=yourdomain,DC=com')
        self.use_ssl = os.getenv('AD_USE_SSL', 'False').lower() == 'true'

        # Service account for searching users (optional)
        self.service_account = os.getenv('AD_SERVICE_ACCOUNT', 'service@yourdomain.com')
        self.service_password = os.getenv('AD_SERVICE_PASSWORD', '')

    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate a user against Active Directory
        Returns user info if authentication successful, None otherwise
        """
        try:
            # Create server object
            server = Server(
                self.ad_server,
                port=self.ad_port,
                use_ssl=self.use_ssl,
                get_info=ALL
            )

            # Try different authentication methods
            auth_methods = [
                # Method 1: Simple authentication with domain
                (f"{username}@{self.ad_domain}", password, SIMPLE),
                # Method 2: Simple authentication without domain
                (username, password, SIMPLE),
                # Method 3: NTLM authentication
                (f"{self.ad_domain}\\{username}", password, NTLM),
            ]

            for user_dn, pwd, auth_type in auth_methods:
                try:
                    conn = Connection(
                        server,
                        user=user_dn,
                        password=pwd,
                        authentication=auth_type,
                        auto_bind=True
                    )

                    if conn.bound:
                        # Authentication successful, get user details
                        user_info = self._get_user_info(conn, username)
                        conn.unbind()
                        return user_info
                    else:
                        conn.unbind()

                except Exception as e:
                    print(f"Auth method failed for {user_dn}: {e}")
                    continue

            return None

        except Exception as e:
            print(f"AD Authentication error: {e}")
            return None

    def _get_user_info(self, conn: Connection, username: str) -> Optional[Dict[str, Any]]:
        """
        Get user information from AD
        """
        try:
            # Search for user in AD using different filters
            search_filters = [
                f"(&(objectClass=user)(sAMAccountName={username}))",
                f"(&(objectClass=user)(userPrincipalName={username}@{self.ad_domain}))",
                f"(&(objectClass=user)(mail={username}))"
            ]

            for search_filter in search_filters:
                try:
                    conn.search(
                        search_base=self.ad_base_dn,
                        search_filter=search_filter,
                        attributes=['cn', 'mail', 'givenName', 'sn', 'sAMAccountName', 'memberOf', 'userPrincipalName']
                    )

                    if conn.entries:
                        user_entry = conn.entries[0]
                        return {
                            'username': user_entry.sAMAccountName.value if hasattr(user_entry, 'sAMAccountName') else username,
                            'email': user_entry.mail.value if hasattr(user_entry, 'mail') else f"{username}@{self.ad_domain}",
                            'display_name': user_entry.cn.value if hasattr(user_entry, 'cn') else username,
                            'first_name': user_entry.givenName.value if hasattr(user_entry, 'givenName') else '',
                            'last_name': user_entry.sn.value if hasattr(user_entry, 'sn') else '',
                            'groups': [group.split(',')[0].replace('CN=', '') for group in user_entry.memberOf.values] if hasattr(user_entry, 'memberOf') else []
                        }

                except Exception as e:
                    print(f"Search filter failed: {e}")
                    continue

            # If no user found, return basic info
            return {
                'username': username,
                'email': f"{username}@{self.ad_domain}",
                'display_name': username,
                'first_name': '',
                'last_name': '',
                'groups': []
            }

        except Exception as e:
            print(f"Error getting user info from AD: {e}")
            return None

    def test_connection(self) -> bool:
        """
        Test connection to AD server
        """
        try:
            server = Server(
                self.ad_server,
                port=self.ad_port,
                use_ssl=self.use_ssl,
                get_info=ALL
            )

            conn = Connection(server, auto_bind=True)
            if conn.bound:
                print(f"Successfully connected to AD server: {self.ad_server}")
                conn.unbind()
                return True
            else:
                print(f"Failed to connect to AD server: {self.ad_server}")
                return False

        except Exception as e:
            print(f"Connection test failed: {e}")
            return False