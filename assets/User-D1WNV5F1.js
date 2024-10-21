import{s as ee}from"./index-BxmazQUx.js";import{s as le}from"./index-CmCuRXjW.js";import{B as f,s as ae,a as te,b as se,c as ie,d as oe,e as ne}from"./BaseServices-C7MaePp3.js";import{s as re,a as ue}from"./index-BFNgdO1s.js";import{b as o,d as de,f as ce,o as g,c as k,a as i,e as a,g as n,F as me,j as C,h as I,t as pe,k as ve}from"./index-CqvKQK5V.js";import"./index-BxPp5uvz.js";import"./axios-BimPEqV4.js";const b="http://backend.keuangan.net/api/authorization/users",y={getData:async()=>await f.getData(b),create:async u=>await f.create(u,b),update:async(u,e)=>await f.update(u,e,b),delete:async u=>await f.delete(u,b),bulkDelete:async u=>await f.bulkDelete(u,`${b}/bulk-delete`),import:async u=>await f.import(u,`${b}/import`)},fe={class:"card flex items-center justify-between py-3"},be=i("h2",{class:"font-semibold text-2xl"},"Users",-1),ye={class:"card"},_e={class:"flex flex-wrap gap-2 items-center justify-between"},xe=i("h4",{class:"m-0"},"Manage Users",-1),ge=i("i",{class:"pi pi-search"},null,-1),ke={class:"flex flex-col gap-6"},he=i("label",{for:"name",class:"block font-bold mb-3"},"Name",-1),Ue={key:0,class:"text-red-500"},we=i("label",{for:"email",class:"block font-bold mb-3"},"Email",-1),Ce={key:0,class:"text-red-500"},De={class:"flex items-center gap-4"},Se=i("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),$e={key:0},Ve={class:"flex items-center gap-4"},Ne=i("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),Pe={key:0},Ae={__name:"User",setup(u){const e=o(),d=o(),V=o(!1),N=async()=>{try{V.value=!0,d.value=await y.getData()}catch(t){console.error(t)}finally{V.value=!1}};de(()=>{N()});const _=ce(),P=o(),c=o(!1),D=o(!1),h=o(!1),x=o(!1),E=o(null),p=o(),S=o({global:{value:null,matchMode:ve.CONTAINS}}),m=o(!1);function F(t){E.value=t.files[0]}function B(){e.value={},m.value=!1,c.value=!0}function L(){c.value=!1,m.value=!1}async function M(){var t;if(m.value=!0,(t=e==null?void 0:e.value.email)!=null&&t.trim()&&(e!=null&&e.value.name)){if(e.value.id)await y.update(e.value.id,{name:e.value.name,email:e.value.email}),d.value[q(e.value.id)]=e.value,_.add({severity:"success",summary:"Successful",detail:"Expense Updated",life:3e3});else{const l=await y.create({name:e.value.name,email:e.value.email});d.value.unshift(l.data),_.add({severity:"success",summary:"Successful",detail:"Expense Created",life:3e3})}c.value=!1,e.value={}}}function T(t){e.value={id:t.id,name:t.name,email:t.email},c.value=!0}function A(t){e.value=t,h.value=!0}function R(){y.delete(e.value.id),d.value=d.value.filter(t=>t.id!==e.value.id),c.value=!1,e.value={},_.add({severity:"success",summary:"Successful",detail:"Expense Deleted",life:3e3})}function q(t){let l=-1;for(let v=0;v<d.value.length;v++)if(d.value[v].id===t){l=v;break}return l}function j(){P.value.exportCSV()}function z(){y.import({file:E.value}).then(()=>{N()}).catch(t=>{console.error(t)}),D.value=!1,_.add({severity:"info",summary:"Success",detail:"File Uploaded",life:3e3})}function O(){x.value=!0}function Y(){let t=p.value.map(l=>l.id);y.bulkDelete({ids:t}),d.value=e.value.filter(l=>!t.includes(l.id)),x.value=!1,p.value=null,_.add({severity:"success",summary:"Successful",detail:"Expenses Deleted",life:3e3})}const H=o([{label:"Dashboard",to:"/"},{label:"Authorization"},{label:"User"}]),K=o({icon:"pi pi-home",to:"/"});return(t,l)=>{const v=ae,r=re,G=te,J=ie,$=ue,Q=oe,U=ne,W=se,w=le,X=ee;return g(),k(me,null,[i("div",fe,[be,a(v,{home:K.value,model:H.value},null,8,["home","model"])]),i("div",null,[i("div",ye,[a(G,{class:"mb-6"},{start:n(()=>[a(r,{label:"New",icon:"pi pi-plus",severity:"secondary",class:"mr-2",onClick:B}),a(r,{label:"Delete",icon:"pi pi-trash",severity:"secondary",onClick:O,disabled:!p.value||!p.value.length},null,8,["disabled"])]),end:n(()=>[a(r,{label:"Import",icon:"pi pi-download",severity:"secondary mx-2",onClick:l[0]||(l[0]=s=>t.importExpenseCategoryDialog=!0)}),a(r,{label:"Export",icon:"pi pi-upload",severity:"secondary",onClick:l[1]||(l[1]=s=>j(s))})]),_:1}),a(W,{ref_key:"dt",ref:P,selection:p.value,"onUpdate:selection":l[3]||(l[3]=s=>p.value=s),value:d.value,dataKey:"id",paginator:!0,rows:10,filters:S.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} users"},{header:n(()=>[i("div",_e,[xe,a(Q,null,{default:n(()=>[a(J,null,{default:n(()=>[ge]),_:1}),a($,{modelValue:S.value.global.value,"onUpdate:modelValue":l[2]||(l[2]=s=>S.value.global.value=s),placeholder:"Search..."},null,8,["modelValue"])]),_:1})])]),default:n(()=>[a(U,{selectionMode:"multiple",style:{width:"3rem"},exportable:!1}),a(U,{field:"name",header:"Name",sortable:""}),a(U,{field:"email",header:"Email",sortable:""}),a(U,{exportable:!1},{body:n(s=>[a(r,{icon:"pi pi-pencil",outlined:"",rounded:"",class:"mr-2",onClick:Z=>T(s.data)},null,8,["onClick"]),a(r,{icon:"pi pi-trash",outlined:"",rounded:"",severity:"danger",onClick:Z=>A(s.data)},null,8,["onClick"])]),_:1})]),_:1},8,["selection","value","filters"])]),a(w,{visible:c.value,"onUpdate:visible":l[6]||(l[6]=s=>c.value=s),style:{width:"450px"},header:"Expense Category Details",modal:!0},{footer:n(()=>[a(r,{label:"Cancel",icon:"pi pi-times",text:"",onClick:L}),a(r,{label:"Save",icon:"pi pi-check",onClick:M})]),default:n(()=>[i("div",ke,[i("div",null,[he,a($,{id:"name",modelValue:e.value.name,"onUpdate:modelValue":l[4]||(l[4]=s=>e.value.name=s),modelModifiers:{trim:!0},required:"true",autofocus:"",invalid:m.value&&!e.value.name,fluid:""},null,8,["modelValue","invalid"]),m.value&&!e.value.name?(g(),k("small",Ue,"name is required.")):C("",!0)]),i("div",null,[we,a($,{id:"email",modelValue:e.value.email,"onUpdate:modelValue":l[5]||(l[5]=s=>e.value.email=s),modelModifiers:{trim:!0},required:"true",autofocus:"",invalid:m.value&&!e.value.email,fluid:""},null,8,["modelValue","invalid"]),m.value&&!e.value.email?(g(),k("small",Ce,"email is required.")):C("",!0)])])]),_:1},8,["visible"]),a(w,{visible:D.value,"onUpdate:visible":l[7]||(l[7]=s=>D.value=s),style:{width:"450px"},header:"Import Expense",modal:!0},{default:n(()=>[a(X,{name:"file",onUploader:z,onSelect:F,maxFileSize:1e6,customUpload:""})]),_:1},8,["visible"]),a(w,{visible:h.value,"onUpdate:visible":l[9]||(l[9]=s=>h.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[a(r,{label:"No",icon:"pi pi-times",text:"",onClick:l[8]||(l[8]=s=>h.value=!1)}),a(r,{label:"Yes",icon:"pi pi-check",onClick:R})]),default:n(()=>[i("div",De,[Se,e.value?(g(),k("span",$e,[I("Are you sure you want to delete "),i("b",null,pe(e.value.name),1),I("?")])):C("",!0)])]),_:1},8,["visible"]),a(w,{visible:x.value,"onUpdate:visible":l[11]||(l[11]=s=>x.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[a(r,{label:"No",icon:"pi pi-times",text:"",onClick:l[10]||(l[10]=s=>x.value=!1)}),a(r,{label:"Yes",icon:"pi pi-check",text:"",onClick:Y})]),default:n(()=>[i("div",Ve,[Ne,t.expense?(g(),k("span",Pe,"Are you sure you want to delete the selected users?")):C("",!0)])]),_:1},8,["visible"])])],64)}}};export{Ae as default};
