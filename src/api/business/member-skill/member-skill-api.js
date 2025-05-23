/**
 * 会员技能表，用于记录会员提供的技能和服务 api 封装
 *
 * @Author:    xwg
 * @Date:      2025-04-24 23:46:46
 * @Copyright  001
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const memberSkillApi = {

  /**
   * 分页查询  @author  xwg
   */
  queryPage : (param) => {
    return postRequest('/memberSkill/queryPage', param);
  },

  /**
   * 增加  @author  xwg
   */
  add: (param) => {
      return postRequest('/memberSkill/add', param);
  },

  /**
   * 修改  @author  xwg
   */
  update: (param) => {
      return postRequest('/memberSkill/update', param);
  },


  /**
   * 删除  @author  xwg
   */
  delete: (id) => {
      return getRequest(`/memberSkill/delete/${id}`);
  },

  /**
   * 批量删除  @author  xwg
   */
  batchDelete: (idList) => {
      return postRequest('/memberSkill/batchDelete', idList);
  },

};
