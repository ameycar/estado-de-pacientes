// Configuración Firebase
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById("formPaciente");
const lista = document.getElementById("listaPacientes");
const contadorEspera = document.getElementById("contadorEspera");

document.getElementById("fechaActual").innerText = new Date().toLocaleDateString();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const sede = form.sede.value.trim();
  const apellidos = form.apellidos.value.trim();
  const nombres = form.nombres.value.trim();
  const estudio = form.estudio.value;

  if (sede && apellidos && nombres && estudio) {
    const nuevoPaciente = {
      sede,
      apellidos,
      nombres,
      estudio,
      estado: "en_espera",
      fecha: new Date().toISOString()
    };

    db.ref("pacientes").push(nuevoPaciente, (error) => {
      if (!error) form.reset();
    });
  }
});

function mostrarPacientes() {
  db.ref("pacientes").on("value", (snapshot) => {
    lista.innerHTML = "";
    let enEspera = 0;
    const data = snapshot.val();
    if (data) {
      const pacientesArray = Object.entries(data).reverse();
      pacientesArray.forEach(([id, paciente]) => {
        if (paciente.estado === "en_espera") enEspera++;
        const card = document.createElement("div");
        const estadoClase = `estado-${paciente.estado}`;
        card.className = `card ${estadoClase}`;
        card.innerHTML = `
          <div class="card-body">
            <h6 class="card-title mb-1">${paciente.nombres} ${paciente.apellidos}</h6>
            <p class="card-text mb-1"><strong>Sede:</strong> ${paciente.sede}</p>
            <p class="card-text mb-1"><strong>Estudio:</strong> ${paciente.estudio}</p>
            <p class="card-text"><strong>Estado:</strong> ${paciente.estado.replace("_", " ")}</p>
          </div>
        `;
        lista.appendChild(card);
      });
    }
    contadorEspera.textContent = enEspera;
  });
}

mostrarPacientes();
