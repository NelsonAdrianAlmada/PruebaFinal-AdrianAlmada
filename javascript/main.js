let artesanias=[];
let carrito = [];

const contenedorProductos = document.getElementById('contenedorProductos');
const precioTotal = document.getElementById('precioTotal');
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const contadorCarrito = document.getElementById('contCarrito');
const vaciar = document.getElementById('vaciar');
const finalizarCompra = document.getElementById('finalizarCompra');

//LocalStorage 
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];
    actualizarCarrito();
  };
});

//Vaciar carrito
vaciar.addEventListener('click', () => {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.clear();
  //Libreria
  Swal.fire({
    title: 'Vacio',
    background: 'white',
    color: 'Black',
  });
});

//fetch desde json
fetch("./json/api.json")
  .then(resp => resp.json())
  .then(data =>{
    artesanias = [...data];
    artesanias.forEach(menu => {
      const div = document.createElement('div');
      div.classList.add('producto');
      div.innerHTML += `
          <div class="tarjetas" style="width: 200px">
            <img class="imgProductos" height=270px; src=${menu.imagen} alt=${menu.nombre}>
            <h2>${menu.nombre}</h2>
            <p class="precio"><b>$ ${menu.precio} </b></p>
            <p><button class="boton" id="agregar${menu.id}">Añadir</button></p>
          </div>
          `;
      contenedorProductos.appendChild(div);

      const boton = document.getElementById(`agregar${menu.id}`);
     
      boton.addEventListener('click', () => {
        agregarAlCarrito(menu.id);
      });
    });
  });

//Agregar items a nuestro carrito
//Sumar al carrito 
const agregarAlCarrito = (menuId) => {
  const existe = carrito.some(menu => menu.id === menuId)
  if(existe){
    const menu = carrito.map (menu => {
      if (menu.id === menuId){
        menu.cantidad++
      };
    });
  }else{
    const item = artesanias.find((menu) =>  menu.id === menuId)
    item.cantidad = 1;
    carrito.push(item)
  };
    actualizarCarrito();
};

//Eliminar del carrito

const eliminarDelCarrito = (menuId) => {
  const item = carrito.find((menu) => menu.id === menuId);
  const indice = carrito.indexOf(item);
  carrito.splice(indice, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
};

//Mostrar y agregar al carrito 
const actualizarCarrito = () => {
  contenedorCarrito.innerHTML =""; 
  
  carrito.forEach((menu) => {
    const etiqueta = document.createElement('tr');
    etiqueta.innerHTML +=`
      <td class="imagenCarrito"><img src="${menu.imagen}" width="60px"></td>
      <td class="nombreCarrito">${menu.nombre}</td>
      <td class="precioCarrito">$ ${menu.precio}</td>
      <td class="cantidadCarrito"><span id="cantidad">${menu.cantidad} un</span></td>
      <td class="precioTotalCarrito">$ ${menu.precio * menu.cantidad}</td>
      <td><button  onclick= "eliminarDelCarrito(${menu.id})"<h1>X</h1></button><td>
    `
    contenedorCarrito.appendChild(etiqueta);

    localStorage.setItem('carrito', JSON.stringify(carrito));

  });
    //contador del carrito   
    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = carrito.reduce((acc, menu)=> acc + menu.precio * menu.cantidad, 0);
};


//finalizo compra
finalizarCompra.addEventListener('click', () => {
  if(carrito.length >= 1) {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.clear();
  contenedorCarrito.innerHTML =""; 
  precioTotal.innerText = 0;
  //Libreria
  Swal.fire({
    title: 'Muchas gracias por su compra',
    imageUrl: './imagenes/logo.png',
    imageWidth: 200,
    imageHeight: 170,
    imageAlt: 'Custom image',
    background: 'white',
    color: 'black',
   })
  }else{
  //Libreria 
  Swal.fire({
  title: 'El carrito esta vacio',
  background: 'white',
  color: 'black',
  });
  };
});