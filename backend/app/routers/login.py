from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError
import datetime
from .. import crud, schemas, auth, models
from ..database import get_db
from ..ad_auth import ADAuthenticator

router = APIRouter(prefix="/login", tags=["login"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login/try")

# Crear instancia del autenticador AD
ad_authenticator = ADAuthenticator()

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
    print(f"🔐 Intentando login para usuario: {form_data.username}")
    
    # PRIMERO: Intentar autenticación con Active Directory
    print("🔄 Verificando credenciales en Active Directory...")
    ad_user = ad_authenticator.authenticate_user(form_data.username, form_data.password)
    
    if ad_user:
        print("✅ Autenticación AD exitosa!")
        print(f"Usuario AD: {ad_user}")
        
        # 1. Check if user exists in local DB
        db_user = crud.get_user_by_email(db, email=ad_user['email'])
        
        if db_user:
            # 2. If exists, log in
            print(f"✅ Usuario encontrado en BD local: {db_user.nombre}")
        else:
            # 3. If not, create and then log in
            db_user = crud.create_user_from_ad(db, ad_user)
            print(f"✅ Usuario creado: {db_user.nombre}")
        
        # 4. Generate token for the user (new or existing)
        access_token = auth.create_access_token(data={"sub": db_user.email})
        print("🎫 Token generado exitosamente")
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user_id": db_user.id,
            "user_name": db_user.nombre,
            "user_email": db_user.email
        }
    
    # SEGUNDO: Si AD falla, intentar base de datos local
    print("❌ Autenticación AD falló, intentando BD local...")
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

    print("✅ Autenticación BD local exitosa!")
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "user_name": db_user.nombre,
        "user_email": db_user.email
    }

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