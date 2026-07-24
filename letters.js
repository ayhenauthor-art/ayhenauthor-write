/* =========================================
   THE UNSENT LETTERS & STORIES
   Letters Kept in the Garden — Archive Engine
   ========================================= */

(function() {
  'use strict';

  // Known article keys in localStorage (all possible letter storage keys)
  function getAllArticleKeys() {
    const prefixes = [
      'unsent_letters_essays-sunflower',
      'unsent_letters_essays-blizzard',
      'unsent_letters_essays-eccentric',
      'unsent_letters_essays-moonbound',
      'unsent_letters_essays-peace',
      'unsent_letters_poems-wilted-flower',
      'unsent_letters_poems-raindrops'
    ];
    return prefixes;
  }

  // Fetch all letters from localStorage across all articles
  function fetchAllLetters() {
    const keys = getAllArticleKeys();
    const allLetters = [];
    keys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(data)) {
          data.forEach(letter => {
            allLetters.push({
              ...letter,
              _storageKey: key  // Keep track of source article
            });
          });
        }
      } catch (e) {
        // Skip invalid entries
      }
    });
    return allLetters;
  }

  // Escape HTML for safe rendering
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Format date string nicely
  function formatDate(isoStr) {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Compute reaction total for "Most Resonant" sort
  function totalReactions(letter) {
    if (!letter.reactions) return 0;
    return Object.values(letter.reactions).reduce((sum, count) => sum + count, 0);
  }

  // Render a single literary garden card
  function renderGardenCard(letter) {
    const card = document.createElement('article');
    card.className = 'garden-card-literary reveal';

    const initial = letter.name ? letter.name.charAt(0).toUpperCase() : '?';
    const related = letter.relatedPiece ? escapeHtml(letter.relatedPiece) : 'Unknown';
    const relatedUrl = letter.relatedUrl || '#';
    const letterText = letter.text ? escapeHtml(letter.text) : '';
    const letterName = letter.name ? escapeHtml(letter.name) : 'Anonymous';
    const letterDate = letter.date || formatDate(letter.isoDate) || '';
    const reactionCount = totalReactions(letter);
    const replyCount = letter.replies ? letter.replies.length : 0;

    // Truncate text for card preview
    const previewText = letterText.length > 280
      ? letterText.substring(0, 280) + '…'
      : letterText;

    card.innerHTML = `
      <div class="garden-card-header">
        <span class="garden-card-avatar" aria-hidden="true">${initial}</span>
        <div class="garden-card-author">
          <h3 class="garden-card-name">${letterName}</h3>
          <span class="garden-card-date">${escapeHtml(letterDate)}</span>
        </div>
      </div>
      <div class="garden-card-body">
        <p>${previewText}</p>
      </div>
      <div class="garden-card-footer">
        <a href="${escapeHtml(relatedUrl)}" class="garden-card-source" title="Go to the piece that inspired this letter">
          <span class="garden-card-source-icon">✉</span>
          from <em>${related}</em>
        </a>
        <div class="garden-card-stats">
          ${reactionCount > 0 ? `<span class="garden-card-stat" title="Reactions">❤️ ${reactionCount}</span>` : ''}
          ${replyCount > 0 ? `<span class="garden-card-stat" title="Replies">💬 ${replyCount}</span>` : ''}
        </div>
      </div>
    `;

    // Click to expand full letter
    card.addEventListener('click', () => {
      openLetterModal(letter);
    });

    return card;
  }

  // Open a modal showing the full letter
  function openLetterModal(letter) {
    // Remove existing modal
    const existing = document.querySelector('.garden-letter-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'garden-letter-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'false');

    const initial = letter.name ? letter.name.charAt(0).toUpperCase() : '?';
    const related = letter.relatedPiece ? escapeHtml(letter.relatedPiece) : 'Unknown';
    const relatedUrl = letter.relatedUrl || '#';
    const letterText = letter.text ? escapeHtml(letter.text) : '';
    const letterName = letter.name ? escapeHtml(letter.name) : 'Anonymous';
    const letterDate = letter.date || formatDate(letter.isoDate) || '';

    let repliesHtml = '';
    if (letter.replies && letter.replies.length > 0) {
      repliesHtml = '<div class="garden-modal-replies"><h4>Replies</h4>';
      letter.replies.forEach(reply => {
        repliesHtml += `
          <div class="garden-modal-reply">
            <strong>${escapeHtml(reply.name)}</strong>
            <span class="garden-modal-reply-date">${escapeHtml(reply.date)}</span>
            <p>${escapeHtml(reply.text)}</p>
          </div>
        `;
      });
      repliesHtml += '</div>';
    }

    modal.innerHTML = `
      <div class="garden-modal-overlay"></div>
      <div class="garden-modal-panel">
        <button class="garden-modal-close" type="button" aria-label="Close">&times;</button>
        <div class="garden-modal-header">
          <span class="garden-modal-avatar">${initial}</span>
          <div>
            <h2 class="garden-modal-name">${letterName}</h2>
            <span class="garden-modal-date">${escapeHtml(letterDate)}</span>
          </div>
        </div>
        <div class="garden-modal-body">
          <p>${letterText}</p>
        </div>
        <div class="garden-modal-footer">
          <a href="${escapeHtml(relatedUrl)}" class="garden-modal-source">✉ from <em>${related}</em></a>
        </div>
        ${repliesHtml}
      </div>
    `;

    document.body.appendChild(modal);

    // Close handlers
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(() => modal.remove(), 300);
    };

    const closeBtn = modal.querySelector('.garden-modal-close');
    const overlay = modal.querySelector('.garden-modal-overlay');

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', handler);
      }
    });

    // Animate in
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
  }

  // Check if scroll reveal observer exists; if not create one for garden cards
  function observeGardenCards() {
    if ('IntersectionObserver' in window) {
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
      document.querySelectorAll('.garden-card-literary.reveal').forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll('.garden-card-literary.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  // Sort letters by criteria
  function sortLetters(letters, criteria) {
    const sorted = [...letters];
    switch (criteria) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.isoDate || a.date) - new Date(b.isoDate || b.date));
        break;
      case 'resonant':
        sorted.sort((a, b) => totalReactions(b) - totalReactions(a));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.isoDate || b.date) - new Date(a.isoDate || a.date));
        break;
    }
    return sorted;
  }

  // Filter letters by search query
  function searchLetters(letters, query) {
    if (!query.trim()) return letters;
    const q = query.toLowerCase().trim();
    return letters.filter(letter => {
      const name = (letter.name || '').toLowerCase();
      const text = (letter.text || '').toLowerCase();
      const piece = (letter.relatedPiece || '').toLowerCase();
      return name.includes(q) || text.includes(q) || piece.includes(q);
    });
  }

  // Pick a featured letter (most resonant OR random from top 5)
  function pickFeaturedLetter(letters) {
    if (letters.length === 0) return null;
    // Try to find one that was manually marked as featured
    const manualFeatured = letters.find(l => l.featured === true);
    if (manualFeatured) return manualFeatured;
    // Otherwise pick the most resonant one
    const sorted = [...letters].sort((a, b) => totalReactions(b) - totalReactions(a));
    return sorted[0];
  }

  // Render the featured letter spotlight
  function renderFeaturedLetter(letter) {
    const container = document.getElementById('featuredLetterContainer');
    if (!container) return;

    if (!letter) {
      container.innerHTML = `
        <div class="featured-letter-empty">
          <span class="featured-letter-icon">✉</span>
          <p>No letters have been planted in the garden yet.<br>Be the first to leave a letter on any essay or poem.</p>
        </div>
      `;
      return;
    }

    const initial = letter.name ? letter.name.charAt(0).toUpperCase() : '?';
    const related = letter.relatedPiece ? escapeHtml(letter.relatedPiece) : 'Unknown';
    const relatedUrl = letter.relatedUrl || '#';
    const letterText = letter.text ? escapeHtml(letter.text) : '';
    const letterName = letter.name ? escapeHtml(letter.name) : 'Anonymous';
    const reactions = totalReactions(letter);

    container.innerHTML = `
      <div class="featured-letter-card reveal">
        <span class="featured-letter-badge">★ Featured Letter</span>
        <div class="featured-letter-header">
          <span class="featured-letter-avatar">${initial}</span>
          <div class="featured-letter-info">
            <h3 class="featured-letter-name">${letterName}</h3>
            <span class="featured-letter-date">${escapeHtml(letter.date || '')}</span>
          </div>
        </div>
        <div class="featured-letter-body">
          <p>${letterText}</p>
        </div>
        <div class="featured-letter-footer">
          <a href="${escapeHtml(relatedUrl)}" class="featured-letter-source">✉ from <em>${related}</em></a>
          ${reactions > 0 ? `<span class="featured-letter-reactions">❤️ ${reactions}</span>` : ''}
        </div>
      </div>
    `;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      const el = container.querySelector('.featured-letter-card');
      if (el) observer.observe(el);
    } else {
      container.querySelector('.featured-letter-card')?.classList.add('visible');
    }
  }

  // Main render function for the garden archive
  function renderGarden() {
    const container = document.getElementById('gardenLettersContainer');
    const counter = document.getElementById('gardenCount');
    if (!container) return;

    // Get sort and search params
    const sortEl = document.getElementById('gardenSort');
    const searchEl = document.getElementById('gardenSearch');
    const sortBy = sortEl ? sortEl.value : 'newest';
    const query = searchEl ? searchEl.value : '';

    // Fetch and process letters
    let letters = fetchAllLetters();
    letters = searchLetters(letters, query);
    letters = sortLetters(letters, sortBy);

    // Update counter
    if (counter) {
      const total = fetchAllLetters().length;
      counter.textContent = `Showing ${letters.length} of ${total} letter${total !== 1 ? 's' : ''} in the garden`;
    }

    // Render featured letter
    const featured = pickFeaturedLetter(letters);
    renderFeaturedLetter(featured);

    // Render cards
    if (letters.length === 0) {
      container.innerHTML = `
        <div class="garden-empty">
          <span class="garden-empty-icon">✉</span>
          <h3>No letters found</h3>
          <p>${query ? 'Try a different search term.' : 'No letters have been planted yet. Visit an essay or poem page to leave one.'}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    letters.forEach(letter => {
      const card = renderGardenCard(letter);
      container.appendChild(card);
    });

    // Observe cards for scroll reveal
    observeGardenCards();
  }

  // Initialize garden page
  function initGarden() {
    // Check if we're on the garden archive page
    if (!document.getElementById('gardenLettersContainer')) return;

    renderGarden();

    // Attach sort listener
    const sortEl = document.getElementById('gardenSort');
    if (sortEl) {
      sortEl.addEventListener('change', renderGarden);
    }

    // Attach search listener with debounce
    const searchEl = document.getElementById('gardenSearch');
    if (searchEl) {
      let debounceTimer;
      searchEl.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderGarden, 300);
      });
    }

    // Listen for real-time updates from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('unsent_letters_')) {
        renderGarden();
      }
    });

    // BroadcastChannel listener
    try {
      const channel = new BroadcastChannel('unsent-letters-channel');
      channel.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'letters-updated') {
          renderGarden();
        }
      });
    } catch (e) {
      // BroadcastChannel not supported
    }
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGarden);
  } else {
    initGarden();
  }

})();

