
let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};
const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
// const  btnGuardarCliente  = document.querySelector('#guardar-cliente');

btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // VALIDAR CAMPOS COMPLETOS
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        // verificar si ya hay una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');
        if (!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
    }
    // asignar datos del formulario al cliente
    cliente = { ...cliente, mesa, hora, };
    console.log(cliente);
    // OCULTAR MODAL 
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // MOSTRAR LAS SECCIONES
    mostrarSecciones();
    // OBTENER PLATILLOS DE LA API JSON SERVER 
    obtenerPlatillos();
}
function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => {
        seccion.classList.remove('d-none');
    });
}
function obtenerPlatillos() {
    const url = 'http://localhost:3000/Platillos';

    fetch(url)
        .then(resp => resp.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(error => console.log(error))
}
function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // FUNCION PARA DETECTAR LA CANTIDAD Y PLATILLO QUE SE AGREGA
        inputCantidad.onchange = function () { // la función se manda a llamar hasta que ocurre el evento 
            const cantidad = parseInt(inputCantidad.value); //convertirlo a entero
            agregarPlatillo({ ...platillo, cantidad }); //Se manda a llamar siempre SE MANDA UN OBJETO EN UNO MISMO CON AYUDA DEL SPREAD OPERATOR, SINO QUEDARIA UN OBJETO DENTRO DE OTRO OBJETO
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        nombre.textContent = platillo.nombre;
        precio.textContent = `$${platillo.precio}.00`;
        categoria.textContent = categorias[platillo.categoria]; // para leer el valor del objeto y mostrarlo automaticamente como la categoria que pertenece

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);

    });
}
function agregarPlatillo(producto) {
    // EXTRAER PEDIDO ACTUAL 
    let {pedido} = cliente; 
    // VALIDACIÓN DE CANTIDAD 
    if (producto.cantidad > 0) {
        cliente.pedido = [...pedido, producto];
    } else {
        console.log('menor');
    }
    console.log(cliente.pedido);
}