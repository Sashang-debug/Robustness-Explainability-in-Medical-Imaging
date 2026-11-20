import React, { useState } from 'react'
import { CheckCircle2, XCircle, RefreshCw, Server, Shield, Laptop, Cloud, Radio } from 'lucide-react'

export default function Header({
  apiUrl,
  setApiUrl,
  connectionStatus,
  connectionDetails,
  onRefreshHealth,
  isCheckingHealth
}) {
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [tempUrl, setTempUrl] = useState(apiUrl)

  const handleSaveUrl = (e) => {
    e.preventDefault()
    const cleanUrl = tempUrl.trim()
    setApiUrl(cleanUrl)
    setIsEditingUrl(false)
    onRefreshHealth(cleanUrl)
  }

  const handleQuickSwitch = (targetUrl) => {
    setApiUrl(targetUrl)
    setTempUrl(targetUrl)
    setIsEditingUrl(false)
    onRefreshHealth(targetUrl)
  }

  const isConnected = connectionStatus === 'connected'
  const isChecking = connectionStatus === 'checking' || isCheckingHealth
  const isLocal = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1') || connectionDetails?.mode === 'local'

  return (
    <header className="border-b border-white/[0.08] bg-clinical-950/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Identity & Project Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                ABV-IIITM Gwalior
              </span>
              <span className="text-xs text-slate-500 font-mono">
                TAI Capstone • PneumoniaMNIST
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
              Robustness & Explainability in Medical Imaging
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed mt-0.5">
              Auditing empirical risk minimization vs Madry PGD adversarial defenses and XAI attribution fidelity under perturbation
            </p>
          </div>

          {/* Precision Backend Switcher & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 self-start lg:self-center">
            
            {/* Quick Switch Engine Toggle */}
            <div className="flex items-center bg-clinical-900 border border-white/[0.08] p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => handleQuickSwitch('http://localhost:8000')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  isLocal
                    ? 'bg-sky-500/20 text-sky-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to local server"
              >
                <Laptop className="w-3.5 h-3.5 text-sky-400" />
                <span>Local Engine</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSwitch('https://trapping-muster-ditto.ngrok-free.dev')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  !isLocal
                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Kaggle T4 GPU"
              >
                <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kaggle T4</span>
              </button>
            </div>

            {/* Live Connection Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              isChecking
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {isChecking ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : isConnected ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              
              <span className="font-medium">
                {isChecking
                  ? 'Verifying...'
                  : isConnected
                  ? (isLocal ? 'Local Server Active' : 'Kaggle GPU Active')
                  : 'Backend Offline'}
              </span>

              {isConnected && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-slate-300">
                  {connectionDetails?.mode === 'local' ? 'localhost:8000' : (connectionDetails?.device || 'CUDA')}
                </span>
              )}

              <button
                type="button"
                onClick={() => onRefreshHealth(apiUrl)}
                disabled={isChecking}
                title="Refresh health status"
                className="p-1 hover:bg-white/[0.08] rounded text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Inline URL Editor */}
            {isEditingUrl ? (
              <form onSubmit={handleSaveUrl} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="bg-clinical-900 border border-sky-500/60 rounded px-2.5 py-1 text-xs font-mono text-sky-200 focus:outline-none w-52"
                  placeholder="http://localhost:8000"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempUrl(apiUrl)
                    setIsEditingUrl(false)
                  }}
                  className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5 bg-clinical-900 border border-white/[0.08] rounded px-2.5 py-1 text-xs">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-slate-300 truncate max-w-[130px] sm:max-w-[160px]" title={apiUrl}>
                  {apiUrl}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempUrl(apiUrl)
                    setIsEditingUrl(true)
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium ml-0.5 text-[11px]"
                >
                  Edit
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  )
}
