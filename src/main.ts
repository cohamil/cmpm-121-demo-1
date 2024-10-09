import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My sweet game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Add incremental button
let counter: number = 0; 
const button = document.createElement("button");
button.textContent = "💎 Click for Gems! 💎";
app.append(button);
button.addEventListener("click", () => {
    counter += 1;

    // Update the counter display
    const counterDisplay = document.getElementById("counter-display");
    if (counterDisplay) {
        counterDisplay.textContent = `Gems: ${counter}`;
    } else {
        console.error("Counter display not found!");
    }
})