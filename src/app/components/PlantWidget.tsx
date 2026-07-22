import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface PlantWidgetProps {
  percentage: number;
  droop: boolean;
  role: 'user' | 'admin';
}

function getStage(pct: number): number {
  if (pct < 20) return 0;
  if (pct < 40) return 1;
  if (pct < 60) return 2;
  if (pct < 80) return 3;
  return 4;
}

const stageLabels = ['Just sprouted', 'Seedling', 'Growing', 'Flourishing', 'Thriving!'];
const droopLabel = 'Needs a little care…';

function PlantSVG({ stage, droop }: { stage: number; droop: boolean }) {
  const leafA = droop ? '#8FAF8F' : '#6B8F6B';
  const leafB = droop ? '#A8C8A8' : '#8FAF8F';
  const stem = droop ? '#5A7851' : '#3D6132';
  const flowerA = '#D4A853';
  const flowerB = '#C8714A';

  return (
    <svg viewBox="0 0 120 140" width="120" height="140" style={{ overflow: 'visible' }}>
      {/* Soil */}
      <ellipse cx="60" cy="122" rx="44" ry="10" fill="#8B6B47" opacity="0.55" />
      <ellipse cx="60" cy="118" rx="40" ry="8" fill="#6B4F35" opacity="0.5" />

      {stage === 0 && (
        <g>
          <path d="M60 118 L60 106" stroke={stem} strokeWidth="2.5" strokeLinecap="round" />
          <path
            d={droop
              ? "M60,108 C56,112 48,114 46,112 C48,108 56,106 60,108 Z"
              : "M60,108 C56,102 48,100 46,102 C48,106 56,108 60,108 Z"}
            fill={leafB}
          />
          <path
            d={droop
              ? "M60,108 C64,112 72,114 74,112 C72,108 64,106 60,108 Z"
              : "M60,108 C64,102 72,100 74,102 C72,106 64,108 60,108 Z"}
            fill={leafB}
          />
        </g>
      )}

      {stage === 1 && (
        <g>
          <path d="M60 118 Q58 102 60 90" stroke={stem} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path
            d={droop
              ? "M59,100 C52,106 40,108 38,105 C42,100 54,98 59,100 Z"
              : "M59,100 C52,94 40,92 38,95 C42,100 54,102 59,100 Z"}
            fill={leafA}
          />
          <path
            d={droop
              ? "M61,100 C68,106 80,108 82,105 C78,100 66,98 61,100 Z"
              : "M61,100 C68,94 80,92 82,95 C78,100 66,102 61,100 Z"}
            fill={leafA}
          />
          <ellipse cx="60" cy="88" rx="5" ry="6" fill={leafB} />
        </g>
      )}

      {stage === 2 && (
        <g>
          <path d="M60 118 Q57 96 59 72" stroke={stem} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path
            d={droop
              ? "M59,106 C50,114 36,116 34,112 C38,106 52,104 59,106 Z"
              : "M59,106 C50,98 36,96 34,100 C38,106 52,108 59,106 Z"}
            fill={leafB}
          />
          <path
            d={droop
              ? "M61,106 C70,114 84,116 86,112 C82,106 68,104 61,106 Z"
              : "M61,106 C70,98 84,96 86,100 C82,106 68,108 61,106 Z"}
            fill={leafB}
          />
          <path
            d={droop
              ? "M59,90 C50,98 38,100 36,96 C40,90 52,88 59,90 Z"
              : "M59,90 C50,82 38,80 36,84 C40,90 52,92 59,90 Z"}
            fill={leafA}
          />
          <path
            d={droop
              ? "M61,90 C70,98 82,100 84,96 C80,90 68,88 61,90 Z"
              : "M61,90 C70,82 82,80 84,84 C80,90 68,92 61,90 Z"}
            fill={leafA}
          />
          <ellipse cx="59" cy="70" rx="6" ry="8" fill={leafA} transform="rotate(-3 59 70)" />
        </g>
      )}

      {stage === 3 && (
        <g>
          <path d="M60 118 Q56 90 58 55" stroke={stem} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M57 85 Q44 76 36 70" stroke={stem} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M58 76 Q72 67 79 62" stroke={stem} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Base leaves */}
          <path d={droop ? "M59,108 C48,116 32,118 30,114 C34,108 50,106 59,108 Z" : "M59,108 C48,100 32,98 30,102 C34,108 50,110 59,108 Z"} fill={leafB} />
          <path d={droop ? "M61,108 C72,116 88,118 90,114 C86,108 70,106 61,108 Z" : "M61,108 C72,100 88,98 90,102 C86,108 70,110 61,108 Z"} fill={leafB} />
          {/* Mid leaves */}
          <path d={droop ? "M58,90 C48,98 34,100 32,96 C36,90 50,88 58,90 Z" : "M58,90 C48,82 34,80 32,84 C36,90 50,92 58,90 Z"} fill={leafA} />
          <path d={droop ? "M62,90 C72,98 86,100 88,96 C84,90 70,88 62,90 Z" : "M62,90 C72,82 86,80 88,84 C84,90 70,92 62,90 Z"} fill={leafA} />
          {/* Branch leaves */}
          <path d={droop ? "M34,72 C28,78 20,78 20,75 C24,70 32,70 34,72 Z" : "M34,72 C28,66 20,66 20,69 C24,74 32,74 34,72 Z"} fill={leafA} />
          <path d={droop ? "M81,64 C88,70 95,68 95,65 C92,60 84,61 81,64 Z" : "M81,64 C88,58 95,56 95,59 C92,64 84,65 81,64 Z"} fill={leafA} />
          {/* Top */}
          <ellipse cx="58" cy="53" rx="7" ry="9" fill={leafA} transform="rotate(-5 58 53)" />
          {!droop && <circle cx="58" cy="45" r="4.5" fill={flowerA} opacity="0.9" />}
        </g>
      )}

      {stage === 4 && (
        <g>
          <path d="M60 118 Q55 88 58 50" stroke={stem} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M57 92 Q42 80 33 74" stroke={stem} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M58 82 Q73 70 82 64" stroke={stem} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M57 68 Q46 58 39 52" stroke={stem} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M58 62 Q68 52 76 47" stroke={stem} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Base leaves */}
          <path d={droop ? "M59,110 C46,118 28,120 26,116 C30,110 48,108 59,110 Z" : "M59,110 C46,102 28,100 26,104 C30,110 48,112 59,110 Z"} fill={leafB} />
          <path d={droop ? "M61,110 C74,118 92,120 94,116 C90,110 72,108 61,110 Z" : "M61,110 C74,102 92,100 94,104 C90,110 72,112 61,110 Z"} fill={leafB} />
          {/* Mid leaves */}
          <path d={droop ? "M58,94 C46,102 30,104 28,100 C32,94 48,92 58,94 Z" : "M58,94 C46,86 30,84 28,88 C32,94 48,96 58,94 Z"} fill={leafA} />
          <path d={droop ? "M62,94 C74,102 90,104 92,100 C88,94 72,92 62,94 Z" : "M62,94 C74,86 90,84 92,88 C88,94 72,96 62,94 Z"} fill={leafA} />
          {/* Lower branch leaves */}
          <path d={droop ? "M30,76 C22,84 12,83 12,79 C16,74 28,74 30,76 Z" : "M30,76 C22,68 12,67 12,71 C16,76 28,76 30,76 Z"} fill={leafA} />
          <path d={droop ? "M84,66 C92,74 102,72 102,68 C98,63 86,64 84,66 Z" : "M84,66 C92,58 102,56 102,60 C98,65 86,66 84,66 Z"} fill={leafA} />
          {/* Upper branch leaves */}
          <path d={droop ? "M37,54 C30,60 22,60 22,57 C26,52 35,52 37,54 Z" : "M37,54 C30,48 22,48 22,51 C26,56 35,56 37,54 Z"} fill={leafB} />
          <path d={droop ? "M78,49 C85,55 93,53 93,50 C90,45 80,46 78,49 Z" : "M78,49 C85,43 93,41 93,44 C90,49 80,50 78,49 Z"} fill={leafB} />
          {/* Top */}
          <ellipse cx="58" cy="48" rx="8" ry="10" fill={leafA} transform="rotate(-3 58 48)" />
          {!droop && (
            <>
              <circle cx="30" cy="73" r="4.5" fill={flowerA} opacity="0.9" />
              <circle cx="84" cy="64" r="4" fill={flowerB} opacity="0.9" />
              <circle cx="38" cy="51" r="3.5" fill={flowerA} opacity="0.9" />
              <circle cx="58" cy="39" r="5.5" fill={flowerB} opacity="0.95" />
            </>
          )}
        </g>
      )}
    </svg>
  );
}

export function PlantWidget({ percentage, droop, role }: PlantWidgetProps) {
  const stage = getStage(percentage);
  const [prevStage, setPrevStage] = useState(stage);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (stage !== prevStage) {
      setAnimKey(k => k + 1);
      setPrevStage(stage);
    }
  }, [stage, prevStage]);

  const statusLabel = droop ? droopLabel : stageLabels[stage];
  const pctRounded = Math.round(percentage);

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl" style={{ background: 'rgba(234,244,239,0.7)', border: '1px solid rgba(107,143,107,0.2)' }}>
      <p style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.7rem', color: '#6B8F6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {role === 'admin' ? 'Class Garden' : 'My Plant'}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          <motion.div
            animate={droop ? { rotate: [0, -2, 2, -1, 0] } : { rotate: 0 }}
            transition={{ duration: 2, repeat: droop ? Infinity : 0, repeatDelay: 4 }}
          >
            <PlantSVG stage={stage} droop={droop} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(107,143,107,0.15)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: droop ? '#D4A853' : '#6B8F6B' }}
          initial={{ width: '0%' }}
          animate={{ width: `${pctRounded}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      <p style={{ fontSize: '0.65rem', color: droop ? '#C8714A' : '#4A6741', fontWeight: 600, fontFamily: 'Quicksand, sans-serif', textAlign: 'center', lineHeight: 1.3 }}>
        {statusLabel}
      </p>
    </div>
  );
}
