(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{642:function(e,t,n){"use strict";n.d(t,"a",function(){return a});var i=n(0),r=n.n(i),o=n(23),s=n.n(o);const a=({onClick:e})=>r.a.createElement(s.a,{onClick:e,name:"x",style:{position:"absolute",right:"10px",top:"10px",fontSize:"1.5rem",cursor:"pointer",zIndex:999}})},726:function(e,t,n){"use strict";n.r(t),n.d(t,"MarkdownEditorInner",function(){return b}),n.d(t,"MarkdownEditor",function(){return v});var i=n(0),r=n.n(i),o=n(675),s=n.n(o),a=n(22),l=n(14),c=n(3),d=n(264),p=n.n(d),u=n(39),h=n(161),m=n(642),f=function(e,t,n,i){var r,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,n,i);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(s=(o<3?r(s):o>3?r(t,n,s):r(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},g=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},y=function(e,t,n,i){return new(n||(n=Promise))(function(r,o){function s(e){try{l(i.next(e))}catch(e){o(e)}}function a(e){try{l(i.throw(e))}catch(e){o(e)}}function l(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(s,a)}l((i=i.apply(e,t||[])).next())})};class b extends r.a.Component{constructor(e){super(e),this.textArea=null,this.mde=null,this.converter=new s.a.Converter,this.editable=new h.a(this)}get visitState(){return this.props.store.visitState}get item(){return this.props.note}get htmlContent(){return this.converter.makeHtml(this.item.content)}render(){return this.editable.isEditing?r.a.createElement("div",{style:{background:"white",position:"relative"}},r.a.createElement(m.a,{onClick:()=>this.editable.disableEditing()}),r.a.createElement("textarea",{ref:this.registerTextArea})):r.a.createElement(p.a,{onDoubleClick:this.editable.enableEditing,style:{overflow:"hidden",padding:"10px",minHeight:"45px",cursor:"pointer"}},r.a.createElement("div",{dangerouslySetInnerHTML:{__html:this.htmlContent}}))}registerTextArea(e){this.textArea=e,e&&this.setupEditor()}setupEditor(){return y(this,void 0,void 0,function*(){yield n.e(13).then(n.t.bind(null,674,7));const e=(yield Promise.all([n.e(8),n.e(9),n.e(12)]).then(n.t.bind(null,672,7))).default;this.mde=new e({element:this.textArea,initialValue:this.item.content}),this.mde.codemirror.on("change",()=>{this.item.setContent(this.mde.value())})})}}f([c.g,g("design:type",Object),g("design:paramtypes",[])],b.prototype,"visitState",null),f([c.g,g("design:type",Object),g("design:paramtypes",[])],b.prototype,"item",null),f([c.g,g("design:type",Object),g("design:paramtypes",[])],b.prototype,"htmlContent",null),f([a.a,g("design:type",Function),g("design:paramtypes",[Object]),g("design:returntype",void 0)],b.prototype,"registerTextArea",null),f([a.a,g("design:type",Function),g("design:paramtypes",[]),g("design:returntype",Promise)],b.prototype,"setupEditor",null);const v=Object(u.b)(Object(l.d)(b))}}]);