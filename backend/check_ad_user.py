import ldap3
from ldap3 import Server, Connection, ALL, SIMPLE
import os
from dotenv import load_dotenv

load_dotenv()

def check_user_exists():
    ad_server = os.getenv('AD_SERVER', '192.168.0.108')
    ad_port = int(os.getenv('AD_PORT', '389'))
    ad_base_dn = os.getenv('AD_BASE_DN', 'DC=IFTS,DC=local')
    ad_domain = os.getenv('AD_DOMAIN', 'IFTS')
    use_ssl = os.getenv('AD_USE_SSL', 'False').lower() == 'true'
    
    print("=== Checking AD User ===")
    print(f"Server: {ad_server}")
    print(f"Base DN: {ad_base_dn}")
    print(f"Domain: {ad_domain}")
    
    try:
        server = Server(ad_server, port=ad_port, use_ssl=use_ssl, get_info=ALL)
        
        # --- CONEXIÓN AUTENTICADA ---
        print("\n🔐 Conectando con credenciales de Administrador...")
        
        # Usa la cuenta de Administrator para poder buscar
        admin_user_dn = f'{ad_domain}\\Administrator'
        admin_password = 'IFTS.18'  # ¡REEMPLAZA CON TU CONTRASEÑA REAL!
        
        print(f"Intentando conectar como: {admin_user_dn}")
        
        conn = Connection(
            server, 
            user=admin_user_dn, 
            password=admin_password, 
            authentication=SIMPLE, 
            auto_bind=True
        )
        
        if conn.bound:
            print("✅ Conectado exitosamente como Administrator")
            
            # Ahora podemos buscar usuarios
            username = "Pedro.Gonzalez"
            search_filter = f"(&(objectClass=user)(sAMAccountName={username}))"
            
            print(f"\n🔍 Buscando usuario: {username}")
            print(f"Filtro de búsqueda: {search_filter}")
            
            conn.search(
                search_base=ad_base_dn,
                search_filter=search_filter,
                attributes=['cn', 'mail', 'givenName', 'sn', 'sAMAccountName', 'userPrincipalName', 'distinguishedName']
            )
            
            if conn.entries:
                user_entry = conn.entries[0]
                print("✅ ¡Usuario encontrado en AD!")
                print(f"Display Name: {user_entry.cn.value if hasattr(user_entry, 'cn') else 'N/A'}")
                print(f"Email: {user_entry.mail.value if hasattr(user_entry, 'mail') else 'N/A'}")
                print(f"User Principal Name: {user_entry.userPrincipalName.value if hasattr(user_entry, 'userPrincipalName') else 'N/A'}")
                print(f"Distinguished Name: {user_entry.distinguishedName.value if hasattr(user_entry, 'distinguishedName') else 'N/A'}")
                
                # Listar todos los usuarios disponibles
                print("\n=== Listando todos los usuarios ===")
                conn.search(
                    search_base=ad_base_dn,
                    search_filter="(objectClass=user)",
                    attributes=['sAMAccountName', 'cn'],
                    search_scope=ldap3.SUBTREE
                )
                
                print("Usuarios disponibles:")
                for entry in conn.entries[:10]:  # Mostrar primeros 10 usuarios
                    username = entry.sAMAccountName.value if hasattr(entry, 'sAMAccountName') else 'N/A'
                    display_name = entry.cn.value if hasattr(entry, 'cn') else 'N/A'
                    print(f"  - {username} ({display_name})")
                
            else:
                print("❌ Usuario no encontrado en AD")
                print("\n💡 Posibles razones:")
                print("1. El usuario no existe")
                print("2. El sAMAccountName es diferente")
                print("3. El usuario está en una OU diferente")
                
                # Buscar usuarios similares
                print("\n🔍 Buscando usuarios similares...")
                similar_filter = f"(&(objectClass=user)(cn=*Pedro*))"
                conn.search(
                    search_base=ad_base_dn,
                    search_filter=similar_filter,
                    attributes=['sAMAccountName', 'cn']
                )
                
                if conn.entries:
                    print("Usuarios con 'Pedro' en el nombre:")
                    for entry in conn.entries:
                        username = entry.sAMAccountName.value if hasattr(entry, 'sAMAccountName') else 'N/A'
                        display_name = entry.cn.value if hasattr(entry, 'cn') else 'N/A'
                        print(f"  - {username} ({display_name})")
                
            conn.unbind()
        else:
            print("❌ Falló la conexión como Administrator")
            print(f"Error: {conn.result}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_user_exists() 