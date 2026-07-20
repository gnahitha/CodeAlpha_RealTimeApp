const canvas = document.getElementById("whiteboard");

if (canvas) {

    const ctx = canvas.getContext("2d");

    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    // Whiteboard Tools
    const pencilBtn = document.getElementById("pencilBtn");
    const eraserBtn = document.getElementById("eraserBtn");
    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    const downloadBoard = document.getElementById("downloadBoard");
    const clearBtn = document.getElementById("clearBoard");

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    ctx.globalCompositeOperation = "source-over";

    // ==========================
    // Drawing
    // ==========================

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stopDrawing);

    function startDrawing(e) {

        drawing = true;

        lastX = e.offsetX;
        lastY = e.offsetY;

    }

    function draw(e) {

        if (!drawing) return;

        ctx.beginPath();

        ctx.moveTo(lastX, lastY);

        ctx.lineTo(e.offsetX, e.offsetY);

        ctx.stroke();

        socket.emit("draw", {
            roomId: ROOM_ID,
            x1: lastX,
            y1: lastY,
            x2: e.offsetX,
            y2: e.offsetY,
            color: ctx.strokeStyle,
            width: ctx.lineWidth,
            mode: ctx.globalCompositeOperation
        });

        lastX = e.offsetX;
        lastY = e.offsetY;

    }

    function stopDrawing() {

        drawing = false;

        ctx.beginPath();

    }

    // ==========================
    // Receive Drawing
    // ==========================

    socket.on("draw", (data) => {

        ctx.save();

        ctx.globalCompositeOperation = data.mode;

        ctx.strokeStyle = data.color;

        ctx.lineWidth = data.width;

        ctx.beginPath();

        ctx.moveTo(data.x1, data.y1);

        ctx.lineTo(data.x2, data.y2);

        ctx.stroke();

        ctx.restore();

    });

    // ==========================
    // Pencil
    // ==========================

    if (pencilBtn) {

        pencilBtn.addEventListener("click", () => {

            ctx.globalCompositeOperation = "source-over";

            ctx.strokeStyle = colorPicker.value;

        });

    }

    // ==========================
    // Eraser
    // ==========================

    if (eraserBtn) {

        eraserBtn.addEventListener("click", () => {

            ctx.globalCompositeOperation = "destination-out";

        });

    }

    // ==========================
    // Color Picker
    // ==========================

    if (colorPicker) {

        colorPicker.addEventListener("input", () => {

            ctx.globalCompositeOperation = "source-over";

            ctx.strokeStyle = colorPicker.value;

        });

    }

    // ==========================
    // Brush Size
    // ==========================

    if (brushSize) {

        brushSize.addEventListener("change", () => {

            ctx.lineWidth = Number(brushSize.value);

        });

    }

    // ==========================
    // Download
    // ==========================

    if (downloadBoard) {

        downloadBoard.addEventListener("click", () => {

            const link = document.createElement("a");

            link.download = "whiteboard.png";

            link.href = canvas.toDataURL("image/png");

            link.click();

        });

    }

    // ==========================
    // Clear
    // ==========================

    if (clearBtn) {

        clearBtn.addEventListener("click", () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            socket.emit("clear-board", ROOM_ID);

        });

    }

    socket.on("clear-board", () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

    });

}