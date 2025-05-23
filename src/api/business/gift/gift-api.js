/**
 * 9 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-18 15:10:27
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const giftApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/gift/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/gift/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/gift/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/gift/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/gift/batchDelete', idList);
  },

};
