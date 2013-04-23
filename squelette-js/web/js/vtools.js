/*
* VOID Tools is JavaScript Library of VOID || Core Developped By Khalid Ahmada k.ahmada@void.fr
**/

define['jquery',function($){
     var vtools = {
     	config : {

     	}
     }
     vtools.eventModel = {
     	types : ['loading','loadingEnd','loadingStart']
     }
     vtools.events = [];


     vtools.init = function(){

     };
     vtools.loadAssets (asset){
     	// Asset is an Array

     	for(var i = 0 ; i < asset.length ; i++){
     		var _aset = asset[i]
     			type = _aset.type;

     		

     	} 
     }
     return vtools;
	}
}]