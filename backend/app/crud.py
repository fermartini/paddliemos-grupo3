from sqlalchemy.orm import Session
from . import models, schemas

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        nombre=user.nombre,
        email=user.email,
        contraseña=user.contraseña,
        role_id=user.role_id,
        company_id=user.company_id,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user