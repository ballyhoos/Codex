(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const yt=(t,e)=>e.some(a=>t instanceof a);let At,Dt;function re(){return At||(At=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ie(){return Dt||(Dt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const gt=new WeakMap,lt=new WeakMap,it=new WeakMap;function se(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{a(B(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return it.set(e,t),e}function le(t){if(gt.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});gt.set(t,e)}let ht={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return gt.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return B(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Ut(t){ht=t(ht)}function ce(t){return ie().includes(t)?function(...e){return t.apply(vt(this),e),B(this.request)}:function(...e){return B(t.apply(vt(this),e))}}function de(t){return typeof t=="function"?ce(t):(t instanceof IDBTransaction&&le(t),yt(t,re())?new Proxy(t,ht):t)}function B(t){if(t instanceof IDBRequest)return se(t);if(lt.has(t))return lt.get(t);const e=de(t);return e!==t&&(lt.set(t,e),it.set(e,t)),e}const vt=t=>it.get(t);function ue(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),c=B(i);return n&&i.addEventListener("upgradeneeded",s=>{n(B(i.result),s.oldVersion,s.newVersion,B(i.transaction),s)}),a&&i.addEventListener("blocked",s=>a(s.oldVersion,s.newVersion,s)),c.then(s=>{r&&s.addEventListener("close",()=>r()),o&&s.addEventListener("versionchange",l=>o(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const pe=["get","getKey","getAll","getAllKeys","count"],fe=["put","add","delete","clear"],ct=new Map;function Tt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ct.get(e))return ct.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=fe.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||pe.includes(a)))return;const r=async function(i,...c){const s=this.transaction(i,o?"readwrite":"readonly");let l=s.store;return n&&(l=l.index(c.shift())),(await Promise.all([l[a](...c),o&&s.done]))[0]};return ct.set(e,r),r}Ut(t=>({...t,get:(e,a,n)=>Tt(e,a)||t.get(e,a,n),has:(e,a)=>!!Tt(e,a)||t.has(e,a)}));const me=["continue","continuePrimaryKey","advance"],Et={},wt=new WeakMap,Ht=new WeakMap,be={get(t,e){if(!me.includes(e))return t[e];let a=Et[e];return a||(a=Et[e]=function(...n){wt.set(this,Ht.get(this)[e](...n))}),a}};async function*ye(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,be);for(Ht.set(a,e),it.set(a,vt(e));e;)yield a,e=await(wt.get(a)||e.continue()),wt.delete(a)}function Nt(t,e){return e===Symbol.asyncIterator&&yt(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&yt(t,[IDBIndex,IDBObjectStore])}Ut(t=>({...t,get(e,a,n){return Nt(e,a)?ye:t.get(e,a,n)},has(e,a){return Nt(e,a)||t.has(e,a)}}));const T=ue("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let s=await r.openCursor();for(;s;)await i.put(s.value),s=await s.continue()}let c=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(c=t.createObjectStore("categories",{keyPath:"id"}),c.createIndex("by_parentId","parentId"),c.createIndex("by_name","name"),c.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const s=t.createObjectStore("valuationSnapshots",{keyPath:"id"});s.createIndex("by_capturedAt","capturedAt"),s.createIndex("by_scope","scope"),s.createIndex("by_marketId","marketId"),s.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let s=await i.openCursor();for(;s;){const l=s.value;let d=!1;typeof l.active!="boolean"&&(l.active=!0,d=!0),typeof l.archived!="boolean"&&(l.archived=!1,d=!0),d&&(l.updatedAt=new Date().toISOString(),await s.update(l)),s=await s.continue()}}if(c){let s=await c.openCursor();for(;s;){const l=s.value;let d=!1;typeof l.active!="boolean"&&(l.active=!0,d=!0),typeof l.isArchived!="boolean"&&(l.isArchived=!1,d=!0),d&&(l.updatedAt=new Date().toISOString(),await s.update(l)),s=await s.continue()}}}});async function ge(){return(await T).getAll("inventory")}async function nt(t){await(await T).put("inventory",t)}async function kt(t){return(await T).get("inventory",t)}async function he(){return(await T).getAll("categories")}async function St(t){await(await T).put("categories",t)}async function _t(t){return(await T).get("categories",t)}async function ve(){return(await T).getAll("settings")}async function G(t,e){await(await T).put("settings",{key:t,value:e})}async function we(){return(await T).getAll("valuationSnapshots")}async function Se(t){if(!t.length)return;const a=(await T).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function Ce(t){const a=(await T).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Ie(){const e=(await T).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function ke(){const e=(await T).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function Ft(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function $e(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Gt(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function xe(t,e){return t.filter(a=>a.viewId!==e)}function Ct(t,e,a,n,o){const r=e.filter(c=>c.viewId===a);if(!r.length)return t;const i=new Map(n.map(c=>[c.key,c]));return t.filter(c=>r.every(s=>{var g;const l=i.get(s.field);if(!l)return!0;const d=l.getValue(c);if(s.op==="eq")return String(d)===s.value;if(s.op==="isEmpty")return Ft(d);if(s.op==="isNotEmpty")return!Ft(d);if(s.op==="contains")return String(d).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const w=((g=o==null?void 0:o.categoryDescendantsMap)==null?void 0:g.get(s.value))||new Set([s.value]),b=String(d);return w.has(b)}return!0}))}function Me(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function st(t){const{children:e}=Me(t),a=new Map;function n(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const c of n(i.id))r.add(c);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function zt(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let c=n;for(;c&&!i.has(c.id);)i.add(c.id),o.unshift(c.id),r.unshift(c.name),c=c.parentId?e.get(c.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function $t(t,e){return[...st(t).get(e)||new Set([e])]}function Ae(t,e){const a=st(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const c of t)r.has(c.categoryId)&&(i+=c.totalPriceCents);n.set(o.id,i)}return n}const Wt=document.querySelector("#app");if(!Wt)throw new Error("#app not found");const I=Wt;let $={kind:"none"},Q=null,O=null,R=null,L=null,P=null,Lt=!1,et=null,dt=!1,ut=null,K=null,ot=null,Pt=!1,qt=!1,_=new Set,W=null,Y=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:Qt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const rt="USD",z="$",tt=!1,De=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function A(){return new Date().toISOString()}function Qt(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function pt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function C(t){const e=J("currencySymbol")||z,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function xt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function J(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function Te(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:tt;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function N(t){p={...p,...t},q()}function Z(t){W!=null&&(window.clearTimeout(W),W=null),Y=t,q(),t&&(W=window.setTimeout(()=>{W=null,Y=null,q()},3500))}function j(t){$.kind==="none"&&document.activeElement instanceof HTMLElement&&(Q=document.activeElement),$=t,q()}function U(){$.kind!=="none"&&($={kind:"none"},q(),Q&&Q.isConnected&&Q.focus(),Q=null)}function Jt(){return I.querySelector(".modal-panel")}function Kt(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function Ee(){if($.kind==="none")return;const t=Jt();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(Kt(t)[0]||t).focus()}function Ne(){var t,e;(t=O==null?void 0:O.destroy)==null||t.call(O),(e=R==null?void 0:R.destroy)==null||e.call(R),O=null,R=null}function It(){var i;const t=window,e=t.DataTable,a=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!a){ut==null&&(ut=window.setTimeout(()=>{ut=null,It(),q()},500)),dt||(dt=!0,window.addEventListener("load",()=>{dt=!1,It(),q()},{once:!0}));return}const n=I.querySelector("#categories-table"),o=I.querySelector("#inventory-table"),r=(c,s)=>{var l,d;return e?new e(c,s):a?((d=(l=a(c)).DataTable)==null?void 0:d.call(l,s))??null:null};n&&(O=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(R=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Re(o,R))}function Fe(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function at(t,e){const a=I.querySelector(`#${t}`),n=I.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Vt(t){const e=I.querySelector(`#${t}`),a=I.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Le(){L==null||L.dispose(),P==null||P.dispose(),L=null,P=null}function Pe(){Lt||(Lt=!0,window.addEventListener("resize",()=>{et!=null&&window.clearTimeout(et),et=window.setTimeout(()=>{et=null,L==null||L.resize(),P==null||P.resize()},120)}))}function qe(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function Ve(t){const e="markets-allocation-chart",a="markets-top-chart",n=I.querySelector(`#${e}`),o=I.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){at(e,"Chart unavailable: ECharts not loaded."),at(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){at(e,"No eligible market totals to chart."),at(a,"No eligible market totals to chart.");return}Vt(e),Vt(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",c=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],s=i?"#e9ecef":"#212529",l=i?"#ced4da":"#495057",d=t.map(y=>({name:y.label,value:y.totalCents})),g=t.slice(0,5),w=[...g].reverse(),b=g.reduce((y,h)=>Math.max(y,h.totalCents),0),f=b>0?Math.ceil(b*1.2):1;L=window.echarts.init(n),P=window.echarts.init(o),L.setOption({color:c,tooltip:{trigger:"item",formatter:y=>`${u(y.name)}: ${C(y.value)} (${y.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:d,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:10,textBorderWidth:0,formatter:y=>{const h=y.percent??0;return`${Math.round(h)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:l,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),P.setOption({color:["#198754"],grid:{left:"4%",right:"6%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:y=>{const h=y[0];return h?`${u(h.name)}: ${C(h.value)}`:""}},xAxis:{type:"value",max:f,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:w.map(y=>y.label),axisLabel:{color:l,formatter:y=>qe(y)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:w.map(y=>y.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:s,formatter:y=>C(y.value)}}]}),Pe()}function Re(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var g,w,b;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),c=i.indexOf(o);if(c<0||c===i.length-1)return;a.preventDefault(),a.stopPropagation();const s=(g=e.order)==null?void 0:g.call(e),l=Array.isArray(s)?s[0]:void 0,d=l&&l[0]===c&&l[1]==="asc"?"desc":"asc";(w=e.order)==null||w.call(e,[[c,d]]),(b=e.draw)==null||b.call(e,!1)},!0)}async function D(){var c,s;const[t,e,a,n]=await Promise.all([ge(),he(),ve(),we()]),o=zt(e).sort((l,d)=>l.sortOrder-d.sortOrder||l.name.localeCompare(d.name));a.some(l=>l.key==="currencyCode")||(await G("currencyCode",rt),a.push({key:"currencyCode",value:rt})),a.some(l=>l.key==="currencySymbol")||(await G("currencySymbol",z),a.push({key:"currencySymbol",value:z})),a.some(l=>l.key==="darkMode")||(await G("darkMode",tt),a.push({key:"darkMode",value:tt})),Te(a);let r=null,i=null;try{const l=await((s=(c=navigator.storage)==null?void 0:c.estimate)==null?void 0:s.call(c));r=typeof(l==null?void 0:l.usage)=="number"?l.usage:null,i=typeof(l==null?void 0:l.quota)=="number"?l.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i},q()}function E(t){if(t)return p.categories.find(e=>e.id===t)}function Oe(t){const e=E(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function je(t){return Oe(t)}function Be(t){const e=E(t);return e?e.pathIds.some(a=>{var n;return((n=E(a))==null?void 0:n.active)===!1}):!1}function Ue(t){const e=E(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=E(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function He(t){return t.active&&!Ue(t)}function ft(t){return t==null?"":(t/100).toFixed(2)}function Mt(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=xt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function Yt(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=E(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function Zt(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const i=e.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function H(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function _e(t){return t.active&&!t.archived}function Xt(){const t=p.inventoryRecords.filter(_e),e=p.categories.filter(r=>!r.isArchived),a=Ae(t,e),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=n.get(r.categoryId);if(i)for(const c of i.pathIds)o.set(c,(o.get(c)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function te(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>je(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>C(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>C(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function Ge(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":C(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function ee(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function ze(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function We(){const t=te(),e=Ge(),a=e.filter(d=>d.key==="name"||d.key==="parent"||d.key==="path"),n=e.filter(d=>d.key!=="name"&&d.key!=="parent"&&d.key!=="path"),o=st(p.categories),r=Ct(ee(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:c}=Xt(),s=[...a,{key:"computedQty",label:"Qty",getValue:d=>c.get(d.id)||0,getDisplay:d=>String(c.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:d=>i.get(d.id)||0,getDisplay:d=>C(i.get(d.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:d=>d.evaluationMode==="snapshot"?i.get(d.id)||0:d.evaluationMode==="spot"&&d.spotValueCents!=null?(c.get(d.id)||0)*d.spotValueCents:"",getDisplay:d=>d.evaluationMode==="snapshot"?C(i.get(d.id)||0):d.evaluationMode==="spot"&&d.spotValueCents!=null?C((c.get(d.id)||0)*d.spotValueCents):"",filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:d=>d.active&&!d.isArchived,getDisplay:d=>d.active&&!d.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],l=Ct(ze(),p.filters,"categoriesList",s);return{inventoryColumns:t,categoryColumns:s,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:l,categoryTotals:i,categoryQty:c}}async function Qe(){const t=A(),{categoryTotals:e,categoryQty:a}=Xt(),n=p.categories.filter(s=>s.active&&!s.isArchived),o=[];let r=0,i=0;for(const s of n){let l=null;const d=a.get(s.id)||0;if(s.evaluationMode==="spot"){if(s.spotValueCents==null){i+=1;continue}l=Math.round(d*s.spotValueCents)}else if(s.evaluationMode==="snapshot")l=e.get(s.id)||0;else{i+=1;continue}r+=l,o.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:s.id,evaluationMode:s.evaluationMode,valueCents:l,quantity:s.evaluationMode==="spot"?d:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!o.length){Z({tone:"warning",text:"No markets were eligible for snapshot capture."});return}o.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:r,source:"manual",createdAt:t,updatedAt:t}),await Se(o),await D();const c=i>0?` (${i} skipped)`:"";Z({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${C(r)}${c}`})}function Rt(t,e,a=""){const n=p.filters.filter(o=>o.viewId===t);return`
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
  `}function mt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const s=String(e.categoryId),l=Be(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}${l?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const s=e.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const s=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function Je(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function Ot(t,e){const a=t.map((n,o)=>{let r=0,i=!1;for(const s of e){const l=n.getValue(s);typeof l=="number"&&Number.isFinite(l)&&(r+=l,i=!0)}const c=i?String(n.key).toLowerCase().includes("cents")?C(r):Je(r):o===0?"Totals":"";return`<th class="${H(n)}">${u(c)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function X(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function Ke(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function Ye(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?Ke(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function jt(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function Ze(t){const e=X(p.reportDateFrom),a=X(p.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],childRowsByParent:{},startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=Ye(t),o=new Map;for(const b of p.valuationSnapshots){if(b.scope!=="market"||!b.marketId)continue;const f=o.get(b.marketId)||[];f.push(b),o.set(b.marketId,f)}for(const b of o.values())b.sort((f,y)=>Date.parse(f.capturedAt)-Date.parse(y.capturedAt));const r=p.inventoryRecords.filter(b=>b.active&&!b.archived),i=[],c={};let s=0,l=0,d=0,g=0;const w=b=>{const f=E(b);if(!f)return null;const y=t.get(b)||new Set([b]),h=o.get(b)||[],M=jt(h,e),k=jt(h,a);let V=0;for(const S of r){if(!y.has(S.categoryId))continue;const v=X(S.purchaseDate);v!=null&&v>e&&v<=a&&(V+=S.totalPriceCents)}const F=M==null||k==null?null:k-M,m=F==null||M==null||M<=0?null:F/M;return{marketId:b,marketLabel:f.pathNames.join(" / "),startValueCents:M,endValueCents:k,contributionsCents:V,netGrowthCents:F,growthPct:m}};for(const b of n){const f=w(b);if(!f)continue;f.startValueCents!=null&&(s+=f.startValueCents),f.endValueCents!=null&&(l+=f.endValueCents),d+=f.contributionsCents,f.netGrowthCents!=null&&(g+=f.netGrowthCents),i.push(f);const y=p.categories.filter(h=>!h.isArchived&&h.active&&h.parentId===b).map(h=>w(h.id)).filter(h=>h!=null).sort((h,M)=>h.marketLabel.localeCompare(M.marketLabel));c[b]=y}return{scopeMarketIds:n,rows:i,childRowsByParent:c,startTotalCents:s,endTotalCents:l,contributionsTotalCents:d,netGrowthTotalCents:g}}function bt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function Xe(){if($.kind==="none")return"";const t=J("currencySymbol")||z,e=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if($.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((J("currencyCode")||rt).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${De.map(a=>`<option value="${u(a.value)}" ${(J("currencySymbol")||z)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${J("darkMode")??tt?"checked":""} />
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
    `;if($.kind==="categoryCreate"||$.kind==="categoryEdit"){const a=$.kind==="categoryEdit",n=$.kind==="categoryEdit"?E($.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set($t(p.categories,n.id)):void 0,r=st(p.categories);return Ct(ee(),p.filters,"inventoryTable",te(),{categoryDescendantsMap:r}),`
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(ft(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if($.kind==="inventoryCreate")return`
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
    `;if($.kind==="inventoryEdit"){const a=$,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(ft(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(ft(n.unitPriceCents))}" disabled />
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
    `:""}return""}function q(){const t=I.querySelector('details[data-section="data-tools"]');t&&(Pt=t.open);const e=I.querySelector('details[data-section="investments"]');e&&(qt=e.open),Le(),Ne();const{inventoryColumns:a,categoryColumns:n,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:i}=We(),c=p.filters.some(m=>m.viewId==="categoriesList"),s=Fe(i,n,c),l=Ze(o),d=new Set([..._].filter(m=>{var S;return(((S=l.childRowsByParent[m])==null?void 0:S.length)||0)>0}));d.size!==_.size&&(_=d);const g=l.startTotalCents>0?l.netGrowthTotalCents/l.startTotalCents:null,w=p.exportText||ae(),b=r.map(m=>`
        <tr class="${[He(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${a.map(v=>`<td class="${H(v)}">${mt("inventoryTable",m,v)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),f=new Set(i.map(m=>m.id)),y=new Map;for(const m of i){const S=m.parentId&&f.has(m.parentId)?m.parentId:null,v=y.get(S)||[];v.push(m),y.set(S,v)}for(const m of y.values())m.sort((S,v)=>S.sortOrder-v.sortOrder||S.name.localeCompare(v.name));const h=[],M=(m,S)=>{const v=y.get(m)||[];for(const x of v)h.push({category:x,depth:S}),M(x.id,S+1)};M(null,0);const k=h.map(({category:m,depth:S})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${n.map(v=>{if(v.key==="name"){const x=S>0?(S-1)*1.1:0;return`<td class="${H(v)}"><div class="market-name-wrap" style="padding-left:${x.toFixed(2)}rem">${S>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${mt("categoriesList",m,v)}</div></td>`}return`<td class="${H(v)}">${mt("categoriesList",m,v)}</td>`}).join("")}
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
        ${Y?`<div class="alert alert-${Y.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(Y.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${l.scopeMarketIds.length?`${l.scopeMarketIds.length} market${l.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
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
          ${l.rows.length===0?`
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
                  ${l.rows.map(m=>{const S=l.childRowsByParent[m.marketId]||[],v=_.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${S.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${u(m.marketId)}" aria-label="${v?"Collapse":"Expand"} child markets">${v?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${u(m.marketLabel)}
                        </td>
                        <td class="text-end">${m.startValueCents==null?"—":u(C(m.startValueCents))}</td>
                        <td class="text-end">${m.endValueCents==null?"—":u(C(m.endValueCents))}</td>
                        <td class="text-end">${u(C(m.contributionsCents))}</td>
                        <td class="text-end">${m.netGrowthCents==null?"—":u(C(m.netGrowthCents))}</td>
                        <td class="text-end">${u(bt(m.growthPct))}</td>
                      </tr>
                      ${S.map(x=>`
                            <tr class="growth-child-row" ${v?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${u(x.marketLabel)}</td>
                              <td class="text-end">${x.startValueCents==null?"—":u(C(x.startValueCents))}</td>
                              <td class="text-end">${x.endValueCents==null?"—":u(C(x.endValueCents))}</td>
                              <td class="text-end">${u(C(x.contributionsCents))}</td>
                              <td class="text-end">${x.netGrowthCents==null?"—":u(C(x.netGrowthCents))}</td>
                              <td class="text-end">${u(bt(x.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(C(l.startTotalCents))}</th>
                    <th class="text-end">${u(C(l.endTotalCents))}</th>
                    <th class="text-end">${u(C(l.contributionsTotalCents))}</th>
                    <th class="text-end">${u(C(l.netGrowthTotalCents))}</th>
                    <th class="text-end">${u(bt(g))}</th>
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
        ${Rt("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${n.map(m=>`<th class="${H(m)}">${u(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${k}
            </tbody>
            ${Ot(n,i)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${qt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0 visually-hidden">Investments</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end w-100">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Rt("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${a.map(m=>`<th class="${H(m)}">${u(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${b}
              </tbody>
              ${Ot(a,r)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Pt?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(pt(p.storageUsageBytes)):`${u(pt(p.storageUsageBytes))} of ${u(pt(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(w)}</textarea>
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
    ${Xe()}
  `;const V=I.querySelector("#inventory-form");V&&(Yt(V),Mt(V));const F=I.querySelector("#category-form");F&&Zt(F),Ee(),Ve(s),It()}function ta(){return{schemaVersion:2,exportedAt:A(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function ae(){return JSON.stringify(ta(),null,2)}function ea(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function aa(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await G("currencyCode",a),await G("currencySymbol",n),await G("darkMode",o),U(),await D()}async function na(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),c=String(e.get("spotValue")||"").trim(),s=String(e.get("spotCode")||"").trim(),l=e.get("active")==="on",d=i==="spot"||i==="snapshot"?i:void 0,g=d==="spot"&&c?xt(c):void 0,w=d==="spot"&&s?s:void 0;if(!o)return;if(d==="spot"&&c&&g==null){alert("Spot value is invalid.");return}const b=g??void 0,f=r||null;if(f&&!E(f)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const k=await _t(n);if(!k){alert("Market not found.");return}if(f===k.id){alert("A category cannot be its own parent.");return}if(f&&$t(p.categories,k.id).includes(f)){alert("A category cannot be moved under its own subtree.");return}const V=k.parentId!==f;k.name=o,k.parentId=f,k.evaluationMode=d,k.spotValueCents=b,k.spotCode=w,k.active=l,V&&(k.sortOrder=p.categories.filter(F=>F.parentId===f&&F.id!==k.id).length),k.updatedAt=A(),await St(k),U(),await D();return}const y=A(),h=p.categories.filter(k=>k.parentId===f).length,M={id:crypto.randomUUID(),name:o,parentId:f,pathIds:[],pathNames:[],depth:0,sortOrder:h,evaluationMode:d,spotValueCents:b,spotCode:w,active:l,isArchived:!1,createdAt:y,updatedAt:y};await St(M),U(),await D()}async function oa(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),c=xt(String(e.get("totalPrice")||"")),s=String(e.get("categoryId")||""),l=e.get("active")==="on",d=String(e.get("notes")||"").trim();if(!o||!r||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(c==null||c<0){alert("Total price is invalid.");return}if(!E(s)){alert("Select a valid category.");return}const g=Math.round(c/i);if(a==="edit"){if(!n)return;const f=await kt(n);if(!f){alert("Inventory record not found.");return}f.purchaseDate=o,f.productName=r,f.quantity=i,f.totalPriceCents=c,f.unitPriceCents=g,f.unitPriceSource="derived",f.categoryId=s,f.active=l,f.notes=d||void 0,f.updatedAt=A(),await nt(f),U(),await D();return}const w=A(),b={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:c,unitPriceCents:g,unitPriceSource:"derived",categoryId:s,active:l,archived:!1,notes:d||void 0,createdAt:w,updatedAt:w};await nt(b),U(),await D()}async function ra(t,e){const a=await kt(t);a&&(a.active=e,a.updatedAt=A(),await nt(a),await D())}async function ia(t,e){const a=await kt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?A():void 0,a.updatedAt=A(),await nt(a),await D()))}async function sa(t,e){const a=E(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=$t(p.categories,t),o=A();for(const r of n){const i=await _t(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await St(i))}await D()}function la(t){const e=A();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function ca(t){const e=A(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function da(t){const e=A(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function ua(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=zt(e.categories.map(la)),n=new Set(a.map(s=>s.id)),o=e.purchases.map(ca);for(const s of o)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:rt},{key:"currencySymbol",value:z},{key:"darkMode",value:tt}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(da):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ce({purchases:o,categories:a,settings:r,valuationSnapshots:i}),N({importText:""}),await D()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ne(t){return t.target instanceof HTMLElement?t.target:null}function Bt(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const i=(d,g)=>d.viewId===g.viewId&&d.field===g.field&&d.op===g.op&&d.value===g.value;let c=$e(p.filters,{viewId:e,field:a,op:n,value:o,label:r});const s=t.dataset.crossInventoryCategoryId;if(s){const d=E(s);if(d){const g=c.find(w=>i(w,{viewId:e,field:a,op:n,value:o}));if(g){const w=`Market: ${d.pathNames.join(" / ")}`;c=c.filter(f=>f.linkedToFilterId!==g.id);const b=c.findIndex(f=>i(f,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:d.id}));if(b>=0){const f=c[b];c=[...c.slice(0,b),{...f,label:w,linkedToFilterId:g.id},...c.slice(b+1)]}else c=[...c,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:d.id,label:w,linkedToFilterId:g.id}]}}}let l={filters:c};e==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(l.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(l.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(l.showArchivedCategories=!0),N(l)}function oe(){K!=null&&(window.clearTimeout(K),K=null)}function pa(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&N({filters:Gt(p.filters,a.id)})}I.addEventListener("click",async t=>{const e=ne(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(oe(),t.detail>1)return;K=window.setTimeout(()=>{K=null,Bt(a)},220);return}Bt(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;N({filters:Gt(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;N({filters:xe(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){N({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){N({showArchivedCategories:a.checked});return}if(n==="open-create-category"){j({kind:"categoryCreate"});return}if(n==="open-create-inventory"){j({kind:"inventoryCreate"});return}if(n==="open-settings"){j({kind:"settings"});return}if(n==="apply-report-range"){const o=I.querySelector('input[name="reportDateFrom"]'),r=I.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,c=r.value,s=X(i),l=X(c,!0);if(s==null||l==null||s>l){Z({tone:"warning",text:"Select a valid report date range."});return}N({reportDateFrom:i,reportDateTo:c});return}if(n==="reset-report-range"){N({reportDateFrom:Qt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await Qe()}catch{Z({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(_);r.has(o)?r.delete(o):r.add(o),_=r,q();return}if(n==="edit-category"){const o=a.dataset.id;o&&j({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&j({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;U();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await ra(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await ia(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await sa(o,r);return}if(n==="download-json"){ea(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ae(),"application/json");return}if(n==="replace-import"){await ua();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await ke(),await D(),Z({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Ie(),N({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await D();return}}});I.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(oe(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){j({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&j({kind:"categoryEdit",categoryId:o})}});I.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await aa(e);return}if(e.id==="category-form"){await na(e);return}if(e.id==="inventory-form"){await oa(e);return}}});I.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Mt(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});I.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(Yt(r),Mt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&Zt(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();N({importText:n})});I.addEventListener("pointermove",t=>{const e=ne(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");ot=(a==null?void 0:a.dataset.filterSectionViewId)||null});I.addEventListener("pointerleave",()=>{ot=null});document.addEventListener("keydown",t=>{if($.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!ot)return;t.preventDefault(),pa(ot);return}if(t.key==="Escape"){t.preventDefault(),U();return}if(t.key!=="Tab")return;const e=Jt();if(!e)return;const a=Kt(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});D();
