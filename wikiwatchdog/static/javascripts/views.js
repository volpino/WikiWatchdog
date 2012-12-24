var HomeView = Backbone.View.extend({
  template: _.template($('#home-template').html()),
  el: "#content",

  render: function () {
    $(this.el).html(this.template());
    $("#search-text").focus();
    return this;
  },

  events: {
    "submit #search-form": "search"
  },

  search: function () {
    var toSearch = $("#search-text").val()
      , lang = $("#search-lang").val();

    window.router.navigate("!search/" + lang + "/" + toSearch, {trigger: true});
    return this
  }
});


var SearchView = Backbone.View.extend({
  template: _.template($('#search-template').html()),
  pageListTemplate: _.template($('#page-list-template').html()),
  el: "#content",
  isLoading: false,
  scrollOffset: window.apiPageLimit,

  render: function (lang, toSearch, data) {
    var self = this
      , json_data = data
      , $pageList;

    this.lang = lang;
    this.toSearch = toSearch;
    this.isLoading = false;
    this.scrollOffset = window.apiPageLimit;

    json_data.toSearch = toSearch;
    json_data.lang = lang;
    json_data.total_edits = 0;
    $.each(data.pages, function () {
      json_data.total_edits += this.edits.length;
    });

    $(this.el).html(this.template(json_data));
    $pageList = $(this.el).find(".page-list")

    $pageList.html(this.pageListTemplate(json_data));
    $pageList.on("scroll", function () { self.scroll() });

    window.diffView.clear();
    return this;
  },

  events: {
    "submit #search-form": "search",
    "click .load-more": "loadMore"
  },

  search: function () {
    var toSearch = $("#search-text").val()
      , lang = $("#search-lang").val();

    window.router.navigate("!search/" + lang + "/" + toSearch, {trigger: true});
    return this
  },

  scroll: function () {
    // Note: This method is not called on mobile devices
    var self = this
      , $pageList = $(this.el).find(".page-list")
      , $scrollLoading
      , triggerPoint = 200
      , opts
      , checkHeight = $pageList.scrollTop() + $pageList.height() + triggerPoint;

    if (!this.isLoading && (checkHeight > $pageList[0].scrollHeight)) {
      this.isLoading = true;

      $scrollLoading = $("<li/>")
        .addClass("scroll-loading")
        .addClass("center")
        .html("<img src='static/img/loading.gif' alt='Loading...'>");
      $pageList.append($scrollLoading);

      opts = {domain: this.toSearch,
              lang: this.lang,
              page_limit: window.apiPageLimit,
              page_offset: this.scrollOffset};
      if (window.isIP(this.toSearch))
        opts["norange"] = 1;

      this.scrollOffset += window.apiPageLimit;
      $.getJSON(window.apiUrl, opts, function (data) {
        var json_data = {"pages": data.pages, "lang": self.lang};
        $pageList.append(self.pageListTemplate(json_data));

        $pageList.find(".scroll-loading").remove();

        // if is data.pages is empty prevent other loads
        if (data.pages.length !== 0)
          self.isLoading = false;
      });
    }
  },

  loadMore: function (e) {
    // Note: this method is only for mobile devices
    var self = this
      , $pageList = $(this.el).find(".page-list")
      , $target = $(e.target)
      , opts = {domain: this.toSearch,
            lang: this.lang,
            page_limit: window.apiPageLimit,
            page_offset: this.scrollOffset};
      if (window.isIP(this.toSearch))
        opts["norange"] = 1;

    $target.html("<img src='static/img/loading.gif' alt='Loading...'>");

    this.scrollOffset += window.apiPageLimit;
    $.getJSON(window.apiUrl, opts, function (data) {
      var json_data;
      if (data.pages.length !== 0) {
        json_data = {"pages": data.pages, "lang": self.lang};
        $pageList.append(self.pageListTemplate(json_data));
        $pageList.trigger("scroll-loaded");
      }
      $target.remove();
    });
  }
});


var DiffView = Backbone.View.extend({
  template: _.template($('#diff-template').html()),
  templateClear: _.template($('#diff-clear-template').html()),

  render: function (data) {
    $("#diff-area").html(this.template(data));
    $("[rel=tooltip]").tooltip();
    $("#diff-area").removeClass("hidden-phone");
    if (window.twttr)
      window.twttr.widgets.load();
    if (window.FB)
      window.FB.XFBML.parse();
    return this;
  },

  clear: function () {
    $("#diff-area").html(this.templateClear());
    $("#diff-area").addClass("hidden-phone");
    $(".edit-selected").removeClass("edit-selected");
    return this;
  }
});

window.homeView = new HomeView();
window.searchView = new SearchView();
window.diffView = new DiffView();
