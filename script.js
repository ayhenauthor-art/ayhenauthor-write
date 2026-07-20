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