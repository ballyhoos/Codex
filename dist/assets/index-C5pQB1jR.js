(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const K=(e,t)=>t.some(a=>e instanceof a);let ie,se;function Te(){return ie||(ie=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function je(){return se||(se=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Y=new WeakMap,U=new WeakMap,R=new WeakMap;function Oe(e){const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{a(D(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)});return R.set(t,e),t}function qe(e){if(Y.has(e))return;const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{a(),r()},s=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});Y.set(e,t)}let z={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Y.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return D(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function he(e){z=e(z)}function Le(e){return je().includes(e)?function(...t){return e.apply(G(this),t),D(this.request)}:function(...t){return D(e.apply(G(this),t))}}function Ve(e){return typeof e=="function"?Le(e):(e instanceof IDBTransaction&&qe(e),K(e,Te())?new Proxy(e,z):e)}function D(e){if(e instanceof IDBRequest)return Oe(e);if(U.has(e))return U.get(e);const t=Ve(e);return t!==e&&(U.set(e,t),R.set(t,e)),t}const G=e=>R.get(e);function Be(e,t,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const s=indexedDB.open(e,t),l=D(s);return n&&s.addEventListener("upgradeneeded",i=>{n(D(s.result),i.oldVersion,i.newVersion,D(s.transaction),i)}),a&&s.addEventListener("blocked",i=>a(i.oldVersion,i.newVersion,i)),l.then(i=>{o&&i.addEventListener("close",()=>o()),r&&i.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Re=["get","getKey","getAll","getAllKeys","count"],Fe=["put","add","delete","clear"],H=new Map;function le(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(H.get(t))return H.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,r=Fe.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||Re.includes(a)))return;const o=async function(s,...l){const i=this.transaction(s,r?"readwrite":"readonly");let c=i.store;return n&&(c=c.index(l.shift())),(await Promise.all([c[a](...l),r&&i.done]))[0]};return H.set(t,o),o}he(e=>({...e,get:(t,a,n)=>le(t,a)||e.get(t,a,n),has:(t,a)=>!!le(t,a)||e.has(t,a)}));const Ue=["continue","continuePrimaryKey","advance"],ce={},Z=new WeakMap,we=new WeakMap,He={get(e,t){if(!Ue.includes(t))return e[t];let a=ce[t];return a||(a=ce[t]=function(...n){Z.set(this,we.get(this)[t](...n))}),a}};async function*_e(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,He);for(we.set(a,t),R.set(a,G(t));t;)yield a,t=await(Z.get(a)||t.continue()),Z.delete(a)}function de(e,t){return t===Symbol.asyncIterator&&K(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&K(e,[IDBIndex,IDBObjectStore])}he(e=>({...e,get(t,a,n){return de(t,a)?_e:e.get(t,a,n)},has(t,a){return de(t,a)||e.has(t,a)}}));const C=Be("investment_purchase_tracker",2,{async upgrade(e,t,a,n){const r=n,o=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let s=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(s=e.createObjectStore("inventory",{keyPath:"id"}),s.createIndex("by_purchaseDate","purchaseDate"),s.createIndex("by_productName","productName"),s.createIndex("by_categoryId","categoryId"),s.createIndex("by_active","active"),s.createIndex("by_archived","archived"),s.createIndex("by_updatedAt","updatedAt")),s&&o){let i=await o.openCursor();for(;i;)await s.put(i.value),i=await i.continue()}let l=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(l=e.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),s){let i=await s.openCursor();for(;i;){const c=i.value;let f=!1;typeof c.active!="boolean"&&(c.active=!0,f=!0),typeof c.archived!="boolean"&&(c.archived=!1,f=!0),f&&(c.updatedAt=new Date().toISOString(),await i.update(c)),i=await i.continue()}}if(l){let i=await l.openCursor();for(;i;){const c=i.value;let f=!1;typeof c.active!="boolean"&&(c.active=!0,f=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,f=!0),f&&(c.updatedAt=new Date().toISOString(),await i.update(c)),i=await i.continue()}}}});async function Qe(){return(await C).getAll("inventory")}async function L(e){await(await C).put("inventory",e)}async function ae(e){return(await C).get("inventory",e)}async function Je(){return(await C).getAll("categories")}async function X(e){await(await C).put("categories",e)}async function Ie(e){return(await C).get("categories",e)}async function We(){return(await C).getAll("settings")}async function V(e,t){await(await C).put("settings",{key:e,value:t})}async function Ke(e){const a=(await C).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);await a.done}async function Ye(){const t=(await C).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function ue(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function pe(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function ze(e,t){return e.filter(a=>a.id!==t)}function Ge(e,t){return e.filter(a=>a.viewId!==t)}function ee(e,t,a,n,r){const o=t.filter(l=>l.viewId===a);if(!o.length)return e;const s=new Map(n.map(l=>[l.key,l]));return e.filter(l=>o.every(i=>{var b;const c=s.get(i.field);if(!c)return!0;const f=c.getValue(l);if(i.op==="eq")return String(f)===i.value;if(i.op==="isEmpty")return ue(f);if(i.op==="isNotEmpty")return!ue(f);if(i.op==="contains")return String(f).toLowerCase().includes(i.value.toLowerCase());if(i.op==="inCategorySubtree"){const m=((b=r==null?void 0:r.categoryDescendantsMap)==null?void 0:b.get(i.value))||new Set([i.value]),v=String(f);return m.has(v)}return!0}))}function Ze(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:t,children:a}}function F(e){const{children:t}=Ze(e),a=new Map;function n(r){const o=new Set([r]);for(const s of t.get(r)||[])for(const l of n(s.id))o.add(l);return a.set(r,o),o}for(const r of e)a.has(r.id)||n(r.id);return a}function Se(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const r=[],o=[],s=new Set;let l=n;for(;l&&!s.has(l.id);)s.add(l.id),r.unshift(l.id),o.unshift(l.name),l=l.parentId?t.get(l.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function ne(e,t){return[...F(e).get(t)||new Set([t])]}function Xe(e,t){const a=F(t),n=new Map;for(const r of t){const o=a.get(r.id)||new Set([r.id]);let s=0;for(const l of e)o.has(l.categoryId)&&(s+=l.totalPriceCents);n.set(r.id,s)}return n}const Ce=document.querySelector("#app");if(!Ce)throw new Error("#app not found");const h=Ce;let g={kind:"none"},N=null,$=null,k=null,_=!1,Q=null,T=null,p={inventoryRecords:[],categories:[],settings:[],filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const B="USD",M="$",et=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function w(){return new Date().toISOString()}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function J(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function j(e){const t=q("currencySymbol")||M,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function re(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function q(e){var t;return(t=p.settings.find(a=>a.key===e))==null?void 0:t.value}function A(e){p={...p,...e},P()}function x(e){g.kind==="none"&&document.activeElement instanceof HTMLElement&&(N=document.activeElement),g=e,P()}function E(){g.kind!=="none"&&(g={kind:"none"},P(),N&&N.isConnected&&N.focus(),N=null)}function $e(){return h.querySelector(".modal-panel")}function ke(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function tt(){if(g.kind==="none")return;const e=$e();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(ke(e)[0]||e).focus()}function at(){var e,t;(e=$==null?void 0:$.destroy)==null||e.call($),(t=k==null?void 0:k.destroy)==null||t.call(k),$=null,k=null}function te(){var s;const e=window,t=e.DataTable,a=e.jQuery&&((s=e.jQuery.fn)!=null&&s.DataTable)?e.jQuery:void 0;if(!t&&!a){Q==null&&(Q=window.setTimeout(()=>{Q=null,te(),P()},500)),_||(_=!0,window.addEventListener("load",()=>{_=!1,te(),P()},{once:!0}));return}const n=h.querySelector("#categories-table"),r=h.querySelector("#inventory-table"),o=(l,i)=>{var c,f;return t?new t(l,i):a?((f=(c=a(l)).DataTable)==null?void 0:f.call(c,i))??null:null};n&&($=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),fe(n,$)),r&&(k=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),fe(r,k))}function fe(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var b,m,v;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const s=Array.from(o.querySelectorAll("th")),l=s.indexOf(r);if(l<0||l===s.length-1)return;a.preventDefault(),a.stopPropagation();const i=(b=t.order)==null?void 0:b.call(t),c=Array.isArray(i)?i[0]:void 0,f=c&&c[0]===l&&c[1]==="asc"?"desc":"asc";(m=t.order)==null||m.call(t,[[l,f]]),(v=t.draw)==null||v.call(t,!1)},!0)}async function I(){var s,l;const[e,t,a]=await Promise.all([Qe(),Je(),We()]),n=Se(t).sort((i,c)=>i.sortOrder-c.sortOrder||i.name.localeCompare(c.name));a.some(i=>i.key==="currencyCode")||(await V("currencyCode",B),a.push({key:"currencyCode",value:B})),a.some(i=>i.key==="currencySymbol")||(await V("currencySymbol",M),a.push({key:"currencySymbol",value:M}));let r=null,o=null;try{const i=await((l=(s=navigator.storage)==null?void 0:s.estimate)==null?void 0:l.call(s));r=typeof(i==null?void 0:i.usage)=="number"?i.usage:null,o=typeof(i==null?void 0:i.quota)=="number"?i.quota:null}catch{r=null,o=null}p={...p,inventoryRecords:e,categories:n,settings:a,storageUsageBytes:r,storageQuotaBytes:o},P()}function S(e){if(e)return p.categories.find(t=>t.id===e)}function nt(e){const t=S(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function rt(e){return nt(e)}function ot(e){const t=S(e);return t?t.pathIds.some(a=>{var n;return((n=S(a))==null?void 0:n.active)===!1}):!1}function it(e){const t=S(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=S(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function st(e){return e.active&&!it(e)}function W(e){return e==null?"":(e/100).toFixed(2)}function Ae(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const r=Number(t.value),o=re(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function xe(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]');if(!t||!a||!n)return;const r=t.value==="spot";a.hidden=!r,n.disabled=!r}function me(e){var t;return e.parentId?((t=S(e.parentId))==null?void 0:t.name)||"(Unknown)":""}function lt(e){return e.evaluationMode==="spot"?"Spot":e.evaluationMode==="snapshot"?"Snapshot":""}function be(e){return e.active&&!e.archived}function De(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Category / Path",getValue:e=>e.categoryId,getDisplay:e=>rt(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>j(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>j(e.totalPriceCents),filterable:!0,filterOp:"eq"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ct(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>me(e),getDisplay:e=>me(e),filterable:!0,filterOp:"eq"},{key:"path",label:"Path",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"evaluationMode",label:"Evaluation",getValue:e=>e.evaluationMode||"",getDisplay:e=>lt(e),filterable:!0,filterOp:"eq"},{key:"spotValueCents",label:"Value",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":j(e.spotValueCents),filterable:!0,filterOp:"eq"}]}function Ee(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(e=>!e.archived)}function dt(){return p.showArchivedCategories?p.categories:p.categories.filter(e=>!e.isArchived)}function ut(){const e=De(),t=ct(),a=t.filter(d=>d.key==="name"||d.key==="parent"||d.key==="path"),n=t.filter(d=>d.key!=="name"&&d.key!=="parent"&&d.key!=="path"),r=F(p.categories),o=ee(Ee(),p.filters,"inventoryTable",e,{categoryDescendantsMap:r}),s=p.categories.filter(d=>!d.isArchived),l=o.filter(be),i=Xe(l,s),c=new Map(p.categories.map(d=>[d.id,d])),f=new Map,b=new Map;for(const d of o.filter(be)){const O=c.get(d.categoryId);if(O)for(const y of O.pathIds)f.set(y,(f.get(y)||0)+1),b.set(y,(b.get(y)||0)+d.quantity)}const m=[...a,{key:"computedItems",label:"Items",getValue:d=>f.get(d.id)||0,getDisplay:d=>String(f.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"computedQty",label:"Qty",getValue:d=>b.get(d.id)||0,getDisplay:d=>String(b.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:d=>i.get(d.id)||0,getDisplay:d=>j(i.get(d.id)||0),filterable:!0,filterOp:"eq"},...n,{key:"computedTotalCents",label:"Total",getValue:d=>d.evaluationMode==="spot"&&d.spotValueCents!=null?(b.get(d.id)||0)*d.spotValueCents:"",getDisplay:d=>d.evaluationMode!=="spot"||d.spotValueCents==null?"":j((b.get(d.id)||0)*d.spotValueCents),filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:d=>d.active&&!d.isArchived,getDisplay:d=>d.active&&!d.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],v=ee(dt(),p.filters,"categoriesList",m);return{inventoryColumns:e,categoryColumns:m,categoryDescendantsMap:r,filteredInventoryRecords:o,filteredCategories:v,categoryTotals:i,visibleCategoriesForTotals:s}}function ye(e,t){const a=p.filters.filter(n=>n.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${a.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(t)} filters" style="--bs-breadcrumb-divider: '>';">
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
  `}function ge(e,t,a){const n=a.getValue(t),r=a.getDisplay(t),o=n==null?"":String(n);if(!a.filterable)return u(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),i=ot(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}${i?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(r)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(o)}" data-label="${u(`${a.label}: ${r}`)}"><span class="filter-hit">${u(r)}</span></button>`}function pt(){if(g.kind==="none")return"";const e=q("currencySymbol")||M,t=(a,n)=>p.categories.filter(r=>!r.isArchived).filter(r=>!(a!=null&&a.has(r.id))).map(r=>`<option value="${r.id}" ${n===r.id?"selected":""}>${u(r.pathNames.join(" / "))}</option>`).join("");if(g.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((q("currencyCode")||B).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${et.map(a=>`<option value="${u(a.value)}" ${(q("currencySymbol")||M)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
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
    `;if(g.kind==="categoryCreate"||g.kind==="categoryEdit"){const a=g.kind==="categoryEdit",n=g.kind==="categoryEdit"?S(g.categoryId):void 0;if(a&&!n)return"";const r=a&&n?new Set(ne(p.categories,n.id)):void 0,o=F(p.categories);return ee(Ee(),p.filters,"inventoryTable",De(),{categoryDescendantsMap:o}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Category":"Create Category"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${u((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${u((n==null?void 0:n.name)||"")}" /></label>
            <label>Parent category
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(W(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if(g.kind==="inventoryCreate")return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Inventory Record</h2>
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
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
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
    `;if(g.kind==="inventoryEdit"){const a=g,n=p.inventoryRecords.find(r=>r.id===a.inventoryId);return n?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${u(n.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(n.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(n.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(W(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(W(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${t(void 0,n.categoryId)}
              </select>
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
    `:""}return""}function P(){at();const{inventoryColumns:e,categoryColumns:t,filteredInventoryRecords:a,filteredCategories:n}=ut(),r=p.exportText||Me(),o=a.map(c=>`
        <tr class="${[st(c)?"":"row-inactive",c.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${c.id}">
          ${e.map(b=>`<td>${ge("inventoryTable",c,b)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${c.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),s=n.map(c=>`
      <tr class="${[c.active?"":"row-inactive",c.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${c.id}">
        ${t.map(f=>`<td>${ge("categoriesList",c,f)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${c.id}">Edit</button>
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

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${ye("categoriesList","Category list")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${t.map(c=>`<th>${u(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${s}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Inventory</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
          </div>
        </div>
        ${ye("inventoryTable","Inventory")}
        <div class="table-wrap table-responsive">
          <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${e.map(c=>`<th>${u(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${o}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card">
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(J(p.storageUsageBytes)):`${u(J(p.storageUsageBytes))} of ${u(J(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(r)}</textarea>
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
    ${pt()}
  `;const l=h.querySelector("#inventory-form");l&&Ae(l);const i=h.querySelector("#category-form");i&&xe(i),tt(),te()}function ft(){return{schemaVersion:1,exportedAt:w(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords}}function Me(){return JSON.stringify(ft(),null,2)}function mt(e,t,a){const n=new Blob([t],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function bt(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim();if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await V("currencyCode",a),await V("currencySymbol",n),E(),await I()}async function yt(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),s=String(t.get("evaluationMode")||"").trim(),l=String(t.get("spotValue")||"").trim(),i=t.get("active")==="on",c=s==="spot"||s==="snapshot"?s:void 0,f=c==="spot"&&l?re(l):void 0;if(!r)return;if(c==="spot"&&l&&f==null){alert("Spot value is invalid.");return}const b=f??void 0,m=o||null;if(m&&!S(m)){alert("Select a valid parent category.");return}if(a==="edit"){if(!n)return;const y=await Ie(n);if(!y){alert("Category not found.");return}if(m===y.id){alert("A category cannot be its own parent.");return}if(m&&ne(p.categories,y.id).includes(m)){alert("A category cannot be moved under its own subtree.");return}const Ne=y.parentId!==m;y.name=r,y.parentId=m,y.evaluationMode=c,y.spotValueCents=b,y.active=i,Ne&&(y.sortOrder=p.categories.filter(oe=>oe.parentId===m&&oe.id!==y.id).length),y.updatedAt=w(),await X(y),E(),await I();return}const v=w(),d=p.categories.filter(y=>y.parentId===m).length,O={id:crypto.randomUUID(),name:r,parentId:m,pathIds:[],pathNames:[],depth:0,sortOrder:d,evaluationMode:c,spotValueCents:b,active:i,isArchived:!1,createdAt:v,updatedAt:v};await X(O),E(),await I()}async function gt(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),s=Number(t.get("quantity")),l=re(String(t.get("totalPrice")||"")),i=String(t.get("categoryId")||""),c=t.get("active")==="on",f=String(t.get("notes")||"").trim();if(!r||!o||!i){alert("Date, product name, and category are required.");return}if(!Number.isFinite(s)||s<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!S(i)){alert("Select a valid category.");return}const b=Math.round(l/s);if(a==="edit"){if(!n)return;const d=await ae(n);if(!d){alert("Inventory record not found.");return}d.purchaseDate=r,d.productName=o,d.quantity=s,d.totalPriceCents=l,d.unitPriceCents=b,d.unitPriceSource="derived",d.categoryId=i,d.active=c,d.notes=f||void 0,d.updatedAt=w(),await L(d),E(),await I();return}const m=w(),v={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:s,totalPriceCents:l,unitPriceCents:b,unitPriceSource:"derived",categoryId:i,active:c,archived:!1,notes:f||void 0,createdAt:m,updatedAt:m};await L(v),E(),await I()}async function vt(e,t){const a=await ae(e);a&&(a.active=t,a.updatedAt=w(),await L(a),await I())}async function ht(e,t){const a=await ae(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,t&&(a.active=!1),a.archivedAt=t?w():void 0,a.updatedAt=w(),await L(a),await I()))}async function wt(e,t){const a=S(e);if(t&&a&&!window.confirm(`Archive category subtree "${a.pathNames.join(" / ")}"?`))return;const n=ne(p.categories,e),r=w();for(const o of n){const s=await Ie(o);s&&(s.isArchived=t,t&&(s.active=!1),s.archivedAt=t?r:void 0,s.updatedAt=r,await X(s))}await I()}function It(e){const t=w();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function St(e){const t=w(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function Ct(){const e=p.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Se(t.categories.map(It)),n=new Set(a.map(l=>l.id)),r=t.purchases.map(St);for(const l of r)if(!n.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:B},{key:"currencySymbol",value:M}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ke({purchases:r,categories:a,settings:o}),A({importText:""}),await I()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function $t(e){return e.target instanceof HTMLElement?e.target:null}function ve(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!a||!n||r==null||!o)return;let s=pe(p.filters,{viewId:t,field:a,op:n,value:r,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const c=S(l);c&&(s=s.filter(f=>!(f.viewId==="inventoryTable"&&f.field==="categoryId"&&f.op==="inCategorySubtree")),s=pe(s,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:c.id,label:`Category / Path: ${c.pathNames.join(" / ")}`}))}let i={filters:s};t==="inventoryTable"&&a==="archived"&&r==="true"&&!p.showArchivedInventory&&(i.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!p.showArchivedCategories&&(i.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&r==="false"&&!p.showArchivedCategories&&(i.showArchivedCategories=!0),A(i)}function Pe(){T!=null&&(window.clearTimeout(T),T=null)}h.addEventListener("click",async e=>{const t=$t(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Pe(),e.detail>1)return;T=window.setTimeout(()=>{T=null,ve(a)},220);return}ve(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;A({filters:ze(p.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;A({filters:Ge(p.filters,r)});return}if(n==="toggle-show-archived-inventory"){A({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){A({showArchivedCategories:a.checked});return}if(n==="open-create-category"){x({kind:"categoryCreate"});return}if(n==="open-create-inventory"){x({kind:"inventoryCreate"});return}if(n==="open-settings"){x({kind:"settings"});return}if(n==="edit-category"){const r=a.dataset.id;r&&x({kind:"categoryEdit",categoryId:r});return}if(n==="edit-inventory"){const r=a.dataset.id;r&&x({kind:"inventoryEdit",inventoryId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;E();return}if(n==="toggle-inventory-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await vt(r,o);return}if(n==="toggle-inventory-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await ht(r,o);return}if(n==="toggle-category-subtree-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await wt(r,o);return}if(n==="download-json"){mt(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,Me(),"application/json");return}if(n==="replace-import"){await Ct();return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Ye(),A({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await I();return}}});h.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Pe(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const r=n.dataset.id,o=n.dataset.rowEdit;if(!(!r||!o)){if(o==="inventory"){x({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&x({kind:"categoryEdit",categoryId:r})}});h.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await bt(t);return}if(t.id==="category-form"){await yt(t);return}if(t.id==="inventory-form"){await gt(t);return}}});h.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Ae(a)}t.id==="import-text"&&(p={...p,importText:t.value})}});h.addEventListener("change",async e=>{var r;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&xe(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(r=t.files)==null?void 0:r[0];if(!a)return;const n=await a.text();A({importText:n})});document.addEventListener("keydown",e=>{if(g.kind==="none")return;if(e.key==="Escape"){e.preventDefault(),E();return}if(e.key!=="Tab")return;const t=$e();if(!t)return;const a=ke(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===n||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),n.focus())});I();
