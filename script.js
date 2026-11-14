// OiU - Meeting Awareness Assistant Interactive Multitasking Simulator Engine

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Notification Synthesizer (Web Audio API)
  let audioCtx = null;

  function playAlertChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Bright bell chime (Primary tone)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // Ramp up
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.65);

      // Harmonic second bell tone
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, now + 0.08); // E6
      gain2.gain.setValueAtTime(0.3, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.75);
    } catch (e) {
      console.log('Web Audio chime not supported or muted:', e);
    }
  }

  // 2. Elements
  const tabBtnMeet = document.getElementById('tab-btn-meet');
  const tabBtnYoutube = document.getElementById('tab-btn-youtube');
  const viewMeetTab = document.getElementById('view-meet-tab');
  const viewYoutubeTab = document.getElementById('view-youtube-tab');
  const omniboxUrl = document.getElementById('chrome-omnibox-url');
  const pinBadgeStatus = document.getElementById('pin-badge-status');
  const tabMeetAudioIndicator = document.getElementById('tab-meet-audio-indicator');

  const listenBtn = document.getElementById('listen-toggle-btn');
  const listenBtnText = document.getElementById('listen-btn-text');
  const listenStatusBadge = document.getElementById('extension-status-badge');
  const waveVisualizer = document.getElementById('audio-wave-visualizer');
  const activeTargetNameDisplay = document.getElementById('active-target-display');
  const activeTargetInput = document.getElementById('custom-name-input');
  const changeTargetBtn = document.getElementById('change-target-btn');

  const chromeNotification = document.getElementById('chrome-desktop-notification');
  const notifTargetTitle = document.getElementById('notif-target-title');
  const notifTargetBody = document.getElementById('notif-target-body');
  const notifSwitchBackBtn = document.getElementById('notif-switch-back-btn');
  const ytClosedCaptions = document.getElementById('yt-closed-captions');

  const teacherSpeechBubble = document.getElementById('teacher-speech-bubble');
  const tileSpeakerPriya = document.getElementById('tile-speaker-priya');
  const priyaSpeakingDot = document.getElementById('priya-speaking-dot');
  const mentionsHistoryCard = document.getElementById('mentions-history-card');
  const historyTranscriptText = document.getElementById('history-transcript-text');
  const copyAnswerBtn = document.getElementById('copy-answer-btn');

  let isListening = false;
  let timerToYoutube = null;
  let timerToAlert = null;

  function getCurrentTargetName() {
    return activeTargetNameDisplay ? activeTargetNameDisplay.textContent.trim() : 'Aryan';
  }

  // Tab switching helpers
  function switchToMeetTab() {
    // Tab styles
    tabBtnMeet.classList.add('chrome-tab-active');
    tabBtnMeet.classList.remove('chrome-tab-inactive');
    tabBtnYoutube.classList.remove('chrome-tab-active');
    tabBtnYoutube.classList.add('chrome-tab-inactive');

    // Omnibox URL
    omniboxUrl.textContent = 'meet.google.com/zyo-cecs-wtg';

    // Views
    viewMeetTab.classList.remove('hidden');
    viewYoutubeTab.classList.add('hidden');
    viewYoutubeTab.classList.remove('flex');
  }

  function switchToYoutubeTab() {
    // Tab styles
    tabBtnYoutube.classList.add('chrome-tab-active');
    tabBtnYoutube.classList.remove('chrome-tab-inactive');
    tabBtnMeet.classList.remove('chrome-tab-active');
    tabBtnMeet.classList.add('chrome-tab-inactive');

    // Omnibox URL
    omniboxUrl.textContent = 'youtube.com/watch?v=cs162-lecture14';

    // Views
    viewMeetTab.classList.add('hidden');
    viewYoutubeTab.classList.remove('hidden');
    viewYoutubeTab.classList.add('flex');
  }

  // 4. Start Multitasking Simulation
  function startSimulation() {
    isListening = true;
    const name = getCurrentTargetName();

    // 1. Update OiU Side Panel
    listenBtn.classList.remove('bg-[#FFE600]', 'hover:bg-[#ECD500]', 'text-black');
    listenBtn.classList.add('bg-zinc-800', 'hover:bg-zinc-700', 'text-[#FFE600]', 'border', 'border-[#FFE600]/40');
    listenBtnText.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
        Listening Active (Click to stop)
      </span>
    `;

    listenStatusBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Active</span>
    `;
    listenStatusBadge.classList.remove('bg-zinc-800/80', 'text-zinc-400');
    listenStatusBadge.classList.add('bg-emerald-950/60', 'border-emerald-500/40');

    if (pinBadgeStatus) {
      pinBadgeStatus.classList.remove('bg-zinc-500');
      pinBadgeStatus.classList.add('bg-[#FFE600]', 'animate-pulse');
    }

    if (tabMeetAudioIndicator) {
      tabMeetAudioIndicator.classList.remove('hidden');
    }

    if (waveVisualizer) {
      waveVisualizer.classList.remove('hidden');
      waveVisualizer.classList.add('flex');
    }

    // Reset previous alert views
    if (chromeNotification) chromeNotification.classList.add('hidden');
    if (teacherSpeechBubble) teacherSpeechBubble.classList.add('hidden');
    if (tileSpeakerPriya) tileSpeakerPriya.classList.remove('ring-4', 'ring-[#FFE600]', 'shadow-2xl');

    // 2. After 2 Seconds: Switch tab to YouTube!
    clearTimeout(timerToYoutube);
    timerToYoutube = setTimeout(() => {
      if (!isListening) return;

      // Switch view to YouTube video
      switchToYoutubeTab();

      // Show YouTube closed captions updating
      if (ytClosedCaptions) {
        ytClosedCaptions.innerHTML = `
          <span class="bg-black/90 text-yellow-300 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg border border-zinc-700 inline-block shadow-2xl animate-pulse">
            [Meeting Background Audio]: Priya S. is speaking in Google Meet...
          </span>
        `;
      }

      // 3. After another 2.5 seconds on YouTube: Trigger sound and Chrome Notification!
      clearTimeout(timerToAlert);
      timerToAlert = setTimeout(() => {
        if (!isListening) return;

        const currentName = getCurrentTargetName();

        // Play crisp chime alert sound
        playAlertChime();

        // Update YouTube Captions to show the exact question
        if (ytClosedCaptions) {
          ytClosedCaptions.innerHTML = `
            <span class="bg-black/95 text-[#FFE600] text-xs sm:text-sm font-black px-4 py-2.5 rounded-lg border-2 border-[#FFE600] inline-block shadow-2xl">
              🚨 [Google Meet Alert]: Priya S.: "${currentName}, could you explain what happens when a page fault occurs during execution?"
            </span>
          `;
        }

        // Show Chrome Notification Card sliding into top right of the screen
        if (chromeNotification) {
          if (notifTargetTitle) {
            notifTargetTitle.textContent = `🚨 ${currentName}, you were mentioned in Meet!`;
          }
          if (notifTargetBody) {
            notifTargetBody.innerHTML = `Priya S.: <em>"${currentName}, could you explain what happens when a page fault occurs during execution?"</em>`;
          }
          chromeNotification.classList.remove('hidden');
          chromeNotification.classList.add('animate-notification');
        }

      }, 2500);

    }, 2000);
  }

  // 4. User Switches Back to Meet Tab after the alert
  function returnToMeetWithAlertDetails() {
    switchToMeetTab();
    const currentName = getCurrentTargetName();

    // Hide Chrome notification
    if (chromeNotification) {
      chromeNotification.classList.add('hidden');
    }

    // Highlight Priya's tile as the active speaker who called your name
    if (tileSpeakerPriya) {
      tileSpeakerPriya.classList.add('ring-4', 'ring-[#FFE600]', 'shadow-2xl', 'shadow-[#FFE600]/30');
    }
    if (priyaSpeakingDot) {
      priyaSpeakingDot.classList.remove('bg-zinc-400');
      priyaSpeakingDot.classList.add('bg-[#FFE600]', 'animate-ping');
    }
    if (teacherSpeechBubble) {
      teacherSpeechBubble.innerHTML = `💬 "${currentName}, could you explain what happens when a page fault occurs?"`;
      teacherSpeechBubble.classList.remove('hidden');
    }

    // Populate Mentions History in OiU Side Panel
    if (mentionsHistoryCard) {
      if (historyTranscriptText) {
        historyTranscriptText.textContent = `"${currentName}, could you explain what happens when a page fault occurs during execution?"`;
      }
      mentionsHistoryCard.classList.remove('hidden');
    }
  }

  // Stop Simulation
  function stopSimulation() {
    isListening = false;
    clearTimeout(timerToYoutube);
    clearTimeout(timerToAlert);

    switchToMeetTab();

    listenBtn.classList.remove('bg-zinc-800', 'hover:bg-zinc-700', 'text-[#FFE600]', 'border', 'border-[#FFE600]/40');
    listenBtn.classList.add('bg-[#FFE600]', 'hover:bg-[#ECD500]', 'text-black');
    listenBtnText.innerHTML = `
      <svg class="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 02-3-3V5a3 3 0 116 0v6a3 3 0 02-3 3z"></path>
      </svg>
      Start Listening
    `;

    listenStatusBadge.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
      <span class="text-zinc-400 text-xs font-medium">Offline</span>
    `;
    listenStatusBadge.classList.add('bg-zinc-800/80', 'text-zinc-400');
    listenStatusBadge.classList.remove('bg-emerald-950/60', 'border-emerald-500/40');

    if (pinBadgeStatus) {
      pinBadgeStatus.classList.remove('bg-[#FFE600]', 'animate-pulse');
      pinBadgeStatus.classList.add('bg-zinc-500');
    }

    if (tabMeetAudioIndicator) {
      tabMeetAudioIndicator.classList.add('hidden');
    }

    if (waveVisualizer) {
      waveVisualizer.classList.add('hidden');
      waveVisualizer.classList.remove('flex');
    }

    if (chromeNotification) {
      chromeNotification.classList.add('hidden');
    }
  }

  // Event Listeners for Tab bar
  if (tabBtnMeet) {
    tabBtnMeet.addEventListener('click', () => {
      returnToMeetWithAlertDetails();
    });
  }

  if (tabBtnYoutube) {
    tabBtnYoutube.addEventListener('click', () => {
      switchToYoutubeTab();
    });
  }

  if (notifSwitchBackBtn) {
    notifSwitchBackBtn.addEventListener('click', () => {
      returnToMeetWithAlertDetails();
    });
  }

  if (listenBtn) {
    listenBtn.addEventListener('click', () => {
      if (isListening) {
        stopSimulation();
      } else {
        startSimulation();
      }
    });
  }

  // Copy Answer Button
  if (copyAnswerBtn) {
    copyAnswerBtn.addEventListener('click', () => {
      const textToCopy = `Question asked: "${getCurrentTargetName()}, could you explain what happens when a page fault occurs during execution?"\nAnswer: A page fault occurs when a program attempts to access a memory page that is not currently loaded into physical RAM. The OS loads it from secondary storage (swap/disk).`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyAnswerBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyAnswerBtn.textContent = '📋 Copy Context'; }, 2000);
      }).catch(() => {
        copyAnswerBtn.textContent = '✓ Copied!';
      });
    });
  }

  // Custom Name Changer
  if (changeTargetBtn && activeTargetInput && activeTargetNameDisplay) {
    changeTargetBtn.addEventListener('click', () => {
      const newName = activeTargetInput.value.trim();
      if (newName) {
        activeTargetNameDisplay.textContent = newName;
        activeTargetInput.value = '';
        if (isListening) {
          playAlertChime();
        }
      }
    });

    activeTargetInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        changeTargetBtn.click();
      }
    });
  }

  // "See how it works" smooth scroll & trigger simulation
  const seeHowItWorksBtn = document.getElementById('see-how-it-works-btn');
  if (seeHowItWorksBtn) {
    seeHowItWorksBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const showcase = document.getElementById('product-showcase');
      if (showcase) {
        showcase.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          if (!isListening && listenBtn) {
            startSimulation();
          }
        }, 800);
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        faqItems.forEach(other => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // Guide Modal
  const guideModal = document.getElementById('guide-modal');
  const openGuideBtns = document.querySelectorAll('.open-guide-btn');
  const closeGuideBtn = document.getElementById('close-guide-btn');

  openGuideBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (guideModal) {
        guideModal.classList.remove('hidden');
        guideModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeGuideBtn && guideModal) {
    closeGuideBtn.addEventListener('click', () => {
      guideModal.classList.add('hidden');
      guideModal.classList.remove('flex');
      document.body.style.overflow = '';
    });

    guideModal.addEventListener('click', (e) => {
      if (e.target === guideModal) {
        guideModal.classList.add('hidden');
        guideModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // Mobile Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});
