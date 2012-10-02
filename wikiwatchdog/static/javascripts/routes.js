var AppRouter = Backbone.Router.extend({
    routes: {
      "search/:page": "search",
      "search/": "search",
      "help": "help",
      "*action": "home",
    },
    home: function () {
      window.homeView.render();
    },
    search: function (page) {
      $.get("test.json", function (data) {
        window.searchView.render(page, data);
      });
    },
    help: function () {
      alert(1);
    }
});

window.router = new AppRouter();
Backbone.history.start();
