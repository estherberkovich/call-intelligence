# Call Intelligence

Analyzes call transcripts for sentiment, key topics, action items, and risk signals — the "capture" layer of an AI-powered account management toolkit, complementing the QBR Assistant and Account Health Dashboard.

## What it does

- Covers three fictional sector portfolios: **Fintech/Payments**, **SaaS Product**, and **Enterprise IT/ITSM**, with realistic example call transcripts per account.
- Takes a raw call transcript (typed, pasted, or captured via live microphone transcription) and extracts:
  - Overall sentiment (positive / neutral / negative) with a numeric score
  - A concise call summary
  - Key topics discussed
  - Action items
  - Risk signals (competitor mentions, renewal hesitation, escalation language)
- Includes **live microphone recording** using the browser's native speech-to-text (Web Speech API) — no third-party transcription service required.

## Why this complements the other two tools

This is the "capture" step in a CSM's workflow: before notes can be structured into a QBR or an account's health can be scored, the raw conversation has to be turned into text and understood. This tool mirrors what a lightweight version of Gong or Fireflies focuses on — extracting signal from a live conversation — while the QBR Assistant handles structuring notes into a formal review, and the Account Health Dashboard handles ongoing risk scoring.

## Tech

- React + Vite
- Anthropic Claude API for live call analysis
- Web Speech API (`SpeechRecognition`) for live microphone transcription — built into Chrome and Edge, no external service or API key needed
- No backend — all account data is fictional, for demo purposes

## Notes on live features

- **AI analysis**: the "Analyze call" button calls the Anthropic API directly. This works inside Claude.ai (which proxies the request). In a standalone deployment, the pre-loaded example accounts fall back to a pre-written example output, clearly labeled. Custom or recorded transcripts will show a message directing you to try it inside Claude.ai for live generation.
- **Live recording**: works best in Chrome or Edge, on a standalone deployment (e.g. Vercel) rather than inside an embedded preview, since microphone access requires the page to run as a real website. The browser will prompt for microphone permission on first use.

## Run locally

```bash
npm install
npm run dev
```

---

*All account names, companies, and figures in this project are fictional, created for portfolio demonstration purposes.*
