from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import crud, schemas, auth, models
from ..database import get_db

router = APIRouter(prefix="/login", tags=["login"])

@router.get("/{user_id}", response_model=schemas.UserOut)
def read_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/by-email/{email}", response_model=schemas.UserOut)
def read_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/try", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(username=user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

""" @router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    if db.query(models.User).filter_by(user=user.nombre).first():
        raise HTTPException(status_code=400, detail="User already registered")
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(user=user.nombre, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit(new_user)
    db.commit()
    return new_user """



