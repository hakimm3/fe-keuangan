import{s as X}from"./index-BxmazQUx.js";import{s as Z}from"./index-CmCuRXjW.js";import{s as ee,a as te,b as le,c as ae,d as oe,e as ie}from"./BaseServices-C7MaePp3.js";import{s as se,a as ne}from"./index-BFNgdO1s.js";import{I as v}from"./IncomeCategoryService-Yg7oeUWD.js";import{b as s,d as re,f as ue,o as x,c as h,a as i,e as t,g as n,F as de,j as w,h as N,t as ce,k as me}from"./index-CqvKQK5V.js";import"./index-BxPp5uvz.js";import"./axios-BimPEqV4.js";const pe={class:"card flex items-center justify-between py-3"},ve=i("h2",{class:"font-semibold text-2xl"},"Income Categories",-1),fe={class:"card"},be={class:"flex flex-wrap gap-2 items-center justify-between"},ge=i("h4",{class:"m-0"},"Manage Income Categories",-1),ye=i("i",{class:"pi pi-search"},null,-1),_e={class:"flex flex-col gap-6"},Ce=i("label",{for:"name",class:"block font-bold mb-3"},"Name",-1),xe={key:0,class:"text-red-500"},he=i("label",{for:"description",class:"block font-bold mb-3"},"Description",-1),ke={class:"flex items-center gap-4"},Ie=i("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),we={key:0},De={class:"flex items-center gap-4"},Se=i("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),Ve={key:0},Ee={__name:"IncomeCategory",setup(Ue){const a=s(),u=s(),D=s(!1),S=async()=>{try{D.value=!0,u.value=await v.getData()}catch(l){console.error(l)}finally{D.value=!1}};re(()=>{S()});const c=ue(),V=s(),m=s(!1),y=s(!1),f=s(!1),b=s(!1),U=s(null),d=s(),k=s({global:{value:null,matchMode:me.CONTAINS}}),g=s(!1);function P(l){U.value=l.files[0]}function F(){a.value={},g.value=!1,m.value=!0}function M(){m.value=!1,g.value=!1}function $(l){c.add({severity:"error",summary:"Error",detail:l,life:3e3})}async function T(){if(g.value=!0,a!=null&&a.value.name){if(a.value.id){const l=await v.update(a.value.id,{name:a.value.name,description:a.value.description});if(l.status===422){$(l.data.message);return}u.value[R(a.value.id)]=a.value,c.add({severity:"success",summary:"Successful",detail:"Income Categories Updated",life:3e3})}else{const l=await v.create({name:a.value.name,description:a.value.description});if(l.status===422){$(l.data.message);return}u.value.unshift(l.data),c.add({severity:"success",summary:"Successful",detail:"Income Categories Created",life:3e3})}m.value=!1,a.value={}}}function L(l){a.value={id:l.id,name:l.name,description:l.description},m.value=!0}function B(l){a.value=l,f.value=!0}function E(){v.delete(a.value.id),u.value=u.value.filter(l=>l.id!==a.value.id),f.value=!1,a.value={},c.add({severity:"success",summary:"Successful",detail:"Income Deleted",life:3e3})}function R(l){let e=-1;for(let p=0;p<u.value.length;p++)if(u.value[p].id===l){e=p;break}return e}function j(){V.value.exportCSV()}function q(){v.import({file:U.value}).then(()=>{S()}).catch(l=>{console.error(l)}),y.value=!1,c.add({severity:"info",summary:"Success",detail:"File Uploaded",life:3e3})}function A(){b.value=!0}function O(){let l=d.value.map(e=>e.id);v.bulkDelete({ids:l}),u.value=u.value.filter(e=>!l.includes(e.id)),b.value=!1,d.value=null,c.add({severity:"success",summary:"Successful",detail:"Income Deleted",life:3e3})}const Y=s([{label:"Dashboard",to:"/"},{label:"Master Data"},{label:"Income Categories"}]),z=s({icon:"pi pi-home",to:"/"});return(l,e)=>{const p=ee,r=se,H=te,K=ae,I=ne,G=oe,_=ie,J=le,C=Z,Q=X;return x(),h(de,null,[i("div",pe,[ve,t(p,{home:z.value,model:Y.value},null,8,["home","model"])]),i("div",null,[i("div",fe,[t(H,{class:"mb-6"},{start:n(()=>[t(r,{label:"New",icon:"pi pi-plus",severity:"secondary",class:"mr-2",onClick:F}),t(r,{label:"Delete",icon:"pi pi-trash",severity:"secondary",onClick:A,disabled:!d.value||!d.value.length},null,8,["disabled"])]),end:n(()=>[t(r,{label:"Import",icon:"pi pi-download",severity:"secondary mx-2",onClick:e[0]||(e[0]=o=>y.value=!0)}),t(r,{label:"Export",icon:"pi pi-upload",severity:"secondary",onClick:e[1]||(e[1]=o=>j(o))})]),_:1}),t(J,{ref_key:"dt",ref:V,selection:d.value,"onUpdate:selection":e[3]||(e[3]=o=>d.value=o),value:u.value,dataKey:"id",paginator:!0,rows:10,filters:k.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} income categories"},{header:n(()=>[i("div",be,[ge,t(G,null,{default:n(()=>[t(K,null,{default:n(()=>[ye]),_:1}),t(I,{modelValue:k.value.global.value,"onUpdate:modelValue":e[2]||(e[2]=o=>k.value.global.value=o),placeholder:"Search..."},null,8,["modelValue"])]),_:1})])]),default:n(()=>[t(_,{selectionMode:"multiple",style:{width:"3rem"},exportable:!1}),t(_,{field:"name",header:"Name",sortable:""}),t(_,{field:"description",header:"Description",sortable:""}),t(_,{exportable:!1},{body:n(o=>[t(r,{icon:"pi pi-pencil",outlined:"",rounded:"",class:"mr-2",onClick:W=>L(o.data)},null,8,["onClick"]),t(r,{icon:"pi pi-trash",outlined:"",rounded:"",severity:"danger",onClick:W=>B(o.data)},null,8,["onClick"])]),_:1})]),_:1},8,["selection","value","filters"])]),t(C,{visible:m.value,"onUpdate:visible":e[6]||(e[6]=o=>m.value=o),style:{width:"450px"},header:"Income Category Details",modal:!0},{footer:n(()=>[t(r,{label:"Cancel",icon:"pi pi-times",text:"",onClick:M}),t(r,{label:"Save",icon:"pi pi-check",onClick:T})]),default:n(()=>[i("div",_e,[i("div",null,[Ce,t(I,{id:"name",modelValue:a.value.name,"onUpdate:modelValue":e[4]||(e[4]=o=>a.value.name=o),modelModifiers:{trim:!0},required:"true",autofocus:"",invalid:g.value&&!a.value.name,fluid:""},null,8,["modelValue","invalid"]),g.value&&!a.value.name?(x(),h("small",xe,"name is required.")):w("",!0)]),i("div",null,[he,t(I,{id:"description",modelValue:a.value.description,"onUpdate:modelValue":e[5]||(e[5]=o=>a.value.description=o),modelModifiers:{trim:!0},required:"true",autofocus:"",fluid:""},null,8,["modelValue"])])])]),_:1},8,["visible"]),t(C,{visible:y.value,"onUpdate:visible":e[7]||(e[7]=o=>y.value=o),style:{width:"450px"},header:"Import Income Categories",modal:!0},{default:n(()=>[t(Q,{name:"file",onUploader:q,onSelect:P,maxFileSize:1e6,customUpload:""})]),_:1},8,["visible"]),t(C,{visible:f.value,"onUpdate:visible":e[9]||(e[9]=o=>f.value=o),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(r,{label:"No",icon:"pi pi-times",text:"",onClick:e[8]||(e[8]=o=>f.value=!1)}),t(r,{label:"Yes",icon:"pi pi-check",onClick:E})]),default:n(()=>[i("div",ke,[Ie,a.value?(x(),h("span",we,[N("Are you sure you want to delete "),i("b",null,ce(a.value.name),1),N("?")])):w("",!0)])]),_:1},8,["visible"]),t(C,{visible:b.value,"onUpdate:visible":e[11]||(e[11]=o=>b.value=o),style:{width:"450px"},header:"Confirm",modal:!0},{footer:n(()=>[t(r,{label:"No",icon:"pi pi-times",text:"",onClick:e[10]||(e[10]=o=>b.value=!1)}),t(r,{label:"Yes",icon:"pi pi-check",text:"",onClick:O})]),default:n(()=>[i("div",De,[Se,d.value?(x(),h("span",Ve,"Are you sure you want to delete the selected income categories?")):w("",!0)])]),_:1},8,["visible"])])],64)}}};export{Ee as default};
