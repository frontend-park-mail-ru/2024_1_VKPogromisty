(()=>{var n;n=Handlebars.template,(Handlebars.templates=Handlebars.templates||{})["friendsMain.hbs"]=n({1:function(n,e,l,a,s){var r=n.lambda,t=n.escapeExpression,i=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'  <span>\n    <a\n      class="right-sidebar__a-common"\n      id="'+t(r(null!=e?i(e,"id"):e,e))+'"\n      href="/community'+t(r(null!=e?i(e,"href"):e,e))+'"\n      >'+t(r(null!=e?i(e,"text"):e,e))+"</a\n    >\n  </span>\n"},3:function(n,e,l,a,s,r,t){var i,o=n.lambda,u=n.escapeExpression,c=null!=e?e:n.nullContext||{},d=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'  <div class="friends-field" id="friends-field-'+u(o(null!=e?d(e,"userId"):e,e))+'">\n    <div class="friend" id="friend-'+u(o(null!=e?d(e,"userId"):e,e))+'">\n      <a href="/profile/'+u(o(null!=e?d(e,"userId"):e,e))+'"\n        ><img\n          class="friend__avatar-img"\n          src="'+u(o(null!=t[1]?d(t[1],"staticUrl"):t[1],e))+"/"+u(o(null!=e?d(e,"avatar"):e,e))+'"\n      /></a>\n      <div class="friend-info">\n        <span class="friend-info__name-span"\n          >'+u(o(null!=e?d(e,"firstName"):e,e))+" "+u(o(null!=e?d(e,"lastName"):e,e))+'</span\n        >\n        <div class="friend-content">\n          <span class="friend-content__date-of-birth-span">'+u(o(null!=e?d(e,"dateOfBirth"):e,e))+'</span>\n        </div>\n      </div>\n    </div>\n    <div class="friend-ables">\n      <a href="/chat/'+u(o(null!=e?d(e,"userId"):e,e))+'">\n        <button\n          type="button"\n          class="friend-ables__send-message-button"\n          id="send-message-'+u(o(null!=e?d(e,"userId"):e,e))+'"\n        >\n          <img\n            src="../static/images/messenger.png"\n            class="friend-ables__send-message-img"\n          />\n        </button>\n      </a>\n'+(null!=(i=d(l,"if").call(c,null!=t[1]?d(t[1],"isFriends"):t[1],{name:"if",hash:{},fn:n.program(4,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:60,column:6},end:{line:68,column:13}}}))?i:"")+(null!=(i=d(l,"if").call(c,null!=t[1]?d(t[1],"isSubscribers"):t[1],{name:"if",hash:{},fn:n.program(6,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:69,column:6},end:{line:77,column:13}}}))?i:"")+(null!=(i=d(l,"if").call(c,null!=t[1]?d(t[1],"isSubscriptions"):t[1],{name:"if",hash:{},fn:n.program(8,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:78,column:6},end:{line:86,column:13}}}))?i:"")+"    </div>\n  </div>\n"},4:function(n,e,l,a,s){var r=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'      <button\n        type="button"\n        class="friend-ables__delete-friend-button"\n        data-id="'+n.escapeExpression(n.lambda(null!=e?r(e,"userId"):e,e))+'"\n      >\n        Удалить из друзей\n      </button>\n'},6:function(n,e,l,a,s){var r=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'      <button\n        type="button"\n        class="friend-ables__add-friend-button"\n        data-id="'+n.escapeExpression(n.lambda(null!=e?r(e,"userId"):e,e))+'"\n      >\n        Добавить в друзья\n      </button>\n'},8:function(n,e,l,a,s){var r=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'      <button\n        type="button"\n        class="friend-ables__unsubscribe-button"\n        data-id="'+n.escapeExpression(n.lambda(null!=e?r(e,"userId"):e,e))+'"\n      >\n        Отписаться\n      </button>\n'},10:function(n,e,l,a,s){var r,t=null!=e?e:n.nullContext||{},i=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return(null!=(r=i(l,"if").call(t,null!=e?i(e,"isFriends"):e,{name:"if",hash:{},fn:n.program(11,s,0),inverse:n.noop,data:s,loc:{start:{line:93,column:2},end:{line:95,column:9}}}))?r:"")+(null!=(r=i(l,"if").call(t,null!=e?i(e,"isSubscribers"):e,{name:"if",hash:{},fn:n.program(13,s,0),inverse:n.noop,data:s,loc:{start:{line:96,column:2},end:{line:98,column:9}}}))?r:"")+(null!=(r=i(l,"if").call(t,null!=e?i(e,"isSubscriptions"):e,{name:"if",hash:{},fn:n.program(15,s,0),inverse:n.noop,data:s,loc:{start:{line:99,column:2},end:{line:101,column:9}}}))?r:"")},11:function(n,e,l,a,s){return'  <span class="no-friends__span">У вас нет друзей</span>\n'},13:function(n,e,l,a,s){return'  <span class="no-subscribers__span">У вас нет подписчиков</span>\n'},15:function(n,e,l,a,s){return'  <span class="no-subscriptions__span">Вы ни на кого не подписаны</span>\n'},compiler:[8,">= 4.3.0"],main:function(n,e,l,a,s,r,t){var i,o=null!=e?e:n.nullContext||{},u=n.lookupProperty||function(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]};return'<div class="search-place">\n  <div class="search-friend">\n    <img\n      class="search-friend__magnifier-img"\n      src="../static/images/magnifying-glass.png"\n    />\n    <input\n      class="search-friend__input"\n      type="text"\n      placeholder="Поиск"\n      readonly\n    />\n  </div>\n</div>\n<div class="right-sidebar-friends">\n'+(null!=(i=u(l,"each").call(o,null!=e?u(e,"rightSidebar"):e,{name:"each",hash:{},fn:n.program(1,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:16,column:2},end:{line:25,column:11}}}))?i:"")+'</div>\n<div class="friends">\n'+(null!=(i=u(l,"each").call(o,null!=e?u(e,"friends"):e,{name:"each",hash:{},fn:n.program(3,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:28,column:2},end:{line:89,column:11}}}))?i:"")+'</div>\n<div class="no-friends">\n'+(null!=(i=u(l,"if").call(o,null!=e?u(e,"noFriends"):e,{name:"if",hash:{},fn:n.program(10,s,0,r,t),inverse:n.noop,data:s,loc:{start:{line:92,column:2},end:{line:102,column:9}}}))?i:"")+"</div>\n"},useData:!0,useDepths:!0})})();