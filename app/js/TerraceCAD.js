/**
 * TerraceCAD.js
 * @author @sgettler
 *
 * Namespace and main app class.
 */



/**
 * Set up namespace.
 */
var SPS = SPS || {
    TITLE: "grandstand-layout",
    VERSION: "0.0"
};



/**
 * @constructor for app.
 */
SPS.TerraceCAD = function() {

    // create page
    SPS.TerraceCAD.createLayout();

    var header = new SPS.Header("SPS Grandstand Layout Tool", "assets/img/sps_white_48.png");
    header.addMenu();
    header.addMenuItem("New", null );
    header.addMenuItem("Open", null);
    header.addMenuItem("Save", null);
    header.addMenu();
    header.addMenuItem("Export", null );

    var viewer = new SPS.CartesianViewer(SPS.Plane.XY_PLANE);
    window.addEventListener("resize", function(e) { viewer.resize(window.innerWidth-384, window.innerHeight-48); }.bind(this));



    // ================
    // placeholder

    var openProjectRemote = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
            var project = SPS.Project.parseJSON(xhr.responseText);
            for(var s of project["shapes"]) {
                if(s["type"] == SPS.Shape.Type.PLANESEG) {
                    viewer.addPlaneSegment(s, null);
                }
            }
            viewer.zoomBounds({min: {x:-3.5*30*12-7.5*12-150*12, y:-5.5*30*12-7.5*12-150*12}, max: {x:3.5*30*12+7.5*12+150*12, y:5.5*30*12+7.5*12+150*12}});
        });
        xhr.open("GET", url, true);
        xhr.send();
    }
    openProjectRemote("assets/sample.json");

    // ================



    // refresh layout
    window.dispatchEvent(new Event("resize"));
};



/**
 * Create DOM elements to lay out app interface.
 */
SPS.TerraceCAD.createLayout = function() {
    var parentElement = document.createElement("div");
    parentElement.id = "container";
    document.body.appendChild(parentElement);

    var headerElement = document.createElement("div");
    headerElement.id = "header";
    parentElement.appendChild(headerElement);

    var contentElement = document.createElement("div");
    contentElement.id = "content";
    parentElement.appendChild(contentElement);

    var toolbarElement = document.createElement("div");
    toolbarElement.id = "toolbar";
    contentElement.appendChild(toolbarElement);

    var viewerElement = document.createElement("div");
    viewerElement.id = "viewer";
    contentElement.appendChild(viewerElement);
};
