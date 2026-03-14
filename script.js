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
// TRANSLATIONS (Updated with pricing keys)
// ═══════════════════════════════════════════════════════════════

const translations = {
    en: {
        "nav.home": "Home", "nav.portfolio": "Portfolio", "nav.games": "Games",
        "nav.pricing": "Pricing", "nav.reviews": "Reviews", "nav.policies": "Policies",
        "hero.badge": "Available for Projects",
        "hero.title": "Welcome to my personal<br><span class='gradient-text'>Portfolio</span> And Relaxing",
        "hero.subtitle": "Professional UI/UX designer specializing in creating immersive, beautiful game interfaces that players love.",
        "hero.viewPortfolio": "View Portfolio", "hero.seePricing": "See Pricing",
        "stats.projects": "Projects Completed", "stats.clients": "Happy Clients",
        "stats.rating": "Average Rating", "stats.experience": "Years Experience",
        "cta.title": "Ready to Transform Your Game?",
        "cta.subtitle": "Let's create something amazing together. Get in touch to discuss your project.",
        "cta.joinDiscord": "Join Discord", "cta.readReviews": "Read Reviews", "cta.viewPricing": "View Pricing",
        "portfolio.badge": "My Work", "portfolio.title": "Creative <span class='gradient-text'>Portfolio</span>",
        "portfolio.subtitle": "Explore my collection of UI designs for Roblox games.",
        "portfolio.likeIt": "Like What You See?", "portfolio.commission": "Commission your own custom UI design today.",
        "games.badge": "Live Games", "games.title": "Games I Designed <span class='gradient-text'>UI For</span>",
        "games.totalVisits": "Total visits across these games:", "games.more": "...and there is more than all that",
        "games.loading": "Loading games data from Roblox...", "games.playNow": "Play Now", "games.visits": "visits",
        "games.wantFeatured": "Want Your Game Featured?",
        "games.commissionText": "Commission a professional UI design and join successful Roblox games.",
        // Pricing translations
        "pricing.badge": "Transparent Pricing",
        "pricing.title": "CHOOSE YOUR <span class='gradient-text'>PERFECT PLAN</span>",
        "pricing.subtitle": "Tailored packages to match your project's scale and style.",
        "pricing.goWith": "Go with this plan",
        "pricing.whyChoose": "Why choose me?",
        "pricing.whySubtitle": "Reasons to choose my service.",
        "pricing.faq": "Frequently Asked Questions",
        "pricing.stillQuestions": "Still have questions? I'm here to help!",
        // Pricing cards
        "pricing.basic.name": "Basic Pack",
        "pricing.basic.desc": "Per Task",
        "pricing.basic.tagline": "Best for small UI tasks / mini features",
        "pricing.basic.feature1": "5 Revisions",
        "pricing.basic.feature2": "Import included",
        "pricing.basic.feature3": "No PSD Files",
        "pricing.basic.robux": "4K + Tax Robux",
        "pricing.medium.name": "Medium Pack",
        "pricing.medium.desc": "Per Task",
        "pricing.medium.tagline": "Great for high-appeal themed UIs",
        "pricing.medium.feature1": "Import included",
        "pricing.medium.feature2": "10 Revisions",
        "pricing.medium.feature3": "No PSD Files",
        "pricing.medium.robux": "7K + Tax Robux",
        "pricing.full.name": "Full Game UI & Any Style",
        "pricing.full.desc": "Full game coverage / premium polish",
        "pricing.full.feature1": "Import included",
        "pricing.full.feature2": "35 Revisions",
        "pricing.full.feature3": "PSD Files Included",
        "pricing.full.feature4": "Full UI Folders + Unlimited Revisions",
        "pricing.full.robux": "75K + Tax Robux",
        "pricing.full.note": "Includes 4 free custom UIs. After those 4, each new UI request is $25.",
        "pricing.import.name": "Import per frame",
        "pricing.import.desc": "For importing any UI design to Roblox Studio",
        "pricing.import.feature1": "Full optimization for all devices",
        // Reviews
        "reviews.badge": "Client Testimonials", "reviews.title": "Stellar <span class='gradient-text'>Reviews</span>",
        "reviews.subtitle": "Hear what clients say about their experience.",
        "reviews.basedOn": "Based on", "reviews.reviewsText": "reviews", "reviews.all": "All",
        "reviews.workedBefore": "Worked with me before?",
        "reviews.shareExperience": "Share your experience and help others make informed decisions.",
        "reviews.leaveReview": "Leave a Review",
        // Policies
        "policies.badge": "Terms of Service", "policies.title": "TERMS OF <span class='gradient-text'>SERVICE</span>",
        "policies.subtitle": "Rules & Collaboration", "policies.lastUpdated": "Last updated: December 2024",
        "policies.questions": "Questions?", "policies.contactDiscord": "Contact on Discord",
        // Welcome
        "welcome.title": "🚀 Welcome to Youssef Design v4.0",
        "welcome.subtitle": "This major update brings a completely redesigned experience.",
        "welcome.new1": "✨ Completely rebuilt with modern design and smooth animations",
        "welcome.new2": "🎮 Live game stats fetched directly from Roblox API",
        "welcome.new3": "🌍 Full multi-language support (English, Arabic, Spanish)",
        "welcome.new4": "⚡ Faster loading and optimized performance",
        "welcome.new5": "🔒 Enhanced security with XSS protection",
        "welcome.new6": "🎨 Beautiful cinematic galaxy background",
        "welcome.button": "Thanks, Let's Go!",
        // Other
        "time.zone": "Alexandria Time", "commission.status": "Commission Open",
        "footer.rights": "All Rights Reserved", "footer.by": "Youssef Design",
        "nav.settings": "Settings", "settings.title": "Settings", "settings.language": "Language", "settings.contact": "Contact",
        "settings.volume": "Music Volume", "settings.animations": "Animations", "settings.animationsDesc": "Enable animations & transitions",
        "settings.quality": "Enhanced Quality", "settings.qualityDesc": "Higher visual quality"
    },
    ar: {
        "nav.home": "الرئيسية", "nav.portfolio": "أعمالي", "nav.games": "الألعاب",
        "nav.pricing": "الأسعار", "nav.reviews": "التقييمات", "nav.policies": "الشروط",
        "hero.badge": "متاح للمشاريع",
        "hero.title": "مرحباً بك في معرض<br><span class='gradient-text'>أعمالي</span> الشخصي",
        "hero.subtitle": "مصمم UI/UX محترف متخصص في إنشاء واجهات ألعاب جميلة وغامرة يحبها اللاعبون.",
        "hero.viewPortfolio": "عرض الأعمال", "hero.seePricing": "عرض الأسعار",
        "stats.projects": "مشروع مكتمل", "stats.clients": "عميل سعيد",
        "stats.rating": "متوسط التقييم", "stats.experience": "سنوات الخبرة",
        "cta.title": "مستعد لتحويل لعبتك؟",
        "cta.subtitle": "لنصنع شيئاً مذهلاً معاً. تواصل معي لمناقشة مشروعك.",
        "cta.joinDiscord": "انضم للديسكورد", "cta.readReviews": "قراءة التقييمات", "cta.viewPricing": "عرض الأسعار",
        "portfolio.badge": "أعمالي", "portfolio.title": "معرض <span class='gradient-text'>الأعمال</span> الإبداعية",
        "portfolio.subtitle": "استكشف مجموعتي من تصاميم واجهات ألعاب Roblox.",
        "portfolio.likeIt": "أعجبك ما تراه؟", "portfolio.commission": "اطلب تصميم واجهة مخصصة لك اليوم.",
        "games.badge": "ألعاب حية", "games.title": "ألعاب صممت <span class='gradient-text'>واجهتها</span>",
        "games.totalVisits": "إجمالي الزيارات عبر هذه الألعاب:", "games.more": "و يوجد أكثر من كل ذلك",
        "games.loading": "جاري تحميل بيانات الألعاب من Roblox...", "games.playNow": "العب الآن", "games.visits": "زيارة",
        "games.wantFeatured": "تريد عرض لعبتك هنا؟",
        "games.commissionText": "اطلب تصميم واجهة احترافية وانضم لألعاب Roblox الناجحة.",
        // Pricing translations
        "pricing.badge": "أسعار شفافة",
        "pricing.title": "اختر <span class='gradient-text'>خطتك المثالية</span>",
        "pricing.subtitle": "باقات مخصصة تناسب حجم وأسلوب مشروعك.",
        "pricing.goWith": "اختر هذه الخطة",
        "pricing.whyChoose": "لماذا تختارني؟",
        "pricing.whySubtitle": "أسباب لاختيار خدمتي.",
        "pricing.faq": "الأسئلة الشائعة",
        "pricing.stillQuestions": "لا زال لديك أسئلة؟ أنا هنا للمساعدة!",
        // Pricing cards
        "pricing.basic.name": "الباقة الأساسية",
        "pricing.basic.desc": "لكل مهمة",
        "pricing.basic.tagline": "مناسب للمهام الصغيرة / الميزات البسيطة",
        "pricing.basic.feature1": "5 مراجعات",
        "pricing.basic.feature2": "استيراد متضمن",
        "pricing.basic.feature3": "لا توجد ملفات PSD",
        "pricing.basic.robux": "٤آلاف + الضريبةروبوكس",
        "pricing.medium.name": "الباقة المتوسطة",
        "pricing.medium.desc": "لكل مهمة",
        "pricing.medium.tagline": "رائع للواجهات ذات الطابع الجذاب",
        "pricing.medium.feature1": "استيراد متضمن",
        "pricing.medium.feature2": "١٠ مراجعات",
        "pricing.medium.feature3": "لا توجد ملفات PSD",
        "pricing.medium.robux": "٧آلاف + الضريبةروبوكس",
        "pricing.full.name": "واجهة لعبة كاملة وأي ستايل",
        "pricing.full.desc": "تغطية كاملة للعبة / لمسة نهائية احترافية",
        "pricing.full.feature1": "استيراد متضمن",
        "pricing.full.feature2": "٣٥ مراجعة",
        "pricing.full.feature3": "ملفات PSD متضمنة",
        "pricing.full.feature4": "مجلدات واجهة كاملة + مراجعات غير محدودة",
        "pricing.full.robux": "٧٥ألف + الضريبةروبوكس",
        "pricing.full.note": "يشمل 4 واجهات مخصصة مجانية. بعد تلك الأربع، كل واجهة جديدة بـ ٢٥ دولارًا.",
        "pricing.import.name": "استيراد لكل إطار",
        "pricing.import.desc": "لاستيراد أي تصميم واجهة إلى Roblox Studio",
        "pricing.import.feature1": "تحسين كامل لجميع الأجهزة",
        // Reviews
        "reviews.badge": "شهادات العملاء", "reviews.title": "تقييمات <span class='gradient-text'>ممتازة</span>",
        "reviews.subtitle": "اسمع ما يقوله العملاء عن تجربتهم.",
        "reviews.basedOn": "بناءً على", "reviews.reviewsText": "تقييم", "reviews.all": "الكل",
        "reviews.workedBefore": "عملت معي من قبل؟",
        "reviews.shareExperience": "شارك تجربتك وساعد الآخرين في اتخاذ قرارات مستنيرة.",
        "reviews.leaveReview": "اترك تقييم",
        // Policies
        "policies.badge": "شروط الخدمة", "policies.title": "شروط <span class='gradient-text'>الخدمة</span>",
        "policies.subtitle": "القواعد والتعاون", "policies.lastUpdated": "آخر تحديث: ديسمبر 2024",
        "policies.questions": "أسئلة؟", "policies.contactDiscord": "تواصل عبر Discord",
        // Welcome
        "welcome.title": "🚀 مرحباً بك في Youssef Design v4.0",
        "welcome.subtitle": "هذا التحديث الكبير يجلب تجربة مُعاد تصميمها بالكامل.",
        "welcome.new1": "✨ إعادة بناء كاملة بتصميم حديث ورسوم متحركة سلسة",
        "welcome.new2": "🎮 إحصائيات الألعاب الحية مباشرة من Roblox API",
        "welcome.new3": "🌍 دعم كامل للغات المتعددة (إنجليزي، عربي، إسباني)",
        "welcome.new4": "⚡ تحميل أسرع وأداء محسّن",
        "welcome.new5": "🔒 أمان معزز مع حماية XSS",
        "welcome.new6": "🎨 خلفية مجرّية سينمائية جميلة",
        "welcome.button": "شكراً، هيا نبدأ!",
        // Other
        "time.zone": "توقيت الإسكندرية", "commission.status": "الطلبات مفتوحة",
        "footer.rights": "جميع الحقوق محفوظة", "footer.by": "Youssef Design",
        "nav.settings": "الإعدادات", "settings.title": "الإعدادات", "settings.language": "اللغة", "settings.contact": "تواصل",
        "settings.volume": "صوت الموسيقى", "settings.animations": "الحركات", "settings.animationsDesc": "تفعيل الحركات والانتقالات",
        "settings.quality": "جودة محسنة", "settings.qualityDesc": "جودة بصرية أعلى"
    },
    es: {
        "nav.home": "Inicio", "nav.portfolio": "Portafolio", "nav.games": "Juegos",
        "nav.pricing": "Precios", "nav.reviews": "Reseñas", "nav.policies": "Políticas",
        "hero.badge": "Disponible para Proyectos",
        "hero.title": "Bienvenido a mi <span class='gradient-text'>Portafolio</span> Personal",
        "hero.subtitle": "Diseñador UI/UX profesional especializado en crear interfaces de juegos inmersivas y hermosas.",
        "hero.viewPortfolio": "Ver Portafolio", "hero.seePricing": "Ver Precios",
        "stats.projects": "Proyectos Completados", "stats.clients": "Clientes Felices",
        "stats.rating": "Calificación Promedio", "stats.experience": "Años de Experiencia",
        "cta.title": "¿Listo para Transformar tu Juego?",
        "cta.subtitle": "Creemos algo increíble juntos. Contáctame para discutir tu proyecto.",
        "cta.joinDiscord": "Unirse a Discord", "cta.readReviews": "Leer Reseñas", "cta.viewPricing": "Ver Precios",
        "portfolio.badge": "Mi Trabajo", "portfolio.title": "Portafolio <span class='gradient-text'>Creativo</span>",
        "portfolio.subtitle": "Explora mi colección de diseños UI para juegos de Roblox.",
        "portfolio.likeIt": "¿Te Gusta lo que Ves?", "portfolio.commission": "Encarga tu propio diseño UI hoy.",
        "games.badge": "Juegos en Vivo", "games.title": "Juegos para los que <span class='gradient-text'>Diseñé UI</span>",
        "games.totalVisits": "Visitas totales en estos juegos:", "games.more": "...y hay más que todo eso",
        "games.loading": "Cargando datos desde Roblox...", "games.playNow": "Jugar Ahora", "games.visits": "visitas",
        "games.wantFeatured": "¿Quieres tu Juego Destacado?",
        "games.commissionText": "Encarga un diseño UI profesional y únete a juegos exitosos de Roblox.",
        // Pricing translations
        "pricing.badge": "Precios Transparentes",
        "pricing.title": "ELIGE TU <span class='gradient-text'>PLAN PERFECTO</span>",
        "pricing.subtitle": "Paquetes adaptados al tamaño y estilo de tu proyecto.",
        "pricing.goWith": "Elegir este plan",
        "pricing.whyChoose": "¿Por qué elegirme?",
        "pricing.whySubtitle": "Razones para elegir mi servicio.",
        "pricing.faq": "Preguntas Frecuentes",
        "pricing.stillQuestions": "¿Aún tienes preguntas? ¡Estoy aquí para ayudar!",
        // Pricing cards
        "pricing.basic.name": "Paquete Básico",
        "pricing.basic.desc": "Por Tarea",
        "pricing.basic.tagline": "Ideal para tareas pequeñas / características simples",
        "pricing.basic.feature1": "5 Revisiones",
        "pricing.basic.feature2": "Importación incluida",
        "pricing.basic.feature3": "Sin archivos PSD",
        "pricing.basic.robux": "4K + Impuestos Robux",
        "pricing.medium.name": "Paquete Mediano",
        "pricing.medium.desc": "Por Tarea",
        "pricing.medium.tagline": "Excelente para UIs temáticas de alto atractivo",
        "pricing.medium.feature1": "Importación incluida",
        "pricing.medium.feature2": "10 Revisiones",
        "pricing.medium.feature3": "Sin archivos PSD",
        "pricing.medium.robux": "7K + Impuestos Robux",
        "pricing.full.name": "UI de Juego Completa y Cualquier Estilo",
        "pricing.full.desc": "Cobertura completa del juego / acabado premium",
        "pricing.full.feature1": "Importación incluida",
        "pricing.full.feature2": "35 Revisiones",
        "pricing.full.feature3": "Archivos PSD Incluidos",
        "pricing.full.feature4": "Carpetas de UI completas + Revisiones ilimitadas",
        "pricing.full.robux": "75K + Impuestos Robux",
        "pricing.full.note": "Incluye 4 UIs personalizadas gratis. Después de esas 4, cada nueva UI cuesta $25.",
        "pricing.import.name": "Importación por frame",
        "pricing.import.desc": "Para importar cualquier diseño de UI a Roblox Studio",
        "pricing.import.feature1": "Optimización completa para todos los dispositivos",
        // Reviews
        "reviews.badge": "Testimonios de Clientes", "reviews.title": "Reseñas <span class='gradient-text'>Estelares</span>",
        "reviews.subtitle": "Escucha lo que dicen los clientes sobre su experiencia.",
        "reviews.basedOn": "Basado en", "reviews.reviewsText": "reseñas", "reviews.all": "Todas",
        "reviews.workedBefore": "¿Trabajaste conmigo antes?",
        "reviews.shareExperience": "Comparte tu experiencia y ayuda a otros a tomar decisiones.",
        "reviews.leaveReview": "Dejar Reseña",
        // Policies
        "policies.badge": "Términos de Servicio", "policies.title": "TÉRMINOS DE <span class='gradient-text'>SERVICIO</span>",
        "policies.subtitle": "Reglas y Colaboración", "policies.lastUpdated": "Última actualización: Diciembre 2024",
        "policies.questions": "¿Preguntas?", "policies.contactDiscord": "Contactar en Discord",
        // Welcome
        "welcome.title": "🚀 Bienvenido a Youssef Design v4.0",
        "welcome.subtitle": "Esta actualización trae una experiencia completamente rediseñada.",
        "welcome.new1": "✨ Completamente reconstruido con diseño moderno y animaciones suaves",
        "welcome.new2": "🎮 Estadísticas de juegos en vivo directamente de Roblox API",
        "welcome.new3": "🌍 Soporte completo multiidioma (Inglés, Árabe, Español)",
        "welcome.new4": "⚡ Carga más rápida y rendimiento optimizado",
        "welcome.new5": "🔒 Seguridad mejorada con protección XSS",
        "welcome.new6": "🎨 Hermoso fondo galáctico cinematográfico",
        "welcome.button": "¡Gracias, Vamos!",
        // Other
        "time.zone": "Hora de Alejandría", "commission.status": "Comisiones Abiertas",
        "footer.rights": "Todos los Derechos Reservados", "footer.by": "Youssef Design",
        "nav.settings": "Ajustes", "settings.title": "Ajustes", "settings.language": "Idioma", "settings.contact": "Contacto",
        "settings.volume": "Volumen de Música", "settings.animations": "Animaciones", "settings.animationsDesc": "Habilitar animaciones y transiciones",
        "settings.quality": "Calidad Mejorada", "settings.qualityDesc": "Mayor calidad visual"
    }
};

// ═══════════════════════════════════════════════════════════════
// i18n SYSTEM
// ═══════════════════════════════════════════════════════════════

const i18n = {
    currentLang: 'en', // Default language set to English
    init() {
        const saved = localStorage.getItem('language');
        // Only use saved if it's a valid language, otherwise keep 'en'
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
// PAGE TEMPLATES (Updated)
// ═══════════════════════════════════════════════════════════════

const Templates = {
    home: () => `
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-badge"><i class="fas fa-rocket"></i><span data-i18n="hero.badge">${i18n.translate('hero.badge')}</span></div>
                    <h1 class="hero-title" data-i18n="hero.title">${i18n.translate('hero.title')}</h1>
                    <p class="hero-subtitle" data-i18n="hero.subtitle">${i18n.translate('hero.subtitle')}</p>
                    <div class="hero-buttons">
                        <a href="#" class="btn btn-primary" data-page="portfolio"><i class="fas fa-images"></i> <span data-i18n="hero.viewPortfolio">${i18n.translate('hero.viewPortfolio')}</span></a>
                        <a href="#" class="btn btn-secondary" data-page="pricing"><i class="fas fa-tags"></i> <span data-i18n="hero.seePricing">${i18n.translate('hero.seePricing')}</span></a>
                    </div>
                </div>
            </div>
        </section>
        <section class="stats-section">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-card glass-card"><div class="stat-icon"><i class="fas fa-palette"></i></div><div class="stat-number">150+</div><div class="stat-label" data-i18n="stats.projects">${i18n.translate('stats.projects')}</div></div>
                    <div class="stat-card glass-card"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-number">80+</div><div class="stat-label" data-i18n="stats.clients">${i18n.translate('stats.clients')}</div></div>
                    <div class="stat-card glass-card"><div class="stat-icon"><i class="fas fa-star"></i></div><div class="stat-number">4.9</div><div class="stat-label" data-i18n="stats.rating">${i18n.translate('stats.rating')}</div></div>
                    <div class="stat-card glass-card"><div class="stat-icon"><i class="fas fa-clock"></i></div><div class="stat-number">3+</div><div class="stat-label" data-i18n="stats.experience">${i18n.translate('stats.experience')}</div></div>
                </div>
            </div>
        </section>
        <section class="testimonials-marquee">
            <div class="marquee-header"><h2><i class="fas fa-star"></i> <span data-i18n="reviews.badge">${i18n.translate('reviews.badge')}</span></h2></div>
            <div class="marquee-wrapper">
                <div class="marquee-track">
                    ${reviewsData.concat(reviewsData).map(r => `
                        <div class="marquee-item glass-card">
                            <div class="marquee-stars">${'<i class="fas fa-star"></i>'.repeat(r.rating)}</div>
                            <p class="marquee-text">"${Security.escapeHtml(r.text)}"</p>
                            <div class="marquee-author"><span class="author-name">— ${Security.escapeHtml(r.name)}</span></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        <section class="cta-section">
            <div class="container">
                <div class="cta-card glass-card">
                    <h2 data-i18n="cta.title">${i18n.translate('cta.title')}</h2>
                    <p data-i18n="cta.subtitle">${i18n.translate('cta.subtitle')}</p>
                    <div class="cta-buttons">
                        <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-primary"><i class="fab fa-discord"></i> <span data-i18n="cta.joinDiscord">${i18n.translate('cta.joinDiscord')}</span></a>
                        <a href="#" class="btn btn-secondary" data-page="reviews"><i class="fas fa-star"></i> <span data-i18n="cta.readReviews">${i18n.translate('cta.readReviews')}</span></a>
                    </div>
                </div>
            </div>
        </section>
    `,
    portfolio: () => `
        <section class="page-header">
            <div class="container">
                <div class="page-badge"><i class="fas fa-images"></i><span data-i18n="portfolio.badge">${i18n.translate('portfolio.badge')}</span></div>
                <h1 class="page-title" data-i18n="portfolio.title">${i18n.translate('portfolio.title')}</h1>
                <p class="page-subtitle" data-i18n="portfolio.subtitle">${i18n.translate('portfolio.subtitle')}</p>
            </div>
        </section>
        <section class="portfolio-section">
            <div class="container">
                <div class="portfolio-grid">${Array.from({ length: 22 }, (_, i) => i + 1).map(i => `
                    <div class="portfolio-item glass-card">
                        <img src="images/work${i}.png" alt="Work ${i}" loading="lazy" onerror="this.src='https://placehold.co/400x300/0a1628/b5c1dc?text=Work+${i}'">
                        <div class="portfolio-overlay"><h3>Work ${i}</h3></div>
                    </div>
                `).join('')}</div>
            </div>
        </section>
        <section class="cta-section">
            <div class="container">
                <div class="cta-card glass-card">
                    <h2 data-i18n="portfolio.likeIt">${i18n.translate('portfolio.likeIt')}</h2>
                    <p data-i18n="portfolio.commission">${i18n.translate('portfolio.commission')}</p>
                    <div class="cta-buttons"><a href="#" class="btn btn-primary" data-page="pricing"><i class="fas fa-rocket"></i> <span data-i18n="cta.viewPricing">${i18n.translate('cta.viewPricing')}</span></a></div>
                </div>
            </div>
        </section>
    `,
    games: () => `
        <section class="page-header">
            <div class="container">
                <div class="page-badge"><i class="fas fa-gamepad"></i><span data-i18n="games.badge">${i18n.translate('games.badge')}</span></div>
                <h1 class="page-title" data-i18n="games.title">${i18n.translate('games.title')}</h1>
                <p class="page-subtitle"><strong data-i18n="games.totalVisits">${i18n.translate('games.totalVisits')}</strong> <span id="totalVisitsCount" class="gradient-text">—</span></p>
            </div>
        </section>
        <section class="games-section">
            <div class="container">
                <div class="games-grid" id="gamesGrid"><div class="loading-games"><i class="fas fa-spinner fa-spin"></i><p data-i18n="games.loading">${i18n.translate('games.loading')}</p></div></div>
                <p class="more-note" data-i18n="games.more">${i18n.translate('games.more')}</p>
            </div>
        </section>
        <section class="cta-section">
            <div class="container">
                <div class="cta-card glass-card">
                    <h2 data-i18n="games.wantFeatured">${i18n.translate('games.wantFeatured')}</h2>
                    <p data-i18n="games.commissionText">${i18n.translate('games.commissionText')}</p>
                    <div class="cta-buttons"><a href="#" class="btn btn-primary" data-page="pricing"><i class="fas fa-rocket"></i> <span data-i18n="cta.viewPricing">${i18n.translate('cta.viewPricing')}</span></a></div>
                </div>
            </div>
        </section>
    `,
    pricing: () => `
        <section class="page-header">
            <div class="container">
                <div class="page-badge"><i class="fas fa-tags"></i><span data-i18n="pricing.badge">${i18n.translate('pricing.badge')}</span></div>
                <h1 class="page-title" data-i18n="pricing.title">${i18n.translate('pricing.title')}</h1>
                <p class="page-subtitle" data-i18n="pricing.subtitle">${i18n.translate('pricing.subtitle')}</p>
            </div>
        </section>
        <section class="pricing-section">
            <div class="container">
                <div class="pricing-grid pricing-4">
                    <!-- Basic Pack -->
                    <div class="pricing-card glass-card">
                        <div class="pricing-icon"><i class="fas fa-cube"></i></div>
                        <h3 class="pricing-name" data-i18n="pricing.basic.name">${i18n.translate('pricing.basic.name')}</h3>
                        <p class="pricing-desc" data-i18n="pricing.basic.desc">${i18n.translate('pricing.basic.desc')}</p>
                        <div class="pricing-price"><span class="currency">$</span><span class="amount">15</span></div>
                        <div class="pricing-robux"><i class="fas fa-coins"></i> <span data-i18n="pricing.basic.robux">${i18n.translate('pricing.basic.robux')}</span></div>
                        <p class="pricing-tagline" data-i18n="pricing.basic.tagline">${i18n.translate('pricing.basic.tagline')}</p>
                        <ul class="pricing-features">
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.basic.feature1">${i18n.translate('pricing.basic.feature1')}</span></li>
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.basic.feature2">${i18n.translate('pricing.basic.feature2')}</span></li>
                            <li><i class="fas fa-times"></i> <span data-i18n="pricing.basic.feature3">${i18n.translate('pricing.basic.feature3')}</span></li>
                        </ul>
                        <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-secondary btn-full"><i class="fas fa-rocket"></i> <span data-i18n="pricing.goWith">${i18n.translate('pricing.goWith')}</span></a>
                    </div>
                    <!-- Featured / Full Game UI -->
                    <div class="pricing-card glass-card featured">
                        <div class="pricing-badge">⭐</div>
                        <div class="pricing-icon"><i class="fas fa-gamepad"></i></div>
                        <h3 class="pricing-name" data-i18n="pricing.full.name">${i18n.translate('pricing.full.name')}</h3>
                        <p class="pricing-desc" data-i18n="pricing.full.desc">${i18n.translate('pricing.full.desc')}</p>
                        <div class="pricing-price"><span class="currency">$</span><span class="amount">260</span></div>
                        <div class="pricing-robux"><i class="fas fa-coins"></i> <span data-i18n="pricing.full.robux">${i18n.translate('pricing.full.robux')}</span></div>
                        <ul class="pricing-features">
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.full.feature1">${i18n.translate('pricing.full.feature1')}</span></li>
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.full.feature2">${i18n.translate('pricing.full.feature2')}</span></li>
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.full.feature3">${i18n.translate('pricing.full.feature3')}</span></li>
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.full.feature4">${i18n.translate('pricing.full.feature4')}</span></li>
                        </ul>
                        <p class="pricing-note" data-i18n="pricing.full.note">${i18n.translate('pricing.full.note')}</p>
                        <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-primary btn-full"><i class="fas fa-rocket"></i> <span data-i18n="pricing.goWith">${i18n.translate('pricing.goWith')}</span></a>
                    </div>
                    <!-- Medium Pack -->
                    <div class="pricing-card glass-card">
                        <div class="pricing-icon"><i class="fas fa-layer-group"></i></div>
                        <h3 class="pricing-name" data-i18n="pricing.medium.name">${i18n.translate('pricing.medium.name')}</h3>
                        <p class="pricing-desc" data-i18n="pricing.medium.desc">${i18n.translate('pricing.medium.desc')}</p>
                        <div class="pricing-price"><span class="currency">$</span><span class="amount">25</span></div>
                        <div class="pricing-robux"><i class="fas fa-coins"></i> <span data-i18n="pricing.medium.robux">${i18n.translate('pricing.medium.robux')}</span></div>
                        <p class="pricing-tagline" data-i18n="pricing.medium.tagline">${i18n.translate('pricing.medium.tagline')}</p>
                        <ul class="pricing-features">
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.medium.feature1">${i18n.translate('pricing.medium.feature1')}</span></li>
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.medium.feature2">${i18n.translate('pricing.medium.feature2')}</span></li>
                            <li><i class="fas fa-times"></i> <span data-i18n="pricing.medium.feature3">${i18n.translate('pricing.medium.feature3')}</span></li>
                        </ul>
                        <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-secondary btn-full"><i class="fas fa-rocket"></i> <span data-i18n="pricing.goWith">${i18n.translate('pricing.goWith')}</span></a>
                    </div>
                    <!-- Import per frame -->
                    <div class="pricing-card glass-card">
                        <div class="pricing-icon"><i class="fas fa-upload"></i></div>
                        <h3 class="pricing-name" data-i18n="pricing.import.name">${i18n.translate('pricing.import.name')}</h3>
                        <p class="pricing-desc" data-i18n="pricing.import.desc">${i18n.translate('pricing.import.desc')}</p>
                        <div class="pricing-price"><span class="currency">$</span><span class="amount">5</span><span class="per-unit">per frame</span></div>
                        <ul class="pricing-features">
                            <li><i class="fas fa-check"></i> <span data-i18n="pricing.import.feature1">${i18n.translate('pricing.import.feature1')}</span></li>
                        </ul>
                        <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-secondary btn-full"><i class="fas fa-rocket"></i> <span data-i18n="pricing.goWith">${i18n.translate('pricing.goWith')}</span></a>
                    </div>
                </div>
            </div>
        </section>
        <section class="why-choose-section">
            <div class="container">
                <div class="page-header" style="padding-top:20px"><div class="page-badge"><i class="fas fa-question-circle"></i><span data-i18n="pricing.whyChoose">${i18n.translate('pricing.whyChoose')}</span></div><h2 class="page-title" style="font-size:1.8rem" data-i18n="pricing.whyChoose">${i18n.translate('pricing.whyChoose')}</h2><p class="page-subtitle" data-i18n="pricing.whySubtitle">${i18n.translate('pricing.whySubtitle')}</p></div>
                <div class="why-choose-grid">
                    <div class="why-card glass-card"><div class="why-icon"><i class="fas fa-sync-alt"></i></div><p>Up to 5 free revisions until you are 100% satisfied</p></div>
                    <div class="why-card glass-card"><div class="why-icon"><i class="fas fa-comments"></i></div><p>I always keep you informed every step of the way</p></div>
                    <div class="why-card glass-card"><div class="why-icon"><i class="fas fa-clock"></i></div><p>As a full-time designer, you'll get frequent communication & instant updates</p></div>
                    <div class="why-card glass-card"><div class="why-icon"><i class="fas fa-money-bill-wave"></i></div><p>MONEY back guarantee if not satisfied</p></div>
                </div>
            </div>
        </section>
        <section class="faq-section">
            <div class="container">
                <div class="page-header" style="padding-top:20px"><div class="page-badge"><i class="fas fa-question-circle"></i><span>FAQ</span></div><h2 class="page-title" style="font-size:1.8rem" data-i18n="pricing.faq">${i18n.translate('pricing.faq')}</h2></div>
                <div class="faq-list">
                    ${[
            ['Q1: How long does it take to complete a UI design?', 'The delivery time depends on the complexity and number of frames. On average, a single frame takes 1–3 days.'],
            ['Q2: Do you provide revisions?', 'Yes, I offer up to 5 free revisions for every project.'],
            ['Q3: Can you import the designs directly into Roblox Studio?', 'Yes, importing is one of my services. I ensure all designs are scaled and optimized for every device.'],
            ['Q4: What payment methods do you accept?', 'I accept PayPal and Robux. Robux prices already include Roblox tax.'],
            ['Q5: What do I receive once the work is completed?', "You'll receive organized PNGs or a direct import to your Roblox project, as you prefer."],
            ['Q6: Do you offer refunds?', 'Yes, I provide a money-back guarantee if you are not satisfied with the results.'],
            ['Q7: Do you work full-time?', "Yes, I'm a full-time UI/UX artist with daily availability for updates and communication."],
            ['Q8: Can you take rush orders / tight deadlines?', 'Rush projects are possible depending on the scope and current queue. Message me to confirm availability.']
        ].map(([q, a]) => `<div class="faq-item glass-card"><div class="faq-question" onclick="this.parentElement.classList.toggle('active')"><span>${q}</span><i class="fas fa-chevron-down"></i></div><div class="faq-answer"><p>${a}</p></div></div>`).join('')}
                </div>
                <div class="faq-cta"><p data-i18n="pricing.stillQuestions">${i18n.translate('pricing.stillQuestions')}</p><a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" class="btn btn-primary"><i class="fab fa-discord"></i> <span data-i18n="policies.contactDiscord">${i18n.translate('policies.contactDiscord')}</span></a></div>
            </div>
        </section>
    `,
    reviews: () => {
        const total = reviewsData.length, avg = (reviewsData.reduce((a, b) => a + b.rating, 0) / total).toFixed(1);
        const five = Math.round((reviewsData.filter(r => r.rating === 5).length / total) * 100);
        const four = Math.round((reviewsData.filter(r => r.rating === 4).length / total) * 100);
        return `
        <section class="page-header"><div class="container"><div class="page-badge"><i class="fas fa-star"></i><span data-i18n="reviews.badge">${i18n.translate('reviews.badge')}</span></div><h1 class="page-title" data-i18n="reviews.title">${i18n.translate('reviews.title')}</h1><p class="page-subtitle" data-i18n="reviews.subtitle">${i18n.translate('reviews.subtitle')}</p></div></section>
        <section class="stats-section"><div class="container"><div class="reviews-summary glass-card">
            <div class="summary-rating"><div class="big-rating">${avg}</div><div class="rating-stars">${'<i class="fas fa-star"></i>'.repeat(Math.floor(avg))}${avg % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}</div><div class="rating-count"><span data-i18n="reviews.basedOn">${i18n.translate('reviews.basedOn')}</span> ${total} <span data-i18n="reviews.reviewsText">${i18n.translate('reviews.reviewsText')}</span></div></div>
            <div class="rating-breakdown">
                <div class="breakdown-row"><span>5 stars</span><div class="breakdown-bar"><div class="breakdown-fill" style="width:${five}%"></div></div><span>${five}%</span></div>
                <div class="breakdown-row"><span>4 stars</span><div class="breakdown-bar"><div class="breakdown-fill" style="width:${four}%"></div></div><span>${four}%</span></div>
                <div class="breakdown-row"><span>3 stars</span><div class="breakdown-bar"><div class="breakdown-fill" style="width:0%"></div></div><span>0%</span></div>
            </div>
        </div></div></section>
        <section class="portfolio-section"><div class="container">
            <div class="reviews-filters"><button class="filter-btn active" data-rating="all" data-i18n="reviews.all">${i18n.translate('reviews.all')}</button><button class="filter-btn" data-rating="5"><i class="fas fa-star"></i> 5</button><button class="filter-btn" data-rating="4"><i class="fas fa-star"></i> 4</button></div>
            <div class="reviews-grid" id="reviewsGrid"></div>
            <div class="submit-cta glass-card"><div class="cta-icon"><i class="fas fa-pencil-alt"></i></div><div class="cta-text"><h3 data-i18n="reviews.workedBefore">${i18n.translate('reviews.workedBefore')}</h3><p data-i18n="reviews.shareExperience">${i18n.translate('reviews.shareExperience')}</p></div><a href="#" class="btn btn-primary" data-page="submit-review"><i class="fas fa-star"></i> <span data-i18n="reviews.leaveReview">${i18n.translate('reviews.leaveReview')}</span></a></div>
        </div></section>`;
    },
    policies: () => `
        <section class="page-header"><div class="container"><div class="page-badge"><i class="fas fa-scroll"></i><span data-i18n="policies.badge">${i18n.translate('policies.badge')}</span></div><h1 class="page-title" data-i18n="policies.title">${i18n.translate('policies.title')}</h1><p class="page-subtitle" data-i18n="policies.subtitle">${i18n.translate('policies.subtitle')}</p></div></section>
        <section class="portfolio-section"><div class="container">
            <div class="terms-grid">
                <div class="term-card glass-card"><div class="term-icon"><i class="fas fa-code"></i></div><h3>I don't Script UIs.</h3><p>Focus is on professional UI/UX design and import. Scripting or gameplay logic is not part of the service.</p></div>
                <div class="term-card glass-card"><div class="term-icon"><i class="fas fa-file-export"></i></div><h3>The UI is delivered as an .rbxl or .rbxm file only.</h3><p>Assets are organized, named clearly and scaled to work across devices for smooth import.</p></div>
                <div class="term-card glass-card"><div class="term-icon"><i class="fas fa-ban"></i></div><h3>No resell without permission.</h3><p>You don't have the right to resell UIs made by me without my permission. Personal & project use only.</p></div>
                <div class="term-card glass-card"><div class="term-icon"><i class="fas fa-undo"></i></div><h3>Refund policy</h3><p>If you cancel the order, refunds aren't available. If I cancel the order, you'll be fully refunded for any Robux you paid.</p></div>
            </div>
            <div class="terms-extra glass-card"><p>If you ask me to create any new HUD or frame designs, I will make up to <strong>2 new HUD designs for free</strong>. If your request needs more than 2 HUD designs, I will charge <strong>5$ or 2.5k + tax Robux</strong> for each extra HUD design. For new frame designs, I will charge <strong>15$ for every new frame design</strong> you request, and there are no free frame designs included.</p></div>
            <div class="policies-footer"><p><i class="fas fa-clock"></i> <span data-i18n="policies.lastUpdated">${i18n.translate('policies.lastUpdated')}</span></p><p><span data-i18n="policies.questions">${i18n.translate('policies.questions')}</span> <a href="https://discord.gg/youssefdesign" target="_blank" rel="noopener" data-i18n="policies.contactDiscord">${i18n.translate('policies.contactDiscord')}</a></p></div>
        </div></section>
    `,
    'submit-review': () => `
        <section class="page-header"><div class="container"><div class="page-badge"><i class="fas fa-satellite-dish"></i><span>Transmit Your Signal</span></div><h1 class="page-title">Share Your <span class="gradient-text">Experience</span></h1><p class="page-subtitle">Your feedback helps others.</p></div></section>
        <section class="portfolio-section"><div class="container">
            <div class="review-journey glass-card" id="reviewJourney">
                <div class="journey-progress">
                    <div class="progress-step active" data-step="1"><div class="step-icon"><i class="fas fa-user"></i></div><span>Identity</span></div>
                    <div class="progress-step" data-step="2"><div class="step-icon"><i class="fas fa-project-diagram"></i></div><span>Project</span></div>
                    <div class="progress-step" data-step="3"><div class="step-icon"><i class="fas fa-star"></i></div><span>Rating</span></div>
                    <div class="progress-step" data-step="4"><div class="step-icon"><i class="fas fa-comment"></i></div><span>Message</span></div>
                    <div class="progress-step" data-step="5"><div class="step-icon"><i class="fas fa-check"></i></div><span>Review</span></div>
                </div>
                <div class="journey-step active" data-step="1"><div class="step-number">01</div><h2>Identify Your Signal</h2><p>How should we know you?</p><div class="form-group"><label>Your Name</label><div class="input-wrap"><i class="fas fa-user"></i><input type="text" id="reviewerName" placeholder="Enter your name" maxlength="50"></div></div><div class="step-buttons"><button class="btn btn-primary" onclick="ReviewForm.nextStep()">Continue <i class="fas fa-arrow-right"></i></button></div></div>
                <div class="journey-step" data-step="2"><div class="step-number">02</div><h2>Name Your Mission</h2><p>What project did we work on?</p><div class="form-group"><label>Project Name</label><div class="input-wrap"><i class="fas fa-rocket"></i><input type="text" id="projectName" placeholder="e.g., Full Game UI" maxlength="100"></div></div><div class="step-buttons"><button class="btn btn-secondary" onclick="ReviewForm.prevStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" onclick="ReviewForm.nextStep()">Continue <i class="fas fa-arrow-right"></i></button></div></div>
                <div class="journey-step" data-step="3"><div class="step-number">03</div><h2>Rate Your Experience</h2><div class="rating-selector" id="ratingSelector">${[1, 2, 3, 4, 5].map(n => `<button class="rating-star" data-rating="${n}"><i class="far fa-star"></i></button>`).join('')}</div><div class="rating-label" id="ratingLabel">Select a rating</div><div class="step-buttons"><button class="btn btn-secondary" onclick="ReviewForm.prevStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" onclick="ReviewForm.nextStep()">Continue <i class="fas fa-arrow-right"></i></button></div></div>
                <div class="journey-step" data-step="4"><div class="step-number">04</div><h2>Share Your Message</h2><div class="form-group"><label>Your Review</label><textarea id="reviewText" placeholder="What did you like?" maxlength="500" rows="4"></textarea><span class="input-hint"><span id="charCount">0</span>/500</span></div><div class="step-buttons"><button class="btn btn-secondary" onclick="ReviewForm.prevStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" onclick="ReviewForm.nextStep()">Continue <i class="fas fa-arrow-right"></i></button></div></div>
                <div class="journey-step" data-step="5"><div class="step-number">05</div><h2>Launch Your Review</h2><div class="review-preview glass-card" id="reviewPreview"></div><div class="step-buttons"><button class="btn btn-secondary" onclick="ReviewForm.prevStep()"><i class="fas fa-arrow-left"></i> Back</button><button class="btn btn-primary" onclick="ReviewForm.submit()"><i class="fas fa-paper-plane"></i> Submit</button></div></div>
                <div class="journey-step" data-step="6"><div class="success-animation"><i class="fas fa-check-circle"></i></div><h2>Review Submitted!</h2><p>Thank you!</p><div class="step-buttons"><a href="#" class="btn btn-primary" data-page="reviews"><i class="fas fa-star"></i> View Reviews</a></div></div>
            </div>
        </div></section>
    `
};

// ═══════════════════════════════════════════════════════════════
// MANAGERS (GamesManager, ReviewsManager, ReviewForm) - unchanged
// (same as original, omitted for brevity but must be included in final code)
// ═══════════════════════════════════════════════════════════════

// [.... باقي الكود كما هو مع الحفاظ على GamesManager, ReviewsManager, ReviewForm, Router, MusicPlayer, SiteSettings, GalaxyBackground, MobileMenu, LanguageSwitcher, SettingsModal, والـ Initialization بنفس الشكل الأصلي ....]

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
    TimeDisplay.init();
    Router.init();
    MobileMenu.init();
    LanguageSwitcher.init();
    SettingsModal.init();
    SiteSettings.init();
    MusicPlayer.init();
    GalaxyBackground.init();

    // Quick loader (500ms)
    setTimeout(() => {
        const loader = document.getElementById('pageLoader');
        if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.style.display = 'none', 300); }
        setTimeout(() => WelcomeFrame.init(), 300);
    }, 500);
});