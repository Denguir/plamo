var readline = require('readline');

var fs=require("fs");


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var proceessRunning = null;
var moduleName = "VOID";

rl.on('line',function(line){
	if(line.indexOf('create Module') > -1){
		rl.setPrompt("enter your module Name : ");
		proceessRunning = "createingModule";
		rl.prompt();
		line = ''
	}else if((proceessRunning || '').indexOf("createingModule")>-1){
		moduleName = line;
		proceessRunning = null;
		//rl.prompt();

		fs.writeFile("web/js/app/views/" + moduleName +".js","define bla bla " + moduleName  , function(err){
			if(err){
				rl.setPrompt(" Error : " + err );
				rl.prompt();
			}else{
				console.log("you module" + moduleName +  " is created");
			}
		});

	}
});

rl.setPrompt("Welcome on VOID Plamo v:1.0");
rl.prompt();