let url = 'https://cinexunidos-production.up.railway.app';

class ManejoDatos{
    
    obtenerCinesXML() {
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

    obtenerSalas(id) {
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
}
    let manejoDatos = new ManejoDatos();
    let cineSeleccionado = "";
    mostrarCines();

            function mostrarCines() {
                let listaCines = document.getElementById('listaCines');
                let listaCinesJson = manejoDatos.obtenerCinesXML();
                let selectedCineIndex = 0; 
              
                listaCines.innerHTML = '';
                for (let i = 0; i < listaCinesJson.length; i++) {
                  listaCines.innerHTML += `
                  <li class="cine" idCine="${listaCinesJson[i].id}">
                    <figure>
                      <img class="imgCine" src="https://cinexunidos-production.up.railway.app/${listaCinesJson[i].images[0]}">
                      <figcaption>
                        <h2 id='cine-name'>${listaCinesJson[i].name}</h2>
                      </figcaption>
                    </figure>
                  </li>`;
                }
              
                let cine = document.getElementsByClassName('cine');
                let prevBtn = document.querySelector('.prev');
                let nextBtn = document.querySelector('.next');
              
                for (let i = 0; i < cine.length; i++) {
                  cine[i].addEventListener('click', () => {
                    selectedCineIndex = i;
                    cineSeleccionado = cine[i].querySelector('#cine-name').textContent;
                    mostrarPeliculas(cine[i].getAttribute("idCine"));
                  });
                }
              
                cineSeleccionado = cine[selectedCineIndex].querySelector('#cine-name').textContent;
                mostrarPeliculas(cine[selectedCineIndex].getAttribute("idCine")); 
              
                prevBtn.addEventListener('click', () => {
                    if (selectedCineIndex === 0) {
                        return;
                      }
                  selectedCineIndex = (selectedCineIndex === 0) ? cine.length - 1 : selectedCineIndex - 1;
                  listaCines.innerHTML = '';
                  listaCines.innerHTML += `
                  <li class="cine" idCine="${listaCinesJson[selectedCineIndex].id}">
                    <figure>
                      <img class="imgCine" src="https://cinexunidos-production.up.railway.app/${listaCinesJson[selectedCineIndex].images[0]}">
                      <figcaption>
                        <h2 id='cine-name'>${listaCinesJson[selectedCineIndex].name}</h2>
                      </figcaption>
                    </figure>
                  </li>`;
                  cineSeleccionado = document.querySelector('#cine-name').textContent;
                  mostrarPeliculas(listaCinesJson[selectedCineIndex].id);
                });
              
                nextBtn.addEventListener('click', () => {
                    if (selectedCineIndex === listaCinesJson.length - 1) {
                        return;
                      }
                  selectedCineIndex = (selectedCineIndex === cine.length - 1) ? 0 : selectedCineIndex + 1;
                  listaCines.innerHTML = '';
                  listaCines.innerHTML += `
                  <li class="cine" idCine="${listaCinesJson[selectedCineIndex].id}">
                    <figure>
                      <img class="imgCine" src="https://cinexunidos-production.up.railway.app/${listaCinesJson[selectedCineIndex].images[0]}">
                      <figcaption>
                        <h2 id='cine-name'>${listaCinesJson[selectedCineIndex].name}</h2>
                      </figcaption>
                    </figure>
                  </li>`;
                cineSeleccionado = document.querySelector('#cine-name').textContent;
                mostrarPeliculas(listaCinesJson[selectedCineIndex].id);
                });
              } 

        function mostrarPeliculas(idCine) {
            let listaSalas = manejoDatos.obtenerSalas(idCine);
            let listaPeliculas = document.getElementById('listaPeliculas');
            let carruselEstrenos = document.getElementById('carruselEstreno--inner');
            carruselEstrenos.innerHTML = '';
            listaPeliculas.innerHTML = '';
            let cineElegido = document.getElementById('cineElegido');
            cineElegido.textContent = "Películas en " + cineSeleccionado;
          
            let peliculasEnCarrusel = new Set();
          
            for (let sala of listaSalas) {
              for (let show of sala.showtimes) {
                let pelicula = show.movie;

                  listaPeliculas.innerHTML += `
                    <li class="pelicula">
                      <div class="peliculaIzquierda">
                        <h2 class="nombrePelicula">${pelicula.name}</h2>
                        <div class="horario">
                          <h3> ESP </h3>
                          <p>${show.startTime}</p>
                        </div>
                        <div class="inferiorPelicula">
                          <div>
                            <p>Duración: ${pelicula.runningTime}</p>
                            <p>Censura: ${pelicula.rating}</p>
                          </div>
                          <button class="botonPelicula" idShow="${show.id}" idPelicula="${pelicula.id}" idSala="${sala.id}" idCine="${idCine}">
                            <span class="material-symbols-outlined" class="botonPelicula" idShow="${show.id}" idPelicula="${pelicula.id}" idSala="${sala.id}" idCine="${idCine}">
                              add
                            </span>
                          </button>
                        </div>
                      </div>
                      <div class="peliculaDerecha">
                        <img class="imgPelicula" src="https://cinexunidos-production.up.railway.app/${pelicula.poster}">
                      </div>
                    </li>
                  `;
          
                  if (!peliculasEnCarrusel.has(pelicula.poster)) {
                  carruselEstrenos.innerHTML += `
                    <img src="https://cinexunidos-production.up.railway.app/${pelicula.poster}" class="imgEstrenos" class="estreno">
                  `;
          
                  peliculasEnCarrusel.add(pelicula.poster);
                }
              }
            }
          
            agregarEventoBotonPeliculas();
          }

    function agregarEventoBotonPeliculas(){
        let botonPeliculas = document.getElementsByClassName('botonPelicula');
        for(let boton of botonPeliculas){
            boton.addEventListener('click',() => {mostrarButacas(boton.getAttribute("idCine"),boton.getAttribute("idSala"),boton.getAttribute("idShow"))})
        }      
    }

    function mostrarButacas(theatreId, auditoriumId,movieId){
        console.log(`theatreId: ${theatreId} | auditoriumId: ${auditoriumId} | movieId: ${movieId}`);
        let myUrl =  window.location.href
        let segments = myUrl.split('/')
        segments.pop()
        let myNewUrl = segments.join('/')
        let seatsUrl = `${myNewUrl}/seleccionarButacas.html?theatreId=${theatreId}&auditoriumId=${auditoriumId}&movieId=${movieId}`;
        window.location.href = seatsUrl;
    }
    const casillaFecha = document.getElementById('fecha');
    document.addEventListener('DOMContentLoaded', () => {mostrarFecha()});

    function mostrarFecha(){
        const fechaActual = new Date();
        casillaFecha.textContent = `${fechaActual.getDate().toString().padStart(2, '0')} de ${['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'][fechaActual.getMonth()]} de ${fechaActual.getFullYear()}`;
    }

    let index= 0;
    setInterval(function(){
        let carruselEstrenoInner = document.getElementById('carruselEstreno--inner');
        let images = carruselEstrenoInner.querySelectorAll("img");
        let percentage = index * -550;
        carruselEstrenoInner.style.transform = "translateX(" + percentage + "px)"; 
        index++;
        if(index > images.length -1){
            index=0;
        }
    },3000);

    const cineElegido = document.getElementById('cineElegido');
    window.addEventListener('scroll', () => {
        const elementos = document.querySelectorAll('.elemento'); 
    
        elementos.forEach(elemento => {
            const rect = elemento.getBoundingClientRect();
            if (rect.bottom <= cineElegido.getBoundingClientRect().bottom) {
                elemento.classList.add('transparencia');
            } else {
                elemento.classList.remove('transparencia');
            }
        });
    });

