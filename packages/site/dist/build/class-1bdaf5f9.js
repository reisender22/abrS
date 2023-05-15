import{g as e,c as s}from"./client-76b8804a.js";import{n as t}from"./quickNotifications-8de91e3f.js";import{c as a}from"./createStatusStore-326fc155.js";const r=e`
    id
    subject
    level
    times {
      day
      from
      to
    }
    name
    gender
    description_md
    registration_fee
    registration_fee_offer
    price_per_hour
    hours_per_lesson
    invoice_cycle
    teacher {
      id
      first_name
      last_name
    }
    state
    notes
    hoursUntilNextInvoice
    last_invoice_at
    enrollments {
      id
      custom_price_per_hour
      student {
        id
        email
        phone_number
        gender
        first_name
        last_name
        address_line_1
        address_line_2
        postal_code
        locality
        country
        is_registration_fee_paid
        invoices(state: OPEN) {
          id
        }
      }
      stats {
        attendance {
          present
          absent
          excused
          passive
        }
        homeworks {
          done
          notDone
        }
      }
      notes
    }
    lessons {
      id
      date_from
      date_to
      title
      homeworks_md
      notes_md
      updated_at
      created_at
    }
    updated_at
    created_at`,n=e`
    id
    date_from
    date_to
    title
    notes_md
    homeworks_md
    updated_at
    created_at`,i={GET_BY_ID:e`
    query GetClassById($id: ID!) {
      getClass(id: $id) {
        ${r}
      }
    }`,CREATE:e`
    mutation CreateNewClass($classInput: ClassInput!) {
      createClass(classInput: $classInput) {
        ${r}
      }
    }`,UPDATE:e`
    mutation UpdateClass($id: ID!, $classInput: ClassInput!) {
      updateClass(id: $id, classInput: $classInput) {
        ${r}
      }
    }`,CREATE_FIRST_INVOICES:e`
    mutation CreateFirstInvoices($id: ID!) {
      createFirstInvoices(id: $id) {
        ${r}
      }
    }`,DELETE:e`
    mutation DeleteClass($id: ID!) {
      deleteClass(id: $id)
    }
  `,CREATE_LESSON:e`
    mutation CreateNewLesson($lessonInput: LessonInput!, $sessionInputs: [SessionInput!]!) {
      createLesson(lessonInput: $lessonInput, sessionInputs: $sessionInputs) {
        ${n}
      }
    }`,UPDATE_LESSON:e`
    mutation UpdateLesson($id: ID!, $lessonInput: LessonInput!) {
      updateLesson(id: $id, lessonInput: $lessonInput) {
        ${n}
      }
    }`,CREATE_ENROLLMENT:e`
    mutation EnrollStudentIntoClass($student_id: ID!, $class_id: ID!) {
      createEnrollment(student_id: $student_id, class_id: $class_id) {
        id
        custom_price_per_hour
        student {
          id
          email
          first_name
          last_name
          address_line_1
          address_line_2
          postal_code
          locality
          country
          is_registration_fee_paid
          invoices(state: OPEN) {
            id
          }
        }
        stats {
          attendance {
            present
            absent
            excused
            passive
          }
          homeworks {
            done
            notDone
          }
        }
        notes
      }
    }
  `,UPDATE_ENROLLMENT:e`
    mutation UpdateEnrollment($id: ID!, $custom_price_per_hour: Int!) {
      updateEnrollment(id: $id, custom_price_per_hour: $custom_price_per_hour) {
        id
        custom_price_per_hour
        student {
          id
          email
          first_name
          last_name
          address_line_1
          address_line_2
          postal_code
          locality
          country
          is_registration_fee_paid
          invoices(state: OPEN) {
            id
          }
        }
        stats {
          attendance {
            present
            absent
            excused
            passive
          }
          homeworks {
            done
            notDone
          }
        }
        notes
      }
    }
  `,DEL_ENROLLMENT:e`
    mutation DeleteEnrollment($id: ID!) {
      delEnrollment(id: $id)
    }
  `,REQUEST_CLASS_CHANGE:e`
    mutation RequestClassChange($student_id: ID!, $currentClassId: ID!, $newClassId: ID!) {
      requestClassChange(student_id: $student_id, currentClassId: $currentClassId, newClassId: $newClassId) {
        student_id
        items {
          description
          price
          quantity
          class_id
        }
      }
    }
  `},o=a();const d=function(){let e,a=[];function r(s){e=s;for(const s of a)s(e)}return{set:r,del:async function(){o.set("DELETING");const{errors:a}=await s.request(i.DELETE,{id:e.id});a?(o.set("ERROR"),t.display({message:"Fehler: "+a[0].message,level:"error"})):o.set("DELETED")},fetch:async function(e){o.set("FETCHING");const{data:a,errors:n}=await s.request(i.GET_BY_ID,{id:e});n?(o.set("ERROR"),t.display({message:"Fehler: "+n[0].message,level:"error"})):(a.getClass.teacher_id=a.getClass.teacher.id,r(a.getClass),o.set("FETCHED"))},create:async function(e){o.set("CREATING");const{data:a,errors:n}=await s.request(i.CREATE,{classInput:e});n?(o.set("ERROR"),t.display({message:"Fehler: "+n[0].message,level:"error"})):(a.createClass.teacher_id=a.createClass.teacher.id,r(a.createClass),o.set("CREATED"),t.display({message:"Klasse wurde erstellt"}))},update:async function(){o.set("UPDATING");const{name:a,subject:n,level:d,times:l,gender:c,description_md:_,price_per_hour:u,registration_fee:E,registration_fee_offer:p,hours_per_lesson:m,invoice_cycle:I,teacher_id:R,state:C,notes:N}=e,{data:T,errors:h}=await s.request(i.UPDATE,{id:e.id,classInput:{name:a,subject:n,level:d,times:l,gender:c,description_md:_,price_per_hour:u,registration_fee:E,registration_fee_offer:p,hours_per_lesson:m,invoice_cycle:I,teacher_id:R,state:C,notes:N}});h?(o.set("ERROR"),t.display({message:"Fehler: "+h[0].message,level:"error"})):(T.updateClass.teacher_id=T.updateClass.teacher.id,r(T.updateClass),o.set("UPDATED"),t.display({message:"Klasse wurde gespeichert"}))},subscribe:function(s){return a.push(s),s(e),function(){a=a.filter(e=>e!==s)}},createLesson:async function(a,n){o.set("CREATING_LESSON");const{data:d,errors:l}=await s.request(i.CREATE_LESSON,{lessonInput:a,sessionInputs:n});l?(o.set("ERROR"),t.display({message:"Fehler: "+l[0].message,level:"error"})):(e.lessons=[d.createLesson,...e.lessons],r(e),o.set("LESSON_CREATED"),t.display({message:"Unterricht wurde erstellt"}))},updateLesson:async function(t,a){o.set("UPDATING_LESSON");const{data:n,errors:d}=await s.request(i.UPDATE_LESSON,{id:t,lessonInput:a});if(d)o.set("ERROR");else{const s=e.lessons.findIndex(e=>e.id===t);e.lessons[s]=n.updateLesson,r(e),o.set("UPDATED_LESSON")}},delEnrollment:async function(a){o.set("DELETING_ENROLLMENT");const{data:n,errors:d}=await s.request(i.DEL_ENROLLMENT,{id:a});d?(o.set("ERROR"),t.display({message:"Fehler: "+d[0].message,level:"error"})):(e.enrollments=e.enrollments.filter(e=>e.id!==a),r(e),o.set("DELETED_ENROLLMENT"),t.display({message:"Schüler wurde aus der Klasse entfernt."}))},createEnrollment:async function(a,n){o.set("CREATING_ENROLLMENT");const{data:d,errors:l}=await s.request(i.CREATE_ENROLLMENT,{student_id:a,class_id:n});l?(o.set("ERROR"),t.display({message:"Fehler: "+l[0].message,level:"error"})):(e.enrollments.push(d.createEnrollment),r(e),o.set("CREATED_ENROLLMENT"),t.display({message:"Schüler wurde der Klasse hingezufügt."}))},updateEnrollment:async function(a,{custom_price_per_hour:n}){o.set("UPDATING_ENROLLMENT");const{data:d,errors:l}=await s.request(i.UPDATE_ENROLLMENT,{id:a,custom_price_per_hour:n});l?(o.set("ERROR"),t.display({message:"Fehler: "+l[0].message,level:"error"})):(e.enrollments.find(e=>e.id===a),d.updateEnrollment,r(e),o.set("UPDATED_ENROLLMENT"),t.display({message:"Stundenpreis wurde aktualisiert."}))},requestClassChange:async function(e,a,r){o.set("REQUESTING_CLASS_CHANGE");const{data:n,errors:d}=await s.request(i.REQUEST_CLASS_CHANGE,{student_id:e,currentClassId:a,newClassId:r});if(!d)return o.set("REQUESTED_CLASS_CHANGE"),n.requestClassChange;o.set("ERROR"),t.display({message:"Fehler: "+d[0].message,level:"error"})},createFirstInvoices:async function(){o.set("CREATING_FIRST_INVOICES");const{data:a,errors:n}=await s.request(i.CREATE_FIRST_INVOICES,{id:e.id});n?(o.set("ERROR"),t.display({message:"Fehler: "+n[0].message,level:"error"})):(a.createFirstInvoices.teacher_id=a.createFirstInvoices.teacher.id,r(a.createFirstInvoices),o.set("FIRST_INVOICES_CREATED"),t.display({message:"Rechnungen werden verschickt..."}))}}}();export{d as c,o as s};
//# sourceMappingURL=class-1bdaf5f9.js.map
