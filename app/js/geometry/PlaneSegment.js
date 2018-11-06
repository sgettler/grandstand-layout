/**
 * PlaneSegment.js
 * @author @sgettler
 *
 * Representation of a plane with bounding planes to define a segment.
 */



/**
 * @constructor for a plane segment.
 *
 * @param args arguments object
 *
 * @extends {SPS.Shape}
 */
SPS.PlaneSegment = function(args) {
     SPS.Shape.call(this, args);
     this["type"] = SPS.Shape.Type.PLANESEG;

     if(args["ref"]) {
         this["ref"] = args["ref"];
         this["start"] = args["start"];
         this["end"] = args["end"];
     }
};

SPS.PlaneSegment.prototype = Object.create(SPS.Shape.prototype);
SPS.PlaneSegment.prototype.constructor = SPS.PlaneSegment;



/*
 * Constants.
 */
SPS.PlaneSegment.prototype.shapeRefs = ["ref", "start", "end"];
