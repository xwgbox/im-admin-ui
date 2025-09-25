/**
 * IM api 封装
 *
 * @Author:    xwg
 * @Date:      2025-07-23 09:42:08
 * @Copyright  001
 */
import { getRequest } from '/@/lib/axios';

export const customerApi = {

  /**
   * im查询  @author  xwg
   */
  queryCustomer : (param) => {
    return getRequest('/im/customer', param);
  },


};
