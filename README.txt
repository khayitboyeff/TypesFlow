TypeFlow Pro — yaxshilangan typing practice sayti
=================================================

ISHGA TUSHIRISH
1. ZIP faylni papkaga chiqaring.
2. index.html faylini brauzerda oching yoki VS Code Live Server ishlating.
3. Asosiy mashq, statistika, kunlik maqsad, tariflar, til va dark mode funksiyalari brauzerda ishlaydi.
4. Ma'lumotlar localStorage'da saqlanadi. Brauzer ma'lumotlarini tozalash tarixni o'chirishi mumkin.

YANGILANISHLAR
- TypeFlow uchun maxsus SVG logo va favicon.
- Mobil va desktop ko'rinish yaxshilandi.
- Navigatsiyadagi belgilar yagona SVG ikonlarga almashtirildi.
- Klaviatura orqali fokus va asosiy kontentga o'tish imkoniyati qo'shildi.
- Telegram bot havolasidagi @ belgisi xatosi tuzatildi.
- .env ichidagi maxfiy ma'lumotlar arxivga kiritilmadi.

OBUNA VA TO'LOV
Tarif kartalari hozircha Telegram botni ochadi. Saytning Pro/Ultra imkoniyatlarini ishonchli
faollashtirish uchun server-side backend va TypeFlow foydalanuvchi identifikatsiyasi kerak.
localStorage haqiqiy to'lov yoki xavfsiz obuna tekshiruvi emas.

XAVFSIZLIK
Yuklangan oldingi arxiv ichida haqiqiy Telegram bot tokeni va karta ma'lumotlari bor edi.
Ular yangi arxivga kiritilmadi. Bot tokeni chatga yoki boshqa joyga chiqib ketgan bo'lishi
mumkinligi sababli, @BotFather orqali eski tokenni bekor qilib, yangisini yarating.
Yangi tokenni faqat o'zingizdagi .env faylida saqlang.
Karta ma'lumotlarini ommaviy kod yoki repozitoriyga joylamang.

Telegram bot username:
app.js ichidagi TYPEFLOW_BOT_USERNAME qiymati. Username'ni @ belgisiz yozing.
