Ext.define('MyDesktop.Map', {
	extend: 'Ext.ux.desktop.Module',

	requires: ['Ext.panel.Panel'],
	id: 'map-win',
	drawPoint: null,
	vector: new OpenLayers.Layer.Vector('Vector Layer', {
		styleMap: new OpenLayers.StyleMap({
			'default': {
				strokeColor: "#0000FF",
				strokeOpacity: 1,
				strokeWidth: 3,
				fillColor: "#5500FF",
				fillOpacity: 0.5,
				pointRadius: 6,
				pointerEvents: "visiblePainted",
			}
		})
	}),
	positionVector: new OpenLayers.Layer.Vector('Position Vector Layer', {
		styleMap: new OpenLayers.StyleMap({
			'default': {
				strokeColor: "#FF0000",
				strokeOpacity: 1,
				strokeWidth: 3,
				fillColor: "#55FF00",
				fillOpacity: 0.5,
				pointRadius: 8,
				pointerEvents: "visiblePainted",
			}
		})
	}),
	toolbar: new OpenLayers.Control.Panel({
		displayClass: 'olControlEditingToolbar'
	}),
	wms: new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0", {
		layers: 'basic'
	}),
	map: null,
	init: function() {
		this.launcher = {
			text: '地图操作',
			iconCls: 'icon-grid',
			handler: this.createWindow,
			scope: this
		};
	},

	createWindow: function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('map-win');
		if (!win) {
			var menu = Ext.createWidget('menu', {
				items: [{
					text: 'Menu item'
				},
				{
					text: 'Check 1',
					checked: true
				},
				{
					text: 'Check 2',
					checked: false
				},
				'-', {
					text: 'Option 1',
					checked: true,
					group: 'opts'
				},
				{
					text: 'Option 2',
					checked: false,
					group: 'opts'
				},
				'-', {
					text: 'Sub-items',
					menu: Ext.createWidget('menu', {
						items: [{
							text: 'Item 1'
						},
						{
							text: 'Item 2'
						}]
					})
				}]
			});
			win = desktop.createWindow({
				id: 'map-win',
				title: '地图操作',
				width: 740,
				height: 480,
				iconcls: 'icon-grid',
				animCollapse: false,
				constrainHeader: false,
				layout: 'fit',
				items: [{
					html: "<div id='map' style='height:100%;width:100%;'> <div id='extSlider' style='position: absolute; right: 20px; top: 20px; height: 180px; z-index: 100;'></div></div>"
					//text:'aaa',
					//id:'map'
				},
				{

				}],
				tbar: ['操作菜单：', ' ', '-', {
					text: 'Button'
				},
				{
					text: 'Menu Button',
					id: 'menu-btn',
					menu: menu
				},
				{
					xtype: 'splitbutton',
					text: 'Split Button',
					menu: Ext.createWidget('menu', {
						items: [{
							text: 'Item 1'
						},
						{
							text: 'Item 2'
						}]
					})
				},
				{
					xtype: 'button',
					enableToggle: true,
					pressed: true,
					text: 'Toggle Button'
				}],
				bbar: [{
					text: 'Bottom Bar'
				}],
				lbar: [{
					text: 'Left'
				}],
				rbar: [{
					text: 'Right'
				}]
			});
		}
		win.show();
		this.initMap();
		return win;
	},
	initMap: function() {
		this.drawPoint = new OpenLayers.Control.DrawFeature(this.positionVector, OpenLayers.Handler.Point);
		this.toolbar.addControls([
		new OpenLayers.Control({
			displayClass: 'olControlNavigation'
		}), new OpenLayers.Control.ModifyFeature(this.vector, {
			vertexRenderIntent: 'default',
			displayClass: 'olControlModifyFeature'
		}), new OpenLayers.Control.DrawFeature(this.vector, OpenLayers.Handler.Point, {
			displayClass: 'olControlDrawFeaturePoint'
		}), new OpenLayers.Control.DrawFeature(this.vector, OpenLayers.Handler.Path, {
			displayClass: 'olControlDrawFeaturePath'
		}), new OpenLayers.Control.DrawFeature(this.vector, OpenLayers.Handler.Polygon, {
			displayClass: 'olControlDrawFeaturePolygon'
		})]);
		//wms = new OpenLayers.Layer.WMS( "WORLD","http://10.0.2.2/cgi-bin/mapserv?map=/home/engin/webapp/ms4w/apps/tutorial/htdocs/world.map&", {layers: 'world_adm0'},{gutter: 15} );
		this.map = new OpenLayers.Map({
			div: 'map',
			projection: 'EPSG:4326',
			units: 'm',
			numZoomLevels: 18,
			maxResolution: 1,
			maxExtent: new OpenLayers.Bounds( - 181.00, - 91.00, 181.00, 91.00),
			controls: [
			new OpenLayers.Control.TouchNavigation(), new OpenLayers.Control.ZoomPanel(), this.toolbar],
			layers: [this.wms, this.vector, this.positionVector],
			center: new OpenLayers.LonLat(113, 30),
			zoom: 6,
			theme: null
		});
		this.toolbar.controls[0].activate();
	}
})

