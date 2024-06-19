function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('selectedTheme', theme);
}

document.getElementById('theme-selector').addEventListener('change', function() {
    applyTheme(this.value);
});


// aplicam tema din local storage cand se incarca pagina
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    applyTheme(savedTheme);
    // setam valoarea selectata sau butonul radio la tema salvata
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector.tagName === 'SELECT') {
        themeSelector.value = savedTheme;
    } else {
        document.querySelector(`#theme-selector input[value="${savedTheme}"]`).checked = true;
    }
});