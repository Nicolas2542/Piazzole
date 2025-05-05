// Variabile per tenere traccia dello stato di autenticazione
let isAdmin = false;

// Credenziali di amministrazione (in un'applicazione reale, queste dovrebbero essere gestite lato server)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Dati dimostrativi
const equipaggi = [
    { id: 5010, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 13
    { id: 5001, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 4
    { id: 5002, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 5
    { id: 5003, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 6
    { id: 5004, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 7
    { id: 5005, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 8
    { id: 5999, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 8
    { id: 5006, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 9
    { id: 5500, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 9
    { id: 5007, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 10
    { id: 5008, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 11
    { id: 5748, turno: 'serale', classe: 'A', sezione: 1 },
    { id: 5896, turno: 'mattutino', classe: 'B', sezione: 1 },
    { id: 5096, turno: 'mattutino', classe: 'S', sezione: 1 },
    { id: 5123, turno: 'mattutino', classe: 'S', sezione: 1 },
    { id: 5749, turno: 'notturno', classe: 'A', sezione: 1 },
    { id: 5750, turno: 'notturno', classe: 'A', sezione: 1 },
    { id: 4890, turno: 'notturno', classe: 'A', sezione: 1 },
    { id: 130026, turno: 'notturno', classe: 'B', sezione: 1 },
    { id: 5490, turno: 'serale', classe: 'E', sezione: 1 },
    { id: 130036, turno: 'notturno', classe: 'B', sezione: 1 },
    { id: 5473, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio aggiunto
    { id: 5965, turno: 'serale', classe: 'B', sezione: 1 },  // Nuovo equipaggio sotto Buca 12
    { id: 5691, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Buca 30
    { id: 6079, turno: 'notturno', classe: 'A', sezione: 2 },  // Nuovo equipaggio sotto Buca 30
    { id: 6023, turno: 'notturno', classe: 'C', sezione: 2 },
    { id: 6123, turno: 'mattutino', classe: 'D', sezione: 1 },
    { id: 6214, turno: 'serale', classe: 'E', sezione: 2 },
    { id: 6345, turno: 'notturno', classe: 'F', sezione: 1 },
    { id: 6456, turno: 'mattutino', classe: 'A', sezione: 1 },  // Modificato da sezione 2 a sezione 1
    { id: 6567, turno: 'serale', classe: 'B', sezione: 1 },
    { id: 6678, turno: 'notturno', classe: 'C', sezione: 1 },
    { id: 6789, turno: 'mattutino', classe: 'D', sezione: 1 },
    { id: 6890, turno: 'serale', classe: 'E', sezione: 1 },
    { id: 6901, turno: 'notturno', classe: 'F', sezione: 1 },
    { id: 7012, turno: 'mattutino', classe: 'A', sezione: 1 },
    { id: 7789, turno: 'serale', classe: 'B', sezione: 1 },
    { id: 7123, turno: 'serale', classe: 'B', sezione: 1 },
    { id: 7234, turno: 'notturno', classe: 'C', sezione: 2 },
    { id: 7345, turno: 'mattutino', classe: 'D', sezione: 1 },
    { id: 7456, turno: 'serale', classe: 'E', sezione: 2 },
    { id: 7567, turno: 'notturno', classe: 'F', sezione: 1 },
    { id: 7678, turno: 'mattutino', classe: 'A', sezione: 1 },  // Modificato da sezione 2 a sezione 1
    { id: 7890, turno: 'notturno', classe: 'C', sezione: 2 },
    { id: 8012, turno: 'serale', classe: 'E', sezione: 2 },
    { id: 8123, turno: 'notturno', classe: 'F', sezione: 1 },
    { id: 8234, turno: 'mattutino', classe: 'A', sezione: 2 },
    { id: 8345, turno: 'serale', classe: 'B', sezione: 1 },
    { id: 8456, turno: 'notturno', classe: 'C', sezione: 2 },
    { id: 8567, turno: 'mattutino', classe: 'D', sezione: 1 },
    { id: 8618, turno: 'serale', classe: 'E', sezione: 1 },  // Spostato alla sezione 1
    { id: 8789, turno: 'notturno', classe: 'F', sezione: 2 },
    { id: 8901, turno: 'mattutino', classe: 'A', sezione: 2 },
    { id: 9012, turno: 'serale', classe: 'B', sezione: 2 },
    { id: 9123, turno: 'notturno', classe: 'C', sezione: 2 },
    { id: 9145, turno: 'notturno', classe: 'A', sezione: 2 },  // Spostato alla sezione 2 sotto Buca 30
    { id: 9179, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Buca 31
    { id: 9185, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Buca 32
    { id: 9968, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Buca 33
    { id: 10040, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Buca 34
    { id: 5161, turno: 'serale', classe: 'B', sezione: 2 },  // Nuovo equipaggio sotto Preparazione 1
    { id: 5812, turno: 'serale', classe: 'B', sezione: 2 }];  // Nuovo equipaggio sotto Preparazione 2

function creaCardEquipaggio(equipaggio) {
    const card = document.createElement('div');
    card.className = 'card-equipaggio';
    card.dataset.id = equipaggio.id;
    
    // Applica dimensioni specifiche per le card con ID selezionati (eccetto 8456 che viene gestito separatamente)
    const idSpeciali = [6023, 6214, 7234, 7456, 7578, 7890, 8012, 8234, 8901, 9123];
    if (idSpeciali.includes(equipaggio.id)) {
        card.classList.add('card-dimensione-specifica');
    }
}
    
    // Aggiungi classe speciale per le card nelle buche da 4 a 11
    const idBuche4a11 = [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008];
    if (idBuche4a11.includes(equipaggio.id)) {
        card.classList.add('card-buca-4-11');
    }
}
    
    // Funzione per formattare il valore del campo (gestisce valori vuoti)
    const formattaCampo = (tipo, valore) => {
        if (valore === '' || valore === undefined) {
            return `${tipo}: `;
        }
}
        return `${tipo}: ${valore}`;
    }
};
    
    // Creiamo i paragrafi con attributi data per identificarli
    card.innerHTML = `
        <p class="campo-modificabile" data-campo="id" data-valore="${equipaggio.id || ''}">ID: ${equipaggio.id || ''}</p>
        <p class="campo-modificabile" data-campo="turno" data-valore="${equipaggio.turno || ''}">Turno: ${equipaggio.turno || ''}</p>
        <p class="campo-modificabile" data-campo="classe" data-valore="${equipaggio.classe || ''}">Classe: ${equipaggio.classe || ''}</p>
    `;
    
    // Aggiungiamo event listener per rendere i campi modificabili
    const campiModificabili = card.querySelectorAll('.campo-modificabile');
    campiModificabili.forEach(campo => {
        campo.addEventListener('click', renderizzaCampoModificabile);
    }
});
    
    return card;
}

function popolaGriglie() {
    const sezione1 = document.getElementById('sezione1');
    if (!sezione1) {
        console.error('Elemento sezione1 non trovato');
        return;
    }
}
    const gridContainer = sezione1;
    if (!gridContainer) {
        console.error('Elemento grid-container non trovato');
        return;
    }
}
    // Creiamo esattamente 10 celle per le buche da 4 a 13
    for(let i = 0; i < 10; i++) {
        const cella = document.createElement('div');
        cella.className = 'buca-column'; // Aggiungiamo una classe per identificare le colonne
        gridContainer.appendChild(cella);
    }
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
}
    // Posiziona l'equipaggio 7567 nella Buca 12 (indice 8)
    const equipaggio7567 = equipaggiSezione1.find(e => e.id === 7567);
    if (equipaggio7567) {
        const index7567 = equipaggiSezione1.findIndex(e => e.id === 7567);
        if (index7567 !== -1) equipaggiSezione1.splice(index7567, 1);
        equipaggiPerBuca[8].push(equipaggio7567);
    }
}
    // Posiziona l'equipaggio 7345 dopo l'equipaggio 7012
    const equipaggio7345 = equipaggiSezione1.find(e => e.id === 7345);
    if (equipaggio7345) {
        const index7345 = equipaggiSezione1.findIndex(e => e.id === 7345);
        if (index7345 !== -1) equipaggiSezione1.splice(index7345, 1);
        // Lo terremo da parte per posizionarlo dopo 7012
    }
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
}
    
    if (equipaggio5748) {
        const index5748 = equipaggiSezione1.findIndex(e => e.id === 5748);
        if (index5748 !== -1) equipaggiSezione1.splice(index5748, 1);
        equipaggiPerBuca[9].push(equipaggio5748); // Posiziona 5748 nella Buca 13 (indice 9)
    }
}
    
    if (equipaggio5999) {
        const index5999 = equipaggiSezione1.findIndex(e => e.id === 5999);
        if (index5999 !== -1) equipaggiSezione1.splice(index5999, 1);
        equipaggiPerBuca[4].push(equipaggio5999); // Posiziona 5999 nella Buca 8 (indice 4)
    }
}
    
    if (equipaggio5500) {
        const index5500 = equipaggiSezione1.findIndex(e => e.id === 5500);
        if (index5500 !== -1) equipaggiSezione1.splice(index5500, 1);
        equipaggiPerBuca[5].push(equipaggio5500); // Posiziona 5500 nella Buca 9 (indice 5)
    }
}