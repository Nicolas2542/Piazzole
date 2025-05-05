// Verifica l'autenticazione all'inizio
if (!isAuthenticated() && window.location.pathname !== '/login.html') {
    window.location.href = 'login.html';
}

// Variabile per tenere traccia dello stato di autenticazione
let isAdmin = false;
let isPreposto = false;
let confermeStato = new Set(); // Stato per memorizzare gli ID confermati

// Variabile globale per gli equipaggi, inizializzata vuota
let equipaggi = [];

// Array di default per gli equipaggi
const equipaggiDefault = [
    // Buche da 4 a 11
    { id: 5001, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5002, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5003, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5004, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5005, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5006, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5007, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5008, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5009, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5010, turno: '', classe: '', sezione: 1, note: '' },
    // Buche da 12 a 13
    { id: 5500, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5501, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5748, turno: '', classe: '', sezione: 1, note: '' },
    { id: 5999, turno: '', classe: '', sezione: 1, note: '' },
    // Buche da 14 a 20
    { id: 7012, turno: '', classe: '', sezione: 1, note: '' },
    { id: 7345, turno: '', classe: '', sezione: 1, note: '' },
    { id: 7567, turno: '', classe: '', sezione: 1, note: '' },
    { id: 7568, turno: '', classe: '', sezione: 1, note: '' },
    { id: 7678, turno: '', classe: '', sezione: 1, note: '' },
    // Buche da 21 a 27
    { id: 7890, turno: '', classe: '', sezione: 2, note: '' },
    { id: 8012, turno: '', classe: '', sezione: 2, note: '' },
    { id: 8234, turno: '', classe: '', sezione: 2, note: '' },
    { id: 8456, turno: '', classe: '', sezione: 2, note: '' },
    { id: 8678, turno: '', classe: '', sezione: 2, note: '' },
    { id: 8901, turno: '', classe: '', sezione: 2, note: '' },
    { id: 9123, turno: '', classe: '', sezione: 2, note: '' }
];

// Funzione per salvare i dati nel localStorage con backup
function salvaDati(key, data) {
    try {
        // Crea un backup dei dati esistenti
        const backupKey = `${key}_backup`;
        const existingData = localStorage.getItem(key);
        if (existingData) {
            localStorage.setItem(backupKey, existingData);
        }

        // Salva i nuovi dati
        const dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);

        // Verifica che i dati siano stati salvati correttamente
        const savedData = localStorage.getItem(key);
        if (savedData !== dataString) {
            console.error(`Errore nel salvataggio dei dati per ${key}`);
            // Ripristina dal backup se disponibile
            if (localStorage.getItem(backupKey)) {
                localStorage.setItem(key, localStorage.getItem(backupKey));
            }
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Errore nel salvataggio di ${key}:`, error);
        return false;
    }
}

// Funzione per caricare i dati dal localStorage con gestione degli errori
function caricaDati(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return defaultValue;

        const parsedData = JSON.parse(data);
        return parsedData;
    } catch (error) {
        console.error(`Errore nel caricamento di ${key}:`, error);
        return defaultValue;
    }
}

// Funzione migliorata per salvare lo stato corrente
function salvaStato() {
    console.log('Inizio salvataggio stato...');
    console.log('Stato coloriCard prima del salvataggio:', coloriCard);
    
    try {
        // Salva lo stato delle conferme
        localStorage.setItem('confermeStato', JSON.stringify([...confermeStato]));
        console.log('Conferme salvate:', [...confermeStato]);
        
        // Salva i colori delle card
        const coloriDaSalvare = {};
        for (const [id, colore] of Object.entries(coloriCard)) {
            coloriDaSalvare[id] = colore;
        }
        localStorage.setItem('coloriCard', JSON.stringify(coloriDaSalvare));
        console.log('Colori card salvati:', coloriDaSalvare);
        
        // Verifica che i colori siano stati salvati correttamente
        const coloriVerifica = JSON.parse(localStorage.getItem('coloriCard'));
        console.log('Colori verificati dopo il salvataggio:', coloriVerifica);
        
        // Salva l'array degli equipaggi completo
        localStorage.setItem('equipaggiStato', JSON.stringify(equipaggi));
        console.log('Equipaggi salvati:', equipaggi);
        
        console.log('Salvataggio stato completato con successo');
        return true;
    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        return false;
    }
}

// Funzione per caricare lo stato salvato
function caricaStatoSalvato() {
    console.log('=== INIZIO CARICAMENTO ===');
    
    // Debug dello stato prima del caricamento
    debugStatoDati('Prima del caricamento');
    
    // Carica i colori delle card
    const coloriCardJSON = localStorage.getItem('coloriCard');
    console.log('Colori card dal localStorage:', coloriCardJSON);
    
    if (coloriCardJSON) {
        try {
            const coloriCaricati = JSON.parse(coloriCardJSON);
            coloriCard = coloriCaricati;
            console.log('Colori card caricati:', coloriCard);
            
            // Applica i colori alle card
            for (const [id, colore] of Object.entries(coloriCard)) {
                const card = document.querySelector(`.card-equipaggio[data-original-id="${id}"]`);
                if (card) {
                    card.style.backgroundColor = colore;
                    console.log(`Applicato colore ${colore} alla card ${id}`);
                }
            }
        } catch (error) {
            console.error('Errore nel caricamento dei colori delle card:', error);
            coloriCard = {};
        }
    }
    
    // Carica lo stato di autenticazione
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        isAdmin = true;
        document.body.classList.add('admin-mode');
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.textContent = 'Logout Admin';
            loginBtn.classList.remove('btn-outline-primary');
            loginBtn.classList.add('btn-outline-danger');
        }
        const resetAllBtn = document.getElementById('resetAllBtn');
        if (resetAllBtn) resetAllBtn.classList.remove('d-none');
        const monitoraggioBtn = document.getElementById('monitoraggioBtn');
        if (monitoraggioBtn) monitoraggioBtn.classList.remove('d-none');
    }
    
    if (localStorage.getItem('isPrepostoLoggedIn') === 'true') {
        isPreposto = true;
        document.body.classList.add('preposto-mode');
        const prepostoBtn = document.getElementById('prepostoBtn');
        if (prepostoBtn) {
            prepostoBtn.textContent = 'Logout Preposto';
            prepostoBtn.classList.remove('btn-outline-secondary');
            prepostoBtn.classList.add('btn-outline-success');
        }
    }
    
    // Carica lo stato delle conferme
    const confermeJSON = localStorage.getItem('confermeStato');
    if (confermeJSON) {
        const confermeArray = JSON.parse(confermeJSON);
        confermeStato = new Set(confermeArray);
        console.log('Conferme caricate:', confermeArray);
    }
    
    // Carica l'intero stato degli equipaggi
    const equipaggiStatoJSON = localStorage.getItem('equipaggiStato');
    console.log('Dati equipaggiStato dal localStorage:', equipaggiStatoJSON);
    
    if (equipaggiStatoJSON) {
        try {
            // Carica gli equipaggi e rimuovi i duplicati
            const equipaggiCaricati = JSON.parse(equipaggiStatoJSON);
            equipaggi = [];
            const idUnici = new Set();
            
            // Filtra i duplicati mantenendo l'ultima occorrenza
            for (let i = equipaggiCaricati.length - 1; i >= 0; i--) {
                const equipaggio = equipaggiCaricati[i];
                if (equipaggio.id !== undefined && equipaggio.id !== '') {
                    if (!idUnici.has(equipaggio.id)) {
                        idUnici.add(equipaggio.id);
                        equipaggi.unshift(equipaggio);
                    }
                } else {
                    equipaggi.unshift(equipaggio);
                }
            }
            
            console.log('Stato completo degli equipaggi caricato:', equipaggi);
        } catch (error) {
            console.error('Errore nel caricamento dello stato degli equipaggi:', error);
            equipaggi = [...equipaggiDefault]; // Usa l'array di default in caso di errore
        }
    } else {
        console.log('Nessuno stato degli equipaggi trovato nel localStorage');
        equipaggi = [...equipaggiDefault]; // Usa l'array di default se non ci sono dati salvati
    }
    
    // Carica le modifiche ai campi degli equipaggi
    const campiModificatiJSON = localStorage.getItem('campiModificati');
    console.log('Dati campiModificati dal localStorage:', campiModificatiJSON);
    
    if (campiModificatiJSON) {
        const campiModificati = JSON.parse(campiModificatiJSON);
        console.log('Campi modificati da applicare:', campiModificati);
        
        // Applica le modifiche agli equipaggi
        for (const id in campiModificati) {
            console.log(`Elaborazione modifiche per ID: ${id}`);
            const equipaggioIndex = equipaggi.findIndex(e => e.id === parseInt(id) || (id === '' && e.id === undefined));
            if (equipaggioIndex !== -1) {
                const modifiche = campiModificati[id];
                console.log(`Modifiche trovate per ID ${id}:`, modifiche);
                for (const campo in modifiche) {
                    console.log(`Applicazione modifica - Campo: ${campo}, Valore: ${modifiche[campo]}`);
                    equipaggi[equipaggioIndex][campo] = modifiche[campo];
                }
            } else {
                console.log(`Nessun equipaggio trovato per ID: ${id}`);
            }
        }
    }
    
    // Carica lo stato dei colori dei campi turno
    const coloriCampoTurnoJSON = localStorage.getItem('coloriCampoTurno');
    if (coloriCampoTurnoJSON) {
        coloriCampoTurno = JSON.parse(coloriCampoTurnoJSON);
        console.log('Colori turno caricati:', coloriCampoTurno);
    }
    
    // Debug dello stato dopo il caricamento
    debugStatoDati('Dopo il caricamento');
    
    console.log('Stato finale degli equipaggi:', equipaggi);
    console.log('=== FINE CARICAMENTO ===');
}

// Funzione per salvare automaticamente ogni 30 secondi e dopo ogni modifica
function setupAutoSave() {
    // Salvataggio automatico periodico
    setInterval(() => {
        if (isAdmin || isPreposto) {
            const success = salvaStato();
            if (success) {
                console.log('Salvataggio automatico completato');
            }
        }
    }, 30000); // 30 secondi

    // Salvataggio dopo ogni modifica
    document.addEventListener('change', () => {
        if (isAdmin || isPreposto) {
            const success = salvaStato();
            if (success) {
                console.log('Salvataggio dopo modifica completato');
            }
        }
    });
}

// Oggetti per memorizzare i colori delle card e dei campi turno
let coloriCard = {};
let coloriCampoTurno = {};

// Gestione click sul pulsante Login Admin
document.getElementById('loginBtn').addEventListener('click', function() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

// Gestione submit del form di login admin
document.getElementById('loginSubmit').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    const loginModalInstance = bootstrap.Modal.getInstance(document.getElementById('loginModal'));

    // Reset stati
    isAdmin = false;
    isPreposto = false;
    loginError.classList.add('d-none');

    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdmin = true;
        console.log('Login Admin riuscito');
        if (loginModalInstance) loginModalInstance.hide();
        popolaGriglie(); // Ricarica le griglie per applicare la vista admin
    } else {
        loginError.classList.remove('d-none');
        console.log('Login fallito');
    }
});

// Credenziali di amministrazione (in un'applicazione reale, queste dovrebbero essere gestite lato server)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

const prepostoCredentials = {
    username: 'preposto',
    password: 'preposto123'
};

// Dati dimostrativi (verranno sovrascritti da localStorage se presente)
// const equipaggi = [ ... ] // La definizione iniziale è ora all'interno di caricaStatoSalvato per gestire il caricamento

function creaCardEquipaggio(equipaggio) {
    const card = document.createElement('div');
    card.className = 'card-equipaggio';
    // Usiamo un ID univoco per ogni card
    const cardId = 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    card.dataset.cardId = cardId;
    card.dataset.originalId = equipaggio.id !== undefined ? equipaggio.id : '';
    
    // Applica dimensioni specifiche per le card con ID selezionati (eccetto 8456 che viene gestito separatamente)
    const idSpeciali = [6023, 6214, 7234, 7456, 7578, 7890, 8012, 8234, 8901, 9123];
    if (idSpeciali.includes(equipaggio.id)) {
        card.classList.add('card-dimensione-specifica');
    }
    
    // Aggiungi classe speciale per le card nelle buche da 4 a 11
    const idBuche4a11 = [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008];
    if (idBuche4a11.includes(equipaggio.id)) {
        card.classList.add('card-buca-4-11');
    }
    
    // Funzione per formattare il valore del campo (gestisce valori vuoti)
    const formattaCampo = (tipo, valore) => {
        if (valore === '' || valore === undefined) {
            return `${tipo}: `;
        }
        return `${tipo}: ${valore}`;
    };
    
    // Inizializza il campo note se non esiste
    if (equipaggio.note === undefined) {
        equipaggio.note = '';
    }
    
    // Creiamo i paragrafi con attributi data per identificarli
    card.innerHTML = `
        <p class="campo-modificabile" data-campo="id" data-valore="${equipaggio.id || ''}"><strong>ID:</strong> ${equipaggio.id || ''}</p>
        <p class="campo-modificabile" data-campo="turno" data-valore="${equipaggio.turno || ''}"><strong>N:</strong> ${equipaggio.turno || ''}</p>
        <p class="campo-modificabile" data-campo="classe" data-valore="${equipaggio.classe || ''}"><strong>CL/TR:</strong> ${equipaggio.classe || ''}</p>
        <p class="campo-modificabile" data-campo="note" data-valore="${equipaggio.note || ''}"><strong>Note:</strong> ${equipaggio.note || ''}</p>
        <p class="ok-button"><strong>Ok</strong></p>
    `;

    // Verifica se il campo classe contiene i numeri 1, 2, 3 o 'ser' e applica lo sfondo appropriato
    if (equipaggio.classe) {
        const campoClasse = card.querySelector('[data-campo="classe"]');
        if (campoClasse) {
            if (equipaggio.classe.toString().includes('1')) {
                // Applica sfondo viola per il numero 1
                campoClasse.style.backgroundColor = 'purple';
                campoClasse.style.color = 'white'; // Migliora la leggibilità con testo bianco
            } else if (equipaggio.classe.toString().includes('2')) {
                // Applica sfondo arancione per il numero 2
                campoClasse.style.backgroundColor = 'orange';
                campoClasse.style.color = 'white'; // Migliora la leggibilità con testo bianco
            } else if (equipaggio.classe.toString().includes('3')) {
                // Applica sfondo blu per il numero 3
                campoClasse.style.backgroundColor = 'blue';
                campoClasse.style.color = 'white'; // Migliora la leggibilità con testo bianco
            } else if (equipaggio.classe.toString().toLowerCase().includes('ser')) {
                // Applica sfondo marrone per 'ser'
                campoClasse.style.backgroundColor = 'brown';
                campoClasse.style.color = 'white'; // Migliora la leggibilità con testo bianco
            }
        }
    }
    
    // Applica lo stato di conferma o colore salvato
    if (confermeStato.has(equipaggio.id)) {
        card.style.backgroundColor = 'lightgreen';
        coloriCard[equipaggio.id] = 'lightgreen';
    } else if (coloriCard[equipaggio.id]) {
        card.style.backgroundColor = coloriCard[equipaggio.id];
    }

    const campoId = card.querySelector('[data-campo="id"]');
    const okButton = card.querySelector('.ok-button'); // Seleziona il pulsante Ok

    // Listener per il pulsante OK (logica Preposto)
    if (okButton) {
        okButton.addEventListener('click', (event) => {
            if (isPreposto && !isAdmin) { // Solo se preposto e non admin
                const cardElement = event.target.closest('.card-equipaggio');
                const originalId = cardElement.dataset.originalId;
                const turno = cardElement.querySelector('[data-campo="turno"]').textContent.split(': ')[1];
                const classe = cardElement.querySelector('[data-campo="classe"]').textContent.split(': ')[1];

                if (!coloriCard[originalId]) {
                    // Prima conferma - Arrivo
                    const risposta = prompt('Arrivato in buca? (Scrivi SI o NO)');
                    if (risposta && risposta.toUpperCase() === 'SI') {
                        coloriCard[originalId] = 'yellow';
                        cardElement.style.backgroundColor = 'yellow';
                        salvaTempoArrivo(originalId, turno, classe);
                        salvaStato();
                    } else if (risposta && risposta.toUpperCase() === 'NO') {
                        coloriCard[originalId] = 'red';
                        cardElement.style.backgroundColor = 'red';
                        salvaStato();
                    }
                } else if (coloriCard[originalId] === 'yellow') {
                    // Seconda conferma - Completamento
                    const conferma1 = confirm('Carico completato?');
                    if (conferma1) {
                        const conferma2 = confirm('Hanno inviato la distinta e controllato la merce?');
                        if (conferma2) {
                            coloriCard[originalId] = 'lightgreen';
                            cardElement.style.backgroundColor = 'lightgreen';
                            salvaTempoCompletamento(originalId);
                            salvaStato();
                        }
                    }
                }
            } else if (!isAdmin && !isPreposto) {
                alert('Effettua il login come Preposto per confermare il carico.');
            }
            // Se è admin o non preposto, non fa nulla qui (la modifica è gestita altrove)
            // Aggiunta logica Admin per deselezionare singola card
            else if (isAdmin) {
                const cardElement = event.target.closest('.card-equipaggio');
                if (cardElement) {
                    if (cardElement.style.backgroundColor === 'lightgreen' || cardElement.style.backgroundColor === 'yellow' || cardElement.style.backgroundColor === 'red') {
                        const equipaggioId = parseInt(cardElement.dataset.originalId);
                        cardElement.style.backgroundColor = '';
                        confermeStato.delete(equipaggioId);
                        delete coloriCard[equipaggioId];
                        // Salva lo stato
                        salvaStato();
                    }
                }
            }
        });
    }

    // Listener per il campo ID (logica Admin per modifica)
    if (campoId) {
        campoId.addEventListener('click', (event) => {
            if (!isAdmin && !isPreposto) {
                 // Se non è admin e non è preposto, non fa nulla qui (l'alert è gestito dal pulsante OK)
                 // Potrebbe essere utile un alert generico se si clicca sull'ID senza essere admin?
                 // alert('Solo gli amministratori possono modificare i dati.');
            }
            // Se è admin, la logica di modifica viene gestita da renderizzaCampoModificabile
            // Se è preposto, non fa nulla qui (la conferma è gestita dal pulsante OK)
        });
    }

    // Aggiungiamo event listener per rendere i campi modificabili solo se admin
    if(isAdmin || isPreposto) {
        const campiModificabili = card.querySelectorAll('.campo-modificabile');
        campiModificabili.forEach(campo => {
            campo.addEventListener('click', renderizzaCampoModificabile);
        });
    }

    return card;
}

function popolaGriglie() {
    const sezione1 = document.getElementById('sezione1');
    const sezione2 = document.getElementById('sezione2');

    // Svuota i contenitori prima di popolarli
    if (sezione1) sezione1.innerHTML = '';
    if (sezione2) sezione2.innerHTML = '';

    if (!sezione1) {
        console.error('Elemento sezione1 non trovato');
        return;
    }
    const gridContainer = sezione1;
    if (!gridContainer) {
        console.error('Elemento grid-container non trovato');
        return;
    }
    // Creiamo esattamente 10 celle per le buche da 4 a 13
    for(let i = 0; i < 10; i++) {
        const cella = document.createElement('div');
        cella.className = 'buca-column'; // Aggiungiamo una classe per identificare le colonne
        gridContainer.appendChild(cella);
    }
    const celleBuca = gridContainer.querySelectorAll('.buca-column');
    const equipaggiSezione1 = equipaggi.filter(e => e.sezione === 1);
    
    // Raggruppiamo gli equipaggi per buca (da 4 a 13)
    const equipaggiPerBuca = Array(10).fill().map(() => []);
    // Sposta l'equipaggio 7678 nella buca 7 (indice 6)
    const equipaggio7678 = equipaggiSezione1.find(e => e.id === 7678);
    if (equipaggio7678) {
        const index7678 = equipaggiSezione1.findIndex(e => e.id === 7678);
        if (index7678 !== -1) equipaggiSezione1.splice(index7678, 1);
        equipaggiPerBuca[6].push(equipaggio7678);
    }
    // Posiziona l'equipaggio 7567 nella Buca 12 (indice 8)
    const equipaggio7567 = equipaggiSezione1.find(e => e.id === 7567);
    if (equipaggio7567) {
        const index7567 = equipaggiSezione1.findIndex(e => e.id === 7567);
        if (index7567 !== -1) equipaggiSezione1.splice(index7567, 1);
        equipaggiPerBuca[8].push(equipaggio7567);
    }

    // Aggiungi un nuovo equipaggio sotto Buca 12
    const nuovoEquipaggio = {
        id: 7568,
        turno: 'serale',
        classe: 'B',
        sezione: 1,
        note: ''
    };
    equipaggiPerBuca[8].push(nuovoEquipaggio);
    equipaggi.push(nuovoEquipaggio); // Aggiungi anche all'array principale degli equipaggi

    // Posiziona l'equipaggio 7345 dopo l'equipaggio 7012
    const equipaggio7345 = equipaggiSezione1.find(e => e.id === 7345);
    if (equipaggio7345) {
        const index7345 = equipaggiSezione1.findIndex(e => e.id === 7345);
        if (index7345 !== -1) equipaggiSezione1.splice(index7345, 1);
        // Lo terremo da parte per posizionarlo dopo 7012
    }
    
    // Regole speciali di allineamento: Buca 4 (indice 0) con ID 5010, Buca 8 (indice 4) con ID 5999, Buca 9 (indice 5) con ID 5500 e Buca 13 (indice 9) con ID 5748
    const equipaggio5010 = equipaggiSezione1.find(e => e.id === 5010);
    const equipaggio5999 = equipaggiSezione1.find(e => e.id === 5999);
    const equipaggio5500 = equipaggiSezione1.find(e => e.id === 5500);
    const equipaggio5748 = equipaggiSezione1.find(e => e.id === 5748);
    
    // Rimuoviamo questi equipaggi dall'array principale per posizionarli manualmente
    if (equipaggio5010) {
        const index5010 = equipaggiSezione1.findIndex(e => e.id === 5010);
        if (index5010 !== -1) equipaggiSezione1.splice(index5010, 1);
        equipaggiPerBuca[0].push(equipaggio5010); // Posiziona 5010 nella Buca 4 (indice 0)
    }
    
    if (equipaggio5748) {
        const index5748 = equipaggiSezione1.findIndex(e => e.id === 5748);
        if (index5748 !== -1) equipaggiSezione1.splice(index5748, 1);
        equipaggiPerBuca[9].push(equipaggio5748); // Posiziona 5748 nella Buca 13 (indice 9)
    }
    
    if (equipaggio5999) {
        const index5999 = equipaggiSezione1.findIndex(e => e.id === 5999);
        if (index5999 !== -1) equipaggiSezione1.splice(index5999, 1);
        equipaggiPerBuca[4].push(equipaggio5999); // Posiziona 5999 nella Buca 8 (indice 4)
    }
    
    if (equipaggio5500) {
        const index5500 = equipaggiSezione1.findIndex(e => e.id === 5500);
        if (index5500 !== -1) equipaggiSezione1.splice(index5500, 1);
        equipaggiPerBuca[5].push(equipaggio5500); // Posiziona 5500 nella Buca 9 (indice 5)
    }
    
    // Posiziona l'equipaggio 5501 nella Buca 9 (indice 5)
    const equipaggio5501 = equipaggiSezione1.find(e => e.id === 5501);
    if (equipaggio5501) {
        const index5501 = equipaggiSezione1.findIndex(e => e.id === 5501);
        if (index5501 !== -1) equipaggiSezione1.splice(index5501, 1);
        equipaggiPerBuca[5].push(equipaggio5501); // Posiziona 5501 nella Buca 9 (indice 5)
    }
    
    // Distribuisci gli equipaggi con regole speciali per la Buca 11
    const buca11Index = equipaggiSezione1.findIndex(e => e.id === 5008);
    const equipaggio5007Index = equipaggiSezione1.findIndex(e => e.id === 5007);
    
    if (buca11Index !== -1 && equipaggio5007Index !== -1) {
        const buca11 = equipaggiSezione1.splice(buca11Index, 1)[0];
        equipaggiSezione1.splice(equipaggio5007Index, 0, buca11);
    }
    
    // Posiziona l'equipaggio 5009 nella Buca 11 (indice 7)
    const equipaggio5009 = equipaggiSezione1.find(e => e.id === 5009);
    if (equipaggio5009) {
        const index5009 = equipaggiSezione1.findIndex(e => e.id === 5009);
        if (index5009 !== -1) equipaggiSezione1.splice(index5009, 1);
        equipaggiPerBuca[7].push(equipaggio5009); // Posiziona 5009 nella Buca 11 (indice 7)
    }
    
    // Distribuiamo gli equipaggi rimanenti nelle rispettive buche
    equipaggiSezione1.forEach((equipaggio, index) => {
        const bucaIndex = index % 10; // Assegna ciclicamente alle 10 buche
        equipaggiPerBuca[bucaIndex].push(equipaggio);
    });
    
    // Ora inseriamo gli equipaggi nelle rispettive colonne con limite massimo di 4 card per colonna
    // Prima contiamo quante card ci sono in ogni colonna
    const contatoreBuca = Array(10).fill(0);
    
    // Distribuiamo gli equipaggi rispettando il limite di 4 card per colonna
    equipaggiPerBuca.forEach((equipaggiBuca, bucaIndex) => {
        // Limitiamo a massimo 4 card per colonna
        const maxCardPerColonna = 4;
        let cardInserite = 0;
        
        equipaggiBuca.forEach(equipaggio => {
            // Se abbiamo già raggiunto il limite di 4 card per questa colonna, non inseriamo altre card
            if (contatoreBuca[bucaIndex] >= maxCardPerColonna) {
                return; // Salta questa card
            }
            
            const card = creaCardEquipaggio(equipaggio);
            if(celleBuca[bucaIndex]) {
                celleBuca[bucaIndex].appendChild(card);
                contatoreBuca[bucaIndex]++;
                cardInserite++;
                
                // Se abbiamo appena inserito l'equipaggio 7012, inseriamo subito dopo l'equipaggio 7345
                // ma solo se non abbiamo già raggiunto il limite di 4 card
                if (equipaggio.id === 7012 && equipaggio7345 && contatoreBuca[bucaIndex] < maxCardPerColonna) {
                    const card7345 = creaCardEquipaggio(equipaggio7345);
                    celleBuca[bucaIndex].appendChild(card7345);
                    contatoreBuca[bucaIndex]++;
                }
            }
        });
    });


    // La variabile sezione2 è già stata definita e svuotata all'inizio
    if (sezione2) {
        for(let i = 0; i < 7; i++) {
            const cella = document.createElement('div');
            cella.className = 'buca-column'; // Aggiungiamo la classe buca-column come nella sezione1
            sezione2.appendChild(cella);
        }
        const celleSezione2 = sezione2.querySelectorAll('.buca-column');
        const equipaggiSezione2 = equipaggi.filter(e => e.sezione === 2);
        // Nessun ordinamento speciale, distribuisci gli equipaggi in modo sequenziale
        equipaggiSezione2.forEach((equipaggio, index) => {
            const card = creaCardEquipaggio(equipaggio);
            const bucaIndex = index % 7; // Modificato per distribuire su 7 colonne
            if(celleSezione2[bucaIndex]) {
                celleSezione2[bucaIndex].appendChild(card);
            }
        });
    } else {
        console.error('Elemento sezione2 non trovato');
    }
    
    // Verifica e marca i turni duplicati dopo aver popolato le griglie
    verificaEMarcaTurnoDuplicati();
}

function filtraEquipaggi(testoCercato) {
    const cards = document.querySelectorAll('.card-equipaggio');
    const testo = testoCercato.toLowerCase();
    
    // Se il campo di ricerca è vuoto, mostriamo tutte le card
    if (testo === '') {
        cards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    cards.forEach(card => {
        const contenuto = card.textContent.toLowerCase();
        card.style.display = contenuto.includes(testo) ? 'block' : 'none';
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    popolaGriglie();
    setupLoginListeners();
    aggiornaDataOra(); // Aggiungiamo la chiamata alla funzione per aggiornare l'orario
});

// Funzione per impostare i listener per il login
function setupLoginListeners() {
    const prepostoBtn = document.getElementById('prepostoBtn');
    const prepostoModal = new bootstrap.Modal(document.getElementById('prepostoModal'));
    const prepostoSubmit = document.getElementById('prepostoSubmit');
    const prepostoError = document.getElementById('prepostoError');

    prepostoBtn.addEventListener('click', () => {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        if (isPreposto) {
            isPreposto = false;
            localStorage.removeItem('isPrepostoLoggedIn'); // Rimuovi dallo storage al logout
            document.body.classList.remove('preposto-mode');
            prepostoBtn.textContent = 'Login Preposto';
            prepostoBtn.classList.remove('btn-outline-success');
            prepostoBtn.classList.add('btn-outline-secondary');
        } else {
            prepostoModal.show();
        }
    });

    prepostoSubmit.addEventListener('click', () => {
        const username = document.getElementById('prepostoUsername').value;
        const password = document.getElementById('prepostoPassword').value;
        const prepostoError = document.getElementById('prepostoError');
        const prepostoModalInstance = bootstrap.Modal.getInstance(document.getElementById('prepostoModal'));

        // Reset stati
        isAdmin = false;
        isPreposto = false;
        prepostoError.classList.add('d-none');

        if (username === prepostoCredentials.username && password === prepostoCredentials.password) {
            isPreposto = true;
            localStorage.setItem('isPrepostoLoggedIn', 'true'); // Salva nello storage al login
            prepostoError.classList.add('d-none');
            prepostoModalInstance.hide();
            document.body.classList.add('preposto-mode');
            prepostoBtn.textContent = 'Logout Preposto';
            prepostoBtn.classList.remove('btn-outline-secondary');
            prepostoBtn.classList.add('btn-outline-success');
        } else {
            prepostoError.classList.remove('d-none');
        }
    });
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const loginSubmit = document.getElementById('loginSubmit');
    const loginError = document.getElementById('loginError');
    const monitoraggioBtn = document.getElementById('monitoraggioBtn'); // Ottieni riferimento al pulsante Monitoraggio
    
    // Mostra il modal di login quando si clicca sul pulsante
    loginBtn.addEventListener('click', () => {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        if (isAdmin) {
            // Se è già loggato come admin, esegue il logout
            isAdmin = false;
            localStorage.removeItem('isAdminLoggedIn'); // Rimuovi dallo storage al logout
            document.body.classList.remove('admin-mode');
            loginBtn.textContent = 'Login Admin';
            loginBtn.classList.remove('btn-outline-danger');
            loginBtn.classList.add('btn-outline-primary');
            document.getElementById('resetAllBtn').classList.add('d-none'); // Nascondi Resetta Tutto al logout
            if (monitoraggioBtn) monitoraggioBtn.classList.add('d-none'); // Nascondi Monitoraggio al logout
        } else {
            // Altrimenti mostra il modal di login
            loginModal.show();
        }
    });
    
    // Gestisce il submit del form di login
    loginSubmit.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // Login riuscito
            isAdmin = true;
            localStorage.setItem('isAdminLoggedIn', 'true'); // Salva nello storage al login
            loginError.classList.add('d-none');
            loginModal.hide();
            document.body.classList.add('admin-mode');
            loginBtn.textContent = 'Logout Admin';
            loginBtn.classList.remove('btn-outline-primary');
            loginBtn.classList.add('btn-outline-danger');
            document.getElementById('resetAllBtn').classList.remove('d-none'); // Mostra Resetta Tutto al login
            if (monitoraggioBtn) monitoraggioBtn.classList.remove('d-none'); // Mostra Monitoraggio al login
            popolaGriglie(); // Ripopola per applicare listener admin
        } else {
            // Login fallito
            loginError.classList.remove('d-none');
        }
    });

    // Aggiungi listener per il pulsante Resetta Tutto
    const resetAllBtn = document.getElementById('resetAllBtn');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            if (isAdmin) {
                if (confirm('Sei sicuro di voler resettare tutte le conferme?')) {
                    const cardsConfermate = document.querySelectorAll('.card-equipaggio');
                    cardsConfermate.forEach(card => {
                        if (card.style.backgroundColor === 'lightgreen' || card.style.backgroundColor === 'yellow') {
                            card.style.backgroundColor = ''; // Resetta lo sfondo
                        }
                    });
                    confermeStato.clear(); // Svuota lo stato delle conferme
                    coloriCard = {}; // Resetta i colori delle card
                    salvaStato(); // Salva lo stato resettato
                }
            } else {
                alert('Solo gli amministratori possono resettare le conferme.');
            }
        });
    }

    // Aggiungi listener per il pulsante Monitoraggio
    if (monitoraggioBtn) {
        monitoraggioBtn.addEventListener('click', () => {
            if (isAdmin) {
                window.location.href = 'monitoraggio_tempi.html'; // Reindirizza alla pagina di monitoraggio
            } else {
                alert('Accesso riservato agli amministratori.');
            }
        });
    }
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    filtraEquipaggi(e.target.value);
});

// Funzione per aggiornare il contenuto di un campo
function aggiornaContenutoCampo(campo, tipo, nuovoValore, cardId) {
    if (!campo || !campo.isConnected) return;
    
    try {
        if (tipo === 'classe') {
            campo.innerHTML = `<strong>CL/TR:</strong> ${nuovoValore}`;
            if (nuovoValore.toString().includes('1')) {
                campo.style.backgroundColor = 'purple';
                campo.style.color = 'white';
            } else if (nuovoValore.toString().includes('2')) {
                campo.style.backgroundColor = 'orange';
                campo.style.color = 'white';
            } else if (nuovoValore.toString().includes('3')) {
                campo.style.backgroundColor = 'blue';
                campo.style.color = 'white';
            } else if (nuovoValore.toString().toLowerCase().includes('ser')) {
                campo.style.backgroundColor = 'brown';
                campo.style.color = 'white';
            } else {
                campo.style.backgroundColor = '';
                campo.style.color = '';
            }
        } else if (tipo === 'turno') {
            campo.innerHTML = `<strong>N:</strong> ${nuovoValore}`;
            // Resetta lo stile del campo turno
            campo.style.backgroundColor = '';
            campo.style.color = '';
            // Verifica se ci sono duplicati e applica lo stile solo se necessario
            verificaEMarcaTurnoDuplicati();
        } else if (tipo === 'note') {
            campo.innerHTML = `<strong>Note:</strong> ${nuovoValore}`;
        } else if (tipo === 'id') {
            // Aggiorna il dataset.id della card prima di aggiornare il contenuto
            const card = campo.closest('.card-equipaggio');
            if (card && card.isConnected) {
                card.dataset.cardId = nuovoValore;
            }
            campo.innerHTML = `<strong>ID:</strong> ${nuovoValore}`;
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del campo:', error);
    }
}

// Funzione per rimuovere un elemento in modo sicuro
function rimuoviElementoSicuro(elemento) {
    if (elemento && elemento.parentNode) {
        elemento.parentNode.removeChild(elemento);
        return true;
    }
    return false;
}

// Aggiungiamo una funzione di debug per tracciare lo stato dei dati
function debugStatoDati(operazione) {
    console.log(`=== DEBUG STATO DATI - ${operazione} ===`);
    console.log('Stato equipaggi:', equipaggi);
    console.log('Stato localStorage:');
    console.log('- equipaggiStato:', localStorage.getItem('equipaggiStato'));
    console.log('- campiModificati:', localStorage.getItem('campiModificati'));
    console.log('=== FINE DEBUG ===');
}

// Funzione per salvare i campi modificati nel localStorage
function salvaCampoModificatoStorage(id, campo, valore) {
    try {
        console.log('=== INIZIO SALVATAGGIO ===');
        console.log(`Dati da salvare - ID: ${id}, Campo: ${campo}, Valore: ${valore}`);
        
        // Debug dello stato prima del salvataggio
        debugStatoDati('Prima del salvataggio');
        
        // Salva le singole modifiche
        const campiModificatiJSON = localStorage.getItem('campiModificati');
        let campiModificati = campiModificatiJSON ? JSON.parse(campiModificatiJSON) : {};
        console.log('Campi modificati attuali:', campiModificati);
        
        if (!campiModificati[id]) campiModificati[id] = {};
        campiModificati[id][campo] = valore;
        
        // Salva prima i campi modificati
        localStorage.setItem('campiModificati', JSON.stringify(campiModificati));
        console.log('Campi modificati salvati:', campiModificati);
        
        // Verifica che i campi modificati siano stati salvati
        const campiModificatiVerifica = JSON.parse(localStorage.getItem('campiModificati'));
        if (JSON.stringify(campiModificati) !== JSON.stringify(campiModificatiVerifica)) {
            console.error('Errore: i campi modificati non sono stati salvati correttamente');
            return false;
        }
        
        // Salva l'intero array degli equipaggi
        console.log('Array equipaggi da salvare:', equipaggi);
        localStorage.setItem('equipaggiStato', JSON.stringify(equipaggi));
        
        // Verifica che i dati siano stati salvati correttamente
        const equipaggiSalvati = JSON.parse(localStorage.getItem('equipaggiStato'));
        if (JSON.stringify(equipaggi) !== JSON.stringify(equipaggiSalvati)) {
            console.error('Errore: gli equipaggi non sono stati salvati correttamente');
            return false;
        }
        
        // Debug dello stato dopo il salvataggio
        debugStatoDati('Dopo il salvataggio');
        
        console.log('=== FINE SALVATAGGIO ===');
        return true;
    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
        return false;
    }
}

// Funzione per rendere un campo modificabile
function renderizzaCampoModificabile(event) {
    // Verifica se l'utente è un amministratore o preposto
    if (!isAdmin && !isPreposto) {
        alert('Solo gli amministratori possono modificare i dati. Effettua il login come amministratore.');
        return;
    }
    
    // Abilita la modifica dei campi solo se l'utente è autenticato
    const campo = event.currentTarget;
    const tipo = campo.dataset.campo;
    const valore = campo.dataset.valore;
    const cardId = campo.closest('.card-equipaggio').dataset.cardId;
    
    // Creiamo l'input per la modifica
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valore;
    input.className = 'campo-input';
    input.dataset.campo = tipo;
    input.dataset.cardId = cardId;
    
    // Sostituiamo il testo con l'input
    campo.innerHTML = '';
    campo.appendChild(input);
    input.focus();
    
    // Aggiungiamo event listener per salvare quando si preme Enter o si perde il focus
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            salvaCampoModificato(input);
            campo.innerHTML = tipo === 'turno' ? `<strong>N:</strong> ${input.value}` : 
                            tipo === 'classe' ? `<strong>CL/TR:</strong> ${input.value}` :
                            `<strong>${tipo.toUpperCase()}:</strong> ${input.value}`;
        } else if (e.key === 'Escape') {
            campo.innerHTML = tipo === 'turno' ? `<strong>N:</strong> ${valore}` : 
                            tipo === 'classe' ? `<strong>CL/TR:</strong> ${valore}` :
                            `<strong>${tipo.toUpperCase()}:</strong> ${valore}`;
        }
    });
    
    input.addEventListener('blur', () => {
        salvaCampoModificato(input);
        campo.innerHTML = tipo === 'turno' ? `<strong>N:</strong> ${input.value}` : 
                        tipo === 'classe' ? `<strong>CL/TR:</strong> ${input.value}` :
                        `<strong>${tipo.toUpperCase()}:</strong> ${input.value}`;
    });
}

// Funzione per salvare il campo modificato
function salvaCampoModificato(input) {
    console.log('=== INIZIO SALVATAGGIO CAMPO ===');
    const nuovoValore = input.value.trim();
    const tipo = input.dataset.campo;
    const card = input.closest('.card-equipaggio');
    const cardId = card.dataset.cardId;
    const campo = input.parentElement;
    
    console.log(`Dati campo - Tipo: ${tipo}, Card ID: ${cardId}, Nuovo valore: ${nuovoValore}`);
    
    // Debug dello stato prima della modifica
    debugStatoDati('Prima della modifica');
    
    // Aggiorniamo l'array degli equipaggi
    let equipaggioIndex = -1;
    
    // Cerca l'equipaggio usando l'ID originale della card
    const originalId = card.dataset.originalId;
    
    // Se stiamo modificando l'ID
    if (tipo === 'id') {
        const nuovoId = nuovoValore === '' ? '' : (parseInt(nuovoValore) || '');
        console.log(`Modifica ID da ${originalId} a ${nuovoId}`);
        
        // Verifica se l'ID esiste già (escludendo l'ID originale)
        if (nuovoId !== '' && nuovoId !== originalId) {
            const idEsistente = equipaggi.findIndex(e => e.id === nuovoId);
            if (idEsistente !== -1) {
                campo.innerHTML = `<strong>ID:</strong> ${originalId}`;
                return;
            }
        }
        
        // Trova l'indice dell'equipaggio da modificare
        equipaggioIndex = equipaggi.findIndex(e => e.id === parseInt(originalId));
        
        if (equipaggioIndex !== -1) {
            // Aggiorna l'ID dell'equipaggio esistente
            equipaggi[equipaggioIndex].id = nuovoId;
            
            // Aggiorna la card corrente
            card.dataset.originalId = nuovoId;
            
            // Salva le modifiche nel localStorage
            const salvataggioRiuscito = salvaCampoModificatoStorage(originalId, tipo, nuovoId);
            if (!salvataggioRiuscito) {
                console.error('Errore nel salvataggio della modifica');
                return;
            }
            
            // Aggiorna il testo visualizzato senza riordinare le card
            if (campo && campo.isConnected) {
                campo.dataset.valore = nuovoId;
                campo.innerHTML = `<strong>ID:</strong> ${nuovoId}`;
            }
        }
    } else {
        // Per altri campi, cerca l'equipaggio esistente
        if (originalId !== '') {
            equipaggioIndex = equipaggi.findIndex(e => e.id === parseInt(originalId));
        }
        
        if (equipaggioIndex === -1) {
            equipaggioIndex = equipaggi.findIndex(e => e.id === undefined || e.id === '');
        }
        
        if (equipaggioIndex !== -1) {
            console.log(`Modifica campo ${tipo} da ${equipaggi[equipaggioIndex][tipo]} a ${nuovoValore}`);
            equipaggi[equipaggioIndex][tipo] = nuovoValore;
            
            // Salva le modifiche nel localStorage
            const salvataggioRiuscito = salvaCampoModificatoStorage(originalId, tipo, nuovoValore);
            if (!salvataggioRiuscito) {
                console.error('Errore nel salvataggio della modifica');
                return;
            }
            
            // Aggiorna il testo visualizzato
            if (campo && campo.isConnected) {
                campo.dataset.valore = nuovoValore;
                aggiornaContenutoCampo(campo, tipo, nuovoValore, originalId);
            }
        }
    }
    
    // Debug dello stato dopo la modifica
    debugStatoDati('Dopo la modifica');
    
    console.log('=== FINE SALVATAGGIO CAMPO ===');
}

// Funzione per annullare la modifica
function annullaModifica(campo, tipo, valore) {
    campo.innerHTML = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: ${valore}`;
}

// Funzione per verificare e marcare i turni duplicati
function verificaEMarcaTurnoDuplicati() {
    // Raccogliamo tutti i turni delle card
    const cards = document.querySelectorAll('.card-equipaggio');
    const turniMap = {};
    
    // Resettiamo l'oggetto coloriCampoTurno
    coloriCampoTurno = {};
    
    // Prima resettiamo lo sfondo di tutti i campi turno
    cards.forEach(card => {
        const turnoElement = card.querySelector('[data-campo="turno"]');
        if (turnoElement) {
            // Resettiamo solo lo sfondo del campo turno, non dell'intera card
            turnoElement.style.backgroundColor = '';
            turnoElement.style.color = '';
            
            // Rimuoviamo il colore salvato per questo campo turno
            const cardId = card.dataset.cardId;
            if (cardId && coloriCampoTurno[cardId]) {
                delete coloriCampoTurno[cardId];
            }
        }
    });
    
    // Raccogliamo tutti i turni (ignoriamo i turni vuoti)
    cards.forEach(card => {
        const turnoElement = card.querySelector('[data-campo="turno"]');
        if (turnoElement) {
            const turno = turnoElement.dataset.valore;
            // Ignoriamo i turni vuoti nella verifica dei duplicati
            if (turno !== '' && turno !== undefined) {
                if (!turniMap[turno]) {
                    turniMap[turno] = [];
                }
                turniMap[turno].push({
                    card: card,
                    turnoElement: turnoElement
                });
            }
        }
    });
    
    // Evidenziamo solo i campi turno duplicati
    for (const turno in turniMap) {
        if (turniMap[turno].length > 1) {
            // Se ci sono più card con lo stesso turno, evidenziamo in rosso solo il campo turno
            turniMap[turno].forEach(item => {
                // Applichiamo lo sfondo rosso solo al campo turno
                item.turnoElement.style.backgroundColor = 'red';
                item.turnoElement.style.color = 'white'; // Migliora la leggibilità con testo bianco
                
                // Salviamo il colore del campo turno
                const cardId = item.card.dataset.cardId;
                if (cardId) {
                    coloriCampoTurno[cardId] = {
                        backgroundColor: 'red',
                        color: 'white'
                    };
                }
            });
        }
    }
    
    // Salva lo stato dei colori
    salvaColoriCard();
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

// Funzione per salvare i colori delle card
function salvaColoriCard(equipaggioId, colore) {
    try {
        console.log(`Salvataggio colore ${colore} per ID ${equipaggioId}`);
        
        // Carica i colori esistenti
        const coloriSalvati = JSON.parse(localStorage.getItem('coloriCard') || '{}');
        
        // Aggiorna il colore per l'ID specifico
        coloriSalvati[equipaggioId] = colore;
        
        // Salva nel localStorage
        localStorage.setItem('coloriCard', JSON.stringify(coloriSalvati));
        
        // Verifica che il salvataggio sia avvenuto correttamente
        const coloriVerificati = JSON.parse(localStorage.getItem('coloriCard'));
        if (coloriVerificati[equipaggioId] === colore) {
            console.log(`Colore ${colore} salvato con successo per ID ${equipaggioId}`);
            return true;
        } else {
            console.error(`Errore nel salvataggio del colore ${colore} per ID ${equipaggioId}`);
            return false;
        }
    } catch (error) {
        console.error('Errore nel salvataggio dei colori:', error);
        return false;
    }
}

// Funzioni per gestire i tempi di arrivo e completamento usando localStorage
function salvaTempoArrivo(id, turno, classe) {
    console.log('Salvataggio tempo arrivo per ID:', id);
    const tempi = JSON.parse(localStorage.getItem('tempiCarico') || '{}');
    tempi[id] = {
        ...tempi[id],
        arrivo: Date.now(),
        turno: turno,
        classe: classe
    };
    console.log('Dati tempi da salvare:', tempi[id]);
    localStorage.setItem('tempiCarico', JSON.stringify(tempi));
    console.log('Tempi salvati nel localStorage');
}

function salvaTempoCompletamento(id) {
    console.log('Salvataggio tempo completamento per ID:', id);
    const tempi = JSON.parse(localStorage.getItem('tempiCarico') || '{}');
    if (!tempi[id]) {
        console.error('Nessun tempo di arrivo trovato per ID:', id);
        return;
    }
    tempi[id] = {
        ...tempi[id],
        completamento: Date.now()
    };
    console.log('Dati tempi da salvare:', tempi[id]);
    localStorage.setItem('tempiCarico', JSON.stringify(tempi));
    console.log('Tempi salvati nel localStorage');
}

// Inizializza l'applicazione
document.addEventListener('DOMContentLoaded', function() {
    // Carica lo stato salvato
    caricaStatoSalvato();
    
    // Popola le griglie con i dati caricati
    popolaGriglie();
    
    // Configura i listener per il login
    setupLoginListeners();
    
    // Attiva il salvataggio automatico
    setupAutoSave();
});

// Funzione per resettare tutte le card ai valori di default
function resettaTutteLeCard() {
    if (confirm('Sei sicuro di voler resettare tutte le card ai valori di default?')) {
        // Svuota l'array degli equipaggi
        equipaggi = [];
        
        // Svuota il localStorage
        localStorage.removeItem('equipaggiStato');
        localStorage.removeItem('campiModificati');
        localStorage.removeItem('coloriCard');
        localStorage.removeItem('coloriCampoTurno');
        localStorage.removeItem('confermeStato');
        
        // Ricarica la pagina
        location.reload();
    }
}

// Funzione per aggiornare i dati nel monitoraggio
function aggiornaDatiMonitoraggio(equipaggioId, tipo) {
    const tempi = JSON.parse(localStorage.getItem('tempiCarico') || '{}');
    const equipaggio = equipaggi.find(e => e.id === equipaggioId);
    
    if (!tempi[equipaggioId]) {
        tempi[equipaggioId] = {};
    }
    
    if (tipo === 'arrivo') {
        tempi[equipaggioId].arrivo = Date.now();
        tempi[equipaggioId].turno = equipaggio?.turno || 'N/A';
        tempi[equipaggioId].classe = equipaggio?.classe || 'N/A';
    } else if (tipo === 'completamento') {
        tempi[equipaggioId].completamento = Date.now();
    }
    
    localStorage.setItem('tempiCarico', JSON.stringify(tempi));
    console.log('Dati monitoraggio aggiornati:', tempi[equipaggioId]);
}

// Funzione per esportare i dati del localStorage
function esportaDatiLocalStorage() {
    const datiDaEsportare = {
        equipaggiStato: localStorage.getItem('equipaggiStato'),
        coloriCard: localStorage.getItem('coloriCard'),
        confermeStato: localStorage.getItem('confermeStato'),
        tempiCarico: localStorage.getItem('tempiCarico'),
        campiModificati: localStorage.getItem('campiModificati'),
        coloriCampoTurno: localStorage.getItem('coloriCampoTurno')
    };

    // Crea il file di download
    const blob = new Blob([JSON.stringify(datiDaEsportare, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dati_piazzole.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Funzione per importare i dati nel localStorage
function importaDatiLocalStorage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dati = JSON.parse(e.target.result);
                
                // Importa i dati nel localStorage
                for (const [key, value] of Object.entries(dati)) {
                    if (value) {
                        localStorage.setItem(key, value);
                    }
                }
                
                // Ricarica la pagina per applicare i cambiamenti
                location.reload();
            } catch (error) {
                console.error('Errore durante l\'importazione dei dati:', error);
                alert('Errore durante l\'importazione dei dati. Controlla il formato del file.');
            }
        };
        reader.readAsText(file);
    }
}

// Aggiungi i pulsanti per esportare/importare dati
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Aggiungi i pulsanti solo se l'utente è admin
    if (isAdmin) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex gap-2 mt-3';
        
        // Pulsante per esportare
        const exportButton = document.createElement('button');
        exportButton.className = 'btn btn-primary';
        exportButton.innerHTML = '<i class="fas fa-download"></i> Esporta Dati';
        exportButton.onclick = esportaDatiLocalStorage;
        
        // Pulsante per importare
        const importButton = document.createElement('button');
        importButton.className = 'btn btn-secondary';
        importButton.innerHTML = '<i class="fas fa-upload"></i> Importa Dati';
        
        // Input file nascosto
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.onchange = importaDatiLocalStorage;
        
        // Collega il pulsante all'input file
        importButton.onclick = () => fileInput.click();
        
        // Aggiungi gli elementi al container
        buttonContainer.appendChild(exportButton);
        buttonContainer.appendChild(importButton);
        buttonContainer.appendChild(fileInput);
        
        // Inserisci il container dopo i pulsanti esistenti
        const existingButtons = document.querySelector('.btn-danger');
        if (existingButtons) {
            existingButtons.parentNode.insertBefore(buttonContainer, existingButtons.nextSibling);
        }
    }
});