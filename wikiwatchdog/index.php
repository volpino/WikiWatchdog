<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>WikiWatchdog</title>
    <link href="static/stylesheets/bootstrap.min.css" rel="stylesheet">
    <link href="static/stylesheets/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="static/stylesheets/font-awesome.css" rel="stylesheet">
    <link href="static/stylesheets/diff.css" rel="stylesheet">
    <link href="static/stylesheets/style.css" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Federico 'fox' Scrinzi">
    <meta name="description" content="WikiWatchdog - Uncover organizations editing Wikipedia anonymously">
    <meta name="keywords" content="wiki,wikipedia,watchdog,wikiwatchdog,uncover,unveil,discover,edit,anonymous,research,organization,scanner,fbk,sonet,fox,volpino,federico,scrinzi,paolo,massa,phauly,gnuband">

    <script>var switchTo5x=true;</script>
    <script src="http://w.sharethis.com/button/buttons.js"></script>
    <script src="http://s.sharethis.com/loader.js"></script>
  </head>

  <body>

    <?php
      if (isset($_GET["_escaped_fragment_"])) {
        $param = $_GET["_escaped_fragment_"];
        preg_match('/search\/([^\/]+)\/([^\/]+)(\/.*)?/', $param, $matches);
        $content = file_get_contents('http://toolserver.org/~sonet/cgi-bin/watchdog.py?lang='.$matches[1].'&domain='.$matches[2]);
        $json = json_decode($content);
        echo "<ul>";
        foreach ($json->pages as $page) {
          echo "<li>".$page->title."</li>";
        }
        echo "</ul>";
      }
    ?>

    <div class="container-fluid">
      <div id="content">
      </div>

      <hr>

      <footer class="center">
        <p>
          <!--[if lte IE 8]><span style="filter: FlipH; -ms-filter: "FlipH"; display: inline-block;"><![endif]-->
          <span style="-moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); transform: scaleX(-1); display: inline-block;">
            &copy;
          </span>
          <!--[if lte IE 8]></span><![endif]-->
          <a href="http://volpino.github.com">Federico "fox" Scrinzi</a> and <a href="http://gnuband.org">Paolo Massa</a> of <a href="http://sonet.fbk.eu">SoNet@FBK</a>. We <i class="icon-heart-empty"></i> but are not affiliated with Wikipedia. WikiWatchdog is <a href="https://github.com/volpino/WikiWatchdog">free software!</a>.
        </p>
        <p>Powered by <a href="http://toolserver.org">Wikimedia Toolserver</a></p>
      </footer>
    </div>

    <div id="loading" class="hide">
      <div class="whole-page">
        <div id="spin">
          <h3 class="libertine center margin-top60">Your query is running... This may take a while</h3>
        </div>
      </div>
    </div>

    <script type="text/template" id="home-template">
      <div class="row-fluid margin-top80">
        <div class="span2">
        </div>
        <div class="span8">
          <div class="well well-white">
            <h1 class="font42 libertine center">
              <a class="no-style" href="#">
                WikiWatchdog
                <small class="font20">
                  <br>
                  Uncover organizations editing Wikipedia anonymously
                </small>
              </a>
            </h1>

            <form id="search-form" class="font17 form-inline center margin-top30">
              Search edits by
              <input placeholder="a domain name (e.g.: fbk.eu) or an IP" id="search-text" type="text" class="input-xlarge">
              on the
              <select class="input-medium" id="search-lang">
                <% for (lang in wiki_lang) { %>
                  <option value="<%= lang %>" <% if (lang === "en") { %>selected="selected"<% } %>>
                    <%= wiki_lang[lang] %> Wikipedia
                  </option>
                <% } %>
              </select>
              <input id="search-button" type="submit" class="btn margin-left10" value="Search">
            </form>

            <div class="center">
              <i>Suggested:</i>
              <a href="#!search/en/in.parliament.uk">parliament.uk</a> ~
              <a href="#!search/en/cia.gov">cia.gov</a> ~
              <a href="#!search/en/vatican.va">vatican.va</a> ~
              <a href="#!search/en/stanford.edu">stanford.edu</a>
            </div>

            <div id="alert" class="alert alert-error hide">
              <strong>Error!</strong> <span class="alert-msg"></span>
            </div>

            <div id="alert-warning" class="alert hide">
              <strong>We're sorry!</strong> <span class="alert-msg"></span>
            </div>

          </div>
        </div>
      </div>

      <hr>

      <div class="row-fluid">
        <div class="span4">
          <h4 class="libertine">Authors</h4>
            <img class="img-author pull-right" src="static/img/fox.jpg">
            <a href="http://volpino.github.com">Federico Scrinzi</a> is a developer and researcher at <a href="http://fbk.eu">FBK</a> (Trento, Italy).
            He's really active in the open source world and he's interested in web applications, social media, transparency, geeky stuff and the Rubik's cube.
            <a href="http://gnuband.org"><img class="img-author pull-left" src="static/img/phauly.jpg"></a>
            <br><br>
            <a href="http://gnuband.org">Paolo Massa</a> is a researcher at <a href="http://fbk.eu">FBK</a>.
            His research interests are trust and reputation, social networking and online communities, gift economies and of course Wikipedia.
        </div>

        <div class="span4">
          <h4 class="libertine">What's WikiWatchdog?</h4>
          <span class="home-icon pull-left">
            <i class="icon-globe"></i>
          </span>

          WikiWatchdog uncovers anonymous edits made by organizations on Wikipedia.
          It aims at revealing hidden aspects of Wikipedia articles and improving transparency.
          <br/>
          On WikiWatchdog you:
          <ol>
            <li>enter the web address of an organization (e.g. cia.gov, vatican.va or stanford.edu)</li>
            <li>see Wikipedia pages edited anonymously from computers belonging to this organization.</li>
          </ol>
        </div>

        <div class="span4">
          <h4 class="libertine">Free and Open source API</h4>
          WikiWatchdog retireves data from <a href="http://toolserver.org">WikiMedia ToolServer</a> and <a href="http://en.wikipedia.org/w/api.php">Wikipedia</a>
          through a simple API that can be used freely (as in free beer) by everyone!
          <span class="home-icon pull-left">
            <i class="icon-cloud"></i>
          </span>
          We encourage the spreading of new applications based on this piece of software and futher development of the WikiWatchdog API (so ask for new features or <a href="http://github.com/volpino/WikiWatchdog">fork it on Github!</a>).
          <br>
          All the data available on WikiWatchdog is released under the terms of the <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike</a> license.
          <br>
          <a class="api-modal-open" href="#">More info...</a>
        </div>
      </div>

      <div id="api-modal" class="modal hide fade">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3>WikiWatchdog API</h3>
        </div>
        <div class="modal-body">
          <p>
          WikiWatchdog API is reachable from <a href="http://toolserver.org/~sonet/cgi-bin/watchdog.py">http://toolserver.org/~sonet/cgi-bin/watchdog.py</a>
          (yes it's a CGI but that's the only way of running Python on Toolserver).
          </p>

          <h4>
            How does it work?
          </h4>
          <p>
            The operations performed by the WikiWatchdog API can be summarized as follows:
            <ol>
              <li>A domain or an ip address is given (in the case of a domain it is resolved into an IP)</li>
              <li>The IP range of which the given IP belongs is retrieved (unless the "norange" option is specified. See "Available options")</li>
              <li>A query is ran on the ToolServer database to get all anonymous edits from IPs in that range. (As a default the query is ran on the English Wikipedia but a different source can be specified)</li>
              <li>The query result is grouped by page, sorted and outputted as JSON</li>
            </ol>
          </p>

          <h4>
            WikiWatchdog API examples:
          </h4>
          <ul>
            <li>
              <a href="http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu">
                http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu
              </a><br>
              Get all anonymous edits on the English Wikipedia from IPs belonging to the same IP range as fbk.eu
            </li>
            <li>
              <a href="http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu&page_limit=10">
                http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu&page_limit=10
              </a><br>
              Same as above but limit the results at 10
            </li>
            <li>
              <a href="http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu&page_limit=10&page_offset=10">
                http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=fbk.eu&page_limit=10&page_offset=10
              </a><br>
              Same as above but get the next 10 results
            </li>
            <li>
              <a href="http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=vatican.va&lang=it">
                http://toolserver.org/~sonet/cgi-bin/watchdog.py?domain=vatican.va&lang=it
              </a><br>
              Get all anonymous edits on the Italian Wikipedia from IPs belonging to the same IP range as vatican.va
            </li>
          </ul>

          <h4>Available options</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Option</th>
                <th>Description</th>
              </tr>
            </thead>
            <tr>
              <td>ip</td>
              <td>IP input</td>
            </tr>
            <tr>
              <td>domain</td>
              <td>Domain input</td>
            </tr>
            <tr>
              <td>lang</td>
              <td>Wikipedia language (e.g.: "en" for en.wikipedia.org) (Default: "en")</td>
            </tr>
            <tr>
              <td>nocache</td>
              <td>Don't use cache (the query may take very long)</td>
            </tr>
            <tr>
              <td>norange</td>
              <td>If it's set it doesn't search in the whole IP range of the given IP or domain but performs an exact match</td>
            </tr>
            <tr>
              <td>page_limit</td>
              <td>Outputs at most &lt;page_limit&gt; results</td>
            </tr>
            <tr>
              <td>page_offset</td>
              <td>Start displaying pages from the &lt;page_offset&gt;th</td>
            </tr>
            <tr>
              <td>callback</td>
              <td>Callback for JSONP requests</td>
            </tr>
          </table>

        </div>
        <div class="modal-footer">
        </div>
    </div>

    </script>

    <script type="text/template" id="search-template">
      <h2 class="libertine"><a class="no-style" href="#">WikiWatchdog</a></h2>
      <form id="search-form" class="form-inline">
        <input id="search-text" type="text" class="nomargin" value="<%= toSearch %>">
        on the
        <select class="input-medium" id="search-lang">
          <% for (l in wiki_lang) { %>
            <option value="<%= l %>" <% if (l === lang) { %>selected="selected"<% } %>>
              <%= wiki_lang[l] %> Wikipedia
            </option>
          <% } %>
        </select>
        <input id="search-button" type="submit" class="btn nomargin margin-left10" value="Search">
      </form>
      <div class="clearfix"></div>

      <hr>

      <h3 class="libertine center">
        Articles edited anonymously by
        <%= toSearch %>
        on the
        <%= wiki_lang[lang] %> Wikipedia
      </h3>

      <div id="domain-box" class="well hidden-phone hidden">
        <span class="pull-right" id="domain-logo"></span>
        <p>
          <strong id="domain-title"></strong><strong>:</strong>
          <span id="domain-summary"></span>
        </p>
      </div>

      <p class="small">
        <%= stats.pages %> articles
        - Query executed in <%= Math.round(stats.execution_time * 100) / 100 %> sec.
      </p>

      <div class="row-fluid" id="top-anchor">
        <div class="span4">
          <ul class="page-list nav nav-tabs nav-stacked">
          </ul>
        </div>

        <div class="span8 height100" id="diff-area">
        </div>
      </div>
    </script>

    <script type="text/template" id="page-list-template">
      <% for (var i=0; i<pages.length; i++) { %>
        <% var edits = pages[i].edits; %>
        <% var title = pages[i].title; %>
        <li>
          <a class="page-title"
             id="page-<%= pages[i].id %>"
             data-page="<%= title %>"
             data-page-id="<%= pages[i].id %>"
             data-lang="<%= lang %>"
             href="#"
             target="_blank">

            <i class="icon-chevron-down pull-right"></i>
            <i style="display: none;" class="icon-chevron-up pull-right"></i>

            <%= window.prettyTitle(title) %>
            <p class="small">
              (<%= edits.length %>
              edit<% if (edits.length > 1) { %>s<% } %>)
            </p>
          </a>
          <ul class="edit-list well well-white hide">
            <% for (var j=0; j<edits.length; j++) { %>
              <% var edit = edits[j]; %>
              <li class="edit-item-li">
                <a class="edit-item"
                   id="revid-<%= edit.id %>"
                   data-revid="<%= edit.id %>"
                   data-timestamp="<%= edit.timestamp %>"
                   data-ip="<%= edit.ip %>"
                   data-domain="<%= edit.domain %>"
                   data-comment="<%= edit.comment %>"ent="<%= edit.comment %>"
                   href="#">
                   edit on <%= window.prettyTimestamp(edit.timestamp) %>
                </a>
                <p class="small">
                  by <%= edit.ip %>
                  <% if (edit.domain) { %>
                    (<%= edit.domain %>)
                  <% } %>
                </p>
              </li>
            <% } %>
          </ul>
        </li>
      <% } %>
      <li>
        <span class="load-more btn center visible-phone">Load more...</span>
      </li>
    </script>

    <script type="text/template" id="diff-clear-template">
      <div class="block" style="height: 350px;">
        <div class="centered">
          <h5>
            Please, select an article from the list
          </h5>
        </div>
      </div>
    </script>

    <script type="text/template" id="diff-template">
      <h3>
        <%= prettyTitle(page) %>

        <a class="visible-phone font13" id="go-to-top" href="#top-anchor" data-to-top="#page-<%= pageId %>">Back to edit list ↑</a>

        <span class="wikilinks hidden-phone pull-right">
          <a href="http://<%= lang %>.wikipedia.org/wiki/<%= page %>" target="_blank" rel="tooltip" title="Read on Wikipedia" class="libertine">W</a>
          ~
          <a href="http://manypedia.com/#|<%= lang %>|<%= page %>" target="_blank" rel="tooltip" title="Compare on Manypedia" class="libertine">M</a>
          ~
          <a href="http://sonetlab.fbk.eu/wikitrip/#|<%= lang %>|<%= page %>" target="_blank" rel="tooltip" title="History on WikiTrip" class="libertine">T</a>
        </span>
      </h3>

      <hr>

      <% if (error) { %>
        <div class="alert alert-error">
          <p><strong>Error</strong> while retrieveng diff information. Probably the revision was deleted.</p>
        </div>
      <% } else if (diff === "") { %>
        <p id="article-intro"></p>
      <% } else { %>

        <div>
          <a rel="tooltip" title="See edit on Wikipedia" target="_blank"
             href="http://<%= lang %>.wikipedia.org/w/index.php?title=<%= page %>&oldid=<%= edit.revid %>&diff=prev">
            edit on
            <%= prettyTimestamp(edit.timestamp) %>
            by
            <%= edit.ip %> <% if (edit.domain) { %>(<%= edit.domain %>)<% } %>
          </a>
        </div>
        <% if (edit.comment) { %>
          <p>Edit comment: <em><%= edit.comment %></em></p>
        <% } %>
      <% } %>

      <hr>

      <table class="diff diff-contentalign-left">
        <colgroup><col class="diff-marker">
          <col class="diff-content">
          <col class="diff-marker">
          <col class="diff-content">
        </colgroup><tbody>
        <tbody id="diff-area">
          <% if (diff) { %>
            <tr>
              <td class="diff-lineno" colspan="2">Page before the edit</td>
              <td class="diff-lineno" colspan="2">Page after the edit</td>
            </tr>
            <%= diff %>
          <% } %>
        </tbody>
      </table>
    </script>

    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="static/javascripts/bootstrap.min.js"></script>

    <script src="static/javascripts/underscore-min.js"></script>
    <script src="static/javascripts/backbone-min.js"></script>

    <script src="static/javascripts/spin.min.js"></script>

    <script>stLight.options({publisher:"ur-b13ddc3b-b206-293b-f875-d0fe3f89287e"});</script>
    <script>var options={"publisher": "ur-b13ddc3b-b206-293b-f875-d0fe3f89287e","position": "right", "ad": { "visible": false, "openDelay": 5,"closeDelay": 0}, "chicklets": { "items": ["facebook", "twitter"]}};var st_hover_widget = new sharethis.widgets.hoverbuttons(options);</script>

    <script>
      // Ugly hack to tweak sharethis
      $(document).bind("DOMSubtreeModified", function() { $(".st_twitter_large").attr("st_via", "WikiWatchdog") });
    </script>

    <script>
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-56174-30']);
      _gaq.push(['_trackPageview']);

      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>

    <script src="static/javascripts/wiki_langs.js"></script>
    <script src="static/javascripts/wikipedia.js"></script>
    <script src="static/javascripts/wiki_logo.js"></script>

    <script src="static/javascripts/wikiwatchdog.js"></script>

    <script src="static/javascripts/views.js"></script>
    <script src="static/javascripts/routes.js"></script>

    <noscript>
      <div class="whole-page">
        <div class="block height100">
          <h1 class="libertine centered">
            Please enable JavaScript!
          </h1>
        </div>
      </div>
    </noscript>

  </body>
</html>
