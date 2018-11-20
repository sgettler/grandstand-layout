/**
 * CartesianViewer.js
 * @author @sgettler
 *
 * Extension of SVGViewer specifically for 2D Cartersian space.
 */



/**
 * @constructor for Cartersian space SVG viewer.
 *
 * @extends {SPS.SVGViewer}
 */
SPS.CartesianViewer = function(viewPlane) {
    SPS.SVGViewer.call(this);

    // DOM element size
    this.width = 1;
    this.height = 1;

    // svg definitions
    this.svgDefs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.svgElement.appendChild(this.svgDefs);

    // shapes
    this.planes = [];

    // view
    this.viewPlane = viewPlane;
    this.viewBounds = [];
    this.zoomCenter();
};

SPS.CartesianViewer.prototype = Object.create(SPS.SVGViewer.prototype);
SPS.CartesianViewer.prototype.constructor = SPS.CartesianViewer;



/**
 * Resize DOM element.
 *
 * @param width element width
 * @param height element height
 *
 * @override
 */
SPS.CartesianViewer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.svgElement.setAttribute("width", width);
    this.svgElement.setAttribute("height", height);
    this.transform(this.transX, this.transY, this.scale);
};



/**
 * Transform base element to update view.
 *
 * @param transX x translation
 * @param transY y translation
 * @param scale scale
 *
 * @override
 */
SPS.CartesianViewer.prototype.transform = function(transX, transY, scale) {
    this.svgBase.setAttribute("transform", "translate("+transX+","+transY+") scale("+scale+")");

    this.viewBounds = [
        new SPS.Plane({"coefs": [ 0, -1, 0, transY/scale]}),
        new SPS.Plane({"coefs": [ 1,  0, 0, transX/scale]}),
        new SPS.Plane({"coefs": [-1,  0, 0, -transX/scale + this.width/scale]}),
        new SPS.Plane({"coefs": [ 0,  1, 0, -transY/scale + this.height/scale]})
    ];
    this.updateShapes();
};



/**
 * Zoom to bounds.
 *
 * @param bounds bounding rectangle
 */
SPS.CartesianViewer.prototype.zoomBounds = function(bounds) {
    this.scale = Math.min(this.width/(bounds.max.x-bounds.min.x), this.height/(bounds.max.y-bounds.min.y));
    this.transX = this.width/2  - (bounds.min.x+bounds.max.x)/2*this.scale;
    this.transY = this.height/2 + (bounds.min.y+bounds.max.y)/2*this.scale;
    this.transform(this.transX, this.transY, this.scale);
};



/**
 * Zoom to origin.
 */
SPS.CartesianViewer.prototype.zoomCenter = function() {
    this.scale = 1;
    this.transX = this.width/2;
    this.transY = this.height/2;
    this.transform(this.transX, this.transY, this.scale);
};



/**
 * Find points where the plane intersects with the viewable bounds.
 *
 * @param plane plane object
 *
 * @return array of 3-member coordinate arrays
 */
SPS.CartesianViewer.prototype.getPlaneExtents = function(plane) {
    var r = [];
    var isInBounds = function(p) {
        for(var v of this.viewBounds) {
            var c = v.getCoefs();
            if(c[0]*p[0] + c[1]*p[1] + c[2]*p[2] + c[3] < 0)
                return false;
        }
        return true;
    }.bind(this);
    for(var v of this.viewBounds) {
        var p = new SPS.Point({"plane1": this.viewPlane, "plane2": plane, "plane3": v}).getCoords();
        if(!isNaN(p[0]) && !isNaN(p[1]))
            if(isInBounds(p))
                r.push(p);
    }
    return r;
};



/**
 * Add a selectable line to the viewer.
 *
 * @param shape shape to add
 * @param callback function callback to be called on click
 */
SPS.CartesianViewer.prototype.addSelectableLine = function(shape, callback) {
    var points = [];
    if(shape["type"] == SPS.Shape.Type.PLANE) {
        points = this.getPlaneExtents(shape);
        this.planes.push(shape);
    } else if(shape["type"] == SPS.Shape.Type.PLANESEG) {
        points.push(new SPS.Point({"plane1": this.viewPlane, "plane2": shape["ref"], "plane3": shape["start"]}).getCoords());
        points.push(new SPS.Point({"plane1": this.viewPlane, "plane2": shape["ref"], "plane3": shape["end"]}).getCoords());
    }

    var baseElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    baseElement.setAttribute("id", shape["uuid"]);
    baseElement.setAttribute("points", function(s) {
        for(var p of points)
            s += p[0]+","+(-p[1])+" ";
        return s;
    }(""));
    this.svgDefs.appendChild(baseElement);

    var baseGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    baseGroup.setAttribute("id", shape["uuid"]+"-group");
    this.svgDefs.appendChild(baseGroup);

    var selElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    selElement.setAttribute("href", "#"+shape["uuid"]);
    selElement.setAttribute("class", "selectable-line");
    baseGroup.appendChild(selElement);
    baseGroup.appendChild(selElement.cloneNode(false));

    var refElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    refElement.setAttribute("href", "#"+shape["uuid"]+"-group");
    refElement.setAttribute("class", shape["layer"]);
    refElement.addEventListener("click", callback);
    this.svgBase.appendChild(refElement);
};

/**
 * Remove all shapes.
 */
SPS.CartesianViewer.prototype.removeAll = function() {
    while(this.svgBase.firstChild)
        this.svgBase.firstChild.remove();
    while(this.svgDefs.firstChild)
        this.svgDefs.firstChild.remove();
    this.planes = [];
};


/**
 * Update shapes which intersect with the viewable bounds.
 */
SPS.CartesianViewer.prototype.updateShapes = function() {
    for(var s of this.planes) {
        var points = this.getPlaneExtents(s);
        document.getElementById(s["uuid"]).setAttribute("points", function(s) {
            for(var p of points)
                s += p[0]+","+(-p[1])+" ";
            return s;
        }(""));
    }
};
