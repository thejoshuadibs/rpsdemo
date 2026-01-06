import { computerChoice, gwara } from "./computerchoice.js";

const rpsCards = document.querySelectorAll(".card");
const cardContainer = document.querySelector(".gamecards");
const gameInfo = document.querySelector(".gameinfo");

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

export async function gamePlay() {
  rpsCards.forEach((item) => {
    item.addEventListener("click", function (e) {
      const colorName = item.classList[item.classList.length - 1];

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

      const backgroundColor = getColorCode(colorName);

      const playerChoice = e.currentTarget;
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

      function displayWinner(comparison) {
        if (comparison == "win") {
          playerChoice.classList.add("winner");
        } else if (comparison == "loss") {
          computerChoice().classList.add("winner");
        } else return;
      }

      cardContainer.appendChild(playerChoice);
      cardContainer.appendChild(computerChoice());

      displayWinner(
        compareChoices(
          playerChoice.firstElementChild.id.trim().toLowerCase(),
          gwara.trim().toLowerCase()
        )
      );
    });
  });
}

//
