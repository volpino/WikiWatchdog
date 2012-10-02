$(function () {
  $(".page-title").live("click", function (e) {
    var editList = $(this).siblings(".edit-list")
      , page = $(this).data("page");

    if (editList.is(":visible")) {
      window.diffView.clear();
      editList.slideUp();
    }
    else {
      window.diffView.render({page: page, diff: "", error: false, edit: ""});
      editList.slideDown();
    }

    e.preventDefault();
    e.stopPropagation();
  });

  $(".edit-item").live("click", function (e) {
    var revId = $(this).data("revid")
      , page = $(this).closest(".edit-list").siblings(".page-title").data("page")
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

    $.getJSON("http://en.wikipedia.org/w/api.php?callback=?", opts, function (data) {
      for (pageId in data.query.pages) {
        var diffData = {}
          , revData = data.query.pages[pageId].revisions[0];
        if (!revData.diff.from)
          diffData.error = true;
        else
          diffData.error = false;

        diffData.diff = revData.diff["*"];
        diffData.page = page;
        diffData.edit = {ip: ip, domain: domain, timestamp: timestamp, comment: comment}
        window.diffView.render(diffData);
      }
    })

    e.preventDefault();
    e.stopPropagation();
  })
});


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
}
