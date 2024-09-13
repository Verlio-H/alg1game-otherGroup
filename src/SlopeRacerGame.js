import React, { useState } from 'react';
import './SlopeRacerGame.css';

const GRID_SIZE = 10; // Define the size of the grid
const CELL_SIZE = 30; // Size of each grid cell in pixels

function SlopeRacerGame() {
  // Initialize the grid with white squares and edges as black squares
  const createInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const currentRow = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        if (
          row === 0 ||
          row === GRID_SIZE - 1 ||
          col === 0 ||
          col === GRID_SIZE - 1
        ) {
          currentRow.push('black');
        } else {
          currentRow.push('white');
        }
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createInitialGrid());

  // Set the starting position of the car
  const [carPosition, setCarPosition] = useState({ x: 1, y: GRID_SIZE - 2 });

  // Sliders' state
  const [xMove, setXMove] = useState(0);
  const [yMove, setYMove] = useState(0);

  // Game over state
  const [gameOver, setGameOver] = useState(false);

  // Handle the move button click
  const handleMove = () => {
    const newX = carPosition.x + xMove;
    const newY = carPosition.y - yMove; // Subtract because y increases downward

    // Check for out-of-bounds
    if (
      newX < 0 ||
      newX >= GRID_SIZE ||
      newY < 0 ||
      newY >= GRID_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Check if the next square is black (out of bounds)
    if (grid[newY][newX] === 'black') {
      setGameOver(true);
      return;
    }

    // Update car position
    setCarPosition({ x: newX, y: newY });

    // Reset sliders
    setXMove(0);
    setYMove(0);
  };

  // Handle retry button
  const handleRetry = () => {
    setCarPosition({ x: 1, y: GRID_SIZE - 2 });
    setGameOver(false);
  };

  // Generate grid cells
  const gridCells = [];
  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
    for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
      let className = 'grid-cell';

      // Apply cell color
      if (grid[rowIndex][colIndex] === 'black') {
        className += ' black-cell';
      } else {
        className += ' white-cell';
      }

      // Position the car
      if (carPosition.x === colIndex && carPosition.y === rowIndex) {
        className += ' car-cell';
      }

      gridCells.push(
        <div key={`${rowIndex}-${colIndex}`} className={className}></div>
      );
    }
  }

  // Calculate arrow line
  let arrowLine = null;
  if (!gameOver && (xMove !== 0 || yMove !== 0)) {
    const startX = carPosition.x * CELL_SIZE + CELL_SIZE / 2;
    const startY = carPosition.y * CELL_SIZE + CELL_SIZE / 2;
    const endX = (carPosition.x + xMove) * CELL_SIZE + CELL_SIZE / 2;
    const endY = (carPosition.y - yMove) * CELL_SIZE + CELL_SIZE / 2;

    const svgWidth = GRID_SIZE * CELL_SIZE;
    const svgHeight = GRID_SIZE * CELL_SIZE;

    arrowLine = (
      <svg
        className="arrow-line"
        width={svgWidth}
        height={svgHeight}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="blue"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    );
  }

  return (
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
          <h2>Out of Bounds!</h2>
          <button onClick={handleRetry}>Retry</button>
        </div>
      ) : (
        <>
          <div className="grid-container">
            <div className="grid">{gridCells}</div>
            {arrowLine}
          </div>
          <div className="controls">
            <div className="slider">
              <label>Horizontal Move (X): {xMove}</label>
              <input
                type="range"
                min={-5}
                max={5}
                value={xMove}
                onChange={(e) => setXMove(parseInt(e.target.value))}
              />
            </div>
            <div className="slider">
              <label>Vertical Move (Y): {yMove}</label>
              <input
                type="range"
                min={-5}
                max={5}
                value={yMove}
                onChange={(e) => setYMove(parseInt(e.target.value))}
              />
            </div>
            <button onClick={handleMove}>Move</button>
          </div>
        </>
      )}
    </div>
  );
}

export default SlopeRacerGame;
