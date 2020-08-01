/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault();
  if(document.getElementById("welcome") !== null){
    document.getElementById("welcome").remove();
  }
  let form = event.target;
  let catId = generateId();
  let catName = form.name.value;
  let catMood = "tolerant";
  let catAffection = 5;
  let newKitten = {id: catId, name: catName, mood: catMood, affection: catAffection}
  let duplicate = false; 
  for(let i = 0; i < kittens.length; i++){
    if(newKitten.name === kittens[i].name){
      alert("Kitten cannot have the same name as an existing kitten.");
      duplicate = true;
    }  
  }
  if(!duplicate){
  kittens.push(newKitten);
  saveKittens();
  form.reset();
  }
  saveKittens();
  form.reset();
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens",JSON.stringify(kittens));
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittensData = JSON.parse(window.localStorage.getItem("kittens"))
  console.log(kittensData)
  if(kittensData && kittensData.length !== 0){
    kittens = kittensData
    document.getElementById("purge").classList.remove("hidden");
  };
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template ="";
  kittens.forEach(kitten =>{
    template+=`
    <div class="card d-flex flex-wrap shadow bg-dark m-2 container">
      <div id =${kitten.id} class ="container d-flex justify-content-center kitten ${kitten.mood}">  
        <img src="https://robohash.org/${kitten.name}.png?set=set4">
      </div>
      <div class = "text-danger text-center ${kitten.affection > 0 ? 'hidden': ''}">Woe to you mortal!  Doom has come to your kitten, ${kitten.name}!
      </div>
      <div class = "d-flex flex-wrap ${kitten.affection === 0 ? 'hidden' : ''}">
        <ul>
        <li class="container m-2 d-flex">
          <label class="text-light m-1" for="name">Name:</label>
          <p id="${kitten.id}-name" class="text-light " name="name">${kitten.name}</p>
        </li>
        <li class="container m-2 d-flex">  
          <label class="text-light m-1" for="mood">Mood:</label>
          <p id="${kitten.id}-mood" class="text-light" name="mood">${kitten.mood}</p>
        </li>
        <li class="container m-2 d-flex">  
          <label class="text-light m-1" for="affection">Affection:</label>
          <p id="${kitten.id}-affection" class="text-light" name="affection">${kitten.affection}</p>
        </li>
        <li class="container d-flex space-between">
          <button class="pet btn-cancel m-1" onclick="pet('${kitten.id}')">Pet</button>
          <button class="button btn-green m-1" onclick="catnip('${kitten.id}')">Catnip</button>
        </li>
        </ul>
      </div> 
    </div>
    `
    document.getElementById("kittens").innerHTML = template;
  })
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find(kitten => kitten.id === id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let index = kittens.findIndex(kitten => kitten.id === id);
  let petCheck = Math.random();
  console.log(petCheck);
  if(kittens[index].affection > 0){ 
    petCheck > .7 ? kittens[index].affection += 1 : kittens[index].affection -= 1;
    if(kittens[index].affection === 0){
      console.log("Runaway little girl!");
      setKittenMood(findKittenById(id));
      //TODO runaway state add runaway elements to HTML, change text, change picture, remove buttons
    } 
  }
  setKittenMood(findKittenById(id));
  saveKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let index = kittens.findIndex(kitten => kitten.id === id);
  kittens[index].mood = "tolerant";
  kittens[index].affection = 5
  setKittenMood(findKittenById(id));
  saveKittens();
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  console.log(kitten);
  let kittenAffection = kitten.affection
  switch(true){
    case kittenAffection === 0:
      kitten.mood = "gone"
      break;
    case kittenAffection <= 3:
      kitten.mood = "angry"
      break;
    case kittenAffection <= 5:
      kitten.mood = "tolerant"
      break;
    case kittenAffection > 6:
      kitten.mood = "happy"
      break;
  }
}

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

function purgeKittens(){
  document.getElementById("purge").remove();
  localStorage.removeItem("kittens");
  kittens = []
  loadKittens();
  saveKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

loadKittens();
let lengthOfKittens = kittens.length
document.getElementById('purge').innerHTML = "Purge "+lengthOfKittens+" kittens."

