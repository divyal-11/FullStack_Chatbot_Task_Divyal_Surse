import './Radar.css'

export default function Radar() {
  return (
    <div className="radar-container" aria-label="Aerial Survey Technical Radar Visual">
      <div className="radar-frame">
        {/* SVG concentric circles and technical coordinate grid */}
        <svg className="radar-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Background Grid Lines */}
          <line x1="200" y1="20" x2="200" y2="380" stroke="#4B5A6B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="#4B5A6B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Diagonal 45-degree angle reference lines */}
          <line x1="72" y1="72" x2="328" y2="328" stroke="#4B5A6B" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.25" />
          <line x1="328" y1="72" x2="72" y2="328" stroke="#4B5A6B" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.25" />

          {/* Three Concentric Circles */}
          {/* Outer Ring */}
          <circle cx="200" cy="200" r="170" stroke="#4B5A6B" strokeWidth="1.2" opacity="0.6" />
          {/* Middle Ring */}
          <circle cx="200" cy="200" r="115" stroke="#4B5A6B" strokeWidth="1" opacity="0.45" strokeDasharray="6 3" />
          {/* Inner Ring */}
          <circle cx="200" cy="200" r="58" stroke="#4B5A6B" strokeWidth="1" opacity="0.4" />

          {/* Precision Cardinal Tick Marks */}
          <line x1="200" y1="18" x2="200" y2="28" stroke="#F2A63C" strokeWidth="2" opacity="0.8" />
          <line x1="200" y1="372" x2="200" y2="382" stroke="#F2A63C" strokeWidth="2" opacity="0.8" />
          <line x1="18" y1="200" x2="28" y2="200" stroke="#F2A63C" strokeWidth="2" opacity="0.8" />
          <line x1="372" y1="200" x2="382" y2="200" stroke="#F2A63C" strokeWidth="2" opacity="0.8" />

          {/* Sage Sub-angle Ticks */}
          <circle cx="200" cy="85" r="2" fill="#7A9B7E" opacity="0.7" />
          <circle cx="200" cy="315" r="2" fill="#7A9B7E" opacity="0.7" />
          <circle cx="85" cy="200" r="2" fill="#7A9B7E" opacity="0.7" />
          <circle cx="315" cy="200" r="2" fill="#7A9B7E" opacity="0.7" />

          {/* Center Origin Point */}
          <circle cx="200" cy="200" r="4" fill="#F2A63C" />
          <circle cx="200" cy="200" r="8" stroke="#F2A63C" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* Continuous Amber Sweep Beam */}
        <div className="radar-sweep-beam">
          <div className="radar-sweep-line" />
        </div>

        {/* Survey Coordinates & Minimal Telemetry */}
        <div className="radar-readouts">
          <div className="radar-readout-top">
            <span className="radar-tag-sage">SURVEY SCAN • ACTIVE</span>
            <span className="radar-tag-amber">AZM 048°</span>
          </div>
          <div className="radar-readout-bottom">
            <span>GRID: UTM 43N</span>
            <span>ALT: 120M AGL</span>
          </div>
        </div>

        {/* Restrained Targets / Survey Points */}
        <div className="radar-target" style={{ top: '34%', left: '68%' }} title="Telemetry Target Alpha" />
        <div className="radar-target-2" style={{ top: '65%', left: '32%' }} title="Survey Checkpoint Bravo" />
      </div>
    </div>
  )
}
