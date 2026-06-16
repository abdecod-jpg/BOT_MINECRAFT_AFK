const mineflayer = require('mineflayer');
const fs = require('fs');

// قراءة الإعدادات من ملف settings.json
const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));

function createBot() {
    const bot = mineflayer.createBot({
        host: settings.server.ip,
        port: parseInt(settings.server.port),
        username: settings["bot-account"].username,
        version: settings.server.version
    });

    bot.on('spawn', () => {
        console.log('🤖 البوت دخل السيرفر بنجاح وهو واقف في السباون الآن!');
        
        // التحقق من بلجن تسجيل الدخول
        if (settings.utils["auto-auth"].enabled) {
            setTimeout(() => {
                bot.chat(`/register ${settings.utils["auto-auth"].password} ${settings.utils["auto-auth"].password}`);
                bot.chat(`/login ${settings.utils["auto-auth"].password}`);
            }, 2000);
        }
    });

    // الـ Anti-AFK للحركة والتخفي لعدم الطرد
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
        setTimeout(createBot, settings.utils["auto-reconnect-delay"] || 5000);
    });

    bot.on('error', (err) => console.log('خطأ:', err));
}

createBot();
