/**
 * 用户表 枚举
 *
 * @Author:    xwg
 * @Date:      2025-03-27 14:09:18
 * @Copyright  001
 */



export const MEMBER_STATUS_ENUM = {
    NORMAL: {
        value: 1,
        desc: '正常'
    },
    PROHIBITED: {
        value: 0,
        desc: '禁止'
    },
    CANCEL: {
        value: 2,
        desc: '注销'
    },
}
export const MEMBER_TYPE_ENUM = {
    ORDINARY_MEMBER: {
        value: 1,
        desc: '普通会员'
    },
    ORDINARY_USER: {
        value: 0,
        desc: '普通用户'
    },
    SUPER_MEMBER: {
        value: 2,
        desc: '超级会员'
    }
}
export default {

    MEMBER_STATUS_ENUM,
    MEMBER_TYPE_ENUM
};