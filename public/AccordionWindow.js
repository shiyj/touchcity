
Ext.define('MyDesktop.AccordionWindow', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.TreeStore',
        'Ext.layout.container.Accordion',
        'Ext.toolbar.Spacer',
        'Ext.tree.Panel'
    ],

    id:'acc-win',

    init : function(){
        this.launcher = {
            text: '帐号管理',
            iconCls:'accordion',
            handler : function(){
				    //this.createWindow
			},
            scope: this
        };
    },

    createTree : function(){
		  var store= Ext.create('Ext.data.TreeStore', {
		  	proxy: {
				type: 'ajax',
				url : '/getFriends',
				reader: 'json'
		  	},
            root: {
		        text:'Online',
		        expanded: true
		    }
        });
        var tree = Ext.create('Ext.tree.Panel', {
            id:'im-tree',
            title: '朋友',
            rootVisible:false,
            lines:false,
            autoScroll:true,
            tools:[{
                type: 'refresh',
                handler: function(c, t) {
                    tree.setLoading(true, tree.body);
                    var root = tree.getRootNode();
                    root.collapseChildren(true, false);
                    Ext.Function.defer(function() { 
                        tree.setLoading(false);
                        root.expand(true, true);
                    }, 1000);
                }
            }],
            store: store
        });

        return tree;
    },
    createWindow : function(){
		Ext.Ajax.request({
			url: '/auth',
			method: 'GET',
			success: function(response){
				var text=response.responseText;
        if(text=='unauthed'){
          loginForm();
          return;
        }
				var desktop = myDesktopApp.getDesktop();
				var win = desktop.getWindow('acc-win');

				if (!win) {
				    win = desktop.createWindow({
				        id: 'acc-win',
				        title: '帐号管理',
				        width: 250,
				        height: 400,
				        iconCls: 'accordion',
				        animCollapse: false,
				        constrainHeader: true,
				        bodyBorder: true,
				        tbar: {
				            xtype: 'toolbar',
				            ui: 'plain',
				            items: [{
				                tooltip:'退出登录',
				                iconCls:'connect',
                        handler: function(){
                          var a = Ext.Ajax.request({
                            url: '/logout',
                            method: 'GET',
                            async:false,
                          });
                          var b = a.responseText;
                          alert(b);
                          win.destroy();
                        } 
				            },
				            '-',
				            {
				                tooltip:'添加朋友',
				                iconCls:'user-add'
				            },
				            ' ',
				            {
				                tooltip:'删除朋友',
				                iconCls:'user-delete'
				            }]
				        },

				        layout: 'accordion',
				        border: false,

				        items: [
				            myDesktopApp.modules[3].createTree(),
				            {
				                title: '搜索',
				                html:'<p>Something useful would be in here.</p>',
				                autoScroll:true
				            },
				            {
				                title: '微博',
				                html : '<p>Something useful would be in here.</p>'
				            },
				            {
				                title: 'My Stuff',
				                html : '<p>Something useful would be in here.</p>'
				            }
				        ]
				    });
				}

				win.show();
				return win;			
			}		
		});
    }
	
	
});

