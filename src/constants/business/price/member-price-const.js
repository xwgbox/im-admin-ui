/**
 * 会员价格表 枚举
 *
 * @Author:    xwg
 * @Date:      2025-05-26 23:20:43
 * @Copyright  001
 */


/**
 * 价格类型（参考PriceTypeEnum）
 */
export const PRICE_TYPE_ENUM = {
    BASIC_MEMBER: {
        value: 0,
        desc: '普通会员价格',
    },
    PREMIUM_MEMBER: {
        value: 1,
        desc: '超级会员价格',
    },
}

/**
 * 时间类型（参考PriceTimeEnum）
 */
export const PRICE_TIME_ENUM = {
    MONTH: {
        value: 0,
        desc: '月',
    },
    WEEKS: {
        value: 1,
        desc: '周',
    },
    DAY: {
        value: 2,
        desc: '天',
    },
    PERMANENT: {
        value: 3,
        desc: '永久',
    },
}

export default {
    PRICE_TYPE_ENUM,
    PRICE_TIME_ENUM,
};