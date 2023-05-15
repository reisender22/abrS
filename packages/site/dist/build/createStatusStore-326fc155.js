function n(){let n="";const t=[];function c(c){n=c;for(const c of t)c(n)}return{subscribe:function(c){return t.push(c),c(n),function(){const n=t.findIndex(n=>n===c);t.splice(n,1)}},set:c,reset:function(){c("")}}}export{n as c};
//# sourceMappingURL=createStatusStore-326fc155.js.map
