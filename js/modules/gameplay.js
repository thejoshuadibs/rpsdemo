import { computerChoice } from "./computerchoice.js";

const choices = ["rock", "paper", "scissors"];
const rpsCards = Array.from(document.querySelectorAll(".card"));
const cardContainer = document.querySelector(".gamecards");
const gameInfo = document.querySelector(".gameinfo");
const roundLabel = document.querySelector(".round");
const playerLife = Array.from(document.querySelectorAll(".playerlife > .lifeunit"));
const botLife = Array.from(document.querySelectorAll(".botlife > .lifeunit"));
const images = ["rock.png", "paper.png", "scissors.png"];

const roundSwitch = document.createElement("button");
roundSwitch.type = "button";
roundSwitch.className = "round-switch";
roundSwitch.textContent = "Next Round";

let round = 1;
let playerScore = 0;
let botScore = 0;
let acceptingChoice = true;
let imageIndex = 0;

function compareChoices(human, computer) {
  if (!choices.includes(human) || !choices.includes(computer)) return undefined;
  if (human === computer) return "tie";

  const winningChoices = { rock: "scissors", paper: "rock", scissors: "paper" };
  return winningChoices[human] === computer ? "win" : "loss";
}

function displayWinner(comparison, playerElem, computerElem) {
  playerElem?.classList.remove("winner");
  computerElem?.classList.remove("winner");
  if (comparison === "win") playerElem?.classList.add("winner");
  if (comparison === "loss") computerElem?.classList.add("winner");
}

function addPoint(result) {
  if (result === "tie") return;
  if (result === "win") {
    playerLife[playerScore]?.classList.add("lifeunit--win");
    playerScore = Math.min(playerScore + 1, playerLife.length);
  } else if (result === "loss") {
    botLife[botScore]?.classList.add("lifeunit--win");
    botScore = Math.min(botScore + 1, botLife.length);
  }
}

function getColorName(card) {
  return ["yellow", "green", "red"].find((color) => card.classList.contains(color));
}

function gamePlay() {
  return new Promise((resolve) => {
    if (!cardContainer || !gameInfo) {
      resolve({ player: null, computer: null, playerElem: null, computerElem: null });
      return;
    }

    acceptingChoice = true;
    const handler = async (event) => {
      if (!acceptingChoice) return;
      acceptingChoice = false;

      const card = event.currentTarget;
      const image = card.querySelector("img");
      const choice = image?.id?.trim().toLowerCase();
      if (!choices.includes(choice)) {
        acceptingChoice = true;
        return;
      }

      rpsCards.forEach((item) => item.removeEventListener("click", handler));
      const playerChoice = document.createElement("div");
      const playerImage = document.createElement("img");
      const playerText = document.createElement("div");
      playerImage.className = "emoji";
      playerImage.src = `images/${choice}.png`;
      playerImage.alt = `${choice} hand`;
      playerText.className = "text";
      playerText.textContent = choice[0].toUpperCase() + choice.slice(1);
      playerChoice.className = `chosencard ${getColorName(card) || ""}`;
      playerChoice.append(playerImage, playerText);

      gameInfo.replaceChildren(
        Object.assign(document.createElement("div"), { textContent: "You" }),
        Object.assign(document.createElement("div"), { textContent: "Mo" }),
      );

      const fakeChild = document.createElement("div");
      const choiceImage = document.createElement("img");
      fakeChild.className = "chosencard mochoice";
      choiceImage.className = "emoji";
      fakeChild.appendChild(choiceImage);
      roundSwitch.disabled = true;
      roundSwitch.style.animationPlayState = "paused";
      cardContainer.replaceChildren(playerChoice, fakeChild);

      const animation = setInterval(() => {
        choiceImage.setAttribute("src", `images/${images[imageIndex]}`);
        imageIndex = (imageIndex + 1) % images.length;
      }, 200);

      let computerResult;
      try {
        computerResult = await computerChoice();
      } finally {
        clearInterval(animation);
      }

      // Display Mo's final choice first. The next-round button is added after
      // this promise resolves and the result has been rendered.
      cardContainer.replaceChildren(playerChoice, computerResult.element);
      roundSwitch.disabled = false;
      resolve({ player: choice, computer: computerResult.choice, playerElem: playerChoice, computerElem: computerResult.element });
    };

    rpsCards.forEach((item) => item.addEventListener("click", handler));
  });
}

function switchRound() {
  cardContainer?.replaceChildren(...rpsCards);
  document.querySelectorAll(".winner").forEach((element) => element.classList.remove("winner"));
  if (gameInfo) gameInfo.textContent = "Choose One:";
}

function startRound() {
  if (!roundLabel) return;
  roundLabel.textContent = `ROUND ${round}`;
  switchRound();
  roundSwitch.textContent = "Next Round";
  roundSwitch.onclick = async () => {
    if (playerScore >= playerLife.length || botScore >= botLife.length) {
      resetMatch();
      return;
    }
    round += 1;
    roundLabel.textContent = `ROUND ${round}`;
    switchRound();
    await runGameLoop();
  };
  void runGameLoop();
}

function resetMatch() {
  round = 1;
  playerScore = 0;
  botScore = 0;
  [...playerLife, ...botLife].forEach((unit) => unit.classList.remove("lifeunit--win"));
  if (roundLabel) roundLabel.textContent = "ROUND 1";
  startRound();
}

async function runGameLoop() {
  const { player, computer, playerElem, computerElem } = await gamePlay();
  if (!player || !computer) return;
  const result = compareChoices(player, computer);
  displayWinner(result, playerElem, computerElem);
  addPoint(result);
  if (playerScore >= playerLife.length || botScore >= botLife.length) {
    gameInfo.textContent = playerScore >= playerLife.length ? "You win!" : "Mo wins!";
    roundSwitch.textContent = "Play Again";
  } else {
    roundSwitch.textContent = "Next Round";
  }

  // Insert the button only once the computer's selected card is on screen,
  // then start its CSS animation on the next frame.
  roundSwitch.style.animationPlayState = "paused";
  cardContainer.appendChild(roundSwitch);
  requestAnimationFrame(() => {
    roundSwitch.style.animationPlayState = "running";
  });
}

export { compareChoices, displayWinner, gamePlay, addPoint, roundSwitch, startRound, switchRound, resetMatch, runGameLoop };
