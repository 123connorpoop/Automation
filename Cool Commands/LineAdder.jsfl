/******************************************************************************
LINE ADDER
Description: Continuously prompt the user for voice line files and
automatically adds them to the next textbox in the timeline. 
(A config file is required)
******************************************************************************/

// set scriptPath to "/path/../LineAdder.jsfl"
var scriptPath = fl.scriptURI;
// set dirURL to the path up to the last / character (i.e. just the path)
var dirURL = scriptPath.substring(0, scriptPath.lastIndexOf("/"));

// store the document object and other data inside
var doc = fl.getDocumentDOM();
var layer = doc.getTimeline().getSelectedLayers();
var curFrame = fl.getDocumentDOM().getTimeline().currentFrame;
var frameArray = fl.getDocumentDOM().getTimeline().layers[layer].frames;

alert("Select the config file for this batch of voice lines. If you don't have this file, run the JAR that is also provided.");
// Open the file explorer, prompting the user to select a file
var cfgPath = fl.browseForFileURL("select");

/*var num = prompt("Number of first voice line:");

if(num == null) {
	throw new Error("User stopped script.");
}*/

/*
Function: extendVoiceLine
Variables:  
	lineName [A string containing the name of a voice line]
Description: insert frames to match voice line length + 3 frames
*/
function extendVoiceLine(lineName) {
	doc.getTimeline().insertFrames(3 + (Math.ceil(doc.frameRate * voiceLineLengths[lineName])) - doc.getTimeline().layers[doc.getTimeline().findLayerIndex("TEXT")].frames[doc.getTimeline().currentFrame].duration, true);
}

fl.runScript(cfgPath);

var curLayer = "";
//var count = parseInt(num) - 1;
var prevVoiceLine = "none";

fl.getDocumentDOM().getTimeline().layers[fl.getDocumentDOM().getTimeline().findLayerIndex("TEXT")].locked = true;

// while the current frame is before the last frame in the current layer
while(doc.getTimeline().currentFrame < doc.getTimeline().layers[doc.getTimeline().currentLayer].frames.length - 1) {
	// prompt user and store input
	var cancel = confirm("Previous voice line: " + prevVoiceLine + ". Select voice line to add. Select no file to skip this text keyframe. Click cancel to stop this script.");
	// if the user stops the script via the panel...
	if(!cancel) {
		throw new Error("User stopped script.");
	}
	// open the file explorer, promting the user to select a file
	var linePath = fl.browseForFileURL("select");
	// if the user selected a valid file...
	if(linePath != null) {
		// initialize an empty layer variable
		var layerToAddTo = undefined;
		// while the layer variable is still empty...
		while(layerToAddTo == undefined) {
			// show the user some options
			var promptPanel = fl.xmlPanelFromString("<dialog title=\"Line Adder\" buttons=\"accept, cancel\"> <vbox> <hbox> <label value=\"Name of voice layer (click cancel to stop script):\" control=\"panel_layerName\"/> <textbox id=\"panel_layerName\" size=\"24\" value=\"" + curLayer + "\"/> </hbox> </vbox> </dialog>");
			// if the user stops the script via the panel...
			if(promptPanel.dismiss != "accept") {
				throw new Error("User stopped script.");
			}
			// give the layer variable the index of the variable of the name the user provided
			layerToAddTo = doc.getTimeline().findLayerIndex(promptPanel.panel_layerName);
			// save the layer name for later
			curLayer = promptPanel.panel_layerName;
			// if we don't have a valid layer, the loop should start over
		}
		// select the layer the user gave us (multiplied by 1 to make sure it's an integer)
		doc.getTimeline().setSelectedLayers(layerToAddTo * 1);
		// unlock the selected layer(s)
		fl.getDocumentDOM().getTimeline().layers[doc.getTimeline().getSelectedLayers() * 1].locked = false;
		// import the user-selected line file into the library
		doc.importFile(linePath);
		// store the name of only the file instead of the whole path
		var lineName = linePath.substring(linePath.lastIndexOf("/") + 1);
		// replace %20 placeholders in filename with the space it is supposed to be
		lineName = lineName.replace("%20", " ");
		// store the name of the file for future use as a "previous line"
		prevVoiceLine = lineName;
		// insert frames based on line length
		extendVoiceLine(lineName);
		//count++;
	}
	// select the text layer
	doc.getTimeline().setSelectedLayers(doc.getTimeline().findLayerIndex("TEXT") * 1);
	// set the current frame to the last frame in the layer
	doc.getTimeline().currentFrame = doc.getTimeline().layers[doc.getTimeline().currentLayer].frames[doc.getTimeline().currentFrame].startFrame + doc.getTimeline().layers[doc.getTimeline().currentLayer].frames[doc.getTimeline().currentFrame].duration;
}
