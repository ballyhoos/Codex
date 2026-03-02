(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const lt=(t,e)=>e.some(a=>t instanceof a);let wt,It;function ee(){return wt||(wt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ae(){return It||(It=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ct=new WeakMap,at=new WeakMap,Z=new WeakMap;function ne(t){const e=new Promise((a,n)=>{const r=()=>{t.removeEventListener("success",o),t.removeEventListener("error",s)},o=()=>{a(P(t.result)),r()},s=()=>{n(t.error),r()};t.addEventListener("success",o),t.addEventListener("error",s)});return Z.set(e,t),e}function re(t){if(ct.has(t))return;const e=new Promise((a,n)=>{const r=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",s),t.removeEventListener("abort",s)},o=()=>{a(),r()},s=()=>{n(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",o),t.addEventListener("error",s),t.addEventListener("abort",s)});ct.set(t,e)}let dt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return ct.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return P(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Vt(t){dt=t(dt)}function oe(t){return ae().includes(t)?function(...e){return t.apply(ut(this),e),P(this.request)}:function(...e){return P(t.apply(ut(this),e))}}function ie(t){return typeof t=="function"?oe(t):(t instanceof IDBTransaction&&re(t),lt(t,ee())?new Proxy(t,dt):t)}function P(t){if(t instanceof IDBRequest)return ne(t);if(at.has(t))return at.get(t);const e=ie(t);return e!==t&&(at.set(t,e),Z.set(e,t)),e}const ut=t=>Z.get(t);function se(t,e,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const s=indexedDB.open(t,e),l=P(s);return n&&s.addEventListener("upgradeneeded",i=>{n(P(s.result),i.oldVersion,i.newVersion,P(s.transaction),i)}),a&&s.addEventListener("blocked",i=>a(i.oldVersion,i.newVersion,i)),l.then(i=>{o&&i.addEventListener("close",()=>o()),r&&i.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const le=["get","getKey","getAll","getAllKeys","count"],ce=["put","add","delete","clear"],nt=new Map;function St(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(nt.get(e))return nt.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,r=ce.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||le.includes(a)))return;const o=async function(s,...l){const i=this.transaction(s,r?"readwrite":"readonly");let d=i.store;return n&&(d=d.index(l.shift())),(await Promise.all([d[a](...l),r&&i.done]))[0]};return nt.set(e,o),o}Vt(t=>({...t,get:(e,a,n)=>St(e,a)||t.get(e,a,n),has:(e,a)=>!!St(e,a)||t.has(e,a)}));const de=["continue","continuePrimaryKey","advance"],Ct={},pt=new WeakMap,jt=new WeakMap,ue={get(t,e){if(!de.includes(e))return t[e];let a=Ct[e];return a||(a=Ct[e]=function(...n){pt.set(this,jt.get(this)[e](...n))}),a}};async function*pe(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,ue);for(jt.set(a,e),Z.set(a,ut(e));e;)yield a,e=await(pt.get(a)||e.continue()),pt.delete(a)}function kt(t,e){return e===Symbol.asyncIterator&&lt(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&lt(t,[IDBIndex,IDBObjectStore])}Vt(t=>({...t,get(e,a,n){return kt(e,a)?pe:t.get(e,a,n)},has(e,a){return kt(e,a)||t.has(e,a)}}));const $=se("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const r=n,o=t.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let s=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(s=t.createObjectStore("inventory",{keyPath:"id"}),s.createIndex("by_purchaseDate","purchaseDate"),s.createIndex("by_productName","productName"),s.createIndex("by_categoryId","categoryId"),s.createIndex("by_active","active"),s.createIndex("by_archived","archived"),s.createIndex("by_updatedAt","updatedAt")),s&&o){let i=await o.openCursor();for(;i;)await s.put(i.value),i=await i.continue()}let l=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(l=t.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const i=t.createObjectStore("valuationSnapshots",{keyPath:"id"});i.createIndex("by_capturedAt","capturedAt"),i.createIndex("by_scope","scope"),i.createIndex("by_marketId","marketId"),i.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(s){let i=await s.openCursor();for(;i;){const d=i.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.archived!="boolean"&&(d.archived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await i.update(d)),i=await i.continue()}}if(l){let i=await l.openCursor();for(;i;){const d=i.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await i.update(d)),i=await i.continue()}}}});async function fe(){return(await $).getAll("inventory")}async function W(t){await(await $).put("inventory",t)}async function yt(t){return(await $).get("inventory",t)}async function me(){return(await $).getAll("categories")}async function ft(t){await(await $).put("categories",t)}async function Ot(t){return(await $).get("categories",t)}async function be(){return(await $).getAll("settings")}async function J(t,e){await(await $).put("settings",{key:t,value:e})}async function ye(){return(await $).getAll("valuationSnapshots")}async function ve(t){if(!t.length)return;const a=(await $).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function ge(t){const a=(await $).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function he(){const e=(await $).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function we(){const e=(await $).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function $t(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function Ie(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Rt(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const r of t)r.linkedToFilterId&&a.has(r.linkedToFilterId)&&!a.has(r.id)&&(a.add(r.id),n=!0)}return t.filter(r=>!a.has(r.id))}function Se(t,e){return t.filter(a=>a.viewId!==e)}function mt(t,e,a,n,r){const o=e.filter(l=>l.viewId===a);if(!o.length)return t;const s=new Map(n.map(l=>[l.key,l]));return t.filter(l=>o.every(i=>{var m;const d=s.get(i.field);if(!d)return!0;const c=d.getValue(l);if(i.op==="eq")return String(c)===i.value;if(i.op==="isEmpty")return $t(c);if(i.op==="isNotEmpty")return!$t(c);if(i.op==="contains")return String(c).toLowerCase().includes(i.value.toLowerCase());if(i.op==="inCategorySubtree"){const f=((m=r==null?void 0:r.categoryDescendantsMap)==null?void 0:m.get(i.value))||new Set([i.value]),y=String(c);return f.has(y)}return!0}))}function Ce(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:e,children:a}}function X(t){const{children:e}=Ce(t),a=new Map;function n(r){const o=new Set([r]);for(const s of e.get(r)||[])for(const l of n(s.id))o.add(l);return a.set(r,o),o}for(const r of t)a.has(r.id)||n(r.id);return a}function Bt(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const r=[],o=[],s=new Set;let l=n;for(;l&&!s.has(l.id);)s.add(l.id),r.unshift(l.id),o.unshift(l.name),l=l.parentId?e.get(l.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return t.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function vt(t,e){return[...X(t).get(e)||new Set([e])]}function ke(t,e){const a=X(e),n=new Map;for(const r of e){const o=a.get(r.id)||new Set([r.id]);let s=0;for(const l of t)o.has(l.categoryId)&&(s+=l.totalPriceCents);n.set(r.id,s)}return n}const Ut=document.querySelector("#app");if(!Ut)throw new Error("#app not found");const h=Ut;let I={kind:"none"},O=null,E=null,N=null,A=null,D=null,xt=!1,Q=null,rt=!1,ot=null,B=null,Y=null,At=!1,j=null,U=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:Ht(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const K="USD",V="$",$e=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function S(){return new Date().toISOString()}function Ht(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function it(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function w(t){const e=G("currencySymbol")||V,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function gt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function G(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function x(t){p={...p,...t},F()}function H(t){j!=null&&(window.clearTimeout(j),j=null),U=t,F(),t&&(j=window.setTimeout(()=>{j=null,U=null,F()},3500))}function L(t){I.kind==="none"&&document.activeElement instanceof HTMLElement&&(O=document.activeElement),I=t,F()}function q(){I.kind!=="none"&&(I={kind:"none"},F(),O&&O.isConnected&&O.focus(),O=null)}function _t(){return h.querySelector(".modal-panel")}function Qt(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function xe(){if(I.kind==="none")return;const t=_t();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(Qt(t)[0]||t).focus()}function Ae(){var t,e;(t=E==null?void 0:E.destroy)==null||t.call(E),(e=N==null?void 0:N.destroy)==null||e.call(N),E=null,N=null}function bt(){var s;const t=window,e=t.DataTable,a=t.jQuery&&((s=t.jQuery.fn)!=null&&s.DataTable)?t.jQuery:void 0;if(!e&&!a){ot==null&&(ot=window.setTimeout(()=>{ot=null,bt(),F()},500)),rt||(rt=!0,window.addEventListener("load",()=>{rt=!1,bt(),F()},{once:!0}));return}const n=h.querySelector("#categories-table"),r=h.querySelector("#inventory-table"),o=(l,i)=>{var d,c;return e?new e(l,i):a?((c=(d=a(l)).DataTable)==null?void 0:c.call(d,i))??null:null};n&&(E=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Mt(n,E)),r&&(N=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Mt(r,N))}function De(t,e,a){const n=e.find(o=>o.key==="computedTotalCents");return n?(a?t:t.filter(o=>o.parentId==null)).map(o=>{const s=n.getValue(o);return typeof s!="number"||!Number.isFinite(s)||s<=0?null:{id:o.id,label:o.pathNames.join(" / "),totalCents:s}}).filter(o=>o!=null).sort((o,s)=>s.totalCents-o.totalCents):[]}function z(t,e){const a=h.querySelector(`#${t}`),n=h.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Dt(t){const e=h.querySelector(`#${t}`),a=h.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Me(){A==null||A.dispose(),D==null||D.dispose(),A=null,D=null}function Te(){xt||(xt=!0,window.addEventListener("resize",()=>{Q!=null&&window.clearTimeout(Q),Q=window.setTimeout(()=>{Q=null,A==null||A.resize(),D==null||D.resize()},120)}))}function Ee(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function Ne(t){const e="markets-allocation-chart",a="markets-top-chart",n=h.querySelector(`#${e}`),r=h.querySelector(`#${a}`);if(!n||!r)return;if(!window.echarts){z(e,"Chart unavailable: ECharts not loaded."),z(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){z(e,"No eligible market totals to chart."),z(a,"No eligible market totals to chart.");return}Dt(e),Dt(a);const o=window.matchMedia("(max-width: 767.98px)").matches,s=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],l=t.map(f=>({name:f.label,value:f.totalCents})),i=t.slice(0,5),d=[...i].reverse(),c=i.reduce((f,y)=>Math.max(f,y.totalCents),0),m=c>0?Math.ceil(c*1.2):1;A=window.echarts.init(n),D=window.echarts.init(r),A.setOption({color:s,tooltip:{trigger:"item",formatter:f=>`${u(f.name)}: ${w(f.value)} (${f.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,icon:"circle"}:{orient:"vertical",right:0,top:"center",icon:"circle"},series:[{type:"pie",radius:["55%","78%"],center:o?["50%","44%"]:["36%","50%"],data:l,avoidLabelOverlap:!0,label:{show:!o,formatter:"{d}%"},labelLine:{show:!o}}]}),D.setOption({color:["#198754"],grid:{left:"4%",right:"6%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:f=>{const y=f[0];return y?`${u(y.name)}: ${w(y.value)}`:""}},xAxis:{type:"value",max:m,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:d.map(f=>f.label),axisLabel:{formatter:f=>Ee(f)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:d.map(f=>f.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"insideRight",color:"#212529",formatter:f=>w(f.value)}}]}),Te()}function Mt(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var m,f,y;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const s=Array.from(o.querySelectorAll("th")),l=s.indexOf(r);if(l<0||l===s.length-1)return;a.preventDefault(),a.stopPropagation();const i=(m=e.order)==null?void 0:m.call(e),d=Array.isArray(i)?i[0]:void 0,c=d&&d[0]===l&&d[1]==="asc"?"desc":"asc";(f=e.order)==null||f.call(e,[[l,c]]),(y=e.draw)==null||y.call(e,!1)},!0)}async function C(){var l,i;const[t,e,a,n]=await Promise.all([fe(),me(),be(),ye()]),r=Bt(e).sort((d,c)=>d.sortOrder-c.sortOrder||d.name.localeCompare(c.name));a.some(d=>d.key==="currencyCode")||(await J("currencyCode",K),a.push({key:"currencyCode",value:K})),a.some(d=>d.key==="currencySymbol")||(await J("currencySymbol",V),a.push({key:"currencySymbol",value:V}));let o=null,s=null;try{const d=await((i=(l=navigator.storage)==null?void 0:l.estimate)==null?void 0:i.call(l));o=typeof(d==null?void 0:d.usage)=="number"?d.usage:null,s=typeof(d==null?void 0:d.quota)=="number"?d.quota:null}catch{o=null,s=null}p={...p,inventoryRecords:t,categories:r,settings:a,valuationSnapshots:n,storageUsageBytes:o,storageQuotaBytes:s},F()}function k(t){if(t)return p.categories.find(e=>e.id===t)}function Fe(t){const e=k(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function Le(t){return Fe(t)}function Pe(t){const e=k(t);return e?e.pathIds.some(a=>{var n;return((n=k(a))==null?void 0:n.active)===!1}):!1}function qe(t){const e=k(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=k(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function Ve(t){return t.active&&!qe(t)}function st(t){return t==null?"":(t/100).toFixed(2)}function ht(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const r=Number(e.value),o=gt(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function zt(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const r=k(e.value),o=(r==null?void 0:r.evaluationMode)==="snapshot";a.hidden=o,o?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function Gt(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]');if(!e||!a||!n)return;const r=e.value==="spot";a.hidden=!r,n.disabled=!r}function Tt(t){var e;return t.parentId?((e=k(t.parentId))==null?void 0:e.name)||"(Unknown)":""}function R(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function je(t){return t.active&&!t.archived}function Wt(){const t=p.inventoryRecords.filter(je),e=p.categories.filter(o=>!o.isArchived),a=ke(t,e),n=new Map(p.categories.map(o=>[o.id,o])),r=new Map;for(const o of t){const s=n.get(o.categoryId);if(s)for(const l of s.pathIds)r.set(l,(r.get(l)||0)+o.quantity)}return{categoryTotals:a,categoryQty:r}}function Jt(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>Le(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>w(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>w(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function Oe(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:t=>Tt(t),getDisplay:t=>Tt(t),filterable:!0,filterOp:"eq"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Value",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":w(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function Yt(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function Re(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function Be(){const t=Jt(),e=Oe(),a=e.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),n=e.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),r=X(p.categories),o=mt(Yt(),p.filters,"inventoryTable",t,{categoryDescendantsMap:r}),{categoryTotals:s,categoryQty:l}=Wt(),i=[...a,{key:"computedQty",label:"Qty",getValue:c=>l.get(c.id)||0,getDisplay:c=>String(l.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>s.get(c.id)||0,getDisplay:c=>w(s.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:c=>c.evaluationMode==="snapshot"?s.get(c.id)||0:c.evaluationMode==="spot"&&c.spotValueCents!=null?(l.get(c.id)||0)*c.spotValueCents:"",getDisplay:c=>c.evaluationMode==="snapshot"?w(s.get(c.id)||0):c.evaluationMode==="spot"&&c.spotValueCents!=null?w((l.get(c.id)||0)*c.spotValueCents):"",filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],d=mt(Re(),p.filters,"categoriesList",i);return{inventoryColumns:t,categoryColumns:i,categoryDescendantsMap:r,filteredInventoryRecords:o,filteredCategories:d,categoryTotals:s,categoryQty:l}}async function Ue(){const t=S(),{categoryTotals:e,categoryQty:a}=Wt(),n=p.categories.filter(i=>i.active&&!i.isArchived),r=[];let o=0,s=0;for(const i of n){let d=null;const c=a.get(i.id)||0;if(i.evaluationMode==="spot"){if(i.spotValueCents==null){s+=1;continue}d=Math.round(c*i.spotValueCents)}else if(i.evaluationMode==="snapshot")d=e.get(i.id)||0;else{s+=1;continue}o+=d,r.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:i.id,evaluationMode:i.evaluationMode,valueCents:d,quantity:i.evaluationMode==="spot"?c:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!r.length){H({tone:"warning",text:"No markets were eligible for snapshot capture."});return}r.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:o,source:"manual",createdAt:t,updatedAt:t}),await ve(r),await C();const l=s>0?` (${s} skipped)`:"";H({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${w(o)}${l}`})}function Et(t,e){const a=p.filters.filter(n=>n.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${a.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${a.map(n=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${u(n.label)}"
                  aria-label="Remove filter: ${u(n.label)}"
                  data-action="remove-filter"
                  data-filter-id="${n.id}"
                >${u(n.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
    </div>
  `}function Nt(t,e,a){const n=a.getValue(e),r=a.getDisplay(e),o=n==null?"":String(n),s=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const i=String(e.categoryId),d=Pe(i);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const i=e.parentId;if(typeof i=="string"&&i)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(i)}"><span class="filter-hit">${u(r)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const i=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(i)}"><span class="filter-hit">${u(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}</span></button>`}function He(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function Ft(t,e){const a=t.map((n,r)=>{let o=0,s=!1;for(const i of e){const d=n.getValue(i);typeof d=="number"&&Number.isFinite(d)&&(o+=d,s=!0)}const l=s?String(n.key).toLowerCase().includes("cents")?w(o):He(o):r===0?"Totals":"";return`<th class="${R(n)}">${u(l)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function _(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function _e(t,e){const a=[...t];return a.filter(r=>{for(const o of a){if(o===r)continue;const s=e.get(o);if(s!=null&&s.has(r))return!1}return!0})}function Qe(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?_e(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Lt(t,e){if(!t.length)return null;let a=null;for(const n of t){const r=Date.parse(n.capturedAt);if(Number.isFinite(r)){if(r<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function ze(t){const e=_(p.reportDateFrom),a=_(p.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=Qe(t),r=new Map;for(const m of p.valuationSnapshots){if(m.scope!=="market"||!m.marketId)continue;const f=r.get(m.marketId)||[];f.push(m),r.set(m.marketId,f)}for(const m of r.values())m.sort((f,y)=>Date.parse(f.capturedAt)-Date.parse(y.capturedAt));const o=p.inventoryRecords.filter(m=>m.active&&!m.archived),s=[];let l=0,i=0,d=0,c=0;for(const m of n){const f=k(m);if(!f)continue;const y=t.get(m)||new Set([m]),v=r.get(m)||[],b=Lt(v,e),g=Lt(v,a);let M=0;for(const tt of o){if(!y.has(tt.categoryId))continue;const et=_(tt.purchaseDate);et!=null&&et>e&&et<=a&&(M+=tt.totalPriceCents)}const T=b==null||g==null?null:g-b,te=T==null||b==null||b<=0?null:T/b;b!=null&&(l+=b),g!=null&&(i+=g),d+=M,T!=null&&(c+=T),s.push({marketId:m,marketLabel:f.pathNames.join(" / "),startValueCents:b,endValueCents:g,contributionsCents:M,netGrowthCents:T,growthPct:te})}return{scopeMarketIds:n,rows:s,startTotalCents:l,endTotalCents:i,contributionsTotalCents:d,netGrowthTotalCents:c}}function Pt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function Ge(){if(I.kind==="none")return"";const t=G("currencySymbol")||V,e=(a,n)=>p.categories.filter(r=>!r.isArchived).filter(r=>!(a!=null&&a.has(r.id))).map(r=>`<option value="${r.id}" ${n===r.id?"selected":""}>${u(r.pathNames.join(" / "))}</option>`).join("");if(I.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((G("currencyCode")||K).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${$e.map(a=>`<option value="${u(a.value)}" ${(G("currencySymbol")||V)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save settings</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;if(I.kind==="categoryCreate"||I.kind==="categoryEdit"){const a=I.kind==="categoryEdit",n=I.kind==="categoryEdit"?k(I.categoryId):void 0;if(a&&!n)return"";const r=a&&n?new Set(vt(p.categories,n.id)):void 0,o=X(p.categories);return mt(Yt(),p.filters,"inventoryTable",Jt(),{categoryDescendantsMap:o}),`
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
                ${e(r,(n==null?void 0:n.parentId)||null)}
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(st(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n?n.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            <div class="modal-footer px-0 pb-0">
              ${a&&n?`<button type="button" class="btn ${n.isArchived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${n.id}" data-next-archived="${String(!n.isArchived)}">${n.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
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
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;if(I.kind==="inventoryEdit"){const a=I,n=p.inventoryRecords.find(r=>r.id===a.inventoryId);return n?`
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(st(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(st(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${u(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function F(){const t=h.querySelector("details.details-card");t&&(At=t.open),Me(),Ae();const{inventoryColumns:e,categoryColumns:a,categoryDescendantsMap:n,filteredInventoryRecords:r,filteredCategories:o}=Be(),s=p.filters.some(b=>b.viewId==="categoriesList"),l=De(o,a,s),i=ze(n),d=i.startTotalCents>0?i.netGrowthTotalCents/i.startTotalCents:null,c=p.exportText||Kt(),m=r.map(b=>`
        <tr class="${[Ve(b)?"":"row-inactive",b.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${b.id}">
          ${e.map(M=>`<td class="${R(M)}">${Nt("inventoryTable",b,M)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${b.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),f=o.map(b=>`
      <tr class="${[b.active?"":"row-inactive",b.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${b.id}">
        ${a.map(g=>`<td class="${R(g)}">${Nt("categoriesList",b,g)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${b.id}">Edit</button>
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
        ${U?`<div class="alert alert-${U.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(U.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${i.scopeMarketIds.length?`${i.scopeMarketIds.length} market${i.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
              <button type="button" class="btn btn-outline-success btn-sm" data-action="capture-snapshot">Capture Snapshot</button>
            </div>
          </div>
          <div class="d-flex align-items-end gap-2 flex-wrap my-2">
            <label class="form-label mb-0">From
              <input class="form-control form-control-sm" type="date" name="reportDateFrom" value="${u(p.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0">To
              <input class="form-control form-control-sm" type="date" name="reportDateTo" value="${u(p.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${i.rows.length===0?`
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
                  ${i.rows.map(b=>`
                    <tr>
                      <td>${u(b.marketLabel)}</td>
                      <td class="text-end">${b.startValueCents==null?"—":u(w(b.startValueCents))}</td>
                      <td class="text-end">${b.endValueCents==null?"—":u(w(b.endValueCents))}</td>
                      <td class="text-end">${u(w(b.contributionsCents))}</td>
                      <td class="text-end">${b.netGrowthCents==null?"—":u(w(b.netGrowthCents))}</td>
                      <td class="text-end">${u(Pt(b.growthPct))}</td>
                    </tr>
                  `).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(w(i.startTotalCents))}</th>
                    <th class="text-end">${u(w(i.endTotalCents))}</th>
                    <th class="text-end">${u(w(i.contributionsTotalCents))}</th>
                    <th class="text-end">${u(w(i.netGrowthTotalCents))}</th>
                    <th class="text-end">${u(Pt(d))}</th>
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
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        <div class="markets-widget-grid mb-2">
          <article class="markets-widget-card card border-0">
            <div class="card-body p-2 p-md-3">
              <h3 class="h6 mb-2">Allocation</h3>
              <div class="markets-chart-frame">
                <div id="markets-allocation-chart" class="markets-chart-canvas" role="img" aria-label="Market allocation chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-allocation-chart" hidden></p>
              </div>
            </div>
          </article>
          <article class="markets-widget-card card border-0">
            <div class="card-body p-2 p-md-3">
              <h3 class="h6 mb-2">Top Markets by Value</h3>
              <div class="markets-chart-frame">
                <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
              </div>
            </div>
          </article>
        </div>
        ${Et("categoriesList","Markets")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${a.map(b=>`<th class="${R(b)}">${u(b.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${f}
            </tbody>
            ${Ft(a,o)}
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
              <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Et("inventoryTable","Investments")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${e.map(b=>`<th class="${R(b)}">${u(b.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${m}
              </tbody>
              ${Ft(e,r)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" ${At?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(it(p.storageUsageBytes)):`${u(it(p.storageUsageBytes))} of ${u(it(p.storageQuotaBytes))}`}
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
    ${Ge()}
  `;const y=h.querySelector("#inventory-form");y&&(zt(y),ht(y));const v=h.querySelector("#category-form");v&&Gt(v),xe(),Ne(l),bt()}function We(){return{schemaVersion:2,exportedAt:S(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function Kt(){return JSON.stringify(We(),null,2)}function Je(t,e,a){const n=new Blob([e],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=t,o.click(),URL.revokeObjectURL(r)}async function Ye(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim();if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await J("currencyCode",a),await J("currencySymbol",n),q(),await C()}async function Ke(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),r=String(e.get("name")||"").trim(),o=String(e.get("parentId")||"").trim(),s=String(e.get("evaluationMode")||"").trim(),l=String(e.get("spotValue")||"").trim(),i=e.get("active")==="on",d=s==="spot"||s==="snapshot"?s:void 0,c=d==="spot"&&l?gt(l):void 0;if(!r)return;if(d==="spot"&&l&&c==null){alert("Spot value is invalid.");return}const m=c??void 0,f=o||null;if(f&&!k(f)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const g=await Ot(n);if(!g){alert("Market not found.");return}if(f===g.id){alert("A category cannot be its own parent.");return}if(f&&vt(p.categories,g.id).includes(f)){alert("A category cannot be moved under its own subtree.");return}const M=g.parentId!==f;g.name=r,g.parentId=f,g.evaluationMode=d,g.spotValueCents=m,g.active=i,M&&(g.sortOrder=p.categories.filter(T=>T.parentId===f&&T.id!==g.id).length),g.updatedAt=S(),await ft(g),q(),await C();return}const y=S(),v=p.categories.filter(g=>g.parentId===f).length,b={id:crypto.randomUUID(),name:r,parentId:f,pathIds:[],pathNames:[],depth:0,sortOrder:v,evaluationMode:d,spotValueCents:m,active:i,isArchived:!1,createdAt:y,updatedAt:y};await ft(b),q(),await C()}async function Ze(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),r=String(e.get("purchaseDate")||""),o=String(e.get("productName")||"").trim(),s=Number(e.get("quantity")),l=gt(String(e.get("totalPrice")||"")),i=String(e.get("categoryId")||""),d=e.get("active")==="on",c=String(e.get("notes")||"").trim();if(!r||!o||!i){alert("Date, product name, and category are required.");return}if(!Number.isFinite(s)||s<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!k(i)){alert("Select a valid category.");return}const m=Math.round(l/s);if(a==="edit"){if(!n)return;const v=await yt(n);if(!v){alert("Inventory record not found.");return}v.purchaseDate=r,v.productName=o,v.quantity=s,v.totalPriceCents=l,v.unitPriceCents=m,v.unitPriceSource="derived",v.categoryId=i,v.active=d,v.notes=c||void 0,v.updatedAt=S(),await W(v),q(),await C();return}const f=S(),y={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:s,totalPriceCents:l,unitPriceCents:m,unitPriceSource:"derived",categoryId:i,active:d,archived:!1,notes:c||void 0,createdAt:f,updatedAt:f};await W(y),q(),await C()}async function Xe(t,e){const a=await yt(t);a&&(a.active=e,a.updatedAt=S(),await W(a),await C())}async function ta(t,e){const a=await yt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?S():void 0,a.updatedAt=S(),await W(a),await C()))}async function ea(t,e){const a=k(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=vt(p.categories,t),r=S();for(const o of n){const s=await Ot(o);s&&(s.isArchived=e,e&&(s.active=!1),s.archivedAt=e?r:void 0,s.updatedAt=r,await ft(s))}await C()}function aa(t){const e=S();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function na(t){const e=S(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const r=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:r,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ra(t){const e=S(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",r=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,o=Number(t.valueCents);if(!Number.isFinite(o))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:r,valueCents:o,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function oa(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Bt(e.categories.map(aa)),n=new Set(a.map(i=>i.id)),r=e.purchases.map(na);for(const i of r)if(!n.has(i.categoryId))throw new Error(`Inventory record ${i.id} references missing categoryId ${i.categoryId}`);const o=Array.isArray(e.settings)?e.settings.map(i=>({key:String(i.key),value:i.value})):[{key:"currencyCode",value:K},{key:"currencySymbol",value:V}],s=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(ra):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await ge({purchases:r,categories:a,settings:o,valuationSnapshots:s}),x({importText:""}),await C()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function Zt(t){return t.target instanceof HTMLElement?t.target:null}function qt(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,r=t.dataset.value,o=t.dataset.label;if(!e||!a||!n||r==null||!o)return;const s=(c,m)=>c.viewId===m.viewId&&c.field===m.field&&c.op===m.op&&c.value===m.value;let l=Ie(p.filters,{viewId:e,field:a,op:n,value:r,label:o});const i=t.dataset.crossInventoryCategoryId;if(i){const c=k(i);if(c){const m=l.find(f=>s(f,{viewId:e,field:a,op:n,value:r}));if(m){const f=`Market: ${c.pathNames.join(" / ")}`;l=l.filter(v=>v.linkedToFilterId!==m.id);const y=l.findIndex(v=>s(v,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id}));if(y>=0){const v=l[y];l=[...l.slice(0,y),{...v,label:f,linkedToFilterId:m.id},...l.slice(y+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id,label:f,linkedToFilterId:m.id}]}}}let d={filters:l};e==="inventoryTable"&&a==="archived"&&r==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&r==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),x(d)}function Xt(){B!=null&&(window.clearTimeout(B),B=null)}function ia(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&x({filters:Rt(p.filters,a.id)})}h.addEventListener("click",async t=>{const e=Zt(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(Xt(),t.detail>1)return;B=window.setTimeout(()=>{B=null,qt(a)},220);return}qt(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;x({filters:Rt(p.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;x({filters:Se(p.filters,r)});return}if(n==="toggle-show-archived-inventory"){x({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){x({showArchivedCategories:a.checked});return}if(n==="open-create-category"){L({kind:"categoryCreate"});return}if(n==="open-create-inventory"){L({kind:"inventoryCreate"});return}if(n==="open-settings"){L({kind:"settings"});return}if(n==="apply-report-range"){const r=h.querySelector('input[name="reportDateFrom"]'),o=h.querySelector('input[name="reportDateTo"]');if(!r||!o)return;const s=r.value,l=o.value,i=_(s),d=_(l,!0);if(i==null||d==null||i>d){H({tone:"warning",text:"Select a valid report date range."});return}x({reportDateFrom:s,reportDateTo:l});return}if(n==="reset-report-range"){x({reportDateFrom:Ht(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await Ue()}catch{H({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="edit-category"){const r=a.dataset.id;r&&L({kind:"categoryEdit",categoryId:r});return}if(n==="edit-inventory"){const r=a.dataset.id;r&&L({kind:"inventoryEdit",inventoryId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;q();return}if(n==="toggle-inventory-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await Xe(r,o);return}if(n==="toggle-inventory-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ta(r,o);return}if(n==="toggle-category-subtree-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ea(r,o);return}if(n==="download-json"){Je(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,Kt(),"application/json");return}if(n==="replace-import"){await oa();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await we(),await C(),H({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await he(),x({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await C();return}}});h.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(Xt(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const r=n.dataset.id,o=n.dataset.rowEdit;if(!(!r||!o)){if(o==="inventory"){L({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&L({kind:"categoryEdit",categoryId:r})}});h.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await Ye(e);return}if(e.id==="category-form"){await Ke(e);return}if(e.id==="inventory-form"){await Ze(e);return}}});h.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&ht(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});h.addEventListener("change",async t=>{var r;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const o=e.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(zt(o),ht(o));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const o=e.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&Gt(o);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(r=e.files)==null?void 0:r[0];if(!a)return;const n=await a.text();x({importText:n})});h.addEventListener("pointermove",t=>{const e=Zt(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");Y=(a==null?void 0:a.dataset.filterSectionViewId)||null});h.addEventListener("pointerleave",()=>{Y=null});document.addEventListener("keydown",t=>{if(I.kind==="none"){if(t.key!=="Escape")return;const s=t.target;if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement||s instanceof HTMLSelectElement||!Y)return;t.preventDefault(),ia(Y);return}if(t.key==="Escape"){t.preventDefault(),q();return}if(t.key!=="Tab")return;const e=_t();if(!e)return;const a=Qt(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(t.shiftKey){(o===n||o instanceof Node&&!e.contains(o))&&(t.preventDefault(),r.focus());return}o===r&&(t.preventDefault(),n.focus())});C();
