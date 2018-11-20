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

    // data
    this.project = new SPS.Project({"name": "New Project"});

    // create page
    SPS.TerraceCAD.createLayout();

    var header = new SPS.Header("SPS Grandstand Layout Tool", "assets/img/sps_white_48.png");
    header.addMenu();
    header.addMenuItem("New", null);
    header.addMenuItem("Open", null);
    header.addMenuItem("Save", this.saveProject.bind(this));
    header.addMenu();
    header.addMenuItem("Export", null);

    var viewer = new SPS.CartesianViewer(SPS.Plane.XY_PLANE);
    window.addEventListener("resize", function(e) { viewer.resize(window.innerWidth-384, window.innerHeight-64); }.bind(this));



    // ================
    // placeholder

    for(var s of this.project["shapes"])
        if(s["type"] == SPS.Shape.Type.PLANE || s["type"] == SPS.Shape.Type.PLANESEG)
            viewer.addSelectableLine(s, null);

    // var openProjectRemote = function(url) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.addEventListener("load", function() {
    //         project = SPS.Project.parseJSON(xhr.responseText);
    //         for(var s of project["shapes"]) {
    //             if(s["type"] == SPS.Shape.Type.PLANE || s["type"] == SPS.Shape.Type.PLANESEG)
    //                 viewer.addSelectableLine(s, null);
    //         }
    //         viewer.zoomBounds({min: {x:-3.5*30*12-7.5*12-150*12, y:-5.5*30*12-7.5*12-150*12}, max: {x:3.5*30*12+7.5*12+150*12, y:5.5*30*12+7.5*12+150*12}});
    //     });
    //     xhr.open("GET", url, true);
    //     xhr.send();
    // }("sample.json");

    // ================



    // refresh layout
    viewer.resize(window.innerWidth-384, window.innerHeight-64);
    viewer.zoomCenter();
};



/**
 * Download project. Shows a dialog to confirm filename.
 *
 * @todo probably want to validate that filename
 */
SPS.TerraceCAD.prototype.saveProject = function() {
    var dialog = SPS.Dialog.showInputDialog({
        title: "Download as JSON",
        text: ["Filename"],
        defs: ["project.json"],
        accept: "SAVE",
        reject: "CANCEL"
    });
    dialog.containerElement.addEventListener("accept", function(event) {
        this.project.downloadJSON(event.detail.value[0]);
    }.bind(this));
};



/**
 * Create DOM elements to lay out app interface.
 */
SPS.TerraceCAD.createLayout = function() {
    // window
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

    // dialogs
    var dialogParentElement = document.createElement("div");
    dialogParentElement.id = "dialog-container";
    dialogParentElement.style.visibility = "hidden";
    document.body.appendChild(dialogParentElement);

    var fillElement = document.createElement("div");
    fillElement.classList.add("dialog-scrim");
    dialogParentElement.appendChild(fillElement);

    var dialogElement = document.createElement("div");
    dialogElement.id = "dialog";
    dialogParentElement.appendChild(dialogElement);

    dialogParentElement.appendChild(fillElement.cloneNode(false));
};
