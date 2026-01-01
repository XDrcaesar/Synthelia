// ==============================================
// Synthelia - النظام الصحي الذكي
// إصدار 3.0 - نظام متكامل مع تحكم صوتي متقدم
// ==============================================

// حالة التطبيق
const Synthelia = {
    // الإعدادات
    settings: {
        language: 'ar',
        darkMode: true,
        notifications: true,
        soundEnabled: true,
        autoPlay: false,
        volume: 0.5,
        dailyGoal: 10
    },
    
    // البيانات
    data: {
        advices: [
            {
                id: 1,
                text: "💧 اشرب 2 لتر من الماء يومياً للحفاظ على ترطيب الجسم وتحسين وظائف الأعضاء الحيوية.",
                category: "الصحة العامة",
                icon: "fa-tint",
                source: "منظمة الصحة العالمية",
                likes: 0,
                views: 0
            },
            {
                id: 2,
                text: "😴 احصل على 7-8 ساعات نوم يومياً لتعزيز الذاكرة وتحسين الصحة العقلية والجسدية.",
                category: "النوم",
                icon: "fa-bed",
                source: "مؤسسة النوم الوطنية",
                likes: 0,
                views: 0
            },
            {
                id: 3,
                text: "🏃‍♂️ مارس الرياضة 30 دقيقة يومياً لتقليل خطر الأمراض المزمنة مثل السكري وأمراض القلب.",
                category: "اللياقة",
                icon: "fa-running",
                source: "الجمعية الأمريكية للقلب",
                likes: 0,
                views: 0
            },
            {
                id: 4,
                text: "🧼 اغسل يديك لمدة 20 ثانية بالماء والصابون للقضاء على الجراثيم والفيروسات.",
                category: "النظافة",
                icon: "fa-hands-wash",
                source: "مراكز السيطرة على الأمراض",
                likes: 0,
                views: 0
            },
            {
                id: 5,
                text: "🥦 تناول 5 حصص من الخضار والفواكه يومياً لتعزيز المناعة والوقاية من الأمراض.",
                category: "التغذية",
                icon: "fa-apple-alt",
                source: "منظمة الصحة العالمية",
                likes: 0,
                views: 0
            },
            {
                id: 6,
                text: "🚭 تجنب التدخين والتدخين السلبي لحماية رئتيك وجهازك التنفسي من الأمراض.",
                category: "الصحة الوقائية",
                icon: "fa-smoking-ban",
                source: "الجمعية الأمريكية للسرطان",
                likes: 0,
                views: 0
            },
            {
                id: 7,
                text: "🩺 قم بفحص ضغط الدم بانتظام للكشف المبكر عن ارتفاع الضغط وعلاجه.",
                category: "الصحة الوقائية",
                icon: "fa-heartbeat",
                source: "الجمعية الأمريكية للقلب",
                likes: 0,
                views: 0
            },
            {
                id: 8,
                text: "☀️ تعرض لأشعة الشمس 10-15 دقيقة يومياً للحصول على فيتامين د الضروري للعظام.",
                category: "الصحة العامة",
                icon: "fa-sun",
                source: "المعاهد الوطنية للصحة",
                likes: 0,
                views: 0
            },
            {
                id: 9,
                text: "🧘‍♀️ خصص وقتاً للاسترخاء والتأمل لتقليل التوتر وتحسين الصحة النفسية.",
                category: "الصحة النفسية",
                icon: "fa-spa",
                source: "الجمعية الأمريكية للطب النفسي",
                likes: 0,
                views: 0
            },
            {
                id: 10,
                text: "🍎 قلل من تناول السكريات المصنعة للحفاظ على مستوى سكر طبيعي ومنع السكري.",
                category: "التغذية",
                icon: "fa-candy-cane",
                source: "جمعية السكري الأمريكية",
                likes: 0,
                views: 0
            }
        ],
        
        favorites: new Set(),
        history: [],
        stats: {
            totalViews: 0,
            totalLikes: 0,
            totalFavorites: 0,
            streakDays: 0,
            achievements: 0,
            lastVisit: null,
            healthScore: 85
        },
        
        current: {
            adviceIndex: 0,
            isSpeaking: false,
            speech: null,
            autoPlayInterval: null,
            searchResults: []
        }
    },
    
    // التحكم الصوتي
    audio: {
        isPlaying: false,
        volume: 0.5,
        rate: 0.9,
        pitch: 1,
        
        // تشغيل النص
        speak(text) {
            this.stop();
            
            if (!Synthelia.settings.soundEnabled) return;
            
            if ('speechSynthesis' in window) {
                Synthelia.data.current.speech = new SpeechSynthesisUtterance(text);
                Synthelia.data.current.speech.lang = Synthelia.settings.language === 'ar' ? 'ar-SA' : 'en-US';
                Synthelia.data.current.speech.volume = this.volume;
                Synthelia.data.current.speech.rate = this.rate;
                Synthelia.data.current.speech.pitch = this.pitch;
                
                Synthelia.data.current.speech.onstart = () => {
                    Synthelia.data.current.isSpeaking = true;
                    Synthelia.updateAudioUI();
                    Synthelia.showNotification('جاري قراءة النصيحة...', 'info');
                };
                
                Synthelia.data.current.speech.onend = () => {
                    Synthelia.data.current.isSpeaking = false;
                    Synthelia.updateAudioUI();
                };
                
                Synthelia.data.current.speech.onerror = () => {
                    Synthelia.data.current.isSpeaking = false;
                    Synthelia.updateAudioUI();
                    Synthelia.showNotification('حدث خطأ في القراءة الصوتية', 'error');
                };
                
                speechSynthesis.speak(Synthelia.data.current.speech);
            }
        },
        
        // إيقاف مؤقت
        pause() {
            if (speechSynthesis.speaking && !speechSynthesis.paused) {
                speechSynthesis.pause();
                Synthelia.data.current.isSpeaking = false;
                Synthelia.updateAudioUI();
                Synthelia.showNotification('تم إيقاف الصوت مؤقتاً', 'info');
            }
        },
        
        // استئناف
        resume() {
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
                Synthelia.data.current.isSpeaking = true;
                Synthelia.updateAudioUI();
                Synthelia.showNotification('جاري استئناف الصوت...', 'info');
            }
        },
        
        // إيقاف كامل
        stop() {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                Synthelia.data.current.isSpeaking = false;
                Synthelia.updateAudioUI();
            }
        },
        
        // تغيير الصوت
        setVolume(volume) {
            this.volume = volume;
            if (Synthelia.data.current.speech) {
                Synthelia.data.current.speech.volume = volume;
            }
            Synthelia.settings.volume = volume;
            Synthelia.saveData();
        }
    },
    
    // التهيئة
    init() {
        console.log('🏥 Synthelia - جاري التهيئة...');
        
        this.loadData();
        this.setupEventListeners();
        this.updateTime();
        this.showRandomAdvice();
        this.updateUI();
        this.checkStreak();
        
        // تحديث الوقت كل ثانية
        setInterval(() => this.updateTime(), 1000);
        
        // تحديث الحالة الصحية
        setInterval(() => this.updateHealthScore(), 60000);
        
        console.log('✅ Synthelia - النظام جاهز للعمل');
        this.showNotification('مرحباً بك في Synthelia! 🏥', 'success');
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // القائمة
        document.getElementById('navTrigger').addEventListener('click', () => {
            document.getElementById('smartNav').classList.add('active');
        });
        
        document.getElementById('navClose').addEventListener('click', () => {
            document.getElementById('smartNav').classList.remove('active');
        });
        
        // التحكم الصوتي
        document.getElementById('audioPlay').addEventListener('click', () => {
            if (Synthelia.data.current.isSpeaking && speechSynthesis.paused) {
                Synthelia.audio.resume();
            } else if (!Synthelia.data.current.isSpeaking) {
                const advice = Synthelia.data.advices[Synthelia.data.current.adviceIndex];
                Synthelia.audio.speak(advice.text);
            }
        });
        
        document.getElementById('audioPause').addEventListener('click', () => {
            Synthelia.audio.pause();
        });
        
        document.getElementById('audioStop').addEventListener('click', () => {
            Synthelia.audio.stop();
        });
        
        // التحكم في الصوت
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            Synthelia.audio.setVolume(volume);
            document.getElementById('volumeValue').textContent = `${Math.round(volume * 100)}%`;
        });
        
        // النصائح
        document.getElementById('newAdviceBtn').addEventListener('click', () => {
            Synthelia.showRandomAdvice();
            Synthelia.showNotification('تم عرض نصيحة جديدة! 💡', 'success');
        });
        
        document.getElementById('prevAdviceBtn').addEventListener('click', () => {
            Synthelia.showPreviousAdvice();
        });
        
        document.getElementById('nextAdviceBtn').addEventListener('click', () => {
            Synthelia.showNextAdvice();
        });
        
        // المفضلة
        document.getElementById('favoriteAdviceBtn').addEventListener('click', () => {
            Synthelia.toggleFavorite();
        });
        
        document.getElementById('clearFavorites').addEventListener('click', () => {
            Synthelia.clearFavorites();
        });
        
        // المشاركة
        document.getElementById('shareAdviceBtn').addEventListener('click', () => {
            Synthelia.shareAdvice();
        });
        
        // النسخ
        document.getElementById('copyAdviceBtn').addEventListener('click', () => {
            Synthelia.copyAdvice();
        });
        
        // الصوت من البطاقة
        document.getElementById('soundAdviceBtn').addEventListener('click', () => {
            if (Synthelia.data.current.isSpeaking) {
                Synthelia.audio.stop();
                Synthelia.showNotification('تم إيقاف الصوت', 'info');
            } else {
                const advice = Synthelia.data.advices[Synthelia.data.current.adviceIndex];
                Synthelia.audio.speak(advice.text);
            }
        });
        
        // البحث
        document.getElementById('medicalSearch').addEventListener('input', (e) => {
            Synthelia.searchAdvices(e.target.value);
        });
        
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('medicalSearch').value;
            Synthelia.searchAdvices(query);
        });
        
        // الإعدادات
        document.getElementById('autoPlayToggle').addEventListener('change', (e) => {
            Synthelia.settings.autoPlay = e.target.checked;
            Synthelia.saveData();
        });
        
        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            Synthelia.settings.darkMode = e.target.checked;
            document.body.classList.toggle('light-mode', !e.target.checked);
            Synthelia.saveData();
        });
        
        document.getElementById('notificationsToggle').addEventListener('change', (e) => {
            Synthelia.settings.notifications = e.target.checked;
            Synthelia.saveData();
        });
        
        document.getElementById('soundEffectsToggle').addEventListener('change', (e) => {
            Synthelia.settings.soundEnabled = e.target.checked;
            Synthelia.saveData();
        });
        
        // اللغة
        document.querySelectorAll('.language-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                Synthelia.changeLanguage(lang);
            });
        });
        
        // التواصل
        document.getElementById('emergencyBtn').addEventListener('click', () => {
            Synthelia.showEmergencyContact();
        });
        
        document.getElementById('contactUsBtn').addEventListener('click', () => {
            Synthelia.contactSupport();
        });
        
        // النشرة البريدية
        document.getElementById('newsletterForm').addEventListener('submit', (e) => {
            e.preventDefault();
            Synthelia.subscribeNewsletter();
        });
        
        // زر العودة للأعلى
        document.getElementById('scrollToTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            const scrollBtn = document.getElementById('scrollToTop');
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // إغلاق القائمة بالضغط خارجها
        document.addEventListener('click', (e) => {
            const nav = document.getElementById('smartNav');
            const trigger = document.getElementById('navTrigger');
            
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !trigger.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    },
    
    // تحميل البيانات
    loadData() {
        // الإعدادات
        const savedSettings = localStorage.getItem('synthelia_settings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // الإحصائيات
        const savedStats = localStorage.getItem('synthelia_stats');
        if (savedStats) {
            this.data.stats = { ...this.data.stats, ...JSON.parse(savedStats) };
        }
        
        // المفضلة
        const savedFavorites = localStorage.getItem('synthelia_favorites');
        if (savedFavorites) {
            this.data.favorites = new Set(JSON.parse(savedFavorites));
        }
        
        // التاريخ
        const savedHistory = localStorage.getItem('synthelia_history');
        if (savedHistory) {
            this.data.history = JSON.parse(savedHistory);
        }
        
        // تطبيق الإعدادات
        this.applySettings();
    },
    
    // حفظ البيانات
    saveData() {
        localStorage.setItem('synthelia_settings', JSON.stringify(this.settings));
        localStorage.setItem('synthelia_stats', JSON.stringify(this.data.stats));
        localStorage.setItem('synthelia_favorites', JSON.stringify([...this.data.favorites]));
        localStorage.setItem('synthelia_history', JSON.stringify(this.data.history));
    },
    
    // تطبيق الإعدادات
    applySettings() {
        // الصوت
        this.audio.volume = this.settings.volume;
        document.getElementById('volumeSlider').value = this.settings.volume;
        document.getElementById('volumeValue').textContent = `${Math.round(this.settings.volume * 100)}%`;
        
        // السمة
        if (!this.settings.darkMode) {
            document.body.classList.add('light-mode');
        }
        
        // اللغة
        if (this.settings.language === 'en') {
            this.changeLanguage('en', false);
        }
        
        // تحديث عناصر الإعدادات
        document.getElementById('autoPlayToggle').checked = this.settings.autoPlay;
        document.getElementById('darkModeToggle').checked = this.settings.darkMode;
        document.getElementById('notificationsToggle').checked = this.settings.notifications;
        document.getElementById('soundEffectsToggle').checked = this.settings.soundEnabled;
    },
    
    // تغيير اللغة
    changeLanguage(lang, showNotification = true) {
        this.settings.language = lang;
        
        // تحديث الأزرار
        document.querySelectorAll('.language-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // تغيير اتجاه النص
        document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // تحديث النصوص
        this.updateLanguageTexts(lang);
        
        // حفظ البيانات
        this.saveData();
        
        if (showNotification) {
            const message = lang === 'ar' ? 'تم التبديل إلى اللغة العربية' : 'Switched to English';
            this.showNotification(message, 'info');
        }
    },
    
    // تحديث النصوص حسب اللغة
    updateLanguageTexts(lang) {
        const translations = {
            'navTrigger': { ar: 'القائمة', en: 'Menu' },
            'newAdviceBtn': { ar: 'نصيحة جديدة', en: 'New Tip' },
            'prevAdviceBtn': { ar: 'السابق', en: 'Previous' },
            'nextAdviceBtn': { ar: 'التالي', en: 'Next' },
            'adviceTitle': { ar: 'نصيحة صحية اليوم', en: 'Health Tip of the Day' },
            'medicalSearch': { ar: 'ابحث عن نصيحة طبية أو موضوع صحي...', en: 'Search for medical tips or health topics...' }
        };
        
        Object.keys(translations).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'medicalSearch') {
                    element.placeholder = translations[id][lang];
                } else if (element.tagName === 'BUTTON') {
                    const textElement = element.querySelector('span') || element;
                    if (textElement) {
                        textElement.textContent = translations[id][lang];
                    }
                } else {
                    element.textContent = translations[id][lang];
                }
            }
        });
    },
    
    // عرض نصيحة عشوائية
    showRandomAdvice() {
        const oldIndex = this.data.current.adviceIndex;
        let newIndex;
        
        // التأكد من نصيحة مختلفة
        do {
            newIndex = Math.floor(Math.random() * this.data.advices.length);
        } while (newIndex === oldIndex && this.data.advices.length > 1);
        
        this.data.current.adviceIndex = newIndex;
        this.displayAdvice(newIndex);
        
        // إضافة للسجل
        this.addToHistory(newIndex);
        
        // تحديث الإحصائيات
        this.updateStats();
        
        // حفظ البيانات
        this.saveData();
    },
    
    // عرض النصيحة التالية
    showNextAdvice() {
        let nextIndex = this.data.current.adviceIndex + 1;
        if (nextIndex >= this.data.advices.length) {
            nextIndex = 0;
        }
        this.data.current.adviceIndex = nextIndex;
        this.displayAdvice(nextIndex);
        this.addToHistory(nextIndex);
    },
    
    // عرض النصيحة السابقة
    showPreviousAdvice() {
        let prevIndex = this.data.current.adviceIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.data.advices.length - 1;
        }
        this.data.current.adviceIndex = prevIndex;
        this.displayAdvice(prevIndex);
        this.addToHistory(prevIndex);
    },
    
    // عرض نصيحة محددة
    displayAdvice(index) {
        const advice = this.data.advices[index];
        
        // إيقاف الصوت
        this.audio.stop();
        
        // تحديث الواجهة
        document.getElementById('adviceText').textContent = advice.text;
        document.getElementById('adviceCategory').innerHTML = `
            <i class="fas fa-tag"></i>
            ${advice.category}
        `;
        document.getElementById('adviceIcon').innerHTML = `<i class="fas ${advice.icon}"></i>`;
        document.getElementById('adviceSource').textContent = advice.source;
        document.getElementById('adviceId').textContent = advice.id;
        document.getElementById('viewsCount').textContent = advice.views + 1;
        document.getElementById('likesCount').textContent = advice.likes;
        
        // تحديث تاريخ النصيحة
        const now = new Date();
        const dateStr = now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('adviceDate').textContent = dateStr;
        
        // تحديث زر المفضلة
        const favBtn = document.getElementById('favoriteAdviceBtn');
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
        
        // تحديث شريط التقدم
        this.updateProgressBar();
        
        // تأثير مرئي
        const card = document.querySelector('.advice-container');
        card.style.opacity = '0.8';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 200);
    },
    
    // إضافة للسجل
    addToHistory(index) {
        const advice = this.data.advices[index];
        this.data.history.push({
            id: advice.id,
            timestamp: new Date().toISOString(),
            advice: advice.text
        });
        
        // الحفاظ على آخر 20 نصيحة
        if (this.data.history.length > 20) {
            this.data.history.shift();
        }
    },
    
    // تبديل المفضلة
    toggleFavorite() {
        const advice = this.data.advices[this.data.current.adviceIndex];
        const isFavorite = this.data.favorites.has(advice.id);
        
        if (isFavorite) {
            this.data.favorites.delete(advice.id);
            this.data.stats.totalFavorites--;
            this.showNotification('تمت الإزالة من المفضلة', 'info');
        } else {
            this.data.favorites.add(advice.id);
            this.data.stats.totalFavorites++;
            advice.likes++;
            this.data.stats.totalLikes++;
            this.showNotification('تمت الإضافة للمفضلة ⭐', 'success');
        }
        
        // تحديث الواجهة
        const favBtn = document.getElementById('favoriteAdviceBtn');
        if (this.data.favorites.has(advice.id)) {
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
            favBtn.classList.add('active');
        } else {
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.classList.remove('active');
        }
        
        // تحديث المفضلة
        this.updateFavoritesList();
        
        // حفظ البيانات
        this.saveData();
        this.updateUI();
    },
    
    // تحديث قائمة المفضلة
    updateFavoritesList() {
        const container = document.getElementById('favoritesList');
        
        if (this.data.favorites.size === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="far fa-star"></i>
                    <p>لا توجد نصائح مفضلة بعد</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.data.favorites.forEach(id => {
            const advice = this.data.advices.find(a => a.id === id);
            if (advice) {
                html += `
                    <div class="favorite-item" data-id="${advice.id}">
                        <div class="fav-icon">
                            <i class="fas ${advice.icon}"></i>
                        </div>
                        <div class="fav-content">
                            <p class="fav-text">${advice.text.substring(0, 60)}...</p>
                            <span class="fav-category">${advice.category}</span>
                        </div>
                        <button class="remove-fav" onclick="Synthelia.removeFavorite(${advice.id})">
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
        this.data.stats.totalFavorites--;
        this.updateFavoritesList();
        this.saveData();
        this.showNotification('تمت الإزالة من المفضلة', 'info');
        
        // إذا كانت النصيحة الحالية هي التي أزيلت
        const currentAdvice = this.data.advices[this.data.current.adviceIndex];
        if (currentAdvice.id === id) {
            const favBtn = document.getElementById('favoriteAdviceBtn');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.classList.remove('active');
        }
    },
    
    // مسح المفضلة
    clearFavorites() {
        if (this.data.favorites.size > 0) {
            if (confirm('هل تريد مسح جميع النصائح المفضلة؟')) {
                this.data.favorites.clear();
                this.data.stats.totalFavorites = 0;
                this.updateFavoritesList();
                this.saveData();
                
                // تحديث زر المفضلة الحالي
                const favBtn = document.getElementById('favoriteAdviceBtn');
                favBtn.innerHTML = '<i class="far fa-star"></i>';
                favBtn.classList.remove('active');
                
                this.showNotification('تم مسح المفضلة', 'info');
            }
        }
    },
    
    // مشاركة النصيحة
    shareAdvice() {
        const advice = this.data.advices[this.data.current.adviceIndex];
        const text = `${advice.text}\n\nمن تطبيق Synthelia - الذكاء الصحي المتطور`;
        
        if (navigator.share) {
            navigator.share({
                title: 'نصيحة صحية من Synthelia',
                text: text,
                url: window.location.href
            }).then(() => {
                this.showNotification('تمت المشاركة بنجاح', 'success');
            }).catch(() => {
                this.copyToClipboard(text);
            });
        } else {
            this.copyToClipboard(text);
        }
    },
    
    // نسخ النصيحة
    copyAdvice() {
        const advice = this.data.advices[this.data.current.adviceIndex];
        const text = `${advice.text}\n\nمصدر: ${advice.source}\nمن Synthelia`;
        
        this.copyToClipboard(text);
    },
    
    // نسخ إلى الحافظة
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                this.showNotification('تم نسخ النصيحة 📋', 'success');
            })
            .catch(() => {
                this.showNotification('فشل النسخ', 'error');
            });
    },
    
    // البحث
    searchAdvices(query) {
        if (!query.trim()) {
            document.getElementById('searchSuggestions').classList.remove('active');
            return;
        }
        
        const results = this.data.advices.filter(advice => 
            advice.text.toLowerCase().includes(query.toLowerCase()) ||
            advice.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const suggestions = document.getElementById('searchSuggestions');
        
        if (results.length > 0) {
            let html = '';
            results.forEach(advice => {
                html += `
                    <div class="suggestion-item" onclick="Synthelia.selectSearchResult(${advice.id})">
                        <i class="fas ${advice.icon}"></i>
                        <div>
                            <div class="suggestion-text">${advice.text.substring(0, 80)}...</div>
                            <div class="suggestion-category">${advice.category}</div>
                        </div>
                    </div>
                `;
            });
            
            suggestions.innerHTML = html;
            suggestions.classList.add('active');
        } else {
            suggestions.innerHTML = `
                <div class="suggestion-item">
                    <i class="fas fa-search"></i>
                    <div>لا توجد نتائج للبحث</div>
                </div>
            `;
            suggestions.classList.add('active');
        }
    },
    
    // اختيار نتيجة بحث
    selectSearchResult(id) {
        const index = this.data.advices.findIndex(a => a.id === id);
        if (index !== -1) {
            this.data.current.adviceIndex = index;
            this.displayAdvice(index);
            this.addToHistory(index);
            document.getElementById('searchSuggestions').classList.remove('active');
            document.getElementById('medicalSearch').value = '';
            this.showNotification('تم عرض نتيجة البحث', 'success');
        }
    },
    
    // تحديث الوقت
    updateTime() {
        const now = new Date();
        
        // الوقت
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        };
        const timeStr = now.toLocaleTimeString('ar-SA', timeOptions);
        document.getElementById('liveTime').querySelector('span').textContent = timeStr;
        
        // التاريخ
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('ar-SA', dateOptions);
        document.getElementById('adviceDate').textContent = dateStr;
    },
    
    // تحديث الواجهة
    updateUI() {
        // الإحصائيات
        document.getElementById('totalAdvices').textContent = this.data.stats.totalViews;
        document.getElementById('favoritesCount').textContent = this.data.favorites.size;
        document.getElementById('streakCount').textContent = this.data.stats.streakDays;
        document.getElementById('achievementsCount').textContent = this.data.stats.achievements;
        document.getElementById('healthScore').textContent = `${this.data.stats.healthScore}%`;
        
        // حالة الصوت
        this.updateAudioUI();
    },
    
    // تحديث واجهة الصوت
    updateAudioUI() {
        const audioStatus = document.getElementById('audioStatus');
        const audioPlay = document.getElementById('audioPlay');
        const soundBtn = document.getElementById('soundAdviceBtn');
        
        if (this.data.current.isSpeaking) {
            audioStatus.innerHTML = '<i class="fas fa-volume-up"></i><span>جاري القراءة</span>';
            audioStatus.style.color = 'var(--accent-green)';
            
            if (audioPlay) {
                audioPlay.innerHTML = '<i class="fas fa-play"></i><span>استئناف</span>';
            }
            
            if (soundBtn) {
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        } else {
            audioStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>جاهز</span>';
            audioStatus.style.color = 'var(--accent-green)';
            
            if (audioPlay) {
                audioPlay.innerHTML = '<i class="fas fa-play"></i><span>تشغيل</span>';
            }
            
            if (soundBtn) {
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
    },
    
    // تحديث الإحصائيات
    updateStats() {
        // تحديث صحة المستخدم
        const activityScore = Math.min(100, Math.floor(this.data.stats.totalViews / 10) * 5 + 70);
        const favoritesScore = Math.min(30, this.data.favorites.size * 5);
        const streakScore = Math.min(20, this.data.stats.streakDays * 3);
        
        this.data.stats.healthScore = activityScore + favoritesScore + streakScore;
        
        // تحديث الإنجازات
        this.updateAchievements();
        
        // تحديث الواجهة
        this.updateUI();
    },
    
    // التحقق من التتابع
    checkStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.data.stats.lastVisit ? new Date(this.data.stats.lastVisit).toDateString() : null;
        
        if (lastVisit === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastVisit === yesterday.toDateString()) {
            this.data.stats.streakDays++;
        } else if (lastVisit && lastVisit !== today) {
            this.data.stats.streakDays = 1;
        } else {
            this.data.stats.streakDays = 1;
        }
        
        this.data.stats.lastVisit = new Date().toISOString();
        this.saveData();
    },
    
    // تحديث الإنجازات
    updateAchievements() {
        let achievements = 0;
        
        if (this.data.stats.totalViews >= 5) achievements++;
        if (this.data.stats.totalViews >= 10) achievements++;
        if (this.data.favorites.size >= 3) achievements++;
        if (this.data.stats.streakDays >= 3) achievements++;
        if (this.data.stats.totalViews >= this.data.advices.length) achievements++;
        
        this.data.stats.achievements = achievements;
    },
    
    // تحديث صحة المستخدم
    updateHealthScore() {
        // تقليل الصحة تدريجياً لتحفيز المستخدم
        if (this.data.stats.healthScore > 70) {
            this.data.stats.healthScore -= 1;
            this.updateUI();
            this.saveData();
        }
    },
    
    // تحديث شريط التقدم
    updateProgressBar() {
        const progress = (this.data.stats.totalViews % this.settings.dailyGoal) / this.settings.dailyGoal * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;
    },
    
    // التواصل في حالات الطوارئ
    showEmergencyContact() {
        const message = `
            <strong>للحالات الطارئة:</strong><br>
            1. اتصل بالإسعاف: ٩١١<br>
            2. تواصل مع أقرب مركز صحي<br>
            3. استشر طبيبك المعتمد<br><br>
            <em>هذا الموقع لأغراض توعوية فقط</em>
        `;
        
        this.showNotification(message, 'warning', 10000);
    },
    
    // التواصل مع الدعم
    contactSupport() {
        const telegramLink = 'https://t.me/xbilm';
        window.open(telegramLink, '_blank');
        this.showNotification('جاري فتح تطبيق Telegram...', 'info');
    },
    
    // الاشتراك في النشرة
    subscribeNewsletter() {
        const emailInput = document.querySelector('#newsletterForm input[type="email"]');
        const email = emailInput.value;
        
        if (email && this.validateEmail(email)) {
            // هنا يمكن إضافة كود الإشتراك الحقيقي
            this.showNotification('شكراً للاشتراك في النشرة البريدية! 📧', 'success');
            emailInput.value = '';
        } else {
            this.showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error');
        }
    },
    
    // التحقق من البريد الإلكتروني
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // نظام الإشعارات
    showNotification(message, type = 'info', duration = 5000) {
        if (!this.settings.notifications) return;
        
        const container = document.getElementById('notificationSystem');
        
        // إزالة الإشعارات القديمة
        const notifications = container.querySelectorAll('.notification');
        if (notifications.length >= 3) {
            notifications[0].remove();
        }
        
        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <div class="notification-content">${message}</div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // إضافة حدث الإغلاق
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // إزالة تلقائية
        setTimeout(() => {
            if (notification.parentNode) {
                this.removeNotification(notification);
            }
        }, duration);
    },
    
    // الحصول على أيقونة الإشعار
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // إزالة الإشعار
    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
};

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', () => {
    Synthelia.init();
});

// ===== إضافة الأنماط المفقودة =====
const missingStyles = document.createElement('style');
missingStyles.textContent = `
    .light-mode {
        --dark-1: #FFFFFF;
        --dark-2: #F8FAFC;
        --dark-3: #F1F5F9;
        --dark-4: #E2E8F0;
        --light-1: #1A1A1A;
        --light-2: #2D2D2D;
        --gray-300: #4F4F4F;
        --gray-400: #828282;
        --gray-500: #BDBDBD;
        background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
    }
    
    .light-mode .medical-header {
        background: rgba(255, 255, 255, 0.9);
        border-bottom: 1px solid rgba(10, 140, 138, 0.1);
    }
    
    .light-mode .welcome-message,
    .light-mode .health-status-card,
    .light-mode .advice-container,
    .light-mode .feature-card,
    .light-mode .stats-container,
    .light-mode .blog-container {
        background: rgba(255, 255, 255, 0.8) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(10, 140, 138, 0.1) !important;
    }
    
    .suggestion-item {
        padding: var(--space-sm);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        cursor: pointer;
        transition: var(--transition-fast);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .suggestion-item:hover {
        background: rgba(10, 140, 138, 0.1);
    }
    
    .suggestion-item i {
        color: var(--primary-teal);
        font-size: 1.2rem;
        flex-shrink: 0;
    }
    
    .suggestion-text {
        color: var(--light-1);
        margin-bottom: 2px;
    }
    
    .suggestion-category {
        color: var(--gray-400);
        font-size: 0.8rem;
    }
    
    .empty-favorites {
        text-align: center;
        padding: var(--space-xl);
        color: var(--gray-400);
    }
    
    .empty-favorites i {
        font-size: 3rem;
        margin-bottom: var(--space-sm);
        opacity: 0.5;
    }
    
    .remove-fav {
        background: none;
        border: none;
        color: var(--accent-red);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition-fast);
        flex-shrink: 0;
    }
    
    .remove-fav:hover {
        background: rgba(235, 87, 87, 0.1);
    }
    
    @keyframes slideInLeft {
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse-visual {
        0% { transform: scale(0.8); opacity: 0.8; }
        100% { transform: scale(1.5); opacity: 0; }
    }
    
    @keyframes glow-slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
`;
document.head.appendChild(missingStyles);