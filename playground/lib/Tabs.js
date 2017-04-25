Ractive.components.Tabs = Ractive.extend({
  cssId: 'ractive-tabs',
  template: {v:4,t:[{t:7,e:"div",m:[{n:"class",f:"ractive-tabs",t:13}],f:[{t:7,e:"ul",m:[{n:"class",f:"rt-tabs",t:13}],f:[{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rt-tab rt-tab-right",t:13},{t:4,f:[{t:16,r:"action"}],n:50,r:".action"}],f:[{t:4,f:[{t:16,r:".title"}],n:50,r:".title"}]}],n:52,r:"actions"}," ",{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rt-tab",t:13},{n:"class-rt-tab-active",t:13,f:[{t:2,x:{r:["~/selected","@index"],s:"_0===_1"}}]},{n:"class-rt-tab-disabled",t:13,f:[{t:2,r:".disabled"}]},{n:"class-rt-tab-right",t:13,f:[{t:2,r:".right"}]},{t:4,f:[{n:["click"],t:70,f:{r:["@index"],s:"[[\"selected\",_0]]"}}],n:50,x:{r:[".disabled"],s:"!_0"}}],f:[{t:4,f:[{t:16,r:".title"}],n:50,r:".title"}]}],n:52,r:"tabs"}]}," ",{t:7,e:"ul",m:[{n:"class",f:"rt-contents",t:13}],f:[{t:4,f:[{t:4,f:[{t:7,e:"li",m:[{n:"class",f:"rt-content",t:13},{n:"class-rt-content-active",t:13,f:[{t:2,x:{r:["~/selected","@index"],s:"_0===_1"}}]},{n:"class-rt-scroll",t:13,f:[{t:2,r:".scroll"}]}],f:[{t:16,r:".content"}]}],n:50,r:".content"}],n:52,r:"tabs"}]}]}],e:{"_0===_1":function (_0,_1){return(_0===_1);},"[[\"selected\",_0]]":function (_0){return([["selected",_0]]);},"!_0":function (_0){return(!_0);}}},
  css: ".ractive-tabs { position: absolute; top: 0; bottom: 0; left: 0; right: 0; box-sizing: border-box; } ul { list-style: none; margin: 0; padding: 0; } li { margin: 0; padding: 0; } .ractive-tabs .rt-tabs { height: 3em; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); box-sizing: border-box; } .ractive-tabs .rt-tab { display: inline-block; padding: 0.75em 1.25em; font-size: 1.2em; height: 100%; box-sizing: border-box; color: rgba(114, 157, 42, 0.8); cursor: pointer; vertical-align: top; border-bottom: 2px solid transparent; transition: border-bottom 0.2s ease-in-out, color 0.2s ease-in-out; } .ractive-tabs .rt-tab-active { border-bottom: 2px solid #729d34; color: #729d34; } .ractive-tabs .rt-tab-disabled { color: #ccc; cursor: not-allowed; } .ractive-tabs .rt-tab-right { float: right; } .ractive-tabs .rt-contents { position: absolute; top: 3.2em; bottom: 0; width: 100%; overflow: hidden; } .ractive-tabs .rt-content { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: block; opacity: 0; z-index: -1; transition: z-index 0s linear 0.3s, opacity 0.3s ease-in-out; } .ractive-tabs .rt-content-active { opacity: 1; z-index: 1; transition: z-index 0s linear 0s, opacity 0.3s ease-in-out; } .ractive-tabs .rt-content.rt-scroll { overflow: auto; }",
  data: function() { return { selected: 0, tabs: [], actions: [] }; },
  on: {
    init: function(ctx) {
      this.partials.content.forEach(n => {
        if (n.e === 'Tab') {
          var tab = {};
          var node = (n.m || []).find(a => a.n === 'title');
          if (node) tab.title = { t: Array.isArray(node.f) ? node.f : [node.f] };
          node = (n.m || []).find(a => a.n === 'scroll');
          if (node) tab.scroll = true;
          tab.content = { t: n.f };
          this.push('tabs', tab);
        } else if (n.e === "Action") {
          var tab = {};
          var title = (n.m || []).find(a => a.n === 'title');
          if (title) tab.title = { t: Array.isArray(title.f) ? title.f : [title.f] };
          var action = (n.m || []).find(a => a.n && a.n[0] === 'click');
          if (action) {
            tab.action = { t: [action] };
          }
          this.push('actions', tab);
        }
      });
    },
    selected: function(ctx, idx) {
      this.set('selected', idx);
    }
  }
});