$(function() {

  // First we set up our trackers:
  // - Google Analytics
  // - Marketo (Munchkin)

  // Taken from:
  // http://www.marcusoft.net/2015/05/how-to-get-google-analytics-to-work-for-your-single-page-application.html
  function gaTrack(path, title) {
    var track =  { page: path, title: title};
    ga = window.ga;
    ga('set', track);
    ga('send', 'pageview');
  }

  // Modified from:
  // http://developers.marketo.com/blog/single-page-application-web-tracking-with-munchkin/
  // GA and Marketo don't recognize clicking on our tabs, so we have to manually track it
  $(".page-tabs a").on('click', function(event) {
      var urlThatWasClicked = $(this).attr('href');
      var location = $(this).attr('data-location');
      var link = location + urlThatWasClicked;
      var title = $(this).find('.media-heading').first().text();
      Munchkin.munchkinFunction('clickLink', { href: link });
      gaTrack(link, title);
  });


  // For the careers page, fetch Lever job openings
  if (window.location.href.indexOf('careers') > -1) {
    var url = 'https://api.lever.co/v0/postings/datafox?mode=json&group=team';

    function createJobsHtml(_data) {

      var html = '';
      var jobGroup, groupLabel, postings;
      for(var i = 0; i < _data.length; i++) {
        jobGroup = _data[i];
        groupLabel = jobGroup.title;
        postings = jobGroup.postings;

        html += '<div class="job-group">' + '<h3>' + groupLabel + '</h3>';

        var posting, title, description, shortDescription, location, commitment, team, link;

        for(var j = 0; j < postings.length; j++) {
          posting = postings[j];
          title = posting.text;
          description = posting.description;
          // Making each job description shorter than 250 characters
          shortDescription = $.trim(description).substring(0, 250).replace('\n', ' ') + "...";
          location = posting.categories.location;
          commitment = posting.categories.commitment;
          team = posting.categories.team;
          link = posting.hostedUrl;

          html += '' +
            '<div class="job">' +
              '<div class="pull-right pll"><a href="' + link + '" class="btn btn-primary btn-full">View</a></div>' +
              '<h4 class="job-title" href="'+link+'"">'+title+'</h4>' +
              '<ul class="list-inline job-tags"><li>'+location+'</li><li>'+commitment+'</li></ul>' +
            '</div>';
        }

        html += '</div>';
      }

      $('.job-openings').append(html);
    }

    //- Fetching job postings from Lever's postings API
    $.ajax({
      dataType: "json",
      url: url,
      success: function(data){
        $('.loading-icon').hide();
        createJobsHtml(data);
      }
    });
  }

  // @TODO(sam): removing this for now til it works nicely
  // enable linking directly to a specific bootstrap tab on a page
  // Javascript to enable link to tab

  var queryParams = (function(a) {
    if (a == "") {
      return {};
    }
    var b = {};
    // reject any strings that are not clearly valid _ids or names
    var sanitize = function(str) {
      return /^[a-zA-Z0-9\-+]*$/.test(str) ? str : undefined;
    };
    for (var i = 0; i < a.length; ++i)
    {
        var p = a[i].split('=', 2);
        if (p.length == 1) {
          b[p[0]] = "";
        } else {
          b[p[0]] = sanitize(decodeURIComponent(p[1].replace(/\+/g, " ")));
        }
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  if (queryParams.tab) {
    $('.nav-tabs a[href="#' + queryParams.tab + '"]').tab('show');
  }

  // taken from https://jsfiddle.net/livibetter/HV9HM/
  function stickyRelocate() {
    var windowTop = $(window).scrollTop();
    //Controll navbar background. If you scroll down, the navbar background would appear.
    if(windowTop > 0) {
      $('.main-nav').addClass('navbar-default-header');
    }else{
      $('.main-nav').removeClass('navbar-default-header');
    }

    stickyAnchor = $('.sticky-anchor');
    if (stickyAnchor.length === 0) {
      return;
    }
    var anchorTop = $('.sticky-anchor').offset().top;
    var navbarHeight = $('.navbar').height();
    if (windowTop - navbarHeight > anchorTop) {
      $('.sticky').addClass('stuck');
      $('.sticky-anchor').height($('.sticky').outerHeight());
    } else {
      $('.sticky').removeClass('stuck');
      $('.sticky-anchor').height(0);
    }
  }

  $(function() {
    $(window).scroll(stickyRelocate);
    stickyRelocate();
  });

});