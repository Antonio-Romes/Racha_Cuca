class SlidingPuzzleGame {
  constructor() {
    this.board = [];
    this.moves = 0;
    this.boardSize = 3;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.isGameStarted = false;
    this.timer = 0;
    this.timerInterval = null;
    this.currentRow = 0;
    this.currentCol = 0;
    this.gameStateKey = "slidingPuzzleGameState";
    this.canvasPool = []; // Pool of canvases for better performance
    this.currentImageSrc = ""; // Track current image

    // Bind event handlers
    this.initEventListeners();

    // Load saved game state if available
    this.loadGameState();

    // Initialize the game board
    this.initGameBoard();
  }

  initEventListeners() {
    // Make methods globally accessible for inline event handlers
    window.iniciarJogo = this.startGame.bind(this);
    window.configurarJogo = this.configureGame.bind(this);
    window.reiniciarJogo = this.restartGame.bind(this);
    window.imagemAjudar = this.toggleHelpImage.bind(this);
    window.openConfiguration = this.openConfiguration.bind(this);
    window.closeConfiguration = this.closeConfiguration.bind(this);
    window.applyConfiguration = this.applyConfiguration.bind(this);

    // Keyboard navigation
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Before unload, save game state
    window.addEventListener("beforeunload", this.saveGameState.bind(this));
  }

  // Initialize game board with default settings
  initGameBoard() {
    // Set default image
    this.currentImageSrc = this.getSelectedImageSrc();

    // Create initial board
    this.createBoardWithImage();

    // Start timer immediately when game loads (before any moves)
    //this.startTimer();
  }

  // Open configuration panel
  openConfiguration() {
    const configPanel = document.getElementById("secaoConfiguracao");
    configPanel.removeAttribute("hidden");
  }

  // Close configuration panel
  closeConfiguration() {
    const configPanel = document.getElementById("secaoConfiguracao");
    configPanel.setAttribute("hidden", "true");
  }

  // Apply configuration and restart game
  applyConfiguration() {
    // Close configuration panel
    this.closeConfiguration();

    // Restart game with new settings
    this.restartGame();
  }

  // Get a canvas from the pool or create a new one
  getCanvas(width, height) {
    let canvas = this.canvasPool.pop();
    if (!canvas) {
      canvas = document.createElement("canvas");
    }
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  // Return a canvas to the pool
  releaseCanvas(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.canvasPool.push(canvas);
  }

  // Save game state to localStorage
  saveGameState() {
    // Only save if game is in progress
    if (
      !document.getElementById("secaoTabuleiro") ||
      document.getElementById("secaoTabuleiro").hasAttribute("hidden")
    ) {
      return;
    }

    const gameState = {
      moves: this.moves,
      boardSize: this.boardSize,
      timer: this.timer,
      currentRow: this.currentRow,
      currentCol: this.currentCol,
      pieces: [],
      imageSrc: this.currentImageSrc,
    };

    // Save piece positions
    const board = document.getElementById("tabuleiro");
    if (board) {
      const rows = board.rows;
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
          const img = cells[j].querySelector(".parte-imagem");
          if (img) {
            gameState.pieces.push({
              src: img.src,
              row: i,
              col: j,
              imagePosition: img.getAttribute("data-image-position"),
            });
          }
        }
      }
    }

    // Save selected difficulty
    const difficulty = this.getSelectedDifficulty();
    gameState.difficulty = difficulty;

    try {
      localStorage.setItem(this.gameStateKey, JSON.stringify(gameState));
    } catch (e) {
      console.warn("Could not save game state:", e);
    }
  }

  // Load game state from localStorage
  loadGameState() {
    try {
      const savedState = localStorage.getItem(this.gameStateKey);
      if (savedState) {
        const gameState = JSON.parse(savedState);

        // Restore game state
        this.moves = gameState.moves || 0;
        this.boardSize = gameState.boardSize || 3;
        this.timer = gameState.timer || 0;
        this.currentRow = gameState.currentRow || 0;
        this.currentCol = gameState.currentCol || 0;
        this.currentImageSrc = gameState.imageSrc || this.getSelectedImageSrc();

        // Update UI with saved state
        this.restoreGameFromState(gameState);

        // Remove saved state after loading
        localStorage.removeItem(this.gameStateKey);
      }
    } catch (e) {
      console.warn("Could not load game state:", e);
    }
  }

  // Restore game from saved state
  restoreGameFromState(gameState) {
    // Create board with saved image
    const selectedImage = new Image();
    selectedImage.src = gameState.imageSrc || this.currentImageSrc;

    selectedImage.onload = () => {
      // Create empty board first
      const board = document.getElementById("tabuleiro");
      board.setAttribute("data-size", this.boardSize);
      board.innerHTML = "";

      // Create rows and cells using DocumentFragment for better performance
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < this.boardSize; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < this.boardSize; j++) {
          const cell = document.createElement("td");
          cell.setAttribute("data-cell-position", i * this.boardSize + j);
          row.appendChild(cell);
        }
        fragment.appendChild(row);
      }
      board.appendChild(fragment);

      // Place pieces in their saved positions
      gameState.pieces.forEach((piece) => {
        const cell = board.rows[piece.row].cells[piece.col];
        const img = document.createElement("img");
        img.src = piece.src;
        img.className = "parte-imagem";
        img.setAttribute("data-row", piece.row);
        img.setAttribute("data-col", piece.col);
        img.setAttribute("data-image-position", piece.imagePosition);
        img.setAttribute(
          "alt",
          `Puzzle piece at position ${piece.row},${piece.col}`
        );

        // Add visual indicator for empty cells
        if (piece.src === "") {
          img.classList.add("empty-cell");
        }

        img.addEventListener("click", (event) => {
          this.handleImageClick(event);
        });

        cell.appendChild(img);
      });

      // Update move counter
      const moveCounterSpan = document.getElementById("contadorDeJogada");
      if (moveCounterSpan) {
        moveCounterSpan.textContent = this.moves;
      }

      // Update timer
      this.updateTimerDisplay();

      // Start timer
      //this.startTimer();

      // Set focus to saved position
      this.focusCell(this.currentRow, this.currentCol);
    };
  }

  // Format time as MM:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // Update timer display
  updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = this.formatTime(this.timer);
    }
  }

  // Handle keyboard events
  handleKeyDown(event) {
    // Only handle keyboard events during game play
    if (
      !document.getElementById("secaoTabuleiro") ||
      document.getElementById("secaoTabuleiro").hasAttribute("hidden")
    ) {
      return;
    }

    const board = document.getElementById("tabuleiro");
    if (!board) return;

    let targetRow = this.currentRow;
    let targetCol = this.currentCol;

    switch (event.key) {
      case "ArrowUp":
        targetRow = Math.max(0, this.currentRow - 1);
        event.preventDefault();
        break;
      case "ArrowDown":
        targetRow = Math.min(this.boardSize - 1, this.currentRow + 1);
        event.preventDefault();
        break;
      case "ArrowLeft":
        targetCol = Math.max(0, this.currentCol - 1);
        event.preventDefault();
        break;
      case "ArrowRight":
        targetCol = Math.min(this.boardSize - 1, this.currentCol + 1);
        event.preventDefault();
        break;
      case "Enter":
      case " ":
        // Trigger click on current cell
        const currentCell = board.rows[this.currentRow].cells[this.currentCol];
        const currentImg = currentCell.querySelector(".parte-imagem");
        if (currentImg) {
          currentImg.click();
        }
        event.preventDefault();
        return;
      default:
        return;
    }

    // Update focus to new position
    this.focusCell(targetRow, targetCol);
  }

  // Focus on a specific cell
  focusCell(row, col) {
    this.currentRow = row;
    this.currentCol = col;

    const board = document.getElementById("tabuleiro");
    if (!board) return;

    // Remove focus from all cells
    const allImages = board.querySelectorAll(".parte-imagem");
    allImages.forEach((img) => {
      img.removeAttribute("tabindex");
      img.blur();
    });

    // Add focus to target cell
    const targetCell = board.rows[row].cells[col];
    const targetImg = targetCell.querySelector(".parte-imagem");
    if (targetImg) {
      targetImg.tabIndex = 0;
      targetImg.focus();
    }
  }

  // Get selected difficulty level
  getSelectedDifficulty() {
    const radios = document.getElementsByName("nivel");
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return parseInt(radios[i].value);
      }
    }
    return 3; // Default to easy
  }

  // Get selected image source
  getSelectedImageSrc() {
    const radioImages = document.getElementsByName("image");
    for (let i = 0; i < radioImages.length; i++) {
      if (radioImages[i].checked) {
        const imgElement =
          radioImages[i].nextElementSibling.querySelector("img");
        return imgElement ? imgElement.src : "";
      }
    }
    // Default to first image if none selected
    const firstImage = document.getElementById("img1");
    return firstImage ? firstImage.src : "";
  }

  // Toggle visibility of sections (kept for backward compatibility)
  toggleSections() {
    // Not used in new layout
  }

  // Toggle visibility of buttons (kept for backward compatibility)
  toggleButtons() {
    // Not used in new layout
  }

  // Start the game
  startGame() {
    this.clearBoard();
    this.createBoardWithImage();
    // this.startTimer();
  }

  // Configure game (kept for backward compatibility)
  configureGame() {
    this.openConfiguration();
  }

  // Restart game
  restartGame() {
    this.clearBoard();
    this.createBoardWithImage();
    this.resetMoveCounter();
    this.resetTimer();
  }

  // Toggle help image
  toggleHelpImage() {
    const imageAjuda = document.getElementById("imageAjuda");
    imageAjuda.toggleAttribute("hidden");
    imageAjuda.src = this.currentImageSrc;
  }

  // Clear the game board
  clearBoard() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
  }

  // Reset move counter
  resetMoveCounter() {
    this.moves = 0;
    const moveCounterSpan = document.getElementById("contadorDeJogada");
    moveCounterSpan.textContent = this.moves;
  }

  // Update move counter
  updateMoveCounter() {
    this.moves++;
    const moveCounterSpan = document.getElementById("contadorDeJogada");
    moveCounterSpan.textContent = this.moves;
    this.updateTimerDisplay();
    this.startTimer();
  }

  // Reset timer
  resetTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timer = 0;
    this.updateTimerDisplay();
  }

  // Start timer
  startTimer() {
    // Clear any existing timer
    this.resetTimer();

    // Start the timer immediately when game loads
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateTimerDisplay();
    }, 1000);
  }

  // Create board with image
  createBoardWithImage() {
    this.boardSize = this.getSelectedDifficulty();
    this.currentImageSrc = this.getSelectedImageSrc();

    const selectedImage = new Image();
    selectedImage.src = this.currentImageSrc;

    selectedImage.onload = () => {
      const pieces = this.cutImage(selectedImage, this.boardSize);
      const shuffledPieces = this.shufflePieces(pieces);
      this.addPiecesToBoard(shuffledPieces, this.boardSize);
      // Set initial focus to the first cell
      this.focusCell(0, 0);
    };
  }

  // Cut image into pieces with optimized canvas usage
  cutImage(image, boardDimension) {
    // Calculate piece dimensions
    this.imageWidth = image.width;
    this.imageHeight = image.height;
    const pieceWidth = this.imageWidth / boardDimension;
    const pieceHeight = this.imageHeight / boardDimension;

    const pieces = [];

    // Use a single canvas for all pieces to improve performance
    const canvas = this.getCanvas(pieceWidth, pieceHeight);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < boardDimension; i++) {
      let imagePosition = i;
      for (let j = 0; j < boardDimension; j++) {
        // Clear canvas
        ctx.clearRect(0, 0, pieceWidth, pieceHeight);

        // Draw piece
        ctx.drawImage(
          image,
          j * pieceWidth,
          i * pieceHeight,
          pieceWidth,
          pieceHeight,
          0,
          0,
          pieceWidth,
          pieceHeight
        );

        // Last piece is empty
        const imageUrl =
          i === boardDimension - 1 && j === boardDimension - 1
            ? ""
            : canvas.toDataURL();
        pieces.push({ imagePosition: imagePosition, src: imageUrl });
        imagePosition += boardDimension;
      }
    }

    // Release canvas back to pool
    this.releaseCanvas(canvas);

    return pieces;
  }

  // Shuffle pieces
  shufflePieces(pieces) {
    const shuffledPieces = pieces.slice(); // Make a copy

    for (let i = shuffledPieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i], shuffledPieces[j]] = [
        shuffledPieces[j],
        shuffledPieces[i],
      ];
    }

    return shuffledPieces;
  }

  // Add pieces to board using DocumentFragment for better performance
  addPiecesToBoard(pieces, boardDimension) {
    const board = document.getElementById("tabuleiro");
    board.setAttribute("data-size", boardDimension);
    let index = 0;

    // Create all elements in a DocumentFragment first for better performance
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < boardDimension; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < boardDimension; j++) {
        const cell = document.createElement("td");
        cell.setAttribute("data-cell-position", index);

        const img = document.createElement("img");
        img.src = pieces[index].src;
        img.className = "parte-imagem";
        img.setAttribute("data-row", i);
        img.setAttribute("data-col", j);
        img.setAttribute("data-image-position", pieces[index].imagePosition);
        img.setAttribute("alt", `Puzzle piece at position ${i},${j}`);

        // Add visual indicator for empty cells
        if (pieces[index].src === "") {
          img.classList.add("empty-cell");
        }

        img.addEventListener("click", (event) => {
          this.handleImageClick(event);
        });

        cell.appendChild(img);
        row.appendChild(cell);
        index++;
      }
      fragment.appendChild(row);
    }

    // Clear board and append all at once
    board.innerHTML = "";
    board.appendChild(fragment);
  }

  // Handle image click
  handleImageClick(event) {
    // Update move counter on first move
    // Note: Timer starts immediately when game loads, not on first move
    this.updateMoveCounter();

    const clickedImg = event.target;
    const row = parseInt(clickedImg.getAttribute("data-row"));
    const col = parseInt(clickedImg.getAttribute("data-col"));

    const board = document.getElementById("tabuleiro");

    // Get adjacent cells
    const leftCell = col > 0 ? board.rows[row].cells[col - 1] : null;
    const rightCell =
      col < this.boardSize - 1 ? board.rows[row].cells[col + 1] : null;
    const aboveCell = row > 0 ? board.rows[row - 1].cells[col] : null;
    const belowCell =
      row < this.boardSize - 1 ? board.rows[row + 1].cells[col] : null;

    // Try to swap with adjacent empty cell
    this.swapImagePosition(clickedImg.parentElement, leftCell);
    this.swapImagePosition(clickedImg.parentElement, rightCell);
    this.swapImagePosition(clickedImg.parentElement, aboveCell);
    this.swapImagePosition(clickedImg.parentElement, belowCell);

    // Check if player won
    if (this.checkWin()) {
      this.showWinModal();
    }
  }

  // Swap image position
  swapImagePosition(cell, adjacentCell) {
    if (adjacentCell !== null) {
      const adjacentImg = adjacentCell.children[0];
      if (adjacentImg && adjacentImg.src === "") {
        // Get data from clicked image
        const clickedImg = cell.children[0];
        const clickedImgSrc = clickedImg.src;
        const clickedImgPosition = clickedImg.getAttribute(
          "data-image-position"
        );
        const adjacentImgPosition = adjacentImg.getAttribute(
          "data-image-position"
        );

        // Swap images
        adjacentImg.src = clickedImgSrc;
        adjacentImg.setAttribute("data-image-position", clickedImgPosition);
        // Remove empty cell class from adjacent cell and add to clicked cell
        adjacentImg.classList.remove("empty-cell");

        clickedImg.src = "";
        clickedImg.setAttribute("data-image-position", adjacentImgPosition);
        // Add empty cell class to clicked cell
        clickedImg.classList.add("empty-cell");

        // Update focus to the moved piece
        const newRow = parseInt(adjacentImg.getAttribute("data-row"));
        const newCol = parseInt(adjacentImg.getAttribute("data-col"));
        this.focusCell(newRow, newCol);
      }
    }
  }

  // Check win condition
  checkWin() {
    const board = document.getElementById("tabuleiro");
    const rows = board.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      for (let j = 0; j < cells.length; j++) {
        const cellPosition = cells[j].getAttribute("data-cell-position");
        const imagePosition = cells[j].children[0].getAttribute(
          "data-image-position"
        );

        // Empty cell should be at the last position
        if (cells[j].children[0].src === "") {
          if (parseInt(cellPosition) !== this.boardSize * this.boardSize - 1) {
            return false;
          }
        } else if (parseInt(cellPosition) !== parseInt(imagePosition)) {
          return false;
        }
      }
    }

    return true;
  }

  // Show win modal
  showWinModal() {
    // Update final stats in modal
    document.getElementById("finalMoves").textContent = this.moves;
    document.getElementById("finalTime").textContent = this.formatTime(
      this.timer
    );

    $("#modalGanhouOJogo").modal("show");
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null; // Clear the reference
    }
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.slidingPuzzleGame = new SlidingPuzzleGame();
});
