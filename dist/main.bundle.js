(()=>{var a;a=Handlebars.template,(Handlebars.templates=Handlebars.templates||{})["main.hbs"]=a({1:function(a,l,e,n,i){var r=a.lambda,s=a.escapeExpression,t=a.lookupProperty||function(a,l){if(Object.prototype.hasOwnProperty.call(a,l))return a[l]};return'        <li class="sidebar-list__li">\n          <a class="sidebar-list__a" href="'+s(r(null!=l?t(l,"href"):l,l))+'">'+s(r(null!=l?t(l,"text"):l,l))+"</a>\n        </li>\n"},compiler:[8,">= 4.3.0"],main:function(a,l,e,n,i){var r,s=a.lookupProperty||function(a,l){if(Object.prototype.hasOwnProperty.call(a,l))return a[l]};return'<div id="main">\n  <div class="server-error-500 error" id="server-error-500">\n    Неожиданная ошибка\n  </div>\n  <div class="feed-main">\n    <div class="sidebar" id="sidebar">\n      <ul class="sidebar-list">\n'+(null!=(r=s(e,"each").call(null!=l?l:a.nullContext||{},null!=l?s(l,"fullSidebar"):l,{name:"each",hash:{},fn:a.program(1,i,0),inverse:a.noop,data:i,loc:{start:{line:8,column:8},end:{line:12,column:17}}}))?r:"")+'      </ul>\n      <ul id="help-sidebar" class="sidebar-list">\n        <li class="sidebar-list__li">\n          <a class="sidebar-list__a" href="#">Помощь</a>\n        </li>\n      </ul>\n    </div>\n\n    <div id="activity" class="activity"></div>\n  </div>\n</div>\n'},useData:!0})})();