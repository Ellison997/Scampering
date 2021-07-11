import Model from './Model'
import util from '../utils/util'

/**
 * Todo 模型类
 */
class Todo extends Model {
    constructor(model) {
        super()
        Object.assign(this, {
            title: '',
            desc: '', // 任务描述
            level: 2, // 等级
            completed: false, // 是否完成
            createdAt: new Date(), // 创建时间
            completedAt: new Date() // 完成时间
        }, model)

        // 日期格式化
        if (this.createdAt.constructor === Date) {
            this.createdAt = util.formatTime(this.createdAt)
        }
        if (this.completedAt.constructor === Date) {
            this.completedAt = util.formatTime(this.completedAt)
        }
    }
}

export default Todo