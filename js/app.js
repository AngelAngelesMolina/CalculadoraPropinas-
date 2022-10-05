
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
    let { pedido } = cliente;
    // VALIDACIÓN DE CANTIDAD 
    if (producto.cantidad > 0) {
        if (pedido.some(articulo => articulo.id === producto.id)) { //comprobar si el elemento ya existe en el array 
            //Ya existe el articulo, actualizar cantidad 
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            }); //retorna un arreglo nuevo modificado  
            //Se asigna el nuevo array a cliente.pedido 
            cliente.pedido = [...pedidoActualizado];
        } else {
            //articulo no existe, lo agregarmos al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        // ELIMINAR ELEMENTOS CUANDO LA CANTIDAD ES 0 
        const resultado = pedido.filter(articulo => articulo.id != producto.id);
        cliente.pedido = [...resultado];
    }
    // limpiar el codigo html previo 
    limpiarHtml();
    //   MOSTRAR EL RESUMEN 
    actualizarResumen();
}
function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');
    const mesaSpam = document.createElement('SPAM');
    mesaSpam.textContent = cliente.mesa;
    mesaSpam.classList.add('fw-normal');

    //INFORMACIÓN DE LA MESA
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');
    //información de la hora
    const horaSpam = document.createElement('SPAM');
    horaSpam.textContent = cliente.hora;
    horaSpam.classList.add('fw-normal');

    //Agregar a los elementos padre
    mesa.appendChild(mesaSpam);
    hora.appendChild(horaSpam);
    // titulo de la sección 
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4'), 'text-center';
    // ITERAR SOBRE EL ARRAY DE PEDIDOS 
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach(articulo => {
        const { nombre, cantidad, precio } = articulo;
        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');
        
        //CANTIDAD DEL ARTICULO 
        const  cantidadEl  = document.createElement('P');
        cantidadEl.classList.add('fw-bold'); 
        cantidadEl.textContent = `Cantidad: `; 
        const  cantidadValor  = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal'); 
        cantidadValor.textContent = cantidad; 
        // AGREGAR VALOR A SUS CONTENEDORES 
        cantidadEl.appendChild(cantidadValor); 
        
        //Precio DEL ARTICULO 
        const  precioEl  = document.createElement('P');
        precioEl.classList.add('fw-bold'); 
        precioEl.textContent = `Precio: `; 
        const  precioValor  = document.createElement('SPAN');
        precioValor.classList.add('fw-normal'); 
        precioValor.textContent = `$ ${precio}`; 
        // AGREGAR VALOR A SUS CONTENEDORES 
        precioEl.appendChild(precioValor); 

        const nombreEl = document.createElement('H4'); 
        nombreEl.classList.add('my-4'); 
        nombreEl.textContent = nombre; 

        //Agregar elementos al li 
        lista.appendChild(nombreEl); 
        lista.appendChild(cantidadEl); 
        lista.appendChild(precioEl); 


        //Agregar lista al grupo principal 
        grupo.appendChild(lista); 
    });


    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
}

function limpiarHtml() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}
