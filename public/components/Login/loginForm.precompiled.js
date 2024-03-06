(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <div class=\"input-group\">\r\n                <div class=\"error\" id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"incorrect") : depth0), depth0))
    + "\"></div>\r\n                <input\r\n                    type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\"\r\n                    id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\"\r\n                    name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\"\r\n                    placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\"\r\n                    required\r\n                />\r\n            </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"form-wrapper\">\r\n    <div class=\"form\">\r\n        <div class=\"image-container\">\r\n            <img\r\n                src=\"../static/images/Logo.png\"\r\n                width=\"124px\"\r\n                alt=\"Logo\"\r\n            />\r\n        </div>\r\n        <form class=\"login-form\" action=\"/submit\" method=\"POST\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":12},"end":{"line":22,"column":21}}})) != null ? stack1 : "")
    + "            <button\r\n                type=\"button\"\r\n                class=\"button-sign-in\"\r\n                id=\"button-sign-in\"\r\n            >\r\n                Sign in\r\n            </button>\r\n            <a href=\"/signup\" class=\"link_sign_up\" id=\"button-sign-up\">Sign up</a\r\n            >\r\n        </form>\r\n    </div>\r\n</div>";
},"useData":true});
})();