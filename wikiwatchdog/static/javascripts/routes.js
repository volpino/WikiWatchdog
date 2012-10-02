var AppRouter = Backbone.Router.extend({
    routes: {
      "search/:toSearch": "search",
      "help": "help",
      "*action": "home",
    },
    home: function () {
      window.homeView.render();
    },
    search: function (toSearch) {
      $.get("test.json", function (data) {
        window.searchView.render(toSearch, data);
      });
    },
    help: function () {
      alert(1);
    }
});

window.router = new AppRouter();
Backbone.history.start();
