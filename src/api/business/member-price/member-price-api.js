/**
 * 会员价格表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-26 23:20:43
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberPriceApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberPrice/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/memberPrice/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/memberPrice/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/memberPrice/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/memberPrice/batchDelete', idList);
  },

};
