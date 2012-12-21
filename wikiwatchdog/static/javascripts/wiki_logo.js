window.getDomainLogo = function (domain, cb, fail) {
  getWikipediaURL(domain, function (url) {
    if (url) {
      console.log(url);
      window.WIKIPEDIA.getData(url, function (info) {
        cb(info.summary.image, info.summary.title, info.summary.summary);
      });
    }
    else if (fail) {
      fail();
    }
  });
}

window.getWikipediaURL = function (domain, cb) {
  var opts = {action: "query",
              titles: domain,
              redirects: 1,
              format: "json"}
  $.getJSON("http://en.wikipedia.org/w/api.php?callback=?", opts, function (data) {
    var wikipedia_url, page;
    if (data.query && data.query.pages) {
      console.log(data)
      for (key in data.query.pages) {
        console.log(key);
        if (key != "-1") {
          page = data.query.pages[key].title
          page = page.replace(/\s/g, "_");
          wikipedia_url = "http://en.wikipedia.org/wiki/" + page;
          break;
        }
      }
    }
    cb(wikipedia_url);
  });
}
