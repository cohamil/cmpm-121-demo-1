import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My sweet game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Counter variables
let counter: number = 0;
const counterDisplay = document.getElementById("counter-display");

// Add incremental button
const buttonClickAmount = 1;
const button = document.createElement("button");
button.textContent = "💎 Click for Gems! 💎";
app.append(button);
button.addEventListener("click", () => {
    counter += buttonClickAmount;
    UpdateCounterDisplay(counterDisplay, counter);
});

// Automatic clicking
const autoClickDelayInSecs = 1;
const autoClickAmount = 1;
setInterval(() => {
    counter += autoClickAmount;
    UpdateCounterDisplay(counterDisplay, counter);
}, autoClickDelayInSecs * 1000);

// Update the counter display
function UpdateCounterDisplay(counterDisplay: HTMLElement | null, counter: number) {
    if (counterDisplay) {
        counterDisplay.textContent = `Gems: ${counter}`;
    } else {
        console.error("Counter display not found!");
    }
}