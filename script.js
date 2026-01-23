// Buttons & Workspace
const addRectangleBtn = document.querySelector(".rectangle-btn");
const addTextBtn = document.querySelector(".text-btn");
const workspace = document.querySelector(".middle-area");


// Selected Element
let selectedElement = null;


// Rectangle config
const RECT_WIDTH = 300;
const RECT_HEIGHT = 100;
const GAP = 20;


// Next placement position
let nextX = 10;
let nextY = 10;


// ADD RECTANGLE
addRectangleBtn.addEventListener("click", () => {
  const canvasRect = workspace.getBoundingClientRect();
    //canvasRect.width → canvas ki right wall
    //canvasRect.height → canvas ki bottom wall
    //nextX, nextY → next rectangle kahaan draw hoga
    //RECT_WIDTH, RECT_HEIGHT → rectangle ka size
    //GAP → rectangles ke beech ka gap
  if (nextY + RECT_HEIGHT > canvasRect.height) {
    alert("No more space");
    return;
  }

  if (nextX + RECT_WIDTH > canvasRect.width) {
    //Rectangle ko left side wapas le aana 10px ke gap se
    nextX = 10;
    nextY += RECT_HEIGHT + GAP;//taki next row me jate  waqt element overlap na kre
  }

  const rectangle = document.createElement("div");
  rectangle.classList.add("rectangle");

  rectangle.style.position = "absolute";
  rectangle.style.width = RECT_WIDTH + "px";
  rectangle.style.height = RECT_HEIGHT + "px";
  rectangle.style.backgroundColor = "red";
  rectangle.style.left = nextX + "px";
  rectangle.style.top = nextY + "px";

  rectangle.addEventListener("click", (e) => {
    e.stopPropagation();
    selectItem(rectangle);//rectangle pe click krte hi rectangle select ho jaye
  });

  workspace.appendChild(rectangle);
  nextX += RECT_WIDTH + GAP;//har iteration me nextX change hoga kyunki row fill hogi phele
});

// ADD TEXT(same logic as above)
addTextBtn.addEventListener("click", () => {
  const canvasRect = workspace.getBoundingClientRect();

  if (nextY + 40 > canvasRect.height) {
    alert("No more space");
    return;
  }

  if (nextX + 200 > canvasRect.width) {
    nextX = 10;
    nextY += 30 + GAP;//30 extra space
  }

  const textBox = document.createElement("div");
  textBox.innerText = "Type text";
  textBox.contentEditable = true;

  textBox.style.position = "absolute";
  textBox.style.left = nextX + "px";
  textBox.style.top = nextY + "px";
  textBox.style.minWidth = "120px";
  textBox.style.minHeight = "30px";
  textBox.style.padding = "6px";
  textBox.style.border = "1px dashed #666";
  textBox.style.cursor = "text";

  textBox.addEventListener("click", (e) => {
    e.stopPropagation();
    selectItem(textBox);
  });

  workspace.appendChild(textBox);
  nextX += 150 + GAP;//150 value define khudse  kari hai kyunki text box ki koi height width humne define hi nhi kari hai
});

// CANVAS CLICK → DESELECT hojayega
workspace.addEventListener("click", clearSelection);


// SELECTION LOGIC
function selectItem(item) {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  selectedElement = item;
  selectedElement.classList.add("selected");

  enableDragging();//jo bhi element selected hoga vohi drag ho sakta hai
  fillProperties();
}
//deselection
function clearSelection() {
  if (!selectedElement) return;
  selectedElement.classList.remove("selected");
  selectedElement = null;
}


// DRAGGING LOGIC
function enableDragging() {
  if (!selectedElement) return;

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  selectedElement.onmousedown = (e) => {
    if (!selectedElement) return; // 🛑 safety check

    isDragging = true;
    offsetX = e.clientX - selectedElement.offsetLeft;
    offsetY = e.clientY - selectedElement.offsetTop;
  };

  document.onmousemove = (e) => {
    if (!isDragging || !selectedElement) return; // 🛑 safety

    const canvasRect = workspace.getBoundingClientRect();

    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;

    if (left < 0) left = 0;
    if (top < 0) top = 0;

    if (left + selectedElement.offsetWidth > canvasRect.width) {
      left = canvasRect.width - selectedElement.offsetWidth;
    }

    if (top + selectedElement.offsetHeight > canvasRect.height) {
      top = canvasRect.height - selectedElement.offsetHeight;
    }

    selectedElement.style.left = left + "px";
    selectedElement.style.top = top + "px";
  };

  document.onmouseup = () => {
    isDragging = false;
  };
}


const widthInput = document.querySelector(".width");
//console.log(widthInput.type);
const heightInput = document.querySelector(".height");
const colorInput = document.querySelector(".color");
const hexInput = document.querySelector(".hex");
const rotationInput = document.querySelector(".rotation");
// PROPERTIES PANEL
function applyProperties() {
  widthInput.addEventListener("input", () => {
    if (!selectedElement) return;
    selectedElement.style.width = widthInput.value + "px";
    
   
  });

  heightInput.addEventListener("input", () => {
    if (!selectedElement) return;
    selectedElement.style.height = heightInput.value + "px";
    
  });

  colorInput.addEventListener("input", () => {
    if (!selectedElement) return;
    selectedElement.style.backgroundColor = colorInput.value;
    hexInput.value = colorInput.value;//jo color hai vo  hex input me bhi aye
    
  });

  hexInput.addEventListener("input", () => {
    if (!selectedElement) return;
    selectedElement.style.backgroundColor = hexInput.value;
    colorInput.value = hexInput.value;//hex input ki value se color input bhi change hoga
    
  });

  rotationInput.addEventListener("input", (e) => {
    if (!selectedElement) return;
    selectedElement.style.transform = `rotate(${rotationInput.value}deg)`;
    
  });
}


// FILL PROPERTIES ON SELECT
function fillProperties() {
  if (!selectedElement) return;

  widthInput.value = selectedElement.offsetWidth;
  heightInput.value = selectedElement.offsetHeight;

  const bg = getComputedStyle(selectedElement).backgroundColor;
  const hexColor = rgbToHex(bg);

  colorInput.value = hexColor;
  hexInput.value = hexColor;

  rotationInput.value = 0;
}


function rgbToHex(rgb) {
  if (!rgb || rgb === "transparent") {
    return "#000000"; // default safe color
  }

  const result = rgb.match(/\d+/g);

  if (!result || result.length < 3) {
    return "#000000";
  }

  return (
    "#" +
    result
      .slice(0, 3) // 👈 sirf R G B lo, alpha ignore
      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("")
  );
}


applyProperties();
