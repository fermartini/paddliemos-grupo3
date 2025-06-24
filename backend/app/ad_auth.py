import ldap3
from ldap3 import Server, Connection, ALL, SIMPLE
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

class ADAuthenticator:
    def __init__(self):
        self.ad_server = os.getenv('AD_SERVER', '192.168.0.108')
        self.ad_port = int(os.getenv('AD_PORT', '389'))
        self.ad_domain = os.getenv('AD_DOMAIN', 'IFTS')
        self.ad_base_dn = os.getenv('AD_BASE_DN', 'DC=IFTS,DC=local')
        self.use_ssl = os.getenv('AD_USE_SSL', 'False').lower() == 'true'

        self.service_user = os.getenv('AD_SERVICE_USER', 'Administrator')
        self.service_password = os.getenv('AD_SERVICE_PASSWORD', 'TuContraseñaDeAdministrator')

    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Autenticar usuario contra Active Directory
        """
        try:
            server = Server(
                self.ad_server,
                port=self.ad_port,
                use_ssl=self.use_ssl,
                get_info=ALL
            )

            auth_attempts = [
                f"{self.ad_domain}\\{username}",
                f"{username}@{self.ad_domain}.local",
                f"{username}@{self.ad_domain}",
                username
            ]

            for user_dn in auth_attempts:
                try:
                    print(f"🔐 Intentando autenticación: {user_dn}")

                    conn = Connection(
                        server,
                        user=user_dn,
                        password=password,
                        authentication=SIMPLE,
                        auto_bind=True
                    )

                    if conn.bound:
                        print(f"✅ Autenticación exitosa con: {user_dn}")
                        user_info = self._get_user_info(conn, username)
                        conn.unbind()
                        return user_info
                    else:
                        print(f"❌ Falló con: {user_dn}")
                        conn.unbind()

                except Exception as e:
                    print(f"❌ Error con {user_dn}: {e}")
                    continue

            return None

        except Exception as e:
            print(f"Error de autenticación AD: {e}")
            return None

    def _get_user_info(self, conn: Connection, username: str) -> Optional[Dict[str, Any]]:

        try:
            # Buscar usuario
            search_filter = f"(&(objectClass=user)(sAMAccountName={username}))"

            conn.search(
                search_base=self.ad_base_dn,
                search_filter=search_filter,
                attributes=['cn', 'mail', 'givenName', 'sn', 'sAMAccountName']
            )

            if conn.entries:
                user_entry = conn.entries[0]
                return {
                    'username': user_entry.sAMAccountName.value if hasattr(user_entry, 'sAMAccountName') else username,
                    'email': user_entry.mail.value if hasattr(user_entry, 'mail') else f"{username}@{self.ad_domain}.local",
                    'display_name': user_entry.cn.value if hasattr(user_entry, 'cn') else username,
                    'first_name': user_entry.givenName.value if hasattr(user_entry, 'givenName') else '',
                    'last_name': user_entry.sn.value if hasattr(user_entry, 'sn') else ''
                }


            return {
                'username': username,
                'email': f"{username}@{self.ad_domain}.local",
                'display_name': username,
                'first_name': '',
                'last_name': ''
            }

        except Exception as e:
            print(f"Error obteniendo información del usuario desde AD: {e}")
            return None

    def test_connection(self) -> bool:
        """
        Probar conexión al servidor AD
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
                print(f"✅ Conectado exitosamente al servidor AD: {self.ad_server}")
                conn.unbind()
                return True
            else:
                print(f"❌ Falló la conexión al servidor AD: {self.ad_server}")
                return False

        except Exception as e:
            print(f"Error en la prueba de conexión: {e}")
            return False