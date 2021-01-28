const endpointPokemon = "https://pokeapi.co/api/v2/pokemon/"
const buscar = document.getElementById('search-button');
const fotoPoke = document.getElementById('pokemon');
const nombrePoke = document.getElementById('nombre');
const tipo1 = document.getElementById('tipo-1');
const tipo2 = document.getElementById('tipo-2');
const siguiente = document.getElementById('siguiente');
const anterior = document.getElementById('anterior');
const secundario = document.getElementById('secundario');
const lista = document.getElementById('lista-pokes');
const comenzar = document.getElementById('inicio-btn');

const iniciar = function(){
    buscarPokemon(pokeId);
};

// Activa los elementos ocultos de nuevo    
const vista = function() {
    desactivado = 1;
    document.getElementById("anterior").hidden = false;
    document.getElementById("siguiente").hidden = false;
    document.getElementById("pokedex-div").style.backgroundColor = "";
    document.getElementById("pokedex-div").style.boxShadow = "";
    document.getElementById("search-area-div").hidden = false;
    document.getElementById("info").hidden = false;
    document.getElementById("pokemon").style.width = "";
    document.getElementById("pokemon").style.height = "";
    document.getElementById("inicio-btn").hidden = true;
}

var pokeId = 1;
var desactivado = 0; // Indica que la pantalla principal está desactivada
var first = 0; // Valdrá 1 al realizarse la primera conexión

function buscarPokemon(pokemon) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.timeout = 10000;
    xmlHttp.onreadystatechange = function() {  // Se ejecuta cuando cambia el readyState
        if (xmlHttp.readyState == 4) { // Comprobamos si está finalizada con "Done" == 4
            if (xmlHttp.status == 200) {
                first = 1;
                let parseado = JSON.parse(xmlHttp.responseText);
                pokeId = parseado.id;
                fotoPoke.setAttribute("src", parseado.sprites.front_default); // Foto default del pokemon
                nombrePoke.textContent = parseado.name.charAt(0).toUpperCase() + parseado.name.slice(1);
                fotoPoke.setAttribute("alt", nombrePoke.textContent);
                tipo2.hidden = true;
                if (parseado.types.length === 2) {
                    tipo2.textContent = parseado.types[1].type.name.charAt(0).toUpperCase() + parseado.types[1].type.name.slice(1);
                    tipo2.hidden = false;
                    tipo2.style.backgroundColor = detectType(tipo2.textContent.toLowerCase());
                }
                tipo1.textContent = parseado.types[0].type.name.charAt(0).toUpperCase() + parseado.types[0].type.name.slice(1);
                tipo1.style.backgroundColor = detectType(tipo1.textContent.toLowerCase());
                let id = document.getElementById("span-id");
                id.textContent = parseado.id;
                let altura = document.getElementById("span-altura");
                let m = (String(parseInt(parseado.height)/10));
                altura.textContent = (m == 1) ? m + " metro" : m + " metros";
                let peso = document.getElementById("span-peso");
                let kg = (String(parseInt(parseado.weight)/10));
                peso.textContent = (kg == 1) ? kg + " kilogramo" : kg + " kilogramos";
                desactivado === 0 && vista(); 
                return;
            }
            if (xmlHttp.status == 404) {
                if (first === 1)
                    alert("Este Pokémon no se encuentra en la Pokédex. Comprueba el ID y/o nombre.");
                else 
                    alert("No se ha encontrado el servidor de Pokédex. Comprueba los datos de la API.");
                return;
            }
            if (xmlHttp.status == 400) {
                alert("Los campos introducidos son inválidos.");
                return;
            }
            else if (xmlHttp.status == 500) {
                alert("Error imprevisto: " + xmlHttp.status);
                return;
            }
        }          
    }
    xmlHttp.ontimeout = function() {
        alert("Tiempo de petición excedido");
    }
    let url = endpointPokemon + pokemon;
    xmlHttp.open("GET", url, true); // true para que sea asincrono 
    xmlHttp.send(null); // Al ser un GET no hay body
}

buscar.addEventListener('click', function() {
    let pokeNombre = document.getElementById('input-search').value;
    if (pokeNombre == "") {
        alert("Por favor, introduzca el nombre o ID de Pokémon");
        return;
    }
    buscarPokemon(pokeNombre.toLowerCase());
});

anterior.addEventListener('click', function() {
    let buscar = pokeId-1;
    if (buscar === 0) {
        alert("¡Es el primer Pokémon de la Pokédex!");
    } else {
        buscarPokemon(String(buscar));
    }
});
siguiente.addEventListener('click', function() {
    buscarPokemon(String(pokeId+1));
});

// Al cargar la web
window.onload = function () {
    // Ocultamos elementos para mostrar la pantalla incial
    document.getElementById("anterior").hidden = true;
    document.getElementById("siguiente").hidden = true;
    document.getElementById("pokedex-div").style.backgroundColor = "transparent";
    document.getElementById("pokedex-div").style.boxShadow = "none";
    document.getElementById("info").hidden = true;
    document.getElementById("search-area-div").hidden = true;
    document.getElementById("inicio-btn").addEventListener("click", iniciar);
    document.getElementById("pokemon").style.width = "auto";
    document.getElementById("pokemon").style.height = "40vh";
    pokeList();
}

function pokeList(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=900")
    .then(response => response.json())
    .then(allpokemon => {
        build(allpokemon.results)
    })
}

function convertCase(poke) {
    return poke.charAt(0).toUpperCase() + poke.slice(1);
}

function build(allpokemons) {
    var pokes = allpokemons.map(
        function(poke){ 
            return poke['name'] 
        }
    )

    let l = '';
    Object.keys(pokes).forEach(i => {
        let x = convertCase(pokes[i])
        l += `<option value="${x}"/>`;
    })
    
    lista.innerHTML = l;
}

function detectType(pokeType) {
    switch(pokeType){
        case "flying":
            return "#8899ff";

        case "bug":
            return "#628F00";

        case "poison":
            return "#706993";

        case "electric":
            return "#F5CB5C";

        case "water":
            return "#5171A5";

        case "dragon":
            return "#7766ee";

        case "normal":
            return "#5A5E5A";

        case "fire":
            return "#FF8533";

        case "fighting":
            return "#A63D40";

        case "grass":
            return "#4F9D69";

        case "ground":
            return "#96776e";

        case "psychic":
            return "#FF479A";

        case "rock":
            return "#bbaa66";

        case "ice":
            return "#86d6d8";

        case "ghost":
            return "#6666bb";

        case "dark":
            return "#775544";

        case "steel":
            return "#aaaabb";

        case "fairy":
            return "#ee99ee";
        
        default: 
            return "#495159";
    }
}