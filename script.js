const addRectangleBtn = document.querySelector(".rectangle-btn");
const workspace = document.querySelector(".middle-area");

let selectedElement = null;
let count = 0;

// rectangle size
const RECT_WIDTH = 300;
const RECT_HEIGHT = 100;

// gap between rectangles
const H_GAP = 40;//Horizontal Gap rectangle ke beech ka
const V_GAP = 40;//Vertical Gap reectangle ke beech ka

addRectangleBtn.addEventListener("click", () => {

  // canvas size
  const canvasRect = workspace.getBoundingClientRect();

  // items per row (safe) taki 0 rectanglena ho
  const itemsPerRow = Math.max(1,Math.floor(canvasRect.width / (RECT_WIDTH + H_GAP)));

  // grid position
  //konsi row me element hai
  const currentRow = Math.floor(count / itemsPerRow);
  //konse column me hai
  const currentCol = count % itemsPerRow;

  // total grid width (for centering)
  //ek row me jitne rectangles honge + unke beech ke gaps
  //N rectangles ke beech me (N − 1) gaps hote hain
  const gridWidth =
    itemsPerRow * RECT_WIDTH + (itemsPerRow - 1) * H_GAP;

  // start from center
  // gridWidth = ek poori row (sab rectangles + gaps)
  const startX = (canvasRect.width - gridWidth) / 2;
  const startY = 40; // top margin (change if needed)

  // calculate position
  let left = startX + currentCol * (RECT_WIDTH + H_GAP);
  let top = startY + currentRow * (RECT_HEIGHT + V_GAP);

  // boundary check
  if (left + RECT_WIDTH > canvasRect.width) return;
  if (top + RECT_HEIGHT > canvasRect.height) return;

  // create rectangle
  const rectangle = document.createElement("div");
  rectangle.classList.add("rectangle");

  rectangle.style.position = "absolute";
  rectangle.style.width = RECT_WIDTH + "px";
  rectangle.style.height = RECT_HEIGHT + "px";
  rectangle.style.backgroundColor = "red";
  rectangle.style.left = left + "px";
  rectangle.style.top = top + "px";

  // selection logic
  rectangle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedElement) {
      selectedElement.classList.remove("selected");
    }
    rectangle.classList.add("selected");
    selectedElement = rectangle;
  });

  workspace.appendChild(rectangle);
  count++;
});

// deselect on canvas click
workspace.addEventListener("click", () => {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
    selectedElement = null;
  }
});
