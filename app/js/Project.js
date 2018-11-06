/**
 * Project.js
 * @author @sgettler
 *
 * Project data object.
 */



/**
 * @constructor for project data object.
 *
 * @param args arguments object
 */
SPS.Project = function(args) {
    this["name"] = args["name"] || "New Project";
    this["shapes"] = args["shapes"] || [];
};



/**
 * Save data to JSON file.
 *
 * @param filename name of file to download
 */
SPS.Project.prototype.downloadJSON = function(filename) {
    var blob = new Blob([JSON.stringify(this, null, "    ")], {type: "text/plain"});

    var anchorElement = document.createElement("a");
    anchorElement.setAttribute("href", URL.createObjectURL(blob));
    anchorElement.setAttribute("download", filename);
    anchorElement.click();//dispatchEvent(new Event("click"));
}



/**
 * Read data from JSON file.
 *
 * @param json JSON string
 * @return project object
 */
SPS.Project.parseJSON = function(json) {
    var project = new SPS.Project(JSON.parse(json));

    // revive shapes
    for(var i = 0; i < project["shapes"].length; i++)
        project["shapes"][i] = function(s) {
            if(s["type"] == SPS.Shape.Type.POINT)
                return new SPS.Point(s);
            if(s["type"] == SPS.Shape.Type.PLANE)
                return new SPS.Plane(s);
            if(s["type"] == SPS.Shape.Type.PLANESEG)
                return new SPS.PlaneSegment(s);
            return new SPS.Shape(s);
        }(project["shapes"][i]);

    // rebuild shape references
    for(var s of project["shapes"])
        for(var r of s.shapeRefs)
            if(s[r])
                s[r] = function(u) {
                    for(var t of project["shapes"])
                        if(t["uuid"] == u)
                            return t;
                }(s[r]);

    return project;
};





// ================
// placeholder

SPS.Project.generateSample = function() {

    var data = new SPS.Project({"name": "Sample Project"});
    data["shapes"].push(SPS.Plane.XY_PLANE);
    data["shapes"].push(SPS.Plane.XZ_PLANE);
    data["shapes"].push(SPS.Plane.YZ_PLANE);

    // reference locations
    var northstart = SPS.Plane.XZ_PLANE.getOffsetPlane(5.5*30*12+7.5*12);
    var northend = northstart.getOffsetPlane(150*12);
    var weststart = SPS.Plane.YZ_PLANE.getOffsetPlane(-3.5*30*12-7.5*12);
    var westend = weststart.getOffsetPlane(-150*12);
    var eaststart = SPS.Plane.YZ_PLANE.getOffsetPlane(3.5*30*12+7.5*12);
    var eastend = eaststart.getOffsetPlane(150*12);
    var southstart = SPS.Plane.XZ_PLANE.getOffsetPlane(-5.5*30*12-7.5*12);
    var southend = southstart.getOffsetPlane(-150*12);
    data["shapes"].push(northstart);
    data["shapes"].push(northend);
    data["shapes"].push(weststart);
    data["shapes"].push(westend);
    data["shapes"].push(eaststart);
    data["shapes"].push(eastend);
    data["shapes"].push(southstart);
    data["shapes"].push(southend);

    var northwest = new SPS.Point({"plane1": SPS.Plane.XY_PLANE, "plane2": northstart, "plane3": weststart});
    var northeast = new SPS.Point({"plane1": SPS.Plane.XY_PLANE, "plane2": northstart, "plane3": eaststart});
    var southwest = new SPS.Point({"plane1": SPS.Plane.XY_PLANE, "plane2": southstart, "plane3": weststart});
    var southeast = new SPS.Point({"plane1": SPS.Plane.XY_PLANE, "plane2": southstart, "plane3": eaststart});
    data["shapes"].push(northwest);
    data["shapes"].push(northeast);
    data["shapes"].push(southwest);
    data["shapes"].push(southeast);

    var zaxis = SPS.Plane.XY_PLANE.getNormal();
    data["shapes"].push(zaxis);

    // grid lines
    for(var i = 0; i < 8; i++) {
        var gridbase = weststart.getOffsetPlane(7.5*12+i*30*12);
        data["shapes"].push(gridbase);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": northstart,
            "end": northend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 5; i++) {
        var gridbase = eaststart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northeast, zaxis);
        data["shapes"].push(gridbase);
        var gridstart = northstart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northeast, zaxis);
        data["shapes"].push(gridstart);
        var gridend = northend.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northeast, zaxis);
        data["shapes"].push(gridend);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": gridstart,
            "end": gridend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 12; i++) {
        var gridbase = northstart.getOffsetPlane(-7.5*12-i*30*12);
        data["shapes"].push(gridbase);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": eaststart,
            "end": eastend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 5; i++) {
        var gridbase = southstart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southeast, zaxis);
        data["shapes"].push(gridbase);
        var gridstart = eaststart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southeast, zaxis);
        data["shapes"].push(gridstart);
        var gridend = eastend.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southeast, zaxis);
        data["shapes"].push(gridend);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": gridstart,
            "end": gridend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 8; i++) {
        var gridbase = eaststart.getOffsetPlane(-7.5*12-i*30*12);
        data["shapes"].push(gridbase);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": southstart,
            "end": southend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 5; i++) {
        var gridbase = weststart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southwest, zaxis);
        data["shapes"].push(gridbase);
        var gridstart = southstart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southwest, zaxis);
        data["shapes"].push(gridstart);
        var gridend = southend.getRotatedPlane(-(0.5+i)*18*Math.PI/180, southwest, zaxis);
        data["shapes"].push(gridend);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": gridstart,
            "end": gridend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 12; i++) {
        var gridbase = southstart.getOffsetPlane(7.5*12+i*30*12);
        data["shapes"].push(gridbase);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": weststart,
            "end": westend
        });
        data["shapes"].push(grid);
    }

    for(var i = 0; i < 5; i++) {
        var gridbase = northstart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northwest, zaxis);
        data["shapes"].push(gridbase);
        var gridstart = weststart.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northwest, zaxis);
        data["shapes"].push(gridstart);
        var gridend = westend.getRotatedPlane(-(0.5+i)*18*Math.PI/180, northwest, zaxis);
        data["shapes"].push(gridend);
        var grid = new SPS.PlaneSegment({
            "layer": "grid",
            "ref": gridbase,
            "start": gridstart,
            "end": gridend
        });
        data["shapes"].push(grid);
    }

    // export
    data.downloadJSON("sample.json");

};

// ================
