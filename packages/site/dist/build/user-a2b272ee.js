import{g as e,c as s}from"./client-76b8804a.js";import{n as t}from"./quickNotifications-8de91e3f.js";import{c as r}from"./createStatusStore-326fc155.js";const a=e`
    id
    email
    gender
    first_name
    last_name
    address_line_1
    address_line_2
    postal_code
    locality
    administrative_area
    country
    phone_number
    role
    is_email_verified
    is_registration_fee_paid
    is_locked
    comments {
      id
      body_md
      author {
        id
        first_name
        last_name
      }
      updated_at
      created_at
    }
    last_login_at
    updated_at
    created_at
    invoices {
      id
      amount
      state
      created_at
    }`,d=e`
    id
    body_md
    author {
      id
      first_name
      last_name
    }
    updated_at
    created_at`,n={GET_BY_ID:e`
    query GetUserById($id: ID!) {
      getUser(id: $id) {
        ${a}
      }
    }`},i={CREATE:e`
    mutation CreateNewUser($userInput: UserInput!, $sendEmail: Boolean) {
      createUser(userInput: $userInput, sendEmail: $sendEmail) {
        ${a}
      }
    }`,UPDATE:e`
    mutation UpdateUser($id: ID!, $userInput: UserInput!) {
      updateUser(id: $id, userInput: $userInput) {
        ${a}
      }
    }`,UPDATE_PASSWORD:e`
    mutation UpdateUserPassword($id: ID!, $password: String!) {
      updateUserPassword(id: $id, password: $password)
    }
  `,DEL:e`
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `,CREATE_COMMENT:e`
    mutation CreateNewUserComment($userCommentInput: UserCommentInput!) {
      createUserComment(userCommentInput: $userCommentInput) {
        ${d}
      }
    }`,UPDATE_COMMENT:e`
    mutation UpdateUserComment($id: ID!, body_md) {
      updateUserComment(id: $id, body_md: $body_md) {
        ${d}
      }
    }`,DEL_COMMENT:e`
    mutation DeleteUserComment($id: ID!) {
     
    }`},o=r();const m=function(){let e,r=[];function a(s){e=s;for(const s of r)s(e)}return{set:a,del:async function(e){o.set("DELETING");const{errors:r}=await s.request(i.DEL,{id:e});r?(o.set("ERROR"),t.display({message:"Fehler: "+r[0].message,level:"error"})):(o.set("DELETED"),t.display({message:"Benutzer wurde gelöscht"}))},fetch:async function(e){o.set("FETCHING");const{data:r,errors:d}=await s.request(n.GET_BY_ID,{id:e});d?(o.set("ERROR"),t.display({message:"Fehler: "+d[0].message,level:"error"})):(a(r.getUser),o.set("FETCHED"))},create:async function(e,r){o.set("CREATING");const{data:d,errors:n}=await s.request(i.CREATE,{userInput:e,sendEmail:r});n?(o.set("ERROR"),t.display({message:"Fehler: "+n[0].message,level:"error"})):(a(d.createUser),o.set("CREATED"),t.display({message:"Benutzer wurde erstellt"}))},update:async function(){o.set("UPDATING");const{id:r,last_login_at:d,created_at:n,updated_at:m,invoices:u,comments:l,...c}=e,{data:E,errors:_}=await s.request(i.UPDATE,{id:r,userInput:c});_?(o.set("ERROR"),t.display({message:"Fehler: "+_[0].message,level:"error"})):(a(E.updateUser),o.set("UPDATED"),t.display({message:"Benutzer wurde gespeichert"}))},subscribe:function(s){return r.push(s),s(e),function(){r=r.filter(e=>e!==s)}},delComment:async function(r){o.set("DELETING_COMMENT");const{errors:d}=await s.request(i.DEL_COMMENT,{id:r});d?(o.set("ERROR"),t.display({message:"Fehler: "+d[0].message,level:"error"})):(e.comments=e.comments.filter(e=>e.id!==r),a(e),o.set("DELETED_COMMENT"),t.display({message:"Notiz wurde gelöscht"}))},createComment:async function({body_md:r,author_id:d}){o.set("CREATING_COMMENT");const{data:n,errors:m}=await s.request(i.CREATE_COMMENT,{userCommentInput:{body_md:r,author_id:d,user_id:e.id}});m?(o.set("ERROR"),t.display({message:"Fehler: "+m[0].message,level:"error"})):(e.comments=[n.createUserComment,...e.comments],a(e),o.set("COMMENT_CREATED"),t.display({message:"Notiz wurde erstellt"}))},updateComment:async function(r,d){o.set("UPDATING_COMMENT");const{data:n,errors:m}=await s.request(i.UPDATE_COMMENT,{id:r,body_md:d});m?(o.set("ERROR"),t.display({message:"Fehler: "+m[0].message,level:"error"})):(e.comments=[n.updateUserComment,...e.comments],a(e),o.set("UPDATED_COMMENT"),t.display({message:"Änderungen wurden gespeichert"}))},updatePassword:async function(r,a){r!==a&&t.display({message:"Passwörter stimmen nicht überein",level:"error"}),o.set("UPDATING_PASSWORD");const{data:d,errors:n}=await s.request(i.UPDATE_PASSWORD,{id:e.id,password:r});n?(o.set("ERROR"),t.display({message:"Fehler: "+n[0].message,level:"error"})):(o.set("UPDATED_PASSWORD"),t.display({message:"Passwort wurde gespeichert"}))}}}();export{o as s,m as u};
//# sourceMappingURL=user-a2b272ee.js.map
