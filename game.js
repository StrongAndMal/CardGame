class CardGame {
  constructor() {
    // DOM Elements
    this.pointsElement = document.getElementById("points");
    this.betElement = document.getElementById("bet");
    this.playerCardElement = document.getElementById("player-card-value");
    this.dealerCardElement = document.getElementById("dealer-card-value");
    this.gameMessageElement = document.getElementById("game-message");
    this.rulesPopup = document.getElementById("rules-popup");
    this.startGameBtn = document.getElementById("start-game-btn");

    // Game State
    this.points = 100;
    this.bet = 25;
    this.playerCard = null;
    this.dealerCard = null;
    this.gameActive = false;

    // Audio Elements
    this.winSound = document.getElementById("win-sound");
    this.loseSound = document.getElementById("lose-sound");
    this.betSound = document.getElementById("bet-sound");
    this.cardSound = document.getElementById("card-sound");
    this.gameOverSound = document.getElementById("game-over-sound");
    this.drawSound = document.getElementById("draw-sound");

    // Set initial volumes
    this.winSound.volume = 0.3;
    this.loseSound.volume = 0.3;
    this.betSound.volume = 0.2;
    this.cardSound.volume = 0.2;
    this.gameOverSound.volume = 0.3;
    this.drawSound.volume = 0.3;

    // Show rules popup initially
    this.rulesPopup.style.display = "flex";

    // Initialize game
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Rules popup
    this.startGameBtn.addEventListener("click", () => {
      this.rulesPopup.style.display = "none";
      this.gameActive = true;
      this.resetCards();
    });

    // Game controls
    document
      .getElementById("higher-btn")
      .addEventListener("click", () => this.playRound("higher"));
    document
      .getElementById("lower-btn")
      .addEventListener("click", () => this.playRound("lower"));
    document
      .getElementById("increase-bet")
      .addEventListener("click", () => this.adjustBet(25));
    document
      .getElementById("decrease-bet")
      .addEventListener("click", () => this.adjustBet(-25));
    document
      .getElementById("all-in")
      .addEventListener("click", () => this.allIn());
    document
      .getElementById("start-over")
      .addEventListener("click", () => this.startOver());
  }

  resetCards() {
    this.playerCard = null;
    this.dealerCard = null;
    this.playerCardElement.textContent = "?";
    this.dealerCardElement.textContent = "?";
    this.gameMessageElement.textContent = "Place your bet and make your guess!";
  }

  playRound(guess) {
    if (!this.gameActive) return;

    // Generate new cards
    this.playerCard = this.getRandomCard();
    this.dealerCard = this.getRandomCard();

    // Show player's card
    this.playerCardElement.textContent = this.playerCard;
    this.cardSound.play();

    // Show dealer's card after a short delay
    setTimeout(() => {
      this.dealerCardElement.textContent = this.dealerCard;
      this.cardSound.play();

      if (this.dealerCard === this.playerCard) {
        // It's a draw - no points lost or gained
        this.drawSound.play();
        this.gameMessageElement.textContent = `It's a draw! No points lost or gained.`;
      } else {
        const isCorrect =
          (guess === "higher" && this.dealerCard > this.playerCard) ||
          (guess === "lower" && this.dealerCard < this.playerCard);

        if (isCorrect) {
          this.points += this.bet;
          this.winSound.play();
          this.gameMessageElement.textContent = `Correct! You won ${this.bet} points!`;
        } else {
          this.points -= this.bet;
          this.loseSound.play();
          this.gameMessageElement.textContent = `Wrong! You lost ${this.bet} points!`;
        }
      }

      if (this.points <= 0) {
        this.gameOver();
      } else {
        // Reset cards for next round
        setTimeout(() => {
          this.resetCards();
        }, 2000);
      }

      this.updateUI();
    }, 1000);
  }

  adjustBet(amount) {
    const newBet = this.bet + amount;
    if (newBet >= 25 && newBet <= this.points) {
      this.bet = newBet;
      this.betSound.play();
      this.updateUI();
    }
  }

  allIn() {
    if (this.points > 0) {
      this.bet = this.points;
      this.betSound.play();
      this.updateUI();
    }
  }

  startOver() {
    this.points = 100;
    this.bet = 25;
    this.resetCards();
    this.gameActive = true;
    this.updateUI();
  }

  gameOver() {
    this.gameActive = false;
    this.gameOverSound.play();
    this.gameMessageElement.textContent =
      'Game Over! Click "Start Over" to play again.';
  }

  getRandomCard() {
    return Math.floor(Math.random() * 10) + 1;
  }

  updateUI() {
    this.pointsElement.textContent = this.points;
    this.betElement.textContent = this.bet;

    // Update button states
    document.getElementById("decrease-bet").disabled = this.bet <= 25;
    document.getElementById("increase-bet").disabled = this.bet >= this.points;
    document.getElementById("all-in").disabled = this.points <= 0;
  }
}

// Initialize the game when the page loads
window.addEventListener("load", () => {
  new CardGame();
});
