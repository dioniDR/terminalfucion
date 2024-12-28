from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import json
import logging
import subprocess
from .config.commands import ALLOWED_COMMANDS, get_help_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Terminal Fusion Server")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New connection. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"Connection closed. Total connections: {len(self.active_connections)}")

manager = ConnectionManager()

def handle_internal_command(command: str) -> str:
    cmd = command.strip().lower()

    if cmd == 'help':
        return get_help_text()
    elif cmd == 'clear':
        return '[CLEAR]'

    return None

async def execute_command(command: str) -> str:
    # Verificar comandos internos primero
    internal_result = handle_internal_command(command)
    if internal_result is not None:
        return internal_result

    # Verificar si el comando está permitido
    cmd = command.split()[0]
    if cmd not in ALLOWED_COMMANDS:
        return f"Error: Command '{cmd}' not allowed. Type 'help' for available commands."

    try:
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate()

        if process.returncode != 0:
            return f"Error: {stderr}"

        return stdout if stdout else "Command executed successfully"
    except Exception as e:
        return f"Error executing command: {str(e)}"

@app.get("/")
async def root():
    return {"message": "Terminal Fusion Server", "status": "running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                command_data = json.loads(data)
                command = command_data.get('command', '')
                logger.info(f"Received command: {command}")

                result = await execute_command(command)
                await websocket.send_text(result)
            except json.JSONDecodeError:
                await websocket.send_text("Error: Invalid JSON format")
    except WebSocketDisconnect:
        manager.disconnect(websocket)