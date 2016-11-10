$(document).ready(function () {
	var totalWidth = $( window ).width();
	var totalHeight = $( window ).height();
	var startWidth = 200;
	var startHeight = 120;
	
	var widthOffset = 0;
	var heightOffset = 0;
	var i=0;
	$('#panel1').css('width', startWidth);
	$('#panel1').css('height', startHeight);
	$('#panel1').css('height', startHeight);
	$('#col1').css('padding-left', (totalWidth/2)-startWidth/2);
	$('#col1').css('padding-top', (totalHeight/2)-startHeight/2);
	$('#mainBtn').css('marginTop', 20);
	$("#money_li").html('<b>'+i+'</b>');
	var buttonTextInt = 0;
	var buttonText = ["C", "Cl", "Cli", "Clic", "Click", "Click m", "Click me", " Click me", "t Click me", "'t Click me", "n't Click me", "on't Click me", "Don't Click Me"];
	$("#mainBtn").button().click(function(){
		i++;
		$("#money_li").html('<b>'+i+'</b>');
		$("#mainBtn").html(buttonText[buttonTextInt]);
		buttonTextInt++;
		if(buttonTextInt>=13){
			$("#mainBtn").addClass("btn btn-lg btn-danger center-block");
			$("#col1").css("padding-left", Math.round(Math.random()*(totalWidth-startWidth)));
			$("#col1").css("padding-top", Math.round(Math.random()*(totalHeight-startHeight)));
		}
	});
});