import React, { useState, useEffect, useRef } from 'react';

// Componente per la gestione dei suoni
const useAudio = () => {
  const audioCorrect = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null);
  const audioIncorrect = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/incorrect.mp3') : null);
  const audioVictory = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/victory.mp3') : null);
  const audioButtonClick = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/click.mp3') : null);
  
  // Funzione per riprodurre il suono corretto
  const playCorrect = () => {
    if (audioCorrect.current) {
      audioCorrect.current.currentTime = 0;
      audioCorrect.current.play().catch(e => console.log('Errore riproduzione audio:', e));
    }
  };
  
  // Funzione per riprodurre il suono sbagliato
  const playIncorrect = () => {
    if (audioIncorrect.current) {
      audioIncorrect.current.currentTime = 0;
      audioIncorrect.current.play().catch(e => console.log('Errore riproduzione audio:', e));
    }
  };
  
  // Funzione per riprodurre il suono di vittoria
  const playVictory = () => {
    if (audioVictory.current) {
      audioVictory.current.currentTime = 0;
      audioVictory.current.play().catch(e => console.log('Errore riproduzione audio:', e));
    }
  };
  
  // Funzione per riprodurre il suono di click sui pulsanti
  const playButtonClick = () => {
    if (audioButtonClick.current) {
      audioButtonClick.current.currentTime = 0;
      audioButtonClick.current.play().catch(e => console.log('Errore riproduzione audio:', e));
    }
  };
  
  return { playCorrect, playIncorrect, playVictory, playButtonClick };
};

// Componente principale del gioco
const TabelloneGioco = () => {
  // Stati del gioco
  const [tabelleSbloccate, setTabelleSbloccate] = useState([2, 3, 4, 5, 6]);
  const [numeroDomande, setNumeroDomande] = useState(10);
  const [domandaCorrente, setDomandaCorrente] = useState(null);
  const [risposta, setRisposta] = useState('');
  const [messaggioFeedback, setMessaggioFeedback] = useState('');
  const [pezziCompletati, setPezziCompletati] = useState(0);
  const [risposteCorrette, setRisposteCorrette] = useState(0);
  const [coloriPezzi, setColoriPezzi] = useState([]);
  const [modalitaGioco, setModalitaGioco] = useState('menu'); // 'menu', 'gioco', 'vittoria'
  const [tipoEffetto, setTipoEffetto] = useState('farfalla'); // 'farfalla', 'castello', 'astronave', 'robot'
  const [nomeBambino, setNomeBambino] = useState('');
  const [audioAbilitato, setAudioAbilitato] = useState(true);
  
  // Inizializza le funzioni audio
  const { playCorrect, playIncorrect, playVictory, playButtonClick } = useAudio();

  // Colori per i pezzi
  const coloriDisponibili = [
    '#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', 
    '#C7CEEA', '#F8C8DC', '#BCE7FD', '#D4A5A5', '#FFCBC1'
  ];
  
  // Genera una nuova domanda
  const generaNuovaDomanda = () => {
    if (tabelleSbloccate.length === 0) {
      return;
    }
    
    const tabellaScelta = tabelleSbloccate[Math.floor(Math.random() * tabelleSbloccate.length)];
    const moltiplicatore = Math.floor(Math.random() * 10) + 1;
    
    setDomandaCorrente({
      tabella: tabellaScelta,
      moltiplicatore: moltiplicatore,
      risultatoCorretto: tabellaScelta * moltiplicatore
    });
    
    setRisposta('');
    setMessaggioFeedback('');
    
    // Scegli un colore casuale per il prossimo pezzo
    const nuovoColore = coloriDisponibili[Math.floor(Math.random() * coloriDisponibili.length)];
    setColoriPezzi(prev => [...prev, nuovoColore]);
  };
  
  // Inizia un nuovo gioco
  const iniziaGioco = () => {
    setPezziCompletati(0);
    setRisposteCorrette(0);
    setColoriPezzi([]);
    setModalitaGioco('gioco');
    setDomandaCorrente(null);
    
    // Riproduci suono di click
    if (audioAbilitato) {
      playButtonClick();
    }
  };
  
  // Controlla la risposta dell'utente
  const controllaRisposta = () => {
    const rispostaUtente = parseInt(risposta, 10);
    
    if (isNaN(rispostaUtente)) {
      setMessaggioFeedback('Per favore, inserisci un numero');
      return;
    }
    
    if (rispostaUtente === domandaCorrente.risultatoCorretto) {
      // Risposta corretta
      const nuoviPezziCompletati = pezziCompletati + 1;
      const nuoveRisposteCorrette = risposteCorrette + 1;
      
      setPezziCompletati(nuoviPezziCompletati);
      setRisposteCorrette(nuoveRisposteCorrette);
      
      // Riproduci suono di risposta corretta
      if (audioAbilitato) {
        playCorrect();
      }
      
      // Messaggi personalizzati di successo
      const messaggiSuccesso = [
        `Bravissimo/a ${nomeBambino}! 🎉`,
        `Ottimo lavoro ${nomeBambino}! 🌟`,
        `Complimenti ${nomeBambino}! 👏`,
        `Perfetto ${nomeBambino}! 🏆`,
        `Wow ${nomeBambino}! ✨`
      ];
      
      const messaggioRandom = messaggiSuccesso[Math.floor(Math.random() * messaggiSuccesso.length)];
      setMessaggioFeedback(messaggioRandom);
      
      // Controlla se il gioco è completato
      if (nuoviPezziCompletati >= numeroDomande) {
        setModalitaGioco('vittoria');
        // Riproduci suono di vittoria
        if (audioAbilitato) {
          playVictory();
        }
      } else {
        // Genera una nuova domanda dopo un breve ritardo
        setTimeout(() => {
          generaNuovaDomanda();
        }, 1000);
      }
    } else {
      // Risposta sbagliata
      setMessaggioFeedback(`Riprova! La risposta corretta è ${domandaCorrente.risultatoCorretto}`);
      
      // Riproduci suono di risposta sbagliata
      if (audioAbilitato) {
        playIncorrect();
      }
      
      // Genera una nuova domanda dopo un breve ritardo
      setTimeout(() => {
        generaNuovaDomanda();
      }, 2000);
    }
  };
  
  // Configura le tabelle da sbloccare
  const impostaTabelle = (numero) => {
    const nuoveTabelle = [...tabelleSbloccate];
    const indice = nuoveTabelle.indexOf(numero);
    
    if (indice === -1) {
      nuoveTabelle.push(numero);
    } else {
      nuoveTabelle.splice(indice, 1);
    }
    
    setTabelleSbloccate(nuoveTabelle);
  };
  
  // Gestisci input con tasto Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && risposta !== '') {
      e.preventDefault();
      controllaRisposta();
    }
  };
  
  // Effetto per generare una nuova domanda all'inizio del gioco
  useEffect(() => {
    if (modalitaGioco === 'gioco' && !domandaCorrente) {
      generaNuovaDomanda();
    }
  }, [modalitaGioco, domandaCorrente]);
  
  // Effetto per mantenere il focus sull'input
  useEffect(() => {
    if (modalitaGioco === 'gioco') {
      const inputElement = document.querySelector('input[type="number"]');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [modalitaGioco, domandaCorrente, messaggioFeedback]);
  
  // Componente Farfalla
  const renderFarfalla = () => {
    return (
      <div className="flex justify-center mt-4">
        <svg viewBox="0 0 500 400" width="300" height="240">
          {/* Corpo centrale */}
          <ellipse cx="250" cy="200" rx="30" ry="70" fill="#8B4513" />
          
          {/* Ala superiore sinistra */}
          {pezziCompletati > 0 && (
            <path d="M250 180 Q180 100 100 150 Q150 200 250 180" fill={coloriPezzi[0] || '#FFB7B2'} stroke="#333" strokeWidth="1" />
          )}
          
          {/* Ala superiore destra */}
          {pezziCompletati > 1 && (
            <path d="M250 180 Q320 100 400 150 Q350 200 250 180" fill={coloriPezzi[1] || '#FFDAC1'} stroke="#333" strokeWidth="1" />
          )}
          
          {/* Ala inferiore sinistra */}
          {pezziCompletati > 2 && (
            <path d="M250 220 Q180 300 100 250 Q150 200 250 220" fill={coloriPezzi[2] || '#E2F0CB'} stroke="#333" strokeWidth="1" />
          )}
          
          {/* Ala inferiore destra */}
          {pezziCompletati > 3 && (
            <path d="M250 220 Q320 300 400 250 Q350 200 250 220" fill={coloriPezzi[3] || '#B5EAD7'} stroke="#333" strokeWidth="1" />
          )}
          
          {/* Antenne */}
          {pezziCompletati > 4 && (
            <>
              <path d="M240 130 Q220 100 210 70" stroke="black" strokeWidth="2" fill="none" />
              <path d="M260 130 Q280 100 290 70" stroke="black" strokeWidth="2" fill="none" />
              <circle cx="210" cy="70" r="5" fill={coloriPezzi[4] || '#333'} />
              <circle cx="290" cy="70" r="5" fill={coloriPezzi[4] || '#333'} />
            </>
          )}
          
          {/* Decorazioni */}
          {pezziCompletati > 5 && (
            <>
              <circle cx="180" cy="150" r="8" fill={coloriPezzi[5] || '#C7CEEA'} stroke="#333" />
              <circle cx="320" cy="150" r="8" fill={coloriPezzi[5] || '#F8C8DC'} stroke="#333" />
            </>
          )}
        </svg>
      </div>
    );
  };
  
  // Componente Castello
  const renderCastello = () => {
    return (
      <div className="flex justify-center mt-4">
        <svg viewBox="0 0 500 400" width="300" height="240">
          {/* Base del castello */}
          <rect x="100" y="300" width="300" height="20" fill="#8B4513" />
          
          {/* Muro principale */}
          {pezziCompletati > 0 && (
            <rect x="150" y="220" width="200" height="80" fill={coloriPezzi[0] || '#D2B48C'} />
          )}
          
          {/* Torre sinistra */}
          {pezziCompletati > 1 && (
            <rect x="130" y="180" width="40" height="120" fill={coloriPezzi[1] || '#A0522D'} />
          )}
          
          {/* Torre destra */}
          {pezziCompletati > 2 && (
            <rect x="330" y="180" width="40" height="120" fill={coloriPezzi[2] || '#A0522D'} />
          )}
          
          {/* Porta */}
          {pezziCompletati > 3 && (
            <path d="M225 300 v-50 a25 25 0 0 1 50 0 v50 z" fill={coloriPezzi[3] || '#8B4513'} />
          )}
          
          {/* Finestre */}
          {pezziCompletati > 4 && (
            <>
              <rect x="170" y="240" width="20" height="30" rx="10" fill={coloriPezzi[4] || '#87CEFA'} />
              <rect x="310" y="240" width="20" height="30" rx="10" fill={coloriPezzi[4] || '#87CEFA'} />
            </>
          )}
          
          {/* Bandiere */}
          {pezziCompletati > 5 && (
            <>
              <line x1="140" y1="150" x2="140" y2="100" stroke="black" strokeWidth="2" />
              <path d="M140 100 h30 l-5 10 l5 10 h-30 z" fill={coloriPezzi[5] || '#FF0000'} />
              <line x1="350" y1="150" x2="350" y2="100" stroke="black" strokeWidth="2" />
              <path d="M350 100 h30 l-5 10 l5 10 h-30 z" fill={coloriPezzi[5] || '#FF0000'} />
            </>
          )}
        </svg>
      </div>
    );
  };
  
  // Componente Astronave
  const renderAstronave = () => {
    return (
      <div className="flex justify-center mt-4">
        <svg viewBox="0 0 500 400" width="300" height="240">
          {/* Base dell'astronave */}
          {pezziCompletati > 0 && (
            <rect x="200" y="300" width="100" height="30" rx="10" fill={coloriPezzi[0] || '#C0C0C0'} />
          )}
          
          {/* Corpo centrale */}
          {pezziCompletati > 1 && (
            <rect x="210" y="200" width="80" height="100" rx="20" fill={coloriPezzi[1] || '#A9A9A9'} />
          )}
          
          {/* Punta */}
          {pezziCompletati > 2 && (
            <path d="M210 200 h80 l-40 -50 z" fill={coloriPezzi[2] || '#808080'} />
          )}
          
          {/* Finestra */}
          {pezziCompletati > 3 && (
            <circle cx="250" cy="230" r="15" fill={coloriPezzi[3] || '#87CEFA'} />
          )}
          
          {/* Alettoni */}
          {pezziCompletati > 4 && (
            <>
              <path d="M210 250 l-40 30 v20 h40 z" fill={coloriPezzi[4] || '#FF4500'} />
              <path d="M290 250 l40 30 v20 h-40 z" fill={coloriPezzi[4] || '#FF4500'} />
            </>
          )}
          
          {/* Motori */}
          {pezziCompletati > 5 && (
            <>
              <rect x="220" y="330" width="20" height="30" fill={coloriPezzi[5] || '#696969'} />
              <rect x="260" y="330" width="20" height="30" fill={coloriPezzi[5] || '#696969'} />
              {pezziCompletati === numeroDomande && (
                <>
                  <path d="M220 360 h20 l-10 30 z" fill="#FF4500" />
                  <path d="M260 360 h20 l-10 30 z" fill="#FF4500" />
                </>
              )}
            </>
          )}
        </svg>
      </div>
    );
  };
  
  // Componente Robot
  const renderRobot = () => {
    return (
      <div className="flex justify-center mt-4">
        <svg viewBox="0 0 500 400" width="300" height="240">
          {/* Testa */}
          {pezziCompletati > 0 && (
            <rect x="200" y="80" width="100" height="80" rx="10" fill={coloriPezzi[0] || '#C0C0C0'} />
          )}
          
          {/* Occhi */}
          {pezziCompletati > 1 && (
            <>
              <circle cx="230" cy="110" r="10" fill={coloriPezzi[1] || '#00BFFF'} />
              <circle cx="270" cy="110" r="10" fill={coloriPezzi[1] || '#00BFFF'} />
            </>
          )}
          
          {/* Corpo */}
          {pezziCompletati > 2 && (
            <rect x="220" y="160" width="60" height="100" fill={coloriPezzi[2] || '#A9A9A9'} />
          )}
          
          {/* Braccia */}
          {pezziCompletati > 3 && (
            <>
              <rect x="180" y="170" width="40" height="15" fill={coloriPezzi[3] || '#C0C0C0'} />
              <rect x="280" y="170" width="40" height="15" fill={coloriPezzi[3] || '#C0C0C0'} />
            </>
          )}
          
          {/* Gambe */}
          {pezziCompletati > 4 && (
            <>
              <rect x="230" y="260" width="15" height="50" fill={coloriPezzi[4] || '#808080'} />
              <rect x="255" y="260" width="15" height="50" fill={coloriPezzi[4] || '#808080'} />
            </>
          )}
          
          {/* Pannello di controllo */}
          {pezziCompletati > 5 && (
            <>
              <rect x="230" y="180" width="40" height="20" fill={coloriPezzi[5] || '#000000'} />
              <circle cx="240" cy="190" r="3" fill="#FF0000" />
              <circle cx="250" cy="190" r="3" fill="#FFFF00" />
              <circle cx="260" cy="190" r="3" fill="#00FF00" />
            </>
          )}
        </svg>
      </div>
    );
  };
  
  // Seleziona quale effetto mostrare
  const renderEffetto = () => {
    switch (tipoEffetto) {
      case 'farfalla':
        return renderFarfalla();
      case 'castello':
        return renderCastello();
      case 'astronave':
        return renderAstronave();
      case 'robot':
        return renderRobot();
      default:
        return renderFarfalla();
    }
  };
  
  // Schermata del menu principale
  if (modalitaGioco === 'menu') {
    return (
      <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Gioco delle Tabelline</h1>
        <div className="mb-6 text-lg text-center">
          <p>Rispondi correttamente alle tabelline e completa un'immagine!</p>
        </div>
        
        <div className="mb-4 w-full flex justify-end">
          <button
            onClick={() => {
              setAudioAbilitato(!audioAbilitato);
              playButtonClick();
            }}
            className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            {audioAbilitato ? (
              <>
                <span className="mr-1">🔊</span> Audio ON
              </>
            ) : (
              <>
                <span className="mr-1">🔇</span> Audio OFF
              </>
            )}
          </button>
        </div>
        
        <div className="mb-4 w-full">
          <h2 className="text-xl font-semibold mb-2 text-purple-500">Come ti chiami?</h2>
          <input
            type="text"
            value={nomeBambino}
            onChange={(e) => setNomeBambino(e.target.value)}
            placeholder="Inserisci il tuo nome"
            className="w-full p-2 border-2 border-purple-300 rounded-lg text-center"
          />
        </div>
        
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-purple-500">Seleziona le tabelline:</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                className={`w-12 h-12 rounded-full text-lg font-bold ${
                  tabelleSbloccate.includes(num) 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => impostaTabelle(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-purple-500">Numero di domande:</h2>
          <div className="flex justify-center gap-4">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                className={`px-4 py-2 rounded-md ${
                  numeroDomande === num 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setNumeroDomande(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2 text-purple-500">Scegli cosa costruire:</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'farfalla', nome: 'Farfalla', icona: '🦋' },
              { id: 'castello', nome: 'Castello', icona: '🏰' },
              { id: 'astronave', nome: 'Astronave', icona: '🚀' },
              { id: 'robot', nome: 'Robot', icona: '🤖' }
            ].map(opzione => (
              <button
                key={opzione.id}
                className={`p-2 rounded-md flex flex-col items-center ${
                  tipoEffetto === opzione.id 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setTipoEffetto(opzione.id)}
              >
                <span className="text-2xl mb-1">{opzione.icona}</span>
                <span>{opzione.nome}</span>
              </button>
            ))}
          </div>
        </div>
        
        <button
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full text-xl font-bold shadow-md hover:bg-green-600 transform hover:scale-105 transition-all"
          onClick={iniziaGioco}
          disabled={tabelleSbloccate.length === 0 || !nomeBambino.trim()}
        >
          Inizia il Gioco!
        </button>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Nota: Assicurati di avere i file audio nella cartella /sounds/ del tuo server:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>correct.mp3 - Per le risposte corrette</li>
            <li>incorrect.mp3 - Per le risposte sbagliate</li>
            <li>victory.mp3 - Per la vittoria finale</li>
            <li>click.mp3 - Per i click sui pulsanti</li>
          </ul>
        </div>
      </div>
    );
  }
  
  // Schermata di vittoria
  if (modalitaGioco === 'vittoria') {
    // Imposta pezziCompletati uguale a numeroDomande nella schermata di vittoria
    // per garantire che tutte le parti dell'immagine siano visibili
    const pezziVittoria = numeroDomande;
    
    // Funzione per renderizzare l'effetto con tutti i pezzi visibili
    const renderEffettoCompleto = () => {
      // Salva temporaneamente il valore originale
      const valoreOriginale = pezziCompletati;
      // Imposta il valore massimo per mostrare tutti i pezzi
      setPezziCompletati(pezziVittoria);
      // Renderizza l'effetto
      const effetto = renderEffetto();
      // Ripristina il valore originale
      setPezziCompletati(valoreOriginale);
      return effetto;
    };
    
    return (
      <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">🎉 Complimenti {nomeBambino}! 🎉</h1>
        
        <p className="text-xl mb-6">Hai completato {tipoEffetto === 'farfalla' ? 'la farfalla' : 
                                   tipoEffetto === 'castello' ? 'il castello' : 
                                   tipoEffetto === 'astronave' ? 'l\'astronave' : 
                                   'il robot'} con {risposteCorrette} risposte corrette!</p>
        
        <div className="w-full mb-4 bg-white p-4 rounded-lg shadow-md">
          {/* Forza la visualizzazione di tutti i pezzi nella schermata di vittoria */}
          <div className="flex justify-center mt-4">
            <svg viewBox="0 0 500 400" width="300" height="240">
              {/* Contenuto SVG specifico per ciascun tipo di effetto */}
              {tipoEffetto === 'castello' && (
                <>
                  {/* Base del castello */}
                  <rect x="100" y="300" width="300" height="20" fill="#8B4513" />
                  
                  {/* Muro principale */}
                  <rect x="150" y="220" width="200" height="80" fill={coloriPezzi[0] || '#D2B48C'} />
                  
                  {/* Torre sinistra */}
                  <rect x="130" y="180" width="40" height="120" fill={coloriPezzi[1] || '#A0522D'} />
                  
                  {/* Torre destra */}
                  <rect x="330" y="180" width="40" height="120" fill={coloriPezzi[2] || '#A0522D'} />
                  
                  {/* Porta */}
                  <path d="M225 300 v-50 a25 25 0 0 1 50 0 v50 z" fill={coloriPezzi[3] || '#8B4513'} />
                  
                  {/* Finestre */}
                  <rect x="170" y="240" width="20" height="30" rx="10" fill={coloriPezzi[4] || '#87CEFA'} />
                  <rect x="310" y="240" width="20" height="30" rx="10" fill={coloriPezzi[4] || '#87CEFA'} />
                  
                  {/* Bandiere */}
                  <line x1="140" y1="150" x2="140" y2="100" stroke="black" strokeWidth="2" />
                  <path d="M140 100 h30 l-5 10 l5 10 h-30 z" fill={coloriPezzi[5] || '#FF0000'} />
                  <line x1="350" y1="150" x2="350" y2="100" stroke="black" strokeWidth="2" />
                  <path d="M350 100 h30 l-5 10 l5 10 h-30 z" fill={coloriPezzi[5] || '#FF0000'} />
                </>
              )}
              
              {tipoEffetto === 'farfalla' && (
                <>
                  {/* Corpo centrale */}
                  <ellipse cx="250" cy="200" rx="30" ry="70" fill="#8B4513" />
                  
                  {/* Ala superiore sinistra */}
                  <path d="M250 180 Q180 100 100 150 Q150 200 250 180" fill={coloriPezzi[0] || '#FFB7B2'} stroke="#333" strokeWidth="1" />
                  
                  {/* Ala superiore destra */}
                  <path d="M250 180 Q320 100 400 150 Q350 200 250 180" fill={coloriPezzi[1] || '#FFDAC1'} stroke="#333" strokeWidth="1" />
                  
                  {/* Ala inferiore sinistra */}
                  <path d="M250 220 Q180 300 100 250 Q150 200 250 220" fill={coloriPezzi[2] || '#E2F0CB'} stroke="#333" strokeWidth="1" />
                  
                  {/* Ala inferiore destra */}
                  <path d="M250 220 Q320 300 400 250 Q350 200 250 220" fill={coloriPezzi[3] || '#B5EAD7'} stroke="#333" strokeWidth="1" />
                  
                  {/* Antenne */}
                  <path d="M240 130 Q220 100 210 70" stroke="black" strokeWidth="2" fill="none" />
                  <path d="M260 130 Q280 100 290 70" stroke="black" strokeWidth="2" fill="none" />
                  <circle cx="210" cy="70" r="5" fill={coloriPezzi[4] || '#333'} />
                  <circle cx="290" cy="70" r="5" fill={coloriPezzi[4] || '#333'} />
                  
                  {/* Decorazioni */}
                  <circle cx="180" cy="150" r="8" fill={coloriPezzi[5] || '#C7CEEA'} stroke="#333" />
                  <circle cx="320" cy="150" r="8" fill={coloriPezzi[5] || '#F8C8DC'} stroke="#333" />
                </>
              )}
              
              {tipoEffetto === 'astronave' && (
                <>
                  {/* Base dell'astronave */}
                  <rect x="200" y="300" width="100" height="30" rx="10" fill={coloriPezzi[0] || '#C0C0C0'} />
                  
                  {/* Corpo centrale */}
                  <rect x="210" y="200" width="80" height="100" rx="20" fill={coloriPezzi[1] || '#A9A9A9'} />
                  
                  {/* Punta */}
                  <path d="M210 200 h80 l-40 -50 z" fill={coloriPezzi[2] || '#808080'} />
                  
                  {/* Finestra */}
                  <circle cx="250" cy="230" r="15" fill={coloriPezzi[3] || '#87CEFA'} />
                  
                  {/* Alettoni */}
                  <path d="M210 250 l-40 30 v20 h40 z" fill={coloriPezzi[4] || '#FF4500'} />
                  <path d="M290 250 l40 30 v20 h-40 z" fill={coloriPezzi[4] || '#FF4500'} />
                  
                  {/* Motori */}
                  <rect x="220" y="330" width="20" height="30" fill={coloriPezzi[5] || '#696969'} />
                  <rect x="260" y="330" width="20" height="30" fill={coloriPezzi[5] || '#696969'} />
                  <path d="M220 360 h20 l-10 30 z" fill="#FF4500" />
                  <path d="M260 360 h20 l-10 30 z" fill="#FF4500" />
                </>
              )}
              
              {tipoEffetto === 'robot' && (
                <>
                  {/* Testa */}
                  <rect x="200" y="80" width="100" height="80" rx="10" fill={coloriPezzi[0] || '#C0C0C0'} />
                  
                  {/* Occhi */}
                  <circle cx="230" cy="110" r="10" fill={coloriPezzi[1] || '#00BFFF'} />
                  <circle cx="270" cy="110" r="10" fill={coloriPezzi[1] || '#00BFFF'} />
                  
                  {/* Corpo */}
                  <rect x="220" y="160" width="60" height="100" fill={coloriPezzi[2] || '#A9A9A9'} />
                  
                  {/* Braccia */}
                  <rect x="180" y="170" width="40" height="15" fill={coloriPezzi[3] || '#C0C0C0'} />
                  <rect x="280" y="170" width="40" height="15" fill={coloriPezzi[3] || '#C0C0C0'} />
                  
                  {/* Gambe */}
                  <rect x="230" y="260" width="15" height="50" fill={coloriPezzi[4] || '#808080'} />
                  <rect x="255" y="260" width="15" height="50" fill={coloriPezzi[4] || '#808080'} />
                  
                  {/* Pannello di controllo */}
                  <rect x="230" y="180" width="40" height="20" fill={coloriPezzi[5] || '#000000'} />
                  <circle cx="240" cy="190" r="3" fill="#FF0000" />
                  <circle cx="250" cy="190" r="3" fill="#FFFF00" />
                  <circle cx="260" cy="190" r="3" fill="#00FF00" />
                </>
              )}
            </svg>
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <button
            className="px-6 py-3 bg-purple-500 text-white rounded-full font-bold shadow-md hover:bg-purple-600"
            onClick={() => setModalitaGioco('menu')}
          >
            Menu Principale
          </button>
          
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-full font-bold shadow-md hover:bg-green-600"
            onClick={iniziaGioco}
          >
            Gioca Ancora
          </button>
        </div>
      </div>
    );
  }
  
  // Schermata del gioco
  return (
    <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-purple-600 mb-2">Gioco delle Tabelline</h1>
      
      <div className="w-full mb-4 bg-white p-4 rounded-lg shadow-md">
        {renderEffetto()}
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-500">Progresso:</span>
          <span className="text-sm font-medium text-purple-600">{pezziCompletati}/{numeroDomande}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full" 
            style={{ width: `${(pezziCompletati / numeroDomande) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {domandaCorrente && (
        <div className="w-full">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
              {domandaCorrente.tabella} × {domandaCorrente.moltiplicatore} = ?
            </h2>
            
            <div className="flex flex-col items-center">
              <input
                type="number"
                value={risposta}
                onChange={(e) => setRisposta(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-24 text-center text-3xl font-bold p-2 border-2 border-blue-400 rounded-lg mb-4"
                autoFocus
                min="0"
                max="100"
              />
              
              <button
                onClick={() => {
                  if (risposta !== '') {
                    controllaRisposta();
                  }
                }}
                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold shadow-md hover:bg-green-600"
                disabled={risposta === ''}
              >
                Conferma
              </button>
            </div>
          </div>
          
          {messaggioFeedback && (
            <div className={`p-3 rounded-lg shadow-md text-center text-lg font-semibold ${
              messaggioFeedback.includes('Riprova') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {messaggioFeedback}
            </div>
          )}
        </div>
      )}
      
      <button
        className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        onClick={() => setModalitaGioco('menu')}
      >
        Torna al Menu
      </button>
    </div>
  );
};

export default TabelloneGioco;