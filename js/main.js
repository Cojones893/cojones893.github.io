$(document).ready(function () {
	//-------CANVAS----------
	var myCanvas = document.getElementById("game_window");
	var options = {
		view:myCanvas,
		resolution:1,
		backgroundColor : 0x708090,
		antialias: true
	};
	var GAME_HEIGHT = 900;
	var GAME_WIDTH = 1400;
	var renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, options);
	document.body.appendChild(renderer.view);
	
	var stage = new PIXI.Container();
	stage.interactive = true;
	//-----------------------
	
	
	//--------BUTTON---------
	var buttonWords = ["+", "C", "Cl", "Cli", "Clic", "Click", "Click M", "Click Me", "t Click Me", "'t Click Me", "n't Click Me", "on't Click Me", "Don't Click Me", "Don't Click Me!"];
	var basicText;
	buttonWordsPos = 0;
	
	var buttonObj = new PIXI.Container();
	var buttonGraphics;
	
	var gameStart = false;
	
	var purchaseLargerCircleGraphics;
	var purchaseLargerCircleObj = new PIXI.Container();
	var purchaseLargerCircleText;
	var purchaseLargerCircleCost = 10;
	
	var purchaseTurretGraphics;
	var purchaseTurretObj = new PIXI.Container();
	var purchaseTurretText;
	var purchaseTurretCost = 30;
	
	
	//-----------------------
	
	//----GAME VARIABLES-----
	
	var click = 0;
	var totalClick = 0;
	
	var circleRadius = 1;
	
	var turretsArray = [];
	
	var bullet;
	
	var purchaseList = [{cost:20,exists:purchaseLargerCircleGraphics,graphics:purchaseLargerCircleGraphics, text:[purchaseLargerCircleText,"Bigger Hit Area - 10"], obj:[purchaseLargerCircleObj,10,10], event:onPurchaseLargerCircle},
						{cost:30,exists:purchaseTurretGraphics,graphics:purchaseTurretGraphics,text:[purchaseTurretText, "Buy Turret - 30"], obj:[purchaseTurretObj,240,10], event:onPurchaseLargerCircle}];

	//-----------------------
	
	//------UI Elements------
	
	var counter;
	var money;
	var time;
	
	var counterStyle = {
		align:"right"
	};
	
	var fpsStyle = {
		align:"right",
		fontSize: 10
	};
	var fpsPoll = [60];
	var fpsReset = 0;
	//-----------------------
	
	buildUI();
	
	animate();
	buildButton("ASD", 700, 400);
	
	stage.hitArea = new PIXI.Rectangle(0, 0, 1400, 900);
	
	var clickCircle;
	
	var lastLoop = new Date;
	
	
	
	function buildUI(){
		stage.removeChild(counter);
		counter = new PIXI.Text(click.toString(), counterStyle);
		counter.x = 1390-counter.width;
		counter.y = 10;
		stage.addChild(counter);
		
		fpsCounter = new PIXI.Text(click.toString(), fpsStyle);
		fpsCounter.x = 1390-counter.width;
		fpsCounter.y = 5;
		stage.addChild(fpsCounter);
		
		stage.on('mousedown', clickedStage);
	}
	
	function clickedStage(eventData){
		if(eventData.data.originalEvent.offsetY>50){
			var circle = {
				x: eventData.data.originalEvent.offsetX,
				y: eventData.data.originalEvent.offsetY,
				r: circleRadius
			};
			var rect = {
				x: buttonObj.x,
				y: buttonObj.y,
				w: buttonGraphics.width * buttonObj.scale.x,
				h: buttonGraphics.height * buttonObj.scale.y
			};
			clickCircle = new PIXI.Graphics();
			clickCircle.beginFill(0x536872,.5);
			clickCircle.drawCircle(circle.x, circle.y,circle.r);
			clickCircle.endFill();
			stage.addChild(clickCircle);
			setTimeout(removeCircle, 25, clickCircle);
			//console.log(rect.x, rect.y, rect.w, rect.h);
			//console.log("mouse", circle.x, circle.y);
			if(RectCircleColliding(circle,rect)){
				buttonClicked();
			}	
		}		
	}
	function removeCircle(cir){
		cir.alpha -=.12;
		if(cir.alpha>=.1){
			setTimeout(removeCircle, 25, cir);
		}else{
			stage.removeChild(cir);
		}
	}
	function animate() {
		var thisLoop = new Date;
		var fps = 1000 / (thisLoop - lastLoop);
		lastLoop = thisLoop;
		fpsPoll.push(fps);
		fpsTotal = 0;
		for(var i = 0; i<fpsPoll.length; i++){
			fpsTotal += fpsPoll[i];
		}
		
		if(fpsPoll.length>20){
			fpsPoll.shift();
			
		}
		fpsReset +=1;
		if(fpsReset>60){
			fpsReset = 0;
			fpsCounter.text = ((fpsTotal/fpsPoll.length).toString());
		}
		renderer.render(stage);
		requestAnimationFrame( animate );
	}
	function buildButton(txt, x, y){
		buttonGraphics = new PIXI.Graphics();
		
		// set a fill and line style
		buttonGraphics.lineStyle(2, 0x36454f, 1);
		buttonGraphics.beginFill(0x708090, 0.25);
		buttonGraphics.drawRoundedRect(0, 0, 100, 50, 5);
		buttonGraphics.endFill();
		
		basicText = new PIXI.Text(buttonWords[buttonWordsPos]);
		
		
		buttonObj.addChild(buttonGraphics);
		buttonObj.addChild(basicText);
		
		buttonObj.x = 700-(buttonGraphics.width/2);
		buttonObj.y = 450-(buttonGraphics.height/2);
		
		stage.addChild(buttonObj);
		
		basicText.x = 45;
		basicText.y = 7;
	}
	function RectCircleColliding(circle, rect) {
		var distX = Math.abs(circle.x - rect.x - rect.w / 2);
		var distY = Math.abs(circle.y - rect.y - rect.h / 2);

		if (distX > (rect.w / 2 + circle.r)) {
			return false;
		}
		if (distY > (rect.h / 2 + circle.r)) {
			return false;
		}

		if (distX <= (rect.w / 2)) {
			return true;
		}
		if (distY <= (rect.h / 2)) {
			return true;
		}

		var dx = distX - rect.w / 2;
		var dy = distY - rect.h / 2;
		return (dx * dx + dy * dy <= (circle.r * circle.r));
	}
	function updateUI(){
		
		if(totalClick>5 && purchaseLargerCircleGraphics==undefined){
			purchaseLargerCircleGraphics = new PIXI.Graphics();
			
			// set a fill and line style
			purchaseLargerCircleGraphics.lineStyle(2, 0x36454f, 1);
			purchaseLargerCircleGraphics.beginFill(0x708090, 0.25);
			purchaseLargerCircleGraphics.drawRoundedRect(0, 0, 250, 50, 5);
			purchaseLargerCircleGraphics.endFill();
			
			purchaseLargerCircleText = new PIXI.Text("Bigger Hit Area - 10");
			
			purchaseLargerCircleObj.addChild(purchaseLargerCircleGraphics);
			purchaseLargerCircleObj.addChild(purchaseLargerCircleText);
			
			purchaseLargerCircleObj.x = 10;
			purchaseLargerCircleObj.y = 10;
			
			stage.addChild(purchaseLargerCircleObj);
			
			purchaseLargerCircleText.x = 10;
			purchaseLargerCircleText.y = 7;
			
			purchaseLargerCircleObj.scale.x=.75;
			purchaseLargerCircleObj.scale.y=.75;
			purchaseLargerCircleObj.interactive = true;
			purchaseLargerCircleObj.on('mousedown', onPurchaseLargerCircle);
			purchaseLargerCircleObj.on('touchstart', onPurchaseLargerCircle);
			
		}
		if(totalClick>20 && purchaseTurretGraphics==undefined){
			
			
			purchaseTurretGraphics = new PIXI.Graphics();
			
			// set a fill and line style
			purchaseTurretGraphics.lineStyle(2, 0x36454f, 1);
			purchaseTurretGraphics.beginFill(0x708090, 0.25);
			purchaseTurretGraphics.drawRoundedRect(0, 0, 250, 50, 5);
			purchaseTurretGraphics.endFill();
			
			purchaseTurretText = new PIXI.Text("Buy Turret - 30");
			
			purchaseTurretObj.addChild(purchaseTurretGraphics);
			purchaseTurretObj.addChild(purchaseTurretText);
			
			purchaseTurretObj.x = 240;
			purchaseTurretObj.y = 10;
			
			stage.addChild(purchaseTurretObj);
			
			purchaseTurretText.x = 45;
			purchaseTurretText.y = 7;
			
			purchaseTurretObj.scale.x=.75;
			purchaseTurretObj.scale.y=.75;
			purchaseTurretObj.interactive = true;
			purchaseTurretObj.on('mousedown', onPurchaseTurret);
			purchaseTurretObj.on('touchstart', onPurchaseTurret);
		}
		counter.text = (click.toString());
		counter.x = 1390-counter.width;
	}
	function onPurchaseLargerCircle(eventData){
		console.log(click, purchaseLargerCircleCost);
		if(click>=purchaseLargerCircleCost){
			click -= purchaseLargerCircleCost;
			purchaseLargerCircleObj.removeChild(purchaseLargerCircleText);
			purchaseLargerCircleCost = Math.ceil(purchaseLargerCircleCost*1.2);
			purchaseLargerCircleText = new PIXI.Text("Bigger Hit Area - " + purchaseLargerCircleCost.toString());
			purchaseLargerCircleObj.addChild(purchaseLargerCircleText);
			purchaseLargerCircleText.x = 10;
			purchaseLargerCircleText.y = 7;
			
			circleRadius+=10;
			updateUI();
		}
	}
	
	function onPurchaseTurret(eventData){
		console.log(click, purchaseLargerCircleCost);
		if(click>=purchaseLargerCircleCost){
			click -= 30;
			//purchaseLargerCircleObj.removeChild(purchaseLargerCircleText);
			//purchaseLargerCircleCost = Math.ceil(purchaseLargerCircleCost*1.2);
			//purchaseLargerCircleText = new PIXI.Text("Bigger Hit Area - " + purchaseLargerCircleCost.toString());
			//purchaseLargerCircleObj.addChild(purchaseLargerCircleText);
			//purchaseLargerCircleText.x = 10;
			//purchaseLargerCircleText.y = 7;
			turretsArray.push(new Turret((Math.random()*1300)+25,850,1).draw());

			updateUI();
		}
	}
	function buttonClicked () {
		click+=1;
		totalClick +=1;
		
		updateUI();
		if(!gameStart){
			spellOutButton();
		}else{
			moveButton();
		}
	}
	
	function moveButton(){
		buttonObj.x = Math.random()*900+200;
		buttonObj.y = Math.random()*500+200;
		if(totalClick == 20){
			buttonObj.scale.x = .75;
			buttonObj.scale.y = .75;
		}if(totalClick == 40){
			buttonObj.scale.x = .5;
			buttonObj.scale.y = .5;
		}
	}
	function spellOutButton(){
		buttonWordsPos+=1;
		basicText.text = buttonWords[buttonWordsPos];
		
		buttonGraphics.clear();
		
		// set a fill and line style
		buttonGraphics.lineStyle(2, 0x36454f, 1);
		buttonGraphics.beginFill(0x708090, 0.25);
		buttonGraphics.drawRoundedRect(0, 0, 90+(basicText.width), 50, 5);
		buttonGraphics.endFill();
		
		buttonObj.x = GAME_WIDTH/2-(buttonGraphics.width/2);
		buttonObj.y = GAME_HEIGHT/2-(buttonGraphics.height/2);
		if(buttonWordsPos>=13){
			gameStart=true;
		}
	}
	
	//-------TURRET--------------
	/*
	
	functions:
		Draw()
			Draws the turret to the screen and starts the shooting process
		startShooting()
			Spawns bullets

	*/
	
	function Turret(x, y, speed){

		// Add object properties like this
		this.x = x;
		this.y = y;
		this.speed = speed;
	    this.i = 0;
		
	}
	Turret.prototype.draw = function(){
		this.turretGraphics = new PIXI.Graphics();
		this.turretGraphics.lineStyle(2, 0x36454f, 1);
		this.turretGraphics.beginFill(0x708090, 0.25);
		this.turretGraphics.drawRoundedRect(0, 0, 50, 50, 5);
		this.turretGraphics.endFill();
		stage.addChild(this.turretGraphics);
		this.turretGraphics.x = this.x;
		this.turretGraphics.y = this.y;
		
		setTimeout(this.startShooting, 200, this);
	};
	Turret.prototype.startShooting = function(t){
		t.i+=1;
		if(t.i>t.speed){
			t.i=0;
			bullet = new Bullet(t.x,850, 5);
			bullet.draw();
			
		}setTimeout(t.startShooting, 200, t);
	};
	
	//----------------------------------
	
	//-----------BULLET-----------------
	/*
		
	functions:
		Draw()
			Draws the bullet to the screen and starts the moving process
		bulletMovement()
			moves bullets
	
	*/
	
	Bullet.prototype.draw = function(){
	    this.bulletContainer = new PIXI.Container();
		this.bulletGraphics = new PIXI.Graphics();
		this.bulletGraphics.lineStyle(2, 0x36454f, 1);
		this.bulletGraphics.beginFill(0x708090, 0.25);
		this.bulletGraphics.drawCircle(0, 0,10);
		this.bulletGraphics.endFill();
		this.bulletContainer.addChild(this.bulletGraphics)
		stage.addChild(this.bulletContainer);
		this.bulletContainer.x = this.x+25;
		this.bulletContainer.y = this.y;
		this.bulletGraphics.alpha=0;
		setTimeout(this.bulletMovement, 16, this);
	};
	
	
	Bullet.prototype.bulletMovement = function(t){
		t.bulletGraphics.alpha=1;
		t.bulletContainer.y-=10;
		var circle = {
			x: t.bulletContainer.x,
			y: t.bulletContainer.y,
			r: 5
		};
		var rect = {
			x: buttonObj.x,
			y: buttonObj.y,
			w: buttonGraphics.width * buttonObj.scale.x,
			h: buttonGraphics.height * buttonObj.scale.y
		};
		if(RectCircleColliding(circle,rect)){
			buttonClicked();
			t.bulletContainer.destroy();
		}else{
			if(t.bulletContainer.y<100){
				t.bulletContainer.destroy();
			}else{
				setTimeout(t.bulletMovement, 16, t);
			}
		}
	};
	
	function Bullet(x,y,v){
		this.x = x;
		this.y = y;
		this.v = v;
	}
	
	//----------------------------------
	
	/*
	for(var i = 0; i<70; i++){
		turretT.push(new Turret((i*20)+25,850,1));

		turretT[i].draw();
	}*/
	
	
	
	
	
	//-------NEEDS WORK-------------
	/*window.addEventListener("resize", resize);
	function resize() {
	 
	  // Determine which screen dimension is most constrained
	  ratio = Math.min(window.innerWidth/GAME_WIDTH,
					   window.innerHeight/GAME_HEIGHT);
	 
	  // Scale the view appropriately to fill that dimension
	  stage.scale.x = stage.scale.y = ratio;
	 
	  // Update the renderer dimensions
	  renderer.resize(Math.ceil(GAME_WIDTH * ratio),
					  Math.ceil(GAME_HEIGHT * ratio));
	}*/
});

