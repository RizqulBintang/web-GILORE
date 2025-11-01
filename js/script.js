// =======================================================
// A. FUNGSI DAN VARIABEL UTAMA
// =======================================================
const contents = document.querySelectorAll('.content');
const toggleBtn = document.getElementById('music-toggle');
const music = document.getElementById('bg-music');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Judul utama yang menggunakan animasi lama (scatter)
const title1 = document.getElementById('title1');
const title2 = document.getElementById('title2');

// Judul era yang menggunakan animasi baru (wipe)
const titleElements = document.querySelectorAll('#titleNaga, #titleHeavenly, #titleArchon, #titleWar, #titleCataclysm, #titleCatac');

// --- FUNGSI ANIMASI SCATTER LAMA (HANYA UNTUK JUDUL UTAMA) ---
function splitText(element, cls='char-scatter') {
    if (!element) return;
    const text = element.innerText;
    element.innerHTML = '';
    [...text].forEach(char => {
        const span = document.createElement('span');
        
        if (char === ' ') {
            span.innerHTML = '&nbsp;'; 
        } else {
            span.textContent = char;
        }
        
        span.classList.add(cls);
        // Tambahkan atribut custom untuk animasi scatter
        span.style.setProperty('--moveY', `${Math.random() * 200 - 100}px`);
        span.style.setProperty('--moveX', `${Math.random() * 200 - 100}px`);
        span.style.setProperty('--rotate', `${Math.random() * 60 - 30}deg`);
        element.appendChild(span);
    });
}

// Menerapkan fungsi splitText hanya ke judul utama
if (title1) splitText(title1, 'char-scatter');
if (title2) splitText(title2, 'char-scatter');

const scatterChars = document.querySelectorAll('.char-scatter');


// =======================================================
// B. LOGIKA ANIMASI SCROLL (SCATTER & WIPE)
// =======================================================

// --- 1. LOGIKA SCATTER LAMA (Dipicu oleh scroll event) ---
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const factor = Math.min(scrollY / 300, 1);

    // Animasi Scatter (Hanya untuk title1 & title2)
    scatterChars.forEach(span => {
        const moveX = parseFloat(span.style.getPropertyValue('--moveX')) * factor;
        const moveY = parseFloat(span.style.getPropertyValue('--moveY')) * factor;
        const rotate = parseFloat(span.style.getPropertyValue('--rotate')) * factor;
        span.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
        span.style.opacity = 1 - factor;
    });
});


// --- 2. LOGIKA CINEMATIC WIPE (Dipicu oleh Intersection Observer) ---

// Observer untuk memicu Wipe pada Judul Era
const titleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');			
        } else {
            entry.target.classList.remove('revealed');
        }
    });
}, { threshold: 0.5 }); 

// Terapkan observer ke semua judul era
titleElements.forEach(title => {
    titleObserver.observe(title);
});


// Observer untuk memicu Fade In Konten Paragraf
const contentObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
             entry.target.classList.remove('visible'); 
        }
    });
}, { threshold: 0.2 }); 

contents.forEach(content => {
    contentObserver.observe(content);
});


// =======================================================
// C. LOGIKA FUNGSI NAVIGASI & MUSIK
// =======================================================

// 1. Tombol Navigasi Mobile (Toggle)
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open'); 
});

// Tutup menu setelah mengklik link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) { 
            navMenu.classList.remove('open');
        }
    });
});


// 2. Tombol Musik
toggleBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        toggleBtn.textContent = '🔊';
    } else {
        music.pause();
        toggleBtn.textContent = '🔇';
    }
});

// Auto-play musik saat interaksi pertama
document.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        toggleBtn.textContent = '🔊';
    }
}, { once: true });

// Jeda musik saat tab tidak aktif
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        music.pause();
    } else {
        if (!music.paused) {
            music.play();
        }
    }
});


// 3. Logika Scroll Halus
document.querySelectorAll('#sidebar-nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); 
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
