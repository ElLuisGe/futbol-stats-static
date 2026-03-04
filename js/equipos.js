document.addEventListener('DOMContentLoaded', function() {
    cargarEquipos();
    
    document.getElementById('formEquipo')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const equipo = {
            nombre: document.getElementById('nombre').value,
            color: document.getElementById('color').value,
            estadio: document.getElementById('estadio').value
        };
        
        agregarEquipo(equipo);
        alert('✅ Equipo agregado correctamente');
        location.reload();
    });
});

function cargarEquipos() {
    const equipos = obtenerEquipos();
    const container = document.getElementById('equipos-container');
    
    if (!container) return;
    
    if (equipos.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500">
                <i class="fas fa-shield-alt text-4xl mb-3 text-gray-400"></i>
                <p>No hay equipos registrados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = equipos.map(equipo => `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="h-2" style="background-color: ${equipo.color || '#10b981'}"></div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-800">${equipo.nombre}</h3>
                    <button onclick="eliminarEquipo(${equipo.id})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="text-gray-600">
                    <i class="fas fa-map-marker-alt mr-2"></i> ${equipo.estadio || 'Sin estadio'}
                </p>
            </div>
        </div>
    `).join('');
}

function eliminarEquipo(id) {
    if (confirm('¿Estás seguro de eliminar este equipo?')) {
        eliminarEquipo(id);
        alert('✅ Equipo eliminado');
        location.reload();
    }
}

function abrirModal() {
    document.getElementById('modalEquipo').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalEquipo').style.display = 'none';
}