'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        key: 'init',
        value: function init(data) {
            console.log("i data", data);

            this.target;
            if (data.target) {
                this.target = document.getElementById(data.target);
            }

            if (this.target) {
                // Build the form
                this.addElementTo(this.target, 'form', {
                    method: 'post',
                    'accept-charset': 'utf-8'
                }, {
                    eventType: 'submit',
                    eventAction: this.submit
                }, data.fields);
            } else {
                // Report an error
                console.error('Required target parameter is missing.');
            }
        }
    }, {
        key: 'addElementTo',
        value: function addElementTo(parent, element, params, evt, children) {
            console.log("addElementTo", parent, element, params, evt, children);
            var elem = document.createElement(element);

            if (params) {
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
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
                    this.addElementTo(elem, children[c].element, children[c].params, children[c].event, children[c].fields);
                }
            }

            parent.appendChild(elem);
        }
    }, {
        key: 'submit',
        value: function submit(event) {
            event.preventDefault();
            console.log('submit called!');
        }
    }]);

    return helloSurvey;
}();
//# sourceMappingURL=index.js.map
