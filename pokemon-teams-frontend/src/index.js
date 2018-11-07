const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
let store = { trainers: [] }

const mainWindow = document.querySelector('main')

document.addEventListener('DOMContentLoaded', () => {
  loadTrainers()
})

let loadTrainers = function() {
  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(trainerData => displayTrainers(trainerData))
}

let displayTrainers = function(trainerData) {
  store.trainers = trainerData
  for (const trainer of trainerData) {
    renderTrainer(trainer)
  }
}

let renderTrainer = function(trainer) {
  let card = document.createElement('div')
  card.className = "card"
  card.dataset.id = trainer.id
  card.id = `trainer-${trainer.id}`

  let trainerName = document.createElement('p')
  trainerName.innerText = trainer.name

  let addPokemonButton = document.createElement('button')
  addPokemonButton.innerText = "Add Pokemon"
  addPokemonButton.dataset.trainerId = trainer.id
  addPokemonButton.addEventListener('click', addPokemon)

  let pokemonList = document.createElement('ul')

  for(const pokemon of trainer.pokemons) {
    pokemonList.appendChild(buildPokemon(pokemon))
  }

  card.appendChild(trainerName)
  card.appendChild(addPokemonButton)
  card.appendChild(pokemonList)

  mainWindow.appendChild(card)
}

let buildPokemon = function(pokemon) {
  let pokemonLi = document.createElement('li')
  pokemonLi.innerText = `${pokemon.nickname} (${pokemon.species}) `
  pokemonLi.id = `pokemon-${pokemon.id}`

  let button = document.createElement('button')
  button.innerText = "Release"
  button.className = 'release'
  button.dataset.pokemon = pokemon.id
  button.addEventListener('click', function(event) {
    deletePokemon(pokemon)
  })

  pokemonLi.appendChild(button)

  return pokemonLi
}

let deletePokemon = function(pokemon) {
  str = POKEMONS_URL + `/${pokemon.id}`
  fetch(str, {
    method: "DELETE"
  }).then(response => response.json())
  .then(function() {
    document.querySelector("#pokemon-" + pokemon.id).remove();
    removeFromStore(pokemon)
  })
}

let removeFromStore = function(pokemon) {
  let trainer = store.trainers.find(function(trainer) {
    return trainer.id === pokemon.trainer_id
  })

  trainer.pokemons = trainer.pokemons.filter(function(mon) {
    return mon.id !== pokemon.id
  })

}

let addPokemon = function(event) {
  let currentTrainer = store.trainers.find(function(trainer) {
    return trainer.id === parseInt(event.target.dataset.trainerId)
  })
  
  if (currentTrainer.pokemons.length < 6) {
    fetch(POKEMONS_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trainer_id: currentTrainer.id
      })
    }).then(response => response.json())
    .then(pokemonData => {
      addPokemonToTrainer(pokemonData)
      currentTrainer.pokemons.push(pokemonData)
    })
  }
}

let addPokemonToTrainer = function(pokemon) {
  let trainerCard = document.querySelector(`#trainer-${pokemon.trainer_id}`)
  trainerCard.children[2].appendChild(buildPokemon(pokemon))
}