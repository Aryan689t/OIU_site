# OiU — Meeting Awareness Assistant Landing Page

> **Never miss your name again.** OiU listens in your online meetings and alerts you instantly whenever your name or set keywords are mentioned.

A high-performance, pixel-faithful, responsive landing page for the **OiU** Chrome Extension, built with modern semantic HTML5, Tailwind CSS, custom animations, and interactive simulators.

---

## ⚡ Highlights & Features

- **Exact Design Match**: Implemented to match the high-energy aesthetic with pitch black (`#000000`) and signature vibrant yellow (`#FFE600`).
- **Interactive Multitask Simulation (Live Sample)**:
  1. Click **"Start Listening"** in the OiU panel.
  2. After 2 seconds, the browser mockup automatically switches tabs to a **YouTube Lecture video** (*CS 162: Virtual Memory & Page Tables*).
  3. While you are watching the YouTube lecture, the teacher in Google Meet calls on you:
     - Audible chime notification synthesized via the **Web Audio API**.
     - Spoken question aloud using **Web Speech Synthesis**: *"Aryan, could you explain what happens when a page fault occurs during execution?"*
     - A realistic **Chrome Desktop Notification** slides into view with the question and a **"Switch Back to Meet ↩"** button.
  4. Click the notification or Meet tab to switch back:
     - Priya S.'s video tile highlights with an active speaking border and live question caption bubble.
     - Top alert banner details: *"You were mentioned 8s ago • Priya S."*
     - OiU Side Panel records the question in **Recent Mentions** with a **"Copy Context"** button!
- **Custom Name & ID Tester**: Test the alert trigger dynamically with your own name, college roll number, or keywords (e.g., "Rahul", "Sarah", "2024CS01").
- **Interactive FAQ Accordion**: Expandable answers to common privacy and platform questions.
- **Quick-Start Guide Modal**: Clean step-by-step onboarding walkthrough for new users.
- **Fully Responsive**: Optimized for ultra-wide desktop monitors, laptops, tablets, and mobile smartphones.

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or serve it using any lightweight HTTP server:

```powershell
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

Then visit `http://localhost:3000` in your browser.

---

## 📂 Project Structure

```text
OIU_site/
├── assets/
│   ├── participant-1.jpg    # Meeting video tile (Aryan)
│   ├── participant-2.jpg    # Meeting video tile (Priya)
│   ├── participant-3.jpg    # Meeting video tile (Rohan)
│   └── participant-4.jpg    # Meeting video tile (Ananya)
├── index.html               # Main landing page markup & SVG graphics
├── styles.css               # Design system, glow gradients, audio bars, animations
├── script.js                # Web Audio chime, Web Speech synthesis, tab switching
└── README.md                # Project documentation
```
