# **SAG BACKEND**

## **Descripción**

Este es un proyecto backend basado en FastAPI, configurado para ejecutarse usando Docker Compose y un entorno virtual de Python. Incluye una estructura modular para facilitar la escalabilidad y el mantenimiento.

---

## **Requisitos Previos**

Asegúrate de tener instalado en tu sistema:

- [Python 3.11+](https://www.python.org/)
- [Docker y Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

---

## **Configuración del Proyecto**

### 1. Clonar el repositorio

```bash
git clone https://github.com/joacalderonm/SAGBackend.git
cd SAGBackend
```

### 2. Crear y activar el entorno virtual (opcional para desarrollo local)

#### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

#### Linux/Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar los requisitos del proyecto

Con el entorno virtual activado, ejecuta:

```bash
pip install -r sistema-viatico-backend/requirements.txt
```

---

## **Cómo correr la aplicación**

### **1. Levantar la base de datos y servicios con Docker**

Asegúrate de tener el archivo de backup de la base de datos en la ruta:

```
SistemaViaticosSag/Backup/SistemaViaticos.bak
```

Y el archivo `docker-compose.yaml` en:

```
SistemaViaticosSag/docker-compose.yaml
```

Luego, ejecuta en la terminal:

```bash
docker-compose up -d
```

Esto levantará los servicios y montará el backup de la base de datos.

---

### **2. Restaurar la base de datos en SQL Server dentro de Docker**

Accede al contenedor de SQL Server usando `sqlcmd`. Si no tienes `sqlcmd`, puedes instalarlo con:

```bash
winget install sqlcmd
```

Luego, conéctate al servidor SQL ejecutando:

```bash
sqlcmd -S localhost,5053 -U sa -P "12_Sag_201"
```

Dentro de la consola de `sqlcmd`, ejecuta lo siguiente para restaurar la base de datos:

```sql
RESTORE DATABASE SistemaViaticos
FROM DISK = '/var/opt/mssql/backups/SistemaViaticos.bak'
WITH
    MOVE 'SistemaViaticos' TO '/var/opt/mssql/data/SistemaViaticos.mdf',
    MOVE 'SistemaViaticos_log' TO '/var/opt/mssql/data/SistemaViaticos.ldf',
    REPLACE,
    STATS = 10;
GO
```

---

### **3. Correr la aplicación FastAPI**

Desde la carpeta `sistema-viatico-backend`, ejecuta:

```bash
uvicorn app.main:app --reload
```

Esto levantará el backend en modo desarrollo en [http://localhost:8000](http://localhost:8000)

---

### **4. Documentación y pruebas de la API**

Puedes acceder a la documentación interactiva de la API en:

- [http://localhost:8000/docs#/](http://localhost:8000/docs#/)

Aquí podrás ver y probar todas las rutas disponibles del sistema.

---
