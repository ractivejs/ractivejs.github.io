Ractive.components.Sheet = Ractive.extend({
  template: {v:4,t:[{t:7,e:"div",m:[{n:"class",f:"ractive-sheet",t:13},{n:"class-rs-popped",f:[{t:2,x:{r:["popped"],s:"!!_0"}}],t:13}],f:[{t:7,e:"ul",m:[{n:"class",f:"rs-tabs",t:13}],f:[{t:7,e:"li",m:[{n:"class",f:"rs-tab",t:13},{n:["click"],t:70,f:{r:[],s:"[[\"select\",\"output\"]]"}},{n:"class-rs-tab-active",f:[{t:2,x:{r:["~/selected"],s:"_0===\"output\""}}],t:13}],f:["Output"]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-tab",t:13},{n:["click"],t:70,f:{r:[],s:"[[\"select\",\"console\"]]"}},{n:"class-rs-tab-active",f:[{t:2,x:{r:["~/selected"],s:"_0===\"console\""}}],t:13}],f:["Console"]}," ",{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this","popped"],s:"[_0.set(\"popped\",_1===2?1:0)]"}}],f:["\u2b07"]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"popped\",2)]"}},{n:"class-rs-disabled",f:[{t:2,x:{r:["popped"],s:"_0===2"}}],t:13}],f:["\u2b06"]}," ",{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rs-button",t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"messages\",[])]"}}],f:["\u2205"]}],n:50,x:{r:["selected"],s:"_0===\"console\""}}],n:50,r:"popped"}]}," ",{t:7,e:"ul",m:[{n:"class",f:"rs-contents",t:13}],f:[{t:7,e:"li",m:[{n:"class",f:"rs-content rs-output",t:13},{n:"class-rs-content-active",f:[{t:2,x:{r:["~/selected"],s:"_0===\"output\""}}],t:13}],f:[{t:7,e:"iframe",m:[{n:"sandbox",f:"allow-scripts allow-forms allow-same-origin allow-modals",t:13}]}]}," ",{t:7,e:"li",m:[{n:"class",f:"rs-content rs-console",t:13},{n:"class-rs-content-active",f:[{t:2,x:{r:["~/selected"],s:"_0===\"console\""}}],t:13}],f:[{t:7,e:"ul",f:[{t:4,f:[{t:7,e:"li",m:[{n:"class",f:["rs-message ",{t:2,x:{r:[".type"],s:"_0?(\"rs-message-\"+(_0)):\"\""}}],t:13}],f:[{t:7,e:"pre",f:[{t:7,e:"code",f:[{t:2,r:".message"}]}]}]}],n:52,r:"messages"}]}]}]}]}],e:{"!!_0":function (_0){return(!!_0);},"[[\"select\",\"output\"]]":function (){return([["select","output"]]);},"_0===\"output\"":function (_0){return(_0==="output");},"[[\"select\",\"console\"]]":function (){return([["select","console"]]);},"_0===\"console\"":function (_0){return(_0==="console");},"[_0.set(\"popped\",_1===2?1:0)]":function (_0,_1){return([_0.set("popped",_1===2?1:0)]);},"[_0.set(\"popped\",2)]":function (_0){return([_0.set("popped",2)]);},"_0===2":function (_0){return(_0===2);},"[_0.set(\"messages\",[])]":function (_0){return([_0.set("messages",[])]);},"_0?(\"rs-message-\"+(_0)):\"\"":function (_0){return(_0?("rs-message-"+(_0)):"");}}},
  css: ".ractive-sheet { box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); position: absolute; top: 0; bottom: 0; left: 0; right: 0; background-color: #fff; } ul { list-style: none; margin: 0; padding: 0; } li { margin: 0; padding: 0; } .ractive-sheet .rs-tabs { height: 3em; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); box-sizing: border-box; } .ractive-sheet .rs-button, .ractive-sheet .rs-tab { display: inline-block; padding: 0.75em 1.25em; font-size: 1.2em; height: 100%; box-sizing: border-box; color: rgba(114, 157, 42, 0.8); cursor: pointer; width: calc(50% - 4em); text-align: center; line-height: 1em; vertical-align: top; border-bottom: 2px solid transparent; transition: border-bottom 0.2s ease-in-out, color 0.2s ease-in-out; } .ractive-sheet .rs-tab-active { border-bottom: 2px solid #729d34; color: #729d34; } .ractive-sheet .rs-button { width: 2.3em; padding: 0.75em 0.75em; } .ractive-sheet .rs-button.rs-disabled { color: #ccc; } .ractive-sheet .rs-contents { position: absolute; display: none; } .ractive-sheet.rs-popped .rs-contents { display: block; top: 3.2em; bottom: 0; left: 0; right: 0; } .ractive-sheet .rs-content { display: block; position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: auto; margin: 0; opacity: 0; z-index: -1; transition: z-index 0s linear 0.3s, opacity 0.3s ease-in-out; } .ractive-sheet .rs-content-active { opacity: 1; z-index: 1; transition: z-index 0s linear 0s, opacity 0.3s ease-in-out; } .ractive-sheet iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; box-sizing: border-box; } .ractive-sheet li.rs-message { padding: 0.25em 0.5em; border-bottom: 1px solid #ccc; } .ractive-sheet li.rs-message-warn { background-color: yellow; } .ractive-sheet li.rs-message-error { background-color: pink; } .ractive-sheet li.rs-message pre { max-width: 100%; overflow-x: hidden; padding: 0; margin: 0; white-space: pre-wrap; }",
  cssId: 'ractive-sheet',
  on: {
    init: function() {
      var self = this;
      this.messageListener = window.addEventListener('message', function(event) {
        if (event.isTrusted && event.data.log) {
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
        var html = '<!DOCTYPE html>\n\t<head>\n\t\t<title>Ractive Play Output</title>\n\t\t<style>\n\t\t\t' + (unit.c || '').replace(/\n/g, '\n\t\t\t') + '</style>' + scripts + '\n\t\t<' + 'script>\n\t\t\t(function() {\n\t\t\t\tvar csl = console.log, csw = console.warn; cse = console.error;\n\t\t\t\tfunction proxy(fn, type) {\n\t\t\t\t\treturn function() {\n\t\t\t\t\t\tvar args = Array.prototype.slice.call(arguments);\n\t\t\t\t\t\twindow.parent.postMessage({ log: args, type: type }, \'*\');\n\t\t\t\t\t\tfn.apply(console, args);\n\t\t\t\t\t};\n\t\t\t\t}\n\t\t\t\tconsole.log = proxy(csl, \'log\');\n\t\t\t\tconsole.warn = proxy(csw, \'warn\');\n\t\t\t\tconsole.error = proxy(cse, \'error\');\n\t\t\t})();\n\t\t</' + 'script>\n\t</head>\n\t<body>\n\t\t' + (unit.t || '').replace(/\n/g, '\n\t\t') + '\n\t\t<' + 'script>\n\t\t\t' + (unit.s || '').replace(/\n/g, '\n\t\t\t') + '\n\t\t<' + '/script>\n\t</body>\n</html>';
        this.find('iframe').setAttribute('srcdoc', html);
        if (!this.get('selected')) this.set('selected', 'output');
      },
      init: false
    }
  }
});