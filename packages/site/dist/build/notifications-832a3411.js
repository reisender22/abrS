import{S as t,i as e,s,e as a,a as n,b as i,c as o,d as r,I as l,n as c,f,g as u,t as d,l as m,k as p,J as g,u as h}from"./main.js";import{s as x}from"./session-1b5cfdc6.js";import"./client-76b8804a.js";import"./quickNotifications-8de91e3f.js";import"./createStatusStore-326fc155.js";function b(t,e,s){const a=t.slice();return a[3]=e[s],a[5]=s,a}function y(t,e){let s,l,c,u,g,h,x,b,y,j,w,S,k,v,D,L=e[3].title+"",N=e[3].body+"",_=new Date(1e3*e[3].created_at).toLocaleString()+"";function q(){return e[2](e[3])}return{key:t,first:null,c(){s=a("li"),l=a("a"),c=a("header"),u=d(L),g=n(),h=a("p"),x=d(N),b=n(),y=a("footer"),j=a("span"),w=d(_),k=n(),i(c,"class","text-teal-600"),i(h,"class","mb-0 text-sm text-gray-600"),i(y,"class","flex justify-end mt-1 text-sm text-gray-500"),i(l,"href",S=e[1]("./"+e[3].url)),i(s,"class","px-5 py-3 mb-3 bg-white rounded-lg"),this.first=s},m(t,e){o(t,s,e),r(s,l),r(l,c),r(c,u),r(l,g),r(l,h),r(h,x),r(l,b),r(l,y),r(y,j),r(j,w),r(s,k),v||(D=m(l,"click",q,{once:!0}),v=!0)},p(t,s){e=t,1&s&&L!==(L=e[3].title+"")&&p(u,L),1&s&&N!==(N=e[3].body+"")&&p(x,N),1&s&&_!==(_=new Date(1e3*e[3].created_at).toLocaleString()+"")&&p(w,_),3&s&&S!==(S=e[1]("./"+e[3].url))&&i(l,"href",S)},d(t){t&&f(s),v=!1,D()}}}function j(t){let e,s,u,d,m,p=[],h=new Map,x=t[0].notifications;const j=t=>t[3].id;for(let e=0;e<x.length;e+=1){let s=b(t,x,e),a=j(s);h.set(a,p[e]=y(a,s))}return{c(){e=a("div"),s=a("div"),u=a("h1"),u.textContent="Benachrichtigungen",d=n(),m=a("ul");for(let t=0;t<p.length;t+=1)p[t].c();i(s,"class","max-w-xl mx-auto")},m(t,a){o(t,e,a),r(e,s),r(s,u),r(s,d),r(s,m);for(let t=0;t<p.length;t+=1)p[t].m(m,null)},p(t,[e]){3&e&&(x=t[0].notifications,p=l(p,e,j,1,t,x,h,m,g,y,null,b))},i:c,o:c,d(t){t&&f(e);for(let t=0;t<p.length;t+=1)p[t].d()}}}function w(t,e,s){let a,n;u(t,x,t=>s(0,a=t)),u(t,h,t=>s(1,n=t));return[a,n,t=>x.dismissNotification(t.id)]}class S extends t{constructor(t){super(),e(this,t,w,j,s,{})}}export{S as default};
//# sourceMappingURL=notifications-832a3411.js.map
