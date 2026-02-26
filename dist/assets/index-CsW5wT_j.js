(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const V=(e,t)=>t.some(a=>e instanceof a);let G,X;function Ae(){return G||(G=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function xe(){return X||(X=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const U=new WeakMap,q=new WeakMap,M=new WeakMap;function De(e){const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(x(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",i)});return M.set(t,e),t}function Pe(e){if(U.has(e))return;const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});U.set(e,t)}let H={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return U.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return x(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function le(e){H=e(H)}function ke(e){return xe().includes(e)?function(...t){return e.apply(_(this),t),x(this.request)}:function(...t){return x(e.apply(_(this),t))}}function $e(e){return typeof e=="function"?ke(e):(e instanceof IDBTransaction&&Pe(e),V(e,Ae())?new Proxy(e,H):e)}function x(e){if(e instanceof IDBRequest)return De(e);if(q.has(e))return q.get(e);const t=$e(e);return t!==e&&(q.set(e,t),M.set(t,e)),t}const _=e=>M.get(e);function Ee(e,t,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const i=indexedDB.open(e,t),s=x(i);return n&&i.addEventListener("upgradeneeded",c=>{n(x(i.result),c.oldVersion,c.newVersion,x(i.transaction),c)}),a&&i.addEventListener("blocked",c=>a(c.oldVersion,c.newVersion,c)),s.then(c=>{o&&c.addEventListener("close",()=>o()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),s}const Ne=["get","getKey","getAll","getAllKeys","count"],Te=["put","add","delete","clear"],F=new Map;function ee(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(F.get(t))return F.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,r=Te.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||Ne.includes(a)))return;const o=async function(i,...s){const c=this.transaction(i,r?"readwrite":"readonly");let u=c.store;return n&&(u=u.index(s.shift())),(await Promise.all([u[a](...s),r&&c.done]))[0]};return F.set(t,o),o}le(e=>({...e,get:(t,a,n)=>ee(t,a)||e.get(t,a,n),has:(t,a)=>!!ee(t,a)||e.has(t,a)}));const je=["continue","continuePrimaryKey","advance"],te={},J=new WeakMap,de=new WeakMap,Oe={get(e,t){if(!je.includes(t))return e[t];let a=te[t];return a||(a=te[t]=function(...n){J.set(this,de.get(this)[t](...n))}),a}};async function*Me(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,Oe);for(de.set(a,t),M.set(a,_(t));t;)yield a,t=await(J.get(a)||t.continue()),J.delete(a)}function ae(e,t){return t===Symbol.asyncIterator&&V(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&V(e,[IDBIndex,IDBObjectStore])}le(e=>({...e,get(t,a,n){return ae(t,a)?Me:e.get(t,a,n)},has(t,a){return ae(t,a)||e.has(t,a)}}));const I=Ee("investment_purchase_tracker",1,{async upgrade(e,t,a,n){let r=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;e.objectStoreNames.contains("inventory")||(r=e.createObjectStore("inventory",{keyPath:"id"}),r.createIndex("by_purchaseDate","purchaseDate"),r.createIndex("by_productName","productName"),r.createIndex("by_categoryId","categoryId"),r.createIndex("by_active","active"),r.createIndex("by_archived","archived"),r.createIndex("by_updatedAt","updatedAt"));let o=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(o=e.createObjectStore("categories",{keyPath:"id"}),o.createIndex("by_parentId","parentId"),o.createIndex("by_name","name"),o.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),r){let i=await r.openCursor();for(;i;){const s=i.value;let c=!1;typeof s.active!="boolean"&&(s.active=!0,c=!0),typeof s.archived!="boolean"&&(s.archived=!1,c=!0),c&&(s.updatedAt=new Date().toISOString(),await i.update(s)),i=await i.continue()}}if(o){let i=await o.openCursor();for(;i;){const s=i.value;typeof s.isArchived!="boolean"&&(s.isArchived=!1,s.updatedAt=new Date().toISOString(),await i.update(s)),i=await i.continue()}}}});async function Le(){return(await I).getAll("inventory")}async function T(e){await(await I).put("inventory",e)}async function Y(e){return(await I).get("inventory",e)}async function qe(){return(await I).getAll("categories")}async function Q(e){await(await I).put("categories",e)}async function ue(e){return(await I).get("categories",e)}async function Fe(){return(await I).getAll("settings")}async function fe(e,t){await(await I).put("settings",{key:e,value:t})}async function Re(e){const a=(await I).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);await a.done}async function Be(){const t=(await I).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function Ve(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ue(e,t){return e.filter(a=>a.id!==t)}function He(e,t){return e.filter(a=>a.viewId!==t)}function W(e,t,a,n,r){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>o.every(c=>{var d;const u=i.get(c.field);if(!u)return!0;const f=u.getValue(s);if(c.op==="eq")return String(f)===c.value;if(c.op==="contains")return String(f).toLowerCase().includes(c.value.toLowerCase());if(c.op==="inCategorySubtree"){const b=((d=r==null?void 0:r.categoryDescendantsMap)==null?void 0:d.get(c.value))||new Set([c.value]),S=String(f);return b.has(S)}return!0}))}function _e(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:t,children:a}}function L(e){const{children:t}=_e(e),a=new Map;function n(r){const o=new Set([r]);for(const i of t.get(r)||[])for(const s of n(i.id))o.add(s);return a.set(r,o),o}for(const r of e)a.has(r.id)||n(r.id);return a}function me(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const r=[],o=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),r.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function Z(e,t){return[...L(e).get(t)||new Set([t])]}function pe(e,t){const a=L(t),n=new Map;for(const r of t){const o=a.get(r.id)||new Set([r.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(r.id,i)}return n}const be=document.querySelector("#app");if(!be)throw new Error("#app not found");const A=be;let p={kind:"none"},E=null,v=null,w=null,R=!1,B=null,j="",l={purchases:[],categories:[],settings:[],filters:[],showArchivedPurchases:!1,showArchivedCategories:!1,exportText:"",importText:""};const N="USD";function h(){return new Date().toISOString()}function m(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function O(e){const t=he("currencyCode")||N;return new Intl.NumberFormat(void 0,{style:"currency",currency:t,maximumFractionDigits:2}).format(e/100)}function ge(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function he(e){var t;return(t=l.settings.find(a=>a.key===e))==null?void 0:t.value}function C(e){l={...l,...e},P()}function $(e){p.kind==="none"&&document.activeElement instanceof HTMLElement&&(E=document.activeElement),p=e,P()}function D(){p.kind!=="none"&&(p={kind:"none"},P(),E&&E.isConnected&&E.focus(),E=null)}function ye(){return A.querySelector(".modal-panel")}function ve(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Je(){if(p.kind==="none")return;const e=ye();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(ve(e)[0]||e).focus()}function Qe(){var e,t;(e=v==null?void 0:v.destroy)==null||e.call(v),(t=w==null?void 0:w.destroy)==null||t.call(w),v=null,w=null}function K(){var s;const e=window,t=e.DataTable,a=e.jQuery&&((s=e.jQuery.fn)!=null&&s.DataTable)?e.jQuery:void 0;if(!t&&!a){j="DataTables JS not loaded",B==null&&(B=window.setTimeout(()=>{B=null,K(),P()},500)),R||(R=!0,window.addEventListener("load",()=>{R=!1,K(),P()},{once:!0}));return}const n=A.querySelector("#categories-table"),r=A.querySelector("#purchases-table"),o=(c,u)=>{var f,d;return t?new t(c,u):a?((d=(f=a(c)).DataTable)==null?void 0:d.call(f,u))??null:null};n&&(v=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[],columnDefs:[{targets:-1,orderable:!1}]}),ne(n,v)),r&&(w=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[],columnDefs:[{targets:-1,orderable:!1}]}),ne(r,w)),j=`DataTables active (${t?"vanilla":"jQuery"}: ${v?"categories":""}${v&&w?", ":""}${w?"purchases":""})`}function ne(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var d,b,S;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(r);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const c=(d=t.order)==null?void 0:d.call(t),u=Array.isArray(c)?c[0]:void 0,f=u&&u[0]===s&&u[1]==="asc"?"desc":"asc";(b=t.order)==null||b.call(t,[[s,f]]),(S=t.draw)==null||S.call(t,!1)},!0)}async function y(){const[e,t,a]=await Promise.all([Le(),qe(),Fe()]),n=me(t).sort((r,o)=>r.sortOrder-o.sortOrder||r.name.localeCompare(o.name));a.some(r=>r.key==="currencyCode")||(await fe("currencyCode",N),a.push({key:"currencyCode",value:N})),l={...l,purchases:e,categories:n,settings:a},P()}function k(e){if(e)return l.categories.find(t=>t.id===e)}function we(e){const t=k(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function re(e){return e==null?"":(e/100).toFixed(2)}function Ie(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const r=Number(t.value),o=ge(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function oe(e){var t;return e.parentId?((t=k(e.parentId))==null?void 0:t.name)||"(Unknown)":""}function Se(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Category / Path",getValue:e=>e.categoryId,getDisplay:e=>we(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>O(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>O(e.totalPriceCents),filterable:!0,filterOp:"eq"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function We(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>oe(e),getDisplay:e=>oe(e),filterable:!0,filterOp:"eq"},{key:"path",label:"Path",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"}]}function Ce(){return l.showArchivedPurchases?l.purchases:l.purchases.filter(e=>!e.archived)}function Ke(){return l.showArchivedCategories?l.categories:l.categories.filter(e=>!e.isArchived)}function ze(){const e=Se(),t=We(),a=L(l.categories),n=W(Ce(),l.filters,"purchasesTable",e,{categoryDescendantsMap:a}),r=l.categories.filter(d=>!d.isArchived),o=n.filter(d=>d.active&&!d.archived),i=pe(o,r),s=new Map(l.categories.map(d=>[d.id,d])),c=new Map;for(const d of n){const b=s.get(d.categoryId);if(b)for(const S of b.pathIds)c.set(S,(c.get(S)||0)+1)}const u=[...t,{key:"computedItems",label:"Items",getValue:d=>c.get(d.id)||0,getDisplay:d=>String(c.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"computedTotalCents",label:"Total",getValue:d=>i.get(d.id)||0,getDisplay:d=>O(i.get(d.id)||0),filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:d=>!d.isArchived,getDisplay:d=>d.isArchived?"Inactive":"Active",filterable:!0,filterOp:"eq"}],f=W(Ke(),l.filters,"categoriesList",u);return{purchaseColumns:e,categoryColumns:u,categoryDescendantsMap:a,filteredPurchases:n,filteredCategories:f,categoryTotals:i,visibleCategoriesForTotals:r}}function ie(e,t){const a=l.filters.filter(n=>n.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${a.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${m(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${a.map(n=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${m(n.label)}"
                  aria-label="Remove filter: ${m(n.label)}"
                  data-action="remove-filter"
                  data-filter-id="${n.id}"
                >${m(n.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a.length?`<button type="button" class="secondary-btn btn btn-sm btn-outline-secondary chips-clear-btn" data-action="clear-filters" data-view-id="${e}">Clear Filter</button>`:""}
    </div>
  `}function se(e,t,a){const n=a.getDisplay(t),r=String(a.getValue(t));return a.filterable?`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${m(a.key)}" data-op="${m(a.filterOp||"eq")}" data-value="${m(r)}" data-label="${m(`${a.label}: ${n}`)}">${m(n)}</button>`:m(n)}function Ye(){if(p.kind==="none")return"";const e=(t,a)=>l.categories.filter(n=>!n.isArchived).filter(n=>!(t!=null&&t.has(n.id))).map(n=>`<option value="${n.id}" ${a===n.id?"selected":""}>${m(n.pathNames.join(" / "))}</option>`).join("");if(p.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${m((he("currencyCode")||N).toUpperCase())}" maxlength="3" required />
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
    `;if(p.kind==="categoryCreate"||p.kind==="categoryEdit"){const t=p.kind==="categoryEdit",a=p.kind==="categoryEdit"?k(p.categoryId):void 0;if(t&&!a)return"";const n=t&&a?new Set(Z(l.categories,a.id)):void 0,r=a&&pe(W(Ce(),l.filters,"purchasesTable",Se(),{categoryDescendantsMap:L(l.categories)}).filter(o=>o.active&&!o.archived),l.categories.filter(o=>!o.isArchived)).get(a.id)||0;return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${t?"Edit Category":"Create Category"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${t?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${m((a==null?void 0:a.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${m((a==null?void 0:a.name)||"")}" /></label>
            <label>Parent category
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${e(n,(a==null?void 0:a.parentId)||null)}
              </select>
            </label>
            ${t?`
            <label class="form-label mb-0">Current total (read-only)
              <input class="form-control" value="${m(O(r))}" disabled />
            </label>
            `:""}
            <div class="modal-footer px-0 pb-0">
              ${t&&a?`<button type="button" class="btn ${a.isArchived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${a.id}" data-next-archived="${String(!a.isArchived)}">${a.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${t?"Save category":"Add category"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(p.kind==="purchaseCreate")return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Create Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="purchaseId" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" /></label>
            <label class="form-label mb-0">Per-item price (auto)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled /></label>
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
              <button type="submit" class="btn btn-primary">Add Inventory Record</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `;if(p.kind==="purchaseEdit"){const t=p,a=l.purchases.find(n=>n.id===t.purchaseId);return a?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="purchase-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="purchaseId" value="${m(a.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${m(a.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${m(a.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${m(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price<input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${m(re(a.totalPriceCents))}" /></label>
            <label class="form-label mb-0">Per-item price (auto)<input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${m(re(a.unitPriceCents))}" disabled /></label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${e(void 0,a.categoryId)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${m(a.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${a.archived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-purchase-archived" data-id="${a.id}" data-next-archived="${String(!a.archived)}">${a.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Inventory Record</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function P(){Qe();const{purchaseColumns:e,categoryColumns:t,filteredPurchases:a,filteredCategories:n}=ze(),r=l.exportText||z(),o=a.map(c=>`
        <tr class="${[c.active?"":"row-inactive",c.archived?"row-archived":""].filter(Boolean).join(" ")}">
          ${e.map(f=>`<td>${se("purchasesTable",c,f)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-purchase" data-id="${c.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),i=n.map(c=>`
      <tr class="${c.isArchived?"row-archived":""}">
        ${t.map(u=>`<td>${se("categoriesList",c,u)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${c.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");A.innerHTML=`
    <div class="app-shell container-fluid py-3 py-lg-4">
      <header class="page-header mb-2">
        <div class="section-head">
          <div>
            <h1 class="display-6 mb-1">Investments</h1>
            <p class="text-body-secondary mb-0">Maintain your investments locally with fast filtering, category tracking, and clear totals.</p>
            ${j?`<div class="small mt-1 text-body-secondary">Table Status: ${m(j)}</div>`:""}
          </div>
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories List</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${l.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary action-menu-btn" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${ie("categoriesList","Category list")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${t.map(c=>`<th>${m(c.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${i}
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
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-purchases" ${l.showArchivedPurchases?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-success action-menu-btn" data-action="open-create-purchase">Create New</button>
          </div>
        </div>
        ${ie("purchasesTable","Inventory")}
        <div class="table-wrap table-responsive">
          <table id="purchases-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${e.map(c=>`<th>${m(c.label)}</th>`).join("")}
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
              <button type="button" class="btn btn-outline-secondary btn-sm" data-action="refresh-export">Refresh export</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-csv">Download CSV</button>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${m(r)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${m(l.importText)}</textarea>
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
  `;const s=A.querySelector("#purchase-form");s&&Ie(s),Je(),K()}function Ze(){return{schemaVersion:1,exportedAt:h(),settings:l.settings,categories:l.categories,purchases:l.purchases}}function z(){return JSON.stringify(Ze(),null,2)}function Ge(){const e=["id","purchaseDate","productName","quantity","totalPriceCents","unitPriceCents","unitPriceSource","categoryId","categoryPath","active","archived","archivedAt","notes","createdAt","updatedAt"],t=l.purchases.map(n=>[n.id,n.purchaseDate,n.productName,String(n.quantity),String(n.totalPriceCents),String(n.unitPriceCents??""),n.unitPriceSource,n.categoryId,we(n.categoryId),String(n.active),String(n.archived),n.archivedAt||"",n.notes||"",n.createdAt,n.updatedAt]),a=n=>{const r=String(n??"");return/[",\n]/.test(r)?`"${r.replace(/"/g,'""')}"`:r};return[e.map(a).join(","),...t.map(n=>n.map(a).join(","))].join(`
`)}function ce(e,t,a){const n=new Blob([t],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function Xe(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase();if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}await fe("currencyCode",a),D(),await y()}async function et(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim();if(!r)return;const i=o||null;if(i&&!k(i)){alert("Select a valid parent category.");return}if(a==="edit"){if(!n)return;const f=await ue(n);if(!f){alert("Category not found.");return}if(i===f.id){alert("A category cannot be its own parent.");return}if(i&&Z(l.categories,f.id).includes(i)){alert("A category cannot be moved under its own subtree.");return}const d=f.parentId!==i;f.name=r,f.parentId=i,d&&(f.sortOrder=l.categories.filter(b=>b.parentId===i&&b.id!==f.id).length),f.updatedAt=h(),await Q(f),D(),await y();return}const s=h(),c=l.categories.filter(f=>f.parentId===i).length,u={id:crypto.randomUUID(),name:r,parentId:i,pathIds:[],pathNames:[],depth:0,sortOrder:c,isArchived:!1,createdAt:s,updatedAt:s};await Q(u),D(),await y()}async function tt(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("purchaseId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=ge(String(t.get("totalPrice")||"")),c=String(t.get("categoryId")||""),u=t.get("active")==="on",f=String(t.get("notes")||"").trim();if(!r||!o||!c){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(!k(c)){alert("Select a valid category.");return}const d=Math.round(s/i);if(a==="edit"){if(!n)return;const g=await Y(n);if(!g){alert("Inventory record not found.");return}g.purchaseDate=r,g.productName=o,g.quantity=i,g.totalPriceCents=s,g.unitPriceCents=d,g.unitPriceSource="derived",g.categoryId=c,g.active=u,g.notes=f||void 0,g.updatedAt=h(),await T(g),D(),await y();return}const b=h(),S={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:i,totalPriceCents:s,unitPriceCents:d,unitPriceSource:"derived",categoryId:c,active:u,archived:!1,notes:f||void 0,createdAt:b,updatedAt:b};await T(S),D(),await y()}async function at(e,t){const a=await Y(e);a&&(a.active=t,a.updatedAt=h(),await T(a),await y())}async function nt(e,t){const a=await Y(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,a.archivedAt=t?h():void 0,a.updatedAt=h(),await T(a),await y()))}async function rt(e,t){const a=k(e);if(t&&a&&!window.confirm(`Archive category subtree "${a.pathNames.join(" / ")}"?`))return;const n=Z(l.categories,e),r=h();for(const o of n){const i=await ue(o);i&&(i.isArchived=t,i.archivedAt=t?r:void 0,i.updatedAt=r,await Q(i))}await y()}function ot(e){const t=h();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function it(e){const t=h(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function st(){const e=l.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=me(t.categories.map(ot)),n=new Set(a.map(s=>s.id)),r=t.purchases.map(it);for(const s of r)if(!n.has(s.categoryId))throw new Error(`Purchase ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:N}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Re({purchases:r,categories:a,settings:o}),C({importText:""}),await y()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ct(e){return e.target instanceof HTMLElement?e.target:null}function lt(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!a||!n||r==null||!o)return;let i={filters:Ve(l.filters,{viewId:t,field:a,op:n,value:r,label:o})};t==="purchasesTable"&&a==="archived"&&r==="true"&&!l.showArchivedPurchases&&(i.showArchivedPurchases=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!l.showArchivedCategories&&(i.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&r==="false"&&!l.showArchivedCategories&&(i.showArchivedCategories=!0),C(i)}A.addEventListener("click",async e=>{const t=ct(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){lt(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;C({filters:Ue(l.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;C({filters:He(l.filters,r)});return}if(n==="toggle-show-archived-purchases"){C({showArchivedPurchases:a.checked});return}if(n==="toggle-show-archived-categories"){C({showArchivedCategories:a.checked});return}if(n==="open-create-category"){$({kind:"categoryCreate"});return}if(n==="open-create-purchase"){$({kind:"purchaseCreate"});return}if(n==="open-settings"){$({kind:"settings"});return}if(n==="edit-category"){const r=a.dataset.id;r&&$({kind:"categoryEdit",categoryId:r});return}if(n==="edit-purchase"){const r=a.dataset.id;r&&$({kind:"purchaseEdit",purchaseId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;D();return}if(n==="toggle-purchase-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await at(r,o);return}if(n==="toggle-purchase-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await nt(r,o);return}if(n==="toggle-category-subtree-archived"){const r=a.dataset.id,o=a.dataset.nextArchived==="true";r&&await rt(r,o);return}if(n==="refresh-export"){C({exportText:z()});return}if(n==="download-json"){ce(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,z(),"application/json");return}if(n==="download-csv"){ce(`investment-tracker-${new Date().toISOString().slice(0,10)}.csv`,Ge(),"text/csv;charset=utf-8");return}if(n==="replace-import"){await st();return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Be(),C({filters:[],exportText:"",importText:"",showArchivedPurchases:!1,showArchivedCategories:!1}),await y();return}}});A.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await Xe(t);return}if(t.id==="category-form"){await et(t);return}if(t.id==="purchase-form"){await tt(t);return}}});A.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="purchase-form"&&Ie(a)}t.id==="import-text"&&(l={...l,importText:t.value})}});A.addEventListener("change",async e=>{var r;const t=e.target;if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(r=t.files)==null?void 0:r[0];if(!a)return;const n=await a.text();C({importText:n})});document.addEventListener("keydown",e=>{if(p.kind==="none")return;if(e.key==="Escape"){e.preventDefault(),D();return}if(e.key!=="Tab")return;const t=ye();if(!t)return;const a=ve(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===n||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),n.focus())});y();
