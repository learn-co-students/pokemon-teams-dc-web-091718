const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


// class Trainer {
//
//   constructor(id=null,name,pokemon) {
//     this.id = id
//     this.name = name
//     this.pokemon = pokemon
//   }
//
//   render() {
//
//   }
// }

document.addEventListener("DOMContentLoaded", function()  {
  fetchTrainers()
})

function getTrainerContainer() {
  return document.querySelector('#trainer-container')
}

function fetchTrainers() {
  fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(json => {
      json.forEach(trainerData => {
        // trainer = new Trainer(trainerData.id, trainerData.name, trainerData.pokemon)
        renderTrainer(trainerData)
      })
    })
}

function renderTrainer(trainerData) {
  let main = getTrainerContainer()

  let card = document.createElement('div')
  card.dataset.id = trainerData.id
  card.className = 'card'

  let nameP = document.createElement('p')
  nameP.innerText = trainerData.name

  let addBtn = document.createElement('button')
  addBtn.dataset.trainerId = trainerData.id
  addBtn.innerText = 'Add Pokemon'
  addBtn.addEventListener('click', createPokemon);

  let list = pokemonList(trainerData.pokemons)

  card.appendChild(nameP)
  card.appendChild(addBtn)
  card.appendChild(list)

  main.appendChild(card)

}

function pokemonList(pokemonArr) {
  let list = document.createElement('ul')

  pokemonArr.forEach(pokemon => {

    list.appendChild(renderPokemon(pokemon))
  })

  return list
}

function createPokemon(event) {
  let trainerId = event.currentTarget.dataset.trainerId;
  fetch(POKEMONS_URL, {headers:
    {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({trainer_id: trainerId})
  })
  .then(res => res.json())
  .then(json => {
    appendPokemon(json)
  })
}

function appendPokemon(newPokemon) {
  let div = document.querySelector(`[data-id="${newPokemon.trainer_id}"]`);
  let ul = div.querySelector('ul');
  ul.appendChild(renderPokemon(newPokemon));
}

function renderPokemon(pokemon) {
  let item = document.createElement('li')
  item.innerText = `${pokemon.nickname} (${pokemon.species})`

  let releaseBtn = document.createElement('button')
  releaseBtn.innerText = 'Release'
  releaseBtn.className = 'release'
  releaseBtn.dataset.pokemonId = pokemon.id
  releaseBtn.addEventListener('click', deletePokemon)

  item.appendChild(releaseBtn)

  return item;
}
function deletePokemon(event) {
  let pokemon = event.target.dataset.pokemonId
  let li = event.currentTarget.parentNode
  let url = `${POKEMONS_URL}/${pokemon}`
  fetch(url, {method: "DELETE"})
  .then(res => res.json())
  .then(result => li.remove())
}
