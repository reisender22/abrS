import{g as e,c as s}from"./client-76b8804a.js";import{n as r}from"./quickNotifications-8de91e3f.js";import{c as t}from"./createStatusStore-326fc155.js";const o=t(),a=e`
    id
    email
    first_name
    last_name
    address_line_1
    address_line_2
    postal_code
    locality
    country`,i={GET:e`
    query ListUsersByRole($role: Role, $offset: ID, $page_size: Int) {
      getUsers(role: $role, offset: $offset, page_size: $page_size) {
        ${a}
      }
    }`,GET_BY_SEARCH_QUERY:e`
    query SearchUsers($query: String!, $roles: [Role!], $page_size: Int) {
      searchUsers(query: $query, roles: $roles, page_size: $page_size) {
        ${a}
      }
    }`};const n=function(){let e=[],t=[];function a(s){e=s;for(const s of t)s(e)}return{reset:function(){a([])},fetch:async function({role:e="all",offset:t="0",page_size:n=20}={}){o.set("FETCHING");const{data:l,errors:c}=await s.request(i.GET,{role:e,offset:t,page_size:n});c?(o.set("ERROR"),r.display({message:"Fehler: "+c[0].message,level:"error"})):(a(l.getUsers),o.set("FETCHED"))},search:async function(e,{roles:t,page_size:n}={}){o.set("FETCHING");const{data:l,errors:c}=await s.request(i.GET_BY_SEARCH_QUERY,{query:e,roles:t,page_size:n});c?(o.set("ERROR"),r.display({message:"Fehler: "+c[0].message,level:"error"})):(a(l.searchUsers),o.set("FETCHED"))},subscribe:function(s){return t.push(s),s(e),function(){t=t.filter(e=>e!==s)}}}}();export{o as s,n as u};
//# sourceMappingURL=users-89c41aba.js.map
