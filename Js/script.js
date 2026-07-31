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

/* ===== Animation Loop ===== */

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);

}

animate();
