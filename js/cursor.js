const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

/* ================= BASIC CURSOR ================= */
document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // dot = instant
  dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;

  ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
  requestAnimationFrame(animateRing);
}

animateRing();

function bindMagneticCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    if (card.dataset.magneticBound) return;
    card.dataset.magneticBound = "true";

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(card, {
        x: x * 0.12,
        y: y * 0.12,
        duration: 0.25,
        ease: "power3.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        x: 0,
        y: 0,
        duration: 0.35,
        ease: "power3.out"
      });
    });
  });
}

/* ================= OBSERVE DOM CHANGES ================= */
const observer = new MutationObserver(bindMagneticCards);
observer.observe(document.body, { childList: true, subtree: true });

// Initial bind
bindMagneticCards();
