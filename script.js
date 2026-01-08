// Conway's Game of Life Background
class GameOfLife {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 12;
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
        this.nextGrid = [];
        
        // Color scheme: subtle blue-grey tones
        this.deadColor = '#f5f7fa';
        this.aliveColor = '#d0e4f7';
        
        this.resizeCanvas();
        this.initGrid();
        this.animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initGrid();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
    }
    
    initGrid() {
        this.grid = [];
        this.nextGrid = [];
        
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // Random initialization with ~20% alive cells
                this.grid[i][j] = Math.random() > 0.8 ? 1 : 0;
                this.nextGrid[i][j] = 0;
            }
        }
    }
    
    countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const newRow = (row + i + this.rows) % this.rows;
                const newCol = (col + j + this.cols) % this.cols;
                count += this.grid[newRow][newCol];
            }
        }
        return count;
    }
    
    update() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const neighbors = this.countNeighbors(i, j);
                const currentState = this.grid[i][j];
                
                // Conway's Game of Life rules
                if (currentState === 1 && (neighbors === 2 || neighbors === 3)) {
                    this.nextGrid[i][j] = 1;
                } else if (currentState === 0 && neighbors === 3) {
                    this.nextGrid[i][j] = 1;
                } else {
                    this.nextGrid[i][j] = 0;
                }
            }
        }
        
        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    }
    
    draw() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const x = j * this.cellSize;
                const y = i * this.cellSize;
                
                this.ctx.fillStyle = this.grid[i][j] === 1 ? this.aliveColor : this.deadColor;
                // Draw perfectly square cells
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
            }
        }
    }
    
    animate() {
        this.update();
        this.draw();
        
        // Update every 500ms for slower, less distracting animation
        setTimeout(() => {
            requestAnimationFrame(() => this.animate());
        }, 500);
    }
}

// Automatically highlight the author name in publication lists
function highlightAuthorName() {
    const authorName = 'Botian XU';
    const variations = [
        'Botian XU',
        'Botian Xu',
        'B. Xu',
        'B. XU'
    ];

    // Find all author divs
    const authorDivs = document.querySelectorAll('.pub-authors');
    
    authorDivs.forEach(div => {
        let html = div.innerHTML;
        
        // Try to match any variation of the name
        variations.forEach(name => {
            const regex = new RegExp(`\\b${name.replace(/\./g, '\\.')}\\b`, 'gi');
            html = html.replace(regex, match => `<strong class="author-highlight">${match}</strong>`);
        });
        
        div.innerHTML = html;
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start Game of Life
    const canvas = document.getElementById('gameOfLife');
    new GameOfLife(canvas);
    
    // Highlight author name
    highlightAuthorName();
});

