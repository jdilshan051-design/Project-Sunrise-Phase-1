import numpy as np

class CabinSimulator:
    def __init__(self, rows=20, cols=6):
        self.rows = rows
        self.cols = cols
        # Initialize seat coordinates and signal qualities (SNR)
        self.seats = []
        for r in range(rows):
            for c in range(cols):
                self.seats.append({
                    "seat_id": f"{r+1}{chr(65+c)}",
                    "x": c * 1.0,  # Seat width spacing
                    "y": r * 1.2,  # Row spacing
                    "snr": 0.0,
                    "status": "connected"
                })

    def calculate_beamforming(self, antenna_pos=(0, -2), frequency_ghz=28.0):
        """
        Simulates Phased-Array Beamforming and Path Loss using Friis transmission equation
        and simple ray-tracing distance attenuation.
        """
        updated_seats = []
        for seat in self.seats:
            # Calculate distance from antenna to seat
            dx = seat["x"] - antenna_pos[0]
            dy = seat["y"] - antenna_pos[1]
            distance = np.sqrt(dx**2 + dy**2)
            
            # Path loss simulation (Inverse square law with atmospheric attenuation)
            path_loss = 20 * np.log10(max(distance, 0.5)) + 20 * np.log10(frequency_ghz) + 92.45
            
            # Simulated Signal-to-Noise Ratio (SNR) in dB (higher is better)
            snr = max(5.0, 45.0 - (path_loss * 0.15) + np.random.normal(0, 1.5))
            
            seat["snr"] = round(float(snr), 2)
            seat["path_loss"] = round(float(path_loss), 2)
            
            # Determine interference or drop risk
            if snr < 15.0:
                seat["status"] = "interference"
            else:
                seat["status"] = "optimal"
                
            updated_seats.append(seat)
            
        return updated_seats