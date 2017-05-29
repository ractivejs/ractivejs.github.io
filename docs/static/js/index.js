$(function () {

  var isPlaygroundOpen = false;
  var main = $('.main');
  var sideBarContainer = $('.main__sidebar-container');
  var contentContainer = $('.main__content-container');
  var playgroundToggle = $('.playground-toggle');
  var fullscreenToggle = $('.playground-fullscreen');
  var fullscreenClose = $('.playground-container .close-fullscreen');
  var playgroundContainer = $('.playground-container');
  var buildFrame = frameBuilder();

  var mobileToggles = $('input.menu-toggle')

  function frameBuilder(){
    var promise = null;
    var frame = null;

    return function(){
      return promise || (promise = $.Deferred(function(deferred){
        $('<iframe class="playground-frame" src="/playground/?env=docs">')
          .on('load', function(){ deferred.resolve(this); })
          .on('error', function(error){ deferred.reject(error); })
          .appendTo(playgroundContainer)
      }).promise());
    }
  }

  function openPlayground() {
    isPlaygroundOpen = true;
    main.addClass('main--split');
    sideBarContainer.addClass('main__sidebar-container--hidden');
    contentContainer.removeClass('pure-u-md-3-4');
    playgroundContainer.addClass('playground-container--open');
    playgroundToggle.addClass('playground-toggle--open');
  }

  function closePlayground() {
    isPlaygroundOpen = false;
    main.removeClass('main--split');
    sideBarContainer.removeClass('main__sidebar-container--hidden');
    contentContainer.addClass('pure-u-md-3-4');
    playgroundContainer.removeClass('playground-container--open');
    playgroundToggle.removeClass('playground-toggle--open');
  }

  function getDemoBlockData(el) {
    return {
      code: el.getAttribute('data-playground') || el.getAttribute('data-tutorial') || el.getAttribute('data-runtutorial'),
      tab: el.getAttribute('data-tab'),
      run: el.getAttribute('data-run'),
      eval: el.getAttribute('data-eval'),
    };
  }

  playgroundToggle.on('click', function () {
    var action = isPlaygroundOpen ? closePlayground : openPlayground;
    var result = action.call(null);
    var promise = buildFrame();
  });

  fullscreenToggle.on('click', function () {
    playgroundContainer.addClass('playground-container--fullscreen');
    return false;
  });

  fullscreenClose.on('click', function () {
    playgroundContainer.removeClass('playground-container--fullscreen');
  });

  document.body.addEventListener('click', function (event) {
    var menu = false;

    mobileToggles.each(function(i, e) {
      if (e.checked) menu = true;
    });

    if (menu) {
      mobileToggles.each(function(i, e) {
        if (event.target !== e && event.target.tagName !== 'LABEL' && event.target.control !== e) e.checked = false;
      });
    }
  });

  // Attach "Run It" link
  $('[data-playground], [data-runtutorial]').each(function (i, demoBlock) {
    var pre = $(demoBlock).nextAll("pre:first");
    var data = getDemoBlockData(demoBlock);

    $('<button type="button" class="run-it">Run It</button>')
      .appendTo(pre)
      .on('click', function(){
        var promise = buildFrame().then(function(frame){
          frame.contentWindow.postMessage(data, '*');
          openPlayground();
        })
      })
  });

  // Special case for data-tutorial since the data... is also the button.
  $('[data-tutorial]').on('click', function(event){
    buildFrame().then(function(frame){
      frame.contentWindow.postMessage(getDemoBlockData(event.target), '*');
      var delay = isPlaygroundOpen ? 0 : 500;
      openPlayground();

      // get the offset when the delay is up to avoid weird endpoint
      setTimeout(function() {
        $("html, body")
          .animate({ scrollTop: $(event.target).offset().top - 50 });
      }, delay);
    });
  });

});
