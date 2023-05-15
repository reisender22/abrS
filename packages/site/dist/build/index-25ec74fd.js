import{S as e,i as t,s as l,e as r,a as n,N as s,x as a,b as i,c as o,d as c,l as d,n as u,f as p,g as f,C as h,u as x,t as m,r as b,I as g,J as _,k as v}from"./main.js";import{u as y,s as w}from"./users-89c41aba.js";import"./client-76b8804a.js";import"./quickNotifications-8de91e3f.js";import"./createStatusStore-326fc155.js";function k(e,t,l){const r=e.slice();return r[12]=t[l],r[14]=l,r}function T(e){let t,l,s,a,u,f,h,x,g,_,v,y,w,k,T,N,E,j,C,S;return{c(){t=r("div"),l=r("input"),s=n(),a=r("label"),u=m("Schüler"),h=n(),x=r("input"),g=n(),_=r("label"),v=m("Lehrer"),w=n(),k=r("input"),T=n(),N=r("label"),E=m("Admins"),i(l,"class","hidden"),i(l,"type","radio"),i(l,"name","tabs"),i(l,"id","students"),l.__value="STUDENT",l.value=l.__value,l.checked=!0,e[8][0].push(l),i(a,"for","students"),i(a,"class",f="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("STUDENT"===e[0]?"bg-teal-500 text-white":"text-teal-500")),i(x,"class","hidden"),i(x,"type","radio"),i(x,"name","tabs"),i(x,"id","teachers"),x.__value="TEACHER",x.value=x.__value,e[8][0].push(x),i(_,"for","teachers"),i(_,"class",y="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("TEACHER"===e[0]?"bg-teal-500 text-white":"text-teal-500")),i(k,"class","hidden"),i(k,"type","radio"),i(k,"name","tabs"),i(k,"id","admins"),k.__value="ADMIN",k.value=k.__value,e[8][0].push(k),i(N,"for","admins"),i(N,"class",j="block px-4 py-2 leading-none cursor-pointer "+("ADMIN"===e[0]?"bg-teal-500 text-white":"text-teal-500")),i(t,"class","flex overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md")},m(r,n){o(r,t,n),c(t,l),l.checked=l.__value===e[0],c(t,s),c(t,a),c(a,u),c(t,h),c(t,x),x.checked=x.__value===e[0],c(t,g),c(t,_),c(_,v),c(t,w),c(t,k),k.checked=k.__value===e[0],c(t,T),c(t,N),c(N,E),C||(S=[d(l,"change",e[7]),d(x,"change",e[9]),d(k,"change",e[10])],C=!0)},p(e,t){1&t&&(l.checked=l.__value===e[0]),1&t&&f!==(f="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("STUDENT"===e[0]?"bg-teal-500 text-white":"text-teal-500"))&&i(a,"class",f),1&t&&(x.checked=x.__value===e[0]),1&t&&y!==(y="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("TEACHER"===e[0]?"bg-teal-500 text-white":"text-teal-500"))&&i(_,"class",y),1&t&&(k.checked=k.__value===e[0]),1&t&&j!==(j="block px-4 py-2 leading-none cursor-pointer "+("ADMIN"===e[0]?"bg-teal-500 text-white":"text-teal-500"))&&i(N,"class",j)},d(r){r&&p(t),e[8][0].splice(e[8][0].indexOf(l),1),e[8][0].splice(e[8][0].indexOf(x),1),e[8][0].splice(e[8][0].indexOf(k),1),C=!1,b(S)}}}function N(e){let t,l,n;return{c(){t=r("input"),i(t,"class","w-2/3 inp"),i(t,"type","text"),i(t,"placeholder","Suchen...")},m(r,s){o(r,t,s),l||(n=d(t,"input",e[6]),l=!0)},p:u,d(e){e&&p(t),l=!1,n()}}}function E(e){let t;return{c(){t=r("div"),t.textContent="keine Benutzer"},m(e,l){o(e,t,l)},p:u,d(e){e&&p(t)}}}function j(e){let t,l,s,a,d=[],u=new Map,f=e[4];const h=e=>e[12].id;for(let t=0;t<f.length;t+=1){let l=k(e,f,t),r=h(l);u.set(r,d[t]=S(r,l))}return{c(){t=r("div"),l=r("header"),l.innerHTML='<div class="w-4/12">Name</div> \n      <div class="w-8/12">Adresse</div>',s=n(),a=r("div");for(let e=0;e<d.length;e+=1)d[e].c();i(l,"class","hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b sm:flex"),i(a,"class","bg-white"),i(t,"class","overflow-hidden border rounded shadow-md")},m(e,r){o(e,t,r),c(t,l),c(t,s),c(t,a);for(let e=0;e<d.length;e+=1)d[e].m(a,null)},p(e,t){20&t&&(f=e[4],d=g(d,t,h,1,e,f,u,a,_,S,null,k))},d(e){e&&p(t);for(let e=0;e<d.length;e+=1)d[e].d()}}}function C(e){let t;return{c(){t=r("p"),t.textContent="Loading..."},m(e,l){o(e,t,l)},p:u,d(e){e&&p(t)}}}function S(e,t){let l,s,a,d,u,f,h,x,b,g,_,y,w,k=t[12].first_name+" "+t[12].last_name,T=t[12].email+"",N=[t[12].address_line_1,t[12].address_line_2,t[12].postal_code+" "+t[12].locality,t[12].country].filter(Boolean).join(", ")+"";return{key:e,first:null,c(){l=r("a"),s=r("div"),a=r("div"),d=m(k),u=n(),f=r("div"),h=m(T),x=n(),b=r("div"),g=r("div"),_=m(N),y=n(),i(f,"class","text-sm text-gray-700"),i(s,"class","w-full mb-2 sm:mb-0 sm:w-4/12"),i(b,"class","flex items-center w-full mb-2 sm:mb-0 sm:w-8/12"),i(l,"href",w=t[2]("./"+t[12].id)),i(l,"class","flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100"),this.first=l},m(e,t){o(e,l,t),c(l,s),c(s,a),c(a,d),c(s,u),c(s,f),c(f,h),c(l,x),c(l,b),c(b,g),c(g,_),c(l,y)},p(e,r){t=e,16&r&&k!==(k=t[12].first_name+" "+t[12].last_name)&&v(d,k),16&r&&T!==(T=t[12].email+"")&&v(h,T),16&r&&N!==(N=[t[12].address_line_1,t[12].address_line_2,t[12].postal_code+" "+t[12].locality,t[12].country].filter(Boolean).join(", ")+"")&&v(_,N),20&r&&w!==(w=t[2]("./"+t[12].id))&&i(l,"href",w)},d(e){e&&p(l)}}}function A(e){let t,l,f,h,x,m,b,g,_,v,y,w,k,S,A,B;function D(e,t){return e[1]?N:T}let H=D(e),M=H(e);function z(e,t){return"FETCHING"===e[3]?C:e[4].length>0?j:E}let I=z(e),L=I(e);return{c(){t=r("h1"),t.textContent="Benutzer",l=n(),f=r("div"),M.c(),h=n(),x=r("div"),m=r("button"),m.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-current"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',b=n(),g=r("a"),_=s("svg"),v=s("line"),y=s("line"),k=n(),L.c(),S=a(),i(m,"class","p-2 mr-3 text-teal-700 bg-gray-100 rounded-full hover:bg-teal-200"),i(v,"x1","12"),i(v,"y1","5"),i(v,"x2","12"),i(v,"y2","19"),i(y,"x1","5"),i(y,"y1","12"),i(y,"x2","19"),i(y,"y2","12"),i(_,"width","20"),i(_,"height","20"),i(_,"viewBox","0 0 24 24"),i(_,"fill","none"),i(_,"stroke","currentColor"),i(_,"stroke-width","2"),i(_,"stroke-linecap","round"),i(_,"stroke-linejoin","round"),i(_,"class","stroke-current"),i(g,"href",w=e[2]("./new")),i(g,"class","p-2 text-teal-700 bg-gray-100 rounded-full hover:bg-teal-200"),i(x,"class","flex items-center"),i(f,"class","flex flex-wrap items-end justify-between mb-6")},m(r,n){o(r,t,n),o(r,l,n),o(r,f,n),M.m(f,null),c(f,h),c(f,x),c(x,m),c(x,b),c(x,g),c(g,_),c(_,v),c(_,y),o(r,k,n),L.m(r,n),o(r,S,n),A||(B=d(m,"click",e[5]),A=!0)},p(e,[t]){H===(H=D(e))&&M?M.p(e,t):(M.d(1),M=H(e),M&&(M.c(),M.m(f,h))),4&t&&w!==(w=e[2]("./new"))&&i(g,"href",w),I===(I=z(e))&&L?L.p(e,t):(L.d(1),L=I(e),L&&(L.c(),L.m(S.parentNode,S)))},i:u,o:u,d(e){e&&p(t),e&&p(l),e&&p(f),M.d(),e&&p(k),L.d(e),e&&p(S),A=!1,B()}}}function B(e,t,l){let r,n,s;f(e,x,e=>l(2,r=e)),f(e,w,e=>l(3,n=e)),f(e,y,e=>l(4,s=e)),h.title="Benutzer";let a="STUDENT",i=!1;return e.$$.update=()=>{1&e.$$.dirty&&y.fetch({role:a,offset:"0",page_size:25})},[a,i,r,n,s,function(){i?(l(1,i=!1),y.fetch({role:a,offset:"0",page_size:25})):l(1,i=!0)},e=>y.search(e.target.value),function(){a=this.__value,l(0,a)},[[]],function(){a=this.__value,l(0,a)},function(){a=this.__value,l(0,a)}]}class D extends e{constructor(e){super(),t(this,e,B,A,l,{})}}export{D as default};
//# sourceMappingURL=index-25ec74fd.js.map