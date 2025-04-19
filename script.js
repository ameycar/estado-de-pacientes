// Tu configuración personalizada de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const pacientesRef = db.ref("pacientes");

// Agregar paciente
document.getElementById("form-paciente").addEventListener("submit", function (e) {
  e.preventDefault();

  const sede = document.getElementById("sede").value;
  const apellidos = document.getElementById("apellidos").value.trim();
  const nombres = document.getElementById("nombres").value.trim();
  const estudio = document.getElementById("estudio").value;
  const fecha = new Date().toLocaleString();

  if (sede && apellidos && nombres && estudio) {
    const nuevoPaciente = {
      sede,
      apellidos,
      nombres,
      estudio,
      estado: "En espera",
      fecha
    };

    pacientesRef.push(nuevoPaciente);

    // Limpiar formulario
    this.reset();
  }
});

// Mostrar lista en tiempo real
pacientesRef.on("value", (snapshot) => {
  const tabla = document.getElementById("tabla-pacientes");
  tabla.innerHTML = "";
  let contadorEspera = 0;

  const data = [];
  snapshot.forEach((child) => {
    data.push({ key: child.key, ...child.val() });
  });

  // Ordenar: primero los "En espera"
  data.sort((a, b) => {
    const orden = ["En espera", "Programado", "En atención", "Atendido"];
    return orden.indexOf(a.estado) - orden.indexOf(b.estado);
  });

  data.reverse(); // Mostrar el más reciente primero

  data.forEach((paciente) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>
        ${getBotonEstado(paciente.estado)}
      </td>
      <td>${paciente.apellidos}</td>
      <td>${paciente.nombres}</td>
      <td>${paciente.estudio}</td>
      <td>${paciente.sede}</td>
      <td>${paciente.fecha}</td>
      <td>
        <select onchange="confirmarCambio('${paciente.key}', this.value)">
          <option value="" disabled selected>Cambiar estado</option>
          <option value="Programado">Programado</option>
          <option value="En espera">En espera</option>
          <option value="En atención">En atención</option>
          <option value="Atendido">Atendido</option>
        </select>
      </td>
    `;

    tabla.appendChild(fila);

    if (paciente.estado === "En espera") contadorEspera++;
  });

  document.getElementById("contador-espera").textContent = contadorEspera;
});

// Botón de color según estado
function getBotonEstado(estado) {
  let color = "";
  switch (estado) {
    case "Programado":
      color = "primary";
      break;
    case "En espera":
      color = "danger";
      break;
    case "En atención":
      color = "warning";
      break;
    case "Atendido":
      color = "success";
      break;
  }
  return `<button class="btn btn-sm btn-${color}" disabled>${estado}</button>`;
}

// Confirmar cambio de estado
function confirmarCambio(id, nuevoEstado) {
  const fila = document.getElementById(`fila-${id}`);
  const nombre = fila ? fila.querySelector("td:nth-child(3)").textContent : "¿Seguro?";

  if (confirm(`¿Deseas cambiar el estado de atención del paciente ${nombre}?`)) {
    pacientesRef.child(id).update({ estado: nuevoEstado });
  }
}
