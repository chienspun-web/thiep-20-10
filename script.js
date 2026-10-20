/* ==========================================================================
   20/10 VIETNAMESE WOMEN'S DAY GREETING CARD - INTERACTIVE LOGIC
   With Creator Mode (Full Customization) & Recipient Mode (Clean View-Only)
   Features:
   - Feature 1: Portrait Photo inside top circular frame
   - Feature 2: Flying Memory Photos (up to 5) blooming on card open
   - Feature 3: Super Short Link via Firebase Realtime Database (?id=xxxxx)
   ========================================================================== */

// ==========================================================================
// CẤU HÌNH FIREBASE REALTIME DATABASE (ĐỂ TẠO LINK ?id=xxxx SIÊU NGẮN)
// ==========================================================================
const FIREBASE_DB_URL = "https://snettech-cloud-default-rtdb.firebaseio.com/";

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Card & Stage
  const cardStage = document.getElementById('card-stage');
  const cardWrapper = document.getElementById('card-wrapper');
  const greetingCard = document.getElementById('greeting-card');
  const flapFront = document.getElementById('flap-front');
  const waxSeal = document.getElementById('wax-seal');
  const openCardTrigger = document.getElementById('open-card-trigger');
  const openBtnText = document.getElementById('open-btn-text');
  
  // Audio Elements
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const musicHint = document.getElementById('music-hint');
  
  // Card Text Display Elements
  const displayPrefix = document.getElementById('display-prefix');
  const displayRecipient = document.getElementById('display-recipient');
  const displaySender = document.getElementById('display-sender');
  const wishHighlight = document.getElementById('wish-highlight');
  const wishPoetry = document.getElementById('wish-poetry');
  const nextWishBtn = document.getElementById('next-wish-btn');
  const sendHeartBtn = document.getElementById('send-heart-btn');
  const heartCount = document.getElementById('heart-count');
  const quickEditName = document.getElementById('quick-edit-name');
  
  // Category Chips
  const categoryChips = document.querySelectorAll('.category-chip');
  
  // Secondary Tool Buttons
  const openCustomizeModalBtn = document.getElementById('open-customize-modal');
  const shareLinkBtn = document.getElementById('share-link-btn');
  const burstFlowersBtn = document.getElementById('burst-flowers-btn');
  const recipientBurstBtn = document.getElementById('recipient-burst-btn');
  
  // Modal Elements
  const customizeModal = document.getElementById('customize-modal');
  const modalClose = document.getElementById('modal-close');
  const inputPrefix = document.getElementById('input-prefix');
  const inputRecipient = document.getElementById('input-recipient');
  const inputHighlight = document.getElementById('input-highlight');
  const inputPoetry = document.getElementById('input-poetry');
  const inputSender = document.getElementById('input-sender');
  const btnCreateCard = document.getElementById('btn-create-card');
  const shareResultBox = document.getElementById('share-result-box');
  const generatedUrlInput = document.getElementById('generated-url');
  const btnCopyUrl = document.getElementById('btn-copy-url');
  const copyBtnText = document.getElementById('copy-btn-text');
  const btnOpenPreview = document.getElementById('btn-open-preview');
  const btnShortenUrl = document.getElementById('btn-shorten-url');
  const shortenBtnText = document.getElementById('shorten-btn-text');
  const templateBtns = document.querySelectorAll('.btn-template');
  
  // Feature 1: Portrait Photo Elements
  const portraitCircleFrame = document.getElementById('portrait-circle-frame');
  const cardPortraitImg = document.getElementById('card-portrait-img');
  const cardBouquetEmoji = document.getElementById('card-bouquet-emoji');
  const inputPortraitFile = document.getElementById('input-portrait-file');
  const portraitDropzone = document.getElementById('portrait-dropzone');
  const portraitPreviewBox = document.getElementById('portrait-preview-box');
  const portraitPreviewImg = document.getElementById('portrait-preview-img');
  const btnRemovePortrait = document.getElementById('btn-remove-portrait');

  // Feature 2: Flying Memory Photos Elements
  const flyingMemoriesLayer = document.getElementById('flying-memories-layer');
  const replayMemoriesBtn = document.getElementById('replay-memories-btn');
  const inputMemoriesFile = document.getElementById('input-memories-file');
  const memoriesDropzone = document.getElementById('memories-dropzone');
  const memoriesCounter = document.getElementById('memories-counter');
  const memoriesThumbnailsGrid = document.getElementById('memories-thumbnails-grid');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Toast Notification Elements
  const toastNotify = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');

  // Application State
  let isCardOpen = false;
  let isAudioPlaying = false;
  let currentCategory = 'friends';
  let currentWishIndex = 0;
  let totalHearts = 99;
  let isViewMode = false;
  let currentPortraitBase64 = null;
  let currentMemories = []; // Array of Base64 JPEG strings (max 5)
  let flyingTimeout = null;

  /* ==========================================================================
     CURATED WISHES DATABASE
     ========================================================================== */
  const wishLibrary = {
    friends: [
      {
        prefix: "Thân gửi:",
        recipient: "Những Người Bạn Tuyệt Vời",
        highlight: `"Nhân ngày Phụ nữ Việt Nam 20/10, chúc bạn luôn xinh đẹp rạng rỡ như đóa hồng ban mai, nụ cười luôn nở trên môi và ngập tràn hạnh phúc mỗi ngày!"`,
        lines: [
          "🌸 Chúc bạn có một ngày 20/10 thật trọn vẹn, ấm áp bên gia đình và những người thân yêu.",
          "✨ Chúc mọi ước mơ và dự định của bạn đều sớm thành hiện thực, luôn tự tin tỏa sáng rực rỡ.",
          "💖 Cảm ơn bạn vì đã xuất hiện và mang đến thế giới này những điều thật dễ thương và ấm áp!"
        ],
        sender: "Một người bạn luôn quý mến bạn ✨"
      },
      {
        prefix: "Thân gửi:",
        recipient: "Cô Bạn Đáng Yêu Của Tôi",
        highlight: `"Gửi đến người bạn tuyệt vời nhất của tôi lời chúc 20/10 nồng nàn và ngọt ngào nhất!"`,
        lines: [
          "🌷 Chúc bạn lúc nào cũng vui tươi, rạng ngời, tiền đầy túi và tình đầy tim.",
          "🌟 Mong bạn luôn kiên cường, bản lĩnh vượt qua mọi thử thách và gặt hái những thành tựu lớn.",
          "💐 Mãi là cô bạn thông minh, duyên dáng và tràn đầy năng lượng tích cực nhé!"
        ],
        sender: "Tri kỷ của bạn ✨"
      }
    ],

    crush: [
      {
        prefix: "Gửi em yêu,",
        recipient: "Cô Gái Nhỏ Của Anh",
        highlight: `"Nhân ngày 20/10, gửi đến em - người con gái anh thương nhất - trọn vẹn sự dịu dàng và ngàn đóa hồng thơm ngát!"`,
        lines: [
          "🌹 Cảm ơn em đã bước vào cuộc đời anh, mang đến ấm áp và những khoảnh khắc bình yên kỳ diệu.",
          "💫 Chúc em ngày 20/10 và 364 ngày còn lại trong năm luôn được nâng niu, chở che và yêu thương.",
          "💖 Dù mai này ra sao, nụ cười của em luôn là điều quý giá nhất mà anh muốn bảo vệ!"
        ],
        sender: "Người thương của em 🌹"
      },
      {
        prefix: "Gửi người anh yêu,",
        recipient: "Bé Cưng Của Anh",
        highlight: `"Với thế giới, em có thể là một người. Nhưng với anh, em chính là cả thế giới!"`,
        lines: [
          "🍓 Chúc cô gái nhỏ của anh luôn rạng ngời, vô tư và ngập tràn niềm vui ngọt ngào.",
          "🌟 Mong mọi muộn phiền ngoài kia đều tan biến mỗi khi em ở bên anh.",
          "💌 20/10 ấm áp nhé người anh thương, yêu em rất nhiều!"
        ],
        sender: "Anh của em 💕"
      }
    ],

    family: [
      {
        prefix: "Kính gửi:",
        recipient: "Mẹ & Chị Em Gái Kính Yêu",
        highlight: `"Nhân ngày 20/10, con/em xin kính chúc Mẹ và Chị luôn dồi dào sức khỏe, an vui và mãi hạnh phúc!"`,
        lines: [
          "🏡 Cảm ơn Mẹ và Chị vì những hy sinh thầm lặng, sự bao dung và tình yêu thương vô điều kiện.",
          "🌸 Chúc Mẹ và Chị luôn nở nụ cười rạng rỡ trên môi, bớt đi những lo toan nhọc nhằn.",
          "💖 Cả nhà luôn yêu thương và biết ơn Mẹ/Chị rất nhiều!"
        ],
        sender: "Người con / Người em yêu quý của gia đình 🏡"
      },
      {
        prefix: "Kính chúc:",
        recipient: "Mẹ Yêu Quý Của Con",
        highlight: `"Người phụ nữ vĩ đại và tuyệt vời nhất trong lòng con chính là Mẹ!"`,
        lines: [
          "🌺 Kính chúc Mẹ ngày 20/10 thật nhiều niềm vui, sức khỏe dẻo dai và bình an mỗi ngày.",
          "✨ Mong thời gian trôi thật chậm để chúng con được phụng dưỡng và ở bên Mẹ thật lâu.",
          "💐 Con yêu Mẹ hơn tất cả mọi điều trên đời!"
        ],
        sender: "Con của Mẹ 💐"
      }
    ],

    colleague: [
      {
        prefix: "Trân trọng gửi:",
        recipient: "Các Chị Em Đồng Nghiệp",
        highlight: `"Chúc toàn thể chị em một ngày 20/10 thật rực rỡ, duyên dáng và luôn thăng hoa trong công việc!"`,
        lines: [
          "💼 Chúc phái đẹp của chúng ta luôn tự tin, sắc sảo, hoàn thành xuất sắc mọi dự án lớn.",
          "💐 Chúc bạn hôm nay nhận được thật nhiều hoa tươi, quà đẹp và những lời khen có cánh.",
          "🥂 Cảm ơn vì nguồn năng lượng tích cực và sự đồng hành quý báu của bạn trong công việc!"
        ],
        sender: "Tập thể đồng nghiệp ✨"
      }
    ]
  };

  /* ==========================================================================
     IMAGE RESIZING & COMPRESSION HELPER (CANVAS)
     ========================================================================== */
  function compressImageFile(file, maxWidth = 450, maxHeight = 450, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================================
     FIREBASE REALTIME DATABASE HELPERS (REST API)
     ========================================================================== */
  function generateShortId(length = 5) {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async function saveCardToFirebase(cardData) {
    if (!FIREBASE_DB_URL || FIREBASE_DB_URL.trim() === '') {
      return null;
    }
    const baseUrl = FIREBASE_DB_URL.replace(/\/+$/, '');
    const shortId = generateShortId(5);
    const endpoint = `${baseUrl}/cards/${shortId}.json`;

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData)
    });

    if (!res.ok) throw new Error('Firebase save error: ' + res.status);
    return shortId;
  }

  async function loadCardFromFirebase(shortId) {
    if (!FIREBASE_DB_URL || FIREBASE_DB_URL.trim() === '') {
      return null;
    }
    const baseUrl = FIREBASE_DB_URL.replace(/\/+$/, '');
    const endpoint = `${baseUrl}/cards/${shortId}.json`;
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    return await res.json();
  }

  /* ==========================================================================
     CHECK VIEW MODE VS CREATOR MODE
     ========================================================================== */
  function checkModeAndLoad() {
    const params = new URLSearchParams(window.location.search);
    
    // Check if view mode is explicitly requested
    if (params.get('view') === '1' || params.get('mode') === 'view') {
      isViewMode = true;
      document.body.classList.add('view-mode');
    }

    // 0. Primary: Firebase Short ID (?id=k9x2)
    const shortId = params.get('id');
    if (shortId) {
      isViewMode = true;
      document.body.classList.add('view-mode');
      displayRecipient.textContent = 'Đang mở thiệp... 🌸';

      loadCardFromFirebase(shortId).then((cardData) => {
        if (cardData) {
          applyCardData(cardData);
          showToast('💌 Tấm thiệp đã sẵn sàng dành riêng cho bạn!');
        } else {
          loadCategoryTemplate('friends', 0);
          showToast('⚠️ Không tìm thấy thiệp, hiển thị mẫu mặc định!');
        }
      }).catch((err) => {
        console.warn('Firebase load error:', err);
        loadCategoryTemplate('friends', 0);
      });
      return;
    }

    // 1. Template-based compact URL (?t=crush&to=Lan+Anh&from=Nam&view=1)
    const tplCat = params.get('t');
    if (tplCat && wishLibrary[tplCat]) {
      const tplIdx = parseInt(params.get('i') || '0', 10);
      loadCategoryTemplate(tplCat, tplIdx);

      if (params.has('to')) displayRecipient.textContent = decodeURIComponent(params.get('to'));
      if (params.has('from')) displaySender.textContent = decodeURIComponent(params.get('from'));
      if (params.has('pre')) displayPrefix.textContent = decodeURIComponent(params.get('pre'));
      return;
    }

    // 2. Custom clean query parameters (?to=...&hl=...&msg=...&view=1)
    if (params.has('hl') || params.has('msg') || params.has('to')) {
      const rawMsg = params.get('msg');
      const customLines = rawMsg
        ? rawMsg.split('|').map(line => decodeURIComponent(line))
        : [
            "🌸 Chúc bạn có một ngày 20/10 thật nhiều ấm áp, niềm vui và hạnh phúc trọn vẹn!",
            "✨ Chúc bạn luôn xinh đẹp, tự tin tỏa sáng và đạt được mọi ước vọng.",
            "💖 Cảm ơn vì đã luôn mang lại những điều tuyệt vời cho cuộc sống này!"
          ];

      const data = {
        prefix: params.get('pre') ? decodeURIComponent(params.get('pre')) : 'Thân gửi:',
        recipient: params.get('to') ? decodeURIComponent(params.get('to')) : 'Những Người Phụ Nữ Tuyệt Vời',
        highlight: params.get('hl') ? `"${decodeURIComponent(params.get('hl'))}"` : undefined,
        lines: customLines,
        sender: params.get('from') ? decodeURIComponent(params.get('from')) : 'Người luôn chúc phúc cho bạn ✨'
      };
      applyCardData(data);
      return;
    }

    // Default: Creator mode with initial template
    loadCategoryTemplate('friends', 0);
    syncModalWithCurrentCard();
  }

  function findMatchingPreset(prefix, highlight, lines) {
    const cleanHl = highlight.replace(/^"|"$/g, '').trim();
    for (const cat of ['friends', 'crush', 'family', 'colleague']) {
      const list = wishLibrary[cat];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const itemHl = item.highlight.replace(/^"|"$/g, '').trim();
        if (itemHl === cleanHl && JSON.stringify(item.lines) === JSON.stringify(lines)) {
          return { cat, index: i };
        }
      }
    }
    return null;
  }

  function buildCompactShareUrl(cardData) {
    const currentUrl = new URL(window.location.href);
    const url = new URL(currentUrl.origin + currentUrl.pathname);

    // Check if card matches any standard preset
    const match = findMatchingPreset(cardData.prefix, cardData.highlight, cardData.lines);

    if (match) {
      url.searchParams.set('t', match.cat);
      if (match.index > 0) url.searchParams.set('i', match.index.toString());
      url.searchParams.set('to', cardData.recipient);
      if (cardData.sender && cardData.sender !== 'Người luôn chúc phúc cho bạn ✨') {
        url.searchParams.set('from', cardData.sender);
      }
      if (cardData.prefix && cardData.prefix !== 'Thân gửi:') {
        url.searchParams.set('pre', cardData.prefix);
      }
    } else {
      url.searchParams.set('to', cardData.recipient);
      if (cardData.sender && cardData.sender !== 'Người luôn chúc phúc cho bạn ✨') {
        url.searchParams.set('from', cardData.sender);
      }
      if (cardData.prefix && cardData.prefix !== 'Thân gửi:') {
        url.searchParams.set('pre', cardData.prefix);
      }
      url.searchParams.set('hl', cardData.highlight.replace(/^"|"$/g, ''));
      url.searchParams.set('msg', cardData.lines.join('|'));
    }

    url.searchParams.set('view', '1');
    return url.toString();
  }

  /* ==========================================================================
     APPLY CARD DATA TO UI & CAROUSEL
     ========================================================================== */
  function applyCardData(data) {
    if (data.prefix) displayPrefix.textContent = data.prefix;
    if (data.recipient) displayRecipient.textContent = data.recipient;
    if (data.highlight) wishHighlight.textContent = data.highlight;
    if (data.lines && Array.isArray(data.lines)) {
      wishPoetry.innerHTML = data.lines.map(line => `<p>${line}</p>`).join('');
    }
    if (data.sender) displaySender.textContent = data.sender;

    // Reset message scroll to top so full text is always visible from beginning
    const msgBody = document.getElementById('message-body');
    if (msgBody) msgBody.scrollTop = 0;

    // Feature 1: Handle Portrait photo
    if (data.portrait) {
      currentPortraitBase64 = data.portrait;
      if (cardPortraitImg) {
        cardPortraitImg.src = data.portrait;
        cardPortraitImg.style.display = 'block';
      }
      if (cardBouquetEmoji) cardBouquetEmoji.style.display = 'none';

      // Sync modal portrait preview
      if (portraitPreviewImg) portraitPreviewImg.src = data.portrait;
      if (portraitPreviewBox) portraitPreviewBox.style.display = 'flex';
      if (portraitDropzone) portraitDropzone.style.display = 'none';
    } else {
      currentPortraitBase64 = null;
      if (cardPortraitImg) {
        cardPortraitImg.src = '';
        cardPortraitImg.style.display = 'none';
      }
      if (cardBouquetEmoji) cardBouquetEmoji.style.display = 'block';

      if (portraitPreviewBox) portraitPreviewBox.style.display = 'none';
      if (portraitDropzone) portraitDropzone.style.display = 'flex';
    }

    // Feature 2: Handle Memory photos
    if (data.memories && Array.isArray(data.memories) && data.memories.length > 0) {
      currentMemories = data.memories.slice(0, 5);
      renderMemoriesThumbnails();
      if (replayMemoriesBtn) replayMemoriesBtn.style.display = 'inline-flex';
    } else {
      currentMemories = [];
      renderMemoriesThumbnails();
      if (replayMemoriesBtn) replayMemoriesBtn.style.display = 'none';
    }

    // Sync input fields in modal if in creator mode
    if (inputPrefix && data.prefix) inputPrefix.value = data.prefix;
    if (inputRecipient && data.recipient) inputRecipient.value = data.recipient;
    if (inputHighlight && data.highlight) inputHighlight.value = data.highlight.replace(/^"|"$/g, '');
    if (inputPoetry && data.lines) inputPoetry.value = data.lines.join('\n');
    if (inputSender && data.sender) inputSender.value = data.sender;

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function syncModalWithCurrentCard() {
    if (!inputPrefix) return;
    inputPrefix.value = displayPrefix.textContent.trim();
    inputRecipient.value = displayRecipient.textContent.trim();
    inputHighlight.value = wishHighlight.textContent.trim().replace(/^"|"$/g, '');
    
    // Extract poetry lines
    const pTags = wishPoetry.querySelectorAll('p');
    const lines = [];
    pTags.forEach(p => lines.push(p.textContent.trim()));
    inputPoetry.value = lines.join('\n');
    
    inputSender.value = displaySender.textContent.trim();
  }

  function loadCategoryTemplate(cat, index = 0) {
    const list = wishLibrary[cat] || wishLibrary['friends'];
    const item = list[index % list.length];

    displayPrefix.textContent = item.prefix;
    displayRecipient.textContent = item.recipient;
    wishHighlight.textContent = item.highlight;
    wishPoetry.innerHTML = item.lines.map(line => `<p>${line}</p>`).join('');
    displaySender.textContent = item.sender;

    syncModalWithCurrentCard();
  }

  /* ==========================================================================
     BACKGROUND MUSIC & WEB AUDIO FALLBACK
     ========================================================================== */
  let audioContext = null;

  function playSynthMelodyFallback() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      const chords = [
        [349.23, 440.00, 523.25, 659.25],
        [293.66, 349.23, 440.00, 523.25],
        [261.63, 329.63, 392.00, 523.25],
        [233.08, 293.66, 349.23, 440.00]
      ];

      let noteTime = audioContext.currentTime + 0.1;
      chords.forEach((chord) => {
        chord.forEach((freq) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.5);

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 1.5);

          noteTime += 0.3;
        });
        noteTime += 0.35;
      });
    } catch (e) {
      console.log('Synth chime fallback error:', e);
    }
  }

  function playMusic() {
    if (bgAudio) {
      bgAudio.volume = 0.55;
      const promise = bgAudio.play();
      if (promise !== undefined) {
        promise.then(() => {
          isAudioPlaying = true;
          musicToggle.classList.add('playing');
          if (musicHint) musicHint.textContent = 'Giai điệu đang phát 🎵';
        }).catch(() => {
          playSynthMelodyFallback();
          isAudioPlaying = true;
          musicToggle.classList.add('playing');
          if (musicHint) musicHint.textContent = 'Giai điệu êm đềm 🎵';
        });
      }
    }
  }

  function pauseMusic() {
    if (bgAudio) bgAudio.pause();
    isAudioPlaying = false;
    musicToggle.classList.remove('playing');
    if (musicHint) musicHint.textContent = 'Bật giai điệu 🎵';
  }

  musicToggle.addEventListener('click', () => {
    if (isAudioPlaying) pauseMusic();
    else playMusic();
  });

  /* ==========================================================================
     CARD OPEN & CLOSE ANIMATION + TRIGGER MEMORIES
     ========================================================================== */
  function toggleCard(forceState) {
    const newState = (forceState !== undefined) ? forceState : !isCardOpen;
    isCardOpen = newState;

    if (isCardOpen) {
      if (cardStage) cardStage.classList.add('stage-opened');
      if (cardWrapper) cardWrapper.classList.add('opened');
      openBtnText.textContent = 'GẤP THIỆP LẠI';
      
      if (!isAudioPlaying) {
        playMusic();
      }

      triggerCardOpenCelebration();
      showToast('💌 Chúc mừng ngày Phụ Nữ Việt Nam 20/10!');

      // Reset message scroll to top
      const msgBody = document.getElementById('message-body');
      if (msgBody) msgBody.scrollTop = 0;

      // Trigger Feature 2: Flying memories floating out
      if (currentMemories && currentMemories.length > 0) {
        triggerFlyingMemories();
      }

      // Smooth subtle auto-scroll on mobile so both panels stay comfortably in viewport
      if (window.innerWidth <= 768 && cardStage) {
        setTimeout(() => {
          cardStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } else {
      if (cardStage) cardStage.classList.remove('stage-opened');
      if (cardWrapper) cardWrapper.classList.remove('opened');
      openBtnText.textContent = 'MỞ THIỆP CHÚC MỪNG';
      if (flyingMemoriesLayer) flyingMemoriesLayer.innerHTML = '';
    }
  }

  openCardTrigger.addEventListener('click', () => toggleCard());
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCard(true);
  });
  if (flapFront) {
    flapFront.addEventListener('click', () => toggleCard(true));
  }

  /* ==========================================================================
     FLYING MEMORIES ANIMATION ENGINE (FEATURE 2)
     ========================================================================== */
  function triggerFlyingMemories() {
    if (!flyingMemoriesLayer || currentMemories.length === 0) return;

    if (flyingTimeout) clearTimeout(flyingTimeout);
    flyingMemoriesLayer.innerHTML = '';

    currentMemories.forEach((imgBase64, idx) => {
      const polaroid = document.createElement('div');
      polaroid.className = `flying-polaroid pos-${idx % 5}`;
      polaroid.style.animationDelay = `${idx * 0.22}s`;
      polaroid.title = 'Chạm để phóng to ảnh ✨';

      const pin = document.createElement('span');
      pin.className = 'flying-polaroid-pin';
      pin.textContent = '🌸';

      const img = document.createElement('img');
      img.src = imgBase64;
      img.alt = `Kỷ niệm ngọt ngào #${idx + 1}`;

      polaroid.appendChild(pin);
      polaroid.appendChild(img);

      // Lightbox click on polaroid
      polaroid.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(imgBase64, `Kỷ niệm ngọt ngào #${idx + 1} 💖`);
      });

      flyingMemoriesLayer.appendChild(polaroid);
    });

    // Clear after animation finishes so layer doesn't obstruct anything
    flyingTimeout = setTimeout(() => {
      if (flyingMemoriesLayer) flyingMemoriesLayer.innerHTML = '';
    }, 6200);
  }

  if (replayMemoriesBtn) {
    replayMemoriesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerFlyingMemories();
      showToast('📸 Đang phát lại những khoảnh khắc kỷ niệm...');
    });
  }

  /* ==========================================================================
     CONFETTI & FLOWER BURST CELEBRATION
     ========================================================================== */
  function triggerCardOpenCelebration() {
    if (typeof confetti === 'function') {
      const colors = ['#e64980', '#ff6b8b', '#ffd166', '#d4af37', '#ffffff', '#f783ac'];

      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.65 },
        colors: colors,
        shapes: ['circle', 'square']
      });

      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.65 },
        colors: colors,
        shapes: ['circle', 'square']
      });

      setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ff3366', '#ff758c', '#ffccd5'],
          scalar: 1.2
        });
      }, 300);
    }
  }

  function burstFlowerShower() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff85a1', '#f72585', '#ffd166', '#fff', '#e64980']
      });
    }
    showToast('🌸 Mưa hoa rực rỡ trao trọn yêu thương! 🌸');
  }

  if (burstFlowersBtn) burstFlowersBtn.addEventListener('click', burstFlowerShower);
  if (recipientBurstBtn) recipientBurstBtn.addEventListener('click', burstFlowerShower);

  /* ==========================================================================
     CREATOR CATEGORY CHIPS & NEXT WISH
     ========================================================================== */
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      currentCategory = chip.dataset.category;
      currentWishIndex = 0;
      loadCategoryTemplate(currentCategory, currentWishIndex);

      if (!isCardOpen) {
        toggleCard(true);
      }
    });
  });

  if (nextWishBtn) {
    nextWishBtn.addEventListener('click', () => {
      const list = wishLibrary[currentCategory] || wishLibrary['friends'];
      currentWishIndex = (currentWishIndex + 1) % list.length;
      loadCategoryTemplate(currentCategory, currentWishIndex);

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.55 },
          colors: ['#ff85a1', '#ffd166']
        });
      }
    });
  }

  // Send Heart button
  sendHeartBtn.addEventListener('click', (e) => {
    totalHearts += 1;
    heartCount.textContent = totalHearts;
    spawnClickHeart(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
  });

  /* ==========================================================================
     CLICK FLOATING HEARTS
     ========================================================================== */
  function spawnClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    const icons = ['💖', '🌸', '✨', '💕', '🌷', '💐'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.modal-box')) {
      return;
    }
    spawnClickHeart(e.clientX, e.clientY);
  });

  /* ==========================================================================
     CUSTOMIZE MODAL & LINK GENERATION
     ========================================================================== */
  function openModal() {
    if (isViewMode) return;
    syncModalWithCurrentCard();
    customizeModal.classList.add('active');
  }

  function closeModal() {
    customizeModal.classList.remove('active');
  }

  if (openCustomizeModalBtn) openCustomizeModalBtn.addEventListener('click', openModal);
  if (quickEditName) quickEditName.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (customizeModal) {
    customizeModal.addEventListener('click', (e) => {
      if (e.target === customizeModal) closeModal();
    });
  }

  // Template buttons inside modal
  templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tpl = btn.dataset.tpl;
      if (wishLibrary[tpl]) {
        currentCategory = tpl;
        loadCategoryTemplate(tpl, 0);
        showToast('✨ Đã áp dụng mẫu lời chúc!');
      }
    });
  });

  /* ==========================================================================
     FEATURE 1: PORTRAIT PHOTO UPLOAD & PREVIEW
     ========================================================================== */
  if (portraitDropzone && inputPortraitFile) {
    portraitDropzone.addEventListener('click', () => {
      inputPortraitFile.click();
    });

    inputPortraitFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('⚠️ Vui lòng chọn tệp hình ảnh!');
        return;
      }

      try {
        showToast('⏳ Đang tối ưu ảnh chân dung...');
        const base64 = await compressImageFile(file, 350, 350, 0.78);
        currentPortraitBase64 = base64;

        // Preview in modal
        if (portraitPreviewImg) portraitPreviewImg.src = base64;
        if (portraitPreviewBox) portraitPreviewBox.style.display = 'flex';
        if (portraitDropzone) portraitDropzone.style.display = 'none';

        // Update live card
        if (cardPortraitImg) {
          cardPortraitImg.src = base64;
          cardPortraitImg.style.display = 'block';
        }
        if (cardBouquetEmoji) cardBouquetEmoji.style.display = 'none';

        showToast('👤 Đã thêm ảnh chân dung vào khung tròn thiệp!');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      } catch (err) {
        console.error('Portrait upload error:', err);
        showToast('❌ Không thể tải ảnh, vui lòng thử lại!');
      }
    });
  }

  if (btnRemovePortrait) {
    btnRemovePortrait.addEventListener('click', () => {
      currentPortraitBase64 = null;
      if (inputPortraitFile) inputPortraitFile.value = '';
      if (portraitPreviewBox) portraitPreviewBox.style.display = 'none';
      if (portraitDropzone) portraitDropzone.style.display = 'flex';

      if (cardPortraitImg) {
        cardPortraitImg.src = '';
        cardPortraitImg.style.display = 'none';
      }
      if (cardBouquetEmoji) cardBouquetEmoji.style.display = 'block';

      showToast('🗑️ Đã gỡ ảnh chân dung');
    });
  }

  // Lightbox click on circular portrait frame
  if (portraitCircleFrame) {
    portraitCircleFrame.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentPortraitBase64) {
        openLightbox(currentPortraitBase64, 'Ảnh chân dung người thương 🌸');
      }
    });
  }

  /* ==========================================================================
     FEATURE 2: MEMORY PHOTOS UPLOAD (MAX 5) & THUMBNAILS
     ========================================================================== */
  function renderMemoriesThumbnails() {
    if (!memoriesThumbnailsGrid) return;
    memoriesThumbnailsGrid.innerHTML = '';

    if (currentMemories.length === 0) {
      memoriesThumbnailsGrid.style.display = 'none';
      if (memoriesDropzone) memoriesDropzone.style.display = 'flex';
      if (memoriesCounter) memoriesCounter.textContent = '0/5 ảnh';
      if (replayMemoriesBtn) replayMemoriesBtn.style.display = 'none';
      return;
    }

    memoriesThumbnailsGrid.style.display = 'flex';
    if (memoriesCounter) memoriesCounter.textContent = `${currentMemories.length}/5 ảnh`;

    if (currentMemories.length >= 5) {
      if (memoriesDropzone) memoriesDropzone.style.display = 'none';
    } else {
      if (memoriesDropzone) memoriesDropzone.style.display = 'flex';
    }

    if (replayMemoriesBtn) replayMemoriesBtn.style.display = 'inline-flex';

    currentMemories.forEach((imgBase64, idx) => {
      const item = document.createElement('div');
      item.className = 'memory-thumb-item';

      const img = document.createElement('img');
      img.src = imgBase64;
      img.alt = `Ảnh kỷ niệm ${idx + 1}`;
      img.addEventListener('click', () => {
        openLightbox(imgBase64, `Kỷ niệm ngọt ngào #${idx + 1} 💖`);
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-del-memory';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Xóa ảnh này';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMemories.splice(idx, 1);
        renderMemoriesThumbnails();
        showToast('🗑️ Đã xóa 1 ảnh kỷ niệm');
      });

      item.appendChild(img);
      item.appendChild(delBtn);
      memoriesThumbnailsGrid.appendChild(item);
    });
  }

  if (memoriesDropzone && inputMemoriesFile) {
    memoriesDropzone.addEventListener('click', () => {
      if (currentMemories.length >= 5) {
        showToast('⚠️ Đã đủ tối đa 5 ảnh kỷ niệm!');
        return;
      }
      inputMemoriesFile.click();
    });

    inputMemoriesFile.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      const remainingSlots = 5 - currentMemories.length;
      if (remainingSlots <= 0) {
        showToast('⚠️ Bạn đã chọn đủ tối đa 5 ảnh kỷ niệm!');
        return;
      }

      const filesToProcess = files.slice(0, remainingSlots);
      if (files.length > remainingSlots) {
        showToast(`💡 Chỉ lấy thêm ${remainingSlots} ảnh để đạt tối đa 5 ảnh!`);
      }

      showToast(`⏳ Đang tối ưu ${filesToProcess.length} ảnh kỷ niệm...`);

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        try {
          const base64 = await compressImageFile(file, 450, 450, 0.72);
          currentMemories.push(base64);
        } catch (err) {
          console.error('Error compressing memory photo:', err);
        }
      }

      inputMemoriesFile.value = '';
      renderMemoriesThumbnails();
      showToast(`📸 Đã thêm bộ ảnh kỷ niệm (${currentMemories.length}/5 ảnh)!`);
    });
  }

  /* ==========================================================================
     LIGHTBOX MODAL FOR HIGH-RES PREVIEW
     ========================================================================== */
  function openLightbox(src, caption = '') {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ==========================================================================
     ACTION: CREATE CARD & GENERATE SHORT FIREBASE LINK
     ========================================================================== */
  if (btnCreateCard) {
    btnCreateCard.addEventListener('click', async () => {
      const prefix = inputPrefix.value.trim() || 'Thân gửi:';
      const recipient = inputRecipient.value.trim();
      const highlight = inputHighlight.value.trim();
      const rawPoetry = inputPoetry.value.trim();
      const sender = inputSender.value.trim() || 'Người luôn chúc phúc cho bạn ✨';

      if (!recipient) {
        showToast('⚠️ Vui lòng nhập tên người nhận!');
        inputRecipient.focus();
        return;
      }

      if (!highlight) {
        showToast('⚠️ Vui lòng nhập câu chúc nổi bật!');
        inputHighlight.focus();
        return;
      }

      const poetryLines = rawPoetry
        ? rawPoetry.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        : [
            "🌸 Chúc bạn có một ngày 20/10 thật nhiều ấm áp, niềm vui và hạnh phúc trọn vẹn!",
            "✨ Chúc bạn luôn xinh đẹp, tự tin tỏa sáng và đạt được mọi ước vọng.",
            "💖 Cảm ơn vì đã luôn mang lại những điều tuyệt vời cho cuộc sống này!"
          ];

      const cardData = {
        prefix: prefix,
        recipient: recipient,
        highlight: `"${highlight}"`,
        lines: poetryLines,
        sender: sender,
        portrait: currentPortraitBase64 || null,
        memories: currentMemories || []
      };

      // 1. Update the card live
      applyCardData(cardData);

      // 2. Save to Firebase Realtime Database for super-short link (?id=xxxx)
      btnCreateCard.disabled = true;
      btnCreateCard.innerHTML = '<span>⏳ Đang lưu & tạo link ngắn...</span>';

      let finalUrl = '';
      if (FIREBASE_DB_URL && FIREBASE_DB_URL.trim() !== '') {
        try {
          showToast('⏳ Đang lưu thiệp và tạo mã ngắn...');
          const shortId = await saveCardToFirebase(cardData);
          if (shortId) {
            const currentUrl = new URL(window.location.href);
            finalUrl = `${currentUrl.origin}${currentUrl.pathname}?id=${shortId}`;
          }
        } catch (err) {
          console.error('Firebase save failed:', err);
        }
      }

      btnCreateCard.disabled = false;
      btnCreateCard.innerHTML = '<i data-lucide="share-2"></i> Tạo & Lấy Link Gửi Bạn Bè';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      // 3. Fallback: Compact URL if Firebase had an unexpected issue
      if (!finalUrl) {
        finalUrl = buildCompactShareUrl(cardData);
      }

      generatedUrlInput.value = finalUrl;
      shareResultBox.style.display = 'block';

      // Reset shorten button text
      if (shortenBtnText) shortenBtnText.textContent = 'Rút gọn link siêu ngắn';

      // Auto open card to let creator admire their custom work
      toggleCard(true);

      showToast('✨ Đã tạo link thành công! Bấm sao chép để gửi ngay.');
    });
  }

  // 1-Click Shorten URL via is.gd API (optional further shortener)
  if (btnShortenUrl) {
    btnShortenUrl.addEventListener('click', async () => {
      const currentLink = generatedUrlInput.value.trim();
      if (!currentLink) return;

      if (currentLink.includes('is.gd') || currentLink.includes('tinyurl')) {
        showToast('✨ Đường link này đã ở dạng rút gọn rồi!');
        return;
      }

      if (currentLink.includes('localhost') || currentLink.includes('127.0.0.1')) {
        showToast('💡 Link hiện tại đã rất gọn (~50 ký tự)! Khi đưa lên GitHub Pages, nút này có thể rút gọn thêm nữa nhé.');
        return;
      }

      if (shortenBtnText) shortenBtnText.textContent = 'Đang rút gọn...';

      try {
        const apiUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(currentLink)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('API Shorten error');
        const shortUrl = await res.text();
        
        if (shortUrl.startsWith('http')) {
          generatedUrlInput.value = shortUrl.trim();
          if (shortenBtnText) shortenBtnText.textContent = 'Đã rút gọn!';
          showToast('⚡ Đã rút gọn link thành công!');
        } else {
          throw new Error(shortUrl);
        }
      } catch (err) {
        console.warn('Shorten API error:', err);
        if (shortenBtnText) shortenBtnText.textContent = 'Rút gọn link';
        showToast('💡 Link Firebase của bạn đã rất ngắn gọn (~50 ký tự) và sẵn sàng để gửi!');
      }
    });
  }

  // Copy URL button
  if (btnCopyUrl) {
    btnCopyUrl.addEventListener('click', () => {
      const link = generatedUrlInput.value;
      if (!link) return;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
          copyBtnText.textContent = 'Đã chép!';
          showToast('📋 Đã sao chép liên kết thiệp dành cho người nhận!');
          setTimeout(() => {
            copyBtnText.textContent = 'Sao chép link';
          }, 2500);
        }).catch(() => {
          fallbackCopyText(generatedUrlInput);
        });
      } else {
        fallbackCopyText(generatedUrlInput);
      }
    });
  }

  function fallbackCopyText(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    copyBtnText.textContent = 'Đã chép!';
    showToast('📋 Đã sao chép liên kết thiệp!');
    setTimeout(() => {
      copyBtnText.textContent = 'Sao chép link';
    }, 2500);
  }

  // Test recipient link in new tab
  if (btnOpenPreview) {
    btnOpenPreview.addEventListener('click', () => {
      const url = generatedUrlInput.value;
      if (url) {
        window.open(url, '_blank');
      }
    });
  }

  // Toolbar Share button in Creator Mode
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', () => {
      openModal();
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATION HELPER
     ========================================================================== */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastText || !toastNotify) return;
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = msg;
    toastNotify.classList.add('active');
    toastTimer = setTimeout(() => {
      toastNotify.classList.remove('active');
    }, 3200);
  }

  /* ==========================================================================
     FALLING PETALS & SPARKLES CANVAS ENGINE
     ========================================================================== */
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  if (canvas && ctx) {
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const TOTAL_PETALS = Math.min(40, Math.floor(window.innerWidth / 26));

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 12 + 10;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.flip = Math.random() * Math.PI;
        this.flipSpeed = Math.random() * 0.03 + 0.01;
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayRadius = Math.random() * 1.8 + 0.6;
        this.opacity = Math.random() * 0.45 + 0.4;

        const styles = [
          { color1: '#ffb3c6', color2: '#ff85a1', type: 'cherry' },
          { color1: '#ff758f', color2: '#c9184a', type: 'rose' },
          { color1: '#fff0f3', color2: '#ffccd5', type: 'pale' },
          { color1: '#ffe66d', color2: '#d4af37', type: 'sparkle' }
        ];
        this.style = styles[Math.floor(Math.random() * styles.length)];
      }

      update() {
        this.y += this.speedY;
        this.swayAngle += this.swaySpeed;
        this.x += Math.sin(this.swayAngle) * this.swayRadius + this.speedX;
        this.rotation += this.rotationSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 25 || this.x < -40 || this.x > width + 40) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(this.flip), 1);
        ctx.globalAlpha = this.opacity;

        if (this.style.type === 'sparkle') {
          ctx.fillStyle = '#ffd166';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const gradient = ctx.createLinearGradient(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);
          gradient.addColorStop(0, this.style.color1);
          gradient.addColorStop(1, this.style.color2);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 0.7);
          ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.7, this.size * 0.8, this.size * 0.3, 0, this.size * 0.9);
          ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.3, -this.size * 0.6, -this.size * 0.7, 0, -this.size * 0.7);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 0.5);
          ctx.lineTo(0, this.size * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < TOTAL_PETALS; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }

  // Initialize page mode & data
  checkModeAndLoad();
});
