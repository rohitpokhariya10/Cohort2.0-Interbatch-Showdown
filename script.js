let addRectangleBtn = document.querySelector(".rectangle-btn");
let workspace = document.querySelector(".middle-area");
let selectedElement = null;
 
 const gap = 120;
 let reCount = 0;  


addRectangleBtn.addEventListener("click", () => {
    const rectWidth = 100;//intial height width
    const rectHeight = 100;////intial height width
    console.log(rectHeight,rectWidth);
    
     
    //Bhai workspace (canvas) screen pe exact kahan aur kitna bada hai?
    //Canvas ka actual size runtime pe pata karna
    const canvasRect = workspace.getBoundingClientRect();
    console.log(canvasRect);
    
    const centerX = (canvasRect.width - rectWidth) / 2;
    const centerY = (canvasRect.height - rectHeight) / 2;


    let rectangle = document.createElement("div");

    rectangle.style.width = rectWidth + "px";
    rectangle.style.height = rectHeight + "px";
    rectangle.style.backgroundColor = "red";
    rectangle.style.position = "absolute";

    rectangle.style.top  = centerY  + "px";
 
    rectangle.style.left = centerX + reCount * gap + "px";
    reCount++;
    
  
   

    rectangle.addEventListener("click", (e) => {
        e.stopPropagation();

        if (selectedElement) {
            selectedElement.classList.remove("selected");
        }

        rectangle.classList.add("selected");
        selectedElement = rectangle;
    });

    workspace.appendChild(rectangle);
});

workspace.addEventListener("click", () => {
    if (selectedElement) {
        selectedElement.classList.remove("selected");
        selectedElement = null;
    }
});
