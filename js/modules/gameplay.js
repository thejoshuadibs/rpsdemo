import { computerChoice } from "./computerchoice.js";

const rpsCards = Array.from(document.querySelectorAll(".card"));
const cardContainer = document.querySelector(".gamecards");
const gameInfo = document.querySelector(".gameinfo");
const roundLabel = document.querySelector(".round");
const playerLife = Array.from(document.querySelectorAll(".playerlife > .lifeunit"));
const botLife = Array.from(document.querySelectorAll(".botlife > .lifeunit"));

const roundSwitch = document.createElement("button");
roundSwitch.type = "button";
roundSwitch.className = "round-switch";
roundSwitch.textContent = "Next Round";

let round = 1;
let playerScore = 0;
let botScore = 0;
let acceptingChoice = true;

function compareChoices(human, computer) {
  if (human === computer) return "tie";

  const winningChoices = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

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
  } else {
    botLife[botScore]?.classList.add("lifeunit--win");
    botScore = Math.min(botScore + 1, botLife.length);
  }
}

function resetMatch() {
  round = 1;
  playerScore = 0;
  botScore = 0;

  [...playerLife, ...botLife].forEach((unit) => {
    unit.classList.remove("lifeunit--win");
  });

  if (roundLabel) roundLabel.textContent = "ROUND 1";
  roundSwitch.textContent = "Next Round";
  roundSwitch.onclick = null;
  switchRound();
  startRound();
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

      cardContainer.replaceChildren(playerChoice, roundSwitch);

      const computerResult = await computerChoice();
      cardContainer.replaceChildren(playerChoice, roundSwitch, computerResult.element);

      resolve({
        player: choice,
        computer: computerResult.choice,
        playerElem: playerChoice,
        computerElem: computerResult.element,
      });
    };

    rpsCards.forEach((item) => item.addEventListener("click", handler));
  });
}

function switchRound() {
  cardContainer?.replaceChildren(...rpsCards);
  document.querySelectorAll(".winner").forEach((element) => {
    element.classList.remove("winner");
  });
  gameInfo && (gameInfo.textContent = "Choose One:");
}

let nextRoundHandler;

function startRound() {
  if (!roundLabel) return;
  roundLabel.textContent = `ROUND ${round}`;

  switchRound();
  if (roundSwitch.isConnected) roundSwitch.remove();

  nextRoundHandler = async () => {
    if (playerScore >= playerLife.length || botScore >= botLife.length) {
      resetMatch();
      return;
    }

    round += 1;
    roundLabel.textContent = `ROUND ${round}`;
    switchRound();
    await runGameLoop();
  };

  roundSwitch.onclick = nextRoundHandler;
}

async function runGameLoop() {
  const { player, computer, playerElem, computerElem } = await gamePlay();
  if (!player || !computer) return;

  const result = compareChoices(player, computer);
  displayWinner(result, playerElem, computerElem);
  addPoint(result);

  if (playerScore >= playerLife.length || botScore >= botLife.length) {
    const winner = playerScore >= playerLife.length ? "You win!" : "Mo wins!";
    gameInfo.textContent = winner;
    roundSwitch.textContent = "Play Again";
  }

  roundSwitch.style.animationPlayState = "running";
}

export {
  compareChoices,
  displayWinner,
  gamePlay,
  addPoint,
  roundSwitch,
  startRound,
  switchRound,
  resetMatch,
  runGameLoop,
};
