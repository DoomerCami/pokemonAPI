document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

    // Realiza la solicitud a la API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        })
        .then(data => {
            // Muestra los resultados
            const resultContainer = document.getElementById('pokemon-result');
            resultContainer.innerHTML = `
                <h3>${data.name.toUpperCase()}</h3>
                <img src="${data.sprites.versions["generation-v"]["black-white"].animated.front_default}" alt="${data.name}">
                <p>Número: ${data.id}</p>
                <p>Tipo: ${data.types.map(type => type.type.name).join(', ')}</p>
            `;
        })
        .catch(error => {
            // Muestra un mensaje de error si el Pokémon no es encontrado
            document.getElementById('pokemon-result').innerHTML = `<p class="text-danger">${error.message}</p>`;
        });
});


const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {

    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.versions["generation-v"]["black-white"].animated.front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))


const getPokemon = async (offset = 0, limit = 5) => {

    let pokemons = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    pokemons = await pokemons.json();

    if (pokemons.results) {
        {
            for (let index = 0; index < pokemons.results.length; index++) {
                const pokedata = await fetch(pokemons.results[index].url);
                pokemons.results[index].data = await pokedata.json();

            }

        }

        return pokemons;
    }
}

const setPokemonAletorioDOM = (AletorioPokemon) => {
    let $divAleatorio = document.querySelector('.owl-carousel');

    $($divAleatorio).trigger('destroy.owl.carousel').removeClass('owl-loaded');
    $divAleatorio.innerHTML = ''; // Limpiar contenido previo

    let html = '';

    for (let i = 0; i < AletorioPokemon.results.length; i++) {
        // Obtener los tipos del Pokémon como un string
        let pokemonTypes = AletorioPokemon.results[i].data.types
            .map(typeInfo => typeInfo.type.name) // Extrae el nombre de cada tipo
            .join(', '); // Combina los tipos en un solo string separados por comas
    
        // Generar HTML para cada Pokémon
        html += `
        <div class="owl-carousel-info-wrap item">
            <img src="${AletorioPokemon.results[i].data.sprites.other["official-artwork"].front_default}" class="owl-carousel-image img-fluid" alt="${AletorioPokemon.results[i].name}">
            <div class="owl-carousel-info">
                <h4 class="mb-2">${AletorioPokemon.results[i].name}</h4>
                <span class="badge">${AletorioPokemon.results[i].data.species.name}</span>
                <span class="badge">${pokemonTypes}</span> <!-- Muestra los tipos aquí -->
            </div>
        </div>
        `;
    }    

    // Insertar el HTML generado en el contenedor del carrusel
    $divAleatorio.innerHTML = html;

    // Inicializar nuevamente el carrusel con configuración
    $($divAleatorio).owlCarousel({
        items: 3, // Número de imágenes visibles al mismo tiempo
        loop: true,
        margin: 50,
        center: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });
}

window.addEventListener('load', async function () {
    const waitForElement = async () => {
        const $divAleatorio = document.querySelector('.owl-carousel');
        if ($divAleatorio) {
            let min = 1;
            let max = 1292;
            let aleatorio = Math.floor(Math.random() * (max - min)) + min;
            let AletorioPokemon = await getPokemon(aleatorio, 10);
            setPokemonAletorioDOM(AletorioPokemon);
        } else {
            setTimeout(waitForElement, 100); 
        }
    };
    waitForElement();
});

const mostrarPokemones = async (offset = 0, limit = 12) => {
    // Obtener los Pokémon desde la API
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    let data = await response.json();

    // Seleccionar el contenedor donde se agregarán las tarjetas
    let container = document.querySelector('.navegapokemones');

    // Limpiar el contenedor antes de añadir nuevas tarjetas
    container.innerHTML = '';

    // Recorrer los resultados de la API
    for (let i = 0; i < data.results.length; i++) {
        // Obtener los detalles del Pokémon actual
        let pokeData = await fetch(data.results[i].url);
        let pokemon = await pokeData.json();

        // Crear la estructura de la tarjeta
        let cardHTML = `
            <div class="col-lg-4 col-12 mb-4 mb-lg-0">
                <div class="custom-block custom-block-full">
                    <div class="custom-block-image-wrap">
                        <a href="#">
                            <img src="${poke.sprites.versions["generation-v"]["black-white"].animated.front_default}" class="custom-block-image img-fluid" alt="${pokemon.name}">
                        </a>
                    </div>

                    <div class="custom-block-info">
                        <h5 class="mb-2">
                            <a href="#">
                                ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                            </a>
                        </h5>

                        <p class="mb-0">Height: ${pokemon.height} | Weight: ${pokemon.weight}</p>

                        <div class="custom-block-bottom d-flex justify-content-between mt-3">
                            <a href="#" class="bi-headphones me-1">
                                <span>100k</span>
                            </a>
                            <a href="#" class="bi-heart me-1">
                                <span>2.5k</span>
                            </a>
                            <a href="#" class="bi-chat me-1">
                                <span>924k</span>
                            </a>
                        </div>
                    </div>

                    <div class="social-share d-flex flex-column ms-auto">
                        <a href="#" class="badge ms-auto">
                            <i class="bi-heart"></i>
                        </a>
                        <a href="#" class="badge ms-auto">
                            <i class="bi-bookmark"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Añadir la tarjeta al contenedor
        container.innerHTML += cardHTML;
    }
};

let currentPage = 1;
const itemsPerPage = 9;
const totalPokemons = 151; // Total de Pokémon que vamos a mostrar
const totalPages = Math.ceil(totalPokemons / itemsPerPage);

const listaPokemones = document.querySelector("#listaPokemon");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

// Función para mostrar los Pokémon de la página actual
function mostrarPaginaPokemon(page) {
    listaPokemon.innerHTML = ""; // Limpiar el contenedor de Pokémon

    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalPokemons);

    for (let i = startIndex; i <= endIndex; i++) {
        fetch(URL + i)
            .then(response => response.json())
            .then(data => mostrarPokemon(data));
    }

    // Habilitar/Deshabilitar los botones según la página actual
    prevBtn.classList.toggle("disabled", currentPage === 1);
    nextBtn.classList.toggle("disabled", currentPage === totalPages);
}

// Muestra el primer lote de Pokémon al cargar la página
window.addEventListener('load', function () {
    mostrarPaginaPokemon(currentPage);
});

// Evento para el botón "Previous"
prevBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        mostrarPaginaPokemon(currentPage);
    }
});

// Evento para el botón "Next"
nextBtn.addEventListener('click', function (event) {
    event.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        mostrarPaginaPokemon(currentPage);
    }
});

// Función para mostrar un Pokémon (usada en el código existente)
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.versions["generation-v"]["black-white"].animated.front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}