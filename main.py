import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.simulator import CabinSimulator

app = FastAPI(title="Project Sunrise Digital Twin Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = CabinSimulator(rows=15, cols=6)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/simulation")
async def simulation_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Run simulation tick
            sim_data = simulator.calculate_beamforming()
            payload = {
                "type": "SIMULATION_UPDATE",
                "seats": sim_data,
                "metrics": {
                    "avg_latency_ms": 18.5,
                    "active_satellites": "Starlink-Leo-Group-4",
                    "bandwidth_total_gbps": 10.4
                }
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(1.0) # Send update every 1 second
    except WebSocketDisconnect:
        manager.disconnect(websocket)