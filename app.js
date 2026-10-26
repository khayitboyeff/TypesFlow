const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const banks = {
  uz: {
    oddiy: "salom kitob qalam maktab uy suv olma daraxt osmon quyosh oy kun tun bola do'st oila ona ota aka opa non choy yaxshi katta kichik yangi eski tez sekin oq qora rang gul bog' yo'l shahar dars sinf ustoz talaba ish vaqt soat hafta yil bahor yoz kuz qish yomg'ir qor shamol havo dengiz tog' daryo yer qush baliq mushuk it ot rangli shirin mazali meva sabzi yurmoq o'qimoq yozmoq ko'rmoq bilmoq o'rganmoq gapirmoq tinglamoq kulmoq ishlamoq",
    plus: "kompyuter dasturlash internet klaviatura monitor dastur loyiha ma'lumot tizim texnologiya raqamli qurilma server tarmoq xotira tezlik aniqlik muvaffaqiyat tajriba bilim mantiq algoritm funksiya o'zgaruvchi massiv obyekt fayl papka brauzer sayt foydalanuvchi xavfsizlik parol hisob profil sozlama natija maqsad reja vazifa muammo yechim tahlil hisobot rivojlanish ko'nikma mashq diqqat xatolik matn harf belgi jumla lug'at tahrirlash saqlash yuklash ochish yopish qidirish tanlash boshqarish foydali samarali",
    pro: "arxitektura infratuzilma autentifikatsiya avtorizatsiya shifrlash kriptografiya identifikatsiya integratsiya optimallashtirish samaradorlik dasturiy ta'minot virtualizatsiya konteyner mikroservis protokol so'rov javob kesh indeks replikatsiya zaxiralash monitoring diagnostika barqarorlik masshtablash parallel asinxron sinxron kompilyatsiya interpretatsiya abstraksiya merosxo'rlik polimorfizm inkapsulyatsiya interfeys modullik bog'liqlik versiyalash testlash debugging refaktoring deploy pipeline avtomatlashtirish ishonchlilik kuzatuvchanlik ma'lumotlar oqimi samarali algoritm",
    ultra: "penetratsion testlash zaiflik tahlili tarmoq segmentatsiyasi xavfsizlik auditi kriptografik protokol identifikatsiya boshqaruvi ruxsatlarni tekshirish tahdid modeli hujum yuzasi xavfsiz konfiguratsiya ma'lumotlar yaxlitligi hodisalar monitoringi raqamli kriminalistika xavfsizlik siyosati kirishni nazorat qilish ko'p bosqichli autentifikatsiya zaifliklarni boshqarish xavfsizlik arxitekturasi kiberxavfsizlik etikal xakerlik tizim himoyasi shifrlash kaliti sertifikat zanjiri tarmoq protokoli paketlar tahlili hodisalarga javob xavfsizlik monitoringi ma'lumotlarni himoyalash ruxsatsiz kirish zaiflik skaneri tizimni mustahkamlash maxfiylik yaxlitlik mavjudlik"
  },
  en: {
    oddiy: "hello world book pencil school home water apple tree sky sun moon day night friend family mother father brother sister bread tea good large small new old fast slow color flower road city lesson teacher student work time week year spring summer autumn winter rain snow wind sea mountain river bird fish cat dog horse sweet fruit read write learn speak listen smile",
    plus: "computer programming internet keyboard monitor software project data system technology digital device server network memory speed accuracy success experience knowledge logic algorithm function variable array object file folder browser website user security password account profile settings result goal plan task problem solution analysis report progress skill practice focus error text letter symbol sentence dictionary edit save upload open close search select manage useful efficient",
    pro: "architecture infrastructure authentication authorization encryption cryptography identity integration optimization performance software virtualization container microservice protocol request response cache index replication backup monitoring diagnostics reliability scaling parallel asynchronous synchronous compilation interpretation abstraction inheritance polymorphism encapsulation interface modularity dependency versioning testing debugging refactoring deployment pipeline automation observability dataflow algorithm",
    ultra: "penetration testing vulnerability assessment network segmentation security audit cryptographic protocol identity management access control threat modeling attack surface secure configuration data integrity incident monitoring digital forensics security policy multi factor authentication vulnerability management security architecture cybersecurity ethical hacking system defense encryption key certificate chain packet analysis incident response security monitoring data protection unauthorized access vulnerability scanner system hardening confidentiality integrity availability"
  },
  ru: {
    oddiy: "привет книга карандаш школа дом вода яблоко дерево небо солнце луна день ночь друг семья мама папа брат сестра хлеб чай хороший большой маленький новый старый быстро медленно цветок дорога город урок учитель студент работа время неделя год весна лето осень зима дождь снег ветер море гора река птица рыба кошка собака читать писать учиться говорить слушать улыбка",
    plus: "компьютер программирование интернет клавиатура монитор программа проект данные система технология цифровой устройство сервер сеть память скорость точность успех опыт знания логика алгоритм функция переменная массив объект файл папка браузер сайт пользователь безопасность пароль аккаунт профиль настройки результат цель план задача проблема решение анализ отчет развитие навык практика внимание ошибка текст буква символ предложение словарь редактировать сохранить загрузить открыть закрыть поиск выбрать управлять полезный эффективный",
    pro: "архитектура инфраструктура аутентификация авторизация шифрование криптография идентификация интеграция оптимизация производительность программное обеспечение виртуализация контейнер микросервис протокол запрос ответ кэш индекс репликация резервирование мониторинг диагностика надежность масштабирование параллельный асинхронный синхронный компиляция интерпретация абстракция наследование полиморфизм инкапсуляция интерфейс модульность зависимость тестирование отладка рефакторинг развертывание автоматизация наблюдаемость алгоритм",
    ultra: "тестирование на проникновение анализ уязвимостей сегментация сети аудит безопасности криптографический протокол управление идентификацией контроль доступа модель угроз поверхность атаки безопасная конфигурация целостность данных мониторинг инцидентов цифровая криминалистика политика безопасности многофакторная аутентификация управление уязвимостями архитектура безопасности кибербезопасность этичный хакинг защита системы ключ шифрования анализ пакетов реагирование на инциденты защита данных несанкционированный доступ сканер уязвимостей конфиденциальность целостность доступность"
  }
};

const sampleTexts = {
  uz: {
    oddiy: "Har kuni ozgina mashq qilish katta natijaga olib keladi. Tez yozishga shoshilma, avval harflarni to'g'ri bosishga odatlan.",
    plus: "Dasturlash va texnologiyalarni o'rganish sabr, mantiq va muntazam amaliyotni talab qiladi. Har bir yangi ko'nikma keyingi bosqich uchun asos yaratadi.",
    pro: "Samarali dasturiy tizimlar to'g'ri arxitektura, optimallashtirilgan algoritmlar va puxta testlash orqali yaratiladi. Ishonchlilikni saqlash uchun kodni muntazam tahlil qilish muhim.",
    ultra: "Kiberxavfsizlik mutaxassisi tizimlarni qonuniy ruxsat asosida tekshiradi, zaifliklarni aniqlaydi va xavflarni kamaytirish bo'yicha tavsiyalar beradi."
  },
  en: {
    oddiy: "Practice a little every day and you will improve over time. Focus on accuracy first, then let your typing speed grow naturally.",
    plus: "Programming and technology require patience, logic, and consistent practice. Every new skill builds a foundation for the next challenge.",
    pro: "Reliable software systems combine thoughtful architecture, efficient algorithms, and careful testing. Regular code review helps maintain quality.",
    ultra: "Cybersecurity professionals test systems with permission, identify weaknesses, and recommend practical ways to reduce risk and improve resilience."
  },
  ru: {
    oddiy: "Небольшая ежедневная практика помогает постепенно улучшать результат. Сначала сосредоточься на точности, а затем увеличивай скорость.",
    plus: "Программирование и технологии требуют терпения, логики и регулярной практики. Каждый новый навык помогает перейти на следующий уровень.",
    pro: "Надёжные программные системы требуют продуманной архитектуры, эффективных алгоритмов и тщательного тестирования. Регулярный анализ кода поддерживает качество.",
    ultra: "Специалисты по кибербезопасности проверяют системы с разрешения, находят уязвимости и предлагают способы снижения рисков."
  }
};

const translations = {
  uz: {practice:"Mashq qilish",stats:"Statistika",goals:"Kunlik maqsad",settings:"Sozlamalar",todayXP:"Bugungi XP",heroTitle:"Har bir harf seni<br>maqsadingga yaqinlashtiradi.",heroDesc:"Tezlikni oshir, aniqlikni saqla va natijangni kuzat.",chooseLevel:"Darajani tanla",levelDesc:"O'zingga mos qiyinlikni tanla.",easyDesc:"Boshlovchilar uchun",plusDesc:"O'rta daraja",proDesc:"Murakkab mashqlar",ultraDesc:"Professional daraja",typingPractice:"Yozish mashqi",typingDesc:"Random so'zlar yoki matn bilan mashq qil.",randomWords:"Random so'zlar",textMode:"Matn",accuracy:"Aniqlik",accuracyCaption:"to'g'ri yozish",timeLeft:"Qolgan vaqt",countdown:"hisoblagich",correctChars:"To'g'ri belgilar",characters:"belgi",wordsPerMinute:"so'z/min",keepTyping:"Yozishni davom et",restartHint:"qayta boshlash",restart:"Qayta boshlash ↻",focusTitle:"Aniqlikni birinchi o'ringa qo'y",focusDesc:"Avval xatosiz yozishga odatlan, tezlik keyin oshadi.",streakTitle:"Har kuni mashq qil",streakDesc:"XP yig' va ketma-ket mashq kunlarini saqla." },
  en: {practice:"Practice",stats:"Statistics",goals:"Daily goal",settings:"Settings",todayXP:"Today's XP",heroTitle:"Every keystroke brings<br>you closer to your goal.",heroDesc:"Build speed, maintain accuracy, track your progress.",chooseLevel:"Choose your level",levelDesc:"Pick the difficulty that fits you.",easyDesc:"For beginners",plusDesc:"Intermediate",proDesc:"Advanced practice",ultraDesc:"Professional level",typingPractice:"Typing practice",typingDesc:"Practice with random words or text.",randomWords:"Random words",textMode:"Text",accuracy:"Accuracy",accuracyCaption:"correct typing",timeLeft:"Time left",countdown:"countdown",correctChars:"Correct characters",characters:"characters",wordsPerMinute:"words/min",keepTyping:"Keep typing",restartHint:"restart",restart:"Restart ↻",focusTitle:"Accuracy comes first",focusDesc:"Build accurate habits first; speed will follow.",streakTitle:"Practice every day",streakDesc:"Earn XP and build your daily streak." },
  ru: {practice:"Тренировка",stats:"Статистика",goals:"Цель на день",settings:"Настройки",todayXP:"XP сегодня",heroTitle:"Каждое нажатие приближает<br>тебя к твоей цели.",heroDesc:"Развивай скорость, точность и отслеживай прогресс.",chooseLevel:"Выбери уровень",levelDesc:"Выбери подходящую сложность.",easyDesc:"Для начинающих",plusDesc:"Средний уровень",proDesc:"Сложные упражнения",ultraDesc:"Профессиональный уровень",typingPractice:"Тренировка печати",typingDesc:"Тренируйся на случайных словах или тексте.",randomWords:"Случайные слова",textMode:"Текст",accuracy:"Точность",accuracyCaption:"верный ввод",timeLeft:"Осталось",countdown:"таймер",correctChars:"Верные символы",characters:"символы",wordsPerMinute:"слов/мин",keepTyping:"Продолжай печатать",restartHint:"заново",restart:"Начать заново ↻",focusTitle:"Сначала точность",focusDesc:"Сначала привыкай печатать точно, затем увеличивай скорость.",streakTitle:"Тренируйся ежедневно",streakDesc:"Зарабатывай XP и сохраняй серию занятий."}
};

let level = "oddiy", mode = "words", duration = 60, remaining = 60;
let timerId = null, startedAt = null, finished = false, savedRun = false;
let currentTarget = "", lang = localStorage.getItem("tf-lang") || "uz";
let xp = Number(localStorage.getItem("tf-xp") || 0);
let best = Number(localStorage.getItem("tf-best") || 0);
let activeTestKey = "";
const todayKey = () => new Date().toISOString().slice(0,10);
const historyGet = () => JSON.parse(localStorage.getItem("tf-history") || "[]");
const dailyGet = () => JSON.parse(localStorage.getItem("tf-daily") || "{}");

function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
function bankWords(){return (banks[lang][level] || banks.uz[level]).split(/\s+/).filter(Boolean);}
function makeRandomWords(){const source=bankWords();const words=[];while(words.length<220)words.push(...shuffle(source));currentTarget=words.slice(0,220).join(" ");}
function getTarget(){return mode==="words"?currentTarget:(sampleTexts[lang][level]||sampleTexts.uz[level]);}
function renderText(){
  const target=getTarget(), typed=$("#typingInput").value, display=$("#textDisplay");
  display.innerHTML="";
  for(let i=0;i<target.length;i++){
    const span=document.createElement("span");span.textContent=target[i];
    if(i<typed.length){if(typed[i]===target[i])span.className="correct-char";else if($("#showErrors").checked)span.className="wrong-char";}
    else if(i===typed.length&&!finished)span.classList.add("current-char");
    display.appendChild(span);
  }
  const current=display.querySelector(".current-char");if(current)current.scrollIntoView({block:"nearest",inline:"nearest"});
}
function getStats(){
  const typed=$("#typingInput").value,target=getTarget();let correct=0,errors=0;
  for(let i=0;i<typed.length;i++){if(typed[i]===target[i])correct++;else errors++;}
  const elapsed=startedAt?Math.max((Date.now()-startedAt)/1000,1):0;
  return {typed,target,correct,errors,wpm:Math.round((correct/5)/(Math.max(elapsed,1)/60)),accuracy:typed.length?Math.round(correct/typed.length*100):100};
}
function updateMetrics(){const s=getStats();$("#wpm").textContent=s.wpm;$("#accuracy").textContent=s.accuracy+"%";$("#timer").textContent=remaining+"s";$("#correct").textContent=s.correct;}
function playSound(){if(!$("#soundToggle").checked)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=560;g.gain.value=.018;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.025);o.onended=()=>c.close();}catch(e){}}
function startTimer(){if(timerId||finished)return;startedAt=Date.now();timerId=setInterval(()=>{remaining=Math.max(0,remaining-1);updateMetrics();if(remaining<=0)finishTest();},1000);}
function todayStats(){const d=dailyGet();if(d.date!==todayKey())return {date:todayKey(),count:0,xp:0};return d;}
function saveResult(){
  if(savedRun)return 0;savedRun=true;const s=getStats();const earned=Math.max(5,Math.round(s.wpm/2)+(s.accuracy>=95?10:0));
  const history=historyGet();history.unshift({date:new Date().toLocaleString(),day:todayKey(),level,mode,wpm:s.wpm,accuracy:s.accuracy,errors:s.errors,correct:s.correct,xp:earned,duration});
  localStorage.setItem("tf-history",JSON.stringify(history.slice(0,100)));
  xp+=earned;localStorage.setItem("tf-xp",String(xp));best=Math.max(best,s.wpm);localStorage.setItem("tf-best",String(best));
  const d=todayStats();d.date=todayKey();d.count+=1;d.xp+=earned;localStorage.setItem("tf-daily",JSON.stringify(d));
  $("#earnedXP").textContent="+"+earned+" XP";$("#resultWpm").textContent=s.wpm;$("#resultAccuracy").textContent=s.accuracy+"%";$("#resultErrors").textContent=s.errors;
  updateXP();return earned;
}
function finishTest(){
  if(finished)return;finished=true;clearInterval(timerId);timerId=null;
  saveResult();renderText();updateMetrics();
  $("#practiceMessage").textContent=`Tugadi! ${getStats().wpm} WPM · ${getStats().accuracy}% aniqlik`;
  $("#typingInput").disabled=true;$("#resultModal").classList.remove("hidden");refreshGoal();
}
function resetPractice(){
  clearInterval(timerId);timerId=null;remaining=duration;startedAt=null;finished=false;savedRun=false;
  $("#typingInput").disabled=false;$("#typingInput").value="";$("#practiceMessage").textContent="Boshlash uchun yozishni boshlang.";
  if(mode==="words")makeRandomWords();renderText();updateMetrics();
}
function chooseLevel(v){level=v;$$(".level").forEach(b=>b.classList.toggle("active",b.dataset.level===v));resetPractice();}
function switchMode(v){mode=v;$$(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===v));resetPractice();}
function showPage(page){
  const names={practice:"Yozish mashqi",stats:"Statistika",goals:"Kunlik maqsad",subscriptions:"Obuna tariflari",settings:"Sozlamalar"};
  $$(".page").forEach(s=>s.classList.add("hidden"));$("#"+page+"Page").classList.remove("hidden");$("#pageTitle").textContent=names[page];
  $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  if(page==="stats")renderStats();if(page==="goals")refreshGoal();
}
function updateXP(){
  $("#xpValue").textContent=xp;$("#sideXP").textContent=todayStats().xp+" XP";$("#totalXP").textContent=xp;
  $("#userLevel").textContent=Math.floor(xp/100)+1;
  const d=todayStats(),goal=Number($("#dailyGoal")?.value||localStorage.getItem("tf-goal")||3);
  $("#dailyProgress").style.width=Math.min(100,d.xp/Math.max(1,goal*20)*100)+"%";
}
function renderStats(){
  const h=historyGet(),last=h.slice(0,10),w=h.map(x=>x.wpm),a=h.map(x=>x.accuracy);
  $("#bestWpm").textContent=h.length?Math.max(...w):0;
  $("#avgWpm").textContent=h.length?Math.round(w.reduce((s,n)=>s+n,0)/h.length):0;
  $("#testCount").textContent=h.length;
  $("#avgAccuracy").textContent=h.length?Math.round(a.reduce((s,n)=>s+n,0)/h.length)+"%":"0%";
  const chart=$("#chart");chart.innerHTML="";
  const max=Math.max(1,...last.map(x=>x.wpm));
  if(!last.length){chart.textContent="Grafik uchun hali natija yo'q. Birinchi mashqingni bajar!";chart.style.alignItems="center";chart.style.color="var(--muted)";chart.style.fontSize="12px";}
  else{
    chart.style.alignItems="flex-end";
    [...last].reverse().forEach((item,i)=>{const col=document.createElement("div");col.className="chart-column";const bar=document.createElement("div");bar.className="chart-bar";bar.style.height=Math.max(4,item.wpm/max*88)+"%";bar.title=item.wpm+" WPM";const label=document.createElement("span");label.textContent=i+1;col.append(bar,label);chart.append(col);});
  }
  const list=$("#historyList");list.innerHTML="";
  if(!h.length){list.textContent="Hali saqlangan mashq natijalari yo'q.";return;}
  h.slice(0,12).forEach(item=>{const row=document.createElement("div");row.className="history-item";const l=document.createElement("span");l.textContent=`${item.date} · ${item.level.toUpperCase()}`;const r=document.createElement("strong");r.textContent=`${item.wpm} WPM · ${item.accuracy}% · +${item.xp} XP`;row.append(l,r);list.append(row);});
}
function refreshGoal(){
  const d=todayStats(),goal=Number($("#dailyGoal").value||localStorage.getItem("tf-goal")||3);
  $("#dailyGoal").value=String(goal);$("#goalDone").textContent=`${Math.min(d.count,goal)} / ${goal} mashq`;
  $("#goalPercent").textContent=Math.min(100,Math.round(d.count/goal*100))+"%";$("#goalBar").style.width=Math.min(100,d.count/goal*100)+"%";
  $("#todayCount").textContent=d.count;$("#streakCount").textContent=calculateStreak();updateXP();
}
function calculateStreak(){
  const days=[...new Set(historyGet().map(x=>x.day))].sort().reverse();if(!days.length)return 0;
  let streak=0,dt=new Date();const today=todayKey();
  if(days[0]!==today){dt.setDate(dt.getDate()-1);}
  while(days.includes(dt.toISOString().slice(0,10))){streak++;dt.setDate(dt.getDate()-1);}
  return streak;
}
function setTheme(dark){document.body.classList.toggle("dark",dark);localStorage.setItem("tf-dark",dark?"1":"0");$("#themeToggle").textContent=dark?"☀":"☾";$("#themeSetting").textContent=dark?"Light mode":"Dark mode";}
function setLanguage(value){
  lang=value;localStorage.setItem("tf-lang",lang);
  const t=translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(t[k])el.innerHTML=t[k];});
  document.documentElement.lang=lang;resetPractice();
}
function currentPlan(){return localStorage.getItem("tf-plan")||"Free";}
function freeTestsRemaining(){const d=todayStats();return Math.max(0,3-d.count);}
function showPlanNotice(plan){
  $("#planModalTitle").textContent=plan==="Free"?"Free tarif":" "+plan+" tarifi";
  $("#planModalText").textContent=plan==="Free"
    ?"Free tarifda kuniga 3 ta mashq bajarish mumkin. Ko'proq mashq uchun Pro yoki Ultra tarifini tanlashing mumkin."
    :"Tarif tanlandi, lekin to'lov tizimi hali ulanmagan. Haqiqiy obuna faollashishi uchun backend va to'lov integratsiyasi kerak.";
  $("#planModal").classList.remove("hidden");
}
$("#typingInput").addEventListener("input",()=>{
  if(finished)return;
  if(!startedAt && $("#typingInput").value.length>0 && currentPlan()==="Free" && freeTestsRemaining()<=0){
    $("#typingInput").value="";showPlanNotice("Free");showPage("subscriptions");return;
  }
  startTimer();const s=getStats();
  if(s.typed.length>=s.target.length){finishTest();return;}
  renderText();updateMetrics();playSound();
});
$$(".level").forEach(b=>b.addEventListener("click",()=>chooseLevel(b.dataset.level)));
$$(".mode").forEach(b=>b.addEventListener("click",()=>switchMode(b.dataset.mode)));
$$(".time-btn").forEach(b=>b.addEventListener("click",()=>{duration=Number(b.dataset.time);$$(".time-btn").forEach(x=>x.classList.toggle("active",x===b));resetPractice();}));
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("#refreshBtn").addEventListener("click",resetPractice);$("#resetBtn").addEventListener("click",resetPractice);
$("#themeToggle").addEventListener("click",()=>setTheme(!document.body.classList.contains("dark")));
$("#themeSetting").addEventListener("click",()=>setTheme(!document.body.classList.contains("dark")));
$("#fontSize").addEventListener("change",e=>$("#textDisplay").style.fontSize=e.target.value+"px");
$("#showErrors").addEventListener("change",renderText);
$("#languageSelect").addEventListener("change",e=>setLanguage(e.target.value));
$("#dailyGoal").addEventListener("change",e=>{localStorage.setItem("tf-goal",e.target.value);refreshGoal();});
$("#clearStats").addEventListener("click",()=>{if(confirm("Barcha statistika va mashq tarixini o'chirasizmi?")){localStorage.removeItem("tf-history");renderStats();refreshGoal();}});
$("#closeResult").addEventListener("click",()=>$("#resultModal").classList.add("hidden"));
$("#closePlan").addEventListener("click",()=>$("#planModal").classList.add("hidden"));
$("#planModalOk").addEventListener("click",()=>$("#planModal").classList.add("hidden"));

const TYPEFLOW_BOT_USERNAME = "UZhelperr_bot";

$$("[data-plan]").forEach(btn => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan;

    if (plan === "Free") {
      localStorage.setItem("tf-plan", "Free");
      $("#planModal").classList.add("hidden");
      showPage("practice");
      return;
    }

    // Telegram botni yangi oynada ochadi.
    const botUrl =
      `https://t.me/${TYPEFLOW_BOT_USERNAME}?start=subscription`;

    const paymentWindow = window.open(botUrl, "_blank", "noopener,noreferrer");
    if (!paymentWindow) {
      window.location.href = botUrl;
    }
  });
});


$("#continueBtn").addEventListener("click",()=>{$("#resultModal").classList.add("hidden");resetPractice();$("#typingInput").focus();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#planModal").classList.contains("hidden")){$("#planModal").classList.add("hidden");}else if(e.key==="Escape"&&!$("#resultModal").classList.contains("hidden")){$("#resultModal").classList.add("hidden");}else if(e.key==="Escape"&&$("#resultModal").classList.contains("hidden")&&!$("#practicePage").classList.contains("hidden"))resetPractice();});
$("#languageSelect").value=lang;
setLanguage(lang);
setTheme(localStorage.getItem("tf-dark")==="1");
updateXP();refreshGoal();renderText();updateMetrics();
