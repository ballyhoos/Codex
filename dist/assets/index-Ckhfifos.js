(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const J=(e,t)=>t.some(n=>e instanceof n);let te,ne;function De(){return te||(te=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function $e(){return ne||(ne=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const W=new WeakMap,V=new WeakMap,F=new WeakMap;function Ee(e){const t=new Promise((n,a)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{n(D(e.result)),r()},s=()=>{a(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)});return F.set(t,e),t}function Pe(e){if(W.has(e))return;const t=new Promise((n,a)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{n(),r()},s=()=>{a(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});W.set(e,t)}let Q={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return W.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return D(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function me(e){Q=e(Q)}function Ne(e){return $e().includes(e)?function(...t){return e.apply(Y(this),t),D(this.request)}:function(...t){return D(e.apply(Y(this),t))}}function Te(e){return typeof e=="function"?Ne(e):(e instanceof IDBTransaction&&Pe(e),J(e,De())?new Proxy(e,Q):e)}function D(e){if(e instanceof IDBRequest)return Ee(e);if(V.has(e))return V.get(e);const t=Te(e);return t!==e&&(V.set(e,t),F.set(t,e)),t}const Y=e=>F.get(e);function je(e,t,{blocked:n,upgrade:a,blocking:r,terminated:o}={}){const s=indexedDB.open(e,t),c=D(s);return a&&s.addEventListener("upgradeneeded",i=>{a(D(s.result),i.oldVersion,i.newVersion,D(s.transaction),i)}),n&&s.addEventListener("blocked",i=>n(i.oldVersion,i.newVersion,i)),c.then(i=>{o&&i.addEventListener("close",()=>o()),r&&i.addEventListener("versionchange",l=>r(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}const Le=["get","getKey","getAll","getAllKeys","count"],Oe=["put","add","delete","clear"],U=new Map;function ae(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(U.get(t))return U.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,r=Oe.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(r||Le.includes(n)))return;const o=async function(s,...c){const i=this.transaction(s,r?"readwrite":"readonly");let l=i.store;return a&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),r&&i.done]))[0]};return U.set(t,o),o}me(e=>({...e,get:(t,n,a)=>ae(t,n)||e.get(t,n,a),has:(t,n)=>!!ae(t,n)||e.has(t,n)}));const Me=["continue","continuePrimaryKey","advance"],re={},K=new WeakMap,pe=new WeakMap,qe={get(e,t){if(!Me.includes(t))return e[t];let n=re[t];return n||(n=re[t]=function(...a){K.set(this,pe.get(this)[t](...a))}),n}};async function*Re(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,qe);for(pe.set(n,t),F.set(n,Y(t));t;)yield n,t=await(K.get(n)||t.continue()),K.delete(n)}function oe(e,t){return t===Symbol.asyncIterator&&J(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&J(e,[IDBIndex,IDBObjectStore])}me(e=>({...e,get(t,n,a){return oe(t,n)?Re:e.get(t,n,a)},has(t,n){return oe(t,n)||e.has(t,n)}}));const S=je("investment_purchase_tracker",2,{async upgrade(e,t,n,a){const r=a,o=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let s=e.objectStoreNames.contains("inventory")?a.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(s=e.createObjectStore("inventory",{keyPath:"id"}),s.createIndex("by_purchaseDate","purchaseDate"),s.createIndex("by_productName","productName"),s.createIndex("by_categoryId","categoryId"),s.createIndex("by_active","active"),s.createIndex("by_archived","archived"),s.createIndex("by_updatedAt","updatedAt")),s&&o){let i=await o.openCursor();for(;i;)await s.put(i.value),i=await i.continue()}let c=e.objectStoreNames.contains("categories")?a.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(c=e.createObjectStore("categories",{keyPath:"id"}),c.createIndex("by_parentId","parentId"),c.createIndex("by_name","name"),c.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),s){let i=await s.openCursor();for(;i;){const l=i.value;let m=!1;typeof l.active!="boolean"&&(l.active=!0,m=!0),typeof l.archived!="boolean"&&(l.archived=!1,m=!0),m&&(l.updatedAt=new Date().toISOString(),await i.update(l)),i=await i.continue()}}if(c){let i=await c.openCursor();for(;i;){const l=i.value;let m=!1;typeof l.active!="boolean"&&(l.active=!0,m=!0),typeof l.isArchived!="boolean"&&(l.isArchived=!1,m=!0),m&&(l.updatedAt=new Date().toISOString(),await i.update(l)),i=await i.continue()}}}});async function Fe(){return(await S).getAll("inventory")}async function L(e){await(await S).put("inventory",e)}async function X(e){return(await S).get("inventory",e)}async function Be(){return(await S).getAll("categories")}async function z(e){await(await S).put("categories",e)}async function be(e){return(await S).get("categories",e)}async function Ve(){return(await S).getAll("settings")}async function O(e,t){await(await S).put("settings",{key:e,value:t})}async function Ue(e){const n=(await S).transaction(["inventory","categories","settings"],"readwrite");await n.objectStore("inventory").clear(),await n.objectStore("categories").clear(),await n.objectStore("settings").clear();for(const a of e.purchases)await n.objectStore("inventory").put(a);for(const a of e.categories)await n.objectStore("categories").put(a);for(const a of e.settings)await n.objectStore("settings").put(a);await n.done}async function _e(){const t=(await S).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function ie(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function He(e,t){return e.some(a=>a.viewId===t.viewId&&a.field===t.field&&a.op===t.op&&a.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Je(e,t){return e.filter(n=>n.id!==t)}function We(e,t){return e.filter(n=>n.viewId!==t)}function Z(e,t,n,a,r){const o=t.filter(c=>c.viewId===n);if(!o.length)return e;const s=new Map(a.map(c=>[c.key,c]));return e.filter(c=>o.every(i=>{var u;const l=s.get(i.field);if(!l)return!0;const m=l.getValue(c);if(i.op==="eq")return String(m)===i.value;if(i.op==="isEmpty")return ie(m);if(i.op==="isNotEmpty")return!ie(m);if(i.op==="contains")return String(m).toLowerCase().includes(i.value.toLowerCase());if(i.op==="inCategorySubtree"){const b=((u=r==null?void 0:r.categoryDescendantsMap)==null?void 0:u.get(i.value))||new Set([i.value]),y=String(m);return b.has(y)}return!0}))}function Qe(e){const t=new Map(e.map(a=>[a.id,a])),n=new Map;for(const a of e){const r=n.get(a.parentId)||[];r.push(a),n.set(a.parentId,r)}return{byId:t,children:n}}function B(e){const{children:t}=Qe(e),n=new Map;function a(r){const o=new Set([r]);for(const s of t.get(r)||[])for(const c of a(s.id))o.add(c);return n.set(r,o),o}for(const r of e)n.has(r.id)||a(r.id);return n}function ye(e){const t=new Map(e.map(a=>[a.id,a]));function n(a){const r=[],o=[],s=new Set;let c=a;for(;c&&!s.has(c.id);)s.add(c.id),r.unshift(c.id),o.unshift(c.name),c=c.parentId?t.get(c.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(a=>{const r=n(a);return{...a,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function ee(e,t){return[...B(e).get(t)||new Set([t])]}function ge(e,t){const n=B(t),a=new Map;for(const r of t){const o=n.get(r.id)||new Set([r.id]);let s=0;for(const c of e)o.has(c.categoryId)&&(s+=c.totalPriceCents);a.set(r.id,s)}return a}const ve=document.querySelector("#app");if(!ve)throw new Error("#app not found");const I=ve;let p={kind:"none"},N=null,C=null,A=null,_=!1,H=null,T=null,d={inventoryRecords:[],categories:[],settings:[],filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:""};const M="USD",E="$",Ye=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function v(){return new Date().toISOString()}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function q(e){const t=j("currencySymbol")||E,n=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${n}`}function he(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const n=Number(t);return Number.isFinite(n)?Math.round(n*100):null}function j(e){var t;return(t=d.settings.find(n=>n.key===e))==null?void 0:t.value}function k(e){d={...d,...e},P()}function x(e){p.kind==="none"&&document.activeElement instanceof HTMLElement&&(N=document.activeElement),p=e,P()}function $(){p.kind!=="none"&&(p={kind:"none"},P(),N&&N.isConnected&&N.focus(),N=null)}function we(){return I.querySelector(".modal-panel")}function Ie(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Ke(){if(p.kind==="none")return;const e=we();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(Ie(e)[0]||e).focus()}function ze(){var e,t;(e=C==null?void 0:C.destroy)==null||e.call(C),(t=A==null?void 0:A.destroy)==null||t.call(A),C=null,A=null}function G(){var s;const e=window,t=e.DataTable,n=e.jQuery&&((s=e.jQuery.fn)!=null&&s.DataTable)?e.jQuery:void 0;if(!t&&!n){H==null&&(H=window.setTimeout(()=>{H=null,G(),P()},500)),_||(_=!0,window.addEventListener("load",()=>{_=!1,G(),P()},{once:!0}));return}const a=I.querySelector("#categories-table"),r=I.querySelector("#inventory-table"),o=(c,i)=>{var l,m;return t?new t(c,i):n?((m=(l=n(c)).DataTable)==null?void 0:m.call(l,i))??null:null};a&&(C=o(a,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No categories"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),se(a,C)),r&&(A=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-4'i><'col-md-4 d-flex justify-content-md-center justify-content-start'l><'col-md-4 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:10,searching:!1,info:!0,lengthChange:!0,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),se(r,A))}function se(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",n=>{var u,b,y;const a=n.target,r=a==null?void 0:a.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const s=Array.from(o.querySelectorAll("th")),c=s.indexOf(r);if(c<0||c===s.length-1)return;n.preventDefault(),n.stopPropagation();const i=(u=t.order)==null?void 0:u.call(t),l=Array.isArray(i)?i[0]:void 0,m=l&&l[0]===c&&l[1]==="asc"?"desc":"asc";(b=t.order)==null||b.call(t,[[c,m]]),(y=t.draw)==null||y.call(t,!1)},!0)}async function h(){const[e,t,n]=await Promise.all([Fe(),Be(),Ve()]),a=ye(t).sort((r,o)=>r.sortOrder-o.sortOrder||r.name.localeCompare(o.name));n.some(r=>r.key==="currencyCode")||(await O("currencyCode",M),n.push({key:"currencyCode",value:M})),n.some(r=>r.key==="currencySymbol")||(await O("currencySymbol",E),n.push({key:"currencySymbol",value:E})),d={...d,inventoryRecords:e,categories:a,settings:n},P()}function w(e){if(e)return d.categories.find(t=>t.id===e)}function Ze(e){const t=w(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function Ge(e){return Ze(e)}function Xe(e){const t=w(e);return t?t.pathIds.some(n=>{var a;return((a=w(n))==null?void 0:a.active)===!1}):!1}function et(e){const t=w(e.categoryId);if(!t)return!1;for(const n of t.pathIds){const a=w(n);if((a==null?void 0:a.active)===!1)return!0}return!1}function tt(e){return e.active&&!et(e)}function ce(e){return e==null?"":(e/100).toFixed(2)}function Se(e){const t=e.querySelector('input[name="quantity"]'),n=e.querySelector('input[name="totalPrice"]'),a=e.querySelector('input[name="unitPrice"]');if(!t||!n||!a)return;const r=Number(t.value),o=he(n.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){a.value="";return}a.value=(Math.round(o/r)/100).toFixed(2)}function le(e){var t;return e.parentId?((t=w(e.parentId))==null?void 0:t.name)||"(Unknown)":""}function R(e){return e.active&&!e.archived}function Ce(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Category / Path",getValue:e=>e.categoryId,getDisplay:e=>Ge(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>q(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>q(e.totalPriceCents),filterable:!0,filterOp:"eq"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function nt(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>le(e),getDisplay:e=>le(e),filterable:!0,filterOp:"eq"},{key:"path",label:"Path",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"}]}function Ae(){return d.showArchivedInventory?d.inventoryRecords:d.inventoryRecords.filter(e=>!e.archived)}function at(){return d.showArchivedCategories?d.categories:d.categories.filter(e=>!e.isArchived)}function rt(){const e=Ce(),t=nt(),n=B(d.categories),a=Z(Ae(),d.filters,"inventoryTable",e,{categoryDescendantsMap:n}),r=d.categories.filter(u=>!u.isArchived),o=a.filter(R),s=ge(o,r),c=new Map(d.categories.map(u=>[u.id,u])),i=new Map;for(const u of a.filter(R)){const b=c.get(u.categoryId);if(b)for(const y of b.pathIds)i.set(y,(i.get(y)||0)+1)}const l=[...t,{key:"computedItems",label:"Items",getValue:u=>i.get(u.id)||0,getDisplay:u=>String(i.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"computedTotalCents",label:"Total",getValue:u=>s.get(u.id)||0,getDisplay:u=>q(s.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:u=>u.active&&!u.isArchived,getDisplay:u=>u.active&&!u.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],m=Z(at(),d.filters,"categoriesList",l);return{inventoryColumns:e,categoryColumns:l,categoryDescendantsMap:n,filteredInventoryRecords:a,filteredCategories:m,categoryTotals:s,visibleCategoriesForTotals:r}}function de(e,t){const n=d.filters.filter(a=>a.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${f(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(a=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${f(a.label)}"
                  aria-label="Remove filter: ${f(a.label)}"
                  data-action="remove-filter"
                  data-filter-id="${a.id}"
                >${f(a.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
    </div>
  `}function ue(e,t,n){const a=n.getValue(t),r=n.getDisplay(t),o=a==null?"":String(a);if(!n.filterable)return f(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${f(n.key)}" data-op="isEmpty" data-value="" data-label="${f(`${n.label}: Empty`)}" title="Filter ${f(n.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&n.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const c=String(t.categoryId),i=Xe(c);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${f(n.key)}" data-op="${f(n.filterOp||"eq")}" data-value="${f(o)}" data-label="${f(`${n.label}: ${r}`)}"><span class="filter-hit">${f(r)}${i?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent text-start align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${f(n.key)}" data-op="${f(n.filterOp||"eq")}" data-value="${f(o)}" data-label="${f(`${n.label}: ${r}`)}"><span class="filter-hit">${f(r)}</span></button>`}function ot(){if(p.kind==="none")return"";const e=j("currencySymbol")||E,t=(n,a)=>d.categories.filter(r=>!r.isArchived).filter(r=>!(n!=null&&n.has(r.id))).map(r=>`<option value="${r.id}" ${a===r.id?"selected":""}>${f(r.pathNames.join(" / "))}</option>`).join("");if(p.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${f((j("currencyCode")||M).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Ye.map(n=>`<option value="${f(n.value)}" ${(j("currencySymbol")||E)===n.value?"selected":""}>${f(n.label)}</option>`).join("")}
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
    `;if(p.kind==="categoryCreate"||p.kind==="categoryEdit"){const n=p.kind==="categoryEdit",a=p.kind==="categoryEdit"?w(p.categoryId):void 0;if(n&&!a)return"";const r=n&&a?new Set(ee(d.categories,a.id)):void 0,o=B(d.categories),s=Z(Ae(),d.filters,"inventoryTable",Ce(),{categoryDescendantsMap:o}),c=a&&ge(s.filter(R),d.categories.filter(l=>!l.isArchived)).get(a.id)||0,i=a?s.filter(l=>{if(!R(l))return!1;const m=w(l.categoryId);return m?m.pathIds.includes(a.id):!1}).length:0;return`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${n?"Edit Category":"Create Category"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${n?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${f((a==null?void 0:a.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${f((a==null?void 0:a.name)||"")}" /></label>
            <label>Parent category
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${t(r,(a==null?void 0:a.parentId)||null)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a?a.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            ${n?`
            <label class="form-label mb-0">Items (read-only)
              <input class="form-control" value="${f(String(i))}" disabled />
            </label>
            `:""}
            ${n?`
            <label class="form-label mb-0">Current total (read-only)
              <input class="form-control" value="${f(q(c))}" disabled />
            </label>
            `:""}
            <div class="modal-footer px-0 pb-0">
              ${n&&a?`<button type="button" class="btn ${a.isArchived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-category-subtree-archived" data-id="${a.id}" data-next-archived="${String(!a.isArchived)}">${a.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${n?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(p.kind==="inventoryCreate")return`
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
                <span class="input-group-text">${f(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${f(e)}</span>
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
    `;if(p.kind==="inventoryEdit"){const n=p,a=d.inventoryRecords.find(r=>r.id===n.inventoryId);return a?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Inventory Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${f(a.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${f(a.purchaseDate)}" /></label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${f(a.productName)}" /></label>
            <label class="form-label mb-0">Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${f(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${f(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${f(ce(a.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${f(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${f(ce(a.unitPriceCents))}" disabled />
              </div>
            </label>
            <label>Category
              <select class="form-select" name="categoryId" required>
                <option value="">Select category</option>
                ${t(void 0,a.categoryId)}
              </select>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${f(a.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${a.archived?"btn-outline-success":"btn-outline-warning"} me-auto" data-action="toggle-inventory-archived" data-id="${a.id}" data-next-archived="${String(!a.archived)}">${a.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-outline-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function P(){ze();const{inventoryColumns:e,categoryColumns:t,filteredInventoryRecords:n,filteredCategories:a}=rt(),r=d.exportText||ke(),o=n.map(i=>`
        <tr class="${[tt(i)?"":"row-inactive",i.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${i.id}">
          ${e.map(m=>`<td>${ue("inventoryTable",i,m)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${i.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),s=a.map(i=>`
      <tr class="${[i.active?"":"row-inactive",i.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${i.id}">
        ${t.map(l=>`<td>${ue("categoriesList",i,l)}</td>`).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${i.id}">Edit</button>
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
          <button type="button" class="header-indicator-btn btn btn-outline-primary btn-sm" data-action="open-settings" aria-label="Edit settings">Edit settings</button>
        </div>
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
        <div class="section-head">
          <h2 class="h5 mb-0">Categories</h2>
          <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end">
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${d.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${de("categoriesList","Category list")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${t.map(i=>`<th>${f(i.label)}</th>`).join("")}
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
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${d.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>
            <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
          </div>
        </div>
        ${de("inventoryTable","Inventory")}
        <div class="table-wrap table-responsive">
          <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${e.map(i=>`<th>${f(i.label)}</th>`).join("")}
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
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${f(r)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${f(d.importText)}</textarea>
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
    ${ot()}
  `;const c=I.querySelector("#inventory-form");c&&Se(c),Ke(),G()}function it(){return{schemaVersion:1,exportedAt:v(),settings:d.settings,categories:d.categories,purchases:d.inventoryRecords}}function ke(){return JSON.stringify(it(),null,2)}function st(e,t,n){const a=new Blob([t],{type:n}),r=URL.createObjectURL(a),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function ct(e){const t=new FormData(e),n=String(t.get("currencyCode")||"").trim().toUpperCase(),a=String(t.get("currencySymbol")||"").trim();if(!/^[A-Z]{3}$/.test(n)){alert("Currency code must be a 3-letter code like USD.");return}if(!a){alert("Select a currency symbol.");return}await O("currencyCode",n),await O("currencySymbol",a),$(),await h()}async function lt(e){const t=new FormData(e),n=String(t.get("mode")||"create"),a=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),s=t.get("active")==="on";if(!r)return;const c=o||null;if(c&&!w(c)){alert("Select a valid parent category.");return}if(n==="edit"){if(!a)return;const u=await be(a);if(!u){alert("Category not found.");return}if(c===u.id){alert("A category cannot be its own parent.");return}if(c&&ee(d.categories,u.id).includes(c)){alert("A category cannot be moved under its own subtree.");return}const b=u.parentId!==c;u.name=r,u.parentId=c,u.active=s,b&&(u.sortOrder=d.categories.filter(y=>y.parentId===c&&y.id!==u.id).length),u.updatedAt=v(),await z(u),$(),await h();return}const i=v(),l=d.categories.filter(u=>u.parentId===c).length,m={id:crypto.randomUUID(),name:r,parentId:c,pathIds:[],pathNames:[],depth:0,sortOrder:l,active:s,isArchived:!1,createdAt:i,updatedAt:i};await z(m),$(),await h()}async function dt(e){const t=new FormData(e),n=String(t.get("mode")||"create"),a=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),s=Number(t.get("quantity")),c=he(String(t.get("totalPrice")||"")),i=String(t.get("categoryId")||""),l=t.get("active")==="on",m=String(t.get("notes")||"").trim();if(!r||!o||!i){alert("Date, product name, and category are required.");return}if(!Number.isFinite(s)||s<=0){alert("Quantity must be greater than 0.");return}if(c==null||c<0){alert("Total price is invalid.");return}if(!w(i)){alert("Select a valid category.");return}const u=Math.round(c/s);if(n==="edit"){if(!a)return;const g=await X(a);if(!g){alert("Inventory record not found.");return}g.purchaseDate=r,g.productName=o,g.quantity=s,g.totalPriceCents=c,g.unitPriceCents=u,g.unitPriceSource="derived",g.categoryId=i,g.active=l,g.notes=m||void 0,g.updatedAt=v(),await L(g),$(),await h();return}const b=v(),y={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:s,totalPriceCents:c,unitPriceCents:u,unitPriceSource:"derived",categoryId:i,active:l,archived:!1,notes:m||void 0,createdAt:b,updatedAt:b};await L(y),$(),await h()}async function ut(e,t){const n=await X(e);n&&(n.active=t,n.updatedAt=v(),await L(n),await h())}async function ft(e,t){const n=await X(e);n&&(t&&!window.confirm(`Archive inventory record "${n.productName}"?`)||(n.archived=t,n.archivedAt=t?v():void 0,n.updatedAt=v(),await L(n),await h()))}async function mt(e,t){const n=w(e);if(t&&n&&!window.confirm(`Archive category subtree "${n.pathNames.join(" / ")}"?`))return;const a=ee(d.categories,e),r=v();for(const o of a){const s=await be(o);s&&(s.isArchived=t,s.archivedAt=t?r:void 0,s.updatedAt=r,await z(s))}await h()}function pt(e){const t=v();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function bt(e){const t=v(),n=Number(e.quantity),a=Number(e.totalPriceCents);if(!Number.isFinite(n)||n<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(a))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:n,totalPriceCents:a,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function yt(){const e=d.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const n=ye(t.categories.map(pt)),a=new Set(n.map(c=>c.id)),r=t.purchases.map(bt);for(const c of r)if(!a.has(c.categoryId))throw new Error(`Inventory record ${c.id} references missing categoryId ${c.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(c=>({key:String(c.key),value:c.value})):[{key:"currencyCode",value:M},{key:"currencySymbol",value:E}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ue({purchases:r,categories:n,settings:o}),k({importText:""}),await h()}catch(n){alert(n instanceof Error?n.message:"Import failed.")}}function gt(e){return e.target instanceof HTMLElement?e.target:null}function fe(e){const t=e.dataset.viewId,n=e.dataset.field,a=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!n||!a||r==null||!o)return;let s={filters:He(d.filters,{viewId:t,field:n,op:a,value:r,label:o})};t==="inventoryTable"&&n==="archived"&&r==="true"&&!d.showArchivedInventory&&(s.showArchivedInventory=!0),t==="categoriesList"&&(n==="isArchived"||n==="archived")&&r==="true"&&!d.showArchivedCategories&&(s.showArchivedCategories=!0),t==="categoriesList"&&n==="active"&&r==="false"&&!d.showArchivedCategories&&(s.showArchivedCategories=!0),k(s)}function xe(){T!=null&&(window.clearTimeout(T),T=null)}I.addEventListener("click",async e=>{const t=gt(e);if(!t)return;const n=t.closest("[data-action]");if(!n)return;const a=n.dataset.action;if(a){if(a==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(xe(),e.detail>1)return;T=window.setTimeout(()=>{T=null,fe(n)},220);return}fe(n);return}if(a==="remove-filter"){const r=n.dataset.filterId;if(!r)return;k({filters:Je(d.filters,r)});return}if(a==="clear-filters"){const r=n.dataset.viewId;if(!r)return;k({filters:We(d.filters,r)});return}if(a==="toggle-show-archived-inventory"){k({showArchivedInventory:n.checked});return}if(a==="toggle-show-archived-categories"){k({showArchivedCategories:n.checked});return}if(a==="open-create-category"){x({kind:"categoryCreate"});return}if(a==="open-create-inventory"){x({kind:"inventoryCreate"});return}if(a==="open-settings"){x({kind:"settings"});return}if(a==="edit-category"){const r=n.dataset.id;r&&x({kind:"categoryEdit",categoryId:r});return}if(a==="edit-inventory"){const r=n.dataset.id;r&&x({kind:"inventoryEdit",inventoryId:r});return}if(a==="close-modal"||a==="close-modal-backdrop"){if(a==="close-modal-backdrop"&&!t.classList.contains("modal"))return;$();return}if(a==="toggle-inventory-active"){const r=n.dataset.id,o=n.dataset.nextActive==="true";r&&await ut(r,o);return}if(a==="toggle-inventory-archived"){const r=n.dataset.id,o=n.dataset.nextArchived==="true";r&&await ft(r,o);return}if(a==="toggle-category-subtree-archived"){const r=n.dataset.id,o=n.dataset.nextArchived==="true";r&&await mt(r,o);return}if(a==="download-json"){st(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ke(),"application/json");return}if(a==="replace-import"){await yt();return}if(a==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await _e(),k({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await h();return}}});I.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(xe(),t.closest("input, select, textarea, label")))return;const n=t.closest("button");if(n&&!n.classList.contains("link-cell")||t.closest("a"))return;const a=t.closest("tr[data-row-edit]");if(!a)return;const r=a.dataset.id,o=a.dataset.rowEdit;if(!(!r||!o)){if(o==="purchase"){x({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&x({kind:"categoryEdit",categoryId:r})}});I.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await ct(t);return}if(t.id==="category-form"){await lt(t);return}if(t.id==="inventory-form"){await dt(t);return}}});I.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const n=t.closest("form");n instanceof HTMLFormElement&&n.id==="inventory-form"&&Se(n)}t.id==="import-text"&&(d={...d,importText:t.value})}});I.addEventListener("change",async e=>{var r;const t=e.target;if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const n=(r=t.files)==null?void 0:r[0];if(!n)return;const a=await n.text();k({importText:a})});document.addEventListener("keydown",e=>{if(p.kind==="none")return;if(e.key==="Escape"){e.preventDefault(),$();return}if(e.key!=="Tab")return;const t=we();if(!t)return;const n=Ie(t);if(!n.length){e.preventDefault(),t.focus();return}const a=n[0],r=n[n.length-1],o=document.activeElement;if(e.shiftKey){(o===a||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),a.focus())});h();
