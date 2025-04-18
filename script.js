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

// Referencia al formulario
const form = document.getElementById('form-paciente');
const sedeInput = document.getElementById('sede');
const apellidoInput = document.getElementById('apellido');
const nombreInput = document.getElementById('nombre');
const estudioInput = document.getElementById('estudio');
const pacientesList = document.getElementById('pacientes');

// Función para agregar un paciente
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const paciente = {
    sede: sedeInput.value,
    apellido: apellidoInput.value,
    nombre: nombreInput.value,
    estudio: estudioInput.value,
    estado: 'Programado' // Estado inicial
  };

  // Guardar en Firebase
  const pacientesRef = db.ref('pacientes');
  pacientesRef.push(paciente);

  // Limpiar el formulario
  sedeInput.value = '';
  apellidoInput.value = '';
  nombreInput.value = '';
  estudioInput.value = '';
});

// Función para mostrar pacientes
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

// Función para cambiar el estado
function actualizarEstado(id, estadoActual) {
  const pacientesRef = db.ref('pacientes/' + id);
  const nuevoEstado = estadoActual === 'Programado' ? 'En espera' :
                      estadoActual === 'En espera' ? 'En atención' : 'Atendido';

  pacientesRef.update({ estado: nuevoEstado });
}

// Llamar a la función de mostrar pacientes
mostrarPacientes();
