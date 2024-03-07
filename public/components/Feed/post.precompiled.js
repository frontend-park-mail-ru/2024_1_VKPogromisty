(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['post.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div id=\"post"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"postId") : stack1), depth0))
    + "\" class=\"post\">\n  <div class=\"post-header\">\n    <div class=\"post-author\">\n      <img\n        class=\"user-avatar-post\"\n        src=\"http://localhost:8080/api/v1/static/default_avatar.png\"\n      />\n      <span class=\"author-name\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"author") : depth0)) != null ? lookupProperty(stack1,"firstName") : stack1), depth0))
    + "\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"author") : depth0)) != null ? lookupProperty(stack1,"lastName") : stack1), depth0))
    + "</span>\n    </div>\n    <div class=\"post-menu\">\n      <img class=\"ellipsees\" src=\"../static/images/more.png\" />\n    </div>\n  </div>\n  <div class=\"post-content\">\n    <span class=\"content-text\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"text") : stack1), depth0))
    + "</span>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"attachments") : stack1),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":4},"end":{"line":23,"column":13}}})) != null ? stack1 : "")
    + "  </div>\n  <div class=\"post-reaction\">\n    <div class=\"reactions\">\n      <button class=\"like\">\n        <img class=\"heart\" src=\"../static/images/heart.png\" />\n      </button>\n      <button class=\"show-comments\">\n        <img class=\"messenger\" src=\"../static/images/messenger.png\" />\n      </button>\n      <span class=\"show-comments-label\">Показать комментарии</span>\n    </div>\n    <div class=\"comment-menu\">\n      <img class=\"ellipsees\" src=\"../static/images/more.png\" />\n    </div>\n  </div>\n  <div class=\"post-give-comment\">\n    <div class=\"post-footer\">\n      <img\n        class=\"user-avatar-post\"\n        src=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"userAvatar") : depths[1]), depth0))
    + "\"\n      />\n      <input\n        id=\"user-comment"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"post") : depth0)) != null ? lookupProperty(stack1,"postId") : stack1), depth0))
    + "\"\n        class=\"user-comment\"\n        type=\"text\"\n        name=\"user-comment\"\n        placeholder=\"Оставить комментарий\"\n      />\n    </div>\n    <div class=\"comment-buttons\">\n      <button class=\"include-button\">\n        <img\n          class=\"paper-clip\"\n          src=\"../static/images/attach-paperclip-symbol.png\"\n        />\n      </button>\n      <button class=\"send-button\">\n        <img class=\"post-comment-img\" src=\"../static/images/send.png\" />\n      </button>\n    </div>\n  </div>\n</div>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      <img\n        class=\"content-img\"\n        src=\""
    + alias2(alias1((depths[2] != null ? lookupProperty(depths[2],"staticUrl") : depths[2]), depth0))
    + "/"
    + alias2(alias1(depth0, depth0))
    + "\"\n      />\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"posts") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":66,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
})();