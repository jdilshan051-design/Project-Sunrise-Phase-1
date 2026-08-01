import React, { useState, useEffect, useRef } from "react";
import Cabin3DView from './components/Cabin3DView';
import cockpitBg from './assets/cockpit.jpg';

// Fully Expanded Mission-Critical Fleet & Autonomous AI Telemetry Dataset with 3D Spatial Coordinates
const fleets = [
  {
    id: "a350-1000",
    name: "A350-1000",
    manufacturer: "Airbus",
    type: "Wide-body Twin-engine",
    kernel: "CATIA V5 - Composite Aero Core",
    meshElements: "1,420,890",
    hydraulicsSpec: "Triple Independent 5000 PSI",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "Wing Root Stress Transducer A1", status: "NOMINAL", value: "99.4", unit: "Load Factor", color: "#34d399", x: -140, y: 15, z: 20 },
      { id: "n2", category: "Sensors", label: "Outer Aileron Deflection Sensor", status: "STABLE", value: "+2.1", unit: "Angle", color: "#38bdf8", x: -220, y: 25, z: 10 },
      { id: "n3", category: "Hydraulics", label: "Primary Flight Control Actuator HP", status: "OPTIMIZED", value: "4980", unit: "PSI", color: "#38bdf8", x: -40, y: -20, z: -10 },
      { id: "n4", category: "Hydraulics", label: "Secondary Spoiler Hydraulic Feed", status: "NOMINAL", value: "5010", unit: "PSI", color: "#34d399", x: 40, y: -25, z: -15 },
      { id: "n5", category: "Air Valves", label: "Trent XWB Bleed Air Regulator", status: "STABLE", value: "36.4", unit: "PSI", color: "#34d399", x: -80, y: -50, z: 25 },
      { id: "n6", category: "Air Valves", label: "Cabin Outflow Valve Control", status: "OPTIMIZED", value: "8.2", unit: "PSI Diff", color: "#38bdf8", x: 60, y: 40, z: 15 },
      { id: "n7", category: "Fuel Lines", label: "Main Wing Tank Feed Pressure", status: "STABLE", value: "48.2", unit: "PSI", color: "#34d399", x: -100, y: 10, z: -20 },
      { id: "n8", category: "Fuel Lines", label: "Center Fuselage Transfer Manifold", status: "OPTIMIZED", value: "52.0", unit: "PSI", color: "#38bdf8", x: 90, y: 15, z: -5 },
      { id: "n9", category: "Avionics", label: "Primary Flight Display Bus 1", status: "STABLE", value: "100.0", unit: "Gbps", color: "#34d399", x: 0, y: 80, z: 35 },
      { id: "n10", category: "Avionics", label: "Fly-By-Wire Triple Modular Processor", status: "NOMINAL", value: "0.12", unit: "ms Latency", color: "#34d399", x: 20, y: 70, z: 30 }
    ],
    aiTests: [
      {
        id: "a350_wing_stress",
        label: "Deep Neural Wing Stress & Fatigue Prediction",
        sensor: "Wing Root Stress Transducer A1",
        action: "AI PREDICTION: STRUCTURAL INTEGRITY 99.8%",
        reasoning: "Deep learning regression models indicate composite fatigue is well within safe boundaries under high-G maneuvers.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      },
      {
        id: "a350_hyd_spike",
        label: "Hydraulic Pressure Transient Analysis",
        sensor: "Primary Flight Control Actuator HP",
        action: "CRITICAL ALERT: BYPASS REGULATION",
        reasoning: "Micro-fluctuations detected in hydraulic loop 1. Autonomous flow balancing engaged to prevent cavitation.",
        riskLevel: "HIGH",
        statusColor: "#ef4444"
      }
    ]
  },
  {
    id: "b787-9",
    name: "B787-9",
    manufacturer: "Boeing",
    type: "Composite Wide-body Dreamliner",
    kernel: "CATIA 3DEXPERIENCE - Composite 787",
    meshElements: "1,380,000",
    hydraulicsSpec: "Electro-Hydraulic Architecture (PSI: 4500)",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "Composite Barrel Joint Strain Gage", status: "NOMINAL", value: "99.7", unit: "Integrity", color: "#34d399", x: 10, y: 10, z: 10 },
      { id: "n2", category: "Sensors", label: "Vertical Stabilizer Load Sensor", status: "STABLE", value: "1.1", unit: "Yaw", color: "#38bdf8", x: 210, y: -80, z: 60 },
      { id: "n3", category: "Hydraulics", label: "Electro-Hydraulic Actuator Bus A", status: "OPTIMIZED", value: "4490", unit: "PSI", color: "#38bdf8", x: -50, y: -30, z: -20 },
      { id: "n4", category: "Hydraulics", label: "Landing Gear Extension Actuator", status: "LOCKED", value: "3000", unit: "PSI", color: "#34d399", x: 0, y: -60, z: -50 },
      { id: "n5", category: "Air Valves", label: "Electric Bleed Air System (EBAS)", status: "OPTIMIZED", value: "98.5", unit: "% Eff", color: "#38bdf8", x: -90, y: 20, z: 20 },
      { id: "n6", category: "Air Valves", label: "Cabin Altitude Pressure Controller", status: "STABLE", value: "7.9", unit: "PSI", color: "#34d399", x: 20, y: 50, z: 30 },
      { id: "n7", category: "Fuel Lines", label: "GENx Fuel Flow Injector Node", status: "STABLE", value: "4200", unit: "pph", color: "#34d399", x: -120, y: -40, z: -10 },
      { id: "n8", category: "Fuel Lines", label: "Surge Tank Vent Valve Sensor", status: "NOMINAL", value: "14.7", unit: "PSI", color: "#34d399", x: 240, y: -100, z: 20 },
      { id: "n9", category: "Avionics", label: "Common Core System (CCS) Node 4", status: "STABLE", value: "10.0", unit: "Gbps", color: "#34d399", x: 0, y: 90, z: 40 },
      { id: "n10", category: "Avionics", label: "HUD Optical Waveguide Sync", status: "OPTIMIZED", value: "120", unit: "Hz", color: "#38bdf8", x: -15, y: 100, z: 45 }
    ],
    aiTests: [
      {
        id: "b787_composite",
        label: "Composite Fuselage Fatigue Analysis",
        sensor: "Composite Barrel Joint Strain Gage",
        action: "AI PREDICTION: STABLE",
        reasoning: "Acoustic emission sensors confirm zero delamination signatures across barrel joints. Structural matrix nominal.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      },
      {
        id: "b787_ebas",
        label: "Electric Bleed Air Thermal Equilibrium",
        sensor: "Electric Bleed Air System (EBAS)",
        action: "AI PREDICTION: OPTIMAL",
        reasoning: "Inverter thermal loads tracking within predicted bounds. Power draw balanced across dual generators.",
        riskLevel: "LOW",
        statusColor: "#38bdf8"
      }
    ]
  },
  {
    id: "a321xlr",
    name: "A321XLR",
    manufacturer: "Airbus",
    type: "Narrow-body Long-range",
    kernel: "CATIA V5 - Single Aisle Core",
    meshElements: "980,120",
    hydraulicsSpec: "Dual Hydraulic System (PSI: 3000)",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "Single-Aisle Frame Stress Node", status: "NOMINAL", value: "98.9", unit: "Load Limit", color: "#34d399", x: 0, y: 10, z: 10 },
      { id: "n2", category: "Hydraulics", label: "System 1 Flight Controls Actuator", status: "STABLE", value: "2990", unit: "PSI", color: "#34d399", x: -20, y: -10, z: -10 },
      { id: "n3", category: "Air Valves", label: "Pack 1 Flow Control Valve", status: "OPTIMIZED", value: "28.5", unit: "PPH", color: "#38bdf8", x: -40, y: 40, z: 20 },
      { id: "n4", category: "Fuel Lines", label: "Rear Centre Tank (RCT) Transfer Pump", status: "STABLE", value: "45.0", unit: "PSI", color: "#34d399", x: 120, y: -60, z: -20 },
      { id: "n5", category: "Avionics", label: "Autopilot Flight Management Computer", status: "STABLE", value: "100", unit: "% Redundancy", color: "#34d399", x: 0, y: 85, z: 35 }
    ],
    aiTests: [
      {
        id: "a321_rftt",
        label: "RCT Fuel Transfer Synchronization",
        sensor: "Rear Centre Tank (RCT) Transfer Pump",
        action: "AI PREDICTION: OPTIMAL FLOW",
        reasoning: "Long-range fuel transfer balancing algorithms operating at peak efficiency across auxiliary tanks.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      }
    ]
  },
  {
    id: "a380-800",
    name: "A380-800",
    manufacturer: "Airbus",
    type: "Double Deck Wide-body",
    kernel: "CATIA V5 - SuperJumbo Aero",
    meshElements: "1,890,000",
    hydraulicsSpec: "Quadruple Independent Systems",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "Upper Deck Floor Beam Strain Sensor", status: "NOMINAL", value: "99.6", unit: "Integrity", color: "#34d399", x: 0, y: 30, z: 30 },
      { id: "n2", category: "Hydraulics", label: "Quad Hydraulic Ring Main Alpha", status: "STABLE", value: "5000", unit: "PSI", color: "#34d399", x: -40, y: -20, z: -20 },
      { id: "n3", category: "Air Valves", label: "Upper Deck Outflow Valve 2", status: "STABLE", value: "8.5", unit: "PSI", color: "#34d399", x: 50, y: 50, z: 40 },
      { id: "n4", category: "Fuel Lines", label: "Inner Wing Tank Feed Booster", status: "OPTIMIZED", value: "50.2", unit: "PSI", color: "#38bdf8", x: -110, y: 10, z: -30 },
      { id: "n5", category: "Avionics", label: "Integrated Avionics Network Core", status: "STABLE", value: "100.0", unit: "Gbps", color: "#34d399", x: 0, y: 90, z: 45 }
    ],
    aiTests: [
      {
        id: "a380_deck",
        label: "Double Deck Structural Stress Test",
        sensor: "Upper Deck Floor Beam Strain Sensor",
        action: "AI PREDICTION: STABLE",
        reasoning: "Superjumbo fuselage stress mapping across dual-deck structure remains within optimal design thresholds.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      }
    ]
  },
  {
    id: "b737max",
    name: "B737MAX",
    manufacturer: "Boeing",
    type: "Single-Aisle Twin-engine",
    kernel: "CATIA 3DEXPERIENCE - 737 Core",
    meshElements: "920,400",
    hydraulicsSpec: "Dual Flight Control Hydraulic",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "Angle of Attack (AoA) Vane Sensor L", status: "NOMINAL", value: "+2.4", unit: "Pitch", color: "#34d399", x: -10, y: 110, z: 20 },
      { id: "n2", category: "Hydraulics", label: "System B Flight Control Pressure", status: "STABLE", value: "3010", unit: "PSI", color: "#34d399", x: 0, y: -20, z: -10 },
      { id: "n3", category: "Air Valves", label: "Engine 1 Bleed Regulator Valve", status: "STABLE", value: "32.1", unit: "PSI", color: "#34d399", x: -60, y: -40, z: -20 },
      { id: "n4", category: "Fuel Lines", label: "Main Fuel Manifold Pressure", status: "OPTIMIZED", value: "45.0", unit: "PSI", color: "#38bdf8", x: 40, y: 0, z: -10 },
      { id: "n5", category: "Avionics", label: "MCAS Triple Validator Module", status: "STABLE", value: "0.0", unit: "ms Latency", color: "#34d399", x: 0, y: 80, z: 30 }
    ],
    aiTests: [
      {
        id: "mcfs_test",
        label: "MCAS Neural Network Verification",
        sensor: "Angle of Attack (AoA) Vane Sensor L",
        action: "AI PREDICTION: SYMMETRICAL",
        reasoning: "Dual AoA vane telemetry cross-checked with redundant AI neural weights. Zero divergence detected.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      }
    ]
  },
  {
    id: "b777-9",
    name: "B777-9",
    manufacturer: "Boeing",
    type: "Wide-body Folding Wing",
    kernel: "CATIA 3DEXPERIENCE - AeroCore",
    meshElements: "1,450,200",
    hydraulicsSpec: "Quadruple Electro-Hydraulic",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "GE9X Fan Blade Tip Clearance Sensor", status: "OPTIMIZED", value: "1.4", unit: "mm Tol", color: "#38bdf8", x: -130, y: -30, z: -15 },
      { id: "n2", category: "Hydraulics", label: "Folding Wingtip Actuator Lock Pin", status: "LOCKED", value: "100", unit: "% Engaged", color: "#34d399", x: -250, y: 20, z: 10 },
      { id: "n3", category: "Air Valves", label: "High-Pressure Compressor Bleed Valve", status: "STABLE", value: "42.0", unit: "PSI", color: "#34d399", x: -120, y: -35, z: -10 },
      { id: "n4", category: "Fuel Lines", label: "High-Flow Spar Valve Actuator", status: "STABLE", value: "55.0", unit: "PSI", color: "#34d399", x: -90, y: 10, z: -20 },
      { id: "n5", category: "Avionics", label: "Fly-By-Wire Primary Flight Computer", status: "STABLE", value: "100.0", unit: "Gbps", color: "#34d399", x: 0, y: 90, z: 40 }
    ],
    aiTests: [
      {
        id: "b777x_fold_wing",
        label: "Folding Wingtip AI Safety Interlock",
        sensor: "Folding Wingtip Actuator Lock Pin",
        action: "AI PREDICTION: SECURE",
        reasoning: "Actuator mechanism telemetry and mechanical locking pins confirmed fully engaged prior to flight envelope expansion.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      }
    ]
  },
  {
    id: "b777-300er",
    name: "B777-300ER",
    manufacturer: "Boeing",
    type: "Long-Range Wide-body",
    kernel: "CATIA 3DEXPERIENCE - Legacy 777",
    meshElements: "1,290,000",
    hydraulicsSpec: "Triple Hydraulic System",
    aiNodes: [
      { id: "n1", category: "Sensors", label: "GE90-115B Turbine Gas Temperature", status: "STABLE", value: "620", unit: "°C EGT", color: "#34d399", x: -125, y: -25, z: -15 },
      { id: "n2", category: "Hydraulics", label: "Primary Flight Controls Hydraulic 3", status: "STABLE", value: "3000", unit: "PSI", color: "#34d399", x: 0, y: -10, z: -10 },
      { id: "n3", category: "Air Valves", label: "Cabin Pressure Outflow Valve", status: "STABLE", value: "8.0", unit: "PSI", color: "#34d399", x: 60, y: 50, z: 25 },
      { id: "n4", category: "Fuel Lines", label: "Engine Feed Manifold Valve", status: "OPTIMIZED", value: "48.0", unit: "PSI", color: "#38bdf8", x: -100, y: 0, z: -20 },
      { id: "n5", category: "Avionics", label: "Primary Engine Indicating Bus", status: "STABLE", value: "1.0", unit: "Gbps", color: "#34d399", x: 0, y: 80, z: 35 }
    ],
    aiTests: [
      {
        id: "ge90_test",
        label: "GE90 High-Thrust Neural Diagnostics",
        sensor: "GE90-115B Turbine Gas Temperature",
        action: "AI PREDICTION: NOMINAL",
        reasoning: "Exhaust gas temperature thermal margins verified via deep time-series forecasting models. Zero anomalies.",
        riskLevel: "LOW",
        statusColor: "#34d399"
      }
    ]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  
  // Independent state for 3D Twin View
  const [twinFleet, setTwinFleet] = useState(fleets[1]);

  // Independent state for AI Engine View
  const [aiFleet, setAiFleet] = useState(fleets[1]);
  const [activeDecision, setActiveDecision] = useState(fleets[1].aiTests[0]);
  const [liveNodes, setLiveNodes] = useState(fleets[1].aiNodes);

  // AI Telemetry Filter & Search states
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // 3D Model Rotation & Interaction states for sync movement
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Update AI nodes and default decision when aiFleet changes
  useEffect(() => {
    setLiveNodes(aiFleet.aiNodes);
    setActiveDecision(aiFleet.aiTests[0]);
  }, [aiFleet]);

  // Real-time second-by-second live fluctuation engine
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNodes(prevNodes => 
        prevNodes.map(node => {
          let updatedValue = node.value;
          const num = parseFloat(node.value);
          if (!isNaN(num)) {
            const delta = (Math.random() - 0.48) * 0.4;
            updatedValue = (num + delta).toFixed(1);
          }
          return { ...node, value: updatedValue };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter nodes based on category and search query
  const filteredNodes = liveNodes.filter(node => {
    const matchesCategory = activeCategory === "All" || node.category === activeCategory;
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Mouse/Touch Handlers for 3D Model Rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setRotation(prev => ({
      x: Math.max(-70, Math.min(70, prev.x - deltaY * 0.5)),
      y: (prev.y + deltaX * 0.5) % 360
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- VIEW 1: HOME SCREEN ---
  if (currentView === "home") {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `linear-gradient(to bottom, rgba(5, 7, 15, 0.75), rgba(5, 7, 15, 0.92)), url(${cockpitBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 2 }}>
          <span style={{ background: '#0284c7', color: '#e0f2fe', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', boxShadow: '0 0 15px rgba(2, 132, 199, 0.5)' }}>
            Mission-Critical Aerospace Intelligence
          </span>
          <h1 style={{ fontSize: '44px', color: '#38bdf8', margin: '15px 0 10px 0', letterSpacing: '1px', textShadow: '0 0 25px rgba(56, 189, 248, 0.5)' }}>
            Project Sunrise
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '15px', maxWidth: '650px', margin: '0 auto', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Select operational mode to launch the high-fidelity 3D digital twin or the autonomous AI diagnostic telemetry engine.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '30px', zIndex: '2', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div 
            onClick={() => setCurrentView('3d-twin')}
            style={{ 
              width: '350px', 
              background: 'rgba(11, 17, 32, 0.85)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.4)', 
              borderRadius: '16px', 
              padding: '30px', 
              cursor: 'pointer', 
              textAlign: 'center', 
              transition: 'all 0.3s ease',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✈️</div>
            <h3 style={{ color: '#38bdf8', margin: '0 0 10px 0', fontSize: '20px' }}>3D Digital Twin & Fleet</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '25px' }}>
              Access full aircraft wireframe model, multi-fleet selector, CATIA telemetry nodes, and live sensor health statuses.
            </p>
            <button style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '14px', boxShadow: '0 4px 15px rgba(2, 132, 199, 0.5)' }}>
              Launch 3D Twin
            </button>
          </div>

          <div 
            onClick={() => setCurrentView('ai-engine')}
            style={{ 
              width: '350px', 
              background: 'rgba(11, 17, 32, 0.85)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(239, 68, 68, 0.4)', 
              borderRadius: '16px', 
              padding: '30px', 
              cursor: 'pointer', 
              textAlign: 'center', 
              transition: 'all 0.3s ease',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤖</div>
            <h3 style={{ color: '#f87171', margin: '0 0 10px 0', fontSize: '20px' }}>Autonomous AI Engine</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '25px' }}>
              Evaluate live aircraft point-to-point node signals across all 7 fleets via deep learning anomaly classification with live updates.
            </p>
            <button style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '14px', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)' }}>
              Launch AI Engine
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: 3D DIGITAL TWIN & FLEET VIEW ---
  if (currentView === "3d-twin") {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#070913', color: '#ffffff', fontFamily: 'Segoe UI, sans-serif', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: '15px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button onClick={() => setCurrentView('home')} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                ← Home
              </button>
              <h2 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>
                {twinFleet.name} // CAD DIGITAL TWIN & SENSOR TELEMETRY
              </h2>
            </div>
            <div style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #34d399' }}>
              ● LIVE SYNC ACTIVE
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {fleets.map((f) => {
              const isSelected = twinFleet.id === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setTwinFleet(f)}
                  style={{
                    backgroundColor: isSelected ? '#0284c7' : '#0b0f19',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid #1e293b',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {f.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '15px', marginTop: '15px', flex: 1, overflow: 'hidden' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', fontSize: '12px' }}>
            <strong style={{ color: '#38bdf8', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '10px' }}>CATIA Telemetry Specs</strong>
            <div style={{ color: '#94a3b8', lineHeight: '1.9' }}>
              <div>Kernel: {twinFleet.kernel}</div>
              <div>Manufacturer: {twinFleet.manufacturer}</div>
              <div>Body Type: {twinFleet.type}</div>
              <div>Mesh Elements: {twinFleet.meshElements}</div>
              <div>Hydraulics: {twinFleet.hydraulicsSpec}</div>
            </div>
          </div>

          <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cabin3DView fleetConfig={twinFleet} isAiEngine={false} />
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <strong style={{ color: '#38bdf8', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
              {twinFleet.name} Sensor Health
            </strong>
            {twinFleet.aiTests.map((test) => (
              <div key={test.id} style={{ fontSize: '12px', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #34d399' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{test.sensor}</div>
                <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Status: {test.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: AUTONOMOUS AI ENGINE WITH 3D ROTATING SPATIAL SENSOR BADGES ---
  return (
    <div 
      style={{ width: '100vw', height: '100vh', backgroundColor: '#070913', color: '#ffffff', fontFamily: 'Segoe UI, sans-serif', padding: '15px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden', userSelect: 'none' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Header & AI Fleet Switcher Bar */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => setCurrentView('home')} style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
              ← Home
            </button>
            <h2 style={{ margin: 0, fontSize: '16px', color: '#38bdf8' }}>
              MISSION-CRITICAL AI DIAGNOSTIC ENGINE [{aiFleet.name}]
            </h2>
          </div>
          <div style={{ background: 'rgba(52, 211, 153, 0.15isComposite)', color: '#34d399', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #34d399' }}>
            ● 3D SPATIAL SENSOR SYNC ACTIVE (DRAG TO ROTATE MODEL)
          </div>
        </div>

        {/* AI Fleet Switcher for All Fleets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
          {fleets.map((f) => {
            const isSelected = aiFleet.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setAiFleet(f)}
                style={{
                  backgroundColor: isSelected ? '#0284c7' : '#0b0f19',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid #1e293b',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Workspace: 3 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 340px', gap: '15px', marginTop: '15px', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Column: Machine Learning Test Controls */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <strong style={{ color: '#38bdf8', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', fontSize: '13px' }}>
            ML Anomaly Injector
          </strong>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>
            Execute deep learning diagnostic sweeps for <strong>{aiFleet.name}</strong> ({aiFleet.kernel}).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
            {aiFleet.aiTests.map((test) => {
              const isSelected = activeDecision?.id === test.id;
              const isCritical = test.riskLevel === 'HIGH';

              return (
                <button
                  key={test.id}
                  onClick={() => setActiveDecision(test)}
                  style={{
                    backgroundColor: isCritical ? '#7f1d1d' : '#1d4ed8',
                    color: '#fff',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid transparent',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.5)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {test.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', background: '#0b0f19', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '11px', color: '#94a3b8' }}>
            <div style={{ color: '#38bdf8', fontWeight: 'bold', marginBottom: '4px' }}>3D Rotation Matrix</div>
            <div>Pitch (X): {rotation.x.toFixed(1)}°</div>
            <div>Yaw (Y): {rotation.y.toFixed(1)}°</div>
            <div>Mapped Nodes: {aiFleet.aiNodes.length} Active</div>
          </div>
        </div>

        {/* Center Column: Interactive 3D Model with Synchronized Rotating Sensor Badges */}
        <div 
          style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
        >
          {/* Top Search & Filter Bar */}
          <div style={{ padding: '12px 15px', background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }} onMouseDown={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text"
                placeholder="Search Sensor, Hydraulic or Valve..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: '#0b0f19',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#ffffff',
                  fontSize: '11px',
                  outline: 'none'
                }}
              />
              <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>CSV</button>
              <button style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>PDF</button>
            </div>

            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {["All", "Sensors", "Hydraulics", "Air Valves", "Fuel Lines", "Avionics"].map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: isActive ? '#0284c7' : '#0b0f19',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      border: isActive ? '1px solid #38bdf8' : '1px solid #1e293b',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Wireframe Display Area with Perspective Transform */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px', overflow: 'hidden' }}>
            
            {/* Rotating 3D Container holding both the Cabin model and the Spatial Badges */}
            <div style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}>
              
              {/* Core 3D Wireframe Component */}
              <Cabin3DView fleetConfig={aiFleet} isAiEngine={true} />

              {/* Synchronized 3D Spatial Sensor Badges that move alongside the 3D model */}
              {filteredNodes.map((node) => {
                // Apply trigonometric projection based on Y rotation so badges face correctly or track 3D positions
                return (
                  <div 
                    key={node.id}
                    style={{
                      position: 'absolute',
                      top: `calc(50% + ${node.y}px)`,
                      left: `calc(50% + ${node.x}px)`,
                      transform: `translateZ(${node.z}px) rotateY(${-rotation.y}deg) rotateX(${-rotation.x}deg)`,
                      background: 'rgba(15, 23, 42, 0.92)',
                      border: `1px solid ${node.color}`,
                      boxShadow: `0 0 12px ${node.color}55`,
                      padding: '5px 9px',
                      borderRadius: '6px',
                      fontSize: '9px',
                      color: '#ffffff',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <div style={{ color: node.color, fontWeight: 'bold' }}>● {node.label}</div>
                    <div style={{ color: '#cbd5e1' }}>{node.status} | {node.value} {node.unit}</div>
                  </div>
                );
              })}

            </div>

          </div>
        </div>

        {/* Right Column: Autonomous AI Critical Reasoning & Telemetry Matrix */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          <strong style={{ color: '#38bdf8', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '8px', fontSize: '13px' }}>
            Autonomous AI & Critical Reasoning
          </strong>

          {activeDecision ? (
            <div style={{
              background: '#0b0f19',
              borderLeft: `4px solid ${activeDecision.statusColor}`,
              border: '1px solid #1e293b',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>
                Sensor: <span style={{ color: '#38bdf8' }}>{activeDecision.sensor}</span>
              </div>
              <div style={{ fontWeight: '600', color: activeDecision.statusColor, marginBottom: '6px' }}>
                {activeDecision.action}
              </div>
              <div style={{ color: '#cbd5e1', lineHeight: '1.4', marginBottom: '8px', fontSize: '11px' }}>
                <strong>Critical Reasoning:</strong> {activeDecision.reasoning}
              </div>
              <div style={{ fontWeight: 'bold', color: activeDecision.statusColor, fontSize: '11px' }}>
                Risk Level: {activeDecision.riskLevel}
              </div>
            </div>
          ) : (
            <div style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '20px', fontSize: '11px' }}>
              Select a test action to view AI diagnostic insights.
            </div>
          )}

          <strong style={{ color: '#38bdf8', display: 'block', borderBottom: '1px solid #1e293b', paddingBottom: '6px', marginTop: '5px', fontSize: '12px' }}>
            Live Telemetry Matrix ({activeCategory}) [{filteredNodes.length} Active Nodes]
          </strong>

          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <div 
                key={node.id} 
                style={{ 
                  fontSize: '11px', 
                  color: '#e2e8f0', 
                  background: 'rgba(15, 23, 42, 0.7)', 
                  padding: '8px 10px', 
                  borderRadius: '6px', 
                  borderLeft: `3px solid ${node.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: node.color }}>{node.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: '10px' }}>Category: {node.category} | {node.status}</div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#38bdf8', fontSize: '11px' }}>
                  {node.value} <span style={{ fontSize: '9px', color: '#94a3b8' }}>{node.unit}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#6b7280', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>
              No nodes match the selected filter/search.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}