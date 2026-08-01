from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np

app = FastAPI()

# Enable CORS for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Deep Learning Model (LSTM for Aircraft Telemetry & Sensor Prediction)
class AircraftSensorLSTM(nn.Module):
    def __init__(self, input_dim=5, hidden_dim=64, output_dim=1):
        super(AircraftSensorLSTM, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.linear = nn.Linear(hidden_dim, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.linear(out[:, -1, :])
        return self.sigmoid(out)  # Outputs risk value between 0 (Safe) and 1 (Critical Risk)

dl_model = AircraftSensorLSTM()
dl_model.eval()

# 2. Critical Thinking & Reasoning Agent (Autonomous Decision Layer)
def critical_thinking_agent(sensor_telemetry, dl_risk_score):
    flight_phase = sensor_telemetry.get('flight_phase', 'CRUISE')
    altitude = sensor_telemetry.get('altitude', 35000)
    
    reasoning_log = []
    recommended_action = "MONITOR"
    severity = "LOW"

    if dl_risk_score > 0.8:
        severity = "CRITICAL"
        if flight_phase == 'TAKEOFF':
            reasoning_log.append("Critical anomaly detected during takeoff phase! Immediate engine thrust reversal or abort recommended.")
            recommended_action = "ABORT_TAKEOFF_OR_ENG_SECURE"
        else:
            reasoning_log.append(f"High risk anomaly identified at {altitude}ft. Cross-checking secondary hydraulic loops and bleed valves.")
            recommended_action = "SWITCH_TO_SECONDARY_HYDRAULIC_VALVE"
    elif dl_risk_score > 0.5:
        severity = "WARNING"
        reasoning_log.append("Moderate pressure fluctuation in wing sensor node. System is automatically routing via redundancy.")
        recommended_action = "MONITOR_VALVE_FLOW"
    else:
        reasoning_log.append("All engine and wing sensor parameters operate within safe thresholds.")
        recommended_action = "STABLE"
        
    return {
        "severity": severity,
        "riskScore": round(float(dl_risk_score), 2),
        "reasoning": reasoning_log,
        "action": recommended_action
    }

# Request Body Model for /diagnose endpoint matching frontend payload
class DiagnoseInput(BaseModel):
    sensor_id: str
    telemetry_values: list  # Example: [value1, value2]
    flight_phase: str = "CRUISE"
    altitude: float = 35000.0

# 3. Main /diagnose Endpoint for Frontend
@app.post("/diagnose")
def diagnose_telemetry(data: DiagnoseInput):
    vals = data.telemetry_values
    # Ensure tensor input shape matches LSTM expected input dimension (5)
    if len(vals) < 5:
        vals = vals + [0.0] * (5 - len(vals))
    elif len(vals) > 5:
        vals = vals[:5]

    # Convert incoming telemetry list to PyTorch Tensor
    input_tensor = torch.tensor([vals], dtype=torch.float32).unsqueeze(0)
    
    with torch.no_grad():
        risk_score = dl_model(input_tensor).item()
        
    # Pass through Critical Thinking reasoning logic
    decision = critical_thinking_agent(
        {"flight_phase": data.flight_phase, "altitude": data.altitude}, 
        risk_score
    )
    
    # Return formatted response matching frontend expectations
    return {
        "sensor_id": data.sensor_id,
        "action": decision["action"],
        "reasoning": " ".join(decision["reasoning"]),
        "risk_level": decision["severity"],
        "riskScore": decision["riskScore"]
    }

# Legacy endpoint support
class TelemetryInput(BaseModel):
    sensor_id: str
    values: list
    flight_phase: str
    altitude: float

@app.post("/ai/evaluate-telemetry")
def evaluate_telemetry(data: TelemetryInput):
    input_tensor = torch.tensor([data.values], dtype=torch.float32).unsqueeze(0)
    
    with torch.no_grad():
        risk_score = dl_model(input_tensor).item()
        
    decision = critical_thinking_agent(
        {"flight_phase": data.flight_phase, "altitude": data.altitude}, 
        risk_score
    )
    
    return {
        "sensorId": data.sensor_id,
        "aiDecision": decision
    }