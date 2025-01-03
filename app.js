document.getElementById("healthForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    // Collect form data
    const name = document.getElementById("name").value;
    const rawDate = document.getElementById("date").value;
    const [year, month, day] = rawDate.split("-");
    const formattedDate = `${day}-${month}-${year}`; // Convert to dd-mm-yyyy format
    const feeling = document.querySelector('input[name="feeling"]:checked').value;
    const signatureCanvas = document.getElementById("signature");
    const signatureData = signatureCanvas.toDataURL();

    // Generate PDF
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      console.error("jsPDF not loaded");
      return;
    }

    const pdfDoc = new jsPDF();
    pdfDoc.text(`Daily Health Check`, 10, 10);
    pdfDoc.text(`Name: ${name}`, 10, 20);
    pdfDoc.text(`Date: ${formattedDate}`, 10, 30); // Updated date format
    pdfDoc.text(`Feeling Well: ${feeling}`, 10, 40);

    // Add signature to PDF if drawn
    if (hasDrawn) {
      const img = new Image();
      img.src = signatureData;
      img.onload = () => {
        pdfDoc.addImage(img, "PNG", 10, 50, 100, 30);
        pdfDoc.save("HealthForm.pdf");
      };
    } else {
      pdfDoc.text("No signature provided", 10, 50);
      pdfDoc.save("HealthForm.pdf");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
});

// Canvas signature handling
const canvas = document.getElementById("signature");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let hasDrawn = false;

// For mouse interactions
canvas.addEventListener("mousedown", () => {
  isDrawing = true;
  hasDrawn = true;
});
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;
  draw(event.offsetX, event.offsetY);
});

// For touch interactions
canvas.addEventListener("touchstart", (event) => {
  isDrawing = true;
  hasDrawn = true;
  const touch = event.touches[0];
  draw(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
  event.preventDefault(); // Prevent scrolling
});
canvas.addEventListener("touchmove", (event) => {
  if (!isDrawing) return;
  const touch = event.touches[0];
  draw(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
  event.preventDefault(); // Prevent scrolling
});
canvas.addEventListener("touchend", () => {
  isDrawing = false;
  ctx.beginPath();
});

// Draw function
function draw(x, y) {
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Clear signature canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasDrawn = false;
});