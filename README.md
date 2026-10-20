
<div align="center">

# 🛡️ RAKSHAK

### Investment Scam Detection & Risk Awareness

**From uncertainty to clarity — before money moves.**

A privacy-first web application that helps users identify warning signs in suspicious investment messages and understand safer next steps before transferring money or sharing sensitive information.

<br/>

<a href="https://rakshak-5tte.onrender.com/">
  <img src="https://img.shields.io/badge/🚀_LIVE_WEBSITE-Try_RAKSHAK-16a34a?style=for-the-badge" alt="Live Website"/>
</a>

<br/><br/>

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/TypeScript-Type_Safe-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/Privacy-Local_First-blueviolet?style=flat-square"/>

</div>

---

## 🚀 Overview

RAKSHAK is a scam-awareness system designed to help users assess suspicious investment-related messages before taking potentially risky financial actions.

It analyzes available message content, identifies explainable warning signs, highlights supporting evidence, and provides practical safety guidance.

The project focuses on transparency and privacy rather than presenting a simple unexplained “scam” or “not a scam” result.

## ✨ Key Features

- 💬 **Multiple Input Modes** — Text, screenshots, and voice input.
- 🌐 **Hindi & English Support** — Designed for users communicating in different languages.
- 🗣️ **Hinglish-Aware Processing** — Handles common mixed Hindi-English expressions where supported.
- 🚩 **Explainable Red-Flag Detection** — Identifies configured warning patterns.
- 🔎 **Evidence-Based Results** — Shows the text or signals behind detected warnings.
- 🔗 **Suspicious URL Analysis** — Examines URL structure for potentially suspicious characteristics.
- 📊 **Risk Classification** — Organizes findings into clear risk categories.
- 🧭 **Safe Next Steps** — Provides practical guidance for further verification.
- 🔒 **Privacy-Focused Design** — Local-first processing for the core detection workflow.
- 🗂️ **Local Analysis History** — Keeps analysis history in browser storage where implemented.

## 📊 Risk Classification

| Level | Meaning |
|---|---|
| 🟢 **Low Concern** | No configured warning pattern was detected. This does not establish that a message is safe. |
| 🟡 **Suspicious** | Warning signs were detected; additional caution and independent verification are recommended. |
| 🔴 **High Risk Indicators** | Multiple or serious warning signs require careful review before taking action. |

RAKSHAK provides risk indicators, not a guaranteed prediction of fraud. A message with no detected warning signs may still be malicious.

## ⚙️ Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| OCR | Tesseract.js |
| Voice Input | Browser Speech Recognition |
| Backend | Python, FastAPI |
| Detection | Deterministic, explainable rules and patterns |
| Storage | Browser Local Storage |

## 🔄 How It Works

```text
Text / Screenshot / Voice Input
              ↓
       Input Processing
              ↓
     OCR or Text Extraction
              ↓
   Red-Flag & URL Analysis
              ↓
   Evidence Identification
              ↓
      Risk Classification
              ↓
    Safe Next-Step Guidance
```

## 🔐 Privacy & Safety

RAKSHAK follows a local-first approach for its core detection workflow.

- Core detection is designed to work without sending user messages, screenshots, or analysis content to an external AI service.
- Analysis history can be stored locally in the browser.
- Users should avoid sharing sensitive personal or financial information unnecessarily.
- Browser-local storage is not encrypted storage and may be accessible to someone with access to the same browser profile.

**Privacy behavior depends on the actual implementation and deployment configuration.** Review network requests and storage behavior before treating any deployment as fully private.

## 🌐 Project Links

- **Live Website:** https://rakshak-5tte.onrender.com/
- **GitHub Repository:** https://github.com/ankitprajapati29/RAKSHAK

## 🏆 Hackathon

- **Event:** Sangyan Hackathon
- **Institution:** Indian Institute of Technology (BHU), Varanasi
- **Track:** Track A — Digital Fraud & Scam Resilience
- **Team:** AlgoRise

## 🔮 Future Scope

- Improve detection across Hindi, English, and Hinglish messages.
- Expand explainable scam-warning patterns.
- Strengthen URL analysis and evidence presentation.
- Improve accessibility for users with different digital literacy levels.
- Evaluate detection performance using representative test cases.
- Strengthen privacy safeguards and security testing.

## ⚠️ Disclaimer

RAKSHAK is an educational scam-awareness and risk-screening project. It does not guarantee scam detection, verify the legitimacy of an investment, or provide Buy/Sell/Hold investment advice.

Users should independently verify financial claims, avoid sharing OTPs or credentials, and consult appropriate official sources before transferring money.

---

<div align="center">

**Built by Team AlgoRise**

*From uncertainty to clarity — before money moves.*

</div>
