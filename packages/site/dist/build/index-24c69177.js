import{S as e,i as t,s,e as a,a as n,t as r,x as l,b as i,c,d as o,l as d,n as u,f,r as m,g,C as p,u as b,I as x,J as h,k as v}from"./main.js";import{g as _,c as S}from"./client-76b8804a.js";import{n as w}from"./quickNotifications-8de91e3f.js";import{c as y}from"./createStatusStore-326fc155.js";const E=y(),C={GET:_`
    query ListAllEmailNotifications($offset: ID, $page_size: Int!) {
      getEmailNotifications(offset: $offset, page_size: $page_size) {
        id
        subject
        status
        created_at
        user {
          id
          first_name
          last_name
        }
      }
    }`};const k=function(){let e=[],t=[];return{subscribe:function(s){return t.push(s),s(e),function(){t=t.filter(e=>e!==s)}},fetch:async function(s){E.set("FETCHING");const{data:a,errors:n}=await S.request(C.GET,s);n?(E.set("ERROR"),w.display({message:"Fehler: "+n[0].message,level:"error"})):(!function(s){e=s;for(const s of t)s(e)}(a.getEmailNotifications),E.set("FETCHED"))}}}();function j(e,t,s){const a=e.slice();return a[8]=t[s],a[10]=s,a}function U(e){let t;return{c(){t=a("div"),t.textContent="keine versendeten Emails"},m(e,s){c(e,t,s)},p:u,d(e){e&&f(t)}}}function F(e){let t,s,r,l,d=[],u=new Map,m=e[2];const g=e=>e[8].id;for(let t=0;t<m.length;t+=1){let s=j(e,m,t),a=g(s);u.set(a,d[t]=I(a,s))}return{c(){t=a("div"),s=a("header"),s.innerHTML='<div class="w-5/12">Betreff</div> \n      <div class="w-3/12 text-center">an</div> \n      <div class="w-2/12 text-center">Status</div> \n      <div class="w-2/12 text-center">Datum</div>',r=n(),l=a("ul");for(let e=0;e<d.length;e+=1)d[e].c();i(s,"class","hidden px-6 py-2 text-sm leading-none tracking-wide text-gray-600 bg-gray-200 border-b sm:flex"),i(l,"class","bg-white"),i(t,"class","overflow-hidden border rounded shadow-md")},m(e,a){c(e,t,a),o(t,s),o(t,r),o(t,l);for(let e=0;e<d.length;e+=1)d[e].m(l,null)},p(e,t){12&t&&(m=e[2],d=x(d,t,g,1,e,m,u,l,h,I,null,j))},d(e){e&&f(t);for(let e=0;e<d.length;e+=1)d[e].d()}}}function D(e){let t;return{c(){t=a("p"),t.textContent="Loading..."},m(e,s){c(e,t,s)},p:u,d(e){e&&f(t)}}}function I(e,t){let s,l,d,u,m,g,p,b,x,h,_,S,w,y,E,C,k,j,U,F=t[8].subject+"",D=t[8].user.first_name+" "+t[8].user.last_name,I="SUCCESS"===t[8].status?"Gesendet":"Fehlgeschlagen",L=new Date(1e3*t[8].created_at).toLocaleDateString()+"";return{key:e,first:null,c(){s=a("li"),l=a("div"),d=a("div"),u=r(F),m=n(),g=a("div"),p=a("a"),b=r(D),h=n(),_=a("div"),S=a("div"),w=r(I),E=n(),C=a("div"),k=a("div"),j=r(L),U=n(),i(l,"class","w-full mb-2 sm:mb-0 sm:w-5/12"),i(p,"href",x=t[3]("../users/"+t[8].user.id)),i(g,"class","flex w-full mb-2 text-gray-700 sm:items-center sm:justify-center sm:mb-0 sm:w-3/12"),i(S,"class",y="text-sm leading-none py-1 px-4 rounded-full "+("SUCCESS"===t[8].status?"bg-green-200 text-green-700":"bg-red-200 text-red-700")),i(_,"class","flex w-full mb-2 sm:items-center sm:justify-center sm:mb-0 sm:w-2/12"),i(C,"class","flex w-full mb-2 sm:items-center sm:justify-center sm:mb-0 sm:w-2/12"),i(s,"class","flex flex-wrap px-6 py-3 text-gray-800 border-b hover:bg-gray-100"),this.first=s},m(e,t){c(e,s,t),o(s,l),o(l,d),o(d,u),o(s,m),o(s,g),o(g,p),o(p,b),o(s,h),o(s,_),o(_,S),o(S,w),o(s,E),o(s,C),o(C,k),o(k,j),o(s,U)},p(e,s){t=e,4&s&&F!==(F=t[8].subject+"")&&v(u,F),4&s&&D!==(D=t[8].user.first_name+" "+t[8].user.last_name)&&v(b,D),12&s&&x!==(x=t[3]("../users/"+t[8].user.id))&&i(p,"href",x),4&s&&I!==(I="SUCCESS"===t[8].status?"Gesendet":"Fehlgeschlagen")&&v(w,I),4&s&&y!==(y="text-sm leading-none py-1 px-4 rounded-full "+("SUCCESS"===t[8].status?"bg-green-200 text-green-700":"bg-red-200 text-red-700"))&&i(S,"class",y),4&s&&L!==(L=new Date(1e3*t[8].created_at).toLocaleDateString()+"")&&v(j,L)},d(e){e&&f(s)}}}function L(e){let t,s,g,p,b,x,h,v,_,S,w,y,E,C,k,j,I,L,$;function G(e,t){return"FETCHING"===e[1]?D:e[2].length>0?F:U}let N=G(e),R=N(e);return{c(){t=a("h1"),t.textContent="Versendete Emails",s=n(),g=a("div"),p=a("div"),b=a("input"),x=n(),h=a("label"),v=r("Gesendet"),S=n(),w=a("input"),y=n(),E=a("label"),C=r("Fehlgeschlagen"),j=n(),R.c(),I=l(),i(b,"class","hidden"),i(b,"type","radio"),i(b,"name","tabs"),i(b,"id","successful"),b.__value="SUCCESS",b.value=b.__value,e[5][0].push(b),i(h,"for","successful"),i(h,"class",_="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("SUCCESS"===e[0]?"bg-teal-500 text-white":"text-teal-500")),i(w,"class","hidden"),i(w,"type","radio"),i(w,"name","tabs"),i(w,"id","failed"),w.__value="FAILURE",w.value=w.__value,e[5][0].push(w),i(E,"for","failed"),i(E,"class",k="block px-4 py-2 leading-none cursor-pointer "+("FAILURE"===e[0]?"bg-teal-500 text-white":"text-teal-500")),i(p,"class","flex mb-6 overflow-hidden text-sm text-teal-500 border border-teal-500 rounded-md"),i(g,"class","flex items-baseline justify-between")},m(a,n){c(a,t,n),c(a,s,n),c(a,g,n),o(g,p),o(p,b),b.checked=b.__value===e[0],o(p,x),o(p,h),o(h,v),o(p,S),o(p,w),w.checked=w.__value===e[0],o(p,y),o(p,E),o(E,C),c(a,j,n),R.m(a,n),c(a,I,n),L||($=[d(b,"change",e[4]),d(w,"change",e[6])],L=!0)},p(e,[t]){1&t&&(b.checked=b.__value===e[0]),1&t&&_!==(_="block px-4 py-2 leading-none border-r border-teal-500 cursor-pointer "+("SUCCESS"===e[0]?"bg-teal-500 text-white":"text-teal-500"))&&i(h,"class",_),1&t&&(w.checked=w.__value===e[0]),1&t&&k!==(k="block px-4 py-2 leading-none cursor-pointer "+("FAILURE"===e[0]?"bg-teal-500 text-white":"text-teal-500"))&&i(E,"class",k),N===(N=G(e))&&R?R.p(e,t):(R.d(1),R=N(e),R&&(R.c(),R.m(I.parentNode,I)))},i:u,o:u,d(a){a&&f(t),a&&f(s),a&&f(g),e[5][0].splice(e[5][0].indexOf(b),1),e[5][0].splice(e[5][0].indexOf(w),1),a&&f(j),R.d(a),a&&f(I),L=!1,m($)}}}function $(e,t,s){let a,n,r;g(e,E,e=>s(1,a=e)),g(e,k,e=>s(2,n=e)),g(e,b,e=>s(3,r=e)),p.title="Versendete Emails",p.description="Description coming soon...";let l="SUCCESS";return e.$$.update=()=>{1&e.$$.dirty&&k.fetch({status:l,offset:0,page_size:25})},[l,a,n,r,function(){l=this.__value,s(0,l)},[[]],function(){l=this.__value,s(0,l)}]}class G extends e{constructor(e){super(),t(this,e,$,L,s,{})}}export{G as default};
//# sourceMappingURL=index-24c69177.js.map
