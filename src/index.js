document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollection = document.querySelector("#toy-collection")
  const addToyForm = document.querySelector(".add-toy-form")
  let addToy = false

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      // submit listener here
    } else {
      toyForm.style.display = 'none'
    }
  })

  fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(function (json) {
    const toys = json
    console.log(toys)
    toys.forEach(function (toy){
      //create elements
      const toyCard = document.createElement("div")
      toyCard.className = "card"
      toyCard.dataset.id = toy.id
      const toyName = document.createElement("h2")
      const toyImg = document.createElement("img")
      toyImg.className = "toy-avatar"
      const likes = document.createElement("p")
      const likeButton = document.createElement("button")
      likeButton.innerText = "Like"
      likeButton.className = "like-btn"

      //add data to elements
      toyName.innerText = toy.name
      toyImg.src = toy.image
      likes.innerText = toy.likes

      //add data to dom
      toyCard.append(toyName, toyImg, likes, likeButton)
      toyCollection.append(toyCard)

      //event listener for button
      likeButton.addEventListener("click", increaseCount)

    })//forEach, getting data on the dom

  }) //GET FETCH

  //create new toy
  addToyForm.addEventListener("submit", function (event) {
    event.preventDefault()

    //queried fields that take input
    const newToyName = document.querySelector("[name=name]")
    const newToyPic = document.querySelector("[name=image]")

    // make a fetch POST
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name: newToyName.value, image: newToyPic.value, likes: 0})
    })
    .then(resp => resp.json())
    .then(function (json) {
      const toy = json
      //create elements
      const newToyCard = document.createElement("div")
      newToyCard.className = "card"
      newToyCard.dataset.id = toy.id
      const newTName = document.createElement("h2")
      const newTImg = document.createElement("img")
      newTImg.className = "toy-avatar"
      const newLikes = document.createElement("p")
      const newLikeButton = document.createElement("button")
      newLikeButton.innerText = "Like"
      newLikeButton.className = "like-btn"

      //add input to elements
      newTName.innerText = newToyName.value
      newTImg.src = newToyPic.value
      newLikes.innerText = toy.likes

      //add data to dom
      newToyCard.append(newTName, newTImg, newLikes, newLikeButton)
      toyCollection.append(newToyCard)
      newLikeButton.addEventListener("click", increaseCount)
    })
    //how to add id to div if the toy hasn't been created yet???
  })

  //function for the button (add to newLikeButton)
  function increaseCount(event) {
    let id = event.target.parentNode.dataset.id
    let upLikes = event.target.parentNode.children[2]
    upLikes.innerText = parseInt(upLikes.innerText) + 1

    //fetch PATCH to update database
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({likes: upLikes.innerText})
    })
  }

})
