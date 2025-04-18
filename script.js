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

// Inicialización de Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const patientsRef = db.ref("patients");

// Referencias a elementos del DOM
const patientsList = document.getElementById('patientsList');
const addPatientForm = document.getElementById('addPatientForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const studyInput = document.getElementById('study');
const dateFilterInput = document.getElementById('dateFilter');
const countEnEspera = document.getElementById('countEnEspera');

// Agregar paciente a la base de datos
addPatientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const study = studyInput.value;

    const newPatient = {
        firstName: firstName,
        lastName: lastName,
        study: study,
        status: "En espera",
        date: new Date().toISOString().split("T")[0]
    };

    patientsRef.push(newPatient);

    // Limpiar formulario
    firstNameInput.value = '';
    lastNameInput.value = '';
    studyInput.value = 'Ecografía';
});

// Escuchar cambios en la base de datos y actualizar la lista de pacientes
patientsRef.on('child_added', (data) => {
    const patient = data.val();
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${patient.firstName}</td>
        <td>${patient.lastName}</td>
        <td id="status_${data.key}">${patient.status}</td>
        <td>${patient.study}</td>
        <td>${patient.date}</td>
        <td><button onclick="changeStatus('${data.key}', '${patient.status}')">Cambiar Estado</button></td>
    `;
    patientsList.appendChild(tr);

    // Actualizar contador de pacientes en espera
    if (patient.status === "En espera") {
        updateCountEnEspera();
    }
});

// Cambiar el estado del paciente
function changeStatus(patientId, currentStatus) {
    const statusRef = db.ref("patients/" + patientId + "/status");

    let newStatus = '';
    if (currentStatus === 'En espera') {
        newStatus = 'En atención';
    } else if (currentStatus === 'En atención') {
        newStatus = 'Atendido';
    } else if (currentStatus === 'Atendido') {
        newStatus = 'Programado';
    } else {
        newStatus = 'En espera';
    }

    if (confirm(`¿Deseas cambiar el estado del paciente a ${newStatus}?`)) {
        statusRef.set(newStatus);
    }
}

// Filtrar pacientes por fecha
dateFilterInput.addEventListener('input', (e) => {
    const filterDate = e.target.value;
    patientsList.innerHTML = '';

    patientsRef.orderByChild("date").equalTo(filterDate).on('child_added', (data) => {
        const patient = data.val();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${patient.firstName}</td>
            <td>${patient.lastName}</td>
            <td>${patient.status}</td>
            <td>${patient.study}</td>
            <td>${patient.date}</td>
            <td><button onclick="changeStatus('${data.key}', '${patient.status}')">Cambiar Estado</button></td>
        `;
        patientsList.appendChild(tr);
    });
});

// Actualizar contador de pacientes en espera
function updateCountEnEspera() {
    let count = 0;
    patientsRef.once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().status === "En espera") {
                count++;
            }
        });
        countEnEspera.textContent = count;
    });
}

// Cargar el contador de pacientes en espera al iniciar
updateCountEnEspera();
