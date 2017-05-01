Ractive.decorators['ace-editor'] = function(node, options) {
  var handle = {};

  var info = Ractive.getNodeInfo(node);
  var editor = handle.editor = ace.edit(node);
  editor.$blockScrolling = Infinity;
  var session = editor.getSession();

  var binding;
  var observer;
  var lock = false;

  session.setUseSoftTabs(false);
  session.setTabSize(2);

  editor.on('change', function() {
    if (lock) return;
    lock = true;
    info.set(binding, editor.getValue());
    lock = false;
  });
  function observed(value) {
    if (lock) return;
    lock = true;
    var pos = editor.getCursorPosition();
    editor.setValue(value || '', -1);
    editor.clearSelection();
    editor.moveCursorTo(pos.row, pos.column, false);
    lock = false;
  }

  handle.update = function(options) {
    if (!options) return;
    if (options.syntax) editor.getSession().setMode("ace/mode/" + options.syntax);
    if (options.theme) editor.setTheme("ace/theme/" + options.theme);
    session.setTabSize(options.tabSize || 2);
    if (typeof options.margin === 'boolean') editor.setShowPrintMargin(options.margin);
    if (typeof options.wrap === 'boolean') session.setUseWrapMode(options.wrap);
    if (typeof options.highlightActive === 'boolean') editor.setHighlightActiveLine(options.highlightActive);

    if (options.keymode) editor.setKeyboardHandler(options.keymode);
    else editor.setKeyboardHandler(null)

    if (options.bind !== binding) {
      if (observer) observer.cancel();
      if (options.bind) {
        binding = options.bind;
        observer = info.observe(binding, observed, { init: false });
      }
    }
  };

  handle.teardown = function() {
    editor.off('change');
    editor.destroy();
  };

  handle.update(options);
  if (options.bind) setTimeout(function() { observed(info.get(options.bind)); }, 1);

  return handle;
};

var docs = !!~window.location.search.indexOf('env=docs');
var utilLock = false;
var r = window.r = new Ractive({
  target: '#main',
  template: '#tpl',
  on: {
    play: function() {
      if (!this.get('sheetPopped')) this.set('sheetPopped', 1);
      this.set('compiled', this.get('unit'));
    },
    'pasted-content': function(ctx, content) {
      if (content === this.get('compressed')) return;
      var obj = JSON.parse(LZString.decompressFromEncodedURIComponent(content));
      this.set('unit', obj);
      if (docs) this.set('unit.h.r', 'edge');
    },
    'encoded-content': function(ctx, content) {
      if (utilLock) return;
      utilLock = true;

      this.set({
        'utils.encoded': content,
        'utils.plain': LZString.decompressFromEncodedURIComponent(content)
      });

      utilLock = false;
    },
    'plain-content': function(ctx, content) {
      if (utilLock) return;
      utilLock = true;

      this.set({
        'utils.encoded': LZString.compressToEncodedURIComponent(content),
        'utils.plain': content
      });

      utilLock = false;
    }
  },
  observe: {
    sheetPopped: {
      handler: function() {
        var self = this;
        setTimeout(() => {
          this.findAll('.ace-editor').forEach(function(e) { self.getNodeInfo(e).decorators['ace-editor'].editor.resize(); });
        }, 210);
      },
      init: false
    }
  }
});

function debounce(fn, time, ctx) {
  var timer;
  var next;

  function timeout() {
    var args = Array.prototype.slice.call(arguments);
    if (timer) {
      next = args;
      return;
    } else {
      fn.apply(ctx, args);
      timer = setTimeout(go, time);
    }
  }

  function go() {
    timer = null;
    if (next) {
      fn.apply(ctx, next);
      timer = setTimeout(go, time);
    }
    next = null;
  }

  return timeout;
};

var mqList = window.matchMedia('(min-width: 960px)');
mqList.addListener(function(list) {
  r.set('layout', r.get('settings.layout') || (list.matches ? 'desktop' : 'mobile'));
});
r.observe('settings.layout', function(value) {
  r.set('layout', value || (mqList.matches ? 'desktop' : 'mobile'));
});

r.observe('unit', debounce(function(value) {
  var str = JSON.stringify(value);
  var compressed = LZString.compressToEncodedURIComponent(str);
  this.set('compressed', compressed);

  var l = window.location;
  var url = l.protocol + '//' + l.host + l.pathname + l.search + '#' + compressed;

  if (!this.get('settings.skipUrlUpdate')) {
    window.location.replace(url);
  }

  this.set('url', url);
}, 3000, r), { init: false });

if (window.location.hash) {
  var unit = JSON.parse(LZString.decompressFromEncodedURIComponent(window.location.hash.slice(1)));
  if (unit) {
    r.set('unit', unit);
  }
}

if (window.localStorage) {
  var start = window.localStorage.getItem('ractive-playground-settings');

  if (start) r.set('settings', JSON.parse(start));
  else {
    r.set('settings.editor', { highlightActive: true, wrap: true, theme: 'chrome' });
  }

  r.observe('settings', debounce(function(value) {
      window.localStorage.setItem('ractive-playground-settings', JSON.stringify(value));
  }, 3000), { init: false });
} else {
  r.set('settings.editor', { highlightActive: true, wrap: true, theme: 'chrome' });
}

window.addEventListener('message', function(event) {
  if (event.data && typeof event.data.code === 'string') {
    r.fire('pasted-content', event.data.code);
    if (event.data.eval) r.set('unit.e', LZString.decompressFromEncodedURIComponent(event.data.eval));
    if (event.data.run || event.data.eval) {
      r.fire('play');
    }
    if (event.data.tab && r.get('layout') !== 'desktop') {
      r.findComponent('Tabs').fire('selected', event.data.tab === 'html' ? 0 : event.data.tab === 'script' ? 1 : 2);
    }
  }
});
