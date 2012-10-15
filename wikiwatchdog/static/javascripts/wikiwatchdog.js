$(function () {
  $("#go-to-top").live("click", function (e) {
    $(window).scrollTop($("#top-anchor").offset().top);
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  $(".page-title").live("click", function (e) {
    var $this = $(this)
      , editList = $(this).siblings(".edit-list")
      , page = $(this).data("page")
      , pageId = $(this).data("page-id")
      , lang = $(this).data("lang")
      , opts;

    if (editList.is(":visible")) {
      window.diffView.clear();
      editList.slideUp();

      $this.find(".icon-chevron-down").show();
      $this.find(".icon-chevron-up").hide();

      window.router.navigate("!search/" + lang + "/" + window.toSearch, {trigger: false});
    }
    else {
      window.router.navigate("!search/" + lang + "/" + encodeURI(window.toSearch) + "/" + pageId, {trigger: false});

      window.diffView.render(
        {page: page, diff: "", error: false, edit: "", lang: lang}
      );


      $(".edit-list:visible").hide(0);

      editList.slideDown("normal", function () {
        var $pageList = $(".page-list");
        if ($pageList.css("max-height") !== "none") {  // is not mobile
          if (!window.isVisibleOverflow($this, $pageList)) {
            $pageList.scrollTop($pageList.scrollTop() + $this.position().top - 192);
          }
        }
        else {
          if (!window.isVisible($this, $pageList)) {
            $(window).scrollTop($this.offset().top);
          }
        }
      });

      $(this).find(".icon-chevron-down").hide();
      $(this).find(".icon-chevron-up").show();

      opts = {
        action: "query",
        prop: "extracts",
        exsentences: 5,
        explaintext: true,
        titles: page,
        format: "json"
      };
      $.getJSON("http://" + lang + ".wikipedia.org/w/api.php?callback=?", opts, function (data) {
        var intro
          , pages = data.query.pages
        for (p in pages) {
          intro = pages[p].extract;
        }
        $("#article-intro").text(intro);
        $("#article-link").show();
      });
    }

    e.preventDefault();
    e.stopPropagation();
  });

  $(".edit-item").live("click", function (e) {
    var revId = $(this).data("revid")
      , $pageTitle = $(this).closest(".edit-list").siblings(".page-title")
      , page = $pageTitle.data("page")
      , pageId = $pageTitle.data("page-id")
      , lang = $pageTitle.data("lang")
      , ip = $(this).data("ip")
      , domain = $(this).data("domain")
      , timestamp = $(this).data("timestamp")
      , comment = $(this).data("comment")
      , opts = {
        action: "query",
        prop: "revisions",
        revids: revId,
        rvdiffto: "prev",
        format: "json"
      };

    $.getJSON("http://" + lang + ".wikipedia.org/w/api.php?callback=?", opts, function (data) {
      for (pageId in data.query.pages) {
        var diffData = {}
          , revData = data.query.pages[pageId].revisions[0];
        if (!revData.diff.from)
          diffData.error = true;
        else
          diffData.error = false;

        diffData.diff = revData.diff["*"];
        diffData.page = page;
        diffData.lang = lang;
        diffData.edit = {
          revid: revId,
          ip: ip,
          domain: domain,
          timestamp: timestamp,
          comment: comment,
        }
        window.diffView.render(diffData);
      }

      if (!isVisible($("#diff-area").find("h3").eq(0))) {
        // for mobile scroll to content
        $(window).scrollTop($("#diff-area").offset().top);
      }
    })

    window.router.navigate("!search/" + lang + "/" + window.toSearch + "/" + pageId + "/" + revId, {trigger: false});

    e.preventDefault();
    e.stopPropagation();
  });
});

var opts = {
  lines: 9, // The number of lines to draw
  length: 30, // The length of each line
  width: 11, // The line thickness
  radius: 31, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: true, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
window.spinner = new Spinner(opts);

window.showLoading = function () {
  $("#loading").fadeIn();
  window.spinner.spin($("#spin")[0]);
};

window.hideLoading = function () {
  $("#loading").fadeOut();
};

window.prettyTimestamp = function (ts) {
  var ts = ts + ""
    , year = ts.slice(0, 4)
    , month = ts.slice(4, 6)
    , day = ts.slice(6, 8)
    , hour = ts.slice(8, 10)
    , minutes = ts.slice(10, 12)
    , seconds = ts.slice(12, 14);
  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
};

window.prettyTitle = function (title) {
  return title.replace(/_/g, " ");
};

window.isVisibleOverflow = function ($element, $scrollable) {
  var docViewTop = $scrollable.scrollTop()
    , docViewBottom = docViewTop + $scrollable.height()
    , elemTop = docViewTop + $element.position().top
    , elemBottom = elemTop + $element.height();
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};

window.isVisible = function ($element) {
  var docViewTop = $(window).scrollTop()
    , docViewBottom = docViewTop + $(window).height()
    , elemTop = $element.offset().top
    , elemBottom = elemTop + $element.height();
  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
};

window.isIP = function (string) {
  return string.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/);
};
