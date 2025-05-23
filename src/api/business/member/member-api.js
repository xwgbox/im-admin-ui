/**
 * 用户表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-03-27 14:09:18
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/member/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/member/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/member/update', param);
  },



};
