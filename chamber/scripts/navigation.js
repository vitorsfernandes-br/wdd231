const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");
menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  menuButton.textContent = isOpen ? "✕" : "☰";
});

// Footer details shared by every page.
document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;
