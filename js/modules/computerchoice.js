const images = ["rock.png", "paper.png", "scissors.png"];
const colors = ["yellow", "green", "red"];

export function computerChoice() {
  return new Promise((resolve) => {
    const moChoice = document.createElement("div");
    const choiceImage = document.createElement("img");
    const choiceLabel = document.createElement("div");
    const realIndex = Math.floor(Math.random() * images.length);

    moChoice.className = "chosencard";
    choiceImage.className = "emoji";
    choiceLabel.className = "text";
    moChoice.append(choiceImage, choiceLabel);

    setTimeout(() => {
      choiceImage.setAttribute("src", `images/${images[realIndex]}`);
      moChoice.classList.add(colors[realIndex], "comot");
      choiceLabel.textContent = images[realIndex].split(".")[0];
      choiceLabel.style.textTransform = "capitalize";

      resolve({ element: moChoice, choice: images[realIndex].split(".")[0] });
    }, 5000);
  });
}
