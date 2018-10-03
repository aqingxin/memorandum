// miniprogram/pages/add/add.js
const app=getApp();
const db = wx.cloud.database();   //获取数据库的引用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    type:'',
    itemId:'',
    autoFoucs:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    //设置上个页面传过来的值 
    this.setData({
      type:options.type,
      // id:
    })
    if(options.type==='update'){
      this.setData({
        value:options.content,
        itemId:options.id,
        autoFoucs:false
      })
    }
  },

  fSubmit:function(e){
    let date=new Date();
    // let year=date.getFullYear();
    // let month=date.getMonth();
    // let day=date.getDate();
    // console.log(date)
    if(this.data.type==='add'){   //如果页面的进来是带的参数是add则为新建数据
      if (e.detail.value.textarea.replace(/(^\s*)|(\s*$)/g, "")){
        db.collection('memorandum').add({   //使用add方法添加数据
          data:{
            // openid:app.globalData.openid,
            content:e.detail.value.textarea,
            date: date.toLocaleString()
          },
          success:res=>{
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function(){
              wx.navigateBack()
            },2000)
          },
          fail:res=>{
            wx.showToast({
              title: '提交失败',
            })
          }
        })
      }
    }else{    //否则就是更新数据事件
      db.collection('memorandum').doc(this.data.itemId).update({   //使用update方法更新数据   doc仅获取一条数据
        data:{
          date: date.toLocaleString(),
          content: e.detail.value.textarea
        },
        success:res=>{
          wx.showToast({
            title: '更新成功',
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 2000)
        },
        fail:res=>{
          wx.showToast({
            title: '更新失败',
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})