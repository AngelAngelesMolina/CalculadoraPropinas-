
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

    if (cliente.pedido.length) { //si hay algo (1)
        //   MOSTRAR EL RESUMEN 
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }
}
function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    //INFORMACIÓN DE LA MESA
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpam = document.createElement('SPAM');
    mesaSpam.textContent = cliente.mesa;
    mesaSpam.classList.add('fw-normal');

    //información de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

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
        const { nombre, cantidad, precio, id } = articulo;
        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        //CANTIDAD DEL ARTICULO 
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = `Cantidad: `;

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio DEL ARTICULO 
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = `Precio: `;
        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$ ${precio}`;

        //subtotal del articulo
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = `Subtotal: `;
        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // BOTON PARA ELIMINAR
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';
        // FUNCION PARA ELIMINAR EL PEDIDO 
        btnEliminar.onclick = function () {
            eliminarProducto(id);
        }


        // AGREGAR VALOR A SUS CONTENEDORES 
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Agregar elementos al li 
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);


        //Agregar lista al grupo principal 
        grupo.appendChild(lista);
    });
    //agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);

    resumen.appendChild(grupo);

    contenido.appendChild(resumen);
    //mostrar formulario de propinas 
    formularioPropinas();
}

function calcularSubtotal(precio, cantidad) {
    return `$ ${precio * cantidad}`;
}
function eliminarProducto(id) {
    const { pedido } = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    // limpiar el codigo html previo 
    limpiarHtml();
    if (cliente.pedido.length) { //si hay algo (1)
        //   MOSTRAR EL RESUMEN 
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }
    //el producto se elimino por lo tanto regresamos la cantidad a 0 en el formulario 
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
    // console.log(productoEliminado);

}
function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('P');
    texto.classList.add('center');
    texto.textContent = 'Añade los elementos del pedido';
    contenido.appendChild(texto);

}
function limpiarHtml() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}
function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Propina 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = "radio";
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radioLabel10 = document.createElement('LABEL');
    radioLabel10.textContent = '10%';
    radioLabel10.classList.add('form-check-label');

    const radioDiv10 = document.createElement('DIV');
    radioDiv10.classList.add('form-check');

    radioDiv10.appendChild(radio10);
    radioDiv10.appendChild(radioLabel10);
    // Radio button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = "radio";
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;


    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);
    // Radio button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;


    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);
    //AGREGAR AL DIV PRINCIPAL
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radioDiv10);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    // AGREGARLO AL FORMULARIO
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
}
function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;
    //calcular el subtotal a pafar
    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });
    //seleccionar el radioButton con la propina del cliente 
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    // CALCULAR PROPINA 
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100);
    // CALCULAR TOTAL
    const total = subtotal + propina;

    mostrarTotalHtml(subtotal, total, propina);
}

function mostrarTotalHtml(subtotal, total, propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');
    //Subtotal 
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    subtotalParrafo.textContent = 'Subtotal Consumo:';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = ` $${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);


    //Propina 
    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    propinaParrafo.textContent = 'Propina:';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = ` $${propina}`;

    propinaParrafo.appendChild(propinaSpan);


    //Total 
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-3');
    totalParrafo.textContent = 'Total del consumo:';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = ` $${total}`;

    totalParrafo.appendChild(totalSpan);

    //elimar el ultimo resultado 
    const  totalPagarDiv  = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove(); 
    }

    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);
    divTotales.appendChild(subtotalParrafo);

    //boton pagar
    const btnPago = document.createElement('button');
    btnPago.classList.add('btn', 'btn-success','text-center');
    btnPago.textContent = 'Pagar el pedido';
    divTotales.appendChild(btnPago);

    const formulario = document.querySelector('.formulario > div'); //selecciona el primer div hijo y ahí lo inserta 
    formulario.appendChild(divTotales);




}