const students = [
    "Jan", "Tanja", "Holger", "Fanny", "Hannah",
    "Benjamin", "Eric", "Noah", "Elias", "Amelie",
    "Aliyah", "Caroline", "Maria", "Freya", "Linus", "Frederik"
];

function displayStudents() {
    const studentsList = document.getElementById("studentsList");
    studentsList.innerHTML = "";

    students.sort().forEach((student, index) => {
        const studentCard = document.createElement("div");
        studentCard.className = "student-card";
        studentCard.style.opacity = "0";
        studentCard.style.transform = "translateY(20px)";
        studentCard.addEventListener("click", () => {
          let link = document.createElement("a");
            link.href = "/" + student.toLowerCase();
            link.click();
        });

        const studentName = document.createElement("div");
        studentName.className = "student-name";
        studentName.textContent = student;

        studentCard.appendChild(studentName);
        studentsList.appendChild(studentCard);

        setTimeout(() => {
            studentCard.style.transition = "all 0.6s ease-out";
            studentCard.style.opacity = "1";
            studentCard.style.transform = "translateY(0)";
        }, 100 * index);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayStudents();
    const cards = document.querySelectorAll(".student-card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-10px) scale(1.02)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
        });
    });
});