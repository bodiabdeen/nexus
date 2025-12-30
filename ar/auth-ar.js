// قاعدة بيانات التحقيقات الجنائية - وحدة المصادقة
// سيتم تشفير هذا الملف قبل النشر

// بيانات القضايا المشفرة بـ Base64 مع أسماء مجلدات عشوائية آمنة
// الصيغة الجديدة: المجلدات الآن عبارة عن سلاسل عشوائية من 13 حرفًا (يستحيل تخمينها)
const encodedCaseData = "eyJjYXNlcyI6IFt7ImNhc2VOdW1iZXIiOiAiQ0ktMTg2NyIsICJhdXRoQ29kZSI6ICJVNjlLLUxCRzkiLCAiZm9sZGVyIjogImNhc2UtaXJoYjRxc29rZTEwNiJ9LCB7ImNhc2VOdW1iZXIiOiAiQ0ktMjUwNCIsICJhdXRoQ29kZSI6ICI1M0NTLUhYMzAiLCAiZm9sZGVyIjogImNhc2Uta3lwbHpsa3VpZjE3NSJ9LCB7ImNhc2VOdW1iZXIiOiAiQ0ktNDcxNCIsICJhdXRoQ29kZSI6ICJOUjFRLTU5RzciLCAiZm9sZGVyIjogImNhc2UtOGl1empoYTcyYzNiMiJ9XX0=";

// فك تشفير بيانات القضايا
function getCaseDatabase() {
    try {
        const decoded = atob(encodedCaseData);
        return JSON.parse(decoded);
    } catch (e) {
        console.error('خطأ في الوصول إلى قاعدة البيانات');
        return { cases: [] };
    }
}

// تطبيع الإدخال (إزالة المسافات، التحويل إلى أحرف كبيرة)
function normalizeInput(str) {
    return str.replace(/\s+/g, '').toUpperCase();
}

// مصادقة المستخدم
function authenticateCase(caseNumber, authCode) {
    const database = getCaseDatabase();
    const normalizedCaseNum = normalizeInput(caseNumber);
    const normalizedAuthCode = normalizeInput(authCode);
    
    // البحث عن القضية المطابقة
    const matchedCase = database.cases.find(caseData => {
        return normalizeInput(caseData.caseNumber) === normalizedCaseNum &&
               normalizeInput(caseData.authCode) === normalizedAuthCode;
    });
    
    return matchedCase ? matchedCase.folder : null;
}

// التعامل مع إرسال النموذج
function handleAuthentication(event) {
    event.preventDefault();
    
    const button = document.getElementById('accessBtn');
    const errorMessage = document.getElementById('errorMessage');
    const caseNumber = document.getElementById('caseNumber').value;
    const authCode = document.getElementById('authCode').value;
    
    // إخفاء الخطأ السابق
    errorMessage.classList.remove('show');
    
    // حالة المعالجة
    button.classList.add('processing');
    button.innerHTML = '<div class="button-corner tr"></div><div class="button-corner bl"></div>جاري التحقق';
    
    // تسجيل المحاولة (لمراقبة الأمن)
    console.log('محاولة وصول:', {
        timestamp: new Date().toISOString(),
        terminal: document.getElementById('terminalId').textContent
    });
    
    // محاكاة تأخير المصادقة (يجعلها تبدو أكثر أمانًا)
    setTimeout(() => {
        const caseFolder = authenticateCase(caseNumber, authCode);
        
        if (caseFolder) {
            // تم السماح بالوصول
            button.classList.remove('processing');
            button.classList.add('authorized');
            button.innerHTML = '<div class="button-corner tr"></div><div class="button-corner bl"></div>تم السماح بالوصول';
            
            // إعادة التوجيه إلى مجلد القضية بعد تأخير قصير
            setTimeout(() => {
                window.location.href = caseFolder + '/index.html';
            }, 1500);
        } else {
            // تم رفض الوصول
            button.classList.remove('processing');
            button.classList.add('denied');
            button.innerHTML = '<div class="button-corner tr"></div><div class="button-corner bl"></div>تم رفض الوصول';
            errorMessage.classList.add('show');
            
            // إعادة تعيين الزر بعد التأخير
            setTimeout(() => {
                button.classList.remove('denied');
                button.innerHTML = '<div class="button-corner tr"></div><div class="button-corner bl"></div>الوصول إلى السجلات';
            }, 2000);
        }
    }, 1800);
}

// اختياري: إضافة حماية من الهجمات العنيفة
let failedAttempts = 0;
const MAX_ATTEMPTS = 5;

function checkBruteForce() {
    if (failedAttempts >= MAX_ATTEMPTS) {
        alert('محاولات فاشلة كثيرة جدًا. تم قفل النظام للأمان.');
        document.getElementById('accessBtn').disabled = true;
        return false;
    }
    return true;
}
