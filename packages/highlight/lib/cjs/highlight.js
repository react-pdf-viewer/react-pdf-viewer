'use strict';

var core = require('@react-pdf-viewer/core');
var React = require('react');

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

var MessageIcon = function () { return (React__namespace.createElement(core.Icon, { size: 16 },
    React__namespace.createElement("path", { d: "M23.5,17a1,1,0,0,1-1,1h-11l-4,4V18h-6a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h21a1,1,0,0,1,1,1Z" }),
    React__namespace.createElement("path", { d: "M5.5 12L18.5 12" }),
    React__namespace.createElement("path", { d: "M5.5 7L18.5 7" }))); };

var getImageFromArea = function () {
    var newCanvas = document.createElement('canvas');
    var dpr = window.devicePixelRatio || 1;
    return function (canvasEle, highlightArea) {
        var canvasRect = canvasEle.getBoundingClientRect();
        var left = (highlightArea.left * canvasRect.width) / 100;
        var top = (highlightArea.top * canvasRect.height) / 100;
        var width = (highlightArea.width * canvasRect.width) / 100;
        var height = (highlightArea.height * canvasRect.height) / 100;
        var context = newCanvas.getContext('2d');
        newCanvas.width = width;
        newCanvas.height = height;
        context === null || context === void 0 ? void 0 : context.drawImage(canvasEle, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
        return newCanvas.toDataURL('image/png');
    };
};

var HighlightStateType;
(function (HighlightStateType) {
    HighlightStateType["NoSelection"] = "NoSelection";
    HighlightStateType["Selecting"] = "Selecting";
    HighlightStateType["Selected"] = "Selected";
    HighlightStateType["Selection"] = "Selection";
    HighlightStateType["ClickDragging"] = "ClickDragging";
    HighlightStateType["ClickDragged"] = "ClickDragged";
})(HighlightStateType || (HighlightStateType = {}));
var EMPTY_SELECTION_REGION = {
    height: 0,
    left: 0,
    pageIndex: -1,
    top: 0,
    width: 0,
};
var NO_SELECTION_STATE = {
    highlightAreas: [],
    selectionRegion: EMPTY_SELECTION_REGION,
    type: HighlightStateType.NoSelection,
};
var SELECTING_STATE = {
    highlightAreas: [],
    selectionRegion: EMPTY_SELECTION_REGION,
    type: HighlightStateType.Selecting,
};

var ClickDrag = function (_a) {
    var canvasLayerRef = _a.canvasLayerRef, canvasLayerRendered = _a.canvasLayerRendered, pageIndex = _a.pageIndex, store = _a.store, textLayerRef = _a.textLayerRef, textLayerRendered = _a.textLayerRendered;
    var containerRef = React__namespace.useRef();
    var currentCursorRef = React__namespace.useRef(document.body.style.cursor);
    var startPointRef = React__namespace.useRef({ x: 0, y: 0 });
    var offsetRef = React__namespace.useRef({ top: 0, left: 0 });
    var hideContainer = function () {
        var container = containerRef.current;
        if (container) {
            container.classList.add('rpv-highlight__click-drag--hidden');
        }
    };
    var handleMouseDown = function (e) {
        var textLayerEle = textLayerRef.current;
        var container = containerRef.current;
        if (!e.altKey || !textLayerEle || !container || e.button !== 0) {
            return;
        }
        e.preventDefault();
        document.body.style.cursor = 'crosshair';
        var rect = textLayerEle.getBoundingClientRect();
        var startPoint = {
            x: e.clientX,
            y: e.clientY,
        };
        startPointRef.current = startPoint;
        var offset = {
            top: ((startPoint.y - rect.top) * 100) / rect.height,
            left: ((startPoint.x - rect.left) * 100) / rect.width,
        };
        offsetRef.current = offset;
        container.style.top = "".concat(offset.top, "%");
        container.style.left = "".concat(offset.left, "%");
        container.style.height = '0px';
        container.style.width = '0px';
        document.addEventListener('mousemove', handleDocumentMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        store.updateCurrentValue('highlightState', function (currentState) {
            return Object.assign({}, currentState, { type: HighlightStateType.ClickDragging });
        });
    };
    var handleDocumentMouseMove = function (e) {
        var textLayerEle = textLayerRef.current;
        var container = containerRef.current;
        if (!textLayerEle || !container) {
            return;
        }
        e.preventDefault();
        var endPoint = {
            x: e.clientX - startPointRef.current.x,
            y: e.clientY - startPointRef.current.y,
        };
        var rect = textLayerEle.getBoundingClientRect();
        if (container.classList.contains('rpv-highlight__click-drag--hidden')) {
            container.classList.remove('rpv-highlight__click-drag--hidden');
        }
        var width = Math.min(100 - offsetRef.current.left, (endPoint.x * 100) / rect.width);
        var height = Math.min(100 - offsetRef.current.top, (endPoint.y * 100) / rect.height);
        container.style.width = "".concat(width, "%");
        container.style.height = "".concat(height, "%");
    };
    var handleDocumentKeyDown = function (e) {
        if (e.key === 'Escape' && store.get('highlightState').type === HighlightStateType.ClickDragged) {
            e.preventDefault();
            hideContainer();
            store.update('highlightState', NO_SELECTION_STATE);
        }
    };
    var handleDocumenClick = function (e) {
        var container = containerRef.current;
        if (!container) {
            return;
        }
        var highlightType = store.get('highlightState').type;
        if (highlightType === HighlightStateType.NoSelection && e.target !== container) {
            hideContainer();
        }
    };
    var handleDocumentMouseUp = function (e) {
        e.preventDefault();
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
        resetCursor();
        var container = containerRef.current;
        var canvasEle = canvasLayerRef.current;
        if (!container || !canvasEle) {
            return;
        }
        var highlightArea = {
            pageIndex: pageIndex,
            top: parseFloat(container.style.top.slice(0, -1)),
            left: parseFloat(container.style.left.slice(0, -1)),
            height: parseFloat(container.style.height.slice(0, -1)),
            width: parseFloat(container.style.width.slice(0, -1)),
        };
        var previewImage = getImageFromArea()(canvasEle, highlightArea);
        var newState = {
            highlightAreas: [highlightArea],
            previewImage: previewImage,
            selectionRegion: highlightArea,
            type: HighlightStateType.ClickDragged,
        };
        store.update('highlightState', newState);
    };
    var resetCursor = function () {
        currentCursorRef.current
            ? (document.body.style.cursor = currentCursorRef.current)
            : document.body.style.removeProperty('cursor');
    };
    var handleHighlightState = function (s) {
        if (s.type === HighlightStateType.Selection ||
            (s.type === HighlightStateType.ClickDragging && s.selectionRegion.pageIndex !== pageIndex)) {
            hideContainer();
        }
    };
    React__namespace.useEffect(function () {
        store.subscribe('highlightState', handleHighlightState);
        return function () {
            store.unsubscribe('highlightState', handleHighlightState);
        };
    }, []);
    React__namespace.useEffect(function () {
        var canvasEle = canvasLayerRef.current;
        var textLayerEle = textLayerRef.current;
        if (!canvasLayerRendered || !textLayerRendered || !canvasEle || !textLayerEle) {
            return;
        }
        textLayerEle.addEventListener('mousedown', handleMouseDown);
        var eventOptions = {
            capture: true,
        };
        document.addEventListener('keydown', handleDocumentKeyDown);
        document.addEventListener('click', handleDocumenClick, eventOptions);
        return function () {
            textLayerEle.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('click', handleDocumenClick, eventOptions);
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, [textLayerRendered]);
    return React__namespace.createElement("div", { ref: containerRef, className: "rpv-highlight__click-drag rpv-highlight__click-drag--hidden" });
};

var normalizeRotation = function (rotation) { return (rotation >= 0 ? rotation : 360 + rotation); };
var getCssProperties = function (area, rotation) {
    var r = normalizeRotation(rotation);
    switch (r) {
        case 90:
            return {
                height: "".concat(area.width, "%"),
                position: 'absolute',
                right: "".concat(area.top, "%"),
                top: "".concat(area.left, "%"),
                width: "".concat(area.height, "%"),
            };
        case 180:
            return {
                bottom: "".concat(area.top, "%"),
                height: "".concat(area.height, "%"),
                position: 'absolute',
                right: "".concat(area.left, "%"),
                width: "".concat(area.width, "%"),
            };
        case 270:
            return {
                height: "".concat(area.width, "%"),
                position: 'absolute',
                left: "".concat(area.top, "%"),
                bottom: "".concat(area.left, "%"),
                width: "".concat(area.height, "%"),
            };
        case 0:
        case 360:
        default:
            return {
                height: "".concat(area.height, "%"),
                position: 'absolute',
                top: "".concat(area.top, "%"),
                left: "".concat(area.left, "%"),
                width: "".concat(area.width, "%"),
            };
    }
};
var transformArea = function (area, rotation) {
    var r = normalizeRotation(rotation);
    switch (r) {
        case 90:
            return {
                height: area.width,
                left: area.top,
                pageIndex: area.pageIndex,
                top: 100 - area.width - area.left,
                width: area.height,
            };
        case 180:
            return {
                height: area.height,
                left: 100 - area.width - area.left,
                pageIndex: area.pageIndex,
                top: 100 - area.height - area.top,
                width: area.width,
            };
        case 270:
            return {
                height: area.width,
                left: 100 - area.height - area.top,
                pageIndex: area.pageIndex,
                top: area.left,
                width: area.height,
            };
        case 0:
        case 360:
        default:
            return area;
    }
};

var HighlightRect = function (_a) {
    var area = _a.area, rotation = _a.rotation;
    return React__namespace.createElement("div", { className: "rpv-highlight__selected-text", style: getCssProperties(area, rotation) });
};

var useRotation = function (store) {
    var _a = React__namespace.useState(store.get('rotation') || 0), rotation = _a[0], setRotation = _a[1];
    var handleRotationChanged = function (currentRotation) { return setRotation(currentRotation); };
    React__namespace.useEffect(function () {
        store.subscribe('rotation', handleRotationChanged);
        return function () {
            store.unsubscribe('rotation', handleRotationChanged);
        };
    }, []);
    return { rotation: rotation };
};

var HighlightAreaList = function (_a) {
    var pageIndex = _a.pageIndex, renderHighlightContent = _a.renderHighlightContent, renderHighlightTarget = _a.renderHighlightTarget, renderHighlights = _a.renderHighlights, store = _a.store;
    var _b = React__namespace.useState(store.get('highlightState')), highlightState = _b[0], setHighlightState = _b[1];
    var rotation = useRotation(store).rotation;
    var handleHighlightState = function (s) { return setHighlightState(s); };
    var cancel = function () {
        window.getSelection().removeAllRanges();
        store.update('highlightState', NO_SELECTION_STATE);
    };
    React__namespace.useEffect(function () {
        store.subscribe('highlightState', handleHighlightState);
        return function () {
            store.unsubscribe('highlightState', handleHighlightState);
        };
    }, []);
    var listAreas = highlightState.type === HighlightStateType.Selection
        ? highlightState.highlightAreas.filter(function (s) { return s.pageIndex === pageIndex; })
        : [];
    return (React__namespace.createElement(React__namespace.Fragment, null,
        renderHighlightTarget &&
            (highlightState.type === HighlightStateType.Selected ||
                highlightState.type === HighlightStateType.ClickDragged) &&
            highlightState.selectionRegion.pageIndex === pageIndex &&
            renderHighlightTarget({
                highlightAreas: highlightState.highlightAreas,
                previewImage: highlightState.previewImage || '',
                selectedText: highlightState.selectedText || '',
                selectionRegion: highlightState.selectionRegion,
                selectionData: highlightState.selectionData,
                cancel: cancel,
                toggle: function () {
                    var newState = Object.assign({}, highlightState, {
                        type: HighlightStateType.Selection,
                    });
                    store.update('highlightState', newState);
                    window.getSelection().removeAllRanges();
                },
            }),
        renderHighlightContent &&
            highlightState.type == HighlightStateType.Selection &&
            highlightState.selectionRegion.pageIndex === pageIndex &&
            renderHighlightContent({
                highlightAreas: highlightState.highlightAreas,
                previewImage: highlightState.previewImage || '',
                selectedText: highlightState.selectedText || '',
                selectionRegion: highlightState.selectionRegion,
                selectionData: highlightState.selectionData,
                cancel: cancel,
            }),
        listAreas.length > 0 && (React__namespace.createElement("div", null, listAreas.map(function (area, idx) { return (React__namespace.createElement(HighlightRect, { key: idx, area: area, rotation: rotation })); }))),
        renderHighlights &&
            renderHighlights({
                pageIndex: pageIndex,
                rotation: rotation,
                getCssProperties: getCssProperties,
            })));
};

var HIGHLIGHT_LAYER_ATTR = 'data-highlight-text-layer';
var HIGHLIGHT_PAGE_ATTR = 'data-highlight-text-page';

var getRectFromOffsets = function (textDiv, startOffset, endOffset) {
    var clonedEle = textDiv.cloneNode(true);
    textDiv.parentNode.appendChild(clonedEle);
    var firstChild = clonedEle.firstChild;
    var range = new Range();
    range.setStart(firstChild, startOffset);
    range.setEnd(firstChild, endOffset);
    var wrapper = document.createElement('span');
    range.surroundContents(wrapper);
    var rect = wrapper.getBoundingClientRect();
    clonedEle.parentNode.removeChild(clonedEle);
    return rect;
};

var getTextFromOffsets = function (nodes, pageIndex, startDivIdx, startOffset, endDivIdx, endOffset) {
    if (startDivIdx < endDivIdx) {
        var startDivText = nodes
            .slice(startDivIdx, startDivIdx + 1)
            .map(function (node) { return node.textContent.substring(startOffset).trim(); })
            .join(' ');
        var middleDivText = nodes
            .slice(startDivIdx + 1, endDivIdx)
            .map(function (node) { return node.textContent.trim(); })
            .join(' ');
        var endDivText = nodes
            .slice(endDivIdx, endDivIdx + 1)
            .map(function (endDiv) { return endDiv.textContent.substring(0, endOffset || endDiv.textContent.length); })
            .join(' ');
        var wholeText = "".concat(startDivText, " ").concat(middleDivText, " ").concat(endDivText);
        var divTexts = nodes.slice(startDivIdx, endDivIdx + 1).map(function (node, idx) { return ({
            divIndex: startDivIdx + idx,
            pageIndex: pageIndex,
            textContent: node.textContent,
        }); });
        return {
            divTexts: divTexts,
            wholeText: wholeText,
        };
    }
    else {
        var div = nodes[startDivIdx];
        var wholeText = div.textContent.substring(startOffset, endOffset || div.textContent.length).trim();
        var divTexts = [
            {
                divIndex: startDivIdx,
                pageIndex: pageIndex,
                textContent: div.textContent,
            },
        ];
        return {
            divTexts: divTexts,
            wholeText: wholeText,
        };
    }
};

var SelectionRange;
(function (SelectionRange) {
    SelectionRange["SameDiv"] = "SameDiv";
    SelectionRange["DifferentDivs"] = "DifferentDivs";
    SelectionRange["DifferentPages"] = "DifferentPages";
})(SelectionRange || (SelectionRange = {}));

exports.Trigger = void 0;
(function (Trigger) {
    Trigger["None"] = "None";
    Trigger["TextSelection"] = "TextSelection";
})(exports.Trigger || (exports.Trigger = {}));

var EMPTY_SELECTION = ['', '\n'];
var Tracker = function (_a) {
    var store = _a.store;
    var rotation = useRotation(store).rotation;
    var pagesRef = React__namespace.useRef(null);
    var _b = React__namespace.useState(false), arePagesFound = _b[0], setPagesFound = _b[1];
    var _c = React__namespace.useState(store.get('trigger')), trigger = _c[0], setTrigger = _c[1];
    var handlePagesContainer = function (getPagesContainer) {
        var ele = getPagesContainer();
        pagesRef.current = ele;
        setPagesFound(!!ele);
    };
    var handleTrigger = function (trigger) { return setTrigger(trigger); };
    var onMouseUpHandler = function () {
        var selection = document.getSelection();
        var highlightState = store.get('highlightState');
        var hasSelection = (highlightState.type === HighlightStateType.NoSelection ||
            highlightState.type === HighlightStateType.Selected) &&
            selection.rangeCount > 0 &&
            EMPTY_SELECTION.indexOf(selection.toString()) === -1;
        if (!hasSelection) {
            return;
        }
        var range = selection.getRangeAt(0);
        var startDiv = range.startContainer.parentNode;
        var parentEndContainer = range.endContainer.parentNode;
        var shouldIgnoreEndContainer = parentEndContainer instanceof HTMLElement && parentEndContainer.hasAttribute(HIGHLIGHT_LAYER_ATTR);
        var endDiv, endOffset;
        if (startDiv && startDiv.parentNode == range.endContainer) {
            endDiv = startDiv;
            endOffset = endDiv.textContent.length;
        }
        else if (shouldIgnoreEndContainer && range.endOffset == 0) {
            endDiv = range.endContainer.previousSibling;
            endOffset = endDiv.textContent.length;
        }
        else if (shouldIgnoreEndContainer) {
            endDiv = range.endContainer;
            endOffset = range.endOffset;
        }
        else {
            endDiv = parentEndContainer;
            endOffset = range.endOffset;
        }
        if (!(startDiv instanceof HTMLElement) || !(endDiv instanceof HTMLElement)) {
            return;
        }
        var startPageIndex = parseInt(startDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);
        var endPageIndex = parseInt(endDiv.getAttribute(HIGHLIGHT_PAGE_ATTR), 10);
        var startTextLayer = startDiv.parentElement;
        var endTextLayer = endDiv.parentElement;
        var startPageRect = startTextLayer.getBoundingClientRect();
        var startDivSiblings = [].slice.call(startTextLayer.querySelectorAll("[".concat(HIGHLIGHT_PAGE_ATTR, "]")));
        var startDivIndex = startDivSiblings.indexOf(startDiv);
        var endPageRect = endTextLayer.getBoundingClientRect();
        var endDivSiblings = [].slice.call(endTextLayer.querySelectorAll("[".concat(HIGHLIGHT_PAGE_ATTR, "]")));
        var endDivIndex = endDivSiblings.indexOf(endDiv);
        var startOffset = range.startOffset;
        var rangeType = SelectionRange.DifferentPages;
        switch (true) {
            case startPageIndex === endPageIndex && startDivIndex === endDivIndex:
                rangeType = SelectionRange.SameDiv;
                break;
            case startPageIndex === endPageIndex && startDivIndex < endDivIndex:
                rangeType = SelectionRange.DifferentDivs;
                break;
            default:
                rangeType = SelectionRange.DifferentPages;
                break;
        }
        var getRectBetween = function (min, max, eleArray) {
            return Array(max - min + 1)
                .fill(0)
                .map(function (_, i) { return eleArray[min + i].getBoundingClientRect(); });
        };
        var highlightAreas = [];
        switch (rangeType) {
            case SelectionRange.SameDiv:
                var rect = getRectFromOffsets(startDiv, startOffset, endOffset);
                highlightAreas = [
                    {
                        height: (rect.height * 100) / startPageRect.height,
                        left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                        pageIndex: startPageIndex,
                        top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                        width: (rect.width * 100) / startPageRect.width,
                    },
                ];
                break;
            case SelectionRange.DifferentDivs:
                highlightAreas = [getRectFromOffsets(startDiv, startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIndex + 1, endDivIndex - 1, startDivSiblings))
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map(function (rect) {
                    return {
                        height: (rect.height * 100) / startPageRect.height,
                        left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                        pageIndex: startPageIndex,
                        top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                        width: (rect.width * 100) / startPageRect.width,
                    };
                });
                break;
            case SelectionRange.DifferentPages:
                var startAreas = [getRectFromOffsets(startDiv, startOffset, startDiv.textContent.length)]
                    .concat(getRectBetween(startDivIndex + 1, startDivSiblings.length - 1, startDivSiblings))
                    .map(function (rect) {
                    return {
                        height: (rect.height * 100) / startPageRect.height,
                        left: ((rect.left - startPageRect.left) * 100) / startPageRect.width,
                        pageIndex: startPageIndex,
                        top: ((rect.top - startPageRect.top) * 100) / startPageRect.height,
                        width: (rect.width * 100) / startPageRect.width,
                    };
                });
                var endAreas = getRectBetween(0, endDivIndex - 1, endDivSiblings)
                    .concat([getRectFromOffsets(endDiv, 0, endOffset)])
                    .map(function (rect) {
                    return {
                        height: (rect.height * 100) / endPageRect.height,
                        left: ((rect.left - endPageRect.left) * 100) / endPageRect.width,
                        pageIndex: endPageIndex,
                        top: ((rect.top - endPageRect.top) * 100) / endPageRect.height,
                        width: (rect.width * 100) / endPageRect.width,
                    };
                });
                highlightAreas = startAreas.concat(endAreas);
                break;
        }
        var selectedText = '';
        var divTexts = [];
        switch (rangeType) {
            case SelectionRange.SameDiv:
                var textDataSameDiv = getTextFromOffsets(startDivSiblings, startPageIndex, startDivIndex, startOffset, startDivIndex, endOffset);
                selectedText = textDataSameDiv.wholeText;
                divTexts = textDataSameDiv.divTexts;
                break;
            case SelectionRange.DifferentDivs:
                var textDataDifferentDivs = getTextFromOffsets(startDivSiblings, startPageIndex, startDivIndex, startOffset, endDivIndex, endOffset);
                selectedText = textDataDifferentDivs.wholeText;
                divTexts = textDataDifferentDivs.divTexts;
                break;
            case SelectionRange.DifferentPages:
                var startTextData = getTextFromOffsets(startDivSiblings, startPageIndex, startDivIndex, startOffset, startDivSiblings.length);
                var endTextData = getTextFromOffsets(endDivSiblings, endPageIndex, 0, 0, endDivIndex, endOffset);
                selectedText = "".concat(startTextData.wholeText, "\n").concat(endTextData.wholeText);
                divTexts = startTextData.divTexts.concat(endTextData.divTexts);
                break;
        }
        var selectionRegion;
        if (highlightAreas.length > 0) {
            selectionRegion = highlightAreas[highlightAreas.length - 1];
        }
        else {
            var endDivRect = endDiv.getBoundingClientRect();
            selectionRegion = {
                height: (endDivRect.height * 100) / endPageRect.height,
                left: ((endDivRect.left - endPageRect.left) * 100) / endPageRect.width,
                pageIndex: endPageIndex,
                top: ((endDivRect.top - endPageRect.top) * 100) / endPageRect.height,
                width: (endDivRect.width * 100) / endPageRect.width,
            };
        }
        var selectionData = {
            divTexts: divTexts,
            selectedText: selectedText,
            startPageIndex: startPageIndex,
            endPageIndex: endPageIndex,
            startOffset: startOffset,
            startDivIndex: startDivIndex,
            endOffset: endOffset,
            endDivIndex: endDivIndex,
        };
        var selectedState = {
            type: HighlightStateType.Selected,
            selectedText: selectedText,
            highlightAreas: highlightAreas.map(function (area) { return transformArea(area, rotation); }),
            selectionData: selectionData,
            selectionRegion: selectionRegion,
        };
        store.update('highlightState', selectedState);
    };
    React__namespace.useEffect(function () {
        var ele = pagesRef.current;
        if (!ele || trigger === exports.Trigger.None) {
            return;
        }
        ele.addEventListener('mouseup', onMouseUpHandler);
        return function () {
            ele.removeEventListener('mouseup', onMouseUpHandler);
        };
    }, [arePagesFound, trigger, rotation]);
    React__namespace.useEffect(function () {
        store.subscribe('getPagesContainer', handlePagesContainer);
        store.subscribe('trigger', handleTrigger);
        return function () {
            store.unsubscribe('getPagesContainer', handlePagesContainer);
            store.unsubscribe('trigger', handleTrigger);
        };
    }, []);
    return React__namespace.createElement(React__namespace.Fragment, null);
};

var TEXT_LAYER_END_SELECTOR = 'rpv-highlight__selected-end';
var highlightPlugin = function (props) {
    var highlightPluginProps = Object.assign({}, { trigger: exports.Trigger.TextSelection }, props);
    var store = React__namespace.useMemo(function () {
        return core.createStore({
            highlightState: NO_SELECTION_STATE,
            trigger: highlightPluginProps.trigger,
        });
    }, []);
    var renderViewer = function (props) {
        var currentSlot = props.slot;
        if (currentSlot.subSlot && currentSlot.subSlot.children) {
            currentSlot.subSlot.children = (React__namespace.createElement(React__namespace.Fragment, null,
                React__namespace.createElement(Tracker, { store: store }),
                currentSlot.subSlot.children));
        }
        return currentSlot;
    };
    var handleMouseDown = function (textLayerRender) { return function (e) {
        if (store.get('trigger') === exports.Trigger.None || e.button !== 0) {
            return;
        }
        var textLayer = textLayerRender.ele;
        var pageRect = textLayer.getBoundingClientRect();
        var highlightState = store.get('highlightState');
        if (highlightState.type === HighlightStateType.Selected) {
            var mouseTop_1 = e.clientY - pageRect.top;
            var mouseLeft_1 = e.clientX - pageRect.left;
            var userClickedInsideArea = highlightState.highlightAreas
                .filter(function (area) { return area.pageIndex === textLayerRender.pageIndex; })
                .find(function (area) {
                var t = (area.top * pageRect.height) / 100;
                var l = (area.left * pageRect.width) / 100;
                var h = (area.height * pageRect.height) / 100;
                var w = (area.width * pageRect.width) / 100;
                return t <= mouseTop_1 && mouseTop_1 <= t + h && l <= mouseLeft_1 && mouseLeft_1 <= l + w;
            });
            if (userClickedInsideArea) {
                window.getSelection().removeAllRanges();
                store.update('highlightState', NO_SELECTION_STATE);
            }
            else {
                store.update('highlightState', SELECTING_STATE);
            }
        }
        else {
            store.update('highlightState', NO_SELECTION_STATE);
        }
        var selectionTop = ((e.clientY - pageRect.top) * 100) / pageRect.height;
        var selectEnd = textLayer.querySelector(".".concat(TEXT_LAYER_END_SELECTOR));
        if (selectEnd && e.target !== textLayer) {
            selectEnd.style.top = "".concat(Math.max(0, selectionTop), "%");
        }
    }; };
    var handleMouseUp = function (textLayerRender) { return function (e) {
        if (store.get('trigger') === exports.Trigger.None) {
            return;
        }
        var selectEnd = textLayerRender.ele.querySelector(".".concat(TEXT_LAYER_END_SELECTOR));
        if (selectEnd) {
            selectEnd.style.removeProperty('top');
        }
    }; };
    var onTextLayerRender = function (e) {
        var mouseDownHandler = handleMouseDown(e);
        var mouseUpHandler = handleMouseUp(e);
        var textEle = e.ele;
        if (e.status === core.LayerRenderStatus.PreRender) {
            textEle.removeEventListener('mousedown', mouseDownHandler);
            textEle.removeEventListener('mouseup', mouseUpHandler);
            var selectEndEle = textEle.querySelector(".".concat(TEXT_LAYER_END_SELECTOR));
            if (selectEndEle) {
                textEle.removeChild(selectEndEle);
            }
        }
        else if (e.status === core.LayerRenderStatus.DidRender) {
            textEle.addEventListener('mousedown', mouseDownHandler);
            textEle.addEventListener('mouseup', mouseUpHandler);
            textEle.setAttribute(HIGHLIGHT_LAYER_ATTR, 'true');
            textEle
                .querySelectorAll('.rpv-core__text-layer-text')
                .forEach(function (span) { return span.setAttribute(HIGHLIGHT_PAGE_ATTR, "".concat(e.pageIndex)); });
            if (!textEle.querySelector(".".concat(TEXT_LAYER_END_SELECTOR))) {
                var selectEnd = document.createElement('div');
                selectEnd.classList.add(TEXT_LAYER_END_SELECTOR);
                selectEnd.classList.add('rpv-core__text-layer-text--not');
                textEle.appendChild(selectEnd);
            }
        }
    };
    var renderPageLayer = function (renderPageProps) { return (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement(ClickDrag, { canvasLayerRef: renderPageProps.canvasLayerRef, canvasLayerRendered: renderPageProps.canvasLayerRendered, pageIndex: renderPageProps.pageIndex, store: store, textLayerRef: renderPageProps.textLayerRef, textLayerRendered: renderPageProps.textLayerRendered }),
        React__namespace.createElement(HighlightAreaList, { pageIndex: renderPageProps.pageIndex, renderHighlightContent: highlightPluginProps.renderHighlightContent, renderHighlightTarget: highlightPluginProps.renderHighlightTarget, renderHighlights: highlightPluginProps.renderHighlights, store: store }))); };
    var jumpToHighlightArea = function (area) {
        var jumpToDestination = store.get('jumpToDestination');
        if (jumpToDestination) {
            var bottomOffset = function (_, viewportHeight) { return ((100 - area.top) * viewportHeight) / 100; };
            var leftOffset = function (viewportWidth, _) { return ((100 - area.left) * viewportWidth) / 100; };
            jumpToDestination({
                pageIndex: area.pageIndex,
                bottomOffset: bottomOffset,
                leftOffset: leftOffset,
            });
        }
    };
    var switchTrigger = function (trigger) {
        store.update('trigger', trigger);
    };
    return {
        install: function (pluginFunctions) {
            store.update('jumpToDestination', pluginFunctions.jumpToDestination);
            store.update('getPagesContainer', pluginFunctions.getPagesContainer);
        },
        onViewerStateChange: function (viewerState) {
            store.update('rotation', viewerState.rotation);
            return viewerState;
        },
        onTextLayerRender: onTextLayerRender,
        renderPageLayer: renderPageLayer,
        renderViewer: renderViewer,
        jumpToHighlightArea: jumpToHighlightArea,
        switchTrigger: switchTrigger,
    };
};

exports.MessageIcon = MessageIcon;
exports.highlightPlugin = highlightPlugin;
