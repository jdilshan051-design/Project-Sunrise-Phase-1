// --- AI Service Integration Bridge for React ---

const AI_BACKEND_URL = "http://localhost:8000/ai/evaluate-telemetry";

export const fetchAIAnalysisForSensor = async (sensorId, sensorValues, flightPhase = "CRUISE", altitude = 36000) => {
  try {
    const response = await fetch(AI_BACKEND_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        sensor_id: sensorId,
        values: sensorValues, // e.g., [pressure, temperature, vibration, packet_loss, snr]
        flight_phase: flightPhase,
        altitude: altitude
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI evaluation from backend.");
    }

    const data = await response.json();
    return data.aiDecision; // Returns { severity, riskScore, reasoning, action }
    
  } catch (error) {
    console.error("AI Engine connection error:", error);
    return null;
  }
};