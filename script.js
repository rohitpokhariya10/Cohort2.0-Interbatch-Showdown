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
    selectItem(rectangle);//rectangle pe click krte hi rectangle select ho jayega
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
    selectItem(textBox);//textBox pe click krte hi textBox selecthojayega

    
  });

  workspace.appendChild(textBox);
  nextX += 150 + GAP;//150 value define khudse  kari hai kyunki text box ki koi height width humne define hi nhi kari hai
});

// CANVAS  pe CLICK krte hi  DESELECT hojayega
workspace.addEventListener("click", clearSelection);
workspace.addEventListener("click", removeResizeHandles);

console.log(selectedElement);

// SELECTION LOGIC
function selectItem(item) {
  //  if same element clicked again → deselect
  if (selectedElement === item) {
    selectedElement.classList.remove("selected");
    removeResizeHandles(selectedElement);
    selectedElement = null;
    return;
  }

  //  if different element selected before → remove old
  if (selectedElement) {
    selectedElement.classList.remove("selected");
    removeResizeHandles(selectedElement);
  }

  // select new
  selectedElement = item;
  selectedElement.classList.add("selected");

  enableDragging();
  fillProperties();
  addResizeHandles(selectedElement);
}

//deselection
function clearSelection() {
  if (!selectedElement) return;
  selectedElement.classList.remove("selected");
  removeResizeHandles(selectedElement)
  selectedElement=null
 
}


// DRAGGING LOGIC(pending)
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


//properties pannel easy
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
  //offsetWidth = element की width (padding + border भी include)
  widthInput.value = selectedElement.offsetWidth;
  heightInput.value = selectedElement.offsetHeight;

  const bg = getComputedStyle(selectedElement).backgroundColor;
  //console.log(bg);//browser es format me color dega ---> rgb(255, 0, 0)
  //console.log(getComputedStyle(selectedElement));//browser khudse bhi basic style lagata hai element par taki vo dikhe hume
  const hexColor = rgbToHex(bg);

  colorInput.value = hexColor;
  hexInput.value = hexColor;

  rotationInput.value = 0;
}

//helper function for fillProperties
function rgbToHex(rgb) {
  if (!rgb || rgb === "transparent") {
    return "#000000"; // default safe color
  }

  const result = rgb.match(/\d+/g);
   //kyunki koi bhi color 3 color se hi banta hai (red,blue,green)
  if (!result || result.length < 3) {
    return "#000000";
  }
  //agar 3 se jyada length hai tuh
  return (
    "#" +
    result
      .slice(0, 3) //  sirf R G B lo
      //parseInt(x) --> string ko Integer me convert krega
      //toString(16)  ---> Is number ko hexadecimal (base 16) me convert karke string bana do
      //padStart(2, "0")---> 1 extra 0 jod rhe hai

      .map((x) => parseInt(x).toString(16).padStart(2, "0"))
      .join("")
  );
}

applyProperties();




/////////////////////////
function addResizeHandles(element) {
  // pehle purane handles hata do (duplicate na bane)
  removeResizeHandles(element);

  // element ko relative karna zaroori hai
  // warna handles absolute honge aur bahar chale jayenge
  //element.style.position = "absolute";

  const corners = ["tl", "tr", "bl", "br"];

  corners.forEach((corner) => {
    const handle = document.createElement("div");
    //resize-handle--> base class jo fixed hogi kyunki string me diya hai
    //corner ---> 4 classes jo ki corner me lagengi string me nhi kyun ki ye runtimr me change hogi
    handle.classList.add("resize-handle", corner);
    element.appendChild(handle);
  });
}
function removeResizeHandles(element) {
  //
  const handles = document.querySelectorAll(".resize-handle");
 handles.forEach((h) => h.remove());
}

