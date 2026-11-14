const membersContainer = document.querySelector("#members");
const countElement = document.querySelector("#member-count");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

// Build elements rather than inserting data directly into innerHTML.
function createTextElement(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = value;
  return element;
}

function createMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";
  const image = document.createElement("img");
  image.className = "member-image";
  image.src = `images/${member.image}`;
  image.alt = `Illustrated logo for ${member.name}`;
  image.loading = "lazy";
  image.width = 400;
  image.height = 150;
  card.append(image);

  const info = document.createElement("div");
  info.className = "member-info";
  const top = document.createElement("div");
  top.className = "member-topline";
  top.append(createTextElement("h3", "", member.name));
  const levels = { 1: "Member", 2: "Silver", 3: "Gold" };
  const level = createTextElement("span", `level level-${(levels[member.membership] || "member").toLowerCase()}`, levels[member.membership] || "Member");
  top.append(level);
  info.append(top);
  info.append(createTextElement("p", "category", member.category));
  info.append(createTextElement("p", "description", member.description));
  const details = document.createElement("address");
  details.className = "member-details";
  details.append(createTextElement("span", "", member.address));
  details.append(createTextElement("span", "", member.phone));
  const link = document.createElement("a");
  link.href = member.website;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Visit website ↗";
  details.append(link);
  info.append(details);
  card.append(info);
  return card;
}

async function displayMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const members = await response.json();
    membersContainer.replaceChildren(...members.map(createMemberCard));
    countElement.textContent = `${members.length} local business examples`;
  } catch (error) {
    countElement.textContent = "Unable to load directory";
    membersContainer.replaceChildren(createTextElement("p", "", "Could not load members. Open the site using Live Server and try again."));
    console.error("Failed to load member data:", error);
  }
}

function setView(view) {
  const list = view === "list";
  membersContainer.className = list ? "members-list" : "members-grid";
  gridButton.classList.toggle("active", !list);
  listButton.classList.toggle("active", list);
  gridButton.setAttribute("aria-pressed", String(!list));
  listButton.setAttribute("aria-pressed", String(list));
}
gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));
document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;
displayMembers();
