(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signup.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "            <div class=\"error\" id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"incorrect") : depth0), depth0))
    + "\">\n            </div>\n            <input\n              class=\"main-input\"\n              id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\"\n              type=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"type") : depth0), depth0))
    + "\"\n              name=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"name") : depth0), depth0))
    + "\"\n              placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\"\n              required\n            />\n";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "              <input\n                id=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
    + "\"\n                type=\"text\"\n                required\n                placeholder=\""
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"placeholder") : depth0), depth0))
    + "\"\n              />\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"form-wrapper\">\n  <div class=\"form\">\n    <div class=\"logo\">\n      <img src=\"../static/images/logo.png\" id=\"logo-img\" />\n    </div>\n    <div id=\"repeat-email\" class=\"error\">\n    </div>\n    <div class=\"register-form\">\n      <form method=\"post\" action=\"#\" enctype=\"multipart/form-data\">\n        <div class=\"vertical-stack\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"main_inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":10},"end":{"line":22,"column":19}}})) != null ? stack1 : "")
    + "          <label for=\"date-birthday\" class=\"form-label\">Date of birthday</label>\n          <div class=\"error\" id=\"incorrect-date-of-birthday\">\n          </div>\n          <div id=\"date-birthday\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"part_of_date") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":12},"end":{"line":34,"column":21}}})) != null ? stack1 : "")
    + "          </div>\n        </div>\n        <div class=\"file-input\">\n          <label class=\"input-avatar\">\n            <input type=\"file\" name=\"avatar\" id=\"avatar\" />\n            <span>Upload</span>\n          </label>\n        </div>\n        <button type=\"button\" id=\"submit-form\">Sign up</button>\n      </form>\n    </div>\n    <div class=\"to-auth-page\">\n      <a href=\"/login\" id=\"sign-in-button\">Sign in</a>\n    </div>\n  </div>\n</div>";
},"useData":true});
})();