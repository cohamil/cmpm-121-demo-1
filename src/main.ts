import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "My sweet game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);


// Add incremental button
const button = document.createElement("button");
button.textContent = "💵 Click for Money! 💵";
app.append(button);