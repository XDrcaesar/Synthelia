// ==============================================
// Synthelia - نظام النصائح الطبية البسيط
// إصدار مبسط يعمل بكفاءة
// ==============================================

// حالة التطبيق
const App = {
    // النصائح الطبية
    advices: [
        {
            id: 1,
            text: "💧 اشرب 8 أكواب ماء يومياً على الأقل للحفاظ على ترطيب الجسم",
            category: "الصحة العامة",
            icon: "fa-tint",
            source: "منظمة الصحة العالمية",
            likes: 0,
            views: 0
        },
        {
            id: 2,
            text: "😴 نم 7-8 ساعات كل ليلة لتعزيز صحة الدماغ والذاكرة",
            category: "النوم",
            icon: "fa-bed",
            source: "مراكز السيطرة على الأمراض",
            likes: 0,
            views: 0
        },
        {
            id: 3,
            text: "🏃‍♂️ مارس الرياضة 30 دقيقة يومياً لتقليل خطر الأمراض المزمنة",
            category: "اللياقة",
            icon: "fa-running",
            source: "الجمعية الأمريكية للقلب",
            likes: 0,
            views: 0
        },
        {
            id: 4,
            text: "🧼 اغسل يديك لمدة 20 ثانية للوقاية من الفيروسات والجراثيم",
            category: "النظافة",
            icon: "fa-hands-wash",
            source: "منظمة الصحة العالمية",
            likes: 0,
            views: 0
        },
        {
            id: 5,
            text: "🥦 تناول 5 حصص من الخضار والفواكه يومياً لتعزيز المناعة",
            category: "التغذية",
            icon: "fa-apple-alt",
            source: "وزارة الزراعة الأمريكية",
            likes: 0,
            views: 0
        },
        {
            id: 6,
            text: "🚭 تجنب التدخين لحماية رئتيك وقلبك من الأمراض الخطيرة",
            category: "الصحة الوقائية",
            icon: "fa-smoking-ban",
            source: "الجمعية الأمريكية للسرطان",
            likes: 0,
            views: 0
        },
        {
            id: 7,
            text: "🩺 فحص ضغط الدم بانتظام يمنع المضاعفات الخطيرة",
            category: "الصحة الوقائية",
            icon: "fa-heartbeat",
            source: "الجمعية الأمريكية للقلب",
            likes: 0,
            views: 0
        },
        {
            id: 8,
            text: "☀️ تعرض لأشعة الشمس 10-15 دقيقة يومياً لفيتامين د",
            category: "الصحة العامة",
            icon: "fa-sun",
            source: "المعاهد الوطنية للصحة",
            likes: 0,
            views: 0
        }
    ],
    
    // بيانات التطبيق
    data: {
        currentIndex: 0,
        favorites: new Set(),
        isArabic: true,
        stats: {
            totalViews: 0,
            totalLikes: 0
        }
    },
    
    // التهيئة
    init() {
        console.log('🚀 Synthelia - جاري التهيئة...');
        
        this.loadData();
        this.setupEventListeners();
        this.displayCurrentAdvice();
        this.updateFavoritesDisplay();
        
        console.log('✅ Synthelia - جاهز للاستخدام');
    },
    
    // تحميل البيانات
    loadData() {
        // المفضلة
        const savedFavorites = localStorage.getItem('synthelia_favorites');
        if (savedFavorites) {
            this.data.favorites = new Set(JSON.parse(savedFavorites));
        }
        
        // الإحصائيات
        const savedStats = localStorage.getItem('synthelia_stats');
        if (savedStats) {
            this.data.stats = JSON.parse(savedStats);
        }
        
        // اللغة
        const savedLang = localStorage.getItem('synthelia_lang');
        if (savedLang === 'en') {
            this.toggleLanguage(false);
        }
    },
    
    // حفظ البيانات
    saveData() {
        localStorage.setItem('synthelia_favorites', JSON.stringify([...this.data.favorites]));
        localStorage.setItem('synthelia_stats', JSON.stringify(this.data.stats));
        localStorage.setItem('synthelia_lang', this.data.isArabic ? 'ar' : 'en');
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // القائمة
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });
        
        document.getElementById('closeBtn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });
        
        // إغلاق القائمة بالضغط خارجها
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
        
        // اللغة
        document.getElementById('langToggle').addEventListener('click', () => {
            this.toggleLanguage();
        });
        
        // النصائح
        document.getElementById('newAdviceBtn').addEventListener('click', () => {
            this.showRandomAdvice();
        });
        
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.showPreviousAdvice();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.showNextAdvice();
        });
        
        // المفضلة
        document.getElementById('cardFavoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });
        
        document.getElementById('favoritesBtn').addEventListener('click', () => {
            this.showFavoritesSection();
        });
        
        // معلومات طبية
        document.getElementById('medicalBtn').addEventListener('click', () => {
            this.showMedicalInfo();
        });
    },
    
    // عرض نصيحة عشوائية
    showRandomAdvice() {
        const oldIndex = this.data.currentIndex;
        let newIndex;
        
        // التأكد من عرض نصيحة مختلفة
        do {
            newIndex = Math.floor(Math.random() * this.advices.length);
        } while (newIndex === oldIndex && this.advices.length > 1);
        
        this.data.currentIndex = newIndex;
        this.displayCurrentAdvice();
        
        // تحديث الإحصائيات
        this.updateStats();
    },
    
    // عرض النصيحة السابقة
    showPreviousAdvice() {
        let prevIndex = this.data.currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.advices.length - 1;
        }
        this.data.currentIndex = prevIndex;
        this.displayCurrentAdvice();
    },
    
    // عرض النصيحة التالية
    showNextAdvice() {
        let nextIndex = this.data.currentIndex + 1;
        if (nextIndex >= this.advices.length) {
            nextIndex = 0;
        }
        this.data.currentIndex = nextIndex;
        this.displayCurrentAdvice();
    },
    
    // عرض النصيحة الحالية
    displayCurrentAdvice() {
        const advice = this.advices[this.data.currentIndex];
        
        // تحديث الواجهة
        document.getElementById('adviceText').textContent = advice.text;
        document.getElementById('adviceCategory').textContent = advice.category;
        document.getElementById('adviceIcon').className = `fas ${advice.icon}`;
        document.getElementById('adviceSource').textContent = advice.source;
        document.getElementById('viewsCount').textContent = advice.views + 1;
        document.getElementById('likesCount').textContent = advice.likes;
        
        // تحديث زر المفضلة
        const favBtn = document.getElementById('cardFavoriteBtn');
        const isFavorite = this.data.favorites.has(advice.id);
        if (isFavorite) {
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
            favBtn.classList.add('active');
        } else {
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.classList.remove('active');
        }
        
        // زيادة المشاهدات
        advice.views++;
        this.data.stats.totalViews++;
        
        // تأثير مرئي
        const card = document.getElementById('adviceCard');
        card.classList.remove('fade-in');
        void card.offsetWidth;
        card.classList.add('fade-in');
        
        // حفظ البيانات
        this.saveData();
    },
    
    // تبديل المفضلة
    toggleFavorite() {
        const advice = this.advices[this.data.currentIndex];
        const isFavorite = this.data.favorites.has(advice.id);
        
        if (isFavorite) {
            this.data.favorites.delete(advice.id);
            this.showNotification('تمت الإزالة من المفضلة', 'info');
        } else {
            this.data.favorites.add(advice.id);
            advice.likes++;
            this.data.stats.totalLikes++;
            this.showNotification('تمت الإضافة للمفضلة ⭐', 'success');
        }
        
        // تحديث الواجهة
        const favBtn = document.getElementById('cardFavoriteBtn');
        if (this.data.favorites.has(advice.id)) {
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
            favBtn.classList.add('active');
        } else {
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.classList.remove('active');
        }
        
        // تحديث عرض المفضلة
        this.updateFavoritesDisplay();
        
        // حفظ البيانات
        this.saveData();
    },
    
    // تحديث عرض المفضلة
    updateFavoritesDisplay() {
        const container = document.getElementById('favoritesContainer');
        
        if (this.data.favorites.size === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="far fa-star"></i>
                    <p>لا توجد نصائح مفضلة بعد</p>
                    <small>اضغط على زر النجم لإضافة نصائح للمفضلة</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.data.favorites.forEach(id => {
            const advice = this.advices.find(a => a.id === id);
            if (advice) {
                html += `
                    <div class="favorite-item">
                        <div class="favorite-text">${advice.text}</div>
                        <button class="remove-fav" onclick="App.removeFavorite(${advice.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        });
        
        container.innerHTML = html;
    },
    
    // إزالة من المفضلة
    removeFavorite(id) {
        this.data.favorites.delete(id);
        this.updateFavoritesDisplay();
        this.saveData();
        
        // إذا كانت النصيحة الحالية هي التي أزيلت
        const currentAdvice = this.advices[this.data.currentIndex];
        if (currentAdvice.id === id) {
            const favBtn = document.getElementById('cardFavoriteBtn');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.classList.remove('active');
        }
        
        this.showNotification('تمت الإزالة من المفضلة', 'info');
    },
    
    // عرض قسم المفضلة
    showFavoritesSection() {
        document.getElementById('favoritesSection').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('sidebar').classList.remove('active');
    },
    
    // عرض معلومات طبية
    showMedicalInfo() {
        const info = `
            <div class="medical-info">
                <h4><i class="fas fa-info-circle"></i> معلومات طبية مهمة:</h4>
                <ul>
                    <li>هذا الموقع لأغراض تثقيفية وتوعوية فقط</li>
                    <li>لا يغني عن استشارة الطبيب المتخصص</li>
                    <li>جميع النصائح من مصادر طبية موثوقة</li>
                    <li>للحالات الطارئة: اتصل بالإسعاف (٩١١)</li>
                </ul>
            </div>
        `;
        
        this.showNotification(info, 'info', 8000);
        document.getElementById('sidebar').classList.remove('active');
    },
    
    // تبديل اللغة
    toggleLanguage(showNotification = true) {
        this.data.isArabic = !this.data.isArabic;
        
        // تحديث زر اللغة
        const langBtn = document.getElementById('langToggle');
        langBtn.querySelector('span').textContent = this.data.isArabic ? 'EN' : 'AR';
        
        // تغيير اتجاه النص
        document.body.style.direction = this.data.isArabic ? 'rtl' : 'ltr';
        document.documentElement.lang = this.data.isArabic ? 'ar' : 'en';
        
        // تحديث النصوص
        this.updateLanguageTexts();
        
        // حفظ البيانات
        this.saveData();
        
        if (showNotification) {
            const message = this.data.isArabic ? 
                'تم التبديل إلى اللغة العربية' : 
                'Switched to English';
            this.showNotification(message, 'info');
        }
    },
    
    // تحديث النصوص حسب اللغة
    updateLanguageTexts() {
        const elements = {
            'newAdviceBtn': { ar: 'نصيحة جديدة', en: 'New Tip' },
            'prevBtn': { ar: 'السابق', en: 'Previous' },
            'nextBtn': { ar: 'التالي', en: 'Next' },
            'favoritesBtn': { ar: 'المفضلة', en: 'Favorites' },
            'medicalBtn': { ar: 'معلومات طبية', en: 'Medical Info' },
            'contact-link': { ar: 'تواصل معنا', en: 'Contact Us' }
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id) || 
                           document.querySelector(`.${id}`);
            if (element) {
                const textElement = element.querySelector('span') || element;
                const translation = elements[id][this.data.isArabic ? 'ar' : 'en'];
                
                if (textElement.tagName === 'SPAN') {
                    textElement.textContent = translation;
                } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    const span = element.querySelector('span');
                    if (span) {
                        span.textContent = translation;
                    }
                }
            }
        });
    },
    
    // تحديث الإحصائيات
    updateStats() {
        // يمكن إضافة المزيد هنا إذا لزم الأمر
        this.saveData();
    },
    
    // عرض الإشعارات البسيطة
    showNotification(message, type = 'info', duration = 3000) {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
        `;
        
        // إضافة الأنماط
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 255, 157, 0.1)' : 
                          type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 
                          'rgba(0, 212, 255, 0.1)'};
            border: 1px solid ${type === 'success' ? '#00ff9d' : 
                                type === 'error' ? '#ff4444' : 
                                '#00d4ff'};
            color: white;
            padding: 1rem;
            border-radius: 12px;
            z-index: 1000;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        // إزالة بعد المدة المحددة
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
};

// إضافة أنماط للرسوم المتحركة
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        animation: fadeIn 0.3s ease;
    }
    
    .medical-info {
        text-align: right;
    }
    
    .medical-info h4 {
        margin-bottom: 10px;
        color: #00d4ff;
    }
    
    .medical-info ul {
        list-style: none;
        padding-right: 20px;
    }
    
    .medical-info li {
        margin-bottom: 8px;
        padding-right: 10px;
        position: relative;
    }
    
    .medical-info li:before {
        content: "•";
        color: #00ff9d;
        position: absolute;
        right: -15px;
    }
`;
document.head.appendChild(animationStyles);

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// جعل التطبيق متاحاً عالمياً
window.App = App;