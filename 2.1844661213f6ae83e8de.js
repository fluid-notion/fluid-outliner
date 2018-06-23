(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./app/components/FileUploader.tsx":
/*!*****************************************!*\
  !*** ./app/components/FileUploader.tsx ***!
  \*****************************************/
/*! exports provided: FileUploader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"FileUploader\", function() { return FileUploader; });\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/index.es.js\");\n/* harmony import */ var core_decorators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-decorators */ \"./node_modules/core-decorators/es/core-decorators.js\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _models_Store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Store */ \"./app/models/Store.ts\");\nvar __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (undefined && undefined.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\n\n\n\n\n\nlet FileUploader = class FileUploader extends react__WEBPACK_IMPORTED_MODULE_3___default.a.Component {\n    constructor() {\n        super(...arguments);\n        this.isDragActive = false;\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_0__[\"ButtonBase\"], { style: {\n                textAlign: \"center\",\n                padding: \"30px\",\n                flexGrow: 1,\n                fontSize: \"1.5rem\",\n                color: \"silver\",\n                whiteSpace: \"nowrap\",\n                border: this.isDragActive ? \"2px dotted blue\" : \"2px dotted silver\",\n            } },\n            react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(\"div\", { onDragEnter: this.handleDragEnter, onDragLeave: this.handleDragLeave, onDragOver: this.handleDragOver, onDrop: this.handleDrop }, \"Drop File Here\")));\n    }\n    handleDragEnter() {\n        this.isDragActive = true;\n    }\n    handleDragLeave() {\n        this.isDragActive = false;\n    }\n    handleDragOver(event) {\n        event.stopPropagation();\n        event.preventDefault();\n        event.dataTransfer.dropEffect = \"copy\";\n    }\n    handleDrop(event) {\n        event.stopPropagation();\n        event.preventDefault();\n        const { files } = event.dataTransfer;\n        if (files.length === 0) {\n            return;\n        }\n        if (files.length > 1) {\n            alert(\"Uploading multiple files is not supported\");\n        }\n        const file = files[0];\n        const reader = new FileReader();\n        reader.onload = (progEvent) => {\n            const result = progEvent.target.result;\n            this.props.store.restoreSaved(result);\n        };\n        reader.readAsText(file);\n    }\n};\n__decorate([\n    mobx__WEBPACK_IMPORTED_MODULE_2__[\"observable\"],\n    __metadata(\"design:type\", Object)\n], FileUploader.prototype, \"isDragActive\", void 0);\n__decorate([\n    core_decorators__WEBPACK_IMPORTED_MODULE_1__[\"autobind\"],\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", void 0)\n], FileUploader.prototype, \"handleDragEnter\", null);\n__decorate([\n    core_decorators__WEBPACK_IMPORTED_MODULE_1__[\"autobind\"],\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", void 0)\n], FileUploader.prototype, \"handleDragLeave\", null);\n__decorate([\n    core_decorators__WEBPACK_IMPORTED_MODULE_1__[\"autobind\"],\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", void 0)\n], FileUploader.prototype, \"handleDragOver\", null);\n__decorate([\n    core_decorators__WEBPACK_IMPORTED_MODULE_1__[\"autobind\"],\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Object]),\n    __metadata(\"design:returntype\", void 0)\n], FileUploader.prototype, \"handleDrop\", null);\nFileUploader = __decorate([\n    _models_Store__WEBPACK_IMPORTED_MODULE_4__[\"injectStore\"]\n], FileUploader);\n\n\n\n//# sourceURL=webpack:///./app/components/FileUploader.tsx?");

/***/ })

}]);