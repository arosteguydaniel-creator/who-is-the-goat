const { io } = require('socket.io-client');

const URL = 'http://localhost:3000';
const NUM_BOTS = 5;
const RONDAS_MAXIMAS = 30;

const nombresBots = ['BotAna', 'BotBoris', 'BotCarla', 'BotDiego', 'BotElena'];
const colores = ['Roja', 'Azul', 'Verde', 'Amarilla', 'Morada'];

const stats = {
  preguntasLanzadas: 0,
  respuestasCorrectas: 0,
  respuestasIncorrectas: 0,
  cartasJugadas: {},
  errores: []
};

let ganadorYaDetectado = false;
let yaFinalizado = false;

function crearBot(nombre, color, esHost) {
  const socket = io(URL);
  const estado = { nombre, color, socket, miId: null, esHost, mano: [], respondioActual: false };

  socket.on('connect', () => {
    estado.miId = socket.id;
    socket.emit('unirse', { nombre, color });
  });

  socket.on('error_union', (msg) => {
    stats.errores.push(`[${nombre}] error_union: ${msg}`);
  });

  socket.on('error_carta', (msg) => {
    stats.errores.push(`[${nombre}] error_carta: ${msg}`);
  });

  socket.on('union_exitosa', (data) => {
    // El servidor puede decidir quién es host; actualizamos el estado
    if (data && data.esHost) estado.esHost = true;
  });

  socket.on('ahora_eres_host', () => {
    estado.esHost = true;
  });

  socket.on('tu_mano', (mano) => {
    estado.mano = mano;
  });

  socket.on('estado_jugadores', ({ ganador }) => {
    if (ganador && !ganadorYaDetectado) {
      ganadorYaDetectado = true;
      console.log(`\n🏆 Ganador detectado: ${ganador.nombre} (${ganador.color}) con ${ganador.puntaje} puntos`);
      setTimeout(finalizar, 1000);
    }
  });

  socket.on('pregunta_lanzada', () => {
    estado.respondioActual = false;
    stats.preguntasLanzadas++;
    console.log(`[${nombre}] recibió evento pregunta_lanzada (eventos locales: ${stats.preguntasLanzadas})`);
    setTimeout(() => {
      const respuesta = Math.random() < 0.5;
      socket.emit('responder', { respuesta });
      console.log(`[${nombre}] responde: ${respuesta}`);
      estado.respondioActual = true;

      if (estado.mano.length > 0 && Math.random() < 0.4) {
        const cartaId = estado.mano[Math.floor(Math.random() * estado.mano.length)];
        stats.cartasJugadas[cartaId] = (stats.cartasJugadas[cartaId] || 0) + 1;
        setTimeout(() => jugarCartaAlAzar(estado, cartaId), 300);
      }
    }, 200 + Math.random() * 800);
  });

  socket.on('resultado_revelado', ({ resultados }) => {
    resultados.forEach(r => {
      if (r.nombre === nombre) {
        if (r.correcto) stats.respuestasCorrectas++;
        else stats.respuestasIncorrectas++;
      }
    });
    console.log(`[${nombre}] recibió resultado_revelado`);
  });

  return estado;
}

function jugarCartaAlAzar(estado, cartaId) {
  const necesitaObjetivo = ['ese_pasto', 'vuelta_carnero', 'mala_leche', 'manos_mantequilla'].includes(cartaId);
  const necesitaValor = cartaId === 'vaca_tablero';

  if (necesitaObjetivo) {
    const otrosBots = bots.filter(b => b.miId && b.miId !== estado.miId);
    if (otrosBots.length === 0) return;
    const objetivo = otrosBots[Math.floor(Math.random() * otrosBots.length)];
    estado.socket.emit('jugar_carta', { cartaId, objetivoId: objetivo.miId });
  } else if (necesitaValor) {
    estado.socket.emit('jugar_carta', { cartaId, valorElegido: Math.random() < 0.5 });
  } else {
    estado.socket.emit('jugar_carta', { cartaId });
  }
}

const bots = [];
for (let i = 0; i < NUM_BOTS; i++) {
  bots.push(crearBot(nombresBots[i], colores[i], i === 0));
}

let rondasJugadas = 0;
function cicloHost() {
  if (ganadorYaDetectado || yaFinalizado) return;

  // Buscar el bot que el servidor considera host y que esté conectado
  const host = bots.find(b => b.esHost && b.miId);
  if (!host) {
    setTimeout(cicloHost, 300);
    return;
  }
  if (rondasJugadas >= RONDAS_MAXIMAS) {
    finalizar();
    return;
  }
  rondasJugadas++;
  console.log(`[Simulador] host encontrado: ${host.nombre} (${host.color}) - lanzando pregunta Ronda ${rondasJugadas}`);
  host.socket.emit('lanzar_pregunta');

  setTimeout(() => {
    if (ganadorYaDetectado || yaFinalizado) return;
    host.socket.emit('revelar');
    setTimeout(cicloHost, 800);
  }, 2000);
}

setTimeout(cicloHost, 1500);

function finalizar() {
  if (yaFinalizado) return;
  yaFinalizado = true;

  console.log('\n========== REPORTE DE SIMULACIÓN ==========');
  console.log(`Rondas jugadas: ${rondasJugadas}`);
  console.log(`Preguntas lanzadas (eventos): ${stats.preguntasLanzadas}`);
  console.log(`Respuestas correctas totales: ${stats.respuestasCorrectas}`);
  console.log(`Respuestas incorrectas totales: ${stats.respuestasIncorrectas}`);
  console.log('Cartas jugadas por tipo:', stats.cartasJugadas);
  console.log(`Errores detectados: ${stats.errores.length}`);
  stats.errores.forEach(e => console.log('  - ' + e));
  console.log('=============================================\n');
  process.exit(0);
}

setTimeout(finalizar, 90000);