/**
 * 订单表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-28 09:56:48
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const orderApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/order/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/order/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/order/update', param);
  },



};
