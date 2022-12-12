console.log("canvas.js is active");

let canvas = document.getElementById("signatureCanvas");
let context = canvas.getContext("2d");
context.strokeStyle = "#222222";
context.lineWidth = 1;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener("mousemove", function (e) {
    if (!isDrawing) return;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
});
canvas.addEventListener("mouseup", function () {
    isDrawing = false;
});
canvas.addEventListener("mouseleave", function () {
    isDrawing = false;
});

let submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function () {
    let dataUrl = canvas.toDataURL();
    const hiddenValue = (document.getElementById("sigHidden").value = dataUrl);
    console.log(hiddenValue);
});
