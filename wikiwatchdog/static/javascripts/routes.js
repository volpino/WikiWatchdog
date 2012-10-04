var AppRouter = Backbone.Router.extend({
    routes: {
      "search/:lang/:toSearch": "search",
      "help": "help",
      "*action": "home",
    },
    home: function () {
      window.homeView.render();
    },
    search: function (lang, toSearch) {
      var apiUrl = "http://toolserver.org/~sonet/cgi-bin/watchdog.py?callback=?";

      lang = escape(lang);
      toSearch = escape(toSearch);

      window.showLoading();
      $.getJSON(apiUrl, {domain: toSearch, lang: lang}, function (data) {
        if (data.error) {
          window.router.navigate("/", {trigger: true});
          $("#alert")
            .show()
            .find(".alert-msg").text(data.error);
          $("#search-text").val(toSearch);
          $("#search-lang").val(lang);
        }
        else if (window.isEmpty(data.pages)) {
          window.router.navigate("/", {trigger: true});
          $("#alert-warning")
            .show()
            .find(".alert-msg").text("No results found for domain " + toSearch);
          $("#search-text").val(toSearch);
          $("#search-lang").val(lang);
        }
        else
          window.searchView.render(lang, toSearch, data);
        window.hideLoading();
      });
    },
    help: function () {
      alert(1);
    }
});

window.router = new AppRouter();
Backbone.history.start();
