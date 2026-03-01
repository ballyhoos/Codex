(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const z=(e,t)=>t.some(n=>e instanceof n);let le,ce;function Oe(){return le||(le=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function qe(){return ce||(ce=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const G=new WeakMap,_=new WeakMap,U=new WeakMap;function Ve(e){const t=new Promise((n,a)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",o)},i=()=>{n(D(e.result)),r()},o=()=>{a(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",o)});return U.set(t,e),t}function Re(e){if(G.has(e))return;const t=new Promise((n,a)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",o),e.removeEventListener("abort",o)},i=()=>{n(),r()},o=()=>{a(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",o),e.addEventListener("abort",o)});G.set(e,t)}let Z={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return G.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return D(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ie(e){Z=e(Z)}function Be(e){return qe().includes(e)?function(...t){return e.apply(X(this),t),D(this.request)}:function(...t){return D(e.apply(X(this),t))}}function Ue(e){return typeof e=="function"?Be(e):(e instanceof IDBTransaction&&Re(e),z(e,Oe())?new Proxy(e,Z):e)}function D(e){if(e instanceof IDBRequest)return Ve(e);if(_.has(e))return _.get(e);const t=Ue(e);return t!==e&&(_.set(e,t),U.set(t,e)),t}const X=e=>U.get(e);function He(e,t,{blocked:n,upgrade:a,blocking:r,terminated:i}={}){const o=indexedDB.open(e,t),l=D(o);return a&&o.addEventListener("upgradeneeded",s=>{a(D(o.result),s.oldVersion,s.newVersion,D(o.transaction),s)}),n&&o.addEventListener("blocked",s=>n(s.oldVersion,s.newVersion,s)),l.then(s=>{i&&s.addEventListener("close",()=>i()),r&&s.addEventListener("versionchange",d=>r(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const _e=["get","getKey","getAll","getAllKeys","count"],Qe=["put","add","delete","clear"],Q=new Map;function de(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Q.get(t))return Q.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,r=Qe.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(r||_e.includes(n)))return;const i=async function(o,...l){const s=this.transaction(o,r?"readwrite":"readonly");let d=s.store;return a&&(d=d.index(l.shift())),(await Promise.all([d[n](...l),r&&s.done]))[0]};return Q.set(t,i),i}Ie(e=>({...e,get:(t,n,a)=>de(t,n)||e.get(t,n,a),has:(t,n)=>!!de(t,n)||e.has(t,n)}));const Je=["continue","continuePrimaryKey","advance"],ue={},ee=new WeakMap,Se=new WeakMap,We={get(e,t){if(!Je.includes(t))return e[t];let n=ue[t];return n||(n=ue[t]=function(...a){ee.set(this,Se.get(this)[t](...a))}),n}};async function*Ke(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,We);for(Se.set(n,t),U.set(n,X(t));t;)yield n,t=await(ee.get(n)||t.continue()),ee.delete(n)}function fe(e,t){return t===Symbol.asyncIterator&&z(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&z(e,[IDBIndex,IDBObjectStore])}Ie(e=>({...e,get(t,n,a){return fe(t,n)?Ke:e.get(t,n,a)},has(t,n){return fe(t,n)||e.has(t,n)}}));const C=He("investment_purchase_tracker",3,{async upgrade(e,t,n,a){const r=a,i=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let o=e.objectStoreNames.contains("inventory")?a.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(o=e.createObjectStore("inventory",{keyPath:"id"}),o.createIndex("by_purchaseDate","purchaseDate"),o.createIndex("by_productName","productName"),o.createIndex("by_categoryId","categoryId"),o.createIndex("by_active","active"),o.createIndex("by_archived","archived"),o.createIndex("by_updatedAt","updatedAt")),o&&i){let s=await i.openCursor();for(;s;)await o.put(s.value),s=await s.continue()}let l=e.objectStoreNames.contains("categories")?a.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(l=e.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),o){let s=await o.openCursor();for(;s;){const d=s.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.archived!="boolean"&&(d.archived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}if(l){let s=await l.openCursor();for(;s;){const d=s.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}}});async function Ye(){return(await C).getAll("inventory")}async function q(e){await(await C).put("inventory",e)}async function re(e){return(await C).get("inventory",e)}async function ze(){return(await C).getAll("categories")}async function te(e){await(await C).put("categories",e)}async function Ce(e){return(await C).get("categories",e)}async function Ge(){return(await C).getAll("settings")}async function V(e,t){await(await C).put("settings",{key:e,value:t})}async function Ze(e){const n=(await C).transaction(["inventory","categories","settings"],"readwrite");await n.objectStore("inventory").clear(),await n.objectStore("categories").clear(),await n.objectStore("settings").clear();for(const a of e.purchases)await n.objectStore("inventory").put(a);for(const a of e.categories)await n.objectStore("categories").put(a);for(const a of e.settings)await n.objectStore("settings").put(a);await n.done}async function Xe(){const t=(await C).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function pe(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function et(e,t){return e.some(a=>a.viewId===t.viewId&&a.field===t.field&&a.op===t.op&&a.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function ke(e,t){const n=new Set([t]);let a=!0;for(;a;){a=!1;for(const r of e)r.linkedToFilterId&&n.has(r.linkedToFilterId)&&!n.has(r.id)&&(n.add(r.id),a=!0)}return e.filter(r=>!n.has(r.id))}function tt(e,t){return e.filter(n=>n.viewId!==t)}function ne(e,t,n,a,r){const i=t.filter(l=>l.viewId===n);if(!i.length)return e;const o=new Map(a.map(l=>[l.key,l]));return e.filter(l=>i.every(s=>{var m;const d=o.get(s.field);if(!d)return!0;const f=d.getValue(l);if(s.op==="eq")return String(f)===s.value;if(s.op==="isEmpty")return pe(f);if(s.op==="isNotEmpty")return!pe(f);if(s.op==="contains")return String(f).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const b=((m=r==null?void 0:r.categoryDescendantsMap)==null?void 0:m.get(s.value))||new Set([s.value]),g=String(f);return b.has(g)}return!0}))}function nt(e){const t=new Map(e.map(a=>[a.id,a])),n=new Map;for(const a of e){const r=n.get(a.parentId)||[];r.push(a),n.set(a.parentId,r)}return{byId:t,children:n}}function H(e){const{children:t}=nt(e),n=new Map;function a(r){const i=new Set([r]);for(const o of t.get(r)||[])for(const l of a(o.id))i.add(l);return n.set(r,i),i}for(const r of e)n.has(r.id)||a(r.id);return n}function $e(e){const t=new Map(e.map(a=>[a.id,a]));function n(a){const r=[],i=[],o=new Set;let l=a;for(;l&&!o.has(l.id);)o.add(l.id),r.unshift(l.id),i.unshift(l.name),l=l.parentId?t.get(l.parentId):void 0;return{ids:r,names:i,depth:Math.max(0,r.length-1)}}return e.map(a=>{const r=n(a);return{...a,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function ie(e,t){return[...H(e).get(t)||new Set([t])]}function at(e,t){const n=H(t),a=new Map;for(const r of t){const i=n.get(r.id)||new Set([r.id]);let o=0;for(const l of e)i.has(l.categoryId)&&(o+=l.totalPriceCents);a.set(r.id,o)}return a}const xe=document.querySelector("#app");if(!xe)throw new Error("#app not found");const h=xe;let v={kind:"none"},P=null,$=null,x=null,J=!1,W=null,F=null,R=null,me=!1,p={inventoryRecords:[],categories:[],settings:[],filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const B="USD",M="$",rt=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function w(){return new Date().toISOString()}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function K(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let n=e,a=0;for(;n>=1024&&a<t.length-1;)n/=1024,a+=1;return`${n>=10||a===0?n.toFixed(0):n.toFixed(1)} ${t[a]}`}function T(e){const t=O("currencySymbol")||M,n=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${n}`}function oe(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const n=Number(t);return Number.isFinite(n)?Math.round(n*100):null}function O(e){var t;return(t=p.settings.find(n=>n.key===e))==null?void 0:t.value}function k(e){p={...p,...e},N()}function A(e){v.kind==="none"&&document.activeElement instanceof HTMLElement&&(P=document.activeElement),v=e,N()}function E(){v.kind!=="none"&&(v={kind:"none"},N(),P&&P.isConnected&&P.focus(),P=null)}function Ae(){return h.querySelector(".modal-panel")}function De(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function it(){if(v.kind==="none")return;const e=Ae();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(De(e)[0]||e).focus()}function ot(){var e,t;(e=$==null?void 0:$.destroy)==null||e.call($),(t=x==null?void 0:x.destroy)==null||t.call(x),$=null,x=null}function ae(){var o;const e=window,t=e.DataTable,n=e.jQuery&&((o=e.jQuery.fn)!=null&&o.DataTable)?e.jQuery:void 0;if(!t&&!n){W==null&&(W=window.setTimeout(()=>{W=null,ae(),N()},500)),J||(J=!0,window.addEventListener("load",()=>{J=!1,ae(),N()},{once:!0}));return}const a=h.querySelector("#categories-table"),r=h.querySelector("#inventory-table"),i=(l,s)=>{var d,f;return t?new t(l,s):n?((f=(d=n(l)).DataTable)==null?void 0:f.call(d,s))??null:null};a&&($=i(a,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),be(a,$)),r&&(x=i(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),be(r,x))}function be(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",n=>{var m,b,g;const a=n.target,r=a==null?void 0:a.closest("thead th");if(!r)return;const i=r.parentElement;if(!(i instanceof HTMLTableRowElement))return;const o=Array.from(i.querySelectorAll("th")),l=o.indexOf(r);if(l<0||l===o.length-1)return;n.preventDefault(),n.stopPropagation();const s=(m=t.order)==null?void 0:m.call(t),d=Array.isArray(s)?s[0]:void 0,f=d&&d[0]===l&&d[1]==="asc"?"desc":"asc";(b=t.order)==null||b.call(t,[[l,f]]),(g=t.draw)==null||g.call(t,!1)},!0)}async function I(){var o,l;const[e,t,n]=await Promise.all([Ye(),ze(),Ge()]),a=$e(t).sort((s,d)=>s.sortOrder-d.sortOrder||s.name.localeCompare(d.name));n.some(s=>s.key==="currencyCode")||(await V("currencyCode",B),n.push({key:"currencyCode",value:B})),n.some(s=>s.key==="currencySymbol")||(await V("currencySymbol",M),n.push({key:"currencySymbol",value:M}));let r=null,i=null;try{const s=await((l=(o=navigator.storage)==null?void 0:o.estimate)==null?void 0:l.call(o));r=typeof(s==null?void 0:s.usage)=="number"?s.usage:null,i=typeof(s==null?void 0:s.quota)=="number"?s.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:e,categories:a,settings:n,storageUsageBytes:r,storageQuotaBytes:i},N()}function S(e){if(e)return p.categories.find(t=>t.id===e)}function st(e){const t=S(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function lt(e){return st(e)}function ct(e){const t=S(e);return t?t.pathIds.some(n=>{var a;return((a=S(n))==null?void 0:a.active)===!1}):!1}function dt(e){const t=S(e.categoryId);if(!t)return!1;for(const n of t.pathIds){const a=S(n);if((a==null?void 0:a.active)===!1)return!0}return!1}function ut(e){return e.active&&!dt(e)}function Y(e){return e==null?"":(e/100).toFixed(2)}function Ee(e){const t=e.querySelector('input[name="quantity"]'),n=e.querySelector('input[name="totalPrice"]'),a=e.querySelector('input[name="unitPrice"]');if(!t||!n||!a)return;const r=Number(t.value),i=oe(n.value);if(!Number.isFinite(r)||r<=0||i==null||i<0){a.value="";return}a.value=(Math.round(i/r)/100).toFixed(2)}function Me(e){const t=e.querySelector('select[name="evaluationMode"]'),n=e.querySelector("[data-spot-value-group]"),a=e.querySelector('input[name="spotValue"]');if(!t||!n||!a)return;const r=t.value==="spot";n.hidden=!r,a.disabled=!r}function ye(e){var t;return e.parentId?((t=S(e.parentId))==null?void 0:t.name)||"(Unknown)":""}function ft(e){return e.evaluationMode==="spot"?"Spot":e.evaluationMode==="snapshot"?"Snapshot":""}function L(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function pt(e){return e.active&&!e.archived}function Te(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>lt(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>T(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>T(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function mt(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>ye(e),getDisplay:e=>ye(e),filterable:!0,filterOp:"eq"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"evaluationMode",label:"Evaluation",getValue:e=>e.evaluationMode||"",getDisplay:e=>ft(e),filterable:!0,filterOp:"eq"},{key:"spotValueCents",label:"Value",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":T(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function Ne(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(e=>!e.archived)}function bt(){return p.showArchivedCategories?p.categories:p.categories.filter(e=>!e.isArchived)}function yt(){const e=Te(),t=mt(),n=t.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),a=t.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),r=H(p.categories),i=ne(Ne(),p.filters,"inventoryTable",e,{categoryDescendantsMap:r}),o=p.inventoryRecords.filter(pt),l=p.categories.filter(c=>!c.isArchived),s=at(o,l),d=new Map(p.categories.map(c=>[c.id,c])),f=new Map,m=new Map;for(const c of o){const j=d.get(c.categoryId);if(j)for(const y of j.pathIds)f.set(y,(f.get(y)||0)+1),m.set(y,(m.get(y)||0)+c.quantity)}const b=[...n,{key:"computedQty",label:"Qty",getValue:c=>m.get(c.id)||0,getDisplay:c=>String(m.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>s.get(c.id)||0,getDisplay:c=>T(s.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...a,{key:"computedTotalCents",label:"Total",getValue:c=>c.evaluationMode==="spot"&&c.spotValueCents!=null?(m.get(c.id)||0)*c.spotValueCents:"",getDisplay:c=>c.evaluationMode!=="spot"||c.spotValueCents==null?"":T((m.get(c.id)||0)*c.spotValueCents),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],g=ne(bt(),p.filters,"categoriesList",b);return{inventoryColumns:e,categoryColumns:b,categoryDescendantsMap:r,filteredInventoryRecords:i,filteredCategories:g,categoryTotals:s,visibleCategoriesForTotals:l}}function ge(e,t){const n=p.filters.filter(a=>a.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(t)} filters" style="--bs-breadcrumb-divider: '>';">
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
  `}function ve(e,t,n){const a=n.getValue(t),r=n.getDisplay(t),i=a==null?"":String(a),o=n.align==="right"?"text-end":n.align==="center"?"text-center":"text-start";if(!n.filterable)return u(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${o} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(n.key)}" data-op="isEmpty" data-value="" data-label="${u(`${n.label}: Empty`)}" title="Filter ${u(n.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&n.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const s=String(t.categoryId),d=ct(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${o} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(i)}" data-label="${u(`${n.label}: ${r}`)}"><span class="filter-hit">${u(r)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&n.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const s=t.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${o} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(i)}" data-label="${u(`${n.label}: ${r}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(r)}</span></button>`}if(e==="categoriesList"&&(n.key==="name"||n.key==="path")&&typeof t=="object"&&t&&"id"in t){const s=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${o} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(i)}" data-label="${u(`${n.label}: ${r}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${o} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(n.key)}" data-op="${u(n.filterOp||"eq")}" data-value="${u(i)}" data-label="${u(`${n.label}: ${r}`)}"><span class="filter-hit">${u(r)}</span></button>`}function gt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function he(e,t){const n=e.map((a,r)=>{let i=0,o=!1;for(const s of t){const d=a.getValue(s);typeof d=="number"&&Number.isFinite(d)&&(i+=d,o=!0)}const l=o?String(a.key).toLowerCase().includes("cents")?T(i):gt(i):r===0?"Totals":"";return`<th class="${L(a)}">${u(l)}</th>`});return n.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${n.join("")}</tr></tfoot>`}function vt(){if(v.kind==="none")return"";const e=O("currencySymbol")||M,t=(n,a)=>p.categories.filter(r=>!r.isArchived).filter(r=>!(n!=null&&n.has(r.id))).map(r=>`<option value="${r.id}" ${a===r.id?"selected":""}>${u(r.pathNames.join(" / "))}</option>`).join("");if(v.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((O("currencyCode")||B).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${rt.map(n=>`<option value="${u(n.value)}" ${(O("currencySymbol")||M)===n.value?"selected":""}>${u(n.label)}</option>`).join("")}
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
    `;if(v.kind==="categoryCreate"||v.kind==="categoryEdit"){const n=v.kind==="categoryEdit",a=v.kind==="categoryEdit"?S(v.categoryId):void 0;if(n&&!a)return"";const r=n&&a?new Set(ie(p.categories,a.id)):void 0,i=H(p.categories);return ne(Ne(),p.filters,"inventoryTable",Te(),{categoryDescendantsMap:i}),`
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
                ${t(r,(a==null?void 0:a.parentId)||null)}
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
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(Y(a==null?void 0:a.spotValueCents))}" ${(a==null?void 0:a.evaluationMode)==="spot"?"":"disabled"} />
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
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
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
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t()}
              </select>
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
    `;if(v.kind==="inventoryEdit"){const n=v,a=p.inventoryRecords.find(r=>r.id===n.inventoryId);return a?`
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
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(a.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(Y(a.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(Y(a.unitPriceCents))}" disabled />
              </div>
            </label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t(void 0,a.categoryId)}
              </select>
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
    `:""}return""}function N(){const e=h.querySelector("details.details-card");e&&(me=e.open),ot();const{inventoryColumns:t,categoryColumns:n,filteredInventoryRecords:a,filteredCategories:r}=yt(),i=p.exportText||Pe(),o=a.map(f=>`
        <tr class="${[ut(f)?"":"row-inactive",f.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${f.id}">
          ${t.map(b=>`<td class="${L(b)}">${ve("inventoryTable",f,b)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${f.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),l=r.map(f=>`
      <tr class="${[f.active?"":"row-inactive",f.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${f.id}">
        ${n.map(m=>`<td class="${L(m)}">${ve("categoriesList",f,m)}</td>`).join("")}
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
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${ge("categoriesList","Markets")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${n.map(f=>`<th class="${L(f)}">${u(f.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${l}
            </tbody>
            ${he(n,r)}
          </table>
        </div>
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="inventoryTable">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Investments</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
          </div>
        </div>
        ${ge("inventoryTable","Investments")}
        <div class="table-wrap table-responsive">
          <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${t.map(f=>`<th class="${L(f)}">${u(f.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${o}
            </tbody>
            ${he(t,a)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" ${me?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(K(p.storageUsageBytes)):`${u(K(p.storageUsageBytes))} of ${u(K(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(i)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${u(p.importText)}</textarea>
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
    ${vt()}
  `;const s=h.querySelector("#inventory-form");s&&Ee(s);const d=h.querySelector("#category-form");d&&Me(d),it(),ae()}function ht(){return{schemaVersion:1,exportedAt:w(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords}}function Pe(){return JSON.stringify(ht(),null,2)}function wt(e,t,n){const a=new Blob([t],{type:n}),r=URL.createObjectURL(a),i=document.createElement("a");i.href=r,i.download=e,i.click(),URL.revokeObjectURL(r)}async function It(e){const t=new FormData(e),n=String(t.get("currencyCode")||"").trim().toUpperCase(),a=String(t.get("currencySymbol")||"").trim();if(!/^[A-Z]{3}$/.test(n)){alert("Currency code must be a 3-letter code like USD.");return}if(!a){alert("Select a currency symbol.");return}await V("currencyCode",n),await V("currencySymbol",a),E(),await I()}async function St(e){const t=new FormData(e),n=String(t.get("mode")||"create"),a=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),i=String(t.get("parentId")||"").trim(),o=String(t.get("evaluationMode")||"").trim(),l=String(t.get("spotValue")||"").trim(),s=t.get("active")==="on",d=o==="spot"||o==="snapshot"?o:void 0,f=d==="spot"&&l?oe(l):void 0;if(!r)return;if(d==="spot"&&l&&f==null){alert("Spot value is invalid.");return}const m=f??void 0,b=i||null;if(b&&!S(b)){alert("Select a valid parent market.");return}if(n==="edit"){if(!a)return;const y=await Ce(a);if(!y){alert("Market not found.");return}if(b===y.id){alert("A category cannot be its own parent.");return}if(b&&ie(p.categories,y.id).includes(b)){alert("A category cannot be moved under its own subtree.");return}const je=y.parentId!==b;y.name=r,y.parentId=b,y.evaluationMode=d,y.spotValueCents=m,y.active=s,je&&(y.sortOrder=p.categories.filter(se=>se.parentId===b&&se.id!==y.id).length),y.updatedAt=w(),await te(y),E(),await I();return}const g=w(),c=p.categories.filter(y=>y.parentId===b).length,j={id:crypto.randomUUID(),name:r,parentId:b,pathIds:[],pathNames:[],depth:0,sortOrder:c,evaluationMode:d,spotValueCents:m,active:s,isArchived:!1,createdAt:g,updatedAt:g};await te(j),E(),await I()}async function Ct(e){const t=new FormData(e),n=String(t.get("mode")||"create"),a=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),i=String(t.get("productName")||"").trim(),o=Number(t.get("quantity")),l=oe(String(t.get("totalPrice")||"")),s=String(t.get("categoryId")||""),d=t.get("active")==="on",f=String(t.get("notes")||"").trim();if(!r||!i||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(o)||o<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!S(s)){alert("Select a valid category.");return}const m=Math.round(l/o);if(n==="edit"){if(!a)return;const c=await re(a);if(!c){alert("Inventory record not found.");return}c.purchaseDate=r,c.productName=i,c.quantity=o,c.totalPriceCents=l,c.unitPriceCents=m,c.unitPriceSource="derived",c.categoryId=s,c.active=d,c.notes=f||void 0,c.updatedAt=w(),await q(c),E(),await I();return}const b=w(),g={id:crypto.randomUUID(),purchaseDate:r,productName:i,quantity:o,totalPriceCents:l,unitPriceCents:m,unitPriceSource:"derived",categoryId:s,active:d,archived:!1,notes:f||void 0,createdAt:b,updatedAt:b};await q(g),E(),await I()}async function kt(e,t){const n=await re(e);n&&(n.active=t,n.updatedAt=w(),await q(n),await I())}async function $t(e,t){const n=await re(e);n&&(t&&!window.confirm(`Archive inventory record "${n.productName}"?`)||(n.archived=t,t&&(n.active=!1),n.archivedAt=t?w():void 0,n.updatedAt=w(),await q(n),await I()))}async function xt(e,t){const n=S(e);if(t&&n&&!window.confirm(`Archive market subtree "${n.pathNames.join(" / ")}"?`))return;const a=ie(p.categories,e),r=w();for(const i of a){const o=await Ce(i);o&&(o.isArchived=t,t&&(o.active=!1),o.archivedAt=t?r:void 0,o.updatedAt=r,await te(o))}await I()}function At(e){const t=w();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Dt(e){const t=w(),n=Number(e.quantity),a=Number(e.totalPriceCents);if(!Number.isFinite(n)||n<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(a))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:n,totalPriceCents:a,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function Et(){const e=p.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const n=$e(t.categories.map(At)),a=new Set(n.map(l=>l.id)),r=t.purchases.map(Dt);for(const l of r)if(!a.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const i=Array.isArray(t.settings)?t.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:B},{key:"currencySymbol",value:M}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ze({purchases:r,categories:n,settings:i}),k({importText:""}),await I()}catch(n){alert(n instanceof Error?n.message:"Import failed.")}}function Le(e){return e.target instanceof HTMLElement?e.target:null}function we(e){const t=e.dataset.viewId,n=e.dataset.field,a=e.dataset.op,r=e.dataset.value,i=e.dataset.label;if(!t||!n||!a||r==null||!i)return;const o=(f,m)=>f.viewId===m.viewId&&f.field===m.field&&f.op===m.op&&f.value===m.value;let l=et(p.filters,{viewId:t,field:n,op:a,value:r,label:i});const s=e.dataset.crossInventoryCategoryId;if(s){const f=S(s);if(f){const m=l.find(b=>o(b,{viewId:t,field:n,op:a,value:r}));if(m){const b=`Market: ${f.pathNames.join(" / ")}`;l=l.filter(c=>c.linkedToFilterId!==m.id);const g=l.findIndex(c=>o(c,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id}));if(g>=0){const c=l[g];l=[...l.slice(0,g),{...c,label:b,linkedToFilterId:m.id},...l.slice(g+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id,label:b,linkedToFilterId:m.id}]}}}let d={filters:l};t==="inventoryTable"&&n==="archived"&&r==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),t==="categoriesList"&&(n==="isArchived"||n==="archived")&&r==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),t==="categoriesList"&&n==="active"&&r==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),k(d)}function Fe(){F!=null&&(window.clearTimeout(F),F=null)}function Mt(e){const t=p.filters.filter(a=>a.viewId===e),n=t[t.length-1];n&&k({filters:ke(p.filters,n.id)})}h.addEventListener("click",async e=>{const t=Le(e);if(!t)return;const n=t.closest("[data-action]");if(!n)return;const a=n.dataset.action;if(a){if(a==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Fe(),e.detail>1)return;F=window.setTimeout(()=>{F=null,we(n)},220);return}we(n);return}if(a==="remove-filter"){const r=n.dataset.filterId;if(!r)return;k({filters:ke(p.filters,r)});return}if(a==="clear-filters"){const r=n.dataset.viewId;if(!r)return;k({filters:tt(p.filters,r)});return}if(a==="toggle-show-archived-inventory"){k({showArchivedInventory:n.checked});return}if(a==="toggle-show-archived-categories"){k({showArchivedCategories:n.checked});return}if(a==="open-create-category"){A({kind:"categoryCreate"});return}if(a==="open-create-inventory"){A({kind:"inventoryCreate"});return}if(a==="open-settings"){A({kind:"settings"});return}if(a==="edit-category"){const r=n.dataset.id;r&&A({kind:"categoryEdit",categoryId:r});return}if(a==="edit-inventory"){const r=n.dataset.id;r&&A({kind:"inventoryEdit",inventoryId:r});return}if(a==="close-modal"||a==="close-modal-backdrop"){if(a==="close-modal-backdrop"&&!t.classList.contains("modal"))return;E();return}if(a==="toggle-inventory-active"){const r=n.dataset.id,i=n.dataset.nextActive==="true";r&&await kt(r,i);return}if(a==="toggle-inventory-archived"){const r=n.dataset.id,i=n.dataset.nextArchived==="true";r&&await $t(r,i);return}if(a==="toggle-category-subtree-archived"){const r=n.dataset.id,i=n.dataset.nextArchived==="true";r&&await xt(r,i);return}if(a==="download-json"){wt(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,Pe(),"application/json");return}if(a==="replace-import"){await Et();return}if(a==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Xe(),k({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await I();return}}});h.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Fe(),t.closest("input, select, textarea, label")))return;const n=t.closest("button");if(n&&!n.classList.contains("link-cell")||t.closest("a"))return;const a=t.closest("tr[data-row-edit]");if(!a)return;const r=a.dataset.id,i=a.dataset.rowEdit;if(!(!r||!i)){if(i==="inventory"){A({kind:"inventoryEdit",inventoryId:r});return}i==="category"&&A({kind:"categoryEdit",categoryId:r})}});h.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await It(t);return}if(t.id==="category-form"){await St(t);return}if(t.id==="inventory-form"){await Ct(t);return}}});h.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const n=t.closest("form");n instanceof HTMLFormElement&&n.id==="inventory-form"&&Ee(n)}t.id==="import-text"&&(p={...p,importText:t.value})}});h.addEventListener("change",async e=>{var r;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const i=t.closest("form");i instanceof HTMLFormElement&&i.id==="category-form"&&Me(i);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const n=(r=t.files)==null?void 0:r[0];if(!n)return;const a=await n.text();k({importText:a})});h.addEventListener("pointermove",e=>{const t=Le(e);if(!t)return;const n=t.closest("[data-filter-section-view-id]");R=(n==null?void 0:n.dataset.filterSectionViewId)||null});h.addEventListener("pointerleave",()=>{R=null});document.addEventListener("keydown",e=>{if(v.kind==="none"){if(e.key!=="Escape")return;const o=e.target;if(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement||o instanceof HTMLSelectElement||!R)return;e.preventDefault(),Mt(R);return}if(e.key==="Escape"){e.preventDefault(),E();return}if(e.key!=="Tab")return;const t=Ae();if(!t)return;const n=De(t);if(!n.length){e.preventDefault(),t.focus();return}const a=n[0],r=n[n.length-1],i=document.activeElement;if(e.shiftKey){(i===a||i instanceof Node&&!t.contains(i))&&(e.preventDefault(),r.focus());return}i===r&&(e.preventDefault(),a.focus())});I();
