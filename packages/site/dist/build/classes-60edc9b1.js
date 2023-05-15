import{g as e,c as t}from"./client-76b8804a.js";import{n as s}from"./quickNotifications-8de91e3f.js";import{c as r}from"./createStatusStore-326fc155.js";const a=r(),i={GET:e`
    query ListAllClasses($teacher_id: ID) {
      getClasses(teacher_id: $teacher_id) {
        id
        subject
        level
        gender
        price_per_hour
        times {
          day
          from
          to
        }
        name
        teacher {
          id
          first_name
          last_name
        }
        state
        enrollments {
          id
          student {
            id
          }
        }
      }
    }
  `};const c=function(){let e=[],r=[];return{subscribe:function(t){return r.push(t),t(e),function(){r=r.filter(e=>e!==t)}},fetch:async function({teacher_id:c}={}){a.set("FETCHING");const{data:n,errors:o}=await t.request(i.GET,{teacher_id:c});o?(a.set("ERROR"),s.display({message:"Fehler: "+o[0].message,level:"error"})):(!function(t){e=t;for(const t of r)t(e)}(n.getClasses),a.set("FETCHED"))}}}();export{c,a as s};
//# sourceMappingURL=classes-60edc9b1.js.map
