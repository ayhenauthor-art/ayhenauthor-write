/* =========================================
   THE UNSENT LETTERS & STORIES
   Main JavaScript
   ========================================= */

// =====================================
// MODULE-LEVEL CLEANUP TRACKING
// =====================================

let __scrollHandlers = [];
let __keydownHandlers = [];
let __resizeHandlers = [];
let __storageHandlers = [];
let __broadcastHandler = null;
let __initGuard = false;

function __cleanupWindowListeners() {
  __scrollHandlers.forEach(h => window.removeEventListener('scroll', h));
  __scrollHandlers = [];
  __keydownHandlers.forEach(h => document.removeEventListener('keydown', h));
  __keydownHandlers = [];
  __resizeHandlers.forEach(h => window.removeEventListener('resize', h));
  __resizeHandlers = [];
  __storageHandlers.forEach(h => window.removeEventListener('storage', h));
  __storageHandlers = [];
  if (__broadcastHandler) {
    try {
      if (window.__broadcastChannel) {
        window.__broadcastChannel.removeEventListener('message', __broadcastHandler);
      }
    } catch (e) {}
    __broadcastHandler = null;
  }
}

// =====================================
// UTILITY HELPERS
// =====================================

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message) {
  const existing = document.querySelector('.quote-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'quote-toast';
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}
window.showToast = showToast;

// Format a date object into a literary timestamp
function formatLetterDate(date) {
  const d = date || new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = d.toLocaleDateString('en-US', options);
  const formattedTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return { formattedDate, formattedTime, full: `${formattedDate} at ${formattedTime}`, iso: d.toISOString() };
}

// =====================================
// SCROLL REVEAL — Reusable
// =====================================

window.initScrollReveal = function() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
};

// =====================================
// APP INITIALIZATION
// =====================================

window.initApp = function() {

  // Clean up any previous listeners before re-initializing
  __cleanupWindowListeners();

  // =====================================
  // MOBILE NAVIGATION
  // =====================================

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (dropdown) dropdown.classList.remove('active');
      });
    });
  }

  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  }

  // =====================================
  // SCROLL REVEAL
  // =====================================

  window.initScrollReveal();

  // =====================================
  // BACK TO TOP
  // =====================================

  const topButton = document.getElementById('topButton');
  if (topButton) {
    window.addEventListener('scroll', () => {
      topButton.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================================
  // GUIDE TO THE ARCHIVE
  // =====================================

  const archiveRoot = window.location.pathname.includes('/essays/') || window.location.pathname.includes('/poems/') ? '../' : '';
  const archiveGuide = document.createElement('div');
  archiveGuide.className = 'archive-guide';
  archiveGuide.innerHTML = `
    <button class="archive-guide-trigger" type="button" aria-label="Open Guide to the Archive" aria-expanded="false" aria-controls="archiveGuideModal">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"></path></svg>
      <span>Guide to the Archive</span>
    </button>
    <div class="archive-guide-modal" id="archiveGuideModal" role="dialog" aria-modal="true" aria-labelledby="archiveGuideTitle" aria-hidden="true">
      <div class="archive-guide-panel" role="document">
        <button class="archive-guide-close" type="button" aria-label="Close Guide to the Archive">&times;</button>
        <p class="archive-guide-eyebrow">The Unsent Letters &amp; Stories</p>
        <h2 id="archiveGuideTitle">Guide to the Archive</h2>
        <p class="archive-guide-intro" id="archiveGuideDescription">A small compass for finding your way through the collection.</p>
        <nav class="archive-guide-nav" aria-label="Archive sections">
          <a href="${archiveRoot}index.html"><span>Home</span><small>Begin among the quiet thoughts and newest stories gathered here.</small></a>
          <a href="${archiveRoot}about.html"><span>About</span><small>Learn about the writer and the heart behind this growing library.</small></a>
          <a href="${archiveRoot}essays.html"><span>Essays</span><small>Read personal reflections on love, longing, hope, and becoming.</small></a>
          <a href="${archiveRoot}quotes.html"><span>Quotes</span><small>Linger with favorite lines that deserve to be carried a little longer.</small></a>
          <a href="${archiveRoot}index.html#socials"><span>Socials</span><small>Find ways to share a favorite piece and stay connected to the archive.</small></a>
          <a href="${archiveRoot}letters-between-us.html"><span>Letters Between Us</span><small>A future home for collaborative writing and shared stories.</small></a>
          <a href="${archiveRoot}index.html#coming-soon"><span>Coming Soon</span><small>Look ahead to poems, short stories, novels, and articles still taking shape.</small></a>
        </nav>
      </div>
    </div>`;
  document.body.appendChild(archiveGuide);

  const guideTrigger = archiveGuide.querySelector('.archive-guide-trigger');
  const guideModal = archiveGuide.querySelector('.archive-guide-modal');
  const guideClose = archiveGuide.querySelector('.archive-guide-close');
  const guidePanel = archiveGuide.querySelector('.archive-guide-panel');
  const guideLinks = archiveGuide.querySelectorAll('.archive-guide-nav a');
  let lastFocusedElement;

  const closeArchiveGuide = () => {
    guideModal.classList.remove('is-open');
    guideModal.setAttribute('aria-hidden', 'true');
    guideTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('archive-guide-open');
    lastFocusedElement?.focus();
  };

  const openArchiveGuide = () => {
    lastFocusedElement = document.activeElement;
    guideModal.classList.add('is-open');
    guideModal.setAttribute('aria-hidden', 'false');
    guideTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('archive-guide-open');
    guideClose.focus();
  };

  guideTrigger.addEventListener('click', openArchiveGuide);
  guideClose.addEventListener('click', closeArchiveGuide);
  guideLinks.forEach(link => link.addEventListener('click', closeArchiveGuide));
  guideModal.addEventListener('click', event => { if (event.target === guideModal) closeArchiveGuide(); });

  document.addEventListener('keydown', event => {
    if (!guideModal.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeArchiveGuide();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = guidePanel.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.querySelector('.coming-section')?.setAttribute('id', 'coming-soon');
  document.querySelector('.site-footer')?.setAttribute('id', 'socials');

  // =====================================
  // LIBRARY ENTRY MODAL
  // =====================================

  const libraryTrigger = document.getElementById('libraryTrigger');
  const libraryModal = document.getElementById('libraryModal');
  const libraryClose = libraryModal?.querySelector('.library-modal-close');
  const libraryPanel = libraryModal?.querySelector('.library-modal-panel');
  let lastLibraryFocus;

  const openLibraryModal = () => {
    if (!libraryModal) return;
    lastLibraryFocus = document.activeElement;
    libraryModal.classList.add('is-open');
    libraryModal.setAttribute('aria-hidden', 'false');
    libraryTrigger?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('library-modal-open');
    libraryClose?.focus();
  };

  const closeLibraryModal = () => {
    if (!libraryModal) return;
    libraryModal.classList.remove('is-open');
    libraryModal.setAttribute('aria-hidden', 'true');
    libraryTrigger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('library-modal-open');
    lastLibraryFocus?.focus();
  };

  if (libraryTrigger && libraryModal) {
    libraryTrigger.addEventListener('click', openLibraryModal);
    libraryClose?.addEventListener('click', closeLibraryModal);
    libraryModal.addEventListener('click', (event) => {
      if (event.target === libraryModal) closeLibraryModal();
    });
    document.addEventListener('keydown', (event) => {
      if (!libraryModal.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLibraryModal();
        return;
      }
      if (event.key === 'Tab' && libraryPanel) {
        const focusable = libraryPanel.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    libraryTrigger.setAttribute('aria-expanded', 'false');
    libraryTrigger.setAttribute('aria-haspopup', 'dialog');
    libraryModal.querySelectorAll('.library-category-card[href]').forEach(link => {
      link.addEventListener('click', closeLibraryModal);
    });
  }

  // =====================================
  // READING PROGRESS BAR
  // =====================================

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
    });
  }

  // =====================================
  // CARRY THIS PIECE WITH YOU — SHARE MODAL
  // =====================================

  // Close existing share modal
  const setupExistingShareModal = () => {
    const modal = document.getElementById('shareModal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.close-share');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('share-modal-open');
      });
    }
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('share-modal-open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.classList.remove('share-modal-open');
      }
    });
  };
  setupExistingShareModal();

  // =====================================
  // INSTAGRAM GUIDE MODAL
  // =====================================

  const setupInstagramGuideModal = () => {
    const modal = document.getElementById('instagramGuideModal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.instagram-guide-close');
    const doneBtn = modal.querySelector('.instagram-guide-done');
    const overlay = modal.querySelector('.instagram-guide-overlay');

    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('instagram-guide-open');
    };

    const open = (action) => {
      const stepAction = document.getElementById('instagramStepAction');
      if (stepAction) {
        stepAction.innerHTML = action === 'story'
          ? '<strong>Tap Create</strong> (the + icon) and select <strong>Story</strong>.'
          : '<strong>Tap Create</strong> (the + icon) and select <strong>Post</strong>.';
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('instagram-guide-open');
      closeBtn?.focus();
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (doneBtn) doneBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    return { open, close };
  };

  const instagramGuide = setupInstagramGuideModal();
  window.instagramGuide = instagramGuide;

  // =====================================
  // TOAST NOTIFICATION
  // =====================================

  function showToast(message) {
    const existing = document.querySelector('.quote-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'quote-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }
  window.showToast = showToast;

  // =====================================
  // ENHANCED LETTER SYSTEM — Per-Article, Timestamps, Reactions, Replies
  // =====================================

  // Compute a unique storage key per article page
  function getArticleKey() {
    const path = window.location.pathname
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
    const segments = path.split('/').filter(s => s);
    const key = segments.length > 0 ? segments.join('-') : 'home';
    return 'unsent_letters_' + key;
  }

  const LETTER_STORAGE_KEY = getArticleKey();

  // Get the article title for the "related piece" field
  function getArticleTitle() {
    const titleEl = document.querySelector('title');
    if (!titleEl) return 'Untitled';
    return titleEl.textContent.replace(' | The Unsent Letters & Stories', '').trim();
  }

  // Get the page slug for garden link
  function getPageSlug() {
    return window.location.pathname;
  }

  // Format a date object into a literary timestamp
  function formatLetterDate(date) {
    const d = date || new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);
    const formattedTime = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { formattedDate, formattedTime, full: `${formattedDate} at ${formattedTime}`, iso: d.toISOString() };
  }

  // Broadcast channel for real-time sync across tabs
  const letterChannel = 'unsent-letters-channel';
  let broadcastChannel = null;
  try {
    broadcastChannel = new BroadcastChannel(letterChannel);
  } catch (e) {
    // BroadcastChannel not supported
  }

  // Load letters for this article
  window.loadArticleLetters = function() {
    try {
      return JSON.parse(localStorage.getItem(LETTER_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  // Save letters for this article
  window.saveArticleLetters = function(letters) {
    localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(letters));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'letters-updated', key: LETTER_STORAGE_KEY });
    }
  };

  // Add a new reaction to a letter
  window.addReaction = function(letterId, emoji) {
    const letters = window.loadArticleLetters();
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;
    if (!letter.reactions) letter.reactions = {};
    if (!letter.reactions[emoji]) letter.reactions[emoji] = 0;
    letter.reactions[emoji] += 1;
    window.saveArticleLetters(letters);
    renderAllLetters();
  };

  // Add a reply to a letter
  window.addReply = function(letterId, name, text) {
    if (!name.trim() || !text.trim()) return;
    const letters = window.loadArticleLetters();
    const letter = letters.find(l => l.id === letterId);
    if (!letter) return;
    if (!letter.replies) letter.replies = [];
    const ts = formatLetterDate(new Date());
    letter.replies.push({
      id: 'reply-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      text: text.trim(),
      date: ts.full,
      isoDate: ts.iso
    });
    window.saveArticleLetters(letters);
    renderAllLetters();
  };

  // Render all letters for the article
  function renderAllLetters() {
    const container = document.getElementById('lettersContainer');
    if (!container) return;
    const letters = window.loadArticleLetters();

    if (letters.length === 0) {
      container.innerHTML = '<p class="no-letters"><span class="no-letters-icon">✉</span>Be the first to leave a letter. Your words become part of this growing literary garden.</p>';
      return;
    }

    const listEl = document.createElement('div');
    listEl.className = 'reader-letters-list';

    // Sort newest first
    const sorted = [...letters].sort((a, b) => new Date(b.isoDate || b.date) - new Date(a.isoDate || a.date));

    sorted.forEach(letter => {
      const card = document.createElement('article');
      card.className = 'letter-card-literary';
      card.setAttribute('data-letter-id', letter.id);

      // Avatar initial
      const initial = letter.name.charAt(0).toUpperCase();

      // Reactions HTML
      const reactionEmojis = ['❤️', '🌻', '🕊️', '🌙', '✨'];
      let reactionsHtml = '';
      reactionEmojis.forEach(emoji => {
        const count = (letter.reactions && letter.reactions[emoji]) || 0;
        reactionsHtml += `<button class="letter-reaction-btn" data-letter-id="${letter.id}" data-emoji="${emoji}" type="button" aria-label="React with ${emoji}">
          <span class="letter-reaction-emoji">${emoji}</span>
          <span class="letter-reaction-count">${count}</span>
        </button>`;
      });

      // Replies HTML
      let repliesHtml = '';
      if (letter.replies && letter.replies.length > 0) {
        letter.replies.forEach(reply => {
          repliesHtml += `<div class="letter-reply">
            <div class="letter-reply-header">
              <span class="letter-reply-name">${escapeHtml(reply.name)}</span>
              <span class="letter-reply-date">${reply.date}</span>
            </div>
            <p class="letter-reply-text">${escapeHtml(reply.text)}</p>
          </div>`;
        });
      }

      // Related piece badge
      const relatedBadge = letter.relatedPiece ? `<span class="letter-card-related">from ${escapeHtml(letter.relatedPiece)}</span>` : '';

      card.innerHTML = `
        <div class="letter-card-header">
          <span class="letter-card-avatar" aria-hidden="true">${initial}</span>
          <div>
            <h3 class="letter-card-name">${escapeHtml(letter.name)}</h3>
            <span class="letter-card-timestamp">${letter.date} ${relatedBadge}</span>
          </div>
        </div>
        <div class="letter-card-body">
          <p>${escapeHtml(letter.text)}</p>
        </div>
        <div class="letter-card-footer">
          <div class="letter-reactions">${reactionsHtml}</div>
          <div class="letter-card-actions">
            <button class="letter-reply-toggle" data-letter-id="${letter.id}" type="button" aria-label="Reply to this letter">💬 Reply</button>
          </div>
        </div>
        <div class="letter-replies" id="replies-${letter.id}">
          ${repliesHtml}
          <div class="letter-reply-form">
            <input type="text" class="reply-name-input" placeholder="Your name" maxlength="30" required>
            <input type="text" class="reply-text-input" placeholder="Write a reply..." maxlength="400" required>
            <button class="reply-submit-btn" data-letter-id="${letter.id}" type="button">Send</button>
          </div>
        </div>
      `;

      listEl.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(listEl);

    // Attach reaction event listeners
    container.querySelectorAll('.letter-reaction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const letterId = btn.dataset.letterId;
        const emoji = btn.dataset.emoji;
        window.addReaction(letterId, emoji);
      });
    });

    // Attach reply toggle listeners
    container.querySelectorAll('.letter-reply-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const letterId = btn.dataset.letterId;
        const repliesDiv = document.getElementById('replies-' + letterId);
        if (repliesDiv) {
          repliesDiv.classList.toggle('is-open');
          btn.textContent = repliesDiv.classList.contains('is-open') ? '💬 Close' : '💬 Reply';
        }
      });
    });

    // Attach reply submit listeners
    container.querySelectorAll('.reply-submit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const letterId = btn.dataset.letterId;
        const repliesDiv = document.getElementById('replies-' + letterId);
        const nameInput = repliesDiv.querySelector('.reply-name-input');
        const textInput = repliesDiv.querySelector('.reply-text-input');
        if (nameInput && textInput) {
          window.addReply(letterId, nameInput.value, textInput.value);
          nameInput.value = '';
          textInput.value = '';
        }
      });
    });
  }

  // Handle the warm letter form submission
  const letterFormWarm = document.getElementById('letterFormWarm');
  if (letterFormWarm) {
    letterFormWarm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('warmReaderName');
      const letterInput = document.getElementById('warmReaderLetter');
      if (!nameInput || !letterInput) return;
      const name = nameInput.value.trim();
      const text = letterInput.value.trim();
      if (!name || !text) return;

      const letters = window.loadArticleLetters();
      const ts = formatLetterDate(new Date());
      const newLetter = {
        id: 'letter-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8),
        name: name,
        text: text,
        date: ts.full,
        formattedDate: ts.formattedDate,
        formattedTime: ts.formattedTime,
        isoDate: ts.iso,
        reactions: {},
        replies: [],
        featured: false,
        relatedPiece: getArticleTitle(),
        relatedUrl: getPageSlug()
      };
      letters.unshift(newLetter);
      window.saveArticleLetters(letters);
      nameInput.value = '';
      letterInput.value = '';

      showToast('Your letter has been added to the garden. ✉');
      renderAllLetters();
    });
  }

  // Handle old letterForm for backward compatibility
  const letterForm = document.getElementById('letterForm');
  if (letterForm && !letterFormWarm) {
    letterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('readerName');
      const letterInput = document.getElementById('readerLetter');
      if (!nameInput || !letterInput) return;
      const name = nameInput.value.trim();
      const text = letterInput.value.trim();
      if (!name || !text) return;

      const letters = window.loadArticleLetters();
      const ts = formatLetterDate(new Date());
      const newLetter = {
        id: 'letter-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8),
        name: name,
        text: text,
        date: ts.full,
        formattedDate: ts.formattedDate,
        formattedTime: ts.formattedTime,
        isoDate: ts.iso,
        reactions: {},
        replies: [],
        featured: false,
        relatedPiece: getArticleTitle(),
        relatedUrl: getPageSlug()
      };
      letters.unshift(newLetter);
      window.saveArticleLetters(letters);
      nameInput.value = '';
      letterInput.value = '';

      showToast('Your letter has been added to the garden. ✉');
      renderAllLetters();
    });
  }

  // Initialize: render letters on page load + listen for real-time updates
  if (document.getElementById('lettersContainer')) {
    renderAllLetters();

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === LETTER_STORAGE_KEY) {
        renderAllLetters();
      }
    });

    // Listen for broadcast messages
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'letters-updated' && e.data.key === LETTER_STORAGE_KEY) {
          renderAllLetters();
        }
      });
    }
  }

  // =====================================
  // FRESH READS CAROUSEL
  // =====================================

  const carousel = document.querySelector('.fresh-carousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (carousel && prevBtn && nextBtn) {
    const cardWidth = () => {
      const card = carousel.querySelector('.fresh-card');
      if (!card) return 0;
      const style = getComputedStyle(carousel);
      const gap = parseFloat(style.gap) || 24;
      return card.offsetWidth + gap;
    };

    const scrollTo = (direction) => {
      const amount = cardWidth();
      if (amount <= 0) return;
      const newScroll = carousel.scrollLeft + (direction === 'next' ? amount : -amount);
      carousel.scrollTo({ left: newScroll, behavior: 'smooth' });
    };

    const updateButtons = () => {
      const atStart = carousel.scrollLeft <= 5;
      const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    };

    prevBtn.addEventListener('click', () => scrollTo('prev'));
    nextBtn.addEventListener('click', () => scrollTo('next'));

    carousel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();

    // Mouse drag support
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('dragging');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      carousel.style.cursor = 'grabbing';
    });

    carousel.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      carousel.classList.remove('dragging');
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.classList.remove('dragging');
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - carousel.offsetLeft;
      touchScrollLeft = carousel.scrollLeft;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - touchStartX) * 1.5;
      carousel.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });

    // Set initial grab cursor
    carousel.style.cursor = 'grab';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =====================================
  // COPY QUOTE BUTTON
  // =====================================

  document.querySelectorAll('.copy-quote').forEach(btn => {
    btn.addEventListener('click', () => {
      const quoteCard = btn.closest('.quote-card');
      const quoteText = quoteCard?.querySelector('.quote-text');
      const quoteAuthor = quoteCard?.querySelector('.quote-author');

      if (quoteText && quoteAuthor) {
        const text = `${quoteText.textContent} ${quoteAuthor.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = originalText; }, 2000);
        }).catch(() => {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = originalText; }, 2000);
        });
      }
    });
  });

  // =====================================
  // ESSAY SEARCH
  // =====================================

  window.searchEssays = function() {
    const input = document.getElementById('essaySearch');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const cards = document.querySelectorAll('.essay-card');
    cards.forEach(card => {
      const title = card.querySelector('h2')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent?.toLowerCase() || '';
      const blockquote = card.querySelector('blockquote')?.textContent?.toLowerCase() || '';
      const match = title.includes(filter) || desc.includes(filter) || blockquote.includes(filter);
      card.style.display = match ? 'flex' : 'none';
    });
  };

  // =====================================
  // FAVORITE LINES — Data & Gallery
  // =====================================

  const quoteGallery = document.getElementById('quoteGallery');
  if (!quoteGallery) return;

  const QUOTES_DATA = [
    { id: 'sunflower-1', text: 'The sun never loved the sunflower. The sunflower only loved the sun.', work: 'A Sunflower without a Sun', category: 'essay', date: '2026-03-20', url: 'essays/sunflower.html', themeClass: 'quote-card-sunflower' },
    { id: 'sunflower-2', text: 'Even when the sun never turns, the flower still blooms.', work: 'A Sunflower without a Sun', category: 'essay', date: '2026-03-20', url: 'essays/sunflower.html', themeClass: 'quote-card-sunflower' },
    { id: 'sunflower-3', text: 'Perhaps that is the quiet courage of love.', work: 'A Sunflower without a Sun', category: 'essay', date: '2026-03-20', url: 'essays/sunflower.html', themeClass: 'quote-card-sunflower' },
    { id: 'blizzard-1', text: 'I choose to carry a blizzard of judgement, because at the end of the day, the person who stays with me the longest is myself.', work: 'Blizzard of Judgement', category: 'essay', date: '2026-07-16', url: 'essays/blizzard.html', themeClass: 'quote-card-blizzard' },
    { id: 'blizzard-2', text: 'That question became the sign to finally start listening \u2014 not to the noise around me, but to myself.', work: 'Blizzard of Judgement', category: 'essay', date: '2026-07-16', url: 'essays/blizzard.html', themeClass: 'quote-card-blizzard' },
    { id: 'blizzard-3', text: 'Having the chance to truly know a person is fascinating. You become an investigator searching for answers about what they love and what they fear.', work: 'Blizzard of Judgement', category: 'essay', date: '2026-07-16', url: 'essays/blizzard.html', themeClass: 'quote-card-blizzard' },
    { id: 'eccentric-1', text: 'Live. Feel. Be free. Find the harmony you are meant to have.', work: 'Eccentric Feeling', category: 'essay', date: '2026-07-04', url: 'essays/eccentric.html', themeClass: 'quote-card-eccentric' },
    { id: 'eccentric-2', text: 'A quiet breeze of air brushing against my face, yet it screams loudly inside my brain.', work: 'Eccentric Feeling', category: 'essay', date: '2026-07-04', url: 'essays/eccentric.html', themeClass: 'quote-card-eccentric' },
    { id: 'eccentric-3', text: 'Give yourself a chance to process it and allow that eccentric feeling to be understood.', work: 'Eccentric Feeling', category: 'essay', date: '2026-07-04', url: 'essays/eccentric.html', themeClass: 'quote-card-eccentric' },
    { id: 'moonbound-1', text: 'The moon never apologizes for shining from afar.', work: 'Moonbound', category: 'essay', date: '2026-03-10', url: 'essays/moonbound.html', themeClass: 'quote-card-moonbound' },
    { id: 'moonbound-2', text: 'Something so far away still holds power over the waves.', work: 'Moonbound', category: 'essay', date: '2026-03-10', url: 'essays/moonbound.html', themeClass: 'quote-card-moonbound' },
    { id: 'moonbound-3', text: 'If you are out there, look up. We share the same sky.', work: 'Moonbound', category: 'essay', date: '2026-03-10', url: 'essays/moonbound.html', themeClass: 'quote-card-moonbound' },
    { id: 'moonbound-4', text: 'Something beautiful came from a violent beginning. Maybe love works the same way.', work: 'Moonbound', category: 'essay', date: '2026-03-10', url: 'essays/moonbound.html', themeClass: 'quote-card-moonbound' },
    { id: 'peace-1', text: 'Peace is not found \u2014 it is grown quietly within.', work: 'The Everlasting Peace', category: 'essay', date: '2026-07-20', url: 'essays/peace.html', themeClass: 'quote-card-peace' },
    { id: 'peace-2', text: 'Solitude means learning to sit with your own emotions, enjoying your own company, and discovering a quiet form of self-love.', work: 'The Everlasting Peace', category: 'essay', date: '2026-07-20', url: 'essays/peace.html', themeClass: 'quote-card-peace' },
    { id: 'peace-3', text: 'Because once you learn to be with yourself, you will always be with the everlasting peace.', work: 'The Everlasting Peace', category: 'essay', date: '2026-07-20', url: 'essays/peace.html', themeClass: 'quote-card-peace' },
    { id: 'wilted-1', text: 'Even the brightest petal falls. Though cherished memories are kept, time outlives them all.', work: 'The Wilted Flower', category: 'poem', date: '2026-07-16', url: 'poems/wilted-flower.html', themeClass: 'quote-card-wilted' },
    { id: 'wilted-2', text: 'Euphoria won\'t forever last. It cannot live hereafter. So cherish each moment while it lasts, or regret will follow after.', work: 'The Wilted Flower', category: 'poem', date: '2026-07-16', url: 'poems/wilted-flower.html', themeClass: 'quote-card-wilted' },
    { id: 'wilted-3', text: 'One must learn how to accept. Even the brightest petal falls.', work: 'The Wilted Flower', category: 'poem', date: '2026-07-16', url: 'poems/wilted-flower.html', themeClass: 'quote-card-wilted' },
    { id: 'raindrops-1', text: 'Yet hope is real, though unseen like a ghost. Hold on to it, for it will cost the least.', work: 'Raindrops', category: 'poem', date: '2026-07-22', url: 'poems/raindrops.html', themeClass: 'quote-card-raindrops' },
    { id: 'raindrops-2', text: 'Starting again is nature\'s quiet way. Yet accepting every scar and stain is the bravest choice you\'ll ever make.', work: 'Raindrops', category: 'poem', date: '2026-07-22', url: 'poems/raindrops.html', themeClass: 'quote-card-raindrops' },
    { id: 'raindrops-3', text: 'Take the falling rain as an example. It cleanses the earth and helps new life grow.', work: 'Raindrops', category: 'poem', date: '2026-07-22', url: 'poems/raindrops.html', themeClass: 'quote-card-raindrops' }
  ];

  let activeData = [...QUOTES_DATA];
  let bookmarks = loadBookmarks();
  let currentModalQuote = null;

  function loadBookmarks() {
    try { return JSON.parse(localStorage.getItem('unsentBookmarks') || '[]'); } catch { return []; }
  }

  function saveBookmarks() {
    localStorage.setItem('unsentBookmarks', JSON.stringify(bookmarks));
  }

  function isBookmarked(id) { return bookmarks.includes(id); }

  function toggleBookmark(id) {
    const idx = bookmarks.indexOf(id);
    if (idx > -1) bookmarks.splice(idx, 1); else bookmarks.push(id);
    saveBookmarks();
    document.querySelectorAll(`[data-quote-id="${id}"]`).forEach(card => {
      const btn = card.querySelector('.bookmark-btn');
      if (btn) {
        btn.classList.toggle('active', isBookmarked(id));
        btn.setAttribute('aria-label', isBookmarked(id) ? 'Remove from bookmarks' : 'Add to bookmarks');
        btn.querySelector('.bookmark-tooltip-text').textContent = isBookmarked(id) ? 'Bookmarked' : 'Bookmark';
      }
    });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function categoryLabel(cat) { return cat === 'essay' ? 'Personal Essay' : 'Poem'; }
  function categoryClass(cat) { return cat === 'essay' ? 'quote-line-category--essay' : 'quote-line-category--poem'; }

  function renderQuotes(data) {
    quoteGallery.innerHTML = '';
    if (data.length === 0) {
      document.getElementById('quoteEmpty').classList.remove('hidden');
      document.getElementById('quoteCounter').classList.add('hidden');
      return;
    }
    document.getElementById('quoteEmpty').classList.add('hidden');
    document.getElementById('quoteCounter').classList.remove('hidden');

    data.forEach((q, idx) => {
      const card = document.createElement('article');
      card.className = `favorite-line-card ${q.themeClass}`;
      card.setAttribute('data-quote-id', q.id);
      card.setAttribute('data-category', q.category);
      card.setAttribute('data-date', q.date);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Quote from ${q.work}`);
      const isFav = isBookmarked(q.id);
      card.innerHTML = `
        <p class="quote-line-text">&ldquo;${q.text}&rdquo;</p>
        <div class="quote-line-source">
          <span class="quote-line-title">${q.work}</span>
          <div class="quote-line-meta">
            <span class="quote-line-category ${categoryClass(q.category)}">${categoryLabel(q.category)}</span>
            <span>${formatDate(q.date)}</span>
          </div>
          <a href="${q.url}" class="quote-read-link" target="_blank" onclick="event.stopPropagation();">Read Full Piece &rarr;</a>
        </div>
        <div class="quote-card-actions">
          <button class="btn-icon copy-btn" type="button" aria-label="Copy quote"><span aria-hidden="true">📋</span><span class="tooltip">Copy</span></button>
          <button class="btn-icon share-btn" type="button" aria-label="Share quote"><span aria-hidden="true">↗</span><span class="tooltip">Share</span></button>
          <button class="btn-icon bookmark-btn ${isFav ? 'active' : ''}" type="button" aria-label="${isFav ? 'Remove from bookmarks' : 'Add to bookmarks'}"><span aria-hidden="true">${isFav ? '★' : '☆'}</span><span class="bookmark-tooltip-text">${isFav ? 'Bookmarked' : 'Bookmark'}</span></button>
        </div>`;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.quote-card-actions') || e.target.closest('.quote-read-link')) return;
        openQuoteModal(q);
      });
      const copyBtn = card.querySelector('.copy-btn');
      copyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyQuote(q); });
      const shareBtn = card.querySelector('.share-btn');
      shareBtn.addEventListener('click', (e) => { e.stopPropagation(); shareQuote(q); });
      const bookmarkBtn = card.querySelector('.bookmark-btn');
      bookmarkBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleBookmark(q.id); });
      quoteGallery.appendChild(card);
    });
    updateCounter(data.length);
  }

  function updateCounter(visible) {
    document.getElementById('visibleCount').textContent = visible;
    document.getElementById('totalCount').textContent = QUOTES_DATA.length;
  }

  function searchQuotes(query) {
    const q = query.toLowerCase().trim();
    activeData = q ? QUOTES_DATA.filter(item => item.text.toLowerCase().includes(q) || item.work.toLowerCase().includes(q)) : [...QUOTES_DATA];
    applyFilters();
  }

  function filterQuotes(category) {
    let filtered = activeData;
    if (category !== 'all') filtered = activeData.filter(item => item.category === category);
    applySort(filtered);
  }

  function applySort(data) {
    const order = document.getElementById('sortOrder').value;
    const sorted = [...data];
    sorted.sort((a, b) => order === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
    renderQuotes(sorted);
  }

  function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    let filtered = activeData;
    if (category !== 'all') filtered = activeData.filter(item => item.category === category);
    applySort(filtered);
  }

  function getRandomQuote() {
    const randomIdx = Math.floor(Math.random() * QUOTES_DATA.length);
    const quote = QUOTES_DATA[randomIdx];
    const existing = document.querySelector(`[data-quote-id="${quote.id}"]`);
    if (existing) {
      existing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      existing.style.outline = '3px solid var(--accent-gold)';
      existing.style.outlineOffset = '3px';
      setTimeout(() => { existing.style.outline = ''; existing.style.outlineOffset = ''; }, 2500);
      document.getElementById('quoteSearch').value = '';
      document.getElementById('categoryFilter').value = 'all';
      activeData = [...QUOTES_DATA];
      applyFilters();
      setTimeout(() => { const el = document.querySelector(`[data-quote-id="${quote.id}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    } else {
      document.getElementById('quoteSearch').value = '';
      document.getElementById('categoryFilter').value = 'all';
      activeData = [...QUOTES_DATA];
      applyFilters();
      setTimeout(() => { const el = document.querySelector(`[data-quote-id="${quote.id}"]`); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }
  }

  function copyQuote(q) {
    const text = `"${q.text}" — ${q.work}`;
    navigator.clipboard.writeText(text).then(() => showToast('Quote copied to clipboard')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Quote copied to clipboard');
    });
  }

  function shareQuote(q) {
    const shareData = { title: q.work, text: `"${q.text}" — ${q.work}`, url: window.location.origin + '/' + q.url };
    if (navigator.share && window.innerWidth <= 768) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareData.text + '\n\n' + shareData.url).then(() => showToast('Quote link copied to clipboard')).catch(() => showToast('Share not available on this device'));
    }
  }

  function openQuoteModal(q) {
    currentModalQuote = q;
    const modal = document.getElementById('readingModal');
    const text = document.getElementById('readingModalText');
    const work = document.getElementById('readingModalWork');
    const category = document.getElementById('readingModalCategory');
    const readBtn = document.getElementById('readingModalReadBtn');
    const moreBtn = document.getElementById('readingModalMoreBtn');
    text.textContent = `\u201C${q.text}\u201D`;
    work.textContent = q.work;
    category.textContent = categoryLabel(q.category);
    readBtn.href = q.url;
    moreBtn.onclick = () => {
      closeQuoteModal();
      document.getElementById('quoteSearch').value = '';
      document.getElementById('categoryFilter').value = 'all';
      activeData = QUOTES_DATA.filter(item => item.work === q.work);
      applyFilters();
    };
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reading-modal-open');
    document.getElementById('readingModalClose')?.focus();
  }

  function closeQuoteModal() {
    const modal = document.getElementById('readingModal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reading-modal-open');
  }

  const searchInput = document.getElementById('quoteSearch');
  if (searchInput) searchInput.addEventListener('input', (e) => searchQuotes(e.target.value));
  const filterSelect = document.getElementById('categoryFilter');
  if (filterSelect) filterSelect.addEventListener('change', () => searchQuotes(searchInput?.value || ''));
  const sortSelect = document.getElementById('sortOrder');
  if (sortSelect) sortSelect.addEventListener('change', () => applyFilters());
  const randomBtn = document.getElementById('randomQuoteBtn');
  if (randomBtn) randomBtn.addEventListener('click', getRandomQuote);

  const modal = document.getElementById('readingModal');
  if (modal) {
    const closeBtn = document.getElementById('readingModalClose') || modal.querySelector('.reading-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeQuoteModal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.classList.contains('reading-modal-overlay')) closeQuoteModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeQuoteModal(); });
  }

  activeData = [...QUOTES_DATA];
  applySort(activeData);

};

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.initApp();
});

