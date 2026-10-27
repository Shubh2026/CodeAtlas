from fastapi import FastAPI

app = FastAPI(title="CodeAtlas API")


@app.get("/")
def root():
    return {"message": "CodeAtlas API is running"}