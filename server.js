const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const COLORES_DISPONIBLES = ['Roja', 'Azul', 'Verde', 'Amarilla', 'Morada'];
const MAX_JUGADORES = 5;
const PUNTAJE_GANADOR = 5;
const MAX_CARTAS_MANO = 3;

const CATEGORIAS = {
  curiosidades: {
    nombre: 'Curiosidades de la Historia',
    preguntas: [
      { categoria: 'Historia', texto: 'La Torre Eiffel iba a ser desmontada 20 años después de construirse.', respuesta: true },
      { categoria: 'Historia', texto: 'Napoleón Bonaparte era muy bajo de estatura, medía menos de 1.60 m.', respuesta: false },
      { categoria: 'Curiosidades', texto: 'La Coca-Cola fue creada originalmente como un medicamento.', respuesta: true },
      { categoria: 'Historia', texto: 'Los antiguos egipcios consideraban al gato un animal sagrado.', respuesta: true },
      { categoria: 'Cine', texto: 'La primera película con sonido se estrenó en el siglo XIX.', respuesta: false },
      { categoria: 'Historia', texto: 'El Imperio Romano usaba el pan y circo para entretener a la gente.', respuesta: true },
      { categoria: 'Historia', texto: 'La Revolución Industrial comenzó en Francia.', respuesta: false },
      { categoria: 'Historia', texto: 'Cleopatra era de origen egipcio nativo.', respuesta: false },
      { categoria: 'Historia', texto: 'La Guerra de los Cien Años duró exactamente 100 años.', respuesta: false },
      { categoria: 'Historia', texto: 'El Titanic se hundió en su viaje inaugural.', respuesta: true },
      { categoria: 'Historia', texto: 'La Gran Muralla China se construyó en un solo periodo histórico.', respuesta: false },
      { categoria: 'Curiosidades', texto: 'Los vikingos usaban cascos con cuernos en batalla.', respuesta: false },
      { categoria: 'Historia', texto: 'La Estatua de la Libertad fue un regalo de Francia a Estados Unidos.', respuesta: true },
      { categoria: 'Historia', texto: 'El primer país en dar el voto a las mujeres fue Nueva Zelanda.', respuesta: true },
      { categoria: 'Historia', texto: 'Julio César fue el primer emperador romano.', respuesta: false },
      { categoria: 'Historia', texto: 'La Peste Negra mató a gran parte de la población europea en el siglo XIV.', respuesta: true },
      { categoria: 'Historia', texto: 'Los Juegos Olímpicos antiguos se celebraban cada 4 años en Grecia.', respuesta: true },
      { categoria: 'Historia', texto: 'Cristóbal Colón demostró que la Tierra era redonda.', respuesta: false },
      { categoria: 'Historia', texto: 'El Imperio Inca no usaba la rueda para uso práctico.', respuesta: true },
      { categoria: 'Historia', texto: 'La Bastilla fue una prisión tomada al inicio de la Revolución Francesa.', respuesta: true },
      { categoria: 'Curiosidades', texto: 'Albert Einstein reprobó matemáticas en la escuela.', respuesta: false },
      { categoria: 'Curiosidades', texto: 'El código Morse fue inventado por Samuel Morse.', respuesta: true },
      { categoria: 'Historia', texto: 'La antigua biblioteca de Alejandría se quemó por completo en un solo incendio.', respuesta: false },
      { categoria: 'Historia', texto: 'Gutenberg inventó la imprenta de tipos móviles en Europa.', respuesta: true },
      { categoria: 'Historia', texto: 'Los aztecas practicaban sacrificios humanos como parte de su religión.', respuesta: true },
      { categoria: 'Historia', texto: 'Machu Picchu fue construido por los mayas.', respuesta: false },
      { categoria: 'Historia', texto: 'La Segunda Guerra Mundial comenzó con la invasión de Polonia.', respuesta: true },
      { categoria: 'Historia', texto: 'Marco Polo fue el primer europeo en llegar a China.', respuesta: false },
      { categoria: 'Historia', texto: 'La independencia de Chile se declaró formalmente en 1818.', respuesta: true },
      { categoria: 'Historia', texto: 'El Coliseo Romano se usaba para combates de gladiadores.', respuesta: true },
      { categoria: 'Historia', texto: 'Gengis Kan unificó las tribus mongolas.', respuesta: true },
      { categoria: 'Curiosidades', texto: 'La Torre de Pisa se inclina debido a un diseño intencional.', respuesta: false },
      { categoria: 'Historia', texto: 'El Renacimiento comenzó en Italia.', respuesta: true },
      { categoria: 'Historia', texto: 'Los faraones egipcios eran momificados tras su muerte.', respuesta: true },
      { categoria: 'Historia', texto: 'La bandera de Chile fue diseñada durante la colonia española.', respuesta: false },
      { categoria: 'Historia', texto: 'El Imperio Otomano duró más de 600 años.', respuesta: true },
      { categoria: 'Historia', texto: 'La Guerra Fría fue un conflicto armado directo entre EE.UU. y la URSS.', respuesta: false },
      { categoria: 'Historia', texto: 'Los primeros Juegos Olímpicos modernos se celebraron en Atenas.', respuesta: true },
      { categoria: 'Curiosidades', texto: 'El Big Ben es el nombre oficial de la torre completa en Londres.', respuesta: false },
      { categoria: 'Historia', texto: 'La Revolución Rusa ocurrió en 1917.', respuesta: true },
    ]
  },
  ciencia: {
    nombre: 'Ciencia y Tecnología',
    preguntas: [
      { categoria: 'Ciencia', texto: 'El cerebro humano usa solo el 10% de su capacidad.', respuesta: false },
      { categoria: 'Ciencia', texto: 'La luz viaja más rápido que el sonido.', respuesta: true },
      { categoria: 'Ciencia', texto: 'El agua es un compuesto formado por hidrógeno y oxígeno.', respuesta: true },
      { categoria: 'Ciencia', texto: 'Los diamantes están hechos de carbono.', respuesta: true },
      { categoria: 'Tecnología', texto: 'El primer computador ocupaba toda una habitación.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Internet y la World Wide Web son exactamente lo mismo.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El ADN humano es casi idéntico al de los chimpancés (cerca del 99%).', respuesta: true },
      { categoria: 'Ciencia', texto: 'Marte es el planeta más caliente del sistema solar.', respuesta: false },
      { categoria: 'Ciencia', texto: 'Los antibióticos son efectivos contra los virus.', respuesta: false },
      { categoria: 'Ciencia', texto: 'La Tierra tarda exactamente 24 horas en dar una vuelta sobre su eje.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El sistema operativo Android fue creado por Google desde cero.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El primer satélite artificial fue el Sputnik.', respuesta: true },
      { categoria: 'Ciencia', texto: 'Las plantas realizan fotosíntesis para producir su propio alimento.', respuesta: true },
      { categoria: 'Ciencia', texto: 'El sonido puede viajar en el vacío del espacio.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El wifi transmite datos mediante ondas de radio.', respuesta: true },
      { categoria: 'Ciencia', texto: 'El litio es un metal usado en baterías recargables.', respuesta: true },
      { categoria: 'Ciencia', texto: 'La velocidad de la luz es de aproximadamente 300.000 km por segundo.', respuesta: true },
      { categoria: 'Ciencia', texto: 'Los agujeros negros pueden verse directamente con un telescopio óptico normal.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El primer smartphone de la historia fue el iPhone.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El código binario usa solo los números 0 y 1.', respuesta: true },
      { categoria: 'Tecnología', texto: 'ChatGPT fue creado por Google.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El corazón humano tiene cuatro cámaras.', respuesta: true },
      { categoria: 'Ciencia', texto: 'Los volcanes solo existen en la superficie terrestre.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El plástico se degrada completamente en pocos años.', respuesta: false },
      { categoria: 'Ciencia', texto: 'La energía solar es una fuente de energía renovable.', respuesta: true },
      { categoria: 'Tecnología', texto: 'El primer lenguaje de programación fue Python.', respuesta: false },
      { categoria: 'Ciencia', texto: 'Los electrones tienen carga positiva.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El GPS funciona gracias a satélites.', respuesta: true },
      { categoria: 'Ciencia', texto: 'La Luna genera su propia luz.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El grafeno es un material extremadamente resistente hecho de carbono.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Bluetooth y wifi usan exactamente la misma tecnología.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El sistema solar tiene ocho planetas oficialmente reconocidos.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Los virus informáticos pueden dañar el hardware físico de una computadora.', respuesta: false },
      { categoria: 'Ciencia', texto: 'El oxígeno es el elemento más abundante en el universo.', respuesta: false },
      { categoria: 'Ciencia', texto: 'La clonación de animales ya se ha logrado exitosamente.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Un byte equivale a 8 bits.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Las redes 5G son más lentas que las redes 4G.', respuesta: false },
      { categoria: 'Tecnología', texto: 'El telescopio espacial Hubble orbita la Tierra.', respuesta: true },
      { categoria: 'Ciencia', texto: 'La fusión nuclear es el mismo proceso que ocurre en el Sol.', respuesta: true },
      { categoria: 'Tecnología', texto: 'Ya existen robots que realizan cirugías con asistencia humana.', respuesta: true },
    ]
  },
  arte_cultura: {
    nombre: 'Arte y Cultura',
    preguntas: [
      { categoria: 'Pintura', texto: 'La Mona Lisa fue pintada por Leonardo da Vinci.', respuesta: true },
      { categoria: 'Arte', texto: 'Pablo Picasso fue el creador del movimiento cubista.', respuesta: true },
      { categoria: 'Pintura', texto: 'Vincent van Gogh vendió muchas pinturas en vida.', respuesta: false },
      { categoria: 'Danza', texto: 'El ballet clásico se originó en Italia durante el Renacimiento.', respuesta: true },
      { categoria: 'Pintura', texto: 'Frida Kahlo era una pintora mexicana.', respuesta: true },
      { categoria: 'Teatro', texto: '"El Fantasma de la Ópera" está ambientada en un teatro de Londres.', respuesta: false },
      { categoria: 'Pintura', texto: 'Miguel Ángel pintó el techo de la Capilla Sixtina.', respuesta: true },
      { categoria: 'Danza', texto: 'El flamenco es un género musical y de danza originario de España.', respuesta: true },
      { categoria: 'Literatura', texto: 'Gabriel García Márquez ganó el Premio Nobel de Literatura.', respuesta: true },
      { categoria: 'Arte', texto: 'El movimiento surrealista buscaba representar el mundo de los sueños.', respuesta: true },
      { categoria: 'Pintura', texto: 'Salvador Dalí era un pintor surrealista español.', respuesta: true },
      { categoria: 'Danza', texto: 'El tango es un género musical y de baile originario de Argentina y Uruguay.', respuesta: true },
      { categoria: 'Literatura', texto: 'William Shakespeare escribió "Hamlet".', respuesta: true },
      { categoria: 'Pintura', texto: 'La Mona Lisa se exhibe actualmente en el Museo del Louvre.', respuesta: true },
      { categoria: 'Arte', texto: 'El movimiento impresionista se originó en Alemania.', respuesta: false },
      { categoria: 'Música', texto: 'Beethoven compuso nueve sinfonías.', respuesta: true },
      { categoria: 'Teatro', texto: 'El Cirque du Soleil combina circo, teatro y música.', respuesta: true },
      { categoria: 'Literatura', texto: 'Isabel Allende es una escritora chilena.', respuesta: true },
      { categoria: 'Arquitectura', texto: 'La arquitectura gótica se caracteriza por sus arcos apuntados.', respuesta: true },
      { categoria: 'Música', texto: 'El K-pop es un género musical originario de Corea del Sur.', respuesta: true },
      { categoria: 'Escultura', texto: 'Auguste Rodin fue un famoso escultor francés, autor de "El Pensador".', respuesta: true },
      { categoria: 'Música', texto: 'El jazz nació principalmente en Nueva Orleans.', respuesta: true },
      { categoria: 'Literatura', texto: '"Romeo y Julieta" fue escrita por Cervantes.', respuesta: false },
      { categoria: 'Arte', texto: 'El Renacimiento surgió primero en Italia.', respuesta: true },
      { categoria: 'Arte', texto: 'Andy Warhol es conocido como referente del arte pop.', respuesta: true },
      { categoria: 'Danza', texto: 'La danza contemporánea sigue reglas idénticas al ballet clásico.', respuesta: false },
      { categoria: 'Literatura', texto: 'Pablo Neruda era un poeta chileno.', respuesta: true },
      { categoria: 'Arte', texto: 'El Museo del Prado está en Madrid.', respuesta: true },
      { categoria: 'Música', texto: 'La música clásica barroca incluye a compositores como Bach y Vivaldi.', respuesta: true },
      { categoria: 'Arte', texto: 'El grafiti es considerado por algunos una forma de arte urbano.', respuesta: true },
      { categoria: 'Literatura', texto: '"Don Quijote de la Mancha" fue escrita por Miguel de Cervantes.', respuesta: true },
      { categoria: 'Arte', texto: 'El movimiento Art Nouveau se caracteriza por líneas rectas y geométricas.', respuesta: false },
      { categoria: 'Arte', texto: 'La Bienal de Venecia es un evento de arte contemporáneo.', respuesta: true },
      { categoria: 'Pintura', texto: 'Diego Rivera fue un muralista mexicano.', respuesta: true },
      { categoria: 'Teatro', texto: 'El teatro griego antiguo incluía comedias y tragedias.', respuesta: true },
      { categoria: 'Pintura', texto: 'Claude Monet es reconocido por su serie de pinturas de los nenúfares.', respuesta: true },
      { categoria: 'Música', texto: 'El hip hop incluye elementos como el rap, el break dance y el grafiti.', respuesta: true },
      { categoria: 'Escultura', texto: 'La escultura "El David" fue creada por Donatello.', respuesta: false },
      { categoria: 'Teatro', texto: 'El Cirque du Soleil se originó en Canadá.', respuesta: true },
      { categoria: 'Música', texto: 'La música folclórica chilena incluye instrumentos como la guitarra y el charango.', respuesta: true },
    ]
  }
};

const CARTAS_ACCION = {
  ese_pasto: { nombre: 'Ese Pasto Se Ve Más Verde', tipo: 'jugador' },
  siguiendo_ganado: { nombre: 'Siguiendo al Ganado', tipo: 'ninguno' },
  vaca_tecnologica: { nombre: 'Vaca Tecnológica', tipo: 'ninguno' },
  leche_cortada: { nombre: 'Leche Cortada', tipo: 'ninguno' },
  vuelta_carnero: { nombre: 'Vuelta de Carnero', tipo: 'jugador' },
  mala_leche: { nombre: 'Mala Leche', tipo: 'jugador' },
  manos_mantequilla: { nombre: 'Manos de Mantequilla', tipo: 'jugador' },
  vaca_tablero: { nombre: 'La Vaca del Tablero', tipo: 'valor' },
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
const NOMBRES_BOTS = ['Bot Ana', 'Bot Beto', 'Bot Cami', 'Bot Dani'];
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
      carta: ultimaAccion.tipo === 'leche_cortada' ? 'Leche Cortada' : CARTAS_ACCION[ultimaAccion.tipo].nombre,
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

// Ejecuta la lógica de una carta de acción para cualquier jugador (humano o bot).
// Reutilizada tanto por el handler de socket como por la IA de los bots.
function procesarJugarCarta(jugadorId, { cartaId, objetivoId, valorElegido }) {
  const jugador = jugadores[jugadorId];
  if (!jugador) return false;
  const idx = jugador.manoCartas.indexOf(cartaId);
  if (idx === -1) return false;

  // Todas las cartas excepto Leche Cortada requieren que ya haya votado todo el mundo
  if (cartaId !== 'leche_cortada' && !todosRespondieron()) {
    io.to(jugadorId).emit('error_carta', 'Debes esperar a que todos respondan antes de jugar esta carta.');
    return false;
  }

  const gastarCarta = () => {
    jugador.manoCartas.splice(idx, 1);
    descarteAccion.push(cartaId);
  };

  if (cartaId === 'leche_cortada') {
    if (!ultimaAccion) {
      io.to(jugadorId).emit('error_carta', 'No hay ninguna acción reciente para anular.');
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
      io.to(jugadorId).emit('error_carta', 'Ese jugador no tiene cartas.');
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
      cartaId, carta: 'Mala Leche',
      objetivo: objetivo.nombre, objetivoColor: objetivo.color
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'manos_mantequilla' || cartaId === 'vuelta_carnero') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'No hay pregunta activa en este momento.');
      return false;
    }
    const objetivo = jugadores[objetivoId];
    if (!objetivo || preguntaActiva.respuestas[objetivoId] === undefined) {
      io.to(jugadorId).emit('error_carta', 'Ese jugador aún no ha respondido.');
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
      io.to(jugadorId).emit('error_carta', 'No hay pregunta activa en este momento.');
      return false;
    }
    const objetivo = jugadores[objetivoId];
    if (!objetivo || preguntaActiva.respuestas[jugadorId] === undefined || preguntaActiva.respuestas[objetivoId] === undefined) {
      io.to(jugadorId).emit('error_carta', 'Ambos deben haber respondido ya para intercambiar.');
      return false;
    }
    const tmp = preguntaActiva.respuestas[jugadorId];
    preguntaActiva.respuestas[jugadorId] = preguntaActiva.respuestas[objetivoId];
    preguntaActiva.respuestas[objetivoId] = tmp;
    gastarCarta();
    ultimaAccion = { tipo: 'ese_pasto', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, objetivoId };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'Ese Pasto Se Ve Más Verde',
      objetivo: objetivo.nombre, objetivoColor: objetivo.color
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'siguiendo_ganado') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'No hay pregunta activa en este momento.');
      return false;
    }
    const idsQueRespondieron = Object.keys(jugadores).filter(id => preguntaActiva.respuestas[id] !== undefined);
    if (idsQueRespondieron.length < 2) {
      io.to(jugadorId).emit('error_carta', 'Se necesitan al menos 2 jugadores que ya hayan respondido.');
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
      cartaId, carta: 'Siguiendo al Ganado',
      objetivo: 'todos'
    });
    enviarManos();
    emitirEstado();
    return true;
  }

  if (cartaId === 'vaca_tecnologica') {
    if (!preguntaActiva || preguntaActiva.revelada) {
      io.to(jugadorId).emit('error_carta', 'No hay pregunta activa en este momento.');
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
      cartaId, carta: 'Vaca Tecnológica',
      objetivo: 'la pregunta',
      detalle: `Solo ${jugador.nombre} (vaca ${jugador.color}) puede responder la nueva pregunta.`
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
      io.to(jugadorId).emit('error_carta', 'No hay pregunta activa en este momento.');
      return false;
    }
    if (valorElegido !== true && valorElegido !== false) {
      io.to(jugadorId).emit('error_carta', 'Debes elegir Verdadero o Falso.');
      return false;
    }
    const anteriorCorrecta = preguntaActiva.correcta;
    preguntaActiva.correcta = valorElegido;
    gastarCarta();
    ultimaAccion = { tipo: 'vaca_tablero', deId: jugadorId, deNombre: jugador.nombre, deColor: jugador.color, anteriorCorrecta };
    io.emit('carta_jugada', {
      jugador: jugador.nombre, jugadorColor: jugador.color,
      cartaId, carta: 'La Vaca del Tablero',
      objetivo: 'la respuesta correcta',
      detalle: `Ahora la respuesta correcta es ${valorElegido ? 'Verdadero' : 'Falso'}`
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
  if (Math.random() > 0.5) return; // la mitad de las veces el bot decide no jugar nada

  const cartaId = bot.manoCartas[Math.floor(Math.random() * bot.manoCartas.length)];
  const tipo = CARTAS_ACCION[cartaId].tipo;

  if (cartaId === 'leche_cortada') {
    if (!ultimaAccion) return; // solo la juega si hay algo real que anular
    procesarJugarCarta(botId, { cartaId });
    return;
  }

  if (cartaId === 'vaca_tecnologica') {
    const jugado = procesarJugarCarta(botId, { cartaId });
    if (jugado) {
      // el bot necesita volver a responder porque su propia respuesta se borró
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

  // siguiendo_ganado es el único tipo 'ninguno' que queda
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

// Se llama solo cuando ya todos respondieron. Cada bot tiene una oportunidad
// de jugar una carta, con un pequeño retraso escalonado para que se sienta natural.
function intentarJugadasDeBots() {
  Object.keys(jugadores).forEach(id => {
    if (!jugadores[id] || !jugadores[id].esBot) return;
    setTimeout(() => jugadaAleatoriaParaBot(id), 300 + Math.random() * 1800);
  });
}

io.on('connection', (socket) => {
  console.log('Conexión nueva:', socket.id);
  emitirEstado();

  socket.on('unirse', ({ nombre, color }) => {
    if (Object.keys(jugadores).length >= MAX_JUGADORES) {
      socket.emit('error_union', 'La partida ya tiene 5 jugadores.');
      return;
    }
    if (!coloresLibres().includes(color)) {
      socket.emit('error_union', 'Ese color ya fue elegido por otro jugador.');
      return;
    }
    const hayHostActual = Object.values(jugadores).some(j => j.esHost);
    const esPrimerJugador = !hayHostActual;
    jugadores[socket.id] = { nombre, color, esHost: esPrimerJugador, puntaje: 0, manoCartas: [] };
    robarCarta(socket.id);
    console.log(`${nombre} se unió con la vaca ${color}${esPrimerJugador ? ' (HOST)' : ''}`);

    socket.emit('union_exitosa', { nombre, color, esHost: esPrimerJugador });
    enviarManos();
    emitirEstado();
  });

  socket.on('elegir_categoria', (catId) => {
    if (!esHost(socket)) return;
    if (!CATEGORIAS[catId]) return;
    if (preguntaActiva && !preguntaActiva.revelada) {
      socket.emit('error_host', 'No puedes cambiar de categoría mientras hay una pregunta activa.');
      return;
    }
    categoriaActual = catId;
    indicePregunta = -1;
    console.log(`Categoría elegida: ${CATEGORIAS[catId].nombre}`);
    emitirEstado();
  });

  socket.on('lanzar_pregunta', () => {
    if (!esHost(socket) || ganadorDeclarado) return;
    if (!categoriaActual) {
      socket.emit('error_host', 'Elige una categoría antes de lanzar una pregunta.');
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
      socket.emit('error_host', 'La partida ya tiene 5 jugadores.');
      return;
    }
    const libres = coloresLibres();
    if (libres.length === 0) {
      socket.emit('error_host', 'No quedan colores de vaca disponibles.');
      return;
    }
    const color = libres[0];
    const nombresUsados = Object.values(jugadores).map(j => j.nombre);
    const nombreDisponible = NOMBRES_BOTS.find(n => !nombresUsados.includes(n)) || `Bot ${Math.floor(Math.random() * 1000)}`;
    const botId = crearIdBot();
    jugadores[botId] = { nombre: nombreDisponible, color, esHost: false, esBot: true, puntaje: 0, manoCartas: [] };
    robarCarta(botId);
    console.log(`${nombreDisponible} (bot) se unió con la vaca ${color}`);
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
    console.log(`${jugador.nombre} se desconectó`);
    const eraHost = jugador.esHost;
    if (jugador.manoCartas.length) descarteAccion.push(...jugador.manoCartas);
    delete jugadores[socket.id];

    if (eraHost) {
      const idsRestantes = Object.keys(jugadores);
      const idHumano = idsRestantes.find(id => !jugadores[id].esBot);
      if (idHumano) {
        jugadores[idHumano].esHost = true;
        console.log(`${jugadores[idHumano].nombre} es el nuevo host`);
        io.to(idHumano).emit('ahora_eres_host');
      }
    }
    emitirEstado();
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});