from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from models import Base, Turno
from schemas import TurnoOut
from . import models, schemas
from .database import engine, SessionLocal
from . import crud
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependencia de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint: obtener lista de usuarios
@app.get("/users/", response_model=List[schemas.UserOut])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

# Endpoint: crear usuario
@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_user(db=db, user=user)

@app.get("/turnos/ultimos", response_model=List[TurnoOut])
def obtener_ultimos_turnos(db: Session = Depends(get_db)):
    turnos = db.query(Turno).order_by(Turno.fecha.desc(), Turno.hora.desc()).limit(3).all()
    return turnos 