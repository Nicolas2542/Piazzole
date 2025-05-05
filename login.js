// Funzione per generare un salt casuale
function generateSalt() {
    return CryptoJS.lib.WordArray.random(16).toString();
}

// Funzione per hashare la password con il salt
function hashPassword(password, salt) {
    return CryptoJS.SHA256(password + salt).toString();
}

// Funzione per verificare se l'utente è autenticato
function isAuthenticated() {
    // Verifica sia l'autenticazione che la sessione
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionTime = localStorage.getItem('sessionTime');
    
    if (!isAuth || !sessionTime) {
        return false;
    }
    
    // Verifica se la sessione è scaduta (15 minuti)
    const now = new Date().getTime();
    const sessionExpired = now - parseInt(sessionTime) > 15 * 60 * 1000;
    
    if (sessionExpired) {
        logout();
        return false;
    }
    
    return true;
}

// Funzione per reindirizzare alla pagina di login se non autenticato
function checkAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    if (!isAuthenticated() && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
}

// Funzione per gestire il login
function handleLogin(password) {
    // Carica la password hashata e il salt dal localStorage
    const storedHash = localStorage.getItem('passwordHash');
    const storedSalt = localStorage.getItem('passwordSalt');

    // Se non esiste una password salvata, crea la prima password
    if (!storedHash || !storedSalt) {
        const salt = generateSalt();
        const hash = hashPassword(password, salt);
        localStorage.setItem('passwordHash', hash);
        localStorage.setItem('passwordSalt', salt);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('sessionTime', new Date().getTime().toString());
        return true;
    }

    // Verifica la password
    const hash = hashPassword(password, storedSalt);
    if (hash === storedHash) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('sessionTime', new Date().getTime().toString());
        return true;
    }

    return false;
}

// Funzione per il logout
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sessionTime');
    window.location.href = 'login.html';
}

// Gestione del form di login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('loginError');

        if (handleLogin(password)) {
            // Reindirizza alla pagina index
            window.location.href = 'index.html';
        } else {
            loginError.textContent = 'Password non valida';
            loginError.classList.remove('d-none');
        }
    });
}

// Aggiungi pulsante di logout se esiste
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Verifica l'autenticazione al caricamento della pagina
checkAuth(); 