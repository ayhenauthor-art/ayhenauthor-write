/* =========================================
   THE UNSENT LETTERS & STORIES
   Premium Share Card Generator
   ========================================= */

// =====================================
// PIECE THEME SYSTEM
// Each piece gets a unique visual identity
// =====================================

const PIECE_THEMES = {
  'sunflower': {
    name: 'A Sunflower without a Sun',
    id: 'sunflower',
    gradients: {
      primary: ['#FDF6E3', '#FAF0D7', '#F5E6C8'],
      accent: ['#D4A030', '#B8860B', '#8B6914'],
      overlay: ['rgba(246, 211, 101, 0.12)', 'rgba(248, 235, 204, 0.08)']
    },
    textColors: { primary: '#3A3028', secondary: '#6B5D4E', accent: '#B8860B', light: '#FFFFFF' },
    textures: ['sunflower-petals', 'soft-noon-light'],
    decorativeElements: ['✿', '❀', '✦', '·'],
    borderColor: 'rgba(184, 134, 11, 0.25)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'warm-morning',
    isDark: false
  },
  'wilted-flower': {
    name: 'The Wilted Flower',
    id: 'wilted-flower',
    gradients: {
      primary: ['#FDF0F0', '#F8E4E4', '#F2D8D8'],
      accent: ['#C25A63', '#B8404A', '#8B3038'],
      overlay: ['rgba(194, 90, 99, 0.10)', 'rgba(139, 48, 56, 0.06)']
    },
    textColors: { primary: '#3A2A2A', secondary: '#6B4E4E', accent: '#B8404A', light: '#FFFFFF' },
    textures: ['faded-petals', 'autumn-leaves'],
    decorativeElements: ['✿', '✾', '❁', '·'],
    borderColor: 'rgba(184, 64, 74, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'gentle-autumn',
    isDark: false
  },
  'raindrops': {
    name: 'Raindrops',
    id: 'raindrops',
    gradients: {
      primary: ['#EBF4F0', '#E0EDE6', '#D4E6DC'],
      accent: ['#5A8F7C', '#4A7A68', '#3A6556'],
      overlay: ['rgba(90, 143, 124, 0.10)', 'rgba(58, 101, 86, 0.06)']
    },
    textColors: { primary: '#2A3A34', secondary: '#4E6B60', accent: '#4A7A68', light: '#FFFFFF' },
    textures: ['rain-mist', 'water-ripples'],
    decorativeElements: ['💧', '✦', '·', '~'],
    borderColor: 'rgba(74, 122, 104, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'rainy-mist',
    isDark: false
  },
  'blizzard': {
    name: 'Blizzard of Judgement',
    id: 'blizzard',
    gradients: {
      primary: ['#EFF4F6', '#E4ECF0', '#D8E4EA'],
      accent: ['#67889B', '#55748A', '#436078'],
      overlay: ['rgba(103, 136, 155, 0.10)', 'rgba(67, 96, 120, 0.06)']
    },
    textColors: { primary: '#2C3A42', secondary: '#4F6775', accent: '#55748A', light: '#FFFFFF' },
    textures: ['frost-patterns', 'snow-drifts'],
    decorativeElements: ['❄', '✦', '·', '❅'],
    borderColor: 'rgba(85, 116, 138, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'cold-winter',
    isDark: false
  },
  'moonbound': {
    name: 'Moonbound',
    id: 'moonbound',
    gradients: {
      primary: ['#EDF0F8', '#E1E6F2', '#D5DCEC'],
      accent: ['#526A9E', '#43588A', '#344776'],
      overlay: ['rgba(82, 106, 158, 0.10)', 'rgba(52, 71, 118, 0.06)']
    },
    textColors: { primary: '#2A2E42', secondary: '#4C5678', accent: '#43588A', light: '#FFFFFF' },
    textures: ['moon-craters', 'night-sky'],
    decorativeElements: ['🌙', '✦', '·', '⋆'],
    borderColor: 'rgba(67, 88, 138, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'moonlight-glow',
    isDark: false
  },
  'eccentric': {
    name: 'Eccentric Feeling',
    id: 'eccentric',
    gradients: {
      primary: ['#F2EEF4', '#E8E2EE', '#DED6E8'],
      accent: ['#8A6E94', '#765A82', '#624870'],
      overlay: ['rgba(138, 110, 148, 0.10)', 'rgba(98, 72, 112, 0.06)']
    },
    textColors: { primary: '#382E3A', secondary: '#5C4E60', accent: '#765A82', light: '#FFFFFF' },
    textures: ['abstract-swirls', 'watercolor'],
    decorativeElements: ['✦', '✧', '·', '~'],
    borderColor: 'rgba(118, 90, 130, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'twilight-haze',
    isDark: false
  },
  'peace': {
    name: 'The Everlasting Peace',
    id: 'peace',
    gradients: {
      primary: ['#EEF4EC', '#E3ECE0', '#D8E4D4'],
      accent: ['#5F8C63', '#4E7852', '#3D6441'],
      overlay: ['rgba(95, 140, 99, 0.10)', 'rgba(61, 100, 65, 0.06)']
    },
    textColors: { primary: '#2A3A2C', secondary: '#4E6B50', accent: '#4E7852', light: '#FFFFFF' },
    textures: ['leaf-patterns', 'soft-grass'],
    decorativeElements: ['🌿', '✦', '·', '☘'],
    borderColor: 'rgba(78, 120, 82, 0.2)',
    font: { heading: 'Cormorant Garamond', body: 'Inter' },
    moodLighting: 'gentle-forest',
    isDark: false
  }
};

// Moonlight (dark) overrides for each piece
const PIECE_THEMES_DARK = {
  'sunflower': {
    gradients: { primary: ['#2B2820', '#221F18', '#1A1812'], accent: ['#D4A030', '#B8860B', '#8B6914'] },
    textColors: { primary: '#F2EDE0', secondary: '#C8C1B4', accent: '#E4C782', light: '#F2EDE0' },
    borderColor: 'rgba(212, 160, 48, 0.25)'
  },
  'wilted-flower': {
    gradients: { primary: ['#2B2022', '#22181A', '#1A1214'], accent: ['#C25A63', '#B8404A', '#8B3038'] },
    textColors: { primary: '#F2E0E2', secondary: '#C8B4B6', accent: '#D47078', light: '#F2E0E2' },
    borderColor: 'rgba(194, 90, 99, 0.25)'
  },
  'raindrops': {
    gradients: { primary: ['#202824', '#18221E', '#121C18'], accent: ['#5A8F7C', '#4A7A68', '#3A6556'] },
    textColors: { primary: '#E0F0EA', secondary: '#B4C8C0', accent: '#6DA893', light: '#E0F0EA' },
    borderColor: 'rgba(90, 143, 124, 0.25)'
  },
  'blizzard': {
    gradients: { primary: ['#22282C', '#1A2226', '#141C20'], accent: ['#67889B', '#55748A', '#436078'] },
    textColors: { primary: '#E2ECF0', secondary: '#B6C8D0', accent: '#7DA0B4', light: '#E2ECF0' },
    borderColor: 'rgba(103, 136, 155, 0.25)'
  },
  'moonbound': {
    gradients: { primary: ['#1E2230', '#161A28', '#101420'], accent: ['#526A9E', '#43588A', '#344776'] },
    textColors: { primary: '#E0E6F2', secondary: '#B4C0D4', accent: '#6D87C0', light: '#E0E6F2' },
    borderColor: 'rgba(82, 106, 158, 0.25)'
  },
  'eccentric': {
    gradients: { primary: ['#26222C', '#1E1A26', '#161220'], accent: ['#8A6E94', '#765A82', '#624870'] },
    textColors: { primary: '#E8E0EE', secondary: '#C0B6C8', accent: '#A88BB5', light: '#E8E0EE' },
    borderColor: 'rgba(138, 110, 148, 0.25)'
  },
  'peace': {
    gradients: { primary: ['#1E281E', '#162216', '#101C10'], accent: ['#5F8C63', '#4E7852', '#3D6441'] },
    textColors: { primary: '#E0F0E0', secondary: '#B4C8B4', accent: '#78A07C', light: '#E0F0E0' },
    borderColor: 'rgba(95, 140, 99, 0.25)'
  }
};

// =====================================
// DETECT PIECE ID FROM PAGE
// =====================================

function detectPieceId() {
  const body = document.body;
  const classes = body.className.split(' ');

  // Check for poem classes first
  if (classes.includes('poem-wilted')) return 'wilted-flower';
  if (classes.includes('poem-raindrops')) return 'raindrops';

  // Check for article classes
  if (classes.includes('article-sunflower')) return 'sunflower';
  if (classes.includes('article-blizzard')) return 'blizzard';
  if (classes.includes('article-eccentric')) return 'eccentric';
  if (classes.includes('article-moonbound')) return 'moonbound';
  if (classes.includes('article-peace')) return 'peace';

  // Fallback: check data attribute
  const pieceAttr = body.getAttribute('data-piece-id');
  if (pieceAttr && PIECE_THEMES[pieceAttr]) return pieceAttr;

  // Fallback: detect from URL
  const path = window.location.pathname;
  if (path.includes('/poems/')) {
    if (path.includes('wilted-flower')) return 'wilted-flower';
    if (path.includes('raindrops')) return 'raindrops';
  }
  if (path.includes('/essays/')) {
    if (path.includes('sunflower')) return 'sunflower';
    if (path.includes('blizzard')) return 'blizzard';
    if (path.includes('eccentric')) return 'eccentric';
    if (path.includes('moonbound')) return 'moonbound';
    if (path.includes('peace')) return 'peace';
  }

  return null;
}

// =====================================
// GET PIECE THEME (with dark mode support)
// =====================================

function getPieceTheme(pieceId) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'moonlight' ||
                 document.documentElement.getAttribute('data-theme') === 'starlight' ||
                 document.documentElement.getAttribute('data-theme') === 'rainfall';

  const baseTheme = PIECE_THEMES[pieceId];
  if (!baseTheme) return null;

  if (isDark && PIECE_THEMES_DARK[pieceId]) {
    const dark = PIECE_THEMES_DARK[pieceId];
    return {
      ...baseTheme,
      isDark: true,
      gradients: { ...baseTheme.gradients, ...dark.gradients },
      textColors: { ...baseTheme.textColors, ...dark.textColors },
      borderColor: dark.borderColor || baseTheme.borderColor
    };
  }

  return baseTheme;
}

// =====================================
// ENHANCED PIECE METADATA
// =====================================

function getEnhancedPieceMeta() {
  const titleEl = document.querySelector('title');
  const fullTitle = titleEl?.textContent?.replace(' | The Unsent Letters & Stories', '').trim() || 'Untitled';

  // Detect piece theme from body class
  const pieceId = detectPieceId();

  // Get reading time
  const readingTimeEl = document.querySelector('.article-meta span:nth-child(2)');
  const readingTime = readingTimeEl?.textContent?.trim() || '';

  // Get publication date
  const dateEl = document.querySelector('.article-meta span:first-child');
  const pubDate = dateEl?.textContent?.trim() || '';

  // Get excerpt/subtitle
  const subtitleEl = document.querySelector('.article-subtitle');
  const excerpt = subtitleEl?.textContent?.replace(/[«»""]/g, '').trim() || '';

  // Get featured quote
  const quoteEl = document.querySelector('.quote-text');
  let quote = '';
  if (quoteEl) {
    quote = quoteEl.textContent.trim().replace(/^[\u201C\u201D"]|[\u201C\u201D"]$/g, '').trim();
  }

  // Get article category
  const categoryEl = document.querySelector('.article-meta span:nth-child(3)');
  const category = categoryEl?.textContent?.trim() || '';

  const url = window.location.href;
  const isPoem = document.querySelector('.poem-stanza') !== null || window.location.pathname.includes('/poems/');

  return {
    title: fullTitle,
    pieceId,
    quote,
    url,
    isPoem,
    readingTime,
    pubDate,
    excerpt,
    category,
    author: 'Ayhen A. Narciso'
  };
}

// =====================================
// CANVAS UTILITIES
// =====================================

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// =====================================
// DRAW GRADIENT BACKGROUND
// =====================================

function drawGradientBackground(ctx, width, height, theme) {
  const colors = theme.gradients.primary;

  // Main gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1]);
  grad.addColorStop(1, colors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Accent overlay gradient
  const accentGrad = ctx.createRadialGradient(
    width * 0.2, height * 0.3, 0,
    width * 0.2, height * 0.3, width * 0.7
  );
  accentGrad.addColorStop(0, theme.overlay?.[0] || 'rgba(0,0,0,0)');
  accentGrad.addColorStop(1, theme.overlay?.[1] || 'rgba(0,0,0,0)');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, 0, width, height);

  // Texture dots
  ctx.globalAlpha = 0.04;
  const dotColor = theme.textColors.accent;
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 3 + 1;
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// =====================================
// DRAW DECORATIVE ELEMENTS
// =====================================

function drawDecorativeBorder(ctx, width, height, theme) {
  const margin = 36;
  const innerMargin = 44;

  // Outer border
  ctx.strokeStyle = theme.borderColor || 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner border
  ctx.strokeStyle = theme.borderColor || 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);
}

function drawDecorativeTopLine(ctx, width, theme, y) {
  ctx.strokeStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, y);
  ctx.lineTo(width * 0.7, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawDecorativeFlourish(ctx, width, y, theme) {
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.35;
  ctx.font = '32px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const chars = theme.decorativeElements || ['✦'];
  ctx.fillText(chars[0] + ' ' + chars[1] + ' ' + chars[0], width / 2, y);
  ctx.globalAlpha = 1;
}

// =====================================
// GENERATE QUOTE CARD — Premium Canvas
// =====================================

async function generateQuoteCard(pieceId, format = 'instagram-post') {
  const meta = getEnhancedPieceMeta();
  const theme = getPieceTheme(pieceId);
  if (!theme) {
    showToast('Could not detect piece theme.');
    return null;
  }

  const isStory = format === 'instagram-story';
  const isPost = format === 'instagram-post';
  const width = 1080;
  const height = isStory ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Background
  drawGradientBackground(ctx, width, height, theme);

  // 2. Decorative border
  drawDecorativeBorder(ctx, width, height, theme);

  // 3. Top decorative line
  const topLineY = isStory ? 110 : 95;
  drawDecorativeTopLine(ctx, width, theme, topLineY);

  // 4. Top flourish
  drawDecorativeFlourish(ctx, width, isStory ? 150 : 130, theme);

  // 5. Quote text - opening mark
  const quoteText = meta.quote || 'The sun never loved the sunflower. The sunflower only loved the sun.';
  const maxQuoteWidth = width * 0.7;

  // Opening quote mark
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.12;
  ctx.font = '140px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('\u201C', width * 0.15, isStory ? height * 0.22 : height * 0.20);
  ctx.globalAlpha = 1;

  // Quote text with dynamic sizing
  let quoteFontSize = isStory ? 52 : 46;
  ctx.font = `italic ${quoteFontSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let textMetrics = ctx.measureText(quoteText);
  while (textMetrics.width > maxQuoteWidth && quoteFontSize > 22) {
    quoteFontSize -= 2;
    ctx.font = `italic ${quoteFontSize}px "Cormorant Garamond", Georgia, serif`;
    textMetrics = ctx.measureText(quoteText);
  }

  // Word wrap
  const lines = wrapText(ctx, quoteText, maxQuoteWidth);
  const lineHeight = quoteFontSize * 1.6;
  const totalTextHeight = lines.length * lineHeight;
  const quoteStartY = isStory ? height * 0.38 : height * 0.40;
  const startY = quoteStartY - (lines.length - 1) * lineHeight / 2;

  ctx.fillStyle = theme.textColors.primary;
  ctx.font = `italic ${quoteFontSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], width / 2, startY + i * lineHeight);
  }

  // 6. Bottom decorative line
  const bottomLineY = isStory ? height * 0.62 : height * 0.65;
  ctx.strokeStyle = theme.textColors.accent;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(width * 0.35, bottomLineY);
  ctx.lineTo(width * 0.65, bottomLineY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 7. Piece title
  ctx.fillStyle = theme.textColors.accent;
  ctx.font = `28px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(meta.title || 'Untitled', width / 2, bottomLineY + 55);

  // 8. Author
  ctx.fillStyle = theme.textColors.secondary;
  ctx.font = '18px "Inter", sans-serif';
  ctx.fillText('\u2014 Ayhen A. Narciso', width / 2, bottomLineY + 100);

  // 9. Bottom branding area
  const brandY = height - 110;

  // Small separator
  ctx.strokeStyle = theme.borderColor || 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.38, brandY - 20);
  ctx.lineTo(width * 0.62, brandY - 20);
  ctx.stroke();

  // Branding
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.8;
  ctx.font = '22px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('The Unsent Letters & Stories', width / 2, brandY + 10);
  ctx.globalAlpha = 1;

  // URL
  ctx.fillStyle = theme.textColors.secondary;
  ctx.globalAlpha = 0.5;
  ctx.font = '14px "Inter", sans-serif';
  ctx.fillText('theunsentletters.com', width / 2, brandY + 48);
  ctx.globalAlpha = 1;

  // Bottom flourish
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.2;
  ctx.font = '18px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('✦', width / 2, height - 40);
  ctx.globalAlpha = 1;

  return canvas;
}

// =====================================
// GENERATE PROMOTIONAL CARD
// =====================================

async function generatePromotionalCard() {
  const meta = getEnhancedPieceMeta();
  const pieceId = meta.pieceId || detectPieceId();
  const theme = getPieceTheme(pieceId);
  if (!theme) {
    showToast('Could not detect piece theme.');
    return null;
  }

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Background with gradient
  drawGradientBackground(ctx, width, height, theme);

  // 2. Decorative border
  drawDecorativeBorder(ctx, width, height, theme);

  // 3. Top flourish
  drawDecorativeFlourish(ctx, width, 100, theme);

  // 4. Category badge-like element
  const badgeColors = pieceId ? {
    'sunflower': '#B8860B',
    'wilted-flower': '#B8404A',
    'raindrops': '#4A7A68',
    'blizzard': '#55748A',
    'moonbound': '#43588A',
    'eccentric': '#765A82',
    'peace': '#4E7852'
  } : {};

  const badgeColor = badgeColors[pieceId] || theme.textColors.accent;

  // Category band
  ctx.fillStyle = badgeColor;
  ctx.globalAlpha = 0.08;
  drawRoundedRect(ctx, width * 0.35, 140, width * 0.3, 36, 18);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = theme.textColors.accent;
  ctx.font = '18px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(meta.category || 'Essay', width / 2, 158);

  // 5. Title (large, prominent)
  const title = meta.title || 'Untitled';
  let titleFontSize = 58;
  ctx.font = `${titleFontSize}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let titleWidth = ctx.measureText(title).width;
  while (titleWidth > width * 0.75 && titleFontSize > 30) {
    titleFontSize -= 2;
    ctx.font = `${titleFontSize}px "Cormorant Garamond", Georgia, serif`;
    titleWidth = ctx.measureText(title).width;
  }

  ctx.fillStyle = theme.textColors.primary;
  ctx.fillText(title, width / 2, 240);

  // 6. Decorative line under title
  ctx.strokeStyle = theme.textColors.accent;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.moveTo(width * 0.3, 280);
  ctx.lineTo(width * 0.7, 280);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 7. Excerpt
  const excerpt = meta.excerpt || meta.quote || '';
  const excerptMaxWidth = width * 0.7;
  let excerptFontSize = 30;
  ctx.font = `italic ${excerptFontSize}px "Cormorant Garamond", Georgia, serif`;
  let excerptWidth = ctx.measureText(excerpt).width;
  while (excerptWidth > excerptMaxWidth && excerptFontSize > 18) {
    excerptFontSize -= 2;
    ctx.font = `italic ${excerptFontSize}px "Cormorant Garamond", Georgia, serif`;
    excerptWidth = ctx.measureText(excerpt).width;
  }

  const excerptLines = wrapText(ctx, excerpt, excerptMaxWidth);
  const excerptLineH = excerptFontSize * 1.5;
  const excerptStartY = 340;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = theme.textColors.secondary;
  for (let i = 0; i < Math.min(excerptLines.length, 3); i++) {
    ctx.fillText(excerptLines[i], width / 2, excerptStartY + i * excerptLineH);
  }

  // 8. Atmospheric decoration - large central element
  const decorY = height * 0.52;
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.06;
  const decorChars = theme.decorativeElements || ['✦'];
  ctx.font = '120px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(decorChars[0], width / 2, decorY);
  ctx.globalAlpha = 1;

  // 9. Reading time & date
  ctx.fillStyle = theme.textColors.secondary;
  ctx.font = '18px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.7;
  ctx.fillText(`${meta.pubDate}  ·  ${meta.readingTime}`, width / 2, height * 0.60);
  ctx.globalAlpha = 1;

  // 10. CTA Button area
  const ctaY = height * 0.67;

  // Button background
  const btnW = 340;
  const btnH = 56;
  const btnX = (width - btnW) / 2;
  const btnY = ctaY;

  ctx.fillStyle = badgeColor;
  ctx.globalAlpha = 0.15;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Button border
  ctx.strokeStyle = theme.textColors.accent;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 28);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Button text
  ctx.fillStyle = theme.textColors.accent;
  ctx.font = '20px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Read the Full Piece →', width / 2, ctaY + btnH / 2);

  // 11. Divider line
  const dividerY = height * 0.78;
  ctx.strokeStyle = theme.borderColor || 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(width * 0.2, dividerY);
  ctx.lineTo(width * 0.8, dividerY);
  ctx.stroke();

  // 12. Branding
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.8;
  ctx.font = '26px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('The Unsent Letters & Stories', width / 2, height * 0.82);

  // 13. Author
  ctx.fillStyle = theme.textColors.secondary;
  ctx.font = '18px "Inter", sans-serif';
  ctx.globalAlpha = 0.7;
  ctx.fillText('by Ayhen A. Narciso', width / 2, height * 0.86);
  ctx.globalAlpha = 1;

  // 14. URL
  ctx.fillStyle = theme.textColors.secondary;
  ctx.globalAlpha = 0.4;
  ctx.font = '14px "Inter", sans-serif';
  ctx.fillText(window.location.href, width / 2, height * 0.90);
  ctx.globalAlpha = 1;

  // 15. Bottom flourish
  ctx.fillStyle = theme.textColors.accent;
  ctx.globalAlpha = 0.15;
  ctx.font = '20px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('✦  ✦  ✦', width / 2, height - 45);
  ctx.globalAlpha = 1;

  return canvas;
}

// =====================================
// CANVAS TO BLOB / DOWNLOAD
// =====================================

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create image blob'));
    }, 'image/png');
  });
}

function downloadCanvas(canvas, filename) {
  return canvasToBlob(canvas).then(blob => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    return blob;
  });
}

// =====================================
// COPY IMAGE TO CLIPBOARD
// =====================================

async function copyCanvasToClipboard(canvas) {
  try {
    const blob = await canvasToBlob(canvas);
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Failed to copy image:', err);
    return false;
  }
}

// =====================================
// EXPOSED WINDOW FUNCTIONS
// =====================================

window.downloadQuoteCard = async function(format = 'instagram-post') {
  const pieceId = detectPieceId();
  if (!pieceId) {
    showToast('Could not detect which piece this is.');
    return null;
  }

  showToast('Generating your quote card...');

  try {
    const canvas = await generateQuoteCard(pieceId, format);
    if (!canvas) throw new Error('Failed to generate card');

    const meta = getEnhancedPieceMeta();
    const filename = `unsent-${meta.title.toLowerCase().replace(/\s+/g, '-')}-quote-${format === 'instagram-story' ? 'story' : 'post'}.png`;

    await downloadCanvas(canvas, filename);

    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('share-modal-open');
    }

    showToast('Quote card downloaded!');
    return canvas;
  } catch (err) {
    console.error('Failed to generate quote card:', err);
    showToast('Could not generate image. Try copying the link instead.');
    return null;
  }
};

window.downloadPromoCard = async function() {
  showToast('Generating promotional card...');

  try {
    const canvas = await generatePromotionalCard();
    if (!canvas) throw new Error('Failed to generate card');

    const meta = getEnhancedPieceMeta();
    const filename = `unsent-${meta.title.toLowerCase().replace(/\s+/g, '-')}-promo.png`;

    await downloadCanvas(canvas, filename);

    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('share-modal-open');
    }

    showToast('Promotional card downloaded!');
    return canvas;
  } catch (err) {
    console.error('Failed to generate promo card:', err);
    showToast('Could not generate image. Try copying the link instead.');
    return null;
  }
};

window.copyImage = async function(type = 'quote') {
  const pieceId = detectPieceId();
  if (!pieceId) {
    showToast('Could not detect which piece this is.');
    return;
  }

  showToast('Preparing image...');

  try {
    const canvas = type === 'promo' ? await generatePromotionalCard() : await generateQuoteCard(pieceId, 'instagram-post');
    if (!canvas) throw new Error('Failed to generate card');

    const success = await copyCanvasToClipboard(canvas);
    if (success) {
      showToast('Image copied to clipboard!');
    } else {
      showToast('Could not copy. Try downloading instead.');
    }
  } catch (err) {
    console.error('Failed to copy image:', err);
    showToast('Could not copy image.');
  }
};

window.saveToDevice = async function(type = 'quote') {
  const pieceId = detectPieceId();
  if (!pieceId) {
    showToast('Could not detect which piece this is.');
    return;
  }

  showToast('Saving...');

  try {
    const canvas = type === 'promo' ? await generatePromotionalCard() : await generateQuoteCard(pieceId, 'instagram-post');
    if (!canvas) throw new Error('Failed to generate card');

    const blob = await canvasToBlob(canvas);

    // Try Native File System API first
    try {
      const handle = await window.showSaveFilePicker?.({
        suggestedName: `unsent-${type}-card.png`,
        types: [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      showToast('Image saved!');
      return;
    } catch (pickerErr) {
      // User cancelled or API unavailable - fallback to download
      if (pickerErr.name === 'AbortError') return;
    }

    // Fallback: download
    const link = document.createElement('a');
    link.download = `unsent-${type}-card.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    showToast('Image saved!');
  } catch (err) {
    console.error('Failed to save:', err);
    showToast('Could not save image.');
  }
};

window.shareThisPiece = function() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.classList.add('share-modal-open');
  }
};

window.copyLink = function() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied.');
    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('share-modal-open');
    }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = window.location.href;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Link copied.');
    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('share-modal-open');
    }
  });
};

window.shareFacebook = function() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('share-modal-open');
  }
};

window.shareX = function() {
  const meta = getEnhancedPieceMeta();
  const text = encodeURIComponent(`"${meta.quote}" — ${meta.title}`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.classList.remove('share-modal-open');
  }
};

window.shareToInstagramStory = async function() {
  const blob = await window.downloadQuoteCard('instagram-story');
  if (blob && window.instagramGuide) {
    setTimeout(() => window.instagramGuide.open('story'), 500);
  }
};

window.shareToInstagramPost = async function() {
  const blob = await window.downloadQuoteCard('instagram-post');
  if (blob && window.instagramGuide) {
    setTimeout(() => window.instagramGuide.open('post'), 500);
  }
};

window.nativeShare = function() {
  const meta = getEnhancedPieceMeta();
  const shareData = {
    title: meta.title,
    text: `"${meta.quote}" — ${meta.title}`,
    url: window.location.href
  };

  if (navigator.share && window.innerWidth <= 768) {
    navigator.share(shareData).catch(() => {});
    const modal = document.getElementById('shareModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.classList.remove('share-modal-open');
    }
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`).then(() => {
      showToast('Link copied to clipboard');
    }).catch(() => {
      showToast('Share not available on this device');
    });
  }
};

