import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Gem Mining Simulator";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

class GameState {
  // Counter for the number of gems
  private _counter: number = 0;
  // Growth rate for the number of gems per second
  private _growthRate: number = 0;
  // Boolean for if the auto-clicker
  private _autoClickerRunning: boolean = false;

  public get counter(): number {
    return this._counter;
  }

  public set counter(value: number) {
    this._counter = value;
  }

  public get growthRate(): number {
    return this._growthRate;
  }

  public set growthRate(value: number) {
    this._growthRate = value;
  }

  public get autoClickerRunning(): boolean {
    return this._autoClickerRunning;
  }

  public set autoClickerRunning(value: boolean) {
    this._autoClickerRunning = value;
  }
}

const gameState = new GameState();

// Counter variable
const counterDisplay = document.getElementById("counter-display");

// Additional displays
const growthDisplay = document.getElementById("growth-display");
const purchaseDisplay = document.getElementById("purchase-display");

// Add incremental button
const buttonClickAmount = 1;
const button = document.createElement("button");
button.textContent = "💎 Mine for Gems! 💎";
button.style.fontSize = "35px";
button.style.width = "450px";
button.style.boxShadow = "5px 5px 5px blue";
app.append(button);
button.addEventListener("click", () => {
  gameState.counter += buttonClickAmount;
  UpdateCounterDisplay(counterDisplay);
});

app.append(document.createElement("br"));
app.append(document.createElement("br"));

class Upgrade {
  private name: string;
  private price: number;
  private rate: number;
  private description: string;
  private button: HTMLButtonElement;
  private numPurchased = 0;
  private priceMultiplier = 1.15;

  public constructor(
    name: string,
    price: number,
    rate: number,
    description: string,
  ) {
    this.name = name;
    this.price = price;
    this.rate = rate;
    this.description = description;
    this.button = this.initUpgradeButton();
  }

  private updateButton(button: HTMLButtonElement) {
    button.textContent = this.name + " - " + Math.ceil(this.price) + " Gems";
  }

  private initUpgradeButton() {
    const button = document.createElement("button");
    button.textContent = this.name + " - " + Math.ceil(this.price) + " Gems";
    app.append(button);
    button.disabled = true;
    button.addEventListener("click", () => {
      this.purchaseUpgrade();
    });
    return button;
  }

  private purchaseUpgrade() {
    gameState.counter -= this.price;
    gameState.growthRate += this.rate;
    this.numPurchased += 1;
    this.price *= this.priceMultiplier;
    this.updateButton(this.button);
    UpdateUpgradeVisibility();
    UpdateStatusDisplay(growthDisplay, purchaseDisplay);
  }

  public getPrice() {
    return this.price;
  }

  public getName() {
    return this.name;
  }

  public getDescription() {
    return this.description;
  }

  public getNumPurchased() {
    return this.numPurchased;
  }

  public setVisibility(bool: boolean) {
    this.button.disabled = !bool;
  }
}

// Initialize upgrade list and add create upgrades
const upgradeList: Upgrade[] = [];
const upA = new Upgrade(
  "Hire Worker",
  10,
  0.1,
  "Hire a worker to mine for you.",
);
const upB = new Upgrade(
  "Buy Extraction Laser",
  100,
  2,
  "Purchase a laser to extract gems from the earth.",
);
const upC = new Upgrade(
  "Install Mining Machine",
  1000,
  50,
  "Install a machine to automatically mine gems.",
);
const upD = new Upgrade(
  "Discover Magic Gem Finding Wand",
  10000,
  250,
  "Find a magic wand that can locate gems from afar.",
);
const upE = new Upgrade(
  "Build Portal to Gem Dimension",
  100000,
  1250,
  "Create a portal to a dimension full of gems.",
);
upgradeList.push(upA);
upgradeList.push(upB);
upgradeList.push(upC);
upgradeList.push(upD);
upgradeList.push(upE);

// Automatic clicking variables
const autoClickDelayInMS = 1000;
const autoClickAmount = 1;
let lastTime = performance.now();

UpdateStatusDisplay(growthDisplay, purchaseDisplay);
requestAnimationFrame(Update);

// Update loop
function Update() {
  // Unlock upgrade if affordable
  UpdateUpgradeVisibility();

  // Check for if the player has purchased an upgrade
  if (gameState.growthRate > 0 && !gameState.autoClickerRunning) {
    lastTime = performance.now();
    gameState.autoClickerRunning = true;
    requestAnimationFrame(ContinuousGrowth);
  }
  requestAnimationFrame(Update);
}

function ContinuousGrowth() {
  const deltaTime = performance.now() - lastTime;
  lastTime = performance.now();

  // Compute fractional increment per millisecond
  const increment = (autoClickAmount * deltaTime) / autoClickDelayInMS;
  gameState.counter += increment * gameState.growthRate;

  UpdateCounterDisplay(counterDisplay);
  requestAnimationFrame(ContinuousGrowth);
}

// Reset visibility of upgrades
function UpdateUpgradeVisibility() {
  for (const upgrade of upgradeList) {
    if (gameState.counter < upgrade.getPrice()) {
      upgrade.setVisibility(false);
    } else {
      upgrade.setVisibility(true);
    }
  }
}

// Update status displays
function UpdateStatusDisplay(
  growthDisplay: HTMLElement | null,
  purchaseDisplay: HTMLElement | null,
) {
  UpdateGrowthDisplay(growthDisplay);
  UpdatePurchaseDisplay(purchaseDisplay);
}

// Update the counter display
function UpdateCounterDisplay(counterDisplay: HTMLElement | null) {
  if (counterDisplay) {
    counterDisplay.textContent = `Gems: ${gameState.counter.toFixed(0)}`;
  } else {
    console.error("Counter display not found!");
  }
}

// Update the growth display
function UpdateGrowthDisplay(growthDisplay: HTMLElement | null) {
  if (growthDisplay) {
    growthDisplay.textContent = `${gameState.growthRate.toFixed(1)} Gems/sec`;
  } else {
    console.error("Growth display not found!");
  }
}

// Update the purchase display
function UpdatePurchaseDisplay(purchaseDisplay: HTMLElement | null) {
  if (purchaseDisplay) {
    purchaseDisplay.innerHTML = generatePurchaseText();
  } else {
    console.error("Purchase display not found!");
  }
}

function generatePurchaseText(): string {
  let text = "Purchases: <br>";
  for (const upgrade of upgradeList) {
    text += formatUpgradeInfo(upgrade);
  }
  return text;
}

function formatUpgradeInfo(upgrade: Upgrade): string {
  return `${upgrade.getName()} - ${upgrade.getNumPurchased()}<br>&emsp;&emsp;<em>${upgrade.getDescription()}</em><br>`;
}
