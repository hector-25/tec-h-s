/* Tec-H-S · navegación, accesibilidad, progreso y práctica */
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const open = navMenu.classList.toggle("active");
        menuToggle.textContent = open ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    navMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    }));
}
const themeToggle = document.getElementById("theme-toggle");
const themeKey = "techs-theme-v1";
function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(themeKey, theme); } catch (_) {}
    if (themeToggle) {
        const next = theme === "dark" ? "light" : "dark";
        themeToggle.textContent = next === "light" ? "☼ Tema claro" : "☾ Tema oscuro";
        themeToggle.setAttribute("aria-label", `Activar tema ${next === "light" ? "claro" : "oscuro"}`);
        themeToggle.setAttribute("aria-pressed", String(theme === "light"));
    }
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem(themeKey) || "dark"; } catch (_) {}
applyTheme(savedTheme === "light" ? "light" : "dark");
if (themeToggle) themeToggle.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
const resourceCards = [...document.querySelectorAll(".resource-card")];
const searchInput = document.getElementById("search-input");
const levelFilter = document.getElementById("level-filter");
const searchCount = document.getElementById("search-count");
const noResults = document.getElementById("no-results");
function filterResources() {
    const query = (searchInput?.value || "").toLocaleLowerCase("es").trim();
    const level = levelFilter?.value || "all";
    let visible = 0;
    resourceCards.forEach(card => {
        const content = `${card.textContent} ${card.dataset.search || ""}`.toLocaleLowerCase("es");
        const matches = content.includes(query) && (level === "all" || card.dataset.level === level);
        card.hidden = !matches;
        if (matches) visible++;
    });
    if (searchCount) searchCount.textContent = `${visible} ${visible === 1 ? "recurso encontrado" : "recursos encontrados"}`;
    if (noResults) noResults.hidden = visible !== 0;
}
searchInput?.addEventListener("input", filterResources);
levelFilter?.addEventListener("change", filterResources);
if (searchInput || levelFilter) filterResources();
const glossarySearch = document.getElementById("glossary-search");
const glossaryEntries = [...document.querySelectorAll("[data-glossary-entry]")];
glossarySearch?.addEventListener("input", () => {
    const query = glossarySearch.value.toLocaleLowerCase("es").trim();
    glossaryEntries.forEach(entry => { entry.hidden = !entry.textContent.toLocaleLowerCase("es").includes(query); });
});
const topicIds = ["programacion", "inteligencia-artificial", "ciberseguridad", "bases-de-datos", "python", "javascript", "html", "css", "hardware", "software", "windows", "office", "mantenimiento", "redes", "linux"];
const progressKey = "techs-completed-lessons-v1";
function readProgress() {
    try { const value = JSON.parse(localStorage.getItem(progressKey) || "[]"); return Array.isArray(value) ? value.filter(id => topicIds.includes(id)) : []; }
    catch (_) { return []; }
}
function readCourseExercises(topic) {
    try { const data = JSON.parse(localStorage.getItem("techs-course-exercises-v1") || "{}"); return Array.isArray(data[topic]) ? data[topic] : []; } catch (_) { return []; }
}
function saveCourseExercise(topic, exercise) {
    try { const data = JSON.parse(localStorage.getItem("techs-course-exercises-v1") || "{}"); const solved = Array.isArray(data[topic]) ? data[topic] : []; if (!solved.includes(exercise)) solved.push(exercise); data[topic] = solved; localStorage.setItem("techs-course-exercises-v1", JSON.stringify(data)); return solved; } catch (_) { return []; }
}
function renderProgress() {
    const completed = readProgress();
    const overall = document.getElementById("overall-progress");
    const overallLabel = document.getElementById("overall-progress-label");
    if (overall) { overall.max = topicIds.length; overall.value = completed.length; }
    if (overallLabel) overallLabel.textContent = `${completed.length} de ${topicIds.length} rutas completadas`;
    const topic = document.body.dataset.topic;
    const topicProgress = document.getElementById("topic-progress");
    const topicLabel = document.getElementById("topic-progress-label");
    const completeButton = document.getElementById("complete-lesson");
    const isComplete = Boolean(topic && completed.includes(topic));
    const courseSize = Number(document.body.dataset.courseSize || 0);
    const solvedCount = courseSize ? readCourseExercises(topic).length : 0;
    if (topicProgress) { topicProgress.max = courseSize || 1; topicProgress.value = isComplete && courseSize ? courseSize : (isComplete ? 1 : solvedCount); }
    if (topicLabel) topicLabel.textContent = isComplete ? (courseSize ? "Ruta completada" : "Lección completada") : (courseSize ? `${solvedCount} de ${courseSize} ejercicios resueltos` : "Lección pendiente");
    if (completeButton) {
        completeButton.textContent = isComplete ? (courseSize ? "✓ Ruta completada · Deshacer" : "✓ Lección completada · Deshacer") : (courseSize ? "Marcar ruta como completada" : "Marcar lección como completada");
        completeButton.setAttribute("aria-pressed", String(isComplete));
    }
}
function setCompletion(topic, done) {
    if (!topicIds.includes(topic)) return;
    let completed = readProgress().filter(id => id !== topic);
    if (done) completed.push(topic);
    try { localStorage.setItem(progressKey, JSON.stringify(completed)); } catch (_) {}
    renderProgress();
}
document.getElementById("complete-lesson")?.addEventListener("click", () => {
    const topic = document.body.dataset.topic;
    setCompletion(topic, !readProgress().includes(topic));
});
renderProgress();
document.querySelectorAll(".hint-toggle").forEach(button => button.addEventListener("click", () => {
    const hint = document.getElementById(button.getAttribute("aria-controls"));
    if (!hint) return;
    const open = hint.hidden;
    hint.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Ocultar pista" : "Ver una pista";
}));
document.querySelectorAll(".practice-quiz").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    const input = form.querySelector("input[type='text']");
    const feedback = form.querySelector("[data-quiz-feedback]");
    const answer = (input?.value || "").trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!answer) { feedback.textContent = "Escribe una respuesta para comprobarla."; feedback.className = "quiz-feedback"; input?.focus(); return; }
    const accepted = (form.dataset.accepted || "").split("|").map(value => value.trim().toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    const correct = accepted.some(value => answer === value || answer.includes(value));
    if (!correct) {
        feedback.textContent = "Todavía no. Revisa la explicación o usa la pista e inténtalo de nuevo.";
        feedback.className = "quiz-feedback is-try-again";
        return;
    }
    const topic = document.body.dataset.topic;
    const exercise = form.dataset.exercise;
    const courseSize = Number(document.body.dataset.courseSize || 0);
    if (exercise && courseSize) {
        const solved = saveCourseExercise(topic, exercise);
        const finished = solved.length >= courseSize;
        feedback.textContent = finished ? `¡Excelente! Completaste los ${courseSize} ejercicios de esta ruta.` : `¡Correcto! Llevas ${solved.length} de ${courseSize} ejercicios resueltos.`;
        feedback.className = "quiz-feedback is-correct";
        if (finished) setCompletion(topic, true);
        else renderProgress();
    } else {
        feedback.textContent = "¡Correcto! Lección completada.";
        feedback.className = "quiz-feedback is-correct";
        setCompletion(topic, true);
    }
}));

