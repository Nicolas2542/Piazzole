// Verifica l'autenticazione all'inizio
if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

// Gestione del form di modifica password
const changePasswordForm = document.getElementById('changePasswordForm');
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        const passwordError = document.getElementById('passwordError');
        const passwordSuccess = document.getElementById('passwordSuccess');
        
        // Nascondi i messaggi precedenti
        passwordError.classList.add('d-none');
        passwordSuccess.classList.add('d-none');
        
        // Verifica che la password attuale sia corretta
        const storedHash = localStorage.getItem('passwordHash');
        const storedSalt = localStorage.getItem('passwordSalt');
        const currentHash = hashPassword(currentPassword, storedSalt);
        
        if (currentHash !== storedHash) {
            passwordError.textContent = 'Password attuale non corretta';
            passwordError.classList.remove('d-none');
            return;
        }
        
        // Verifica che le nuove password coincidano
        if (newPassword !== confirmPassword) {
            passwordError.textContent = 'Le nuove password non coincidono';
            passwordError.classList.remove('d-none');
            return;
        }
        
        // Verifica che la nuova password sia diversa da quella attuale
        if (newPassword === currentPassword) {
            passwordError.textContent = 'La nuova password deve essere diversa da quella attuale';
            passwordError.classList.remove('d-none');
            return;
        }
        
        // Genera un nuovo salt e hash per la nuova password
        const newSalt = generateSalt();
        const newHash = hashPassword(newPassword, newSalt);
        
        // Salva la nuova password
        localStorage.setItem('passwordHash', newHash);
        localStorage.setItem('passwordSalt', newSalt);
        
        // Mostra il messaggio di successo
        passwordSuccess.textContent = 'Password modificata con successo';
        passwordSuccess.classList.remove('d-none');
        
        // Pulisci il form
        changePasswordForm.reset();
    });
}

// Gestione del pulsante Cambia Password
const cambiaPasswordBtn = document.getElementById('cambiaPasswordBtn');
if (cambiaPasswordBtn) {
    cambiaPasswordBtn.addEventListener('click', function() {
        window.location.href = 'cambia_password.html';
    });
}

// Funzione per aggiornare la data e l'ora
function aggiornaDataOra() {
    const oraCorrenteElement = document.getElementById('data-ora-corrente');
    if (oraCorrenteElement) {
        const now = new Date();
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dataFormattata = now.toLocaleDateString('it-IT', optionsDate);
        const oraFormattata = now.toLocaleTimeString('it-IT', optionsTime);
        oraCorrenteElement.textContent = `${dataFormattata} - ${oraFormattata}`;
    }
}

// Aggiorna subito la data e l'ora
aggiornaDataOra();

// Aggiorna l'ora ogni secondo
setInterval(aggiornaDataOra, 1000);

// Funzione per aggiornare la tabella dei tempi
function aggiornaTabellaTempi() {
    console.log('Aggiornamento tabella tempi...');
    const tempi = JSON.parse(localStorage.getItem('tempiCarico') || '{}');
    console.log('Dati tempi caricati:', tempi);
    
    const tbody = document.getElementById('tempiTableBody');
    tbody.innerHTML = '';

    for (const [id, dati] of Object.entries(tempi)) {
        const row = document.createElement('tr');
        
        // Calcola il tempo totale in minuti
        let tempoTotale = 'N/A';
        if (dati.arrivo && dati.completamento) {
            const tempoMs = dati.completamento - dati.arrivo;
            const tempoMin = Math.floor(tempoMs / (1000 * 60));
            tempoTotale = `${tempoMin} minuti`;
        }

        // Formatta le date in formato italiano
        const arrivoFormattato = dati.arrivo ? new Date(dati.arrivo).toLocaleTimeString('it-IT') : 'N/A';
        const completamentoFormattato = dati.completamento ? new Date(dati.completamento).toLocaleTimeString('it-IT') : 'N/A';

        row.innerHTML = `
            <td>${id}</td>
            <td>${dati.turno || 'N/A'}</td>
            <td>${dati.classe || 'N/A'}</td>
            <td>${arrivoFormattato}</td>
            <td>${completamentoFormattato}</td>
            <td>${tempoTotale}</td>
        `;
        
        tbody.appendChild(row);
    }
}

// Aggiorna la tabella all'avvio e ogni 30 secondi
aggiornaTabellaTempi();
setInterval(aggiornaTabellaTempi, 30000);

// Funzione per cancellare tutti i dati
function cancellaTuttiDati() {
    if (confirm('Sei sicuro di voler cancellare tutti i dati di monitoraggio? Questa azione non può essere annullata.')) {
        // Cancella i dati dal localStorage
        localStorage.removeItem('tempiCarico');
        localStorage.removeItem('coloriCard');
        localStorage.removeItem('confermeStato');
        
        // Aggiorna la tabella
        aggiornaTabellaTempi();
        
        // Reindirizza alla pagina principale per aggiornare lo stato delle card
        window.location.href = 'index.html';
    }
}

// Funzione per scaricare i dati in Excel
function scaricaExcel() {
    // Ottieni i dati dal localStorage
    const tempi = JSON.parse(localStorage.getItem('tempiCarico') || '{}');
    
    // Crea l'header del CSV con BOM per Excel
    let csvContent = "\ufeff"; // Aggiunge BOM per Excel
    csvContent += "ID;Turno;Classe;Orario Arrivo;Orario Completamento;Tempo Totale (minuti)\n";
    
    // Aggiungi i dati
    for (const [id, dati] of Object.entries(tempi)) {
        // Calcola il tempo totale in minuti
        let tempoTotale = 'N/A';
        if (dati.arrivo && dati.completamento) {
            const tempoMs = dati.completamento - dati.arrivo;
            const tempoMin = Math.floor(tempoMs / (1000 * 60));
            tempoTotale = tempoMin;
        }

        // Formatta le date in formato italiano
        const arrivoFormattato = dati.arrivo ? new Date(dati.arrivo).toLocaleTimeString('it-IT') : 'N/A';
        const completamentoFormattato = dati.completamento ? new Date(dati.completamento).toLocaleTimeString('it-IT') : 'N/A';

        // Aggiungi la riga al CSV usando punto e virgola come separatore
        csvContent += `${id};${dati.turno || 'N/A'};${dati.classe || 'N/A'};${arrivoFormattato};${completamentoFormattato};${tempoTotale}\n`;
    }
    
    // Crea il blob e il link per il download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    // Imposta il nome del file con la data corrente
    const data = new Date();
    const dataFormattata = data.toLocaleDateString('it-IT').replace(/\//g, '-');
    const oraFormattata = data.toLocaleTimeString('it-IT').replace(/:/g, '-');
    
    link.setAttribute("href", url);
    link.setAttribute("download", `monitoraggio_tempi_${dataFormattata}_${oraFormattata}.csv`);
    link.style.visibility = 'hidden';
    
    // Aggiungi il link al documento e simula il click
    document.body.appendChild(link);
    link.click();
    
    // Rimuovi il link
    document.body.removeChild(link);
}

// Aggiungi il pulsante per cancellare i dati
const resetButton = document.createElement('button');
resetButton.className = 'btn btn-danger mt-3';
resetButton.textContent = 'Cancella Tutti i Dati';
resetButton.onclick = cancellaTuttiDati;

// Aggiungi il pulsante per scaricare Excel
const excelButton = document.createElement('button');
excelButton.className = 'btn btn-success mt-3 ms-2';
excelButton.innerHTML = '<i class="fas fa-file-excel"></i> Scarica Excel';
excelButton.onclick = scaricaExcel;

// Inserisci il pulsante prima della tabella
const tableContainer = document.querySelector('.table-responsive');
if (tableContainer) {
    tableContainer.parentNode.insertBefore(resetButton, tableContainer);
    resetButton.parentNode.insertBefore(excelButton, resetButton.nextSibling);
} 