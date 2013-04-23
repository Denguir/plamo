/*
* Plamo by Khalid Ahmada k.ahmada@void.fr 
* V : 1.0 beta for manage Projects 
* VOID - MAROC
*****/
var readline = require('readline');
var exec  = require('child_process').exec;
var spawn  = require('child_process').spawn;
var config = require("./config/conf.js");
var consoles = require("./config/consoles.js");
// Detect The Current OS
var Os = function(){
	var currentOs = require("os").type();
	var reg  =  new RegExp("windows","ig");
	if(reg.test(currentOs)){
		return true;
	}else
		return false;
};

var onWindows = Os();



var fs=require("fs");
var Path = require('path');


// initilize the console and readline 
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// backup the current process
var proceessRunning = '';
 var isOnProjectType  =false;
 var reservedProjectName ='';
var moduleName = "VOID";
var scaffoldContent ={};
/* 
* Plamo Paths 
**/
var plamoUrls =  {
	baseUrl : '',
	type :'b'
}
/*
* Plamo tools interne
***/
var tools = {
   replace: function(string,val){
   		 var reg = new RegExp("__KEYACCESS__","ig");
   		 return string.replace(reg,val);
   },
   path : function(){
   		var resualtvedPath =[];
		 resualtvedPath = __dirname.split("//");

		// GET the Parent Path of plamo.js
			var resolvedP = resualtvedPath.toString();
			resolvedP = onWindows ? resolvedP.split("\\") : resolvedP.split("/");
			resolvedP[resolvedP.length-1] = "";
			resolvedP = onWindows ? resolvedP.join("\\") :  resolvedP.join("/");
			return resolvedP;
   }
}
show =  function(msg){
	console.log(msg);
}
/*
* Plamo Tasks
*/
var plamoTasks = {

	// Create Project Folder with Plamo 
	createProject : function(projectName){
		var resualtvedPath =[];
		 resualtvedPath = __dirname.split("//");

		// GET the Parent Path of plamo.js
			var resolvedP = resualtvedPath.toString();
			resolvedP = onWindows ? resolvedP.split("\\") : resolvedP.split("/");
			resolvedP[resolvedP.length-1] = "";
			resolvedP = onWindows ? resolvedP.join("\\") :  resolvedP.join("/");

		show(consoles.createProject);

		// Set Up the base Url
		plamoUrls.baseUrl =  resolvedP + projectName + (onWindows ? '\\' :'/') ;


		var createProjectFile = function(){
			// clone the project here
			var projetctJson = fs.readFileSync(__dirname+"/config/models/project.json",'utf-8');
			projetctJson = JSON.parse(projetctJson);
			projetctJson.projectName = projectName;
			projetctJson.type =  plamoUrls.type;
			fs.writeFile(plamoUrls.baseUrl + "project.json",JSON.stringify(projetctJson),function(ierr){
				if(ierr){
					show( consoles.errors.copy+ ierror);
					promtCommand();
				}else{
					show(tools.replace(consoles.created,projectName));
					promtCommand();
				}
			});
		}
		if(onWindows){
			var openPathSource = plamoUrls.type.indexOf('cb')>-1 ?  '\\squelette ' : plamoUrls.type.indexOf("js")>-1 ?  '\\squelette-js '  : '\\squelette-basic ' 
			exec("xcopy " + __dirname +  openPathSource + plamoUrls.baseUrl + " /e",function(ierror){
				if(ierror){
					show( consoles.errors.copy+ ierror);
				}else{
					createProjectFile();
				}
				
				
			});
		}else{
			var openPathSource = plamoUrls.type.indexOf('cb')>-1?  '/squelette/ ' : plamoUrls.type.indexOf("js") >-1 ?  '/squelette-js/ '  : '/squelette-basic/ ' 
				
			exec("cp -r "+__dirname + openPathSource + plamoUrls.baseUrl ,function(err1){
				if(err1){
					show( consoles.errors.copy+ err1);
				}else{
					createProjectFile();
				}
			});
		}

	},
	// on scaffolding write the css (stylesheet Files)
	writeCssFiles : function(obj){

		var scssfiles = plamoUrls.baseUrl + 'src/sass/' + String(obj).split('.')[0] +'.scss';
		fs.exists(scssfiles,function(cssexist){
				if(!cssexist){
					fs.writeFile(scssfiles,'');
				}
			});
	}
	// On scaffolding The HTML fiels format
	,createPageOnScaffold:function(obj){
		fs.exists(plamoUrls.baseUrl+'/web/' + obj['id'] + '.html',function(ex){
			var currentHtmlModel = fs.readFileSync(__dirname+'/config/models/site.html');
			var currentJSmoduleSupport = plamoUrls.type.indexOf("cb")>-1 ? fs.readFileSync(__dirname+'/config/models/coffee/app-model.coffee','utf-8') : fs.readFileSync(__dirname+'/config/models/js/app-model.js','utf-8');
			currentJSmoduleSupport = String(currentJSmoduleSupport);
			currentJSmoduleSupport = currentJSmoduleSupport.replace(/__ID__/g , obj['title']);
			// search for scaffolding String
			if(plamoUrls.type.indexOf('j')>-1){
					var stringIncludevtools = ", 'vendor/vtools'";
					var assetsObjecs =  function(){
							var stringtoreturn = '';
							for(var ks = 0 ;  ks < obj['assets'].length; ks++ ){
								stringtoreturn += JSON.stringify(obj['assets'][ks]) + ',';
							}
							stringtoreturn = stringtoreturn.substr(0,stringtoreturn.length-1);
						return stringtoreturn;
					}

				var haveAssets = obj['assets'] ? true : false;


				currentJSmoduleSupport = currentJSmoduleSupport.replace(/__ASSETS__/g , haveAssets ? stringIncludevtools  : '');	
				currentJSmoduleSupport = currentJSmoduleSupport.replace(/__ASSETS1__/g , haveAssets ? ',vtools' : '');

				// Read File templates Assets to get the froamt and mis forme of template
				var contentTEmplateAssetsLoader = fs.readFileSync(__dirname+'/config/models/js/assets.js','utf-8');
				contentTEmplateAssetsLoader = String(contentTEmplateAssetsLoader);
				
				contentTEmplateAssetsLoader = contentTEmplateAssetsLoader.replace(/__ASSETSARRAY__/g, haveAssets ? assetsObjecs() : '');
				currentJSmoduleSupport = currentJSmoduleSupport.replace(/__ASSETS2__/g ,haveAssets ?  contentTEmplateAssetsLoader  : '');	
			}
			// clonning into Modules
			currentHtmlModel = String(currentHtmlModel);
				if((!ex)|| obj['scaffold']){
					var WriteHTMLContext  = "";
					WriteHTMLContext += String(currentHtmlModel).replace(/__TITLE__/g,obj['title']).replace(/__ID__/g,obj['id']);
						if(obj['css'] && obj['css'].length){
							var stringCss = "";
							for(var k =  0 ; k<obj['css'].length;k++){
								stringCss += "<link rel='stylesheet' href='" + obj['css'][k] + "'/>\n";
								
									plamoTasks.writeCssFiles(obj['css'][k]);
								
							}
							WriteHTMLContext =  WriteHTMLContext.replace(/__CSS__/g , stringCss);
						}else{
							WriteHTMLContext = WriteHTMLContext.replace(/__CSS__/g , "<link rel='stylesheet' href='css/main.css'/>");
						}

					fs.writeFile(plamoUrls.baseUrl+'web/' + obj['id']+'.html',WriteHTMLContext);
					fs.writeFile(plamoUrls.baseUrl+ (plamoUrls.type.indexOf('cb')>-1 ? 'src/coffee/app/'+obj['id']+'.coffee' : 'web/js/app/'+obj['id']+'.js') ,currentJSmoduleSupport);
					promtCommand();
				}
		});
	},
	// Process Scafolding
	scaffolding : function(){
		try{
			scaffoldContent = fs.readFileSync(plamoUrls.baseUrl + 'site.json','utf-8');
			scaffoldContent = JSON.parse(scaffoldContent);
			for(var j=0; j< scaffoldContent.pages.length; j++){
				plamoTasks.createPageOnScaffold(scaffoldContent.pages[j]);
			}
			console.log("scaffold is End Succesfully!");
		}catch(e){
			console.log("Plamo Error : On openning Site.json  " + e.message);
		}
	},

	// The Watcher tasks on coffeScript and SASS
	startCakeFile:function(){
		show(plamoUrls.type=='cb' ? consoles.watch : "the watch start on .sass and .scss files");
		if(plamoUrls.type=='cb'){
			exec('coffee -w -c -o '+ plamoUrls.baseUrl +'web/js/ '+ plamoUrls.baseUrl +'src/coffee/',function(){

			});
		}

		exec('sass --watch ' + plamoUrls.baseUrl + 'src/sass:'+ plamoUrls.baseUrl + 'web/css',function(){

		});
		exec('compass --watch ' + plamoUrls.baseUrl + 'src/sass:'+ plamoUrls.baseUrl + 'web/css',function(){

		});
		//exec('sass', ['--watch', 'src/sass:web/css']);
		promtCommand();

	},
	// Add Symbol Link for Text Sublim if is already Installed and the ls become subl
	OpenProjectOnSublim : function(projectPath){

				exec("subl " + projectPath,function(err){
						if(err){
							//show(consoles.errors.opening + projectPath);
							// if alias is not exist  than create it 
							if(onWindows){
								exec('doskey subl="C:\\Program Files\\Sublime Text 2\\sublime_text.exe" $*',function(er2){
									if(er2){
										console.log("Plamo Error : " + er2);
										promtCommand();
									}else{
										exec('start "" "C:\\Program Files\\Sublime Text 2\\sublime_text.exe" "' + projectPath +'"',function(subErr){
											if(subErr){
												console.log("Error On Openning Sublem : " + subErr);
												promtCommand();
											}else{
												promtCommand();
											}
										});
										
									}
								});
							}else{
								exec("sudo ln -s /Applications/Sublime\ Text\ 2.app/Contents/SharedSupport/bin/subl /usr/local/bin/subl",function(errMac){
									if(errMac){
										console.log("Plamo Error : " + errMac);
										promtCommand();
									}else{
										plamoTasks.OpenProjectOnSublim(projectPath);
									}
								});
							}
						}else{
							show(consoles.opened);
							proceessRunning = '';

							plamoTasks.startCakeFile();
						}
				});
			

	},
	setPathFunction : function(line){
		// Test Path is Exist
		console.log("the full Path is :" + line+"plamo.js");
		Path.exists(line+"plamo.js",function(exist){
			if(exist){
				plamoUrls.baseUrl = line;
				show(consoles.baseUrlChanged)
			}else{
				show(tools.replace(consoles.errors.path.notOpned , line))
			}
			proceessRunning ='';
			promtCommand();
		});
	},
	WriteModule : function(line){
		fs.readFile(__dirname +  "/config/models/define.coffee",'utf-8',function(er,data){
				if(!er){
					var extraFileName =line;
					fs.writeFile( plamoUrls.baseUrl + "src/coffee/app/models/" + extraFileName +".coffee", data , function(err){
						
						if(err) {
							show("Plamo Error : " + err)
						}else{
							show("the module "+  line +"is created !");
						}
						promtCommand();
					});
				}else{
					console.log("the file is :: " + er);
				}
		});
	},
	openProjectType :  function(){

	}
};

var promtCommand = function(){
	rl.setPrompt(consoles.commandLabel);
	rl.prompt();
}


/*
* The Redline Listner
*
***/
rl.on('line',function(line){
	if(line.indexOf('create Module') > -1){
		rl.setPrompt(consoles.moduleName);
		proceessRunning = "createingModule";
		rl.prompt();
		line = ''
	}else if((proceessRunning || '').indexOf("createingModule")>-1){
		moduleName = line;
		proceessRunning = '';
		try{

			/*
			*  Test on Project Type  if is js or if is CoffeeScript
			**/
			if(plamoUrls.type.indexOf("j")>-1){
				// TODO : The script is on JavaScript project Type
				var ModelJsContent = fs.readFileSync(__dirname  + "/config/models/js/model.js"  , "utf-8");
					ModelJsContent = ModelJsContent.remplace(/__CURRENT_MODEL__/g, moduleName);
			}
				fs.writeFile( plamoUrls.baseUrl + "src/coffee/app/models/" + moduleName +".coffee","" + moduleName  , function(err){

				if(err){
					rl.setPrompt(" Error : " + err );
					rl.prompt();
				}else{

					fs.writeFile(plamoUrls.baseUrl + "web/templates/" + moduleName +".html");
					fs.writeFile(plamoUrls.baseUrl + "src/coffee/app/views/" + moduleName +".coffee");
					fs.writeFile(plamoUrls.baseUrl + "src/coffee/app/collections/" + moduleName +"s.coffee");

					console.log("your module " + moduleName +  " is created on " + __dirname);
					promtCommand();

					}
				});
		}catch(ermess){
			console.log("Plamo Error : " + ermess.message);
			promtCommand();

		}



	/*
	* create new Project 
	**/
	
	}else if(line.indexOf('create Project') > -1){
		rl.setPrompt("Enter your Project Name : ");
		proceessRunning = "ProjectName";
		rl.prompt();
		line = ''
	}else if((proceessRunning || '').indexOf("ProjectName")>-1){
		reservedProjectName = line;
		proceessRunning = 'ProjectType';
		rl.setPrompt("Your Project Type ? (b) : basic  , (js) : project based On Js , (cb) : Project With CoffeeScript  And Backbone : ");
		proceessRunning = "SetingProjectType";
		rl.prompt();
		proceessRunning = "";
		isOnProjectType = true;
		line = ''
	}else if( line.match(/js|b|cb/) && (isOnProjectType)){
			
			if(line.indexOf('b')>-1 ||  line.indexOf('js')>-1 || line.indexOf('cb')>-1 ){
				plamoUrls.type =  line.indexOf('b') >-1 && line.indexOf('c') == -1 ? 'b' : line.indexOf('js')>-1 ? 'js' : 'cb';
				rl.setPrompt('');
				proceessRunning = '';
				plamoTasks.createProject(reservedProjectName);
				isOnProjectType =false;
			}
	}else if(isOnProjectType){
		// ask user to Type the current Project type
		rl.prompt();
	}else if(( ! line.match(/(js)|(b)|(cb)/) ) && (proceessRunning =='ProccessingProjectType')){
		rl.setPrompt("please enter the correct Project Type : (js) or (b) or (cb)");
		rl.prompt();
	}else if(line.indexOf('open Project') > -1){
		proceessRunning = "openningProject";
		plamoTasks.OpenProjectOnSublim(plamoUrls.baseUrl.substr(0,plamoUrls.baseUrl.length-1));
	

	/*
	*  init with Project
	**/
	}else if(line.indexOf('set Path') > -1){
		rl.setPrompt(consoles.fullpath);
		rl.prompt();
		proceessRunning = "setingPath"
	/*
	*  show the command prompt agin
	***/	
	}else if(proceessRunning.indexOf('setingPath')>-1){
		plamoTasks.setPathFunction(line);
	
	/*
	* The process to read boot.js File
	**/
	}else if(line.indexOf('defmod') > -1){
		proceessRunning = "defmod";
		
		rl.setPrompt("Module Name :");
		rl.prompt();

	}else if(proceessRunning == 'defmod'){

		plamoTasks.WriteModule(line);
	}else if(line.indexOf('scaffold')>-1){
		console.log("scaffold is Starting")
	plamoTasks.scaffolding();		

	}
	else if(line.indexOf('select Project')>-1){
		rl.setPrompt("Enter the current Project : ");
		proceessRunning = "selectProject";
		rl.prompt();
	} else if(proceessRunning == "selectProject"){

			Path.exists(tools.path()+line+"/site.json",function(projectExist){
				if(!projectExist){
					show('the Project ' + tools.path() + line +  ' is not Exists !');
					rl.prompt();
				}else{
					plamoUrls.baseUrl = tools.path()+line + '/';

					// Read the File project.json
					var projetctJson = fs.readFileSync(plamoUrls.baseUrl + "project.json",'utf-8');
					projetctJson = JSON.parse(projetctJson);
					plamoUrls.type = projetctJson.type;

					show("the current project is : " + plamoUrls.baseUrl);
					proceessRunning ="";
					promtCommand();
				}
			});
	}else if(line.indexOf('start watching')>-1){
		if(plamoUrls.baseUrl !=''){
			plamoTasks.startCakeFile();
		}else{
			show("you must select first Your Project (use select Project Command) ");
			promtCommand();
			}
		
	}else{
		show(consoles.errors.commandnotfouand + "->>" + line);
		promtCommand();
	}
});

/*
* Start Point 
**/


show(consoles.welcome);
promtCommand();
