'use strict';

var React = require('react');
var core = require('@react-pdf-viewer/core');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var useDrop = function (ref, onDrop) {
    var dragCount = React__namespace.useRef(0);
    var _a = React__namespace.useState(false), isDragging = _a[0], setDragging = _a[1];
    var onDropHandler = function (e) {
        e.preventDefault();
        setDragging(false);
        dragCount.current = 0;
        if (e.dataTransfer) {
            onDrop(e.dataTransfer.files);
        }
    };
    var onDragOverHandler = function (e) {
        e.preventDefault();
    };
    var onDragEnterHandler = function (e) {
        e.preventDefault();
        dragCount.current += 1;
        if (dragCount.current <= 1) {
            setDragging(true);
        }
    };
    var onDragLeaveHandler = function (e) {
        e.preventDefault();
        dragCount.current -= 1;
        if (dragCount.current <= 0) {
            setDragging(false);
        }
    };
    React__namespace.useEffect(function () {
        var ele = ref.current;
        if (!ele) {
            return;
        }
        ele.addEventListener('drop', onDropHandler);
        ele.addEventListener('dragover', onDragOverHandler);
        ele.addEventListener('dragenter', onDragEnterHandler);
        ele.addEventListener('dragleave', onDragLeaveHandler);
        return function () {
            ele.removeEventListener('drop', onDropHandler);
            ele.removeEventListener('dragover', onDragOverHandler);
            ele.removeEventListener('dragenter', onDragEnterHandler);
            ele.removeEventListener('dragleave', onDragLeaveHandler);
        };
    }, [ref.current]);
    return { isDragging: isDragging };
};

var DropArea = function (_a) {
    var containerRef = _a.containerRef, openFile = _a.openFile;
    var direction = React__namespace.useContext(core.ThemeContext).direction;
    var isRtl = direction === core.TextDirection.RightToLeft;
    var isDragging = useDrop(containerRef, function (files) {
        if (files.length === 0) {
            return;
        }
        openFile(files[0]);
    }).isDragging;
    var l10n = React__namespace.useContext(core.LocalizationContext).l10n;
    return (React__namespace.createElement(React__namespace.Fragment, null, isDragging && (React__namespace.createElement("div", { className: "rpv-drop__area" },
        React__namespace.createElement("div", { className: core.classNames({
                'rpv-drop__area-body': true,
                'rpv-drop__area-body--rtl': isRtl,
            }) }, l10n && l10n.drop
            ? l10n.drop.dragDropFile
            : 'Drag and drop a PDF document here')))));
};

var dropPlugin = function () {
    var renderViewer = function (props) {
        var slot = props.slot;
        if (slot.attrs) {
            var styles = slot.attrs && slot.attrs.style ? slot.attrs.style : {};
            var updateStyle = __assign(__assign({}, styles), {
                height: '100%',
                position: 'relative',
                width: '100%',
            });
            slot.attrs.style = updateStyle;
        }
        slot.children = (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(DropArea, { containerRef: props.containerRef, openFile: props.openFile }),
            slot.children));
        return slot;
    };
    return {
        renderViewer: renderViewer,
    };
};

exports.dropPlugin = dropPlugin;
