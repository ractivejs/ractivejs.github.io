Ractive.components.Sheet = Ractive.extend({
  template: {v:4,t:[{t:7,e:"div",m:[{n:"class",f:"ractive-sheet",t:13},{n:"class-rs-popped",t:13,f:[{t:2,x:{r:["popped"],s:"!!_0"}}]}],f:[{t:7,e:"ul",m:[{n:"class",f:"rs-tabs",t:13}],f:[{t:7,e:"li",m:[{n:"class",f:"rs-tab",t:13},{n:["click"],t:70,f:{r:[],s:"[[\"select\",\"output\"]]"}},{n:"class-rs-tab-active",t:13,f:[{t:2,x:{r:["~/selected"],s:"_0===\"output\""}}]}],f:["Output"]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-tab",t:13},{n:["click"],t:70,f:{r:[],s:"[[\"select\",\"console\"]]"}},{n:"class-rs-tab-active",t:13,f:[{t:2,x:{r:["~/selected"],s:"_0===\"console\""}}]}],f:["Console"]}," ",{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this","popped"],s:"[_0.set(\"popped\",_1===2?1:0)]"}}],f:["\u25bc"]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"popped\",2)]"}},{n:"class-rs-disabled",t:13,f:[{t:2,x:{r:["popped"],s:"_0===2"}}]}],f:["\u25b2"]}," ",{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"messages\",[])]"}}],f:["\u2205"]}],n:50,x:{r:["selected"],s:"_0===\"console\""}}],n:50,r:"popped"}]}," ",{t:7,e:"ul",m:[{n:"class",f:"rs-contents",t:13}],f:[{t:7,e:"li",m:[{n:"class",f:"rs-content rs-output",t:13},{n:"class-rs-content-active",t:13,f:[{t:2,x:{r:["~/selected"],s:"_0===\"output\""}}]}],f:[{t:7,e:"iframe",m:[{n:"name",f:"playground output",t:13},{n:"sandbox",f:"allow-scripts allow-forms allow-same-origin allow-modals",t:13}]}]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-content rs-console",t:13},{n:"class-rs-content-active",t:13,f:[{t:2,x:{r:["~/selected"],s:"_0===\"console\""}}]}],f:[{t:7,e:"ul",f:[{t:4,f:[{t:4,f:[{t:19,f:[{t:7,e:"li",m:[{n:"class",f:["rs-message ",{t:2,x:{r:[".type"],s:"_0?(\"rs-message-\"+(_0)):\"\""}}],t:13}],f:[{t:7,e:"pre",f:[{t:7,e:"code",f:[{t:4,f:[{t:2,r:".message"}],n:50,r:"__state.show"},{t:4,n:51,f:[{t:2,x:{r:[".message"],s:"_0.substring(0,_0.indexOf(\"\\n\"))"}}],l:1}]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).toggle(\"__state.show\")]"}}],f:["..."]}]}],n:54,z:[{n:"__state",x:{r:"@local"}}]}],n:50,x:{r:["message"],s:"~_0.indexOf(\"\\n\")"}},{t:4,n:51,f:[{t:7,e:"li",m:[{n:"class",f:["rs-message ",{t:2,x:{r:[".type"],s:"_0?(\"rs-message-\"+(_0)):\"\""}}],t:13}],f:[{t:7,e:"pre",f:[{t:7,e:"code",f:[{t:2,r:".message"}]}]}]}],l:1}],n:52,z:[{n:"message",x:{r:"."}}],r:"messages"}]}]}]}]}],e:{"!!_0":function (_0){return(!!_0);},"[[\"select\",\"output\"]]":function (){return([["select","output"]]);},"_0===\"output\"":function (_0){return(_0==="output");},"[[\"select\",\"console\"]]":function (){return([["select","console"]]);},"_0===\"console\"":function (_0){return(_0==="console");},"[_0.set(\"popped\",_1===2?1:0)]":function (_0,_1){return([_0.set("popped",_1===2?1:0)]);},"[_0.set(\"popped\",2)]":function (_0){return([_0.set("popped",2)]);},"_0===2":function (_0){return(_0===2);},"[_0.set(\"messages\",[])]":function (_0){return([_0.set("messages",[])]);},"_0?(\"rs-message-\"+(_0)):\"\"":function (_0){return(_0?("rs-message-"+(_0)):"");},"_0.substring(0,_0.indexOf(\"\\n\"))":function (_0){return(_0.substring(0,_0.indexOf("\n")));},"[(_0).toggle(\"__state.show\")]":function (_0){return([(_0).toggle("__state.show")]);},"~_0.indexOf(\"\\n\")":function (_0){return(~_0.indexOf("\n"));}}},
  css: ".ractive-sheet { box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: #fff; } ul { list-style: none; margin: 0; padding: 0; } li { margin: 0; padding: 0; } .ractive-sheet .rs-tabs { height: 2.9em; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); box-sizing: border-box; margin-top: 0.1em; } .ractive-sheet .rs-button, .ractive-sheet .rs-tab { display: inline-block; padding: 0.75em 1.25em; font-size: 1.2em; height: 100%; box-sizing: border-box; color: rgba(114, 157, 42, 0.8); cursor: pointer; width: calc(50% - 4em); text-align: center; line-height: 1em; vertical-align: top; border-bottom: 2px solid transparent; transition: border-bottom 0.2s ease-in-out, color 0.2s ease-in-out; } .ractive-sheet .rs-tab-active { border-bottom: 2px solid #729d34; color: #729d34; } .ractive-sheet .rs-button { width: 2.3em; padding: 0.75em 0.75em; } .ractive-sheet .rs-button.rs-disabled { color: #ccc; } .ractive-sheet .rs-contents { position: absolute; display: none; } .ractive-sheet.rs-popped .rs-contents { display: block; top: 3.2em; bottom: 0; left: 0; right: 0; } .ractive-sheet .rs-content { display: block; position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: auto; margin: 0; opacity: 0; z-index: -1; transition: z-index 0s linear 0.3s, opacity 0.3s ease-in-out; } .ractive-sheet .rs-content-active { opacity: 1; z-index: 1; transition: z-index 0s linear 0s, opacity 0.3s ease-in-out; } .ractive-sheet iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; box-sizing: border-box; } .ractive-sheet li.rs-message { padding: 0.25em 0.5em; border-bottom: 1px solid #ccc; position: relative; } .ractive-sheet li.rs-message-warn { background-color: yellow; } .ractive-sheet li.rs-message-error { background-color: pink; } .ractive-sheet li.rs-message pre { max-width: 100%; overflow-x: hidden; padding: 0; margin: 0; white-space: pre-wrap; }",
  cssId: 'ractive-sheet',
  on: {
    init: function() {
      var self = this;
      this.messageListener = window.addEventListener('message', function(event) {
        if (event.data.log) { // aparently firefox doesn't isTrusted the same way chrome does
          var csl = self.find('.rs-console');
          var scroll = csl.scrollTop + csl.clientHeight >= csl.scrollHeight - 5;
          self.push('messages', { type: event.data.type, message: event.data.log.join('\n') });
          if (scroll) {
            csl.scrollTop = csl.scrollHeight - csl.clientHeight;
          }
        }
      }, false);
    },
    select: function(ctx, which) {
      var popped = this.get('popped');
      if (!popped) popped = 1;
      this.set({
        popped: popped,
        selected: which
      });
    },
    teardown: function() {
      window.removeEventListener(this.messageListener);
    }
  },
  observe: {
    unit: {
      handler: function(unit) {
        var scripts = ((unit.h || {}).s || []).map(function(s) { return '\n\t\t<' + 'script src="' + s + '"><' + '/script>'; }).join('');
        if (unit.h && unit.h.r) scripts = '\n\t\t<' + 'script src="//unpkg.com/ractive@' + unit.h.r + '"><' + '/script>' + scripts;
        scripts += '\n\t\t<' + 'script>(function() {\n\tvar csl = console.log, csw = console.warn; cse = console.error;\n\tfunction proxy(fn, type) {\n\t\treturn function() {\n\t\t\tvar args = Array.prototype.slice.call(arguments);\n\t\t\ttry {\n\t\t\t\twindow.parent.postMessage({ log: args, type: type }, \'*\');\n\t\t\t} catch (e) {\n\t\t\t\twindow.parent.postMessage({ log: [\'Failed to proxy message from output console.\', e.message], type: \'error\' }, \'*\');\n\t\t\t}\n\t\t\tfn.apply(console, args);\n\t\t};\n\t}\n\tconsole.log = proxy(csl, \'log\');\n\tconsole.warn = proxy(csw, \'warn\');\n\tconsole.error = proxy(cse, \'error\');\n})();\n//# sourceURL=util.js\n<' + '/script>';
        var html = '<!DOCTYPE html>\n\t<head>\n\t\t<title>Ractive Play Output</title>\n\t\t<style>' + (unit.c || '') + '\n/*# sourceURL=style.css */\n</style>' + scripts + '\n\t</head>\n\t<body>\n\t\t' + (unit.t || '').replace(/\n/g, '\n\t\t') + '\n\t<' + 'script>' + (unit.s || '') + '\n//# sourceURL=script.js\n<' + '/script>\n\t</body>\n</html>';
        var frame = this.find('iframe');
        frame.contentWindow.location = 'about:blank';

        setTimeout(function() {
          var doc = frame.contentDocument;
          doc.open();
          doc.write(html);
          doc.close();
        }, 1);

        if (!this.get('selected')) this.set('selected', 'output');
      },
      init: false
    }
  }
});