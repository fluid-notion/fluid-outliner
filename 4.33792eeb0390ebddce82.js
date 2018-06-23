(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./app/components/DrawerBody.tsx":
/*!***************************************!*\
  !*** ./app/components/DrawerBody.tsx ***!
  \***************************************/
/*! exports provided: DrawerBody */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DrawerBody\", function() { return DrawerBody; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_octicon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-octicon */ \"./node_modules/react-octicon/lib/index.js\");\n/* harmony import */ var react_octicon__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_octicon__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/styles */ \"./node_modules/@material-ui/core/styles/index.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/index.es.js\");\n\n\n\n\nconst styles = {\n    container: {\n        maxWidth: \"300px\",\n        float: \"left\",\n        marginLeft: \"10px\",\n    },\n    icon: {\n        marginRight: \"5px\",\n    },\n    table: {\n        \"& td\": {\n            padding: \"5px\",\n        },\n        \"& tr\": {\n            height: \"auto\",\n        },\n    },\n};\nconst Section = ({ children }) => (react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"section\", { style: {\n        padding: \"10px\",\n        margin: \"10px 0\",\n        borderLeft: \"2px dotted silver\",\n    } }, children));\nconst DrawerBody = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_2__[\"withStyles\"])(styles)(({ classes }) => (react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", { className: classes.container },\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"headline\" }, \"Current Notebook\"),\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, null,\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Button\"], { color: \"primary\" },\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" },\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"desktop-download\", className: classes.icon }),\n                \" Save To File\")),\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Button\"], { color: \"primary\" },\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" },\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"trashcan\", className: classes.icon }),\n                \" Clear Cache\"))),\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"headline\" }, \"Keybindings\"),\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, null,\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Table\"], { className: classes.table },\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableBody\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Save To File\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Ctrl+S\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Find\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Ctrl+F\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], { colSpan: 2 },\n                        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body2\" }, \"For Selected Node:\"))),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift Up\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift+Up\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift Down\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift+Down\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Navigate\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Up/Down\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Indent Further\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Tab\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Indent Back\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift+Tab\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Enable Edit\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Enter\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Disable Edit\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Esc\")),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableRow\"], null,\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Add new note below\"),\n                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"TableCell\"], null, \"Shift+Enter\"))))),\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"headline\" }, \"Credits\"),\n    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Section, null,\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"This project wouldn't exist without following amazing open source projects (and the hard work of contributors working on them).\"),\n        react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"List\"], { dense: true, style: { marginLeft: \"-20px\" } },\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"mobx\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"mobx-state-tree\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"react\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"webpack\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"quill\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"webpack-offline\")),\n            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"ListItem\"], null,\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_octicon__WEBPACK_IMPORTED_MODULE_1___default.a, { name: \"star\", className: classes.icon }),\n                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Typography\"], { variant: \"body1\" }, \"And Many More ...\")))))));\n\n\n//# sourceURL=webpack:///./app/components/DrawerBody.tsx?");

/***/ })

}]);