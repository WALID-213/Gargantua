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
    createGalaxyGradient();
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

/* ===== Stars ===== */

const stars = [];

const STAR_COUNT = 90;

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1,
        speedX: 0.02 + Math.random() * 0.02,
        speedY: 0.005 + Math.random() * 0.01
    });
}

/* ===== Galaxy Gradient (cached) ===== */

let galaxyGradient = null;

function createGalaxyGradient(){

    const x = canvas.width * 0.72;
    const y = canvas.height * 0.42;

    galaxyGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, 240
    );

    galaxyGradient.addColorStop(0,"rgba(255,255,255,.95)");
    galaxyGradient.addColorStop(.08,"rgba(170,140,255,.85)");
    galaxyGradient.addColorStop(.22,"rgba(109,74,255,.45)");
    galaxyGradient.addColorStop(.45,"rgba(74,183,255,.18)");
    galaxyGradient.addColorStop(1,"rgba(0,0,0,0)");
}

/* ===== Galaxy Core ===== */

function drawGalaxyCore(){

    const x = canvas.width * 0.72;
    const y = canvas.height * 0.42;

    ctx.fillStyle = galaxyGradient;

    ctx.beginPath();

    ctx.arc(x, y, 240, 0, Math.PI * 2);

    ctx.fill();

}

/* ===== Galaxy Stars ===== */

const galaxyStars = [];

const GALAXY_STAR_COUNT = 500;

for(let i = 0; i < GALAXY_STAR_COUNT; i++){

    const angle = Math.random() * Math.PI * 4;

    const radius = Math.random() * 260;

    galaxyStars.push({

        angle,

        radius,

        size: Math.random() * 1.8 + .2,

        alpha: Math.random() * .8 + .2

    });

}

function drawGalaxy(){

    const cx = canvas.width * .72;
    const cy = canvas.height * .42;

    galaxyStars.forEach(star=>{

        const spiral = star.angle + star.radius * .03;

        const x =
        cx +
        Math.cos(spiral) * star.radius;

        const y =
        cy +
        Math.sin(spiral) *
        star.radius *
        .45;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            star.size,
            0,
            Math.PI*2
        );

        ctx.fillStyle =
        `rgba(255,255,255,${star.alpha})`;

        ctx.fill();

    });

}

/* ===== Animation Loop ===== */

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGalaxyCore();
    drawGalaxy();

    stars.forEach(star => {

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;

        ctx.fill();

        /* حركة النجوم */
        star.x -= star.speedX;
        star.y += star.speedY;

        if (star.x < -5) {
            star.x = canvas.width + 5;
        }

        if (star.y > canvas.height + 5) {
            star.y = -5;
        }

        /* لمعان النجوم */
        star.opacity += star.speed * star.direction;

        if (star.opacity >= 0.7 || star.opacity <= 0.2) {
            star.direction *= -1;
        }

    });

    requestAnimationFrame(animate);
}

/* ===== Mobile Menu ===== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

const links = document.querySelectorAll(".mobile-menu a");

links.forEach(link => {
    link.addEventListener("click", () => {

        links.forEach(l => l.classList.remove("active"));

        link.classList.add("active");

        mobileMenu.classList.remove("active");

    });
});

/* ===== Start ===== */

createGalaxyGradient();
animate();
