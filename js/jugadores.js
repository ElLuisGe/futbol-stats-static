document.addEventListener('DOMContentLoaded', function() {
    cargarJugadores();
    cargarSelectEquipos();
    
    document.getElementById('formJugador')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jugador = {
            nombre: document.getElementById('nombre').value,
            equipo_id: parseInt(document.getElementById('equipo_id').value),
            posicion: document.getElementById('posicion').value,
            numero: parseInt(document.getElementById('numero').value) || 0
        };
        
        const id = document.getElementById('jugador_id').value;
        
        if (id) {
            actualizarJugador(parseInt(id), jugador);
            alert('✅ Jugador actualizado');
        } else {
            agregarJugador(jugador);
            alert('✅ Jugador agregado');
        }
        
        location.reload();
    });
    
    document.getElementById('formEvento')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const evento = {
            jugador_id: parseInt(document.getElementById('evento_jugador_id').value),
            partido_id: parseInt(document.getElementById('evento_partido_id').value),
            tipo: document.getElementById('evento_tipo').value,
            minuto: parseInt(document.getElementById('evento_minuto').value) || 0
        };
        
        agregarEvento(evento);
        alert('✅ Evento registrado');
        location.reload();
    });
});

function cargarJugadores() {
    const jugadores = obtenerJugadores();
    const equipos = obtenerEquipos();
    const eventos = obtenerEventos();
    const container = document.getElementById('jugadores-container');
    
    if (!container) return;
    
    // Calcular estadísticas
    const stats = {};
    eventos.forEach(e => {
        if (!stats[e.jugador_id]) {
            stats[e.jugador_id] = { goles: 0, asistencias: 0, amarillas: 0, rojas: 0 };
        }
        if (e.tipo === 'gol') stats[e.jugador_id].goles++;
        if (e.tipo === 'asistencia') stats[e.jugador_id].asistencias++;
        if (e.tipo === 'amarilla') stats[e.jugador_id].amarillas++;
        if (e.tipo === 'roja') stats[e.jugador_id].rojas++;
    });
    
    if (jugadores.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-users text-4xl mb-3 text-gray-400"></i>
                <p>No hay jugadores registrados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jugadores.map(j => {
        const equipo = equipos.find(e => e.id === j.equipo_id);
        const jugadorStats = stats[j.id] || { goles: 0, asistencias: 0, amarillas: 0, rojas: 0 };
        
        return `
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mr-3">
                            ${j.nombre.charAt(0)}
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${j.nombre}</h3>
                            <p class="text-sm text-gray-600">${j.posicion || 'Sin posición'} • #${j.numero || '?'}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="editarJugador(${j.id})" class="text-blue-500 hover:text-blue-700">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="eliminarJugador(${j.id})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mb-4">
                    <span class="px-3 py-1 rounded-full text-sm" 
                          style="background-color: ${equipo?.color || '#10b981'}20; color: ${equipo?.color || '#10b981'}">
                        <span class="w-2 h-2 rounded-full inline-block mr-1" style="background-color: ${equipo?.color || '#10b981'}"></span>
                        ${equipo?.nombre || 'Sin equipo'}
                    </span>
                </div>
                
                <div class="grid grid-cols-4 gap-2 text-center mb-4">
                    <div class="bg-green-50 p-2 rounded">
                        <p class="text-xs text-gray-500">Goles</p>
                        <p class="text-lg font-bold text-green-600">${jugadorStats.goles}</p>
                    </div>
                    <div class="bg-blue-50 p-2 rounded">
                        <p class="text-xs text-gray-500">Asist</p>
                        <p class="text-lg font-bold text-blue-600">${jugadorStats.asistencias}</p>
                    </div>
                    <div class="bg-yellow-50 p-2 rounded">
                        <p class="text-xs text-gray-500">TA</p>
                        <p class="text-lg font-bold text-yellow-600">${jugadorStats.amarillas}</p>
                    </div>
                    <div class="bg-red-50 p-2 rounded">
                        <p class="text-xs text-gray-500">TR</p>
                        <p class="text-lg font-bold text-red-600">${jugadorStats.rojas}</p>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                    <button onclick="abrirModalEvento(${j.id}, 'gol')" class="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-futbol mr-1"></i> Gol
                    </button>
                    <button onclick="abrirModalEvento(${j.id}, 'asistencia')" class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-hands-helping mr-1"></i> Asist
                    </button>
                    <button onclick="abrirModalEvento(${j.id}, 'amarilla')" class="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-square mr-1"></i> TA
                    </button>
                    <button onclick="abrirModalEvento(${j.id}, 'roja')" class="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                        <i class="fas fa-square mr-1"></i> TR
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function cargarSelectEquipos() {
    const select = document.getElementById('equipo_id');
    if (!select) return;
    
    const equipos = obtenerEquipos();
    select.innerHTML = '<option value="">Seleccionar equipo</option>' +
        equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
}

function abrirModal(modo, jugadorId = null) {
    if (modo === 'editar' && jugadorId) {
        const jugadores = obtenerJugadores();
        const jugador = jugadores.find(j => j.id === jugadorId);
        
        if (jugador) {
            document.getElementById('jugador_id').value = jugador.id;
            document.getElementById('nombre').value = jugador.nombre;
            document.getElementById('equipo_id').value = jugador.equipo_id;
            document.getElementById('posicion').value = jugador.posicion || '';
            document.getElementById('numero').value = jugador.numero || '';
        }
    } else {
        document.getElementById('formJugador').reset();
        document.getElementById('jugador_id').value = '';
    }
    
    document.getElementById('modalJugador').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalJugador').style.display = 'none';
}

function abrirModalEvento(jugadorId, tipo) {
    document.getElementById('evento_jugador_id').value = jugadorId;
    document.getElementById('evento_tipo').value = tipo;
    
    // Cargar partidos en el select
    const select = document.getElementById('evento_partido_id');
    const partidos = obtenerPartidos();
    const equipos = obtenerEquipos();
    
    select.innerHTML = '<option value="">Seleccionar partido</option>' +
        partidos.map(p => {
            const local = equipos.find(e => e.id === p.equipo_local_id);
            const visitante = equipos.find(e => e.id === p.equipo_visitante_id);
            return `<option value="${p.id}">${local?.nombre} vs ${visitante?.nombre}</option>`;
        }).join('');
    
    document.getElementById('modalEvento').style.display = 'flex';
}

function cerrarModalEvento() {
    document.getElementById('modalEvento').style.display = 'none';
}

function eliminarJugador(id) {
    if (confirm('¿Estás seguro de eliminar este jugador?')) {
        eliminarJugador(id);
        alert('✅ Jugador eliminado');
        location.reload();
    }
}

function editarJugador(id) {
    abrirModal('editar', id);
}