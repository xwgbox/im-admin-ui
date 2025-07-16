/**
 * 钻石价格表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-26 23:16:54
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const diamondPriceApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/diamondPrice/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/diamondPrice/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/diamondPrice/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/diamondPrice/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/diamondPrice/batchDelete', idList);
  },

};
