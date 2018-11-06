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

    // view
    this.viewPlane = viewPlane;
    this.viewBounds = {min: {x: -1, y: -1}, max: {x: 1, y: 1}};

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

    var minX = -transX/scale;
    var minY =  transY/scale - this.height/scale;
    this.viewBounds = {min: {x: minX, y: minY}, max: {x: minX+this.width/scale, y: minY+this.height/scale}};
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
 * Add a plane segment to the interface.
 *
 * @param planeSeg plane segment object
 * @param callback function callback to be called on click
 */
SPS.CartesianViewer.prototype.addPlaneSegment = function (planeSeg, callback) {
    var p1 = new SPS.Point({"plane1": this.viewPlane, "plane2": planeSeg["ref"], "plane3": planeSeg["start"]}).getCoords();
    var p2 = new SPS.Point({"plane1": this.viewPlane, "plane2": planeSeg["ref"], "plane3": planeSeg["end"]}).getCoords();

    var baseElement = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    baseElement.setAttribute("points", p1[0]+","+(-p1[1])+" "+p2[0]+","+(-p2[1]));
    baseElement.setAttribute("id", planeSeg["uuid"]);
    this.svgDefs.appendChild(baseElement);

    var baseGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    baseGroup.setAttribute("id", planeSeg["uuid"]+"-group");
    this.svgDefs.appendChild(baseGroup);

    var selElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    selElement.setAttribute("href", "#"+planeSeg["uuid"]);
    selElement.setAttribute("class", "selectable-line");
    baseGroup.appendChild(selElement);
    baseGroup.appendChild(selElement.cloneNode(false));

    var refElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    refElement.setAttribute("href", "#"+planeSeg["uuid"]+"-group");
    refElement.setAttribute("class", planeSeg["layer"]);
    refElement.addEventListener("click", callback);
    this.svgBase.appendChild(refElement);
};
