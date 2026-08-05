/**
 * 动态 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-28 09:56:48
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const postApi = {

    /**
     * 分页查询  @author  xwg
     */
    queryPage : (param) => {
        return getRequest('/post/queryPage', param);
    },

    /**
     * 增加  @author  xwg
     */
    add: (param) => {
        return postRequest('/post/add', param);
    },

    /**
     * 修改  @author  xwg
     */
    update: (param) => {
        return postRequest('/post/update', param);
    },
    updateStatus: (param) => {
        return postRequest('/post/updateStatus', param);
    },

    detail: (param) => {
        return getRequest('/post/detail', param);
    },
    delete: (param) => {
        return getRequest('/post/delete', param);
    },


};
