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
