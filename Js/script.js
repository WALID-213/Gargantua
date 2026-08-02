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

/* ===== Animation Loop ===== */

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGalaxyCore();
   drawGalaxyArms();
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

    });
});
function drawGalaxyCore(){

    const x = canvas.width * 0.72;
    const y = canvas.height * 0.42;

    const gradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, 240
    );

    gradient.addColorStop(0,"rgba(255,255,255,.95)");
    gradient.addColorStop(.08,"rgba(170,140,255,.85)");
    gradient.addColorStop(.22,"rgba(109,74,255,.45)");
    gradient.addColorStop(.45,"rgba(74,183,255,.18)");
    gradient.addColorStop(1,"rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(x,y,240,0,Math.PI*2);

    ctx.fill();

}
let galaxyRotation = 0;

function drawGalaxyArms(){

    const cx = canvas.width * 0.72;
    const cy = canvas.height * 0.42;

    ctx.save();

    ctx.translate(cx, cy);

    ctx.rotate(galaxyRotation);

    for(let arm = 0; arm < 2; arm++){

        ctx.rotate(Math.PI);

        ctx.beginPath();

        for(let a = 0; a < Math.PI * 4; a += 0.05){

            const r = a * 18;

            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.45;

            if(a === 0){
                ctx.moveTo(x, y);
            }else{
                ctx.lineTo(x, y);
            }

        }

        ctx.strokeStyle = "rgba(109,74,255,.08)";
        ctx.lineWidth = 18;
        ctx.lineCap = "round";

        ctx.stroke();

    }

    ctx.restore();

    galaxyRotation += 0.00015;
}
animate();
