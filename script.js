/* ==========================================================================
   AVNII — WELCOME BACK 🦬💛
   Cinematic Interactive Core (Optimized & Performant)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STATE & CACHED DOM REFERENCES
  // ==========================================
  const state = {
    isAudioPlaying: false,
    audioSynthActive: false,
    audioContext: null,
    boopCount: 0,
    hasCried: false,
    specialPhotoId: 3,
    particles: [],
    tearDrop: null,
    ripples: [],
    isCanvasAnimating: false,
    visitedObjects: new Set(),
    notebookPage: 0,
    interrogateIndex: 0
  };

  // Secret Memory Dictionary
  const secretsDict = {
    voice: {
      title: "📞 Something about your voice",
      body: "I listened to random old voice notes just to hear your voice when things got quiet."
    },
    remember: {
      title: "♡ Remember this",
      body: "I still remember the random conversations more than the important ones."
    },
    dontclick: {
      title: "🥹 Don't click this",
      body: "I told you not to... Anyway... I love you, idiot. 💛"
    },
    buffalo: {
      title: "🦬 Classified Buffalo Information",
      body: "I miss you. Don't tell anyone."
    },
    star: {
      title: "✦ One small thing",
      body: "No matter how busy we get, you're always my priority."
    },
    cloud: {
      title: "☁️ Floating thought",
      body: "The world feels a little warmer when you're around."
    },
    psst: {
      title: "psst... 💛",
      body: "You probably don't realize how much space you occupy in my life. When you're gone, I notice. When you're back... everything feels normal again. Welcome home, idiot."
    },
    hidden_heart: {
      title: "💛 You found one already!",
      body: "you found one already 😭... there are more hidden inside the website!"
    },
    tag_dumbo: {
      title: "dumbo",
      body: "you really are one. 💛"
    },
    tag_buffalo: {
      title: "buffalo 🦬",
      body: "classified information... she's actually my favourite buffalo."
    },
    tag_person: {
      title: "my person ♡",
      body: "my favorite person in the whole wide world."
    },
    tag_sinchuu: {
      title: "sinchuu ✨",
      body: "always bringing sunshine wherever she goes."
    },
    tag_hemuu: {
      title: "hemuu",
      body: "the best friend anyone could ever ask for."
    }
  };

  const boopMessages = [
    "BUFFALO HAS BEEN BOOPED. 🦬",
    "she's angry.",
    "she forgives you.",
    "no she doesn't.",
    "okay fine she loves you.",
    "snort sound! 🦬",
    "buffalo level: MAXIMUM!",
    "still a dumbo 💛",
    "100% buffalo energy!",
    "she really, really loves you."
  ];

  const interrogateResponses = [
    "Buffalo refuses to answer. 🦬",
    "Buffalo is pretending she didn't hear you.",
    "Buffalo demands snacks. 🍕",
    "Buffalo says 'leave me alone.' 😭",
    "Buffalo secretly misses you. 💛",
    "Buffalo has escaped! 💨",
    "Buffalo has been found! 🦬",
    "Buffalo is guilty of being cute.",
    "Buffalo is still cute.",
    "Case dismissed. She's your favourite anyway. 🫂"
  ];

  const notebookPages = [
    { title: "I missed you.", body: "probably more than I admitted.", sub: "" },
    { title: "I missed annoying you.", body: "yes, seriously.", sub: "don't get used to that." },
    { title: "I missed your random calls.", body: "even the completely pointless ones.", sub: "especially those." },
    { title: "I missed your voice.", body: "", sub: "" },
    { title: "I missed having someone to tell stupid things to.", body: "someone who would actually listen to my nonsense.", sub: "" },
    { title: "", body: "I just missed you, okay? 😭", sub: "that's it." },
    { title: "COME BACK ALREADY.", body: "your buffalo is waiting. 🦬", sub: "" }
  ];

  const memoryObjectsData = {
    1: { title: "your voice.", body: "probably the thing I missed the most.", actionText: "", actionType: "" },
    2: { title: "that flower in your hair.", body: "somehow it suited you.", actionText: "", actionType: "" },
    3: { title: "obviously this one.", body: "buffalo. what else did you expect?", actionText: "", actionType: "" },
    4: { title: "your little random habits.", body: "the things you probably don't even notice you do.", actionText: "", actionType: "" },
    5: { title: "our stupid little memories.", body: "I wish I could replay some of them.", actionText: "see them →", actionType: "scroll-photos" },
    6: { title: "you matter to me.", body: "more than I probably say.", actionText: "", actionType: "" },
    7: { title: "your voice again.", body: "yeah... I really missed it.", actionText: "play →", actionType: "trigger-voice" },
    8: { title: "something I made for you.", body: "with my own hands.", actionText: "see it →", actionType: "scroll-bracelet" }
  };

  // Cache Core DOM Elements
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const flashOverlay = document.getElementById('flash-overlay');
  const sunriseGlow = document.getElementById('sunrise-glow');
  const cursorGlow = document.getElementById('cursor-glow');

  const openingScreen = document.getElementById('opening-screen');
  const btnOpenExp = document.getElementById('btn-open-experience');
  const mainWebsite = document.getElementById('main-website');

  const musicController = document.getElementById('music-controller');
  const btnMusic = document.getElementById('btn-music');
  const btnOpeningMusic = document.getElementById('btn-opening-music');
  const audioBg = document.getElementById('audio-bg');
  const audioVoice = document.getElementById('audio-voice');

  if (audioBg) audioBg.volume = 0.25;

  // Handle Image Loading Fallbacks safely
  ['hero-bg-img', 'hero-photo-img'].forEach(id => {
    const img = document.getElementById(id);
    if (img) {
      img.onerror = function() {
        this.style.display = 'none';
        const fallback = document.querySelector('.hero-bg-fallback');
        if (fallback) fallback.classList.remove('hidden');
      };
    }
  });

  // ==========================================
  // 2. EVENT-DRIVEN CANVAS PARTICLE SYSTEM
  // ==========================================
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  class Particle {
    constructor(x, y, type = 'dust') {
      this.x = x || Math.random() * (canvas ? canvas.width : 800);
      this.y = y || Math.random() * (canvas ? canvas.height : 600);
      this.type = type;
      this.size = type === 'heart' ? Math.random() * 12 + 8 : (type === 'petal' ? Math.random() * 8 + 4 : Math.random() * 3 + 1);
      this.speedX = (Math.random() - 0.5) * (type === 'heart' ? 2 : 1);
      this.speedY = type === 'heart' ? -Math.random() * 2 - 1 : Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;
      this.opacity -= 0.006; // Controlled decay for clean cleanup
    }

    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.type === 'heart') {
        ctx.fillStyle = '#F5BA42';
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText('💛', -this.size / 2, this.size / 2);
      } else if (this.type === 'buffalo') {
        ctx.font = `${this.size * 1.5}px sans-serif`;
        ctx.fillText('🦬', -this.size / 2, this.size / 2);
      } else if (this.type === 'petal') {
        ctx.fillStyle = '#F8E3E6';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(245, 186, 66, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  class TearDrop {
    constructor() {
      this.x = (canvas ? canvas.width : 800) / 2;
      this.y = -20;
      this.speedY = 3.5;
      this.radius = 6;
      this.active = true;
    }

    update() {
      if (!this.active) return;
      this.y += this.speedY;

      if (this.y >= (canvas ? canvas.height : 600) * 0.65) {
        this.active = false;
        createRipple(this.x, this.y);
        playSynthSound('splash');
      }
    }

    draw() {
      if (!this.active || !ctx) return;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function createRipple(x, y) {
    state.ripples.push({
      x, y, radius: 2, maxRadius: 120, opacity: 0.8
    });
    ensureCanvasLoop();
  }

  function updateAndDrawRipples() {
    if (!ctx) return;
    for (let i = state.ripples.length - 1; i >= 0; i--) {
      const r = state.ripples[i];
      r.radius += 2.5;
      r.opacity -= 0.015;

      ctx.save();
      ctx.strokeStyle = `rgba(245, 186, 66, ${Math.max(0, r.opacity)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (r.opacity <= 0) {
        state.ripples.splice(i, 1);
      }
    }
  }

  // Event-Driven Canvas Animation Loop (Stops when idle to save CPU/battery)
  function animateCanvas() {
    if (!ctx || document.visibilityState === 'hidden') {
      state.isCanvasAnimating = false;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        state.particles.splice(i, 1);
      }
    }

    if (state.tearDrop) {
      state.tearDrop.update();
      state.tearDrop.draw();
      if (!state.tearDrop.active) state.tearDrop = null;
    }

    updateAndDrawRipples();

    // Only schedule next frame if active elements exist
    if (state.particles.length > 0 || state.ripples.length > 0 || state.tearDrop) {
      requestAnimationFrame(animateCanvas);
    } else {
      state.isCanvasAnimating = false;
    }
  }

  function ensureCanvasLoop() {
    if (!state.isCanvasAnimating) {
      state.isCanvasAnimating = true;
      requestAnimationFrame(animateCanvas);
    }
  }

  function spawnParticleBurst(x, y, count = 20, type = 'heart') {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, type);
      p.speedX = (Math.random() - 0.5) * 8;
      p.speedY = (Math.random() - 0.5) * 8;
      state.particles.push(p);
    }
    ensureCanvasLoop();
  }

  // ==========================================
  // 3. AUDIO ENGINE & SYNTHESIZER FALLBACK
  // ==========================================
  function initAudioContext() {
    if (!state.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        state.audioContext = new AudioCtx();
      }
    }
    if (state.audioContext && state.audioContext.state === 'suspended') {
      state.audioContext.resume().catch(() => {});
    }
  }

  function playSynthSound(type) {
    initAudioContext();
    if (!state.audioContext) return;

    const ctx = state.audioContext;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'boop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'splash') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  let synthMusicInterval = null;
  function startSynthAmbientMusic() {
    initAudioContext();
    if (!state.audioContext || synthMusicInterval) return;

    state.audioSynthActive = true;
    const ctx = state.audioContext;
    const notes = [440.00, 554.37, 659.25, 369.99, 587.33];
    let idx = 0;

    synthMusicInterval = setInterval(() => {
      if (!state.isAudioPlaying || document.visibilityState === 'hidden') return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[idx % notes.length], now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);

      // Disconnect nodes cleanly after decay
      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (e) {}
      }, 2100);

      idx++;
    }, 1500);
  }

  function stopSynthAmbientMusic() {
    if (synthMusicInterval) {
      clearInterval(synthMusicInterval);
      synthMusicInterval = null;
    }
    state.audioSynthActive = false;
  }

  let musicToastTimeout = null;
  function showMusicToast(message) {
    const toasts = [
      document.getElementById('hero-music-toast'),
      document.getElementById('main-music-toast')
    ];
    toasts.forEach(t => {
      if (!t) return;
      t.innerText = message;
      t.classList.remove('hidden');
    });

    if (musicToastTimeout) clearTimeout(musicToastTimeout);
    musicToastTimeout = setTimeout(() => {
      toasts.forEach(t => {
        if (t) t.classList.add('hidden');
      });
    }, 2600);
  }

  function updateMusicUI() {
    [btnMusic, btnOpeningMusic].forEach(btn => {
      if (!btn) return;
      const icon = btn.querySelector('.music-icon');
      const eq = btn.querySelector('.equalizer');

      if (state.isAudioPlaying) {
        btn.classList.add('playing');
        if (icon) {
          icon.innerText = '⏸';
          icon.classList.remove('hidden');
        }
        if (eq) eq.classList.remove('hidden');
      } else {
        btn.classList.remove('playing');
        if (icon) {
          icon.innerText = '♪';
          icon.classList.remove('hidden');
        }
        if (eq) eq.classList.add('hidden');
      }
    });
  }

  function toggleMusic() {
    initAudioContext();
    if (state.isAudioPlaying) {
      if (audioBg && !state.audioSynthActive) {
        audioBg.pause();
      }
      stopSynthAmbientMusic();
      state.isAudioPlaying = false;
      updateMusicUI();
      showMusicToast('music paused ♡');
    } else {
      const lighting = document.getElementById('hero-blend-lighting');
      if (lighting) lighting.classList.add('warmed');
      spawnParticleBurst(window.innerWidth * 0.8, 100, 15, 'dust');

      audioBg.play().then(() => {
        state.isAudioPlaying = true;
        updateMusicUI();
        showMusicToast('playing something for you ♡');
      }).catch(err => {
        startSynthAmbientMusic();
        state.isAudioPlaying = true;
        updateMusicUI();
        showMusicToast('playing something for you ♡');
      });
    }
  }

  if (btnMusic) btnMusic.addEventListener('click', toggleMusic);
  if (btnOpeningMusic) btnOpeningMusic.addEventListener('click', toggleMusic);

  // Handle Tab Visibility (Pause audio synth & canvas loops when tab hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      state.isCanvasAnimating = false;
    } else if (state.particles.length > 0) {
      ensureCanvasLoop();
    }
  });

  // ==========================================
  // 4. HERO PAGE INTERACTIONS & TRANSITION
  // ==========================================
  const btnStaySecond = document.getElementById('btn-stay-second');
  const stayRevealBox = document.getElementById('stay-reveal-box');
  const hiddenHeartTrigger = document.getElementById('hidden-heart-trigger');
  const heroBgImg = document.getElementById('hero-bg-img');

  if (btnStaySecond) {
    btnStaySecond.addEventListener('click', () => {
      playSynthSound('click');
      btnStaySecond.classList.add('hidden');
      stayRevealBox.classList.remove('hidden');

      if (heroBgImg) {
        heroBgImg.style.transform = 'scale(1.08)';
        heroBgImg.style.filter = 'sepia(0.2) contrast(1.1) brightness(0.65)';
      }

      if (btnOpenExp) btnOpenExp.classList.add('brightened');
    });
  }

  if (hiddenHeartTrigger) {
    hiddenHeartTrigger.addEventListener('click', (e) => {
      playSynthSound('boop');
      spawnParticleBurst(e.clientX, e.clientY, 18, 'heart');
      
      const secretModal = document.getElementById('secret-modal');
      const secretTitle = document.getElementById('secret-title');
      const secretBody = document.getElementById('secret-body');
      const data = secretsDict['hidden_heart'];

      if (secretModal && data) {
        secretTitle.innerText = data.title;
        secretBody.innerText = data.body;
        secretModal.classList.remove('hidden');
      }
    });
  }

  const interactiveTags = document.querySelectorAll('.interactive-tag');
  interactiveTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      playSynthSound('click');
      const key = 'tag_' + tag.getAttribute('data-tag');
      const data = secretsDict[key];

      const secretModal = document.getElementById('secret-modal');
      const secretTitle = document.getElementById('secret-title');
      const secretBody = document.getElementById('secret-body');

      if (secretModal && data) {
        secretTitle.innerText = data.title;
        secretBody.innerText = data.body;
        secretModal.classList.remove('hidden');
      }
    });
  });

  if (btnOpenExp) {
    btnOpenExp.addEventListener('click', (e) => {
      playSynthSound('click');
      initAudioContext();

      btnOpenExp.style.transform = 'scale(0.95)';

      setTimeout(() => {
        btnOpenExp.style.boxShadow = '0 0 50px rgba(245, 186, 66, 0.9)';
      }, 300);

      setTimeout(() => {
        if (flashOverlay) flashOverlay.classList.add('active');
      }, 700);

      setTimeout(() => {
        if (flashOverlay) flashOverlay.classList.remove('active');
        const rect = btnOpenExp.getBoundingClientRect();
        spawnParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, 'heart');
        spawnParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25, 'petal');
      }, 1000);

      setTimeout(() => {
        if (openingScreen) {
          openingScreen.style.opacity = '0';
          openingScreen.style.transform = 'scale(1.03)';
        }
      }, 1600);

      setTimeout(() => {
        if (openingScreen) openingScreen.classList.add('hidden');
        if (mainWebsite) mainWebsite.classList.remove('hidden');
        if (musicController) musicController.classList.remove('hidden');

        if (!state.isAudioPlaying) {
          toggleMusic();
        }
      }, 2200);
    });
  }

  // Desktop Mouse Parallax (Passive listener)
  const heroGlassContainer = document.getElementById('hero-glass-container');
  if (heroGlassContainer && window.innerWidth > 900) {
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
      heroGlassContainer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }, { passive: true });
  }

  // ==========================================
  // 5. THINGS I REMEMBER ABOUT YOU
  // ==========================================
  const memoryObjCards = document.querySelectorAll('.memory-object-card');
  const memoryObjReveal = document.getElementById('memory-object-reveal');
  const objRevealTitle = document.getElementById('obj-reveal-title');
  const objRevealBody = document.getElementById('obj-reveal-body');
  const objRevealAction = document.getElementById('obj-reveal-action');
  const memoryCompletionBox = document.getElementById('memory-completion-box');
  const btnHiddenMemoryHeart = document.getElementById('btn-hidden-memory-heart');
  const hiddenMemoryReveal = document.getElementById('hidden-memory-reveal');

  memoryObjCards.forEach(card => {
    card.addEventListener('click', () => {
      playSynthSound('click');
      const objId = parseInt(card.getAttribute('data-obj-id'));
      const data = memoryObjectsData[objId];

      memoryObjCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      card.classList.add('visited');

      state.visitedObjects.add(objId);

      if (data) {
        objRevealTitle.innerText = data.title;
        objRevealBody.innerText = data.body;
        objRevealAction.innerHTML = '';

        if (data.actionText) {
          const btn = document.createElement('button');
          btn.className = 'btn-primary space-top';
          btn.innerText = data.actionText;
          btn.onclick = () => {
            playSynthSound('click');
            if (data.actionType === 'scroll-photos') {
              const el = document.getElementById('sec-photos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (data.actionType === 'scroll-bracelet') {
              const el = document.getElementById('sec-bracelet');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (data.actionType === 'trigger-voice') {
              const btnVoice = document.getElementById('btn-voice-trigger');
              const el = document.getElementById('sec-voice');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => { if (btnVoice) btnVoice.click(); }, 600);
            }
          };
          objRevealAction.appendChild(btn);
          objRevealAction.classList.remove('hidden');
        } else {
          objRevealAction.classList.add('hidden');
        }

        memoryObjReveal.classList.remove('hidden');
      }

      if (state.visitedObjects.size >= 8 && memoryCompletionBox) {
        memoryCompletionBox.classList.remove('hidden');
      }
    });
  });

  if (btnHiddenMemoryHeart) {
    btnHiddenMemoryHeart.addEventListener('click', (e) => {
      playSynthSound('boop');
      spawnParticleBurst(e.clientX, e.clientY, 30, 'heart');
      if (hiddenMemoryReveal) hiddenMemoryReveal.classList.remove('hidden');
      btnHiddenMemoryHeart.style.transform = 'scale(1.3)';
    });
  }

  // ==========================================
  // 6. THINGS I WANTED TO TELL YOU (NOTEBOOK)
  // ==========================================
  const notebookClosed = document.getElementById('notebook-closed');
  const btnOpenNotebook = document.getElementById('btn-open-notebook');
  const notebookOpenView = document.getElementById('notebook-open-view');
  const notebookPageContent = document.getElementById('notebook-page-content');
  const btnNbPrev = document.getElementById('btn-nb-prev');
  const btnNbNext = document.getElementById('btn-nb-next');
  const nbPageIndicator = document.getElementById('nb-page-indicator');

  function renderNotebookPage() {
    const data = notebookPages[state.notebookPage];
    if (!data || !notebookPageContent) return;

    notebookPageContent.innerHTML = '';

    if (data.title) {
      const h = document.createElement('h2');
      h.className = 'nb-title';
      h.innerText = data.title;
      notebookPageContent.appendChild(h);
    }

    if (data.body) {
      const p = document.createElement('p');
      p.className = 'nb-body';
      p.innerText = data.body;
      notebookPageContent.appendChild(p);
    }

    if (data.sub) {
      const s = document.createElement('p');
      s.className = 'nb-subnote';
      s.innerText = data.sub;
      notebookPageContent.appendChild(s);
    }

    if (nbPageIndicator) {
      nbPageIndicator.innerText = `Page ${state.notebookPage + 1} of ${notebookPages.length}`;
    }

    if (btnNbPrev) btnNbPrev.disabled = state.notebookPage === 0;
    if (btnNbNext) btnNbNext.disabled = state.notebookPage === notebookPages.length - 1;

    if (state.notebookPage === 3) {
      if (audioBg) audioBg.volume = 0.08;
    } else {
      if (audioBg) audioBg.volume = 0.25;
    }
  }

  if (btnOpenNotebook) {
    btnOpenNotebook.addEventListener('click', () => {
      playSynthSound('click');
      notebookClosed.classList.add('hidden');
      notebookOpenView.classList.remove('hidden');
      state.notebookPage = 0;
      renderNotebookPage();
    });
  }

  if (btnNbNext) {
    btnNbNext.addEventListener('click', () => {
      if (state.notebookPage < notebookPages.length - 1) {
        playSynthSound('click');
        state.notebookPage++;
        renderNotebookPage();
      }
    });
  }

  if (btnNbPrev) {
    btnNbPrev.addEventListener('click', () => {
      if (state.notebookPage > 0) {
        playSynthSound('click');
        state.notebookPage--;
        renderNotebookPage();
      }
    });
  }

  // ==========================================
  // 7. OFFICIAL BUFFALO FILE (CLASSIFIED)
  // ==========================================
  const btnTriggerClassified = document.getElementById('btn-trigger-classified');
  const classifiedDocContainer = document.getElementById('classified-doc-container');
  const btnInterrogateBuffalo = document.getElementById('btn-interrogate-buffalo');
  const interrogateText = document.getElementById('interrogate-text');

  if (btnTriggerClassified) {
    btnTriggerClassified.addEventListener('click', () => {
      playSynthSound('click');
      btnTriggerClassified.classList.add('hidden');
      classifiedDocContainer.classList.remove('hidden');

      setTimeout(() => {
        const p2 = classifiedDocContainer.querySelector('.classified-punishment .p2');
        if (p2) p2.classList.remove('hidden');
      }, 1500);
    });
  }

  if (btnInterrogateBuffalo) {
    btnInterrogateBuffalo.addEventListener('click', (e) => {
      playSynthSound('boop');

      const buffEmoji = document.getElementById('buffalo-emoji');
      if (buffEmoji) {
        buffEmoji.classList.remove('booped');
        void buffEmoji.offsetWidth;
        buffEmoji.classList.add('booped');
      }

      spawnParticleBurst(e.clientX, e.clientY, 15, 'heart');

      const msg = interrogateResponses[state.interrogateIndex % interrogateResponses.length];
      state.interrogateIndex++;

      if (interrogateText) {
        interrogateText.innerText = msg;
      }
    });
  }

  // ==========================================
  // 8. STORY STAGGER & DISTANCE JOURNEY
  // ==========================================
  const btnMissedHero = document.getElementById('btn-missed-hero');
  const heroRevealContainer = document.getElementById('hero-reveal-container');

  if (btnMissedHero) {
    btnMissedHero.addEventListener('click', () => {
      playSynthSound('click');
      btnMissedHero.classList.add('hidden');
      heroRevealContainer.classList.remove('hidden');

      const lines = heroRevealContainer.querySelectorAll('.stagger-line');
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.classList.add('visible');
          playSynthSound('click');
        }, (index + 1) * 700);
      });
    });
  }

  const stageHaveri = document.getElementById('stage-haveri');
  if (stageHaveri) {
    stageHaveri.addEventListener('click', () => {
      playSynthSound('click');
      stageHaveri.querySelector('.card-prompt').classList.add('hidden');
      stageHaveri.querySelector('.card-reveal-content').classList.remove('hidden');
    });
  }

  const stageCalls = document.getElementById('stage-calls');
  if (stageCalls) {
    stageCalls.addEventListener('click', () => {
      playSynthSound('click');
      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
      stageCalls.querySelector('.card-prompt').classList.add('hidden');
      stageCalls.querySelector('.card-reveal-content').classList.remove('hidden');
    });
  }

  const stageSilence = document.getElementById('stage-silence');
  if (stageSilence) {
    stageSilence.addEventListener('click', () => {
      playSynthSound('click');
      stageSilence.querySelector('.card-prompt').classList.add('hidden');
      const wrapper = stageSilence.querySelector('.silence-reveal-wrapper');
      wrapper.classList.remove('hidden');

      const lines = wrapper.querySelectorAll('.s-line');
      lines.forEach((line, idx) => {
        setTimeout(() => {
          line.classList.add('visible');
        }, (idx + 1) * 600);
      });
    });
  }

  // ==========================================
  // 9. VOICE SECTION & PLAYER
  // ==========================================
  const btnVoiceTrigger = document.getElementById('btn-voice-trigger');
  const voicePlayerContainer = document.getElementById('voice-player-container');

  if (btnVoiceTrigger) {
    btnVoiceTrigger.addEventListener('click', () => {
      playSynthSound('click');
      btnVoiceTrigger.classList.add('hidden');
      voicePlayerContainer.classList.remove('hidden');

      if (audioVoice) {
        audioVoice.play().catch(() => {
          playSynthSound('boop');
        });
      }
    });
  }

  // ==========================================
  // 10. SCRAPBOOK PHOTO GALLERY & LIGHTBOX
  // ==========================================
  const photoItems = document.querySelectorAll('.scrapbook-item');
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalFallback = document.getElementById('modal-fallback');
  const modalCaption = document.getElementById('modal-caption');
  const specialPhotoSeq = document.getElementById('special-photo-sequence');

  const photoCandidates = [
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.40 PM.jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.40 PM (1).jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.41 PM.jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.41 PM (1).jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.41 PM (2).jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.41 PM (3).jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.52.41 PM (4).jpeg',
    'assets/photos/WhatsApp Image 2026-08-15 at 10.53.09 PM.jpeg',
    'assets/photos/bracelet.jpeg'
  ];

  photoItems.forEach((item, index) => {
    const img = item.querySelector('.photo-img');
    const fallback = item.querySelector('.photo-fallback');

    if (img) {
      const targetSrc = photoCandidates[index % photoCandidates.length];
      if (targetSrc) {
        img.src = targetSrc;
      }

      img.onerror = function() {
        const altSrc = 'assets/photos/photo' + (index + 1) + '.jpg';
        if (this.src !== altSrc) {
          this.src = altSrc;
        } else {
          this.classList.add('hidden');
          if (fallback) fallback.classList.remove('hidden');
        }
      };
    }

    item.addEventListener('click', () => {
      playSynthSound('click');
      const photoId = parseInt(item.getAttribute('data-photo-id'));
      const caption = item.querySelector('.polaroid-caption').innerText;

      modalImg.classList.remove('hidden');
      modalFallback.classList.add('hidden');
      specialPhotoSeq.classList.add('hidden');

      if (img && img.complete && img.naturalHeight !== 0) {
        modalImg.src = img.src;
      } else {
        modalImg.classList.add('hidden');
        modalFallback.classList.remove('hidden');
      }

      modalCaption.innerText = caption;
      photoModal.classList.remove('hidden');

      if (photoId === state.specialPhotoId) {
        specialPhotoSeq.classList.remove('hidden');
        const spLines = specialPhotoSeq.querySelectorAll('.sp-line');
        spLines.forEach(l => l.style.opacity = '0');

        setTimeout(() => { spLines[0].style.opacity = '1'; }, 500);
        setTimeout(() => { spLines[1].style.opacity = '1'; }, 2200);
        setTimeout(() => { spLines[2].style.opacity = '1'; playSynthSound('click'); }, 4200);
      }
    });
  });

  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      if (photoModal) photoModal.classList.add('hidden');
      const secretModal = document.getElementById('secret-modal');
      if (secretModal) secretModal.classList.add('hidden');
    });
  });

  // ==========================================
  // 11. "I CRIED" REVEAL & TEAR DROP
  // ==========================================
  const btnCriedTrigger = document.getElementById('btn-cried-trigger');
  const criedExpContainer = document.getElementById('cried-experience-container');

  if (btnCriedTrigger) {
    btnCriedTrigger.addEventListener('click', () => {
      playSynthSound('click');
      btnCriedTrigger.classList.add('hidden');
      criedExpContainer.classList.remove('hidden');

      if (audioBg) audioBg.volume = 0.08;

      const lines = criedExpContainer.querySelectorAll('.cried-line');
      lines.forEach((line, idx) => {
        setTimeout(() => {
          line.classList.add('visible');
          playSynthSound('click');

          if (idx === lines.length - 1) {
            state.hasCried = true;
            state.tearDrop = new TearDrop();
            ensureCanvasLoop();
            criedExpContainer.querySelector('.tear-trigger-note').classList.remove('hidden');
          }
        }, (idx + 1) * 1800);
      });
    });
  }

  // ==========================================
  // 12. BUFFALO BOOP COUNTER
  // ==========================================
  const btnBoopBuffalo = document.getElementById('btn-boop-buffalo');
  const buffaloEmoji = document.getElementById('buffalo-emoji');
  const boopText = document.getElementById('boop-text');
  const boopCountElem = document.getElementById('boop-count');

  if (btnBoopBuffalo) {
    btnBoopBuffalo.addEventListener('click', () => {
      playSynthSound('boop');
      state.boopCount++;
      if (boopCountElem) boopCountElem.innerText = state.boopCount;

      if (buffaloEmoji) {
        buffaloEmoji.classList.remove('booped');
        void buffaloEmoji.offsetWidth;
        buffaloEmoji.classList.add('booped');
      }

      const rect = btnBoopBuffalo.getBoundingClientRect();
      spawnParticleBurst(rect.left + rect.width / 2, rect.top, 12, 'heart');

      const msg = boopMessages[(state.boopCount - 1) % boopMessages.length];
      if (boopText) boopText.innerText = msg;
    });
  }

  // ==========================================
  // 13. SECRET DRAWER & METER
  // ==========================================
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const letterContent = document.getElementById('letter-content');

  if (btnOpenDrawer) {
    btnOpenDrawer.addEventListener('click', () => {
      playSynthSound('click');
      btnOpenDrawer.classList.add('hidden');
      if (letterContent) letterContent.classList.remove('hidden');
    });
  }

  const btnCalcMeter = document.getElementById('btn-calc-meter');
  const meterProgress = document.getElementById('meter-progress');
  const meterPercentage = document.getElementById('meter-percentage');
  const meterResultContainer = document.getElementById('meter-result-container');

  if (btnCalcMeter) {
    btnCalcMeter.addEventListener('click', () => {
      playSynthSound('click');
      btnCalcMeter.disabled = true;

      let pct = 0;
      const interval = setInterval(() => {
        pct += 5;
        if (meterProgress) meterProgress.style.width = pct + '%';
        if (meterPercentage) meterPercentage.innerText = pct + '%';

        if (pct >= 99) {
          clearInterval(interval);
          setTimeout(() => {
            if (meterPercentage) meterPercentage.classList.add('hidden');
            if (meterResultContainer) meterResultContainer.classList.remove('hidden');
            spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 35, 'heart');
            playSynthSound('boop');
          }, 500);
        }
      }, 80);
    });
  }

  // Secret Memory Popups
  const secretTriggers = document.querySelectorAll('.secret-trigger-chip, #btn-psst-secret');
  const secretModal = document.getElementById('secret-modal');
  const secretTitle = document.getElementById('secret-title');
  const secretBody = document.getElementById('secret-body');

  secretTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      playSynthSound('click');
      const key = btn.getAttribute('data-secret') || 'psst';
      const data = secretsDict[key];

      if (data && secretModal) {
        secretTitle.innerText = data.title;
        secretBody.innerText = data.body;
        secretModal.classList.remove('hidden');
      }
    });
  });

  // Final Celebration Button
  const btnFinalHug = document.getElementById('btn-final-hug');
  const celebrationResult = document.getElementById('celebration-result');

  if (btnFinalHug) {
    btnFinalHug.addEventListener('click', () => {
      playSynthSound('click');
      if (navigator.vibrate) navigator.vibrate([150, 50, 150, 50, 200]);

      if (flashOverlay) {
        flashOverlay.classList.add('active');
        setTimeout(() => flashOverlay.classList.remove('active'), 600);
      }

      spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 50, 'heart');
      spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 35, 'petal');
      spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 12, 'buffalo');

      if (celebrationResult) celebrationResult.classList.remove('hidden');
      btnFinalHug.style.transform = 'scale(1.15)';
    });
  }

  // ==========================================
  // 14. INTERSECTION OBSERVERS FOR SCROLL REVEALS
  // ==========================================
  const observerOptions = { threshold: 0.2 };

  const secTomorrow = document.getElementById('sec-tomorrow');
  if (secTomorrow && sunriseGlow) {
    const sunriseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sunriseGlow.classList.add('active');
        } else {
          sunriseGlow.classList.remove('active');
        }
      });
    }, observerOptions);
    sunriseObserver.observe(secTomorrow);
  }

  const secFinalSequence = document.getElementById('sec-final-sequence');
  if (secFinalSequence) {
    const finalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lines = secFinalSequence.querySelectorAll('.n-line');
          lines.forEach((line, idx) => {
            setTimeout(() => {
              line.classList.add('visible');
              playSynthSound('click');
            }, (idx + 1) * 800);
          });
        }
      });
    }, { threshold: 0.3 });
    finalObserver.observe(secFinalSequence);
  }

  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

});
