import{S as e,i as t,s as n,x as s,c as i,n as l,f as r,g as c,e as a,a as o,t as u,b as d,d as f,l as m,k as p,I as h,J as v,r as g,h as _,j as y,K as b,w,q as x,o as C}from"./main.js";import{f as $}from"./currency-0efccd32.js";import{c as E}from"./classes-60edc9b1.js";import{g as q}from"./time-73fe1d75.js";import{g as j,c as k}from"./client-76b8804a.js";import{n as I}from"./quickNotifications-8de91e3f.js";import{c as R}from"./createStatusStore-326fc155.js";import{c as T}from"./class-1bdaf5f9.js";const A=R();j`
    query GetInvoice($id: ID!) {
      getInvoice(id: $id) {
        id
        amount
        items {
          description
        }
        state
        customer_first_name
        customer_last_name
        customer_address_line_1
        customer_address_line_2
        customer_postal_code
        customer_locality
        customer_country
        created_at
        payments {
          id
        }
        student {
          id
        }
      }
    }
  `;const N={CREATE:j`
    mutation CreateInvoice($input: InvoiceInput!) {
      createInvoice(input: $input) {
        id
      }
    }
  `};const M=function(){let e=[],t=[];return{fetch:async function(e){},create:async function(n){A.set("CREATING");const{data:s,errors:i}=await k.request(N.CREATE,{input:n});i?(A.set("ERROR"),I.display({message:"Fehler: "+i[0].message,level:"error"})):(!function(n){e=n;for(const n of t)n(e)}(s.createInvoice),A.set("CREATED"),I.display({message:"Rechnung wurder erstellt."}))},subscribe:function(n){return t.push(n),n(e),function(){t=t.filter(e=>e!==n)}}}}();function G(e,t,n){const s=e.slice();return s[24]=t[n],s[25]=t,s[26]=n,s}function L(e,t,n){const s=e.slice();return s[27]=t[n].id,s[28]=t[n].subject,s[29]=t[n].times,s[30]=t[n].teacher,s}function D(e,t,n){const s=e.slice();return s[27]=t[n].id,s[28]=t[n].subject,s[29]=t[n].times,s[30]=t[n].teacher,s}function K(e){let t,n,s,l,c,_,y,b,w,x,C,E,q,j,k,I,R,T,A,N,M,L,D,K,B,H,S,O,F,U,Q,V,W,X,Y,Z,ee,te,ne,se=e[1].first_name+" "+e[1].last_name,ie=[],le=new Map,re=$.format(e[5].items.reduce(J,0)/100)+"",ce="CREATING"===e[4]?"Einen Moment...":e[2]?"Klasse wechseln":"Erstellen",ae=e[2]&&z(e),oe=e[5].items;const ue=e=>e[24];for(let t=0;t<oe.length;t+=1){let n=G(e,oe,t),s=ue(n);le.set(s,ie[t]=P(s,n))}return{c(){t=a("div"),n=a("div"),s=a("div"),l=o(),c=a("div"),_=a("div"),y=a("header"),b=a("p"),w=u("Neue Rechnung für\n              "),x=u(se),C=o(),ae&&ae.c(),E=o(),q=a("div"),j=a("div"),k=a("button"),k.textContent="Unterricht",I=o(),R=a("button"),R.textContent="Material",T=o(),A=a("div"),A.innerHTML='<div class="w-7/12 mr-3 text-sm text-gray-700">Beschreibung</div> \n              <div class="w-2/12 mr-3 text-sm text-gray-700 uppercase">Preis</div> \n              <div class="w-2/12 text-sm text-gray-700 uppercase">Menge</div> \n              <div class="w-1/12"></div>',N=o();for(let e=0;e<ie.length;e+=1)ie[e].c();M=o(),L=a("div"),D=a("div"),K=o(),B=a("div"),B.textContent="Gesamt:",H=o(),S=a("div"),O=u(re),F=o(),U=a("div"),Q=o(),V=a("footer"),W=a("button"),W.textContent="Abbrechen",X=o(),Y=a("button"),Z=u(ce),d(s,"class","absolute top-0 left-0 z-40 w-full h-full bg-black opacity-75"),d(b,"class","m-0 text-xl"),d(y,"class","p-4 bg-white"),d(k,"class","mr-3 text-green-600 focus:outline-none hover:text-green-700"),d(R,"class","text-green-600 focus:outline-none hover:text-green-700"),d(j,"class","flex justify-end mb-6"),d(A,"class","flex mb-1"),d(D,"class","w-7/12 mr-3"),d(B,"class","w-2/12 mr-3"),d(S,"class","w-2/12 font-semibold text-teal-700"),d(U,"class","w-1/12"),d(L,"class","flex"),d(q,"class","p-4 bg-white"),d(W,"class","btn btn--secondary"),Y.disabled=ee="CREATING"===e[4],d(Y,"class","btn btn--primary"),d(V,"class","flex justify-between p-4 bg-gray-200"),d(_,"class","w-full overflow-hidden bg-gray-100 rounded shadow sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"),d(c,"class","absolute top-0 left-0 z-50 flex items-end justify-center w-full h-full p-4 sm:items-center"),d(n,"class","fixed top-0 left-0 z-20 w-full min-h-screen")},m(r,a){i(r,t,a),f(t,n),f(n,s),f(n,l),f(n,c),f(c,_),f(_,y),f(y,b),f(b,w),f(b,x),f(_,C),ae&&ae.m(_,null),f(_,E),f(_,q),f(q,j),f(j,k),f(j,I),f(j,R),f(q,T),f(q,A),f(q,N);for(let e=0;e<ie.length;e+=1)ie[e].m(q,null);f(q,M),f(q,L),f(L,D),f(L,K),f(L,B),f(L,H),f(L,S),f(S,O),f(L,F),f(L,U),f(_,Q),f(_,V),f(V,W),f(V,X),f(V,Y),f(Y,Z),te||(ne=[m(k,"click",e[8]),m(R,"click",e[7]),m(W,"click",e[10]),m(Y,"click",e[11])],te=!0)},p(e,t){2&t[0]&&se!==(se=e[1].first_name+" "+e[1].last_name)&&p(x,se),e[2]?ae?ae.p(e,t):(ae=z(e),ae.c(),ae.m(_,E)):ae&&(ae.d(1),ae=null),608&t[0]&&(oe=e[5].items,ie=h(ie,t,ue,1,e,oe,le,q,v,P,M,G)),32&t[0]&&re!==(re=$.format(e[5].items.reduce(J,0)/100)+"")&&p(O,re),20&t[0]&&ce!==(ce="CREATING"===e[4]?"Einen Moment...":e[2]?"Klasse wechseln":"Erstellen")&&p(Z,ce),16&t[0]&&ee!==(ee="CREATING"===e[4])&&(Y.disabled=ee)},d(e){e&&r(t),ae&&ae.d();for(let e=0;e<ie.length;e+=1)ie[e].d();te=!1,g(ne)}}}function z(e){let t,n,s,l,c,u,p,h,v=e[6],g=[];for(let t=0;t<v.length;t+=1)g[t]=B(D(e,v,t));return{c(){t=a("form"),n=a("div"),s=a("label"),s.textContent="Neue Klasse",l=o(),c=a("select"),u=a("option");for(let e=0;e<g.length;e+=1)g[e].c();d(s,"for","new_class"),u.__value="",u.value=u.__value,d(c,"id","new_class"),void 0===e[3]&&_(()=>e[14].call(c)),d(t,"class","p-4 bg-white")},m(r,a){i(r,t,a),f(t,n),f(n,s),f(n,l),f(n,c),f(c,u);for(let e=0;e<g.length;e+=1)g[e].m(c,null);y(c,e[3]),p||(h=m(c,"change",e[14]),p=!0)},p(e,t){if(64&t[0]){let n;for(v=e[6],n=0;n<v.length;n+=1){const s=D(e,v,n);g[n]?g[n].p(s,t):(g[n]=B(s),g[n].c(),g[n].m(c,null))}for(;n<g.length;n+=1)g[n].d(1);g.length=v.length}72&t[0]&&y(c,e[3])},d(e){e&&r(t),b(g,e),p=!1,h()}}}function B(e){let t,n,s,l,c=`${e[28]}, ${q(e[29])}, ${e[30].first_name} ${e[30].last_name}`;return{c(){t=a("option"),n=u(c),s=o(),t.__value=l=e[27],t.value=t.__value},m(e,l){i(e,t,l),f(t,n),f(t,s)},p(e,s){64&s[0]&&c!==(c=`${e[28]}, ${q(e[29])}, ${e[30].first_name} ${e[30].last_name}`)&&p(n,c),64&s[0]&&l!==(l=e[27])&&(t.__value=l,t.value=t.__value)},d(e){e&&r(t)}}}function H(e){let t,n,s,l,c,u,p,h,v,_,y;function b(){e[20].call(n,e[25],e[26])}function w(){e[21].call(l,e[25],e[26])}function $(){e[22].call(u,e[25],e[26])}function E(){return e[23](e[26])}return{c(){t=a("div"),n=a("input"),s=o(),l=a("input"),c=o(),u=a("input"),p=o(),h=a("div"),v=a("button"),v.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',d(n,"type","text"),d(n,"class","w-7/12 mr-3 inp"),d(l,"type","number"),d(l,"class","w-2/12 mr-3 inp"),d(u,"type","number"),d(u,"min","1"),d(u,"class","w-2/12 inp"),d(v,"class","p-1 text-red-700 bg-red-100 rounded-full focus:outline-none hover:bg-red-200"),d(h,"class","flex items-center justify-end w-1/12"),d(t,"class","flex mb-3")},m(r,a){i(r,t,a),f(t,n),C(n,e[24].description),f(t,s),f(t,l),C(l,e[24].price),f(t,c),f(t,u),C(u,e[24].quantity),f(t,p),f(t,h),f(h,v),_||(y=[m(n,"input",b),m(l,"input",w),m(u,"input",$),m(v,"click",E)],_=!0)},p(t,s){e=t,96&s[0]&&n.value!==e[24].description&&C(n,e[24].description),96&s[0]&&x(l.value)!==e[24].price&&C(l,e[24].price),96&s[0]&&x(u.value)!==e[24].quantity&&C(u,e[24].quantity)},d(e){e&&r(t),_=!1,g(y)}}}function S(e){let t,n,s,l,c,u,p,h,v,w,$,E,q=e[6],j=[];for(let t=0;t<q.length;t+=1)j[t]=O(L(e,q,t));function k(){e[15].call(n,e[25],e[26])}function I(...t){return e[16](e[24],e[25],e[26],...t)}function R(){e[17].call(c,e[25],e[26])}function T(){e[18].call(p,e[25],e[26])}function A(){return e[19](e[26])}return{c(){t=a("div"),n=a("select"),s=a("option");for(let e=0;e<j.length;e+=1)j[e].c();l=o(),c=a("input"),u=o(),p=a("input"),h=o(),v=a("div"),w=a("button"),w.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',s.__value="",s.value=s.__value,d(n,"class","w-7/12 mr-3 inp"),void 0===e[24].class_id&&_(k),d(c,"type","number"),d(c,"min","0"),d(c,"class","w-2/12 mr-3 inp"),d(p,"type","number"),d(p,"min","1"),d(p,"class","w-2/12 inp"),d(w,"class","p-1 text-red-700 bg-red-100 rounded-full focus:outline-none hover:bg-red-200"),d(v,"class","flex items-center justify-end w-1/12"),d(t,"class","flex mb-3")},m(r,a){i(r,t,a),f(t,n),f(n,s);for(let e=0;e<j.length;e+=1)j[e].m(n,null);y(n,e[24].class_id),f(t,l),f(t,c),C(c,e[24].price),f(t,u),f(t,p),C(p,e[24].quantity),f(t,h),f(t,v),f(v,w),$||(E=[m(n,"change",k),m(n,"blur",I),m(c,"input",R),m(p,"input",T),m(w,"click",A)],$=!0)},p(t,s){if(e=t,64&s[0]){let t;for(q=e[6],t=0;t<q.length;t+=1){const i=L(e,q,t);j[t]?j[t].p(i,s):(j[t]=O(i),j[t].c(),j[t].m(n,null))}for(;t<j.length;t+=1)j[t].d(1);j.length=q.length}96&s[0]&&y(n,e[24].class_id),96&s[0]&&x(c.value)!==e[24].price&&C(c,e[24].price),96&s[0]&&x(p.value)!==e[24].quantity&&C(p,e[24].quantity)},d(e){e&&r(t),b(j,e),$=!1,g(E)}}}function O(e){let t,n,s,l,c=`${e[28]}, ${q(e[29])}, ${e[30].first_name} ${e[30].last_name}`;return{c(){t=a("option"),n=u(c),s=o(),t.__value=l=e[27],t.value=t.__value},m(e,l){i(e,t,l),f(t,n),f(t,s)},p(e,s){64&s[0]&&c!==(c=`${e[28]}, ${q(e[29])}, ${e[30].first_name} ${e[30].last_name}`)&&p(n,c),64&s[0]&&l!==(l=e[27])&&(t.__value=l,t.value=t.__value)},d(e){e&&r(t)}}}function P(e,t){let n,l;function c(e,t){return"class"===e[24].type?S:H}let a=c(t),o=a(t);return{key:e,first:null,c(){n=s(),o.c(),l=s(),this.first=n},m(e,t){i(e,n,t),o.m(e,t),i(e,l,t)},p(e,n){a===(a=c(t=e))&&o?o.p(t,n):(o.d(1),o=a(t),o&&(o.c(),o.m(l.parentNode,l)))},d(e){e&&r(n),o.d(e),e&&r(l)}}}function F(e){let t,n=e[0]&&K(e);return{c(){n&&n.c(),t=s()},m(e,s){n&&n.m(e,s),i(e,t,s)},p(e,s){e[0]?n?n.p(e,s):(n=K(e),n.c(),n.m(t.parentNode,t)):n&&(n.d(1),n=null)},i:l,o:l,d(e){n&&n.d(e),e&&r(t)}}}const J=(e,t)=>e+t.price*t.quantity;function U(e,t,n){let s,i,l;c(e,A,e=>n(4,i=e)),c(e,E,e=>n(13,l=e));let r,{student:a}=t,{show:o=!1}=t,{requestClassChange:u=!1}=t,{oldClassId:d}=t;A.reset(),E.fetch();let f={student_id:a.id,items:[{type:"class",description:"",price:1e3,quantity:1}]};function m(e){n(5,f.items=f.items.filter((t,n)=>n!==e),f)}return e.$$set=e=>{"student"in e&&n(1,a=e.student),"show"in e&&n(0,o=e.show),"requestClassChange"in e&&n(2,u=e.requestClassChange),"oldClassId"in e&&n(12,d=e.oldClassId)},e.$$.update=()=>{8194&e.$$.dirty[0]&&n(6,s=l.filter(e=>e.gender===a.gender&&"CANCELLED"!==e.state&&"COMPLETED"!==e.state)),4106&e.$$.dirty[0]&&d&&r&&T.requestClassChange(a.id,d,r).then(e=>n(5,f=e)),16&e.$$.dirty[0]&&"CREATED"===i&&n(0,o=!1)},[o,a,u,r,i,f,s,function(){n(5,f.items=[...f.items,{type:"material",description:"",price:1e3,quantity:1}],f)},function(){n(5,f.items=[...f.items,{type:"class",description:"",price:0,quantity:2,class_id:null}],f)},m,function(){n(0,o=!1)},function(){let e=!1;for(const t of f.items)"class"!==t.type||s.find(({id:e})=>e===t.class_id)||(e=!0),"material"!==t.type||t.description||(e=!0);if(e)return;const t=f.items.map(({description:e,price:t,quantity:n,class_id:s})=>({description:e,price:t,quantity:n,class_id:s}));M.create({...f,items:t}),u&&(T.delEnrollment(a.enrollment_id),T.createEnrollment(a.id,r))},d,l,function(){r=w(this),n(3,r),n(6,s),n(13,l),n(1,a)},function(e,t){e[t].class_id=w(this),n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},(e,t,i,{target:l})=>n(5,t[i].price=s.find(e=>e.id===l.value).price_per_hour,f),function(e,t){e[t].price=x(this.value),n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},function(e,t){e[t].quantity=x(this.value),n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},e=>m(e),function(e,t){e[t].description=this.value,n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},function(e,t){e[t].price=x(this.value),n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},function(e,t){e[t].quantity=x(this.value),n(5,f),n(12,d),n(3,r),n(1,a),n(6,s),n(13,l),n(1,a)},e=>m(e)]}class Q extends e{constructor(e){super(),t(this,e,U,F,n,{student:1,show:0,requestClassChange:2,oldClassId:12},null,[-1,-1])}}export{Q as C};
//# sourceMappingURL=CreateInvoiceModal-383082b4.js.map
