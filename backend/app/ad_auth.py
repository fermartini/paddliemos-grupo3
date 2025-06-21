from ldap3 import Server, Connection, AUTH_SIMPLE, STRATEGY_SYNC, SAFE_SYNC
from ldap3.core.exceptions import LDAPBindError, LDAPSocketOpenError

AD_SERVER = "tu_servidor_ad.tu_dominio.com" # Ej: '192.168.1.10' o 'dc01.tudominio.local'
AD_PORT = 389 # Puerto LDAP estándar (o 636 para LDAPS - recomendado si usas SSL)
AD_BASE_DN = "DC=tu_dominio,DC=com" # Ej: 'DC=midominio,DC=local'
# Si usas LDAPS (LDAP sobre SSL), necesitarás el certificado del servidor AD
# y la configuración ssl_enable=True, ssl_verify_cert=False (o True con el certificado)

async def authenticate_ad_user(username: str, password: str) -> bool:
    
    server = Server(AD_SERVER, port=AD_PORT, use_ssl=False) # Cambia a True si usas LDAPS
    conn = None
    try:
        # Intentar conectar y autenticar con las credenciales del usuario
        # Si tu AD requiere un DN específico para el bind, cambia username por el formato DN.
        # Por ejemplo: user_dn = f"CN={username},OU=Users,DC=yourdomain,DC=com"
        # O si el username es un UPN: f"{username}@tu_dominio.com"

        # Asumimos que username es el UPN (User Principal Name) o sAMAccountName
        # Si usas sAMAccountName, a veces necesitas el 'tu_dominio\' + username
        # user_bind_dn = f"{username}@{AD_SERVER}" # Esto funciona para UPN
        # O para sAMAccountName, si tu dominio es 'MYDOMAIN': user_bind_dn = f"MYDOMAIN\\{username}"
        # La forma más común para AD es el UPN o el sAMAccountName.

        # Para un UPN (ej: 'usuario@dominio.com')
        # conn = Connection(server, user=username, password=password, authentication=AUTH_SIMPLE, auto_bind=True)

        # Para sAMAccountName (ej: 'usuario')
        # Si tu dominio netbios es 'DOMINIO': user_dn = f"DOMINIO\\{username}"
        # Sino, y si el AD espera un DN completo, tendrías que construirlo.
        # Una forma común de probar es intentar con el UPN si tu usuario lo tiene.
        # O solo el username si el servidor está configurado para entenderlo en el bind directo.

        # La forma más robusta es buscar el DN del usuario primero y luego intentar el bind.
        # Pero para una validación simple de credenciales, un bind directo con UPN o sAMAccountName+dominio
        # suele ser suficiente.

        # Opción 1: Probar con el username tal cual (a menudo funciona si el AD lo interpreta como sAMAccountName)
        # o como UPN si el usuario lo introduce así.
        conn = Connection(server, user=username, password=password, authentication=AUTH_SIMPLE, client_strategy=SAFE_SYNC)
        if not conn.bind():
            print(f"ERROR AD Bind fallido para {username}: {conn.result}")
            return False
        
        # Opcional: Si necesitas buscar más datos del usuario después de la autenticación
        # conn.search(AD_BASE_DN, f'(sAMAccountName={username})', attributes=['mail', 'displayName', 'memberOf'])
        # if conn.entries:
        #     user_data = conn.entries[0]
        #     print(f"Usuario {username} encontrado: {user_data.displayName}")
        # else:
        #     print(f"Usuario {username} no encontrado en el directorio después del bind.")

        return True # Autenticación exitosa

    except LDAPBindError as e:
        print(f"LDAP Bind Error para {username}: {e}")
        return False
    except LDAPSocketOpenError as e:
        print(f"LDAP Socket Open Error: No se pudo conectar al servidor AD en {AD_SERVER}:{AD_PORT}. Error: {e}")
        return False
    except Exception as e:
        print(f"Error inesperado durante la autenticación AD para {username}: {e}")
        return False
    finally:
        if conn:
            conn.unbind() # Desconectar del servidor AD