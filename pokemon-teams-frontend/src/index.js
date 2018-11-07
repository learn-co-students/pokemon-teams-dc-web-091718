const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", () => {
	getTrainers();
})

function getTrainers() {
fetch("http://localhost:3000/trainers")
.then(resp => resp.json())
.then(data => {
	document.querySelector("main").innerHTML = ''
 	data.forEach(trainer => render(trainer)) }
)}

function render(trainer) {

	let div = document.createElement('div')
	div.innerHTML = `<p>${trainer.name}</p>`
	div.dataset.id = trainer.id
	div.className = "card"

	let buttonAddPokemon = document.createElement('button')
	buttonAddPokemon.innerText = "Add Pokemon"
	buttonAddPokemon.addEventListener('click', addPokemon)
	buttonAddPokemon.dataset.trainer_id = trainer.id

	let ul = document.createElement('ul')
	for(let pokemon of trainer.pokemons) {
		let listPokemon = document.createElement('li')
		listPokemon.innerText = pokemon.nickname + `(${pokemon.species})`
		let releaseButton = document.createElement('button')
		
		releaseButton.addEventListener('click', deletePokemon)
		releaseButton.className = "release"
		releaseButton.dataset.pokemon_id = pokemon.id
		releaseButton.innerText = "Release"
		listPokemon.appendChild(releaseButton)
		ul.appendChild(listPokemon)
	}
	div.appendChild(buttonAddPokemon)
	div.appendChild(ul)
	document.querySelector('main').appendChild(div)

}

function addPokemon(event) {
	// debugger
	card = event.currentTarget.parentElement

	let data= {
		"trainer_id": card.dataset.id
	}
	fetch(POKEMONS_URL, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then (resp => resp.json())
	  .then (data  => { 
	  	getTrainers()
	  })
}


function deletePokemon(event) {
	let pokemon_id = event.currentTarget.dataset.pokemon_id
	fetch(POKEMONS_URL + `/${pokemon_id}`, {
		method: "DELETE",
		headers: {
			'Content-Type' : 'application/json'
		}
	}).then (resp => resp.json())
	  .then (data  => { 
	  	getTrainers()
	  })
}



// <div class="card" data-id="1"><p>Prince</p>
//   <button data-trainer-id="1">Add Pokemon</button>
//   <ul>
//     <li>Jacey (Kakuna) <button class="release" data-pokemon-id="140">Release</button></li>
//     <li>Zachariah (Ditto) <button class="release" data-pokemon-id="141">Release</button></li>
//     <li>Mittie (Farfetch'd) <button class="release" data-pokemon-id="149">Release</button></li>
//     <li>Rosetta (Eevee) <button class="release" data-pokemon-id="150">Release</button></li>
//     <li>Rod (Beedrill) <button class="release" data-pokemon-id="151">Release</button></li>
//   </ul>
// </div>

