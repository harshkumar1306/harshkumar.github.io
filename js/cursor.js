const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
  requestAnimationFrame(animateRing);
}

animateRing();

const magneticElements = document.querySelectorAll(".card");

magneticElements.forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: "power3.out"
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power3.out"
    });
  });
});

// magneticElements.forEach(el => {
//   el.addEventListener("mouseenter", () => {
//     ring.style.transform += " scale(1.4)";
//   });

//   el.addEventListener("mouseleave", () => {
//     ring.style.transform = ring.style.transform.replace(" scale(1.4)", "");
//   });
// });

magneticElements.forEach(el => {
  el.addEventListener("mouseenter", () => {
    gsap.to(ring, {
      scale: 1.4,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(ring, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  });
});


