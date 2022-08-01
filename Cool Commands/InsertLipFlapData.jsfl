var characterName = fl.getDocumentDOM().getTimeline().name;
var characterTimeline = fl.getDocumentDOM().getTimeline(); // get the timeline of the selected symbol
var xSheetLayerIndex = characterTimeline.findLayerIndex("xSheet"); // get the integer index of layer "xSheet"
if (xSheetLayerIndex == undefined) {
    xSheetLayerIndex = 0; // assume it's at 0 if somehow it doesn't find it
}
var poseFrame = fl.getDocumentDOM().getTimeline().currentFrame; // get the index in the firstFrame property
// in the character timeline, obtain the name of the pose as it stands on the given frame
var poseName = characterTimeline.layers[xSheetLayerIndex].frames[poseFrame].name;
var firstFrameOfLipFlap = fl.getDocumentDOM().getTimeline().currentFrame + 1, lipFlapLength = parseInt(prompt("Lip Flap Length", 6));
fl.getDocumentDOM().addDataToDocument(characterName + "." + poseName + ".lipFlap", "integerArray", [firstFrameOfLipFlap, lipFlapLength]);