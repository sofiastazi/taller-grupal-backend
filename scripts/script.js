document.addEventListener('DOMContentLoaded', ()=> {
const API_URL = "https://672ca6711600dda5a9f95312.mockapi.io/users";

// Referencias a los botones y elementos HTML
const btnGet1 = document.getElementById("btnGet1");
const btnPost = document.getElementById("btnPost");
const btnPut = document.getElementById("btnPut");
const btnDelete = document.getElementById("btnDelete");
const btnSendChanges = document.getElementById("btnSendChanges");
const resultsList = document.getElementById("results");

// Configuración de eventos de clic al cargar la página
window.onload = () => {
    btnGet1.addEventListener("click", buscarUsuario);
    btnPost.addEventListener("click", agregarUsuario);
    btnPut.addEventListener("click", abrirModalModificar);
    btnDelete.addEventListener("click", borrarUsuario);
    btnSendChanges.addEventListener("click", modificarUsuario);

    // Validaciones para habilitar/deshabilitar botones
    document.getElementById("inputPostNombre").addEventListener("input", validarCamposPost);
    document.getElementById("inputPostApellido").addEventListener("input", validarCamposPost);
    document.getElementById("inputPutId").addEventListener("input", validarCamposPut);
    document.getElementById("inputDelete").addEventListener("input", validarCamposDelete);
};

// Función para buscar usuario(s) (GET)
async function buscarUsuario() {
    const id = document.getElementById("inputGet1Id").value;
    const url = id ? `${API_URL}/${id}` : API_URL; // Si hay ID, busca ese registro; si no, busca todos
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("No se encontró el registro solicitado.");
        const data = await response.json();
        mostrarResultados(data); // Muestra los resultados en la interfaz
    } catch (error) {
        mostrarError(error.message); // Muestra mensaje de error si falla
    }
}

// Función para agregar un usuario (POST)
async function agregarUsuario() {
    const name = document.getElementById("inputPostNombre").value;
    const lastname = document.getElementById("inputPostApellido").value;
    if (!name || !lastname) return; // Verifica que ambos campos estén llenos

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lastname }) // Envía el nombre y apellido en el cuerpo de la solicitud
        });
        if (!response.ok) throw new Error("Error al agregar el usuario.");
        buscarUsuario(); // Actualiza la lista para incluir el nuevo registro
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para abrir el modal de modificación (GET para obtener usuario y mostrar en modal)
async function abrirModalModificar() {
    const id = document.getElementById("inputPutId").value;
    if (!id) return; // Verifica que se haya ingresado un ID

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Registro no encontrado.");
        const data = await response.json();

        // Carga los datos en los campos del modal
        document.getElementById("inputPutNombre").value = data.name;
        document.getElementById("inputPutApellido").value = data.lastname;

        // Muestra el modal de modificación
        new bootstrap.Modal(document.getElementById("dataModal")).show();
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para modificar un usuario (PUT, guarda cambios del modal)
async function modificarUsuario() {
    const id = document.getElementById("inputPutId").value;
    const name = document.getElementById("inputPutNombre").value;
    const lastname = document.getElementById("inputPutApellido").value;
    if (!id || !name || !lastname) return; // Verifica que todos los campos estén llenos

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lastname }) // Envía los cambios en el cuerpo de la solicitud
        });
        if (!response.ok) throw new Error("Error al modificar el usuario.");
        
        buscarUsuario(); // Actualiza la lista con el registro modificado

        // Cierra el modal
        bootstrap.Modal.getInstance(document.getElementById("dataModal")).hide();
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para eliminar un usuario (DELETE)
async function borrarUsuario() {
    const id = document.getElementById("inputDelete").value;
    if (!id) return; // Verifica que se haya ingresado un ID

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar el usuario.");
        
        buscarUsuario(); // Actualiza la lista sin el registro eliminado
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para mostrar los resultados en la interfaz
function mostrarResultados(data) {
    resultsList.innerHTML = ""; // Limpia resultados previos

    // Si data es un arreglo (lista de usuarios), itera y crea un elemento por cada usuario
    if (Array.isArray(data)) {
        data.forEach(user => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item", "bg-dark", "text-white");
            listItem.innerHTML = `<p> ID: ${user.id} <br> NOMBRE: ${user.name},<br>APELLIDO: ${user.lastname}</p>
            `;
            resultsList.appendChild(listItem);
        });
    } else {
        // Si data es un objeto (un único usuario), crea un elemento con sus datos
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "bg-dark", "text-white");
        listItem.textContent = `ID: ${data.id}, Nombre: ${data.name}, Apellido: ${data.lastname}`;
        resultsList.appendChild(listItem);
    }
}

// Función para mostrar un mensaje de error
function mostrarError(message) {
    const alert = document.getElementById("alert-error");
    alert.textContent = message;
    alert.classList.add("show"); // Muestra la alerta
    setTimeout(() => alert.classList.remove("show"), 3000); // Oculta la alerta después de 3 segundos
}

// Funciones para habilitar/deshabilitar botones según los campos
function validarCamposPost() {
    btnPost.disabled = !(document.getElementById("inputPostNombre").value && document.getElementById("inputPostApellido").value);
}

function validarCamposPut() {
    btnPut.disabled = !document.getElementById("inputPutId").value;
}

function validarCamposDelete() {
    btnDelete.disabled = !document.getElementById("inputDelete").value;
}

})
