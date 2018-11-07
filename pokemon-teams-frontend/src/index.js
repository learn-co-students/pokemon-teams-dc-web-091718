const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const TRAINER_MAIN = document.querySelector('main')

document.addEventListener('DOMContentLoaded', function(){

getTrainers()

})
  function getTrainers(){

  fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(trainers => {
    render(trainers)
  }
  )}

  function render(trainers){
    trainers.forEach((trainer)=>{
      let trainerCard = document.createElement('div')
      TRAINER_MAIN.appendChild(trainerCard)
      trainerCard.setAttribute('class','card')
      trainerCard.dataset.id = trainer.id
      //-----create trainer name--------------------//
      let trainerName = document.createElement('h2')
      trainerCard.appendChild(trainerName)
      trainerName.innerHTML = trainer.name
      //-----create trainer addButton--------------------//
      let addButton = document.createElement('button')
       trainerCard.appendChild(addButton)
      addButton.setAttribute('data-trainer-id', `${trainer.id}`)
      addButton.innerHTML = 'Add Pokemon'
      addButton.addEventListener('click',function(event){
        addPokemon(event.target.dataset.trainerId)
      })

      let pokemonList = document.createElement('ul')
      trainerCard.appendChild(pokemonList)

      trainer.pokemons.map(pokemon=>{

      let pokemonLine = document.createElement('li')
      pokemonList.appendChild(pokemonLine)
      pokemonLine.innerHTML= `${pokemon.nickname} (${pokemon.species})`


      let releaseButton = document.createElement('button')
      pokemonLine.appendChild(releaseButton)
      releaseButton.innerHTML="Release"
      releaseButton.setAttribute('class','release')
      releaseButton.setAttribute('data-pokemon-id',`${pokemon.id}`)

      releaseButton.addEventListener('click',function(event){

        deletePokemon(event.target.dataset.pokemonId)

      })
      })
    })



  const addPokemon = (trainerId) => {

     fetch(`http://localhost:3000/pokemons`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({trainer_id:trainerId}),
    })

    .then(response => response.json()) // parses response to JSON
    .then(response => {
      location.reload();
    });
  }

  const deletePokemon = (pokemonId) => {
   pokemonId = event.currentTarget.dataset.pokemonId
    fetch(`http://localhost:3000/pokemons/${pokemonId}`, {
      method: "DELETE"
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      location.reload();

    })

  }

}
