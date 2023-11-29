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

var LocaleIcon = function () { return (React__namespace.createElement(core.Icon, { size: 16 },
    React__namespace.createElement("path", { d: "M23.5,11.984c0,6.351-5.149,11.5-11.5,11.5s-11.5-5.149-11.5-11.5s5.149-11.5,11.5-11.5\n            S23.5,5.633,23.5,11.984L23.5,11.984z\n            M20.147,3.869l-1.209,3.02c-0.27,0.676-0.887,1.152-1.609,1.242L15.2,8.4\n            c-0.274,0.035-0.468,0.285-0.434,0.559c0.007,0.056,0.023,0.11,0.049,0.16l0.546,1.091c0.084,0.17,0.258,0.277,0.447,0.277h0.382\n            c0.276,0,0.5,0.224,0.499,0.501c0,0.077-0.018,0.153-0.052,0.222l-1.585,3.171C15.018,14.449,15,14.524,15,14.6v2.446\n            c0,0.593-0.264,1.156-0.72,1.536l-1.9,1.58c-0.211,0.174-0.524,0.145-0.7-0.064l-1.53-1.836c-0.407-0.491-0.556-1.147-0.4-1.765\n            l0.209-0.836c0.029-0.116,0.015-0.238-0.038-0.345l-0.779-1.557c-0.084-0.17-0.258-0.277-0.447-0.277h-1.7\n            c-0.883,0-1.661-0.578-1.916-1.423L4.412,9.87c-0.049-0.163-0.011-0.34,0.1-0.469l1.726-2.024c0.47-0.551,1.202-0.805,1.913-0.663\n            l1.3,0.26c0.033,0.006,0.066,0.01,0.1,0.01H13c0.276,0,0.5-0.224,0.5-0.5V5.338c0-0.818-0.498-1.553-1.257-1.857L11.96,3.368\n            c-0.257-0.101-0.383-0.392-0.281-0.649c0.042-0.106,0.119-0.195,0.218-0.251l2.779-1.59" }))); };

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

var LocalePopover = function (_a) {
    var _b = _a.initialLocale, initialLocale = _b === void 0 ? 'en_US' : _b, locales = _a.locales, localizations = _a.localizations, onUpdateLocalization = _a.onUpdateLocalization;
    var l10n = React__namespace.useContext(core.LocalizationContext).l10n;
    var renderTarget = function (toggle, opened) {
        var label = l10n && l10n.localeSwitcher
            ? l10n.localeSwitcher.switchLocale
            : 'Switch locale';
        return (React__namespace.createElement(core.Tooltip, { ariaControlsSuffix: "locale-switcher", position: core.Position.BottomCenter, target: React__namespace.createElement(core.MinimalButton, { ariaLabel: label, isSelected: opened, testId: "locale-switcher__popover-target", onClick: toggle },
                React__namespace.createElement(LocaleIcon, null)), content: function () { return label; }, offset: { left: 0, top: 8 } }));
    };
    var renderContent = function (toggle) {
        var changeLocale = function (newLocale) {
            onUpdateLocalization(newLocale, localizations[newLocale] || {});
            toggle();
        };
        return (React__namespace.createElement(core.Menu, null, Object.keys(locales).map(function (loc) {
            return (React__namespace.createElement(core.MenuItem, { key: loc, checked: initialLocale === loc, onClick: function () { return changeLocale(loc); } }, locales[loc]));
        })));
    };
    return (React__namespace.createElement(core.Popover, { ariaControlsSuffix: "locale-switcher", ariaHasPopup: "menu", position: core.Position.BottomRight, target: renderTarget, content: renderContent, offset: { left: 0, top: 8 }, closeOnClickOutside: true, closeOnEscape: true }));
};

var localeSwitcherPlugin = function () {
    var LocalePopoverDecorator = function (props) { return React__namespace.createElement(LocalePopover, __assign({}, props)); };
    return {
        LocalePopover: LocalePopoverDecorator,
    };
};

exports.LocaleIcon = LocaleIcon;
exports.localeSwitcherPlugin = localeSwitcherPlugin;
