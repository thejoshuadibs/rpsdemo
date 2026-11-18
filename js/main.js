import {
  gamePlay,
  compareChoices,
  displayWinner,
  addPoint,
  roundSwitch,
  startRound,
} from "./modules/gameplay.js";

const requiredElements = [
  ".downarrow1", ".downarrow2", ".uparrow", ".rightarrow", ".leftarrow",
  ".onboarding2", ".gamecontainer", ".avatarchoice", ".heading",
  ".paragraph1", ".paragraph2", ".firstimage", ".avatars", ".playerprofile",
];

const missing = requiredElements.filter((selector) => !document.querySelector(selector));
if (missing.length) {
  console.error(`Missing required page elements: ${missing.join(", ")}`);
}

const downArrow1 = document.querySelector(".downarrow1");
const downArrow2 = document.querySelector(".downarrow2");
const upArrow = document.querySelector(".uparrow");
const rightArrow = document.querySelector(".rightarrow");
const leftArrow = document.querySelector(".leftarrow");
const secondScreen = document.querySelector(".onboarding2");
const gameScreen = document.querySelector(".gamecontainer");
const avatarScreen = document.querySelector(".avatarchoice");
const heading = document.querySelector(".heading");
const paragraph1 = document.querySelector(".paragraph1");
const paragraph2 = document.querySelector(".paragraph2");
const firstImage = document.querySelector(".firstimage");
const blocks = document.querySelectorAll(".block");
const avatars = document.querySelectorAll(".avatar");
const avatarContainer = document.querySelector(".avatars");
const playerProfile = document.querySelector(".playerprofile");

let counter = 0;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function displayButton() {
  if (downArrow1) downArrow1.style.display = "block";
}

async function typeEffect(elementId, text, speed = 100) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = "";

  for (const character of text) {
    element.textContent += character;
    await pause(speed);
  }
}

async function deleteEffect(elementId, text, speed = 100) {
  const element = document.getElementById(elementId);
  if (!element) return;

  for (let length = text.length - 1; length >= 0; length--) {
    element.textContent = text.slice(0, length);
    await pause(speed);
  }
}

async function runSequence() {
  await typeEffect("first", "Welcome aboard!", 100);
  await pause(1000);
  await deleteEffect("first", "Welcome aboard:", 100);
  await typeEffect("second", "This is RPS 2049.", 100);
  await pause(1000);
  await typeEffect("third", "A modern classic by Dibs.", 100);
  await pause(1000);
  displayButton();
}

runSequence();

downArrow1?.addEventListener("click", () => {
  secondScreen?.classList.add("secondscreen");
  (async () => {
    await pause(750);
    paragraph1?.classList.add("show");
    await pause(750);
    paragraph2?.classList.add("show");
    await pause(750);
    firstImage?.classList.add("show");
  })();
});

upArrow?.addEventListener("click", () => secondScreen?.classList.remove("secondscreen"));

const screenContents = [
  {
    header: "RPS is Rock Paper Scissors",
    firstParagraph: "Basically the game you all love and play with your peers but on a computer and interestingly with a twist.",
    secondParagraph: "And yes the UI is beautiful too.",
    image: "mockup.png",
  },
  {
    header: "It's you Versus Mo",
    firstParagraph: "You get to play against Mo, our friendly interactive bot.",
    secondParagraph: "You choose by clicking on the Rock, Paper, or Scissors cards.",
    image: "mo.jpeg",
  },
  {
    header: "You get a Dashboard",
    firstParagraph: "See how well you play across the match.",
    secondParagraph: "Let's play.",
    image: "dashboard.png",
  },
];

function insertContent() {
  const content = screenContents[counter];
  if (!content) return;

  if (heading) heading.textContent = content.header;
  if (paragraph1) paragraph1.textContent = content.firstParagraph;
  if (paragraph2) paragraph2.textContent = content.secondParagraph;
  firstImage?.classList.toggle("robot", counter === 1);
  firstImage?.setAttribute("src", `images/${content.image}`);

  if (counter === screenContents.length - 1) {
    if (leftArrow) leftArrow.style.display = "block";
    if (rightArrow) rightArrow.style.display = "none";
    if (downArrow2) downArrow2.style.display = "block";
  } else if (counter > 0) {
    if (leftArrow) leftArrow.style.display = "block";
    if (rightArrow) rightArrow.style.display = "block";
    if (downArrow2) downArrow2.style.display = "none";
    if (upArrow) upArrow.style.display = "none";
  } else {
    if (upArrow) upArrow.style.display = "block";
    if (leftArrow) leftArrow.style.display = "none";
    if (rightArrow) rightArrow.style.display = "block";
  }
}

async function slideScreens() {
  blocks.forEach((item) => item.classList.add("switch"));
  await pause(200);
  insertContent();
  await pause(200);
  blocks.forEach((item) => item.classList.remove("switch"));
}

leftArrow?.addEventListener("click", () => {
  if (counter > 0) {
    counter--;
    slideScreens();
  }
});

rightArrow?.addEventListener("click", () => {
  if (counter < screenContents.length - 1) {
    counter++;
    slideScreens();
  }
});

downArrow2?.addEventListener("click", async () => {
  if (gameScreen) gameScreen.style.top = "0";
  await pause(2000);
  avatarScreen?.classList.add("avatar-switch");
  await pause(1000);
  avatarScreen?.classList.add("avatarblur");
});

let avatarSelected = false;

avatars.forEach((item) => {
  item.addEventListener("click", async (event) => {
    if (avatarSelected) return;
    avatarSelected = true;

    const source = event.currentTarget.querySelector("img");
    const name = event.currentTarget.querySelector(".name")?.textContent || "Player";
    if (!source || !avatarContainer) return;

    const playerChoice = document.createElement("div");
    playerChoice.className = "player";

    const playerImage = source.cloneNode();
    const playerName = document.createElement("div");
    playerName.className = "playername";
    playerName.textContent = name;
    playerChoice.append(playerImage, playerName);

    const versusElement = document.createElement("div");
    versusElement.className = "versus";
    versusElement.textContent = "VS";

    const rival = document.createElement("div");
    rival.className = "player";
    const rivalImage = document.createElement("img");
    rivalImage.src = "images/mo.jpeg";
    rivalImage.alt = "Mo, the robot opponent";
    const rivalName = document.createElement("div");
    rivalName.className = "playername";
    rivalName.textContent = "Mo.";
    rival.append(rivalImage, rivalName);

    avatarContainer.classList.add("peekaboo");
    await pause(300);
    avatarContainer.replaceChildren(playerChoice, versusElement, rival);
    avatarContainer.style.width = "80%";

    await pause(300);
    avatarContainer.classList.remove("peekaboo");
    await pause(2000);

    avatarScreen?.classList.remove("avatar-switch");
    if (playerProfile) playerProfile.src = playerImage.src;

    startRound();
  });
});

async function playGame() {
  const { player, computer, playerElem, computerElem } = await gamePlay();
  if (!player || !computer) return;

  const result = compareChoices(player, computer);
  displayWinner(result, playerElem, computerElem);
  addPoint(result);
  roundSwitch.style.animationPlayState = "running";
}

void playGame;
