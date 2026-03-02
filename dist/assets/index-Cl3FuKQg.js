(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const dt=(t,e)=>e.some(a=>t instanceof a);let It,kt;function ae(){return It||(It=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ne(){return kt||(kt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ut=new WeakMap,ot=new WeakMap,tt=new WeakMap;function oe(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{a(q(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return tt.set(e,t),e}function re(t){if(ut.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});ut.set(t,e)}let pt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return ut.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return q(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function jt(t){pt=t(pt)}function ie(t){return ne().includes(t)?function(...e){return t.apply(ft(this),e),q(this.request)}:function(...e){return q(t.apply(ft(this),e))}}function se(t){return typeof t=="function"?ie(t):(t instanceof IDBTransaction&&re(t),dt(t,ae())?new Proxy(t,pt):t)}function q(t){if(t instanceof IDBRequest)return oe(t);if(ot.has(t))return ot.get(t);const e=se(t);return e!==t&&(ot.set(t,e),tt.set(e,t)),e}const ft=t=>tt.get(t);function le(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),l=q(i);return n&&i.addEventListener("upgradeneeded",s=>{n(q(i.result),s.oldVersion,s.newVersion,q(i.transaction),s)}),a&&i.addEventListener("blocked",s=>a(s.oldVersion,s.newVersion,s)),l.then(s=>{r&&s.addEventListener("close",()=>r()),o&&s.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const ce=["get","getKey","getAll","getAllKeys","count"],de=["put","add","delete","clear"],rt=new Map;function Ct(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(rt.get(e))return rt.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=de.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||ce.includes(a)))return;const r=async function(i,...l){const s=this.transaction(i,o?"readwrite":"readonly");let d=s.store;return n&&(d=d.index(l.shift())),(await Promise.all([d[a](...l),o&&s.done]))[0]};return rt.set(e,r),r}jt(t=>({...t,get:(e,a,n)=>Ct(e,a)||t.get(e,a,n),has:(e,a)=>!!Ct(e,a)||t.has(e,a)}));const ue=["continue","continuePrimaryKey","advance"],$t={},mt=new WeakMap,Rt=new WeakMap,pe={get(t,e){if(!ue.includes(e))return t[e];let a=$t[e];return a||(a=$t[e]=function(...n){mt.set(this,Rt.get(this)[e](...n))}),a}};async function*fe(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,pe);for(Rt.set(a,e),tt.set(a,ft(e));e;)yield a,e=await(mt.get(a)||e.continue()),mt.delete(a)}function xt(t,e){return e===Symbol.asyncIterator&&dt(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&dt(t,[IDBIndex,IDBObjectStore])}jt(t=>({...t,get(e,a,n){return xt(e,a)?fe:t.get(e,a,n)},has(e,a){return xt(e,a)||t.has(e,a)}}));const x=le("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let s=await r.openCursor();for(;s;)await i.put(s.value),s=await s.continue()}let l=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(l=t.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const s=t.createObjectStore("valuationSnapshots",{keyPath:"id"});s.createIndex("by_capturedAt","capturedAt"),s.createIndex("by_scope","scope"),s.createIndex("by_marketId","marketId"),s.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let s=await i.openCursor();for(;s;){const d=s.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.archived!="boolean"&&(d.archived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}if(l){let s=await l.openCursor();for(;s;){const d=s.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}}});async function me(){return(await x).getAll("inventory")}async function Y(t){await(await x).put("inventory",t)}async function vt(t){return(await x).get("inventory",t)}async function be(){return(await x).getAll("categories")}async function bt(t){await(await x).put("categories",t)}async function Bt(t){return(await x).get("categories",t)}async function ye(){return(await x).getAll("settings")}async function O(t,e){await(await x).put("settings",{key:t,value:e})}async function ge(){return(await x).getAll("valuationSnapshots")}async function ve(t){if(!t.length)return;const a=(await x).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function he(t){const a=(await x).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function we(){const e=(await x).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Se(){const e=(await x).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function At(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function Ie(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Ut(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function ke(t,e){return t.filter(a=>a.viewId!==e)}function yt(t,e,a,n,o){const r=e.filter(l=>l.viewId===a);if(!r.length)return t;const i=new Map(n.map(l=>[l.key,l]));return t.filter(l=>r.every(s=>{var m;const d=i.get(s.field);if(!d)return!0;const c=d.getValue(l);if(s.op==="eq")return String(c)===s.value;if(s.op==="isEmpty")return At(c);if(s.op==="isNotEmpty")return!At(c);if(s.op==="contains")return String(c).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const y=((m=o==null?void 0:o.categoryDescendantsMap)==null?void 0:m.get(s.value))||new Set([s.value]),g=String(c);return y.has(g)}return!0}))}function Ce(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function et(t){const{children:e}=Ce(t),a=new Map;function n(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const l of n(i.id))r.add(l);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function Ht(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let l=n;for(;l&&!i.has(l.id);)i.add(l.id),o.unshift(l.id),r.unshift(l.name),l=l.parentId?e.get(l.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function ht(t,e){return[...et(t).get(e)||new Set([e])]}function $e(t,e){const a=et(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const l of t)r.has(l.categoryId)&&(i+=l.totalPriceCents);n.set(o.id,i)}return n}const _t=document.querySelector("#app");if(!_t)throw new Error("#app not found");const h=_t;let I={kind:"none"},B=null,E=null,N=null,M=null,D=null,Mt=!1,J=null,it=!1,st=null,_=null,Z=null,Dt=!1,R=null,z=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:zt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const X="USD",j="$",Q=!1,xe=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function k(){return new Date().toISOString()}function zt(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function lt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function S(t){const e=U("currencySymbol")||j,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function wt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function U(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function Ae(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:Q;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function A(t){p={...p,...t},F()}function G(t){R!=null&&(window.clearTimeout(R),R=null),z=t,F(),t&&(R=window.setTimeout(()=>{R=null,z=null,F()},3500))}function L(t){I.kind==="none"&&document.activeElement instanceof HTMLElement&&(B=document.activeElement),I=t,F()}function P(){I.kind!=="none"&&(I={kind:"none"},F(),B&&B.isConnected&&B.focus(),B=null)}function Gt(){return h.querySelector(".modal-panel")}function Wt(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function Me(){if(I.kind==="none")return;const t=Gt();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(Wt(t)[0]||t).focus()}function De(){var t,e;(t=E==null?void 0:E.destroy)==null||t.call(E),(e=N==null?void 0:N.destroy)==null||e.call(N),E=null,N=null}function gt(){var i;const t=window,e=t.DataTable,a=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!a){st==null&&(st=window.setTimeout(()=>{st=null,gt(),F()},500)),it||(it=!0,window.addEventListener("load",()=>{it=!1,gt(),F()},{once:!0}));return}const n=h.querySelector("#categories-table"),o=h.querySelector("#inventory-table"),r=(l,s)=>{var d,c;return e?new e(l,s):a?((c=(d=a(l)).DataTable)==null?void 0:c.call(d,s))??null:null};n&&(E=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Et(n,E)),o&&(N=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Et(o,N))}function Te(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function K(t,e){const a=h.querySelector(`#${t}`),n=h.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Tt(t){const e=h.querySelector(`#${t}`),a=h.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Ee(){M==null||M.dispose(),D==null||D.dispose(),M=null,D=null}function Ne(){Mt||(Mt=!0,window.addEventListener("resize",()=>{J!=null&&window.clearTimeout(J),J=window.setTimeout(()=>{J=null,M==null||M.resize(),D==null||D.resize()},120)}))}function Fe(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function Le(t){const e="markets-allocation-chart",a="markets-top-chart",n=h.querySelector(`#${e}`),o=h.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){K(e,"Chart unavailable: ECharts not loaded."),K(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){K(e,"No eligible market totals to chart."),K(a,"No eligible market totals to chart.");return}Tt(e),Tt(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],s=i?"#e9ecef":"#212529",d=i?"#ced4da":"#495057",c=t.map(f=>({name:f.label,value:f.totalCents})),m=t.slice(0,5),y=[...m].reverse(),g=m.reduce((f,w)=>Math.max(f,w.totalCents),0),b=g>0?Math.ceil(g*1.2):1;M=window.echarts.init(n),D=window.echarts.init(o),M.setOption({color:l,tooltip:{trigger:"item",formatter:f=>`${u(f.name)}: ${S(f.value)} (${f.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:c,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:10,textBorderWidth:0,formatter:f=>{const w=f.percent??0;return`${Math.round(w)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:d,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),D.setOption({color:["#198754"],grid:{left:"4%",right:"6%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:f=>{const w=f[0];return w?`${u(w.name)}: ${S(w.value)}`:""}},xAxis:{type:"value",max:b,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:y.map(f=>f.label),axisLabel:{color:d,formatter:f=>Fe(f)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:y.map(f=>f.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:s,formatter:f=>S(f.value)}}]}),Ne()}function Et(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var m,y,g;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),l=i.indexOf(o);if(l<0||l===i.length-1)return;a.preventDefault(),a.stopPropagation();const s=(m=e.order)==null?void 0:m.call(e),d=Array.isArray(s)?s[0]:void 0,c=d&&d[0]===l&&d[1]==="asc"?"desc":"asc";(y=e.order)==null||y.call(e,[[l,c]]),(g=e.draw)==null||g.call(e,!1)},!0)}async function C(){var l,s;const[t,e,a,n]=await Promise.all([me(),be(),ye(),ge()]),o=Ht(e).sort((d,c)=>d.sortOrder-c.sortOrder||d.name.localeCompare(c.name));a.some(d=>d.key==="currencyCode")||(await O("currencyCode",X),a.push({key:"currencyCode",value:X})),a.some(d=>d.key==="currencySymbol")||(await O("currencySymbol",j),a.push({key:"currencySymbol",value:j})),a.some(d=>d.key==="darkMode")||(await O("darkMode",Q),a.push({key:"darkMode",value:Q})),Ae(a);let r=null,i=null;try{const d=await((s=(l=navigator.storage)==null?void 0:l.estimate)==null?void 0:s.call(l));r=typeof(d==null?void 0:d.usage)=="number"?d.usage:null,i=typeof(d==null?void 0:d.quota)=="number"?d.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i},F()}function $(t){if(t)return p.categories.find(e=>e.id===t)}function qe(t){const e=$(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function Pe(t){return qe(t)}function Ve(t){const e=$(t);return e?e.pathIds.some(a=>{var n;return((n=$(a))==null?void 0:n.active)===!1}):!1}function Oe(t){const e=$(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=$(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function je(t){return t.active&&!Oe(t)}function ct(t){return t==null?"":(t/100).toFixed(2)}function St(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=wt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function Qt(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=$(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function Jt(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const i=e.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function Nt(t){var e;return t.parentId?((e=$(t.parentId))==null?void 0:e.name)||"(Unknown)":""}function H(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function Re(t){return t.active&&!t.archived}function Kt(){const t=p.inventoryRecords.filter(Re),e=p.categories.filter(r=>!r.isArchived),a=$e(t,e),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=n.get(r.categoryId);if(i)for(const l of i.pathIds)o.set(l,(o.get(l)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function Yt(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>Pe(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>S(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>S(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function Be(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:t=>Nt(t),getDisplay:t=>Nt(t),filterable:!0,filterOp:"eq"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Value",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":S(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function Zt(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function Ue(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function He(){const t=Yt(),e=Be(),a=e.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),n=e.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),o=et(p.categories),r=yt(Zt(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:l}=Kt(),s=[...a,{key:"computedQty",label:"Qty",getValue:c=>l.get(c.id)||0,getDisplay:c=>String(l.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>i.get(c.id)||0,getDisplay:c=>S(i.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:c=>c.evaluationMode==="snapshot"?i.get(c.id)||0:c.evaluationMode==="spot"&&c.spotValueCents!=null?(l.get(c.id)||0)*c.spotValueCents:"",getDisplay:c=>c.evaluationMode==="snapshot"?S(i.get(c.id)||0):c.evaluationMode==="spot"&&c.spotValueCents!=null?S((l.get(c.id)||0)*c.spotValueCents):"",filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],d=yt(Ue(),p.filters,"categoriesList",s);return{inventoryColumns:t,categoryColumns:s,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:d,categoryTotals:i,categoryQty:l}}async function _e(){const t=k(),{categoryTotals:e,categoryQty:a}=Kt(),n=p.categories.filter(s=>s.active&&!s.isArchived),o=[];let r=0,i=0;for(const s of n){let d=null;const c=a.get(s.id)||0;if(s.evaluationMode==="spot"){if(s.spotValueCents==null){i+=1;continue}d=Math.round(c*s.spotValueCents)}else if(s.evaluationMode==="snapshot")d=e.get(s.id)||0;else{i+=1;continue}r+=d,o.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:s.id,evaluationMode:s.evaluationMode,valueCents:d,quantity:s.evaluationMode==="spot"?c:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!o.length){G({tone:"warning",text:"No markets were eligible for snapshot capture."});return}o.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:r,source:"manual",createdAt:t,updatedAt:t}),await ve(o),await C();const l=i>0?` (${i} skipped)`:"";G({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${S(r)}${l}`})}function Ft(t,e,a=""){const n=p.filters.filter(o=>o.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(o=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${u(o.label)}"
                  aria-label="Remove filter: ${u(o.label)}"
                  data-action="remove-filter"
                  data-filter-id="${o.id}"
                >${u(o.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function Lt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const s=String(e.categoryId),d=Ve(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const s=e.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const s=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function ze(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function qt(t,e){const a=t.map((n,o)=>{let r=0,i=!1;for(const s of e){const d=n.getValue(s);typeof d=="number"&&Number.isFinite(d)&&(r+=d,i=!0)}const l=i?String(n.key).toLowerCase().includes("cents")?S(r):ze(r):o===0?"Totals":"";return`<th class="${H(n)}">${u(l)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function W(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function Ge(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function We(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?Ge(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Pt(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function Qe(t){const e=W(p.reportDateFrom),a=W(p.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=We(t),o=new Map;for(const m of p.valuationSnapshots){if(m.scope!=="market"||!m.marketId)continue;const y=o.get(m.marketId)||[];y.push(m),o.set(m.marketId,y)}for(const m of o.values())m.sort((y,g)=>Date.parse(y.capturedAt)-Date.parse(g.capturedAt));const r=p.inventoryRecords.filter(m=>m.active&&!m.archived),i=[];let l=0,s=0,d=0,c=0;for(const m of n){const y=$(m);if(!y)continue;const g=t.get(m)||new Set([m]),b=o.get(m)||[],f=Pt(b,e),w=Pt(b,a);let T=0;for(const V of r){if(!g.has(V.categoryId))continue;const nt=W(V.purchaseDate);nt!=null&&nt>e&&nt<=a&&(T+=V.totalPriceCents)}const v=f==null||w==null?null:w-f,at=v==null||f==null||f<=0?null:v/f;f!=null&&(l+=f),w!=null&&(s+=w),d+=T,v!=null&&(c+=v),i.push({marketId:m,marketLabel:y.pathNames.join(" / "),startValueCents:f,endValueCents:w,contributionsCents:T,netGrowthCents:v,growthPct:at})}return{scopeMarketIds:n,rows:i,startTotalCents:l,endTotalCents:s,contributionsTotalCents:d,netGrowthTotalCents:c}}function Vt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function Je(){if(I.kind==="none")return"";const t=U("currencySymbol")||j,e=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if(I.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((U("currencyCode")||X).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${xe.map(a=>`<option value="${u(a.value)}" ${(U("currencySymbol")||j)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${U("darkMode")??Q?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
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
    `;if(I.kind==="categoryCreate"||I.kind==="categoryEdit"){const a=I.kind==="categoryEdit",n=I.kind==="categoryEdit"?$(I.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(ht(p.categories,n.id)):void 0,r=et(p.categories);return yt(Zt(),p.filters,"inventoryTable",Yt(),{categoryDescendantsMap:r}),`
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
                ${e(o,(n==null?void 0:n.parentId)||null)}
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
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(ct(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if(I.kind==="inventoryCreate")return`
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
                ${e()}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
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
    `;if(I.kind==="inventoryEdit"){const a=I,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(ct(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(ct(n.unitPriceCents))}" disabled />
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
    `:""}return""}function F(){const t=h.querySelector('details[data-section="data-tools"]');t&&(Dt=t.open),Ee(),De();const{inventoryColumns:e,categoryColumns:a,categoryDescendantsMap:n,filteredInventoryRecords:o,filteredCategories:r}=He(),i=p.filters.some(f=>f.viewId==="categoriesList"),l=Te(r,a,i),s=Qe(n),d=s.startTotalCents>0?s.netGrowthTotalCents/s.startTotalCents:null,c=p.exportText||Xt(),m=o.map(f=>`
        <tr class="${[je(f)?"":"row-inactive",f.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${f.id}">
          ${e.map(T=>`<td class="${H(T)}">${Lt("inventoryTable",f,T)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${f.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),y=r.map(f=>`
      <tr class="${[f.active?"":"row-inactive",f.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${f.id}">
        ${a.map(w=>`<td class="${H(w)}">${Lt("categoriesList",f,w)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${f.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");h.innerHTML=`
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
        ${z?`<div class="alert alert-${z.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(z.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${s.scopeMarketIds.length?`${s.scopeMarketIds.length} market${s.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${u(p.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${u(p.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${s.rows.length===0?`
            <p class="mb-0 text-body-secondary">No snapshot data for this scope/range yet.</p>
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
                  ${s.rows.map(f=>`
                    <tr>
                      <td>${u(f.marketLabel)}</td>
                      <td class="text-end">${f.startValueCents==null?"—":u(S(f.startValueCents))}</td>
                      <td class="text-end">${f.endValueCents==null?"—":u(S(f.endValueCents))}</td>
                      <td class="text-end">${u(S(f.contributionsCents))}</td>
                      <td class="text-end">${f.netGrowthCents==null?"—":u(S(f.netGrowthCents))}</td>
                      <td class="text-end">${u(Vt(f.growthPct))}</td>
                    </tr>
                  `).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(S(s.startTotalCents))}</th>
                    <th class="text-end">${u(S(s.endTotalCents))}</th>
                    <th class="text-end">${u(S(s.contributionsTotalCents))}</th>
                    <th class="text-end">${u(S(s.netGrowthTotalCents))}</th>
                    <th class="text-end">${u(Vt(d))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <button type="button" class="btn btn-warning capture-snapshot-btn btn-sm" data-action="capture-snapshot">Capture Snapshot</button>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        <div class="markets-widget-grid mb-2">
          <article class="markets-widget-card card border-0">
            <div class="card-body p-0 p-md-1">
              <h3 class="h6 mb-2">Allocation</h3>
              <div class="markets-chart-frame">
                <div id="markets-allocation-chart" class="markets-chart-canvas" role="img" aria-label="Market allocation chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-allocation-chart" hidden></p>
              </div>
            </div>
          </article>
          <article class="markets-widget-card card border-0">
            <div class="card-body p-0 p-md-1">
              <h3 class="h6 mb-2">Top Markets by Value</h3>
              <div class="markets-chart-frame">
                <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
              </div>
            </div>
          </article>
        </div>
        ${Ft("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${a.map(f=>`<th class="${H(f)}">${u(f.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${y}
            </tbody>
            ${qt(a,r)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section-view-id="inventoryTable">
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0 visually-hidden">Investments</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end w-100">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Ft("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${e.map(f=>`<th class="${H(f)}">${u(f.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${m}
              </tbody>
              ${qt(e,o)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Dt?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(lt(p.storageUsageBytes)):`${u(lt(p.storageUsageBytes))} of ${u(lt(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(c)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${u(p.importText)}</textarea>
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
    ${Je()}
  `;const g=h.querySelector("#inventory-form");g&&(Qt(g),St(g));const b=h.querySelector("#category-form");b&&Jt(b),Me(),Le(l),gt()}function Ke(){return{schemaVersion:2,exportedAt:k(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function Xt(){return JSON.stringify(Ke(),null,2)}function Ye(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function Ze(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await O("currencyCode",a),await O("currencySymbol",n),await O("darkMode",o),P(),await C()}async function Xe(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),l=String(e.get("spotValue")||"").trim(),s=String(e.get("spotCode")||"").trim(),d=e.get("active")==="on",c=i==="spot"||i==="snapshot"?i:void 0,m=c==="spot"&&l?wt(l):void 0,y=c==="spot"&&s?s:void 0;if(!o)return;if(c==="spot"&&l&&m==null){alert("Spot value is invalid.");return}const g=m??void 0,b=r||null;if(b&&!$(b)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const v=await Bt(n);if(!v){alert("Market not found.");return}if(b===v.id){alert("A category cannot be its own parent.");return}if(b&&ht(p.categories,v.id).includes(b)){alert("A category cannot be moved under its own subtree.");return}const at=v.parentId!==b;v.name=o,v.parentId=b,v.evaluationMode=c,v.spotValueCents=g,v.spotCode=y,v.active=d,at&&(v.sortOrder=p.categories.filter(V=>V.parentId===b&&V.id!==v.id).length),v.updatedAt=k(),await bt(v),P(),await C();return}const f=k(),w=p.categories.filter(v=>v.parentId===b).length,T={id:crypto.randomUUID(),name:o,parentId:b,pathIds:[],pathNames:[],depth:0,sortOrder:w,evaluationMode:c,spotValueCents:g,spotCode:y,active:d,isArchived:!1,createdAt:f,updatedAt:f};await bt(T),P(),await C()}async function ta(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),l=wt(String(e.get("totalPrice")||"")),s=String(e.get("categoryId")||""),d=e.get("active")==="on",c=String(e.get("notes")||"").trim();if(!o||!r||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!$(s)){alert("Select a valid category.");return}const m=Math.round(l/i);if(a==="edit"){if(!n)return;const b=await vt(n);if(!b){alert("Inventory record not found.");return}b.purchaseDate=o,b.productName=r,b.quantity=i,b.totalPriceCents=l,b.unitPriceCents=m,b.unitPriceSource="derived",b.categoryId=s,b.active=d,b.notes=c||void 0,b.updatedAt=k(),await Y(b),P(),await C();return}const y=k(),g={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:l,unitPriceCents:m,unitPriceSource:"derived",categoryId:s,active:d,archived:!1,notes:c||void 0,createdAt:y,updatedAt:y};await Y(g),P(),await C()}async function ea(t,e){const a=await vt(t);a&&(a.active=e,a.updatedAt=k(),await Y(a),await C())}async function aa(t,e){const a=await vt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?k():void 0,a.updatedAt=k(),await Y(a),await C()))}async function na(t,e){const a=$(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=ht(p.categories,t),o=k();for(const r of n){const i=await Bt(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await bt(i))}await C()}function oa(t){const e=k();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ra(t){const e=k(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ia(t){const e=k(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function sa(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Ht(e.categories.map(oa)),n=new Set(a.map(s=>s.id)),o=e.purchases.map(ra);for(const s of o)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:X},{key:"currencySymbol",value:j},{key:"darkMode",value:Q}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(ia):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await he({purchases:o,categories:a,settings:r,valuationSnapshots:i}),A({importText:""}),await C()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function te(t){return t.target instanceof HTMLElement?t.target:null}function Ot(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const i=(c,m)=>c.viewId===m.viewId&&c.field===m.field&&c.op===m.op&&c.value===m.value;let l=Ie(p.filters,{viewId:e,field:a,op:n,value:o,label:r});const s=t.dataset.crossInventoryCategoryId;if(s){const c=$(s);if(c){const m=l.find(y=>i(y,{viewId:e,field:a,op:n,value:o}));if(m){const y=`Market: ${c.pathNames.join(" / ")}`;l=l.filter(b=>b.linkedToFilterId!==m.id);const g=l.findIndex(b=>i(b,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id}));if(g>=0){const b=l[g];l=[...l.slice(0,g),{...b,label:y,linkedToFilterId:m.id},...l.slice(g+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id,label:y,linkedToFilterId:m.id}]}}}let d={filters:l};e==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),A(d)}function ee(){_!=null&&(window.clearTimeout(_),_=null)}function la(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&A({filters:Ut(p.filters,a.id)})}h.addEventListener("click",async t=>{const e=te(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(ee(),t.detail>1)return;_=window.setTimeout(()=>{_=null,Ot(a)},220);return}Ot(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;A({filters:Ut(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;A({filters:ke(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){A({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){A({showArchivedCategories:a.checked});return}if(n==="open-create-category"){L({kind:"categoryCreate"});return}if(n==="open-create-inventory"){L({kind:"inventoryCreate"});return}if(n==="open-settings"){L({kind:"settings"});return}if(n==="apply-report-range"){const o=h.querySelector('input[name="reportDateFrom"]'),r=h.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,l=r.value,s=W(i),d=W(l,!0);if(s==null||d==null||s>d){G({tone:"warning",text:"Select a valid report date range."});return}A({reportDateFrom:i,reportDateTo:l});return}if(n==="reset-report-range"){A({reportDateFrom:zt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await _e()}catch{G({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="edit-category"){const o=a.dataset.id;o&&L({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&L({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;P();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await ea(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await aa(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await na(o,r);return}if(n==="download-json"){Ye(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,Xt(),"application/json");return}if(n==="replace-import"){await sa();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Se(),await C(),G({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await we(),A({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await C();return}}});h.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(ee(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){L({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&L({kind:"categoryEdit",categoryId:o})}});h.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await Ze(e);return}if(e.id==="category-form"){await Xe(e);return}if(e.id==="inventory-form"){await ta(e);return}}});h.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&St(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});h.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(Qt(r),St(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&Jt(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();A({importText:n})});h.addEventListener("pointermove",t=>{const e=te(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");Z=(a==null?void 0:a.dataset.filterSectionViewId)||null});h.addEventListener("pointerleave",()=>{Z=null});document.addEventListener("keydown",t=>{if(I.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!Z)return;t.preventDefault(),la(Z);return}if(t.key==="Escape"){t.preventDefault(),P();return}if(t.key!=="Tab")return;const e=Gt();if(!e)return;const a=Wt(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});C();
