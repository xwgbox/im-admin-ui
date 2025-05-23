/**
 * 9 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-04-23 22:49:53
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const activitiesApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/activities/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/activities/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/activities/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/activities/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/activities/batchDelete', idList);
  },

};
