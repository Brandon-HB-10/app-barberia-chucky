from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UsuarioLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ServicioCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: int
    duracion_min: int = 60

class ServicioResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: int
    duracion_min: int
    activo: bool

    class Config:
        from_attributes = True

class CitaCreate(BaseModel):
    cliente_nombre: str
    cliente_telefono: str
    cliente_email: Optional[str] = None
    servicio_id: int
    servicio_nombre: str
    fecha: str
    hora: str
    notas: Optional[str] = None

class CitaResponse(BaseModel):
    id: int
    cliente_nombre: str
    cliente_telefono: str
    cliente_email: Optional[str]
    servicio_nombre: str
    fecha: str
    hora: str
    notas: Optional[str]
    estado: str
    creado_en: datetime

    class Config:
        from_attributes = True

class CitaUpdateEstado(BaseModel):
    estado: str