import { gamePlay } from "./modules/gameplay.js";

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

function displayButton() {
  downArrow1.style.display = "block";
}

// 1. The reusable 'wait' utility
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. The Typewriter Function
async function typeEffect(elementId, text, speed = 100) {
  const element = document.getElementById(elementId);
  element.innerHTML = ""; // Clear existing text

  for (let i = 0; i < text.length; i++) {
    element.innerHTML += text.charAt(i);
    await wait(speed); // This replaces the messy nested setTimeout
  }
}

async function deleteEffect(elementId, text, speed = 100) {
  const element = document.getElementById(elementId);
  const counter = text.length;
  let reducer = counter - 1;

  for (let i = counter; i > 0; i--) {
    text = text.substring(0, reducer);
    reducer--;
    element.innerHTML = text;
    await wait(speed); // This replaces the messy nested setTimeout
  }
}

const pause = (ms) => new Promise((res) => setTimeout(res, ms));

async function runSequence() {
  // First one starts
  await typeEffect("first", "Welcome aboard!", 100);

  await pause(1000);

  await deleteEffect("first", "Welcome aboard:", 100);

  await typeEffect("second", "This is RPS 2049.", 100);

  await pause(1000);

  // Only starts after 'header' is completely finished
  await typeEffect("third", "A modern classic by Dibs.", 100);

  await pause(1000);

  await displayButton();
}

runSequence();

downArrow1.addEventListener("click", () => {
  secondScreen.classList.add("secondscreen");
  (async function () {
    await pause(750);

    paragraph1.classList.add("show");

    await pause(750);

    paragraph2.classList.add("show");

    await pause(750);

    firstImage.classList.add("show");
  })();
});

upArrow.addEventListener("click", () =>
  secondScreen.classList.remove("secondscreen")
);

let screenContents = [
  {
    header: "RPS is Rock Paper Scissors",
    firstParagraph:
      "Basically the game you all love and play with your peers but on a computer and interestingly with a twist.",
    secondParagraph: "And yes the UI is beautiful too.",
    image: "mockup.png",
  },
  {
    header: "It's you Versus Mo",
    firstParagraph:
      "You get to play against Mo,our friendly interactive bot who will be disturbing a lot as you play.",
    secondParagraph:
      "You choose by clicking on the Rock Paper Scissors choice cards.",
    image: "mo.jpeg",
  },
  {
    header: "You get a Dashboard",
    firstParagraph:
      "Yeah we have a nice dashboard at the end of the game which helps with seeing how well you've played or how bad you've got your ass whooped 🤪.",
    secondParagraph: "Let's play.",
    image: "dashboard.png",
  },
];

function insertContent() {
  heading.textContent = screenContents[counter]["header"];
  paragraph1.textContent = screenContents[counter]["firstParagraph"];
  paragraph2.textContent = screenContents[counter]["secondParagraph"];
  if (counter == 1) firstImage.classList.add("robot");
  else firstImage.classList.remove("robot");
  firstImage.setAttribute("src", `images/${screenContents[counter]["image"]}`);
  if (counter == screenContents.length - 1) {
    leftArrow.style.display = "block";
    rightArrow.style.display = "none";
    downArrow2.style.display = "block";
  } else if (counter > 0) {
    leftArrow.style.display = "block";
    rightArrow.style.display = "block";
    downArrow2.style.display = "none";
    upArrow.style.display = "none";
  } else {
    upArrow.style.display = "block";
    leftArrow.style.display = "none";
    rightArrow.style.display = "block";
  }
}

async function slideScreens() {
  blocks.forEach((item) => {
    item.classList.add("switch");
  });

  await pause(200);

  insertContent();

  await pause(200);

  blocks.forEach((item) => {
    item.classList.remove("switch");
  });
}

leftArrow.addEventListener("click", function () {
  if (counter > 0) counter--;
  slideScreens();
});
rightArrow.addEventListener("click", function () {
  if (counter < screenContents.length - 1) counter++;
  slideScreens();
});
downArrow2.addEventListener("click", async function () {
  gameScreen.style.top = 0;
  await setTimeout(() => {
    avatarScreen.classList.add("avatar-switch");
  }, 3000);
  await setTimeout(() => {
    avatarScreen.classList.add("avatarblur");
  }, 4000);
});

let check = true;

avatars.forEach((item) => {
  item.addEventListener("click", async function (e) {
    // Creating a new element for the player's choice
    const playerChoice = e.target.parentElement;
    playerChoice.setAttribute("class", "player");
    const playerName = document.createElement("div");
    playerName.setAttribute("class", "playername");
    playerName.textContent = e.target.textContent;
    check ? playerChoice.lastElementChild.remove() : null;
    check = false;
    playerChoice.appendChild(playerName);

    const versusElement = document.createElement("div");
    versusElement.textContent = "VS";
    versusElement.setAttribute("class", "versus");

    // Creating a new element for the bot
    const rival = document.createElement("div");
    const rivalImage = document.createElement("img");
    const rivalName = document.createElement("div");
    rivalName.setAttribute("class", "playername");
    rivalName.textContent = "Mo.";
    rivalImage.setAttribute("src", "images/mo.jpeg");
    rival.setAttribute("class", "player");
    rival.appendChild(rivalImage);
    rival.appendChild(rivalName);

    avatarContainer.textContent = "";
    document.querySelector(".instruction").textContent = "";
    avatarContainer.style.width = "80%";

    avatarContainer.classList.add("peekaboo");

    await pause(300);

    avatarContainer.appendChild(playerChoice);
    avatarContainer.appendChild(versusElement);
    avatarContainer.appendChild(rival);

    await pause(300);

    avatarContainer.classList.remove("peekaboo");

    await pause(2000);

    avatarScreen.classList.remove("avatar-switch");
    playerProfile.setAttribute("src", playerChoice.firstElementChild.src);
  });
});

gamePlay();

// Bloop bloop bloop
