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

    removeSelf(context){
        
        context.arc(this.x, this.y, 20.5, 0, 2 * Math.PI);
        context.closePath();

        context.fillStyle = "white";
        context.fill();
    }
}

function deleteLastNode(){

    if(nodes.length > 0){
    var c = document.getElementById("bfs-canvas");
    var ctx = c.getContext("2d");

    var nodeToDelete = nodes.pop();
    nodeToDelete.removeSelf(ctx);
    }
}