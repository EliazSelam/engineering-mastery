// DiagramComponents.tsx — All 29 theory diagrams for DayPage
// Each component is a self-contained SVG diagram illustrating the day's key concept.
// Brand: Primary #FF6B35 | Secondary #004E89 | Accent #F7B801 | Bg #F8FAFC

import React from 'react';

const W = 560, H = 300;
const P = '#FF6B35', S = '#004E89', A = '#F7B801', G = '#10B981', R = '#EF4444';
const bg = '#F8FAFC', border = '#E2E8F0', txt = '#1E293B', muted = '#64748B';

const DiagramBase: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <div className="w-full rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: 320 }}>
      <rect width={W} height={H} fill={bg} />
      {title && <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight="700" fill={muted} fontFamily="system-ui">{title}</text>}
      {children}
    </svg>
  </div>
);

// ── Arrow helpers ──────────────────────────────────────────
const Arrow = ({ x1, y1, x2, y2, color = S }: { x1: number; y1: number; x2: number; y2: number; color?: string }) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const len = 8;
  const ax = x2 - len * Math.cos(angle - 0.4);
  const ay = y2 - len * Math.sin(angle - 0.4);
  const bx = x2 - len * Math.cos(angle + 0.4);
  const by = y2 - len * Math.sin(angle + 0.4);
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} /><polygon points={`${x2},${y2} ${ax},${ay} ${bx},${by}`} fill={color} /></g>;
};

const Box = ({ x, y, w, h, label, sub, fill = S, textColor = 'white', fontSize = 11 }: any) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} />
    <text x={x + w / 2} y={y + h / 2 - (sub ? 6 : 0)} textAnchor="middle" dominantBaseline="central" fontSize={fontSize} fontWeight="700" fill={textColor} fontFamily="system-ui">{label}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 8} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fill={textColor} fontFamily="system-ui" opacity={0.8}>{sub}</text>}
  </g>
);

const Circle = ({ cx, cy, r, label, fill = P, textColor = 'white' }: any) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={fill} />
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="900" fill={textColor} fontFamily="system-ui">{label}</text>
  </g>
);

// ═══════════════════════════════════════════════════════════════
// DAY 2 — PID Block Diagram
// ═══════════════════════════════════════════════════════════════
export const PIDDiagram: React.FC = () => (
  <DiagramBase title="PID Controller — Block Diagram">
    {/* Reference input */}
    <text x={30} y={155} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">r(t)</text>
    <Arrow x1={55} y1={150} x2={80} y2={150} />
    {/* Sum junction */}
    <circle cx={92} cy={150} r={12} fill="white" stroke={S} strokeWidth={2} />
    <text x={92} y={150} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="900" fill={S} fontFamily="system-ui">Σ</text>
    <text x={84} y={143} fontSize={9} fill={G} fontFamily="system-ui">+</text>
    <text x={84} y={160} fontSize={9} fill={R} fontFamily="system-ui">−</text>
    {/* Error */}
    <Arrow x1={104} y1={150} x2={135} y2={150} />
    <text x={118} y={144} fontSize={9} fill={muted} fontFamily="system-ui">e(t)</text>

    {/* PID box */}
    <Box x={135} y={120} w={90} h={60} label="PID" sub="Kp + Ki/s + Kd·s" fill={P} fontSize={13} />
    <Arrow x1={225} y1={150} x2={260} y2={150} />
    <text x={240} y={144} fontSize={9} fill={muted} fontFamily="system-ui">u(t)</text>

    {/* Plant box */}
    <Box x={260} y={120} w={90} h={60} label="Plant" sub="G(s)" fill={S} />
    <Arrow x1={350} y1={150} x2={400} y2={150} />
    <text x={375} y={144} fontSize={9} fill={muted} fontFamily="system-ui">y(t)</text>
    <text x={415} y={155} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">y(t)</text>

    {/* Feedback path */}
    <line x1={395} y1={150} x2={395} y2={230} stroke={S} strokeWidth={1.8} />
    <line x1={395} y1={230} x2={92} y2={230} stroke={S} strokeWidth={1.8} />
    <Arrow x1={92} y1={230} x2={92} y2={162} color={S} />
    <text x={240} y={248} textAnchor="middle" fontSize={10} fill={muted} fontFamily="system-ui">Feedback</text>

    {/* PID breakdown */}
    <rect x={135} y={50} width={26} height={18} rx={3} fill={G} opacity={0.8} />
    <text x={148} y={59} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill="white" fontFamily="system-ui">Kp</text>
    <rect x={167} y={50} width={26} height={18} rx={3} fill={A} opacity={0.9} />
    <text x={180} y={59} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill="white" fontFamily="system-ui">Ki</text>
    <rect x={199} y={50} width={26} height={18} rx={3} fill={P} opacity={0.9} />
    <text x={212} y={59} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill="white" fontFamily="system-ui">Kd</text>
    <text x={175} y={42} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Proportional · Integral · Derivative</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 3 — Pole-Zero s-Plane
// ═══════════════════════════════════════════════════════════════
export const PoleZeroSimulation: React.FC = () => (
  <DiagramBase title="Pole-Zero Map — s-Plane">
    {/* Axes */}
    <line x1={80} y1={150} x2={480} y2={150} stroke={border} strokeWidth={1.5} />
    <line x1={280} y1={40} x2={280} y2={260} stroke={border} strokeWidth={1.5} />
    <Arrow x1={80} y1={150} x2={490} y2={150} color={txt} />
    <Arrow x1={280} y1={260} x2={280} y2={32} color={txt} />
    <text x={496} y={154} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">σ</text>
    <text x={285} y={30} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">jω</text>
    <text x={268} y={155} textAnchor="middle" fontSize={10} fill={muted} fontFamily="system-ui">0</text>

    {/* Stable region */}
    <rect x={80} y={40} width={200} height={220} fill={G} fillOpacity={0.05} />
    <text x={140} y={268} fontSize={9} fill={G} fontFamily="system-ui" fontWeight="600">STABLE (Re &lt; 0)</text>
    <text x={340} y={268} fontSize={9} fill={R} fontFamily="system-ui" fontWeight="600">UNSTABLE (Re &gt; 0)</text>

    {/* Poles × */}
    {[[-80, -60], [-80, 60], [-140, 0]].map(([dx, dy], i) => (
      <g key={i}>
        <line x1={280 + dx - 8} y1={150 + dy - 8} x2={280 + dx + 8} y2={150 + dy + 8} stroke={R} strokeWidth={2.5} />
        <line x1={280 + dx + 8} y1={150 + dy - 8} x2={280 + dx - 8} y2={150 + dy + 8} stroke={R} strokeWidth={2.5} />
      </g>
    ))}

    {/* Zeros ○ */}
    {[[-40, 0]].map(([dx, dy], i) => (
      <circle key={i} cx={280 + dx} cy={150 + dy} r={8} fill="none" stroke={S} strokeWidth={2.5} />
    ))}

    {/* Legend */}
    <line x1={350} y1={90} x2={366} y2={90} stroke={R} strokeWidth={2} />
    <line x1={366} y1={82} x2={350} y2={98} stroke={R} strokeWidth={2} />
    <text x={372} y={94} fontSize={9} fill={txt} fontFamily="system-ui">Pole (×)</text>
    <circle cx={358} cy={115} r={6} fill="none" stroke={S} strokeWidth={2} />
    <text x={372} y={119} fontSize={9} fill={txt} fontFamily="system-ui">Zero (○)</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 4 — Bode Plot
// ═══════════════════════════════════════════════════════════════
export const BodeDiagramBase: React.FC = () => (
  <DiagramBase title="Bode Plot — Magnitude &amp; Phase">
    {/* Magnitude plot */}
    <text x={20} y={85} fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui" transform="rotate(-90,20,85)">|G| dB</text>
    <line x1={50} y1={40} x2={50} y2={140} stroke={border} strokeWidth={1.5} />
    <line x1={50} y1={140} x2={530} y2={140} stroke={border} strokeWidth={1.5} />
    {/* 0dB line */}
    <line x1={50} y1={90} x2={530} y2={90} stroke={border} strokeDasharray="4,3" strokeWidth={1} />
    <text x={35} y={93} fontSize={8} fill={muted} fontFamily="system-ui">0dB</text>
    {/* Magnitude curve */}
    <polyline points="50,60 150,60 300,90 530,140" fill="none" stroke={P} strokeWidth={2.5} />
    {/* -20dB/dec annotation */}
    <line x1={310} y1={88} x2={430} y2={118} stroke={A} strokeWidth={1.5} strokeDasharray="3,2" />
    <text x={375} y={105} fontSize={8} fill={A} fontWeight="700" fontFamily="system-ui">−20 dB/dec</text>
    <text x={200} y={56} fontSize={8} fill={S} fontFamily="system-ui">ωBW</text>
    <line x1={200} y1={60} x2={200} y2={140} stroke={S} strokeWidth={1} strokeDasharray="3,2" />

    {/* Phase plot */}
    <text x={20} y={225} fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui" transform="rotate(-90,20,225)">Phase°</text>
    <line x1={50} y1={165} x2={50} y2={270} stroke={border} strokeWidth={1.5} />
    <line x1={50} y1={270} x2={530} y2={270} stroke={border} strokeWidth={1.5} />
    <line x1={50} y1={220} x2={530} y2={220} stroke={border} strokeDasharray="4,3" strokeWidth={1} />
    <text x={30} y={222} fontSize={8} fill={muted} fontFamily="system-ui">−90°</text>
    {/* Phase curve */}
    <path d="M50,172 Q150,172 250,220 Q350,255 530,260" fill="none" stroke={S} strokeWidth={2.5} />
    {/* Phase margin annotation */}
    <line x1={200} y1={165} x2={200} y2={270} stroke={S} strokeWidth={1} strokeDasharray="3,2" />
    <text x={205} y={185} fontSize={8} fill={G} fontFamily="system-ui">PM</text>
    {/* Frequency axis label */}
    <text x={540} y={273} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">ω</text>
    <text x={540} y={143} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">ω</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 5 — Nyquist Diagram
// ═══════════════════════════════════════════════════════════════
export const NyquistDiagram: React.FC = () => (
  <DiagramBase title="Nyquist Plot — Stability via Encirclement">
    <line x1={60} y1={150} x2={500} y2={150} stroke={border} strokeWidth={1.5} />
    <line x1={280} y1={30} x2={280} y2={270} stroke={border} strokeWidth={1.5} />
    <Arrow x1={60} y1={150} x2={508} y2={150} color={txt} />
    <Arrow x1={280} y1={270} x2={280} y2={22} color={txt} />
    <text x={514} y={154} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Re</text>
    <text x={285} y={20} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Im</text>

    {/* Nyquist curve */}
    <path d="M480,150 Q420,80 340,100 Q260,120 220,150 Q180,180 200,210 Q240,260 310,230 Q370,205 380,165 Q390,140 420,150 Q450,158 480,150"
      fill="none" stroke={P} strokeWidth={2.5} />
    {/* Mirror (negative freq) */}
    <path d="M480,150 Q450,142 420,150 Q390,160 380,135 Q370,95 310,70 Q240,40 200,90 Q180,120 220,150 Q260,180 340,200 Q420,220 480,150"
      fill="none" stroke={P} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.5} />

    {/* Critical point -1+0j */}
    <circle cx={180} cy={150} r={7} fill={R} />
    <text x={162} y={168} fontSize={9} fontWeight="700" fill={R} fontFamily="system-ui">−1+j0</text>

    {/* Winding number annotation */}
    <text x={300} y={170} fontSize={9} fill={muted} fontFamily="system-ui">N=0 → Stable</text>

    {/* Labels */}
    <text x={65} y={155} fontSize={9} fill={muted} fontFamily="system-ui">ω→∞</text>
    <text x={460} y={145} fontSize={9} fill={muted} fontFamily="system-ui">ω=0</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 6 — State Space Block Diagram
// ═══════════════════════════════════════════════════════════════
export const StateSpaceDiagram: React.FC = () => (
  <DiagramBase title="State-Space Representation  ẋ = Ax + Bu,  y = Cx + Du">
    {/* u(t) input */}
    <text x={30} y={155} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">u(t)</text>
    <Arrow x1={55} y1={150} x2={90} y2={150} />

    {/* B matrix */}
    <Box x={90} y={125} w={55} h={50} label="B" fill={G} fontSize={16} />
    <Arrow x1={145} y1={150} x2={185} y2={150} />

    {/* Summation */}
    <circle cx={198} cy={150} r={13} fill="white" stroke={S} strokeWidth={2} />
    <text x={198} y={150} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="900" fill={S} fontFamily="system-ui">Σ</text>
    <Arrow x1={211} y1={150} x2={245} y2={150} />

    {/* Integrator 1/s */}
    <Box x={245} y={125} w={65} h={50} label="∫" sub="1/s" fill={P} fontSize={18} />
    <Arrow x1={310} y1={150} x2={355} y2={150} />
    <text x={330} y={143} fontSize={10} fontWeight="700" fill={S} fontFamily="system-ui">x(t)</text>

    {/* C matrix */}
    <Box x={355} y={125} w={55} h={50} label="C" fill={S} fontSize={16} />
    <Arrow x1={410} y1={150} x2={450} y2={150} />
    <text x={462} y={155} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">y(t)</text>

    {/* A matrix feedback */}
    <Box x={245} y={230} w={65} h={40} label="A" fill={A} textColor={txt} fontSize={16} />
    <line x1={330} y1={150} x2={330} y2={250} stroke={A} strokeWidth={1.8} />
    <Arrow x1={330} y1={250} x2={310} y2={250} color={A} />
    <line x1={245} y1={250} x2={198} y2={250} stroke={A} strokeWidth={1.8} />
    <Arrow x1={198} y1={250} x2={198} y2={163} color={A} />

    {/* D matrix feedthrough */}
    <Box x={90} y={230} w={55} h={40} label="D" fill={muted} fontSize={16} />
    <line x1={70} y1={150} x2={70} y2={250} stroke={muted} strokeWidth={1.5} />
    <Arrow x1={70} y1={250} x2={90} y2={250} color={muted} />
    <line x1={145} y1={250} x2={440} y2={250} stroke={muted} strokeWidth={1.5} />
    <Arrow x1={440} y1={250} x2={440} y2={163} color={muted} />
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 7 — Control Hierarchy
// ═══════════════════════════════════════════════════════════════
export const ControlHierarchy: React.FC = () => (
  <DiagramBase title="Control System Hierarchy — Layers">
    {[
      { y: 45, label: "Mission / Goal", sub: "High-level objective", fill: S, w: 320 },
      { y: 105, label: "Path Planning", sub: "Trajectory generation", fill: '#1D4ED8', w: 280 },
      { y: 165, label: "Controller (PID / LQR)", sub: "Error minimization", fill: P, w: 240 },
      { y: 225, label: "Actuator Drive", sub: "PWM / Amplifier", fill: G, w: 200 },
    ].map(({ y, label, sub, fill, w }) => (
      <g key={y}>
        <rect x={(W - w) / 2} y={y} width={w} height={48} rx={8} fill={fill} />
        <text x={W / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight="800" fill="white" fontFamily="system-ui">{label}</text>
        <text x={W / 2} y={y + 35} textAnchor="middle" fontSize={9} fill="white" opacity={0.8} fontFamily="system-ui">{sub}</text>
      </g>
    ))}
    {[93, 153, 213].map(y => (
      <Arrow key={y} x1={W / 2} y1={y} x2={W / 2} y2={y + 12} color="white" />
    ))}
    <text x={W - 60} y={71} fontSize={9} fill={muted} fontFamily="system-ui">slow</text>
    <text x={W - 60} y={251} fontSize={9} fill={muted} fontFamily="system-ui">fast</text>
    <Arrow x1={W - 65} y1={60} x2={W - 65} y2={260} color={muted} />
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 8 — Ziegler-Nichols Table
// ═══════════════════════════════════════════════════════════════
export const ZieglerTable: React.FC = () => (
  <DiagramBase title="Ziegler-Nichols Tuning Rules">
    {/* Table header */}
    {['Controller', 'Kp', 'Ti', 'Td'].map((h, i) => (
      <rect key={i} x={50 + i * 120} y={45} width={118} height={34} rx={0} fill={S} />
    ))}
    {['Controller', 'Kp', 'Ti', 'Td'].map((h, i) => (
      <text key={i} x={109 + i * 120} y={62} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="800" fill="white" fontFamily="system-ui">{h}</text>
    ))}

    {/* Rows */}
    {[
      ['P',   '0.5 Ku',       '∞',        '0'],
      ['PI',  '0.45 Ku',      'Pu / 1.2', '0'],
      ['PID', '0.6 Ku',       'Pu / 2',   'Pu / 8'],
    ].map((row, ri) => {
      const fill = ri % 2 === 0 ? '#EFF6FF' : '#F8FAFC';
      return (
        <g key={ri}>
          {row.map((cell, ci) => (
            <g key={ci}>
              <rect x={50 + ci * 120} y={79 + ri * 44} width={118} height={42} fill={fill} />
              <line x1={50 + ci * 120} y1={79 + ri * 44} x2={168 + ci * 120} y2={79 + ri * 44} stroke={border} strokeWidth={1} />
              <text x={109 + ci * 120} y={100 + ri * 44} textAnchor="middle" dominantBaseline="central"
                fontSize={ci === 0 ? 13 : 11} fontWeight={ci === 0 ? '800' : '600'}
                fill={ci === 0 ? P : txt} fontFamily="system-ui">{cell}</text>
            </g>
          ))}
        </g>
      );
    })}

    {/* Border */}
    <rect x={50} y={45} width={480} height={171} fill="none" stroke={border} strokeWidth={1.5} rx={2} />

    {/* Legend */}
    <text x={280} y={250} textAnchor="middle" fontSize={10} fill={muted} fontFamily="system-ui">
      Ku = ultimate gain · Pu = oscillation period at Ku
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 9 — BLDC Motor Diagram
// ═══════════════════════════════════════════════════════════════
export const BLDCDiagram: React.FC = () => (
  <DiagramBase title="BLDC Motor — 3-Phase Commutation">
    {/* Motor cross section */}
    <circle cx={200} cy={150} r={95} fill="#1E293B" stroke={S} strokeWidth={2} />
    <circle cx={200} cy={150} r={45} fill={bg} stroke={border} strokeWidth={2} />
    <text x={200} y={150} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Rotor</text>
    <text x={200} y={164} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">(Permanent Magnet)</text>

    {/* Stator phases */}
    {[
      { angle: -90, label: 'A', color: P },
      { angle: 30, label: 'B', color: G },
      { angle: 150, label: 'C', color: A },
    ].map(({ angle, label, color }) => {
      const r1 = 50, r2 = 92;
      const a = angle * Math.PI / 180;
      return (
        <g key={label}>
          <line x1={200 + r1 * Math.cos(a)} y1={150 + r1 * Math.sin(a)}
            x2={200 + r2 * Math.cos(a)} y2={150 + r2 * Math.sin(a)}
            stroke={color} strokeWidth={8} strokeLinecap="round" />
          <text x={200 + 110 * Math.cos(a)} y={150 + 110 * Math.sin(a)}
            textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="900" fill={color} fontFamily="system-ui">{label}</text>
        </g>
      );
    })}

    {/* Commutation sequence */}
    <text x={360} y={55} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">Commutation Sequence</text>
    {[
      { step: '1', state: 'A+  B−  C0', y: 75 },
      { step: '2', state: 'A+  B0  C−', y: 100 },
      { step: '3', state: 'A0  B+  C−', y: 125 },
      { step: '4', state: 'A−  B+  C0', y: 150 },
      { step: '5', state: 'A−  B0  C+', y: 175 },
      { step: '6', state: 'A0  B−  C+', y: 200 },
    ].map(({ step, state, y }) => (
      <g key={step}>
        <rect x={345} y={y - 12} width={170} height={20} rx={4} fill={parseInt(step) % 2 ? '#EFF6FF' : '#F8FAFC'} />
        <text x={355} y={y} fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">{step}.</text>
        <text x={370} y={y} fontSize={9} fill={txt} fontFamily="system-ui">{state}</text>
      </g>
    ))}

    {/* Hall sensor label */}
    <text x={200} y={265} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Hall Sensors detect rotor position → trigger next commutation step</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 10 — FOC Block Diagram
// ═══════════════════════════════════════════════════════════════
export const FOCBlockDiagram: React.FC = () => (
  <DiagramBase title="Field-Oriented Control (FOC) — Block Diagram">
    {/* Input refs */}
    <text x={20} y={95} fontSize={9} fontWeight="700" fill={P} fontFamily="system-ui">Id*=0</text>
    <text x={20} y={185} fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">Iq*</text>
    <Arrow x1={50} y1={90} x2={75} y2={90} />
    <Arrow x1={50} y1={180} x2={75} y2={180} />

    {/* PI controllers */}
    <Box x={75} y={68} w={65} h={44} label="PI" sub="d-axis" fill={P} fontSize={12} />
    <Box x={75} y={158} w={65} h={44} label="PI" sub="q-axis" fill={S} fontSize={12} />
    <text x={60} y={90} fontSize={8} fill={muted} fontFamily="system-ui">+−</text>
    <text x={60} y={180} fontSize={8} fill={muted} fontFamily="system-ui">+−</text>

    {/* Vd, Vq labels */}
    <Arrow x1={140} y1={90} x2={170} y2={90} />
    <Arrow x1={140} y1={180} x2={170} y2={180} />
    <text x={147} y={83} fontSize={8} fill={muted} fontFamily="system-ui">Vd</text>
    <text x={147} y={173} fontSize={8} fill={muted} fontFamily="system-ui">Vq</text>

    {/* Inverse Park */}
    <Box x={170} y={110} w={70} h={60} label="Park⁻¹" sub="d,q→α,β" fill={G} fontSize={10} />
    <Arrow x1={240} y1={140} x2={270} y2={140} />

    {/* SVPWM */}
    <Box x={270} y={115} w={70} h={50} label="SVPWM" fill={A} textColor={txt} fontSize={10} />
    <Arrow x1={340} y1={140} x2={375} y2={140} />

    {/* Inverter */}
    <Box x={375} y={115} w={65} h={50} label="3φ" sub="Inverter" fill={'#334155'} fontSize={12} />
    <Arrow x1={440} y1={140} x2={480} y2={140} />
    <text x={484} y={144} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">M</text>

    {/* Feedback: Clarke → Park */}
    <Box x={320} y={230} w={65} h={36} label="Clarke" sub="abc→α,β" fill={G} fontSize={9} />
    <Box x={215} y={230} w={65} h={36} label="Park" sub="α,β→d,q" fill={G} fontSize={9} />
    <line x1={440} y1={165} x2={440} y2={248} stroke={G} strokeWidth={1.5} />
    <Arrow x1={440} y1={248} x2={385} y2={248} color={G} />
    <Arrow x1={320} y1={248} x2={280} y2={248} color={G} />
    <Arrow x1={215} y1={248} x2={175} y2={248} color={G} />
    <line x1={175} y1={248} x2={108} y2={248} stroke={G} strokeWidth={1.5} />
    <line x1={108} y1={248} x2={108} y2={90} stroke={P} strokeWidth={1.5} strokeDasharray="3,2" />
    <line x1={108} y1={248} x2={108} y2={180} stroke={S} strokeWidth={1.5} strokeDasharray="3,2" />
    <Arrow x1={108} y1={90} x2={75} y2={90} color={P} />
    <Arrow x1={108} y1={180} x2={75} y2={180} color={S} />

    {/* θ (rotor angle) */}
    <text x={290} y={270} fontSize={9} fill={muted} fontFamily="system-ui">θ (rotor angle)</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 11 — Kinematics Diagram
// ═══════════════════════════════════════════════════════════════
export const KinematicsDiagram: React.FC = () => (
  <DiagramBase title="Robot Arm — Forward Kinematics  T = A₁·A₂·…·Aₙ">
    {/* Base */}
    <rect x={230} y={250} width={100} height={20} rx={4} fill={S} />
    <text x={280} y={262} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="white" fontFamily="system-ui">Base (World Frame)</text>

    {/* Link 1 */}
    <line x1={280} y1={250} x2={200} y2={170} stroke={P} strokeWidth={10} strokeLinecap="round" />
    <circle cx={280} cy={250} r={10} fill={S} stroke="white" strokeWidth={2} />
    <text x={253} y={210} fontSize={9} fontWeight="700" fill={P} fontFamily="system-ui" transform="rotate(-40,253,210)">L₁ = 120mm</text>
    <text x={290} y={248} fontSize={8} fill={A} fontFamily="system-ui">θ₁</text>

    {/* Link 2 */}
    <line x1={200} y1={170} x2={300} y2={110} stroke={G} strokeWidth={8} strokeLinecap="round" />
    <circle cx={200} cy={170} r={9} fill={S} stroke="white" strokeWidth={2} />
    <text x={248} y={130} fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui" transform="rotate(-30,248,130)">L₂ = 100mm</text>
    <text x={208} y={168} fontSize={8} fill={A} fontFamily="system-ui">θ₂</text>

    {/* End effector */}
    <circle cx={300} cy={110} r={12} fill={A} stroke="white" strokeWidth={2} />
    <text x={300} y={110} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="800" fill={txt} fontFamily="system-ui">EE</text>
    <text x={318} y={105} fontSize={9} fill={A} fontFamily="system-ui">P(x,y)</text>

    {/* DH frame annotation */}
    <text x={100} y={55} fontSize={10} fontWeight="700" fill={S} fontFamily="system-ui">Forward Kinematics:</text>
    <text x={100} y={75} fontSize={10} fill={txt} fontFamily="system-ui">x = L₁cos(θ₁) + L₂cos(θ₁+θ₂)</text>
    <text x={100} y={95} fontSize={10} fill={txt} fontFamily="system-ui">y = L₁sin(θ₁) + L₂sin(θ₁+θ₂)</text>

    {/* Workspace ellipse */}
    <ellipse cx={280} cy={180} rx={130} ry={130} fill="none" stroke={muted} strokeDasharray="5,4" strokeWidth={1.2} opacity={0.4} />
    <text x={395} y={180} fontSize={8} fill={muted} fontFamily="system-ui">Workspace</text>

    {/* Angle arcs */}
    <path d="M280,230 A20,20 0 0 0 264,244" fill="none" stroke={A} strokeWidth={1.5} />
    <path d="M200,152 A18,18 0 0 0 214,163" fill="none" stroke={A} strokeWidth={1.5} />
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 12 — Dynamics Diagram
// ═══════════════════════════════════════════════════════════════
export const DynamicsDiagram: React.FC = () => (
  <DiagramBase title="Rigid Body Dynamics — Newton-Euler  τ = M(q)q̈ + C(q,q̇)q̇ + g(q)">
    {/* τ input */}
    <text x={30} y={155} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">τ</text>
    <Arrow x1={50} y1={150} x2={85} y2={150} />

    {/* Equation blocks */}
    <Box x={85} y={118} w={100} h={64} label="M(q)q̈" sub="Inertia Matrix" fill={P} fontSize={11} />
    <text x={140} y={200} textAnchor="middle" fontSize={9} fill={P} fontFamily="system-ui">Inertia</text>
    <Arrow x1={185} y1={150} x2={215} y2={150} />

    <circle cx={228} cy={150} r={13} fill="white" stroke={S} strokeWidth={2} />
    <text x={228} y={150} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="900" fill={S} fontFamily="system-ui">+</text>
    <Arrow x1={241} y1={150} x2={275} y2={150} />

    <Box x={275} y={118} w={100} h={64} label="C(q,q̇)q̇" sub="Coriolis" fill={G} fontSize={10} />
    <Arrow x1={375} y1={150} x2={405} y2={150} />

    <circle cx={418} cy={150} r={13} fill="white" stroke={S} strokeWidth={2} />
    <text x={418} y={150} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="900" fill={S} fontFamily="system-ui">+</text>
    <Arrow x1={431} y1={150} x2={465} y2={150} />

    <Box x={465} y={128} w={60} h={44} label="g(q)" sub="Gravity" fill={A} textColor={txt} fontSize={11} />

    {/* q̈ output */}
    <Arrow x1={525} y1={150} x2={545} y2={150} />
    <text x={546} y={146} fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">q̈</text>

    {/* Integrators */}
    <text x={280} y={248} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">q̈  →  ∫  →  q̇  →  ∫  →  q</text>
    <line x1={280} y1={170} x2={280} y2={238} stroke={muted} strokeWidth={1.2} strokeDasharray="3,2" />
    <Arrow x1={280} y1={238} x2={280} y2={228} color={muted} />

    {/* Legend */}
    <text x={30} y={272} fontSize={9} fill={muted} fontFamily="system-ui">q = joint angles   M = mass matrix   C = centripetal/Coriolis   g = gravity vector</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 13 — Path Planning Diagram
// ═══════════════════════════════════════════════════════════════
export const PathPlanningDiagram: React.FC = () => (
  <DiagramBase title="Path Planning — Obstacle Avoidance with Via Points">
    {/* Grid */}
    {Array.from({ length: 9 }, (_, i) => (
      <line key={`v${i}`} x1={60 + i * 55} y1={40} x2={60 + i * 55} y2={260} stroke={border} strokeWidth={0.8} />
    ))}
    {Array.from({ length: 5 }, (_, i) => (
      <line key={`h${i}`} x1={60} y1={40 + i * 55} x2={500} y2={40 + i * 55} stroke={border} strokeWidth={0.8} />
    ))}

    {/* Obstacles */}
    {[{ cx: 225, cy: 150, r: 40 }, { cx: 340, cy: 100, r: 30 }].map(({ cx, cy, r }, i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={R} fillOpacity={0.15} stroke={R} strokeWidth={2} strokeDasharray="4,2" />
    ))}

    {/* Start */}
    <circle cx={80} cy={220} r={14} fill={G} />
    <text x={80} y={220} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="800" fill="white" fontFamily="system-ui">S</text>
    <text x={80} y={243} textAnchor="middle" fontSize={8} fill={G} fontFamily="system-ui">Start</text>

    {/* Goal */}
    <circle cx={480} cy={80} r={14} fill={P} />
    <text x={480} y={80} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="800" fill="white" fontFamily="system-ui">G</text>
    <text x={480} y={103} textAnchor="middle" fontSize={8} fill={P} fontFamily="system-ui">Goal</text>

    {/* Via points */}
    {[{ x: 150, y: 180 }, { x: 200, y: 240 }, { x: 295, y: 225 }, { x: 370, y: 190 }, { x: 420, y: 130 }].map(({ x, y }, i) => (
      <circle key={i} cx={x} cy={y} r={5} fill={A} />
    ))}

    {/* Path */}
    <polyline points="80,220 150,180 200,240 295,225 370,190 420,130 480,80"
      fill="none" stroke={P} strokeWidth={2.5} strokeDasharray="0" />

    {/* Direct path (blocked) */}
    <line x1={80} y1={220} x2={480} y2={80} stroke={R} strokeWidth={1.5} strokeDasharray="6,4" opacity={0.4} />
    <text x={250} y={170} fontSize={8} fill={R} fontFamily="system-ui" transform="rotate(-18,250,170)">Direct path blocked</text>

    <text x={280} y={270} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Trapezoidal velocity profile along via-point path</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 14 — Robotics Project Overview
// ═══════════════════════════════════════════════════════════════
export const RoboticsProjectDiagram: React.FC = () => (
  <DiagramBase title="Pick &amp; Place Robot — System Architecture">
    {/* Layers */}
    {[
      { y: 45, label: '👁  Vision / Sensor', sub: 'Camera + Hall sensors', fill: S },
      { y: 105, label: '🧠  Perception', sub: 'Object detection + pose estimation', fill: '#1D4ED8' },
      { y: 165, label: '📐  Motion Planning', sub: 'IK + path planning + collision', fill: P },
      { y: 225, label: '🤖  Execution', sub: 'Joint torque + gripper control', fill: G },
    ].map(({ y, label, sub, fill }) => (
      <g key={y}>
        <rect x={100} y={y} width={360} height={48} rx={8} fill={fill} />
        <text x={280} y={y + 18} textAnchor="middle" fontSize={12} fontWeight="800" fill="white" fontFamily="system-ui">{label}</text>
        <text x={280} y={y + 34} textAnchor="middle" fontSize={9} fill="white" opacity={0.8} fontFamily="system-ui">{sub}</text>
      </g>
    ))}
    {[93, 153, 213].map(y => (
      <Arrow key={y} x1={280} y1={y} x2={280} y2={y + 12} color="white" />
    ))}
    {/* Feedback arrow */}
    <line x1={460} y1={249} x2={490} y2={249} stroke={A} strokeWidth={1.8} />
    <line x1={490} y1={249} x2={490} y2={69} stroke={A} strokeWidth={1.8} />
    <Arrow x1={490} y1={69} x2={460} y2={69} color={A} />
    <text x={506} y={165} fontSize={9} fill={A} fontFamily="system-ui" fontWeight="700" transform="rotate(90,506,165)">Feedback</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 15 — Sampling Diagram
// ═══════════════════════════════════════════════════════════════
export const SamplingDiagram: React.FC = () => (
  <DiagramBase title="Nyquist-Shannon Sampling Theorem  fs &gt; 2·fmax">
    {/* Continuous signal */}
    <text x={55} y={65} fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">Continuous x(t)</text>
    {Array.from({ length: 120 }, (_, i) => {
      const x = 50 + i * 2;
      const y1 = 95 + 25 * Math.sin(i * 0.22);
      const y2 = 95 + 25 * Math.sin((i + 1) * 0.22);
      return <line key={i} x1={x} y1={y1} x2={x + 2} y2={y2} stroke={S} strokeWidth={1.8} />;
    })}

    {/* Sample impulses */}
    <text x={55} y={155} fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui">Sampled x[n]  (fs &gt; 2fmax ✓)</text>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 70 + i * 20;
      const h = 20 + 20 * Math.abs(Math.sin(i * 0.45));
      return (
        <g key={i}>
          <line x1={x} y1={195} x2={x} y2={195 - h} stroke={G} strokeWidth={2.5} />
          <circle cx={x} cy={195 - h} r={3} fill={G} />
        </g>
      );
    })}
    <line x1={50} y1={195} x2={300} y2={195} stroke={border} strokeWidth={1} />

    {/* Aliased signal */}
    <text x={325} y={65} fontSize={9} fontWeight="700" fill={R} fontFamily="system-ui">Aliased  (fs &lt; 2fmax ✗)</text>
    {Array.from({ length: 60 }, (_, i) => {
      const x = 320 + i * 4;
      const orig = 95 + 25 * Math.sin(i * 0.44);
      const alias = 95 + 25 * Math.sin(i * 0.1);
      return (
        <g key={i}>
          <line x1={x} y1={orig} x2={x + 4} y2={95 + 25 * Math.sin((i + 1) * 0.44)} stroke={S} strokeWidth={1} opacity={0.3} />
          <line x1={x} y1={alias} x2={x + 4} y2={95 + 25 * Math.sin((i + 1) * 0.1)} stroke={R} strokeWidth={2} />
        </g>
      );
    })}
    <text x={350} y={130} fontSize={8} fill={R} fontFamily="system-ui">Ghost frequency!</text>

    {/* Divider */}
    <line x1={310} y1={40} x2={310} y2={220} stroke={border} strokeDasharray="5,3" strokeWidth={1.2} />

    <text x={280} y={270} textAnchor="middle" fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Nyquist: fs must be &gt; 2·fmax to avoid aliasing</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 16 — Z-Plane Diagram
// ═══════════════════════════════════════════════════════════════
export const ZPlaneDiagram: React.FC = () => (
  <DiagramBase title="Z-Plane — Unit Circle &amp; Stability">
    <line x1={80} y1={150} x2={480} y2={150} stroke={border} strokeWidth={1.5} />
    <line x1={280} y1={30} x2={280} y2={270} stroke={border} strokeWidth={1.5} />
    <Arrow x1={80} y1={150} x2={488} y2={150} color={txt} />
    <Arrow x1={280} y1={270} x2={280} y2={22} color={txt} />
    <text x={494} y={154} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Re</text>
    <text x={285} y={20} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">Im</text>

    {/* Unit circle */}
    <circle cx={280} cy={150} r={100} fill={G} fillOpacity={0.05} stroke={G} strokeWidth={2} />

    {/* Labels */}
    <text x={290} y={45} fontSize={9} fill={G} fontFamily="system-ui" fontWeight="700">Unit Circle</text>
    <text x={200} y={260} fontSize={9} fill={G} fontFamily="system-ui">|z|&lt;1 STABLE</text>
    <text x={310} y={260} fontSize={9} fill={R} fontFamily="system-ui">|z|&gt;1 UNSTABLE</text>

    {/* Axis labels */}
    <text x={384} y={145} fontSize={9} fill={muted} fontFamily="system-ui">+1</text>
    <text x={165} y={145} fontSize={9} fill={muted} fontFamily="system-ui">−1</text>
    <text x={284} y={48} fontSize={9} fill={muted} fontFamily="system-ui">+j</text>
    <text x={284} y={258} fontSize={9} fill={muted} fontFamily="system-ui">−j</text>

    {/* Sample poles */}
    {[{ x: -40, y: -50 }, { x: -40, y: 50 }, { x: -70, y: 0 }].map(({ x: dx, y: dy }, i) => (
      <g key={i}>
        <line x1={280 + dx - 7} y1={150 + dy - 7} x2={280 + dx + 7} y2={150 + dy + 7} stroke={S} strokeWidth={2.5} />
        <line x1={280 + dx + 7} y1={150 + dy - 7} x2={280 + dx - 7} y2={150 + dy + 7} stroke={S} strokeWidth={2.5} />
      </g>
    ))}
    <text x={190} y={95} fontSize={8} fill={S} fontFamily="system-ui">poles (×) inside → BIBO stable</text>

    {/* z = e^(sTs) */}
    <text x={350} y={200} fontSize={10} fontWeight="700" fill={P} fontFamily="system-ui">z = e^(sT_s)</text>
    <text x={350} y={218} fontSize={9} fill={muted} fontFamily="system-ui">s-plane → z-plane mapping</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 17 — FFT Diagram
// ═══════════════════════════════════════════════════════════════
export const FFTDiagram: React.FC = () => (
  <DiagramBase title="DFT / FFT — Time Domain → Frequency Domain">
    {/* Time domain */}
    <text x={50} y={42} fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">x[n] — Time Domain</text>
    <line x1={40} y1={100} x2={250} y2={100} stroke={border} strokeWidth={1.2} />
    {Array.from({ length: 16 }, (_, i) => {
      const x = 55 + i * 12;
      const h = 30 * Math.abs(Math.sin(i * 0.8) + 0.3 * Math.sin(i * 2.1));
      return (
        <g key={i}>
          <line x1={x} y1={100} x2={x} y2={100 - h} stroke={S} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    })}
    <text x={145} y={120} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">n (samples)</text>

    {/* Arrow */}
    <rect x={255} y={70} width={55} height={30} rx={6} fill={P} />
    <text x={282} y={82} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="800" fill="white" fontFamily="system-ui">FFT</text>
    <text x={282} y={95} textAnchor="middle" fontSize={7} fill="white" fontFamily="system-ui">O(N log N)</text>
    <Arrow x1={310} y1={85} x2={320} y2={85} color="white" />

    {/* Frequency domain */}
    <text x={330} y={42} fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui">X[k] — Frequency Domain</text>
    <line x1={320} y1={100} x2={530} y2={100} stroke={border} strokeWidth={1.2} />
    {[45, 15, 35, 8, 25, 5, 12, 3, 8, 2].map((h, i) => (
      <g key={i}>
        <rect x={325 + i * 19} y={100 - h} width={14} height={h} rx={2} fill={G} opacity={0.8} />
      </g>
    ))}
    <text x={420} y={120} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">k (frequency bins)</text>

    {/* Complex exponential */}
    <text x={280} y={165} textAnchor="middle" fontSize={11} fill={txt} fontFamily="system-ui" fontWeight="700">X[k] = Σ x[n]·e^(−j2πkn/N)</text>
    <text x={280} y={185} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">DFT formula — FFT is the fast O(N log N) algorithm</text>

    {/* Magnitude/Phase */}
    <rect x={110} y={210} width={120} height={40} rx={6} fill={S} fillOpacity={0.1} stroke={S} strokeWidth={1} />
    <text x={170} y={228} textAnchor="middle" fontSize={10} fontWeight="700" fill={S} fontFamily="system-ui">|X[k]| Magnitude</text>
    <text x={170} y={242} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">Amplitude spectrum</text>
    <rect x={340} y={210} width={110} height={40} rx={6} fill={P} fillOpacity={0.1} stroke={P} strokeWidth={1} />
    <text x={395} y={228} textAnchor="middle" fontSize={10} fontWeight="700" fill={P} fontFamily="system-ui">∠X[k] Phase</text>
    <text x={395} y={242} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">Phase spectrum</text>

    <text x={280} y={278} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Nyquist: only k = 0 … N/2 are unique (symmetric)</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 18 — FIR Filter Block Diagram
// ═══════════════════════════════════════════════════════════════
export const FIRFilterBlock: React.FC = () => (
  <DiagramBase title="FIR Filter — Tapped Delay Line  y[n] = Σ h[k]·x[n-k]">
    {/* Input */}
    <text x={20} y={110} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">x[n]</text>
    <Arrow x1={50} y1={105} x2={80} y2={105} />

    {/* Delay chain */}
    {[0, 1, 2, 3].map(i => {
      const x = 80 + i * 110;
      return (
        <g key={i}>
          <Box x={x} y={83} w={60} h={44} label="z⁻¹" fill={S} fontSize={13} />
          {i < 3 && <Arrow x1={x + 60} y1={105} x2={x + 110} y2={105} />}
          {/* Tap */}
          <line x1={x + 30} y1={127} x2={x + 30} y2={155} stroke={muted} strokeWidth={1.5} />
          {/* Coefficient */}
          <rect x={x + 8} y={155} width={44} height={30} rx={4} fill={P} fillOpacity={0.15} stroke={P} strokeWidth={1} />
          <text x={x + 30} y={170} textAnchor="middle" fontSize={10} fontWeight="700" fill={P} fontFamily="system-ui">h[{i}]</text>
          {/* Multiply */}
          <circle cx={x + 30} cy={200} r={9} fill="white" stroke={G} strokeWidth={1.8} />
          <text x={x + 30} y={200} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="800" fill={G} fontFamily="system-ui">×</text>
          <line x1={x + 30} y1={185} x2={x + 30} y2={191} stroke={G} strokeWidth={1.5} />
          {/* Down to summing */}
          <line x1={x + 30} y1={209} x2={x + 30} y2={235} stroke={G} strokeWidth={1.5} />
        </g>
      );
    })}

    {/* Summing junction */}
    <line x1={110} y1={235} x2={410} y2={235} stroke={G} strokeWidth={1.5} />
    <circle cx={410} cy={235} r={13} fill="white" stroke={S} strokeWidth={2} />
    <text x={410} y={235} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="900" fill={S} fontFamily="system-ui">Σ</text>
    <Arrow x1={423} y1={235} x2={460} y2={235} />
    <text x={465} y={240} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">y[n]</text>

    {/* First tap (x[n]) */}
    <line x1={65} y1={105} x2={65} y2={155} stroke={muted} strokeWidth={1.5} />
    <rect x={43} y={155} width={44} height={30} rx={4} fill={P} fillOpacity={0.15} stroke={P} strokeWidth={1} />
    <text x={65} y={170} textAnchor="middle" fontSize={10} fontWeight="700" fill={P} fontFamily="system-ui">h[0]</text>
    <circle cx={65} cy={200} r={9} fill="white" stroke={G} strokeWidth={1.8} />
    <text x={65} y={200} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="800" fill={G} fontFamily="system-ui">×</text>
    <line x1={65} y1={185} x2={65} y2={191} stroke={G} strokeWidth={1.5} />
    <line x1={65} y1={209} x2={65} y2={235} stroke={G} strokeWidth={1.5} />
    <line x1={65} y1={235} x2={97} y2={235} stroke={G} strokeWidth={1.5} />
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 19 — Windowing Diagram
// ═══════════════════════════════════════════════════════════════
export const WindowingDiagram: React.FC = () => (
  <DiagramBase title="Window Functions — Spectral Leakage Reduction">
    {/* Windows comparison */}
    {[
      { name: 'Rectangular', color: R, points: [0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0, 60, 0], },
      { name: 'Hann', color: G, pts: (i: number, N: number) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N) },
      { name: 'Hamming', color: S, pts: (i: number, N: number) => 0.54 - 0.46 * Math.cos(2 * Math.PI * i / N) },
    ].map(({ name, color, pts }, wi) => {
      const N = 60;
      const yBase = 130;
      const amp = 60;
      const xStart = 40;
      const xEnd = 280;
      const polyPts = Array.from({ length: N + 1 }, (_, i) => {
        const x = xStart + (xEnd - xStart) * i / N;
        const w = pts ? pts(i, N) : (i > 0 && i < N ? 1 : 0);
        return `${x},${yBase - w * amp}`;
      }).join(' ');
      return (
        <g key={wi}>
          <polyline points={polyPts} fill="none" stroke={color} strokeWidth={wi === 0 ? 1.5 : 2} />
          <text x={290} y={yBase - (wi === 0 ? amp : wi === 1 ? amp * 0.8 : amp * 0.65)} fontSize={9} fontWeight="700" fill={color} fontFamily="system-ui">{name}</text>
        </g>
      );
    })}
    <line x1={40} y1={130} x2={280} y2={130} stroke={border} strokeWidth={1} />
    <text x={160} y={148} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">n (samples, 0…N-1)</text>

    {/* Frequency response comparison */}
    <text x={350} y={55} textAnchor="middle" fontSize={9} fontWeight="700" fill={txt} fontFamily="system-ui">Frequency Response</text>
    {[
      { name: 'Rect (wide lobe, high sidelobes)', color: R, w: 80 },
      { name: 'Hann (narrow, low sidelobes)', color: G, w: 55 },
      { name: 'Hamming (−43dB sidelobes)', color: S, w: 62 },
    ].map(({ name, color, w }, i) => {
      const cx = 350, cy = 110 + i * 60;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={w} ry={22} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} />
          <text x={cx} y={cy - 28} textAnchor="middle" fontSize={8} fill={color} fontFamily="system-ui">{name}</text>
          <line x1={cx} y1={cy - 22} x2={cx} y2={cy + 22} stroke={color} strokeWidth={2} />
        </g>
      );
    })}
    <text x={280} y={275} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Rectangular leaks; Hann/Hamming reduce sidelobes at cost of main-lobe width</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 20 — Spectrogram Diagram
// ═══════════════════════════════════════════════════════════════
export const SpectrogramDiagram: React.FC = () => (
  <DiagramBase title="STFT Spectrogram — Time-Frequency Analysis">
    {/* Time signal */}
    <text x={50} y={42} fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">x(t)</text>
    {Array.from({ length: 200 }, (_, i) => {
      const t = i / 200;
      const freq = 2 + 6 * t; // chirp
      const x = 40 + i * 2.4;
      const y = 80 + 22 * Math.sin(2 * Math.PI * freq * t * 3);
      const y2 = 80 + 22 * Math.sin(2 * Math.PI * (freq + 0.3) * (t + 0.005) * 3);
      return <line key={i} x1={x} y1={y} x2={x + 2.4} y2={y2} stroke={S} strokeWidth={1.2} />;
    })}
    <line x1={40} y1={110} x2={520} y2={110} stroke={border} strokeWidth={1} />
    <text x={520} y={115} fontSize={9} fill={muted} fontFamily="system-ui">t</text>

    {/* Spectrogram heatmap */}
    <text x={50} y={135} fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui">Spectrogram  |X(t,f)|²</text>
    {Array.from({ length: 40 }, (_, ti) =>
      Array.from({ length: 20 }, (_, fi) => {
        const t = ti / 40;
        const f = fi / 20;
        const freqAtT = 0.1 + 0.8 * t;
        const intensity = Math.exp(-Math.pow((f - freqAtT) * 10, 2));
        const r = Math.round(255 * intensity);
        const g = Math.round(200 * Math.pow(intensity, 0.5));
        const b = Math.round(80 * (1 - intensity));
        return (
          <rect key={`${ti}-${fi}`}
            x={40 + ti * 12} y={255 - fi * 5.5}
            width={12} height={5.5}
            fill={`rgb(${r},${g},${b})`}
          />
        );
      })
    )}
    <text x={40} y={270} fontSize={8} fill={muted} fontFamily="system-ui">0</text>
    <text x={515} y={270} fontSize={8} fill={muted} fontFamily="system-ui">t</text>
    <text x={30} y={260} fontSize={8} fill={muted} fontFamily="system-ui" transform="rotate(-90,30,200)">f (Hz)</text>

    {/* Annotation */}
    <text x={420} y={175} fontSize={9} fill={A} fontFamily="system-ui" fontWeight="700">↑ Rising</text>
    <text x={420} y={187} fontSize={9} fill={A} fontFamily="system-ui" fontWeight="700">frequency</text>
    <text x={420} y={199} fontSize={9} fill={A} fontFamily="system-ui">(chirp)</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 21 — DSP Processing Pipeline
// ═══════════════════════════════════════════════════════════════
export const DSPHierarchy: React.FC = () => (
  <DiagramBase title="DSP Processing Pipeline">
    {[
      { label: 'Analog Signal x(t)', fill: S, x: 40, w: 160 },
      { label: 'ADC + Sample  x[n]', fill: P, x: 230, w: 160 },
      { label: 'Digital Processing', fill: G, x: 40, w: 490, y: 115 },
      { label: 'DAC + Reconstruct', fill: P, x: 40, w: 160, y: 180 },
      { label: 'Analog Output y(t)', fill: S, x: 230, w: 160, y: 180 },
    ].map(({ label, fill, x, w, y = 50 }, i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={48} rx={8} fill={fill} />
        <text x={x + w / 2} y={y + 24} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="800" fill="white" fontFamily="system-ui">{label}</text>
      </g>
    ))}
    <Arrow x1={200} y1={74} x2={230} y2={74} />
    <Arrow x1={390} y1={74} x2={40} y2={115} />
    <Arrow x1={530} y1={115} x2={530} y2={163} />
    <line x1={530} y1={163} x2={200} y2={180} stroke={S} strokeWidth={1.8} />
    <Arrow x1={200} y1={204} x2={230} y2={204} />

    {/* DSP operations */}
    {['Filter (FIR/IIR)', 'FFT/IFFT', 'Windowing', 'Feature Extract'].map((op, i) => (
      <g key={op}>
        <rect x={55 + i * 118} y={125} width={105} height={26} rx={5} fill="white" stroke={G} strokeWidth={1} />
        <text x={107 + i * 118} y={138} textAnchor="middle" fontSize={8.5} fontWeight="700" fill={G} fontFamily="system-ui">{op}</text>
      </g>
    ))}

    <text x={280} y={270} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Sampling rate fs, quantization bits N, and filter design determine system performance
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 22 — Kalman Filter Block Diagram
// ═══════════════════════════════════════════════════════════════
export const KalmanBlockDiagram: React.FC = () => (
  <DiagramBase title="Kalman Filter — Predict → Update Cycle">
    {/* Predict box */}
    <rect x={60} y={60} width={180} height={100} rx={10} fill={S} fillOpacity={0.1} stroke={S} strokeWidth={2} />
    <text x={150} y={82} textAnchor="middle" fontSize={12} fontWeight="800" fill={S} fontFamily="system-ui">PREDICT</text>
    <text x={150} y={102} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">x̂⁻ = A·x̂ + B·u</text>
    <text x={150} y={118} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">P⁻ = A·P·Aᵀ + Q</text>
    <text x={150} y={134} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">State + covariance prediction</text>

    <Arrow x1={240} y1={110} x2={290} y2={110} />
    <text x={263} y={103} fontSize={8} fill={muted} fontFamily="system-ui">x̂⁻, P⁻</text>

    {/* Update box */}
    <rect x={290} y={60} width={200} height={100} rx={10} fill={P} fillOpacity={0.1} stroke={P} strokeWidth={2} />
    <text x={390} y={82} textAnchor="middle" fontSize={12} fontWeight="800" fill={P} fontFamily="system-ui">UPDATE</text>
    <text x={390} y={102} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">K = P⁻Hᵀ(HP⁻Hᵀ+R)⁻¹</text>
    <text x={390} y={118} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">x̂ = x̂⁻ + K(z − Hx̂⁻)</text>
    <text x={390} y={134} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">Kalman gain + state correction</text>

    <Arrow x1={490} y1={110} x2={530} y2={110} />
    <text x={535} y={107} fontSize={9} fontWeight="700" fill={txt} fontFamily="system-ui">x̂</text>

    {/* Measurement input */}
    <text x={390} y={35} fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui">z (measurement)</text>
    <Arrow x1={390} y1={45} x2={390} y2={60} color={G} />

    {/* Feedback loop */}
    <line x1={150} y1={160} x2={150} y2={220} stroke={S} strokeWidth={1.8} />
    <line x1={150} y1={220} x2={480} y2={220} stroke={S} strokeWidth={1.8} />
    <line x1={480} y1={220} x2={480} y2={160} stroke={S} strokeWidth={1.8} />
    <Arrow x1={480} y1={160} x2={490} y2={160} color={S} />
    <text x={315} y={238} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">Recursion: output feeds next predict step</text>

    {/* Q and R labels */}
    <text x={60} y={220} fontSize={9} fill={A} fontFamily="system-ui" fontWeight="700">Q = process noise</text>
    <text x={60} y={236} fontSize={9} fill={G} fontFamily="system-ui" fontWeight="700">R = measurement noise</text>
    <text x={60} y={252} fontSize={9} fill={S} fontFamily="system-ui" fontWeight="700">P = error covariance</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 23 — LQR Optimal Cost Diagram
// ═══════════════════════════════════════════════════════════════
export const OptimalCostDiagram: React.FC = () => (
  <DiagramBase title="LQR — Optimal Control via Riccati Equation">
    {/* Axes */}
    <line x1={60} y1={230} x2={530} y2={230} stroke={border} strokeWidth={1.5} />
    <line x1={60} y1={40} x2={60} y2={230} stroke={border} strokeWidth={1.5} />
    <Arrow x1={60} y1={230} x2={538} y2={230} color={txt} />
    <Arrow x1={60} y1={230} x2={60} y2={32} color={txt} />
    <text x={544} y={234} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">K</text>
    <text x={65} y={30} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">J</text>

    {/* Cost curves */}
    {/* State cost (Q dominates) - decrease with more gain */}
    {Array.from({ length: 80 }, (_, i) => {
      const k = 0.5 + i * 5;
      const x = 60 + i * 5.8;
      const J_state = 180 / (1 + 0.3 * k) + 20;
      const J_input = 20 + 0.02 * k * k;
      const J_total = J_state + J_input;
      if (i === 0) return null;
      const kp = 0.5 + (i - 1) * 5;
      const xp = 60 + (i - 1) * 5.8;
      const Jp_state = 180 / (1 + 0.3 * kp) + 20;
      const Jp_input = 20 + 0.02 * kp * kp;
      const Jp_total = Jp_state + Jp_input;
      return (
        <g key={i}>
          <line x1={xp} y1={230 - Jp_state} x2={x} y2={230 - J_state} stroke={G} strokeWidth={1.5} />
          <line x1={xp} y1={230 - Jp_input} x2={x} y2={230 - J_input} stroke={R} strokeWidth={1.5} />
          <line x1={xp} y1={230 - Jp_total} x2={x} y2={230 - J_total} stroke={P} strokeWidth={2.5} />
        </g>
      );
    })}

    {/* Optimal K */}
    <line x1={215} y1={40} x2={215} y2={230} stroke={A} strokeWidth={2} strokeDasharray="5,3" />
    <text x={220} y={60} fontSize={10} fontWeight="800" fill={A} fontFamily="system-ui">K* optimal</text>
    <circle cx={215} cy={135} r={6} fill={P} />

    {/* Legend */}
    <line x1={350} y1={70} x2={380} y2={70} stroke={G} strokeWidth={2} />
    <text x={385} y={74} fontSize={9} fill={txt} fontFamily="system-ui">State cost (Q·xᵀx)</text>
    <line x1={350} y1={90} x2={380} y2={90} stroke={R} strokeWidth={2} />
    <text x={385} y={94} fontSize={9} fill={txt} fontFamily="system-ui">Input cost (R·uᵀu)</text>
    <line x1={350} y1={110} x2={380} y2={110} stroke={P} strokeWidth={2.5} />
    <text x={385} y={114} fontSize={9} fill={txt} fontFamily="system-ui">Total J = xᵀQx + uᵀRu</text>

    <text x={280} y={265} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Riccati equation gives K* minimizing J∞ = ∫₀^∞ (xᵀQx + uᵀRu) dt
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 24 — MPC Receding Horizon Diagram
// ═══════════════════════════════════════════════════════════════
export const MPCHorizonDiagram: React.FC = () => (
  <DiagramBase title="MPC — Receding Horizon Principle">
    {/* Time axis */}
    <Arrow x1={40} y1={220} x2={540} y2={220} color={txt} />
    <text x={546} y={224} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">t</text>

    {/* Current time */}
    <line x1={120} y1={50} x2={120} y2={225} stroke={S} strokeWidth={2} strokeDasharray="5,3" />
    <text x={120} y={240} textAnchor="middle" fontSize={9} fontWeight="700" fill={S} fontFamily="system-ui">t₀</text>
    <text x={120} y={255} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">(now)</text>

    {/* Prediction horizon */}
    <line x1={380} y1={50} x2={380} y2={225} stroke={G} strokeWidth={1.5} strokeDasharray="4,3" />
    <text x={380} y={240} textAnchor="middle" fontSize={9} fill={G} fontFamily="system-ui">t₀+N</text>
    <rect x={120} y={50} width={260} height={20} rx={4} fill={G} fillOpacity={0.15} />
    <text x={250} y={62} textAnchor="middle" fontSize={9} fontWeight="700" fill={G} fontFamily="system-ui">← Prediction Horizon N →</text>

    {/* Reference trajectory */}
    <polyline points="40,150 120,150 200,130 300,110 380,100 540,95"
      fill="none" stroke={border} strokeWidth={1.5} strokeDasharray="6,3" />
    <text x={450} y={90} fontSize={8} fill={muted} fontFamily="system-ui">Reference r(t)</text>

    {/* Predicted trajectory */}
    <polyline points="120,170 180,155 250,135 320,115 380,103"
      fill="none" stroke={P} strokeWidth={2.5} />
    <text x={200} y={185} fontSize={9} fontWeight="700" fill={P} fontFamily="system-ui">Predicted trajectory</text>

    {/* Optimal control (only first step applied) */}
    <rect x={120} y={195} width={60} height={20} rx={4} fill={S} />
    <text x={150} y={206} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="800" fill="white" fontFamily="system-ui">Apply u*(t₀)</text>

    {/* Future steps (not applied) */}
    {[1, 2, 3].map(i => (
      <rect key={i} x={120 + i * 60} y={195} width={58} height={20} rx={4} fill={muted} fillOpacity={0.3} />
    ))}
    <text x={260} y={206} textAnchor="middle" dominantBaseline="central" fontSize={8} fill={muted} fontFamily="system-ui">Discarded (re-solved next step)</text>

    {/* Shift */}
    <Arrow x1={120} y1={82} x2={180} y2={82} color={A} />
    <text x={152} y={78} textAnchor="middle" fontSize={8} fill={A} fontFamily="system-ui" fontWeight="700">Shift →</text>
    <text x={280} y={270} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Only u*(t₀) is applied — optimization repeats at every step (receding horizon)
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 25 — MRAC Diagram
// ═══════════════════════════════════════════════════════════════
export const MRACDiagram: React.FC = () => (
  <DiagramBase title="MRAC — Model Reference Adaptive Control">
    {/* Reference model */}
    <rect x={280} y={40} width={150} height={60} rx={8} fill={S} fillOpacity={0.12} stroke={S} strokeWidth={2} />
    <text x={355} y={65} textAnchor="middle" fontSize={11} fontWeight="800" fill={S} fontFamily="system-ui">Reference Model</text>
    <text x={355} y={82} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">ẋm = Amxm + Bmr</text>
    <Arrow x1={240} y1={70} x2={280} y2={70} color={S} />

    {/* Plant */}
    <rect x={280} y={140} width={150} height={60} rx={8} fill={P} fillOpacity={0.12} stroke={P} strokeWidth={2} />
    <text x={355} y={165} textAnchor="middle" fontSize={11} fontWeight="800" fill={P} fontFamily="system-ui">Plant (Unknown)</text>
    <text x={355} y={182} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">ẋ = Ax + Bu</text>
    <Arrow x1={240} y1={170} x2={280} y2={170} color={P} />

    {/* Error */}
    <text x={450} y={100} fontSize={10} fontWeight="700" fill={R} fontFamily="system-ui">e = ym − y</text>
    <line x1={430} y1={70} x2={470} y2={70} stroke={S} strokeWidth={1.5} />
    <line x1={430} y1={170} x2={470} y2={170} stroke={P} strokeWidth={1.5} />
    <line x1={470} y1={70} x2={470} y2={170} stroke={R} strokeWidth={1.5} />
    <circle cx={470} cy={120} r={5} fill={R} />
    <Arrow x1={470} y1={120} x2={440} y2={120} color={R} />

    {/* Adaptive law */}
    <rect x={55} y={95} width={165} height={70} rx={8} fill={G} fillOpacity={0.15} stroke={G} strokeWidth={2} />
    <text x={137} y={118} textAnchor="middle" fontSize={11} fontWeight="800" fill={G} fontFamily="system-ui">Adaptive Law</text>
    <text x={137} y={135} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">MIT Rule:</text>
    <text x={137} y={150} textAnchor="middle" fontSize={9} fill={txt} fontFamily="system-ui">θ̇ = −γ·e·(∂e/∂θ)</text>
    <Arrow x1={220} y1={130} x2={280} y2={150} color={G} />
    <Arrow x1={440} y1={120} x2={220} y2={130} color={R} />

    {/* r input */}
    <text x={35} y={74} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">r(t)</text>
    <Arrow x1={55} y1={70} x2={240} y2={70} />
    <line x1={55} y1={70} x2={55} y2={95} stroke={muted} strokeWidth={1.5} />
    <Arrow x1={55} y1={95} x2={55} y2={95} />

    <text x={280} y={270} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      θ adapts online until Plant output matches Reference Model output
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 26 — Neural Network Control Diagram
// ═══════════════════════════════════════════════════════════════
export const NNControlDiagram: React.FC = () => (
  <DiagramBase title="Neural Network Controller — Architecture">
    {/* Input layer */}
    {[0, 1, 2].map(i => (
      <g key={i}>
        <circle cx={80} cy={90 + i * 60} r={18} fill={S} />
        <text x={80} y={90 + i * 60} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill="white" fontFamily="system-ui">{['x', 'ẋ', 'ref'][i]}</text>
      </g>
    ))}
    <text x={80} y={260} textAnchor="middle" fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui">Input</text>

    {/* Hidden layer 1 */}
    {[0, 1, 2, 3].map(i => (
      <g key={i}>
        <circle cx={220} cy={70 + i * 50} r={16} fill={P} />
        <text x={220} y={70 + i * 50} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="700" fill="white" fontFamily="system-ui">σ</text>
      </g>
    ))}
    <text x={220} y={260} textAnchor="middle" fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui">Hidden 1</text>

    {/* Hidden layer 2 */}
    {[0, 1, 2, 3].map(i => (
      <g key={i}>
        <circle cx={350} cy={70 + i * 50} r={16} fill={P} />
        <text x={350} y={70 + i * 50} textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="700" fill="white" fontFamily="system-ui">σ</text>
      </g>
    ))}
    <text x={350} y={260} textAnchor="middle" fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui">Hidden 2</text>

    {/* Output */}
    <circle cx={480} cy={150} r={20} fill={G} />
    <text x={480} y={150} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight="700" fill="white" fontFamily="system-ui">u(t)</text>
    <text x={480} y={260} textAnchor="middle" fontSize={9} fontWeight="700" fill={muted} fontFamily="system-ui">Output</text>

    {/* Connections */}
    {[90, 150, 210].flatMap(y1 => [70, 120, 170, 220].map(y2 => (
      <line key={`${y1}-${y2}`} x1={98} y1={y1} x2={204} y2={y2} stroke={S} strokeWidth={0.7} opacity={0.3} />
    )))}
    {[70, 120, 170, 220].flatMap(y1 => [70, 120, 170, 220].map(y2 => (
      <line key={`${y1}-${y2}h`} x1={236} y1={y1} x2={334} y2={y2} stroke={P} strokeWidth={0.7} opacity={0.3} />
    )))}
    {[70, 120, 170, 220].map(y1 => (
      <line key={y1} x1={366} y1={y1} x2={460} y2={150} stroke={G} strokeWidth={0.8} opacity={0.4} />
    ))}

    {/* Backpropagation arrow */}
    <path d="M480,170 Q480,280 280,280 Q80,280 80,230" fill="none" stroke={R} strokeWidth={1.8} strokeDasharray="5,3" />
    <Arrow x1={80} y1={230} x2={80} y2={228} color={R} />
    <text x={280} y={295} textAnchor="middle" fontSize={9} fill={R} fontFamily="system-ui" fontWeight="700">Backpropagation ∇J</text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 27 — RTOS Scheduler Diagram
// ═══════════════════════════════════════════════════════════════
export const RTOSSchedulerDiagram: React.FC = () => (
  <DiagramBase title="RTOS Scheduler — Priority-Based Preemptive Scheduling">
    {/* Time axis */}
    <Arrow x1={40} y1={240} x2={540} y2={240} color={txt} />
    <text x={546} y={244} fontSize={10} fontWeight="700" fill={txt} fontFamily="system-ui">t</text>
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => (
      <g key={t}>
        <line x1={60 + t * 46} y1={236} x2={60 + t * 46} y2={244} stroke={txt} strokeWidth={1} />
        <text x={60 + t * 46} y={256} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">{t}</text>
      </g>
    ))}

    {/* Task lanes */}
    {[
      { name: 'T1 (P=3)', color: P, schedule: [[0, 1], [3, 4], [6, 7]], y: 50 },
      { name: 'T2 (P=2)', color: S, schedule: [[1, 3], [4, 6], [7, 9]], y: 110 },
      { name: 'T3 (P=1)', color: G, schedule: [[2, 2.5]], y: 170 },
    ].map(({ name, color, schedule, y }) => (
      <g key={name}>
        <text x={35} y={y + 20} textAnchor="end" fontSize={9} fontWeight="700" fill={color} fontFamily="system-ui">{name}</text>
        <line x1={40} y1={y} x2={540} y2={y} stroke={border} strokeWidth={1} />
        <line x1={40} y1={y + 40} x2={540} y2={y + 40} stroke={border} strokeWidth={1} />
        {schedule.map(([start, end], i) => (
          <rect key={i}
            x={60 + start * 46} y={y + 2}
            width={(end - start) * 46} height={36}
            rx={4} fill={color} fillOpacity={0.85}
          />
        ))}
      </g>
    ))}

    {/* Preemption annotation */}
    <line x1={106} y1={50} x2={106} y2={230} stroke={A} strokeWidth={1.5} strokeDasharray="4,3" />
    <text x={108} y={45} fontSize={8} fill={A} fontFamily="system-ui" fontWeight="700">Preempt</text>

    <text x={280} y={275} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Higher priority task (T1, P=3) preempts lower priority — deterministic response
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 28 — Quantum Circuit Diagram
// ═══════════════════════════════════════════════════════════════
export const QuantumCircuitDiagram: React.FC = () => (
  <DiagramBase title="Quantum Circuit — Gates &amp; Measurement">
    {/* Qubit wires */}
    {['|0⟩', '|0⟩', '|0⟩'].map((label, i) => (
      <g key={i}>
        <text x={45} y={90 + i * 65} textAnchor="end" fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">{label}</text>
        <line x1={50} y1={86 + i * 65} x2={510} y2={86 + i * 65} stroke={S} strokeWidth={1.5} />
      </g>
    ))}

    {/* H gates */}
    {[0, 1].map(i => (
      <g key={i}>
        <rect x={90} y={68 + i * 65} width={44} height={36} rx={5} fill={'#1D4ED8'} />
        <text x={112} y={86 + i * 65} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="900" fill="white" fontFamily="system-ui">H</text>
      </g>
    ))}

    {/* CNOT (control on q0, target on q1) */}
    <circle cx={200} cy={86} r={8} fill={P} />
    <line x1={200} y1={94} x2={200} y2={151} stroke={P} strokeWidth={2} />
    <circle cx={200} cy={151} r={14} fill="none" stroke={P} strokeWidth={2} />
    <line x1={186} y1={151} x2={214} y2={151} stroke={P} strokeWidth={2} />
    <line x1={200} y1={137} x2={200} y2={165} stroke={P} strokeWidth={2} />
    <text x={220} y={120} fontSize={8} fill={P} fontFamily="system-ui">CNOT</text>

    {/* T gate */}
    <rect x={280} y={68} width={44} height={36} rx={5} fill={G} />
    <text x={302} y={86} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="900" fill="white" fontFamily="system-ui">T</text>

    {/* CZ gate */}
    <circle cx={370} cy={151} r={7} fill={A} />
    <line x1={370} y1={158} x2={370} y2={216} stroke={A} strokeWidth={2} />
    <circle cx={370} cy={216} r={7} fill={A} />
    <text x={385} y={185} fontSize={8} fill={A} fontFamily="system-ui">CZ</text>

    {/* Measurements */}
    {[0, 1, 2].map(i => (
      <g key={i}>
        <rect x={450} y={68 + i * 65} width={44} height={36} rx={5} fill={'#475569'} />
        <text x={472} y={86 + i * 65} textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily="system-ui" fill="white">M</text>
        <path d={`M457 ${91 + i * 65} A8 8 0 0 1 487 ${91 + i * 65}`} fill="none" stroke={A} strokeWidth={2} />
        <line x1={472} y1={91 + i * 65} x2={472} y2={75 + i * 65} stroke={A} strokeWidth={2} />
      </g>
    ))}

    <text x={280} y={260} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      H = superposition · CNOT = entanglement · T = phase · M = collapse to 0 or 1
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 29 — Entanglement Diagram
// ═══════════════════════════════════════════════════════════════
export const EntanglementDiagram: React.FC = () => (
  <DiagramBase title="Bell State — Quantum Entanglement  |Φ⁺⟩ = (|00⟩ + |11⟩)/√2">
    {/* Two qubit wires */}
    {['Q₁ |0⟩', 'Q₂ |0⟩'].map((label, i) => (
      <g key={i}>
        <text x={45} y={108 + i * 80} textAnchor="end" fontSize={11} fontWeight="700" fill={txt} fontFamily="system-ui">{label}</text>
        <line x1={50} y1={104 + i * 80} x2={510} y2={104 + i * 80} stroke={'#334155'} strokeWidth={1.5} />
      </g>
    ))}

    {/* H gate on Q1 */}
    <rect x={80} y={84} width={50} height={40} rx={6} fill={'#1D4ED8'} />
    <text x={105} y={104} textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight="900" fill="white" fontFamily="system-ui">H</text>
    <text x={105} y={140} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">Hadamard</text>

    {/* State after H */}
    <text x={160} y={94} fontSize={9} fill={'#1D4ED8'} fontFamily="system-ui">(|0⟩+|1⟩)</text>
    <text x={165} y={106} fontSize={8} fill={muted} fontFamily="system-ui">/√2</text>

    {/* CNOT */}
    <circle cx={260} cy={104} r={9} fill={P} />
    <line x1={260} y1={113} x2={260} y2={184} stroke={P} strokeWidth={2.5} />
    <circle cx={260} cy={184} r={16} fill="none" stroke={P} strokeWidth={2.5} />
    <line x1={244} y1={184} x2={276} y2={184} stroke={P} strokeWidth={2.5} />
    <line x1={260} y1={168} x2={260} y2={200} stroke={P} strokeWidth={2.5} />
    <text x={285} y={145} fontSize={10} fontWeight="700" fill={P} fontFamily="system-ui">CNOT</text>

    {/* Bell state label */}
    <rect x={310} y={70} width={180} height={50} rx={8} fill={'#4C1D95'} fillOpacity={0.1} stroke={'#7C3AED'} strokeWidth={1.5} />
    <text x={400} y={90} textAnchor="middle" fontSize={11} fontWeight="800" fill={'#7C3AED'} fontFamily="system-ui">|Φ⁺⟩ = Bell State</text>
    <text x={400} y={108} textAnchor="middle" fontSize={10} fill={txt} fontFamily="system-ui">(|00⟩ + |11⟩)/√2</text>

    {/* Measurement correlation */}
    <rect x={320} y={165} width={70} height={36} rx={5} fill={'#475569'} />
    <text x={355} y={183} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="white" fontFamily="system-ui">M(Q₁)</text>
    <rect x={420} y={165} width={70} height={36} rx={5} fill={'#475569'} />
    <text x={455} y={183} textAnchor="middle" dominantBaseline="central" fontSize={10} fill="white" fontFamily="system-ui">M(Q₂)</text>
    <line x1={310} y1={104} x2={320} y2={104} stroke={'#334155'} strokeWidth={1.5} />
    <line x1={310} y1={184} x2={320} y2={184} stroke={'#334155'} strokeWidth={1.5} />
    <Arrow x1={310} y1={104} x2={320} y2={183} color={R} />
    <text x={318} y={138} fontSize={8} fill={R} fontFamily="system-ui" fontWeight="700">instant</text>
    <text x={315} y={148} fontSize={8} fill={R} fontFamily="system-ui" fontWeight="700">correlation</text>

    <text x={280} y={260} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Measuring Q₁ instantly determines Q₂ — 100% correlation regardless of distance
    </text>
  </DiagramBase>
);

// ═══════════════════════════════════════════════════════════════
// DAY 30 — Career Roadmap Diagram
// ═══════════════════════════════════════════════════════════════
export const CareerRoadmapDiagram: React.FC = () => (
  <DiagramBase title="Engineering Career Roadmap — Junior → Senior → PM">
    {/* Timeline arrow */}
    <Arrow x1={40} y1={150} x2={530} y2={150} color={border} />

    {[
      { x: 80, label: 'Junior EE', sub: '0–2 yr', skills: 'MATLAB, circuits, simulations', fill: G, emoji: '🎓' },
      { x: 210, label: 'Mid-Level', sub: '2–4 yr', skills: 'Systems, C++, projects', fill: S, emoji: '⚙️' },
      { x: 340, label: 'Senior EE', sub: '4–7 yr', skills: 'Architecture, mentoring', fill: P, emoji: '🚀' },
      { x: 460, label: 'Tech Lead / PM', sub: '7+ yr', skills: '₪20K+, strategy, impact', fill: A, emoji: '🎯' },
    ].map(({ x, label, sub, skills, fill, emoji }) => (
      <g key={x}>
        {/* Dot on timeline */}
        <circle cx={x} cy={150} r={12} fill={fill} stroke="white" strokeWidth={2} />
        <text x={x} y={150} textAnchor="middle" dominantBaseline="central" fontSize={10} fontFamily="system-ui">{emoji}</text>

        {/* Card above/below alternating */}
        <rect x={x - 60} y={x % 2 === 0 ? 35 : 175} width={120} height={55} rx={8} fill={fill} fillOpacity={0.1} stroke={fill} strokeWidth={1.5} />
        <text x={x} y={x % 2 === 0 ? 55 : 192} textAnchor="middle" fontSize={10} fontWeight="800" fill={fill} fontFamily="system-ui">{label}</text>
        <text x={x} y={x % 2 === 0 ? 68 : 206} textAnchor="middle" fontSize={8} fill={muted} fontFamily="system-ui">{sub}</text>
        <text x={x} y={x % 2 === 0 ? 80 : 218} textAnchor="middle" fontSize={7.5} fill={txt} fontFamily="system-ui">{skills}</text>

        {/* Connector line */}
        <line x1={x} y1={x % 2 === 0 ? 90 : 175} x2={x} y2={x % 2 === 0 ? 138 : 162}
          stroke={fill} strokeWidth={1.2} strokeDasharray="3,2" />
      </g>
    ))}

    <text x={280} y={270} textAnchor="middle" fontSize={9} fill={muted} fontFamily="system-ui">
      Skills compound — each stage unlocks the next. Portfolio + communication = multiplier.
    </text>
  </DiagramBase>
);
