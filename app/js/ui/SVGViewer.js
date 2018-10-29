/**
 * SVGViewer.js
 * @author @sgettler
 *
 * SVG zoom/pan controls.
 */



/**
 * @constructor for a SVG viewer interface.
 */
SPS.SVGViewer = function() {
    var parentElement = document.getElementById("viewer");

    // view
    this.scale = 1;
    this.transX = 0;
    this.transY = 0;

    // panning state
    this.mdown = false;
    this.mdownX = 0;
    this.mdownY = 0;
    this.mpan = false;


    // svg element
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    parentElement.appendChild(this.svgElement);


    // base geometry SVG group
    this.svgBase = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svgElement.appendChild(this.svgBase);


    // event listeners
    this.svgElement.addEventListener("wheel", this.zoom.bind(this));
    this.svgElement.addEventListener("mousedown", this.panStart.bind(this), true);
    this.svgElement.addEventListener("mousemove", this.pan.bind(this), true);
    this.svgElement.addEventListener("mouseup", this.panStop.bind(this), true);

    this.svgElement.addEventListener("contextmenu", function(e) { e.preventDefault(); }, true);
};



/**
 * Resize DOM element.
 *
 * @param width element width
 * @param height element height
 */
SPS.SVGViewer.prototype.resize = function(width, height) {
    this.svgElement.setAttribute("width", width);
    this.svgElement.setAttribute("height", height);
};



/**
 * Transform base element to update view.
 *
 * @param transX x translation
 * @param transY y translation
 * @param scale scale
 */
SPS.SVGViewer.prototype.transform = function(transX, transY, scale) {
    this.svgBase.setAttribute("transform", "translate("+transX+","+transY+") scale("+scale+")");
};



/**
 * Zoom based on mouse scroll event.
 *
 * @param e wheel event
 */
SPS.SVGViewer.prototype.zoom = function(e) {
    var scrollposX = (-this.transX + e.offsetX)/this.scale;
    var scrollposY = ( this.transY - e.offsetY)/this.scale;

    this.scale *= 1 - e.deltaY/1000;
    this.transX = -scrollposX*this.scale + e.offsetX;
    this.transY =  scrollposY*this.scale + e.offsetY;
    this.transform(this.transX, this.transY, this.scale);
};


/**
 * Prepare to pan based on mouse down event.
 *
 * @param e mouse event
 */
SPS.SVGViewer.prototype.panStart = function(e) {
    if(e.button == 0) {
        this.mdown = true;
        this.mdownX = e.offsetX;
        this.mdownY = e.offsetY;
    }
};


/**
 * Pan based on mouse move event.
 *
 * @param e mouse event
 */
SPS.SVGViewer.prototype.pan = function(e) {
    if(this.mdown) {
        var panX = this.transX + e.offsetX - this.mdownX;
        var panY = this.transY + e.offsetY - this.mdownY;
        this.transform(panX, panY, this.scale);
        this.mpan = true;
    }
};


/**
 * Finish panning based on mouse up event. If view has been panned, prevent
 * mouseup from firing event on any elements that might be under the cursor
 * location.
 *
 * @param e mouse event
 */
SPS.SVGViewer.prototype.panStop = function(e) {
    if(this.mpan) {
        e.stopPropagation();
        this.transX += e.offsetX - this.mdownX;
        this.transY += e.offsetY - this.mdownY;
        this.mpan = false;
    }
    this.mdown = false;
};
