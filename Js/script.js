/* ===========================================
   GARGANTUA
   Space Engine
   Version: Alpha 1.0
=========================================== */

/* ===== Canvas ===== */

const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");

/* ===== Resize ===== */

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", 
     /* ===== Stars ===== */

const stars = [];

const STAR_COUNT = 150;

for (let i = 0; i < STAR_COUNT; i++) {

    stars.push({

        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        radius: Math.random() * 2 + 0.3,

        opacity: Math.random()

    });

}                   
/* ===== Animation Loop ===== */

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);

}

animate();
