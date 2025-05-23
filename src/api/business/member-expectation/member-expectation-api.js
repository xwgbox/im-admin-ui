/**
* 会员期望表 api 封装
*
* @Author:    xwg
* @Date:      2025-03-27 12:37:46
* @Copyright  001
*/
import { postRequest, getRequest } from '/@/lib/axios';

export const memberExpectationApi = {

/**
* 分页查询  @author  xwg
*/
queryPage : (param) => {
return postRequest('/memberExpectation/queryPage', param);
},

/**
* 增加  @author  xwg
*/
add: (param) => {
return postRequest('/memberExpectation/add', param);
},

/**
* 修改  @author  xwg
*/
update: (param) => {
return postRequest('/memberExpectation/update', param);
},


/**
* 删除  @author  xwg
*/
delete: (id) => {
return getRequest(`/memberExpectation/delete/${id}`);
},

/**
* 批量删除  @author  xwg
*/
batchDelete: (idList) => {
return postRequest('/memberExpectation/batchDelete', idList);
},

};
