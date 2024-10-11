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

// Additional displays
const growthDisplay = document.getElementById("growth-display");
const purchaseDisplay = document.getElementById("purchase-display");

// Add incremental button
const buttonClickAmount = 1;
const button = document.createElement("button");
button.textContent = "💎 Click for Gems! 💎";
app.append(button);
button.addEventListener("click", () => {
  counter += buttonClickAmount;
  UpdateCounterDisplay(counterDisplay);
});

class Upgrade {
  private name: string; 
  private price: number; 
  private rate: number;
  private button: HTMLButtonElement;
  private numPurchased = 0;
  
  public constructor(name: string, price: number, rate: number) {
    this.name = name; this.price = price; this.rate = rate;
    this.button = this.initUpgradeButton();
  }

  private initUpgradeButton() {
    const button = document.createElement("button");
    button.textContent = this.name;
    app.append(button);
    button.disabled = true;
    button.addEventListener("click", () => {
      counter -= this.price;
      growthRate += this.rate;
      this.numPurchased += 1;
      UpdateUpgradeVisibility();
    });
    return button;
  }

  public getPrice() {
    return this.price;
  }

  public getName() {
    return this.name;
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
const upA = new Upgrade("A", 10, 0.1);
const upB = new Upgrade("B", 100, 2);
const upC = new Upgrade("C", 1000, 50);
upgradeList.push(upA);
upgradeList.push(upB);
upgradeList.push(upC);

// Automatic clicking variables
const autoClickDelayInMS = 1000;
const autoClickAmount = 1;
let growthRate = 0;
let lastTime = performance.now();

requestAnimationFrame(Update);

// Update loop
function Update() {
  // Unlock upgrade if affordable
  for (const upgrade of upgradeList) {
    if (counter >= upgrade.getPrice()) {
      upgrade.setVisibility(true);
    }
    else {
      break;
    }
  }

  // Check for if the player has purchased an upgrade
  if (growthRate > 0) {
    lastTime = performance.now();
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
  //UpdateCounterDisplay(counterDisplay);
  UpdateDisplay(counterDisplay, growthDisplay, purchaseDisplay);
  requestAnimationFrame(ContinuousGrowth);
}

// Reset visibility of upgrades
function UpdateUpgradeVisibility() {
  for (const upgrade of upgradeList) {
    if (counter < upgrade.getPrice()) {
      upgrade.setVisibility(false);
    }
  }
}

// Update all displays
function UpdateDisplay(
  counterDisplay: HTMLElement | null,
  growthDisplay: HTMLElement | null,
  purchaseDisplay: HTMLElement | null,
) {
  UpdateCounterDisplay(counterDisplay);
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
      text += upgrade.getName() + " - "  + upgrade.getNumPurchased() + "<br>";
    }
    purchaseDisplay.innerHTML = text;
  } else {
    console.error("Purchase display not found!");
  }
}
