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
        diffData.edit = {ip: ip, domain: domain, timestamp: timestamp}
        window.diffView.render(diffData);
      }
    })

    e.preventDefault();
    e.stopPropagation();
  })
});
