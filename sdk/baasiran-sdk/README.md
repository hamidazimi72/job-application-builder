<div dir="rtl">

# Baasiran Web SDK



## شروع سریع

اگر می‌خواهید از فایل‌های از پیش کامپایل‌شده استفاده کنید، پس از بیلد کردن پروژه (طبق توضیحات بخش بعد) می‌توانید آن‌ها را در پوشه **dist** پیدا کنید.

---

## استفاده در پلتفرم‌های مختلف

کتابخانه Baasiran برای محیط‌های اجرایی مختلف جاوااسکریپت بهینه‌سازی شده است. برای بهترین عملکرد، نسخه مناسب با پلتفرم خود را import کنید.

### مرورگر (Browser)

```javascript
// روش CommonJS
const Baasiran = require('baasiran-sdk');

// روش ES6 (توصیه می‌شود از نسخه minified استفاده کنید)
import Baasiran from 'baasiran-sdk/dist/baasiran.min.js';
```


### React Native

```javascript
const Baasiran = require('baasiran-sdk/react-native');
```

### مینی‌پروگرام وی‌چت (WeChat)

```javascript
const Baasiran = require('baasiran-sdk/weapp');
```

---

## بیلد کردن پروژه از سورس کد (ساخت دستی)

اگر می‌خواهید پروژه را خودتان بیلد کنید یا تغییراتی در آن ایجاد کرده‌اید، می‌توانید از **Gulp** استفاده کنید.

### ۱. نصب وابستگی‌ها

```bash
npm install
```

### ۲. اجرای دستور بیلد


```bash
# ساخت نسخه مخصوص مرورگر
npm run build:browser

# ساخت تمام نسخه‌ها
npm run build
```

### دستور prepare چیست؟

دستور `npm run prepare` قبل از منتشر پکیج روی npm به‌طور خودکار اجرا می‌شود
و تضمین می‌کند که آخرین نسخه بیلد شده منتشر شود.

### ۳. پیدا کردن فایل‌های خروجی

تمام فایل‌های نهایی در پوشهٔ `dist/` قرار می‌گیرند. به‌عنوان مثال:

* `dist/baasiran.js` (نسخه توسعه برای مرورگر)
* `dist/baasiran.min.js` (نسخه فشرده‌شده برای مرورگر)
* `dist/baasiran.weapp.js` (نسخه مخصوص WeChat)

