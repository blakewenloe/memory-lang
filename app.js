// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".card-item");
  let numCards = cards.length;
  let card1 = null;
  let card2 = null;
  let cardsFlipped = 0;
  let currentScore = 0;
  // Get lowest score from localstorage
  let lowScore = localStorage.getItem("low-score");
  let startBtn = document.getElementById("start-button");
  let cardColors = [
    "has-background-primary",
    "has-background-info",
    "has-background-link",
    "has-background-success",
    "has-background-warning",
    "has-background-danger"
  ];
  // Add click listener for start button
  startBtn.addEventListener("click", startGame);
  
  // Set the low score on the DOM
  if (lowScore) {
    document.getElementById("best-score").innerText = lowScore;
  }
  // Get random color for game cards
  function getCardColor() {
    let randomColor = Math.floor(Math.random() * 6);
    return cardColors[randomColor];
  }

  // Wait one 500ms and then animate the cards into view
  setTimeout(function() {
    for (let card of cards) {
      // Assign random color to back of card
      card.children[0].classList.add(getCardColor());
      // Add click listener to each card
      card.addEventListener("click", handleCardClick);
      // Add animations
      card.parentElement.classList.add("animated", "jello");
      card.classList.add("flipped");
    }
  }, 500);

  // Flip card and check if it matches the previous card
  function handleCardClick(e) {
    // If the card is already flipped, return.
    if (!e.target.classList.contains("front")) return;
    
    let currentCard = e.target.parentElement;
    // If no cards are being compared and clicked card is not flipped, add +1 to score
    if (!card1 || !card2) {
      if (!currentCard.classList.contains("flipped")) {
        setScore(currentScore + 1);
      }
      // Add flipped class to clicked card
      currentCard.classList.add("flipped");
      // Set card1 to current card for comparison
      card1 = card1 || currentCard;
      // If current card does not = card1, set card2 to current card
      card2 = currentCard === card1 ? null : currentCard;
    }
    // If two cards are flipped, make the comparison
    if (card1 && card2) {
      let img1 = card1.children[1].children[0].src;
      let img2 = card2.children[1].children[0].src;
      // If card images match, animate and remove click listeners
      if (img1 === img2) {
        card1.parentElement.classList.add("animated", "jello");
        card2.parentElement.classList.add("animated", "jello");
        cardsFlipped += 2;
        card1.removeEventListener("click", handleCardClick);
        card2.removeEventListener("click", handleCardClick);
        // Reset card1 and card2 values
        card1 = null;
        card2 = null;
      } else {
        // If cards don't match, flip them back over
        setTimeout(function() {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          card1 = null;
          card2 = null;
        }, 1000);
      }
    }
    // If we've flipped all cards, end the game.
    if (cardsFlipped === numCards) endGame();
  }
  
  // Initialize the board
  function startGame() {
    // Flip cards to their back
    for (let card of cards) {
      card.classList.remove("flipped");
      card.parentElement.classList.remove("animated", "jello");
    }
    // Change start button to shuffle button
    startBtn.innerText = "Shuffle";
    // Reset score
    setScore(0);
    start.classList.add("playing");
    // Generate pairs of cards
    let indices = [];
    for (let i = 1; i <= numCards / 2; i++) {
      indices.push(i.toString());
    }
    let pairs = shuffle(indices.concat(indices));
    for (let i = 0; i < cards.length; i++) {
      let path = "imgs/" + pairs[i] + ".png";
      cards[i].children[1].children[0].src = path;
    }
  }
  
  // Shuffle cards
  function shuffle(array) {
    let arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      let idx2 = Math.floor(Math.random() * (idx1 + 1));
      let temp = arrayCopy[idx1];
      arrayCopy[idx1] = arrayCopy[idx2];
      arrayCopy[idx2] = temp;
    }
    return arrayCopy;
  }
  // Update score
  function setScore(newScore) {
    currentScore = newScore;
    document.getElementById("current-score").innerText = currentScore;
  }
  // End the game
  function endGame() {
    // Set final score
    let scoreHeader = document.querySelector("#final-score");
    let closeModal = document.querySelector("#close");
    closeModal.addEventListener("click", function() {
      document.querySelector(".modal").classList.remove("is-active");
    });
    scoreHeader.innerText = "Your score: " + currentScore;
    let lowScore = +localStorage.getItem("low-score") || Infinity;
    if (currentScore < lowScore) {
      scoreHeader.innerText += " - NEW BEST SCORE!!";
      localStorage.setItem("low-score", currentScore);
    }
    // Show end of game modal with scores
    document.querySelector(".modal").classList.add("is-active");
  }
});
