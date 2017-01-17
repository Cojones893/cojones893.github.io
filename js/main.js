$(document).ready(function () {
	//-------CANVAS----------
	var myCanvas = document.getElementById("game_window");
	var options = {
	view:myCanvas,
	resolution:1,
	backgroundColor : 0x708090,
	antialias: true
	};	
	var renderer = PIXI.autoDetectRenderer(1400, 900, options);
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
	
	//-----------------------
	
	//----GAME VARIABLES-----
	
	var click = 0;
	var totalClick = 0;
	
	var circleRadius = 1;
	
	//-----------------------
	
	//------UI Elements------
	
	var counter;
	var money;
	var time;
	
	var counterStyle = {
		align:"right"
	};
	
	//-----------------------
	
	buildUI();
	
	animate();
	buildButton("ASD");
	
	stage.hitArea = new PIXI.Rectangle(0, 0, 1400, 900);
	
	var clickCircle;
	
	function buildUI(){
		stage.removeChild(counter);
		counter = new PIXI.Text(click.toString(), counterStyle);
		counter.x = 1390-counter.width;
		counter.y = 10;
		stage.addChild(counter);
		
		stage.on('mousedown', clickedStage);
	}
	
	function clickedStage(eventData){
		var circle = {
			x: eventData.data.originalEvent.offsetX,
			y: eventData.data.originalEvent.offsetY,
			r: circleRadius
		};
		var rect = {
			x: buttonObj.x,
			y: buttonObj.y,
			w: buttonGraphics.width,
			h: buttonGraphics.height
		};
		clickCircle = new PIXI.Graphics();
		clickCircle.beginFill(0x536872,.5);
		clickCircle.drawCircle(circle.x, circle.y,circle.r);
		clickCircle.endFill();
		stage.addChild(clickCircle);
		setTimeout(removeCircle, 50, clickCircle);
		//console.log(rect.x, rect.y, rect.w, rect.h);
		//console.log("mouse", circle.x, circle.y);
		if(RectCircleColliding(circle,rect)){
			buttonClicked();
		}		
	}
	function removeCircle(cir){
		cir.alpha -=.12;
		if(cir.alpha>=.1){
			setTimeout(removeCircle, 100, cir);
		}else{
			stage.removeChild(cir);
		}
	}
	function animate() {
		
		renderer.render(stage);
		requestAnimationFrame( animate );
	}
	function buildButton(txt){
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
		
		if(totalClick>20 && purchaseLargerCircleGraphics==undefined){
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
			//console.log("btn", buttonObj.x, buttonObj.y, buttonGraphics.width, buttonGraphics.height)
			purchaseLargerCircleObj.interactive = true;
			purchaseLargerCircleObj.on('mousedown', onPurchaseLargerCircle);
			purchaseLargerCircleObj.on('touchstart', onPurchaseLargerCircle);
			
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
		
		buttonObj.x = 700-(buttonGraphics.width/2);
		buttonObj.y = 450-(buttonGraphics.height/2);
		if(buttonWordsPos>=13){
			gameStart=true;
		}
	}
});

