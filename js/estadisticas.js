document.addEventListener('DOMContentLoaded', function() {
    cargarTablaPosiciones();
    cargarGoleadores();
    cargarAsistentes();
});

function cargarTablaPosiciones() {
    const tabla = obtenerTablaPosiciones();
    const container = document.getElementById('tabla-posiciones');
    
    if (!container) return;
    
    if (tabla.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="10" class="px-4 py-8 text-center text-gray-500">
                    No hay datos disponibles
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = tabla.map((equipo, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-4 whitespace-nowrap">
                <span class="${index < 4 ? 'text-green-600 font-bold' : ''}">${index + 1}</span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full mr-2" style="background-color: ${equipo.color || '#10b981'}"></div>
                    <span class="font-medium">${equipo.nombre}</span>
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-center">${equipo.pj}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center text-green-600">${equipo.pg}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center text-yellow-600">${equipo.pe}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center text-red-600">${equipo.pp}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center">${equipo.gf}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center">${equipo.gc}</td>
            <td class="px-4 py-4 whitespace-nowrap text-center ${equipo.dif > 0 ? 'text-green-600' : equipo.dif < 0 ? 'text-red-600' : ''}">
                ${equipo.dif}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-center font-bold text-lg">${equipo.puntos}</td>
        </tr>
    `).join('');
}

function cargarGoleadores() {
    const goleadores = obtenerGoleadores();
    const container = document.getElementById('goleadores-container');
    
    if (!container) return;
    
    if (goleadores.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                    No hay goleadores registrados
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = goleadores.map((jugador, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="${index < 3 ? 'text-yellow-500 font-bold' : ''}">${index + 1}</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap font-medium">${jugador.nombre}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 text-sm rounded-full" 
                      style="background-color: ${jugador.equipo_color || '#10b981'}20; color: ${jugador.equipo_color || '#10b981'}">
                    ${jugador.equipo_nombre || 'Sin equipo'}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-green-600">${jugador.goles}</td>
            <td class="px-4 py-3 whitespace-nowrap text-center">${jugador.partidos || 0}</td>
            <td class="px-4 py-3 whitespace-nowrap text-center">
                ${(jugador.goles / (jugador.partidos || 1)).toFixed(2)}
            </td>
        </tr>
    `).join('');
}

function cargarAsistentes() {
    const asistentes = obtenerAsistentes();
    const container = document.getElementById('asistentes-container');
    
    if (!container) return;
    
    if (asistentes.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                    No hay asistentes registrados
                </td>
            </tr>
        `;
        return;
    }
    
    container.innerHTML = asistentes.map((jugador, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="${index < 3 ? 'text-yellow-500 font-bold' : ''}">${index + 1}</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap font-medium">${jugador.nombre}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 text-sm rounded-full" 
                      style="background-color: ${jugador.equipo_color || '#10b981'}20; color: ${jugador.equipo_color || '#10b981'}">
                    ${jugador.equipo_nombre || 'Sin equipo'}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-center font-bold text-lg text-blue-600">${jugador.asistencias}</td>
        </tr>
    `).join('');
}