console.log("index.js");
const canvas = document.getElementById("canvas");


const gridSize = 50;

for (let i = 0; i < gridSize; i++) {
  for (let j = 0; j < gridSize; j++) {
    const button = document.createElement("button");
    button.className = "cell";
    button.title= `${i}x${j}`
    // button.innerHTML= `${i}x${j}`
    button.id = `${i}x${j}`;
    canvas.appendChild(button);
    button.addEventListener("click", () => {
      // console.log(`button ${i},${j} clicked`)
      if (button.className == "cell") {
        button.className = "cell selected";
      } else {
        button.className = "cell";
      }
    });
  }
}

const next = document.getElementById("next");
next.addEventListener("click", calc);

const alive = (i, j) => {
  let neightbours = [
    [i - 1, j],
    [i, j - 1],
    [i + 1, j],
    [i, j + 1],
    [i - 1, j - 1],
    [i + 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j + 1],
  ];
  let adj = 0;
  for (let i = 0; i < neightbours.length; i++) {
    adj = adj + cellStatus(neightbours[i]);
  }
  //   console.log(`alive neightbours for ${i}x${j}`,adj)

  const currStatus = cellStatus([i, j]);
  if (currStatus == 1) {
    if (adj >= 2 && adj <= 3) {
      // console.log(`The cell ${i}x${j} will live as it has ${adj} alive neighbours`)
      return true;
    } else {
      return false;
    }
  }
  if (currStatus == 0) {
    if (adj == 3) {
      // console.log(`The cell ${i}x${j} will be born as it has ${adj} alive neighbours`)
      return true;
    }
  }
  return false;
};

const cellStatus = (arr) => {
  let i = arr[0];
  let j = arr[1];
  if (i < 0 || i > gridSize - 1 || j < 0 || j > gridSize - 1) return 0;
  const cell = document.getElementById(`${i}x${j}`);
  let cellClass = cell.className;
  if (cellClass == "cell") {
    // dead
    return 0;
  }
  return 1;
};

function calc() {
  let newBoard = [];
  for (let i = 0; i < gridSize; i++) {
    newBoard[i] = [];
    for (let j = 0; j < gridSize; j++) {
      if (alive(i, j)) {
        newBoard[i][j] = 1;
      }
    }
  }
  //   console.log(newBoard)
  updateBoard(newBoard);
}

function updateBoard(board) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.getElementById(`${i}x${j}`);
      if (board[i][j] == 1) {
        cell.className = "cell selected";
      } else {
        cell.className = "cell";
      }
    }
  }
  let generation=document.getElementById('generation')
  let gen= generation.innerText;
  generation.innerText = Number(gen)+1
}

// Start/Simulate
const sim = document.getElementById("simulate");
let id = null;
sim.addEventListener("click", () => {
  const speedElement= document.getElementById('speed')
  const speed= Number(speedElement.value)
  id = setInterval(() => {
    calc();
  }, 500/speed);
});

// Reset
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  clearInterval(id);
  let generation=document.getElementById('generation')
  generation.innerText = 0
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.getElementById(`${i}x${j}`);
      cell.className = "cell";
    }
  }
});

// Stop
const stopBtn = document.getElementById("stop");
stopBtn.addEventListener('click',()=>{
     clearInterval(id)
})


// Save
const save = document.getElementById("save");
save.addEventListener('click',()=>{
     console.log('save')
})

