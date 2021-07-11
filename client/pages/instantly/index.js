//index.js
import todoStore from '../../store/todoStore'
import noteStore from '../../store/noteStore'

//获取应用实例
const app = getApp()

Page({
    data: {
        // todos
        todos: [],

        // todo 计数
        uncompletedCount: 0,
        completedCount: 0,

        // 是否动画延迟
        delay: true,
        active: 0, // tab 标签

        // 笔记列表
        notes: [],
        titles: ''
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 为了新建后列表能更新，此逻辑必须写在 onShow 事件
        this.syncData()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.syncData()
    },

    /**
     * 分享
     */
    onShareAppMessage: function(options) {

    },
    onTabsChange: function() {},

    /**
     * 同步数据
     */
    syncData() {
        // 获取列表
        this.data.todos = todoStore.getTodos()
        for (const todo of this.data.todos) {
            todo.time = todo.createdAt.split(' ')[1]
        }
        // 获取笔记列表
        this.data.notes = noteStore.getNotes()

        // 更新置顶标题
        let uncompletedCount = todoStore.getUncompletedTodos().length
        let todayCompletedCount = todoStore.getTodayCompletedTodos().length
        let title = ['TodoList（进行中: ', uncompletedCount, ', 今日已完成: ', todayCompletedCount, '）'].join('')
        console.log('任务数据', this.data)
        this.data.titles = title;
        this.update()
            // wx.setTopBarText({
            //         text: title
            //     })
            // 动画结束后取消动画队列延迟
        setTimeout(() => {
            this.update({
                delay: false
            })
        }, 2000)
    },

    /**
     * Todo 数据改变事件
     */
    handleTodoItemChange(e) {
        let index = e.currentTarget.dataset.index
        let todo = e.detail.data.todo
        let item = this.data.todos[index]
        Object.assign(item, todo)
        this.update()
    },

    /**
     * Todo 长按事件
     */
    handleTodoLongTap(e) {
        // 获取 index
        let index = e.currentTarget.dataset.index
        wx.showModal({
            title: '删除提示',
            content: '确定要删除这项任务吗？',
            success: (e) => {
                if (e.confirm) {
                    this.data.todos.splice(index, 1)
                    this.update()
                }
            }
        })
    },

    /**
     * 更新数据
     */
    update(data) {
        data = data || this.data
        console.log('这是更新数据的data', data)
        data.completedCount = todoStore.getCompletedTodos().length
        data.uncompletedCount = todoStore.getUncompletedTodos().length
        this.setData(data)
    },

    /**
     * 新建事件
     */
    handleAddTodo(e) {
        wx.navigateTo({
            url: '../instantly/todoCreate'
        })
    },



    /**
     * 笔记 tap 事件
     */
    handleNoteTap(e) {
        // 判断锁
        if (this.disableTap) return
            // 获取 uuid
        let uuid = e.currentTarget.dataset.uuid
        wx.navigateTo({
            url: '../instantly/noteCreate?uuid=' + uuid
        })
    },

    /**
     * 笔记 longtap 事件
     */
    handleNoteLongTap(e) {
        // 加锁：避免触发 tap 事件
        this.disableTap = true
            // 获取 uuid
        let uuid = e.currentTarget.dataset.uuid
        wx.showModal({
            title: '删除提示',
            content: '确定要删除这个笔记吗？',
            success: (e) => {
                if (e.confirm) {
                    noteStore.removeNote(uuid)
                    noteStore.save()
                    this.syncData()
                }
            }
        })
    },

    /**
     * 笔记 touchend 事件
     */
    handleNoteTouchEnd() {
        setTimeout(() => {
            // 解锁 tap 事件
            this.disableTap = false
        }, 300)
    },

    /**
     * 新建按钮点击事件
     */
    handleAddNote() {
        wx.navigateTo({
            url: '../instantly/noteCreate'
        })
    }
})