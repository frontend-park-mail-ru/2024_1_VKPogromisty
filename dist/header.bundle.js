(()=>{function n(a){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},n(a)}var a;a=Handlebars.template,(Handlebars.templates=Handlebars.templates||{})["header.hbs"]=a({compiler:[8,">= 4.3.0"],main:function(a,t,e,l,s){var i,o=null!=t?t:a.nullContext||{},r=a.hooks.helperMissing,u="function",c=a.escapeExpression,m=a.lookupProperty||function(n,a){if(Object.prototype.hasOwnProperty.call(n,a))return n[a]};return'<div class="header" id="header">\n  <div class="left-side">\n    <a href="/feed"\n      ><img\n        id="left-side__img"\n        class="left-side__img"\n        src="../static/images/Logo.png"\n    /></a>\n    <div class="search">\n      <input class="search__input" type="text" placeholder="Поиск" readonly />\n    </div>\n  </div>\n  <div class="user">\n    <img\n      class="user__notification-img"\n      src="../static/images/notification.png"\n    />\n    <span id="user__username-span" class="user__username-span"\n      >'+c(n(i=null!=(i=m(e,"firstName")||(null!=t?m(t,"firstName"):t))?i:r)===u?i.call(o,{name:"firstName",hash:{},data:s,loc:{start:{line:19,column:7},end:{line:19,column:22}}}):i)+" "+c(n(i=null!=(i=m(e,"lastName")||(null!=t?m(t,"lastName"):t))?i:r)===u?i.call(o,{name:"lastName",hash:{},data:s,loc:{start:{line:19,column:23},end:{line:19,column:37}}}):i)+'</span\n    >\n    <a href="/profile/'+c(a.lambda(null!=t?m(t,"userId"):t,t))+'"\n      ><img\n        id="user__avatar-img"\n        class="user__avatar-img"\n        src="'+c(n(i=null!=(i=m(e,"staticUrl")||(null!=t?m(t,"staticUrl"):t))?i:r)===u?i.call(o,{name:"staticUrl",hash:{},data:s,loc:{start:{line:25,column:13},end:{line:25,column:28}}}):i)+"/"+c(n(i=null!=(i=m(e,"avatar")||(null!=t?m(t,"avatar"):t))?i:r)===u?i.call(o,{name:"avatar",hash:{},data:s,loc:{start:{line:25,column:29},end:{line:25,column:41}}}):i)+'"\n    /></a>\n    <button type="button" id="logout-button" class="user__logout-button">\n      Выйти\n    </button>\n  </div>\n</div>\n'},useData:!0})})();