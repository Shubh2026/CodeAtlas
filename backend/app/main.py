from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import zipfile
import shutil
from app.analyzer import analyze_project

app = FastAPI(title="CodeAtlas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
PROJECTS_DIR = Path("projects")

UPLOAD_DIR.mkdir(exist_ok=True)
PROJECTS_DIR.mkdir(exist_ok=True)


@app.get("/")
def root():
    return {"message": "CodeAtlas API is running"}


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "message": "CodeAtlas backend connected",
    }


@app.post("/api/projects/upload")
async def upload_project(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".zip"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a ZIP file."
        )

    zip_path = UPLOAD_DIR / file.filename

    with zip_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    project_name = Path(file.filename).stem
    project_path = PROJECTS_DIR / project_name

    project_path.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(project_path)
    except zipfile.BadZipFile:
        zip_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=400,
            detail="Invalid ZIP file."
        )

    return {
        "message": "Project uploaded successfully",
        "project": project_name,
    }
@app.get("/api/projects/{project_name}/analyze")
def analyze_uploaded_project(project_name: str):
    project_path = PROJECTS_DIR / project_name

    if not project_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Project not found."
        )

    return analyze_project(project_path)