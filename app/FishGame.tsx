'use client'

import { useState, useEffect, useRef } from 'react'

type Phase = 'idle' | 'cooking' | 'done'
type Outcome = 'raw' | 'good' | 'perfect' | 'burnt' | 'ash'

const TICK_MS = 50
const TICK_STEP = 0.38 // ~13 seconds to reach 100

const PERFECT_MIN = 50
const PERFECT_MAX = 67
const GOOD_MIN = 37
const GOOD_MAX = 79
const BURNT_MIN = 80

function getOutcome(p: number): Outcome {
  if (p < GOOD_MIN) return 'raw'
  if (p >= 95) return 'ash'
  if (p >= BURNT_MIN) return 'burnt'
  if (p >= PERFECT_MIN && p <= PERFECT_MAX) return 'perfect'
  return 'good'
}

function getFishColor(p: number) {
  if (p < 15) return '#a8c8e0'
  if (p < 40) return '#e8a070'
  if (p < 67) return '#c06820'
  if (p < 82) return '#6b2a08'
  return '#1c0a02'
}

const OUTCOMES: Record<Outcome, { emoji: string; title: string; msg: string; color: string }> = {
  raw:     { emoji: '🤢', title: 'Still Raw!',        msg: "The fish is completely undercooked. Your stomach won't thank you.",  color: '#3b82f6' },
  good:    { emoji: '😊', title: 'Pretty Good!',      msg: 'Cooked through! A little rushed but perfectly edible. Nice effort.', color: '#22c55e' },
  perfect: { emoji: '🏆', title: 'Perfect Cook!',     msg: 'Golden and flaky — you\'re a true beach chef legend!',               color: '#f59e0b' },
  burnt:   { emoji: '😬', title: 'A Bit Burnt...',    msg: 'Charred on the outside. The seagulls might still want it.',          color: '#f97316' },
  ash:     { emoji: '💀', title: 'Total Disaster!',   msg: 'Nothing left but ash. Even the crabs are embarrassed for you.',      color: '#6b7280' },
}

export default function FishGame({ name }: { name?: string | null }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    setProgress(0)
    setOutcome(null)
    setPhase('cooking')
  }

  const removeFish = () => {
    if (phase !== 'cooking') return
    if (timerRef.current) clearInterval(timerRef.current)
    setOutcome(getOutcome(progress))
    setPhase('done')
  }

  const reset = () => {
    setPhase('idle')
    setProgress(0)
    setOutcome(null)
  }

  useEffect(() => {
    if (phase !== 'cooking') return
    timerRef.current = setInterval(() => {
      setProgress(p => {
        const next = parseFloat((p + TICK_STEP).toFixed(2))
        if (next >= 100) {
          clearInterval(timerRef.current!)
          setOutcome('ash')
          setPhase('done')
          return 100
        }
        return next
      })
    }, TICK_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const isCooking = phase === 'cooking'
  const isDone = phase === 'done'
  const fishColor = phase === 'idle' ? '#a8c8e0' : getFishColor(progress)
  const result = outcome ? OUTCOMES[outcome] : null

  const barColor =
    progress < GOOD_MIN ? '#60a5fa'
    : progress < PERFECT_MIN ? '#4ade80'
    : progress <= PERFECT_MAX ? '#22c55e'
    : progress < BURNT_MIN ? '#fb923c'
    : '#ef4444'

  const grillOpacity = Math.min(Math.max((progress - 30) / 35, 0), 1)

  return (
    <>
      <style>{`
        @keyframes flicker {
          0%,100% { transform: scaleY(1) scaleX(1); opacity:1; }
          30%      { transform: scaleY(1.12) scaleX(0.88); opacity:.9; }
          60%      { transform: scaleY(.93) scaleX(1.07); opacity:1; }
        }
        @keyframes flicker2 {
          0%,100% { transform: scaleY(1) scaleX(1); opacity:.85; }
          40%      { transform: scaleY(1.15) scaleX(0.9); opacity:.7; }
          70%      { transform: scaleY(.9) scaleX(1.1); opacity:.9; }
        }
        @keyframes smoke-rise {
          0%   { opacity:.55; transform:translateY(0) scaleX(1); }
          100% { opacity:0;   transform:translateY(-36px) scaleX(2.2); }
        }
        @keyframes sway {
          0%,100% { transform: rotate(-1.5deg); }
          50%     { transform: rotate(1.5deg); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 12px 5px #ff660055; }
          50%     { box-shadow: 0 0 22px 10px #ff660088; }
        }
        .flame-main  { animation: flicker  .35s ease-in-out infinite; transform-origin: bottom center; }
        .flame-left  { animation: flicker2 .45s ease-in-out infinite .08s; transform-origin: bottom center; }
        .flame-right { animation: flicker  .40s ease-in-out infinite .15s; transform-origin: bottom center; }
        .smoke-puff  { animation: smoke-rise 1.6s ease-out infinite; }
        .smoke-puff2 { animation: smoke-rise 1.6s ease-out infinite .8s; }
        .fish-stick  { animation: ${isCooking ? 'sway 3.5s ease-in-out infinite' : 'none'}; transform-origin: bottom center; }
        .ember-glow  { animation: ${isCooking ? 'pulse-glow 1.2s ease-in-out infinite' : 'none'}; }
      `}</style>

      <div className="min-h-screen flex flex-col items-center bg-slate-900 py-8 px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">🏖️ Beach Fish Cook</h1>
          {name && <p className="text-slate-400 mt-1">Welcome, {name}! Don't burn the fish.</p>}
          {!name && <p className="text-slate-400 mt-1">Cook the fish perfectly — pull it off at the right moment!</p>}
        </div>

        {/* Scene */}
        <div className="relative rounded-2xl overflow-hidden w-full max-w-md shadow-2xl" style={{ height: 340 }}>
          {/* Sky */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0f3460 0%, #1a6090 45%, #2980b9 65%, #f4c430 100%)' }} />

          {/* Sun */}
          <div className="absolute" style={{ top: 28, right: 52, width: 52, height: 52, borderRadius: '50%', background: '#ffe066', boxShadow: '0 0 40px 14px #ffe06660' }} />

          {/* Distant waves */}
          <div className="absolute" style={{ top: 176, left: 0, right: 0, height: 28, background: 'rgba(30,120,200,0.45)', borderRadius: '0 0 60% 60% / 0 0 20% 20%' }} />
          <div className="absolute" style={{ top: 188, left: 0, right: 0, height: 18, background: 'rgba(20,100,180,0.35)' }} />

          {/* Sand */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 148, background: 'linear-gradient(to bottom, #f0d080 0%, #d4a843 100%)' }}>
            {/* Sand texture blobs */}
            <div className="absolute" style={{ top: 10, left: '15%', width: 60, height: 8, borderRadius: '50%', background: 'rgba(180,130,40,0.3)' }} />
            <div className="absolute" style={{ top: 30, right: '20%', width: 40, height: 6, borderRadius: '50%', background: 'rgba(180,130,40,0.25)' }} />
          </div>

          {/* === Campfire group === */}
          {/* Centered at 50% horizontal, fire base at bottom 72px */}
          <div className="absolute" style={{ left: '50%', bottom: 72, transform: 'translateX(-50%)' }}>

            {/* Stones around fire base */}
            {[[-32,0],[-20,-10],[0,-14],[20,-10],[32,0],[22,10],[-22,10]].map(([x,y],i) => (
              <div key={i} className="absolute" style={{
                left: x, bottom: y,
                width: 14, height: 9,
                background: '#808080',
                borderRadius: '50%',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)',
              }} />
            ))}

            {/* Logs */}
            <div className="absolute" style={{ bottom: 4, left: -28, width: 56, height: 11, background: '#5c2d0a', borderRadius: 6, transform: 'rotate(-18deg)', transformOrigin: 'center' }} />
            <div className="absolute" style={{ bottom: 4, left: -28, width: 56, height: 11, background: '#6b3510', borderRadius: 6, transform: 'rotate(18deg)', transformOrigin: 'center' }} />

            {/* Embers */}
            <div className="ember-glow absolute" style={{
              bottom: 10, left: -18,
              width: 36, height: 10,
              background: '#ff5500',
              borderRadius: '50%',
              opacity: isCooking ? 1 : 0.35,
              transition: 'opacity 0.5s',
            }} />

            {/* Flames — only when cooking or just done */}
            {(isCooking || isDone) && (
              <>
                <div className="flame-left absolute" style={{ bottom: 16, left: -14, width: 18, height: 38, background: 'linear-gradient(to top, #ff3300, #ff9900 55%, transparent)', borderRadius: '50% 50% 30% 30%' }} />
                <div className="flame-main absolute"  style={{ bottom: 16, left: -7,  width: 28, height: 58, background: 'linear-gradient(to top, #ff1a00, #ff7700 50%, #ffcc00 80%, transparent)', borderRadius: '50% 50% 25% 25%' }} />
                <div className="flame-right absolute" style={{ bottom: 16, left: 6,  width: 16, height: 34, background: 'linear-gradient(to top, #ff3300, #ff9900 55%, transparent)', borderRadius: '50% 50% 30% 30%' }} />
                {/* Smoke */}
                <div className="smoke-puff absolute"  style={{ bottom: 70, left: -2, width: 10, height: 10, background: 'rgba(160,160,160,0.5)', borderRadius: '50%' }} />
                <div className="smoke-puff2 absolute" style={{ bottom: 70, left: 6,  width: 7,  height: 7,  background: 'rgba(140,140,140,0.4)', borderRadius: '50%' }} />
              </>
            )}

            {/* Fish on stick */}
            <div className="fish-stick absolute" style={{ bottom: 14, left: -4 }}>
              {/* Vertical stick */}
              <div style={{ position: 'absolute', bottom: 0, left: 4, width: 5, height: 118, background: '#7a4820', borderRadius: 3 }} />
              {/* Horizontal spit */}
              <div style={{ position: 'absolute', bottom: 104, left: -28, width: 72, height: 4, background: '#8b5530', borderRadius: 3 }} />
              {/* Fish SVG */}
              <div style={{ position: 'absolute', bottom: 106, left: -30 }}>
                <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
                  {/* Tail fin */}
                  <polygon points="8,10 8,26 0,18" fill={fishColor} />
                  {/* Body */}
                  <ellipse cx="34" cy="18" rx="26" ry="13" fill={fishColor} />
                  {/* Dorsal fin */}
                  <path d="M 24 6 Q 36 -1 46 6" stroke={fishColor} strokeWidth="3" fill="none" />
                  {/* Scales hint when cooking */}
                  {progress > 20 && (
                    <ellipse cx="30" cy="18" rx="8" ry="9" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  )}
                  {/* Grill marks */}
                  <line x1="24" y1="8"  x2="20" y2="28" stroke="#3a1500" strokeWidth="2" opacity={grillOpacity} />
                  <line x1="34" y1="6"  x2="30" y2="29" stroke="#3a1500" strokeWidth="2" opacity={grillOpacity} />
                  <line x1="44" y1="8"  x2="40" y2="27" stroke="#3a1500" strokeWidth="2" opacity={grillOpacity} />
                  {/* Eye */}
                  <circle cx="54" cy="15" r="3.5" fill="white" />
                  <circle cx="55" cy="15" r="2" fill={progress > 85 ? '#555' : '#111'} />
                  {/* Mouth */}
                  <path d="M 62 19 Q 66 22 62 25" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Cook meter */}
        {(isCooking || isDone) && (
          <div className="w-full max-w-md mt-5 px-2">
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-blue-400">Raw</span>
              <span className="text-green-400">✦ Perfect zone</span>
              <span className="text-red-400">Burnt</span>
            </div>
            <div className="relative h-6 rounded-full bg-slate-700 overflow-hidden">
              {/* Good zone bg */}
              <div className="absolute top-0 bottom-0" style={{ left: `${GOOD_MIN}%`, width: `${GOOD_MAX - GOOD_MIN}%`, background: 'rgba(34,197,94,0.18)' }} />
              {/* Perfect zone bg */}
              <div className="absolute top-0 bottom-0" style={{ left: `${PERFECT_MIN}%`, width: `${PERFECT_MAX - PERFECT_MIN}%`, background: 'rgba(34,197,94,0.35)' }} />
              {/* Fill */}
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: barColor,
                transition: 'width 0.05s linear, background 0.4s',
                borderRadius: 9999,
              }} />
              {/* Perfect zone edges */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-green-400 opacity-70" style={{ left: `${PERFECT_MIN}%` }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-green-400 opacity-70" style={{ left: `${PERFECT_MAX}%` }} />
            </div>
            <p className="text-center text-xs text-slate-500 mt-1">
              {progress < GOOD_MIN && 'Needs more time…'}
              {progress >= GOOD_MIN && progress < PERFECT_MIN && 'Getting there…'}
              {progress >= PERFECT_MIN && progress <= PERFECT_MAX && '🟢 Now! Remove it!'}
              {progress > PERFECT_MAX && progress < BURNT_MIN && 'Getting overdone — remove it!'}
              {progress >= BURNT_MIN && '🔴 It\'s burning!'}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex flex-col items-center gap-4">
          {phase === 'idle' && (
            <button
              onClick={start}
              className="px-10 py-3 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full text-lg shadow-lg transition-colors"
            >
              🔥 Start Cooking
            </button>
          )}

          {phase === 'cooking' && (
            <button
              onClick={removeFish}
              className="px-10 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full text-lg shadow-lg transition-colors animate-bounce"
            >
              🐟 Remove Fish!
            </button>
          )}

          {phase === 'done' && result && (
            <div className="text-center">
              <div style={{ fontSize: 52 }}>{result.emoji}</div>
              <h2 className="text-2xl font-bold mt-2" style={{ color: result.color }}>{result.title}</h2>
              <p className="text-slate-400 mt-2 max-w-xs text-sm">{result.msg}</p>
              <button
                onClick={reset}
                className="mt-5 px-8 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {phase === 'idle' && (
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Put the fish over the fire, watch the cook meter, and remove it when it hits the green zone.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
