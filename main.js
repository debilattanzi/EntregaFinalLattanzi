document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarCarrito();
});

async function cargarProductos() {
    try {
        let respuesta = await fetch('productos.json');
        if (!respuesta.ok) {
            throw new Error('Error al cargar los productos. Intente nuevamente.');
        }
        let productos = await respuesta.json();
        mostrarProductos(productos);
    } catch (error) {
        mostrarMensaje(error.message);
    }
}

function mostrarProductos(productos) {
    let contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        let contenedorProducto = document.createElement("div");
        contenedorProducto.className = "col-md-4";
        contenedorProducto.innerHTML = `<div class='card mb-4 shadow-sm'>
            <img src='${producto.imagen}' class='card-img-top' alt='${producto.nombre}'>
            <div class='card-body'>
                <h5 class='card-title'>${producto.nombre}</h5>
                <p class='card-text'>Precio: $${producto.precio}</p>
                <button class='btn btn-primary' onclick='agregarAlCarrito(${producto.id}, "${producto.nombre}", ${producto.precio})'>Agregar al Carrito</button>
            </div>
        </div>`;
        contenedorProductos.appendChild(contenedorProducto);
    });
}
let carrito = [];

function agregarAlCarrito(id, nombre, precio) {
    let carritoGuardado = localStorage.getItem("carrito");
    let carrito = [];

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    let nuevoProducto = { id: Date.now(), nombre, precio, cantidad: 1 };
    carrito.push(nuevoProducto);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}



function actualizarCarrito() {
    let contenedorCarrito = document.getElementById("carrito");
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = "";

    let carritoGuardado = localStorage.getItem("carrito");
    let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>0</p>";
        return;
    }

    carrito.forEach((producto) => {
        let itemCarrito = document.createElement("div");
        itemCarrito.className = "carrito-item";
        itemCarrito.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad}</p>
            <div>
                <button class='btn btn-info btn-sm' onclick='modificarCantidad(${producto.id}, -1)'>-</button>
                <button class='btn btn-info btn-sm' onclick='modificarCantidad(${producto.id}, 1)'>+</button>
                <button class='btn btn-danger btn-sm' onclick='eliminarDelCarrito(${producto.id})'>Eliminar</button>
            </div>
        `;
        contenedorCarrito.appendChild(itemCarrito);
    });
    

    let total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    let totalElemento = document.createElement("p");
    totalElemento.innerHTML = `<strong>Total: $${total}</strong>`;
    contenedorCarrito.appendChild(totalElemento);

    let botonComprar = document.createElement("button");
    botonComprar.className = 'btn btn-success mt-2';
    botonComprar.textContent = 'Comprar';
    botonComprar.onclick = realizarCompra;
    contenedorCarrito.appendChild(botonComprar);
}

function modificarCantidad(id, cambio) {
    let carrito = [];
    let carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    let productoIndex = carrito.findIndex(producto => producto.id === id);
    
    if (productoIndex !== -1) {
        carrito[productoIndex].cantidad += cambio;

        if (carrito[productoIndex].cantidad <= 0) {
            carrito.splice(productoIndex, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }
}



function eliminarDelCarrito(id) {
    let carrito = [];
    let carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    carrito = carrito.filter(producto => producto.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}


function realizarCompra() {

    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
    mostrarMensaje('Gracias por tu compra.');
}

function mostrarMensaje(mensaje) {
    console.log("Mostrando mensaje:", mensaje);
    document.getElementById('mensajeModalCuerpo').textContent = mensaje;

    const mensajeModal = new bootstrap.Modal(document.getElementById('mensajeModal'));
    mensajeModal.show();
}



