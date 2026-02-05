
const TEMA_KEY = 'cinemaApiTema';
const DARK_MODE_CLASS = 'dark-mode';

$(document).ready(function() {
    function aplicarTemaSalvo() {
        const temaSalvo = localStorage.getItem(TEMA_KEY);
        if (temaSalvo === 'dark') {
            $('body').addClass(DARK_MODE_CLASS);
            $('#toggleThemeIcon').removeClass('bi-sun-fill').addClass('bi-moon-fill');
        } else {
            $('body').removeClass(DARK_MODE_CLASS);
            $('#toggleThemeIcon').removeClass('bi-moon-fill').addClass('bi-sun-fill');
        }
    }

    $('#toggleTheme').on('click', function() {
        const isDarkMode = $('body').hasClass(DARK_MODE_CLASS);
        
        if (isDarkMode) {
            $('body').removeClass(DARK_MODE_CLASS);
            localStorage.setItem(TEMA_KEY, 'light');
            $('#toggleThemeIcon').removeClass('bi-moon-fill').addClass('bi-sun-fill');
        } else {
            $('body').addClass(DARK_MODE_CLASS);
            localStorage.setItem(TEMA_KEY, 'dark');
            $('#toggleThemeIcon').removeClass('bi-sun-fill').addClass('bi-moon-fill');
        }
    });

    aplicarTemaSalvo();
});