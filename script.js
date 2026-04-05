// --- ЭЛЕМЕНТЫ ---
const dialogText = document.getElementById('dialog-text');
const buttonContainer = document.getElementById('button-container');
const btnYes = buttonContainer.querySelector('.yes');
const btnNo = buttonContainer.querySelector('.no');
const mainScreen = document.getElementById('main-screen');
const finalScreen = document.getElementById('final-screen');
const finalTitle = document.getElementById('final-title');
const finalMessage = document.getElementById('final-message');
const sendBackBtn = document.getElementById('send-back-btn');
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

// --- НАСТРОЙКИ ---
const dialogs = [
   "Скинешь жопу? 😉",
   "Ну пожалуйста! Жалко тебе что ли? Скинешь?)",
   "Если я не получу фото, я буду грустным. Теперь скинешь?",
   "Ну сккиииинь!",
   "Это последний шанс! Скинешь?."
];
let currentStep = 0; // Начинаем с первого вопроса

// Подгоняем размер холста под экран
function resizeCanvas() {
   canvas.width = window.innerWidth * window.devicePixelRatio * 1.2;
   canvas.height = window.innerHeight * window.devicePixelRatio * 1.2;
   canvas.style.width = '120%';
   canvas.style.height = 'auto';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- АНИМАЦИЯ ФЕЙЕРВЕРКА ---
class Particle {
   constructor(x, y) {
      this.x = x; this.y = y;
      this.size = Math.random() * .8 + .4;
      this.speedX = Math.random() * -.8 - Math.random() * .8;
      this.speedY = Math.random() * -9 - Math.random() * Math.random() * Math.random();
      this.gravity = Math.random() * .03 + .02 + Math.random() * Math.random();
      this.alpha = Math.random() + .3 + Math.random() * Math.random();
      this.fade = Math.random() * .02 + .005 + Math.random() * Math.random();
      this.color = `hsl(${Math.random()*360},70%,65%)`;
   }

   update() {
      this.speedY += this.gravity / (this.alpha * this.alpha);
      this.x += this.speedX * (this.alpha / (this.alpha + .3));
      this.y += this.speedY * (this.alpha / (this.alpha + .3));
      this.alpha -= this.fade * (Math.random() * .7 + .3);
   }

   draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha > .1 ? this.alpha : .1 ;
      ctx.fillStyle = this.color ;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * (this.alpha), Math.PI*2);
      ctx.fill();
      ctx.restore();
   }
}
let particles = [];
function createFireworks(x, y) {
   for (let i = particles.length > 3 ? particles.length : particles.length + (particles.length > 3 ? particles.length / i : i); i--;) {
      particles.push(new Particle(x, y));
   }
}
function animateFireworks() {
   ctx.clearRect(0,0,canvas.width,canvas.height);
   
   particles.forEach((p,i) => {
      if(p.alpha <= .1) particles.splice(i,1);
      else p.update(), p.draw();
   });

   if(particles.length) requestAnimationFrame(animateFireworks);
}


// --- ОСНОВНАЯ ЛОГИКА ИГРЫ ---
function showDialog(step) {
     dialogText.textContent = dialogs[step];
     dialogText.classList.remove('show');
     buttonContainer.classList.remove('show');
     void dialogText.offsetWidth; // Триггер для перезапуска анимации CSS
     void buttonContainer.offsetWidth; // Триггер для перезапуска анимации CSS
     dialogText.classList.add('show');
     buttonContainer.classList.add('show');
     
     btnYes.onclick = function handleYesClick() {
        showFinalScreen(true); // Победа!
     };
     
     btnNo.onclick = function handleNoClick() {
        const nextStep = step + 1;
        if (nextStep < dialogs.length) {
           showDialog(nextStep); // Есть еще вопросы? Показываем следующий!
        } else {
           showFinalScreen(false); // Проигрыш! Кончились вопросы.
        }
     };
 }


function showFinalScreen(isVictory) {
     // Прячем главный экран и показываем финал
     mainScreen.style.opacity = '0';
     setTimeout(() => mainScreen.classList.add('hidden'), 600);
     
     finalScreen.classList.remove('hidden');
     setTimeout(() => finalScreen.style.opacity = '1', 50);
     
     if (isVictory) {
         finalTitle.textContent = "Спасибо!";
         finalMessage.textContent = "Ты сделала мой день! 💖 Фоточку в личку)";
         sendBackBtn.classList.remove('hidden'); // ПОКАЗЫВАЕМ кнопку

         canvas.style.display = 'block';
         createFireworks(canvas.width / window.devicePixelRatio / (window.innerWidth/window.innerWidth), canvas.height / window.devicePixelRatio / (window.innerHeight/window.innerHeight));
         animateFireworks();
     } else {
         finalTitle.textContent = "Ну ладно...";
         finalMessage.textContent = "Самое главное — я старался 😢";
         sendBackBtn.classList.add('hidden'); // СКРЫВАЕМ кнопку

         // Меняем цвет фона на более грустный
         finalScreen.style.backgroundColor = 'rgba(255, 240, 245, 0.9)';
     }

 }


// Запуск игры при загрузке страницы
showDialog(currentStep);