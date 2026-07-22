/* =========================================
   THE UNSENT LETTERS & STORIES
   Main JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

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

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        if (dropdown) dropdown.classList.remove('active');
      });
    });
  }

  // Mobile dropdown toggle
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  }

  // =====================================
  // SCROLL REVEAL ANIMATION
  // =====================================

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
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // =====================================
  // BACK TO TOP BUTTON
  // =====================================

  const topButton = document.getElementById('topButton');

  if (topButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        topButton.style.display = 'block';
      } else {
        topButton.style.display = 'none';
      }
    });

    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =====================================
  // GUIDE TO THE ARCHIVE
  // =====================================

  const archiveRoot = window.location.pathname.includes('/essays/') ? '../' : '';
  const archiveGuide = document.createElement('div');
  archiveGuide.className = 'archive-guide';
  archiveGuide.innerHTML = `
    <button class="archive-guide-trigger" type="button" aria-label="Open Guide to the Archive" aria-expanded="false" aria-controls="archiveGuideModal">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"></path></svg>
      <span>Guide to the Archive</span>
    </button>
    <div class="archive-guide-modal" id="archiveGuideModal" role="dialog" aria-modal="true" aria-labelledby="archiveGuideTitle" aria-describedby="archiveGuideDescription" aria-hidden="true">
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

    // Close on overlay click
    libraryModal.addEventListener('click', (event) => {
      if (event.target === libraryModal) closeLibraryModal();
    });

    // Escape key
    document.addEventListener('keydown', (event) => {
      if (!libraryModal.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLibraryModal();
        return;
      }
      // Focus trap
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

    // Close modal when clicking a category link
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
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // =====================================
  // SHARE MODAL
  // =====================================

  window.openShareModal = function() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'block';
  };

  const closeBtn = document.querySelector('.close-share');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const modal = document.getElementById('shareModal');
      if (modal) modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('shareModal');
    if (modal && e.target === modal) {
      modal.style.display = 'none';
    }
  });

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
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }).catch(() => {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
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
  // LETTER FORM
  // =====================================

  const letterForm = document.getElementById('letterForm');
  const lettersContainer = document.getElementById('lettersContainer');
  const noLetters = document.querySelector('.no-letters');

  if (letterForm && lettersContainer) {
    loadLetters();

    letterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('readerName');
      const letterInput = document.getElementById('readerLetter');

      if (nameInput && letterInput && nameInput.value.trim() && letterInput.value.trim()) {
        const letter = {
          name: nameInput.value.trim(),
          text: letterInput.value.trim(),
          date: new Date().toLocaleDateString()
        };

        saveLetter(letter);
        nameInput.value = '';
        letterInput.value = '';
      }
    });
  }

  function saveLetter(letter) {
    let letters = JSON.parse(localStorage.getItem('readerLetters') || '[]');
    letters.unshift(letter);
    
    if (letters.length > 50) {
      letters = letters.slice(0, 50);
    }
    
    localStorage.setItem('readerLetters', JSON.stringify(letters));
    renderLetter(letter);
    if (noLetters) noLetters.style.display = 'none';
  }

  function loadLetters() {
    const letters = JSON.parse(localStorage.getItem('readerLetters') || '[]');
    
    if (letters.length === 0) {
      if (noLetters) noLetters.style.display = 'block';
      return;
    }

    if (noLetters) noLetters.style.display = 'none';
    letters.forEach(renderLetter);
  }

  function renderLetter(letter) {
    if (!lettersContainer) return;

    const card = document.createElement('div');
    card.className = 'letter-card';
    card.innerHTML = `
      <h3>${escapeHtml(letter.name)}</h3>
      <p>${escapeHtml(letter.text)}</p>
      <small>${letter.date}</small>
    `;
    
    lettersContainer.appendChild(card);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =====================================
  // FAVORITE LINES — Data & Gallery
  // =====================================

  // Only init if on quotes page
  const quoteGallery = document.getElementById('quoteGallery');
  if (!quoteGallery) return;

  // ---- Quote Data ----

  const QUOTES_DATA = [
    // === A Sunflower without a Sun (Essay) ===
    {
      id: 'sunflower-1',
      text: 'The sun never loved the sunflower. The sunflower only loved the sun.',
      work: 'A Sunflower without a Sun',
      category: 'essay',
      date: '2026-03-20',
      url: 'essays/sunflower.html',
      themeClass: 'quote-card-sunflower'
    },
    {
      id: 'sunflower-2',
      text: 'Even when the sun never turns, the flower still blooms.',
      work: 'A Sunflower without a Sun',
      category: 'essay',
      date: '2026-03-20',
      url: 'essays/sunflower.html',
      themeClass: 'quote-card-sunflower'
    },
    {
      id: 'sunflower-3',
      text: 'Perhaps that is the quiet courage of love.',
      work: 'A Sunflower without a Sun',
      category: 'essay',
      date: '2026-03-20',
      url: 'essays/sunflower.html',
      themeClass: 'quote-card-sunflower'
    },

    // === Blizzard of Judgement (Essay) ===
    {
      id: 'blizzard-1',
      text: 'I choose to carry a blizzard of judgement, because at the end of the day, the person who stays with me the longest is myself.',
      work: 'Blizzard of Judgement',
      category: 'essay',
      date: '2026-07-16',
      url: 'essays/blizzard.html',
      themeClass: 'quote-card-blizzard'
    },
    {
      id: 'blizzard-2',
      text: 'That question became the sign to finally start listening — not to the noise around me, but to myself.',
      work: 'Blizzard of Judgement',
      category: 'essay',
      date: '2026-07-16',
      url: 'essays/blizzard.html',
      themeClass: 'quote-card-blizzard'
    },
    {
      id: 'blizzard-3',
      text: 'Having the chance to truly know a person is fascinating. You become an investigator searching for answers about what they love and what they fear.',
      work: 'Blizzard of Judgement',
      category: 'essay',
      date: '2026-07-16',
      url: 'essays/blizzard.html',
      themeClass: 'quote-card-blizzard'
    },

    // === Eccentric Feeling (Essay) ===
    {
      id: 'eccentric-1',
      text: 'Live. Feel. Be free. Find the harmony you are meant to have.',
      work: 'Eccentric Feeling',
      category: 'essay',
      date: '2026-07-04',
      url: 'essays/eccentric.html',
      themeClass: 'quote-card-eccentric'
    },
    {
      id: 'eccentric-2',
      text: 'A quiet breeze of air brushing against my face, yet it screams loudly inside my brain.',
      work: 'Eccentric Feeling',
      category: 'essay',
      date: '2026-07-04',
      url: 'essays/eccentric.html',
      themeClass: 'quote-card-eccentric'
    },
    {
      id: 'eccentric-3',
      text: 'Give yourself a chance to process it and allow that eccentric feeling to be understood.',
      work: 'Eccentric Feeling',
      category: 'essay',
      date: '2026-07-04',
      url: 'essays/eccentric.html',
      themeClass: 'quote-card-eccentric'
    },

    // === Moonbound (Essay) ===
    {
      id: 'moonbound-1',
      text: 'The moon never apologizes for shining from afar.',
      work: 'Moonbound',
      category: 'essay',
      date: '2026-03-10',
      url: 'essays/moonbound.html',
      themeClass: 'quote-card-moonbound'
    },
    {
      id: 'moonbound-2',
      text: 'Something so far away still holds power over the waves.',
      work: 'Moonbound',
      category: 'essay',
      date: '2026-03-10',
      url: 'essays/moonbound.html',
      themeClass: 'quote-card-moonbound'
    },
    {
      id: 'moonbound-3',
      text: 'If you are out there, look up. We share the same sky.',
      work: 'Moonbound',
      category: 'essay',
      date: '2026-03-10',
      url: 'essays/moonbound.html',
      themeClass: 'quote-card-moonbound'
    },
    {
      id: 'moonbound-4',
      text: 'Something beautiful came from a violent beginning. Maybe love works the same way.',
      work: 'Moonbound',
      category: 'essay',
      date: '2026-03-10',
      url: 'essays/moonbound.html',
      themeClass: 'quote-card-moonbound'
    },

    // === The Everlasting Peace (Essay) ===
    {
      id: 'peace-1',
      text: 'Peace is not found — it is grown quietly within.',
      work: 'The Everlasting Peace',
      category: 'essay',
      date: '2026-07-20',
      url: 'essays/peace.html',
      themeClass: 'quote-card-peace'
    },
    {
      id: 'peace-2',
      text: 'Solitude means learning to sit with your own emotions, enjoying your own company, and discovering a quiet form of self-love.',
      work: 'The Everlasting Peace',
      category: 'essay',
      date: '2026-07-20',
      url: 'essays/peace.html',
      themeClass: 'quote-card-peace'
    },
    {
      id: 'peace-3',
      text: 'Because once you learn to be with yourself, you will always be with the everlasting peace.',
      work: 'The Everlasting Peace',
      category: 'essay',
      date: '2026-07-20',
      url: 'essays/peace.html',
      themeClass: 'quote-card-peace'
    },

    // === The Wilted Flower (Poem) ===
    {
      id: 'wilted-1',
      text: 'Even the brightest petal falls. Though cherished memories are kept, time outlives them all.',
      work: 'The Wilted Flower',
      category: 'poem',
      date: '2026-07-16',
      url: 'poems/wilted-flower.html',
      themeClass: 'quote-card-wilted'
    },
    {
      id: 'wilted-2',
      text: 'Euphoria won\'t forever last. It cannot live hereafter. So cherish each moment while it lasts, or regret will follow after.',
      work: 'The Wilted Flower',
      category: 'poem',
      date: '2026-07-16',
      url: 'poems/wilted-flower.html',
      themeClass: 'quote-card-wilted'
    },
    {
      id: 'wilted-3',
      text: 'One must learn how to accept. Even the brightest petal falls.',
      work: 'The Wilted Flower',
      category: 'poem',
      date: '2026-07-16',
      url: 'poems/wilted-flower.html',
      themeClass: 'quote-card-wilted'
    },

    // === Raindrops (Poem) ===
    {
      id: 'raindrops-1',
      text: 'Yet hope is real, though unseen like a ghost. Hold on to it, for it will cost the least.',
      work: 'Raindrops',
      category: 'poem',
      date: '2026-07-22',
      url: 'poems/raindrops.html',
      themeClass: 'quote-card-raindrops'
    },
    {
      id: 'raindrops-2',
      text: 'Starting again is nature\'s quiet way. Yet accepting every scar and stain is the bravest choice you\'ll ever make.',
      work: 'Raindrops',
      category: 'poem',
      date: '2026-07-22',
      url: 'poems/raindrops.html',
      themeClass: 'quote-card-raindrops'
    },
    {
      id: 'raindrops-3',
      text: 'Take the falling rain as an example. It cleanses the earth and helps new life grow.',
      work: 'Raindrops',
      category: 'poem',
      date: '2026-07-22',
      url: 'poems/raindrops.html',
      themeClass: 'quote-card-raindrops'
    }
  ];

  // ---- State ----
  let activeData = [...QUOTES_DATA];
  let bookmarks = loadBookmarks();
  let currentModalQuote = null;

  // ---- Bookmark Helpers ----

  function loadBookmarks() {
    try {
      return JSON.parse(localStorage.getItem('unsentBookmarks') || '[]');
    } catch {
      return [];
    }
  }

  function saveBookmarks() {
    localStorage.setItem('unsentBookmarks', JSON.stringify(bookmarks));
  }

  function isBookmarked(id) {
    return bookmarks.includes(id);
  }

  function toggleBookmark(id) {
    const idx = bookmarks.indexOf(id);
    if (idx > -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(id);
    }
    saveBookmarks();
    // Update all cards with this id
    document.querySelectorAll(`[data-quote-id="${id}"]`).forEach(card => {
      const btn = card.querySelector('.bookmark-btn');
      if (btn) {
        btn.classList.toggle('active', isBookmarked(id));
        btn.setAttribute('aria-label', isBookmarked(id) ? 'Remove from bookmarks' : 'Add to bookmarks');
        btn.querySelector('.bookmark-tooltip-text').textContent = isBookmarked(id) ? 'Bookmarked' : 'Bookmark';
      }
    });
  }

  // ---- Formatting ----

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function categoryLabel(cat) {
    return cat === 'essay' ? 'Personal Essay' : 'Poem';
  }

  function categoryClass(cat) {
    return cat === 'essay' ? 'quote-line-category--essay' : 'quote-line-category--poem';
  }

  // ---- Render ----

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
          <button class="btn-icon copy-btn" type="button" aria-label="Copy quote">
            <span aria-hidden="true">📋</span>
            <span class="tooltip">Copy</span>
          </button>
          <button class="btn-icon share-btn" type="button" aria-label="Share quote">
            <span aria-hidden="true">↗</span>
            <span class="tooltip">Share</span>
          </button>
          <button class="btn-icon bookmark-btn ${isFav ? 'active' : ''}" type="button" aria-label="${isFav ? 'Remove from bookmarks' : 'Add to bookmarks'}">
            <span aria-hidden="true">${isFav ? '★' : '☆'}</span>
            <span class="bookmark-tooltip-text">${isFav ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>
      `;

      // --- Click: open modal ---
      card.addEventListener('click', (e) => {
        // Don't open modal if clicking action button or link
        if (e.target.closest('.quote-card-actions') || e.target.closest('.quote-read-link')) return;
        openQuoteModal(q);
      });

      // --- Copy ---
      const copyBtn = card.querySelector('.copy-btn');
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyQuote(q);
      });

      // --- Share ---
      const shareBtn = card.querySelector('.share-btn');
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareQuote(q);
      });

      // --- Bookmark ---
      const bookmarkBtn = card.querySelector('.bookmark-btn');
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(q.id);
      });

      quoteGallery.appendChild(card);
    });

    updateCounter(data.length);
  }

  function updateCounter(visible) {
    document.getElementById('visibleCount').textContent = visible;
    document.getElementById('totalCount').textContent = QUOTES_DATA.length;
  }

  // ---- Search ----

  function searchQuotes(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      activeData = [...QUOTES_DATA];
    } else {
      activeData = QUOTES_DATA.filter(item =>
        item.text.toLowerCase().includes(q) ||
        item.work.toLowerCase().includes(q)
      );
    }
    applyFilters();
  }

  // ---- Filter ----

  function filterQuotes(category) {
    let filtered = activeData;
    if (category !== 'all') {
      filtered = activeData.filter(item => item.category === category);
    }
    applySort(filtered);
  }

  // ---- Sort ----

  function applySort(data) {
    const order = document.getElementById('sortOrder').value;
    const sorted = [...data];
    if (order === 'newest') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    renderQuotes(sorted);
  }

  // ---- Combined Filter + Sort ----

  function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    let filtered = activeData;
    if (category !== 'all') {
      filtered = activeData.filter(item => item.category === category);
    }
    applySort(filtered);
  }

  // ---- Random Quote ----

  function getRandomQuote() {
    const randomIdx = Math.floor(Math.random() * QUOTES_DATA.length);
    const quote = QUOTES_DATA[randomIdx];

    // Scroll the matching card into view if visible, else render only that one
    const existing = document.querySelector(`[data-quote-id="${quote.id}"]`);
    if (existing) {
      existing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      existing.style.outline = '3px solid var(--accent-gold)';
      existing.style.outlineOffset = '3px';
      setTimeout(() => {
        existing.style.outline = '';
        existing.style.outlineOffset = '';
      }, 2500);

      // Clear search/filter/sort to show all
      document.getElementById('quoteSearch').value = '';
      document.getElementById('categoryFilter').value = 'all';
      activeData = [...QUOTES_DATA];
      applyFilters();
      // After re-render, scroll to the random card
      setTimeout(() => {
        const el = document.querySelector(`[data-quote-id="${quote.id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } else {
      // Clear filters and render all, then scroll
      document.getElementById('quoteSearch').value = '';
      document.getElementById('categoryFilter').value = 'all';
      activeData = [...QUOTES_DATA];
      applyFilters();
      setTimeout(() => {
        const el = document.querySelector(`[data-quote-id="${quote.id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  // ---- Copy Quote ----

  function copyQuote(q) {
    const text = `"${q.text}" — ${q.work}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Quote copied to clipboard');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Quote copied to clipboard');
    });
  }

  // ---- Share Quote ----

  function shareQuote(q) {
    const shareData = {
      title: q.work,
      text: `"${q.text}" — ${q.work}`,
      url: window.location.origin + '/' + q.url
    };

    if (navigator.share && window.innerWidth <= 768) {
      navigator.share(shareData).catch(() => {});
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(shareData.text + '\n\n' + shareData.url).then(() => {
        showToast('Quote link copied to clipboard');
      }).catch(() => {
        showToast('Share not available on this device');
      });
    }
  }

  // ---- Toast Notification ----

  function showToast(message) {
    const existing = document.querySelector('.quote-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'quote-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 24px',
      borderRadius: '50px',
      background: 'var(--accent-muted)',
      color: 'var(--text-on-accent)',
      fontFamily: 'var(--font-nav)',
      fontSize: '14px',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      boxShadow: 'var(--shadow-md)',
      pointerEvents: 'none'
    });
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

  // ---- Reading Modal ----

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

    // "More quotes" filters to this work
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

  // ---- Init Controls ----

  // Search
  const searchInput = document.getElementById('quoteSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuotes(e.target.value);
    });
  }

  // Filter
  const filterSelect = document.getElementById('categoryFilter');
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      searchQuotes(searchInput?.value || '');
    });
  }

  // Sort
  const sortSelect = document.getElementById('sortOrder');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      applyFilters();
    });
  }

  // Random
  const randomBtn = document.getElementById('randomQuoteBtn');
  if (randomBtn) {
    randomBtn.addEventListener('click', getRandomQuote);
  }

  // ---- Modal Close ----
  const modal = document.getElementById('readingModal');
  if (modal) {
    const closeBtn = document.getElementById('readingModalClose') || modal.querySelector('.reading-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeQuoteModal);
    }

    // Overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('reading-modal-overlay')) {
        closeQuoteModal();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeQuoteModal();
      }
    });
  }

  // ---- Initial Render ----
  activeData = [...QUOTES_DATA];
  applySort(activeData);

});
