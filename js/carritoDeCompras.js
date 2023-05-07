const items = document.getElementById("card-items");
const carritoItems = document.getElementById("carrito-items");
const mostrarFooter = document.getElementById("carrito-footer");
const carritoTemplate = document.getElementById("carrito-template").content;
const footerCarrito = document.getElementById("footer-template").content;
const template = document.getElementById("card-template").content;
const fragment = document.createDocumentFragment();
let carrito = {};


const traerData = async () => 
{
    try 
    {
        const res = await fetch('../api.json');
        const data = await res.json();
        mostrarCards(data);
    }  
    catch (error) 
    {
        console.log(error);
    }
    }

    document.addEventListener('DOMContentLoaded', () => {
    traerData();

    
    if(localStorage.getItem('carrito'))
    {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        mostrarCarrito();
    }

    });

    items.addEventListener('click', (e) => 
    {
    agregarAlCarrito(e);
    });

    carritoItems.addEventListener('click', (e) => 
    {
    
    accionesCarrito(e);
});



const mostrarCards = data => {
    data.forEach(producto => {
        template.querySelector("img").setAttribute("src", producto.imagenURL);
        template.querySelector("h3").textContent = producto.nombre;
        template.querySelector("h4").textContent = producto.precio;
        template.querySelector(".btn").dataset.id = producto.id;


        const clonar = template.cloneNode(true);
        fragment.appendChild(clonar);
    })
    items.appendChild(fragment);
}
const agregarAlCarrito = e => {
    if(e.target.classList.contains("btn")){
        modificarCarrito(e.target.parentElement);
    }
    Toastify({
        text: "Agregado al Carrito",
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "left", 
        stopOnFocus: true, 
        style: {
          background: "black",
          color: "white"
        },
        onClick: function(){}
      }).showToast();
    e.stopPropagation()
}


const modificarCarrito = obj => {
    const producto = {
        id: obj.querySelector(".btn").dataset.id,
        nombre: obj.querySelector("h3").textContent,
        precio: obj.querySelector("h4").textContent,
        cantidad: 1,
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto};
    
    mostrarCarrito();
}


const mostrarCarrito = () => {
    
    carritoItems.innerHTML = ``;

    Object.values(carrito).forEach( producto => {

        carritoTemplate.querySelector("th").textContent = producto.id,
        carritoTemplate.querySelectorAll("td")[0].textContent = producto.nombre,
        carritoTemplate.querySelectorAll("td")[1].textContent = producto.cantidad,
        carritoTemplate.querySelector(".btn-sumar").dataset.id = producto.id,
        carritoTemplate.querySelector(".btn-restar").dataset.id = producto.id
        carritoTemplate.querySelector("span").textContent = producto.cantidad * producto.precio
        const clonar = carritoTemplate.cloneNode(true);
        fragment.appendChild(clonar);

    });

    carritoItems.appendChild(fragment);

    mostrarFooterCarrito();

    
    localStorage.setItem('carrito', JSON.stringify(carrito));
}


const mostrarFooterCarrito = () => {

    mostrarFooter.innerHTML = ``

    if(Object.keys(carrito).length === 0){
        mostrarFooter.innerHTML = `
        <th>No hay productos seleccionados</th>
        `
        return;
    }

    const sumarCantidades = Object.values(carrito).reduce((acumular, {cantidad})=> acumular + cantidad, 0);
    const sumarPrecios = Object.values(carrito).reduce((acumular, {cantidad,precio}) => acumular + cantidad * precio, 0);
    
    footerCarrito.querySelectorAll("td")[0].textContent = sumarCantidades;
    footerCarrito.querySelector("span").textContent = sumarPrecios;

    const clonar = footerCarrito.cloneNode(true);
    fragment.appendChild(clonar);
    mostrarFooter.appendChild(fragment);

    const vaciarCarrito = document.getElementById("vaciar-carrito");
    vaciarCarrito.addEventListener("click", () => {
        carrito = {}
        mostrarCarrito();
        Toastify({
            text: "Carrito de compras vacio",
            duration: 3000,
            destination: "",
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left", 
            stopOnFocus: true, 
            style: {
              background: "black",
              color: "white",
            },
            onClick: function(){}
          }).showToast();
    });

    const comprar = document.getElementById("realizar-compra");
    comprar.addEventListener("click", () => {
        carrito = {};
        mostrarCarrito();
        Toastify({
            text: "La Compra se realizó con éxito. En breve nos pondremos en contacto con vos",
            duration: 3000,
            destination: "",
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "left",
            stopOnFocus: true, 
            style: {
              background: "black",
              color: "white",
              width: "300px",
              height: "150px"
            },
            onClick: function(){} 
          }).showToast();
    });

}

    const accionesCarrito = (e) => 
{
    if(e.target.classList.contains('btn-sumar')){

        const producto = carrito[e.target.dataset.id];
        producto.cantidad ++;
        carrito[e.target.dataset.id] = {...producto};
        
        mostrarCarrito();
    }

    if(e.target.classList.contains('btn-restar')){

        const producto = carrito[e.target.dataset.id];
        producto.cantidad --;

        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }

        mostrarCarrito();
    }

    e.stopPropagation();
}
