/**
 * PlaneSurface.js
 * @author @sgettler
 *
 * Representation of a plane with bounding planes to define a surface.
 */



/**
 * @constructor for a plane surface.
 *
 * @param args arguments object
 *
 * @extends {SPS.Shape}
 */
SPS.PlaneSurface = function(args) {
     SPS.Shape.call(this, args);
     this["type"] = SPS.Shape.Type.PLANESURF;

     if(args["ref"]) {
         this["ref"] = args["ref"];
         this["edge1"] = args["edge1"];
         this["edge2"] = args["edge2"];
         this["edge3"] = args["edge3"];
         this["edge4"] = args["edge4"];
     }
};

SPS.PlaneSurface.prototype = Object.create(SPS.Shape.prototype);
SPS.PlaneSurface.prototype.constructor = SPS.PlaneSurface;



/*
 * Constants.
 */
SPS.PlaneSurface.prototype.shapeRefs = ["ref", "edge1", "edge2", "edge3", "edge4"];
