/* ===========================================
   GARGANTUA
   Space Engine - Depth Stars
   Version: Alpha 1.1
=========================================== */

/* ===== Canvas ===== */

const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ===== Stars (depth: 0 = far, 1 = near) ===== */

const STAR_COUNT = width < 768 ? 90 : 140;
const COLORS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#B9A6FF", "#9BD4FF"];

const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {

    const depth = Math.pow(Math.random(), 1.8);

    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        radius: 0.25 + depth * 1.6,
        baseAlpha: 0.25 + depth * 0.55,
        speed: 0.01 + depth * 0.09,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.6 + Math.random() * 1.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
}

/* ===== Parallax (mouse / touch / scroll) ===== */

const PARALLAX = 26;

let targetX = 0;
let targetY = 0;
let offsetX = 0;
let offsetY = 0;

function setTarget(clientX, clientY) {
    targetX = (clientX / width - 0.5) * 2;
    targetY = (clientY / height - 0.5) * 2;
}

window.addEventListener("pointermove", e => setTarget(e.clientX, e.clientY), { passive: true });

window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    if (t) setTarget(t.clientX, t.clientY);
}, { passive: true });

let scrollY = 0;

window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
}, { passive: true });

/* ===== Animation Loop ===== */

let running = true;

function draw(time) {

    ctx.clearRect(0, 0, width, height);

    /* حركة ناعمة للكاميرا */
    offsetX += (targetX - offsetX) * 0.04;
    offsetY += (targetY - offsetY) * 0.04;

    const t = time * 0.001;

    for (const s of stars) {

        if (!reduceMotion) {
            s.x -= s.speed;
            s.y += s.speed * 0.35;

            if (s.x < -40) s.x = width + 40;
            if (s.y > height + 40) s.y = -40;
        }

        const px = s.x - offsetX * PARALLAX * s.depth;
        const py = s.y - offsetY * PARALLAX * s.depth - scrollY * 0.05 * s.depth;

        const alpha = s.baseAlpha * (0.75 + 0.25 * Math.sin(t * s.twinkle + s.phase));

        ctx.fillStyle = s.color;

        /* هالة خفيفة للنجوم القريبة فقط */
        if (s.depth > 0.75) {
            ctx.globalAlpha = alpha * 0.18;
            ctx.beginPath();
            ctx.arc(px, py, s.radius * 3.2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, s.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;

    if (running && !reduceMotion) {
        requestAnimationFrame(draw);
    }
}

/* إيقاف الرسم لما التبويب مخفي (توفير بطارية) */
document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reduceMotion) requestAnimationFrame(draw);
});

requestAnimationFrame(draw);

/* ===== Mobile Menu ===== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute("aria-label", isOpen ? "Close Menu" : "Open Menu");
    });

    const links = mobileMenu.querySelectorAll("a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            mobileMenu.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open Menu");
        });
    });
}
