/**
 * Dialog.js
 * @author @sgettler
 *
 * Modal dialogs.
 */



/**
 * @constructor for dialog. Creates common elements.
 *
 * @param args object containing dialog options
 */
SPS.Dialog = function(args) {

    // DOM elements
    var parentElement = document.getElementById("dialog");
    while(parentElement.firstChild)
        parentElement.firstChild.remove();

    this.containerElement = document.createElement("div");
    this.containerElement.classList.add("dialog-container");
    parentElement.appendChild(this.containerElement);

    var titleElement = document.createElement("div");
    titleElement.classList.add("dialog-title");
    titleElement.appendChild(document.createTextNode(args.title));
    this.containerElement.appendChild(titleElement);

    this.contentElement = document.createElement("div");
    this.contentElement.classList.add("dialog-content");
    this.containerElement.appendChild(this.contentElement);

    this.buttonBarElement = document.createElement("div");
    this.buttonBarElement.classList.add("dialog-buttonbar");
    this.containerElement.appendChild(this.buttonBarElement);

    this.acceptButtonElement = this.createButtonElement(args.accept);
};

/**
 * Make dialog visible.
 */
SPS.Dialog.prototype.show = function() {
    document.getElementById("dialog-container").style.visibility = "visible";
};

/**
 * Make dialog invisible.
 */
SPS.Dialog.prototype.hide = function() {
    document.getElementById("dialog-container").style.visibility = "hidden";
};



/**
 * Create standard DOM element for a button.
 *
 * @param label button text
 */
SPS.Dialog.prototype.createButtonElement = function(label) {
    var buttonElement = document.createElement("a");
    buttonElement.classList.add("dialog-button");
    buttonElement.appendChild(document.createTextNode(label));
    this.buttonBarElement.appendChild(buttonElement);

    return buttonElement;
};



/**
 * Create standard DOM element for an input box and label.
 *
 * @param label label text
 * @param def default value
 */
SPS.Dialog.prototype.createInputElement = function(label, def) {
    var inputContainerElement = document.createElement("div");
    inputContainerElement.classList.add("dialog-inputcontainer")
    this.contentElement.appendChild(inputContainerElement);

    var inputLabelElement = document.createElement("span");
    inputLabelElement.classList.add("dialog-inputlabel");
    inputLabelElement.appendChild(document.createTextNode(label));
    inputContainerElement.appendChild(inputLabelElement);

    var inputElement = document.createElement("input");
    inputElement.classList.add("dialog-input");
    inputElement.value = def != null ? def : "";
    inputContainerElement.appendChild(inputElement);

    inputElement.addEventListener("focus", function() {
        inputContainerElement.classList.add("dialog-inputcontainer-active");
    });
    inputElement.addEventListener("blur", function() {
        inputContainerElement.classList.remove("dialog-inputcontainer-active");
    });

    return inputElement;
};



/**
 * Create an alert dialog with a message and accept button.
 *
 * @param args arguments object
 */
SPS.Dialog.showAlertDialog = function(args) {
    var dialog = new SPS.Dialog(args);

    // text
    dialog.contentElement.appendChild(document.createTextNode(args.text[0]));

    // events
    dialog.acceptButtonElement.addEventListener("click", function() {
        dialog.containerElement.dispatchEvent(new CustomEvent("accept", { detail: {} }));
        dialog.hide();
    });

    // show
    dialog.show();
    return dialog;
};

/**
 * Create a confirmation dialog with a message and accept and reject buttons.
 *
 * @param args arguments object
 */
SPS.Dialog.showConfirmDialog = function(args) {
    var dialog = new SPS.Dialog(args);

    // text
    dialog.contentElement.appendChild(document.createTextNode(args.text[0]));

    // reject button
    var rejectButtonElement = dialog.createButtonElement(args.reject);

    // events
    dialog.acceptButtonElement.addEventListener("click", function() {
        dialog.containerElement.dispatchEvent(new CustomEvent("accept", { detail: {} }));
        dialog.hide();
    });
    rejectButtonElement.addEventListener("click", function() {
        dialog.containerElement.dispatchEvent(new CustomEvent("reject", { detail: {} }));
        dialog.hide();
    });

    // show
    dialog.show();
    return dialog;
};

/**
 * Create an input dialog with text boxes and accept and reject buttons.
 *
 * @param args arguments object
 */
SPS.Dialog.showInputDialog = function(args) {
    var dialog = new SPS.Dialog(args);

    // input boxes
    var inputElement = [];
    for(var i = 0; i < args.text.length; i++)
        inputElement.push(dialog.createInputElement(args.text[i], args.defs[i]));

    // reject button
    var rejectButtonElement = dialog.createButtonElement(args.reject);

    // events
    dialog.acceptButtonElement.addEventListener("click", function() {
        var inputValue = [];
        for(var i of inputElement)
            inputValue.push(i.value);
        dialog.containerElement.dispatchEvent(new CustomEvent("accept", { detail: { value: inputValue } }));
        dialog.hide();
    });
    rejectButtonElement.addEventListener("click", function() {
        dialog.containerElement.dispatchEvent(new CustomEvent("reject", { detail: {} }));
        dialog.hide();
    });

    // show
    dialog.show();
    return dialog;
};
