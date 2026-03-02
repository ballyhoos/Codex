(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const wt=(t,e)=>e.some(a=>t instanceof a);let Nt,Ft;function de(){return Nt||(Nt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ue(){return Ft||(Ft=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const St=new WeakMap,pt=new WeakMap,dt=new WeakMap;function pe(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{a(B(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return dt.set(e,t),e}function fe(t){if(St.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});St.set(t,e)}let Ct={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return St.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return B(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function zt(t){Ct=t(Ct)}function me(t){return ue().includes(t)?function(...e){return t.apply(It(this),e),B(this.request)}:function(...e){return B(t.apply(It(this),e))}}function be(t){return typeof t=="function"?me(t):(t instanceof IDBTransaction&&fe(t),wt(t,de())?new Proxy(t,Ct):t)}function B(t){if(t instanceof IDBRequest)return pe(t);if(pt.has(t))return pt.get(t);const e=be(t);return e!==t&&(pt.set(t,e),dt.set(e,t)),e}const It=t=>dt.get(t);function ye(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),l=B(i);return n&&i.addEventListener("upgradeneeded",s=>{n(B(i.result),s.oldVersion,s.newVersion,B(i.transaction),s)}),a&&i.addEventListener("blocked",s=>a(s.oldVersion,s.newVersion,s)),l.then(s=>{r&&s.addEventListener("close",()=>r()),o&&s.addEventListener("versionchange",c=>o(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const he=["get","getKey","getAll","getAllKeys","count"],ge=["put","add","delete","clear"],ft=new Map;function Lt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ft.get(e))return ft.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=ge.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||he.includes(a)))return;const r=async function(i,...l){const s=this.transaction(i,o?"readwrite":"readonly");let c=s.store;return n&&(c=c.index(l.shift())),(await Promise.all([c[a](...l),o&&s.done]))[0]};return ft.set(e,r),r}zt(t=>({...t,get:(e,a,n)=>Lt(e,a)||t.get(e,a,n),has:(e,a)=>!!Lt(e,a)||t.has(e,a)}));const ve=["continue","continuePrimaryKey","advance"],Pt={},kt=new WeakMap,Wt=new WeakMap,we={get(t,e){if(!ve.includes(e))return t[e];let a=Pt[e];return a||(a=Pt[e]=function(...n){kt.set(this,Wt.get(this)[e](...n))}),a}};async function*Se(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,we);for(Wt.set(a,e),dt.set(a,It(e));e;)yield a,e=await(kt.get(a)||e.continue()),kt.delete(a)}function qt(t,e){return e===Symbol.asyncIterator&&wt(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&wt(t,[IDBIndex,IDBObjectStore])}zt(t=>({...t,get(e,a,n){return qt(e,a)?Se:t.get(e,a,n)},has(e,a){return qt(e,a)||t.has(e,a)}}));const E=ye("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let s=await r.openCursor();for(;s;)await i.put(s.value),s=await s.continue()}let l=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(l=t.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const s=t.createObjectStore("valuationSnapshots",{keyPath:"id"});s.createIndex("by_capturedAt","capturedAt"),s.createIndex("by_scope","scope"),s.createIndex("by_marketId","marketId"),s.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let s=await i.openCursor();for(;s;){const c=s.value;let f=!1;typeof c.active!="boolean"&&(c.active=!0,f=!0),typeof c.archived!="boolean"&&(c.archived=!1,f=!0),f&&(c.updatedAt=new Date().toISOString(),await s.update(c)),s=await s.continue()}}if(l){let s=await l.openCursor();for(;s;){const c=s.value;let f=!1;typeof c.active!="boolean"&&(c.active=!0,f=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,f=!0),f&&(c.updatedAt=new Date().toISOString(),await s.update(c)),s=await s.continue()}}}});async function Ce(){return(await E).getAll("inventory")}async function st(t){await(await E).put("inventory",t)}async function At(t){return(await E).get("inventory",t)}async function Ie(){return(await E).getAll("categories")}async function $t(t){await(await E).put("categories",t)}async function Qt(t){return(await E).get("categories",t)}async function ke(){return(await E).getAll("settings")}async function W(t,e){await(await E).put("settings",{key:t,value:e})}async function $e(){return(await E).getAll("valuationSnapshots")}async function xe(t){if(!t.length)return;const a=(await E).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function Me(t){const a=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Ae(){const e=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Te(){const e=(await E).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function Vt(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function De(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Jt(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function Ee(t,e){return t.filter(a=>a.viewId!==e)}function xt(t,e,a,n,o){const r=e.filter(l=>l.viewId===a);if(!r.length)return t;const i=new Map(n.map(l=>[l.key,l]));return t.filter(l=>r.every(s=>{var u;const c=i.get(s.field);if(!c)return!0;const f=c.getValue(l);if(s.op==="eq")return String(f)===s.value;if(s.op==="isEmpty")return Vt(f);if(s.op==="isNotEmpty")return!Vt(f);if(s.op==="contains")return String(f).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const g=((u=o==null?void 0:o.categoryDescendantsMap)==null?void 0:u.get(s.value))||new Set([s.value]),y=String(f);return g.has(y)}return!0}))}function Ne(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function ut(t){const{children:e}=Ne(t),a=new Map;function n(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const l of n(i.id))r.add(l);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function Yt(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let l=n;for(;l&&!i.has(l.id);)i.add(l.id),o.unshift(l.id),r.unshift(l.name),l=l.parentId?e.get(l.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Tt(t,e){return[...ut(t).get(e)||new Set([e])]}function Fe(t,e){const a=ut(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const l of t)r.has(l.categoryId)&&(i+=l.totalPriceCents);n.set(o.id,i)}return n}const Kt=document.querySelector("#app");if(!Kt)throw new Error("#app not found");const S=Kt;let x={kind:"none"},K=null,O=null,V=null,L=null,P=null,Rt=!1,ot=null,mt=!1,bt=null,Z=null,lt=null,Ot=!1,jt=!1,z=new Set,Y=null,tt=null,rt=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:Xt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const ct="USD",Q="$",nt=!1,Le=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function A(){return new Date().toISOString()}function Xt(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function yt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function Pe(){const t=Math.round(window.innerWidth);return`${t<=767?"Mobile (<=767px)":"Desktop/Tablet (>767px)"} — ${t}px`}function C(t){const e=X("currencySymbol")||Q,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function Dt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function X(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function qe(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:nt;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function N(t){p={...p,...t},F()}function et(t){Y!=null&&(window.clearTimeout(Y),Y=null),tt=t,F(),t&&(Y=window.setTimeout(()=>{Y=null,tt=null,F()},3500))}function j(t){x.kind==="none"&&document.activeElement instanceof HTMLElement&&(K=document.activeElement),x=t,F()}function U(){x.kind!=="none"&&(x={kind:"none"},F(),K&&K.isConnected&&K.focus(),K=null)}function Zt(){return S.querySelector(".modal-panel")}function te(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function Ve(){if(x.kind==="none")return;const t=Zt();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(te(t)[0]||t).focus()}function Re(){var t,e;(t=O==null?void 0:O.destroy)==null||t.call(O),(e=V==null?void 0:V.destroy)==null||e.call(V),O=null,V=null}function Mt(){var i;const t=window,e=t.DataTable,a=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!a){bt==null&&(bt=window.setTimeout(()=>{bt=null,Mt(),F()},500)),mt||(mt=!0,window.addEventListener("load",()=>{mt=!1,Mt(),F()},{once:!0}));return}const n=S.querySelector("#categories-table"),o=S.querySelector("#inventory-table"),r=(l,s)=>{var c,f;return e?new e(l,s):a?((f=(c=a(l)).DataTable)==null?void 0:f.call(c,s))??null:null};n&&(O=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(V=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),He(o,V))}function Oe(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function it(t,e){const a=S.querySelector(`#${t}`),n=S.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Bt(t){const e=S.querySelector(`#${t}`),a=S.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function je(){L==null||L.dispose(),P==null||P.dispose(),L=null,P=null}function Be(){Rt||(Rt=!0,window.addEventListener("resize",()=>{ot!=null&&window.clearTimeout(ot),ot=window.setTimeout(()=>{ot=null,L==null||L.resize(),P==null||P.resize()},120)}))}function Ue(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function Ge(t){const e="markets-allocation-chart",a="markets-top-chart",n=S.querySelector(`#${e}`),o=S.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){it(e,"Chart unavailable: ECharts not loaded."),it(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){it(e,"No eligible market totals to chart."),it(a,"No eligible market totals to chart.");return}Bt(e),Bt(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],s=i?"#e9ecef":"#212529",c=i?"#ced4da":"#495057",f=t.map(h=>({name:h.label,value:h.totalCents})),u=t.slice(0,5),g=[...u].reverse(),y=u.reduce((h,v)=>Math.max(h,v.totalCents),0),b=y>0?Math.ceil(y*1.2):1;L=window.echarts.init(n),P=window.echarts.init(o),L.setOption({color:l,tooltip:{trigger:"item",formatter:h=>`${d(h.name)}: ${C(h.value)} (${h.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:f,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:10,textBorderWidth:0,formatter:h=>{const v=h.percent??0;return`${Math.round(v)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:c,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),P.setOption({color:["#198754"],grid:{left:"4%",right:"6%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:h=>{const v=h[0];return v?`${d(v.name)}: ${C(v.value)}`:""}},xAxis:{type:"value",max:b,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:g.map(h=>h.label),axisLabel:{color:c,formatter:h=>Ue(h)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:g.map(h=>h.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:s,formatter:h=>C(h.value)}}]}),Be()}function He(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var u,g,y;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),l=i.indexOf(o);if(l<0||l===i.length-1)return;a.preventDefault(),a.stopPropagation();const s=(u=e.order)==null?void 0:u.call(e),c=Array.isArray(s)?s[0]:void 0,f=c&&c[0]===l&&c[1]==="asc"?"desc":"asc";(g=e.order)==null||g.call(e,[[l,f]]),(y=e.draw)==null||y.call(e,!1)},!0)}async function T(){var l,s;const[t,e,a,n]=await Promise.all([Ce(),Ie(),ke(),$e()]),o=Yt(e).sort((c,f)=>c.sortOrder-f.sortOrder||c.name.localeCompare(f.name));a.some(c=>c.key==="currencyCode")||(await W("currencyCode",ct),a.push({key:"currencyCode",value:ct})),a.some(c=>c.key==="currencySymbol")||(await W("currencySymbol",Q),a.push({key:"currencySymbol",value:Q})),a.some(c=>c.key==="darkMode")||(await W("darkMode",nt),a.push({key:"darkMode",value:nt})),qe(a);let r=null,i=null;try{const c=await((s=(l=navigator.storage)==null?void 0:l.estimate)==null?void 0:s.call(l));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,i=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i},F()}function D(t){if(t)return p.categories.find(e=>e.id===t)}function _e(t){const e=D(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function ze(t){return _e(t)}function We(t){const e=D(t);return e?e.pathIds.some(a=>{var n;return((n=D(a))==null?void 0:n.active)===!1}):!1}function Qe(t){const e=D(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=D(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function Je(t){return t.active&&!Qe(t)}function ht(t){return t==null?"":(t/100).toFixed(2)}function Et(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=Dt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function ee(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=D(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function ae(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const i=e.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function _(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function Ye(t){return t.active&&!t.archived}function ne(){const t=p.inventoryRecords.filter(Ye),e=p.categories.filter(r=>!r.isArchived),a=Fe(t,e),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=n.get(r.categoryId);if(i)for(const l of i.pathIds)o.set(l,(o.get(l)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function oe(t,e){const a=new Map;p.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const i=a.get(r.parentId)||[];i.push(r),a.set(r.parentId,i)});const n=new Map,o=r=>{const i=n.get(r);if(i!=null)return i;const l=D(r);if(!l||l.isArchived)return n.set(r,0),0;let s=0;return l.evaluationMode==="snapshot"?s=t.get(l.id)||0:l.evaluationMode==="spot"&&l.spotValueCents!=null?s=(e.get(l.id)||0)*l.spotValueCents:s=(a.get(l.id)||[]).reduce((f,u)=>f+o(u.id),0),n.set(r,s),s};return p.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function re(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>ze(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>C(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>C(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function Ke(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":C(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function ie(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function Xe(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function Ze(){const t=re(),e=Ke(),a=e.filter(u=>u.key==="name"||u.key==="parent"||u.key==="path"),n=e.filter(u=>u.key!=="name"&&u.key!=="parent"&&u.key!=="path"),o=ut(p.categories),r=xt(ie(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:l}=ne(),s=oe(i,l),c=[...a,{key:"computedQty",label:"Qty",getValue:u=>l.get(u.id)||0,getDisplay:u=>String(l.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:u=>i.get(u.id)||0,getDisplay:u=>C(i.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:u=>s.get(u.id)||0,getDisplay:u=>C(s.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:u=>u.active&&!u.isArchived,getDisplay:u=>u.active&&!u.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],f=xt(Xe(),p.filters,"categoriesList",c);return{inventoryColumns:t,categoryColumns:c,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:f,categoryTotals:i,categoryQty:l}}async function ta(){const t=A(),{categoryTotals:e,categoryQty:a}=ne(),n=oe(e,a),o=p.categories.filter(c=>c.active&&!c.isArchived),r=[];let i=0,l=0;for(const c of o){let f=null;const u=a.get(c.id)||0;if(c.evaluationMode==="spot"){if(c.spotValueCents==null){l+=1;continue}f=Math.round(u*c.spotValueCents)}else c.evaluationMode==="snapshot"?f=e.get(c.id)||0:f=n.get(c.id)||0;i+=f,r.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:c.id,evaluationMode:c.evaluationMode,valueCents:f,quantity:c.evaluationMode==="spot"?u:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!r.length){et({tone:"warning",text:"No markets were eligible for snapshot capture."});return}r.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:i,source:"manual",createdAt:t,updatedAt:t}),await xe(r),await T();const s=l>0?` (${l} skipped)`:"";et({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${C(i)}${s}`})}function Ut(t,e,a=""){const n=p.filters.filter(o=>o.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(o=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${d(o.label)}"
                  aria-label="Remove filter: ${d(o.label)}"
                  data-action="remove-filter"
                  data-filter-id="${o.id}"
                >${d(o.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function gt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const s=String(e.categoryId),c=We(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const s=e.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(s)}"><span class="filter-hit">${d(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const s=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(s)}"><span class="filter-hit">${d(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}</span></button>`}function ea(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function Gt(t,e){const a=t.map((n,o)=>{let r=0,i=!1;for(const s of e){const c=n.getValue(s);typeof c=="number"&&Number.isFinite(c)&&(r+=c,i=!0)}const l=i?String(n.key).toLowerCase().includes("cents")?C(r):ea(r):o===0?"Totals":"";return`<th class="${_(n)}">${d(l)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function at(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function aa(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function na(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?aa(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Ht(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function oa(t){const e=at(p.reportDateFrom),a=at(p.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],childRowsByParent:{},startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=na(t),o=new Map;for(const y of p.valuationSnapshots){if(y.scope!=="market"||!y.marketId)continue;const b=o.get(y.marketId)||[];b.push(y),o.set(y.marketId,b)}for(const y of o.values())y.sort((b,h)=>Date.parse(b.capturedAt)-Date.parse(h.capturedAt));const r=p.inventoryRecords.filter(y=>y.active&&!y.archived),i=[],l={};let s=0,c=0,f=0,u=0;const g=y=>{const b=D(y);if(!b)return null;const h=t.get(y)||new Set([y]),v=o.get(y)||[],M=Ht(v,e),w=Ht(v,a);let R=0;for(const G of r){if(!h.has(G.categoryId))continue;const m=at(G.purchaseDate);m!=null&&m>e&&m<=a&&(R+=G.totalPriceCents)}const q=M==null||w==null?null:w-M,J=q==null||M==null||M<=0?null:q/M;return{marketId:y,marketLabel:b.pathNames.join(" / "),startValueCents:M,endValueCents:w,contributionsCents:R,netGrowthCents:q,growthPct:J}};for(const y of n){const b=g(y);if(!b)continue;b.startValueCents!=null&&(s+=b.startValueCents),b.endValueCents!=null&&(c+=b.endValueCents),f+=b.contributionsCents,b.netGrowthCents!=null&&(u+=b.netGrowthCents),i.push(b);const h=p.categories.filter(v=>!v.isArchived&&v.active&&v.parentId===y).map(v=>g(v.id)).filter(v=>v!=null).sort((v,M)=>v.marketLabel.localeCompare(M.marketLabel));l[y]=h}return{scopeMarketIds:n,rows:i,childRowsByParent:l,startTotalCents:s,endTotalCents:c,contributionsTotalCents:f,netGrowthTotalCents:u}}function vt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function H(t){return t==null||!Number.isFinite(t)||t===0?"text-body-secondary":t>0?"text-success":"text-danger"}function ra(){if(x.kind==="none")return"";const t=X("currencySymbol")||Q,e=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(x.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((X("currencyCode")||ct).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Le.map(a=>`<option value="${d(a.value)}" ${(X("currencySymbol")||Q)===a.value?"selected":""}>${d(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${X("darkMode")??nt?"checked":""} />
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
    `;if(x.kind==="categoryCreate"||x.kind==="categoryEdit"){const a=x.kind==="categoryEdit",n=x.kind==="categoryEdit"?D(x.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Tt(p.categories,n.id)):void 0,r=ut(p.categories);return xt(ie(),p.filters,"inventoryTable",re(),{categoryDescendantsMap:r}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${d((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${d((n==null?void 0:n.name)||"")}" /></label>
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
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(ht(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${d((n==null?void 0:n.spotCode)||"")}"
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
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
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
    `;if(x.kind==="inventoryEdit"){const a=x,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${d(n.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${d(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${d(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${d(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(ht(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(ht(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${d(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function F(){const t=window.scrollX,e=window.scrollY,a=S.querySelector('details[data-section="data-tools"]');a&&(Ot=a.open);const n=S.querySelector('details[data-section="investments"]');n&&(jt=n.open),je(),Re();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:i,filteredInventoryRecords:l,filteredCategories:s}=Ze(),c=p.filters.some(m=>m.viewId==="categoriesList"),f=Oe(s,r,c),u=oa(i),g=new Set([...z].filter(m=>{var k;return(((k=u.childRowsByParent[m])==null?void 0:k.length)||0)>0}));g.size!==z.size&&(z=g);const y=u.startTotalCents>0?u.netGrowthTotalCents/u.startTotalCents:null,b=p.exportText||se(),h=l.map(m=>`
        <tr class="${[Je(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${o.map(I=>`<td class="${_(I)}">${gt("inventoryTable",m,I)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),v=new Set(s.map(m=>m.id)),M=new Map;for(const m of s){const k=m.parentId&&v.has(m.parentId)?m.parentId:null,I=M.get(k)||[];I.push(m),M.set(k,I)}for(const m of M.values())m.sort((k,I)=>k.sortOrder-I.sortOrder||k.name.localeCompare(I.name));const w=[],R=(m,k)=>{const I=M.get(m)||[];for(const $ of I)w.push({category:$,depth:k}),R($.id,k+1)};R(null,0);const q=w.map(({category:m,depth:k})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${r.map(I=>{if(I.key==="name"){const $=k>0?(k-1)*1.1:0;return`<td class="${_(I)}"><div class="market-name-wrap" style="padding-left:${$.toFixed(2)}rem">${k>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${gt("categoriesList",m,I)}</div></td>`}return`<td class="${_(I)}">${gt("categoriesList",m,I)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");S.innerHTML=`
    <div class="app-shell container-fluid py-3 py-lg-4">
      <header class="page-header mb-2">
        <div class="section-head">
          <div>
            <h1 class="display-6 mb-1">Investments</h1>
            <p class="text-body-secondary mb-0">Maintain your investments locally with fast filtering, category tracking, and clear totals.</p>
            <p class="small text-body-secondary mb-0">Viewport debug: ${d(Pe())}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
          </div>
        </div>
        ${tt?`<div class="alert alert-${tt.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(tt.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${u.scopeMarketIds.length?`${u.scopeMarketIds.length} market${u.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${d(p.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${d(p.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${u.rows.length===0?`
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
                  ${u.rows.map(m=>{const k=u.childRowsByParent[m.marketId]||[],I=z.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${k.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${I?"Collapse":"Expand"} child markets">${I?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d(C(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d(C(m.endValueCents))}</td>
                      <td class="text-end">${d(C(m.contributionsCents))}</td>
                      <td class="text-end ${H(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d(C(m.netGrowthCents))}</td>
                      <td class="text-end ${H(m.growthPct)}">${d(vt(m.growthPct))}</td>
                      </tr>
                      ${k.map($=>`
                            <tr class="growth-child-row" ${I?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d($.marketLabel)}</td>
                              <td class="text-end">${$.startValueCents==null?"—":d(C($.startValueCents))}</td>
                              <td class="text-end">${$.endValueCents==null?"—":d(C($.endValueCents))}</td>
                              <td class="text-end">${d(C($.contributionsCents))}</td>
                              <td class="text-end ${H($.netGrowthCents)}">${$.netGrowthCents==null?"—":d(C($.netGrowthCents))}</td>
                              <td class="text-end ${H($.growthPct)}">${d(vt($.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(C(u.startTotalCents))}</th>
                    <th class="text-end">${d(C(u.endTotalCents))}</th>
                    <th class="text-end">${d(C(u.contributionsTotalCents))}</th>
                    <th class="text-end ${H(u.netGrowthTotalCents)}">${d(C(u.netGrowthTotalCents))}</th>
                    <th class="text-end ${H(y)}">${d(vt(y))}</th>
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
        ${Ut("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(m=>`<th class="${_(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${q}
            </tbody>
            ${Gt(r,s)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${jt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0 visually-hidden">Investments</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end w-100">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Ut("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(m=>`<th class="${_(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${h}
              </tbody>
              ${Gt(o,l)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Ot?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?d(yt(p.storageUsageBytes)):`${d(yt(p.storageUsageBytes))} of ${d(yt(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${d(b)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${d(p.importText)}</textarea>
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
    ${ra()}
  `;const J=S.querySelector("#inventory-form");J&&(ee(J),Et(J));const G=S.querySelector("#category-form");G&&ae(G),Ve(),Ge(f),Mt(),window.scrollTo(t,e)}function ia(){return{schemaVersion:2,exportedAt:A(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function se(){return JSON.stringify(ia(),null,2)}function sa(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function la(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await W("currencyCode",a),await W("currencySymbol",n),await W("darkMode",o),U(),await T()}async function ca(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),l=String(e.get("spotValue")||"").trim(),s=String(e.get("spotCode")||"").trim(),c=e.get("active")==="on",f=i==="spot"||i==="snapshot"?i:void 0,u=f==="spot"&&l?Dt(l):void 0,g=f==="spot"&&s?s:void 0;if(!o)return;if(f==="spot"&&l&&u==null){alert("Spot value is invalid.");return}const y=u??void 0,b=r||null;if(b&&!D(b)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const w=await Qt(n);if(!w){alert("Market not found.");return}if(b===w.id){alert("A category cannot be its own parent.");return}if(b&&Tt(p.categories,w.id).includes(b)){alert("A category cannot be moved under its own subtree.");return}const R=w.parentId!==b;w.name=o,w.parentId=b,w.evaluationMode=f,w.spotValueCents=y,w.spotCode=g,w.active=c,R&&(w.sortOrder=p.categories.filter(q=>q.parentId===b&&q.id!==w.id).length),w.updatedAt=A(),await $t(w),U(),await T();return}const h=A(),v=p.categories.filter(w=>w.parentId===b).length,M={id:crypto.randomUUID(),name:o,parentId:b,pathIds:[],pathNames:[],depth:0,sortOrder:v,evaluationMode:f,spotValueCents:y,spotCode:g,active:c,isArchived:!1,createdAt:h,updatedAt:h};await $t(M),U(),await T()}async function da(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),l=Dt(String(e.get("totalPrice")||"")),s=String(e.get("categoryId")||""),c=e.get("active")==="on",f=String(e.get("notes")||"").trim();if(!o||!r||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!D(s)){alert("Select a valid category.");return}const u=Math.round(l/i);if(a==="edit"){if(!n)return;const b=await At(n);if(!b){alert("Inventory record not found.");return}b.purchaseDate=o,b.productName=r,b.quantity=i,b.totalPriceCents=l,b.unitPriceCents=u,b.unitPriceSource="derived",b.categoryId=s,b.active=c,b.notes=f||void 0,b.updatedAt=A(),await st(b),U(),await T();return}const g=A(),y={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:l,unitPriceCents:u,unitPriceSource:"derived",categoryId:s,active:c,archived:!1,notes:f||void 0,createdAt:g,updatedAt:g};await st(y),U(),await T()}async function ua(t,e){const a=await At(t);a&&(a.active=e,a.updatedAt=A(),await st(a),await T())}async function pa(t,e){const a=await At(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?A():void 0,a.updatedAt=A(),await st(a),await T()))}async function fa(t,e){const a=D(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Tt(p.categories,t),o=A();for(const r of n){const i=await Qt(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await $t(i))}await T()}function ma(t){const e=A();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ba(t){const e=A(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ya(t){const e=A(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function ha(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Yt(e.categories.map(ma)),n=new Set(a.map(s=>s.id)),o=e.purchases.map(ba);for(const s of o)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:ct},{key:"currencySymbol",value:Q},{key:"darkMode",value:nt}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(ya):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Me({purchases:o,categories:a,settings:r,valuationSnapshots:i}),N({importText:""}),await T()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function le(t){return t.target instanceof HTMLElement?t.target:null}function _t(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const i=(f,u)=>f.viewId===u.viewId&&f.field===u.field&&f.op===u.op&&f.value===u.value;let l=De(p.filters,{viewId:e,field:a,op:n,value:o,label:r});const s=t.dataset.crossInventoryCategoryId;if(s){const f=D(s);if(f){const u=l.find(g=>i(g,{viewId:e,field:a,op:n,value:o}));if(u){const g=`Market: ${f.pathNames.join(" / ")}`;l=l.filter(b=>b.linkedToFilterId!==u.id);const y=l.findIndex(b=>i(b,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id}));if(y>=0){const b=l[y];l=[...l.slice(0,y),{...b,label:g,linkedToFilterId:u.id},...l.slice(y+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id,label:g,linkedToFilterId:u.id}]}}}let c={filters:l};e==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(c.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(c.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(c.showArchivedCategories=!0),N(c)}function ce(){Z!=null&&(window.clearTimeout(Z),Z=null)}function ga(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&N({filters:Jt(p.filters,a.id)})}S.addEventListener("click",async t=>{const e=le(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(ce(),t.detail>1)return;Z=window.setTimeout(()=>{Z=null,_t(a)},220);return}_t(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;N({filters:Jt(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;N({filters:Ee(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){N({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){N({showArchivedCategories:a.checked});return}if(n==="open-create-category"){j({kind:"categoryCreate"});return}if(n==="open-create-inventory"){j({kind:"inventoryCreate"});return}if(n==="open-settings"){j({kind:"settings"});return}if(n==="apply-report-range"){const o=S.querySelector('input[name="reportDateFrom"]'),r=S.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,l=r.value,s=at(i),c=at(l,!0);if(s==null||c==null||s>c){et({tone:"warning",text:"Select a valid report date range."});return}N({reportDateFrom:i,reportDateTo:l});return}if(n==="reset-report-range"){N({reportDateFrom:Xt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await ta()}catch{et({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(z);r.has(o)?r.delete(o):r.add(o),z=r,F();return}if(n==="edit-category"){const o=a.dataset.id;o&&j({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&j({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;U();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await ua(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await pa(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await fa(o,r);return}if(n==="download-json"){sa(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,se(),"application/json");return}if(n==="replace-import"){await ha();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Te(),await T(),et({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Ae(),N({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await T();return}}});S.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(ce(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){j({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&j({kind:"categoryEdit",categoryId:o})}});S.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await la(e);return}if(e.id==="category-form"){await ca(e);return}if(e.id==="inventory-form"){await da(e);return}}});S.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Et(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});S.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(ee(r),Et(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&ae(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();N({importText:n})});S.addEventListener("pointermove",t=>{const e=le(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");lt=(a==null?void 0:a.dataset.filterSectionViewId)||null});S.addEventListener("pointerleave",()=>{lt=null});document.addEventListener("keydown",t=>{if(x.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!lt)return;t.preventDefault(),ga(lt);return}if(t.key==="Escape"){t.preventDefault(),U();return}if(t.key!=="Tab")return;const e=Zt();if(!e)return;const a=te(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});window.addEventListener("resize",()=>{rt!=null&&window.clearTimeout(rt),rt=window.setTimeout(()=>{rt=null,F()},120)});T();
