import './style.css'
import music from './bg-music.mp3'

const gridSize = 100;

let prevBoard =[]

function createBoard(){
  const canvas = document.getElementById("canvas");

  let isMouseDown = false; // Variable to track mouse button state
  canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
   for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const button = document.createElement("button");
      button.className = "cell";
      button.style.height= '14px'
      button.style.width= '14px'
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
         // Add a mouseover event listener to select cells when the mouse is moved over them
      button.addEventListener("mouseover", () => {
        if (isMouseDown) {
          if (button.className == "cell") {
            button.className = "cell selected";
          } else {
            button.className = "cell";
          }
        }
      });
    }
  } 
}
createBoard();

const changeSize=(size)=>{
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const button = document.getElementById(`${i}x${j}`);
      button.style.height= `${size}px`
      button.style.width= `${size}px`
    }
  } 
}

const sizeBtn= document.getElementById('size');
sizeBtn.addEventListener('change',(e)=>{
  changeSize(e.target.value)
})


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
  let newBoard= getNextBoard()
  updateBoard(newBoard);
  let generation=document.getElementById('generation')
  let gen= generation.innerText;
  generation.innerText = Number(gen)+1
}

function clearBoard(){
  clearInterval(id);
  let generation=document.getElementById('generation')
  generation.innerText = 0
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.getElementById(`${i}x${j}`);
      cell.className = "cell";
    }
  }
  const sim = document.getElementById("simulate");
  sim.removeAttribute("disabled");
  sim.style.backgroundColor= 'rgb(44, 129, 44)'
}

function getCurrentBoard(){
  let currBoard=[]
  for (let i = 0; i < gridSize; i++) {
    currBoard[i]=[]
    for (let j = 0; j < gridSize; j++) {
      const cell = document.getElementById(`${i}x${j}`);
      if(cell.className=="cell"){
          currBoard[i][j]= 0
      }else{
        currBoard[i][j]=1
      }
    }
  }
  return currBoard 
}

function getNextBoard(){
  let newBoard = [];
  for (let i = 0; i < gridSize; i++) {
    newBoard[i] = [];
    for (let j = 0; j < gridSize; j++) {
      if (alive(i, j)) {
        newBoard[i][j] = 1;
      }
      else{
        newBoard[i][j]= 0;
      }
    }
  }
  return newBoard;
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

}

// Start/Simulate
const sim = document.getElementById("simulate");
let id = null;
sim.addEventListener("click", () => {
  const speedElement= document.getElementById('speed')
  const speed= Number(speedElement.value)
  prevBoard= getCurrentBoard();
  id = setInterval(() => {
    calc();
  }, 500/speed);
 sim.setAttribute("disabled", "true");
 sim.style.backgroundColor= 'gray'
});

// Reset
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  clearInterval(id);
  let generation=document.getElementById('generation')
  generation.innerText = 0
  updateBoard(prevBoard)
  const sim = document.getElementById("simulate");
  sim.removeAttribute("disabled");
  sim.style.backgroundColor= 'rgb(44, 129, 44)'
});

// clear
const clear = document.getElementById("clear");
clear.addEventListener("click", () => {
  clearBoard()
});

// Stop
const stopBtn = document.getElementById("stop");
stopBtn.addEventListener('click',()=>{
     clearInterval(id)
     const sim = document.getElementById("simulate");
     sim.removeAttribute("disabled");
     sim.style.backgroundColor= 'rgb(44, 129, 44)' 
})

// Music player
let bg= new Audio(music)
// bg.play()
const player= document.getElementById('music');
player.addEventListener('click',()=>{
  if(bg.paused){
    bg.play()
    player.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5zm11 4l-6 6m0-6l6 6"/></svg>'
  }
  else{
    bg.pause()
    player.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5zm4.54 3.46a5 5 0 0 1 0 7.07"/></svg>'
  }
})


/* Presets   */
let presets = [
  {
      id: 1,
      name: 'blinker',
      liveCells: [[10,10],[10,11],[10,12]]
  },
  {
      id: 2,
      name: 'glider',
      liveCells: [[10,11],[11,12],[11,13],[10,13],[9,13]]
  },
  {
    id: 3,
    name: 'beacon',
    liveCells: [[15,15],[15,16],[16,15],[16,16],[17,17],[17,18],[18,17],[18,18]]
  },
  {
    id: 4,
    name: 'toad',
    liveCells: [[15,15],[16,15],[17,16],[16,18],[15,18],[14,17]]
  },
  {
    id: 5,
    name: 'light spaceship',
    liveCells: [[20,15],[18,15],[17,16],[17,17],[17,18],[17,19],[18,19],[19,19],[20,18]]
  },
  {
    id: 6,
    name: 'penta-decathlon',
    liveCells: [[18,17],[17,17],[15,18],[14,19],[13,20],[13,21],[13,22],[14,23],[15,24],[17,25],[18,25],[20,24],[21,23],[22,22],[22,21],[22,20],[21,19],[20,18]]
  },
]


function renderPresets(){
  const presetsElement= document.querySelector('.presets');

  for (let i=0;i<presets.length;i++){
    const newPreset= document.createElement('li');
    newPreset.className= "preset";
    newPreset.innerHTML= presets[i].name
    presetsElement.appendChild(newPreset);
    newPreset.addEventListener("click", () => {
      let newBoard = [];
      for (let i = 0; i < gridSize; i++) {
        newBoard[i] = [];
        for (let j = 0; j < gridSize; j++) {
            newBoard[i][j] = 0;
        }
      }
      // setting the preset live cells
      let liveCells = presets[i].liveCells;
      for(let i=0;i<liveCells.length;i++){
          newBoard[liveCells[i][0]][liveCells[i][1]]= 1;
      }
      // console.log(newBoard)
      updateBoard(newBoard)
    });
  }
}

renderPresets()


// Save
// const save = document.getElementById("save");
// save.addEventListener('click',()=>{
//      // Get board
//      let liveCells = [];
//      for (let i = 0; i < gridSize; i++) {
//        for (let j = 0; j < gridSize; j++) {
//          if (alive(i, j)) {
//            let arr=[];
//            arr[0]=i;
//            arr[1]=j;
//            liveCells.push(arr);
//          }
//        }
//      }
//      let userPreset= {
//         id: presets.length+1,
//         name: `user preset ${presets.length+1}`,
//         liveCells: liveCells
//      }
//      presets.push(userPreset);
//      renderPresets()
// })