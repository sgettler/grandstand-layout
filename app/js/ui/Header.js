/**
 * Header.js
 * @author @sgettler
 *
 * Page header with menu.
 */



/**
 * @constructor for page header.
 *
 * @param title page title
 * @param logourl location of logo image or null
 */
SPS.Header = function(title, logourl) {
    var parentElement = document.getElementById("header");

    if(logourl != null) {
        var logoElement = document.createElement("div");
        logoElement.id = "header-logo";
        parentElement.appendChild(logoElement);

        var imgElement = document.createElement("img");
        imgElement.src = logourl;
        logoElement.appendChild(imgElement);
    }

    var titleElement = document.createElement("div");
    titleElement.id = "header-title";
    titleElement.appendChild(document.createTextNode(title))
    parentElement.appendChild(titleElement);
};



/**
 * Add a menu to the header.
 */
SPS.Header.prototype.addMenu = function() {
    var parentElement = document.getElementById("header");

    this.menuElement = document.createElement("ul");
    this.menuElement.classList.add("header-menu");
    parentElement.appendChild(this.menuElement);
};



/**
 * Add a menu item to the header. Added to last menu created.
 *
 * @param text menu item text
 * @param callback function callback to be called on menu item click
 */
SPS.Header.prototype.addMenuItem = function(text, callback) {
    var itemElement = document.createElement("li");
    itemElement.classList.add("header-menu-item");
    this.menuElement.appendChild(itemElement);

    var anchorElement = document.createElement("a");
    anchorElement.classList.add("header-menu-link");
    anchorElement.href = "#";
    anchorElement.appendChild(document.createTextNode(text));
    itemElement.appendChild(anchorElement);

    anchorElement.addEventListener("click", callback);
};
