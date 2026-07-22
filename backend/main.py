from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
from database import engine, get_db
import models, schemas
from auth import verificar_password, hashear_password, crear_token, get_admin_actual

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chucky Barber Shop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── AUTH ──────────────────────────────────────────
@app.post("/auth/login", response_model=schemas.Token)
def login(datos: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == datos.email).first()
    if not usuario or not verificar_password(datos.password, usuario.password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    token = crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

# ── SERVICIOS ─────────────────────────────────────
@app.get("/servicios", response_model=list[schemas.ServicioResponse])
def obtener_servicios(db: Session = Depends(get_db)):
    return db.query(models.Servicio).filter(models.Servicio.activo == True).all()

@app.post("/servicios", response_model=schemas.ServicioResponse)
def crear_servicio(servicio: schemas.ServicioCreate, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    nuevo = models.Servicio(**servicio.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@app.delete("/servicios/{id}")
def eliminar_servicio(id: int, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    servicio = db.query(models.Servicio).filter(models.Servicio.id == id).first()
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    servicio.activo = False
    db.commit()
    return {"mensaje": "Servicio eliminado"}

# ── CITAS ─────────────────────────────────────────
@app.post("/citas", response_model=schemas.CitaResponse)
def crear_cita(cita: schemas.CitaCreate, db: Session = Depends(get_db)):
    # Validar que no sea fecha pasada
    try:
        fecha_cita = datetime.strptime(cita.fecha, "%Y-%m-%d").date()
        if fecha_cita < datetime.now().date():
            raise HTTPException(status_code=400, detail="No puedes agendar en fechas pasadas")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido")
    
    # Validar horario de trabajo (10 AM - 11 PM)
    try:
        hora_cita = datetime.strptime(cita.hora, "%H:%M").time()
        hora_apertura = datetime.strptime("10:00", "%H:%M").time()
        hora_cierre = datetime.strptime("23:00", "%H:%M").time()
        
        if hora_cita < hora_apertura or hora_cita > hora_cierre:
            raise HTTPException(status_code=400, detail="Horario fuera de atención. Abierto de 10 AM a 11 PM")
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de hora inválido")
    
    # Validar que no exista otra cita a la misma hora y fecha
    cita_existente = db.query(models.Cita).filter(
        and_(
            models.Cita.fecha == cita.fecha,
            models.Cita.hora == cita.hora,
            models.Cita.estado != "cancelada"
        )
    ).first()
    
    if cita_existente:
        raise HTTPException(status_code=400, detail="Ya existe una cita a esa hora. Elige otro horario.")
    
    nueva = models.Cita(**cita.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@app.get("/citas", response_model=list[schemas.CitaResponse])
def obtener_citas(db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    return db.query(models.Cita).order_by(models.Cita.creado_en.desc()).all()

@app.get("/citas/disponibles")
def horarios_disponibles(fecha: str, db: Session = Depends(get_db)):
    """Devuelve las horas ocupadas para una fecha específica"""
    citas = db.query(models.Cita).filter(
        and_(
            models.Cita.fecha == fecha,
            models.Cita.estado != "cancelada"
        )
    ).all()
    
    horas_ocupadas = [cita.hora for cita in citas]
    return {"fecha": fecha, "horas_ocupadas": horas_ocupadas}

@app.put("/citas/{id}/estado")
def actualizar_estado(id: int, datos: schemas.CitaUpdateEstado, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    cita.estado = datos.estado
    db.commit()
    return {"mensaje": "Estado actualizado"}

@app.delete("/citas/{id}")
def eliminar_cita(id: int, db: Session = Depends(get_db), admin=Depends(get_admin_actual)):
    cita = db.query(models.Cita).filter(models.Cita.id == id).first()
    if not cita:
        raise HTTPException(status_code=404, detail="Cita no encontrada")
    db.delete(cita)
    db.commit()
    return {"mensaje": "Cita eliminada"}

@app.get("/info")
def obtener_info():
    return {
        "nombre": "Chucky Barber Shop",
        "direccion": "Av. Cuauhtémoc 1501-interior 103, Fátima, Plaza del Parque, 90300 Cdad. de Apizaco, Tlax.",
        "telefono": "241 140 1183",
        "horario": "Lunes a Domingo: 10:00 AM - 11:00 PM",
        "calificacion": 4.9,
        "opiniones": 103,
    }