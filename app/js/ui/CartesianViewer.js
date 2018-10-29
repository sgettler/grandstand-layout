/**
 * CartesianViewer.js
 * @author @sgettler
 *
 * Extension of SVGViewer specifically for 2D Cartersian space.
 */



/**
 * @constructor for Cartersian space SVG viewer.
 * @extends {SPS.SVGViewer}
 */
SPS.CartesianViewer = function() {
    SPS.SVGViewer.call(this);

    // DOM element
    this.width = 1;
    this.height = 1;
};

SPS.CartesianViewer.prototype = Object.create(SPS.SVGViewer.prototype);
SPS.CartesianViewer.prototype.constructor = SPS.CartesianViewer;


/**
 * Resize DOM element.
 *
 * @param width element width
 * @param height element height
 * @override
 */
SPS.CartesianViewer.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.svgElement.setAttribute("width", width);
    this.svgElement.setAttribute("height", height);
};



/**
 * Zoom to bounds.
 *
 * @param bounds bounding rectangle
 */
SPS.CartesianViewer.prototype.zoomBounds = function(bounds) {
    this.scale = Math.min(this.width/(bounds[1].x-bounds[0].x), this.height/(bounds[1].y-bounds[0].y));
    this.transX = this.width/2  - (bounds[0].x+bounds[1].x)/2*this.scale;
    this.transY = this.height/2 + (bounds[0].y+bounds[1].y)/2*this.scale;
    this.transform(this.transX, this.transY, this.scale);
};
