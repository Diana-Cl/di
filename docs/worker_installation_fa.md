<h1 align="center">نصب از طریق Cloudflare Workers</h1>

خب اول کد Worker رو از [اینجا](https://github.com/bia-pain-bache/BPB-Worker-Panel/releases/latest/download/worker.js) دانلود کنید، بعد ورکری که ساختید رو Edit code بزنید و از سایدبار سمت چپ فایل‌ worker.js رو delete کنید و فایل جدید رو آپلود کنید، اگر ارور داد فایل package-lock.json رو هم پاک کنید. چون کد خیلی زیاد شده Copy Paste کردن با گوشی خیلی سخت شده، با توجه به عکس زیر آپلود کنید. توی مویایل منوی کناری رو باز کنید و تاح کنید روش نگه دارید و آپلود کنید.

<p align="center">
  <img src="assets/images/Worker_mobile_upload.jpg">
</p>

در نهایت ورکر رو `Save and Deploy` کنید.
حالا از اینجا به داشبورد ورکر برگردید و این مراحل را دنبال کنید:

<p align="center">
  <img src="assets/images/Navigate_worker_dash.jpg">
</p>

اول از بالای داشبورد `Visit` رو بزنید، میبینید ارور داده که اول باید UUID و Trojan Password رو تنظیم کنید، یه لینک داره، داخل مرورگر بازش کنید و بذارید باشه برای مرحله بعد نیاز میشه.

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

از این قسمت وارد صفحه `KV` بشید:

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

تو قسمت KV بزنید `Create a namespace` و یه اسم دلخواه وارد کنید مثلا Test و `Add` کنید.

دوباره از منوی سمت چپ به قسمت `Workers & Pages` برید، ورکری که ساختید رو باز کنید، برید به قسمت `Settings` و `Bindings` رو پیدا کنید. `Add` بزنید و `KV Namespace` رو انتخاب کنید، مطابق تصویر زیر از کشویی پایینی اون KV که ساخته بودید انتخاب کنید (در مثال Test بود). چیزی که مهمه کشویی بالاییه، حتما باید مقدارش رو بذارید `bpb` و `Deploy` کنید.

<p align="center">
  <img src="assets/images/Bind_kv.jpg">
</p>

تو همین قسمت `Settings` بخش `Variables and Secrets` رو میبینید، `Add variable` بزنید خونه اول `UUID` با حروف بزرگ، UUID رو هم میتونید از همون لینکی که باز کرده بودید کپی کنید قسمت Value و `Deploy` کنید. یک بار دیگه `Add variable` بزنید خونه اول `TROJAN_PASS` با حروف بزرگ، پسورد Trojan رو هم میتونید از همون لینک بگیرید و کپی کنید قسمت Value و `Deploy` کنید.

برای مثال، فرض کنید دامنه‌ی ورکر شما هست worker-polished-leaf-d022.workers.dev، یه `panel/` تهش اضافه کنید و وارد پنل بشید. مثال:

> `https://worker-polished-leaf-d022.workers.dev/panel`

ازتون میخواد پسورد جدید بذارید و لاگین کنید و تمام.
نصب به پایان رسیده و توضیحاتی که در ادامه اومده شاید برای عموم لازم نباشه.
آموزشهای تنظیمات و نکات هم که توی [آموزش اصلی](configuration_fa.md) هست.
<br><br>

<h1 align="center">تنظیمات پیشرفته (اختیاری)</h1>

## 1- ثابت کردن Proxy IP:

ما یه مشکلی داریم که این کد به صورت پیشفرض از تعداد زیادی IP Proxy استفاده میکنه که برای هر بار اتصال به سایتای پشت کلادفلر ( شامل بخش وسیعی از وب میشه) به صورت رندوم IP جدیدی انتخاب میکنه و در نتیجه به صورت متناوب IP شما تغییر پیدا میکنه. این تغییر IP شاید برای برخی مشکل ساز باشه (مخصوصا تریدرها). برای تغییر Proxy IP از ورژن 2.3.5 به بعد میتونید از طریق خود پنل انجام بدید، به این ترتیب که اعمال میکنید و ساب رو آپدیت میکنید و تمام. اما توصیه میکنم از روشی که در ادامه توضیح دادم استفاده کنید چون:

> [!CAUTION]
> اگر از طریق پنل Proxy IP رو اعمال کنید و اون IP از کار بیافته، باید یه IP جایگزین کنید و ساب رو آپدیت کنید. معنیش اینه که اگر کانفیگ اهدا کرده باشید و Proxy IP رو تغییر بدید دیگه فایده‌ای نداره چون یوزر ساب نداره که کانفیگ رو آپدیت کنه. بنابراین توصیه میشه از این روش فقط برای مصرف شخصی استفاده کنید. اما خوبی روش دوم که در ادامه میگم اینه که از طریق داشبورد کلادفلر انجام میشه و نیازی به آپدیت کردن کانفیگ‌ها نداره.
> <br><br>

برای تغییر Proxy IP از منوی سمت چپ به قسمت `Workers & Pages` برید، ورکری که ساختید رو باز کنید، برید به قسمت `Settings` و `Variables and Secrets` رو پیدا کنید:

<p align="center">
  <img src="assets/images/Workers_variables.jpg">
</p>

اینجا باید مقادیر رو مشخص کنید. هر بار `Add` میزنید و یه کدوم رو وارد میکنید و `Deploy` میکنید:

<p align="center">
  <img src="assets/images/Workers_add_variables.jpg">
</p>

حالا `Add variable` بزنید خونه اول `PROXYIP` با حروف بزرگ، IP رو هم میتونید از لینک‌ زیر بگیرید، اینا رو باز کنید یه تعدادی IP نشون میده که میتونید کشورشون رو هم چک کنید و یک یا چندتا انتخاب کنید:

> [Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> اگر خواستید چند Proxy IP داشته باشید میتونید با ویرگول وارد کنید، مثل `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`

<br><br>

## 2- اتصال دامنه به Workers:

برای این کار به داشبورد کلادفلر میرید و از قسمت `Workers and Pages` ورکر خودتون رو انتخاب میکنید. به قسمت `Settings` میرید و همون اول `Domains & Routes` رو میبینید، `Add +` رو میزنید و `Custom domain` رو انتخاب میکنید. اینجا ازتون میخواد یه Domain وارد کنید (دقت کنید قبلا باید یه دامنه خریداری کرده باشید و روی همین اکانت فعال کرده باشید که اینجا جای آموزشش نیست). حالا فرض کنید یه دامنه دارید به اسم bpb.com، در قسمت Domain میتونید خود دامنه یا یک زیردامنه دلخواه بزنید. مثلا xyz.bpb.com . بعد هم `Add domain` رو میزنید. کلادفلر خودش میره ورکر رو به دامنه‌ی شما متصل میکنه (یه مدت طول میکشه تا این اتفاق بیافته، خود کلادفلر میگه ممکنه تا 24 ساعت طول بکشه).
بعد باید دوباره `Add +` رو بزنید و این بار `Route` رو بزنید، قسمت Zone که دامنه خودتون رو انتخاب میکنید و در قسمت Route باید اینجوری دامنه جدید رو وارد کنید:

> `*bpb.com/*`

خب بعد از این میتونید از آدرس `https://xyz.bpb.com/panel` وارد پنلتون بشید و ساب‌های جدید رو دریافت کنید.

> [!TIP]
> 1- اگر به ورکر دامنه وصل کنید مثل Pages ترافیکش نامحدود میشه.
>
> 2- خود ورکر پورت‌های nonTLS مثل 80 و 8080 و ... رو ساپورت میکنه و توی پنل نشون میده، اما اگر دامنه متصل بشه دیگه این پورت‌ها کار نمیکنن و پنل هم نشون نمیده.
