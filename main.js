/* ---------------- particle initializer ---------------- */

particlesJS("background", {
  particles: {
    number: {
      value: 120,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: "#ffffff"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5,
      random: true
    },
    size: {
      value: 2,
      random: true
    },
    line_linked: {
      enable: false
    },
    move: {
      enable: true,
      speed: 0.3,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: {
        enable: false
      },
      onclick: {
        enable: false
      },
      resize: true
    }
  },
  retina_detect: true
});

/* ---------------- DATA LOADING ---------------- */

fetch("data/projects.json")
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById("projects-container");
    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "card";
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
    tools.forEach(tool => {
      const li = document.createElement("li");
      li.textContent = tool;
      container.appendChild(li);
    });
  });

/* ---------------- SCENE SWITCHING ---------------- */

const scenes = document.querySelectorAll(".scene");
let currentScene = 0;
let isAnimating = false;

function showScene(index, direction) {
  if (isAnimating || index < 0 || index >= scenes.length) return;

  isAnimating = true;

  const current = scenes[currentScene];
  const next = scenes[index];

  next.style.display = "block";

  gsap.fromTo(
    next,
    { opacity: 0, y: direction * 80 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }
  );

  gsap.to(current, {
    opacity: 0,
    y: -direction * 80,
    duration: 0.6,
    ease: "power2.in",
    onComplete: () => {
      current.classList.remove("active");
      current.style.display = "none";
      current.style.opacity = 1;
      current.style.transform = "translateY(0)";
      next.classList.add("active");
      currentScene = index;
      isAnimating = false;
    }
  });
}

window.addEventListener("wheel", e => {
    e.preventDefault();
    if (isAnimating) return;

    if (e.deltaY > 0) {
      showScene(currentScene + 1, 1);
    } else {
      showScene(currentScene - 1, -1);
    }
  },
  { passive: false}
);

