var numberOfNodes = 0;
var nodes = [];


function createNode() {
    var c = document.getElementById("bfs-canvas");
    var ctx = c.getContext("2d");

    //random number between 0 and 480...which is a rough boundary of our canvas that's 500x500
    const x = Math.floor(Math.random() * 480);
    const y = Math.floor(Math.random() * 480);

    var node = new Node(x, y, numberOfNodes++);
    node.drawSelf(ctx);
    nodes.push(node);

}

class Node {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }

    drawSelf(canvasContext) {
        this.drawCircle(canvasContext);
        this.drawText(canvasContext);
    }

    drawCircle(context) {
        context.beginPath();

        context.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        context.closePath();

        context.fillStyle = "red";
        context.fill();
    }

    drawText(context) {
        context.fillStyle = "black";

        var width = context.measureText(this.text).width;
        var height = context.measureText("w").width; // this is a GUESS of height

        context.fillText(this.text, this.x - (width / 2), this.y + (height / 2));
    }

    removeSelf(context) {
        context.closePath();
        context.beginPath();
        context.arc(this.x, this.y, 20.5, 0, 2 * Math.PI);


        context.fillStyle = "white";
        context.fill();
    }

    drawConnection(context, node) {

        var yDif = this.y - node.y;
        var xDif = node.x - this.x;
        var theta;
        var addPi = false;
        var thirdQuad = false;


        // If the position of the difference is in the 2nd quadrant we want to add pi after we find the angle
        if ((yDif > 0 && xDif < 0)) {
            xDif = -xDif;
            addPi = true;
        }


        theta = Math.atan(yDif / xDif); // find the angle

        if (addPi)
            theta = -theta + Math.PI;

        // If the difference is in the 3rd quadrant than we want to swap the signs of the position on the edge of the node
        if ((yDif < 0 && xDif < 0))
            thirdQuad = true;

        if (!thirdQuad) {
            var posX = 20 * Math.cos(theta) + this.x;
            var posY = -20 * Math.sin(theta) + this.y;
            var posX2 = -20 * Math.cos(theta) + node.x;
            var posY2 = 20 * Math.sin(theta) + node.y;
        }
        else {
            var posX = -20 * Math.cos(theta) + this.x;
            var posY = 20 * Math.sin(theta) + this.y;
            var posX2 = 20 * Math.cos(theta) + node.x;
            var posY2 = -20 * Math.sin(theta) + node.y;
        }

        //Draw the line between nodes
        context.closePath();
        context.beginPath();
        context.moveTo(posX, posY);
        context.lineTo(posX2, posY2);
        context.stroke();





    }
}

function deleteLastNode() {

    if (nodes.length > 0) {
        var c = document.getElementById("bfs-canvas");
        var ctx = c.getContext("2d");

        var nodeToDelete = nodes.pop();

        numberOfNodes = numberOfNodes - 1;
        nodeToDelete.removeSelf(ctx);
    }
}

function getConnectionNodes() {


    // Get the value of the first connection node
    var firstNode = nodes.at(document.getElementById("FirstNode").value);
    // Get the value of the second connection node
    var secondNode = nodes.at(document.getElementById("SecondNode").value);

    // If both nodes are less than the size that means the length of the array is greater than the value of the nodes
    if (typeof secondNode !== 'undefined' && typeof firstNode !== 'undefined') {
        var c = document.getElementById("bfs-canvas");
        var ctx = c.getContext("2d");
        firstNode.drawConnection(ctx, secondNode);
    }
}
