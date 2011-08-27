
Ext.define('MyDesktop.MapTest',{
  extend: 'Ext.ux.desktop.Module',

  requires: ['Ext.panel.Panel'],
  id: 'maptest-win',
  init: function(){
    this.launcher = {
      text: '地图操作',
      iconCls:'icon-grid',
      handler:this.createWindow,
      scope: this
    };
  },

  createWindow : function(){
    var desktop=this.app.getDesktop();
    var win=desktop.getWindow('maptest-win');
    if(!win){
      var menu = Ext.createWidget('menu', {
        items: [
            {text: 'Menu item'},
            {text: 'Check 1', checked: true},
            {text: 'Check 2', checked: false},
            '-',
            {text: 'Option 1', checked: true,  group: 'opts'},
            {text: 'Option 2', checked: false, group: 'opts'},
            '-',
            {
                text: 'Sub-items',
                menu: Ext.createWidget('menu', {
                    items: [
                        {text: 'Item 1'},
                        {text: 'Item 2'}
                    ]
                })
            }
         ]
        });
      win=desktop.createWindow({
        id: 'maptest-win',
        title: '地图操作',
        width:740,
        height:480,
        iconcls: 'icon-grid',
        animCollapse: false,
        constrainHeader:false,
        layout: 'fit',
        items:[{
          html:"<div id='map' style='height:100%;width:100%;'> <div id='extSlider' style='position: absolute; right: 20px; top: 20px; height: 180px; z-index: 100;'></div></div>"
        },{
          
        }],
        tbar: [
            '操作菜单：',
            ' ',
            '-',
            {text: 'Button'},
            {
                text: 'Menu Button',
                id  : 'menu-btn',
                menu: menu
            },
            {
                xtype: 'splitbutton',
                text : 'Split Button',
                menu : Ext.createWidget('menu', {
                    items: [
                        {text: 'Item 1'},
                        {text: 'Item 2'}
                    ]
                })
            },
            {
                xtype       : 'button',
                enableToggle: true,
                pressed     : true,
                text        : 'Toggle Button'
            }
        ],
        bbar: [
            {text: 'Bottom Bar'}
        ],
        lbar:[
            { text: 'Left' }
        ],
        rbar: [
            { text: 'Right' }
        ]     
        });
    }
    win.show();
    this.initMap();
    return win;
  },
  initMap: function() {
             debugger
    removeDijit(dojo.byId("map"));
function removeDijit(elem){
	var ids = ["map"];
	dijit.registry.forEach(function(w){ 
	   if(dojo.indexOf(ids,id)){
	        w.destroyRecursive();
	   }
	});
}

    var map = new esri.Map("map");
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://localhost:8399/arcgis/rest/services/test2/MapServer");
    map.addLayer(layer);
    var resizeTimer;
    dojo.connect(map, "onLoad", function(){
          dojo.connect(dijit.byId('map'), 'resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
              map.resize();
              map.reposition();
            }, 500);
          });
     });
  },
})
