window.addEventListener("load", () => {
  const canvas = document.getElementById("paintCanvas");
  const context = canvas.getContext("2d");

  let painting = false;
  let erasing = false;
  let filling = false;

  function startPosition(e) {
    e.preventDefault(); // Evita o comportamento padrão de toque (scrolling, etc.)

    if (filling) {
      const color = document.getElementById("colorPicker").value;
      context.fillStyle = color;
      context.fillRect(
        e.touches[0].clientX - canvas.offsetLeft,
        e.touches[0].clientY - canvas.offsetTop,
        1,
        1
      );
      filling = false;
      return;
    }

    if (erasing) {
      context.strokeStyle = "white";
      context.lineWidth = document.getElementById("brushSize").value;
    } else {
      context.strokeStyle = document.getElementById("colorPicker").value;
      context.lineWidth = document.getElementById("brushSize").value;
    }

    painting = true;
    draw(e);
  }

  function endPosition() {
    painting = false;
    erasing = false;
    context.beginPath();
  }

  function draw(e) {
    if (!painting) return;

    context.lineCap = "round";
    context.lineTo(
      e.touches[0].clientX - canvas.offsetLeft,
      e.touches[0].clientY - canvas.offsetTop
    );
    context.stroke();
    context.beginPath();
    context.moveTo(
      e.touches[0].clientX - canvas.offsetLeft,
      e.touches[0].clientY - canvas.offsetTop
    );
  }

  canvas.addEventListener("mousedown", startPosition);
  canvas.addEventListener("mouseup", endPosition);
  canvas.addEventListener("mousemove", draw);

  // Adiciona eventos de toque
  canvas.addEventListener("touchstart", startPosition);
  canvas.addEventListener("touchend", endPosition);
  canvas.addEventListener("touchmove", draw);

  const clearButton = document.getElementById("clearButton");
  clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  const eraserButton = document.getElementById("eraserButton");
  eraserButton.addEventListener("click", () => {
    erasing = true;
  });

  const fillButton = document.getElementById("fillButton");
  fillButton.addEventListener("click", () => {
    filling = true;
  });

  const increaseSizeButton = document.getElementById("increaseSizeButton");
  increaseSizeButton.addEventListener("click", () => {
    const currentWidth = canvas.width;
    const currentHeight = canvas.height;
    const newWidth = currentWidth * 1.5;
    const newHeight = currentHeight * 1.5;

    resizeCanvas(newWidth, newHeight);
  });

  const resizeButton = document.getElementById("resizeButton");
  resizeButton.addEventListener("click", () => {
    const newWidth = parseInt(document.getElementById("newWidthInput").value);
    const newHeight = parseInt(document.getElementById("newHeightInput").value);

    if (newWidth && newHeight) {
      resizeCanvas(newWidth, newHeight);
    } else {
      alert("Por favor, insira uma largura e altura válidas.");
    }
  });

  function resizeCanvas(newWidth, newHeight) {
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = newWidth;
    canvas.height = newHeight;
    context.putImageData(imgData, 0, 0);
  }
});
