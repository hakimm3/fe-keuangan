import{s as ee}from"./index-CmCuRXjW.js";import{s as le,a as ae,b as te,c as se,d as oe,e as ie,f as ne,g as ue}from"./BaseServices-C7MaePp3.js";import{s as de,a as re,b as ce}from"./index-BFNgdO1s.js";import{M as g}from"./MyWalletService-D6Z2Osts.js";import{W as ve}from"./WalletService-DFNdWtQt.js";import{b as n,d as me,f as fe,o as p,c as b,a as o,e as t,g as i,F as pe,t as x,h as W,j as k,k as be}from"./index-CqvKQK5V.js";import"./axios-BimPEqV4.js";const ye={class:"card flex items-center justify-between py-3"},_e=o("h2",{class:"font-semibold text-2xl"},"My Wallets",-1),he={class:"card"},ge={class:"flex flex-wrap gap-2 items-center justify-between"},ke=o("h4",{class:"m-0"},"Manage My Wallets",-1),we=o("i",{class:"pi pi-search"},null,-1),xe={class:"flex flex-col gap-6"},Ce=o("label",{for:"wallet",class:"block font-bold mb-3"},"Wallet",-1),Me={key:0,class:"text-red-500"},We=o("label",{for:"date",class:"block font-bold mb-3"},"Description",-1),Ve=o("label",{for:"name",class:"block font-bold mb-3"},"Balance",-1),De={key:0,class:"text-red-500"},Se=o("label",{for:"price",class:"block font-bold mb-3"},"Monthly Fee",-1),$e={key:0,class:"text-red-500"},Ie=o("label",{for:"status",class:"block font-bold mb-3"},"Status",-1),Ne={class:"flex items-center gap-4"},Pe=o("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),Te={key:0},Ue={class:"flex items-center gap-4"},Le=o("i",{class:"pi pi-exclamation-triangle !text-3xl"},null,-1),Be={key:0},Ye={__name:"MyWallet",setup(qe){const d=n(),V=n(),w=n(!1),T=async()=>{try{w.value=!0,d.value=await g.getData()}catch(a){console.error(a)}finally{w.value=!1}},U=async()=>{try{w.value=!0,V.value=await ve.getData().then(a=>a.map(l=>({label:l.name,value:l})))}catch(a){console.error(a)}finally{w.value=!1}};me(()=>{T(),U()});const y=fe(),D=n(),m=n(!1),_=n(!1),h=n(!1),e=n({}),c=n(),C=n({global:{value:null,matchMode:be.CONTAINS}}),r=n(!1);function S(a){if(a)return a.toLocaleString("id-ID",{style:"currency",currency:"IDR"})}function $(a){y.add({severity:"error",summary:"Error",detail:a,life:3e3})}function L(){e.value={},r.value=!1,m.value=!0}function B(){m.value=!1,r.value=!1}async function q(){if(r.value=!0,e!=null&&e.value.wallet_id&&(e!=null&&e.value.balance)&&(e!=null&&e.value.monthly_fee)){if(e.value.id){const a=await g.update(e.value.id,{wallet_id:e.value.wallet_id.value.id,description:e.value.description,balance:e.value.balance,monthly_fee:e.value.monthly_fee,status:e.value.status.value});if(a.status===422){$(a.data.message);return}d.value[R(e.value.id)]={id:e.value.id,description:e.value.description,balance:e.value.balance,monthly_fee:e.value.monthly_fee,wallet:{name:e.value.wallet_id.value.name},status:e.value.status.value},y.add({severity:"success",summary:"Successful",detail:"My Wallet Updated",life:3e3})}else{const a=await g.create({wallet_id:e.value.wallet_id.value.id,description:e.value.description,balance:e.value.balance,monthly_fee:e.value.monthly_fee,status:e.value.status.value});if(a.status===422){$(a.data.message);return}d.value.unshift({balance:e.value.balance,description:e.value.description,monthly_fee:e.value.monthly_fee,wallet:{name:e.value.wallet_id.value.name},status:e.value.status.value}),y.add({severity:"success",summary:"Successful",detail:"My Wallet Created",life:3e3})}m.value=!1,e.value={}}}function F(a){e.value={id:a.id,balance:a.balance,monthly_fee:a.monthly_fee,wallet_id:{label:a.wallet.name,value:a.wallet},description:a.description,status:{label:a.status?"Active":"Inactive",value:a.status}},m.value=!0}function A(a){e.value=a,_.value=!0}function E(){g.delete(e.value.id),d.value=d.value.filter(a=>a.id!==e.value.id),_.value=!1,e.value={},y.add({severity:"success",summary:"Successful",detail:"Wallets Deleted",life:3e3})}function R(a){let l=-1;for(let f=0;f<d.value.length;f++)if(d.value[f].id===a){l=f;break}return l}function j(){D.value.exportCSV()}function H(){h.value=!0}function O(){let a=c.value.map(l=>l.id);g.bulkDelete({ids:a}),d.value=d.value.filter(l=>!a.includes(l.id)),h.value=!1,c.value=null,y.add({severity:"success",summary:"Successful",detail:"Wallets Deleted",life:3e3})}const Y=n([{label:"Dashboard",to:"/"},{label:"Data"},{label:"Expense"}]),K=n({icon:"pi pi-home",to:"/"});return(a,l)=>{const f=le,u=de,z=ae,G=se,I=re,J=oe,v=ie,Q=ce,X=te,N=ne,P=ue,M=ee;return p(),b(pe,null,[o("div",ye,[_e,t(f,{home:K.value,model:Y.value},null,8,["home","model"])]),o("div",null,[o("div",he,[t(z,{class:"mb-6"},{start:i(()=>[t(u,{label:"New",icon:"pi pi-plus",severity:"secondary",class:"mr-2",onClick:L}),t(u,{label:"Delete",icon:"pi pi-trash",severity:"secondary",onClick:H,disabled:!c.value||!c.value.length},null,8,["disabled"]),t(u,{label:"Transaction History",icon:"pi pi-list",severity:"secondary",class:"ml-2",as:"router-link",to:{name:"myWalletTransactions"}})]),end:i(()=>[t(u,{label:"Export",icon:"pi pi-upload",severity:"secondary",onClick:l[0]||(l[0]=s=>j(s))})]),_:1}),t(X,{ref_key:"dt",ref:D,selection:c.value,"onUpdate:selection":l[2]||(l[2]=s=>c.value=s),value:d.value,dataKey:"id",paginator:!0,rows:10,filters:C.value,paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],currentPageReportTemplate:"Showing {first} to {last} of {totalRecords} Wallets"},{header:i(()=>[o("div",ge,[ke,t(J,null,{default:i(()=>[t(G,null,{default:i(()=>[we]),_:1}),t(I,{modelValue:C.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=s=>C.value.global.value=s),placeholder:"Search..."},null,8,["modelValue"])]),_:1})])]),default:i(()=>[t(v,{selectionMode:"multiple",style:{width:"3rem"},exportable:!1}),t(v,{field:"wallet.name",header:"Wallet",sortable:""}),t(v,{field:"description",header:"Description"}),t(v,{field:"balance",header:"Balance",sortable:""},{body:i(s=>[o("span",null,x(S(s.data.balance)),1)]),_:1}),t(v,{field:"monthly_fee",header:"Monthly Fee",sortable:""},{body:i(s=>[o("span",null,x(S(s.data.monthly_fee)),1)]),_:1}),t(v,{field:"status",header:"Status",sortable:""},{body:i(s=>[t(Q,{severity:s.data.status?"success":"danger"},{default:i(()=>[W(x(s.data.status?"Active":"Inactive"),1)]),_:2},1032,["severity"])]),_:1}),t(v,{exportable:!1,style:{"min-width":"12rem"}},{body:i(s=>[t(u,{icon:"pi pi-pencil",outlined:"",rounded:"",class:"mr-2",onClick:Z=>F(s.data)},null,8,["onClick"]),t(u,{icon:"pi pi-trash",outlined:"",rounded:"",severity:"danger",onClick:Z=>A(s.data)},null,8,["onClick"])]),_:1})]),_:1},8,["selection","value","filters"])]),t(M,{visible:m.value,"onUpdate:visible":l[8]||(l[8]=s=>m.value=s),style:{width:"450px"},header:"My Wallet Details",modal:!0},{footer:i(()=>[t(u,{label:"Cancel",icon:"pi pi-times",text:"",onClick:B}),t(u,{label:"Save",icon:"pi pi-check",onClick:q})]),default:i(()=>[o("div",xe,[o("div",null,[Ce,t(N,{id:"wallet_id",modelValue:e.value.wallet_id,"onUpdate:modelValue":l[3]||(l[3]=s=>e.value.wallet_id=s),options:V.value,optionLabel:"label",placeholder:"Select a Category",required:"true",invalid:r.value&&!e.value.wallet_id,fluid:""},null,8,["modelValue","options","invalid"]),r.value&&!e.value.wallet_id?(p(),b("small",Me,"Wallet is required.")):k("",!0)]),o("div",null,[We,t(I,{id:"description",modelValue:e.value.description,"onUpdate:modelValue":l[4]||(l[4]=s=>e.value.description=s),modelModifiers:{trim:!0},required:"true",fluid:""},null,8,["modelValue"])]),o("div",null,[Ve,t(P,{id:"balance",modelValue:e.value.balance,"onUpdate:modelValue":l[5]||(l[5]=s=>e.value.balance=s),modelModifiers:{trim:!0},required:"true",autofocus:"",invalid:r.value&&!e.value.balance,fluid:""},null,8,["modelValue","invalid"]),r.value&&!e.value.balance?(p(),b("small",De,"description is required.")):k("",!0)]),o("div",null,[Se,t(P,{id:"monthly_fee",modelValue:e.value.monthly_fee,"onUpdate:modelValue":l[6]||(l[6]=s=>e.value.monthly_fee=s),modelModifiers:{trim:!0},required:"true",invalid:r.value&&!e.value.monthly_fee,fluid:""},null,8,["modelValue","invalid"]),r.value&&!e.value.monthly_fee?(p(),b("small",$e,"Monthly fee is required.")):k("",!0)]),o("div",null,[Ie,t(N,{id:"status",modelValue:e.value.status,"onUpdate:modelValue":l[7]||(l[7]=s=>e.value.status=s),options:[{label:"Active",value:1},{label:"Inactive",value:0}],optionLabel:"label",placeholder:"Select a Status",required:"true",invalid:r.value&&!e.value.status,fluid:""},null,8,["modelValue","invalid"])])])]),_:1},8,["visible"]),t(M,{visible:_.value,"onUpdate:visible":l[10]||(l[10]=s=>_.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:i(()=>[t(u,{label:"No",icon:"pi pi-times",text:"",onClick:l[9]||(l[9]=s=>_.value=!1)}),t(u,{label:"Yes",icon:"pi pi-check",onClick:E})]),default:i(()=>[o("div",Ne,[Pe,e.value?(p(),b("span",Te,[W("Are you sure you want to delete "),o("b",null,x(e.value.description),1),W("?")])):k("",!0)])]),_:1},8,["visible"]),t(M,{visible:h.value,"onUpdate:visible":l[12]||(l[12]=s=>h.value=s),style:{width:"450px"},header:"Confirm",modal:!0},{footer:i(()=>[t(u,{label:"No",icon:"pi pi-times",text:"",onClick:l[11]||(l[11]=s=>h.value=!1)}),t(u,{label:"Yes",icon:"pi pi-check",text:"",onClick:O})]),default:i(()=>[o("div",Ue,[Le,c.value?(p(),b("span",Be,"Are you sure you want to delete the selected wallets?")):k("",!0)])]),_:1},8,["visible"])])],64)}}};export{Ye as default};
