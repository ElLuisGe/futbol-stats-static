document.addEventListener('DOMContentLoaded', function() {
    cargarPartidos();
    cargarSelectEquipos();
    
    document.getElementById('formPartido')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const partido = {
            equipo_local_id: parseInt(document.getElementById('equipo_local_id').value),
            equipo_visitante_id: parseInt(document.getElementById('equipo_visitante_id').value),
            goles_local: parseInt(document.getElementById('goles_local').value) || 0,
            goles_visitante: parseInt(document.getElementById('goles_visitante').value) || 0,
            fecha: document.getElementById('fecha').value,
            jornada: parseInt(document.getElementById('jornada').value) || 1
        };
        
        if (partido.equipo_local_id === partido.equipo_visitante_id) {
            alert('❌ El equipo local y visitante no pueden ser el mismo');
            return;
        }
        
        agregarPartido(partido);
        alert('✅ Partido registrado correctamente');
        location.reload();
    });
});

function cargarPartidos() {
    const partidos = obtenerPartidos();
    const equipos = obtenerEquipos();
    const container = document.getElementById('partidos-container');
    
    if (!container) return;
    
    if (partidos.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-calendar-alt text-4xl mb-3 text-gray-400"></i>
                <p>No hay partidos registrados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = partidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map(p => {
        const local = equipos.find(e => e.id === p.equipo_local_id);
        const visitante = equipos.find(e => e.id === p.equipo_visitante_id);
        
        return `
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div class="text-sm text-gray-500 mb-3">
                    <i class="far fa-calendar mr-1"></i> ${new Date(p.fecha).toLocaleDateString()} • Jornada ${p.jornada}
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex-1 text-center">
                        <div class="w-12 h-12 rounded-full mx-auto mb-2" style="background-color: ${local?.color || '#10b981'}20">
                            <div class="w-full h-full rounded-full flex items-center justify-center font-bold" style="color: ${local?.color || '#10b981'}">
                                ${local?.nombre?.charAt(0) || '?'}
                            </div>
                        </div>
                        <p class="font-semibold text-gray-800">${local?.nombre || '?'}</p>
                    </div>
                    
                    <div class="flex items-center space-x-4 px-4">
                        <span class="text-3xl sm:text-4xl font-bold ${p.goles_local > p.goles_visitante ? 'text-green-600' : ''}">${p.goles_local}</span>
                        <span class="text-2xl text-gray-400">-</span>
                        <span class="text-3xl sm:text-4xl font-bold ${p.goles_visitante > p.goles_local ? 'text-green-600' : ''}">${p.goles_visitante}</span>
                    </div>
                    
                    <div class="flex-1 text-center">
                        <div class="w-12 h-12 rounded-full mx-auto mb-2" style="background-color: ${visitante?.color || '#10b981'}20">
                            <div class="w-full h-full rounded-full flex items-center justify-center font-bold" style="color: ${visitante?.color || '#10b981'}">
                                ${visitante?.nombre?.charAt(0) || '?'}
                            </div>
                        </div>
                        <p class="font-semibold text-gray-800">${visitante?.nombre || '?'}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function cargarSelectEquipos() {
    const selects = ['equipo_local_id', 'equipo_visitante_id'];
    const equipos = obtenerEquipos();
    
    selects.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        
        select.innerHTML = '<option value="">Seleccionar equipo</option>' +
            equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    });
}

function abrirModal() {
    document.getElementById('modalPartido').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalPartido').style.display = 'none';
}