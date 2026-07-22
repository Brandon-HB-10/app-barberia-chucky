from database import engine, Base
import models

# Crea todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas correctamente")