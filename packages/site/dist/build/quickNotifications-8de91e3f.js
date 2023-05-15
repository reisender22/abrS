const n=function(){let n=[],t=[];return{get:function(){const s=n.shift();for(const s of t)s(n);return s},display:function({message:s="",level:e="success",url:o="",action:c}){n.push({message:s,level:e,url:o,action:c});for(const s of t)s(n)},subscribe:function(s){return t.push(s),s(n),function(){t=t.filter(n=>n!==s)}}}}();export{n};
//# sourceMappingURL=quickNotifications-8de91e3f.js.map
