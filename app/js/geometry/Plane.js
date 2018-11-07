/**
 * PLane.js
 * @author @sgettler
 *
 * Representation of a plane.
 */



/**
 * @constructor for plane definition.
 *
 * @param args arguments object
 *
 * @extends {SPS.Shape}
 */
SPS.Plane = function(args) {
    SPS.Shape.call(this, args);
    this["type"] = SPS.Shape.Type.PLANE;

    if(args["coefs"]) {
        this["coefs"] = args["coefs"];
    }
    if(args["offset"]) {
        this["ref"] = args["ref"];
        this["offset"] = args["offset"];
    }
    if(args["angle"]) {
        this["ref"] = args["ref"];
        this["angle"] = args["angle"];
        this["point"] = args["point"];
        this["axis"] = args["axis"];
    }
};

SPS.Plane.prototype = Object.create(SPS.Shape.prototype);
SPS.Plane.prototype.constructor = SPS.Plane;



/*
 * Constants.
 */
SPS.Plane.prototype.shapeRefs = ["ref", "point", "axis"];

SPS.Plane.XY_PLANE = new SPS.Plane({
    "layer": "origin",
    "coefs": [0, 0, 1, 0]
});
SPS.Plane.XZ_PLANE = new SPS.Plane({
    "layer": "origin",
    "coefs": [0, 1, 0, 0]
});
SPS.Plane.YZ_PLANE = new SPS.Plane({
    "layer": "origin",
    "coefs": [1, 0, 0, 0]
});



/**
 * Return coefficients defining the plane.
 *
 * @return 4-member array of coefficients
 */
SPS.Plane.prototype.getCoefs = function() {
    if(this["offset"]) {
        var c = this["ref"].getCoefs();
        c[3] -= this["offset"];
        return c;
    }
    if(this["angle"]) {
        var a = this["angle"];
        var u = this["axis"].getCoords();
        var qr = [Math.cos(a/2),  u[0]*Math.sin(a/2),  u[1]*Math.sin(a/2),  u[2]*Math.sin(a/2)];
        var qi = [Math.cos(a/2), -u[0]*Math.sin(a/2), -u[1]*Math.sin(a/2), -u[2]*Math.sin(a/2)];
        var h = function(q1, q2) {
            return [
                q1[0]*q2[0] - q1[1]*q2[1] - q1[2]*q2[2] - q1[3]*q2[3],
                q1[0]*q2[1] + q1[1]*q2[0] + q1[2]*q2[3] - q1[3]*q2[2],
                q1[0]*q2[2] - q1[1]*q2[3] + q1[2]*q2[0] + q1[3]*q2[1],
                q1[0]*q2[3] + q1[1]*q2[2] - q1[2]*q2[1] + q1[3]*q2[0]
            ];
        };
        var c = this["ref"].getCoefs();
        var p = this["point"].getCoords();
        var n = h(qr, h([0, c[0], c[1], c[2]], qi)).slice(1);
        return [n[0], n[1], n[2], c[3]+(c[0]-n[0])*p[0]+(c[1]-n[1])*p[1]+(c[2]-n[2])*p[2]];
    }
    return Object.assign([],this["coefs"]);
};



/**
 * Return a vector corresponding to the plane normal.
 *
 * @return normal vector
 */
SPS.Plane.prototype.getNormal = function() {
    var c = this.getCoefs();
    return new SPS.Point({
        "coords": [c[0], c[1], c[2]]
    });
};



/**
 * Return a new plane offset a given distance from this plane.
 *
 * @param offset distance to offset in plane normal direction
 * @return new plane
 */
SPS.Plane.prototype.getOffsetPlane = function(offset) {
    return new SPS.Plane({
        "layer": this["layer"],
        "ref": this,
        "offset": offset
    });
};



/**
 * Return a new plane rotated a given angle about an axis.
 *
 * @param angle angle to rotate about axis
 * @param point point to rotate about
 * @param axis axis to rotate about
 * @return new plane
 */
SPS.Plane.prototype.getRotatedPlane = function(angle, point, axis) {
    return new SPS.Plane({
        "layer": this["layer"],
        "ref": this,
        "angle": angle,
        "point": point,
        "axis": axis
    });
};
