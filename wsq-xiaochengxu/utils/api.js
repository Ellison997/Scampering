const util = require('util.js')
const kawa = require('../kawa.js')

// ALL server-side API
const Host = "http://127.0.0.1:8080"
const AppKey = kawa.AppKey

let g = {
  token: "",
}

// setup promise
/**
 * promise请求
 * 参数：参考wx.request
 * 返回值：[promise]res
 */
function req(options = {}) {
  const {
    url,
    data,
    method,
    dataType,
    responseType,
    success,
    fail,
    complete
  } = options;

  // inject token
  const header = Object.assign({
    'Authorization': `Bearer ${g.token}`,
    'AppKey': AppKey, 
  }, options.header);

  return new Promise((res, rej) => {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success(r) {
        if (r.statusCode == 200) {
          res(r);
        } else if (r.statusCode == 401) {
          console.log("invalid token: 401")
          // 给调用端返回一个空集，形成完整的调用链
          res({data: []})
          // 拦截并处理错误
          loginExpired()
        } else {
          rej({ code: r.statusCode, err: r.data })
        }
      },
      fail(err) {
        rej({ code: -1, err: err });
      },
      complete
    });
  });
}

// 重定向到登录页面, 这个方法实际上会被触发多次
// 目前测试看，多次调用并不会产生问题...
function loginExpired() {
  wx.reLaunch({
    url: '/pages/login/login?man=true',
  })
  wx.showToast({
    title: '会话过期', icon: 'none'
  })
  // 删除旧的 token
  try {
    wx.removeStorageSync('token')
  } catch (e) { }
}

/**
 * 判断请求状态是否成功
 * 参数：http状态码
 * 返回值：[Boolen]
 */
function isHttpSuccess(status) {
  return status >= 200 && status < 300 || status === 304;
}

// JSON 转 Query
function jsonQueryString(params) {
  if (!params) {
    return ""
  }
  return Object.keys(params).map(key => key + '=' + (params[key] !== undefined ? params[key] : '')).join('&');
}

// login
// if login success goto home, then register and login
// 自动授权
function autoAuth() {
  console.log("start auto auth..")
  return new Promise((res, rej) => {
    // check localstorage first
    const value = wx.getStorageSync('token')    // 登录的时候把token 放到了storage里面
    if (value && !util.jwtExpire(value)) {
      g.token = value     // 访问接口的时候使用全局变量
      
      const app = getApp()
      if (app) {
        app.setToken(value)
      }
      
      res(value)
      return
    }

    console.log("try login..", value)

    // try to auth
    wx.login({
      success: function (resp) {
        if (resp.code) {
          console.log('get code:', resp.code)
          req({
            url: `${Host}/auth`,
            method: 'POST',
            data: {
              code: resp.code,
            }
          }).then((resp) => {
            // 返回一个本地的 Token
            console.log(resp)
            if (resp.statusCode == 200) {
              //success, save token
              g.token = resp.data.access_token
              const app = getApp()
              if (app) {
                app.setToken(g.token)
              }
              console.log("get token", resp.data)
              res(g.token)
              wx.setStorage({
                key: 'token',
                data: g.token
              })
            } else {
              rej({ code: -1, err: 'fail:' + resp.statusCode})
            }
          }).catch((err) => {
            console.log(err)
            rej({ code: -1, err: err })
          })
        } else {
          rej({ code: -1, err: 'wx.login return nil code' })
        }
      },
      fail: function(err) {
        rej({ code: -1, err: err })
      },
    })
  })
}

// Promised method: User/Post/Comment
function auth() {
  wx.login({
    success: function(resp) {
      if (resp.code) {
        req({
          url: `${Host}/auth`,
          method: 'POST',
          data: {
            code: resp.code,
          }
        })
      }
    }
  })
}

// mata-data

function getMetaData() {
  return req({
    url: `${Host}/metadata`,
    method: 'GET'
  })
}

// 签到API
function signin(date) {
  if (!date) {
    date = ''
  }
  return req({
    url: `${Host}/signs?date=${date}`,
    method: 'POST',
  })
}

function getSignToday() {
  return req({
    url: `${Host}/signs/today`,
    method: 'GET'
  })
}

function getSignList() {
  return req({
    url: `${Host}/signs`,
    method: 'GET'
  })
}

function getSignUserList(page, size) {
  return req({
    url: `${Host}/signs/users?page=${page}&size=${size}`,
    method: 'GET'
  })
}

function getUserList(sort, page, size) {
  return req({
    url: `${Host}/users?sort=${sort}&page=${page}&size=${size}`,
    method: 'GET'
  })
}

// update user profile
function updateUser(data) {
  return req({
    url: `${Host}/users`,
    method: 'PUT',
    data: data,
  })
}

// return self user-info
function self() {
  return req({
    url: `${Host}/users/self`,
    method: 'GET'
  })
}

function getUserPostList(uid, since, limit) {
  return req({
    url: `${Host}/users/${uid}/posts?since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getUserCommentList(uid, since, limit) {
  return req({
    url: `${Host}/users/${uid}/comments?since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getUserFavorList(uid, since, limit) {
  return req({
    url: `${Host}/users/${uid}/favors?since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getUserFavoriteList(uid, page, size) {
  return req({
    url: `${Host}/users/${uid}/favorites?page=${page}&size=${size}`,
    method: 'GET'
  })
}

// 关注关系
function follow(uid) {
  return req({
    url: `${Host}/users/followings`,
    method: 'POST',
    data: {user_id: uid}
  })
}

function unfollow(uid) {
  return req({
    url: `${Host}/users/followings/${uid}`,
    method: 'DELETE'
  })
}

function isFollowing(uid) {
  return req({
    url: `${Host}/users/followings/${uid || 0}`,
    method: 'GET'
  })
}

function getFollowingList(uid, page, size) {
  return req({
    url: `${Host}/users/${uid || 0}/followings?page=${page || 0}&size=${size || 20}`,
    method: 'GET'
  })
}

function getFollowerList(uid, page, size) {
  return req({
    url: `${Host}/users/${uid || 0}/followers?page=${page || 0}&size=${size || 20}`,
    method: 'GET'
  })
}

// get post list, fitler: top,val,adz, topic
function getPostList(since, limit, filter, topic) {
  if (!topic) {
    return req({
      url: `${Host}/posts?since_id=${since}&limit=${limit}&filter=${filter}`,
      method: 'GET'
    })
  } else {
    var encoded = encodeURIComponent(topic)
    return req({
      url: `${Host}/tags/${encoded}/posts?since_id=${since}&limit=${limit}`,
      method: 'GET'
    })
  }
}

function getPost(id) {
  return req({
    url: `${Host}/posts/${id}`,
    method: 'GET'
  })
}

// create post
function createPost(data) {
  return req({
    url: `${Host}/posts`,
    method: 'POST',
    data: data,
  })
}

// update post
function updatePost(id, data) {
  return req({
    url: `${Host}/posts/${id}`,
    method: 'PUT',
    data: data
  })
}

// set post status
function setPostStatus(id, data) {
  return req({
    url: `${Host}/posts/${id}/st?` + jsonQueryString(data),
    method: 'PUT',
  })
}

// 隐藏
function hidePost(id, v) {
  return setPostStatus(id, {'hid': v})
}
// 置顶
function pinPost(id, v) {
  return setPostStatus(id, {'top': v})
}
// 加精
function valPost(id, v) {
  return setPostStatus(id, { 'val': v })
}
// 审核
function auditPost(id) {
  return setPostStatus(id,{ 'aud': 1 })
}

// delete post
function deletePost(id) {
  return req({
    url: `${Host}/posts/${id}`,
    method: 'DELETE'
  })
}

// get comment list
function getCommentList(pid, since, limit) {
  return req({
    url: `${Host}/posts/${pid}/comments?since_id=${since || 0}&limit=${limit || 20}`,
    method: 'GET'
  })
}

function getComment(id) {
  return req({
    url: `${Host}/posts/comments/${id}`,
    method: 'GET'
  })
}

function createComment(data) {
  return req({
    url: `${Host}/posts/comments`,
    method: 'POST',
    data: data,
  })
}

function updateComment(id, data) {
  return req({
    url: `${Host}/posts/comments/${id}`,
    method: 'PUT'
  })
}

function deleteComment(id) {
  return req({
    url: `${Host}/posts/comments/${id}`,
    method: 'DELETE'
  })
}

// favors
function getPostFavorList(pid, since, limit) {
  return req({
    url: `${Host}/posts/${pid}/favors?since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getPostFavorCount(pid) {
  return req({
    url: `${Host}/posts/${pid}/favors/count`,
    method: 'GET'
  })
}

function createPostFavor(pid) {
  return req({
    url: `${Host}/posts/favors`,
    method: 'POST',
    data: {pid: pid}
  })
}

function deletePostFavor(pid) {
  return req({
    url: `${Host}/posts/${pid}/favors`,
    method: 'DELETE'
  })
}

// comment favors
function getCommentFavorList(cid, since, limit) {
  return req({
    url: `${Host}/comments/${cid}/favors?since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getCommentFavorCount(cid) {
  return req({
    url: `${Host}/comments/${cid}/favors/count`,
    method: 'GET'
  })
}

function createCommentFavor(cid) {
  return req({
    url: `${Host}/comments/favors`,
    method: 'POST',
    data: {cid: cid} 
  })
}

function deleteCommentFavor(cid) {
  return req({
    url: `${Host}/comments/${cid}/favors`,
    method: 'DELETE'
  })
}

// tags
function getPostByTag(tag) {
  var encoded = encodeURIComponent(tag)
  return req({
    url: `${Host}/tags/${encoded}/posts`,
    method: 'GET'
  })
}

function getTagList() {
  return req({
    url: `${Host}/tags`,
    method: 'GET'
  })
}

function linkTagPost(data) {
  return req({
    url: `${Host}/tags/posts`,
    method: 'POST',
    data: data,
  })
}

// message
function getMessageList(q, since, limit) {
  return req({
    url: `${Host}/messages?q=${q}&since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function getMessageCount() {
  return req({
    url: `${Host}/messages/count`,
    method: 'GET'
  })
}

function setMessageRead(id) {
  return req({
    url: `${Host}/messages/${id}/read`,
    method: 'PUT'
  })
}

function setAllMessageRead(which) {
  return req({
    url: `${Host}/messages/read?type=${which}`,
    method: 'PUT'
  })
}

// 私信接口
function getChatUserList(since, limit) {
  return req({
    url: `${Host}/chat/users?since_id=${since || 0}&limit=${limit || 20}`,
    method: 'GET'
  })
}

function getChatListFrom(uid, since, limit) {
  if (!since) {
    since = ''  
  }
  if (!limit) {
    limit = ''
  }
  return req({
    url: `${Host}/chat/messages?from=${uid}&since_id=${since}&limit=${limit}`,
    method: 'GET'
  })
}

function createChatMessage(data) {
  return req({
    url: `${Host}/chat/messages`,
    method: 'POST',
    data: data,
  })
}

function setChatMessageReadFrom(uid) {
  return req({
    url: `${Host}/chat/messages/read?from=${uid}`,
    method: 'PUT'
  })
}

// 经验等级
function getGradeList() {
  return req({
    url: `${Host}/exp/grades`,
    method: 'GET'
  })
}

function getExpKindList() {
  return req({
    url: `${Host}/exp/types`,
    method: 'GET'
  })
}

function getUserListExp(page, size) {
  return req({
    url: `${Host}/exp/users?page=${page}&size=${size}`,
    method: 'GET'
  })
}

// 收藏接口
function createFavorite(pid) {
  return req({
    url: `${Host}/posts/${pid}/favorites`,
    method: 'POST'
  })
}

function deleteFavorite(pid) {
  return req({
    url: `${Host}/posts/${pid}/favorites`,
    method: 'DELETE'
  })
}

// 创建媒体
function createMedia(data) {
  return req({
    url: `${Host}/medias`,
    method: 'POST',
    data: data,
  })
}

// 举报接口
function createReport(data) {
  return req({
    url: `${Host}/reports`,
    method: 'POST',
    data: data,
  })
}

// 解密接口
function decrypt(data) {
  return req({
    url: `${Host}/actions/decrypt`,
    method: 'POST',
    data: data,
  })
}

// 链接预览
function linkPreview(url) {
  return req({
    url: `${Host}/actions/link_preview`,
    method: 'POST',
    data: { url: url }
  })
}

// 生成二维码
function createQrCode() {
  return req({
    url: `${Host}/actions/create_qrcode`,
    method: 'POST'
  })
}

// 获取自定义广告
function getAdunitList(t) {
  return req({
    url: `${Host}/adunits?p=mp&status=0&t=${t}`,
    method: 'GET'
  })
}

// 获取投票
function getPollList() {
  return req({
    url: `${Host}/polls?active=true`,
    method: 'GET'
  })
}

function getPoll(id) {
  return req({
    url: `${Host}/polls/${id}`,
    method: `GET`
  })
}

function createVote(data) {
  return req({
    url: `${Host}/polls/votes`,
    method: `POST`,
    data: data,
  })
}

// 申请加入
function createJoinRequest(data) {
  return req({
    url: `${Host}/joins/auth`,
    method: `POST`,
    data, data,
  })
}

function getJoinRequest(data) {
  return req({
    url: `${Host}/joins/auth`,
    method: 'GET',
    data: data,
  })
}

// 社区元信息
function getAppMeta() {
  return req({
    url: `${Host}/app/meta`,
    method: `GET`
  })
}

// 上传图片
function uploadFile(file) {
  return new Promise((res, rej) => {
    wx.uploadFile({
      url: 'https://kawaapp.com/x/images',
      filePath: file,
      name: 'file',
      success: function (resp) {
        if (resp.statusCode == 200) {
          res(resp.data)
        } else {
          rej({ code: resp.statusCode, msg: resp.data })
        }
      },
      fail: function (resp) {
        rej({ code: -1, msg: resp })
      }
    })
  })
}

// 获取文章
function getArticle(appKey, id) {
  const url = `https://wsq.kawaapp.com/articles/${id}`
  const header = { 'AppKey': appKey }
  const method = 'GET'
  return new Promise((res, rej) => {
    wx.request({ url, header, method,
      success(r) {
        if (r.statusCode == 200) {
          res(r);
        }
      },
      fail(err) {
        rej({ code: -1, err: err });
      },
    });
  });
}

module.exports = {
  autoAuth: autoAuth,
  updateUser: updateUser,
  getSelf: self,
  getUserList: getUserList,
  getUserPostList: getUserPostList,
  getUserCommentList: getUserCommentList,
  getUserFavorList: getUserFavorList,
  getUserFavoriteList: getUserFavoriteList,

  // follow
  isFollowing: isFollowing,
  follow: follow,
  unfollow: unfollow,
  getFollowingList: getFollowingList,
  getFollowerList: getFollowerList,

  // meta
  getMetaData: getMetaData,

  // post
  getPostList: getPostList,
  getPost: getPost,
  createPost: createPost,
  deletePost: deletePost,
  hidePost: hidePost,
  pinPost: pinPost,
  valPost: valPost,



  // comment
  getCommentList: getCommentList,
  getComment: getComment,
  createComment: createComment,
  updateComment: updateComment,
  deleteComment: deleteComment,

  // favors
  getPostFavorList: getPostFavorList,
  getPostFavorCount: getPostFavorCount,
  createPostFavor: createPostFavor,
  deletePostFavor: deletePostFavor,

  getCommentList: getCommentList,
  getCommentFavorCount: getCommentFavorCount,
  createCommentFavor: createCommentFavor,
  deleteCommentFavor: deleteCommentFavor,

  // tags
  getPostByTag: getPostByTag,
  getTagList: getTagList,
  linkTagPost: linkTagPost,

  // messages
  getMessageList: getMessageList,
  getMessageCount: getMessageCount,
  setMessageRead: setMessageRead,
  setAllMessageRead: setAllMessageRead,

  // chat
  getChatUserList: getChatUserList,
  getChatMsgListFrom: getChatListFrom,
  createChatMessage: createChatMessage,
  setChatMessageRead: setChatMessageReadFrom,

  // reports
  createReport: createReport,

  // signin
  signin: signin,
  getSignToday: getSignToday,
  getSignList: getSignList,
  getSignUserList: getSignUserList,

  // exp
  getGradeList: getGradeList,
  getExpKindList: getExpKindList,
  getUserListExp: getUserListExp,

  // favorite
  createFavorite: createFavorite,
  deleteFavorite: deleteFavorite,

  // media
  createMedia: createMedia,
  
  // actions
  decrypt: decrypt,
  linkPreview: linkPreview,
  createQrCode: createQrCode,

  // upload
  uploadFile: uploadFile,

  // article
  getArticle: getArticle,

  // ad-unit
  getAdunitList: getAdunitList,

  // poll
  getPollList: getPollList,
  getPoll: getPoll,
  createVote: createVote,

  // join
  createJoinRequest: createJoinRequest,
  getJoinRequest: getJoinRequest,
  getAppMeta: getAppMeta,
}
