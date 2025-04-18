// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA1LYlm8HRhW1MPCxsgrQtiFO5rvS0v2_s",
    authDomain: "app-ecografia.firebaseapp.com",
    databaseURL: "https://app-ecografia-default-rtdb.firebaseio.com",
    projectId: "app-ecografia",
    storageBucket: "app-ecografia.firebasestorage.app",
    messagingSenderId: "241799347066",
    appId: "1:241799347066:web:b10b3c963ec9c88f1d34c3",
    measurementId: "G-ZB2XS0DFC8"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referencias a elementos del formulario y la lista
const sedeInput = document.getElementById("sede");
const apellidoInput = document.getElementById("apellido");
const nombreInput = document.getElementById("nombre");
const estudioInput = document.getElementById("estudio");
const pacientesList = document.getElementById("pacientes");
const form = document.getElementById("form-paciente");

// Función para mostrar la lista de pacientes en tiempo real
function mostrarPacientes() {
    const pacientesRef = db.ref('pacientes');
    pacientesRef.on('value', function (snapshot) {
        pacientesList.innerHTML = ''; // Limpiar la lista actual

        snapshot.forEach(function (childSnapshot) {
            const paciente = childSnapshot.val();
            const li = document.createElement('li');
            li.textContent = `${paciente.apellido}, ${paciente.nombre} - ${paciente.estudio} (${paciente.sede}) - Estado: ${paciente.estado}`;
            
            // Botón para actualizar estado
            const button = document.createElement('button');
            button.textContent = 'Cambiar Estado';
            button.onclick = function() {
                actualizarEstado(childSnapshot.key, paciente.estado);
            };

            li.appendChild(button);
            pacientesList.appendChild(li);
        });
    });
}

// Función para actualizar el estado de un paciente
function actualizarEstado(id, estadoActual) {
    const pacientesRef = db.ref('pacientes/' + id);
    const nuevoEstado = estadoActual === 'Programado' ? 'En espera' :
                        estadoActual === 'En espera' ? 'En atención' : 'Atendido';

    // Actualizar el estado en Firebase
    pacientesRef.update({ estado: nuevoEstado });
}

// Agregar un paciente a Firebase
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const paciente = {
        sede: sedeInput.value,
        apellido: apellidoInput.value,
        nombre: nombreInput.value,
        estudio: estudioInput.value,
