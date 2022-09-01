var numberOfNodes = 0;
var nodes = [];
var nodePositions = [];
var time = 50;
var initalTime = 50;
var lengthOfColor = .01;
var loading = false;
var pause = false;


function createNode() {
    var c = document.getElementById("bfs-canvas");
    var ctx = c.getContext("2d");
    startingNode.options.add(new Option(numberOfNodes, numberOfNodes, numberOfNodes));
    endingNode.options.add(new Option(numberOfNodes, numberOfNodes, numberOfNodes));
    bfsStart.options.add(new Option(numberOfNodes, numberOfNodes, numberOfNodes));
    if(loading)
         throw console.error("Cannot Create Nodes While Running BFS");
    //random number between 0 and 480...which is a rough boundary of our canvas that's 500x500
    const x = Math.floor(Math.random() * 480);
    const y = Math.floor(Math.random() * 480);
    const pos = new Pair(x, y);
    nodePositions.push(findRandomNodePosition(pos));

    var node = new Node(pos.x, pos.y, numberOfNodes++);
    node.drawSelf(ctx);
    nodes.push(node);

}

function findRandomNodePosition(pos) {
    // Go through and check every vertex
    for (i = 0; i < nodePositions.length; i++) {
        const p = nodePositions.at(i);
        const distance = Math.sqrt(Math.pow((p.x - pos.x), 2) + (Math.pow((p.y - pos.y),2)));
        // If the position between this vertex and another is less than 100 then
        // generate a new random point for this vertex
        if (distance < 50) {
            console.log("got here");
            const x = Math.floor(Math.random() * 480);
            const y = Math.floor(Math.random() * 480);
            pos.x = x;
            pos.y = y;
            // Call itself again to check this new random point.
            findRandomNodePosition(pos);
            break;
        }
    }
    return pos;
}

class Pair{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
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
        context.stroke();
    
        if (color === true){
            context.fillStyle = "#19C9FF";
            context.fill();
        }
        context.strokeStyle = "black";
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
            const startNode = findLineAngle(true, this, node);
            const endNode = findLineAngle(false, this, node);
      
            context.moveTo(startNode.x, startNode.y);
            context.lineTo(endNode.x, endNode.y);
            context.stroke();
        this.connectionList.push(node);
        node.connectionList.push(this);
    }
}



function connectionNodes() {
    if(loading)
          throw console.error("Cannot Draw Connections While Running BFS");
    // Get the value of the first connection node
    var firstNode = nodes.at(document.getElementById("startingNode").value);
    // Get the value of the second connection node
    var secondNode = nodes.at(document.getElementById("endingNode").value);

    // If both nodes are less than the size that means the length of the array is greater than the value of the nodes
    if (typeof secondNode !== 'undefined' && typeof firstNode !== 'undefined') {
        var c = document.getElementById("bfs-canvas");
        var ctx = c.getContext("2d");
        firstNode.drawConnection(ctx, secondNode);

    } else
        throw console.error("Input correct nodes to add connections");
}

async function runBFS() {
    if(loading){
        pause = !pause;
        return;
    }

    var c = document.getElementById("bfs-canvas");
    var ctx = c.getContext("2d");
    var startingNode = nodes.at(document.getElementById("bfsStart").value);
    if (typeof startingNode === 'undefined')
        throw console.error("Input a node inorder to run BFS");
    loading = true;
    // Create the queue used to run a bfs
    const nodeQueue = [];
    nodeQueue.push(startingNode);
    startingNode.drawCircle(ctx, true);
    startingNode.drawText(ctx);
    startingNode.visitedState = true;
    // continue the bfs until there are no nodes left in the queue
    while (nodeQueue.length > 0) {
        const nodesToAnimate = [];
        var currentNode = nodeQueue.pop();
        await sleep(time);
        // Recolor the connections between each node
        ctx.closePath();
        ctx.beginPath();
        
        for (i = 0; i < currentNode.connectionList.length; i++) {
            const connectionNode = currentNode.connectionList.at(i);
            if (connectionNode.visitedState === false) {
                connectionNode.visitedState = true;
                nodeQueue.push(connectionNode);
                nodesToAnimate.push(connectionNode);
            }

        }

        while(lengthOfColor < 1){
            for(i = 0; i < nodesToAnimate.length;i++){
                   redrawConnections(ctx, currentNode, nodesToAnimate.at(i));
            }
            lengthOfColor+= .01;
            drawConnections(ctx);
            await sleep(time/2);
            if(pause)
                await pauseAnimation();
        }
        lengthOfColor = .01;
        ctx.strokeStyle = "black";
        // Recolor each node
        for (i = 0; i < currentNode.connectionList.length; i++) {
            const connectionNode = currentNode.connectionList.at(i);
            redrawNode(ctx, currentNode, connectionNode);
        }
    }
    loading = false;
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

function findLineAngle(start,startingNode, endingNode){
    var yDif = startingNode.y - endingNode.y;
    var xDif = endingNode.x- startingNode.x;
    var theta;
    var addPi = false;
    var thirdQuad = false;
    var posX, posY, posX2, posY2;

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
         posX = 20 * Math.cos(theta) + startingNode.x;
         posY = -20 * Math.sin(theta) + startingNode.y;
         posX2 = -20 * Math.cos(theta) + endingNode.x;
         posY2 = 20 * Math.sin(theta) + endingNode.y;
    }
    else {
         posX = -20 * Math.cos(theta) +startingNode.x;
         posY = 20 * Math.sin(theta) +  startingNode.y;
         posX2 = 20 * Math.cos(theta) + endingNode.x;
         posY2 = -20 * Math.sin(theta) + endingNode.y;
    }

    if(start == true)
        return new Pair(posX, posY);
    return new Pair(posX2, posY2);

}

function redrawConnections(context, startingNode, endingNode){
    const realStart = findLineAngle(true, startingNode, endingNode);
    const realEnd = findLineAngle(false, startingNode, endingNode);
    const distance = Math.sqrt(Math.pow((realEnd.x - realStart.x), 2) +  Math.pow((realEnd.y - realStart.y), 2));
    const vector = new Pair(realEnd.x - realStart.x, realEnd.y - realStart.y);
    const vectorMagnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    const unitVector = new Pair((vector.x/vectorMagnitude), (vector.y/vectorMagnitude));
    const coverage = distance * lengthOfColor; // in other words the u vector
    const normalVector = new Pair(unitVector.x * coverage, unitVector.y * coverage);

    context.strokeStyle = "#19C9FF";
    //Draw this change
    context.moveTo(realStart.x, realStart.y);
    context.lineTo(realStart.x + normalVector.x, realStart.y + normalVector.y);

}

function drawConnections(context){
    context.stroke();
}
/**
 * Used to change animation speed
 */
function changeAnimationSpeed() {
    var slider = document.getElementById("animationSlider");
    time = 50 * (10 - slider.value);
    initalTime = 50 * (10 - slider.value);
}


/**
 * This function will stop everything until the pause flag is false
 */
async function pauseAnimation(){
    while(pause){
        await sleep(100);
    }
}

async function pauseButton(){
    pause = !pause;
}


