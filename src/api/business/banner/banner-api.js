/**
 * 轮播图 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-07-23 09:42:08
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const bannerApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/banner/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/banner/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/banner/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/banner/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/banner/batchDelete', idList);
  },

};
