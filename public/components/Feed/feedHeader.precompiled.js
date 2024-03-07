(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['feedHeader.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"left-side\">\n  <img id=\"logo_img\" src=\"../static/images/logo.png\" style=\"cursor: pointer\" />\n  <div class=\"search\">\n    <input type=\"text\" placeholder=\"Поиск\" />\n  </div>\n</div>\n<div class=\"user\">\n  <span id=\"username\" class=\"username\" style=\"cursor: pointer\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"fullUserName") || (depth0 != null ? lookupProperty(depth0,"fullUserName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fullUserName","hash":{},"data":data,"loc":{"start":{"line":8,"column":63},"end":{"line":8,"column":79}}}) : helper)))
    + "</span>\n  <img id=\"user-avatar\" class=\"user-avatar\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"userAvatar") || (depth0 != null ? lookupProperty(depth0,"userAvatar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userAvatar","hash":{},"data":data,"loc":{"start":{"line":9,"column":49},"end":{"line":9,"column":63}}}) : helper)))
    + "\" />\n  <div class=\"logout\">\n    <button id=\"logout-button\">Выйти</button>\n  </div>\n</div>";
},"useData":true});
})();