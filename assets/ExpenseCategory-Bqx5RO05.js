import{s as X}from"./index-BxmazQUx.js";import{s as Z}from"./index-CmCuRXjW.js";import{s as ee,a as le,b as te,c as ae,d as se,e as oe}from"./BaseServices-C7MaePp3.js";import{s as ie,a as ne}from"./index-BFNgdO1s.js";import{E as v}from"./ExpenseCategoryService-CqJzwV_N.js";import{b as i,d as re,f as ue,o as C,c as h,a as o,e as l,g as n,F as de,j as w,h as N,t as ce,k as pe}from"./index-CqvKQK5V.js";import"./index-BxPp5uvz.js";import"./axios-BimPEqV4.js";const me={class:"card flex items-center justify-between py-3"},ve=o("h2",{class:"font-semibold text-2xl"},"Expense Categories",-1),fe={class:"card"},be={class:"flex flex-wrap gap-2 items-center justify-between"},xe=o("h4",{class:"m-0"},"Manage Expenses Categories",-1),ge=o("i",{class:"pi pi-search"},null,-1),ye={class:"flex flex-col gap-6"},_e=o("label",{for:"name",class:"block font-bold mb-3"},"Name",-1),Ce={key:0,class:"text-red-500"},he=o("label",{for:"description",class:"block font-bold mb-3"},"Description",-1),ke={class:"flex items-center gap-4"},Ee=o("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),we={key:0},De={class:"flex items-center gap-4"},Se=o("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),Ve={key:0},Be={__name:"ExpenseCategory",setup(Ue){const a=i(),u=i(),D=i(!1),S=async()=>{try{D.value=!0,u.value=await v.getData()}catch(t){console.error(t)}finally{D.value=!1}};re(()=>{S()});const c=ue(),V=i(),p=i(!1),g=i(!1),f=i(!1),b=i(!1),U=i(null),d=i(),k=i({global:{value:null,matchMode:pe.CONTAINS}}),x=i(!1);function P(t){U.value=t.files[0]}function F(){a.value={},x.value=!1,p.value=!0}function I(){p.value=!1,x.value=!1}function $(t){c.add({severity:"error",summary:"Error",detail:t,life:3e3})}async function M(){if(x.value=!0,a!=null&&a.value.name){if(a.value.id){const t=await v.update(a.value.id,{name:a.value.name,description:a.value.description});if(t.status===422){$(t.data.message);return}u.value[R(a.value.id)]=a.value,c.add({severity:"success",summary:"Successful",detail:"Expense Updated",life:3e3})}else{const t=await v.create({name:a.value.name,description:a.value.description});if(t.status===422){$(t.data.message);return}u.value.unshift(t.data),c.add({severity:"success",summary:"Successful",detail:"Expense Created",life:3e3})}p.value=!1,a.value={}}}function T(t){a.value={id:t.id,name:t.name,description:t.description},p.value=!0}function L(t){a.value=t,f.value=!0}function B(){v.delete(a.value.id),u.value=u.value.filter(t=>t.id!==a.value.id),f.value=!1,a.value={},c.add({severity:"success",summary:"Successful",detail:"Expense Deleted",life:3e3})}function R(t){let e=-1;for(let m=0;m<u.value.length;m++)if(u.value[m].id===t){e=m;break}return e}function j(){V.value.exportCSV()}function q(){v.import({file:U.value}).then(()=>{S()}).catch(t=>{console.error(t)}),g.value=!1,c.add({severity:"info",summary:"Success",detail:"File Uploaded",life:3e3})}function A(){b.value=!0}function O(){let t=d.value.map(e=>e.id);v.bulkDelete({ids:t}),u.value=u.value.filter(e=>!t.includes(e.id)),b.value=!1,d.value=null,c.add({severity:"success",summary:"Successful",detail:"Expenses Deleted",life:3e3})}const Y=i([{label:"Dashboard",to:"/"},{label:"Master Data"},{label:"Expense Categories"}]),z=i({icon:"pi pi-home",to:"/"});return(t,e)=>{const m=ee,r=ie,H=le,K=ae,E=ne,G=se,y=oe,J=te,_=Z,Q=X;return C(),h(de,null,[o("div",me,[ve,l(m,{home:z.value,model:Y.value},null,8,["home","model"])]),o("div",null,[o("div",fe,[l(H,{class:"mb-6"},{start:n(()=>[l(r,{label:"New",icon:"pi pi-plus",severity:"secondary",class:"mr-2",onClick:F}),l(r,{label:"Delete",icon:"pi pi-trash",severity:"secondary",onClick:A,disabled:!d.value||!d.value.length},null,8,["disabled"])]),end:n(()=>[l(r,{label:"Import",icon:"pi pi-download",severity:"secondary mx-2",onClick:e[0]||(e[0]=s=>g.value=!0)}),l(r,{label:"Export",icon:"pi pi-upload",severity:"secondary",onClick:e[1]||(e[1]=s=>j(s))})]),_:1}),l(J,{ref_key:"dt",ref:V,selection:d.value,"onUpdate:selection":e[3]||(e[3]=s=>d.value=s),value:u.value,dataKey:"id",paginator:!0,rows:10,filters:k.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} expense categories"},{header:n(()=>[o("div",be,[xe,l(G,null,{default:n(()=>[l(K,null,{default:n(()=>[ge]),_:1}),l(E,{modelValue:k.value.global.value,"onUpdate:modelValue":e[2]||(e[2]=s=>k.value.global.value=s),placeholder:"Search..."},null,8,["modelValue"])]),_:1})])]),default:n(()=>[l(y,{selectionMode:"multiple",style:{width:"3rem"},exportable:!1}),l(y,{field:"name",header:"Name",sortable:""}),l(y,{field:"description",header:"Description",sortable:""}),l(y,{exportable:!1},{body:n(s=>[l(r,{icon:"pi pi-pencil",outlined:"",rounded:"",class:"mr-2",onClick:W=>T(s.data)},null,8,["onClick"]),l(r,{icon:"pi pi-trash",outlined:"",rounded:"",severity:"danger",onClick:W=>L(s.data)},null,8,["onClick"])]),_:1})]),_:1},8,["selection","value","filters"])]),l(_,{visible:p.value,"onUpdate:visible":e[6]||(e[6]=s=>p.value=s),style:{width:"450px"},header:"Expense Category Details",modal:!0},{footer:n(()=>[l(r,{label:"Cancel",icon:"pi pi-times",text:"",onClick:I}),l(r,{label:"Save",icon:"pi pi-check",onClick:M})]),default:n(()=>[o("div",ye,[o("div",null,[_e,l(E,{id:"name",modelValue:a.value.name,"onUpdate:modelValue":e[4]||(e[4]=s=>a.value.name=s),modelModifiers:{trim:!0},required:"true",autofocus:"",invalid:x.value&&!a.value.name,fluid:""},null,8,["modelValue","invalid"]),x.value&&!a.value.name?(C(),h("small",Ce,"name is required.")):w("",!0)]),o("div",null,[he,l(E,{id:"description",modelValue:a.value.description,"onUpdate:modelValue":e[5]||(e[5]=s=>a.value.description=s),modelModifiers:{trim:!0},required:"true",autofocus:"",fluid:""},null,8,["modelValue"])])])]),_:1},8,["visible"]),l(_,{visible:g.value,"onUpdate:visible":e[7]||(e[7]=s=>g.value=s),style:{width:"450px"},header:"Import Expense",modal:!0},{default:n(()=>[l(Q,{name:"file",onUploader:q,onSelect:P,maxFileSize:1e6,customUpload:""})]),_:1},8,["visible"]),l(_,{visible:f.value,"onUpdate:visible":e[9]||(e[9]=s=>f.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[l(r,{label:"No",icon:"pi pi-times",text:"",onClick:e[8]||(e[8]=s=>f.value=!1)}),l(r,{label:"Yes",icon:"pi pi-check",onClick:B})]),default:n(()=>[o("div",ke,[Ee,a.value?(C(),h("span",we,[N("Are you sure you want to delete "),o("b",null,ce(a.value.name),1),N("?")])):w("",!0)])]),_:1},8,["visible"]),l(_,{visible:b.value,"onUpdate:visible":e[11]||(e[11]=s=>b.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[l(r,{label:"No",icon:"pi pi-times",text:"",onClick:e[10]||(e[10]=s=>b.value=!1)}),l(r,{label:"Yes",icon:"pi pi-check",text:"",onClick:O})]),default:n(()=>[o("div",De,[Se,d.value?(C(),h("span",Ve,"Are you sure you want to delete the selected expenses?")):w("",!0)])]),_:1},8,["visible"])])],64)}}};export{Be as default};
