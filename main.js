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

  // RESET incoming scene elements
  gsap.set(next.querySelectorAll("h1, h2"), {
    opacity: 0,
    y: 40
  });

  gsap.set(next.querySelectorAll("p, ul, .cards"), {
    opacity: 0,
    y: 30
  });

  // IN headings
  tl.to(
    next.querySelectorAll("h1, h2"),
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
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
      duration: 0.45,
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

/* ================= HERO TYPING (SCENE AWARE) ================= */
const heroText = "Computer Science Student | Drone Enthusiast | CAD Designer";
const typingTarget = document.getElementById("typing-text");

let typingIndex = 0;
let typingInterval = null;

function startHeroTyping() {
  if (!typingTarget) return;

  // Reset
  clearInterval(typingInterval);
  typingTarget.textContent = "";
  typingIndex = 0;

  typingInterval = setInterval(() => {
    if (typingIndex < heroText.length) {
      typingTarget.textContent =
        heroText.slice(0, typingIndex + 1) + " |";
      typingIndex++;
    } else {
      clearInterval(typingInterval);
      typingTarget.textContent = heroText; // remove cursor at end
    }
  }, 50);
}

/* Hook into scene changes */
const originalShowScene = showScene;

showScene = function (index) {
  originalShowScene(index);

  // Hero scene is index 0
  if (index === 0) {
    setTimeout(startHeroTyping, 500);
  }
};

// Initial load
setTimeout(startHeroTyping, 900);


/* ================= ABOUT QUOTE CIPHER ================= */
const quotes = [
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "Programs must be written for people to read. — Harold Abelson",
  "The best systems are built with clarity, not complexity.",
  "Engineering is about trade-offs, not perfection."
];

const quoteElement = document.getElementById("quote-text");
let quoteIndex = 0;
let cipherInterval = null;
let activeCipher = false;
const cipherChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

function cipherText(targetText, duration = 900) {
  if (!quoteElement) return;

  const startTime = performance.now();
  activeCipher = true;

  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    let output = "";

    for (let i = 0; i < targetText.length; i++) {
      if (i < progress * targetText.length) {
        output += targetText[i];
      } else {
        output += cipherChars[Math.floor(Math.random() * cipherChars.length)];
      }
    }

    quoteElement.textContent = output;

    if (progress < 1 && activeCipher) {
      requestAnimationFrame(animate);
    } else {
      quoteElement.textContent = targetText;
    }
  }

  requestAnimationFrame(animate);
}

function startQuoteCycle() {
  if (!quoteElement || cipherInterval) return;

  cipherText(quotes[quoteIndex]);

  cipherInterval = setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    cipherText(quotes[quoteIndex]);
  }, 4200);
}

function stopQuoteCycle() {
  activeCipher = false;
  clearInterval(cipherInterval);
  cipherInterval = null;
}

/* Hook into scene switching */
const originalShowSceneForQuotes = showScene;

showScene = function (index) {
  originalShowSceneForQuotes(index);

  // About scene index = 1
  if (index === 1) {
    startQuoteCycle();
  } else {
    stopQuoteCycle();
  }
};



