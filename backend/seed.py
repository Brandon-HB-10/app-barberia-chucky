import os
from dotenv import load_dotenv
from database import SessionLocal, engine, Base
from models import Usuario, Servicio
from auth import hashear_password

# Cargar variables de entorno
load_dotenv()

# Crear tablas
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas")

db = SessionLocal()

# Crear admin SOLO si no existe
admin_existente = db.query(Usuario).filter(Usuario.email == 'admin@chuckybarbershop.com').first()

if not admin_existente:
    admin_password = os.getenv("ADMIN_PASSWORD", "Chucky2026!")
    admin = Usuario(
        nombre="Chucky Barber",
        email="admin@chuckybarbershop.com",
        password=hashear_password(admin_password),
        es_admin=True
    )
    db.add(admin)
    print(f"✅ Admin creado")
else:
    print("ℹ️ Admin ya existe, no se creó de nuevo")

# Crear servicios de barbería
servicios = [
    Servicio(nombre="Corte Clásico", descripcion="Corte tradicional con tijera y máquina", precio=150, duracion_min=30),
    Servicio(nombre="Corte + Barba", descripcion="Combo completo: corte y arreglo de barba con navaja", precio=250, duracion_min=45),
    Servicio(nombre="Arreglo de Barba", descripcion="Delineado y perfilado con navaja al ras", precio=120, duracion_min=20),
    Servicio(nombre="Diseño y Rayas", descripcion="Diseños personalizados y rayas en el cabello", precio=180, duracion_min=40),
    Servicio(nombre="Corte Premium", descripcion="Corte + barba + mascarilla + bebida", precio=350, duracion_min=60),
    Servicio(nombre="Corte Infantil", descripcion="Corte para los pequeños diablillos", precio=120, duracion_min=30),
]

for servicio in servicios:
    db.add(servicio)

db.commit()
db.close()
print("✅ Servicios creados")