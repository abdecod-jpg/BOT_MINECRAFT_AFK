const mineflayer = require('mineflayer');
const http = require('http');

// 🌐 سيرفر الويب الوهمي لتأمين الخطة المجانية على Render
http.createServer((req, res) => {
  res.write("Bot is alive 24/7!");
  res.end();
}).listen(process.env.PORT || 3000, () => {
  console.log('🌐 تم تشغيل سيرفر الويب الوهمي بنجاح!');
});

// ⚙️ إعدادات البوت والسيرفر مدمجة بالكامل هنا
const settings = {
  "bot-account": {
    "username": "boT_abde",
    "password": "",
    "type": "offline"
  },
  "server": {
    "ip": "5.9.41.143:28139",
    "port": 28139,
    "version": "1.21"
  },
  "utils": {
    "auto-auth": {
      "enabled": true,
      "password": "abdou.404"
    },
    "anti-afk": {
      "enabled": true,
      "sneak": true
    },
    "auto-reconnect-delay": 5000
  }
};

function createBot() {
    console.log('⏳ جاري محاولة الاتصال بالسيرفر...');
    const bot = mineflayer.createBot({
        host: settings.server.ip,
        port: parseInt(settings.server.port),
        username: settings["bot-account"].username,
        version: settings.server.version
    });

    bot.on('spawn', () => {
        console.log('🤖 البوت دخل السيرفر بنجاح وهو واقف في السباون الآن!');
        
        if (settings.utils["auto-auth"].enabled) {
            setTimeout(() => {
                bot.chat(`/register ${settings.utils["auto-auth"].password} ${settings.utils["auto-auth"].password}`);
                bot.chat(`/login ${settings.utils["auto-auth"].password}`);
            }, 2000);
        }
    });

    bot.on('physicTick', () => {
        if (settings.utils["anti-afk"].enabled) {
            if (Math.random() < 0.05) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
            if (settings.utils["anti-afk"].sneak) {
                bot.setControlState('sneak', Math.random() < 0.5);
            }
        }
    });

    bot.on('end', () => {
        console.log('❌ تم فصل البوت، جاري إعادة الاتصال بعد 5 ثوانٍ...');
        setTimeout(createBot, settings.utils["auto-reconnect-delay"]);
    });

    bot.on('error', (err) => console.log('خطأ في البوت:', err));
}

createBot();
