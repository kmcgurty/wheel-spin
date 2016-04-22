var options = {
    COLOR_LIST: ["#003366", "#336699", "#3366CC", "#003399", "#000099", "#0000CC", "#000066", "#006666", "#006699", "#0099CC", "#0066CC", "#0033CC", "#0000FF", "#3333FF", "#333399", "#669999", "#009999", "#33CCCC", "#00CCFF", "#0099FF", "#0066FF", "#3366FF", "#3333CC", "#666699", "#339966", "#00CC99", "#00FFCC", "#00FFFF", "#33CCFF", "#3399FF", "#6699FF", "#6666FF", "#6600FF", "#6600CC", "#339933", "#00CC66", "#00FF99", "#66FFCC", "#66FFFF", "#66CCFF", "#99CCFF", "#9999FF", "#9966FF", "#9933FF", "#9900FF", "#006600", "#00CC00", "#00FF00", "#66FF99", "#99FFCC", "#CCFFFF", "#CCCCFF", "#CC99FF", "#CC66FF", "#CC33FF", "#CC00FF", "#9900CC", "#003300", "#009933", "#33CC33", "#66FF66", "#99FF99", "#CCFFCC", "#FFFFFF", "#FFCCFF", "#FF99FF", "#FF66FF", "#FF00FF", "#CC00CC", "#660066", "#336600", "#009900", "#66FF33", "#99FF66", "#CCFF99", "#FFFFCC", "#FFCCCC", "#FF99CC", "#FF66CC", "#FF33CC", "#CC0099", "#993399", "#333300", "#669900", "#99FF33", "#CCFF66", "#FFFF99", "#FFCC99", "#FF9999", "#FF6699", "#FF3399", "#CC3399", "#990099", "#666633", "#99CC00", "#CCFF33", "#FFFF66", "#FFCC66", "#FF9966", "#FF6666", "#FF0066", "#CC6699", "#993366", "#999966", "#CCCC00", "#FFFF00", "#FFCC00", "#FF9933", "#FF6600", "#FF5050", "#CC0066", "#660033", "#996633", "#CC9900", "#FF9900", "#CC6600", "#FF3300", "#FF0000", "#CC0000", "#990033", "#663300", "#CC3300", "#993300", "#990000", "#800000"],
    data: [{ text: "option 1", color: "red" }, { text: "option 2", color: "blue" }, { text: "option 3", color: "purple" }, { text: "option 4", color: "yellow" }, { text: "option 5", color: "gray" }],
    draw: {
        textSize: 25, //px
        startingSpeed: 20, //deg
        decreaseRate: 0.05 //rad
    }
}


var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var deg2rad = (Math.PI / 180)
var rad2deg = (180 / Math.PI)

var circleVars = {
    width: canvas.width,
    height: canvas.height,

    centerX: canvas.width / 2,
    centerY: canvas.height / 2,

    fullRotation: round(360 * deg2rad),

    startAngle: 0,
    endAngle: ((2 * Math.PI) / options.data.length),
    circleAngle: 0,
    rotationAngle: 0,

    radius: canvas.width / 2
}

draw();

function draw() {
    var t = circleVars;

    ctx.save();
    ctx.clearRect(0, 0, t.width, t.height);

    //reset the rotation angle back to 0 so it isn't infinitely growing
    if (t.circleAngle >= t.fullRotation) {
        t.circleAngle = 0;
        t.startAngle = 0;
    } else {
        t.circleAngle += round(t.rotationAngle * deg2rad);
    }

    ctx.translate(t.centerX, t.centerY);
    ctx.rotate(t.circleAngle);

    for (var i = 0; i < options.data.length; i++) {
        ctx.fillStyle = options.data[i].color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, t.radius, t.startAngle, t.endAngle + t.startAngle);
        ctx.lineTo(0, 0);
        ctx.fill();

        ctx.save();

        var textX = Math.cos(t.endAngle / 4) * (t.radius / 4);
        var textY = Math.sin(t.endAngle / 4) * (t.radius / 4) - (options.draw.textSize / 2);
        var textRotation = t.startAngle + t.endAngle / 2;

        ctx.rotate(textRotation);
        ctx.font = options.draw.textSize + "px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(options.data[i].text, textX, textY);

        ctx.restore();

        t.startAngle += t.endAngle;
    }

    ctx.restore();

    //triangle
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(t.width, t.centerY - 25);
    ctx.lineTo(t.width, t.centerY + 25);
    ctx.lineTo(t.width - 15, t.centerY);
    ctx.fill();

    if (t.rotationAngle >= 0) {
        t.rotationAngle -= options.draw.decreaseRate;
        requestAnimationFrame(draw);
    } else {
        canvas.hasClicked = false; //allow spinning again, once finished
    }
}

function round(num) {
    return Math.round((num) * 100) / 100;
}

function getRandomColor() {
    return COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)];
}

canvas.addEventListener("click", function() {
    var shouldAdd = (circleVars.rotationAngle < 35 &&
        circleVars.rotationAngle > 15);

    var hasClicked = !!this.hasClicked;

    if (shouldAdd) {
        circleVars.rotationAngle += 5;
    } else if (!hasClicked) {
        circleVars.rotationAngle = options.draw.startingSpeed;
        requestAnimationFrame(draw);
    }

    this.hasClicked = true;
});
