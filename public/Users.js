var user_win;
function loginForm() {
  if (!user_win) {
    var loginForm = Ext.widget('form', {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      border: false,
      bodyPadding: 10,
      fieldDefaults: {
        labelAlign: 'top',
        labelWidth: 100,
        labelStyle: 'font-weight:bold'
      },
      defaults: {
        margins: '0 0 10 0'
      },
      url:'/auth',
      items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: '用户名',
            allowBlank: false,
            minLength: 6
        },{
            xtype: 'textfield',
            name: 'password',
            fieldLabel: '密码',
            inputType: 'password',
            style: 'margin-top:15px',
            allowBlank: false,
            minLength: 8
        }],

      buttons: [{
        text: '取消',
        handler: function() {
          this.up('form').getForm().reset();
          this.up('window').hide();
         }
      }, {
        text: '确认',
        handler: function() {
          if (this.up('form').getForm().isValid()) {
            this.up('form').getForm().submit({
                clientValidation: false,
                        url: '/auth',
                        method: 'GET',
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
            this.up('form').getForm().reset();
            this.up('window').hide();
          }
        }
      }]
    });

    user_win = Ext.widget('window', {
      title: '登录',
      closeAction: 'hide',
      width: 200,
      height: 200,
      minHeight: 200,
      layout: 'fit',
      resizable: true,
      modal: true,
      items: loginForm
    });
  }
  user_win.show();
}
