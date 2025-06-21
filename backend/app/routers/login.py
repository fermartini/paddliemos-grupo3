from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
import datetime
from .. import crud, schemas, auth, models
from ..database import get_db

router = APIRouter(prefix="/login", tags=["login"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/try")

async def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.decode_access_token(token)
        
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
        
        token_data = schemas.TokenData(email=email)

    except JWTError as e:
        print(f"ERROR JWT al decodificar token: {e}")
        raise credentials_exception
    except Exception as e:
        print(f"ERROR INESPERADO en get_current_user: {e}")
        raise credentials_exception

    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception

    return user

@router.get("/by-email/{email}", response_model=schemas.UserOut)
def get_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado por email")
    return db_user

@router.get("/user_name", response_model=schemas.UserNombreResponse) 
async def read_current_user_name(current_user: models.User = Depends(get_current_user)):
    if not hasattr(current_user, 'nombre'):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="El modelo de usuario no tiene el atributo 'nombre'."
        )
    return {"nombre": current_user.nombre} 

@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado por ID")
    return db_user

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    if crud.get_user_by_name(db, name=user.nombre):
        raise HTTPException(status_code=400, detail="Nombre de usuario ya registrado")
    if crud.get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email ya registrado")

    new_user = crud.create_user(db, user=user)

    return new_user

@router.post("/try", response_model=schemas.Token)
async def login( 
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, email=form_data.username) 

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not auth.verify_password(form_data.password, db_user.contraseña): 
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# @router.post("/try", response_model=schemas.Token)
# async def login(
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(get_db)
# ):
#     username = form_data.username # Esto será el nombre de usuario de AD (sAMAccountName o UPN)
#     password = form_data.password

#     # Paso 1: Intentar autenticar contra Active Directory
#     ad_authenticated = await authenticate_ad_user(username, password)

#     if not ad_authenticated:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Credenciales de Active Directory inválidas",
#             headers={"WWW-Authenticate": "Bearer"},
#         )

#     # Paso 2: Si la autenticación AD es exitosa, verificar/crear el usuario en tu base de datos local
#     # Esto es importante para mantener roles, permisos, o cualquier dato adicional
#     # que no esté directamente en AD o que quieras gestionar localmente.

#     # Puedes buscar al usuario por email si tu 'username' de AD es un email (UPN)
#     # o por algún otro identificador único. Aquí asumo que tu AD username puede coincidir con el email
#     # o que tienes una estrategia para mapearlo.
#     # Si AD username es 'jsmith', y tu email es 'jsmith@dominio.com',
#     # podrías tener que ajustar cómo buscas el usuario en tu DB.

#     # Opción A: Buscar por email (si el username de AD es el email)
#     db_user = crud.get_user_by_email(db, email=username) 

#     # Opción B: Si el username de AD es un sAMAccountName (ej: 'jsmith'), y tu DB usa emails,
#     # necesitarías buscar el email del usuario en AD después de autenticar, o tener un mapeo.
#     # Para simplificar, asumimos que el username que llega es el email o un identificador que puedes buscar.
    
#     if not db_user:
#         # Si el usuario es nuevo y se autenticó exitosamente en AD,
#         # puedes crearlo en tu base de datos local con un rol por defecto, etc.
#         # NO DEBES ALMACENAR LA CONTRASEÑA DE AD EN TU DB LOCAL.
#         print(f"Usuario {username} autenticado en AD, pero no encontrado en DB local. Creando entrada...")
        
#         # Aquí podrías obtener más datos del usuario desde AD si los necesitas para la creación.
#         # Por simplicidad, creamos un usuario básico. Necesitarás adaptar UserCreate.
#         new_user_data = schemas.UserCreate(
#             nombre=username, # O un nombre que obtengas de AD si tienes esa lógica
#             email=username, # O el email real si lo obtienes de AD
#             contraseña="NO_APLICA_AD_AUTH" # Contraseña dummy o hash de algo que no sea la de AD
#         )
#         new_user = crud.create_user(db, user=new_user_data, is_ad_user=True) # Puedes añadir un flag
#         db_user = new_user
    
#     # Si el usuario ya existe en tu DB local, y se autenticó en AD, ya está.
#     # No necesitas verificar la contraseña de db_user, ya la validó AD.

#     # Generar el token JWT
#     access_token = auth.create_access_token(data={"sub": db_user.email}) # Usa el email de tu DB local
#     return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar este usuario."
        )

    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    crud.delete_user(db, user_id=user_id)
    return {"message": "Usuario eliminado exitosamente"}

@router.put("/users/{user_id}", response_model=schemas.UserOut)
async def update_user_profile(
    user_id: int,
    user_update: schemas.UserUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) 
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para modificar este perfil."
        )

    updated_user = crud.update_user(db, user_id=user_id, user_update=user_update)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )

    return updated_user