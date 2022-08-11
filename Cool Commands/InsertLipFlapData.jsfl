/******************************************************************************
INSERT LIP FLAP DATA
Description: 
Stores a lip flap length for the currently selected character pose
as dictated by the user.
******************************************************************************/

var characterName = fl.getDocumentDOM().getTimeline().name; // store the name of the character symbol
var characterTimeline = fl.getDocumentDOM().getTimeline(); // get the timeline of the character symbol
var xSheetLayerIndex = characterTimeline.findLayerIndex("xSheet"); // get the integer index of layer "xSheet"
if (xSheetLayerIndex == undefined) {
    xSheetLayerIndex = 0; // assume it's at 0 if somehow it doesn't find it
}
var poseFrame = fl.getDocumentDOM().getTimeline().currentFrame; // get the index of the current frame
// in the character timeline, obtain the name of the pose as it stands on the given frame
var poseName = characterTimeline.layers[xSheetLayerIndex].frames[poseFrame].name;
// assign firstFrameOfLipFlap as the next frame
// prompt the user for lipFlapLength (default length is 6)
var firstFrameOfLipFlap = fl.getDocumentDOM().getTimeline().currentFrame + 1, lipFlapLength = parseInt(prompt("Lip Flap Length", 6));
// if the user doesn't hit "cancel"
if (lipFlapLength != null) {
    // store raw data inside the fla document for later use
    fl.getDocumentDOM().addDataToDocument(characterName + "." + poseName + ".lipFlap", "integerArray", [firstFrameOfLipFlap, lipFlapLength]);
}