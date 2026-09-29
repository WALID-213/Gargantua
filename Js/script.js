/* ===========================================
   GARGANTUA
   Space Engine - Depth Stars
   Version: Alpha 1.2
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

const STAR_COUNT = width < 768 ? 110 : 170;

/* غالبية النجوم بيضاء، ولمسة خفيفة جدًا من الألوان فقط للقريبة */
const TINTS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#EDE7FF", "#E6F3FF"];

const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {

    /* أس أعلى = نجوم بعيدة وخافتة أكثر، زي سماء حقيقية */
    const depth = Math.pow(Math.random(), 2.2);

    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth,
        radius: 0.2 + depth * 1.1,
        baseAlpha: 0.15 + depth * 0.45,
        speed: 0.004 + depth * 0.03,
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.25 + Math.random() * 0.5,
        color: TINTS[Math.floor(Math.random() * TINTS.length)]
    });
}

/* ===== Parallax (mouse / touch / scroll) ===== */

const PARALLAX = 14;

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

    /* حركة كاميرا ناعمة جدًا */
    offsetX += (targetX - offsetX) * 0.03;
    offsetY += (targetY - offsetY) * 0.03;

    const t = time * 0.0006;

    for (const s of stars) {

        if (!reduceMotion) {
            s.x -= s.speed;
            s.y += s.speed * 0.3;

            if (s.x < -40) s.x = width + 40;
            if (s.y > height + 40) s.y = -40;
        }

        const px = s.x - offsetX * PARALLAX * s.depth;
        const py = s.y - offsetY * PARALLAX * s.depth - scrollY * 0.04 * s.depth;

        /* وميض خفيف جدًا حول القيمة الأساسية، مريح للعين */
        const alpha = s.baseAlpha * (0.85 + 0.15 * Math.sin(t * s.twinkle + s.phase));

        ctx.fillStyle = s.color;

        /* هالة ناعمة للنجوم القريبة فقط */
        if (s.depth > 0.8) {
            ctx.globalAlpha = alpha * 0.15;
            ctx.beginPath();
            ctx.arc(px, py, s.radius * 3, 0, Math.PI * 2);
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
