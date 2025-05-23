/**
 * 会员标签表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-03-27 00:28:45
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberTagApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberTag/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/memberTag/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/memberTag/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/memberTag/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/memberTag/batchDelete', idList);
  },

};
