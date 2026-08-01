import React, { useState } from "react";

export default function AIView({ fleetConfig, onBackToHome }) {
  // Default to the first test available for the selected fleet
  const [activeDecision, setActiveDecision] = useState(
    fleetConfig?.aiTests ? fleetConfig.aiTests[0] : null
  );

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '750px', backgroundColor: '#070a12', borderRadius: '12px', border: '1px solid #1f2937', padding: '20px', fontFamily: 'Segoe UI, sans-serif', color: '#fff' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #1f2937', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', color: '#38bdf8' }}>
            Project Sunrise - Autonomous AI Diagnostic Engine [{fleetConfig.name}]
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Deep learning anomaly classification and reasoner feedback linked with {fleetConfig.kernel}.
          </div>
        </div>
        <button
          onClick={onBackToHome}
          style={{
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            border: '1px solid #334155',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back to Home / Fleet Switch
        </button>
      </div>

      {/* Main Grid Layout: Telemetry Control Panel (Left) & AI Decisions (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Panel: Dynamic Telemetry Control Panel */}
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '0.95rem', color: '#60a5fa' }}>Telemetry Control Panel</h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            Simulate live aircraft node signals for <strong>{fleetConfig.name}</strong> to evaluate via AI.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fleetConfig.aiTests && fleetConfig.aiTests.map((test, index) => {
              const isSelected = activeDecision?.id === test.id;
              const isCritical = test.riskLevel === 'HIGH' || test.riskLevel === 'MEDIUM';

              return (
                <button
                  key={test.id}
                  onClick={() => setActiveDecision(test)}
                  style={{
                    backgroundColor: isCritical ? '#7f1d1d' : '#1d4ed8',
                    color: '#fff',
                    border: isSelected ? '2px solid #fff' : '1px solid transparent',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {test.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Autonomous AI Decisions Output */}
        <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1f2937', borderRadius: '8px', padding: '20px', minHeight: '210px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '0.95rem', color: '#38bdf8' }}>Autonomous AI Decisions</h3>

          {activeDecision ? (
            <div style={{
              background: '#0b0f19',
              borderLeft: `4px solid ${activeDecision.statusColor}`,
              borderTop: '1px solid #1f2937',
              borderRight: '1px solid #1f2937',
              borderBottom: '1px solid #1f2937',
              borderRadius: '6px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
                Sensor: <span style={{ color: '#38bdf8' }}>{activeDecision.sensor}</span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: activeDecision.statusColor, marginBottom: '8px' }}>
                Action: {activeDecision.action}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '12px' }}>
                Reasoning: {activeDecision.reasoning}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: activeDecision.statusColor }}>
                Risk Level: {activeDecision.riskLevel}
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>
              Select a test action from the control panel to view AI diagnostics.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}