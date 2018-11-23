/**
 * Shape.js
 * @author @sgettler
 *
 * Superclass for geometry objects.
 */



/**
 * @constructor for shape.
 *
 * @param args arguments object
 */
SPS.Shape = function(args) {
    this["layer"] = args["layer"];
    this["uuid"] = args["uuid"] || this.getUUIDv4();
};



/**
 * Generate universally unique identifier. UUIDv4 code adapted from from
 * @broofa on stackoverflow.
 *
 * @return string id
 */
SPS.Shape.prototype.getUUIDv4 = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random()*16 | 0;
        var v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};



/**
 * Enums.
 */
SPS.Shape.Type = {
    POINT: "point",
    PLANE: "plane",
    PLANESEG: "planeseg",
    PLANESURF: "planesurf"
};



/**
 * Returns a JSON-stringifiable object. Where shapes have object references as
 * properties, insert the object UUID string instead.
 *
 * Subclasses should define their own shapeRefs array in their prototype.
 *
 * @return JSON-friendly object
 */
SPS.Shape.prototype.toJSON = function() {
    var j = {};
    for(var k in this)
        if(this[k] != this.shapeRefs)
            j[k] = this.shapeRefs.includes(k) ? this[k]["uuid"] : this[k];
    return j;
};

SPS.Shape.prototype.shapeRefs = [];
