(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const Ie=(e,t)=>t.some(a=>e instanceof a);let Pe,Ve;function gt(){return Pe||(Pe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vt(){return Ve||(Ve=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Se=new WeakMap,me=new WeakMap,ue=new WeakMap;function wt(e){const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(_(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",i)});return ue.set(t,e),t}function It(e){if(Se.has(e))return;const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Se.set(e,t)}let ke={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Se.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return _(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ze(e){ke=e(ke)}function St(e){return vt().includes(e)?function(...t){return e.apply(Ce(this),t),_(this.request)}:function(...t){return _(e.apply(Ce(this),t))}}function kt(e){return typeof e=="function"?St(e):(e instanceof IDBTransaction&&It(e),Ie(e,gt())?new Proxy(e,ke):e)}function _(e){if(e instanceof IDBRequest)return wt(e);if(me.has(e))return me.get(e);const t=kt(e);return t!==e&&(me.set(e,t),ue.set(t,e)),t}const Ce=e=>ue.get(e);function Ct(e,t,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const i=indexedDB.open(e,t),s=_(i);return n&&i.addEventListener("upgradeneeded",l=>{n(_(i.result),l.oldVersion,l.newVersion,_(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),r&&l.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),s}const $t=["get","getKey","getAll","getAllKeys","count"],xt=["put","add","delete","clear"],be=new Map;function qe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(be.get(t))return be.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,r=xt.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||$t.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,r?"readwrite":"readonly");let d=l.store;return n&&(d=d.index(s.shift())),(await Promise.all([d[a](...s),r&&l.done]))[0]};return be.set(t,o),o}Ze(e=>({...e,get:(t,a,n)=>qe(t,a)||e.get(t,a,n),has:(t,a)=>!!qe(t,a)||e.has(t,a)}));const Mt=["continue","continuePrimaryKey","advance"],Oe={},$e=new WeakMap,Je=new WeakMap,Tt={get(e,t){if(!Mt.includes(t))return e[t];let a=Oe[t];return a||(a=Oe[t]=function(...n){$e.set(this,Je.get(this)[t](...n))}),a}};async function*Dt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,Tt);for(Je.set(a,t),ue.set(a,Ce(t));t;)yield a,t=await($e.get(a)||t.continue()),$e.delete(a)}function Re(e,t){return t===Symbol.asyncIterator&&Ie(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ie(e,[IDBIndex,IDBObjectStore])}Ze(e=>({...e,get(t,a,n){return Re(t,a)?Dt:e.get(t,a,n)},has(t,a){return Re(t,a)||e.has(t,a)}}));const L=Ct("investment_purchase_tracker",3,{async upgrade(e,t,a,n){const r=n,o=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const d=l.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.archived!="boolean"&&(d.archived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await l.update(d)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const d=l.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await l.update(d)),l=await l.continue()}}}});async function At(){return(await L).getAll("inventory")}async function ie(e){await(await L).put("inventory",e)}async function Ae(e){return(await L).get("inventory",e)}async function Et(){return(await L).getAll("categories")}async function xe(e){await(await L).put("categories",e)}async function Ke(e){return(await L).get("categories",e)}async function Nt(){return(await L).getAll("settings")}async function O(e,t){await(await L).put("settings",{key:e,value:t})}async function Ye(e){const a=(await L).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);await a.done}async function Lt(){const t=(await L).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function Be(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function Ft(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Xe(e,t){const a=new Set([t]);let n=!0;for(;n;){n=!1;for(const r of e)r.linkedToFilterId&&a.has(r.linkedToFilterId)&&!a.has(r.id)&&(a.add(r.id),n=!0)}return e.filter(r=>!a.has(r.id))}function Pt(e,t){return e.filter(a=>a.viewId!==t)}function Me(e,t,a,n,r){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var c;const d=i.get(l.field);if(!d)return!0;const f=d.getValue(s);if(l.op==="eq")return String(f)===l.value;if(l.op==="isEmpty")return Be(f);if(l.op==="isNotEmpty")return!Be(f);if(l.op==="contains")return String(f).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const g=((c=r==null?void 0:r.categoryDescendantsMap)==null?void 0:c.get(l.value))||new Set([l.value]),v=String(f);return g.has(v)}return!0}))}function Vt(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:t,children:a}}function pe(e){const{children:t}=Vt(e),a=new Map;function n(r){const o=new Set([r]);for(const i of t.get(r)||[])for(const s of n(i.id))o.add(s);return a.set(r,o),o}for(const r of e)a.has(r.id)||n(r.id);return a}function Ee(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const r=[],o=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),r.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function Ne(e,t){return[...pe(e).get(t)||new Set([t])]}function qt(e,t){const a=pe(t),n=new Map;for(const r of t){const o=a.get(r.id)||new Set([r.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(r.id,i)}return n}const et=document.querySelector("#app");if(!et)throw new Error("#app not found");const I=et;let x={kind:"none"},Y=null,B=null,q=null,F=null,P=null,je=!1,ne=null,ye=!1,he=null,X=null,se=null,Ge=!1,Ue=!1,W=new Set,_e=!1,re=null,J=null,ee=null;const Te={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!1}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},Q=JSON.stringify(Te);let p={inventoryRecords:[],categories:[],settings:[],reportDateFrom:tt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:Q,storageUsageBytes:null,storageQuotaBytes:null};const le="USD",Z="$",te=!1,ce=!1,Ot=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function N(){return new Date().toISOString()}function Rt(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function tt(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function ge(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function C(e){const t=j("currencySymbol")||Z,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function de(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function j(e){var t;return(t=p.settings.find(a=>a.key===e))==null?void 0:t.value}function Bt(e){var n;const t=(n=e.find(r=>r.key==="darkMode"))==null?void 0:n.value,a=typeof t=="boolean"?t:te;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function T(e){p={...p,...e},R()}function at(e){J!=null&&(window.clearTimeout(J),J=null),ee=e,R(),e&&(J=window.setTimeout(()=>{J=null,ee=null,R()},3500))}function G(e){x.kind==="none"&&document.activeElement instanceof HTMLElement&&(Y=document.activeElement),x=e,R()}function H(){x.kind!=="none"&&(x={kind:"none"},R(),Y&&Y.isConnected&&Y.focus(),Y=null)}function nt(){return I.querySelector(".modal-panel")}function rt(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function jt(){if(x.kind==="none")return;const e=nt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(rt(e)[0]||e).focus()}function Gt(){var e,t;(e=B==null?void 0:B.destroy)==null||e.call(B),(t=q==null?void 0:q.destroy)==null||t.call(q),B=null,q=null}function De(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){he==null&&(he=window.setTimeout(()=>{he=null,De(),R()},500)),ye||(ye=!0,window.addEventListener("load",()=>{ye=!1,De(),R()},{once:!0}));return}const n=I.querySelector("#categories-table"),r=I.querySelector("#inventory-table"),o=(s,l)=>{var d,f;return t?new t(s,l):a?((f=(d=a(s)).DataTable)==null?void 0:f.call(d,l))??null:null};n&&(B=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),r&&(q=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Zt(r,q))}function Ut(e,t,a){const n=t.find(o=>o.key==="computedTotalCents");return n?(a?e:e.filter(o=>o.parentId==null)).map(o=>{const i=n.getValue(o);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:o.id,label:o.pathNames.join(" / "),totalCents:i}}).filter(o=>o!=null).sort((o,i)=>i.totalCents-o.totalCents):[]}function oe(e,t){const a=I.querySelector(`#${e}`),n=I.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=t,n.hidden=!1)}function He(e){const t=I.querySelector(`#${e}`),a=I.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function _t(){F==null||F.dispose(),P==null||P.dispose(),F=null,P=null}function Ht(){je||(je=!0,window.addEventListener("resize",()=>{ne!=null&&window.clearTimeout(ne),ne=window.setTimeout(()=>{ne=null,F==null||F.resize(),P==null||P.resize()},120)}))}function zt(){const e=new Map;for(const t of p.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Wt(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function Qt(e){const t="markets-allocation-chart",a="markets-top-chart",n=I.querySelector(`#${t}`),r=I.querySelector(`#${a}`);if(!n||!r)return;if(!window.echarts){oe(t,"Chart unavailable: ECharts not loaded."),oe(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){oe(t,"No eligible market totals to chart."),oe(a,"No eligible market totals to chart.");return}He(t),He(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],d=i?"#e9ecef":"#212529",f=i?"#ced4da":"#495057",c=e.map(y=>({name:y.label,value:y.totalCents})),g=e.slice(0,5),v=[...g].reverse(),w=g.reduce((y,b)=>Math.max(y,b.totalCents),0),A=w>0?Math.ceil(w*1.2):1;F=window.echarts.init(n),P=window.echarts.init(r),F.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:y=>`${u(y.name)}: ${C(y.value)} (${y.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:d,fontSize:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:d,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["46%","50%"],data:c,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:y=>{const b=y.percent??0;return`${Math.round(b)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:f,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),P.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:y=>{const b=y[0];return b?`${u(b.name)}: ${C(b.value)}`:""}},xAxis:{type:"value",max:A,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:v.map(y=>y.label),axisLabel:{color:f,fontSize:s,formatter:y=>Wt(y)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:v.map(y=>y.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:d,fontSize:s,formatter:y=>C(y.value)}}]}),Ht()}function Zt(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var c,g,v;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(r);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(c=t.order)==null?void 0:c.call(t),d=Array.isArray(l)?l[0]:void 0,f=d&&d[0]===s&&d[1]==="asc"?"desc":"asc";(g=t.order)==null||g.call(t,[[s,f]]),(v=t.draw)==null||v.call(t,!1)},!0)}async function D(){var d,f;const[e,t,a]=await Promise.all([At(),Et(),Nt()]),n=Ee(t).sort((c,g)=>c.sortOrder-g.sortOrder||c.name.localeCompare(g.name));a.some(c=>c.key==="currencyCode")||(await O("currencyCode",le),a.push({key:"currencyCode",value:le})),a.some(c=>c.key==="currencySymbol")||(await O("currencySymbol",Z),a.push({key:"currencySymbol",value:Z})),a.some(c=>c.key==="darkMode")||(await O("darkMode",te),a.push({key:"darkMode",value:te})),a.some(c=>c.key==="showMarketsGraphs")||(await O("showMarketsGraphs",ce),a.push({key:"showMarketsGraphs",value:ce})),Bt(a);let r=null,o=null;try{const c=await((f=(d=navigator.storage)==null?void 0:d.estimate)==null?void 0:f.call(d));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,o=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,o=null}let i=p.reportDateFrom,s=p.reportDateTo,l=p.importText;if(n.length>0&&l===Q?l="":n.length===0&&!l.trim()&&(l=Q),!_e){const c=Rt(e);c&&(i=c),s=new Date().toISOString().slice(0,10),_e=!0}p={...p,inventoryRecords:e,categories:n,settings:a,storageUsageBytes:r,storageQuotaBytes:o,reportDateFrom:i,reportDateTo:s,importText:l},R()}function $(e){if(e)return p.categories.find(t=>t.id===e)}function Jt(e){const t=$(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function Kt(e){return Jt(e)}function Yt(e){const t=$(e);return t?t.pathIds.some(a=>{var n;return((n=$(a))==null?void 0:n.active)===!1}):!1}function Xt(e){const t=$(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=$(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function ea(e){return e.active&&!Xt(e)}function K(e){return e==null?"":(e/100).toFixed(2)}function Le(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const r=Number(t.value),o=de(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function ot(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="baselineValue"]'),r=e.querySelector('input[name="baselineValueDisplay"]');!t||!a||!n||(t.value==="create"&&(n.value=a.value),r&&(r.value=n.value||a.value))}function it(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),n=e.querySelector('input[name="quantity"]'),r=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!a||!n)return;const l=$(t.value),d=(l==null?void 0:l.evaluationMode)==="spot",f=(l==null?void 0:l.evaluationMode)==="snapshot";a.hidden=!d,d?n.readOnly=!1:((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0),r&&(r.hidden=!f),f&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function st(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]'),r=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]');if(!t||!a||!n||!r||!o)return;const i=t.value==="spot";a.hidden=!i,n.disabled=!i,r.hidden=!i,o.disabled=!i}function U(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function lt(e){return e.active&&!e.archived}function ct(){const e=p.inventoryRecords.filter(lt),t=p.categories.filter(o=>!o.isArchived),a=qt(e,t),n=new Map(p.categories.map(o=>[o.id,o])),r=new Map;for(const o of e){const i=n.get(o.categoryId);if(i)for(const s of i.pathIds)r.set(s,(r.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:r}}function dt(e,t){const a=new Map;p.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const n=new Map,r=o=>{const i=n.get(o);if(i!=null)return i;const s=$(o);if(!s||s.isArchived)return n.set(o,0),0;let l=0;const d=a.get(s.id)||[];return d.length>0?l=d.reduce((f,c)=>f+r(c.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,n.set(o,l),l};return p.categories.forEach(o=>{o.isArchived||r(o.id)}),n}function ut(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>Kt(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?C(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>C(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ta(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":C(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function pt(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(e=>!e.archived)}function aa(){return p.showArchivedCategories?p.categories:p.categories.filter(e=>!e.isArchived)}function na(){const e=ut(),t=ta(),a=t.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),n=t.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),r=pe(p.categories),o=Me(pt(),p.filters,"inventoryTable",e,{categoryDescendantsMap:r}),{categoryTotals:i,categoryQty:s}=ct(),l=dt(i,s),d=[...a,{key:"computedQty",label:"Qty",getValue:c=>s.get(c.id)||0,getDisplay:c=>String(s.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>i.get(c.id)||0,getDisplay:c=>C(i.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:c=>l.get(c.id)||0,getDisplay:c=>C(l.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],f=Me(aa(),p.filters,"categoriesList",d);return{inventoryColumns:e,categoryColumns:d,categoryDescendantsMap:r,filteredInventoryRecords:o,filteredCategories:f,categoryTotals:i,categoryQty:s}}function ze(e,t,a=""){const n=p.filters.filter(r=>r.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(r=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${u(r.label)}"
                  aria-label="Remove filter: ${u(r.label)}"
                  data-action="remove-filter"
                  data-filter-id="${r.id}"
                >${u(r.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function ve(e,t,a){const n=a.getValue(t),r=a.getDisplay(t),o=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),d=Yt(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(r)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}</span></button>`}function ft(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function ra(e,t){const a=e.map((n,r)=>{let o=0,i=!1;for(const l of t){const d=n.getValue(l);typeof d=="number"&&Number.isFinite(d)&&(o+=d,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?C(o):ft(o):r===0?"Totals":"";return`<th class="${U(n)}">${u(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function oa(e,t){const a=new Set(t.map(i=>i.id)),n=t.filter(i=>!i.parentId||!a.has(i.parentId)),r=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=r.has(String(i.key))?n:t;let d=0,f=!1;for(const g of l){const v=i.getValue(g);typeof v=="number"&&Number.isFinite(v)&&(d+=v,f=!0)}const c=f?String(i.key).toLowerCase().includes("cents")?C(d):ft(d):s===0?"Totals":"";return`<th class="${U(i)}">${u(c)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function We(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function ia(e,t){const a=[...e];return a.filter(r=>{for(const o of a){if(o===r)continue;const i=t.get(o);if(i!=null&&i.has(r))return!1}return!0})}function sa(e){const t=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&t.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?ia(a,e):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function la(e){const t=sa(e),a=zt(),{categoryTotals:n,categoryQty:r}=ct(),o=dt(n,r),i=new Map;for(const y of p.inventoryRecords){if(!lt(y))continue;const b=y.baselineValueCents??0;if(!Number.isFinite(b))continue;const h=$(y.categoryId);if(h)for(const E of h.pathIds)i.set(E,(i.get(E)||0)+b)}const s=[],l={};let d=0,f=0,c=0,g=0;const v=y=>{const b=$(y);if(!b)return null;const h=i.get(y)||0,E=o.get(y)||0,V=E-h,fe=h>0?V/h:null;return{marketId:y,marketLabel:b.pathNames.join(" / "),startValueCents:h,endValueCents:E,contributionsCents:E-h,netGrowthCents:V,growthPct:fe}},w=new Set,A=y=>w.has(y)?[]:(w.add(y),(a.get(y)||[]).map(b=>v(b)).filter(b=>b!=null).sort((b,h)=>b.marketLabel.localeCompare(h.marketLabel)));for(const y of t){const b=v(y);b&&(l[y]=A(y),d+=b.startValueCents||0,f+=b.endValueCents||0,c+=b.contributionsCents||0,g+=b.netGrowthCents||0,s.push(b))}return c=f-d,g=f-d,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:d,endTotalCents:f,contributionsTotalCents:c,netGrowthTotalCents:g,hasManualSnapshots:!1}}function we(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function z(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function ca(){if(x.kind==="none")return"";const e=j("currencySymbol")||Z,t=(a,n)=>p.categories.filter(r=>!r.isArchived).filter(r=>!(a!=null&&a.has(r.id))).map(r=>`<option value="${r.id}" ${n===r.id?"selected":""}>${u(r.pathNames.join(" / "))}</option>`).join("");if(x.kind==="settings")return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-settings" tabindex="-1">
            <div class="modal-header">
              <h2 id="modal-title-settings" class="modal-title fs-5">Settings</h2>
              <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
            </div>
            <form id="settings-form">
              <div class="modal-body d-grid gap-3">
                <label class="form-label mb-0">
                  Currency code
                  <input class="form-control" name="currencyCode" value="${u((j("currencyCode")||le).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Ot.map(a=>`<option value="${u(a.value)}" ${(j("currencySymbol")||Z)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${j("darkMode")??te?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${j("showMarketsGraphs")??ce?"checked":""} />
                  <span class="form-check-label">Show Markets graphs</span>
                </label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save settings</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;if(x.kind==="categoryCreate"||x.kind==="categoryEdit"){const a=x.kind==="categoryEdit",n=x.kind==="categoryEdit"?$(x.categoryId):void 0;if(a&&!n)return"";const r=a&&n?new Set(Ne(p.categories,n.id)):void 0,o=pe(p.categories);return Me(pt(),p.filters,"inventoryTable",ut(),{categoryDescendantsMap:o}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${u((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${u((n==null?void 0:n.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${t(r,(n==null?void 0:n.parentId)||null)}
              </select>
            </label>
            <label class="form-label mb-0">Evaluation
              <select class="form-select" name="evaluationMode">
                <option value="" ${n!=null&&n.evaluationMode?"":"selected"}></option>
                <option value="spot" ${(n==null?void 0:n.evaluationMode)==="spot"?"selected":""}>Spot</option>
                <option value="snapshot" ${(n==null?void 0:n.evaluationMode)==="snapshot"?"selected":""}>Snapshot</option>
              </select>
            </label>
            <label class="form-label mb-0" data-spot-value-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Value
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(K(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${u((n==null?void 0:n.spotCode)||"")}"
                ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n?n.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            <div class="modal-footer px-0 pb-0">
              ${a&&n?`<button type="button" class="btn ${n.isArchived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-category-subtree-archived" data-id="${n.id}" data-next-archived="${String(!n.isArchived)}">${n.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${a?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(x.kind==="inventoryCreate")return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="inventoryId" value="" />
            <input type="hidden" name="baselineValue" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t()}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled />
              </div>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" checked /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3"></textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;if(x.kind==="inventoryEdit"){const a=x,n=p.inventoryRecords.find(r=>r.id===a.inventoryId);return n?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${u(n.id)}" />
            <input type="hidden" name="baselineValue" value="${u(K(n.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(K(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="${u(K(n.baselineValueCents??n.totalPriceCents))}" disabled />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(K(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${u(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function R(){const e=window.scrollX,t=window.scrollY,a=I.querySelector('details[data-section="data-tools"]');a&&(Ge=a.open);const n=I.querySelector('details[data-section="investments"]');n&&(Ue=n.open),_t(),Gt();const{inventoryColumns:r,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=na(),d=p.filters.some(m=>m.viewId==="categoriesList"),f=Ut(l,o,d),c=la(i),g=j("showMarketsGraphs")??ce,v=new Set([...W].filter(m=>{var k;return(((k=c.childRowsByParent[m])==null?void 0:k.length)||0)>0}));v.size!==W.size&&(W=v);const w=c.startTotalCents>0?c.netGrowthTotalCents/c.startTotalCents:null,A=p.exportText||mt(),y=s.map(m=>`
        <tr class="${[ea(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${r.map(S=>`<td class="${U(S)}">${ve("inventoryTable",m,S)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),b=new Set(l.map(m=>m.id)),h=new Map;for(const m of l){const k=m.parentId&&b.has(m.parentId)?m.parentId:null,S=h.get(k)||[];S.push(m),h.set(k,S)}for(const m of h.values())m.sort((k,S)=>k.sortOrder-S.sortOrder||k.name.localeCompare(S.name));const E=[],V=(m,k)=>{const S=h.get(m)||[];for(const M of S)E.push({category:M,depth:k}),V(M.id,k+1)};V(null,0);const fe=E.map(({category:m,depth:k})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${o.map(S=>{if(S.key==="name"){const M=k>0?(k-1)*1.1:0;return`<td class="${U(S)}"><div class="market-name-wrap" style="padding-left:${M.toFixed(2)}rem">${k>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${ve("categoriesList",m,S)}</div></td>`}return`<td class="${U(S)}">${ve("categoriesList",m,S)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");I.innerHTML=`
    <div class="app-shell container-fluid py-3 py-lg-4">
      <header class="page-header mb-2">
        <div class="section-head">
          <div>
            <h1 class="display-6 mb-1">Investments</h1>
            <p class="text-body-secondary mb-0">Maintain your investments locally with fast filtering, category tracking, and clear totals.</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
          </div>
        </div>
        ${ee?`<div class="alert alert-${ee.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(ee.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          <p class="small text-body-secondary mb-2">
            Scope: ${c.scopeMarketIds.length?`${c.scopeMarketIds.length} market${c.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
          </p>
          ${c.rows.length===0?`
            <p class="mb-0 text-body-secondary">No growth data available for this scope.</p>
          `:`
            <div class="table-wrap table-responsive">
              <table class="table table-striped table-sm align-middle mb-0 dataTable">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th class="text-end">Start</th>
                    <th class="text-end">End</th>
                    <th class="text-end">Growth</th>
                    <th class="text-end">Growth %</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.rows.map(m=>{const k=c.childRowsByParent[m.marketId]||[],S=W.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${k.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${u(m.marketId)}" aria-label="${S?"Collapse":"Expand"} child markets">${S?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${u(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":u(C(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":u(C(m.endValueCents))}</td>
                      <td class="text-end ${z(m.netGrowthCents)}">${m.netGrowthCents==null?"—":u(C(m.netGrowthCents))}</td>
                      <td class="text-end ${z(m.growthPct)}">${u(we(m.growthPct))}</td>
                      </tr>
                      ${k.map(M=>`
                            <tr class="growth-child-row" data-parent-market-id="${u(m.marketId)}" ${S?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${u(M.marketLabel)}</td>
                              <td class="text-end">${M.startValueCents==null?"—":u(C(M.startValueCents))}</td>
                              <td class="text-end">${M.endValueCents==null?"—":u(C(M.endValueCents))}</td>
                              <td class="text-end ${z(M.netGrowthCents)}">${M.netGrowthCents==null?"—":u(C(M.netGrowthCents))}</td>
                              <td class="text-end ${z(M.growthPct)}">${u(we(M.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(C(c.startTotalCents))}</th>
                    <th class="text-end">${u(C(c.endTotalCents))}</th>
                    <th class="text-end ${z(c.netGrowthTotalCents)}">${u(C(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${z(w)}">${u(we(w))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        ${p.categories.length===0?`
          <div class="alert alert-warning py-2 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2" role="status">
            <span class="small mb-0">No markets yet. You can load the default markets template.</span>
            <button type="button" class="btn btn-sm btn-warning" data-action="load-default-markets">Load Default Markets</button>
          </div>
        `:""}
        <div class="section-head markets-section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end markets-section-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${g?`
          <div class="markets-widget-grid mb-2">
            <article class="markets-widget-card card border-0">
              <div class="card-body p-0 p-md-1">
                <div class="markets-chart-frame">
                  <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
                </div>
              </div>
            </article>
            <article class="markets-widget-card card border-0">
              <div class="card-body p-0 p-md-1">
                <div class="markets-chart-frame">
                  <div id="markets-allocation-chart" class="markets-chart-canvas" role="img" aria-label="Market allocation chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-allocation-chart" hidden></p>
                </div>
              </div>
            </article>
          </div>
        `:""}
        ${ze("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(m=>`<th class="${U(m)}">${u(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${fe}
            </tbody>
            ${oa(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${Ue?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${ze("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${r.map(m=>`<th class="${U(m)}">${u(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${y}
              </tbody>
              ${ra(r,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Ge?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(ge(p.storageUsageBytes)):`${u(ge(p.storageUsageBytes))} of ${u(ge(p.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Download JSON</button>
          </div>
          <label class="form-label mb-0">Export / Copy JSON
            <input class="form-control" id="export-text" readonly value="${u(A)}" />
          </label>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Import</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="replace-import">Replace all from JSON</button>
          </div>
          <div class="toolbar-row">
            <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
          </div>
          <label class="form-label mb-0">Import JSON (replace all)
            <input class="form-control" id="import-text" placeholder='Paste ExportBundleV1/V2 JSON here' value="${u(p.importText)}" />
          </label>
        </div>
        <div class="danger-zone border border-danger-subtle rounded-3 p-3 mt-3 bg-danger-subtle">
          <div class="data-tool-head mb-2">
            <h3 class="h6 mb-0">Wipe All Data</h3>
            <button type="button" class="danger-btn btn btn-primary" data-action="wipe-all">Wipe all data</button>
          </div>
          <p class="mb-2">Hard delete all IndexedDB data (inventory, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
        </div>
        </div>
      </details>
    </div>
    ${ca()}
  `;const ae=I.querySelector("#inventory-form");ae&&(it(ae),Le(ae),ot(ae));const Fe=I.querySelector("#category-form");Fe&&st(Fe),jt(),Qt(f),De(),window.scrollTo(e,t)}function da(e,t){const a=I.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const r of a)r.hidden=!t;const n=I.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);n&&(n.textContent=t?"▾":"▸",n.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function ua(){return{schemaVersion:2,exportedAt:N(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords}}function mt(){return JSON.stringify(ua())}function pa(e,t,a){const n=new Blob([t],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function fa(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim(),r=t.get("darkMode")==="on",o=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await O("currencyCode",a),await O("currencySymbol",n),await O("darkMode",r),await O("showMarketsGraphs",o),H(),await D()}async function ma(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),d=t.get("active")==="on",f=i==="spot"||i==="snapshot"?i:void 0,c=f==="spot"&&s?de(s):void 0,g=f==="spot"&&l?l:void 0;if(!r)return;if(f==="spot"&&s&&c==null){alert("Spot value is invalid.");return}const v=c??void 0,w=o||null;if(w&&!$(w)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const h=await Ke(n);if(!h){alert("Market not found.");return}if(w===h.id){alert("A category cannot be its own parent.");return}if(w&&Ne(p.categories,h.id).includes(w)){alert("A category cannot be moved under its own subtree.");return}const E=h.parentId!==w;h.name=r,h.parentId=w,h.evaluationMode=f,h.spotValueCents=v,h.spotCode=g,h.active=d,E&&(h.sortOrder=p.categories.filter(V=>V.parentId===w&&V.id!==h.id).length),h.updatedAt=N(),await xe(h),H(),await D();return}const A=N(),y=p.categories.filter(h=>h.parentId===w).length,b={id:crypto.randomUUID(),name:r,parentId:w,pathIds:[],pathNames:[],depth:0,sortOrder:y,evaluationMode:f,spotValueCents:v,spotCode:g,active:d,isArchived:!1,createdAt:A,updatedAt:A};await xe(b),H(),await D()}async function ba(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=de(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),d=l===""?null:de(l),f=a==="create"?s??void 0:d??void 0,c=String(t.get("categoryId")||""),g=t.get("active")==="on",v=String(t.get("notes")||"").trim();if(!r||!o||!c){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&d!=null&&d<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&d==null){alert("Baseline value is invalid.");return}if(!$(c)){alert("Select a valid category.");return}const w=Math.round(s/i);if(a==="edit"){if(!n)return;const b=await Ae(n);if(!b){alert("Inventory record not found.");return}b.purchaseDate=r,b.productName=o,b.quantity=i,b.totalPriceCents=s,b.baselineValueCents=f,b.unitPriceCents=w,b.unitPriceSource="derived",b.categoryId=c,b.active=g,b.notes=v||void 0,b.updatedAt=N(),await ie(b),H(),await D();return}const A=N(),y={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:f,unitPriceCents:w,unitPriceSource:"derived",categoryId:c,active:g,archived:!1,notes:v||void 0,createdAt:A,updatedAt:A};await ie(y),H(),await D()}async function ya(e,t){const a=await Ae(e);a&&(a.active=t,a.updatedAt=N(),await ie(a),await D())}async function ha(e,t){const a=await Ae(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,t&&(a.active=!1),a.archivedAt=t?N():void 0,a.updatedAt=N(),await ie(a),await D()))}async function ga(e,t){const a=$(e);if(t&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Ne(p.categories,e),r=N();for(const o of n){const i=await Ke(o);i&&(i.isArchived=t,t&&(i.active=!1),i.archivedAt=t?r:void 0,i.updatedAt=r,await xe(i))}await D()}function bt(e){const t=N();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function va(e){const t=N(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,baselineValueCents:Number.isFinite(r)?r:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function wa(){const e=p.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Ee(t.categories.map(bt)),n=new Set(a.map(s=>s.id)),r=t.purchases.map(va);for(const s of r)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:le},{key:"currencySymbol",value:Z},{key:"darkMode",value:te}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ye({purchases:r,categories:a,settings:o}),T({importText:Q}),await D()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}async function Ia(){const e=Ee(Te.categories.map(bt)),t=Te.settings.map(n=>({key:String(n.key),value:n.value}));window.confirm("Load default markets template and replace all existing data? This will keep no investments.")&&(await Ye({purchases:[],categories:e,settings:t}),T({filters:[],importText:Q}),await D(),at({tone:"success",text:"Default markets loaded."}))}function yt(e){return e.target instanceof HTMLElement?e.target:null}function Qe(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!a||!n||r==null||!o)return;const i=(f,c)=>f.viewId===c.viewId&&f.field===c.field&&f.op===c.op&&f.value===c.value;let s=Ft(p.filters,{viewId:t,field:a,op:n,value:r,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const f=$(l);if(f){const c=s.find(g=>i(g,{viewId:t,field:a,op:n,value:r}));if(c){const g=`Market: ${f.pathNames.join(" / ")}`;s=s.filter(w=>w.linkedToFilterId!==c.id);const v=s.findIndex(w=>i(w,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id}));if(v>=0){const w=s[v];s=[...s.slice(0,v),{...w,label:g,linkedToFilterId:c.id},...s.slice(v+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id,label:g,linkedToFilterId:c.id}]}}}let d={filters:s};t==="inventoryTable"&&a==="archived"&&r==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&r==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),T(d)}function ht(){X!=null&&(window.clearTimeout(X),X=null)}function Sa(e){const t=p.filters.filter(n=>n.viewId===e),a=t[t.length-1];a&&T({filters:Xe(p.filters,a.id)})}I.addEventListener("click",async e=>{const t=yt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(ht(),e.detail>1)return;X=window.setTimeout(()=>{X=null,Qe(a)},220);return}Qe(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;T({filters:Xe(p.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;T({filters:Pt(p.filters,r)});return}if(n==="toggle-show-archived-inventory"){T({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){T({showArchivedCategories:a.checked});return}if(n==="open-create-category"){G({kind:"categoryCreate"});return}if(n==="open-create-inventory"){G({kind:"inventoryCreate"});return}if(n==="open-settings"){G({kind:"settings"});return}if(n==="apply-report-range"){const r=I.querySelector('input[name="reportDateFrom"]'),o=I.querySelector('input[name="reportDateTo"]');if(!r||!o)return;const i=r.value,s=o.value,l=We(i),d=We(s,!0);if(l==null||d==null||l>d){at({tone:"warning",text:"Select a valid report date range."});return}T({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){T({reportDateFrom:tt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="copy-total-to-baseline"){const r=a.closest("form");if(!(r instanceof HTMLFormElement)||r.id!=="inventory-form")return;const o=r.querySelector('input[name="totalPrice"]'),i=r.querySelector('input[name="baselineValue"]'),s=r.querySelector('input[name="baselineValueDisplay"]'),l=r.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',re!=null&&window.clearTimeout(re),re=window.setTimeout(()=>{re=null,l.isConnected&&(l.textContent="")},1800));return}if(n==="toggle-growth-children"){const r=a.dataset.marketId;if(!r)return;const o=new Set(W),i=!o.has(r);i?o.add(r):o.delete(r),W=o,da(r,i);return}if(n==="edit-category"){const r=a.dataset.id;r&&G({kind:"categoryEdit",categoryId:r});return}if(n==="edit-inventory"){const r=a.dataset.id;r&&G({kind:"inventoryEdit",inventoryId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;H();return}if(n==="toggle-inventory-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await ya(r,o);return}if(n==="toggle-inventory-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ha(r,o);return}if(n==="toggle-category-subtree-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ga(r,o);return}if(n==="download-json"){pa(`investments-app-${new Date().toISOString().slice(0,10)}.json`,mt(),"application/json");return}if(n==="replace-import"){await wa();return}if(n==="load-default-markets"){await Ia();return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Lt(),T({filters:[],exportText:"",importText:Q,showArchivedInventory:!1,showArchivedCategories:!1}),await D();return}}});I.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(ht(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const r=n.dataset.id,o=n.dataset.rowEdit;if(!(!r||!o)){if(o==="inventory"){G({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&G({kind:"categoryEdit",categoryId:r})}});I.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await fa(t);return}if(t.id==="category-form"){await ma(t);return}if(t.id==="inventory-form"){await ba(t);return}}});I.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Le(a),ot(a))}if(t.id==="import-text"){p={...p,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?p={...p,reportDateFrom:t.value}:p={...p,reportDateTo:t.value})}});I.addEventListener("change",async e=>{var r;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(it(o),Le(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&st(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(r=t.files)==null?void 0:r[0];if(!a)return;const n=await a.text();try{T({importText:JSON.stringify(JSON.parse(n))})}catch{T({importText:n})}});I.addEventListener("pointermove",e=>{const t=yt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");se=(a==null?void 0:a.dataset.filterSectionViewId)||null});I.addEventListener("pointerleave",()=>{se=null});document.addEventListener("keydown",e=>{if(x.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!se)return;e.preventDefault(),Sa(se);return}if(e.key==="Escape"){e.preventDefault(),H();return}if(e.key!=="Tab")return;const t=nt();if(!t)return;const a=rt(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===n||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),n.focus())});D();
