/**
 * 会员职业表 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-03-27 11:15:41
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberCareerApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberCareer/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/memberCareer/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/memberCareer/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/memberCareer/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/memberCareer/batchDelete', idList);
  },

};
