import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # This allows connections from any IP
        port=8000,
        reload=True  # Enable auto-reload for development
    )