/**
 * Point.js
 * @author @sgettler
 *
 * Representation of a point in 3D space.
 */



/**
 * @constructor for point definition.
 *
 * @param args arguments object
 *
 * @extends {SPS.Shape}
 */
SPS.Point = function(args) {
    SPS.Shape.call(this, args);
    this["type"] = SPS.Shape.Type.POINT;

    if(args["coords"]) {
        this["coords"] = args["coords"];
    }
    if(args["plane1"]) {
        this["plane1"] = args["plane1"];
        this["plane2"] = args["plane2"];
        this["plane3"] = args["plane3"];
    }
};

SPS.Point.prototype = Object.create(SPS.Shape.prototype);
SPS.Point.prototype.constructor = SPS.Point;



/*
 * Constants.
 */
SPS.Point.prototype.shapeRefs = ["plane1", "plane2", "plane3"];



/**
 * Return the coordinates of the point.
 *
 * @return 3-member array of coordinates
 */
SPS.Point.prototype.getCoords = function() {
    if(this["plane1"]) {
        var a = [];
        for(var k = 0; k < 3; k++) {
            a.push(this["plane"+(k+1)].getCoefs());
            a[k][3] = -a[k][3];
        }
        for(var k = 0; k < 3; k++) {
            a[k] = a.splice(function(s) {
                for(var i = k; i < 3; i++)
                    s.push(a[i][k]**2);
                return k + s.indexOf(Math.max.apply(null, s));
            }([]), 1, a[k])[0];
            for(var i = 0; i < 3; i++) {
                var d = a[i][k];
                for(var j = 0; j < 4; j++)
                    a[i][j] = i != k && d != 0 ? a[i][j]/d - a[k][j]/a[k][k] : a[i][j];
            }
        }
        return [a[0][3]/a[0][0], a[1][3]/a[1][1], a[2][3]/a[2][2]];
    }
    return Object.assign([],this["coords"]);
};
