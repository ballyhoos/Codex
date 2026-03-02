(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const ot=(t,e)=>e.some(n=>t instanceof n);let yt,gt;function zt(){return yt||(yt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yt(){return gt||(gt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const rt=new WeakMap,Z=new WeakMap,W=new WeakMap;function Kt(t){const e=new Promise((n,a)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{n(N(t.result)),o()},i=()=>{a(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return W.set(e,t),e}function Zt(t){if(rt.has(t))return;const e=new Promise((n,a)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{n(),o()},i=()=>{a(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});rt.set(t,e)}let it={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return rt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return N(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Et(t){it=t(it)}function Xt(t){return Yt().includes(t)?function(...e){return t.apply(st(this),e),N(this.request)}:function(...e){return N(t.apply(st(this),e))}}function te(t){return typeof t=="function"?Xt(t):(t instanceof IDBTransaction&&Zt(t),ot(t,zt())?new Proxy(t,it):t)}function N(t){if(t instanceof IDBRequest)return Kt(t);if(Z.has(t))return Z.get(t);const e=te(t);return e!==t&&(Z.set(t,e),W.set(e,t)),e}const st=t=>W.get(t);function ee(t,e,{blocked:n,upgrade:a,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),l=N(i);return a&&i.addEventListener("upgradeneeded",s=>{a(N(i.result),s.oldVersion,s.newVersion,N(i.transaction),s)}),n&&i.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),l.then(s=>{r&&s.addEventListener("close",()=>r()),o&&s.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const ne=["get","getKey","getAll","getAllKeys","count"],ae=["put","add","delete","clear"],X=new Map;function vt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(X.get(e))return X.get(e);const n=e.replace(/FromIndex$/,""),a=e!==n,o=ae.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(o||ne.includes(n)))return;const r=async function(i,...l){const s=this.transaction(i,o?"readwrite":"readonly");let d=s.store;return a&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),o&&s.done]))[0]};return X.set(e,r),r}Et(t=>({...t,get:(e,n,a)=>vt(e,n)||t.get(e,n,a),has:(e,n)=>!!vt(e,n)||t.has(e,n)}));const oe=["continue","continuePrimaryKey","advance"],ht={},lt=new WeakMap,Nt=new WeakMap,re={get(t,e){if(!oe.includes(e))return t[e];let n=ht[e];return n||(n=ht[e]=function(...a){lt.set(this,Nt.get(this)[e](...a))}),n}};async function*ie(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const n=new Proxy(e,re);for(Nt.set(n,e),W.set(n,st(e));e;)yield n,e=await(lt.get(n)||e.continue()),lt.delete(n)}function wt(t,e){return e===Symbol.asyncIterator&&ot(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&ot(t,[IDBIndex,IDBObjectStore])}Et(t=>({...t,get(e,n,a){return wt(e,n)?ie:t.get(e,n,a)},has(e,n){return wt(e,n)||t.has(e,n)}}));const $=ee("investment_purchase_tracker",3,{async upgrade(t,e,n,a){const o=a,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?a.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let s=await r.openCursor();for(;s;)await i.put(s.value),s=await s.continue()}let l=t.objectStoreNames.contains("categories")?a.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(l=t.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const s=t.createObjectStore("valuationSnapshots",{keyPath:"id"});s.createIndex("by_capturedAt","capturedAt"),s.createIndex("by_scope","scope"),s.createIndex("by_marketId","marketId"),s.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let s=await i.openCursor();for(;s;){const d=s.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.archived!="boolean"&&(d.archived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}if(l){let s=await l.openCursor();for(;s;){const d=s.value;let c=!1;typeof d.active!="boolean"&&(d.active=!0,c=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,c=!0),c&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}}});async function se(){return(await $).getAll("inventory")}async function _(t){await(await $).put("inventory",t)}async function pt(t){return(await $).get("inventory",t)}async function le(){return(await $).getAll("categories")}async function ct(t){await(await $).put("categories",t)}async function Ft(t){return(await $).get("categories",t)}async function ce(){return(await $).getAll("settings")}async function Q(t,e){await(await $).put("settings",{key:t,value:e})}async function de(){return(await $).getAll("valuationSnapshots")}async function ue(t){if(!t.length)return;const n=(await $).transaction("valuationSnapshots","readwrite");for(const a of t)await n.store.put(a);await n.done}async function pe(t){const n=(await $).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await n.objectStore("inventory").clear(),await n.objectStore("categories").clear(),await n.objectStore("settings").clear(),await n.objectStore("valuationSnapshots").clear();for(const a of t.purchases)await n.objectStore("inventory").put(a);for(const a of t.categories)await n.objectStore("categories").put(a);for(const a of t.settings)await n.objectStore("settings").put(a);for(const a of t.valuationSnapshots||[])await n.objectStore("valuationSnapshots").put(a);await n.done}async function fe(){const e=(await $).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function me(){const e=(await $).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function It(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function be(t,e){return t.some(a=>a.viewId===e.viewId&&a.field===e.field&&a.op===e.op&&a.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Pt(t,e){const n=new Set([e]);let a=!0;for(;a;){a=!1;for(const o of t)o.linkedToFilterId&&n.has(o.linkedToFilterId)&&!n.has(o.id)&&(n.add(o.id),a=!0)}return t.filter(o=>!n.has(o.id))}function ye(t,e){return t.filter(n=>n.viewId!==e)}function dt(t,e,n,a,o){const r=e.filter(l=>l.viewId===n);if(!r.length)return t;const i=new Map(a.map(l=>[l.key,l]));return t.filter(l=>r.every(s=>{var m;const d=i.get(s.field);if(!d)return!0;const c=d.getValue(l);if(s.op==="eq")return String(c)===s.value;if(s.op==="isEmpty")return It(c);if(s.op==="isNotEmpty")return!It(c);if(s.op==="contains")return String(c).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const b=((m=o==null?void 0:o.categoryDescendantsMap)==null?void 0:m.get(s.value))||new Set([s.value]),f=String(c);return b.has(f)}return!0}))}function ge(t){const e=new Map(t.map(a=>[a.id,a])),n=new Map;for(const a of t){const o=n.get(a.parentId)||[];o.push(a),n.set(a.parentId,o)}return{byId:e,children:n}}function z(t){const{children:e}=ge(t),n=new Map;function a(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const l of a(i.id))r.add(l);return n.set(o,r),r}for(const o of t)n.has(o.id)||a(o.id);return n}function qt(t){const e=new Map(t.map(a=>[a.id,a]));function n(a){const o=[],r=[],i=new Set;let l=a;for(;l&&!i.has(l.id);)i.add(l.id),o.unshift(l.id),r.unshift(l.name),l=l.parentId?e.get(l.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(a=>{const o=n(a);return{...a,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function ft(t,e){return[...z(t).get(e)||new Set([e])]}function ve(t,e){const n=z(e),a=new Map;for(const o of e){const r=n.get(o.id)||new Set([o.id]);let i=0;for(const l of t)r.has(l.categoryId)&&(i+=l.totalPriceCents);a.set(o.id,i)}return a}const Lt=document.querySelector("#app");if(!Lt)throw new Error("#app not found");const w=Lt;let v={kind:"none"},V=null,D=null,T=null,tt=!1,et=null,O=null,G=null,St=!1,L=null,R=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:Vt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const J="USD",P="$",he=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function S(){return new Date().toISOString()}function Vt(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function nt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let n=t,a=0;for(;n>=1024&&a<e.length-1;)n/=1024,a+=1;return`${n>=10||a===0?n.toFixed(0):n.toFixed(1)} ${e[a]}`}function h(t){const e=H("currencySymbol")||P,n=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${n}`}function mt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const n=Number(e);return Number.isFinite(n)?Math.round(n*100):null}function H(t){var e;return(e=p.settings.find(n=>n.key===t))==null?void 0:e.value}function x(t){p={...p,...t},M()}function B(t){L!=null&&(window.clearTimeout(L),L=null),R=t,M(),t&&(L=window.setTimeout(()=>{L=null,R=null,M()},3500))}function E(t){v.kind==="none"&&document.activeElement instanceof HTMLElement&&(V=document.activeElement),v=t,M()}function F(){v.kind!=="none"&&(v={kind:"none"},M(),V&&V.isConnected&&V.focus(),V=null)}function jt(){return w.querySelector(".modal-panel")}function Ot(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function we(){if(v.kind==="none")return;const t=jt();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(Ot(t)[0]||t).focus()}function Ie(){var t,e;(t=D==null?void 0:D.destroy)==null||t.call(D),(e=T==null?void 0:T.destroy)==null||e.call(T),D=null,T=null}function ut(){var i;const t=window,e=t.DataTable,n=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!n){et==null&&(et=window.setTimeout(()=>{et=null,ut(),M()},500)),tt||(tt=!0,window.addEventListener("load",()=>{tt=!1,ut(),M()},{once:!0}));return}const a=w.querySelector("#categories-table"),o=w.querySelector("#inventory-table"),r=(l,s)=>{var d,c;return e?new e(l,s):n?((c=(d=n(l)).DataTable)==null?void 0:c.call(d,s))??null:null};a&&(D=r(a,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Ct(a,D)),o&&(T=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Ct(o,T))}function Ct(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",n=>{var m,b,f;const a=n.target,o=a==null?void 0:a.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),l=i.indexOf(o);if(l<0||l===i.length-1)return;n.preventDefault(),n.stopPropagation();const s=(m=e.order)==null?void 0:m.call(e),d=Array.isArray(s)?s[0]:void 0,c=d&&d[0]===l&&d[1]==="asc"?"desc":"asc";(b=e.order)==null||b.call(e,[[l,c]]),(f=e.draw)==null||f.call(e,!1)},!0)}async function C(){var l,s;const[t,e,n,a]=await Promise.all([se(),le(),ce(),de()]),o=qt(e).sort((d,c)=>d.sortOrder-c.sortOrder||d.name.localeCompare(c.name));n.some(d=>d.key==="currencyCode")||(await Q("currencyCode",J),n.push({key:"currencyCode",value:J})),n.some(d=>d.key==="currencySymbol")||(await Q("currencySymbol",P),n.push({key:"currencySymbol",value:P}));let r=null,i=null;try{const d=await((s=(l=navigator.storage)==null?void 0:l.estimate)==null?void 0:s.call(l));r=typeof(d==null?void 0:d.usage)=="number"?d.usage:null,i=typeof(d==null?void 0:d.quota)=="number"?d.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:t,categories:o,settings:n,valuationSnapshots:a,storageUsageBytes:r,storageQuotaBytes:i},M()}function k(t){if(t)return p.categories.find(e=>e.id===t)}function Se(t){const e=k(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function Ce(t){return Se(t)}function ke(t){const e=k(t);return e?e.pathIds.some(n=>{var a;return((a=k(n))==null?void 0:a.active)===!1}):!1}function $e(t){const e=k(t.categoryId);if(!e)return!1;for(const n of e.pathIds){const a=k(n);if((a==null?void 0:a.active)===!1)return!0}return!1}function xe(t){return t.active&&!$e(t)}function at(t){return t==null?"":(t/100).toFixed(2)}function bt(t){const e=t.querySelector('input[name="quantity"]'),n=t.querySelector('input[name="totalPrice"]'),a=t.querySelector('input[name="unitPrice"]');if(!e||!n||!a)return;const o=Number(e.value),r=mt(n.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){a.value="";return}a.value=(Math.round(r/o)/100).toFixed(2)}function Rt(t){const e=t.querySelector('select[name="categoryId"]'),n=t.querySelector("[data-quantity-group]"),a=t.querySelector('input[name="quantity"]');if(!e||!n||!a)return;const o=k(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";n.hidden=r,r?((!Number.isFinite(Number(a.value))||Number(a.value)<=0)&&(a.value="1"),a.readOnly=!0):a.readOnly=!1}function Bt(t){const e=t.querySelector('select[name="evaluationMode"]'),n=t.querySelector("[data-spot-value-group]"),a=t.querySelector('input[name="spotValue"]');if(!e||!n||!a)return;const o=e.value==="spot";n.hidden=!o,a.disabled=!o}function kt(t){var e;return t.parentId?((e=k(t.parentId))==null?void 0:e.name)||"(Unknown)":""}function j(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function Ae(t){return t.active&&!t.archived}function Ut(){const t=p.inventoryRecords.filter(Ae),e=p.categories.filter(r=>!r.isArchived),n=ve(t,e),a=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=a.get(r.categoryId);if(i)for(const l of i.pathIds)o.set(l,(o.get(l)||0)+r.quantity)}return{categoryTotals:n,categoryQty:o}}function Ht(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>Ce(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>h(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>h(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function De(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:t=>kt(t),getDisplay:t=>kt(t),filterable:!0,filterOp:"eq"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Value",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":h(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function _t(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function Te(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function Me(){const t=Ht(),e=De(),n=e.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),a=e.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),o=z(p.categories),r=dt(_t(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:l}=Ut(),s=[...n,{key:"computedQty",label:"Qty",getValue:c=>l.get(c.id)||0,getDisplay:c=>String(l.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>i.get(c.id)||0,getDisplay:c=>h(i.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...a,{key:"computedTotalCents",label:"Total",getValue:c=>c.evaluationMode==="snapshot"?i.get(c.id)||0:c.evaluationMode==="spot"&&c.spotValueCents!=null?(l.get(c.id)||0)*c.spotValueCents:"",getDisplay:c=>c.evaluationMode==="snapshot"?h(i.get(c.id)||0):c.evaluationMode==="spot"&&c.spotValueCents!=null?h((l.get(c.id)||0)*c.spotValueCents):"",filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],d=dt(Te(),p.filters,"categoriesList",s);return{inventoryColumns:t,categoryColumns:s,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:d,categoryTotals:i,categoryQty:l}}async function Ee(){const t=S(),{categoryTotals:e,categoryQty:n}=Ut(),a=p.categories.filter(s=>s.active&&!s.isArchived),o=[];let r=0,i=0;for(const s of a){let d=null;const c=n.get(s.id)||0;if(s.evaluationMode==="spot"){if(s.spotValueCents==null){i+=1;continue}d=Math.round(c*s.spotValueCents)}else if(s.evaluationMode==="snapshot")d=e.get(s.id)||0;else{i+=1;continue}r+=d,o.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:s.id,evaluationMode:s.evaluationMode,valueCents:d,quantity:s.evaluationMode==="spot"?c:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!o.length){B({tone:"warning",text:"No markets were eligible for snapshot capture."});return}o.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:r,source:"manual",createdAt:t,updatedAt:t}),await ue(o),await C();const l=i>0?` (${i} skipped)`:"";B({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${h(r)}${l}`})}function $t(t,e){const n=p.filters.filter(a=>a.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(a=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${u(a.label)}"
                  aria-label="Remove filter: ${u(a.label)}"
                  data-action="remove-filter"
                  data-filter-id="${a.id}"
                >${u(a.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
    </div>
  `}function xt(t,e,n){const a=n.getValue(e),o=n.getDisplay(e),r=a==null?"":String(a),i=n.align==="right"?"text-end":n.align==="center"?"text-center":"text-start";if(!n.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(n.key)}" data-op="isEmpty" data-value="" data-label="${u(`${n.label}: Empty`)}" title="Filter ${u(n.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&n.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const s=String(e.categoryId),d=ke(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${n.label}: ${o}`)}"><span class="filter-hit">${u(o)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&n.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const s=e.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${n.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(n.key==="name"||n.key==="path")&&typeof e=="object"&&e&&"id"in e){const s=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${n.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${n.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function Ne(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function At(t,e){const n=t.map((a,o)=>{let r=0,i=!1;for(const s of e){const d=a.getValue(s);typeof d=="number"&&Number.isFinite(d)&&(r+=d,i=!0)}const l=i?String(a.key).toLowerCase().includes("cents")?h(r):Ne(r):o===0?"Totals":"";return`<th class="${j(a)}">${u(l)}</th>`});return n.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${n.join("")}</tr></tfoot>`}function U(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function Fe(t,e){const n=[...t];return n.filter(o=>{for(const r of n){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function Pe(t){const e=new Set(p.filters.filter(a=>a.viewId==="categoriesList").map(a=>a.id)),n=new Set(p.filters.filter(a=>a.viewId==="inventoryTable"&&a.field==="categoryId"&&a.op==="inCategorySubtree"&&!!a.linkedToFilterId&&e.has(a.linkedToFilterId)).map(a=>a.value));return n.size>0?Fe(n,t):p.categories.filter(a=>!a.isArchived&&a.active&&a.parentId==null).map(a=>a.id)}function Dt(t,e){if(!t.length)return null;let n=null;for(const a of t){const o=Date.parse(a.capturedAt);if(Number.isFinite(o)){if(o<=e){n=a;continue}return n?n.valueCents:a.valueCents}}return n?n.valueCents:null}function qe(t){const e=U(p.reportDateFrom),n=U(p.reportDateTo,!0);if(e==null||n==null||e>n)return{scopeMarketIds:[],rows:[],startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const a=Pe(t),o=new Map;for(const m of p.valuationSnapshots){if(m.scope!=="market"||!m.marketId)continue;const b=o.get(m.marketId)||[];b.push(m),o.set(m.marketId,b)}for(const m of o.values())m.sort((b,f)=>Date.parse(b.capturedAt)-Date.parse(f.capturedAt));const r=p.inventoryRecords.filter(m=>m.active&&!m.archived),i=[];let l=0,s=0,d=0,c=0;for(const m of a){const b=k(m);if(!b)continue;const f=t.get(m)||new Set([m]),y=o.get(m)||[],I=Dt(y,e),g=Dt(y,n);let q=0;for(const Y of r){if(!f.has(Y.categoryId))continue;const K=U(Y.purchaseDate);K!=null&&K>e&&K<=n&&(q+=Y.totalPriceCents)}const A=I==null||g==null?null:g-I,Wt=A==null||I==null||I<=0?null:A/I;I!=null&&(l+=I),g!=null&&(s+=g),d+=q,A!=null&&(c+=A),i.push({marketId:m,marketLabel:b.pathNames.join(" / "),startValueCents:I,endValueCents:g,contributionsCents:q,netGrowthCents:A,growthPct:Wt})}return{scopeMarketIds:a,rows:i,startTotalCents:l,endTotalCents:s,contributionsTotalCents:d,netGrowthTotalCents:c}}function Tt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function Le(){if(v.kind==="none")return"";const t=H("currencySymbol")||P,e=(n,a)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(n!=null&&n.has(o.id))).map(o=>`<option value="${o.id}" ${a===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if(v.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((H("currencyCode")||J).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${he.map(n=>`<option value="${u(n.value)}" ${(H("currencySymbol")||P)===n.value?"selected":""}>${u(n.label)}</option>`).join("")}
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
    `;if(v.kind==="categoryCreate"||v.kind==="categoryEdit"){const n=v.kind==="categoryEdit",a=v.kind==="categoryEdit"?k(v.categoryId):void 0;if(n&&!a)return"";const o=n&&a?new Set(ft(p.categories,a.id)):void 0,r=z(p.categories);return dt(_t(),p.filters,"inventoryTable",Ht(),{categoryDescendantsMap:r}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${n?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${n?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${u((a==null?void 0:a.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${u((a==null?void 0:a.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${e(o,(a==null?void 0:a.parentId)||null)}
              </select>
            </label>
            <label class="form-label mb-0">Evaluation
              <select class="form-select" name="evaluationMode">
                <option value="" ${a!=null&&a.evaluationMode?"":"selected"}></option>
                <option value="spot" ${(a==null?void 0:a.evaluationMode)==="spot"?"selected":""}>Spot</option>
                <option value="snapshot" ${(a==null?void 0:a.evaluationMode)==="snapshot"?"selected":""}>Snapshot</option>
              </select>
            </label>
            <label class="form-label mb-0" data-spot-value-group ${(a==null?void 0:a.evaluationMode)==="spot"?"":"hidden"}>
              Value
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(at(a==null?void 0:a.spotValueCents))}" ${(a==null?void 0:a.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a?a.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            <div class="modal-footer px-0 pb-0">
              ${n&&a?`<button type="button" class="btn ${a.isArchived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${a.id}" data-next-archived="${String(!a.isArchived)}">${a.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${n?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(v.kind==="inventoryCreate")return`
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
    `;if(v.kind==="inventoryEdit"){const n=v,a=p.inventoryRecords.find(o=>o.id===n.inventoryId);return a?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${u(a.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(a.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e(void 0,a.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(a.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(at(a.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(at(a.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${u(a.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${a.archived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-inventory-archived" data-id="${a.id}" data-next-archived="${String(!a.archived)}">${a.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function M(){const t=w.querySelector("details.details-card");t&&(St=t.open),Ie();const{inventoryColumns:e,categoryColumns:n,categoryDescendantsMap:a,filteredInventoryRecords:o,filteredCategories:r}=Me(),i=qe(a),l=i.startTotalCents>0?i.netGrowthTotalCents/i.startTotalCents:null,s=p.exportText||Qt(),d=o.map(f=>`
        <tr class="${[xe(f)?"":"row-inactive",f.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${f.id}">
          ${e.map(I=>`<td class="${j(I)}">${xt("inventoryTable",f,I)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${f.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),c=r.map(f=>`
      <tr class="${[f.active?"":"row-inactive",f.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${f.id}">
        ${n.map(y=>`<td class="${j(y)}">${xt("categoriesList",f,y)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${f.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");w.innerHTML=`
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
        ${R?`<div class="alert alert-${R.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(R.text)}</div>`:""}
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
                  ${i.rows.map(f=>`
                    <tr>
                      <td>${u(f.marketLabel)}</td>
                      <td class="text-end">${f.startValueCents==null?"—":u(h(f.startValueCents))}</td>
                      <td class="text-end">${f.endValueCents==null?"—":u(h(f.endValueCents))}</td>
                      <td class="text-end">${u(h(f.contributionsCents))}</td>
                      <td class="text-end">${f.netGrowthCents==null?"—":u(h(f.netGrowthCents))}</td>
                      <td class="text-end">${u(Tt(f.growthPct))}</td>
                    </tr>
                  `).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(h(i.startTotalCents))}</th>
                    <th class="text-end">${u(h(i.endTotalCents))}</th>
                    <th class="text-end">${u(h(i.contributionsTotalCents))}</th>
                    <th class="text-end">${u(h(i.netGrowthTotalCents))}</th>
                    <th class="text-end">${u(Tt(l))}</th>
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
        ${$t("categoriesList","Markets")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${n.map(f=>`<th class="${j(f)}">${u(f.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${c}
            </tbody>
            ${At(n,r)}
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
          ${$t("inventoryTable","Investments")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${e.map(f=>`<th class="${j(f)}">${u(f.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${d}
              </tbody>
              ${At(e,o)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" ${St?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(nt(p.storageUsageBytes)):`${u(nt(p.storageUsageBytes))} of ${u(nt(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(s)}</textarea>
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
    ${Le()}
  `;const m=w.querySelector("#inventory-form");m&&(Rt(m),bt(m));const b=w.querySelector("#category-form");b&&Bt(b),we(),ut()}function Ve(){return{schemaVersion:2,exportedAt:S(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function Qt(){return JSON.stringify(Ve(),null,2)}function je(t,e,n){const a=new Blob([e],{type:n}),o=URL.createObjectURL(a),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function Oe(t){const e=new FormData(t),n=String(e.get("currencyCode")||"").trim().toUpperCase(),a=String(e.get("currencySymbol")||"").trim();if(!/^[A-Z]{3}$/.test(n)){alert("Currency code must be a 3-letter code like USD.");return}if(!a){alert("Select a currency symbol.");return}await Q("currencyCode",n),await Q("currencySymbol",a),F(),await C()}async function Re(t){const e=new FormData(t),n=String(e.get("mode")||"create"),a=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),l=String(e.get("spotValue")||"").trim(),s=e.get("active")==="on",d=i==="spot"||i==="snapshot"?i:void 0,c=d==="spot"&&l?mt(l):void 0;if(!o)return;if(d==="spot"&&l&&c==null){alert("Spot value is invalid.");return}const m=c??void 0,b=r||null;if(b&&!k(b)){alert("Select a valid parent market.");return}if(n==="edit"){if(!a)return;const g=await Ft(a);if(!g){alert("Market not found.");return}if(b===g.id){alert("A category cannot be its own parent.");return}if(b&&ft(p.categories,g.id).includes(b)){alert("A category cannot be moved under its own subtree.");return}const q=g.parentId!==b;g.name=o,g.parentId=b,g.evaluationMode=d,g.spotValueCents=m,g.active=s,q&&(g.sortOrder=p.categories.filter(A=>A.parentId===b&&A.id!==g.id).length),g.updatedAt=S(),await ct(g),F(),await C();return}const f=S(),y=p.categories.filter(g=>g.parentId===b).length,I={id:crypto.randomUUID(),name:o,parentId:b,pathIds:[],pathNames:[],depth:0,sortOrder:y,evaluationMode:d,spotValueCents:m,active:s,isArchived:!1,createdAt:f,updatedAt:f};await ct(I),F(),await C()}async function Be(t){const e=new FormData(t),n=String(e.get("mode")||"create"),a=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),l=mt(String(e.get("totalPrice")||"")),s=String(e.get("categoryId")||""),d=e.get("active")==="on",c=String(e.get("notes")||"").trim();if(!o||!r||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!k(s)){alert("Select a valid category.");return}const m=Math.round(l/i);if(n==="edit"){if(!a)return;const y=await pt(a);if(!y){alert("Inventory record not found.");return}y.purchaseDate=o,y.productName=r,y.quantity=i,y.totalPriceCents=l,y.unitPriceCents=m,y.unitPriceSource="derived",y.categoryId=s,y.active=d,y.notes=c||void 0,y.updatedAt=S(),await _(y),F(),await C();return}const b=S(),f={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:l,unitPriceCents:m,unitPriceSource:"derived",categoryId:s,active:d,archived:!1,notes:c||void 0,createdAt:b,updatedAt:b};await _(f),F(),await C()}async function Ue(t,e){const n=await pt(t);n&&(n.active=e,n.updatedAt=S(),await _(n),await C())}async function He(t,e){const n=await pt(t);n&&(e&&!window.confirm(`Archive inventory record "${n.productName}"?`)||(n.archived=e,e&&(n.active=!1),n.archivedAt=e?S():void 0,n.updatedAt=S(),await _(n),await C()))}async function _e(t,e){const n=k(t);if(e&&n&&!window.confirm(`Archive market subtree "${n.pathNames.join(" / ")}"?`))return;const a=ft(p.categories,t),o=S();for(const r of a){const i=await Ft(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await ct(i))}await C()}function Qe(t){const e=S();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Ge(t){const e=S(),n=Number(t.quantity),a=Number(t.totalPriceCents);if(!Number.isFinite(n)||n<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(a))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:n,totalPriceCents:a,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Je(t){const e=S(),n=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",a=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:n,marketId:n==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:a,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function We(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const n=qt(e.categories.map(Qe)),a=new Set(n.map(s=>s.id)),o=e.purchases.map(Ge);for(const s of o)if(!a.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:J},{key:"currencySymbol",value:P}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(Je):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await pe({purchases:o,categories:n,settings:r,valuationSnapshots:i}),x({importText:""}),await C()}catch(n){alert(n instanceof Error?n.message:"Import failed.")}}function Gt(t){return t.target instanceof HTMLElement?t.target:null}function Mt(t){const e=t.dataset.viewId,n=t.dataset.field,a=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!n||!a||o==null||!r)return;const i=(c,m)=>c.viewId===m.viewId&&c.field===m.field&&c.op===m.op&&c.value===m.value;let l=be(p.filters,{viewId:e,field:n,op:a,value:o,label:r});const s=t.dataset.crossInventoryCategoryId;if(s){const c=k(s);if(c){const m=l.find(b=>i(b,{viewId:e,field:n,op:a,value:o}));if(m){const b=`Market: ${c.pathNames.join(" / ")}`;l=l.filter(y=>y.linkedToFilterId!==m.id);const f=l.findIndex(y=>i(y,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id}));if(f>=0){const y=l[f];l=[...l.slice(0,f),{...y,label:b,linkedToFilterId:m.id},...l.slice(f+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id,label:b,linkedToFilterId:m.id}]}}}let d={filters:l};e==="inventoryTable"&&n==="archived"&&o==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),e==="categoriesList"&&(n==="isArchived"||n==="archived")&&o==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),e==="categoriesList"&&n==="active"&&o==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),x(d)}function Jt(){O!=null&&(window.clearTimeout(O),O=null)}function ze(t){const e=p.filters.filter(a=>a.viewId===t),n=e[e.length-1];n&&x({filters:Pt(p.filters,n.id)})}w.addEventListener("click",async t=>{const e=Gt(t);if(!e)return;const n=e.closest("[data-action]");if(!n)return;const a=n.dataset.action;if(a){if(a==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(Jt(),t.detail>1)return;O=window.setTimeout(()=>{O=null,Mt(n)},220);return}Mt(n);return}if(a==="remove-filter"){const o=n.dataset.filterId;if(!o)return;x({filters:Pt(p.filters,o)});return}if(a==="clear-filters"){const o=n.dataset.viewId;if(!o)return;x({filters:ye(p.filters,o)});return}if(a==="toggle-show-archived-inventory"){x({showArchivedInventory:n.checked});return}if(a==="toggle-show-archived-categories"){x({showArchivedCategories:n.checked});return}if(a==="open-create-category"){E({kind:"categoryCreate"});return}if(a==="open-create-inventory"){E({kind:"inventoryCreate"});return}if(a==="open-settings"){E({kind:"settings"});return}if(a==="apply-report-range"){const o=w.querySelector('input[name="reportDateFrom"]'),r=w.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,l=r.value,s=U(i),d=U(l,!0);if(s==null||d==null||s>d){B({tone:"warning",text:"Select a valid report date range."});return}x({reportDateFrom:i,reportDateTo:l});return}if(a==="reset-report-range"){x({reportDateFrom:Vt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(a==="capture-snapshot"){try{await Ee()}catch{B({tone:"danger",text:"Failed to capture snapshot."})}return}if(a==="edit-category"){const o=n.dataset.id;o&&E({kind:"categoryEdit",categoryId:o});return}if(a==="edit-inventory"){const o=n.dataset.id;o&&E({kind:"inventoryEdit",inventoryId:o});return}if(a==="close-modal"||a==="close-modal-backdrop"){if(a==="close-modal-backdrop"&&!e.classList.contains("modal"))return;F();return}if(a==="toggle-inventory-active"){const o=n.dataset.id,r=n.dataset.nextActive==="true";o&&await Ue(o,r);return}if(a==="toggle-inventory-archived"){const o=n.dataset.id,r=n.dataset.nextArchived==="true";o&&await He(o,r);return}if(a==="toggle-category-subtree-archived"){const o=n.dataset.id,r=n.dataset.nextArchived==="true";o&&await _e(o,r);return}if(a==="download-json"){je(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,Qt(),"application/json");return}if(a==="replace-import"){await We();return}if(a==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await me(),await C(),B({tone:"warning",text:"All valuation snapshots have been reset."});return}if(a==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await fe(),x({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await C();return}}});w.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(Jt(),e.closest("input, select, textarea, label")))return;const n=e.closest("button");if(n&&!n.classList.contains("link-cell")||e.closest("a"))return;const a=e.closest("tr[data-row-edit]");if(!a)return;const o=a.dataset.id,r=a.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){E({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&E({kind:"categoryEdit",categoryId:o})}});w.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await Oe(e);return}if(e.id==="category-form"){await Re(e);return}if(e.id==="inventory-form"){await Be(e);return}}});w.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const n=e.closest("form");n instanceof HTMLFormElement&&n.id==="inventory-form"&&bt(n)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});w.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(Rt(r),bt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&Bt(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const n=(o=e.files)==null?void 0:o[0];if(!n)return;const a=await n.text();x({importText:a})});w.addEventListener("pointermove",t=>{const e=Gt(t);if(!e)return;const n=e.closest("[data-filter-section-view-id]");G=(n==null?void 0:n.dataset.filterSectionViewId)||null});w.addEventListener("pointerleave",()=>{G=null});document.addEventListener("keydown",t=>{if(v.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!G)return;t.preventDefault(),ze(G);return}if(t.key==="Escape"){t.preventDefault(),F();return}if(t.key!=="Tab")return;const e=jt();if(!e)return;const n=Ot(e);if(!n.length){t.preventDefault(),e.focus();return}const a=n[0],o=n[n.length-1],r=document.activeElement;if(t.shiftKey){(r===a||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),a.focus())});C();
