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
    header.addMenuItem("New", this.newProject.bind(this));
    header.addMenuItem("Open", this.openProject.bind(this));
    header.addMenuItem("Save", this.saveProject.bind(this));
    // header.addMenu();
    // header.addMenuItem("Export", null);

    this.viewer = new SPS.CartesianViewer(SPS.Plane.XY_PLANE);
    window.addEventListener("resize", function(e) { this.viewer.resize(window.innerWidth-384, window.innerHeight-64); }.bind(this));



    // set up project
    this.project = new SPS.Project({"name": "New Project"});
    this.projectChanged = false;
    this.resetViewer();

    // refresh layout
    this.viewer.resize(window.innerWidth-384, window.innerHeight-64);
    this.viewer.zoomCenter();
};



/**
 * Create new project.
 */
SPS.TerraceCAD.prototype.newProject = function() {
    if(this.projectChanged) {
        var dialog = SPS.Dialog.showConfirmDialog({
            title: "Discard current project?",
            text: ["Creating a new project will cause you to lose all changes to the current project."],
            accept: "DISCARD",
            reject: "CANCEL"
        });
        dialog.containerElement.addEventListener("accept", function(event) {
            this.project = new SPS.Project({"name": "New Project"});
            this.projectChanged = false;
            this.resetViewer();
        }.bind(this));
    }
};

/**
 * Open project from local file.
 */
SPS.TerraceCAD.prototype.openProject = function() {
    var fileElement = document.createElement("input");
    fileElement.type = "file";
    fileElement.addEventListener("change", function(event) {
        var reader = new FileReader();
        reader.addEventListener("load", function(event) {
            this.project = SPS.Project.parseJSON(event.target.result);
            this.projectChanged = true;
            this.resetViewer();
        }.bind(this));
        reader.readAsText(event.target.files[0]);
    }.bind(this));

    if(this.projectChanged) {
        var dialog = SPS.Dialog.showConfirmDialog({
            title: "Discard current project?",
            text: ["Opening a project will cause you to lose all changes to the current project."],
            accept: "DISCARD",
            reject: "CANCEL"
        });
        dialog.containerElement.addEventListener("accept", function(event) {
            fileElement.click();
        }.bind(this));
    } else {
        fileElement.click();
    }
};

/**
 * Open project from remote file.
 *
 * @param url project file url
 */
// SPS.TerraceCAD.prototype.openProjectRemote = function(url) {
//     var xhr = new XMLHttpRequest();
//     xhr.addEventListener("load", function() {
//         this.project = SPS.Project.parseJSON(xhr.responseText);
//         this.resetViewer();
//     }.bind(this));
//     xhr.open("GET", url, true);
//     xhr.send();
// };

/**
 * Download project. Shows a dialog to confirm filename.
 *
 * @todo probably want to validate that filename
 */
SPS.TerraceCAD.prototype.saveProject = function() {
    var dialog = SPS.Dialog.showInputDialog({
        title: "Download project as JSON",
        text: ["Project filename"],
        defs: ["project.json"],
        accept: "SAVE",
        reject: "CANCEL"
    });
    dialog.containerElement.addEventListener("accept", function(event) {
        this.project.downloadJSON(event.detail.value[0]);
        this.projectChanged = false;
    }.bind(this));
};



/**
 * Refresh project in viewer.
 */
SPS.TerraceCAD.prototype.resetViewer = function() {
    this.viewer.removeAll();

    for(var s of this.project["shapes"]) {
        if(s["type"] == SPS.Shape.Type.PLANE || s["type"] == SPS.Shape.Type.PLANESEG)
            this.viewer.addSelectableLine(s, null);
        if(s["type"] == SPS.Shape.Type.PLANESURF)
            this.viewer.addSelectablePolygon(s, null);
    }
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
