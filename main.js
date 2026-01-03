// LOAD PROJECTS
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

// LOAD TOOLS
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
