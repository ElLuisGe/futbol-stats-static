// ============================================
// GESTIÓN DE DATOS CON LOCALSTORAGE
// ============================================

// Claves para localStorage
const STORAGE_KEYS = {
    EQUIPOS: 'futbol_equipos',
    JUGADORES: 'futbol_jugadores',
    PARTIDOS: 'futbol_partidos',
    EVENTOS: 'futbol_eventos'
};

// Datos iniciales de ejemplo
const DATOS_INICIALES = {
    equipos: [
        { id: 1, nombre: 'Real Madrid', color: '#ffffff', estadio: 'Santiago Bernabéu' },
        { id: 2, nombre: 'Barcelona', color: '#a50044', estadio: 'Camp Nou' }
    ],
    jugadores: [
        { id: 1, nombre: 'Jugador 1', equipo_id: 1, posicion: 'Delantero', numero: 9 },
        { id: 2, nombre: 'Jugador 2', equipo_id: 2, posicion: 'Mediocampista', numero: 10 }
    ],
    partidos: [],
    eventos: []
};

// Inicializar localStorage si está vacío
function inicializarDatos() {
    if (!localStorage.getItem(STORAGE_KEYS.EQUIPOS)) {
        localStorage.setItem(STORAGE_KEYS.EQUIPOS, JSON.stringify(DATOS_INICIALES.equipos));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JUGADORES)) {
        localStorage.setItem(STORAGE_KEYS.JUGADORES, JSON.stringify(DATOS_INICIALES.jugadores));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PARTIDOS)) {
        localStorage.setItem(STORAGE_KEYS.PARTIDOS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTOS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTOS, JSON.stringify([]));
    }
}

// Funciones CRUD genéricas
function obtenerDatos(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function guardarDatos(key, datos) {
    localStorage.setItem(key, JSON.stringify(datos));
}

// Funciones específicas
function obtenerEquipos() {
    return obtenerDatos(STORAGE_KEYS.EQUIPOS);
}

function obtenerJugadores() {
    return obtenerDatos(STORAGE_KEYS.JUGADORES);
}

function obtenerPartidos() {
    return obtenerDatos(STORAGE_KEYS.PARTIDOS);
}

function obtenerEventos() {
    return obtenerDatos(STORAGE_KEYS.EVENTOS);
}

function agregarEquipo(equipo) {
    const equipos = obtenerEquipos();
    equipo.id = Date.now(); // ID único basado en timestamp
    equipos.push(equipo);
    guardarDatos(STORAGE_KEYS.EQUIPOS, equipos);
    return equipo;
}

function eliminarEquipo(id) {
    let equipos = obtenerEquipos();
    equipos = equipos.filter(e => e.id !== id);
    guardarDatos(STORAGE_KEYS.EQUIPOS, equipos);
    
    // Eliminar también los jugadores del equipo
    let jugadores = obtenerJugadores();
    jugadores = jugadores.filter(j => j.equipo_id !== id);
    guardarDatos(STORAGE_KEYS.JUGADORES, jugadores);
}

function agregarJugador(jugador) {
    const jugadores = obtenerJugadores();
    jugador.id = Date.now();
    jugadores.push(jugador);
    guardarDatos(STORAGE_KEYS.JUGADORES, jugadores);
    return jugador;
}

function actualizarJugador(id, datos) {
    let jugadores = obtenerJugadores();
    const index = jugadores.findIndex(j => j.id === id);
    if (index !== -1) {
        jugadores[index] = { ...jugadores[index], ...datos };
        guardarDatos(STORAGE_KEYS.JUGADORES, jugadores);
        return true;
    }
    return false;
}

function eliminarJugador(id) {
    let jugadores = obtenerJugadores();
    jugadores = jugadores.filter(j => j.id !== id);
    guardarDatos(STORAGE_KEYS.JUGADORES, jugadores);
}

function agregarPartido(partido) {
    const partidos = obtenerPartidos();
    partido.id = Date.now();
    partidos.push(partido);
    guardarDatos(STORAGE_KEYS.PARTIDOS, partidos);
    return partido;
}

function agregarEvento(evento) {
    const eventos = obtenerEventos();
    evento.id = Date.now();
    eventos.push(evento);
    guardarDatos(STORAGE_KEYS.EVENTOS, eventos);
    
    // Actualizar estadísticas del jugador
    actualizarEstadisticasJugador(evento);
    return evento;
}

function actualizarEstadisticasJugador(evento) {
    // Esta función se puede expandir para mantener estadísticas agregadas
    console.log('Evento registrado:', evento);
}

// ============================================
// ESTADÍSTICAS
// ============================================

function obtenerTablaPosiciones() {
    const equipos = obtenerEquipos();
    const partidos = obtenerPartidos();
    
    return equipos.map(equipo => {
        const stats = {
            id: equipo.id,
            nombre: equipo.nombre,
            color: equipo.color,
            pj: 0, pg: 0, pe: 0, pp: 0,
            gf: 0, gc: 0, dif: 0, puntos: 0
        };
        
        partidos.forEach(p => {
            if (p.equipo_local_id === equipo.id || p.equipo_visitante_id === equipo.id) {
                stats.pj++;
                
                const golesFavor = p.equipo_local_id === equipo.id ? p.goles_local : p.goles_visitante;
                const golesContra = p.equipo_local_id === equipo.id ? p.goles_visitante : p.goles_local;
                
                stats.gf += golesFavor;
                stats.gc += golesContra;
                
                if (golesFavor > golesContra) {
                    stats.pg++;
                    stats.puntos += 3;
                } else if (golesFavor === golesContra) {
                    stats.pe++;
                    stats.puntos += 1;
                } else {
                    stats.pp++;
                }
            }
        });
        
        stats.dif = stats.gf - stats.gc;
        return stats;
    }).sort((a, b) => {
        if (a.puntos !== b.puntos) return b.puntos - a.puntos;
        if (a.dif !== b.dif) return b.dif - a.dif;
        return b.gf - a.gf;
    });
}

function obtenerGoleadores() {
    const jugadores = obtenerJugadores();
    const eventos = obtenerEventos();
    const equipos = obtenerEquipos();
    
    const golesPorJugador = {};
    eventos.filter(e => e.tipo === 'gol').forEach(e => {
        golesPorJugador[e.jugador_id] = (golesPorJugador[e.jugador_id] || 0) + 1;
    });
    
    return jugadores.map(j => {
        const equipo = equipos.find(e => e.id === j.equipo_id);
        return {
            ...j,
            equipo_nombre: equipo?.nombre,
            equipo_color: equipo?.color,
            goles: golesPorJugador[j.id] || 0
        };
    }).filter(j => j.goles > 0).sort((a, b) => b.goles - a.goles).slice(0, 10);
}

function obtenerAsistentes() {
    const jugadores = obtenerJugadores();
    const eventos = obtenerEventos();
    const equipos = obtenerEquipos();
    
    const asistenciasPorJugador = {};
    eventos.filter(e => e.tipo === 'asistencia').forEach(e => {
        asistenciasPorJugador[e.jugador_id] = (asistenciasPorJugador[e.jugador_id] || 0) + 1;
    });
    
    return jugadores.map(j => {
        const equipo = equipos.find(e => e.id === j.equipo_id);
        return {
            ...j,
            equipo_nombre: equipo?.nombre,
            equipo_color: equipo?.color,
            asistencias: asistenciasPorJugador[j.id] || 0
        };
    }).filter(j => j.asistencias > 0).sort((a, b) => b.asistencias - a.asistencias).slice(0, 10);
}

// ============================================
// EXPORTAR E IMPORTAR
// ============================================

function exportarDatos() {
    const datos = {
        equipos: obtenerEquipos(),
        jugadores: obtenerJugadores(),
        partidos: obtenerPartidos(),
        eventos: obtenerEventos(),
        fecha: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futbol_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importarDatos(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                
                if (datos.equipos) guardarDatos(STORAGE_KEYS.EQUIPOS, datos.equipos);
                if (datos.jugadores) guardarDatos(STORAGE_KEYS.JUGADORES, datos.jugadores);
                if (datos.partidos) guardarDatos(STORAGE_KEYS.PARTIDOS, datos.partidos);
                if (datos.eventos) guardarDatos(STORAGE_KEYS.EVENTOS, datos.eventos);
                
                alert('✅ Datos importados correctamente');
                location.reload();
            } catch (error) {
                alert('❌ Error al importar: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }
}

// ============================================
// CARGA INICIAL
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarDatos();
    
    // Toggle menú móvil
    document.getElementById('menu-toggle')?.addEventListener('click', function() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    });
    
    // Cargar datos en la página actual
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        cargarPaginaPrincipal();
    }
});

function cargarPaginaPrincipal() {
    const equipos = obtenerEquipos();
    const partidos = obtenerPartidos();
    
    // Stats cards
    const statsCards = document.getElementById('stats-cards');
    if (statsCards) {
        statsCards.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div class="flex items-center">
                    <div class="p-3 bg-green-100 rounded-full">
                        <i class="fas fa-futbol text-2xl text-green-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Partidos</p>
                        <p class="text-2xl font-bold text-gray-800">${partidos.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-full">
                        <i class="fas fa-futbol text-2xl text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Goles</p>
                        <p class="text-2xl font-bold text-gray-800">${partidos.reduce((sum, p) => sum + p.goles_local + p.goles_visitante, 0)}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                <div class="flex items-center">
                    <div class="p-3 bg-yellow-100 rounded-full">
                        <i class="fas fa-chart-line text-2xl text-yellow-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Equipos</p>
                        <p class="text-2xl font-bold text-gray-800">${equipos.length}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div class="flex items-center">
                    <div class="p-3 bg-purple-100 rounded-full">
                        <i class="fas fa-users text-2xl text-purple-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500 text-sm">Jugadores</p>
                        <p class="text-2xl font-bold text-gray-800">${obtenerJugadores().length}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Últimos partidos
    const ultimosPartidos = document.getElementById('ultimos-partidos');
    if (ultimosPartidos) {
        const partidosRecientes = partidos.slice(-5).reverse();
        if (partidosRecientes.length > 0) {
            ultimosPartidos.innerHTML = partidosRecientes.map(p => {
                const local = equipos.find(e => e.id === p.equipo_local_id);
                const visitante = equipos.find(e => e.id === p.equipo_visitante_id);
                return `
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span class="font-semibold">${local?.nombre || '?'}</span>
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl font-bold ${p.goles_local > p.goles_visitante ? 'text-green-600' : ''}">${p.goles_local}</span>
                            <span class="text-gray-400">-</span>
                            <span class="text-2xl font-bold ${p.goles_visitante > p.goles_local ? 'text-green-600' : ''}">${p.goles_visitante}</span>
                        </div>
                        <span class="font-semibold">${visitante?.nombre || '?'}</span>
                    </div>
                `;
            }).join('');
        } else {
            ultimosPartidos.innerHTML = '<p class="text-gray-500 text-center py-4">No hay partidos registrados</p>';
        }
    }
    
    // Lista de equipos
    const equiposLista = document.getElementById('equipos-lista');
    if (equiposLista) {
        if (equipos.length > 0) {
            equiposLista.innerHTML = equipos.slice(0, 5).map(e => `
                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div class="w-4 h-4 rounded-full mr-3" style="background-color: ${e.color || '#10b981'}"></div>
                    <span class="flex-1 font-medium">${e.nombre}</span>
                </div>
            `).join('');
        } else {
            equiposLista.innerHTML = '<p class="text-gray-500 text-center py-4">No hay equipos registrados</p>';
        }
    }
}