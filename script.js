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

});
