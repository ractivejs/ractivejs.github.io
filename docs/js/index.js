var playground = (function() {
  var main = document.querySelector('#main');
  var div = document.createElement('div');
  div.id = 'playground-div';
  div.setAttribute('class', 'min');
  main.classList.add('max');

  // buttons
  var down = document.createElement('span');
  down.innerHTML = '\u25bc';
  down.setAttribute('class', 'down-btn');
  down.setAttribute('id', 'collapse-playground');
  down.addEventListener('click', function() {
    if (div.classList.contains('mid')) {
      div.classList.remove('mid');
      div.classList.add('min');
      main.classList.add('max');
      main.classList.remove('mid');
    } else if (div.classList.contains('max')) {
      div.classList.remove('max');
      div.classList.add('mid');
      main.classList.add('mid');
      main.classList.remove('min');
    }
  });

  var up = document.createElement('span');
  up.innerHTML = '\u25b2';
  up.setAttribute('class', 'up-btn');
  up.setAttribute('id', 'expand-playground');
  up.addEventListener('click', function() {
    if (!window.playgroundEl) initFrame();

    if (div.classList.contains('mid')) {
      div.classList.remove('mid');
      div.classList.add('max');
      main.classList.add('min');
      main.classList.remove('mid');
    } else if (div.classList.contains('min')) {
      div.classList.remove('min');
      div.classList.add('mid');
      main.classList.add('mid');
      main.classList.remove('max');
    }
  });
  div.appendChild(down);
  div.appendChild(up);

  document.body.appendChild(div);

  function initFrame(callback) {
    // frame
    var frame = document.createElement('iframe');
    frame.src = '/playground/?env=docs';
    frame.name = 'embedded playground';
    if (callback) frame.onload = callback;
    div.appendChild(frame);
    window.playgroundEl = div;
  }

  function offsetTop(el, target) {
    var y = 0;
    while (el && el !== target) {
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return y;
  }

  function ease(duration, cb) {
    var start = Date.now();
    function step() {
      var t = (Date.now() - start) / duration;
      cb(t * t * t);
      if (t < 1) setTimeout(step, 16.667);
      else cb(1);
    }
    step();
  }

  return function playground(el) {
    if(!el) return;

    if (!window.playgroundEl) {
      initFrame(function() {
        playground(el);
      });
    } else {
      div.classList.remove('min', 'max');
      div.classList.add('mid');
      main.classList.remove('min', 'max');
      main.classList.add('mid');

      var pg = window.playgroundEl.querySelector('iframe').contentWindow;
      var code = el.getAttribute('data-playground') || el.getAttribute('data-tutorial') || el.getAttribute('data-runtutorial');
      var tab = el.getAttribute('data-tab');
      var run = el.getAttribute('data-run');
      var eval = el.getAttribute('data-eval');

      if (code) pg.postMessage({ code: code, tab: tab, run: run, eval: eval }, '*');

      if (el.getAttribute('data-tutorial')) {
        setTimeout(function() {
          var start = main.scrollTop;
          var mid = start - offsetTop(el, main);
          var distance = -(mid > 0 ? mid - 50 : mid + 50)
          ease(500, function(t) {
            main.scrollTop = start + (t * distance);
          });
        }, 210);
      }
    }
  }
})();

document.querySelectorAll('div[data-playground] ~ pre').forEach(function(el) {
  var div = el.previousSibling.previousSibling;
  if (div.nodeType === 1 && div.getAttribute('data-playground')) {
    el.style.position = 'relative';
    var btn = document.createElement('div');
    btn.innerHTML = '\u21f2';
    btn.setAttribute('class', 'run-in-playground');
    btn.setAttribute('title', 'Click to open this example on the playground.');
    btn.addEventListener('click', function(ev) {
      playground(div);
    });
    el.appendChild(btn);
  }
});

document.querySelectorAll('div[data-runtutorial] ~ pre').forEach(function(el) {
  var div = el.previousSibling.previousSibling;
  if (div.nodeType === 1 && div.getAttribute('data-runtutorial')) {
    el.style.position = 'relative';
    var btn = document.createElement('div');
    btn.innerHTML = '\u25b6';
    btn.setAttribute('class', 'run-in-playground');
    btn.setAttribute('title', 'Click to execute this code in the playground.');
    btn.addEventListener('click', function(ev) {
      playground(div);
    });
    el.appendChild(btn);
  }
});

document.querySelectorAll('[data-tutorial]').forEach(function(el) {
  el.addEventListener('click', function(ev) {
    playground(el);
  });
});
