from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    es_admin = Column(Boolean, default=False)
    creado_en = Column(DateTime, server_default=func.now())

class Servicio(Base):
    __tablename__ = "servicios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(Text)
    precio = Column(Integer, nullable=False)
    duracion_min = Column(Integer, default=60)
    activo = Column(Boolean, default=True)

class Cita(Base):
    __tablename__ = "citas"
    id = Column(Integer, primary_key=True, index=True)
    cliente_nombre = Column(String, nullable=False)
    cliente_telefono = Column(String, nullable=False)
    cliente_email = Column(String)
    servicio_id = Column(Integer, nullable=False)
    servicio_nombre = Column(String, nullable=False)
    fecha = Column(String, nullable=False)
    hora = Column(String, nullable=False)
    notas = Column(Text)
    estado = Column(String, default="pendiente")
    agendado_por = Column(String, default="cliente")  # ← NUEVO: "cliente" o "admin"
    creado_en = Column(DateTime, server_default=func.now())