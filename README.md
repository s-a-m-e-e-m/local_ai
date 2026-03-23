# Emergency Assistant AI

Emergency Assistant AI is a fully offline, browser-based assistant for everyday support and high-pressure emergency contexts. It combines local language, vision, speech recognition, and speech synthesis models into one interface without requiring cloud inference.

# Live demo

Live page: https://emergencyassistantai.vercel.app/

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)

## Why this app

- Works offline after initial model download
- Keeps sensitive interactions local to the browser
- Supports chat, voice, and camera-based guidance
- Includes one-click emergency helpline actions

## Core capabilities

### 1) General Support Mode

- Local chat assistant powered by on-device LLM
- File-aware Q and A with context extraction from:
	- PDF
	- DOCX
	- Images (OCR)
- Optional in-chat voice support modal

### 2) Emergency Mode

- Voice assistant with STT + LLM + TTS pipeline
- Vision assistant for scene understanding
- Live camera analysis mode
- Emergency call shortcuts (India helplines configured in UI)

### 3) On-device model stack

- LLM: LiquidAI LFM2 350M and 1.2B Tool (GGUF via llama.cpp backend)
- VLM: LiquidAI LFM2-VL 450M
- STT: sherpa-onnx Whisper Tiny (English)
- TTS: sherpa-onnx Piper Lessac voice
- VAD: Silero VAD v5

## Tech stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- RunAnywhere Web SDK
- llama.cpp web backend
- ONNX web backend (sherpa-onnx)
- Tesseract.js (OCR)
- pdfjs-dist + mammoth (document extraction)

## Application flow

1. App boots and initializes RunAnywhere SDK.
2. LlamaCPP and ONNX backends are registered.
3. Model catalog is registered in-app.
4. Models load lazily when a feature is first used.
5. Downloaded artifacts are cached in browser storage (OPFS).

## Quick start

### Prerequisites

- Node.js 18+
- npm 9+
- Modern Chromium-based browser recommended
- Camera and microphone permissions for vision/voice features

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Type-check and create production build
npm run preview  # Preview built app locally
```

## Project structure

```text
local_ai/
	src/
		App.tsx                 # Router + SDK bootstrap gate
		runanywhere.ts          # SDK init, backends, model catalog
		components/
			Assistant.tsx         # Landing page
			GeneralSupport.tsx    # Chat-first support screen
			Emergency.tsx         # Voice + vision emergency screen
			ChatTab.tsx           # Chat + file context extraction
			VoiceTab.tsx          # STT/LLM/TTS emergency voice loop
			VisionTab.tsx         # Camera capture + VLM inference
		hooks/
			useModelLoader.ts     # Shared model loading state
		utils/
			extractPdfText.ts
			extractDocxText.ts
			extractImageText.ts
		workers/
			vlm-worker.ts         # Worker bridge for VLM inference
```

## Deployment notes

When deploying, make sure ONNX runtime helper assets are available under assets/sherpa and URLs are built from BASE_URL. This project already resolves those paths through the runtime helper in src/runanywhere.ts.

If you see 404 errors for sherpa-onnx files in production, verify your build output contains:

- assets/sherpa/sherpa-onnx-glue.js
- assets/sherpa/*.wasm files

## Privacy and safety

- Inference runs locally in the browser runtime
- No cloud inference is required for core assistant behavior
- Emergency numbers are static UI shortcuts; users are responsible for verifying local emergency services in their region

## Known limitations

- First run can take time due to model downloads
- Performance depends on device memory and browser capabilities
- Speech model defaults are English-centric

## Troubleshooting

### SDK or model load fails

- Refresh the page and retry model load
- Check browser console for WASM/network errors
- Confirm enough memory is available

### Camera does not start

- Allow camera permission in browser settings
- Ensure no other app is locking the camera

### Microphone does not capture speech

- Allow microphone permission
- Confirm the selected input device is active

### Production build runs but voice/vision fails

- Confirm ONNX helper and WASM files are copied to dist/assets/sherpa
- Confirm BASE_URL-aware paths are used in SDK registration

## Roadmap ideas

- Multi-language STT/TTS packs
- Region-aware emergency service presets
- Better device capability detection and adaptive model selection

## License

Add your project license at MIT.