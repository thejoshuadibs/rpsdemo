import { computerChoice } from "./computerchoice.js";

const rpsCards = document.querySelectorAll(".card");
const cardContainer = document.querySelector(".gamecards");
const gameInfo = document.querySelector(".gameinfo");
const images = ["rock.png", "paper.png", "scissors.png"];

let playerChoice;
let playerParticle;
let index = 0;

// Removed unused placeholder getComputerChoice

function compareChoices(human, computer) {
  if (
    (human == "rock" && computer == "rock") ||
    (human == "paper" && computer == "paper") ||
    (human == "scissors" && computer == "scissors")
  )
    return "tie";
  if (
    (human == "rock" && computer == "scissors") ||
    (human == "paper" && computer == "rock") ||
    (human == "scissors" && computer == "paper")
  )
    return "win";
  if (
    (human == "rock" && computer == "paper") ||
    (human == "paper" && computer == "scissors") ||
    (human == "scissors" && computer == "rock")
  )
    return "loss";
}

function displayWinner(comparison, playerElem, computerElem) {
  if (comparison == "win") {
    playerElem.classList.add("winner");
  } else if (comparison == "loss") {
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

      playerChoice = item;
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
      cardContainer.appendChild(fakeChild);

      setInterval(() => {
        choiceImage.setAttribute("src", `images/${images[index]}`);
        index == 2 ? (index = 0) : index++;
      }, 200);

      const computerResult = await computerChoice();
      cardContainer.removeChild(fakeChild);

      cardContainer.appendChild(computerResult.element);

      playerParticle = playerChoice.firstElementChild.id.trim().toLowerCase();

      // remove listeners to avoid duplicate resolves
      rpsCards.forEach((c) => c.removeEventListener("click", handler));

      resolve({
        choice: playerParticle,
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

export { compareChoices, displayWinner, gamePlay };

