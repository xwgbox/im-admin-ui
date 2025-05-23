/**
 * 用户举报表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-05-20 00:50:35
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberReportsApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberReports/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/memberReports/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/memberReports/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/memberReports/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/memberReports/batchDelete', idList);
  },

};
