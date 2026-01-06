const images = ["rock.png", "paper.png", "scissors.png"];
const colors = ["yellow", "green", "red"];

const moChoice = document.createElement("div");
const choiceImage = document.createElement("img");
const choiceLabel = document.createElement("div");

const realIndex = Math.floor(Math.random() * 3);

export function computerChoice() {
  moChoice.classList.add("chosencard");
  moChoice.classList.add("mochoice");
  choiceImage.className = "emoji";
  choiceLabel.className = "text";

  moChoice.appendChild(choiceImage);

  let index = 0;

  const selectAnimation = setInterval(() => {
    choiceImage.setAttribute("src", `images/${images[index]}`);
    index == 2 ? (index = 0) : index++;
  }, 200);

  setTimeout(() => {
    clearInterval(selectAnimation);
    // choiceImage.classList.add(images[realIndex].split(".")[0])
    choiceImage.setAttribute("src", `images/${images[realIndex]}`);
    moChoice.classList.remove("mochoice");
    moChoice.classList.add(colors[realIndex]);
    moChoice.appendChild(choiceLabel);
    choiceLabel.textContent = images[realIndex].split(".")[0];
    choiceLabel.style.textTransform = "capitalize";
  }, 5000);

  debugger;

  return moChoice;
}

export const gwara = images[realIndex].split(".")[0];
