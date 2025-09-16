const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
let offset = 0;
const limit = 20;
let arrayPkm = [];
let currentIndex = 0;

async function pkm() {
  showSpinner(); 
  try {
    await loadPkm(limit, offset);
    renderPkm();
  } catch (error) {
    console.log("Fehler beim Laden der Daten:", error);
  } finally {
    hideSpinner(); 
  }
}

async function loadPkm(limit, offset) {
  try {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    const pokemonDetailsPromises = data.results.map(pokemon => getPkmDetails(pokemon.url));
    arrayPkm = await Promise.all(pokemonDetailsPromises);
  } catch (error) {
    console.log("Fehler beim Laden der Daten:", error);
  }
}

async function getPkmDetails(url) {
  const response = await fetch(url);
  const pokemonDetails = await response.json();
  return pokemonDetails;
}

function renderPkm() {
  const content = document.getElementById("content");
  content.innerHTML = arrayPkm.map((pokemon, i) => showPkm(pokemon, i)).join('');
}

async function addMore() {
  showSpinner();
  try {
    offset += limit;
    await loadPkm(limit, offset);
    renderPkm();
  } catch (error) {
    console.log("Fehler beim Laden der Daten:", error);
  } finally {
    hideSpinner();
  }
}

function PkmType(pokemon) {
  const type = pokemon.types[0].type.name;
  const secondType = pokemon.types[1] ? pokemon.types[1].type.name : null;
  const typeClass = `type-${type}`;
  const secondTypeClass = secondType ? `type-${secondType}` : '';
  const combinedTypeClass = secondType ? `type-${type}-${secondType}` : typeClass;
  
  return { type, secondType, typeClass, secondTypeClass, combinedTypeClass };
}

function capitalLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function openOverlayCard(index) {
  const pokemon = arrayPkm[index];
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = getStatistic(pokemon, index);
  overlay.style.display = "flex";
  document.body.classList.add("no-scroll");
}

function closeOverlayCard() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  overlay.innerHTML = "";
  document.body.classList.remove("no-scroll");
}

function navigatePkm(id) {
  let newIndex;
  if (id < arrayPkm[0].id) {
    newIndex = arrayPkm.length - 1;
  } else if (id > arrayPkm[arrayPkm.length - 1].id) {
    newIndex = 0;
  } else {
    newIndex = arrayPkm.findIndex((pokemon) => pokemon.id === id);
  }

  openOverlayCard(newIndex);
}


async function searchPkm(searchInput) {
  showSpinner(); 
  try {
    const allPokemon = await fetchAllPokemon();
    const filteredPkm = await filterPokemonByName(allPokemon, searchInput);
    if (filteredPkm.length === 0) {
      showMessage("allert-box-2");
      return;
    }
    arrayPkm = filteredPkm;
    renderPkm();
  } catch (error) {
    console.log("Fehler beim Laden der Daten:", error);
  } finally {
    hideSpinner();  
  }
}

async function fetchAllPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=800");
  const data = await response.json();
  return data.results;
}

async function filterPokemonByName(allPokemon, searchInput) {
  const filteredPkm = [];
  for (const pokemon of allPokemon) {
    const pokemonDetails = await getPkmDetails(pokemon.url);
    if (pokemonDetails.name.toLowerCase().includes(searchInput.toLowerCase())) {
      filteredPkm.push(pokemonDetails);
    }
  }
  return filteredPkm;
}

function showMessage(messageBoxId) {
  const messageBox = document.getElementById(messageBoxId).parentElement;
  messageBox.classList.remove("d-none");
}

function searchAllPkm() {
  const searchInput = document.getElementById("search").value.trim();
  
  if (searchInput.length < 3) {
    const messageBox = document.getElementById("allert-box").parentElement;
    messageBox.classList.remove("d-none");
    return;
  }

  const messageBox = document.getElementById("allert-box").parentElement;
  messageBox.classList.add("d-none");

  searchPkm(searchInput);
}

function resetSearch() {
  document.getElementById("search").value = "";
  arrayPkm = [];
  offset = 0;
  pkm();
}


function showPkm(pokemon, i) {
    const { type, secondType, typeClass, secondTypeClass, combinedTypeClass } = PkmType(pokemon);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  
    return `
      <div class="pkm-cards ${combinedTypeClass}" onclick="openOverlayCard(${i})">
        <div class="pkm-names">
          <div class="pkm-id"><h1>#${String(pokemon.id).padStart(3, '0')}</h1></div> 
          <div class="pkm-name"><h1>${capitalLetter(pokemon.name)}</h1> </div>
        </div>
        <div class="pkm-images ${combinedTypeClass}">
          <img src="${imageUrl}" alt="${pokemon.name} Bilder der Pokémon"/>
        </div>
        <div class="pkm-types">
          <div class="pkm-type ${typeClass}">
            <p>${capitalLetter(type)}</p>
            <img src="./img/${type}.png" alt="${type} Typen der Pokémon" class="pkm-type-icon">
          </div>
          ${secondType ? ` 
            <div class="pkm-type ${secondTypeClass}">
              <img src="./img/${secondType}.png" alt="${secondType} Typen der Pokémon" class="pkm-type-icon">
              <p>${capitalLetter(secondType)}</p>
            </div>` : "" }
        </div>
      </div>
    `;
  }
  


function getStatistic(pokemon) {
  const { combinedTypeClass } = PkmType(pokemon);

  function calculateStatWidth(statValue, maxValue) {
    return Math.min((statValue / maxValue) * 100, 100);
  }

  const maxStatValue = 255;

  return `
    <div class="overlay-pkm">
      <div class="overlay-names">
        <h1>#${pokemon.id}</h1>
        <h1>${capitalLetter(pokemon.name)}</h1> <!-- Entferne germanName -->
        <img onclick="closeOverlayCard()" class="close" src="./img/x.webp">
      </div>
      <div class="overplay-img ${combinedTypeClass}">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
        <table class="stats-table-overlay">
          ${pokemon.stats.map(stat => `
            <tr>
              <td><strong>${stat.stat.name}:</strong></td>
              <td>
                <div class="stat-bar" style="width: ${calculateStatWidth(stat.base_stat, maxStatValue)}%"></div>
              </td>
              <td class="stat-value-column">${stat.base_stat}</td>
            </tr>`).join('')}
        </table>
      </div>
      <div class="arrow-icons">
        <img id="arrow-left" class="arrow-left" src="./img/arrow_left.png" onclick="navigatePkm(${pokemon.id - 1})">
        <img id="arrow-right" class="arrow-right" src="./img/arrow_right.png" onclick="navigatePkm(${pokemon.id + 1})">
      </div>
    </div>
  `;
}


function showSpinner() {
    document.getElementById("loading-spinner").style.display = "flex"; 
    document.getElementById("loading-container").style.display = "flex"; 
}

function hideSpinner() {
    document.getElementById("loading-container").style.display = "none"; 
}
