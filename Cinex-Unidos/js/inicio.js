url = 'https://cinexunidos-production.up.railway.app';
class peliculaPopular{

}
function obtenerCinesXML(){
    let cines;
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url + '/theatres', false); // El tercer parámetro 'false' hace que la solicitud sea síncrona
        xhr.send();
        if (xhr.status === 200) {
            cines = JSON.parse(xhr.responseText);
        } else {
            console.error('Error obteniendo cines:', xhr.status, xhr.statusText);
            cines = null;
        }
        return cines;
    } catch (error) {
        console.error('Error obteniendo cines:', error);
        return null;
    }
}
function obtenerSalas(id){
    let salas;
    try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url + '/theatres/' + id + '/auditoriums', false); // El tercer parámetro 'false' hace que la solicitud sea síncrona
        xhr.send();
        if (xhr.status === 200) {
            salas = JSON.parse(xhr.responseText);
        } else {
            console.error('Error obteniendo salas:', xhr.status, xhr.statusText);
            salas = null;
        }
        return salas;
    } catch (error) {
        console.error('Error obteniendo salas:', error);
        return null;
    }
}
let listaCinesInicio = document.getElementById("listaCinesInicio");
agregarOpcionesListaCines();
listaCinesInicio.addEventListener("change", () => {opcionCambiadaListaCines()});
function opcionCambiadaListaCines(){
    mostrarPeliculas();
    mostrarPeliculasPopulares(getReservedSeats());
}
function agregarOpcionesListaCines() {
    let listaCines = obtenerCinesXML();
    listaCinesInicio.innerHTML = "";
    let primero = false;
    // Agregar las opciones de la lista de cines
    for (const cine of listaCines) {
      const opcion = document.createElement("option");
      opcion.value = cine.id;
      opcion.textContent = cine.name;
        if (!primero){
            opcion.selected = true;
            primero = true;
        }
      listaCinesInicio.appendChild(opcion);
    }
  }
function mostrarMasPopulares(){
    
}
mostrarPeliculas();
mostrarPeliculasPopulares(getReservedSeats());

const carouselContainer = document.querySelector('.carousel-container');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-items li');

carouselPrev.addEventListener('click', () => {
  carousel.scrollBy({
    left: -carouselItems[0].offsetWidth * carouselItems.length,
    behavior: 'smooth'
  });
});

carouselNext.addEventListener('click', () => {
  carousel.scrollBy({
    left: carouselItems[0].offsetWidth * carouselItems.length,
    behavior: 'smooth'
  });
});

function mostrarPeliculas() {
    const opcionSeleccionada = listaCinesInicio.options[listaCinesInicio.selectedIndex];
    const idCine = opcionSeleccionada.value;
    let listaSalas = obtenerSalas(idCine);
    let listaPeliculas = document.getElementById('listaPeliculasInicio');
    let peliculasEnCarrusel = new Set();
    listaPeliculas.innerHTML = '';
    for (let sala of listaSalas) {
        for (let show of sala.showtimes) {
            let pelicula = show.movie
            if (!peliculasEnCarrusel.has(pelicula.poster)) {
                listaPeliculas.innerHTML += `
                    <li class="imagenesCarruselLi">
                        <img src="https://cinexunidos-production.up.railway.app/${pelicula.poster}">
                        <div class="botonLike" peliculaElemento='${JSON.stringify(pelicula)}'>
                            <span class="material-symbols-outlined" >
                                favorite
                            </span>
                        </div>
                    </li>
                    `
                peliculasEnCarrusel.add(pelicula.poster);
            }
        }
    }
    let listaBotonLike = document.getElementsByClassName("botonLike");
    for (let i = 0; i < listaBotonLike.length; i++) {
        listaBotonLike[i].addEventListener("click", () => { agregarPeliculaFavorita(JSON.parse(listaBotonLike[i].getAttribute("peliculaElemento"))) 
            let spanElemento = listaBotonLike[i].querySelector(".material-symbols-outlined");
            if (spanElemento.style.backgroundColor === "var(--colorMagenta)"){
                spanElemento.style.backgroundColor = "white";
                spanElemento.style.color = "var(--colorMagenta)";   
            }else{
                spanElemento.style.backgroundColor = "var(--colorMagenta)";
                spanElemento.style.color = "white";   
            }

        });
    }
    comprobarPeliculasFavoritas();
}
document.getElementById('menu-desplegable').addEventListener('change', function() {
    if (this.value === 'peliculas-favoritas') {
        mostrarPeliculasFavoritas();
    } else if (this.value === 'peliculas-vistas') {
        mostrarPeliculasVistas();
    }
});
function mostrarPeliculasFavoritas() {
    let peliculasFavoritas = JSON.parse(localStorage.getItem('peliculasFavoritasNAD')) || [];
    let contenidoModal = document.getElementById('contenidoModal2');
    let tituloModal = document.getElementById('tituloModal2');

    contenidoModal.innerHTML = '';

    tituloModal.textContent = 'Mis Películas Favoritas';

    if (peliculasFavoritas.length === 0) {
        contenidoModal.innerHTML = '<p>No hay películas favoritas aún.</p>';
    } else {
        for (let pelicula of peliculasFavoritas) {
            let peliculaHTML = `
                <div class="movie-item">
                    <img src="https://cinexunidos-production.up.railway.app/${pelicula.poster}" alt="${pelicula.name}">
                    <div class="movie-info">
                        <h3>${pelicula.name}</h3>
                        <p>Duración: ${pelicula.runningTime}</p>
                        <p>Calificación: ${pelicula.rating}</p>
                    </div>
                </div>
            `;
            contenidoModal.innerHTML += peliculaHTML;
        }
    }
    let modal = document.getElementById('myModal2');
    modal.style.display = 'block';
}
function mostrarPeliculasVistas() {
    let peliculasVistas = JSON.parse(localStorage.getItem('peliculasVistasNAD')) || [];
    let contenidoModal = document.getElementById('contenidoModal2');
    let tituloModal = document.getElementById('tituloModal2');

    contenidoModal.innerHTML = '';

    tituloModal.textContent = 'Mis Películas Vistas';

    if (peliculasVistas.length === 0) {
        contenidoModal.innerHTML = '<p>No has visto películas aún.</p>';
    } else {
        for (let pelicula of peliculasVistas) {
            let peliculaHTML = `
                <div class="movie-item">
                    <img src="https://cinexunidos-production.up.railway.app/${pelicula.poster}" alt="${pelicula.name}">
                    <div class="movie-info">
                        <h3>${pelicula.name}</h3>
                        <p>Duración: ${pelicula.runningTime}</p>
                        <p>Calificación: ${pelicula.rating}</p>
                        <p>Fecha vista: ${pelicula.fechaVista}</p>
                    </div>
                </div>
            `;
            contenidoModal.innerHTML += peliculaHTML;
        }
    }
    let modal = document.getElementById('myModal2');
    modal.style.display = 'block';
}
function comprobarPeliculasFavoritas() {
    let peliculasFavoritas = JSON.parse(localStorage.getItem('peliculasFavoritasNAD')) || [];
    let listaBotonLike = document.querySelectorAll('.botonLike');

    listaBotonLike.forEach(boton => {
        let pelicula = JSON.parse(boton.getAttribute('peliculaElemento'));
        let spanElemento = boton.querySelector('span');

        if (peliculasFavoritas.some(p => p.name === pelicula.name)) {
            spanElemento.style.backgroundColor = "var(--colorMagenta)";
            spanElemento.style.color = "white";
        } else {
            spanElemento.style.backgroundColor = "";
            spanElemento.style.color = "";
        }
    });
}

function agregarPeliculaFavorita(pelicula) {
    let peliculasFavoritas = JSON.parse(localStorage.getItem('peliculasFavoritasNAD')) || [];
    let peliculaIndex = peliculasFavoritas.findIndex(p => p.name === pelicula.name);

    if (peliculaIndex === -1) {
        peliculasFavoritas.push(pelicula);
        console.log('Película agregada a favoritos');
    } else {
        peliculasFavoritas.splice(peliculaIndex, 1);
        console.log('Película eliminada de favoritos');
    }
    localStorage.setItem('peliculasFavoritasNAD', JSON.stringify(peliculasFavoritas));
}
function mostrarPeliculasPopulares(listaPopulares){
    let listaPeliculas = document.getElementById('listaPopulares');
    listaPeliculas.innerHTML='';
    let cont=0;
    for(let elemento of listaPopulares){
        if (cont < 1){
            pelicula = elemento.movie;
            listaPeliculas.innerHTML+=`
            <li>
                <img src="https://cinexunidos-production.up.railway.app/${pelicula.poster}">
            </li>`
        }
        cont++;
    }
}
function removeDuplicateMovies(reservedSeatsPerMovie) {
    const uniqueMovies = {};
      for (const movieInfo of reservedSeatsPerMovie) {
      const { movie } = movieInfo;
      if (!uniqueMovies[movie.id]) {
        uniqueMovies[movie.id] = movieInfo;
      }
    }
      return Object.values(uniqueMovies);
}
function getReservedSeats() {
    const opcionSeleccionada = listaCinesInicio.options[listaCinesInicio.selectedIndex];
    const idCine = opcionSeleccionada.value;
    const reservedSeatsPerMovie = [];
    let listaSalas = obtenerSalas(idCine);
    for (let sala of listaSalas) {
      for (let show of sala.showtimes) {
        let reservedSeats = 0;
        for (const row of Object.values(show.seats)) {
          for (const seat of row) {
            if (seat === 2 || seat === 1) {
              reservedSeats++;
            }
          }
        }
        const reservedSeatsInfo = {
          movie: show.movie,
          reservedSeats: reservedSeats
        };
        reservedSeatsPerMovie.push(reservedSeatsInfo);
      }
    }
    newList = removeDuplicateMovies(reservedSeatsPerMovie);
    newList.sort((a, b) => b.reservedSeats - a.reservedSeats);
    return newList;
  }
  function establecerOpcionSeleccionada(opcionSeleccionada) {
    let menuDesplegable = document.getElementById('menu-desplegable');
    menuDesplegable.selectedIndex = opcionSeleccionada;
  }
  
  let modalPreferencias = document.getElementById("myModal2");
  let closeButton = document.getElementsByClassName("close-button2")[0];
  
  closeButton.onclick = function() {
    modalPreferencias.style.display = "none";
    establecerOpcionSeleccionada(0); 
  }
  
  window.onclick = function(event) {
    if (event.target == modalPreferencias) {
      modalPreferencias.style.display = "none";
      establecerOpcionSeleccionada(0); 
    }
  }
