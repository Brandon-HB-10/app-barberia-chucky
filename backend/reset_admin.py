import os
from dotenv import load_dotenv
from database import SessionLocal
from models import Usuario
from auth import hashear_password

# Cargar variables de entorno
load_dotenv()

db = SessionLocal()

admin_password = os.getenv("ADMIN_PASSWORD", "Chucky2026!")

admin = db.query(Usuario).filter(Usuario.email == 'admin@chuckybarbershop.com').first()
if admin:
    admin.password = hashear_password(admin_password)
    db.commit()
    print(f'✅ Contraseña actualizada a: {admin_password}')
else:
    print('❌ Admin no encontrado')

db.close()