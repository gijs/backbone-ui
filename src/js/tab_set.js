(function(){
  Backbone.UI.TabSet = Backbone.View.extend({
    options : {
      // Tabs to initially add to this tab set.  Each entry may contain
      // a <code>label</code>, <code>content</code>, and <code>onActivate</code>
      // option.
      tabs : [],
      selectedTab : 0
    },

    initialize : function() {
      $(this.el).addClass('tab_set');
    }, 

    render : function() {
      $(this.el).empty();

      this._tabs = [];
      this._contents = [];
      this._callbacks = [];
      this._tabBar = $.el.div({className : 'tab_bar'});
      this._contentContainer = $.el.div({className : 'content_container'});
      this.el.appendChild(this._tabBar);
      this.el.appendChild(this._contentContainer);

      for(var i=0; i<this.options.alternatives.length; i++) {
        this.addTab(this.options.alternatives[i]);
      }

      if(this.options.selectedTab >= 0){
        this.activateTab(this.options.selectedTab);
      }
      else{
        $(this.el).addClass('no_selection');
      }

      return this; 
    },

    addTab : function(tabOptions) {
      var tab = $.el.a({href : '#', className : 'tab'});
      if(tabOptions.className) $(tab).addClass(tabOptions.className);
      
      var label = this.resolveContent(null, tabOptions.label);
      tab.appendChild(_(label).isString() ? document.createTextNode(label || '') : label);
      
      this._tabBar.appendChild(tab);
      this._tabs.push(tab);

      var content = !!tabOptions.content && !!tabOptions.content.nodeType ? 
        tabOptions.content : 
        $.el.div(tabOptions.content);
      this._contents.push(content);
      $(content).hide();
      this._contentContainer.appendChild(content);

      // observe tab clicks
      var index = this._tabs.length - 1;
      $(tab).bind('click', _.bind(function() {
        this.activateTab(index);
        return false;
      }, this));

      this._callbacks.push(tabOptions.onActivate || Backbone.UI.noop);
    },

    activateTab : function(index) {
      
      $(this.el).removeClass('no_selection');
      
      // hide all content panels
      _(this._contents).each(function(content) {
        $(content).hide();
      });

      // de-select all tabs
      _(this._tabs).each(function(tab) {
        $(tab).removeClass('selected');
      });

      if(_(this._selectedIndex).exists()) {
        $(this.el).removeClass('index_' + this._selectedIndex);
      }
      $(this.el).addClass('index_' + index);
      this._selectedIndex = index;

      // select the appropriate tab
      $(this._tabs[index]).addClass('selected');

      // show the proper contents
      $(this._contents[index]).show();

      this._callbacks[index]();
    }
  });
}());

