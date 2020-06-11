// Simulation parameters
var agentN = 7;									// Number of agents
var infectRadius = 98;					// Infectivity radius 												(max: 100)
var distancingRadius = 69;			// Social distancing radius (non-additive)		(max: 100)
var infectP = .76;							// Infection probability on collision
var infectRatio = .25;					// Ratio of agents initially infected
var distancingRatio = .25;			// Social distancing probability
var speed = 4;									// Agent speed																(min: 1) (max: 20)

// Boilerplate variables
var canvas = document.getElementById('canvas');
var cliX = canvas.getAttribute('width');
var cliY = canvas.getAttribute('height');
var agents = [];
var floatX = [];
var floatY = [];
let startBtn, agentsLabel, infectedLabel;
var area = infectRadius + distancingRadius;
var newDestX = [];
var newDestY = [];
var steps = [];
var deltaX = [];
var deltaY = [];
var stepRec = [];
var infectedN = 0;

// Initialize canvas
function setup(){
	createCanvas(cliX, cliY);
	startBtn = createButton('Start');
	startBtn.position(19, 19);
	startBtn.mousePressed(start);
}

// Frame draw function
function draw(){
	// Reset canvas
	background(255);
	for(let i = 0; i < agents.length; i++){
		// Make agent movement and collision test
		agents[i].move();
		// Display new agent
		agents[i].display();
	}
}

function Agent(i){
	this.x = floatX[i];
	this.y = floatY[i];
	this.r = infectRadius;
	this.seedConst = Math.random();
	this.seedStep = Math.random();
	this.limiter = 0;
	newDestination(i);

	// Initial probabilities
	if(this.seedConst <= distancingRatio){
		this.distancing = true;
		this.r = area;
	}
	if(this.seedStep <= infectRatio){
		this.infected = true;
		infectedN++;
	}

	this.display = function(){
		// Agent marker
		fill(0);
		if(this.infected == true){
			fill(255,0,0);
		}
		noStroke();
		circle(this.x, this.y, 10);
		// Infection circle
		noFill();
		stroke(0,0,255,50);
		if(this.infected == true){
			stroke(255,0,0,70);
		}
		circle(this.x, this.y, infectRadius*2);
		// Social distancing circle
		if(this.distancing == true){
			circle(this.x, this.y, area*2);
		}
		// Direction line
		stroke(0,255,0);
		line(this.x, this.y, this.x+25*deltaX[i], this.y+25*deltaY[i]);
		// Update labels
		infectedLabel.html(`Infected: ${infectedN}`, false)
	}
	this.move = function(){
		this.seedStep = Math.random();
		floatX[i] = this.x;
		floatY[i] = this.y;
		this.floorX = floatX[i]-area*4;
		this.ceilingX = floatX[i]+area*4;
		this.floorY = floatY[i]-area*4;
		this.ceilingY = floatY[i]+area*4;
		if(stepRec[i] == steps[i]){
			newDestination(i);
		} else {
			this.x += deltaX[i];
			this.y += deltaY[i];
			stepRec[i]++;
			for(let j = 0; j < agents.length; j++){
				if(j !== i){
					var d = dist(this.x, this.y, agents[j].x, agents[j].y);

					if(this.distancing == true){
						if(d < this.r + agents[j].r){
							if(deltaX[i] <= 1 && deltaY[i] <= 1){
								newDestination(i,0);
							} else if(deltaX[i] >= 1 && deltaY[i] <= 1){
								newDestination(i,1);
							} else if(deltaX[i] <= 1 && deltaY[i] >= 1){
								newDestination(i,2);
							} else if(deltaX[i] >= 1 && deltaY[i] >= 1){
								newDestination(i,3);
							}

							if(deltaX[j] <= 1 && deltaY[j] <= 1){
								newDestination(j,0);
							} else if(deltaX[j] >= 1 && deltaY[j] <= 1){
								newDestination(j,1);
							} else if(deltaX[j] <= 1 && deltaY[j] >= 1){
								newDestination(j,2);
							} else if(deltaX[j] >= 1 && deltaY[j] >= 1){
								newDestination(j,3);
							}
						}
					}

					if(this.infected == true){
						if(d < infectRadius*2){
							if(this.seedStep <= infectP && agents[j].infected !== true && this.limiter == 0){
								agents[j].infected = true;
								infectedN++;
							}
							this.limiter = 1;
						} else {
							this.limiter = 0;
						}
					}
				}
			}
		}
	}
}

function newDestination(i,d=-1){
	switch(d){
		case -1:
			stepRec[i] = 1;
			newDestX[i] = Math.round(random(0, cliX));
			newDestY[i] = Math.round(random(0, cliY));
			steps[i] = Math.round((Math.abs(newDestX[i] - floatX[i]) + Math.abs(newDestY[i] - floatY[i])) / speed);
			deltaX[i] = (newDestX[i] - floatX[i]) / steps[i];
			deltaY[i] = (newDestY[i] - floatY[i]) / steps[i];
			break;
		case 0:
			stepRec[i] = 1;
			newDestX[i] = Math.round(random(floatX[i], cliX));
			newDestY[i] = Math.round(random(floatY[i], cliY));
			steps[i] = Math.round((Math.abs(newDestX[i] - floatX[i]) + Math.abs(newDestY[i] - floatY[i])) / speed);
			deltaX[i] = (newDestX[i] - floatX[i]) / steps[i];
			deltaY[i] = (newDestY[i] - floatY[i]) / steps[i];
			break;
		case 1:
			stepRec[i] = 1;
			newDestX[i] = Math.round(random(0, floatX[i]));
			newDestY[i] = Math.round(random(floatY[i], cliY));
			steps[i] = Math.round((Math.abs(newDestX[i] - floatX[i]) + Math.abs(newDestY[i] - floatY[i])) / speed);
			deltaX[i] = (newDestX[i] - floatX[i]) / steps[i];
			deltaY[i] = (newDestY[i] - floatY[i]) / steps[i];
			break;
		case 2:
			stepRec[i] = 1
			newDestX[i] = Math.round(random(floatX[i], cliX));
			newDestY[i] = Math.round(random(0, floatY[i]));
			steps[i] = Math.round((Math.abs(newDestX[i] - floatX[i]) + Math.abs(newDestY[i] - floatY[i])) / speed);
			deltaX[i] = (newDestX[i] - floatX[i]) / steps[i];
			deltaY[i] = (newDestY[i] - floatY[i]) / steps[i];
			break;
		case 3:
			stepRec[i] = 1;
			newDestX[i] = Math.round(random(0, floatX[i]));
			newDestY[i] = Math.round(random(0, floatY[i]));
			steps[i] = Math.round((Math.abs(newDestX[i] - floatX[i]) + Math.abs(newDestY[i] - floatY[i])) / speed);
			deltaX[i] = (newDestX[i] - floatX[i]) / steps[i];
			deltaY[i] = (newDestY[i] - floatY[i]) / steps[i];
			break;
	}
}

// Start simulation
function start(){
	startBtn.remove();
	agentsLabel = createElement("h1", `Agents: ${agentN}`);
	infectedLabel = createElement("h1", "Infected: ");
	for(let agentI = 0; agentI < agentN; agentI++){
		genLoci(agentI);
		agents[agentI] = new Agent(agentI);
	}
}

function genLoci(agentI){
	cacheX = parseFloat((Math.random()*cliX).toFixed(0));
	cacheY = parseFloat((Math.random()*cliY).toFixed(0));
	var lenF = floatX.length - 1
	for(let i = 0; i < floatX.length; i++){
		floorX = floatX[i]-area*2;
		ceilingX = floatX[i]+area*2;
		floorY = floatY[i]-area*2;
		ceilingY = floatY[i]+area*2;
		if(floorX < cacheX && cacheX < ceilingX && floorY < cacheY && cacheY < ceilingY){
			genLoci(agentI);
			break;
		} else if(i == lenF){
			floatX.push(cacheX)
			floatY.push(cacheY)
			break;
		}
	}
	if(agentI == 0){
		floatX.push(cacheX)
		floatY.push(cacheY)
	}
}
