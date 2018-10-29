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
    TITLE: "terrace-cad",
    VERSION: "0.0"
};



/**
 * @constructor for app.
 */
SPS.TerraceCAD = function() {

    // create page
    SPS.TerraceCAD.createLayout();

    var header = new SPS.Header("SPS Grandstand Designer", "assets/img/sps_white_48.png");
    header.addMenu();
    header.addMenuItem("New", null );
    header.addMenuItem("Open", null);
    header.addMenuItem("Save", null);
    header.addMenu();
    header.addMenuItem("Export", null );

    var viewer = new SPS.CartesianViewer();
    window.addEventListener("resize", function(e) { viewer.resize(window.innerWidth-384, window.innerHeight-48); }.bind(this));



    // ================
    // placeholder

    var data = new SPS.Project();

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        data = JSON.parse(xhr.responseText);

        for(var g in data["grid"]) {
            addline(data["grid"][g]);
        }
    });
    xhr.open("GET", "assets/sample.json", true);
    xhr.send();

    var addline = function(line) {
        var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        viewer.svgBase.appendChild(defs);

        var base = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        var points = "";
        for(var i = 0; i < line["points"].length; i++) {
            points += line["points"][i].x+","+(-line["points"][i].y)+" ";
        }
        base.setAttribute("points", points);
        base.setAttribute("id", line["name"]+"def");
        defs.appendChild(base);

        var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", line["name"]);
        defs.appendChild(group);

        var sel = document.createElementNS("http://www.w3.org/2000/svg", "use");
        sel.setAttribute("href", "#"+line["name"]+"def");
        sel.setAttribute("class", "selectable-line");
        group.appendChild(sel);
        group.appendChild(sel.cloneNode(false));

        var ref = document.createElementNS("http://www.w3.org/2000/svg", "use");
        ref.setAttribute("href", "#"+line["name"]);
        ref.setAttribute("class", "grid");
        viewer.svgBase.appendChild(ref);

        viewer.zoomBounds([{x:-3.5*30*12-7.5*12-150*12, y:-5.5*30*12-7.5*12-150*12}, {x:3.5*30*12+7.5*12+150*12, y:5.5*30*12+7.5*12+150*12}]);
    }

    // ================



    // refresh layout
    // window.addEventListener("load", function(e) {
        window.dispatchEvent(new Event("resize"));
    // });


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
}
