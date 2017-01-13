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
	//-----------------------
	
	//----GAME VARIABLES-----
	
	var click = 0;
	
	//-----------------------
	
	animate();
	buildButton("ASD")
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
		
		buttonObj.interactive = true;
		buttonObj.on('mousedown', onDown);
		buttonObj.on('touchstart', onDown);
	}
	
	function onDown (eventData) {
		if(!gameStart){
			spellOutButton();
		}else{
			moveButton();
		}
	}
	
	function moveButton(){
		buttonObj.x = Math.random()*900+200;
		buttonObj.y = Math.random()*500+200;
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

