import React, { useState, useRef } from 'react'
import { Upload, Sliders, Zap, AlertTriangle, Eye, RefreshCw, Crosshair, Sparkles, Loader2 } from 'lucide-react'

export default function ExperimentControls({
  selectedFile,
  previewUrl,
  attackType,
  setAttackType,
  eps,
  setEps,
  trueLabel,
  setTrueLabel,
  onFileSelect,
  onLoadSample,
  onRunAnalysis,
  isLoading,
  error,
  sampleLoading
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [invertScan, setInvertScan] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const attackOptions = [
    {
      id: 'pgd',
      name: 'Projected Gradient Descent (PGD L∞)',
      short: 'PGD L∞',
      math: 'x_{t+1} = Π_{x+S}(x_t + α·sign(∇_x L))',
      summary: '7-step iterative worst-case perturbation within L∞ budget ball'
    },
    {
      id: 'fgsm',
      name: 'Fast Gradient Sign Method (FGSM 1-Step)',
      short: 'FGSM',
      math: 'x_{adv} = x + ε·sign(∇_x L(θ, x, y))',
      summary: 'Single-step gradient ascent along direction of maximum loss'
    },
    {
      id: 'cw',
      name: 'Carlini & Wagner (C&W L2)',
      short: 'C&W L2',
      math: 'min ||δ||_2 + c·f(x+δ),  x+δ = ½(tanh(w)+1)',
      summary: 'Optimization-based boundary attack using tanh variable change'
    },
    {
      id: 'none',
      name: 'Clean Chest Radiograph (Baseline)',
      short: 'Clean',
      math: 'x_{adv} = x  (ε = 0)',
      summary: 'Unaltered clinical radiograph without adversarial manipulation'
    }
  ]

  const activeAttack = attackOptions.find(a => a.id === attackType) || attackOptions[0]

  return (
    <div className="bg-clinical-900/90 border border-white/[0.08] rounded-xl p-6 shadow-clinical-card">
      
      {/* Alert banner if an error occurs */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-200">Execution Error: </span>
            {error}
            <div className="mt-1 text-rose-300/80">
              Check if the backend is actively listening or switch to the Local Engine preset in the top bar.
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* VIEWPORT: Active Radiograph & Quick Samples (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wide text-slate-300">
                Chest Radiograph Viewport
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvertScan(!invertScan)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                    invertScan 
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                      : 'bg-white/[0.04] text-slate-400 border-white/[0.06] hover:text-slate-200'
                  }`}
                  title="Invert grayscale pixel values (standard radiological viewer tool)"
                >
                  <Eye className="w-3 h-3" />
                  <span>Invert</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">64×64</span>
              </div>
            </div>

            {/* Diagnostic Viewport Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-xl border border-white/[0.08] bg-black overflow-hidden transition-all cursor-pointer flex flex-col items-center justify-center min-h-[170px] ${
                isDragging ? 'border-sky-400 bg-sky-950/20' : 'hover:border-white/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <div className="relative w-full h-full flex items-center justify-center p-3">
                  {/* Anatomical Orientation Markers (R / L) */}
                  <div className="absolute top-2 left-3 font-mono font-bold text-xs text-slate-500 select-none">
                    R
                  </div>
                  <div className="absolute top-2 right-3 font-mono font-bold text-xs text-slate-500 select-none">
                    L
                  </div>
                  <div className="absolute bottom-2 left-3 font-mono text-[10px] text-slate-500 select-none">
                    AP CHEST
                  </div>
                  <div className="absolute bottom-2 right-3 font-mono text-[10px] text-slate-400 select-none">
                    {trueLabel === 1 ? 'PNEUMONIA' : 'NORMAL'}
                  </div>

                  {/* Radiograph Image with Inversion */}
                  <div className="w-32 h-32 rounded bg-black border border-white/[0.08] overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={previewUrl}
                      alt="Selected Chest Radiograph"
                      className={`w-full h-full object-contain ${invertScan ? 'invert' : ''}`}
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-300">
                    Drop chest X-ray image here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Or click to browse from local files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Clinical Sample Buttons */}
          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <div className="text-[11px] font-medium text-slate-400 mb-2">
              Preset benchmark test cases:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onLoadSample('pneumonia')}
                disabled={sampleLoading}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-clinical-850 hover:bg-clinical-800 border border-white/[0.08] hover:border-rose-500/40 text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Pneumonia Case</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">y=1</span>
              </button>

              <button
                type="button"
                onClick={() => onLoadSample('normal')}
                disabled={sampleLoading}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-clinical-850 hover:bg-clinical-800 border border-white/[0.08] hover:border-emerald-500/40 text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Normal Control</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">y=0</span>
              </button>
            </div>
          </div>
        </div>

        {/* PARAMETERS: Attack Selection & Budget Slider (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="attack-dropdown" className="text-xs font-semibold tracking-wide text-slate-300">
                Adversarial Attack Vector
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {attackType === 'cw' ? 'L2 Optimization' : 'L∞ Sign'}
              </span>
            </div>

            <select
              id="attack-dropdown"
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              className="w-full bg-black/60 border border-white/[0.12] rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-sky-500 transition-colors"
            >
              {attackOptions.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                  {opt.name}
                </option>
              ))}
            </select>

            <div className="mt-2 p-2.5 rounded-lg bg-clinical-850/60 border border-white/[0.04]">
              <div className="text-[11px] font-mono text-sky-300 truncate">
                {activeAttack.math}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {activeAttack.summary}
              </p>
            </div>
          </div>

          {/* Perturbation Budget Slider */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Perturbation Budget (ε)
              </span>
              <div className="font-mono text-xs tabular-nums">
                <span className="font-bold text-amber-400">{eps}/255</span>
                <span className="text-slate-400 ml-1.5">({(eps / 255).toFixed(4)})</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="16"
              step="1"
              value={eps}
              disabled={attackType === 'none'}
              onChange={(e) => setEps(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
            />

            {/* Quick ε chips */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
              <button
                type="button"
                onClick={() => setEps(0)}
                className={`hover:text-slate-200 transition-colors ${eps === 0 ? 'text-amber-400 font-bold' : ''}`}
              >
                0 (Clean)
              </button>
              <button
                type="button"
                onClick={() => setEps(4)}
                className={`hover:text-slate-200 transition-colors ${eps === 4 ? 'text-amber-400 font-bold' : ''}`}
              >
                4/255
              </button>
              <button
                type="button"
                onClick={() => setEps(8)}
                className={`hover:text-slate-200 transition-colors ${eps === 8 ? 'text-amber-400 font-bold' : ''}`}
              >
                8/255 (Bench)
              </button>
              <button
                type="button"
                onClick={() => setEps(16)}
                className={`hover:text-slate-200 transition-colors ${eps === 16 ? 'text-amber-400 font-bold' : ''}`}
              >
                16/255
              </button>
            </div>
          </div>
        </div>

        {/* DECISION GROUND TRUTH & ACTION (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-6 lg:pt-0 lg:pl-8">
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Ground Truth Label
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 rounded-lg border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setTrueLabel(1)}
                className={`py-2 rounded text-xs font-medium transition-all ${
                  trueLabel === 1
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Pneumonia</span>
                <span className="block text-[10px] font-mono text-slate-400">y = 1</span>
              </button>

              <button
                type="button"
                onClick={() => setTrueLabel(0)}
                className={`py-2 rounded text-xs font-medium transition-all ${
                  trueLabel === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Normal</span>
                <span className="block text-[10px] font-mono text-slate-400">y = 0</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Target class for loss gradients and misclassification analysis.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onRunAnalysis}
              disabled={isLoading || !selectedFile}
              className={`w-full py-3 px-4 rounded-lg font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
                isLoading || !selectedFile
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/[0.04]'
                  : 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-clinical-glow cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Computing 4 XAI Maps...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-sky-200 fill-current" />
                  <span>Run Attack & Explain</span>
                </>
              )}
            </button>
            <div className="text-[10px] font-mono text-slate-400 text-center mt-1.5">
              Captum GradCAM • SG • IG • SHAP
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
