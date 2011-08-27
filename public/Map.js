Ext.define('MyDesktop.Map',{
  extend: 'Ext.ux.desktop.Module',

  requires: ['Ext.panel.Panel'],
  id: 'map-win',
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
    var win=desktop.getWindow('map-win');
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
        id: 'map-win',
        title: '地图操作',
        width:740,
        height:480,
        iconcls: 'icon-grid',
        animCollapse: false,
        constrainHeader:false,
        layout: 'fit',
        items:[{
          html:"<div id='map' style='height:100%;width:100%;'> <div id='extSlider' style='position: absolute; right: 20px; top: 20px; height: 180px; z-index: 100;'></div></div>"
          //text:'aaa',
          //id:'map'
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

        var startExtent = new esri.geometry.Extent(-83.41, 31.98, -78.47, 35.28, new esri.SpatialReference({wkid:4326}));
        //create map
        var map = new esri.Map("map",{extent:esri.geometry.geographicToWebMercator(startExtent),slider:false});

        //create and add new layer
        var layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
        map.addLayer(layer);
        var southCarolinaCounties = new esri.layers.FeatureLayer("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/3", {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["NAME", "POP2000", "POP2007", "POP00_SQMI", "POP07_SQMI"]
        });
        southCarolinaCounties.setDefinitionExpression("STATE_NAME = 'South Carolina'");

        var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,255,255,0.35]), 1),new dojo.Color([125,125,125,0.35]));
        southCarolinaCounties.setRenderer(new esri.renderer.SimpleRenderer(symbol));
        map.addLayer(southCarolinaCounties);
        
        

        //NOTE: Requires dojo.number for the formatting
        var infoTemplate = new esri.InfoTemplate();
        infoTemplate.setContent("<b>${NAME}</b><hr></br><b>2000 Population: </b>${POP2000:NumberFormat}<br/>"
                             + "<b>2000 Population per Sq. Mi.: </b>${POP00_SQMI:NumberFormat}<br/>"
                             + "<b>2007 Population: </b>${POP2007:NumberFormat}<br/>"
                             + "<b>2007 Population per Sq. Mi.: </b>${POP07_SQMI:NumberFormat}");

        map.infoWindow.resize(245,125);

        var toolTip= Ext.create('Ext.tip.Tip', {
          title: 'Tip of the feather',
          width: 200,
          height: 100,
          autoHide: false,
          closable: true,
          draggable: true,
          floating: true,
          shadow: "frame",
          html: 'Press this button to clear the form'
        }); 
        var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 3), new dojo.Color([125,125,125,0.35]));

        //close the dialog when the mouse leaves the highlight graphic
       dojo.connect(map, "onLoad", function(){
          map.graphics.enableMouseEvents();
          dojo.connect(map.graphics,"onMouseOut",function(){
              map.graphics.clear();
              toolTip.hide();
          });

          dojo.connect(dijit.byId('map'), 'resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
              map.resize();
              map.reposition();
            }, 500);
          });
          var slider = new Ext.slider.SingleSlider({
            renderTo: "extSlider",
            height: 180,
            increment: 1,
            minValue: 0,
            maxValue: layer.tileInfo.lods.length - 1,
            value: map.getLevel(),
            vertical: true,
            plugins: new Ext.slider.Tip()
          });
        
          slider.on("changecomplete", function(slider, newValue) {
            map.setLevel(newValue);
          });
        
          dojo.connect(map, "onZoomEnd", function() {
            slider.setValue(map.getLevel());
          });
        });

                
        //listen for when the onMouseOver event fires on the countiesGraphicsLayer
        //when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
        dojo.connect(southCarolinaCounties, "onMouseOver", function(evt) {
          evt.graphic.setInfoTemplate(infoTemplate);
          var content =  esri.substitute(evt.graphic.attributes,"${*}");
          var highlightGraphic = new esri.Graphic(evt.graphic.geometry,highlightSymbol);
          map.graphics.add(highlightGraphic);
          toolTip.showAt([evt.pageX+10,evt.pageY+10]);
          toolTip.body.update(content);
        });
  },
})
