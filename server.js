const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const COLORES_DISPONIBLES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
const MAX_JUGADORES = 5;
const PUNTAJE_GANADOR = 5;
const MAX_CARTAS_MANO = 3;

// NOTA: los textos de las preguntas siguen en español por ahora — se traducen en el siguiente paso.
const CATEGORIAS = {
  curiosidades: {
    nombre: 'Historical Curiosities',
    preguntas: [
      { categoria: 'History', texto: 'The Eiffel Tower was meant to be dismantled 20 years after it was built.', respuesta: true },
      { categoria: 'History', texto: "Napoleon Bonaparte was very short, under 5'3\".", respuesta: false },
      { categoria: 'Trivia', texto: 'Coca-Cola was originally created as a medicine.', respuesta: true },
      { categoria: 'History', texto: 'Ancient Egyptians considered cats sacred animals.', respuesta: true },
      { categoria: 'Film', texto: 'The first sound film premiered in the 19th century.', respuesta: false },
      { categoria: 'History', texto: 'The Roman Empire used "bread and circuses" to entertain the public.', respuesta: true },
      { categoria: 'History', texto: 'The Industrial Revolution began in France.', respuesta: false },
      { categoria: 'History', texto: 'Cleopatra was of native Egyptian descent.', respuesta: false },
      { categoria: 'History', texto: "The Hundred Years' War lasted exactly 100 years.", respuesta: false },
      { categoria: 'History', texto: 'The Titanic sank on its maiden voyage.', respuesta: true },
      { categoria: 'History', texto: 'The Great Wall of China was built in a single historical period.', respuesta: false },
      { categoria: 'Trivia', texto: 'Vikings wore horned helmets in battle.', respuesta: false },
      { categoria: 'History', texto: 'The Statue of Liberty was a gift from France to the United States.', respuesta: true },
      { categoria: 'History', texto: 'The first country to grant women the right to vote was New Zealand.', respuesta: true },
      { categoria: 'History', texto: 'Julius Caesar was the first Roman emperor.', respuesta: false },
      { categoria: 'History', texto: "The Black Death killed a large part of Europe's population in the 14th century.", respuesta: true },
      { categoria: 'History', texto: 'The ancient Olympic Games were held every 4 years in Greece.', respuesta: true },
      { categoria: 'History', texto: 'Christopher Columbus proved the Earth was round.', respuesta: false },
      { categoria: 'History', texto: "The Inca Empire didn't use the wheel for practical purposes.", respuesta: true },
      { categoria: 'History', texto: 'The Bastille was a prison stormed at the start of the French Revolution.', respuesta: true },
      { categoria: 'Trivia', texto: 'Albert Einstein failed math in school.', respuesta: false },
      { categoria: 'Trivia', texto: 'Morse code was invented by Samuel Morse.', respuesta: true },
      { categoria: 'History', texto: 'The ancient Library of Alexandria burned down completely in a single fire.', respuesta: false },
      { categoria: 'History', texto: 'Gutenberg invented the movable-type printing press in Europe.', respuesta: true },
      { categoria: 'History', texto: 'The Aztecs practiced human sacrifice as part of their religion.', respuesta: true },
      { categoria: 'History', texto: 'Machu Picchu was built by the Maya.', respuesta: false },
      { categoria: 'History', texto: 'World War II began with the invasion of Poland.', respuesta: true },
      { categoria: 'History', texto: 'Marco Polo was the first European to reach China.', respuesta: false },
      { categoria: 'History', texto: "Chile's independence was formally declared in 1818.", respuesta: true },
      { categoria: 'History', texto: 'The Roman Colosseum was used for gladiator fights.', respuesta: true },
      { categoria: 'History', texto: 'Genghis Khan unified the Mongol tribes.', respuesta: true },
      { categoria: 'Trivia', texto: 'The Leaning Tower of Pisa leans by intentional design.', respuesta: false },
      { categoria: 'History', texto: 'The Renaissance began in Italy.', respuesta: true },
      { categoria: 'History', texto: 'Egyptian pharaohs were mummified after death.', respuesta: true },
      { categoria: 'History', texto: "Chile's flag was designed during Spanish colonial rule.", respuesta: false },
      { categoria: 'History', texto: 'The Ottoman Empire lasted more than 600 years.', respuesta: true },
      { categoria: 'History', texto: 'The Cold War was a direct armed conflict between the US and the USSR.', respuesta: false },
      { categoria: 'History', texto: 'The first modern Olympic Games were held in Athens.', respuesta: true },
      { categoria: 'Trivia', texto: 'Big Ben is the official name of the entire clock tower in London.', respuesta: false },
      { categoria: 'History', texto: 'The Russian Revolution took place in 1917.', respuesta: true },
    ]
  },
  ciencia: {
    nombre: 'Science & Technology',
    preguntas: [
      { categoria: 'Science', texto: 'Humans only use 10% of their brain.', respuesta: false },
      { categoria: 'Science', texto: 'Light travels faster than sound.', respuesta: true },
      { categoria: 'Science', texto: 'Water is a compound made of hydrogen and oxygen.', respuesta: true },
      { categoria: 'Science', texto: 'Diamonds are made of carbon.', respuesta: true },
      { categoria: 'Technology', texto: 'The first computer took up an entire room.', respuesta: true },
      { categoria: 'Technology', texto: 'The Internet and the World Wide Web are exactly the same thing.', respuesta: false },
      { categoria: 'Science', texto: 'Human DNA is nearly identical to chimpanzee DNA (about 99%).', respuesta: true },
      { categoria: 'Science', texto: 'Mars is the hottest planet in the solar system.', respuesta: false },
      { categoria: 'Science', texto: 'Antibiotics are effective against viruses.', respuesta: false },
      { categoria: 'Science', texto: 'Earth takes exactly 24 hours to complete one rotation.', respuesta: false },
      { categoria: 'Technology', texto: 'The Android operating system was built by Google from scratch.', respuesta: false },
      { categoria: 'Technology', texto: 'The first artificial satellite was Sputnik.', respuesta: true },
      { categoria: 'Science', texto: 'Plants perform photosynthesis to make their own food.', respuesta: true },
      { categoria: 'Science', texto: 'Sound can travel through the vacuum of space.', respuesta: false },
      { categoria: 'Technology', texto: 'Wifi transmits data using radio waves.', respuesta: true },
      { categoria: 'Science', texto: 'Lithium is a metal used in rechargeable batteries.', respuesta: true },
      { categoria: 'Science', texto: 'The speed of light is about 300,000 km per second.', respuesta: true },
      { categoria: 'Science', texto: 'Black holes can be seen directly with a regular optical telescope.', respuesta: false },
      { categoria: 'Technology', texto: 'The first smartphone in history was the iPhone.', respuesta: false },
      { categoria: 'Technology', texto: 'Binary code only uses the numbers 0 and 1.', respuesta: true },
      { categoria: 'Technology', texto: 'ChatGPT was created by Google.', respuesta: false },
      { categoria: 'Science', texto: 'The human heart has four chambers.', respuesta: true },
      { categoria: 'Science', texto: "Volcanoes only exist on Earth's surface.", respuesta: false },
      { categoria: 'Science', texto: 'Plastic fully degrades within a few years.', respuesta: false },
      { categoria: 'Science', texto: 'Solar energy is a renewable energy source.', respuesta: true },
      { categoria: 'Technology', texto: 'The first programming language was Python.', respuesta: false },
      { categoria: 'Science', texto: 'Electrons carry a positive charge.', respuesta: false },
      { categoria: 'Technology', texto: 'GPS works thanks to satellites.', respuesta: true },
      { categoria: 'Science', texto: 'The Moon generates its own light.', respuesta: false },
      { categoria: 'Science', texto: 'Graphene is an extremely strong material made of carbon.', respuesta: true },
      { categoria: 'Technology', texto: 'Bluetooth and wifi use exactly the same technology.', respuesta: false },
      { categoria: 'Science', texto: 'The solar system has eight officially recognized planets.', respuesta: true },
      { categoria: 'Technology', texto: "Computer viruses can physically damage a computer's hardware.", respuesta: false },
      { categoria: 'Science', texto: 'Oxygen is the most abundant element in the universe.', respuesta: false },
      { categoria: 'Science', texto: 'Animal cloning has already been successfully achieved.', respuesta: true },
      { categoria: 'Technology', texto: 'A byte equals 8 bits.', respuesta: true },
      { categoria: 'Technology', texto: '5G networks are slower than 4G networks.', respuesta: false },
      { categoria: 'Technology', texto: 'The Hubble Space Telescope orbits the Earth.', respuesta: true },
      { categoria: 'Science', texto: 'Nuclear fusion is the same process that happens in the Sun.', respuesta: true },
      { categoria: 'Technology', texto: 'Robots already perform surgeries with human assistance.', respuesta: true },
    ]
  },
  arte_cultura: {
    nombre: 'Art & Culture',
    preguntas: [
      { categoria: 'Painting', texto: 'The Mona Lisa was painted by Leonardo da Vinci.', respuesta: true },
      { categoria: 'Art', texto: 'Pablo Picasso was the creator of the Cubist movement.', respuesta: true },
      { categoria: 'Painting', texto: 'Vincent van Gogh sold many paintings during his lifetime.', respuesta: false },
      { categoria: 'Dance', texto: 'Classical ballet originated in Italy during the Renaissance.', respuesta: true },
      { categoria: 'Painting', texto: 'Frida Kahlo was a Mexican painter.', respuesta: true },
      { categoria: 'Theater', texto: '"The Phantom of the Opera" is set in a London theater.', respuesta: false },
      { categoria: 'Painting', texto: 'Michelangelo painted the ceiling of the Sistine Chapel.', respuesta: true },
      { categoria: 'Dance', texto: 'Flamenco is a musical and dance genre originating in Spain.', respuesta: true },
      { categoria: 'Literature', texto: 'Gabriel García Márquez won the Nobel Prize in Literature.', respuesta: true },
      { categoria: 'Art', texto: 'The Surrealist movement aimed to represent the world of dreams.', respuesta: true },
      { categoria: 'Painting', texto: 'Salvador Dalí was a Spanish surrealist painter.', respuesta: true },
      { categoria: 'Dance', texto: 'Tango is a musical and dance genre originating in Argentina and Uruguay.', respuesta: true },
      { categoria: 'Literature', texto: 'William Shakespeare wrote "Hamlet."', respuesta: true },
      { categoria: 'Painting', texto: 'The Mona Lisa is currently displayed at the Louvre Museum.', respuesta: true },
      { categoria: 'Art', texto: 'The Impressionist movement originated in Germany.', respuesta: false },
      { categoria: 'Music', texto: 'Beethoven composed nine symphonies.', respuesta: true },
      { categoria: 'Theater', texto: 'Cirque du Soleil combines circus, theater, and music.', respuesta: true },
      { categoria: 'Literature', texto: 'Isabel Allende is a Chilean writer.', respuesta: true },
      { categoria: 'Architecture', texto: 'Gothic architecture is characterized by pointed arches.', respuesta: true },
      { categoria: 'Music', texto: 'K-pop is a music genre that originated in South Korea.', respuesta: true },
      { categoria: 'Sculpture', texto: 'Auguste Rodin was a famous French sculptor, creator of "The Thinker."', respuesta: true },
      { categoria: 'Music', texto: 'Jazz originated mainly in New Orleans.', respuesta: true },
      { categoria: 'Literature', texto: '"Romeo and Juliet" was written by Cervantes.', respuesta: false },
      { categoria: 'Art', texto: 'The Renaissance emerged first in Italy.', respuesta: true },
      { categoria: 'Art', texto: 'Andy Warhol is known as a pop art icon.', respuesta: true },
      { categoria: 'Dance', texto: 'Contemporary dance follows the exact same rules as classical ballet.', respuesta: false },
      { categoria: 'Literature', texto: 'Pablo Neruda was a Chilean poet.', respuesta: true },
      { categoria: 'Art', texto: 'The Prado Museum is located in Madrid.', respuesta: true },
      { categoria: 'Music', texto: 'Baroque classical music includes composers like Bach and Vivaldi.', respuesta: true },
      { categoria: 'Art', texto: 'Graffiti is considered by some to be a form of urban art.', respuesta: true },
      { categoria: 'Literature', texto: '"Don Quixote" was written by Miguel de Cervantes.', respuesta: true },
      { categoria: 'Art', texto: 'The Art Nouveau movement is characterized by straight, geometric lines.', respuesta: false },
      { categoria: 'Art', texto: 'The Venice Biennale is a contemporary art event.', respuesta: true },
      { categoria: 'Painting', texto: 'Diego Rivera was a Mexican muralist.', respuesta: true },
      { categoria: 'Theater', texto: 'Ancient Greek theater included both comedies and tragedies.', respuesta: true },
      { categoria: 'Painting', texto: 'Claude Monet is known for his series of water lily paintings.', respuesta: true },
      { categoria: 'Music', texto: 'Hip hop includes elements like rap, breakdancing, and graffiti.', respuesta: true },
      { categoria: 'Sculpture', texto: 'The sculpture "David" was created by Donatello.', respuesta: false },
      { categoria: 'Theater', texto: 'Cirque du Soleil originated in Canada.', respuesta: true },
      { categoria: 'Music', texto: 'Chilean folk music includes instruments like the guitar and charango.', respuesta: true },
    ]
  }
};

const CARTAS_ACCION = {
  ese_pasto: { nombre: 'The Grass Is Greener', tipo: 'jugador' },
  siguiendo_ganado: { nombre: 'Following the Herd', tipo: 'ninguno' },
  vaca_tecnologica: { nombre: 'Tech Cow', tipo: 'ninguno' },
  leche_cortada: { nombre: 'Sour Milk', tipo: 'ninguno' },
  vuelta_carnero: { nombre: 'Somersault', tipo: 'jugador' },
  mala_leche: { nombre: 'Bad Milk', tipo: 'jugador' },
  manos_mantequilla: { nombre: 'Butter Fingers', tipo: 'jugador' },
  vaca_tablero: { nombre: 'The Boss Cow', tipo: 'valor' },
};

let jugadores = {}; // { socketId: { nombre, color, esHost, esBot, puntaje, manoCartas: [] } }
let categoriaActual = null;
let indicePregunta = -1;
let preguntaActiva = null;
let ganadorDeclarado = null;
let ultimaAccion = null;
let primeraPreguntaLanzada = false;

let mazoAccion = [];
let descarteAccion = [];
const NOMBRES_BOTS = ['Bot Amy', 'Bot Ben', 'Bot Cara', 'Bot Dan'];
let contadorBots = 0;

function crearIdBot() {
  contadorBots++;
  return `bot-${contadorBots}-${Date.now()}`;
}

function barajar(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearMazoInicial() {
  const cartas = [];
  ['ese_pasto', 'siguiendo_ganado', 'vaca_tecnologica', 'leche_cortada', 'vuelta_carnero', 'mala_leche', 'manos_mantequilla']
    .forEach(id => { for (let i = 0; i < 3; i++) cartas.push(id); });
  cartas.push('vaca_tablero');
  return barajar(cartas);
}

mazoAccion = crearMazoInicial();

function robarCarta(jugadorId) {
  const jugador = jugadores[jugadorId];
  if (!jugador || jugador.manoCartas.length >= MAX_CARTAS_MANO) return;
  if (mazoAccion.length === 0) {
    if (descarteAccion.length === 0) return;
    mazoAccion = barajar(descarteAccion);
    descarteAccion = [];
  }
  const carta = mazoAccion.pop();
  jugador.manoCartas.push(carta);
}

function coloresLibres() {
  const usados = Object.values(jugadores).map(j => j.color);
  return COLORES_DISPONIBLES.filter(c => !usados.includes(c));
}

function jugadoresPublico() {
  return Object.entries(jugadores).map(([id, j]) => ({
    id, nombre: j.nombre, color: j.color, esHost: j.esHost, esBot: !!j.esBot, puntaje: j.puntaje,
    cartasEnMano: j.manoCartas.length
  }));
}

function esHost(socket) {
  return jugadores[socket.id] && jugadores[socket.id].esHost;
}

function emitirEstado() {
  io.emit('estado_jugadores', {
    jugadores: jugadoresPublico(),
    coloresLibres: coloresLibres(),
    cupoLleno: Object.keys(jugadores).length >= MAX_JUGADORES,
    ganador: ganadorDeclarado,
    categoriaActual: categoriaActual ? { id: categoriaActual, nombre: CATEGORIAS[categoriaActual].nombre } : null,
    puedeAgregarBot: !primeraPreguntaLanzada,
    ultimaAccionInfo: ultimaAccion ? {
      carta: ultimaAccion.tipo === 'leche_cortada' ? 'Sour Milk' : CARTAS_ACCION[ultimaAccion.tipo].nombre,
      deNombre: ultimaAccion.deNombre,
      deColor: ultimaAccion.deColor
    } : null
  });
}

function enviarManos() {
  Object.entries(jugadores).forEach(([id, j]) => {
    io.to(id).emit('tu_mano', j.manoCartas);
  });
}

function elegirIndiceAleatorio() {
  const banco = CATEGORIAS[categoriaActual].preguntas;
  if (banco.length <= 1) return 0;
  let nuevoIndice;
  do {
    nuevoIndice = Math.floor(Math.random() * banco.length);
  } while (nuevoIndice === indicePregunta);
  return nuevoIndice;
}

function lanzarPreguntaInterna() {
  indicePregunta = elegirIndiceAleatorio();
  const banco = CATEGORIAS[categoriaActual].preguntas;
  const p = banco[indicePregunta];
  preguntaActiva = {
    categoria: p.categoria, texto: p.texto, correcta: p.respuesta,
    revelada: false, respuestas: {}, votoLibreId: null
  };
  return { categoria: p.categoria, texto: p.texto, numero: indicePregunta + 1, total: banco.length };
}

function snapshotPregunta() {
  if (!preguntaActiva) return null;
  return {
    indicePregunta,
    categoria: preguntaActiva.categoria,
    texto: preguntaActiva.texto,
    correcta: preguntaActiva.correcta,
    respuestas: { ...preguntaActiva.respuestas },
    votoLibreId: preguntaActiva.votoLibreId
  };
}

function restaurarSnapshot(snap) {
  if (!preguntaActiva || !snap) return;
  indicePregunta = snap.indicePregunta;
  preguntaActiva.categoria = snap.categoria;
  preguntaActiva.texto = snap.texto;
  preguntaActiva.correcta = snap.correcta;
  preguntaActiva.respuestas = { ...snap.respuestas };
  preguntaActiva.votoLibreId = snap.votoLibreId;
}

function emitirPreguntaSincronizada() {
  if (!preguntaActiva) return;
  Object.keys(jugadores).forEach(id => {
    io.to(id).emit('pregunta_restaurada', {
      categoria: preguntaActiva.categoria, texto: preguntaActiva.texto,
      yaRespondiste: preguntaActiva.respuestas[id] !== undefined
    });
  });
  io.emit('conteo_respuestas', {
    respondieron: Object.keys(preguntaActiva.respuestas).length,
    total: Object.keys(jugadores).length,
    respondieronIds: Object.keys(preguntaActiva.respuestas)
  });
}

function revertirAccion(a) {
  if (a.tipo === 'manos_mantequilla' || a.tipo === 'vuelta_carnero') {
    if (preguntaActiva) preguntaActiva.respuestas[a.objetivoId] = a.anterior;
  } else if (a.tipo === 'ese_pasto') {
    if (preguntaActiva) {
      const tmp = preguntaActiva.respuestas[a.deId];
      preguntaActiva.respuestas[a.deId] = preguntaActiva.respuestas[a.objetivoId];
      preguntaActiva.respuestas[a.objetivoId] = tmp;
    }
  } else if (a.tipo === 'siguiendo_ganado') {
    if (preguntaActiva) preguntaActiva.respuestas = { ...a.mapaAnterior };
  } else if (a.tipo === 'vaca_tablero') {
    if (preguntaActiva) preguntaActiva.correcta = a.anteriorCorrecta;
  } else if (a.tipo === 'vaca_tecnologica') {
    restaurarSnapshot(a.anteriorPregunta);
  } else if (a.tipo === 'leche_cortada') {
    restaurarSnapshot(a.estadoParaRedo);
  }
}

function todosRespondieron() {
  if (!preguntaActiva) return false;
  const total = Object.keys(jugadores).length;
  const respondieron = Object.keys(preguntaActiva.respuestas).length;
  return total > 0 && respondieron === total;
}

function procesarRespuesta(jugadorId, respuesta) {
  if (!preguntaActiva || preguntaActiva.revelada) return;
  if (preguntaActiva.votoLibreId) {
    if (jugadorId !== preguntaActiva.votoLibreId) return;
  } else {
    if (preguntaActiva.respuestas[jugadorId] !== undefined) return;
  }
  preguntaActiva.respuestas[jugadorId] = respuesta;
  io.emit('conteo_respuestas', {
    respondieron: Object.keys(preguntaActiva.respuestas).length,
    total: Object.keys(jugadores).length,
    respondieronIds: Object.keys(preguntaActiva.respuestas)
  });
  if (todosRespondieron()) {
    intentarJugadasDeBots();
  }
}

function procesarJugarCarta(jugadorId, { cartaId, objetivoId, valorElegido }) {
  const jugador = jugadores[jugadorId];
  if (!jugador) return false;
  const idx = jugador.manoCartas.indexOf(cartaId);
  if (idx === -1) return false;

  if (cartaId !== 'leche_cortada' && !todosRespondieron()) {
    io.to(jugadorId).emit('error_carta', 'You must wait until everyone has answered before playing this card.');
    return false;
  }

  const gastarCarta = () => {
    jugador.manoCartas.splice(idx, 1);
    descarteAccion.push(cartaId);
  };

  if (cartaId === 'leche_cortada') {
    if (!ultimaAccion) {
      io.to(jugadorId).emit('error_carta', 'There is no recent action to cancel.');
      return false;
    }
    const deNombre = ultimaAccion.deNombre;
    const deColor = ultimaAccion.deColor;
    const estadoAntesDeAnular = snapshotPregunta();

    revertirAccion(ultimaAccion);
    gastarCarta();
    io.emit('accion_anulada', { por: jugador.nombre, porColor: jugador.color, deQuien: deNombre, deQuienColor: deColor });

    ultimaAccion = {
      tipo: 'leche_cortada',
      deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color,
      estadoParaRedo: estadoAntesDeAnular
    };

    emitirPreguntaSincronizada();
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'mala_leche') {
    const objetivo = jugadores[objetivoId];
    if (!objetivo || objetivo.manoCartas.length === 0) {
      io.to(jugadorId).emit('error_carta', 'That player has no cards.');
      return false;
    }
    const roboIdx = Math.floor(Math.random() * objetivo.manoCartas.length);
    const cartaRobada = objetivo.manoCartas.splice(roboIdx, 1)[0];
    if (jugador.manoCartas.length < MAX_CARTAS_MANO) {
      jugador.manoCartas.push(cartaRobada);
    } else {
      descarteAccion.push(cartaRobada);
    }
    gastarCarta();
    ultimaAccion = null;
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'Bad Milk',
      objetivo: objetivo.nombre, objetivoColor: objetivo.color
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'manos_mantequilla' || cartaId === 'vuelta_carnero') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'There is no active question right now.');
      return false;
    }
    const objetivo = jugadores[objetivoId];
    if (!objetivo || preguntaActiva.respuestas[objetivoId] === undefined) {
      io.to(jugadorId).emit('error_carta', 'That player hasn\'t answered yet.');
      return false;
    }
    const anterior = preguntaActiva.respuestas[objetivoId];
    const nueva = cartaId === 'vuelta_carnero' ? !anterior : Math.random() < 0.5;
    preguntaActiva.respuestas[objetivoId] = nueva;
    gastarCarta();
    ultimaAccion = { tipo: cartaId, deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, objetivoId, anterior };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: CARTAS_ACCION[cartaId].nombre,
      objetivo: objetivo.nombre, objetivoColor: objetivo.color
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'ese_pasto') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'There is no active question right now.');
      return false;
    }
    const objetivo = jugadores[objetivoId];
    if (!objetivo || preguntaActiva.respuestas[jugadorId] === undefined || preguntaActiva.respuestas[objetivoId] === undefined) {
      io.to(jugadorId).emit('error_carta', 'Both players must have already answered to swap.');
      return false;
    }
    const tmp = preguntaActiva.respuestas[jugadorId];
    preguntaActiva.respuestas[jugadorId] = preguntaActiva.respuestas[objetivoId];
    preguntaActiva.respuestas[objetivoId] = tmp;
    gastarCarta();
    ultimaAccion = { tipo: 'ese_pasto', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, objetivoId };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'The Grass Is Greener',
      objetivo: objetivo.nombre, objetivoColor: objetivo.color
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'siguiendo_ganado') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'There is no active question right now.');
      return false;
    }
    const idsQueRespondieron = Object.keys(jugadores).filter(id => preguntaActiva.respuestas[id] !== undefined);
    if (idsQueRespondieron.length < 2) {
      io.to(jugadorId).emit('error_carta', 'At least 2 players need to have answered already.');
      return false;
    }
    const mapaAnterior = { ...preguntaActiva.respuestas };
    const n = idsQueRespondieron.length;
    idsQueRespondieron.forEach((id, i) => {
      const siguienteId = idsQueRespondieron[(i + 1) % n];
      preguntaActiva.respuestas[siguienteId] = mapaAnterior[id];
    });
    gastarCarta();
    ultimaAccion = { tipo: 'siguiendo_ganado', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, mapaAnterior };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'Following the Herd',
      objetivo: 'everyone'
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'vaca_tecnologica') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'There is no active question right now.');
      return false;
    }
    const anteriorPregunta = snapshotPregunta();

    indicePregunta = elegirIndiceAleatorio();
    const p = CATEGORIAS[categoriaActual].preguntas[indicePregunta];
    preguntaActiva.categoria = p.categoria;
    preguntaActiva.texto = p.texto;
    preguntaActiva.correcta = p.respuesta;
    delete preguntaActiva.respuestas[jugadorId];
    preguntaActiva.votoLibreId = jugadorId;
    gastarCarta();
    ultimaAccion = {
      tipo: 'vaca_tecnologica', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color,
      anteriorPregunta
    };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'Tech Cow',
      objetivo: 'the question',
      detalle: `Only ${jugador.nombre} (${jugador.color} cow) can answer the new question.`
    });
    io.emit('pregunta_cambiada', {
      categoria: p.categoria, texto: p.texto,
      casterId: jugadorId, casterNombre: jugador.nombre, casterColor: jugador.color
    });
    io.to(jugadorId).emit('puedes_responder_de_nuevo');
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'vaca_tablero') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'There is no active question right now.');
      return false;
    }
    if (valorElegido !== true && valorElegido !== false) {
      io.to(jugadorId).emit('error_carta', 'You must choose True or False.');
      return false;
    }
    const anteriorCorrecta = preguntaActiva.correcta;
    preguntaActiva.correcta = valorElegido;
    gastarCarta();
    ultimaAccion = { tipo: 'vaca_tablero', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, anteriorCorrecta };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'The Boss Cow',
      objetivo: 'the correct answer',
      detalle: `The correct answer is now ${valorElegido ? 'True' : 'False'}`
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  return false;
}

function jugadaAleatoriaParaBot(botId) {
  const bot = jugadores[botId];
  if (!bot || !bot.esBot || bot.manoCartas.length === 0) return;
  if (!preguntaActiva || preguntaActiva.revelada) return;
  if (Math.random() > 0.5) return;

  const cartaId = bot.manoCartas[Math.floor(Math.random() * bot.manoCartas.length)];
  const tipo = CARTAS_ACCION[cartaId].tipo;

  if (cartaId === 'leche_cortada') {
    if (!ultimaAccion) return;
    procesarJugarCarta(botId, { cartaId });
    return;
  }

  if (cartaId === 'vaca_tecnologica') {
    const jugado = procesarJugarCarta(botId, { cartaId });
    if (jugado) {
      setTimeout(() => {
        procesarRespuesta(botId, Math.random() < 0.5);
      }, 600 + Math.random() * 1000);
    }
    return;
  }

  if (tipo === 'jugador') {
    const otros = Object.keys(jugadores).filter(id => id !== botId);
    if (otros.length === 0) return;
    const objetivoId = otros[Math.floor(Math.random() * otros.length)];
    procesarJugarCarta(botId, { cartaId, objetivoId });
    return;
  }

  if (tipo === 'valor') {
    procesarJugarCarta(botId, { cartaId, valorElegido: Math.random() < 0.5 });
    return;
  }

  procesarJugarCarta(botId, { cartaId });
}

function programarRespuestasBots() {
  Object.entries(jugadores).forEach(([id, j]) => {
    if (!j.esBot) return;
    const demora = 800 + Math.random() * 2200;
    setTimeout(() => {
      const respuesta = Math.random() < 0.5;
      procesarRespuesta(id, respuesta);
    }, demora);
  });
}

function intentarJugadasDeBots() {
  Object.keys(jugadores).forEach(id => {
    if (!jugadores[id] || !jugadores[id].esBot) return;
    setTimeout(() => jugadaAleatoriaParaBot(id), 300 + Math.random() * 1800);
  });
}

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);
  emitirEstado();

  socket.on('unirse', ({ nombre, color }) => {
    if (Object.keys(jugadores).length >= MAX_JUGADORES) {
      socket.emit('error_union', 'The game already has 5 players.');
      return;
    }
    if (!coloresLibres().includes(color)) {
      socket.emit('error_union', 'That color was already picked by another player.');
      return;
    }
    const hayHostActual = Object.values(jugadores).some(j => j.esHost);
    const esPrimerJugador = !hayHostActual;
    jugadores[socket.id] = { nombre, color, esHost: esPrimerJugador, puntaje: 0, manoCartas: [] };
    robarCarta(socket.id);
    console.log(`${nombre} joined as ${color} cow${esPrimerJugador ? ' (HOST)' : ''}`);

    socket.emit('union_exitosa', { nombre, color, esHost: esPrimerJugador });
    enviarManos();
    emitirEstado();
  });

  socket.on('elegir_categoria', (catId) => {
    if (!esHost(socket)) return;
    if (!CATEGORIAS[catId]) return;
    if (preguntaActiva && !preguntaActiva.revelada) {
      socket.emit('error_host', 'You can\'t change category while a question is active.');
      return;
    }
    categoriaActual = catId;
    indicePregunta = -1;
    console.log(`Category chosen: ${CATEGORIAS[catId].nombre}`);
    emitirEstado();
  });

  socket.on('lanzar_pregunta', () => {
    if (!esHost(socket) || ganadorDeclarado) return;
    if (!categoriaActual) {
      socket.emit('error_host', 'Choose a category before launching a question.');
      return;
    }
    ultimaAccion = null;
    primeraPreguntaLanzada = true;
    const info = lanzarPreguntaInterna();
    io.emit('pregunta_lanzada', info);
    programarRespuestasBots();
    emitirEstado();
  });

  socket.on('agregar_bot', () => {
    if (!esHost(socket)) return;
    if (Object.keys(jugadores).length >= MAX_JUGADORES) {
      socket.emit('error_host', 'The game already has 5 players.');
      return;
    }
    const libres = coloresLibres();
    if (libres.length === 0) {
      socket.emit('error_host', 'No cow colors left.');
      return;
    }
    const color = libres[0];
    const nombresUsados = Object.values(jugadores).map(j => j.nombre);
    const nombreDisponible = NOMBRES_BOTS.find(n => !nombresUsados.includes(n)) || `Bot ${Math.floor(Math.random() * 1000)}`;
    const botId = crearIdBot();
    jugadores[botId] = { nombre: nombreDisponible, color, esHost: false, esBot: true, puntaje: 0, manoCartas: [] };
    robarCarta(botId);
    console.log(`${nombreDisponible} (bot) joined as ${color} cow`);
    emitirEstado();
  });

  socket.on('responder', ({ respuesta }) => {
    procesarRespuesta(socket.id, respuesta);
  });

  socket.on('jugar_carta', (payload) => {
    procesarJugarCarta(socket.id, payload);
  });

  socket.on('revelar', () => {
    if (!esHost(socket) || !preguntaActiva || preguntaActiva.revelada) return;
    const totalJugadores = Object.keys(jugadores).length;
    const totalRespondieron = Object.keys(preguntaActiva.respuestas).length;
    if (totalRespondieron < totalJugadores) return;

    preguntaActiva.revelada = true;

    const resultados = Object.entries(preguntaActiva.respuestas).map(([id, resp]) => {
      const correcto = resp === preguntaActiva.correcta;
      if (jugadores[id]) {
        if (correcto) {
          jugadores[id].puntaje += 1;
        } else {
          robarCarta(id);
        }
      }
      return {
        nombre: jugadores[id]?.nombre,
        color: jugadores[id]?.color,
        respuesta: resp,
        correcto
      };
    });

    const posibleGanador = Object.values(jugadores).find(j => j.puntaje >= PUNTAJE_GANADOR);
    if (posibleGanador) {
      ganadorDeclarado = { nombre: posibleGanador.nombre, color: posibleGanador.color, puntaje: posibleGanador.puntaje };
    }

    ultimaAccion = null;
    io.emit('resultado_revelado', { correcta: preguntaActiva.correcta, resultados });
    enviarManos();
    emitirEstado();
  });

  socket.on('reiniciar_partida', () => {
    if (!esHost(socket)) return;

    Object.keys(jugadores).forEach(id => {
      if (jugadores[id].esBot) delete jugadores[id];
    });

    mazoAccion = crearMazoInicial();
    descarteAccion = [];
    ultimaAccion = null;
    Object.values(jugadores).forEach(j => {
      j.puntaje = 0;
      j.manoCartas = [];
    });
    Object.keys(jugadores).forEach(id => robarCarta(id));
    ganadorDeclarado = null;
    preguntaActiva = null;
    indicePregunta = -1;
    categoriaActual = null;
    primeraPreguntaLanzada = false;
    io.emit('partida_reiniciada');
    enviarManos();
    emitirEstado();
  });

  socket.on('disconnect', () => {
    const jugador = jugadores[socket.id];
    if (!jugador) return;
    console.log(`${jugador.nombre} disconnected`);
    const eraHost = jugador.esHost;
    if (jugador.manoCartas.length) descarteAccion.push(...jugador.manoCartas);
    delete jugadores[socket.id];

    if (eraHost) {
      const idsRestantes = Object.keys(jugadores);
      const idHumano = idsRestantes.find(id => !jugadores[id].esBot);
      if (idHumano) {
        jugadores[idHumano].esHost = true;
        console.log(`${jugadores[idHumano].nombre} is the new host`);
        io.to(idHumano).emit('ahora_eres_host');
      }
    }
    emitirEstado();
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});