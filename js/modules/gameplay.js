import { computerChoice } from "./computerchoice.js";

const rpsCards = document.querySelectorAll(".card");
const cardContainer = document.querySelector(".gamecards");
const gameInfo = document.querySelector(".gameinfo");
const images = ["rock.png", "paper.png", "scissors.png"];

const playerChoice = document.createElement("div")

const playerLife = document.querySelectorAll(".playerlife>.lifeunit");
const botLife = document.querySelectorAll(".botlife>.lifeunit");

const roundSwitch = document.createElement("button");
roundSwitch.className = "round-switch";
roundSwitch.textContent = "Next Round";
// let playerParticle;
let index = 0;

// Removed unused placeholder getComputerChoice

function compareChoices(human, computer) {
  if (
    (human == "rock" && computer == "rock") ||
    (human == "paper" && computer == "paper") ||
    (human == "scissors" && computer == "scissors")
  ) {
    console.log(playerChoice)
    return "tie";
  }
  if (
    (human == "rock" && computer == "scissors") ||
    (human == "paper" && computer == "rock") ||
    (human == "scissors" && computer == "paper")
  ) {
    console.log(playerChoice)
    return "win";
  }
  if (
    (human == "rock" && computer == "paper") ||
    (human == "paper" && computer == "scissors") ||
    (human == "scissors" && computer == "rock")
  ) {
    console.log(playerChoice)
    return "loss";
  }
}

function displayWinner(comparison, playerElem, computerElem) {
  if (comparison == "win") {
    console.log(playerChoice)
    playerElem.classList.add("winner");
  } else if (comparison == "loss") {
    console.log(playerChoice)
    computerElem.classList.add("winner");
  } else return;
}

function gamePlay() {
  return new Promise((resolve) => {
    function getColorCode(name) {
      switch (name) {
        case "yellow":
          return "#e3a852";
        case "green":
          return "#72896d";
        case "red":
          return "#e76c39";
      }
    }

    const handler = async function (e) {
      const item = e.currentTarget;
      const colorName = item.classList[item.classList.length - 1];

      const backgroundColor = getColorCode(colorName);

      // const playerChoice = document.createElement("div")
      const playerImage = document.createElement("img")
      const playerText = document.createElement("div")

      playerImage.className = "emoji"
      playerImage.src = `images/${item.firstElementChild.id.toLowerCase()}.png`

      playerText.className = "text"
      playerText.textContent = item.firstElementChild.id

      playerChoice.appendChild(playerImage)
      playerChoice.appendChild(playerText)
      playerChoice.className = "chosencard";
      playerChoice.style.backgroundColor = backgroundColor;

      const you = document.createElement("div");
      you.textContent = "You";

      const mo = document.createElement("div");
      mo.textContent = "Mo";

      gameInfo.textContent = "";
      gameInfo.appendChild(you);
      gameInfo.appendChild(mo);

      cardContainer.textContent = "";

      const fakeChild = document.createElement("div");
      const choiceImage = document.createElement("img");

      fakeChild.className = "chosencard";
      fakeChild.classList.add("mochoice");
      choiceImage.className = "emoji";

      fakeChild.appendChild(choiceImage);

      // Await the computer choice (animation + final state)
      cardContainer.appendChild(playerChoice);
      cardContainer.appendChild(roundSwitch);
      cardContainer.appendChild(fakeChild);

      setInterval(() => {
        choiceImage.setAttribute("src", `images/${images[index]}`);
        index == 2 ? (index = 0) : index++;
      }, 200);

      const computerResult = await computerChoice();
      cardContainer.removeChild(fakeChild);

      cardContainer.appendChild(computerResult.element);

      // remove listeners to avoid duplicate resolves
      rpsCards.forEach((c) => c.removeEventListener("click", handler));


      resolve({
        player: playerChoice.firstElementChild.id.trim().toLowerCase(),
        computer: computerResult.choice,
        playerElem: playerChoice,
        computerElem: computerResult.element,
      });
    };

    rpsCards.forEach((item) => {
      item.addEventListener("click", handler);
    });
  });
}


function addPoint(result) {
  let i = 4;
  let j = 0;
  if (result == "win") {
    playerLife[i].classList.add("lifeunit--win");
    i--;
  } else if (result == "loss") {
    botLife[j].classList.add("lifeunit--win");
    j++;
  } else {
    return;
  }
}

function switchRound() {
    cardContainer.textContent = "";
    rpsCards.forEach((item) => {
      cardContainer.appendChild(item);
    });
    playerElem.classList.remove("winner");
    computerElem.classList.remove("winner");
  }

roundSwitch.addEventListener("click", switchRound);

export { compareChoices, displayWinner, gamePlay, addPoint, roundSwitch };
