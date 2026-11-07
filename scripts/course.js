
const courses = [
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 2, completed: false },
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false }
];

const courseList = document.querySelector('#course-list');
const courseTotal = document.querySelector('#course-total');
const filterButtons = document.querySelectorAll('.filter-button');

function displayCourses(filteredCourses) {
    courseList.replaceChildren();

    filteredCourses.forEach((course) => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
            card.setAttribute('aria-label', `${course.subject} ${course.number}: completed`);
        }
        card.textContent = `${course.subject} ${course.number}`;
        card.title = `${course.title} — ${course.credits} credits`;
        courseList.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
    courseTotal.textContent = `Total credits for displayed courses: ${totalCredits}`;
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((otherButton) => {
            const selected = otherButton === button;
            otherButton.classList.toggle('active', selected);
            otherButton.setAttribute('aria-pressed', String(selected));
        });

        const selectedSubject = button.dataset.filter;
        const filteredCourses = selectedSubject === 'all'
            ? courses
            : courses.filter((course) => course.subject === selectedSubject);
        displayCourses(filteredCourses);
    });
});

displayCourses(courses);
