/* ================= DATA LOADING ================= */

fetch("data/projects.json")
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById("projects-container");
    if (!container) return;

    projects.forEach(project => {
      const card = document.createElement("a");
      card.className = "card";
      card.href = project.link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <small>${project.tech.join(" • ")}</small>
      `;
      container.appendChild(card);
    });
  });

fetch("data/tools.json")
  .then(res => res.json())
  .then(tools => {
    const container = document.getElementById("tools-container");
    if (!container) return;

    tools.forEach(tool => {
      const li = document.createElement("li");
      li.textContent = tool;
      container.appendChild(li);
    });
  });

/* ================= SCENE SWITCHING ================= */

const scenes = Array.from(document.querySelectorAll(".scene"));
const navDots = Array.from(document.querySelectorAll(".scene-nav .dot"));

let currentScene = 0;
let isAnimating = false;

function showScene(targetIndex) {
  if (
    isAnimating ||
    targetIndex === currentScene ||
    targetIndex < 0 ||
    targetIndex >= scenes.length
  ) {
    return;
  }

  isAnimating = true;

  const current = scenes[currentScene];
  const next = scenes[targetIndex];

  // Update nav immediately (no lag)
  navDots.forEach(dot => dot.classList.remove("active"));
  navDots[targetIndex]?.classList.add("active");

  next.style.display = "block";

  const tl = gsap.timeline({
    onComplete: () => {
      current.classList.remove("active");
      current.style.display = "none";

      next.classList.add("active");
      currentScene = targetIndex;
      isAnimating = false;
    }
  });

  // OUT
  tl.to(current, {
    opacity: 0,
    scale: 0.995,
    duration: 0.35,
    ease: "power2.in"
  });

  // IN container
  tl.fromTo(
    next,
    { opacity: 0, scale: 1.02 },
    { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    "<"
  );

  // IN headings
  tl.to(
    next.querySelectorAll("h1, h2"),
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power3.out"
    },
    "-=0.25"
  );

  // IN content
  tl.to(
    next.querySelectorAll("p, ul, .cards"),
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power3.out"
    },
    "-=0.35"
  );
}

/* ================= SCROLL INPUT ================= */

window.addEventListener(
  "wheel",
  e => {
    e.preventDefault();
    if (isAnimating) return;

    if (e.deltaY > 0) {
      showScene(currentScene + 1);
    } else {
      showScene(currentScene - 1);
    }
  },
  { passive: false }
);

/* ================= KEYBOARD NAV ================= */

window.addEventListener("keydown", e => {
  if (isAnimating) return;

  if (e.key === "ArrowDown" || e.key === "PageDown") {
    showScene(currentScene + 1);
  }

  if (e.key === "ArrowUp" || e.key === "PageUp") {
    showScene(currentScene - 1);
  }

  if (e.key === "Home") {
    showScene(0);
  }

  if (e.key === "End") {
    showScene(scenes.length - 1);
  }
});

/* ================= NAV DOT CLICKS ================= */

navDots.forEach(dot => {
  dot.addEventListener("click", () => {
    const index = Number(dot.dataset.index);
    showScene(index);
  });
});

/* ================= INITIAL LOAD ANIMATION ================= */

gsap.to(".scene.active h1, .scene.active h2", {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: "power3.out"
});

gsap.to(".scene.active p", {
  opacity: 1,
  y: 0,
  duration: 0.8,
  delay: 0.15,
  ease: "power3.out"
});
