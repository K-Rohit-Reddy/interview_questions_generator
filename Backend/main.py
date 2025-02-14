from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.questions import router as questions_router
from routes.report import router as report_router
from routes.history import router as history_router

app = FastAPI()

# Add CORS middleware with all origins allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(questions_router, prefix="/questions")
app.include_router(report_router, prefix="/report")
app.include_router(history_router, prefix="/history")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)