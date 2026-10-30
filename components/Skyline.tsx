const BASE = 220;

// [x, width, height]
const buildings: [number, number, number][] = [
  [0, 64, 92], [64, 50, 132], [114, 70, 104], [184, 46, 162], [228, 82, 122], [310, 56, 178], [366, 66, 112],
  [432, 52, 148], [484, 90, 96], [574, 46, 188], [620, 70, 132], [690, 60, 102], [750, 54, 152], [804, 82, 122],
  [962, 60, 142], [1022, 50, 108], [1072, 72, 168], [1144, 56, 124], [1200, 82, 98], [1282, 52, 152], [1334, 106, 112],
];

type Win = { x: number; y: number; twinkle: boolean; delay: number };

// Deterministic pseudo-random so server and client render the same windows.
function buildWindows(): Win[] {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const out: Win[] = [];
  for (const [x, w, h] of buildings) {
    for (let y = BASE - h + 14; y < BASE - 8; y += 14) {
      for (let cx = x + 8; cx < x + w - 8; cx += 11) {
        if (rnd() > 0.7) out.push({ x: cx, y, twinkle: rnd() > 0.6, delay: Math.round(rnd() * 40) / 10 });
      }
    }
  }
  return out;
}

const windows = buildWindows();

export default function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" className={className} fill="none">
      <defs>
        <linearGradient id="sky-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#14408d" />
          <stop offset="1" stopColor="#0c2b66" />
        </linearGradient>
      </defs>
      <g fill="url(#sky-fade)" stroke="#ffc63d" strokeOpacity="0.4" strokeWidth="1">
        {buildings.map(([x, w, h]) => (
          <rect key={x} x={x} y={BASE - h} width={w} height={h} />
        ))}
        <polygon points="896,220 896,128 910,100 918,40 924,0 930,40 938,100 952,128 952,220" />
      </g>
      <g fill="#ffc63d">
        {windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="3"
            height="5"
            opacity="0.55"
            className={w.twinkle ? "twinkle" : undefined}
            style={w.twinkle ? { animationDelay: `${w.delay}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
