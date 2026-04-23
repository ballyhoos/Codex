(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=n(a);fetch(a.href,o)}})();const Fe=(e,t)=>t.some(n=>e instanceof n);let et,tt;function Ut(){return et||(et=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function _t(){return tt||(tt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Oe=new WeakMap,De=new WeakMap,Te=new WeakMap;function zt(e){const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{n(Y(e.result)),a()},i=()=>{r(e.error),a()};e.addEventListener("success",o),e.addEventListener("error",i)});return Te.set(t,e),t}function Ht(e){if(Oe.has(e))return;const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{n(),a()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Oe.set(e,t)}let Be={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Oe.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Y(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function ht(e){Be=e(Be)}function Kt(e){return _t().includes(e)?function(...t){return e.apply(je(this),t),Y(this.request)}:function(...t){return Y(e.apply(je(this),t))}}function Xt(e){return typeof e=="function"?Kt(e):(e instanceof IDBTransaction&&Ht(e),Fe(e,Ut())?new Proxy(e,Be):e)}function Y(e){if(e instanceof IDBRequest)return zt(e);if(De.has(e))return De.get(e);const t=Xt(e);return t!==e&&(De.set(e,t),Te.set(t,e)),t}const je=e=>Te.get(e);function Zt(e,t,{blocked:n,upgrade:r,blocking:a,terminated:o}={}){const i=indexedDB.open(e,t),s=Y(i);return r&&i.addEventListener("upgradeneeded",l=>{r(Y(i.result),l.oldVersion,l.newVersion,Y(i.transaction),l)}),n&&i.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),a&&l.addEventListener("versionchange",c=>a(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const Qt=["get","getKey","getAll","getAllKeys","count"],Wt=["put","add","delete","clear"],Ne=new Map;function at(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Ne.get(t))return Ne.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,a=Wt.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(a||Qt.includes(n)))return;const o=async function(i,...s){const l=this.transaction(i,a?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(s.shift())),(await Promise.all([c[n](...s),a&&l.done]))[0]};return Ne.set(t,o),o}ht(e=>({...e,get:(t,n,r)=>at(t,n)||e.get(t,n,r),has:(t,n)=>!!at(t,n)||e.has(t,n)}));const Yt=["continue","continuePrimaryKey","advance"],nt={},Ge=new WeakMap,gt=new WeakMap,Jt={get(e,t){if(!Yt.includes(t))return e[t];let n=nt[t];return n||(n=nt[t]=function(...r){Ge.set(this,gt.get(this)[t](...r))}),n}};async function*ea(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,Jt);for(gt.set(n,t),Te.set(n,je(t));t;)yield n,t=await(Ge.get(n)||t.continue()),Ge.delete(n)}function rt(e,t){return t===Symbol.asyncIterator&&Fe(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Fe(e,[IDBIndex,IDBObjectStore])}ht(e=>({...e,get(t,n,r){return rt(t,n)?ea:e.get(t,n,r)},has(t,n){return rt(t,n)||e.has(t,n)}}));const B=Zt("investment_purchase_tracker",3,{async upgrade(e,t,n,r){const a=r,o=e.objectStoreNames.contains("purchases")?a.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?r.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?r.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.archived!="boolean"&&(c.archived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function ta(){return(await B).getAll("inventory")}async function Se(e){await(await B).put("inventory",e)}async function He(e){return(await B).get("inventory",e)}async function aa(e){await(await B).delete("inventory",e)}async function na(){return(await B).getAll("categories")}async function Ie(e){await(await B).put("categories",e)}async function vt(e){return(await B).get("categories",e)}async function ra(e){await(await B).delete("categories",e)}async function oa(){return(await B).getAll("settings")}async function V(e,t){await(await B).put("settings",{key:e,value:t})}async function wt(e){const n=(await B).transaction(["inventory","categories","settings"],"readwrite");await n.objectStore("inventory").clear(),await n.objectStore("categories").clear(),await n.objectStore("settings").clear();for(const r of e.purchases)await n.objectStore("inventory").put(r);for(const r of e.categories)await n.objectStore("categories").put(r);for(const r of e.settings)await n.objectStore("settings").put(r);await n.done}async function ia(){const t=(await B).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function ot(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function sa(e,t){return e.some(r=>r.viewId===t.viewId&&r.field===t.field&&r.op===t.op&&r.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ct(e,t){const n=new Set([t]);let r=!0;for(;r;){r=!1;for(const a of e)a.linkedToFilterId&&n.has(a.linkedToFilterId)&&!n.has(a.id)&&(n.add(a.id),r=!0)}return e.filter(a=>!n.has(a.id))}function la(e,t){return e.filter(n=>n.viewId!==t)}function Ue(e,t,n,r,a){const o=t.filter(s=>s.viewId===n);if(!o.length)return e;const i=new Map(r.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var p;const c=i.get(l.field);if(!c)return!0;const u=c.getValue(s);if(l.op==="eq")return String(u)===l.value;if(l.op==="isEmpty")return ot(u);if(l.op==="isNotEmpty")return!ot(u);if(l.op==="contains")return String(u).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const w=((p=a==null?void 0:a.categoryDescendantsMap)==null?void 0:p.get(l.value))||new Set([l.value]),b=String(u);return w.has(b)}return!0}))}function ca(e){const t=new Map(e.map(r=>[r.id,r])),n=new Map;for(const r of e){const a=n.get(r.parentId)||[];a.push(r),n.set(r.parentId,a)}return{byId:t,children:n}}function Me(e){const{children:t}=ca(e),n=new Map;function r(a){const o=new Set([a]);for(const i of t.get(a)||[])for(const s of r(i.id))o.add(s);return n.set(a,o),o}for(const a of e)n.has(a.id)||r(a.id);return n}function Ke(e){const t=new Map(e.map(r=>[r.id,r]));function n(r){const a=[],o=[],i=new Set;let s=r;for(;s&&!i.has(s.id);)i.add(s.id),a.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:a,names:o,depth:Math.max(0,a.length-1)}}return e.map(r=>{const a=n(r);return{...r,pathIds:a.ids,pathNames:a.names,depth:a.depth}})}function St(e,t){return[...Me(e).get(t)||new Set([t])]}function da(e,t){const n=Me(t),r=new Map;for(const a of t){const o=n.get(a.id)||new Set([a.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);r.set(a.id,i)}return r}const It=document.querySelector("#app");if(!It)throw new Error("#app not found");const C=It;var yt;const ua=((yt=document.querySelector('meta[name="app-build-version"]'))==null?void 0:yt.content)||"dev";let M={kind:"none"},de=null,Z=null,K=null,R=null,F=null,it=!1,ge=null,Le=!1,Pe=null,pe=null,ke=null,st=!1,lt=!1,ae=new Set,ct=!1,ve=null,le=null,fe=null,ce=null,me=null,L=!1,O=0,J=null,dt=0;const ut=new Map,_e={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"themeId",value:"classic"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!0}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,spotCode:"XAU",isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,spotCode:"XAG",isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},ne=JSON.stringify(_e);function $e(){return[{id:crypto.randomUUID(),viewId:"categoriesList",field:"active",op:"eq",value:"true",label:"Active: Yes"},{id:crypto.randomUUID(),viewId:"inventoryTable",field:"active",op:"eq",value:"true",label:"Active: Yes"}]}let f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:$t(365),reportDateTo:new Date().toISOString().slice(0,10),filters:$e(),showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:ne,storageUsageBytes:null,storageQuotaBytes:null};const re="USD",oe="$",Xe="classic",be=!1,xe=!0,kt=15e3,pa=1100,fa=60*60*1e3,ma=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}],ba=[{value:"classic",label:"Classic"},{value:"hedgee-fintech",label:"Hedgee Fintech"}];function ya(e){return e==="classic"||e==="hedgee-fintech"}function ie(e){return ya(e)?e:Xe}function U(){return new Date().toISOString()}function ha(e){let t=null;for(const n of e)!n.active||n.archived||/^\d{4}-\d{2}-\d{2}$/.test(n.purchaseDate)&&(!t||n.purchaseDate<t)&&(t=n.purchaseDate);return t}function $t(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function qe(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let n=e,r=0;for(;n>=1024&&r<t.length-1;)n/=1024,r+=1;return`${n>=10||r===0?n.toFixed(0):n.toFixed(1)} ${t[r]}`}function $(e){const t=E("currencySymbol")||oe,n=Math.abs(e)/100,r=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);return`${e<0?"-":""}${t}${r}`}function Ae(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const n=Number(t);return Number.isFinite(n)?Math.round(n*100):null}function ga(e){return e.trim().toUpperCase().replace(/\s+/g,"")}function va(e){const t=e.replace(/[\/_-]/g,""),r={XAG:{metal:"XAG"},XAU:{metal:"XAU"},SILVER:{metal:"XAG"},GOLD:{metal:"XAU"},XAGUSD:{metal:"XAG",quoteCurrency:"USD"},XAUUSD:{metal:"XAU",quoteCurrency:"USD"}}[t];if(r)return{kind:"bullion",metal:r.metal,quoteCurrency:r.quoteCurrency,normalizedCode:t};let a=t.match(/^(XAG|XAU)([A-Z]{3})$/);return a?{kind:"bullion",metal:a[1],quoteCurrency:a[2],normalizedCode:t}:(a=t.match(/^(SILVER|GOLD)([A-Z]{3})$/),a?{kind:"bullion",metal:a[1]==="SILVER"?"XAG":"XAU",quoteCurrency:a[2],normalizedCode:t}:null)}function wa(e){const t=ga(e);if(!t)return null;const n=va(t);return n||(/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(t)?{kind:"equity",symbol:t,normalizedCode:t}:null)}function Ze(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string")return null;const t=Number(e.replace(/,/g,"").trim());return Number.isFinite(t)?t:null}function ye(e,t="",n=[]){if(e==null)return n;const r=Ze(e);if(r!=null)return n.push({path:t,value:r}),n;if(Array.isArray(e))return e.forEach((a,o)=>ye(a,`${t}[${o}]`,n)),n;if(typeof e=="object")for(const[a,o]of Object.entries(e)){const i=t?`${t}.${a}`:a;ye(o,i,n)}return n}function Qe(e,t){var o;const n=t.map(i=>i.toLowerCase()),r=e.find(i=>{const s=i.path.toLowerCase();return n.some(l=>s.includes(l))});if(r)return r.value;const a=e.find(i=>{const s=i.path.toLowerCase();return s.includes("price")||s.includes("rate")||s.includes("value")});return a?a.value:((o=e[0])==null?void 0:o.value)??null}async function Ce(e,t){const n=Date.now(),r=Math.max(0,dt+pa-n);r>0&&await new Promise(l=>window.setTimeout(l,r));const a=new URL("https://www.alphavantage.co/query");for(const[l,c]of Object.entries(e))a.searchParams.set(l,c);a.searchParams.set("apikey",t),dt=Date.now();const o=await fetch(a.toString());if(!o.ok)throw new Error(`Request failed (${o.status}).`);const i=await o.json(),s=typeof i.Note=="string"?i.Note:typeof i.Information=="string"?i.Information:null;if(s){const l=s.toLowerCase();throw l.includes("per second")||l.includes("rate limit")||l.includes("25 requests per day")?new Error("Alpha Vantage limit reached. Please wait and retry (free tier: 1 req/sec, 25/day)."):new Error(s)}if(typeof i["Error Message"]=="string")throw new Error(String(i["Error Message"]));return i}function xt(e){var a;const t=(a=e["Realtime Currency Exchange Rate"])==null?void 0:a["5. Exchange Rate"],n=Ze(t);if(n!=null&&n>0)return n;const r=ye(e);return Qe(r,["exchange rate","rate"])}function Ca(e){const t=e["Global Quote"],n=Ze(t==null?void 0:t["05. price"]);if(n!=null)return n;const r=ye(e);return Qe(r,["global quote","price","close"])}function Sa(e,t){const n=ye(e);return Qe(n,[...t==="XAG"?["silver","xag"]:["gold","xau"],"price","rate","value"])}function Ia(e){const t=["currency","Currency","quote_currency","QuoteCurrency","to_currency"];for(const r of t){const a=e[r];if(typeof a=="string"){const o=a.trim().toUpperCase();if(/^[A-Z]{3}$/.test(o))return o}}const n=Object.entries(e).filter(([,r])=>typeof r=="string");for(const[r,a]of n){const o=a.trim().toUpperCase();if(!/^[A-Z]{3}$/.test(o))continue;if(r.toLowerCase().includes("currency"))return o}return null}async function ka(e,t,n){if(e===t)return 1;const r=`${e}->${t}`,a=ut.get(r);if(a&&Date.now()-a.cachedAt<fa)return a.rate;const o=await Ce({function:"CURRENCY_EXCHANGE_RATE",from_currency:e,to_currency:t},n),i=xt(o);if(i==null||i<=0)throw new Error("Could not parse FX exchange rate.");return ut.set(r,{rate:i,cachedAt:Date.now()}),i}function $a(e){return e.toUpperCase().endsWith(".AX")?"AUD":null}function We(){J!=null&&(window.clearTimeout(J),J=null)}function E(e){var t;return(t=f.settings.find(n=>n.key===e))==null?void 0:t.value}function xa(e){var o,i;const t=(o=e.find(s=>s.key==="darkMode"))==null?void 0:o.value,n=typeof t=="boolean"?t:be,r=(i=e.find(s=>s.key==="themeId"))==null?void 0:i.value,a=ie(r);document.documentElement.setAttribute("data-bs-theme",n?"dark":"light"),document.documentElement.setAttribute("data-app-theme",a)}function j(e){f={...f,...e},q()}function At(e){le!=null&&(window.clearTimeout(le),le=null),fe=e,q(),e&&(le=window.setTimeout(()=>{le=null,fe=null,q()},3500))}function _(e){ce!=null&&(window.clearTimeout(ce),ce=null),me=e,q(),e&&(ce=window.setTimeout(()=>{ce=null,me=null,q()},5e3))}function Q(e){M.kind==="none"&&document.activeElement instanceof HTMLElement&&(de=document.activeElement),M=e,q()}function z(){M.kind!=="none"&&(M={kind:"none"},L=!1,We(),q(),de&&de.isConnected&&de.focus(),de=null)}function Ee(e){const t=e.querySelector('[data-action="refresh-spot-value"]'),n=e.querySelector('[data-role="spot-refresh-status"]');return{button:t,status:n}}function X(e,t,n){const{status:r}=Ee(e);if(!r)return;r.textContent=n,r.classList.remove("text-body-secondary","text-success","text-warning","text-danger");const a={muted:"text-body-secondary",success:"text-success",warning:"text-warning",danger:"text-danger"};r.classList.add(a[t])}function ue(e){const{button:t}=Ee(e);if(!t)return;const n=Date.now()<O;t.disabled=L||n,t.textContent=L?"Getting latest spot value...":"Get latest spot value"}async function Tt(e,t,n){const r=wa(e);if(!r)throw new Error("Unsupported spot code format.");let a=null,o=null;if(r.kind==="bullion"){const s=await Ce({function:"GOLD_SILVER_SPOT",symbol:r.metal},n);if(a=Sa(s,r.metal),o=r.quoteCurrency||Ia(s)||"USD",a==null||a<=0){const l=r.quoteCurrency||o||"USD",c=await Ce({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.metal,to_currency:l},n);a=xt(c),o=l}}else{const s=await Ce({function:"GLOBAL_QUOTE",symbol:r.symbol},n);if(a=Ca(s),a==null||a<=0)throw new Error("Could not parse quote price for this symbol.");o=$a(r.symbol)||t}if(a==null||a<=0)throw new Error("Could not parse a valid price for this code.");(!o||!/^[A-Z]{3}$/.test(o))&&(o=t);let i=a;if(o!==t){const s=await ka(o,t,n);i=a*s}if(!Number.isFinite(i)||i<=0)throw new Error("Received invalid price after conversion.");return Math.round(i*100)}async function Aa(e){if(L)return;const t=e.querySelector('input[name="mode"]'),n=e.querySelector('select[name="evaluationMode"]'),r=e.querySelector('input[name="spotCode"]'),a=e.querySelector('input[name="spotValue"]');if(!t||t.value!=="edit"||!n||n.value!=="spot"||!r||!a)return;const o=r.value.trim();if(!o){X(e,"warning","Set a code before refreshing.");return}if(Date.now()<O){const l=Math.max(1,Math.ceil((O-Date.now())/1e3));X(e,"muted",`Please wait ${l}s before refreshing again.`),ue(e);return}const i=String(E("alphaVantageApiKey")||"").trim();if(!i){X(e,"warning","Set Alpha Vantage API Key in Settings first.");return}const s=String(E("currencyCode")||re).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(s)){X(e,"danger","Invalid app currency setting.");return}L=!0,ue(e),X(e,"muted","Refreshing latest value...");try{const l=await Tt(o,s,i);a.value=te(l),X(e,"success","Value refreshed.")}catch(l){const c=l instanceof Error?l.message:"Refresh failed.";X(e,"danger",c)}finally{L=!1,O=Date.now()+kt,ue(e),We();const l=Math.max(0,O-Date.now());J=window.setTimeout(()=>{J=null;const c=C.querySelector("#category-form");if(c){ue(c);const{status:u}=Ee(c);u&&u.classList.contains("text-body-secondary")&&(u.textContent="")}q()},l)}}async function Ta(e){if(L)return;const t=A(e);if(!t){_({tone:"danger",text:"Market not found."});return}if(t.evaluationMode!=="spot"){_({tone:"warning",text:"Refresh is only available for Spot markets."});return}const n=(t.spotCode||"").trim();if(!n){_({tone:"warning",text:"Set a market code before refreshing."});return}if(Date.now()<O){const o=Math.max(1,Math.ceil((O-Date.now())/1e3));_({tone:"warning",text:`Please wait ${o}s before refreshing again.`});return}const r=String(E("alphaVantageApiKey")||"").trim();if(!r){_({tone:"warning",text:"Set Alpha Vantage API Key in Settings first."});return}const a=String(E("currencyCode")||re).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(a)){_({tone:"danger",text:"Invalid app currency setting."});return}L=!0,_({tone:"warning",text:`Refreshing latest spot price for ${t.name}...`});try{const o=await Tt(n,a,r),i={...t,spotValueCents:o,updatedAt:U()};await Ie(i),await P(),_({tone:"success",text:`${t.name} spot value updated to ${$(o)}.`})}catch(o){const i=o instanceof Error?o.message:"Refresh failed.";_({tone:"danger",text:i})}finally{L=!1,O=Date.now()+kt,We();const o=Math.max(0,O-Date.now());J=window.setTimeout(()=>{J=null;const i=C.querySelector("#category-form");if(i){ue(i);const{status:s}=Ee(i);s&&s.classList.contains("text-body-secondary")&&(s.textContent="")}q()},o),q()}}function Mt(){return C.querySelector(".modal-panel")}function Et(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Ma(){if(M.kind==="none")return;const e=Mt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(Et(e)[0]||e).focus()}function Ea(){var e,t;(e=Z==null?void 0:Z.destroy)==null||e.call(Z),(t=K==null?void 0:K.destroy)==null||t.call(K),Z=null,K=null}function ze(){var i;const e=window,t=e.DataTable,n=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!n){Pe==null&&(Pe=window.setTimeout(()=>{Pe=null,ze(),q()},500)),Le||(Le=!0,window.addEventListener("load",()=>{Le=!1,ze(),q()},{once:!0}));return}const r=C.querySelector("#categories-table"),a=C.querySelector("#inventory-table"),o=(s,l)=>{var c,u;return t?new t(s,l):n?((u=(c=n(s)).DataTable)==null?void 0:u.call(c,l))??null:null};r&&(Z=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),a&&(K=o(a,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Ra(a,K))}function Da(e){return e.map(t=>{const n=t.startValueCents??0,r=t.endValueCents??0;return!Number.isFinite(n)||!Number.isFinite(r)||n<=0&&r<=0?null:{id:t.marketId,label:t.marketLabel,startCents:n,endCents:r,changeCents:r-n}}).filter(t=>t!=null).sort((t,n)=>n.endCents-t.endCents)}function we(e,t){const n=C.querySelector(`#${e}`),r=C.querySelector(`[data-chart-empty-for="${e}"]`);n&&n.classList.add("d-none"),r&&(r.textContent=t,r.hidden=!1)}function pt(e){const t=C.querySelector(`#${e}`),n=C.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),n&&(n.hidden=!0)}function Na(){R==null||R.dispose(),F==null||F.dispose(),R=null,F=null}function La(){it||(it=!0,window.addEventListener("resize",()=>{ge!=null&&window.clearTimeout(ge),ge=window.setTimeout(()=>{ge=null,R==null||R.resize(),F==null||F.resize()},120)}))}function Pa(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const n=e.get(t.parentId)||[];n.push(t.id),e.set(t.parentId,n)}for(const t of e.values())t.sort();return e}function qa(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function Va(e){const t="markets-allocation-chart",n="markets-top-chart",r=C.querySelector(`#${t}`),a=C.querySelector(`#${n}`);if(!r||!a)return;if(!window.echarts){we(t,"Chart unavailable: ECharts not loaded."),we(n,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){we(t,"No eligible market totals to chart."),we(n,"No eligible market totals to chart.");return}pt(t),pt(n);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=ie(document.documentElement.getAttribute("data-app-theme")),l=o?12:14,c=s==="hedgee-fintech"?["#135dff","#00b894","#14b8ff","#ffb020","#f15a5a","#6658ff","#27c77b","#ff8f3d"]:["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],u=s==="hedgee-fintech"?"#00b894":"#20c997",p=s==="hedgee-fintech"?"#f15a5a":"#dc3545",w=s==="hedgee-fintech"?"#14b8ff":"#0dcaf0",b=s==="hedgee-fintech"?"rgba(19, 93, 255, 0.12)":"rgba(108, 117, 125, 0.1)",g=i?"#e9ecef":"#212529",N=i?"#ced4da":"#495057",S=e.map(v=>({name:v.label,value:v.endCents})),y=e.slice(0,5),h=[...y].reverse();new Map(h.map(v=>[v.label,v]));const T=y.reduce((v,D)=>Math.max(v,D.endCents),0),G=T>0?Math.ceil(T*1.2):1;R=window.echarts.init(r),F=window.echarts.init(a),R.setOption({color:c,tooltip:{trigger:"item",textStyle:{fontSize:l},formatter:v=>`${d(v.name)}: ${$(v.value)} (${v.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,left:12,icon:"circle",textStyle:{color:g,fontSize:l}}:{orient:"vertical",left:12,top:"center",icon:"circle",textStyle:{color:g,fontSize:l}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["54%","50%"],data:S,avoidLabelOverlap:!1,itemStyle:{borderColor:i?"#11161d":"#ffffff",borderWidth:3},labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:l,textBorderWidth:0,formatter:v=>{const D=v.percent??0;return`${Math.round(D)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:N,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),F.setOption({color:[u],grid:{left:"4%",right:"10%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:l},formatter:v=>{var k,I;const D=(k=v[0])==null?void 0:k.name;if(!D)return"";const he=((I=v.find(x=>x.seriesName==="End"))==null?void 0:I.value)??0,H=h.find(x=>x.label===D),se=(H==null?void 0:H.changeCents)??0,m=se>0?"+":"";return`${d(D)}<br/>End: ${$(he)}<br/>Change: ${m}${$(se)}`}},xAxis:{type:"value",max:G,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:h.map(v=>v.label),axisLabel:{color:N,fontSize:l,formatter:v=>qa(v)},axisTick:{show:!1},axisLine:{show:!1}},series:[{name:"End",type:"bar",data:h.map(v=>({value:v.endCents,itemStyle:{color:v.changeCents>0?u:v.changeCents<0?p:w}})),barWidth:30,barCategoryGap:"12%",barGap:"0%",showBackground:!0,backgroundStyle:{color:b},label:{show:!0,position:"right",distance:6,color:g,fontSize:l,formatter:v=>{const D=h[v.dataIndex];return!D||D.changeCents===0?"":`${D.changeCents>0?"+":""}${$(D.changeCents)}`}}}]}),window.requestAnimationFrame(()=>{R==null||R.resize(),F==null||F.resize()}),La()}function Ra(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",n=>{var p,w,b;const r=n.target,a=r==null?void 0:r.closest("thead th");if(!a)return;const o=a.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(a);if(s<0||s===i.length-1)return;n.preventDefault(),n.stopPropagation();const l=(p=t.order)==null?void 0:p.call(t),c=Array.isArray(l)?l[0]:void 0,u=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(w=t.order)==null||w.call(t,[[s,u]]),(b=t.draw)==null||b.call(t,!1)},!0)}async function P(){var p,w;const[e,t,n]=await Promise.all([ta(),na(),oa()]),r=Ke(t).sort((b,g)=>b.sortOrder-g.sortOrder||b.name.localeCompare(g.name));n.some(b=>b.key==="currencyCode")||(await V("currencyCode",re),n.push({key:"currencyCode",value:re})),n.some(b=>b.key==="currencySymbol")||(await V("currencySymbol",oe),n.push({key:"currencySymbol",value:oe})),n.some(b=>b.key==="darkMode")||(await V("darkMode",be),n.push({key:"darkMode",value:be}));const a=n.find(b=>b.key==="themeId"),o=ie(a==null?void 0:a.value);a?a.value!==o&&(await V("themeId",o),a.value=o):(await V("themeId",o),n.push({key:"themeId",value:o})),n.some(b=>b.key==="showMarketsGraphs")||(await V("showMarketsGraphs",xe),n.push({key:"showMarketsGraphs",value:xe})),xa(n);let i=null,s=null;try{const b=await((w=(p=navigator.storage)==null?void 0:p.estimate)==null?void 0:w.call(p));i=typeof(b==null?void 0:b.usage)=="number"?b.usage:null,s=typeof(b==null?void 0:b.quota)=="number"?b.quota:null}catch{i=null,s=null}let l=f.reportDateFrom,c=f.reportDateTo,u=f.importText;if(r.length>0&&u===ne?u="":r.length===0&&!u.trim()&&(u=ne),!ct){const b=ha(e);b&&(l=b),c=new Date().toISOString().slice(0,10),ct=!0}f={...f,inventoryRecords:e,categories:r,settings:n,storageUsageBytes:i,storageQuotaBytes:s,reportDateFrom:l,reportDateTo:c,importText:u},q()}function A(e){if(e)return f.categories.find(t=>t.id===e)}function Fa(e){const t=A(e);return t?t.pathNames.join(" / "):"-"}function Oa(e){return Fa(e)}function Ba(e){const t=A(e);return t?t.pathIds.some(n=>{var r;return((r=A(n))==null?void 0:r.active)===!1}):!1}function ja(e){const t=A(e.categoryId);if(!t)return!1;for(const n of t.pathIds){const r=A(n);if((r==null?void 0:r.active)===!1)return!0}return!1}function Ga(e){return e.active&&!ja(e)}function te(e){return e==null?"":(e/100).toFixed(2)}function Ye(e){const t=e.querySelector('input[name="quantity"]'),n=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="unitPrice"]');if(!t||!n||!r)return;const a=Number(t.value),o=Ae(n.value);if(!Number.isFinite(a)||a<=0||o==null||o<0){r.value="";return}r.value=(Math.round(o/a)/100).toFixed(2)}function Dt(e){const t=e.querySelector('input[name="mode"]'),n=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="baselineValue"]'),a=e.querySelector('input[name="baselineValueDisplay"]');!t||!n||!r||(t.value==="create"&&(r.value=n.value),a&&(a.value=r.value||n.value))}function Nt(e){const t=e.querySelector('select[name="categoryId"]'),n=e.querySelector("[data-quantity-group]"),r=e.querySelector('input[name="quantity"]'),a=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!n||!r)return;const l=A(t.value),c=(l==null?void 0:l.evaluationMode)==="spot",u=(l==null?void 0:l.evaluationMode)==="snapshot";n.hidden=!c,c?r.readOnly=!1:((!Number.isFinite(Number(r.value))||Number(r.value)<=0)&&(r.value="1"),r.readOnly=!0),a&&(a.hidden=!u),u&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function Je(e){const t=e.querySelector('select[name="evaluationMode"]'),n=e.querySelector("[data-spot-value-group]"),r=e.querySelector('input[name="spotValue"]'),a=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]'),i=e.querySelector("[data-spot-refresh-group]"),s=e.querySelector('[data-action="refresh-spot-value"]');if(!t||!n||!r||!a||!o)return;const l=t.value==="spot",c=String(E("alphaVantageApiKey")||"").trim().length>0;n.hidden=!l,r.disabled=!l,a.hidden=!(l&&c),o.disabled=!(l&&c);const u=o.value.trim().length>0;i&&(i.hidden=!(l&&u&&c)),s&&(s.disabled=!l||!u||!c||L||Date.now()<O)}function W(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function Lt(e){return e.active&&!e.archived}function Pt(){const e=f.inventoryRecords.filter(Lt),t=f.categories.filter(o=>!o.isArchived),n=da(e,t),r=new Map(f.categories.map(o=>[o.id,o])),a=new Map;for(const o of e){const i=r.get(o.categoryId);if(i)for(const s of i.pathIds)a.set(s,(a.get(s)||0)+o.quantity)}return{categoryTotals:n,categoryQty:a}}function qt(e,t){const n=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=n.get(o.parentId)||[];i.push(o),n.set(o.parentId,i)});const r=new Map,a=o=>{const i=r.get(o);if(i!=null)return i;const s=A(o);if(!s||s.isArchived)return r.set(o,0),0;let l=0;const c=n.get(s.id)||[];return c.length>0?l=c.reduce((u,p)=>u+a(p.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,r.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||a(o.id)}),r}function Vt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>Oa(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=A(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=A(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=A(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=A(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?$(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>$(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Yes":"No",filterable:!0,filterOp:"eq"}]}function Ua(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":$(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function Rt(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function _a(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function za(){const e=Vt(),t=Ua(),n=t.filter(p=>p.key==="name"||p.key==="parent"||p.key==="path"),r=t.filter(p=>p.key!=="name"&&p.key!=="parent"&&p.key!=="path"),a=Me(f.categories),o=Ue(Rt(),f.filters,"inventoryTable",e,{categoryDescendantsMap:a}),{categoryTotals:i,categoryQty:s}=Pt(),l=qt(i,s),c=[...n,{key:"computedQty",label:"Qty",getValue:p=>s.get(p.id)||0,getDisplay:p=>String(s.get(p.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:p=>i.get(p.id)||0,getDisplay:p=>$(i.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},...r,{key:"computedTotalCents",label:"Total",getValue:p=>l.get(p.id)||0,getDisplay:p=>$(l.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:p=>p.active&&!p.isArchived,getDisplay:p=>p.active&&!p.isArchived?"Yes":"No",filterable:!0,filterOp:"eq"}],u=Ue(_a(),f.filters,"categoriesList",c);return{inventoryColumns:e,categoryColumns:c,categoryDescendantsMap:a,filteredInventoryRecords:o,filteredCategories:u,categoryTotals:i,categoryQty:s}}function ft(e,t,n=""){const r=f.filters.filter(a=>a.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${r.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${r.map(a=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${d(a.label)}"
                  aria-label="Remove filter: ${d(a.label)}"
                  data-action="remove-filter"
                  data-filter-id="${a.id}"
                >${d(a.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${n?`<div class="chips-clear-btn">${n}</div>`:""}
    </div>
  `}function Ve(e,t,n){const r=n.getValue(t),a=n.getDisplay(t),o=r==null?"":String(r),i=n.align==="right"?"text-end":n.align==="center"?"text-center":"text-start";if(!n.filterable)return d(a);if(a.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(n.key)}" data-op="isEmpty" data-value="" data-label="${d(`${n.label}: Empty`)}" title="Filter ${d(n.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&n.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),c=Ba(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(n.key)}" data-op="${d(n.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${n.label}: ${a}`)}"><span class="filter-hit">${d(a)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&n.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(n.key)}" data-op="${d(n.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${n.label}: ${a}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(a)}</span></button>`}if(e==="categoriesList"&&(n.key==="name"||n.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(n.key)}" data-op="${d(n.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${n.label}: ${a}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(a)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(n.key)}" data-op="${d(n.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${n.label}: ${a}`)}"><span class="filter-hit">${d(a)}</span></button>`}function Ft(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function Ha(e,t){const n=e.map((r,a)=>{let o=0,i=!1;for(const l of t){const c=r.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(o+=c,i=!0)}const s=i?String(r.key).toLowerCase().includes("cents")?$(o):Ft(o):a===0?"Totals":"";return`<th class="${W(r)}">${d(s)}</th>`});return n.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${n.join("")}</tr></tfoot>`}function Ka(e,t){const n=new Set(t.map(i=>i.id)),r=t.filter(i=>!i.parentId||!n.has(i.parentId)),a=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=a.has(String(i.key))?r:t;let c=0,u=!1;for(const w of l){const b=i.getValue(w);typeof b=="number"&&Number.isFinite(b)&&(c+=b,u=!0)}const p=u?String(i.key).toLowerCase().includes("cents")?$(c):Ft(c):s===0?"Totals":"";return`<th class="${W(i)}">${d(p)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function mt(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function Xa(e,t){const n=[...e];return n.filter(a=>{for(const o of n){if(o===a)continue;const i=t.get(o);if(i!=null&&i.has(a))return!1}return!0})}function Za(e){const t=new Set(f.filters.filter(r=>r.viewId==="categoriesList").map(r=>r.id)),n=new Set(f.filters.filter(r=>r.viewId==="inventoryTable"&&r.field==="categoryId"&&r.op==="inCategorySubtree"&&!!r.linkedToFilterId&&t.has(r.linkedToFilterId)).map(r=>r.value));return n.size>0?Xa(n,e):f.categories.filter(r=>!r.isArchived&&r.active&&r.parentId==null).map(r=>r.id)}function Qa(e){const t=Za(e),n=Pa(),{categoryTotals:r,categoryQty:a}=Pt(),o=qt(r,a),i=new Map;for(const S of f.inventoryRecords){if(!Lt(S))continue;const y=S.baselineValueCents??0;if(!Number.isFinite(y))continue;const h=A(S.categoryId);if(h)for(const T of h.pathIds)i.set(T,(i.get(T)||0)+y)}const s=[],l={};let c=0,u=0,p=0,w=0;const b=S=>{const y=A(S);if(!y)return null;const h=i.get(S)||0,T=o.get(S)||0,G=T-h,v=h>0?G/h:null;return{marketId:S,marketLabel:y.pathNames.join(" / "),startValueCents:h,endValueCents:T,contributionsCents:T-h,netGrowthCents:G,growthPct:v}},g=new Set,N=S=>g.has(S)?[]:(g.add(S),(n.get(S)||[]).map(y=>b(y)).filter(y=>y!=null).sort((y,h)=>y.marketLabel.localeCompare(h.marketLabel)));for(const S of t){const y=b(S);y&&(l[S]=N(S),c+=y.startValueCents||0,u+=y.endValueCents||0,p+=y.contributionsCents||0,w+=y.netGrowthCents||0,s.push(y))}return p=u-c,w=u-c,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:c,endTotalCents:u,contributionsTotalCents:p,netGrowthTotalCents:w,hasManualSnapshots:!1}}function Re(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function ee(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function Wa(){if(M.kind==="none")return"";const e=E("currencySymbol")||oe,t=String(E("alphaVantageApiKey")||"").trim().length>0,n=(r,a)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(r!=null&&r.has(o.id))).map(o=>`<option value="${o.id}" ${a===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(M.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((E("currencyCode")||re).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${ma.map(r=>`<option value="${d(r.value)}" ${(E("currencySymbol")||oe)===r.value?"selected":""}>${d(r.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-label mb-0">
                  Theme
                  <select class="form-select" name="themeId">
                    ${ba.map(r=>`<option value="${r.value}" ${ie(E("themeId"))===r.value?"selected":""}>${d(r.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-label mb-0">
                  Alpha Vantage API Key
                  <input class="form-control" name="alphaVantageApiKey" autocomplete="off" value="${d(E("alphaVantageApiKey")||"")}" />
                  <span class="form-text">
                    API key required to retrieve live spot pricing. Request one from
                    <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">Alpha Vantage</a>.
                    Free plan limit: 1 request/second, 25 requests/day.
                  </span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${E("darkMode")??be?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${E("showMarketsGraphs")??xe?"checked":""} />
                  <span class="form-check-label">Show Markets graphs</span>
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
    `;if(M.kind==="categoryCreate"||M.kind==="categoryEdit"){const r=M.kind==="categoryEdit",a=M.kind==="categoryEdit"?A(M.categoryId):void 0;if(r&&!a)return"";const o=r&&a?f.inventoryRecords.filter(l=>l.categoryId===a.id).sort((l,c)=>c.purchaseDate.localeCompare(l.purchaseDate)):[],i=r&&a?new Set(St(f.categories,a.id)):void 0,s=Me(f.categories);return Ue(Rt(),f.filters,"inventoryTable",Vt(),{categoryDescendantsMap:s}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${r?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${r?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${d((a==null?void 0:a.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${d((a==null?void 0:a.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${n(i,(a==null?void 0:a.parentId)||null)}
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
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(te(a==null?void 0:a.spotValueCents))}" ${(a==null?void 0:a.evaluationMode)==="spot"?"":"disabled"} />
              </div>
              ${r?`<span data-spot-refresh-group ${(a==null?void 0:a.evaluationMode)==="spot"&&(a.spotCode||"").trim()&&t?"":"hidden"}>
                     <button
                       type="button"
                       class="baseline-value-link mt-1 small"
                       data-action="refresh-spot-value"
                       ${L||Date.now()<O?"disabled":""}
                     >${L?"Getting latest spot value...":"Get latest spot value"}</button>
                     <span
                       class="small text-body-secondary ms-2"
                       data-role="spot-refresh-status"
                       aria-live="polite"
                     ></span>
                   </span>`:""}
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(a==null?void 0:a.evaluationMode)==="spot"&&t?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${d((a==null?void 0:a.spotCode)||"")}"
                ${(a==null?void 0:a.evaluationMode)==="spot"&&t?"":"disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a?a.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            ${r?`
              <div>
                <div class="small fw-semibold mb-1">Linked Investments (${o.length})</div>
                ${o.length>0?`<div class="table-wrap table-responsive">
                        <table class="table table-striped table-sm align-middle mb-0 dataTable">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th class="text-end">Value</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${o.map(l=>`<tr>
                                <td><button type="button" class="btn btn-link p-0 align-baseline" data-action="edit-inventory" data-id="${d(l.id)}">${d(l.productName)}</button></td>
                                <td class="text-end">${d($(l.totalPriceCents))}</td>
                                <td>${d(l.purchaseDate)}</td>
                              </tr>`).join("")}
                          </tbody>
                        </table>
                      </div>`:'<div class="small text-body-secondary">No investments are currently linked to this market.</div>'}
              </div>
            `:""}
            <div class="modal-footer px-0 pb-0">
              ${r&&a?`<button type="button" class="btn btn-danger me-auto" data-action="delete-category-record" data-id="${a.id}">Delete</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${r?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(M.kind==="inventoryCreate")return`
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
            <input type="hidden" name="baselineValue" value="" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId">
                <option value="">Select market</option>
                ${n()}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled />
              </div>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="" disabled />
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
    `;if(M.kind==="inventoryEdit"){const r=M,a=f.inventoryRecords.find(o=>o.id===r.inventoryId);return a?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${d(a.id)}" />
            <input type="hidden" name="baselineValue" value="${d(te(a.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${d(a.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId">
                <option value="">Select market</option>
                ${n(void 0,a.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${d(a.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${d(String(a.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(te(a.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="${d(te(a.baselineValueCents??a.totalPriceCents))}" disabled />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(te(a.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${a.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${d(a.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <div class="d-flex gap-2 me-auto">
                <button type="button" class="btn btn-danger" data-action="delete-inventory-record" data-id="${a.id}">Delete</button>
              </div>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function q(){const e=window.scrollX,t=window.scrollY,n=C.querySelector('details[data-section="data-tools"]');n&&(st=n.open);const r=C.querySelector('details[data-section="investments"]');r&&(lt=r.open),Na(),Ea();const{inventoryColumns:a,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=za(),c=Qa(i),u=Da(c.rows),p=E("showMarketsGraphs")??xe,w=l.some(m=>m.parentId==null),b=p&&w&&u.length>0,g=new Set([...ae].filter(m=>{var k;return(((k=c.childRowsByParent[m])==null?void 0:k.length)||0)>0}));g.size!==ae.size&&(ae=g);const N=c.startTotalCents>0?c.netGrowthTotalCents/c.startTotalCents:null,S=f.exportText||Ot(),y=s.map(m=>`
        <tr class="${[Ga(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${a.map(I=>`<td class="${W(I)}">${Ve("inventoryTable",m,I)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),h=new Set(l.map(m=>m.id)),T=new Map;for(const m of l){const k=m.parentId&&h.has(m.parentId)?m.parentId:null,I=T.get(k)||[];I.push(m),T.set(k,I)}for(const m of T.values())m.sort((k,I)=>k.sortOrder-I.sortOrder||k.name.localeCompare(I.name));const G=[],v=(m,k)=>{const I=T.get(m)||[];for(const x of I)G.push({category:x,depth:k}),v(x.id,k+1)};v(null,0);const D=String(E("alphaVantageApiKey")||"").trim().length>0,he=G.map(({category:m,depth:k})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${o.map(I=>{if(I.key==="name"){const x=k>0?(k-1)*1.1:0;return`<td class="${W(I)}"><div class="market-name-wrap" style="padding-left:${x.toFixed(2)}rem">${k>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Ve("categoriesList",m,I)}</div></td>`}return`<td class="${W(I)}">${Ve("categoriesList",m,I)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            ${m.evaluationMode==="spot"&&(m.spotCode||"").trim()&&D?`<button
                     type="button"
                     class="btn btn-sm btn-outline-primary action-menu-btn"
                     data-action="refresh-category-spot"
                     data-id="${m.id}"
                     title="Get latest spot price"
                     aria-label="Get latest spot price"
                     ${L||Date.now()<O?"disabled":""}
                   >Spot</button><span class="actions-separator" aria-hidden="true">|</span>`:""}
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");C.innerHTML=`
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
        ${fe?`<div class="alert alert-${fe.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(fe.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          ${b?`
            <div class="markets-widget-grid mb-0">
              <article class="markets-widget-card card border-0">
                <div class="card-body p-0 p-md-1">
                  <div class="markets-chart-frame">
                    <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                    <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
                  </div>
                </div>
              </article>
              <article class="markets-widget-card card border-0">
                <div class="card-body p-0 p-md-1">
                  <div class="markets-chart-frame">
                    <div id="markets-allocation-chart" class="markets-chart-canvas" role="img" aria-label="Market allocation chart"></div>
                    <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-allocation-chart" hidden></p>
                  </div>
                </div>
              </article>
            </div>
          `:""}
          <p class="small text-body-secondary mb-2">
            Scope: ${c.scopeMarketIds.length?`${c.scopeMarketIds.length} market${c.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
          </p>
          ${c.rows.length===0?`
            <p class="mb-0 text-body-secondary">No growth data available for this scope.</p>
          `:`
            <div class="table-wrap table-responsive">
              <table class="table table-striped table-sm align-middle mb-0 dataTable">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th class="text-end">Start</th>
                    <th class="text-end">End</th>
                    <th class="text-end">Growth</th>
                    <th class="text-end">Growth %</th>
                  </tr>
                </thead>
                <tbody>
                  ${c.rows.map(m=>{const k=c.childRowsByParent[m.marketId]||[],I=ae.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${k.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${I?"Collapse":"Expand"} child markets">${I?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d($(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d($(m.endValueCents))}</td>
                      <td class="text-end ${ee(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d($(m.netGrowthCents))}</td>
                      <td class="text-end ${ee(m.growthPct)}">${d(Re(m.growthPct))}</td>
                      </tr>
                      ${k.map(x=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(m.marketId)}" ${I?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(x.marketLabel)}</td>
                              <td class="text-end">${x.startValueCents==null?"—":d($(x.startValueCents))}</td>
                              <td class="text-end">${x.endValueCents==null?"—":d($(x.endValueCents))}</td>
                              <td class="text-end ${ee(x.netGrowthCents)}">${x.netGrowthCents==null?"—":d($(x.netGrowthCents))}</td>
                              <td class="text-end ${ee(x.growthPct)}">${d(Re(x.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d($(c.startTotalCents))}</th>
                    <th class="text-end">${d($(c.endTotalCents))}</th>
                    <th class="text-end ${ee(c.netGrowthTotalCents)}">${d($(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${ee(N)}">${d(Re(N))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        ${f.categories.length===0?`
          <div class="alert alert-warning py-2 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2" role="status">
            <span class="small mb-0">No markets yet. You can load the default markets template.</span>
            <button type="button" class="btn btn-sm btn-warning" data-action="load-default-markets">Load Default Markets</button>
          </div>
        `:""}
        <div class="section-head markets-section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end markets-section-actions">
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${me?`<div class="alert alert-${me.tone} py-1 px-2 mb-2 small" role="status">${d(me.text)}</div>`:""}
        ${ft("categoriesList","Markets","")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(m=>`<th class="${W(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${he}
            </tbody>
            ${Ka(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${lt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-primary" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${ft("inventoryTable","Investments","")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${a.map(m=>`<th class="${W(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${y}
              </tbody>
              ${Ha(a,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${st?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(qe(f.storageUsageBytes)):`${d(qe(f.storageUsageBytes))} of ${d(qe(f.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Export</button>
          </div>
          <label class="form-label mb-0">Export / Copy JSON
            <input class="form-control" id="export-text" readonly value="${d(S)}" />
          </label>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Import</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="replace-import">Import</button>
          </div>
          <div class="toolbar-row">
            <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
          </div>
          <label class="form-label mb-0">Import JSON (replace all)
            <input class="form-control" id="import-text" placeholder='Paste ExportBundleV1/V2 JSON here' value="${d(f.importText)}" />
          </label>
        </div>
        <div class="danger-zone border border-danger-subtle rounded-3 p-3 mt-3 bg-danger-subtle">
          <div class="data-tool-head mb-2">
            <h3 class="h6 mb-0">Delete Data</h3>
            <button type="button" class="danger-btn btn btn-danger btn-sm" data-action="wipe-all">Delete</button>
          </div>
          <p class="mb-2">Hard delete all IndexedDB data (inventory, categories, settings). This is separate from archive/restore.</p>
          <label class="form-label">Type DELETE to confirm <input class="form-control" id="wipe-confirm" /></label>
        </div>
        </div>
      </details>

      <footer class="app-version-footer text-end text-body-secondary small">
        App version: ${d(ua)}
      </footer>
    </div>
    ${Wa()}
  `;const H=C.querySelector("#inventory-form");H&&(Nt(H),Ye(H),Dt(H));const se=C.querySelector("#category-form");se&&Je(se),Ma(),Va(u),ze(),window.scrollTo(e,t)}function Ya(e,t){const n=C.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!n.length)return;for(const a of n)a.hidden=!t;const r=C.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);r&&(r.textContent=t?"▾":"▸",r.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function Ja(){return{schemaVersion:2,exportedAt:U(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function Ot(){return JSON.stringify(Ja())}function en(e,t,n){const r=new Blob([t],{type:n}),a=URL.createObjectURL(r),o=document.createElement("a");o.href=a,o.download=e,o.click(),URL.revokeObjectURL(a)}async function tn(e){const t=new FormData(e),n=String(t.get("currencyCode")||"").trim().toUpperCase(),r=String(t.get("currencySymbol")||"").trim(),a=ie(String(t.get("themeId")||Xe).trim()),o=String(t.get("alphaVantageApiKey")||"").trim(),i=t.get("darkMode")==="on",s=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(n)){alert("Currency code must be a 3-letter code like USD.");return}if(!r){alert("Select a currency symbol.");return}await V("currencyCode",n),await V("currencySymbol",r),await V("themeId",a),await V("alphaVantageApiKey",o),await V("darkMode",i),await V("showMarketsGraphs",s),z(),await P()}async function an(e){const t=new FormData(e),n=String(t.get("mode")||"create"),r=String(t.get("categoryId")||"").trim(),a=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),c=t.get("active")==="on",u=i==="spot"||i==="snapshot"?i:void 0,p=u==="spot"&&s?Ae(s):void 0,w=u==="spot"&&l?l:void 0;if(!a)return;if(u==="spot"&&s&&p==null){alert("Spot value is invalid.");return}const b=p??void 0,g=o||null;if(g&&!A(g)){alert("Select a valid parent market.");return}if(n==="edit"){if(!r)return;const h=await vt(r);if(!h){alert("Market not found.");return}if(g===h.id){alert("A category cannot be its own parent.");return}if(g&&St(f.categories,h.id).includes(g)){alert("A category cannot be moved under its own subtree.");return}const T=h.parentId!==g;h.name=a,h.parentId=g,h.evaluationMode=u,h.spotValueCents=b,h.spotCode=w,h.active=c,T&&(h.sortOrder=f.categories.filter(G=>G.parentId===g&&G.id!==h.id).length),h.updatedAt=U(),await Ie(h),z(),await P();return}const N=U(),S=f.categories.filter(h=>h.parentId===g).length,y={id:crypto.randomUUID(),name:a,parentId:g,pathIds:[],pathNames:[],depth:0,sortOrder:S,evaluationMode:u,spotValueCents:b,spotCode:w,active:c,isArchived:!1,createdAt:N,updatedAt:N};await Ie(y),z(),await P()}async function nn(e){const t=new FormData(e),n=String(t.get("mode")||"create"),r=String(t.get("inventoryId")||"").trim(),a=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=Ae(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),c=l===""?null:Ae(l),u=n==="create"?s??void 0:c??void 0,p=String(t.get("categoryId")||""),w=t.get("active")==="on",b=String(t.get("notes")||"").trim();if(!a||!o){alert("Date and product name are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(n!=="create"&&c!=null&&c<0){alert("Baseline value is invalid.");return}if(n!=="create"&&l!==""&&c==null){alert("Baseline value is invalid.");return}if(p&&!A(p)){alert("Select a valid category.");return}const g=Math.round(s/i);if(n==="edit"){if(!r)return;const y=await He(r);if(!y){alert("Inventory record not found.");return}y.purchaseDate=a,y.productName=o,y.quantity=i,y.totalPriceCents=s,y.baselineValueCents=u,y.unitPriceCents=g,y.unitPriceSource="derived",y.categoryId=p,y.active=w,y.notes=b||void 0,y.updatedAt=U(),await Se(y),z(),await P();return}const N=U(),S={id:crypto.randomUUID(),purchaseDate:a,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:u,unitPriceCents:g,unitPriceSource:"derived",categoryId:p,active:w,archived:!1,notes:b||void 0,createdAt:N,updatedAt:N};await Se(S),z(),await P()}async function rn(e,t){const n=await He(e);n&&(n.active=t,n.updatedAt=U(),await Se(n),await P())}async function on(e){const t=await He(e);!t||!window.confirm(`Delete investment record "${t.productName}" permanently? This cannot be undone.`)||(await aa(e),z(),await P())}async function sn(e){const t=await vt(e);if(!t)return;const n=f.inventoryRecords.filter(o=>o.categoryId===e).length;if(!window.confirm(`Delete market "${t.pathNames.join(" / ")}"? This cannot be undone.

This will also affect:
- ${n} investment record(s): their Market will be cleared.`))return;const a=U();for(const o of f.inventoryRecords)o.categoryId===e&&(o.categoryId="",o.updatedAt=a,await Se(o));for(const o of f.categories)o.parentId===e&&(o.parentId=null,o.updatedAt=a,await Ie(o));await ra(e),z(),await P()}function Bt(e){const t=U();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function ln(e){const t=U(),n=Number(e.quantity),r=Number(e.totalPriceCents);if(!Number.isFinite(n)||n<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(r))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const a=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:n,totalPriceCents:r,baselineValueCents:Number.isFinite(a)?a:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function cn(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const n=Ke(t.categories.map(Bt)),r=new Set(n.map(s=>s.id)),a=t.purchases.map(ln);for(const s of a)if(!r.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:String(s.key)==="themeId"?ie(s.value):s.value})):[{key:"currencyCode",value:re},{key:"currencySymbol",value:oe},{key:"themeId",value:Xe},{key:"darkMode",value:be}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await wt({purchases:a,categories:n,settings:o}),j({importText:ne}),await P()}catch(n){alert(n instanceof Error?n.message:"Import failed.")}}async function dn(){const e=Ke(_e.categories.map(Bt)),t=_e.settings.map(r=>({key:String(r.key),value:r.value}));window.confirm("Load default markets template and replace all existing data? This will keep no investments.")&&(await wt({purchases:[],categories:e,settings:t}),j({filters:$e(),importText:ne}),await P(),At({tone:"success",text:"Default markets loaded."}))}function jt(e){return e.target instanceof HTMLElement?e.target:null}function bt(e){const t=e.dataset.viewId,n=e.dataset.field,r=e.dataset.op,a=e.dataset.value,o=e.dataset.label;if(!t||!n||!r||a==null||!o)return;const i=(u,p)=>u.viewId===p.viewId&&u.field===p.field&&u.op===p.op&&u.value===p.value;let s=sa(f.filters,{viewId:t,field:n,op:r,value:a,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const u=A(l);if(u){const p=s.find(w=>i(w,{viewId:t,field:n,op:r,value:a}));if(p){const w=`Market: ${u.pathNames.join(" / ")}`;s=s.filter(g=>g.linkedToFilterId!==p.id);const b=s.findIndex(g=>i(g,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id}));if(b>=0){const g=s[b];s=[...s.slice(0,b),{...g,label:w,linkedToFilterId:p.id},...s.slice(b+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id,label:w,linkedToFilterId:p.id}]}}}let c={filters:s};t==="inventoryTable"&&n==="archived"&&a==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),t==="categoriesList"&&(n==="isArchived"||n==="archived")&&a==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),t==="categoriesList"&&n==="active"&&a==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),j(c)}function Gt(){pe!=null&&(window.clearTimeout(pe),pe=null)}function un(e){const t=f.filters.filter(r=>r.viewId===e),n=t[t.length-1];n&&j({filters:Ct(f.filters,n.id)})}C.addEventListener("click",async e=>{const t=jt(e);if(!t)return;const n=t.closest("[data-action]");if(!n)return;const r=n.dataset.action;if(r){if(r==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Gt(),e.detail>1)return;pe=window.setTimeout(()=>{pe=null,bt(n)},220);return}bt(n);return}if(r==="remove-filter"){const a=n.dataset.filterId;if(!a)return;j({filters:Ct(f.filters,a)});return}if(r==="clear-filters"){const a=n.dataset.viewId;if(!a)return;const o=la(f.filters,a),i=$e().find(s=>s.viewId===a);j({filters:i?[...o,i]:o});return}if(r==="open-create-category"){Q({kind:"categoryCreate"});return}if(r==="open-create-inventory"){Q({kind:"inventoryCreate"});return}if(r==="open-settings"){Q({kind:"settings"});return}if(r==="apply-report-range"){const a=C.querySelector('input[name="reportDateFrom"]'),o=C.querySelector('input[name="reportDateTo"]');if(!a||!o)return;const i=a.value,s=o.value,l=mt(i),c=mt(s,!0);if(l==null||c==null||l>c){At({tone:"warning",text:"Select a valid report date range."});return}j({reportDateFrom:i,reportDateTo:s});return}if(r==="reset-report-range"){j({reportDateFrom:$t(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(r==="copy-total-to-baseline"){const a=n.closest("form");if(!(a instanceof HTMLFormElement)||a.id!=="inventory-form")return;const o=a.querySelector('input[name="totalPrice"]'),i=a.querySelector('input[name="baselineValue"]'),s=a.querySelector('input[name="baselineValueDisplay"]'),l=a.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',ve!=null&&window.clearTimeout(ve),ve=window.setTimeout(()=>{ve=null,l.isConnected&&(l.textContent="")},1800));return}if(r==="refresh-spot-value"){const a=n.closest("form");if(!(a instanceof HTMLFormElement)||a.id!=="category-form")return;await Aa(a);return}if(r==="toggle-growth-children"){const a=n.dataset.marketId;if(!a)return;const o=new Set(ae),i=!o.has(a);i?o.add(a):o.delete(a),ae=o,Ya(a,i);return}if(r==="edit-category"){const a=n.dataset.id;a&&Q({kind:"categoryEdit",categoryId:a});return}if(r==="refresh-category-spot"){const a=n.dataset.id;a&&await Ta(a);return}if(r==="edit-inventory"){const a=n.dataset.id;a&&Q({kind:"inventoryEdit",inventoryId:a});return}if(r==="close-modal"||r==="close-modal-backdrop"){if(r==="close-modal-backdrop"&&!t.classList.contains("modal"))return;z();return}if(r==="toggle-inventory-active"){const a=n.dataset.id,o=n.dataset.nextActive==="true";a&&await rn(a,o);return}if(r==="delete-inventory-record"){const a=n.dataset.id;a&&await on(a);return}if(r==="delete-category-record"){const a=n.dataset.id;a&&await sn(a);return}if(r==="download-json"){en(`investments-app-${new Date().toISOString().slice(0,10)}.json`,Ot(),"application/json");return}if(r==="replace-import"){await cn();return}if(r==="load-default-markets"){await dn();return}if(r==="wipe-all"){const a=document.querySelector("#wipe-confirm");if(!a||a.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await ia(),j({filters:$e(),exportText:"",importText:ne,showArchivedInventory:!1,showArchivedCategories:!1}),await P();return}}});C.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Gt(),t.closest("input, select, textarea, label")))return;const n=t.closest("button");if(n&&!n.classList.contains("link-cell")||t.closest("a"))return;const r=t.closest("tr[data-row-edit]");if(!r)return;const a=r.dataset.id,o=r.dataset.rowEdit;if(!(!a||!o)){if(o==="inventory"){Q({kind:"inventoryEdit",inventoryId:a});return}o==="category"&&Q({kind:"categoryEdit",categoryId:a})}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await tn(t);return}if(t.id==="category-form"){await an(t);return}if(t.id==="inventory-form"){await nn(t);return}}});C.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="spotCode"){const n=t.closest("form");n instanceof HTMLFormElement&&n.id==="category-form"&&Je(n)}if(t.name==="quantity"||t.name==="totalPrice"){const n=t.closest("form");n instanceof HTMLFormElement&&n.id==="inventory-form"&&(Ye(n),Dt(n))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});C.addEventListener("change",async e=>{var a;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(Nt(o),Ye(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&Je(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const n=(a=t.files)==null?void 0:a[0];if(!n)return;const r=await n.text();try{j({importText:JSON.stringify(JSON.parse(r))})}catch{j({importText:r})}});C.addEventListener("pointermove",e=>{const t=jt(e);if(!t)return;const n=t.closest("[data-filter-section-view-id]");ke=(n==null?void 0:n.dataset.filterSectionViewId)||null});C.addEventListener("pointerleave",()=>{ke=null});document.addEventListener("keydown",e=>{if(M.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!ke)return;e.preventDefault(),un(ke);return}if(e.key==="Escape"){e.preventDefault(),z();return}if(e.key!=="Tab")return;const t=Mt();if(!t)return;const n=Et(t);if(!n.length){e.preventDefault(),t.focus();return}const r=n[0],a=n[n.length-1],o=document.activeElement;if(e.shiftKey){(o===r||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),a.focus());return}o===a&&(e.preventDefault(),r.focus())});P();
