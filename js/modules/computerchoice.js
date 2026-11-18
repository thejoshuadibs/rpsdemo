const choices = ["rock", "paper", "scissors"];

export function computerChoice() {
  return new Promise((resolve) => {
    const moChoice = document.createElement("div");
    const choiceImage = document.createElement("img");
    const choiceLabel = document.createElement("div");

    moChoice.className = "chosencard mochoice";
    choiceImage.className = "emoji";
    choiceLabel.className = "text";
    moChoice.append(choiceImage, choiceLabel);

    let index = 0;
    const animation = setInterval(() => {
      choiceImage.src = `images/${choices[index]}.png`;
      index = (index + 1) % choices.length;
    }, 200);

    setTimeout(() => {
      clearInterval(animation);

      const choice = choices[Math.floor(Math.random() * choices.length)];
      const colors = { rock: "yellow", paper: "green", scissors: "red" };

      choiceImage.src = `images/${choice}.png`;
      choiceLabel.textContent = choice[0].toUpperCase() + choice.slice(1);
      moChoice.className = `chosencard ${colors[choice]} comot`;

      resolve({ element: moChoice, choice });
    }, 5000);
  });
}
