import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Gem Mining Simulator";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

// Counter variables
let counter: number = 0;
const counterDisplay = document.getElementById("counter-display");

// Additional displays
const growthDisplay = document.getElementById("growth-display");
const purchaseDisplay = document.getElementById("purchase-display");

// Add incremental button
const buttonClickAmount = 1;
const button = document.createElement("button");
button.textContent = "💎 Mine for Gems! 💎";
app.append(button);
button.addEventListener("click", () => {
  counter += buttonClickAmount;
  UpdateCounterDisplay(counterDisplay);
});

class Upgrade {
  private name: string;
  private price: number;
  private rate: number;
  private description: string;
  private button: HTMLButtonElement;
  private numPurchased = 0;
  private priceMultiplier = 1.15;

  public constructor(name: string, price: number, rate: number, description: string) {
    this.name = name;
    this.price = price;
    this.rate = rate;
    this.description = description;
    this.button = this.initUpgradeButton();
  }

  private initUpgradeButton() {
    const button = document.createElement("button");
    button.textContent = this.name + " - " + Math.ceil(this.price) + " Gems";
    app.append(button);
    button.disabled = true;
    button.addEventListener("click", () => {
      counter -= this.price;
      growthRate += this.rate;
      this.numPurchased += 1;
      this.price *= this.priceMultiplier;
      button.textContent = this.name + " - " + Math.ceil(this.price) + " Gems";
      UpdateUpgradeVisibility();
      UpdateStatusDisplay(growthDisplay, purchaseDisplay);
    });
    return button;
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
const upA = new Upgrade("Hire Worker", 10, 0.1,
  "Hire a worker to mine for you."
);
const upB = new Upgrade("Buy Extraction Laser", 100, 2,
  "Purchase a laser to extract gems from the earth."
);
const upC = new Upgrade("Install Mining Machine", 1000, 50,
  "Install a machine to automatically mine gems."
);
const upD = new Upgrade("Discover Magic Gem Finding Wand", 10000, 250,
  "Find a magic wand that can locate gems from afar."
);
const upE = new Upgrade("Build Portal to Gem Dimension", 100000, 1250,
  "Create a portal to a dimension full of gems."
);
upgradeList.push(upA);
upgradeList.push(upB);
upgradeList.push(upC);
upgradeList.push(upD);
upgradeList.push(upE);

// Automatic clicking variables
const autoClickDelayInMS = 1000;
const autoClickAmount = 1;
let growthRate = 0;
let lastTime = performance.now();

// Flag for auto-clicker running
let autoClickerRunning = false;

UpdateStatusDisplay(growthDisplay, purchaseDisplay);
requestAnimationFrame(Update);

// Update loop
function Update() {
  // Unlock upgrade if affordable
  UpdateUpgradeVisibility();

  // Check for if the player has purchased an upgrade
  if (growthRate > 0 && !autoClickerRunning) {
    lastTime = performance.now();
    autoClickerRunning = true;
    requestAnimationFrame(ContinuousGrowth);
  }
  requestAnimationFrame(Update);
}

function ContinuousGrowth() {
  const deltaTime = performance.now() - lastTime;
  lastTime = performance.now();

  // Compute fractional increment per millisecond
  const increment = (autoClickAmount * deltaTime) / autoClickDelayInMS;
  counter += increment * growthRate;

  UpdateCounterDisplay(counterDisplay);
  requestAnimationFrame(ContinuousGrowth);
}

// Reset visibility of upgrades
function UpdateUpgradeVisibility() {
  for (const upgrade of upgradeList) {
    if (counter < upgrade.getPrice()) {
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
    counterDisplay.textContent = `Gems: ${counter.toFixed(0)}`;
  } else {
    console.error("Counter display not found!");
  }
}

// Update the growth display
function UpdateGrowthDisplay(growthDisplay: HTMLElement | null) {
  if (growthDisplay) {
    growthDisplay.textContent = `${growthRate.toFixed(1)} Gems/sec`;
  } else {
    console.error("Growth display not found!");
  }
}

// Update the purchase display
function UpdatePurchaseDisplay(purchaseDisplay: HTMLElement | null) {
  if (purchaseDisplay) {
    let text = "Purchases: <br>";
    for (const upgrade of upgradeList) {
      text += upgrade.getName() + " - " + upgrade.getNumPurchased() + "<br>&emsp;&emsp;<em>" + upgrade.getDescription() + "</em><br>";
    }
    purchaseDisplay.innerHTML = text;
  } else {
    console.error("Purchase display not found!");
  }
}
