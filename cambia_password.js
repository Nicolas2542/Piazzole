// Verifica l'autenticazione all'inizio
if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

// Gestione del form di modifica password
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    const successDiv = document.getElementById('passwordSuccess');
    
    // Reset dei messaggi
    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');
    
    // Verifica che la password attuale sia corretta
    const storedHash = localStorage.getItem('passwordHash');
    const storedSalt = localStorage.getItem('passwordSalt');
    const currentHash = hashPassword(currentPassword, storedSalt);
    
    if (currentHash !== storedHash) {
        errorDiv.textContent = 'Password attuale non corretta';
        errorDiv.classList.remove('d-none');
        return;
    }
    
    // Verifica che le nuove password coincidano
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Le nuove password non coincidono';
        errorDiv.classList.remove('d-none');
        return;
    }
    
    // Verifica che la nuova password sia diversa da quella attuale
    if (newPassword === currentPassword) {
        errorDiv.textContent = 'La nuova password deve essere diversa da quella attuale';
        errorDiv.classList.remove('d-none');
        return;
    }
    
    // Genera un nuovo salt e hash per la nuova password
    const newSalt = generateSalt();
    const newHash = hashPassword(newPassword, newSalt);
    
    // Salva la nuova password
    localStorage.setItem('passwordHash', newHash);
    localStorage.setItem('passwordSalt', newSalt);
    
    // Mostra il messaggio di successo
    successDiv.textContent = 'Password modificata con successo';
    successDiv.classList.remove('d-none');
    
    // Resetta il form
    document.getElementById('changePasswordForm').reset();
}); 