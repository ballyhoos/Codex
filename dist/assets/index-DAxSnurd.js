(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const Ce=(e,t)=>t.some(a=>e instanceof a);let Le,Ne;function mt(){return Le||(Le=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function bt(){return Ne||(Ne=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ie=new WeakMap,me=new WeakMap,pe=new WeakMap;function yt(e){const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(z(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",i)});return pe.set(t,e),t}function gt(e){if(Ie.has(e))return;const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Ie.set(e,t)}let ke={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Ie.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return z(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function We(e){ke=e(ke)}function ht(e){return bt().includes(e)?function(...t){return e.apply(Se(this),t),z(this.request)}:function(...t){return z(e.apply(Se(this),t))}}function vt(e){return typeof e=="function"?ht(e):(e instanceof IDBTransaction&&gt(e),Ce(e,mt())?new Proxy(e,ke):e)}function z(e){if(e instanceof IDBRequest)return yt(e);if(me.has(e))return me.get(e);const t=vt(e);return t!==e&&(me.set(e,t),pe.set(t,e)),t}const Se=e=>pe.get(e);function wt(e,t,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const i=indexedDB.open(e,t),s=z(i);return n&&i.addEventListener("upgradeneeded",l=>{n(z(i.result),l.oldVersion,l.newVersion,z(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),r&&l.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),s}const Ct=["get","getKey","getAll","getAllKeys","count"],It=["put","add","delete","clear"],be=new Map;function Pe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(be.get(t))return be.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,r=It.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||Ct.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,r?"readwrite":"readonly");let u=l.store;return n&&(u=u.index(s.shift())),(await Promise.all([u[a](...s),r&&l.done]))[0]};return be.set(t,o),o}We(e=>({...e,get:(t,a,n)=>Pe(t,a)||e.get(t,a,n),has:(t,a)=>!!Pe(t,a)||e.has(t,a)}));const kt=["continue","continuePrimaryKey","advance"],Ve={},$e=new WeakMap,Qe=new WeakMap,St={get(e,t){if(!kt.includes(t))return e[t];let a=Ve[t];return a||(a=Ve[t]=function(...n){$e.set(this,Qe.get(this)[t](...n))}),a}};async function*$t(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,St);for(Qe.set(a,t),pe.set(a,Se(t));t;)yield a,t=await($e.get(a)||t.continue()),$e.delete(a)}function qe(e,t){return t===Symbol.asyncIterator&&Ce(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ce(e,[IDBIndex,IDBObjectStore])}We(e=>({...e,get(t,a,n){return qe(t,a)?$t:e.get(t,a,n)},has(t,a){return qe(t,a)||e.has(t,a)}}));const N=wt("investment_purchase_tracker",3,{async upgrade(e,t,a,n){const r=n,o=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const u=l.value;let p=!1;typeof u.active!="boolean"&&(u.active=!0,p=!0),typeof u.archived!="boolean"&&(u.archived=!1,p=!0),p&&(u.updatedAt=new Date().toISOString(),await l.update(u)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const u=l.value;let p=!1;typeof u.active!="boolean"&&(u.active=!0,p=!0),typeof u.isArchived!="boolean"&&(u.isArchived=!1,p=!0),p&&(u.updatedAt=new Date().toISOString(),await l.update(u)),l=await l.continue()}}}});async function xt(){return(await N).getAll("inventory")}async function se(e){await(await N).put("inventory",e)}async function Te(e){return(await N).get("inventory",e)}async function Mt(){return(await N).getAll("categories")}async function xe(e){await(await N).put("categories",e)}async function Je(e){return(await N).get("categories",e)}async function Dt(){return(await N).getAll("settings")}async function R(e,t){await(await N).put("settings",{key:e,value:t})}async function Tt(e){const a=(await N).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);await a.done}async function Et(){const t=(await N).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function Re(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function At(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ke(e,t){const a=new Set([t]);let n=!0;for(;n;){n=!1;for(const r of e)r.linkedToFilterId&&a.has(r.linkedToFilterId)&&!a.has(r.id)&&(a.add(r.id),n=!0)}return e.filter(r=>!a.has(r.id))}function Ft(e,t){return e.filter(a=>a.viewId!==t)}function Me(e,t,a,n,r){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var d;const u=i.get(l.field);if(!u)return!0;const p=u.getValue(s);if(l.op==="eq")return String(p)===l.value;if(l.op==="isEmpty")return Re(p);if(l.op==="isNotEmpty")return!Re(p);if(l.op==="contains")return String(p).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const w=((d=r==null?void 0:r.categoryDescendantsMap)==null?void 0:d.get(l.value))||new Set([l.value]),g=String(p);return w.has(g)}return!0}))}function Lt(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:t,children:a}}function fe(e){const{children:t}=Lt(e),a=new Map;function n(r){const o=new Set([r]);for(const i of t.get(r)||[])for(const s of n(i.id))o.add(s);return a.set(r,o),o}for(const r of e)a.has(r.id)||n(r.id);return a}function Ye(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const r=[],o=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),r.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function Ee(e,t){return[...fe(e).get(t)||new Set([t])]}function Nt(e,t){const a=fe(t),n=new Map;for(const r of t){const o=a.get(r.id)||new Set([r.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(r.id,i)}return n}const Xe=document.querySelector("#app");if(!Xe)throw new Error("#app not found");const C=Xe;let M={kind:"none"},X=null,B=null,q=null,P=null,V=null,H=null,Oe=!1,ne=null,ye=!1,ge=null,Z=null,le=null,Be=!1,je=!1,J=new Set,Ge=!1,re=null,Y=null,ee=null,f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:Ze(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const ce="USD",K="$",te=!1,de=!1,Pt=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function F(){return new Date().toISOString()}function Vt(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function Ze(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function he(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function I(e){const t=j("currencySymbol")||K,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function ue(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function j(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function qt(e){var n;const t=(n=e.find(r=>r.key==="darkMode"))==null?void 0:n.value,a=typeof t=="boolean"?t:te;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function A(e){f={...f,...e},O()}function Rt(e){Y!=null&&(window.clearTimeout(Y),Y=null),ee=e,O(),e&&(Y=window.setTimeout(()=>{Y=null,ee=null,O()},3500))}function G(e){M.kind==="none"&&document.activeElement instanceof HTMLElement&&(X=document.activeElement),M=e,O()}function _(){M.kind!=="none"&&(M={kind:"none"},O(),X&&X.isConnected&&X.focus(),X=null)}function et(){return C.querySelector(".modal-panel")}function tt(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Ot(){if(M.kind==="none")return;const e=et();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(tt(e)[0]||e).focus()}function Bt(){var e,t;(e=B==null?void 0:B.destroy)==null||e.call(B),(t=q==null?void 0:q.destroy)==null||t.call(q),B=null,q=null}function De(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){ge==null&&(ge=window.setTimeout(()=>{ge=null,De(),O()},500)),ye||(ye=!0,window.addEventListener("load",()=>{ye=!1,De(),O()},{once:!0}));return}const n=C.querySelector("#categories-table"),r=C.querySelector("#inventory-table"),o=(s,l)=>{var u,p;return t?new t(s,l):a?((p=(u=a(s)).DataTable)==null?void 0:p.call(u,l))??null:null};n&&(B=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),r&&(q=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Wt(r,q))}function jt(e,t,a){const n=t.find(o=>o.key==="computedTotalCents");return n?(a?e:e.filter(o=>o.parentId==null)).map(o=>{const i=n.getValue(o);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:o.id,label:o.pathNames.join(" / "),totalCents:i}}).filter(o=>o!=null).sort((o,i)=>i.totalCents-o.totalCents):[]}function oe(e,t){const a=C.querySelector(`#${e}`),n=C.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=t,n.hidden=!1)}function Ue(e){const t=C.querySelector(`#${e}`),a=C.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Gt(){P==null||P.dispose(),V==null||V.dispose(),H==null||H.dispose(),P=null,V=null,H=null}function Ut(){Oe||(Oe=!0,window.addEventListener("resize",()=>{ne!=null&&window.clearTimeout(ne),ne=window.setTimeout(()=>{ne=null,P==null||P.resize(),V==null||V.resize(),H==null||H.resize()},120)}))}function Ht(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function zt(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function _t(e){const t="markets-allocation-chart",a="markets-top-chart",n=C.querySelector(`#${t}`),r=C.querySelector(`#${a}`);if(!n||!r)return;if(!window.echarts){oe(t,"Chart unavailable: ECharts not loaded."),oe(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){oe(t,"No eligible market totals to chart."),oe(a,"No eligible market totals to chart.");return}Ue(t),Ue(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],u=i?"#e9ecef":"#212529",p=i?"#ced4da":"#495057",d=e.map(v=>({name:v.label,value:v.totalCents})),w=e.slice(0,5),g=[...w].reverse(),h=w.reduce((v,m)=>Math.max(v,m.totalCents),0),E=h>0?Math.ceil(h*1.2):1;P=window.echarts.init(n),V=window.echarts.init(r),P.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:v=>`${c(v.name)}: ${I(v.value)} (${v.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:u,fontSize:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:u,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["46%","50%"],data:d,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:v=>{const m=v.percent??0;return`${Math.round(m)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:p,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),V.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:v=>{const m=v[0];return m?`${c(m.name)}: ${I(m.value)}`:""}},xAxis:{type:"value",max:E,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:g.map(v=>v.label),axisLabel:{color:p,fontSize:s,formatter:v=>zt(v)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:g.map(v=>v.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:u,fontSize:s,formatter:v=>I(v.value)}}]}),Ut()}function Wt(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var d,w,g;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(r);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(d=t.order)==null?void 0:d.call(t),u=Array.isArray(l)?l[0]:void 0,p=u&&u[0]===s&&u[1]==="asc"?"desc":"asc";(w=t.order)==null||w.call(t,[[s,p]]),(g=t.draw)==null||g.call(t,!1)},!0)}async function L(){var l,u;const[e,t,a]=await Promise.all([xt(),Mt(),Dt()]),n=Ye(t).sort((p,d)=>p.sortOrder-d.sortOrder||p.name.localeCompare(d.name));a.some(p=>p.key==="currencyCode")||(await R("currencyCode",ce),a.push({key:"currencyCode",value:ce})),a.some(p=>p.key==="currencySymbol")||(await R("currencySymbol",K),a.push({key:"currencySymbol",value:K})),a.some(p=>p.key==="darkMode")||(await R("darkMode",te),a.push({key:"darkMode",value:te})),a.some(p=>p.key==="showMarketsGraphs")||(await R("showMarketsGraphs",de),a.push({key:"showMarketsGraphs",value:de})),qt(a);let r=null,o=null;try{const p=await((u=(l=navigator.storage)==null?void 0:l.estimate)==null?void 0:u.call(l));r=typeof(p==null?void 0:p.usage)=="number"?p.usage:null,o=typeof(p==null?void 0:p.quota)=="number"?p.quota:null}catch{r=null,o=null}let i=f.reportDateFrom,s=f.reportDateTo;if(!Ge){const p=Vt(e);p&&(i=p),s=new Date().toISOString().slice(0,10),Ge=!0}f={...f,inventoryRecords:e,categories:n,settings:a,storageUsageBytes:r,storageQuotaBytes:o,reportDateFrom:i,reportDateTo:s},O()}function $(e){if(e)return f.categories.find(t=>t.id===e)}function Qt(e){const t=$(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function Jt(e){return Qt(e)}function Kt(e){const t=$(e);return t?t.pathIds.some(a=>{var n;return((n=$(a))==null?void 0:n.active)===!1}):!1}function Yt(e){const t=$(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=$(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function Xt(e){return e.active&&!Yt(e)}function ie(e){return e==null?"":(e/100).toFixed(2)}function Ae(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const r=Number(t.value),o=ue(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function at(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="baselineValue"]');!t||!a||!n||t.value==="create"&&(n.value=a.value)}function nt(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),n=e.querySelector('input[name="quantity"]');if(!t||!a||!n)return;const r=$(t.value),o=(r==null?void 0:r.evaluationMode)==="spot";a.hidden=!o,o?n.readOnly=!1:((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0)}function rt(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]'),r=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]');if(!t||!a||!n||!r||!o)return;const i=t.value==="spot";a.hidden=!i,n.disabled=!i,r.hidden=!i,o.disabled=!i}function U(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function ot(e){return e.active&&!e.archived}function it(){const e=f.inventoryRecords.filter(ot),t=f.categories.filter(o=>!o.isArchived),a=Nt(e,t),n=new Map(f.categories.map(o=>[o.id,o])),r=new Map;for(const o of e){const i=n.get(o.categoryId);if(i)for(const s of i.pathIds)r.set(s,(r.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:r}}function st(e,t){const a=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const n=new Map,r=o=>{const i=n.get(o);if(i!=null)return i;const s=$(o);if(!s||s.isArchived)return n.set(o,0),0;let l=0;const u=a.get(s.id)||[];return u.length>0?l=u.reduce((p,d)=>p+r(d.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,n.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||r(o.id)}),n}function lt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>Jt(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?I(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>I(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"baselineValueCents",label:"Baseline value",getValue:e=>e.baselineValueCents??"",getDisplay:e=>e.baselineValueCents==null?"":I(e.baselineValueCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function Zt(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":I(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function ct(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function ea(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function ta(){const e=lt(),t=Zt(),a=t.filter(d=>d.key==="name"||d.key==="parent"||d.key==="path"),n=t.filter(d=>d.key!=="name"&&d.key!=="parent"&&d.key!=="path"),r=fe(f.categories),o=Me(ct(),f.filters,"inventoryTable",e,{categoryDescendantsMap:r}),{categoryTotals:i,categoryQty:s}=it(),l=st(i,s),u=[...a,{key:"computedQty",label:"Qty",getValue:d=>s.get(d.id)||0,getDisplay:d=>String(s.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:d=>i.get(d.id)||0,getDisplay:d=>I(i.get(d.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:d=>l.get(d.id)||0,getDisplay:d=>I(l.get(d.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:d=>d.active&&!d.isArchived,getDisplay:d=>d.active&&!d.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],p=Me(ea(),f.filters,"categoriesList",u);return{inventoryColumns:e,categoryColumns:u,categoryDescendantsMap:r,filteredInventoryRecords:o,filteredCategories:p,categoryTotals:i,categoryQty:s}}function He(e,t,a=""){const n=f.filters.filter(r=>r.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${c(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(r=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${c(r.label)}"
                  aria-label="Remove filter: ${c(r.label)}"
                  data-action="remove-filter"
                  data-filter-id="${r.id}"
                >${c(r.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function ve(e,t,a){const n=a.getValue(t),r=a.getDisplay(t),o=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return c(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${c(a.key)}" data-op="isEmpty" data-value="" data-label="${c(`${a.label}: Empty`)}" title="Filter ${c(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),u=Kt(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${c(a.key)}" data-op="${c(a.filterOp||"eq")}" data-value="${c(o)}" data-label="${c(`${a.label}: ${r}`)}"><span class="filter-hit">${c(r)}${u?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${c(a.key)}" data-op="${c(a.filterOp||"eq")}" data-value="${c(o)}" data-label="${c(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${c(l)}"><span class="filter-hit">${c(r)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${c(a.key)}" data-op="${c(a.filterOp||"eq")}" data-value="${c(o)}" data-label="${c(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${c(l)}"><span class="filter-hit">${c(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${c(a.key)}" data-op="${c(a.filterOp||"eq")}" data-value="${c(o)}" data-label="${c(`${a.label}: ${r}`)}"><span class="filter-hit">${c(r)}</span></button>`}function dt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function aa(e,t){const a=e.map((n,r)=>{let o=0,i=!1;for(const l of t){const u=n.getValue(l);typeof u=="number"&&Number.isFinite(u)&&(o+=u,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?I(o):dt(o):r===0?"Totals":"";return`<th class="${U(n)}">${c(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function na(e,t){const a=new Set(t.map(i=>i.id)),n=t.filter(i=>!i.parentId||!a.has(i.parentId)),r=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=r.has(String(i.key))?n:t;let u=0,p=!1;for(const w of l){const g=i.getValue(w);typeof g=="number"&&Number.isFinite(g)&&(u+=g,p=!0)}const d=p?String(i.key).toLowerCase().includes("cents")?I(u):dt(u):s===0?"Totals":"";return`<th class="${U(i)}">${c(d)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function ze(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function ra(e,t){const a=[...e];return a.filter(r=>{for(const o of a){if(o===r)continue;const i=t.get(o);if(i!=null&&i.has(r))return!1}return!0})}function oa(e){const t=new Set(f.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(f.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&t.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?ra(a,e):f.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function ia(e){const t=oa(e),a=Ht(),{categoryTotals:n,categoryQty:r}=it(),o=st(n,r),i=new Map,s=new Map;for(const m of f.inventoryRecords){if(!ot(m))continue;const y=m.baselineValueCents??0;if(!Number.isFinite(y))continue;const D=$(m.categoryId);if(D)for(const T of D.pathIds)i.set(T,(i.get(T)||0)+y),s.set(T,(s.get(T)||0)+m.totalPriceCents)}for(const m of f.categories)m.isArchived||!m.active||m.evaluationMode==="spot"&&m.spotValueCents!=null&&s.set(m.id,o.get(m.id)||0);const l=[],u={};let p=0,d=0,w=0,g=0;const h=m=>{const y=$(m);if(!y)return null;const D=i.get(m)||0,T=s.get(m)||0,ae=T-D,W=D>0?ae/D:null;return{marketId:m,marketLabel:y.pathNames.join(" / "),startValueCents:D,endValueCents:T,contributionsCents:T-D,netGrowthCents:ae,growthPct:W}},E=new Set,v=m=>E.has(m)?[]:(E.add(m),(a.get(m)||[]).map(y=>h(y)).filter(y=>y!=null).sort((y,D)=>y.marketLabel.localeCompare(D.marketLabel)));for(const m of t){const y=h(m);y&&(u[m]=v(m),p+=y.startValueCents||0,d+=y.endValueCents||0,w+=y.contributionsCents||0,g+=y.netGrowthCents||0,l.push(y))}return{scopeMarketIds:t,rows:l,childRowsByParent:u,startTotalCents:p,endTotalCents:d,contributionsTotalCents:w,netGrowthTotalCents:g,hasManualSnapshots:!1}}function we(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function Q(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function sa(){if(M.kind==="none")return"";const e=j("currencySymbol")||K,t=(a,n)=>f.categories.filter(r=>!r.isArchived).filter(r=>!(a!=null&&a.has(r.id))).map(r=>`<option value="${r.id}" ${n===r.id?"selected":""}>${c(r.pathNames.join(" / "))}</option>`).join("");if(M.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${c((j("currencyCode")||ce).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Pt.map(a=>`<option value="${c(a.value)}" ${(j("currencySymbol")||K)===a.value?"selected":""}>${c(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${j("darkMode")??te?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${j("showMarketsGraphs")??de?"checked":""} />
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
    `;if(M.kind==="categoryCreate"||M.kind==="categoryEdit"){const a=M.kind==="categoryEdit",n=M.kind==="categoryEdit"?$(M.categoryId):void 0;if(a&&!n)return"";const r=a&&n?new Set(Ee(f.categories,n.id)):void 0,o=fe(f.categories);return Me(ct(),f.filters,"inventoryTable",lt(),{categoryDescendantsMap:o}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${c((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${c((n==null?void 0:n.name)||"")}" /></label>
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
                <span class="input-group-text">${c(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${c(ie(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${c((n==null?void 0:n.spotCode)||"")}"
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
    `}if(M.kind==="inventoryCreate")return`
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
                <span class="input-group-text">${c(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${c(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled />
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
    `;if(M.kind==="inventoryEdit"){const a=M,n=f.inventoryRecords.find(r=>r.id===a.inventoryId);return n?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${c(n.id)}" />
            <input type="hidden" name="baselineValue" value="${c(ie(n.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${c(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${c(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${c(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${c(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${c(ie(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${c(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${c(ie(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${c(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function O(){const e=window.scrollX,t=window.scrollY,a=C.querySelector('details[data-section="data-tools"]');a&&(Be=a.open);const n=C.querySelector('details[data-section="investments"]');n&&(je=n.open),Gt(),Bt();const{inventoryColumns:r,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=ta(),u=f.filters.some(b=>b.viewId==="categoriesList"),p=jt(l,o,u),d=ia(i),w=j("showMarketsGraphs")??de,g=new Set([...J].filter(b=>{var S;return(((S=d.childRowsByParent[b])==null?void 0:S.length)||0)>0}));g.size!==J.size&&(J=g);const h=d.startTotalCents>0?d.netGrowthTotalCents/d.startTotalCents:null,E=f.exportText||ut(),v=s.map(b=>`
        <tr class="${[Xt(b)?"":"row-inactive",b.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${b.id}">
          ${r.map(k=>`<td class="${U(k)}">${ve("inventoryTable",b,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${b.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),m=new Set(l.map(b=>b.id)),y=new Map;for(const b of l){const S=b.parentId&&m.has(b.parentId)?b.parentId:null,k=y.get(S)||[];k.push(b),y.set(S,k)}for(const b of y.values())b.sort((S,k)=>S.sortOrder-k.sortOrder||S.name.localeCompare(k.name));const D=[],T=(b,S)=>{const k=y.get(b)||[];for(const x of k)D.push({category:x,depth:S}),T(x.id,S+1)};T(null,0);const ae=D.map(({category:b,depth:S})=>`
      <tr class="${[b.active?"":"row-inactive",b.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${b.id}">
        ${o.map(k=>{if(k.key==="name"){const x=S>0?(S-1)*1.1:0;return`<td class="${U(k)}"><div class="market-name-wrap" style="padding-left:${x.toFixed(2)}rem">${S>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${ve("categoriesList",b,k)}</div></td>`}return`<td class="${U(k)}">${ve("categoriesList",b,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${b.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");C.innerHTML=`
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
        ${ee?`<div class="alert alert-${ee.tone} py-1 px-2 mt-2 mb-0 small" role="status">${c(ee.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          <p class="small text-body-secondary mb-2">
            Scope: ${d.scopeMarketIds.length?`${d.scopeMarketIds.length} market${d.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
          </p>
          ${d.rows.length===0?`
            <p class="mb-0 text-body-secondary">No growth data available for this scope.</p>
          `:`
            <div class="table-wrap table-responsive">
              <table class="table table-striped table-sm align-middle mb-0 dataTable">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th class="text-end">Start</th>
                    <th class="text-end">End</th>
                    <th class="text-end">Contributions</th>
                    <th class="text-end">Growth</th>
                    <th class="text-end">Growth %</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.rows.map(b=>{const S=d.childRowsByParent[b.marketId]||[],k=J.has(b.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${S.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${c(b.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${c(b.marketLabel)}
                        </td>
                      <td class="text-end">${b.startValueCents==null?"—":c(I(b.startValueCents))}</td>
                      <td class="text-end">${b.endValueCents==null?"—":c(I(b.endValueCents))}</td>
                      <td class="text-end">${c(I(b.contributionsCents))}</td>
                      <td class="text-end ${Q(b.netGrowthCents)}">${b.netGrowthCents==null?"—":c(I(b.netGrowthCents))}</td>
                      <td class="text-end ${Q(b.growthPct)}">${c(we(b.growthPct))}</td>
                      </tr>
                      ${S.map(x=>`
                            <tr class="growth-child-row" data-parent-market-id="${c(b.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${c(x.marketLabel)}</td>
                              <td class="text-end">${x.startValueCents==null?"—":c(I(x.startValueCents))}</td>
                              <td class="text-end">${x.endValueCents==null?"—":c(I(x.endValueCents))}</td>
                              <td class="text-end">${c(I(x.contributionsCents))}</td>
                              <td class="text-end ${Q(x.netGrowthCents)}">${x.netGrowthCents==null?"—":c(I(x.netGrowthCents))}</td>
                              <td class="text-end ${Q(x.growthPct)}">${c(we(x.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${c(I(d.startTotalCents))}</th>
                    <th class="text-end">${c(I(d.endTotalCents))}</th>
                    <th class="text-end">${c(I(d.contributionsTotalCents))}</th>
                    <th class="text-end ${Q(d.netGrowthTotalCents)}">${c(I(d.netGrowthTotalCents))}</th>
                    <th class="text-end ${Q(h)}">${c(we(h))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        <div class="section-head markets-section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end markets-section-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${w?`
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
        ${He("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${f.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(b=>`<th class="${U(b)}">${c(b.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${ae}
            </tbody>
            ${na(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${je?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${He("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${f.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${r.map(b=>`<th class="${U(b)}">${c(b.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${v}
              </tbody>
              ${aa(r,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Be?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?c(he(f.storageUsageBytes)):`${c(he(f.storageUsageBytes))} of ${c(he(f.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${c(E)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${c(f.importText)}</textarea>
            </label>
          </div>
        </div>
        <div class="danger-zone border border-danger-subtle rounded-3 p-3 mt-3 bg-danger-subtle">
          <h3 class="h6">Wipe All Data</h3>
          <p class="mb-2">Hard delete all IndexedDB data (inventory, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
          <button type="button" class="danger-btn btn btn-danger" data-action="wipe-all">Wipe all data</button>
        </div>
        </div>
      </details>
    </div>
    ${sa()}
  `;const W=C.querySelector("#inventory-form");W&&(nt(W),Ae(W),at(W));const Fe=C.querySelector("#category-form");Fe&&rt(Fe),Ot(),_t(p),De(),window.scrollTo(e,t)}function la(e,t){const a=C.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const r of a)r.hidden=!t;const n=C.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);n&&(n.textContent=t?"▾":"▸",n.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function ca(){return{schemaVersion:2,exportedAt:F(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function ut(){return JSON.stringify(ca(),null,2)}function da(e,t,a){const n=new Blob([t],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function ua(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim(),r=t.get("darkMode")==="on",o=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await R("currencyCode",a),await R("currencySymbol",n),await R("darkMode",r),await R("showMarketsGraphs",o),_(),await L()}async function pa(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),u=t.get("active")==="on",p=i==="spot"||i==="snapshot"?i:void 0,d=p==="spot"&&s?ue(s):void 0,w=p==="spot"&&l?l:void 0;if(!r)return;if(p==="spot"&&s&&d==null){alert("Spot value is invalid.");return}const g=d??void 0,h=o||null;if(h&&!$(h)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const y=await Je(n);if(!y){alert("Market not found.");return}if(h===y.id){alert("A category cannot be its own parent.");return}if(h&&Ee(f.categories,y.id).includes(h)){alert("A category cannot be moved under its own subtree.");return}const D=y.parentId!==h;y.name=r,y.parentId=h,y.evaluationMode=p,y.spotValueCents=g,y.spotCode=w,y.active=u,D&&(y.sortOrder=f.categories.filter(T=>T.parentId===h&&T.id!==y.id).length),y.updatedAt=F(),await xe(y),_(),await L();return}const E=F(),v=f.categories.filter(y=>y.parentId===h).length,m={id:crypto.randomUUID(),name:r,parentId:h,pathIds:[],pathNames:[],depth:0,sortOrder:v,evaluationMode:p,spotValueCents:g,spotCode:w,active:u,isArchived:!1,createdAt:E,updatedAt:E};await xe(m),_(),await L()}async function fa(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=ue(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),u=l===""?null:ue(l),p=a==="create"?s??void 0:u??void 0,d=String(t.get("categoryId")||""),w=t.get("active")==="on",g=String(t.get("notes")||"").trim();if(!r||!o||!d){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&u!=null&&u<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&u==null){alert("Baseline value is invalid.");return}if(!$(d)){alert("Select a valid category.");return}const h=Math.round(s/i);if(a==="edit"){if(!n)return;const m=await Te(n);if(!m){alert("Inventory record not found.");return}m.purchaseDate=r,m.productName=o,m.quantity=i,m.totalPriceCents=s,m.baselineValueCents=p,m.unitPriceCents=h,m.unitPriceSource="derived",m.categoryId=d,m.active=w,m.notes=g||void 0,m.updatedAt=F(),await se(m),_(),await L();return}const E=F(),v={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:p,unitPriceCents:h,unitPriceSource:"derived",categoryId:d,active:w,archived:!1,notes:g||void 0,createdAt:E,updatedAt:E};await se(v),_(),await L()}async function ma(e,t){const a=await Te(e);a&&(a.active=t,a.updatedAt=F(),await se(a),await L())}async function ba(e,t){const a=await Te(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,t&&(a.active=!1),a.archivedAt=t?F():void 0,a.updatedAt=F(),await se(a),await L()))}async function ya(e,t){const a=$(e);if(t&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Ee(f.categories,e),r=F();for(const o of n){const i=await Je(o);i&&(i.isArchived=t,t&&(i.active=!1),i.archivedAt=t?r:void 0,i.updatedAt=r,await xe(i))}await L()}function ga(e){const t=F();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function ha(e){const t=F(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,baselineValueCents:Number.isFinite(r)?r:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function va(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Ye(t.categories.map(ga)),n=new Set(a.map(s=>s.id)),r=t.purchases.map(ha);for(const s of r)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:ce},{key:"currencySymbol",value:K},{key:"darkMode",value:te}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Tt({purchases:r,categories:a,settings:o}),A({importText:""}),await L()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function pt(e){return e.target instanceof HTMLElement?e.target:null}function _e(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!a||!n||r==null||!o)return;const i=(p,d)=>p.viewId===d.viewId&&p.field===d.field&&p.op===d.op&&p.value===d.value;let s=At(f.filters,{viewId:t,field:a,op:n,value:r,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const p=$(l);if(p){const d=s.find(w=>i(w,{viewId:t,field:a,op:n,value:r}));if(d){const w=`Market: ${p.pathNames.join(" / ")}`;s=s.filter(h=>h.linkedToFilterId!==d.id);const g=s.findIndex(h=>i(h,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id}));if(g>=0){const h=s[g];s=[...s.slice(0,g),{...h,label:w,linkedToFilterId:d.id},...s.slice(g+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id,label:w,linkedToFilterId:d.id}]}}}let u={filters:s};t==="inventoryTable"&&a==="archived"&&r==="true"&&!f.showArchivedInventory&&(u.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!f.showArchivedCategories&&(u.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&r==="false"&&!f.showArchivedCategories&&(u.showArchivedCategories=!0),A(u)}function ft(){Z!=null&&(window.clearTimeout(Z),Z=null)}function wa(e){const t=f.filters.filter(n=>n.viewId===e),a=t[t.length-1];a&&A({filters:Ke(f.filters,a.id)})}C.addEventListener("click",async e=>{const t=pt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(ft(),e.detail>1)return;Z=window.setTimeout(()=>{Z=null,_e(a)},220);return}_e(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;A({filters:Ke(f.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;A({filters:Ft(f.filters,r)});return}if(n==="toggle-show-archived-inventory"){A({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){A({showArchivedCategories:a.checked});return}if(n==="open-create-category"){G({kind:"categoryCreate"});return}if(n==="open-create-inventory"){G({kind:"inventoryCreate"});return}if(n==="open-settings"){G({kind:"settings"});return}if(n==="apply-report-range"){const r=C.querySelector('input[name="reportDateFrom"]'),o=C.querySelector('input[name="reportDateTo"]');if(!r||!o)return;const i=r.value,s=o.value,l=ze(i),u=ze(s,!0);if(l==null||u==null||l>u){Rt({tone:"warning",text:"Select a valid report date range."});return}A({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){A({reportDateFrom:Ze(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="copy-total-to-baseline"){const r=a.closest("form");if(!(r instanceof HTMLFormElement)||r.id!=="inventory-form")return;const o=r.querySelector('input[name="totalPrice"]'),i=r.querySelector('input[name="baselineValue"]'),s=r.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',re!=null&&window.clearTimeout(re),re=window.setTimeout(()=>{re=null,s.isConnected&&(s.textContent="")},1800));return}if(n==="toggle-growth-children"){const r=a.dataset.marketId;if(!r)return;const o=new Set(J),i=!o.has(r);i?o.add(r):o.delete(r),J=o,la(r,i);return}if(n==="edit-category"){const r=a.dataset.id;r&&G({kind:"categoryEdit",categoryId:r});return}if(n==="edit-inventory"){const r=a.dataset.id;r&&G({kind:"inventoryEdit",inventoryId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;_();return}if(n==="toggle-inventory-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await ma(r,o);return}if(n==="toggle-inventory-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ba(r,o);return}if(n==="toggle-category-subtree-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ya(r,o);return}if(n==="download-json"){da(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ut(),"application/json");return}if(n==="replace-import"){await va();return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Et(),A({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await L();return}}});C.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(ft(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const r=n.dataset.id,o=n.dataset.rowEdit;if(!(!r||!o)){if(o==="inventory"){G({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&G({kind:"categoryEdit",categoryId:r})}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await ua(t);return}if(t.id==="category-form"){await pa(t);return}if(t.id==="inventory-form"){await fa(t);return}}});C.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Ae(a),at(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});C.addEventListener("change",async e=>{var r;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(nt(o),Ae(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&rt(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(r=t.files)==null?void 0:r[0];if(!a)return;const n=await a.text();A({importText:n})});C.addEventListener("pointermove",e=>{const t=pt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");le=(a==null?void 0:a.dataset.filterSectionViewId)||null});C.addEventListener("pointerleave",()=>{le=null});document.addEventListener("keydown",e=>{if(M.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!le)return;e.preventDefault(),wa(le);return}if(e.key==="Escape"){e.preventDefault(),_();return}if(e.key!=="Tab")return;const t=et();if(!t)return;const a=tt(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===n||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),n.focus())});L();
