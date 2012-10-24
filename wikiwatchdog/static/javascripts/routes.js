var AppRouter = Backbone.Router.extend({
    initialize: function () {
      this.bind("all", this._trackPageview);
    },
    routes: {
      "!search/:lang/:toSearch/:page/:revid": "search",
      "!search/:lang/:toSearch/:page": "search",
      "!search/:lang/:toSearch": "search",
      "*action": "home"
    },
    _trackPageview: function () {
      var url = Backbone.history.getFragment();
      _gaq.push(['_trackPageview', "/#" + url]);
    },
    home: function () {
      window.homeView.render();
    },
    search: function (lang, toSearch, page, revid) {
      var opts;

      lang = escape(lang);
      toSearch = escape(toSearch);

      opts = {domain: toSearch, lang: lang, page_limit: window.apiPageLimit};

      // if the given domain is an ip don't look for its range,
      // make an exact match query
      if (window.isIP(toSearch))
        opts["norange"] = 1;

      window.showLoading();
      $.ajax({
        url: window.apiUrl,
        dataType: "json",
        data: opts,
        cache: true,
        success: function (data) {
          if (data.error) {
            window.router.navigate("/", {trigger: true});
            $("#alert")
              .show()
              .find(".alert-msg").text(data.error);
            $("#search-text").val(toSearch);
            $("#search-lang").val(lang);
          }
          else if (data.pages.length === 0) {
            window.router.navigate("/", {trigger: true});
            $("#alert-warning")
              .show()
              .find(".alert-msg").text("No results found for domain " + toSearch);
            $("#search-text").val(toSearch);
            $("#search-lang").val(lang);
          }
          else {
            window.toSearch = toSearch;
            window.searchView.render(lang, toSearch, data);
          }
          window.hideLoading();

          if (page)
            window.findPage(page, revid);
        },
        timeout: 20000,
        error: function (xhr, status) {
          if (status === "timeout") {
            window.router.navigate("/", {trigger: true});
              $("#alert-warning")
                .show()
                .find(".alert-msg").text("Looks like the query is taking too long. We received your submission, please retry in a few minutes");
              $("#search-text").val(toSearch);
              $("#search-lang").val(lang);
            window.hideLoading();
          }
        }
      });
    }
});

window.router = new AppRouter();
Backbone.history.start();
