// Configuración de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1LYlm8HRhW1MPCxsgrQtiFO5rvS0v2_s",
  authDomain: "app-ecografia.firebaseapp.com",
  databaseURL: "https://app-ecografia-default-rtdb.firebaseio.com",
  projectId: "app-ecografia",
  storageBucket: "app-ecografia.appspot.com",
  messagingSenderId: "241799347066",
  appId: "1:241799347066:web:b10b3c963ec9c88f1d34c3",
  measurementId: "G-ZB2XS0DFC8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const pacientesRef = ref(db, "pacientes");

// Agregar paciente
document.getElementById("pacienteForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const sede = document.getElementById("sede").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const nombres = document.getElementById("nombres").value.trim();
  const estudio = document.getElementById("estudio").value;

  if (!sede || !apellidos || !nombres || !estudio) return;

  const nuevoPaciente = {
    sede,
    apellidos,
    nombres,
    estudio,
    estado: "En espera",
    fecha: new Date().toLocaleDateString("es-PE")
  };

  push(pacientesRef, nuevoPaciente);
  document.getElementById("pacienteForm").reset();
});

// Mostrar lista de pacientes
onValue(pacientesRef, (snapshot) => {
  const lista = document.getElementById("listaPacientes");
  lista.innerHTML = "";

  let contadorEspera = 0;

  const pacientes = [];
  snapshot.forEach(child => {
    pacientes.push({ id: child.key, ...child.val() });
  });

  pacientes.reverse(); // Mostrar los últimos primero

  pacientes.forEach(p => {
    if (p.estado === "En espera") contadorEspera++;

    const estadoClass = {
      "Programado": "estado-programado",
      "En espera": "estado-espera",
      "En atención": "estado-en-atencion",
      "Atendido": "estado-atendido"
    }[p.estado] || "";

    const div = document.createElement("div");
    div.className = `card p-3 ${estadoClass}`;
    div.innerHTML = `
      <h5>${p.nombres} ${p.apellidos}</h5>
      <p><strong>Sede:</strong> ${p.sede} | <strong>Estudio:</strong> ${p.estudio} | <strong>Fecha:</strong> ${p.fecha}</p>
      <p><strong>Estado:</strong> ${p.estado}</p>
    `;
    lista.appendChild(div);
  });

  document.getElementById("contadorEspera").textContent = contadorEspera;
});
