import{S as e,i as t,s as n,e as i,a as s,t as o,b as a,h as l,c as r,d as u,o as c,j as _,l as f,p as d,I as p,q as m,k as v,n as h,f as g,K as b,r as x,g as C,C as y,J as j,G as w,w as E}from"./main.js";import{u as A}from"./users-89c41aba.js";import{s as N,c as S}from"./class-1bdaf5f9.js";import"./client-76b8804a.js";import"./quickNotifications-8de91e3f.js";import"./createStatusStore-326fc155.js";function R(e,t,n){const i=e.slice();return i[20]=t[n].id,i[21]=t[n].first_name,i[22]=t[n].last_name,i[24]=n,i}function T(e,t,n){const i=e.slice();return i[25]=t[n],i[26]=t,i[24]=n,i}function M(e){let t,n,o,d,p,m,v,h,b,C,y,j,w,E,A,N,S,R,T,M,I,k,D,F;function G(){e[7].call(d,e[24])}function B(){e[8].call(N,e[24])}function K(){e[9].call(I,e[24])}return{c(){t=i("div"),n=i("label"),n.textContent="Tag",o=s(),d=i("select"),p=i("option"),p.textContent="Montag",m=i("option"),m.textContent="Dienstag",v=i("option"),v.textContent="Mittwoch",h=i("option"),h.textContent="Donnerstag",b=i("option"),b.textContent="Freitag",C=i("option"),C.textContent="Samstag",y=i("option"),y.textContent="Sonntag",j=s(),w=i("div"),E=i("label"),E.textContent="von",A=s(),N=i("input"),S=s(),R=i("div"),T=i("label"),T.textContent="bis",M=s(),I=i("input"),k=s(),a(n,"for","day_"+e[24]),p.__value="MON",p.value=p.__value,m.__value="TUE",m.value=m.__value,v.__value="WED",v.value=v.__value,h.__value="THU",h.value=h.__value,b.__value="FRI",b.value=b.__value,C.__value="SAT",C.value=C.__value,y.__value="SUN",y.value=y.__value,a(d,"id","day_"+e[24]),void 0===e[1].times[e[24]].day&&l(G),a(t,"class","w-full mx-3"),a(E,"for","from_"+e[24]),a(N,"type","time"),a(N,"id","from_"+e[24]),a(w,"class","mx-3"),a(T,"for","to_"+e[24]),a(I,"type","time"),a(I,"id","to_"+e[24]),a(R,"class","mx-3")},m(i,s){r(i,t,s),u(t,n),u(t,o),u(t,d),u(d,p),u(d,m),u(d,v),u(d,h),u(d,b),u(d,C),u(d,y),_(d,e[1].times[e[24]].day),r(i,j,s),r(i,w,s),u(w,E),u(w,A),u(w,N),c(N,e[1].times[e[24]].from),r(i,S,s),r(i,R,s),u(R,T),u(R,M),u(R,I),c(I,e[1].times[e[24]].to),u(R,k),D||(F=[f(d,"change",G),f(N,"input",B),f(I,"input",K)],D=!0)},p(t,n){e=t,2&n&&_(d,e[1].times[e[24]].day),2&n&&c(N,e[1].times[e[24]].from),2&n&&c(I,e[1].times[e[24]].to)},d(e){e&&g(t),e&&g(j),e&&g(w),e&&g(S),e&&g(R),D=!1,x(F)}}}function I(e,t){let n,s,a,l,c=t[21]+" "+t[22];return{key:e,first:null,c(){n=i("option"),s=i("option"),a=o(c),n.__value="",n.value=n.__value,s.__value=l=t[20],s.value=s.__value,this.first=n},m(e,t){r(e,n,t),r(e,s,t),u(s,a)},p(e,n){t=e,4&n&&c!==(c=t[21]+" "+t[22])&&v(a,c),4&n&&l!==(l=t[20])&&(s.__value=l,s.value=s.__value)},d(e){e&&g(n),e&&g(s)}}}function k(e){let t,n,C,y,w,E,A,N,S,k,D,F,G,B,K,L,U,$,z,q,H,J,O,P,W,Q,V,X,Y,Z,ee,te,ne,ie,se,oe,ae,le,re,ue,ce,_e,fe,de,pe,me,ve,he,ge,be,xe,Ce,ye,je,we,Ee,Ae,Ne,Se,Re,Te,Me,Ie,ke,De,Fe,Ge,Be,Ke,Le,Ue=[],$e=new Map,ze="CREATING"===e[0]?"Bitte warten...":"Erstellen",qe=e[1].times,He=[];for(let t=0;t<qe.length;t+=1)He[t]=M(T(e,qe,t));let Je=e[2];const Oe=e=>e[20];for(let t=0;t<Je.length;t+=1){let n=R(e,Je,t),i=Oe(n);$e.set(i,Ue[t]=I(i,n))}return{c(){t=i("h1"),t.textContent="Neue Klasse",n=s(),C=i("form"),y=i("div"),w=i("label"),w.textContent="Name (optional)",E=s(),A=i("input"),N=s(),S=i("div"),k=i("label"),k.textContent="Fach",D=s(),F=i("input"),G=s(),B=i("div"),K=i("label"),K.textContent="Klasse für",L=s(),U=i("select"),$=i("option"),$.textContent="Brüder",z=i("option"),z.textContent="Schwestern",q=s(),H=i("div");for(let e=0;e<He.length;e+=1)He[e].c();J=s(),O=i("div"),P=i("label"),P.textContent="Lehrer",W=s(),Q=i("select");for(let e=0;e<Ue.length;e+=1)Ue[e].c();V=s(),X=i("div"),Y=i("div"),Z=i("label"),Z.textContent="Registrierungsgebühr (in Cents)",ee=s(),te=i("input"),ne=s(),ie=i("div"),se=i("label"),se.textContent="Registrierungsgebühr Angebot (in Cents)",oe=s(),ae=i("input"),le=s(),re=i("div"),ue=i("div"),ce=i("label"),ce.textContent="Preis je Stunde (in Cents)",_e=s(),fe=i("input"),de=s(),pe=i("div"),me=i("label"),me.textContent="Stunden je Unterricht",ve=s(),he=i("input"),ge=s(),be=i("div"),xe=i("div"),Ce=i("label"),Ce.textContent="Abrechnungszyklus in Stunden",ye=s(),je=i("input"),we=s(),Ee=i("div"),Ae=i("label"),Ae.textContent="Beschreibung (Markdown wird unterstützt)",Ne=s(),Se=i("textarea"),Re=s(),Te=i("div"),Me=i("label"),Me.textContent="Notizen (nicht öffentlich)",Ie=s(),ke=i("textarea"),De=s(),Fe=i("button"),Ge=o(ze),a(w,"for","name"),a(A,"type","text"),a(A,"id","name"),a(y,"class","mb-5"),a(k,"for","subject"),a(F,"type","text"),a(F,"id","subject"),a(S,"class","mb-5"),a(K,"for","gender"),$.__value="MALE",$.value=$.__value,z.__value="FEMALE",z.value=z.__value,a(U,"id","gender"),void 0===e[1].gender&&l(()=>e[6].call(U)),a(B,"class","mb-5"),a(H,"class","flex mb-5 -mx-3"),a(P,"for","teacher_id"),a(Q,"id","teacher_id"),void 0===e[1].teacher_id&&l(()=>e[10].call(Q)),a(O,"class","mb-5"),a(Z,"for","registration_fee"),a(te,"type","number"),a(te,"id","registration_fee"),a(te,"min","0"),a(Y,"class","w-1/2 mx-3"),a(se,"for","registration_fee_offer"),a(ae,"type","number"),a(ae,"id","registration_fee_offer"),a(ae,"min","0"),a(ie,"class","w-1/2 mx-3"),a(X,"class","flex mb-5 -mx-3"),a(ce,"for","price_per_hour"),a(fe,"type","number"),a(fe,"id","price_per_hour"),a(fe,"min","0"),a(ue,"class","w-1/2 mx-3"),a(me,"for","hours_per_lesson"),a(he,"type","number"),a(he,"id","hours_per_lesson"),a(he,"min","1"),a(pe,"class","w-1/2 mx-3"),a(re,"class","flex mb-5 -mx-3"),a(Ce,"for","invoice_cycle"),a(je,"type","number"),a(je,"id","invoice_cycle"),a(je,"min","0"),a(xe,"class","w-1/2 mx-3"),a(be,"class","flex mb-5 -mx-3"),a(Ae,"for","description"),a(Se,"rows","5"),a(Se,"id","description"),a(Ee,"class","mb-5"),a(Me,"for","notes"),a(ke,"rows","3"),a(ke,"id","notes"),a(Te,"class","mb-5"),a(Fe,"class","btn btn--primary"),Fe.disabled=Be="CREATING"===e[0]},m(i,s){r(i,t,s),r(i,n,s),r(i,C,s),u(C,y),u(y,w),u(y,E),u(y,A),c(A,e[1].name),u(C,N),u(C,S),u(S,k),u(S,D),u(S,F),c(F,e[1].subject),u(C,G),u(C,B),u(B,K),u(B,L),u(B,U),u(U,$),u(U,z),_(U,e[1].gender),u(C,q),u(C,H);for(let e=0;e<He.length;e+=1)He[e].m(H,null);u(C,J),u(C,O),u(O,P),u(O,W),u(O,Q);for(let e=0;e<Ue.length;e+=1)Ue[e].m(Q,null);_(Q,e[1].teacher_id),u(C,V),u(C,X),u(X,Y),u(Y,Z),u(Y,ee),u(Y,te),c(te,e[1].registration_fee),u(X,ne),u(X,ie),u(ie,se),u(ie,oe),u(ie,ae),c(ae,e[1].registration_fee_offer),u(C,le),u(C,re),u(re,ue),u(ue,ce),u(ue,_e),u(ue,fe),c(fe,e[1].price_per_hour),u(re,de),u(re,pe),u(pe,me),u(pe,ve),u(pe,he),c(he,e[1].hours_per_lesson),u(C,ge),u(C,be),u(be,xe),u(xe,Ce),u(xe,ye),u(xe,je),c(je,e[1].invoice_cycle),u(C,we),u(C,Ee),u(Ee,Ae),u(Ee,Ne),u(Ee,Se),c(Se,e[1].description),u(C,Re),u(C,Te),u(Te,Me),u(Te,Ie),u(Te,ke),c(ke,e[1].notes),u(C,De),u(C,Fe),u(Fe,Ge),Ke||(Le=[f(A,"input",e[4]),f(F,"input",e[5]),f(U,"change",e[6]),f(Q,"change",e[10]),f(te,"input",e[11]),f(ae,"input",e[12]),f(fe,"input",e[13]),f(he,"input",e[14]),f(je,"input",e[15]),f(Se,"input",e[16]),f(ke,"input",e[17]),f(C,"submit",d(e[18]))],Ke=!0)},p(e,[t]){if(2&t&&A.value!==e[1].name&&c(A,e[1].name),2&t&&F.value!==e[1].subject&&c(F,e[1].subject),2&t&&_(U,e[1].gender),2&t){let n;for(qe=e[1].times,n=0;n<qe.length;n+=1){const i=T(e,qe,n);He[n]?He[n].p(i,t):(He[n]=M(i),He[n].c(),He[n].m(H,null))}for(;n<He.length;n+=1)He[n].d(1);He.length=qe.length}4&t&&(Je=e[2],Ue=p(Ue,t,Oe,1,e,Je,$e,Q,j,I,null,R)),2&t&&_(Q,e[1].teacher_id),2&t&&m(te.value)!==e[1].registration_fee&&c(te,e[1].registration_fee),2&t&&m(ae.value)!==e[1].registration_fee_offer&&c(ae,e[1].registration_fee_offer),2&t&&m(fe.value)!==e[1].price_per_hour&&c(fe,e[1].price_per_hour),2&t&&m(he.value)!==e[1].hours_per_lesson&&c(he,e[1].hours_per_lesson),2&t&&m(je.value)!==e[1].invoice_cycle&&c(je,e[1].invoice_cycle),2&t&&c(Se,e[1].description),2&t&&c(ke,e[1].notes),1&t&&ze!==(ze="CREATING"===e[0]?"Bitte warten...":"Erstellen")&&v(Ge,ze),1&t&&Be!==(Be="CREATING"===e[0])&&(Fe.disabled=Be)},i:h,o:h,d(e){e&&g(t),e&&g(n),e&&g(C),b(He,e);for(let e=0;e<Ue.length;e+=1)Ue[e].d();Ke=!1,x(Le)}}}function D(e,t,n){let i,s,o;C(e,w,e=>n(3,i=e)),C(e,N,e=>n(0,s=e)),C(e,A,e=>n(2,o=e)),y.title="Neue Klasse",y.description="Description coming soon...",N.reset(),A.fetch({role:"TEACHER"});let a={name:"",subject:"",level:"",times:[{day:"FRI",from:"18:00",to:"20:00"}],gender:"MALE",description_md:"",price_per_hour:1e3,registration_fee:2500,registration_fee_offer:0,hours_per_lesson:2,invoice_cycle:8,teacher_id:"",notes:""};return e.$$.update=()=>{9&e.$$.dirty&&"CREATED"===s&&i("../classes")},[s,a,o,i,function(){a.name=this.value,n(1,a)},function(){a.subject=this.value,n(1,a)},function(){a.gender=E(this),n(1,a)},function(e){a.times[e].day=E(this),n(1,a)},function(e){a.times[e].from=this.value,n(1,a)},function(e){a.times[e].to=this.value,n(1,a)},function(){a.teacher_id=E(this),n(1,a)},function(){a.registration_fee=m(this.value),n(1,a)},function(){a.registration_fee_offer=m(this.value),n(1,a)},function(){a.price_per_hour=m(this.value),n(1,a)},function(){a.hours_per_lesson=m(this.value),n(1,a)},function(){a.invoice_cycle=m(this.value),n(1,a)},function(){a.description=this.value,n(1,a)},function(){a.notes=this.value,n(1,a)},()=>S.create(a)]}class F extends e{constructor(e){super(),t(this,e,D,k,n,{})}}export{F as default};
//# sourceMappingURL=new-c9bc986e.js.map
