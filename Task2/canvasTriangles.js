
var canvasTriangles = (function () {
    'use strict';
    var self = {},
        canvas,
        ctx,
        canvasWidth,
        canvasHeight,
        clickCounter = 0,
        pointArray = [],
        currentColor,
        triangleContainer = [];

    function relMouseCoords(event) {
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = this;

        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while (currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return { x: canvasX, y: canvasY }
    }

    function lineDistance(point1, point2) {
        var xs = 0,
            ys = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function Triangle(a, b, c, color) {
        this.A = a;
        this.B = b;
        this.C = c;
        this.color = color;
    }

    Triangle.prototype.calculateArea = function () {
        var a = lineDistance(this.A, this.B),
            b = lineDistance(this.B, this.C),
            c = lineDistance(this.C, this.A),

            s = (a + b + c) / 2, //represents the semiperimeter
            area = Math.round(Math.sqrt(s * (s - a) * (s - b) * (s - c)));
        console.log(area);
        return area; //area calculation
    };

    Triangle.prototype.getCenter = function () {
        var centerX = (this.A.x + this.B.x + this.C.x) / 3,
            centerY = (this.A.y + this.B.y + this.C.y) / 3
        return new Point(centerX, centerY);
    }

    Triangle.prototype.drawTriangle = function () {
        console.log(this, JSON.stringify(this));
        console.log('-------------------------------');
        console.log(JSON.stringify(triangleContainer));

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.A.x, this.A.y);
        ctx.lineTo(this.B.x, this.B.y);
        ctx.lineTo(this.C.x, this.C.y);
        ctx.fill();

        drawPoint(this.A.x, this.A.y);
        drawPoint(this.B.x, this.B.y);
        drawPoint(this.C.x, this.C.y);

        var center = this.getCenter(),
            area = this.calculateArea(),
            temp = currentColor;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(area, center.x, center.y);
        ctx.fillStyle = currentColor;
    }

    function drawPoint(x, y) {
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    function clearCanvas() {
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Restore the transform
        ctx.restore();
        triangleContainer = [];
    }

    function loadFromLocalStorage() {
        clearCanvas();
        console.log('Loading triangles after clearing canvas.');
        var select = $('#triangle-selector').html('');

        for (var save in localStorage) {
            select.append(new Option(save, localStorage[save]));
        }
    }

    function addEvents() {
        $('#color-picker').off('change').on('change', function () {
            currentColor = this.value;

            console.log(currentColor);
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = currentColor;
        });

        $('#canvas').off('click').on('click', function (e) {
            var cords = canvas.relMouseCoords(e),
                triangle;

            drawPoint(cords.x, cords.y);

            clickCounter++;
            if (clickCounter <= 3) {
                pointArray.push(new Point(cords.x, cords.y));
                if (clickCounter === 3) {
                    triangle = new Triangle(pointArray[0], pointArray[1], pointArray[2], currentColor);
                    console.log('Created Triangle:  ', triangle);
                    triangleContainer.push(triangle);
                    triangle.drawTriangle();
                    pointArray = [];
                    clickCounter = 0;
                }
            }
        });

        $('#clear-canvas').off('click').on('click', clearCanvas);

        $('#save-triangles').off('click').on('click', function () {
            var name = prompt('Write your save name', 'Pencho');
            localStorage.setItem(name, JSON.stringify(triangleContainer));
            loadFromLocalStorage();
        });

        $('#load-triangles').off('click').on('click', function () {
            clearCanvas();
            var triangles = JSON.parse($('#triangle-selector').val()),
                current = {};
            for (var triangle in triangles) {
                current = new Triangle(triangles[triangle].A, triangles[triangle].B, triangles[triangle].C, triangles[triangle].color);
                triangleContainer.push(current);
                current.drawTriangle();
            };
        });
    }

    return {
        init: function () {
            HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            self = this;
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            currentColor = '#000000';

            loadFromLocalStorage();
            addEvents();
        }
    };
})();

$(document).ready(function () {
    canvasTriangles.init();
});
