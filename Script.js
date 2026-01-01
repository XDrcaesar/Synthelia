// ==============================================
// Synova - نصائح طبية ذكية
// إصدار 2.0 - مميزات متقدمة
// ==============================================

// التهيئة الأساسية
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Synova v2.0 - جاري التحميل...');
    initApp();
});

// العناصر الرئيسية
let currentAdviceIndex = 0;
let autoAdviceInterval = null;
let isAutoAdviceRunning = false;
let isArabic = true;
let currentTheme = 'dark';
let adviceHistory = [];
let favoriteAdvices = new Set();

// الكائن الرئيسي للتطبيق
const SynovaApp = {
    // الإعدادات
    settings: {
        dailyGoal: 10,
        notifications: true,
        soundEnabled: true,
        autoSave: true,
        fontSize: 'medium'
    },

    // الإحصائيات
    stats: {
        totalTips: 0,
        totalFavorites: 0,
        streakDays: 0,
        achievements: 0,
        lastVisit: null
    },

    // قاعدة النصائح (موسعة)
    advices: [
        {
            id: 1,
            text: "💧 اشرب 8 أكواب ماء يومياً على الأقل للحفاظ على ترطيب جسمك ومنع الجفاف.",
            category: "صحة عامة",
            icon: "fa-tint",
            source: "منظمة الصحة العالمية",
            likes: 0,
            views: 0
        },
        {
            id: 2,
            text: "😴 نم 7-8 ساعات كل ليلة لتعزيز صحة الدماغ وتحسين الذاكرة والتركيز.",
            category: "النوم",
            icon: "fa-bed",
            source: "مراكز السيطرة على الأمراض",
            likes: 0,
            views: 0
        },
        {
            id: 3,
            text: "🏃‍♂️ مارس الرياضة 30 دقيقة يومياً لتقليل خطر الأمراض المزمنة وتحسين المزاج.",
            category: "اللياقة",
            icon: "fa-running",
            source: "الجمعية الأمريكية للقلب",
            likes: 0,
            views: 0
        },
        {
            id: 4,
            text: "🧼 اغسل يديك لمدة 20 ثانية بالماء والصابون للوقاية من الفيروسات والجراثيم.",
            category: "النظافة",
            icon: "fa-hands-wash",
            source: "منظمة الصحة العالمية",
            likes: 0,
            views: 0
        },
        {
            id: 5,
            text: "🥦 تناول 5 حصص من الخضار والفواكه يومياً لتعزيز المناعة ومحاربة الأمراض.",
            category: "التغذية",
            icon: "fa-apple-alt",
            source: "وزارة الزراعة الأمريكية",
            likes: 0,
            views: 0
        },
        {
            id: 6,
            text: "🚭 تجنب التدخين تماماً لحماية رئتيك وقلبك من الأمراض الخطيرة.",
            category: "الصحة الوقائية",
            icon: "fa-smoking-ban",
            source: "الجمعية الأمريكية للسرطان",
            likes: 0,
            views: 0
        },
        {
            id: 7,
            text: "🩺 فحص ضغط الدم بانتظام يمنع المضاعفات الخطيرة مثل السكتات الدماغية.",
            category: "الصحة الوقائية",
            icon: "fa-heartbeat",
            source: "الجمعية الأمريكية للقلب",
            likes: 0,
            views: 0
        },
        {
            id: 8,
            text: "☀️ تعرض لأشعة الشمس 10-15 دقيقة يومياً لتصنيع فيتامين د الضروري للعظام.",
            category: "الصحة العامة",
            icon: "fa-sun",
            source: "المعاهد الوطنية للصحة",
            likes: 0,
            views: 0
        },
        {
            id: 9,
            text: "🧘‍♀️ خذ قسطاً من الراحة والاسترخاء لتقليل التوتر والقلق وتحسين الصحة النفسية.",
            category: "الصحة النفسية",
            icon: "fa-spa",
            source: "الجمعية الأمريكية للطب النفسي",
            likes: 0,
            views: 0
        },
        {
            id: 10,
            text: "🍎 قلل من السكريات المصنعة للحفاظ على مستوى سكر طبيعي ومنع مرض السكري.",
            category: "التغذية",
            icon: "fa-candy-cane",
            source: "جمعية السكري الأمريكية",
            likes: 0,
            views: 0
        },
        {
            id: 11,
            text: "🦷 نظف أسنانك مرتين يومياً واستخدم الخيط للوقاية من التسوس وأمراض اللثة.",
            category: "صحة الفم",
            icon: "fa-tooth",
            source: "جمعية أطباء الأسنان الأمريكية",
            likes: 0,
            views: 0
        },
        {
            id: 12,
            text: "👁️ خذ فترات راحة من الشاشات كل 20 دقيقة لحماية عينيك من الإجهاد الرقمي.",
            category: "صحة العيون",
            icon: "fa-eye",
            source: "الأكاديمية الأمريكية لطب العيون",
            likes: 0,
            views: 0
        },
        {
            id: 13,
            text: "🚶‍♂️ المشي يومياً يحسن الدورة الدموية ويقوي العظام ويقلل من التوتر.",
            category: "اللياقة",
            icon: "fa-walking",
            source: "مراكز السيطرة على الأمراض",
            likes: 0,
            views: 0
        },
        {
            id: 14,
            text: "🍵 اشرب الشاي الأخضر لمضادات الأكسدة التي تحمي الخلايا من التلف.",
            category: "التغذية",
            icon: "fa-mug-hot",
            source: "مجلة التغذية البريطانية",
            likes: 0,
            views: 0
        },
        {
            id: 15,
            text: "📱 قلل وقت استخدام الهاتف قبل النوم بساعتين لتحسين جودة النوم.",
            category: "النوم",
            icon: "fa-mobile-alt",
            source: "مؤسسة النوم الوطنية",
            likes: 0,
            views: 0
        }
    ],

    // النصائح الإنجليزية
    advicesEN: [
        {
            id: 1,
            text: "💧 Drink at least 8 glasses of water daily to maintain hydration and prevent dehydration.",
            category: "General Health",
            icon: "fa-tint",
            source: "World Health Organization",
            likes: 0,
            views: 0
        },
        {
            id: 2,
            text: "😴 Sleep 7-8 hours every night to enhance brain health and improve memory and concentration.",
            category: "Sleep",
            icon: "fa-bed",
            source: "CDC",
            likes: 0,
            views: 0
        },
        {
            id: 3,
            text: "🏃‍♂️ Exercise for 30 minutes daily to reduce the risk of chronic diseases and improve mood.",
            category: "Fitness",
            icon: "fa-running",
            source: "American Heart Association",
            likes: 0,
            views: 0
        },
        {
            id: 4,
            text: "🧼 Wash your hands for 20 seconds with soap and water to prevent viruses and germs.",
            category: "Hygiene",
            icon: "fa-hands-wash",
            source: "WHO",
            likes: 0,
            views: 0
        },
        {
            id: 5,
            text: "🥦 Eat 5 servings of fruits and vegetables daily to boost immunity and fight diseases.",
            category: "Nutrition",
            icon: "fa-apple-alt",
            source: "USDA",
            likes: 0,
            views: 0
        },
        {
            id: 6,
            text: "🚭 Avoid smoking completely to protect your lungs and heart from serious diseases.",
            category: "Preventive Health",
            icon: "fa-smoking-ban",
            source: "American Cancer Society",
            likes: 0,
            views: 0
        },
        {
            id: 7,
            text: "🩺 Regular blood pressure checks prevent serious complications like strokes.",
            category: "Preventive Health",
            icon: "fa-heartbeat",
            source: "American Heart Association",
            likes: 0,
            views: 0
        },
        {
            id: 8,
            text: "☀️ Get 10-15 minutes of sunlight daily to produce essential Vitamin D for bones.",
            category: "General Health",
            icon: "fa-sun",
            source: "NIH",
            likes: 0,
            views: 0
        },
        {
            id: 9,
            text: "🧘‍♀️ Take time to rest and relax to reduce stress and anxiety and improve mental health.",
            category: "Mental Health",
            icon: "fa-spa",
            source: "American Psychiatric Association",
            likes: 0,
            views: 0
        },
        {
            id: 10,
            text: "🍎 Reduce processed sugars to maintain normal blood sugar levels and prevent diabetes.",
            category: "Nutrition",
            icon: "fa-candy-cane",
            source: "American Diabetes Association",
            likes: 0,
            views: 0
        },
        {
            id: 11,
            text: "🦷 Brush your teeth twice daily and use floss to prevent cavities and gum disease.",
            category: "Oral Health",
            icon: "fa-tooth",
            source: "American Dental Association",
            likes: 0,
            views: 0
        },
        {
            id: 12,
            text: "👁️ Take breaks from screens every 20 minutes to protect your eyes from digital strain.",
            category: "Eye Health",
            icon: "fa-eye",
            source: "American Academy of Ophthalmology",
            likes: 0,
            views: 0
        },
        {
            id: 13,
            text: "🚶‍♂️ Walking daily improves circulation, strengthens bones, and reduces stress.",
            category: "Fitness",
            icon: "fa-walking",
            source: "CDC",
            likes: 0,
            views: 0
        },
        {
            id: 14,
            text: "🍵 Drink green tea for antioxidants that protect cells from damage.",
            category: "Nutrition",
            icon: "fa-mug-hot",
            source: "British Journal of Nutrition",
            likes: 0,
            views: 0
        },
        {
            id: 15,
            text: "📱 Reduce phone use 2 hours before bed to improve sleep quality.",
            category: "Sleep",
            icon: "fa-mobile-alt",
            source: "National Sleep Foundation",
            likes: 0,
            views: 0
        }
    ],

    // الإنجازات
    achievements: [
        { id: 1, name: "المبتدئ", desc: "شاهد 5 نصائح", icon: "fa-seedling", earned: false },
        { id: 2, name: "المتحمس", desc: "شاهد 10 نصائح", icon: "fa-fire", earned: false },
        { id: 3, name: "الطبيب الصغير", desc: "أضف 5 نصائح للمفضلة", icon: "fa-user-md", earned: false },
        { id: 4, name: "الملتزم", desc: "زور الموقع 3 أيام متتالية", icon: "fa-calendar-check", earned: false },
        { id: 5, name: "الخبير", desc: "شاهد جميع النصائح", icon: "fa-crown", earned: false }
    ],

    // التهيئة
    init() {
        this.loadData();
        this.setupEventListeners();
        this.initParticles();
        this.updateTime();
        this.showRandomAdvice();
        this.updateStats();
        this.updateProgressBar();
        this.checkAchievements();
        this.setupServiceWorker();
        
        // تحديث الوقت كل ثانية
        setInterval(() => this.updateTime(), 1000);
        
        console.log('✅ Synova App Initialized Successfully');
        this.showNotification('مرحباً بك في Synova! 🎉', 'success');
    },

    // تحميل البيانات
    loadData() {
        // تحميل الإعدادات
        const savedSettings = localStorage.getItem('synova_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }

        // تحميل الإحصائيات
        const savedStats = localStorage.getItem('synova_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
            
            // التحقق من التتابع اليومي
            this.checkStreak();
        }

        // تحميل المفضلة
        const savedFavorites = localStorage.getItem('synova_favorites');
        if (savedFavorites) {
            favoriteAdvices = new Set(JSON.parse(savedFavorites));
        }

        // تحميل السمة
        const savedTheme = localStorage.getItem('synova_theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        // تحميل اللغة
        const savedLang = localStorage.getItem('synova_lang');
        if (savedLang === 'en') {
            this.toggleLanguage();
        }
    },

    // حفظ البيانات
    saveData() {
        if (this.settings.autoSave) {
            localStorage.setItem('synova_settings', JSON.stringify(this.settings));
            localStorage.setItem('synova_stats', JSON.stringify(this.stats));
            localStorage.setItem('synova_favorites', JSON.stringify([...favoriteAdvices]));
            localStorage.setItem('synova_theme', currentTheme);
            localStorage.setItem('synova_lang', isArabic ? 'ar' : 'en');
        }
    },

    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // القائمة
        document.getElementById('smartMenuBtn').addEventListener('click', () => {
            document.getElementById('menuOverlay').classList.add('active');
        });

        document.getElementById('closeMenuBtn').addEventListener('click', () => {
            document.getElementById('menuOverlay').classList.remove('active');
        });

        // أزرار اللغة
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if ((lang === 'ar' && !isArabic) || (lang === 'en' && isArabic)) {
                    this.toggleLanguage();
                }
            });
        });

        // أزرار السمة
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
                
                // تحديث الأزرار النشطة
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // أزرار النصائح
        document.getElementById('newAdviceBtn').addEventListener('click', () => {
            this.showRandomAdvice();
            this.showNotification('تم عرض نصيحة جديدة! ✨', 'success');
        });

        document.getElementById('autoAdviceBtn').addEventListener('click', () => {
            this.toggleAutoAdvice();
        });

        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showPreviousAdvice();
        });

        // أزرار البطاقة
        document.getElementById('favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyAdvice();
        });

        document.getElementById('soundBtn').addEventListener('click', () => {
            this.speakAdvice();
        });

        // مسح المفضلة
        document.getElementById('clearFavBtn').addEventListener('click', () => {
            if (favoriteAdvices.size > 0) {
                if (confirm(isArabic ? 'هل تريد مسح جميع النصائح المفضلة؟' : 'Clear all favorites?')) {
                    favoriteAdvices.clear();
                    this.updateFavoritesList();
                    this.saveData();
                    this.showNotification(isArabic ? 'تم مسح المفضلة' : 'Favorites cleared', 'info');
                }
            }
        });

        // مشاركة التطبيق
        document.getElementById('shareAppBtn').addEventListener('click', () => {
            this.shareApp();
        });

        // أدوات المطور
        document.getElementById('devToolsBtn').addEventListener('click', () => {
            this.showDevTools();
        });

        document.getElementById('resetDataBtn').addEventListener('click', () => {
            this.resetData();
        });

        // زر العودة للأعلى
        document.getElementById('backToTopBtn').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // التمرير لإظهار زر العودة للأعلى
        window.addEventListener('scroll', () => {
            const backBtn = document.getElementById('backToTopBtn');
            if (window.scrollY > 300) {
                backBtn.classList.add('visible');
            } else {
                backBtn.classList.remove('visible');
            }
        });

        // إغلاق القائمة بالضغط خارجها
        document.getElementById('menuOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'menuOverlay') {
                document.getElementById('menuOverlay').classList.remove('active');
            }
        });
    },

    // عرض نصيحة عشوائية
    showRandomAdvice() {
        const advices = isArabic ? this.advices : this.advicesEN;
        let newIndex;
        
        do {
            newIndex = Math.floor(Math.random() * advices.length);
        } while (newIndex === currentAdviceIndex && advices.length > 1);
        
        currentAdviceIndex = newIndex;
        const advice = advices[currentAdviceIndex];
        
        // إضافة للسجل
        adviceHistory.push({
            id: advice.id,
            time: new Date().toISOString(),
            text: advice.text
        });
        
        // حفظ آخر 10 نصائح فقط
        if (adviceHistory.length > 10) {
            adviceHistory.shift();
        }
        
        // تحديث العرض
        this.updateAdviceDisplay(advice);
        
        // زيادة المشاهدات
        advice.views++;
        this.stats.totalTips++;
        
        // تحديث الإحصائيات
        this.updateStats();
        this.updateProgressBar();
        this.checkAchievements();
        
        // حفظ البيانات
        this.saveData();
        
        // تأثير مرئي
        const card = document.getElementById('adviceCard');
        card.classList.remove('animate__fadeIn');
        void card.offsetWidth; // إعادة التدفق
        card.classList.add('animate__fadeIn');
    },

    // عرض النصيحة السابقة
    showPreviousAdvice() {
        if (adviceHistory.length > 1) {
            const prevAdvice = adviceHistory[adviceHistory.length - 2];
            const advices = isArabic ? this.advices : this.advicesEN;
            const advice = advices.find(a => a.id === prevAdvice.id);
            
            if (advice) {
                this.updateAdviceDisplay(advice);
                this.showNotification(isArabic ? 'تم عرض النصيحة السابقة' : 'Previous advice shown', 'info');
            }
        } else {
            this.showNotification(isArabic ? 'لا توجد نصائح سابقة' : 'No previous advice', 'info');
        }
    },

    // تحديث عرض النصيحة
    updateAdviceDisplay(advice) {
        document.getElementById('adviceText').textContent = advice.text;
        document.getElementById('adviceCategory').innerHTML = 
            `<i class="fas fa-tag"></i><span>${advice.category}</span>`;
        document.getElementById('adviceIcon').className = `fas ${advice.icon}`;
        document.getElementById('adviceTitle').textContent = 
            isArabic ? 'نصيحة اليوم' : "Today's Tip";
        document.getElementById('likesCount').textContent = advice.likes;
        document.getElementById('viewsCount').textContent = advice.views + 1;
        document.getElementById('adviceDate').textContent = this.getCurrentDate();
        
        // تحديث زر المفضلة
        const favBtn = document.getElementById('favoriteBtn');
        const isFavorite = favoriteAdvices.has(advice.id);
        favBtn.innerHTML = isFavorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        favBtn.style.color = isFavorite ? '#f59e0b' : '';
    },

    // تبديل المفضلة
    toggleFavorite() {
        const currentAdvice = (isArabic ? this.advices : this.advicesEN)[currentAdviceIndex];
        
        if (favoriteAdvices.has(currentAdvice.id)) {
            favoriteAdvices.delete(currentAdvice.id);
            this.showNotification(isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites', 'info');
        } else {
            favoriteAdvices.add(currentAdvice.id);
            this.showNotification(isArabic ? 'تمت الإضافة للمفضلة ⭐' : 'Added to favorites ⭐', 'success');
        }
        
        // تحديث الزر
        const favBtn = document.getElementById('favoriteBtn');
        const isFavorite = favoriteAdvices.has(currentAdvice.id);
        favBtn.innerHTML = isFavorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        favBtn.style.color = isFavorite ? '#f59e0b' : '';
        
        // تحديث القائمة
        this.updateFavoritesList();
        
        // تحديث الإحصائيات
        this.stats.totalFavorites = favoriteAdvices.size;
        this.updateStats();
        this.saveData();
    },

    // تحديث قائمة المفضلة
    updateFavoritesList() {
        const favoritesList = document.getElementById('favoritesList');
        const advices = isArabic ? this.advices : this.advicesEN;
        
        if (favoriteAdvices.size === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-star"></i>
                    <p>${isArabic ? 'لا توجد نصائح مفضلة بعد' : 'No favorite advice yet'}</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        favoriteAdvices.forEach(id => {
            const advice = advices.find(a => a.id === id);
            if (advice) {
                html += `
                    <div class="favorite-item">
                        <span class="fav-text">${advice.text.substring(0, 50)}...</span>
                        <button class="remove-fav" data-id="${id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        });
        
        favoritesList.innerHTML = html;
        
        // إضافة مستمعين لأزرار الحذف
        favoritesList.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.remove-fav').dataset.id);
                favoriteAdvices.delete(id);
                this.updateFavoritesList();
                this.saveData();
                this.showNotification(isArabic ? 'تمت الإزالة' : 'Removed', 'info');
            });
        });
    },

    // نسخ النصيحة
    copyAdvice() {
        const adviceText = document.getElementById('adviceText').textContent;
        navigator.clipboard.writeText(adviceText)
            .then(() => {
                this.showNotification(isArabic ? 'تم نسخ النصيحة 📋' : 'Advice copied 📋', 'success');
            })
            .catch(() => {
                this.showNotification(isArabic ? 'فشل النسخ' : 'Copy failed', 'error');
            });
    },

    // قراءة النصيحة بصوت
    speakAdvice() {
        if (!this.settings.soundEnabled) return;
        
        const adviceText = document.getElementById('adviceText').textContent;
        
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(adviceText);
            utterance.lang = isArabic ? 'ar-SA' : 'en-US';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
            
            this.showNotification(isArabic ? 'جاري قراءة النصيحة...' : 'Reading advice...', 'info');
        } else {
            this.showNotification(isArabic ? 'المتصفح لا يدعم القراءة الصوتية' : 'Browser does not support speech', 'error');
        }
    },

    // تبديل التشغيل التلقائي
    toggleAutoAdvice() {
        const btn = document.getElementById('autoAdviceBtn');
        
        if (isAutoAdviceRunning) {
            clearInterval(autoAdviceInterval);
            isAutoAdviceRunning = false;
            btn.innerHTML = '<i class="fas fa-play"></i><span>تشغيل تلقائي</span>';
            btn.classList.remove('active');
            this.showNotification(isArabic ? 'تم إيقاف التشغيل التلقائي' : 'Auto-play stopped', 'info');
        } else {
            isAutoAdviceRunning = true;
            btn.innerHTML = '<i class="fas fa-pause"></i><span>إيقاف تلقائي</span>';
            btn.classList.add('active');
            this.showNotification(isArabic ? 'بدأ التشغيل التلقائي' : 'Auto-play started', 'success');
            
            autoAdviceInterval = setInterval(() => {
                this.showRandomAdvice();
            }, 10000); // كل 10 ثواني
        }
    },

    // تبديل اللغة
    toggleLanguage() {
        isArabic = !isArabic;
        
        // تحديث واجهة المستخدم
        document.documentElement.lang = isArabic ? 'ar' : 'en';
        document.body.style.direction = isArabic ? 'rtl' : 'ltr';
        document.title = isArabic ? 'Synova - نصائح طبية ذكية' : 'Synova - Smart Medical Tips';
        
        // تحديث النصوص
        document.getElementById('greetingText').textContent = 
            isArabic ? 'مرحباً بك في سينوفا! 👋' : 'Welcome to Synova! 👋';
        document.getElementById('taglineText').textContent = 
            isArabic ? 'نقدم لك نصائح طبية ذكية لصحة أفضل' : 'Smart medical tips for better health';
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', 
                (btn.dataset.lang === 'ar' && isArabic) || 
                (btn.dataset.lang === 'en' && !isArabic)
            );
        });
        
        // تحديث النصيحة الحالية
        const currentAdvice = (isArabic ? this.advices : this.advicesEN)
            .find(a => a.id === (isArabic ? this.advices : this.advicesEN)[currentAdviceIndex].id);
        if (currentAdvice) {
            this.updateAdviceDisplay(currentAdvice);
        }
        
        // تحديث المفضلة
        this.updateFavoritesList();
        
        this.saveData();
        this.showNotification(isArabic ? 'تم التبديل للغة العربية' : 'Switched to English', 'info');
    },

    // تغيير السمة
    setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('synova_theme', theme);
    },

    // تحديث الوقت والتاريخ
    updateTime() {
        const now = new Date();
        
        // الوقت
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: isArabic ? false : true 
        };
        const timeStr = now.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', timeOptions);
        document.getElementById('currentTime').textContent = timeStr;
        
        // التاريخ
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', dateOptions);
        document.getElementById('currentDate').textContent = dateStr;
    },

    // الحصول على التاريخ الحالي بصيغة نصية
    getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
            month: 'short',
            day: 'numeric'
        });
    },

    // تحديث الإحصائيات
    updateStats() {
        // تحديث الإحصائيات الحية
        document.getElementById('todayTips').textContent = this.stats.totalTips % 100;
        document.getElementById('favCount').textContent = favoriteAdvices.size;
        
        // تحديث الإحصائيات الرئيسية
        document.getElementById('totalTips').textContent = this.stats.totalTips;
        document.getElementById('totalFavs').textContent = favoriteAdvices.size;
        document.getElementById('streakDays').textContent = this.stats.streakDays;
        document.getElementById('achievements').textContent = this.achievements.filter(a => a.earned).length;
        
        // تحديث تاريخ آخر زيارة
        document.getElementById('lastUpdate').textContent = 
            this.stats.lastVisit ? this.formatDate(this.stats.lastVisit) : 
            (isArabic ? 'اليوم' : 'Today');
    },

    // التحقق من التتابع اليومي
    checkStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.stats.lastVisit ? new Date(this.stats.lastVisit).toDateString() : null;
        
        if (lastVisit === today) {
            // تمت الزيارة اليوم
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
            // زار أمس، زيادة التتابع
            this.stats.streakDays++;
        } else if (lastVisit && lastVisit !== today) {
            // كسر التتابع
            this.stats.streakDays = 1;
        } else {
            // أول زيارة
            this.stats.streakDays = 1;
        }
        
        this.stats.lastVisit = new Date().toISOString();
    },

    // تحديث شريط التقدم
    updateProgressBar() {
        const progress = (this.stats.totalTips % this.settings.dailyGoal) / this.settings.dailyGoal * 100;
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
    },

    // التحقق من الإنجازات
    checkAchievements() {
        let earnedCount = 0;
        
        // إنجازات المشاهدة
        if (this.stats.totalTips >= 5 && !this.achievements[0].earned) {
            this.achievements[0].earned = true;
            this.showAchievement(this.achievements[0]);
        }
        
        if (this.stats.totalTips >= 10 && !this.achievements[1].earned) {
            this.achievements[1].earned = true;
            this.showAchievement(this.achievements[1]);
        }
        
        // إنجازات المفضلة
        if (favoriteAdvices.size >= 5 && !this.achievements[2].earned) {
            this.achievements[2].earned = true;
            this.showAchievement(this.achievements[2]);
        }
        
        // إنجازات التتابع
        if (this.stats.streakDays >= 3 && !this.achievements[3].earned) {
            this.achievements[3].earned = true;
            this.showAchievement(this.achievements[3]);
        }
        
        // إنجازات إكمال جميع النصائح
        const totalAdvices = isArabic ? this.advices.length : this.advicesEN.length;
        if (this.stats.totalTips >= totalAdvices * 2 && !this.achievements[4].earned) {
            this.achievements[4].earned = true;
            this.showAchievement(this.achievements[4]);
        }
    },

    // عرض الإنجاز
    showAchievement(achievement) {
        this.showNotification(
            `${isArabic ? '🎉 مبروك! لقد حصلت على إنجاز:' : '🎉 Congratulations! Achievement unlocked:'} ${achievement.name}`,
            'success'
        );
        
        // تحديث الإحصائيات
        this.stats.achievements = this.achievements.filter(a => a.earned).length;
        this.updateStats();
    },

    // مشاركة التطبيق
    shareApp() {
        const shareData = {
            title: isArabic ? 'Synova - نصائح طبية ذكية' : 'Synova - Smart Medical Tips',
            text: isArabic ? 
                'جرب سينوفا للحصول على نصائح طبية ذكية يومية!' :
                'Try Synova for daily smart medical tips!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => this.showNotification(
                    isArabic ? 'شكراً للمشاركة! 🙏' : 'Thanks for sharing! 🙏',
                    'success'
                ))
                .catch(() => this.copyToClipboard(shareData.url));
        } else {
            this.copyToClipboard(shareData.url);
        }
    },

    // نسخ الرابط
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showNotification(
                isArabic ? 'تم نسخ الرابط 📋' : 'Link copied 📋',
                'success'
            ))
            .catch(() => this.showNotification(
                isArabic ? 'فشل النسخ' : 'Copy failed',
                'error'
            ));
    },

    // عرض أدوات المطور
    showDevTools() {
        const info = `
            === معلومات التطبيق ===
            الإصدار: 2.0.0
            النصائح: ${this.stats.totalTips}
            المفضلة: ${favoriteAdvices.size}
            التتابع: ${this.stats.streakDays} يوم
            الإنجازات: ${this.stats.achievements}
            اللغة: ${isArabic ? 'العربية' : 'الإنجليزية'}
            السمة: ${currentTheme}
            آخر زيارة: ${this.formatDate(this.stats.lastVisit)}
        `;
        
        console.log(info);
        this.showNotification(isArabic ? 'تم عرض المعلومات في الكونسول' : 'Info shown in console', 'info');
    },

    // إعادة ضبط البيانات
    resetData() {
        if (confirm(isArabic ? 
            'هل تريد إعادة ضبط جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.' :
            'Reset all data? This action cannot be undone.')) {
            
            localStorage.clear();
            location.reload();
        }
    },

    // تنسيق التاريخ
    formatDate(dateString) {
        if (!dateString) return isArabic ? 'غير متاح' : 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // عرض الإشعارات
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        // إزالة بعد 5 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },

    // تهيئة الجسيمات المتحركة
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: "#6366f1" },
                    shape: { type: "circle" },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#6366f1",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" }
                    }
                }
            });
        }
    },

    // إعداد Service Worker (للتطبيق التقدمي)
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
    }
};

// تهيئة التطبيق
function initApp() {
    SynovaApp.init();
}

// إضافة أنماط CSS للإشعارات
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .remove-fav {
        background: none;
        border: none;
        color: var(--danger-color);
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .remove-fav:hover {
        background: rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(notificationStyles);

// إضافة أنماط CSS لتحسينات إضافية
const extraStyles = document.createElement('style');
extraStyles.textContent = `
    .active {
        position: relative;
    }
    
    .active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-color);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .advice-card.animate__fadeIn {
        animation-duration: 0.8s;
    }
    
    .favorite-item {
        transition: all 0.3s ease;
    }
    
    .favorite-item:hover {
        transform: translateX(-5px);
        background: rgba(255, 255, 255, 0.1) !important;
    }
`;
document.head.appendChild(extraStyles);

// تهيئة التطبيق عند تحميل الصفحة
window.onload = initApp;
