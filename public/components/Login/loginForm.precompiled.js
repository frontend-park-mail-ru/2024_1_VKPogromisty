(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <div class=\"input-group\">\n          <div class=\"error\" id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"incorrect") : depth0), depth0))
    + "\"></div>\n          <input\n            type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\"\n            id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\"\n            name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\"\n            placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\"\n            required\n          />\n        </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"form-wrapper\">\n  <div class=\"form\">\n    <div class=\"image-container\">\n      <img src=\"../static/images/Logo.png\" width=\"124px\" alt=\"Logo\" />\n    </div>\n    <form class=\"login-form\" action=\"/submit\" method=\"POST\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":6},"end":{"line":18,"column":15}}})) != null ? stack1 : "")
    + "      <button type=\"button\" class=\"button-sign-in\" id=\"button-sign-in\">\n        Sign in\n      </button>\n      <a href=\"/signup\" class=\"link_sign_up\" id=\"button-sign-up\">Sign up</a>\n    </form>\n  </div>\n</div>";
},"useData":true});
})();