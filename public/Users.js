Ext.require([
    'Ext.form.*'
]);
var user_win;
var checkUnique=function(value,mykey){
  var a = Ext.Ajax.request({
    url: '/checkUnique',
    method: 'GET',
    async:false,
    params: {
      mykey:mykey,
      myvalue: value
    },
    success: function(response){
      var text=response.responseText;
      return text;
    }
  });
  var b=a.responseText;
  if(b=='true')
    return true;
    return b;
}
function loginForm() {
  if (!user_win) {
    var loginForm = Ext.widget('form', {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      border: false,
      width:400,
      height:200,
      bodyPadding: 10,
      fieldDefaults: {
	  	  labelAlign: 'top',
        labelWidth: 100,
		    msgTarget: 'side',
        labelStyle: 'font-weight:bold',		
        invalidCls: ''
      },
      defaults: {
        margins: '0 0 10 0'
      },
      url:'/login',
      items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: '用户名',
            allowBlank: false
        },{
            xtype: 'textfield',
            name: 'password',
            fieldLabel: '密码',
            inputType: 'password',
            style: 'margin-top:15px',
            allowBlank: false,
            minLength: 6 
        }],

      buttons: [{
        text: '取消',
        handler: function() {
          this.up('form').getForm().reset();
          this.up('window').hide();
         }
      }, {
        text: '登录',
        handler: function() {
          if (this.up('form').getForm().isValid()) {
            this.up('form').getForm().submit({
                clientValidation: true,
                        url: '/login',
                        method: 'POST',
                        waitMsg: '正在登录...',
                        success: function(fp, o) {
                            Ext.Msg.alert('登录成功');
                        },
                        failure: function(form, action) {
                          switch (action.failureType) {
                            case Ext.form.action.Action.CLIENT_INVALID:
                              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                              break;
                            case Ext.form.action.Action.CONNECT_FAILURE:
                              Ext.Msg.alert('Failure', 'Ajax communication failed');
                              break;
                            case Ext.form.action.Action.SERVER_INVALID:
                              Ext.Msg.alert('Failure', action.result.msg);
                          }
                        }
            });
            //this.up('form').getForm().reset();
            this.up('window').hide();
          }
        }
      }]
    });

    var registerForm = Ext.widget('form', {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      width: 400,
      height:260,
      border: false,
      bodyPadding: 10,
      fieldDefaults: {
		    msgTarget: 'side',
        labelWidth: 75,
        invalidCls: '',
        labelStyle: 'font-weight:bold',
      },
      defaults: {
        margins: '0 0 10 0'
      },
      url:'/create',
      items: [{
        xtype: 'textfield',
        name: 'username',
        fieldLabel: '用户名',
        allowBlank: false,
        validator: function(value){
          return checkUnique(value,'username');
        }
      }, {
        xtype: 'textfield',
        name: 'email',
        fieldLabel: '邮  箱',
        vtype: 'email',
        allowBlank: false,

        validator: function(value){
          return checkUnique(value,'email');
        }
      }, {
            xtype: 'textfield',
            name: 'password1',
            fieldLabel: '密  码',
            inputType: 'password',
            style: 'margin-top:15px',
            allowBlank: false,
            minLength: 6
        }, {
            xtype: 'textfield',
            name: 'password2',
            fieldLabel: '重复密码',
            inputType: 'password',
            allowBlank: false,
            /**
             * 检测两次输入是否相同。
             */
            validator: function(value) {
                var password1 = this.previousSibling('[name=password1]');
                return (value === password1.getValue()) ? true : 'Passwords do not match.'
            }
        },{
            xtype: 'checkboxfield',
            name: 'acceptTerms',
            fieldLabel: 'Terms of Use',
            hideLabel: true,
            style: 'margin-top:15px',
            boxLabel: '我已阅读并接收 <a href="#" class="terms">用户协议</a>.',

            // 打开用户协议
            listeners: {
                click: {
                    element: 'boxLabelEl',
                    fn: function(e) {
                        var target = e.getTarget('.terms'),
                            user_acc_win;
                        if (target) {
                            user_acc_win = Ext.widget('window', {
                                title: 'Terms of Use',
                                modal: true,
                                html: '<iframe src="/user_acc" width="950" height="500" style="border:0"></iframe>',
                                buttons: [{
                                    text: '拒绝',
                                    handler: function() {
                                        this.up('window').close();
                                        formPanel.down('[name=acceptTerms]').setValue(false);
                                    }
                                }, {
                                    text: '接受',
                                    handler: function() {
                                        this.up('window').close();
                                        formPanel.down('[name=acceptTerms]').setValue(true);
                                    }
                                }]
                            });
                            user_acc_win.show();
                            e.preventDefault();
                        }
                    }
                }
            },

            getErrors: function() {
                return this.getValue() ? [] : ['您必须接受该协议才能注册！']
            }
        }],

      buttons: [{
        text: '取消',
        handler: function() {
          this.up('form').getForm().reset();
          this.up('window').hide();
         }
      }, {
        text: '注册',
        handler: function() {
          if (this.up('form').getForm().isValid()) {
            this.up('form').getForm().submit({
                clientValidation: true,
                        url: '/create',
                        method: 'POST',
                        waitMsg: '正在注册，请稍候...',
                        success: function(fp, o) {
                            Ext.Msg.alert('注册成功');
                        },
                        failure: function(form, action) {
                          switch (action.failureType) {
                            case Ext.form.action.Action.CLIENT_INVALID:
                              Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                              break;
                            case Ext.form.action.Action.CONNECT_FAILURE:
                              Ext.Msg.alert('Failure', 'Ajax communication failed');
                              break;
                            case Ext.form.action.Action.SERVER_INVALID:
                              Ext.Msg.alert('Failure', action.result.msg);
                          }
                        }
            });
            //this.up('form').getForm().reset();
            this.up('window').hide();
          }
        }
      }]
    });
    user_win = Ext.widget('window', {
      closeAction: 'hide',
      width: 410,
      height: 320,
      minHeight: 200,
      layout: 'fit',
      resizable: true,
      modal: true,
      items: {
            xtype:'tabpanel',
            activeTab: 0,
            defaults:{
                //bodyStyle:'padding:10px'
            },
            items:[{
                title:'登录',
                items:loginForm
                },{
                title:'注册',
                items:registerForm
                }]
      }
    });
  }
  user_win.show();
}
