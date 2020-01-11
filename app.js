document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll(".card-item");
  let numCards = cards.length;
  let card1 = null;
  let card2 = null;
  let cardsFlipped = 0;
  let currentScore = 0;
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
  startBtn.addEventListener("click", startGame);

  if (lowScore) {
    document.getElementById("best-score").innerText = lowScore;
  }

  function getCardColor() {
    let randomColor = Math.floor(Math.random() * 6);
    return cardColors[randomColor];
  }

  setTimeout(function() {
    for (let card of cards) {
      card.children[0].classList.add(getCardColor());
      card.addEventListener("click", handleCardClick);
      card.parentElement.classList.add("animated", "jello");
      card.classList.add("flipped");
    }
  }, 500);

  function handleCardClick(e) {
    if (!e.target.classList.contains("front")) return;

    let currentCard = e.target.parentElement;

    if (!card1 || !card2) {
      if (!currentCard.classList.contains("flipped")) {
        setScore(currentScore + 1);
      }
      currentCard.classList.add("flipped");
      card1 = card1 || currentCard;
      card2 = currentCard === card1 ? null : currentCard;
    }

    if (card1 && card2) {
      let img1 = card1.children[1].children[0].src;
      let img2 = card2.children[1].children[0].src;

      if (img1 === img2) {
        card1.parentElement.classList.add("animated", "jello");
        card2.parentElement.classList.add("animated", "jello");
        cardsFlipped += 2;
        card1.removeEventListener("click", handleCardClick);
        card2.removeEventListener("click", handleCardClick);
        card1 = null;
        card2 = null;
      } else {
        setTimeout(function() {
          card1.classList.remove("flipped");
          card2.classList.remove("flipped");
          card1 = null;
          card2 = null;
        }, 1000);
      }
    }
    if (cardsFlipped === numCards) endGame();
  }

  function startGame() {
    for (let card of cards) {
      card.classList.remove("flipped");
      card.parentElement.classList.remove("animated", "jello");
    }
    startBtn.innerText = "Shuffle";
    setScore(0);
    start.classList.add("playing");
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

  function setScore(newScore) {
    currentScore = newScore;
    document.getElementById("current-score").innerText = currentScore;
  }

  function endGame() {
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
    document.querySelector(".modal").classList.add("is-active");
  }
});
