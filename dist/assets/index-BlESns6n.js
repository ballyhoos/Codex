(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=r(n);fetch(n.href,i)}})();const P=(e,t)=>t.some(r=>e instanceof r);let q,B;function ne(){return q||(q=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ie(){return B||(B=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const x=new WeakMap,C=new WeakMap,A=new WeakMap;function oe(e){const t=new Promise((r,a)=>{const n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{r(v(e.result)),n()},s=()=>{a(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",s)});return A.set(t,e),t}function se(e){if(x.has(e))return;const t=new Promise((r,a)=>{const n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{r(),n()},s=()=>{a(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});x.set(e,t)}let N={get(e,t,r){if(e instanceof IDBTransaction){if(t==="done")return x.get(e);if(t==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return v(e[t])},set(e,t,r){return e[t]=r,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function z(e){N=e(N)}function ce(e){return ie().includes(e)?function(...t){return e.apply($(this),t),v(this.request)}:function(...t){return v(e.apply($(this),t))}}function ue(e){return typeof e=="function"?ce(e):(e instanceof IDBTransaction&&se(e),P(e,ne())?new Proxy(e,N):e)}function v(e){if(e instanceof IDBRequest)return oe(e);if(C.has(e))return C.get(e);const t=ue(e);return t!==e&&(C.set(e,t),A.set(t,e)),t}const $=e=>A.get(e);function de(e,t,{blocked:r,upgrade:a,blocking:n,terminated:i}={}){const s=indexedDB.open(e,t),o=v(s);return a&&s.addEventListener("upgradeneeded",c=>{a(v(s.result),c.oldVersion,c.newVersion,v(s.transaction),c)}),r&&s.addEventListener("blocked",c=>r(c.oldVersion,c.newVersion,c)),o.then(c=>{i&&c.addEventListener("close",()=>i()),n&&c.addEventListener("versionchange",p=>n(p.oldVersion,p.newVersion,p))}).catch(()=>{}),o}const le=["get","getKey","getAll","getAllKeys","count"],pe=["put","add","delete","clear"],D=new Map;function V(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(D.get(t))return D.get(t);const r=t.replace(/FromIndex$/,""),a=t!==r,n=pe.includes(r);if(!(r in(a?IDBIndex:IDBObjectStore).prototype)||!(n||le.includes(r)))return;const i=async function(s,...o){const c=this.transaction(s,n?"readwrite":"readonly");let p=c.store;return a&&(p=p.index(o.shift())),(await Promise.all([p[r](...o),n&&c.done]))[0]};return D.set(t,i),i}z(e=>({...e,get:(t,r,a)=>V(t,r)||e.get(t,r,a),has:(t,r)=>!!V(t,r)||e.has(t,r)}));const he=["continue","continuePrimaryKey","advance"],F={},T=new WeakMap,Q=new WeakMap,fe={get(e,t){if(!he.includes(t))return e[t];let r=F[t];return r||(r=F[t]=function(...a){T.set(this,Q.get(this)[t](...a))}),r}};async function*ge(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const r=new Proxy(t,fe);for(Q.set(r,t),A.set(r,$(t));t;)yield r,t=await(T.get(r)||t.continue()),T.delete(r)}function R(e,t){return t===Symbol.asyncIterator&&P(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&P(e,[IDBIndex,IDBObjectStore])}z(e=>({...e,get(t,r,a){return R(t,r)?ge:e.get(t,r,a)},has(t,r){return R(t,r)||e.has(t,r)}}));const f=de("investment_purchase_tracker",1,{async upgrade(e,t,r,a){let n=e.objectStoreNames.contains("purchases")?a.objectStore("purchases"):null;e.objectStoreNames.contains("purchases")||(n=e.createObjectStore("purchases",{keyPath:"id"}),n.createIndex("by_purchaseDate","purchaseDate"),n.createIndex("by_productName","productName"),n.createIndex("by_categoryId","categoryId"),n.createIndex("by_active","active"),n.createIndex("by_archived","archived"),n.createIndex("by_updatedAt","updatedAt"));let i=e.objectStoreNames.contains("categories")?a.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(i=e.createObjectStore("categories",{keyPath:"id"}),i.createIndex("by_parentId","parentId"),i.createIndex("by_name","name"),i.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),n){let s=await n.openCursor();for(;s;){const o=s.value;let c=!1;typeof o.active!="boolean"&&(o.active=!0,c=!0),typeof o.archived!="boolean"&&(o.archived=!1,c=!0),c&&(o.updatedAt=new Date().toISOString(),await s.update(o)),s=await s.continue()}}if(i){let s=await i.openCursor();for(;s;){const o=s.value;typeof o.isArchived!="boolean"&&(o.isArchived=!1,o.updatedAt=new Date().toISOString(),await s.update(o)),s=await s.continue()}}}});async function me(){return(await f).getAll("purchases")}async function j(e){await(await f).put("purchases",e)}async function Y(e){return(await f).get("purchases",e)}async function ye(){return(await f).getAll("categories")}async function k(e){await(await f).put("categories",e)}async function Z(e){return(await f).get("categories",e)}async function be(){return(await f).getAll("settings")}async function G(e,t){await(await f).put("settings",{key:e,value:t})}async function ve(e){const r=(await f).transaction(["purchases","categories","settings"],"readwrite");await r.objectStore("purchases").clear(),await r.objectStore("categories").clear(),await r.objectStore("settings").clear();for(const a of e.purchases)await r.objectStore("purchases").put(a);for(const a of e.categories)await r.objectStore("categories").put(a);for(const a of e.settings)await r.objectStore("settings").put(a);await r.done}async function we(){const t=(await f).transaction(["purchases","categories","settings"],"readwrite");await t.objectStore("purchases").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function Se(e,t){return e.some(a=>a.viewId===t.viewId&&a.field===t.field&&a.op===t.op&&a.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ie(e,t){return e.filter(r=>r.id!==t)}function Ae(e,t){return e.filter(r=>r.viewId!==t)}function U(e,t,r,a,n){const i=t.filter(o=>o.viewId===r);if(!i.length)return e;const s=new Map(a.map(o=>[o.key,o]));return e.filter(o=>i.every(c=>{var d;const p=s.get(c.field);if(!p)return!0;const b=p.getValue(o);if(c.op==="eq")return String(b)===c.value;if(c.op==="contains")return String(b).toLowerCase().includes(c.value.toLowerCase());if(c.op==="inCategorySubtree"){const y=((d=n==null?void 0:n.categoryDescendantsMap)==null?void 0:d.get(c.value))||new Set([c.value]),w=String(b);return y.has(w)}return!0}))}function Ce(e){const t=new Map(e.map(a=>[a.id,a])),r=new Map;for(const a of e){const n=r.get(a.parentId)||[];n.push(a),r.set(a.parentId,n)}return{byId:t,children:r}}function L(e){const{children:t}=Ce(e),r=new Map;function a(n){const i=new Set([n]);for(const s of t.get(n)||[])for(const o of a(s.id))i.add(o);return r.set(n,i),i}for(const n of e)r.has(n.id)||a(n.id);return r}function X(e){const t=new Map(e.map(a=>[a.id,a]));function r(a){const n=[],i=[],s=new Set;let o=a;for(;o&&!s.has(o.id);)s.add(o.id),n.unshift(o.id),i.unshift(o.name),o=o.parentId?t.get(o.parentId):void 0;return{ids:n,names:i,depth:Math.max(0,n.length-1)}}return e.map(a=>{const n=r(a);return{...a,pathIds:n.ids,pathNames:n.names,depth:n.depth}})}function De(e,t){return[...L(e).get(t)||new Set([t])]}function Pe(e,t){const r=L(t),a=new Map;for(const n of t){const i=r.get(n.id)||new Set([n.id]);let s=0;for(const o of e)i.has(o.categoryId)&&(s+=o.totalPriceCents);a.set(n.id,s)}return a}const ee=document.querySelector("#app");if(!ee)throw new Error("#app not found");const I=ee;let u={purchases:[],categories:[],settings:[],filters:[],showArchivedPurchases:!1,showArchivedCategories:!1,exportText:"",importText:""};const S="USD";function h(){return new Date().toISOString()}function l(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function E(e){const t=te("currencyCode")||S;return new Intl.NumberFormat(void 0,{style:"currency",currency:t,maximumFractionDigits:2}).format(e/100)}function _(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const r=Number(t);return Number.isFinite(r)?Math.round(r*100):null}function te(e){var t;return(t=u.settings.find(r=>r.key===e))==null?void 0:t.value}function m(e){u={...u,...e},ae()}async function g(){const[e,t,r]=await Promise.all([me(),ye(),be()]),a=X(t).sort((n,i)=>n.sortOrder-i.sortOrder||n.name.localeCompare(i.name));r.some(n=>n.key==="currencyCode")||(await G("currencyCode",S),r.push({key:"currencyCode",value:S})),u={...u,purchases:e,categories:a,settings:r},ae()}function M(e){if(e)return u.categories.find(t=>t.id===e)}function re(e){const t=M(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function J(e){var t;return e.parentId?((t=M(e.parentId))==null?void 0:t.name)||"(Unknown)":"(root)"}function xe(){return[{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"productName",label:"Product",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>E(e.totalPriceCents),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>E(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq"},{key:"categoryId",label:"Category / Path",getValue:e=>e.categoryId,getDisplay:e=>re(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"},{key:"archived",label:"Archived",getValue:e=>e.archived,getDisplay:e=>e.archived?"Archived":"No",filterable:!0,filterOp:"eq"}]}function Ne(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"parent",label:"Parent",getValue:e=>J(e),getDisplay:e=>J(e),filterable:!0,filterOp:"eq"},{key:"depth",label:"Depth",getValue:e=>e.depth,getDisplay:e=>String(e.depth),filterable:!0,filterOp:"eq"},{key:"path",label:"Path",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"isArchived",label:"Archived",getValue:e=>e.isArchived,getDisplay:e=>e.isArchived?"Archived":"No",filterable:!0,filterOp:"eq"}]}function $e(){return u.showArchivedPurchases?u.purchases:u.purchases.filter(e=>!e.archived)}function Te(){return u.showArchivedCategories?u.categories:u.categories.filter(e=>!e.isArchived)}function Ee(){const e=xe(),t=Ne(),r=L(u.categories),a=U($e(),u.filters,"purchasesTable",e,{categoryDescendantsMap:r}),n=U(Te(),u.filters,"categoriesList",t),i=u.categories.filter(c=>!c.isArchived),s=a.filter(c=>c.active&&!c.archived),o=Pe(s,i);return{purchaseColumns:e,categoryColumns:t,categoryDescendantsMap:r,filteredPurchases:a,filteredCategories:n,categoryTotals:o,visibleCategoriesForTotals:i}}function H(e,t){const r=u.filters.filter(a=>a.viewId===e);return`
    <div class="chips-wrap">
      <div class="chips-title">${l(t)}</div>
      <div class="chips-list">
        ${r.length?r.map(a=>`
          <button type="button" class="chip" data-action="remove-filter" data-filter-id="${a.id}">
            <span>${l(a.label)}</span>
            <span aria-hidden="true">x</span>
          </button>
        `).join(""):'<span class="chips-empty">No filters</span>'}
      </div>
      ${r.length?`<button type="button" class="secondary-btn" data-action="clear-filters" data-view-id="${e}">Clear ${l(t)} filters</button>`:""}
    </div>
  `}function W(e,t,r){const a=r.getDisplay(t),n=String(r.getValue(t));return r.filterable?`<button type="button" class="link-cell" data-action="add-filter" data-view-id="${e}" data-field="${l(r.key)}" data-op="${l(r.filterOp||"eq")}" data-value="${l(n)}" data-label="${l(`${r.label}: ${a}`)}">${l(a)}</button>`:l(a)}function ae(){const{purchaseColumns:e,categoryColumns:t,filteredPurchases:r,filteredCategories:a,categoryTotals:n,visibleCategoriesForTotals:i}=Ee(),s=u.categories.filter(d=>!d.isArchived).map(d=>`<option value="${d.id}">${l(d.pathNames.join(" / "))}</option>`).join(""),o=u.exportText||O(),c=r.map(d=>`
        <tr class="${[d.active?"":"row-inactive",d.archived?"row-archived":""].filter(Boolean).join(" ")}">
          ${e.map(w=>`<td>${W("purchasesTable",d,w)}</td>`).join("")}
          <td class="actions-cell">
            <button type="button" data-action="toggle-purchase-active" data-id="${d.id}" data-next-active="${String(!d.active)}">${d.active?"Disable":"Enable"}</button>
            <button type="button" data-action="toggle-purchase-archived" data-id="${d.id}" data-next-archived="${String(!d.archived)}">${d.archived?"Restore":"Archive"}</button>
          </td>
        </tr>
      `).join(""),p=a.map(d=>`
      <tr class="${d.isArchived?"row-archived":""}">
        ${t.map(y=>`<td>${W("categoriesList",d,y)}</td>`).join("")}
        <td class="actions-cell">
          <button type="button" data-action="rename-category" data-id="${d.id}">Rename</button>
          <button type="button" data-action="toggle-category-subtree-archived" data-id="${d.id}" data-next-archived="${String(!d.isArchived)}">${d.isArchived?"Restore subtree":"Archive subtree"}</button>
        </td>
      </tr>
    `).join(""),b=i.map(d=>{const y=n.get(d.id)||0;return`
      <tr>
        <td>${l(d.pathNames.join(" / "))}</td>
        <td>${E(y)}</td>
      </tr>`}).join("");I.innerHTML=`
    <div class="app-shell">
      <header class="page-header">
        <h1>Investment Purchase Tracker</h1>
        <p>Local-only storage in IndexedDB. Totals reflect current purchase filters and include active, non-archived records only.</p>
      </header>

      <section class="card">
        <h2>Settings</h2>
        <form id="settings-form" class="inline-form">
          <label>
            Currency code
            <input name="currencyCode" value="${l((te("currencyCode")||S).toUpperCase())}" maxlength="3" required />
          </label>
          <button type="submit">Save settings</button>
        </form>
      </section>

      <section class="grid-two">
        <section class="card">
          <h2>Create Category</h2>
          <form id="category-form" class="stack-form">
            <label>Name<input name="name" required /></label>
            <label>Parent category
              <select name="parentId">
                <option value="">(root)</option>
                ${s}
              </select>
            </label>
            <button type="submit">Add category</button>
          </form>
        </section>

        <section class="card">
          <h2>Create Purchase</h2>
          <form id="purchase-form" class="stack-form">
            <label>Date<input type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label>Product name<input name="productName" required /></label>
            <label>Quantity<input type="number" step="any" min="0" name="quantity" required /></label>
            <label>Total price<input type="number" step="0.01" min="0" name="totalPrice" required /></label>
            <label>Per-item price (optional)<input type="number" step="0.01" min="0" name="unitPrice" /></label>
            <label>Category
              <select name="categoryId" required>
                <option value="">Select category</option>
                ${s}
              </select>
            </label>
            <label class="checkbox-row"><input type="checkbox" name="active" checked /> Active (counts in totals)</label>
            <label>Notes (optional)<textarea name="notes" rows="2"></textarea></label>
            <button type="submit">Add purchase</button>
          </form>
        </section>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Categories List</h2>
          <label class="checkbox-row"><input type="checkbox" data-action="toggle-show-archived-categories" ${u.showArchivedCategories?"checked":""}/> Show archived</label>
        </div>
        ${H("categoriesList","Category list")}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${t.map(d=>`<th>${l(d.label)}</th>`).join("")}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${p||`<tr><td colspan="${t.length+1}" class="empty-cell">No categories</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Category Totals</h2>
        <p class="muted">Totals reflect current purchase filters and count only active, non-archived purchases.</p>
        <div class="table-wrap compact-table">
          <table>
            <thead><tr><th>Category</th><th>Total</th></tr></thead>
            <tbody>
              ${b||'<tr><td colspan="2" class="empty-cell">No visible categories</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Purchases Table</h2>
          <label class="checkbox-row"><input type="checkbox" data-action="toggle-show-archived-purchases" ${u.showArchivedPurchases?"checked":""}/> Show archived</label>
        </div>
        ${H("purchasesTable","Purchases")}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                ${e.map(d=>`<th>${l(d.label)}</th>`).join("")}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${c||`<tr><td colspan="${e.length+1}" class="empty-cell">No purchases</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Data Tools</h2>
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" data-action="refresh-export">Refresh export</button>
              <button type="button" data-action="download-json">Download JSON</button>
              <button type="button" data-action="download-csv">Download CSV</button>
            </div>
            <label>Export / Copy JSON
              <textarea id="export-text" rows="10" readonly>${l(o)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input type="file" id="import-file" accept="application/json,.json" />
              <button type="button" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label>Import JSON (replace all)
              <textarea id="import-text" rows="10" placeholder='Paste ExportBundleV1 JSON here'>${l(u.importText)}</textarea>
            </label>
          </div>
        </div>
        <div class="danger-zone">
          <h3>Wipe All Data</h3>
          <p>Hard delete all IndexedDB data (purchases, categories, settings). This is separate from archive/restore.</p>
          <label>Type DELETE to confirm <input id="wipe-confirm" /></label>
          <button type="button" class="danger-btn" data-action="wipe-all">Wipe all data</button>
        </div>
      </section>
    </div>
  `}function Oe(){return{schemaVersion:1,exportedAt:h(),settings:u.settings,categories:u.categories,purchases:u.purchases}}function O(){return JSON.stringify(Oe(),null,2)}function je(){const e=["id","purchaseDate","productName","quantity","totalPriceCents","unitPriceCents","unitPriceSource","categoryId","categoryPath","active","archived","archivedAt","notes","createdAt","updatedAt"],t=u.purchases.map(a=>[a.id,a.purchaseDate,a.productName,String(a.quantity),String(a.totalPriceCents),String(a.unitPriceCents??""),a.unitPriceSource,a.categoryId,re(a.categoryId),String(a.active),String(a.archived),a.archivedAt||"",a.notes||"",a.createdAt,a.updatedAt]),r=a=>{const n=String(a??"");return/[",\n]/.test(n)?`"${n.replace(/"/g,'""')}"`:n};return[e.map(r).join(","),...t.map(a=>a.map(r).join(","))].join(`
`)}function K(e,t,r){const a=new Blob([t],{type:r}),n=URL.createObjectURL(a),i=document.createElement("a");i.href=n,i.download=e,i.click(),URL.revokeObjectURL(n)}async function ke(e){const t=new FormData(e),r=String(t.get("currencyCode")||"").trim().toUpperCase();if(!/^[A-Z]{3}$/.test(r)){alert("Currency code must be a 3-letter code like USD.");return}await G("currencyCode",r),await g()}async function Le(e){const t=new FormData(e),r=String(t.get("name")||"").trim(),a=String(t.get("parentId")||"").trim();if(!r)return;const n=a||null,i=h(),s=u.categories.filter(c=>c.parentId===n).length,o={id:crypto.randomUUID(),name:r,parentId:n,pathIds:[],pathNames:[],depth:0,sortOrder:s,isArchived:!1,createdAt:i,updatedAt:i};await k(o),e.reset(),await g()}async function Me(e){var w;const t=new FormData(e),r=String(t.get("purchaseDate")||""),a=String(t.get("productName")||"").trim(),n=Number(t.get("quantity")),i=_(String(t.get("totalPrice")||"")),s=String(t.get("unitPrice")||""),o=s.trim()?_(s):null,c=String(t.get("categoryId")||""),p=t.get("active")==="on",b=String(t.get("notes")||"").trim();if(!r||!a||!c){alert("Date, product name, and category are required.");return}if(!Number.isFinite(n)||n<=0){alert("Quantity must be greater than 0.");return}if(i==null||i<0){alert("Total price is invalid.");return}if(s.trim()&&(o==null||o<0)){alert("Per-item price is invalid.");return}if(!M(c)){alert("Select a valid category.");return}const d=h(),y={id:crypto.randomUUID(),purchaseDate:r,productName:a,quantity:n,totalPriceCents:i,unitPriceCents:o??Math.round(i/n),unitPriceSource:o!=null?"entered":"derived",categoryId:c,active:p,archived:!1,notes:b||void 0,createdAt:d,updatedAt:d};await j(y),e.reset(),(w=e.querySelector('input[name="purchaseDate"]'))==null||w.setAttribute("value",new Date().toISOString().slice(0,10)),e.querySelector('input[name="purchaseDate"]').value=new Date().toISOString().slice(0,10),e.querySelector('input[name="active"]').checked=!0,await g()}async function qe(e,t){const r=await Y(e);r&&(r.active=t,r.updatedAt=h(),await j(r),await g())}async function Be(e,t){const r=await Y(e);r&&(r.archived=t,r.archivedAt=t?h():void 0,r.updatedAt=h(),await j(r),await g())}async function Ve(e,t){const r=De(u.categories,e),a=h();for(const n of r){const i=await Z(n);i&&(i.isArchived=t,i.archivedAt=t?a:void 0,i.updatedAt=a,await k(i))}await g()}async function Fe(e){var a;const t=await Z(e);if(!t)return;const r=(a=window.prompt("Rename category",t.name))==null?void 0:a.trim();!r||r===t.name||(t.name=r,t.updatedAt=h(),await k(t),await g())}function Re(e){const t=h();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Ue(e){const t=h(),r=Number(e.quantity),a=Number(e.totalPriceCents);if(!Number.isFinite(r)||r<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(a))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const n=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:r,totalPriceCents:a,unitPriceCents:n,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function _e(){const e=u.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1){alert("Unsupported schemaVersion. Expected 1.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const r=X(t.categories.map(Re)),a=new Set(r.map(o=>o.id)),n=t.purchases.map(Ue);for(const o of n)if(!a.has(o.categoryId))throw new Error(`Purchase ${o.id} references missing categoryId ${o.categoryId}`);const i=Array.isArray(t.settings)?t.settings.map(o=>({key:String(o.key),value:o.value})):[{key:"currencyCode",value:S}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await ve({purchases:n,categories:r,settings:i}),m({importText:""}),await g()}catch(r){alert(r instanceof Error?r.message:"Import failed.")}}function Je(e){return e.target instanceof HTMLElement?e.target:null}function He(e){const t=e.dataset.viewId,r=e.dataset.field,a=e.dataset.op,n=e.dataset.value,i=e.dataset.label;if(!t||!r||!a||n==null||!i)return;let s={filters:Se(u.filters,{viewId:t,field:r,op:a,value:n,label:i})};t==="purchasesTable"&&r==="archived"&&n==="true"&&!u.showArchivedPurchases&&(s.showArchivedPurchases=!0),t==="categoriesList"&&(r==="isArchived"||r==="archived")&&n==="true"&&!u.showArchivedCategories&&(s.showArchivedCategories=!0),m(s)}I.addEventListener("click",async e=>{const t=Je(e);if(!t)return;const r=t.closest("[data-action]");if(!r)return;const a=r.dataset.action;if(a){if(a==="add-filter"){He(r);return}if(a==="remove-filter"){const n=r.dataset.filterId;if(!n)return;m({filters:Ie(u.filters,n)});return}if(a==="clear-filters"){const n=r.dataset.viewId;if(!n)return;m({filters:Ae(u.filters,n)});return}if(a==="toggle-show-archived-purchases"){m({showArchivedPurchases:r.checked});return}if(a==="toggle-show-archived-categories"){m({showArchivedCategories:r.checked});return}if(a==="toggle-purchase-active"){const n=r.dataset.id,i=r.dataset.nextActive==="true";n&&await qe(n,i);return}if(a==="toggle-purchase-archived"){const n=r.dataset.id,i=r.dataset.nextArchived==="true";n&&await Be(n,i);return}if(a==="toggle-category-subtree-archived"){const n=r.dataset.id,i=r.dataset.nextArchived==="true";n&&await Ve(n,i);return}if(a==="rename-category"){const n=r.dataset.id;n&&await Fe(n);return}if(a==="refresh-export"){m({exportText:O()});return}if(a==="download-json"){K(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,O(),"application/json");return}if(a==="download-csv"){K(`investment-tracker-${new Date().toISOString().slice(0,10)}.csv`,je(),"text/csv;charset=utf-8");return}if(a==="replace-import"){await _e();return}if(a==="wipe-all"){const n=document.querySelector("#wipe-confirm");if(!n||n.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await we(),m({filters:[],exportText:"",importText:"",showArchivedPurchases:!1,showArchivedCategories:!1}),await g();return}}});I.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await ke(t);return}if(t.id==="category-form"){await Le(t);return}if(t.id==="purchase-form"){await Me(t);return}}});I.addEventListener("input",e=>{const t=e.target;(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement)&&t.id==="import-text"&&(u={...u,importText:t.value})});I.addEventListener("change",async e=>{var n;const t=e.target;if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const r=(n=t.files)==null?void 0:n[0];if(!r)return;const a=await r.text();m({importText:a})});g();
