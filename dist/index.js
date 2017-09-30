"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Builds forms for surveys.
 * @author Arthur McLean <arthur@mclean.ws>
 * @license ISC
 */
var helloSurvey = function () {
    /**
     * Kick off the application
     * @param  {obj} data [optional] Data to initialize the survey with.
     * If data is not provided here, the init function may be called at any time
     * with the required initialization data.
     */
    function helloSurvey(data) {
        _classCallCheck(this, helloSurvey);

        if (data) {
            // Initialize the survey
            this.init(data);
        }
    }

    _createClass(helloSurvey, [{
        key: "init",
        value: function init(data) {
            console.log("i data", data);

            this.target;
            if (data.target) {
                this.target = document.getElementById(data.target);
            }

            // Do we have a submit function?
            this.submitFn = false;
            if (data.submitFn && typeof data.submitFn === 'function') {
                this.submitFn = data.submitFn;
            }
            console.log("this.submitFn", this.submitFn);

            if (this.target) {
                // Build the form
                this.addElementTo(this.target, 'form', {
                    method: 'post',
                    'accept-charset': 'utf-8'
                }, {
                    eventType: 'submit',
                    eventAction: this.submit
                }, data.children);
            } else {
                // Report an error
                console.error('Required target parameter is missing.');
            }
        }
    }, {
        key: "addElementTo",
        value: function addElementTo(parent, element, params, evt, children) {
            // console.log("addElementTo", parent, element, params, evt, children);
            var elem = void 0;
            if (element === 'textNode') {
                // We are creating a textNode, and there's only one option, params.text... the text for the textNode
                elem = document.createTextNode(params.text);
            } else {
                // We are creating a regular HTML element
                elem = document.createElement(element);

                if (params) {
                    for (var key in params) {
                        if (key === 'text') {
                            // We need to make a text node as a child of the current element
                            var text = document.createTextNode(params[key]);
                            elem.appendChild(text);
                        } else if (params.hasOwnProperty(key)) {
                            elem.setAttribute(key, params[key]);
                        }
                    }
                }

                if (evt) {
                    elem.addEventListener(evt.eventType, function (event) {
                        evt.eventAction(event);
                    });
                }

                if (children) {
                    for (var c in children) {
                        this.addElementTo(elem, children[c].element, children[c].params, children[c].event, children[c].children);
                    }
                }
            }

            parent.appendChild(elem);
        }

        /**
         * Called when the form is submitted. First, we parse the form and turn it into a JSON
         * data block. Special thanks to zzzzBov on Stack Overflow for a shove in the right direction:
         * https://stackoverflow.com/questions/30964568/how-to-get-a-key-value-data-set-from-a-html-form
         * Then, we follow the user's directions in terms of what to do with it.
         * 
         * @param  {obj} event  The submit event object
         */

    }, {
        key: "submit",
        value: function submit(event) {
            event.preventDefault();
            // console.log('submit called!', event);
            // console.log('form', event.target);
            // console.log('elements', event.target.elements);

            if (event && event.target && event.target.elements) {
                var data = Array.prototype.slice.call(event.target.elements).filter(function (element) {
                    // Remove disabled elements
                    return !element.disabled;
                }).filter(function (element) {
                    // Remove buttons
                    return element.type !== 'submit' && element.type !== 'reset' && element.tagName.toLowerCase() !== 'button';
                }).filter(function (element) {

                    var tagName = element.tagName.toLowerCase();
                    var tagType = element.type.toLowerCase();
                    // console.log("check this one", element.type);
                    if (tagName === 'input' && (tagType === 'checkbox' || tagType === 'radio')) {
                        // Is it checked?
                        return element.checked;
                    } else {
                        // Pass it on
                        return true;
                    }
                }).map(function (element) {

                    var key = void 0,
                        value = void 0;
                    switch (element.tagName.toLowerCase()) {
                        case 'checkbox':
                        case 'radio':
                            key = element.name;
                            value = element.value === null ? 'on' : element.value;
                            return _defineProperty({}, key, value);
                        case 'select':
                            key = element.name;
                            value = element.value;
                            if (element.multiple) {
                                value = slice.call(element.selectedOptions).map(function (option) {
                                    return option.value;
                                });
                                return _defineProperty({}, key, value);
                            } else {
                                return _defineProperty({}, key, value);
                            }
                        default:
                            key = element.name;
                            value = element.value || '';
                            return _defineProperty({}, key, value);
                    }
                });
                // console.log("newElems", newElems);
                console.log("submit data:", data);

                if (this.submitFn) {
                    // Call a submit function
                    this.submitFn(data);
                }
            }
        }
    }]);

    return helloSurvey;
}();
//# sourceMappingURL=index.js.map
