const images = ["rock.png", "paper.png", "scissors.png"];
const colors = ["yellow", "green", "red"];

export function computerChoice() {
  return new Promise((resolve) => {
    const moChoice = document.createElement("div");
    const choiceImage = document.createElement("img");
    const choiceLabel = document.createElement("div");

    const realIndex = Math.floor(Math.random() * 3);

    moChoice.className = "chosencard";
    moChoice.classList.add("mochoice");
    choiceImage.className = "emoji";
    choiceLabel.className = "text";

    moChoice.appendChild(choiceImage);
    moChoice.appendChild(choiceLabel);

    // let index = 0;

    setTimeout(() => {
      // clearInterval(selectAnimation);
      choiceImage.setAttribute("src", `images/${images[realIndex]}`);
      moChoice.classList.remove("mochoice");
      moChoice.classList.add(colors[realIndex]);
      moChoice.classList.add("comot");
      choiceLabel.textContent = images[realIndex].split(".")[0];
      choiceLabel.style.textTransform = "capitalize";

      const choiceString = images[realIndex].split(".")[0].trim().toLowerCase();
      resolve({ element: moChoice, choice: choiceString });
    }, 5000);
  });
}
