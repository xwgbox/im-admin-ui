/**
 * 用户表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-03-27 14:09:18
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberBillApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberBill/queryPage', param);
  },




};
