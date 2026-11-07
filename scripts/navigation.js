// Navigation bar
const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
    const isOpen = navButton.classList.toggle('show');
    navButton.setAttribute('aria-expanded', isOpen);
    navBar.classList.toggle('show');
});


// Dates
const currentYear = document.querySelector('#currentyear');
currentYear.textContent = new Date().getFullYear();

const lastModified = document.querySelector('#lastModified');
lastModified.textContent = document.lastModified;