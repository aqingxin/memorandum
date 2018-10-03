//index.js
const app = getApp()
const db=wx.cloud.database();   //获取数据库引用

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    isLogin:false,
    dataList:[],
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.onGetOpenid();
    this.onGetData();
    // this.onGetCloud();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                isLogin:true
              })
            }
          })
        }
      }
    })
  },
  onGetCloud:function(){
    wx.cloud.callFunction({
      name:'add',
      success:function(res){
      },
      fail:console.error
    })
  },
  menu:function(e){
    wx.showActionSheet({
      itemList: ['删除'],
      success:res=>{
        if (res.tapIndex === 0) {
          this.deleteItem(e.currentTarget.dataset.item._id);
        }
      }
    })
  },
  onGetData:function(){    //从云开发数据库拿取关于该用户的数据
    db.collection('memorandum').where({   //collection方法获取一个集合的引用    用where方法指定查询条件
      _openid:app.globalData.openid
    }).orderBy('date','desc').get({    //使用get方法获取数据
      success:res=>{
        this.setData({
          dataList:res.data,
        })
      }
    })
  },

  onShow:function(){
    this.onGetData();
  },
  deleteItem:function(id){   //删除用户的数据
    // console.log(id)
    db.collection('memorandum').doc(id).remove({   //使用remove方法删除数据、doc方法指定一条记录
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        this.onGetData();
      },
      fail:res=>{
        wx.showToast({
          title: '删除失败',
          icon:'none'
        })
      }
    })

  },
  jump(e){
    
    wx.navigateTo({
      url: `../add/add?type=update&id=${e.currentTarget.dataset.item._id}&content=${e.currentTarget.dataset.item.content}`,
    })
  },
  
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // wx.navigateTo({
        //   url: '../deployFunctions/deployFunctions',
        // })
      }
    })
  },
  
})
