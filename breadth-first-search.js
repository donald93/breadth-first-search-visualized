var numberOfNodes = 0;
var nodes = [];
var directional = false;
var time = 100;
var initalTime = 100;

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
        this.connectionList = [];
        this.visitedState = false;
    }

    drawSelf(canvasContext) {
        this.drawCircle(canvasContext);
        this.drawText(canvasContext);
    }

    drawCircle(context, color) {
        context.beginPath();

        context.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        context.closePath();

        context.fillStyle = "red";
        if (color === true)
            context.fillStyle = "blue";
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

    drawConnection(context, node, color) {

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

        if (color === true)
            context.strokeStyle = 'blue';
        context.stroke();
        // drawArrow2(posX, posY, posX2, posY2, theta);

        this.connectionList.push(node);
        if (directional)
            node.connectionList.push(this);
    }
}

/**
 * TODO
 * this function is useless if each node spawns away from other nodes
 */
function deleteLastNode() {

    if (nodes.length > 0) {
        var c = document.getElementById("bfs-canvas");
        var ctx = c.getContext("2d");

        var nodeToDelete = nodes.pop();

        numberOfNodes = numberOfNodes - 1;
        nodeToDelete.removeSelf(ctx);
    }
}

function connectionNodes() {
    // Get the value of the first connection node
    var firstNode = nodes.at(document.getElementById("FirstNode").value);
    // Get the value of the second connection node
    var secondNode = nodes.at(document.getElementById("SecondNode").value);

    // If both nodes are less than the size that means the length of the array is greater than the value of the nodes
    if (typeof secondNode !== 'undefined' && typeof firstNode !== 'undefined') {
        var c = document.getElementById("bfs-canvas");
        var ctx = c.getContext("2d");
        firstNode.drawConnection(ctx, secondNode);

    } else
        throw console.error("Input correct nodes to add connections");
}

async function runBFS() {
    var c = document.getElementById("bfs-canvas");
    var ctx = c.getContext("2d");
    var startingNode = nodes.at(document.getElementById("BFS").value);
    if (typeof startingNode === 'undefined')
        throw console.error("Input a node inorder to run BFS");

    // Create the queue used to run a bfs
    const nodeQueue = [];
    nodeQueue.push(startingNode);
    startingNode.drawCircle(ctx, true);
    startingNode.drawText(ctx);
    startingNode.visitedState = true;
    // continue the bfs until there are no nodes left in the queue
    while (nodeQueue.length > 0) {
        var currentNode = nodeQueue.pop();
        await sleep(time);
        // Recolor the connections between each node
        for (i = 0; i < currentNode.connectionList.length; i++) {
            const connectionNode = currentNode.connectionList.at(i);
            if (connectionNode.visitedState === false) {
                connectionNode.visitedState = true;
                nodeQueue.push(connectionNode);
                redrawNodeConnection(ctx, currentNode, connectionNode);
            }

        }
        await sleep(time);
        // Recolor each node
        for (i = 0; i < currentNode.connectionList.length; i++) {
            const connectionNode = currentNode.connectionList.at(i);
            redrawNode(ctx, currentNode, connectionNode);
        }
    }
}
/**
 * Used to stop the code for a certain amount of time
 * @param {integer} ms 
 * @returns 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function redrawNode(context, currentNode, connectionNode) {
    connectionNode.drawCircle(context, true);
    connectionNode.drawText(context);
}
function redrawNodeConnection(context, currentNode, connectionNode) {
    currentNode.drawConnection(context, connectionNode, true);
}

function isDirectional() {
    directional = true;
}

/**
 * Used to change animation speed
 */
function changeAnimationSpeed() {
    var slider = document.getElementById("animationSlider");
    time = 100 * (10 - slider.value);
    initalTime = 100 * (10 - slider.value);
}

