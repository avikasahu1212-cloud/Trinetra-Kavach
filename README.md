# 👁️ Trinetra Kavach: E-Commerce Guard
**AI-Driven Digital Trust & Real-Time Fraud Prevention Infrastructure**

*Built for HackDay 1.0 (Decodep Community)*

## 🚀 Overview
Online shopping platforms face an escalating threat from AI-generated product scams, automated bot review clusters, and fraudulent sellers. Standard security mechanisms are no longer sufficient to protect users from localized social engineering schemes[cite: 1]. 

**Trinetra Kavach** is an asynchronous, low-latency digital trust framework designed to detect e-commerce fraud in real time before financial damage occurs[cite: 1]. Acting as an intelligent security gateway, it evaluates product URLs, seller velocity anomalies, and contextual threat indicators to deliver automated risk verdicts[cite: 1].

## ✨ Key Features
* **Multi-Factor Risk Engine:** Computes a 0-100 Trust Score based on four weighted pillars: Seller Reputation, Image Forensics, Review Timeline Clustering, and Sentiment Authenticity.
* **Sub-100ms Risk Verdicts:** High-throughput API capable of delivering instant threat scores (Low/Medium/High)[cite: 1].
* **Chrome Extension Simulation:** Frictionless user experience overlaying trust scores directly onto product pages like Myntra and Amazon.
* **Anomaly Detection Telemetry:** Visual graphs plotting review volume against posting dates to instantly expose bot-driven review spikes.
* **"Ask Security AI" Assistant:** An interactive drawer powered by the Gemini API that allows users to interrogate the specific reasons behind a product's risk score.
* **Community Threat Ledger:** A live, crowdsourced database of flagged scams backed by Row-Level Security (RLS)[cite: 1].

## 🏗️ The Core Architecture
Our system ingests event payloads and delivers fast-path determinative rule checks alongside an LLM engine that analyzes unstructured context[cite: 1]. 

### Technology Stack
* **Frontend:** React.js, Tailwind CSS, Recharts, Lucide Icons
* **Backend Framework:** Python, FastAPI (Async Python Microservices)[cite: 1]
* **Database & Security:** Supabase / PostgreSQL (Row-Level Security & Role-Based Access)[cite: 1]
* **Intelligence Layer:** Google Gemini API / Custom Rule Engine[cite: 1]

## 🎯 Expected Impact
* **Significant Fraud Reduction:** Automated blocking and visual warnings for high-risk anomalies and localized phishing attempts[cite: 1].
* **Zero PII Leakage:** A secure, privacy-preserving infrastructure that evaluates threat signals without storing plain-text user identifiers[cite: 1].
* **Seamless Developer Integration:** Simple REST/Webhook integration allowing digital platforms to deploy multi-layer fraud protection with minimal code changes[cite: 1].

## 💻 Local Setup & Deployment
1. Clone the repository: `https://github.com/avikasahu1212-cloud/Trinetra-Kavach`
2. Install frontend dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Set up your Supabase and Gemini API keys in the `.env` file.

## 👥 Team
**Team: SOLESTACK**[cite: 1]
* Avika Sahu[cite: 1]
