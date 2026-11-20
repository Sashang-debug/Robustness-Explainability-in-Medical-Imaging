# Robustness and Explainability in Medical Imaging

A Trustworthy AI (TAI) framework and interactive dashboard evaluating the adversarial robustness and explainability of deep learning models on medical chest X-ray diagnostics.

---

## 📌 Overview

Deep learning models for medical imaging achieve high diagnostic accuracy, but they are vulnerable to adversarial perturbations and often operate as "black boxes." This repository provides:
- **Adversarial Robustness Evaluation**: Benchmarks standard vs. robustly trained models under adversarial attacks (FGSM, PGD, noise).
- **Explainability (XAI)**: Generates and compares attribution maps (Grad-CAM, Integrated Gradients, Saliency Maps) under clean and adversarial conditions.
- **Interactive Dashboard**: Full-stack application allowing real-time or pre-computed exploration of model predictions, perturbation impacts, and XAI feature attributions.

---

## 🚀 Features

- **Model Benchmarking**: Compare Standard CNN / ResNet models against Adversarially Trained counterparts.
- **Adversarial Perturbation Simulation**: Test models against varying perturbation intensities ($\epsilon$) for FGSM and PGD attacks.
- **Explainability Matrix**: Visualize how adversarial noise shifts model attention away from critical anatomical regions (e.g. lung opacities in pneumonia detection).
- **Live Local Inference**: Node.js backend simulating/serving precomputed attributions and model health endpoints.
- **Modern UI**: Built with React, Vite, Tailwind CSS, and Astryx design components.

---

## 📁 Repository Structure

```
├── robustness-and-explainability-medical-imaging.ipynb  # PyTorch model training & evaluation notebook
├── src/                                               # Frontend React application
│   ├── components/                                    # UI components (ModelCards, AttributionMatrix, etc.)
│   ├── data/                                          # Baseline sample predictions and attribution data
│   ├── services/                                      # API integration layer
│   ├── App.jsx                                        # Main dashboard interface
│   └── main.jsx                                       # App entry point
├── public/                                            # Public static assets and test X-ray samples
├── server.js                                          # Node.js backend server (Port 8000)
├── run.sh                                             # Startup script for backend + frontend
├── package.json                                       # Project dependencies and npm scripts
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm`

### Installation

```bash
git clone https://github.com/Sashang-debug/Robustness-Explainability-in-Medical-Imaging.git
cd Robustness-Explainability-in-Medical-Imaging
npm install
```

### Running Locally

You can launch both the backend server and frontend application with a single command:

```bash
./run.sh
```

Or run them individually in separate terminal sessions:

**Backend Server (Port 8000):**
```bash
npm run server
```

**Frontend Dev Server (Port 3000 / 5173):**
```bash
npm run dev
```

---

## 🔬 Model Training & Evaluation Notebook

The research experiments and evaluation pipelines are detailed in [`robustness-and-explainability-medical-imaging.ipynb`](./robustness-and-explainability-medical-imaging.ipynb). It includes:
- Dataset loading and preprocessing (Chest X-Ray / Pneumonia).
- Standard baseline model training vs. Adversarial training.
- Perturbation generation using PGD and FGSM.
- Attribution map extraction via Grad-CAM, Integrated Gradients, and Saliency.

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
