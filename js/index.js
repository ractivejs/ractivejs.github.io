var playground = (function() {
  var container = document.querySelector('footer').previousSibling.previousSibling;
  var div = document.createElement('div');
  div.id = 'playground-div';
  div.setAttribute('class', 'min');
  container.classList.add('max');
  container.id = 'docs';

  // buttons
  var down = document.createElement('span');
  down.innerHTML = '\u25bc';
  down.setAttribute('class', 'down-btn');
  down.addEventListener('click', function() {
    pinScroll(false);
    if (div.classList.contains('mid')) {
      div.classList.remove('mid');
      div.classList.add('min');
      container.classList.add('max');
      container.classList.remove('mid');
    } else if (div.classList.contains('max')) {
      div.classList.remove('max');
      div.classList.add('mid');
      container.classList.add('mid');
      container.classList.remove('min');
    }
  });

  var up = document.createElement('span');
  up.innerHTML = '\u25b2';
  up.setAttribute('class', 'up-btn');
  up.addEventListener('click', function() {
    pinScroll(true);
    if (!window.playgroundEl) initFrame();

    if (div.classList.contains('mid')) {
      div.classList.remove('mid');
      div.classList.add('max');
      container.classList.add('min');
      container.classList.remove('mid');
    } else if (div.classList.contains('min')) {
      div.classList.remove('min');
      div.classList.add('mid');
      container.classList.add('mid');
      container.classList.remove('max');
    }
  });
  div.appendChild(down);
  div.appendChild(up);

  var footer = document.querySelector('footer');
  footer.parentNode.insertBefore(div, footer);

  function pinScroll(up) {
    var top;
    if (up && container.classList.contains('max')) {
      top = document.body.scrollTop;
      setTimeout(function() {
        container.scrollTop = top;
      }, 210);
    } else if (!up && div.classList.contains('mid')) {
      top = container.scrollTop;
      setTimeout(function() {
        document.body.scrollTop = top;
      }, 210);
    }
  }

  function initFrame(callback) {
    // frame
    var frame = document.createElement('iframe');
    frame.src = '/playground/?env=docs';
    frame.name = 'embedded playground';
    if (callback) frame.onload = callback;
    div.appendChild(frame);
    window.playgroundEl = div;
  }

  return function playground(el) {
    if(!el) return;

    if (!window.playgroundEl) {
      initFrame(function() {
        playground(el);
      });
    } else {
      pinScroll(true);
      div.classList.remove('min', 'max');
      div.classList.add('mid');
      container.classList.remove('min', 'max');
      container.classList.add('mid');

      var pg = window.playgroundEl.querySelector('iframe').contentWindow;
      var code = el.getAttribute('data-playground') || el.getAttribute('data-tutorial') || el.getAttribute('data-runtutorial');
      var tab = el.getAttribute('data-tab');
      var run = el.getAttribute('data-run');
      var eval = el.getAttribute('data-eval');

      if (code) pg.postMessage({ code: code, tab: tab, run: run, eval: eval }, '*');
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
