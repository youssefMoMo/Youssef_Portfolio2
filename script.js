/* script.js - كامل بدون موسيقى */
/* ═══════════════════════════════════════════════════════════════
   GALAXY PORTFOLIO v4.0 - Standalone Single Page Application
   Complete JavaScript with Security, i18n, and Optimizations
   ═══════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════
// SECURITY HELPERS
// ═══════════════════════════════════════════════════════════════

const Security = {
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    sanitizeInput(input, maxLength = 500) {
        if (!input) return '';
        return String(input).trim().slice(0, maxLength).replace(/[<>]/g, '');
    },
    rateLimiter: {
        requests: new Map(),
        limit: 10,
        window: 60000,
        canMakeRequest(key) {
            const now = Date.now();
            const requests = this.requests.get(key) || [];
            const recentRequests = requests.filter(time => now - time < this.window);
            if (recentRequests.length >= this.limit) return false;
            recentRequests.push(now);
            this.requests.set(key, recentRequests);
            return true;
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// GAMES CONFIG - Add your Roblox Place IDs here
// ═══════════════════════════════════════════════════════════════

const GAME_PLACE_IDS = [
    "111021125092689",
    "128915436393653",
    "93605084835085",
    "116868134708688",
    "85746704401525",
    "92369489899222",
    "121873420604621"
];

// ═══════════════════════════════════════════════════════════════
// REVIEWS DATA
// ═══════════════════════════════════════════════════════════════

let reviewsData = [
    { name: "schwerer", project: "Game UI", rating: 5, text: "affordable, fast, flexible with revisions and good quality solid", date: "2024-11", verified: true },
    { name: "Gren", project: "Full Game UI", rating: 5, text: "Very fast orders and good quality", date: "2024-10", verified: true },
    { name: "snowstorm/king", project: "UI Design", rating: 5, text: "good, cheap, fast, ui is high quality and more affordable", date: "2024-10", verified: true },
    { name: "10dok", project: "Game UI", rating: 5, text: "super good and affordable, without your ui I wouldve quit finishing my game", date: "2024-09", verified: true },
    { name: "nilcous", project: "Full UI Pack", rating: 4, text: "handled everything perfectly, great experience, fast delivery. Could improve communication and response time", date: "2024-09", verified: true },
    { name: "CyraX", project: "UI Commission", rating: 5, text: "Very fast and efficient, did exactly what I want. Recommended UI artist!", date: "2024-08", verified: true },
    { name: "ephemeralrequiem", project: "Game Interface", rating: 5, text: "high quality work, fast delivery and good communication", date: "2024-08", verified: true },
    { name: "pdawgdev", project: "Custom UI", rating: 5, text: "high quality and fully customizable, listened to what I wanted", date: "2024-07", verified: true },
    { name: "mystery_0001", project: "UI Design", rating: 5, text: "fast delivery & easy to work with, highly recommend!", date: "2024-07", verified: true }
];

// Load saved reviews
const savedReviews = localStorage.getItem('userReviews');
if (savedReviews) reviewsData = [...reviewsData, ...JSON.parse(savedReviews)];

// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS (كما هي سابقاً، مع إزالة أي مفاتيح متعلقة بالموسيقى إن وجدت)
// (لم تكن هناك مفاتيح للموسيقى في الترجمة)
// ═══════════════════════════════════════════════════════════════

// (ضع هنا كائن translations الكامل كما هو من قبل)

// ═══════════════════════════════════════════════════════════════
// i18n SYSTEM
// ═══════════════════════════════════════════════════════════════

const i18n = {
    currentLang: 'en',
    init() {
        const saved = localStorage.getItem('language');
        if (saved && translations[saved]) this.currentLang = saved;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;
        this.updateLangButtons();
    },
    setLanguage(lang) {
        if (!translations[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        this.updateLangButtons();
        this.translatePage();
    },
    translate(key) {
        return translations[this.currentLang]?.[key] || translations.en[key] || key;
    },
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.innerHTML = this.translate(el.getAttribute('data-i18n'));
        });
    },
    updateLangButtons() {
        document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }
};

// ═══════════════════════════════════════════════════════════════
// WELCOME FRAME
// ═══════════════════════════════════════════════════════════════

const WelcomeFrame = {
    storageKey: 'welcomeFrameShown_v4',
    init() {
        if (localStorage.getItem(this.storageKey)) return;
        this.show();
    },
    show() {
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.innerHTML = `
            <div class="welcome-frame glass-card">
                <div class="welcome-badge">v4.0</div>
                <h2 class="welcome-title">${i18n.translate('welcome.title')}</h2>
                <p class="welcome-subtitle">${i18n.translate('welcome.subtitle')}</p>
                <div class="welcome-features">
                    <div class="welcome-feature">${i18n.translate('welcome.new1')}</div>
                    <div class="welcome-feature">${i18n.translate('welcome.new2')}</div>
                    <div class="welcome-feature">${i18n.translate('welcome.new3')}</div>
                    <div class="welcome-feature">${i18n.translate('welcome.new4')}</div>
                    <div class="welcome-feature">${i18n.translate('welcome.new5')}</div>
                    <div class="welcome-feature">${i18n.translate('welcome.new6')}</div>
                </div>
                <button class="welcome-btn" onclick="WelcomeFrame.dismiss()">
                    <span>${i18n.translate('welcome.button')}</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));
    },
    dismiss() {
        localStorage.setItem(this.storageKey, 'true');
        const overlay = document.querySelector('.welcome-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 500);
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// TIME DISPLAY
// ═══════════════════════════════════════════════════════════════

const TimeDisplay = {
    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    },
    update() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const alexandriaTime = new Date(utc + (2 * 3600000));
        const timeStr = `${String(alexandriaTime.getHours()).padStart(2, '0')}:${String(alexandriaTime.getMinutes()).padStart(2, '0')}:${String(alexandriaTime.getSeconds()).padStart(2, '0')}`;
        const el = document.getElementById('alexandriaTime');
        const mobile = document.getElementById('mobileTime');
        if (el) el.textContent = timeStr;
        if (mobile) mobile.textContent = timeStr;
    }
};

// ═══════════════════════════════════════════════════════════════
// PAGE TEMPLATES (كما هي سابقاً)
// ═══════════════════════════════════════════════════════════════

// (ضع هنا كائن Templates الكامل من الردود السابقة)

// ═══════════════════════════════════════════════════════════════
// GAMES MANAGER
// ═══════════════════════════════════════════════════════════════

const GamesManager = {
    async init() {
        const grid = document.getElementById('gamesGrid');
        const totalEl = document.getElementById('totalVisitsCount');
        if (!grid) return;

        if (GAME_PLACE_IDS.length === 0) {
            grid.innerHTML = `<div class="no-games-message glass-card" style="grid-column:1/-1;text-align:center;padding:60px 30px"><i class="fas fa-gamepad" style="font-size:3rem;color:var(--primary);margin-bottom:20px;display:block"></i><h3>Games Coming Soon</h3><p style="color:var(--text-muted)">Add Roblox place IDs to display games.</p></div>`;
            if (totalEl) totalEl.textContent = '—';
            return;
        }

        if (!Security.rateLimiter.canMakeRequest('games')) {
            this.showError(grid);
            return;
        }

        try {
            const baseUrl = window.location.origin;
            const url = `${baseUrl}/api/gamesData?ids=${GAME_PLACE_IDS.join(',')}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.ok && data.data) {
                this.renderGames(data.data);
                if (totalEl) totalEl.textContent = this.formatNumber(data.totalVisits);
            } else {
                this.showError(grid);
            }
        } catch (error) {
            console.error('Games fetch error:', error);
            this.showError(grid);
        }
    },

    renderGames(games) {
        const grid = document.getElementById('gamesGrid');
        grid.innerHTML = games.map((g, i) => `
            <div class="game-card glass-card" style="animation-delay:${i * 0.1}s">
                <div class="game-thumbnail">
                    <a href="https://www.roblox.com/games/${g.inputId}" target="_blank" rel="noopener">
                        <img src="${g.icon || 'https://placehold.co/420x420/0a1628/b5c1dc?text=Game'}" 
                             alt="${Security.escapeHtml(g.name)}" 
                             loading="lazy" 
                             onerror="this.src='https://placehold.co/420x420/0a1628/b5c1dc?text=Game'">
                    </a>
                    <div class="game-visits">
                        <i class="fas fa-eye"></i> ${this.formatNumber(g.visits)}
                    </div>
                </div>
                <div class="game-info">
                    <h3><i class="fas fa-gamepad"></i> ${Security.escapeHtml(g.name) || 'Unknown Game'}</h3>
                    <div class="game-stats">
                        <span><i class="fas fa-eye"></i> ${this.formatNumber(g.visits)} ${i18n.translate('games.visits')}</span>
                    </div>
                    <a href="https://www.roblox.com/games/${g.inputId}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
                        <i class="fas fa-play"></i> ${i18n.translate('games.playNow')}
                    </a>
                </div>
            </div>
        `).join('');
    },

    showError(grid) {
        grid.innerHTML = `<div class="error-message glass-card" style="grid-column:1/-1;text-align:center;padding:40px">
            <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:#ef4444;margin-bottom:15px;display:block"></i>
            <h3>Unable to load games</h3>
            <p style="color:var(--text-muted);margin-top:10px">Please check your connection or try again later.</p>
        </div>`;
    },

    formatNumber(n) {
        if (!n) return '—';
        const num = Number(n);
        if (isNaN(num)) return '—';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toLocaleString();
    }
};

// ═══════════════════════════════════════════════════════════════
// REVIEWS MANAGER
// ═══════════════════════════════════════════════════════════════

const ReviewsManager = {
    init() { this.render(); this.attachFilters(); },
    render(filter = 'all') {
        const grid = document.getElementById('reviewsGrid'); if (!grid) return;
        const filtered = filter === 'all' ? reviewsData : reviewsData.filter(r => r.rating === parseInt(filter));
        grid.innerHTML = filtered.map(r => `
            <div class="review-card glass-card">
                <div class="review-header"><div class="reviewer-avatar"><i class="fas fa-user-astronaut"></i></div><div class="reviewer-info"><h4>${Security.escapeHtml(r.name)}</h4><span class="review-project">${Security.escapeHtml(r.project)}</span></div>${r.verified ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}</div>
                <div class="review-rating">${'<i class="fas fa-star"></i>'.repeat(r.rating)}${'<i class="far fa-star"></i>'.repeat(5 - r.rating)}</div>
                <p class="review-text">"${Security.escapeHtml(r.text)}"</p>
                <div class="review-date"><i class="fas fa-calendar"></i> ${r.date}</div>
            </div>
        `).join('');
    },
    attachFilters() { document.querySelectorAll('.reviews-filters .filter-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.reviews-filters .filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); this.render(btn.dataset.rating); }); }); }
};

// ═══════════════════════════════════════════════════════════════
// REVIEW FORM
// ═══════════════════════════════════════════════════════════════

const ReviewForm = {
    currentStep: 1, data: { name: '', project: '', rating: 0, text: '' },
    init() { this.currentStep = 1; this.data = { name: '', project: '', rating: 0, text: '' }; this.initRating(); this.initCharCount(); },
    initRating() { document.querySelectorAll('.rating-star').forEach(star => { star.addEventListener('click', () => { this.data.rating = parseInt(star.dataset.rating); document.querySelectorAll('.rating-star').forEach((s, i) => { s.querySelector('i').className = i < this.data.rating ? 'fas fa-star' : 'far fa-star'; }); document.getElementById('ratingLabel').textContent = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][this.data.rating]; }); }); },
    initCharCount() { const ta = document.getElementById('reviewText'), cnt = document.getElementById('charCount'); if (ta && cnt) ta.addEventListener('input', () => { cnt.textContent = ta.value.length; }); },
    nextStep() { if (!this.validateStep()) return; this.saveStepData(); this.currentStep++; if (this.currentStep === 5) this.showPreview(); this.updateUI(); },
    prevStep() { this.currentStep--; this.updateUI(); },
    validateStep() { switch (this.currentStep) { case 1: return document.getElementById('reviewerName').value.trim().length >= 2; case 2: return document.getElementById('projectName').value.trim().length >= 2; case 3: return this.data.rating > 0; case 4: return document.getElementById('reviewText').value.trim().length >= 10; default: return true; } },
    saveStepData() { switch (this.currentStep) { case 1: this.data.name = Security.sanitizeInput(document.getElementById('reviewerName').value); break; case 2: this.data.project = Security.sanitizeInput(document.getElementById('projectName').value); break; case 4: this.data.text = Security.sanitizeInput(document.getElementById('reviewText').value); break; } },
    showPreview() { const p = document.getElementById('reviewPreview'); if (p) p.innerHTML = `<div class="preview-header"><strong>${Security.escapeHtml(this.data.name)}</strong> • ${Security.escapeHtml(this.data.project)}</div><div class="preview-rating">${'<i class="fas fa-star"></i>'.repeat(this.data.rating)}</div><p>"${Security.escapeHtml(this.data.text)}"</p>`; },
    updateUI() { document.querySelectorAll('.journey-step').forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === this.currentStep)); document.querySelectorAll('.progress-step').forEach(s => { const n = parseInt(s.dataset.step); s.classList.toggle('active', n === this.currentStep); s.classList.toggle('completed', n < this.currentStep); }); },
    submit() { const newReview = { ...this.data, date: new Date().toISOString().slice(0, 7), verified: false }; const saved = JSON.parse(localStorage.getItem('userReviews') || '[]'); saved.push(newReview); localStorage.setItem('userReviews', JSON.stringify(saved)); reviewsData.push(newReview); this.currentStep = 6; this.updateUI(); }
};

// ═══════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════

const Router = {
    currentPage: 'home',
    init() {
        const hash = window.location.hash.slice(1) || 'home';
        this.navigate(hash, false);
        window.addEventListener('hashchange', () => this.navigate(window.location.hash.slice(1) || 'home', false));
        document.addEventListener('click', e => { const link = e.target.closest('[data-page]'); if (link) { e.preventDefault(); this.navigate(link.dataset.page); } });
    },
    navigate(page, updateHash = true) {
        if (!Templates[page]) page = 'home';
        this.currentPage = page;
        if (updateHash) window.location.hash = page;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
        const main = document.getElementById('mainContent');
        if (main) { main.style.opacity = '0'; setTimeout(() => { main.innerHTML = Templates[page](); main.style.opacity = '1'; this.initPageFeatures(page); i18n.translatePage(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 150); }
    },
    initPageFeatures(page) { switch (page) { case 'games': GamesManager.init(); break; case 'reviews': ReviewsManager.init(); break; case 'submit-review': ReviewForm.init(); break; } }
};

// ═══════════════════════════════════════════════════════════════
// حذف كائن MusicPlayer بالكامل
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS (Animations, Quality)
// ═══════════════════════════════════════════════════════════════

const SiteSettings = {
    storageKey: 'yd_site_settings',
    init() {
        const prefs = this.getPrefs();
        if (prefs.animationsDisabled) {
            document.body.classList.add('no-animations');
        }
        if (prefs.highQuality) {
            document.body.classList.add('high-quality');
        }
        const animToggle = document.getElementById('animationsToggle');
        const qualityToggle = document.getElementById('qualityToggle');
        if (animToggle) animToggle.checked = !prefs.animationsDisabled;
        if (qualityToggle) qualityToggle.checked = prefs.highQuality;
    },
    getPrefs() {
        try {
            const s = localStorage.getItem(this.storageKey);
            if (s) return JSON.parse(s);
        } catch (e) { }
        return { animationsDisabled: false, highQuality: false };
    },
    savePrefs(p) {
        try {
            const c = this.getPrefs();
            localStorage.setItem(this.storageKey, JSON.stringify({ ...c, ...p }));
        } catch (e) { }
    },
    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
            this.savePrefs({ animationsDisabled: false });
        } else {
            document.body.classList.add('no-animations');
            this.savePrefs({ animationsDisabled: true });
        }
    },
    toggleQuality(high) {
        if (high) {
            document.body.classList.add('high-quality');
            this.savePrefs({ highQuality: true });
        } else {
            document.body.classList.remove('high-quality');
            this.savePrefs({ highQuality: false });
        }
    }
};

// ═══════════════════════════════════════════════════════════════
// GALAXY BACKGROUND
// ═══════════════════════════════════════════════════════════════

const GalaxyBackground = {
    init() { this.createShootingStars(); this.createFloatingParticles(); },
    createShootingStars() { const c = document.getElementById('shootingStars'); if (!c) return; setInterval(() => { const s = document.createElement('div'); s.className = 'shooting-star'; s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 50 + '%'; s.style.animationDuration = (2 + Math.random() * 2) + 's'; c.appendChild(s); setTimeout(() => s.remove(), 4000); }, 3000); },
    createFloatingParticles() { const c = document.querySelector('.galaxy-bg'); if (!c) return; for (let i = 0; i < 30; i++) { const p = document.createElement('div'); p.className = 'floating-particle'; p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 100 + '%'; p.style.animationDelay = Math.random() * 10 + 's'; p.style.animationDuration = (15 + Math.random() * 20) + 's'; c.appendChild(p); } }
};

// ═══════════════════════════════════════════════════════════════
// MOBILE & LANGUAGE
// ═══════════════════════════════════════════════════════════════

const MobileMenu = {
    init() { const t = document.querySelector('.mobile-menu-toggle'), o = document.querySelector('.mobile-overlay'); if (t) t.addEventListener('click', () => this.toggle()); if (o) o.addEventListener('click', () => this.close()); document.querySelectorAll('.mobile-menu [data-page]').forEach(l => l.addEventListener('click', () => this.close())); },
    toggle() { document.body.classList.toggle('mobile-menu-open'); },
    close() { document.body.classList.remove('mobile-menu-open'); }
};

const LanguageSwitcher = {
    init() { document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => { btn.addEventListener('click', () => { i18n.setLanguage(btn.dataset.lang); Router.navigate(Router.currentPage, false); }); }); }
};

// ═══════════════════════════════════════════════════════════════
// SETTINGS MODAL (بدون موسيقى)
// ═══════════════════════════════════════════════════════════════

const SettingsModal = {
    open() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    close() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    init() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.close();
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }
};

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION (بدون MusicPlayer)
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
    TimeDisplay.init();
    Router.init();
    MobileMenu.init();
    LanguageSwitcher.init();
    SettingsModal.init();
    SiteSettings.init();
    GalaxyBackground.init();

    // Quick loader (500ms)
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.style.display = 'none', 300); }
        setTimeout(() => WelcomeFrame.init(), 300);
    }, 500);
});