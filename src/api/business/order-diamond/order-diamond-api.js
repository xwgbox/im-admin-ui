/**
 * 用户钻石订单表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-28 09:56:26
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const orderDiamondApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/orderDiamond/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/orderDiamond/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/orderDiamond/update', param);
  },



};
