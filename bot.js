const mineflayer = require('mineflayer');
const http = require('http');

// ⚙️ إعدادات البوت والسيرفر
const settings = {
  "bot-account": { "username": "boT_abde", "password": "", "type": "offline" },
  "server": { "ip": "5.9.41.143", "port": 28139, "version": "1.21.11" },
  "utils": {
    "auto-auth": { "enabled": true, "password": "abdou.404" },
    "anti-afk": { "enabled": true, "sneak": true },
    "auto-reconnect-delay": 10000
  }
};

// 🌐 1. تشغيل سيرفر الويب أولاً لتأمين استضافة Render ومنع التجميد
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write("Bot is alive 24/7!");
  res.end();
});

server.listen(process.env.PORT || 3000, () => {
  console.log('🌐 [1/2] سيرفر الويب الوهمي استقر بنجاح وتأمن الاتصال مع Render!');
  console.log('⏳ جاري الانتظار 5 ثوانٍ لضمان استقرار الخدمة قبل إطلاق البوت...');
  
  // 🚀 2. إطلاق البوت بعد 5 ثوانٍ من استقرار السيرفر تماماً
  setTimeout(() => {
      createBot();
  }, 5000);
});

function createBot() {
    console.log('🔌 [2/2] جاري إرسال حزم الدخول إلى سيرفر ماينكرافت...');
    
    const bot = mineflayer.createBot({
        host: settings.server.ip,
        port: parseInt(settings.server.port),
        username: settings["bot-account"].username,
        version: settings.server.version,
        auth: 'offline',
        skipValidation: true
    });

    // خدعة تعديل الحزم لتطابق إصدار السيرفر 1.21.11
    bot._client.on('packet', (data, meta) => {
        if (meta.name === 'custom_payload' || meta.name === 'login') {
            bot.version = "1.21.11";
        }
    });

    bot.on('login', () => {
        console.log('🔓 السيرفر قبل الحساب، جاري تخطي الطابور وتحميل العالم...');
    });

    bot.on('spawn', () => {
        console.log('🤖 [نجاح ساحق] البوت اقتحم السيرفر ومنور السباون الآن!');
        
        if (settings.utils["auto-auth"].enabled) {
            setTimeout(() => {
                bot.chat(`/register ${settings.utils["auto-auth"].password} ${settings.utils["auto-auth"].password}`);
                bot.chat(`/login ${settings.utils["auto-auth"].password}`);
            }, 3000);
        }
    });

    bot.on('physicTick', () => {
        if (settings.utils["anti-afk"].enabled && bot.entity) {
            if (Math.random() < 0.03) bot.setControlState('jump', true);
            else bot.setControlState('jump', false);
        }
    });

    bot.on('end', () => {
        console.log('❌ تم الفصل، إعادة الاتصال بعد 10 ثوانٍ...');
        setTimeout(createBot, settings.utils["auto-reconnect-delay"]);
    });

    bot.on('error', (err) => console.log('❌ خطأ في الشبكة:', err.message));
    bot.on('kicked', (reason) => console.log('⚠️ طرد بسبب:', reason));
}
