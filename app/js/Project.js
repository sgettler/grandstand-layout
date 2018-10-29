/**
 * Project.js
 * @author @sgettler
 *
 * Project data object.
 */



/**
 * @constructor for project data object.
 */
SPS.Project = function() {

    this.name = "New Project";

    this.grid = {};
};



/**
 * Save data to JSON file.
 *
 * @param filename name of file to download
 */
SPS.Project.prototype.downloadJSON = function(filename) {
    var blob = new Blob([JSON.stringify(this)], { type: "text/plain" } );

    var anchorElement = document.createElement("a");
    anchorElement.setAttribute("href",URL.createObjectURL(blob));
    anchorElement.setAttribute("download", filename);
    anchorElement.dispatchEvent(new Event("click"));
}



// ================
// placeholder

SPS.Project.generateSample = function() {

    var data = new SPS.Project();
    data.name = "Sample Project";

    // grid lines
    for(var i = 0; i < 8; i++) {
        var gridLine = {
            "name": ""+((57+i-1)%60+1),
            "points": [
                { x: (-3.5+i)*30*12, y: 5.5*30*12+7.5*12 },
                { x: (-3.5+i)*30*12, y: 5.5*30*12+7.5*12+150*12 }
            ]
        };
        data.grid["n"+i] = gridLine;
    }
    for(var i = 0; i < 5; i++) {
        var gridLine = {
            "name": ""+(5+i),
            "points": [
                { x: 3.5*30*12+7.5*12, y: 5.5*30*12+7.5*12 },
                { x: 3.5*30*12+7.5*12+150*12*Math.sin((0.5+i)*18*Math.PI/180), y: 5.5*30*12+7.5*12+150*12*Math.cos((0.5+i)*18*Math.PI/180) }
            ]
        };
        data.grid["ne"+i] = gridLine;
    }
    for(var i = 0; i < 12; i++) {
        var gridLine = {
            "name": ""+(10+i),
            "points": [
                { x: 3.5*30*12+7.5*12, y: (5.5-i)*30*12 },
                { x: 3.5*30*12+7.5*12+150*12, y: (5.5-i)*30*12 }
            ]
        };
        data.grid["e"+i] = gridLine;
    }
    for(var i = 0; i < 5; i++) {
        var gridLine = {
            "name": ""+(22+i),
            "points": [
                { x: 3.5*30*12+7.5*12, y: -5.5*30*12-7.5*12 },
                { x: 3.5*30*12+7.5*12+150*12*Math.sin((4.5-i)*18*Math.PI/180), y: -5.5*30*12-7.5*12-150*12*Math.cos((4.5-i)*18*Math.PI/180) }
            ]
        };
        data.grid["se"+i] = gridLine;
    }
    for(var i = 0; i < 8; i++) {
        var gridLine = {
            "name": ""+(27+i),
            "points": [
                { x: (3.5-i)*30*12, y: -5.5*30*12-7.5*12 },
                { x: (3.5-i)*30*12, y: -5.5*30*12-7.5*12-150*12 }
            ]
        };
        data.grid["s"+i] = gridLine;
    }
    for(var i = 0; i < 5; i++) {
        var gridLine = {
            "name": ""+(35+i),
            "points": [
                { x: -3.5*30*12-7.5*12, y: -5.5*30*12-7.5*12 },
                { x: -3.5*30*12-7.5*12-150*12*Math.sin((0.5+i)*18*Math.PI/180), y: -5.5*30*12-7.5*12-150*12*Math.cos((0.5+i)*18*Math.PI/180) }
            ]
        };
        data.grid["sw"+i] = gridLine;
    }
    for(var i = 0; i < 12; i++) {
        var gridLine = {
            "name": ""+(40+i),
            "points": [
                { x: -3.5*30*12-7.5*12, y: (-5.5+i)*30*12 },
                { x: -3.5*30*12-7.5*12-150*12, y: (-5.5+i)*30*12 }
            ]
        };
        data.grid["w"+i] = gridLine;
    }
    for(var i = 0; i < 5; i++) {
        var gridLine = {
            "name": ""+(52+i),
            "points": [
                { x: -3.5*30*12-7.5*12, y: 5.5*30*12+7.5*12 },
                { x: -3.5*30*12-7.5*12-150*12*Math.sin((4.5-i)*18*Math.PI/180), y: 5.5*30*12+7.5*12+150*12*Math.cos((4.5-i)*18*Math.PI/180) }
            ]
        };
        data.grid["nw"+i] = gridLine;
    }

    // export
    data.downloadJSON("sample.json");

};

// ================
