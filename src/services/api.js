// API Client with Ngrok Header Bypass

export const checkHealth = async (apiUrl) => {
  const url = apiUrl.replace(/\/+$/, '') + '/health'
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json'
      },
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    const data = await res.json()
    return { ok: true, data }
  } catch (err) {
    clearTimeout(timeoutId)
    return { ok: false, error: err.message || 'Connection failed' }
  }
}

export const analyzeXRay = async (apiUrl, file, attackType, eps255, trueLabel) => {
  const url = apiUrl.replace(/\/+$/, '') + '/analyze'
  const formData = new FormData()
  formData.append('file', file)
  formData.append('attack_type', attackType)
  formData.append('eps_255', String(eps255))
  formData.append('true_label', String(trueLabel))

  const controller = new AbortController()
  // Allow up to 45s for model forward pass + 4 XAI attribution algorithms (GradCAM, SmoothGrad, IG, SHAP)
  const timeoutId = setTimeout(() => controller.abort(), 45000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      body: formData,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Server returned ${res.status}: ${errText || res.statusText}`)
    }

    const data = await res.json()
    return { ok: true, data }
  } catch (err) {
    clearTimeout(timeoutId)
    let msg = err.message
    if (err.name === 'AbortError') {
      msg = 'Request timed out. Kaggle GPU session may be busy or calculating intensive attributions.'
    }
    return { ok: false, error: msg }
  }
}

export const loadSampleAsFile = async (samplePath, filename) => {
  const res = await fetch(samplePath)
  if (!res.ok) {
    throw new Error(`Failed to load ${samplePath}`)
  }
  const blob = await res.blob()
  return new File([blob], filename, { type: 'image/png' })
}
