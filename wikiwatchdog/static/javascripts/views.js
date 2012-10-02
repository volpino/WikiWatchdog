var HomeView = Backbone.View.extend({
  template: _.template($('#home-template').html()),
  el: "#content",

  render: function () {
    $(this.el).html(this.template());
    return this;
  },

  events: {
    "submit #search-form": "search"
  },

  search: function () {
    var toSearch = $("#search-text").val();
    window.router.navigate("search/" + toSearch, {trigger: true});
    return this
  }
});


var SearchView = Backbone.View.extend({
  template: _.template($('#search-template').html()),
  el: "#content",

  render: function (toSearch, data) {
    var json_data = $.parseJSON(data);
    json_data.toSearch = toSearch;

    $(this.el).html(this.template(json_data));

    window.diffView.clear();
    return this;
  }
});


var DiffView = Backbone.View.extend({
  template: _.template($('#diff-template').html()),
  templateClear: _.template($('#diff-clear-template').html()),

  render: function (data) {
    $("#diff-area").html(this.template(data));
    return this;
  },

  clear: function () {
    $("#diff-area").html(this.templateClear());
    return this;
  }
});


window.homeView = new HomeView();
window.searchView = new SearchView();
window.diffView = new DiffView();
