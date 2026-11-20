import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import ExperimentControls from './components/ExperimentControls'
import ModelCards from './components/ModelCards'
import AttributionMatrix from './components/AttributionMatrix'
import BenchmarkSection from './components/BenchmarkSection'
import Footer from './components/Footer'
import { checkHealth, analyzeXRay, loadSampleAsFile } from './services/api'
import initialData from './data/initialData.json'

export default function App() {
  // Default to local server if available, fallback to ngrok
  const [apiUrl, setApiUrl] = useState('http://localhost:8000')
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)

  // Controls state
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('/samples/pneumonia_test.png')
  const [attackType, setAttackType] = useState('pgd')
  const [eps, setEps] = useState(8)
  const [trueLabel, setTrueLabel] = useState(1) // 1 = Pneumonia, 0 = Normal
  const [sampleLoading, setSampleLoading] = useState(false)

  // Inference & XAI results state (preloaded with initialData from notebook/curl)
  const [analysisResult, setAnalysisResult] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Health check handler with auto-fallback between local and remote
  const verifyHealth = async (urlToTest = apiUrl) => {
    setIsCheckingHealth(true)
    setConnectionStatus('checking')
    
    // First try the requested URL
    const res = await checkHealth(urlToTest)
    if (res.ok) {
      setConnectionStatus('connected')
      setConnectionDetails(res.data)
      setIsCheckingHealth(false)
      return
    }

    // If requested URL was remote and failed, check if local server is up
    if (!urlToTest.includes('localhost')) {
      const localRes = await checkHealth('http://localhost:8000')
      if (localRes.ok) {
        setApiUrl('http://localhost:8000')
        setConnectionStatus('connected')
        setConnectionDetails(localRes.data)
        setIsCheckingHealth(false)
        return
      }
    }

    // If local was requested and failed, check if ngrok is up
    if (urlToTest.includes('localhost')) {
      const remoteRes = await checkHealth('https://trapping-muster-ditto.ngrok-free.dev')
      if (remoteRes.ok) {
        setApiUrl('https://trapping-muster-ditto.ngrok-free.dev')
        setConnectionStatus('connected')
        setConnectionDetails(remoteRes.data)
        setIsCheckingHealth(false)
        return
      }
    }

    setConnectionStatus('offline')
    setConnectionDetails(null)
    setIsCheckingHealth(false)
  }

  // Load sample on click
  const handleLoadSample = async (type) => {
    setSampleLoading(true)
    setError(null)
    try {
      const filename = type === 'pneumonia' ? 'pneumonia_test.png' : 'normal_test.png'
      const samplePath = `/samples/${filename}`
      const file = await loadSampleAsFile(samplePath, filename)
      setSelectedFile(file)
      setPreviewUrl(samplePath)
      setTrueLabel(type === 'pneumonia' ? 1 : 0)
    } catch (err) {
      console.error('Error loading sample:', err)
      setError(`Failed to load ${type} sample file.`)
    } finally {
      setSampleLoading(false)
    }
  }

  // Manual file upload handler
  const handleFileSelect = (file) => {
    setSelectedFile(file)
    const objUrl = URL.createObjectURL(file)
    setPreviewUrl(objUrl)
    setError(null)
  }

  // Run Attack & Explain
  const handleRunAnalysis = async () => {
    if (!selectedFile) {
      setError('Please select or load an X-ray image first.')
      return
    }

    setIsLoading(true)
    setError(null)

    const res = await analyzeXRay(apiUrl, selectedFile, attackType, eps, trueLabel)

    if (res.ok) {
      setAnalysisResult(res.data)
    } else {
      setError(res.error)
    }
    setIsLoading(false)
  }

  // On initial mount: check health and preload default pneumonia test sample file
  useEffect(() => {
    verifyHealth(apiUrl)
    handleLoadSample('pneumonia')
  }, [])

  return (
    <div className="min-h-screen bg-clinical-950 flex flex-col selection:bg-sky-500/20 selection:text-sky-200">
      
      {/* 1. Header & Backend Connection Bar */}
      <Header
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        connectionStatus={connectionStatus}
        connectionDetails={connectionDetails}
        onRefreshHealth={verifyHealth}
        isCheckingHealth={isCheckingHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 2. Interactive Experiment Controls */}
        <section aria-label="Experiment Controls">
          <ExperimentControls
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            attackType={attackType}
            setAttackType={setAttackType}
            eps={eps}
            setEps={setEps}
            trueLabel={trueLabel}
            setTrueLabel={setTrueLabel}
            onFileSelect={handleFileSelect}
            onLoadSample={handleLoadSample}
            onRunAnalysis={handleRunAnalysis}
            isLoading={isLoading}
            error={error}
            sampleLoading={sampleLoading}
          />
        </section>

        {/* 3. Model Comparison Cards (Side-by-Side) */}
        <section aria-label="Model Comparison">
          <ModelCards
            standardData={analysisResult?.standard}
            robustData={analysisResult?.robust}
            trueLabel={trueLabel}
          />
        </section>

        {/* 4. 2x5 XAI Attribution Matrix (Main Visual Focus) */}
        <section aria-label="XAI Attribution Matrix">
          <AttributionMatrix
            standardMaps={analysisResult?.standard?.maps}
            robustMaps={analysisResult?.robust?.maps}
            attackType={attackType}
            eps={eps}
          />
        </section>

        {/* 5. Quantitative Benchmarks & Sanity Check Section */}
        <section aria-label="Benchmarks and Sanity Check">
          <BenchmarkSection
            benchmarks={analysisResult?.benchmarks}
          />
        </section>

      </main>

      {/* Project Footer */}
      <Footer />

    </div>
  )
}
