(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const R=(e,t)=>t.some(a=>e instanceof a);let G,X;function Ae(){return G||(G=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function De(){return X||(X=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const U=new WeakMap,q=new WeakMap,L=new WeakMap;function xe(e){const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(D(e.result)),n()},i=()=>{r(e.error),n()};e.addEventListener("success",o),e.addEventListener("error",i)});return L.set(t,e),t}function Pe(e){if(U.has(e))return;const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),n()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});U.set(e,t)}let H={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return U.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return D(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function de(e){H=e(H)}function ke(e){return De().includes(e)?function(...t){return e.apply(_(this),t),D(this.request)}:function(...t){return D(e.apply(_(this),t))}}function $e(e){return typeof e=="function"?ke(e):(e instanceof IDBTransaction&&Pe(e),R(e,Ae())?new Proxy(e,H):e)}function D(e){if(e instanceof IDBRequest)return xe(e);if(q.has(e))return q.get(e);const t=$e(e);return t!==e&&(q.set(e,t),L.set(t,e)),t}const _=e=>L.get(e);function Ee(e,t,{blocked:a,upgrade:r,blocking:n,terminated:o}={}){const i=indexedDB.open(e,t),s=D(i);return r&&i.addEventListener("upgradeneeded",l=>{r(D(i.result),l.oldVersion,l.newVersion,D(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),n&&l.addEventListener("versionchange",d=>n(d.oldVersion,d.newVersion,d))}).catch(()=>{}),s}const Te=["get","getKey","getAll","getAllKeys","count"],Ne=["put","add","delete","clear"],F=new Map;function ee(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(F.get(t))return F.get(t);const a=t.replace(/FromIndex$/,""),r=t!==a,n=Ne.includes(a);if(!(a in(r?IDBIndex:IDBObjectStore).prototype)||!(n||Te.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,n?"readwrite":"readonly");let d=l.store;return r&&(d=d.index(s.shift())),(await Promise.all([d[a](...s),n&&l.done]))[0]};return F.set(t,o),o}de(e=>({...e,get:(t,a,r)=>ee(t,a)||e.get(t,a,r),has:(t,a)=>!!ee(t,a)||e.has(t,a)}));const je=["continue","continuePrimaryKey","advance"],te={},J=new WeakMap,ue=new WeakMap,Oe={get(e,t){if(!je.includes(t))return e[t];let a=te[t];return a||(a=te[t]=function(...r){J.set(this,ue.get(this)[t](...r))}),a}};async function*Le(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,Oe);for(ue.set(a,t),L.set(a,_(t));t;)yield a,t=await(J.get(a)||t.continue()),J.delete(a)}function ae(e,t){return t===Symbol.asyncIterator&&R(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&R(e,[IDBIndex,IDBObjectStore])}de(e=>({...e,get(t,a,r){return ae(t,a)?Le:e.get(t,a,r)},has(t,a){return ae(t,a)||e.has(t,a)}}));const S=Ee("investment_purchase_tracker",1,{async upgrade(e,t,a,r){let n=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;e.objectStoreNames.contains("purchases")||(n=e.createObjectStore("purchases",{keyPath:"id"}),n.createIndex("by_purchaseDate","purchaseDate"),n.createIndex("by_productName","productName"),n.createIndex("by_categoryId","categoryId"),n.createIndex("by_active","active"),n.createIndex("by_archived","archived"),n.createIndex("by_updatedAt","updatedAt"));let o=e.objectStoreNames.contains("categories")?r.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(o=e.createObjectStore("categories",{keyPath:"id"}),o.createIndex("by_parentId","parentId"),o.createIndex("by_name","name"),o.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),n){let i=await n.openCursor();for(;i;){const s=i.value;let l=!1;typeof s.active!="boolean"&&(s.active=!0,l=!0),typeof s.archived!="boolean"&&(s.archived=!1,l=!0),l&&(s.updatedAt=new Date().toISOString(),await i.update(s)),i=await i.continue()}}if(o){let i=await o.openCursor();for(;i;){const s=i.value;typeof s.isArchived!="boolean"&&(s.isArchived=!1,s.updatedAt=new Date().toISOString(),await i.update(s)),i=await i.continue()}}}});async function Me(){return(await S).getAll("purchases")}async function N(e){await(await S).put("purchases",e)}async function Y(e){return(await S).get("purchases",e)}async function qe(){return(await S).getAll("categories")}async function Q(e){await(await S).put("categories",e)}async function pe(e){return(await S).get("categories",e)}async function Fe(){return(await S).getAll("settings")}async function fe(e,t){await(await S).put("settings",{key:e,value:t})}async function Be(e){const a=(await S).transaction(["purchases","categories","settings"],"readwrite");await a.objectStore("purchases").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const r of e.purchases)await a.objectStore("purchases").put(r);for(const r of e.categories)await a.objectStore("categories").put(r);for(const r of e.settings)await a.objectStore("settings").put(r);await a.done}async function Ve(){const t=(await S).transaction(["purchases","categories","settings"],"readwrite");await t.objectStore("purchases").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function Re(e,t){return e.some(r=>r.viewId===t.viewId&&r.field===t.field&&r.op===t.op&&r.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ue(e,t){return e.filter(a=>a.id!==t)}function He(e,t){return e.filter(a=>a.viewId!==t)}function W(e,t,a,r,n){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(r.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var m;const d=i.get(l.field);if(!d)return!0;const p=d.getValue(s);if(l.op==="eq")return String(p)===l.value;if(l.op==="contains")return String(p).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const y=((m=n==null?void 0:n.categoryDescendantsMap)==null?void 0:m.get(l.value))||new Set([l.value]),A=String(p);return y.has(A)}return!0}))}function _e(e){const t=new Map(e.map(r=>[r.id,r])),a=new Map;for(const r of e){const n=a.get(r.parentId)||[];n.push(r),a.set(r.parentId,n)}return{byId:t,children:a}}function M(e){const{children:t}=_e(e),a=new Map;function r(n){const o=new Set([n]);for(const i of t.get(n)||[])for(const s of r(i.id))o.add(s);return a.set(n,o),o}for(const n of e)a.has(n.id)||r(n.id);return a}function me(e){const t=new Map(e.map(r=>[r.id,r]));function a(r){const n=[],o=[],i=new Set;let s=r;for(;s&&!i.has(s.id);)i.add(s.id),n.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:n,names:o,depth:Math.max(0,n.length-1)}}return e.map(r=>{const n=a(r);return{...r,pathIds:n.ids,pathNames:n.names,depth:n.depth}})}function Z(e,t){return[...M(e).get(t)||new Set([t])]}function be(e,t){const a=M(t),r=new Map;for(const n of t){const o=a.get(n.id)||new Set([n.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);r.set(n.id,i)}return r}const he=document.querySelector("#app");if(!he)throw new Error("#app not found");const C=he;let f={kind:"none"},E=null,v=null,w=null,B=!1,V=null,j="",c={purchases:[],categories:[],settings:[],filters:[],showArchivedPurchases:!1,showArchivedCategories:!1,exportText:"",importText:""};const T="USD";function h(){return new Date().toISOString()}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function O(e){const t=ge("currencyCode")||T;return new Intl.NumberFormat(void 0,{style:"currency",currency:t,maximumFractionDigits:2}).format(e/100)}function re(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function ge(e){var t;return(t=c.settings.find(a=>a.key===e))==null?void 0:t.value}function I(e){c={...c,...e},P()}function $(e){f.kind==="none"&&document.activeElement instanceof HTMLElement&&(E=document.activeElement),f=e,P()}function x(){f.kind!=="none"&&(f={kind:"none"},P(),E&&E.isConnected&&E.focus(),E=null)}function ye(){return C.querySelector(".modal-panel")}function ve(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Je(){if(f.kind==="none")return;const e=ye();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(ve(e)[0]||e).focus()}function Qe(){var e,t;(e=v==null?void 0:v.destroy)==null||e.call(v),(t=w==null?void 0:w.destroy)==null||t.call(w),v=null,w=null}function K(){var s;const e=window,t=e.DataTable,a=e.jQuery&&((s=e.jQuery.fn)!=null&&s.DataTable)?e.jQuery:void 0;if(!t&&!a){j="DataTables JS not loaded",V==null&&(V=window.setTimeout(()=>{V=null,K(),P()},500)),B||(B=!0,window.addEventListener("load",()=>{B=!1,K(),P()},{once:!0}));return}const r=C.querySelector("#categories-table"),n=C.querySelector("#purchases-table"),o=(l,d)=>{var p,m;return t?new t(l,d):a?((m=(p=a(l)).DataTable)==null?void 0:m.call(p,d))??null:null};r&&(v=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,ordering:{handler:!0,indicators:!0},order:[],columnDefs:[{targets:-1,orderable:!1}]}),ne(r,v)),n&&(w=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,ordering:{handler:!0,indicators:!0},order:[],columnDefs:[{targets:-1,orderable:!1}]}),ne(n,w)),j=`DataTables active (${t?"vanilla":"jQuery"}: ${v?"categories":""}${v&&w?", ":""}${w?"purchases":""})`}function ne(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var m,y,A;const r=a.target,n=r==null?void 0:r.closest("thead th");if(!n)return;const o=n.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(n);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(m=t.order)==null?void 0:m.call(t),d=Array.isArray(l)?l[0]:void 0,p=d&&d[0]===s&&d[1]==="asc"?"desc":"asc";(y=t.order)==null||y.call(t,[[s,p]]),(A=t.draw)==null||A.call(t,!1)},!0)}async function g(){const[e,t,a]=await Promise.all([Me(),qe(),Fe()]),r=me(t).sort((n,o)=>n.sortOrder-o.sortOrder||n.name.localeCompare(o.name));a.some(n=>n.key==="currencyCode")||(await fe("currencyCode",T),a.push({key:"currencyCode",value:T})),c={...c,purchases:e,categories:r,settings:a},P()}function k(e){if(e)return c.categories.find(t=>t.id===e)}function we(e){const t=k(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function oe(e){return e==null?"":(e/100).toFixed(2)}function ie(e){var t;return e.parentId?((t=k(e.parentId))==null?void 0:t.name)||"(Unknown)":"(root)"}function Se(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>O(e.totalPriceCents),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>O(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq"},{key:"categoryId",label:"Category / Path",getValue:e=>e.categoryId,getDisplay:e=>we(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"}]}function We(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>ie(e),getDisplay:e=>ie(e),filterable:!0,filterOp:"eq"},{key:"depth",label:"Depth",getValue:e=>e.depth,getDisplay:e=>String(e.depth),filterable:!0,filterOp:"eq"},{key:"path",label:"Path",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"active",label:"Active",getValue:e=>!e.isArchived,getDisplay:e=>e.isArchived?"Inactive":"Active",filterable:!0,filterOp:"eq"}]}function Ie(){return c.showArchivedPurchases?c.purchases:c.purchases.filter(e=>!e.archived)}function Ke(){return c.showArchivedCategories?c.categories:c.categories.filter(e=>!e.isArchived)}function ze(){const e=Se(),t=We(),a=M(c.categories),r=W(Ie(),c.filters,"purchasesTable",e,{categoryDescendantsMap:a}),n=c.categories.filter(d=>!d.isArchived),o=r.filter(d=>d.active&&!d.archived),i=be(o,n),s=[...t,{key:"computedTotalCents",label:"Total",getValue:d=>i.get(d.id)||0,getDisplay:d=>O(i.get(d.id)||0),filterable:!0,filterOp:"eq"}],l=W(Ke(),c.filters,"categoriesList",s);return{purchaseColumns:e,categoryColumns:s,categoryDescendantsMap:a,filteredPurchases:r,filteredCategories:l,categoryTotals:i,visibleCategoriesForTotals:n}}function se(e,t){const a=c.filters.filter(r=>r.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${a.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${a.map(r=>`
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
      ${a.length?`<button type="button" class="secondary-btn btn btn-sm btn-outline-secondary chips-clear-btn" data-action="clear-filters" data-view-id="${e}">Clear Filter</button>`:""}
    </div>
  `}function ce(e,t,a){const r=a.getDisplay(t),n=String(a.getValue(t));return a.filterable?`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(n)}" data-label="${u(`${a.label}: ${r}`)}">${u(r)}</button>`:u(r)}function Ye(){if(f.kind==="none")return"";const e=(t,a)=>c.categories.filter(r=>!r.isArchived).filter(r=>!(t!=null&&t.has(r.id))).map(r=>`<option value="${r.id}" ${a===r.id?"selected":""}>${u(r.pathNames.join(" / "))}</option>`).join("");if(f.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((ge("currencyCode")||T).toUpperCase())}" maxlength="3" required />
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
    `;if(f.kind==="categoryCreate"||f.kind==="categoryEdit"){const t=f.kind==="categoryEdit",a=f.kind==="categoryEdit"?k(f.categoryId):void 0;if(t&&!a)return"";const r=t&&a?new Set(Z(c.categories,a.id)):void 0,n=a&&be(W(Ie(),c.filters,"purchasesTable",Se(),{categoryDescendantsMap:M(c.categories)}).filter(o=>o.active&&!o.archived),c.categories.filter(o=>!o.isArchived)).get(a.id)||0;return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${t?"Edit Category":"Create Category"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${t?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${u((a==null?void 0:a.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${u((a==null?void 0:a.name)||"")}" /></label>
            <label>Parent category
              <select class="form-select" name="parentId">
                <option value="">(root)</option>
                ${e(r,(a==null?void 0:a.parentId)||null)}
              </select>
            </label>
            <label class="form-label mb-0">Current total (read-only)
              <input class="form-control" value="${u(O(n))}" disabled />
            </label>
            <div class="modal-footer px-0 pb-0">
              ${t&&a?`<button type="button" class="btn ${a.isArchived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${a.id}" data-next-archived="${String(!a.isArchived)}">${a.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${t?"Save category":"Add category"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(f.kind==="purchaseCreate")return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Purchase</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="purchaseId" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" /></label>
            <label class="form-label mb-0">Per-item price (optional)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" /></label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${e()}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" checked /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3"></textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Add purchase</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;if(f.kind==="purchaseEdit"){const t=f,a=c.purchases.find(r=>r.id===t.purchaseId);return a?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Purchase</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="purchaseId" value="${u(a.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(a.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(a.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(oe(a.totalPriceCents))}" /></label>
            <label class="form-label mb-0">Per-item price (optional)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(oe(a.unitPriceCents))}" /></label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${e(void 0,a.categoryId)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${u(a.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${a.archived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-purchase-archived" data-id="${a.id}" data-next-archived="${String(!a.archived)}">${a.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save purchase</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function P(){Qe();const{purchaseColumns:e,categoryColumns:t,filteredPurchases:a,filteredCategories:r}=ze(),n=c.exportText||z(),o=a.map(s=>`
        <tr class="${[s.active?"":"row-inactive",s.archived?"row-archived":""].filter(Boolean).join(" ")}">
          ${e.map(d=>`<td>${ce("purchasesTable",s,d)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-purchase" data-id="${s.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),i=r.map(s=>`
      <tr class="${s.isArchived?"row-archived":""}">
        ${t.map(l=>`<td>${ce("categoriesList",s,l)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${s.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");C.innerHTML=`
    <div class="app-shell container-fluid py-3 py-lg-4">
      <header class="page-header mb-2">
        <div class="section-head">
          <div>
            <h1 class="display-6 mb-1">Investment Purchase Tracker</h1>
            <p class="text-body-secondary mb-0">Local-only storage in IndexedDB. Totals reflect current purchase filters and include active, non-archived records only.</p>
            ${j?`<div class="small mt-1 text-body-secondary">Table Status: ${u(j)}</div>`:""}
          </div>
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Actions</h2>
          <div class="menu-bar">
            <button type="button" class="btn btn-sm btn-primary action-menu-btn" data-action="open-create-category">New category</button>
            <button type="button" class="btn btn-sm btn-success action-menu-btn" data-action="open-create-purchase">New purchase</button>
            <button type="button" class="btn btn-sm btn-outline-secondary action-menu-btn" data-action="open-settings">Settings</button>
          </div>
        </div>
        <p class="muted text-body-secondary mb-0 mt-2">Create and edit records from modals. Saving updates the data and recalculates totals.</p>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories List</h2>
          <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${c.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
        </div>
        ${se("categoriesList","Category list")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${t.map(s=>`<th>${u(s.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${i||`<tr><td colspan="${t.length+1}" class="empty-cell">No categories</td></tr>`}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Purchases Table</h2>
          <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-purchases" ${c.showArchivedPurchases?"checked":""}/> <span class="form-check-label">Show archived</span></label>
        </div>
        ${se("purchasesTable","Purchases")}
        <div class="table-wrap table-responsive">
          <table id="purchases-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${e.map(s=>`<th>${u(s.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${o||`<tr><td colspan="${e.length+1}" class="empty-cell">No purchases</td></tr>`}
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
              <button type="button" class="btn btn-outline-secondary btn-sm" data-action="refresh-export">Refresh export</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-csv">Download CSV</button>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(n)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${u(c.importText)}</textarea>
            </label>
          </div>
        </div>
        <div class="danger-zone border border-danger-subtle rounded-3 p-3 mt-3 bg-danger-subtle">
          <h3 class="h6">Wipe All Data</h3>
          <p class="mb-2">Hard delete all IndexedDB data (purchases, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
          <button type="button" class="danger-btn btn btn-danger" data-action="wipe-all">Wipe all data</button>
        </div>
        </div>
      </details>
    </div>
    ${Ye()}
  `,Je(),K()}function Ze(){return{schemaVersion:1,exportedAt:h(),settings:c.settings,categories:c.categories,purchases:c.purchases}}function z(){return JSON.stringify(Ze(),null,2)}function Ge(){const e=["id","purchaseDate","productName","quantity","totalPriceCents","unitPriceCents","unitPriceSource","categoryId","categoryPath","active","archived","archivedAt","notes","createdAt","updatedAt"],t=c.purchases.map(r=>[r.id,r.purchaseDate,r.productName,String(r.quantity),String(r.totalPriceCents),String(r.unitPriceCents??""),r.unitPriceSource,r.categoryId,we(r.categoryId),String(r.active),String(r.archived),r.archivedAt||"",r.notes||"",r.createdAt,r.updatedAt]),a=r=>{const n=String(r??"");return/[",\n]/.test(n)?`"${n.replace(/"/g,'""')}"`:n};return[e.map(a).join(","),...t.map(r=>r.map(a).join(","))].join(`
`)}function le(e,t,a){const r=new Blob([t],{type:a}),n=URL.createObjectURL(r),o=document.createElement("a");o.href=n,o.download=e,o.click(),URL.revokeObjectURL(n)}async function Xe(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase();if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}await fe("currencyCode",a),x(),await g()}async function et(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("categoryId")||"").trim(),n=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim();if(!n)return;const i=o||null;if(i&&!k(i)){alert("Select a valid parent category.");return}if(a==="edit"){if(!r)return;const p=await pe(r);if(!p){alert("Category not found.");return}if(i===p.id){alert("A category cannot be its own parent.");return}if(i&&Z(c.categories,p.id).includes(i)){alert("A category cannot be moved under its own subtree.");return}const m=p.parentId!==i;p.name=n,p.parentId=i,m&&(p.sortOrder=c.categories.filter(y=>y.parentId===i&&y.id!==p.id).length),p.updatedAt=h(),await Q(p),x(),await g();return}const s=h(),l=c.categories.filter(p=>p.parentId===i).length,d={id:crypto.randomUUID(),name:n,parentId:i,pathIds:[],pathNames:[],depth:0,sortOrder:l,isArchived:!1,createdAt:s,updatedAt:s};await Q(d),x(),await g()}async function tt(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("purchaseId")||"").trim(),n=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=re(String(t.get("totalPrice")||"")),l=String(t.get("unitPrice")||""),d=l.trim()?re(l):null,p=String(t.get("categoryId")||""),m=t.get("active")==="on",y=String(t.get("notes")||"").trim();if(!n||!o||!p){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(l.trim()&&(d==null||d<0)){alert("Per-item price is invalid.");return}if(!k(p)){alert("Select a valid category.");return}if(a==="edit"){if(!r)return;const b=await Y(r);if(!b){alert("Purchase not found.");return}b.purchaseDate=n,b.productName=o,b.quantity=i,b.totalPriceCents=s,b.unitPriceCents=d??Math.round(s/i),b.unitPriceSource=d!=null?"entered":"derived",b.categoryId=p,b.active=m,b.notes=y||void 0,b.updatedAt=h(),await N(b),x(),await g();return}const A=h(),Ce={id:crypto.randomUUID(),purchaseDate:n,productName:o,quantity:i,totalPriceCents:s,unitPriceCents:d??Math.round(s/i),unitPriceSource:d!=null?"entered":"derived",categoryId:p,active:m,archived:!1,notes:y||void 0,createdAt:A,updatedAt:A};await N(Ce),x(),await g()}async function at(e,t){const a=await Y(e);a&&(a.active=t,a.updatedAt=h(),await N(a),await g())}async function rt(e,t){const a=await Y(e);a&&(t&&!window.confirm(`Archive purchase "${a.productName}"?`)||(a.archived=t,a.archivedAt=t?h():void 0,a.updatedAt=h(),await N(a),await g()))}async function nt(e,t){const a=k(e);if(t&&a&&!window.confirm(`Archive category subtree "${a.pathNames.join(" / ")}"?`))return;const r=Z(c.categories,e),n=h();for(const o of r){const i=await pe(o);i&&(i.isArchived=t,i.archivedAt=t?n:void 0,i.updatedAt=n,await Q(i))}await g()}function ot(e){const t=h();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function it(e){const t=h(),a=Number(e.quantity),r=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(r))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const n=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:r,unitPriceCents:n,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function st(){const e=c.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=me(t.categories.map(ot)),r=new Set(a.map(s=>s.id)),n=t.purchases.map(it);for(const s of n)if(!r.has(s.categoryId))throw new Error(`Purchase ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:T}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Be({purchases:n,categories:a,settings:o}),I({importText:""}),await g()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ct(e){return e.target instanceof HTMLElement?e.target:null}function lt(e){const t=e.dataset.viewId,a=e.dataset.field,r=e.dataset.op,n=e.dataset.value,o=e.dataset.label;if(!t||!a||!r||n==null||!o)return;let i={filters:Re(c.filters,{viewId:t,field:a,op:r,value:n,label:o})};t==="purchasesTable"&&a==="archived"&&n==="true"&&!c.showArchivedPurchases&&(i.showArchivedPurchases=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&n==="true"&&!c.showArchivedCategories&&(i.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&n==="false"&&!c.showArchivedCategories&&(i.showArchivedCategories=!0),I(i)}C.addEventListener("click",async e=>{const t=ct(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const r=a.dataset.action;if(r){if(r==="add-filter"){lt(a);return}if(r==="remove-filter"){const n=a.dataset.filterId;if(!n)return;I({filters:Ue(c.filters,n)});return}if(r==="clear-filters"){const n=a.dataset.viewId;if(!n)return;I({filters:He(c.filters,n)});return}if(r==="toggle-show-archived-purchases"){I({showArchivedPurchases:a.checked});return}if(r==="toggle-show-archived-categories"){I({showArchivedCategories:a.checked});return}if(r==="open-create-category"){$({kind:"categoryCreate"});return}if(r==="open-create-purchase"){$({kind:"purchaseCreate"});return}if(r==="open-settings"){$({kind:"settings"});return}if(r==="edit-category"){const n=a.dataset.id;n&&$({kind:"categoryEdit",categoryId:n});return}if(r==="edit-purchase"){const n=a.dataset.id;n&&$({kind:"purchaseEdit",purchaseId:n});return}if(r==="close-modal"||r==="close-modal-backdrop"){if(r==="close-modal-backdrop"&&!t.classList.contains("modal"))return;x();return}if(r==="toggle-purchase-active"){const n=a.dataset.id,o=a.dataset.nextActive==="true";n&&await at(n,o);return}if(r==="toggle-purchase-archived"){const n=a.dataset.id,o=a.dataset.nextArchived==="true";n&&await rt(n,o);return}if(r==="toggle-category-subtree-archived"){const n=a.dataset.id,o=a.dataset.nextArchived==="true";n&&await nt(n,o);return}if(r==="refresh-export"){I({exportText:z()});return}if(r==="download-json"){le(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,z(),"application/json");return}if(r==="download-csv"){le(`investment-tracker-${new Date().toISOString().slice(0,10)}.csv`,Ge(),"text/csv;charset=utf-8");return}if(r==="replace-import"){await st();return}if(r==="wipe-all"){const n=document.querySelector("#wipe-confirm");if(!n||n.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Ve(),I({filters:[],exportText:"",importText:"",showArchivedPurchases:!1,showArchivedCategories:!1}),await g();return}}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await Xe(t);return}if(t.id==="category-form"){await et(t);return}if(t.id==="purchase-form"){await tt(t);return}}});C.addEventListener("input",e=>{const t=e.target;(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement)&&t.id==="import-text"&&(c={...c,importText:t.value})});C.addEventListener("change",async e=>{var n;const t=e.target;if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(n=t.files)==null?void 0:n[0];if(!a)return;const r=await a.text();I({importText:r})});document.addEventListener("keydown",e=>{if(f.kind==="none")return;if(e.key==="Escape"){e.preventDefault(),x();return}if(e.key!=="Tab")return;const t=ye();if(!t)return;const a=ve(t);if(!a.length){e.preventDefault(),t.focus();return}const r=a[0],n=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===r||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),n.focus());return}o===n&&(e.preventDefault(),r.focus())});g();
