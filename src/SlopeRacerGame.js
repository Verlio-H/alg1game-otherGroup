import React, { useState } from 'react';
import './SlopeRacerGame.css';
import Vec2 from './Vec2';

const GRID_SIZE = 60; // Define the size of the grid
const CELL_SIZE = 15; // Size of each grid cell in pixels

let moveX = 0;
let moveY = 0;

let course = [[[1,2], [10,40]],[[10,40], [GRID_SIZE-2,15]]];
let radius = 2;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max)+1;
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); //inclusive
}

const min = Math.min;
const max = Math.max;

function SlopeRacerGame() {

  // Distance to line
  const distToLine = (points,position) => {
    const p0 = new Vec2(points[0][0],points[0][1]);
    const p1 = new Vec2(points[1][0],points[1][1]);
    
    const pos = new Vec2(position[0],position[1])
    const lineVec = p1.subtract(p0);
    const pointVec = pos.subtract(p0);

    //console.log(lineVec.x,lineVec.y);
    let comp = pointVec.dot(lineVec)/lineVec.dot(lineVec);

    comp = min(1,max(comp,0))
    let proj = p0.add(lineVec.scalMult(comp));
    let dist = pos.subtract(proj).length();
    //console.log(dist);
    return dist;
  }

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
          // Determine is square is within course
          let dist = min(...course.map(function(x) { return distToLine(x,[col,row]) }))
          if (dist >= radius) {
            currentRow.push('black');
          } else if (col === 1 && Math.abs(row-course[0][0][1])<=radius) {
            currentRow.push('green');
          } else {
            currentRow.push('white');
          }
        }
      }
      grid.push(currentRow);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createInitialGrid());

  const randomCarInitPosition = () => {
    return getRandomInt(max(course[0][0][1]-radius,1),min(course[0][0][1]+radius,GRID_SIZE-2));
  }
  
  // Set the starting position of the car
  const [carPosition, setCarPosition] = useState({ x: 1, y: randomCarInitPosition()});

  // Randomize car position
  const randomizePosition = () => {
    setCarPosition({ x: 1, y: randomCarInitPosition()});
  }

  // Sliders' state
  const [newMoveX, setXMove] = useState(0);
  const [newMoveY, setYMove] = useState(0);

  // Game over state
  const [gameOver, setGameOver] = useState(false);

  // Handle the move button click
  const handleMove = () => {
    moveX += newMoveX;
    const newX = carPosition.x + moveX;
    moveY += newMoveY;
    const newY = carPosition.y - moveY; // Subtract because y increases downward

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
    randomizePosition();
    setXMove(0);
    setYMove(0);
    moveX = 0;
    moveY = 0;
    setGameOver(false);
  };

  // Generate grid cells
  const gridCells = [];
  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
    for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
      let className = 'grid-cell';

      // Apply cell color
      className += ' '+grid[rowIndex][colIndex]+'-cell';

      var inside = '';
      // Position the car
      if (carPosition.x === colIndex && carPosition.y === rowIndex) {
        inside = (<div
          className='car-cell'
          style={{
            content: '',
            position: 'relative',
            top: 1/8*CELL_SIZE-1+'px',
            left: 1/8*CELL_SIZE-1+'px',
            width: 3/4*CELL_SIZE+'px',
            height: 3/4*CELL_SIZE+'px',
            backgroundColor: 'red',
            borderRadius: '50%',
          }}
          ></div>);
      }

      gridCells.push(
        <div key={`${rowIndex}-${colIndex}`} className={className}>{inside}</div>
      );
    }
  }

  // Calculate arrow line
  let arrowLine = null;
  if (!gameOver && (moveX + newMoveX !== 0 || moveY + newMoveY !== 0)) {
    const startX = carPosition.x * CELL_SIZE + CELL_SIZE / 2;
    const startY = carPosition.y * CELL_SIZE + CELL_SIZE / 2;
    const endX = (carPosition.x + moveX + newMoveX) * CELL_SIZE + CELL_SIZE / 2;
    const endY = (carPosition.y - moveY - newMoveY) * CELL_SIZE + CELL_SIZE / 2;

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
            markerWidth={CELL_SIZE/3}
            markerHeight={CELL_SIZE/5}
            refX={CELL_SIZE/6}
            refY={CELL_SIZE/10}
            orient="auto"
          >
            <polygon points={'0 0,'+CELL_SIZE/3+' '+CELL_SIZE/10+', 0 '+CELL_SIZE/5} fill="blue" />
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
          <div className="grid-container" style={{ position: 'relative' }}>
            <div
              className="grid"
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              }}
            >
              {gridCells}
            </div>
            {arrowLine}
          </div>
          <div className="controls">
            <div className="slider">
              <label>Horizontal Move (X): {newMoveX+moveX}</label>
              <input
                type="range"
                min={-1}
                max={1}
                value={newMoveX}
                onChange={(e) => setXMove(parseInt(e.target.value))}
              />
            </div>
            <div className="slider">
              <label>Vertical Move (Y): {newMoveY+moveY}</label>
              <input
                type="range"
                min={-1}
                max={1}
                value={newMoveY}
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