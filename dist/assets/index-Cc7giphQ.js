(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Ve=(e,t)=>t.some(a=>e instanceof a);let Ye,Je;function jt(){return Ye||(Ye=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Gt(){return Je||(Je=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Re=new WeakMap,Te=new WeakMap,xe=new WeakMap;function Ut(e){const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(Q(e.result)),n()},i=()=>{r(e.error),n()};e.addEventListener("success",o),e.addEventListener("error",i)});return xe.set(t,e),t}function _t(e){if(Re.has(e))return;const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),n()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Re.set(e,t)}let Fe={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Re.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return Q(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function bt(e){Fe=e(Fe)}function zt(e){return Gt().includes(e)?function(...t){return e.apply(Oe(this),t),Q(this.request)}:function(...t){return Q(e.apply(Oe(this),t))}}function Ht(e){return typeof e=="function"?zt(e):(e instanceof IDBTransaction&&_t(e),Ve(e,jt())?new Proxy(e,Fe):e)}function Q(e){if(e instanceof IDBRequest)return Ut(e);if(Te.has(e))return Te.get(e);const t=Ht(e);return t!==e&&(Te.set(e,t),xe.set(t,e)),t}const Oe=e=>xe.get(e);function Kt(e,t,{blocked:a,upgrade:r,blocking:n,terminated:o}={}){const i=indexedDB.open(e,t),s=Q(i);return r&&i.addEventListener("upgradeneeded",l=>{r(Q(i.result),l.oldVersion,l.newVersion,Q(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),n&&l.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const Xt=["get","getKey","getAll","getAllKeys","count"],Zt=["put","add","delete","clear"],De=new Map;function et(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(De.get(t))return De.get(t);const a=t.replace(/FromIndex$/,""),r=t!==a,n=Zt.includes(a);if(!(a in(r?IDBIndex:IDBObjectStore).prototype)||!(n||Xt.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,n?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(s.shift())),(await Promise.all([c[a](...s),n&&l.done]))[0]};return De.set(t,o),o}bt(e=>({...e,get:(t,a,r)=>et(t,a)||e.get(t,a,r),has:(t,a)=>!!et(t,a)||e.has(t,a)}));const Qt=["continue","continuePrimaryKey","advance"],tt={},Be=new WeakMap,yt=new WeakMap,Wt={get(e,t){if(!Qt.includes(t))return e[t];let a=tt[t];return a||(a=tt[t]=function(...r){Be.set(this,yt.get(this)[t](...r))}),a}};async function*Yt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,Wt);for(yt.set(a,t),xe.set(a,Oe(t));t;)yield a,t=await(Be.get(a)||t.continue()),Be.delete(a)}function at(e,t){return t===Symbol.asyncIterator&&Ve(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ve(e,[IDBIndex,IDBObjectStore])}bt(e=>({...e,get(t,a,r){return at(t,a)?Yt:e.get(t,a,r)},has(t,a){return at(t,a)||e.has(t,a)}}));const R=Kt("investment_purchase_tracker",3,{async upgrade(e,t,a,r){const n=r,o=e.objectStoreNames.contains("purchases")?n.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?r.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?r.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const c=l.value;let p=!1;typeof c.active!="boolean"&&(c.active=!0,p=!0),typeof c.archived!="boolean"&&(c.archived=!1,p=!0),p&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let p=!1;typeof c.active!="boolean"&&(c.active=!0,p=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,p=!0),p&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function Jt(){return(await R).getAll("inventory")}async function we(e){await(await R).put("inventory",e)}async function _e(e){return(await R).get("inventory",e)}async function ea(e){await(await R).delete("inventory",e)}async function ta(){return(await R).getAll("categories")}async function Ce(e){await(await R).put("categories",e)}async function ht(e){return(await R).get("categories",e)}async function aa(e){await(await R).delete("categories",e)}async function na(){return(await R).getAll("settings")}async function G(e,t){await(await R).put("settings",{key:e,value:t})}async function gt(e){const a=(await R).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const r of e.purchases)await a.objectStore("inventory").put(r);for(const r of e.categories)await a.objectStore("categories").put(r);for(const r of e.settings)await a.objectStore("settings").put(r);await a.done}async function ra(){const t=(await R).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function nt(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function oa(e,t){return e.some(r=>r.viewId===t.viewId&&r.field===t.field&&r.op===t.op&&r.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function vt(e,t){const a=new Set([t]);let r=!0;for(;r;){r=!1;for(const n of e)n.linkedToFilterId&&a.has(n.linkedToFilterId)&&!a.has(n.id)&&(a.add(n.id),r=!0)}return e.filter(n=>!a.has(n.id))}function ia(e,t){return e.filter(a=>a.viewId!==t)}function je(e,t,a,r,n){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(r.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var u;const c=i.get(l.field);if(!c)return!0;const p=c.getValue(s);if(l.op==="eq")return String(p)===l.value;if(l.op==="isEmpty")return nt(p);if(l.op==="isNotEmpty")return!nt(p);if(l.op==="contains")return String(p).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const v=((u=n==null?void 0:n.categoryDescendantsMap)==null?void 0:u.get(l.value))||new Set([l.value]),g=String(p);return v.has(g)}return!0}))}function sa(e){const t=new Map(e.map(r=>[r.id,r])),a=new Map;for(const r of e){const n=a.get(r.parentId)||[];n.push(r),a.set(r.parentId,n)}return{byId:t,children:a}}function Ae(e){const{children:t}=sa(e),a=new Map;function r(n){const o=new Set([n]);for(const i of t.get(n)||[])for(const s of r(i.id))o.add(s);return a.set(n,o),o}for(const n of e)a.has(n.id)||r(n.id);return a}function ze(e){const t=new Map(e.map(r=>[r.id,r]));function a(r){const n=[],o=[],i=new Set;let s=r;for(;s&&!i.has(s.id);)i.add(s.id),n.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:n,names:o,depth:Math.max(0,n.length-1)}}return e.map(r=>{const n=a(r);return{...r,pathIds:n.ids,pathNames:n.names,depth:n.depth}})}function wt(e,t){return[...Ae(e).get(t)||new Set([t])]}function la(e,t){const a=Ae(t),r=new Map;for(const n of t){const o=a.get(n.id)||new Set([n.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);r.set(n.id,i)}return r}const Ct=document.querySelector("#app");if(!Ct)throw new Error("#app not found");const C=Ct;var mt;const ca=((mt=document.querySelector('meta[name="app-build-version"]'))==null?void 0:mt.content)||"dev";let A={kind:"none"},se=null,K=null,z=null,P=null,q=null,rt=!1,ye=null,Ee=!1,Le=null,ce=null,Se=null,ot=!1,it=!1,te=new Set,st=!1,he=null,oe=null,de=null,ie=null,ue=null,D=!1,V=0,W=null,lt=0;const ct=new Map,Ge={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!0}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,spotCode:"XAU",isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,spotCode:"XAG",isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},ae=JSON.stringify(Ge);function Ie(){return[{id:crypto.randomUUID(),viewId:"categoriesList",field:"active",op:"eq",value:"true",label:"Active: Yes"},{id:crypto.randomUUID(),viewId:"inventoryTable",field:"active",op:"eq",value:"true",label:"Active: Yes"}]}let f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:It(365),reportDateTo:new Date().toISOString().slice(0,10),filters:Ie(),showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:ae,storageUsageBytes:null,storageQuotaBytes:null};const ne="USD",re="$",pe=!1,ke=!0,St=15e3,da=1100,ua=60*60*1e3,pa=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function B(){return new Date().toISOString()}function fa(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function It(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function Ne(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,r=0;for(;a>=1024&&r<t.length-1;)a/=1024,r+=1;return`${a>=10||r===0?a.toFixed(0):a.toFixed(1)} ${t[r]}`}function S(e){const t=T("currencySymbol")||re,a=Math.abs(e)/100,r=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(a);return`${e<0?"-":""}${t}${r}`}function $e(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function ma(e){return e.trim().toUpperCase().replace(/\s+/g,"")}function ba(e){const t=e.replace(/[\/_-]/g,""),r={XAG:{metal:"XAG"},XAU:{metal:"XAU"},SILVER:{metal:"XAG"},GOLD:{metal:"XAU"},XAGUSD:{metal:"XAG",quoteCurrency:"USD"},XAUUSD:{metal:"XAU",quoteCurrency:"USD"}}[t];if(r)return{kind:"bullion",metal:r.metal,quoteCurrency:r.quoteCurrency,normalizedCode:t};let n=t.match(/^(XAG|XAU)([A-Z]{3})$/);return n?{kind:"bullion",metal:n[1],quoteCurrency:n[2],normalizedCode:t}:(n=t.match(/^(SILVER|GOLD)([A-Z]{3})$/),n?{kind:"bullion",metal:n[1]==="SILVER"?"XAG":"XAU",quoteCurrency:n[2],normalizedCode:t}:null)}function ya(e){const t=ma(e);if(!t)return null;const a=ba(t);return a||(/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(t)?{kind:"equity",symbol:t,normalizedCode:t}:null)}function He(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string")return null;const t=Number(e.replace(/,/g,"").trim());return Number.isFinite(t)?t:null}function fe(e,t="",a=[]){if(e==null)return a;const r=He(e);if(r!=null)return a.push({path:t,value:r}),a;if(Array.isArray(e))return e.forEach((n,o)=>fe(n,`${t}[${o}]`,a)),a;if(typeof e=="object")for(const[n,o]of Object.entries(e)){const i=t?`${t}.${n}`:n;fe(o,i,a)}return a}function Ke(e,t){var o;const a=t.map(i=>i.toLowerCase()),r=e.find(i=>{const s=i.path.toLowerCase();return a.some(l=>s.includes(l))});if(r)return r.value;const n=e.find(i=>{const s=i.path.toLowerCase();return s.includes("price")||s.includes("rate")||s.includes("value")});return n?n.value:((o=e[0])==null?void 0:o.value)??null}async function ve(e,t){const a=Date.now(),r=Math.max(0,lt+da-a);r>0&&await new Promise(l=>window.setTimeout(l,r));const n=new URL("https://www.alphavantage.co/query");for(const[l,c]of Object.entries(e))n.searchParams.set(l,c);n.searchParams.set("apikey",t),lt=Date.now();const o=await fetch(n.toString());if(!o.ok)throw new Error(`Request failed (${o.status}).`);const i=await o.json(),s=typeof i.Note=="string"?i.Note:typeof i.Information=="string"?i.Information:null;if(s){const l=s.toLowerCase();throw l.includes("per second")||l.includes("rate limit")||l.includes("25 requests per day")?new Error("Alpha Vantage limit reached. Please wait and retry (free tier: 1 req/sec, 25/day)."):new Error(s)}if(typeof i["Error Message"]=="string")throw new Error(String(i["Error Message"]));return i}function kt(e){var n;const t=(n=e["Realtime Currency Exchange Rate"])==null?void 0:n["5. Exchange Rate"],a=He(t);if(a!=null&&a>0)return a;const r=fe(e);return Ke(r,["exchange rate","rate"])}function ha(e){const t=e["Global Quote"],a=He(t==null?void 0:t["05. price"]);if(a!=null)return a;const r=fe(e);return Ke(r,["global quote","price","close"])}function ga(e,t){const a=fe(e);return Ke(a,[...t==="XAG"?["silver","xag"]:["gold","xau"],"price","rate","value"])}function va(e){const t=["currency","Currency","quote_currency","QuoteCurrency","to_currency"];for(const r of t){const n=e[r];if(typeof n=="string"){const o=n.trim().toUpperCase();if(/^[A-Z]{3}$/.test(o))return o}}const a=Object.entries(e).filter(([,r])=>typeof r=="string");for(const[r,n]of a){const o=n.trim().toUpperCase();if(!/^[A-Z]{3}$/.test(o))continue;if(r.toLowerCase().includes("currency"))return o}return null}async function wa(e,t,a){if(e===t)return 1;const r=`${e}->${t}`,n=ct.get(r);if(n&&Date.now()-n.cachedAt<ua)return n.rate;const o=await ve({function:"CURRENCY_EXCHANGE_RATE",from_currency:e,to_currency:t},a),i=kt(o);if(i==null||i<=0)throw new Error("Could not parse FX exchange rate.");return ct.set(r,{rate:i,cachedAt:Date.now()}),i}function Ca(e){return e.toUpperCase().endsWith(".AX")?"AUD":null}function Xe(){W!=null&&(window.clearTimeout(W),W=null)}function T(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function Sa(e){var r;const t=(r=e.find(n=>n.key==="darkMode"))==null?void 0:r.value,a=typeof t=="boolean"?t:pe;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function O(e){f={...f,...e},L()}function $t(e){oe!=null&&(window.clearTimeout(oe),oe=null),de=e,L(),e&&(oe=window.setTimeout(()=>{oe=null,de=null,L()},3500))}function j(e){ie!=null&&(window.clearTimeout(ie),ie=null),ue=e,L(),e&&(ie=window.setTimeout(()=>{ie=null,ue=null,L()},5e3))}function X(e){A.kind==="none"&&document.activeElement instanceof HTMLElement&&(se=document.activeElement),A=e,L()}function U(){A.kind!=="none"&&(A={kind:"none"},D=!1,Xe(),L(),se&&se.isConnected&&se.focus(),se=null)}function Me(e){const t=e.querySelector('[data-action="refresh-spot-value"]'),a=e.querySelector('[data-role="spot-refresh-status"]');return{button:t,status:a}}function H(e,t,a){const{status:r}=Me(e);if(!r)return;r.textContent=a,r.classList.remove("text-body-secondary","text-success","text-warning","text-danger");const n={muted:"text-body-secondary",success:"text-success",warning:"text-warning",danger:"text-danger"};r.classList.add(n[t])}function le(e){const{button:t}=Me(e);if(!t)return;const a=Date.now()<V;t.disabled=D||a,t.textContent=D?"Getting latest spot value...":"Get latest spot value"}async function xt(e,t,a){const r=ya(e);if(!r)throw new Error("Unsupported spot code format.");let n=null,o=null;if(r.kind==="bullion"){const s=await ve({function:"GOLD_SILVER_SPOT",symbol:r.metal},a);if(n=ga(s,r.metal),o=r.quoteCurrency||va(s)||"USD",n==null||n<=0){const l=r.quoteCurrency||o||"USD",c=await ve({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.metal,to_currency:l},a);n=kt(c),o=l}}else{const s=await ve({function:"GLOBAL_QUOTE",symbol:r.symbol},a);if(n=ha(s),n==null||n<=0)throw new Error("Could not parse quote price for this symbol.");o=Ca(r.symbol)||t}if(n==null||n<=0)throw new Error("Could not parse a valid price for this code.");(!o||!/^[A-Z]{3}$/.test(o))&&(o=t);let i=n;if(o!==t){const s=await wa(o,t,a);i=n*s}if(!Number.isFinite(i)||i<=0)throw new Error("Received invalid price after conversion.");return Math.round(i*100)}async function Ia(e){if(D)return;const t=e.querySelector('input[name="mode"]'),a=e.querySelector('select[name="evaluationMode"]'),r=e.querySelector('input[name="spotCode"]'),n=e.querySelector('input[name="spotValue"]');if(!t||t.value!=="edit"||!a||a.value!=="spot"||!r||!n)return;const o=r.value.trim();if(!o){H(e,"warning","Set a code before refreshing.");return}if(Date.now()<V){const l=Math.max(1,Math.ceil((V-Date.now())/1e3));H(e,"muted",`Please wait ${l}s before refreshing again.`),le(e);return}const i=String(T("alphaVantageApiKey")||"").trim();if(!i){H(e,"warning","Set Alpha Vantage API Key in Settings first.");return}const s=String(T("currencyCode")||ne).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(s)){H(e,"danger","Invalid app currency setting.");return}D=!0,le(e),H(e,"muted","Refreshing latest value...");try{const l=await xt(o,s,i);n.value=ee(l),H(e,"success","Value refreshed.")}catch(l){const c=l instanceof Error?l.message:"Refresh failed.";H(e,"danger",c)}finally{D=!1,V=Date.now()+St,le(e),Xe();const l=Math.max(0,V-Date.now());W=window.setTimeout(()=>{W=null;const c=C.querySelector("#category-form");if(c){le(c);const{status:p}=Me(c);p&&p.classList.contains("text-body-secondary")&&(p.textContent="")}L()},l)}}async function ka(e){if(D)return;const t=$(e);if(!t){j({tone:"danger",text:"Market not found."});return}if(t.evaluationMode!=="spot"){j({tone:"warning",text:"Refresh is only available for Spot markets."});return}const a=(t.spotCode||"").trim();if(!a){j({tone:"warning",text:"Set a market code before refreshing."});return}if(Date.now()<V){const o=Math.max(1,Math.ceil((V-Date.now())/1e3));j({tone:"warning",text:`Please wait ${o}s before refreshing again.`});return}const r=String(T("alphaVantageApiKey")||"").trim();if(!r){j({tone:"warning",text:"Set Alpha Vantage API Key in Settings first."});return}const n=String(T("currencyCode")||ne).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(n)){j({tone:"danger",text:"Invalid app currency setting."});return}D=!0,j({tone:"warning",text:`Refreshing latest spot price for ${t.name}...`});try{const o=await xt(a,n,r),i={...t,spotValueCents:o,updatedAt:B()};await Ce(i),await E(),j({tone:"success",text:`${t.name} spot value updated to ${S(o)}.`})}catch(o){const i=o instanceof Error?o.message:"Refresh failed.";j({tone:"danger",text:i})}finally{D=!1,V=Date.now()+St,Xe();const o=Math.max(0,V-Date.now());W=window.setTimeout(()=>{W=null;const i=C.querySelector("#category-form");if(i){le(i);const{status:s}=Me(i);s&&s.classList.contains("text-body-secondary")&&(s.textContent="")}L()},o),L()}}function At(){return C.querySelector(".modal-panel")}function Mt(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function $a(){if(A.kind==="none")return;const e=At();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(Mt(e)[0]||e).focus()}function xa(){var e,t;(e=K==null?void 0:K.destroy)==null||e.call(K),(t=z==null?void 0:z.destroy)==null||t.call(z),K=null,z=null}function Ue(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){Le==null&&(Le=window.setTimeout(()=>{Le=null,Ue(),L()},500)),Ee||(Ee=!0,window.addEventListener("load",()=>{Ee=!1,Ue(),L()},{once:!0}));return}const r=C.querySelector("#categories-table"),n=C.querySelector("#inventory-table"),o=(s,l)=>{var c,p;return t?new t(s,l):a?((p=(c=a(s)).DataTable)==null?void 0:p.call(c,l))??null:null};r&&(K=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),n&&(z=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Na(n,z))}function Aa(e){return e.map(t=>{const a=t.startValueCents??0,r=t.endValueCents??0;return!Number.isFinite(a)||!Number.isFinite(r)||a<=0&&r<=0?null:{id:t.marketId,label:t.marketLabel,startCents:a,endCents:r,changeCents:r-a}}).filter(t=>t!=null).sort((t,a)=>a.endCents-t.endCents)}function ge(e,t){const a=C.querySelector(`#${e}`),r=C.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),r&&(r.textContent=t,r.hidden=!1)}function dt(e){const t=C.querySelector(`#${e}`),a=C.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Ma(){P==null||P.dispose(),q==null||q.dispose(),P=null,q=null}function Ta(){rt||(rt=!0,window.addEventListener("resize",()=>{ye!=null&&window.clearTimeout(ye),ye=window.setTimeout(()=>{ye=null,P==null||P.resize(),q==null||q.resize()},120)}))}function Da(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Ea(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function La(e){const t="markets-allocation-chart",a="markets-top-chart",r=C.querySelector(`#${t}`),n=C.querySelector(`#${a}`);if(!r||!n)return;if(!window.echarts){ge(t,"Chart unavailable: ECharts not loaded."),ge(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){ge(t,"No eligible market totals to chart."),ge(a,"No eligible market totals to chart.");return}dt(t),dt(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?12:14,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],c=i?"#e9ecef":"#212529",p=i?"#ced4da":"#495057",u=e.map(b=>({name:b.label,value:b.endCents})),v=e.slice(0,5),g=[...v].reverse();new Map(g.map(b=>[b.label,b]));const w=v.reduce((b,y)=>Math.max(b,y.endCents),0),N=w>0?Math.ceil(w*1.2):1;P=window.echarts.init(r),q=window.echarts.init(n),P.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:b=>`${d(b.name)}: ${S(b.value)} (${b.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,left:12,icon:"circle",textStyle:{color:c,fontSize:s}}:{orient:"vertical",left:12,top:"center",icon:"circle",textStyle:{color:c,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["54%","50%"],data:u,avoidLabelOverlap:!1,itemStyle:{borderColor:i?"#11161d":"#ffffff",borderWidth:3},labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:b=>{const y=b.percent??0;return`${Math.round(y)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:p,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),q.setOption({color:["#20c997"],grid:{left:"4%",right:"10%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:b=>{var me,be;const y=(me=b[0])==null?void 0:me.name;if(!y)return"";const h=((be=b.find(_=>_.seriesName==="End"))==null?void 0:be.value)??0,x=g.find(_=>_.label===y),F=(x==null?void 0:x.changeCents)??0,Y=F>0?"+":"";return`${d(y)}<br/>End: ${S(h)}<br/>Change: ${Y}${S(F)}`}},xAxis:{type:"value",max:N,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:g.map(b=>b.label),axisLabel:{color:p,fontSize:s,formatter:b=>Ea(b)},axisTick:{show:!1},axisLine:{show:!1}},series:[{name:"End",type:"bar",data:g.map(b=>({value:b.endCents,itemStyle:{color:b.changeCents>0?"#20c997":b.changeCents<0?"#dc3545":"#0dcaf0"}})),barWidth:30,barCategoryGap:"12%",barGap:"0%",showBackground:!0,backgroundStyle:{color:"rgba(108, 117, 125, 0.1)"},label:{show:!0,position:"right",distance:6,color:c,fontSize:s,formatter:b=>{const y=g[b.dataIndex];return!y||y.changeCents===0?"":`${y.changeCents>0?"+":""}${S(y.changeCents)}`}}}]}),window.requestAnimationFrame(()=>{P==null||P.resize(),q==null||q.resize()}),Ta()}function Na(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var u,v,g;const r=a.target,n=r==null?void 0:r.closest("thead th");if(!n)return;const o=n.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(n);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(u=t.order)==null?void 0:u.call(t),c=Array.isArray(l)?l[0]:void 0,p=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(v=t.order)==null||v.call(t,[[s,p]]),(g=t.draw)==null||g.call(t,!1)},!0)}async function E(){var c,p;const[e,t,a]=await Promise.all([Jt(),ta(),na()]),r=ze(t).sort((u,v)=>u.sortOrder-v.sortOrder||u.name.localeCompare(v.name));a.some(u=>u.key==="currencyCode")||(await G("currencyCode",ne),a.push({key:"currencyCode",value:ne})),a.some(u=>u.key==="currencySymbol")||(await G("currencySymbol",re),a.push({key:"currencySymbol",value:re})),a.some(u=>u.key==="darkMode")||(await G("darkMode",pe),a.push({key:"darkMode",value:pe})),a.some(u=>u.key==="showMarketsGraphs")||(await G("showMarketsGraphs",ke),a.push({key:"showMarketsGraphs",value:ke})),Sa(a);let n=null,o=null;try{const u=await((p=(c=navigator.storage)==null?void 0:c.estimate)==null?void 0:p.call(c));n=typeof(u==null?void 0:u.usage)=="number"?u.usage:null,o=typeof(u==null?void 0:u.quota)=="number"?u.quota:null}catch{n=null,o=null}let i=f.reportDateFrom,s=f.reportDateTo,l=f.importText;if(r.length>0&&l===ae?l="":r.length===0&&!l.trim()&&(l=ae),!st){const u=fa(e);u&&(i=u),s=new Date().toISOString().slice(0,10),st=!0}f={...f,inventoryRecords:e,categories:r,settings:a,storageUsageBytes:n,storageQuotaBytes:o,reportDateFrom:i,reportDateTo:s,importText:l},L()}function $(e){if(e)return f.categories.find(t=>t.id===e)}function Pa(e){const t=$(e);return t?t.pathNames.join(" / "):"-"}function qa(e){return Pa(e)}function Va(e){const t=$(e);return t?t.pathIds.some(a=>{var r;return((r=$(a))==null?void 0:r.active)===!1}):!1}function Ra(e){const t=$(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const r=$(a);if((r==null?void 0:r.active)===!1)return!0}return!1}function Fa(e){return e.active&&!Ra(e)}function ee(e){return e==null?"":(e/100).toFixed(2)}function Ze(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="unitPrice"]');if(!t||!a||!r)return;const n=Number(t.value),o=$e(a.value);if(!Number.isFinite(n)||n<=0||o==null||o<0){r.value="";return}r.value=(Math.round(o/n)/100).toFixed(2)}function Tt(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="baselineValue"]'),n=e.querySelector('input[name="baselineValueDisplay"]');!t||!a||!r||(t.value==="create"&&(r.value=a.value),n&&(n.value=r.value||a.value))}function Dt(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),r=e.querySelector('input[name="quantity"]'),n=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!a||!r)return;const l=$(t.value),c=(l==null?void 0:l.evaluationMode)==="spot",p=(l==null?void 0:l.evaluationMode)==="snapshot";a.hidden=!c,c?r.readOnly=!1:((!Number.isFinite(Number(r.value))||Number(r.value)<=0)&&(r.value="1"),r.readOnly=!0),n&&(n.hidden=!p),p&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function Qe(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),r=e.querySelector('input[name="spotValue"]'),n=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]'),i=e.querySelector("[data-spot-refresh-group]"),s=e.querySelector('[data-action="refresh-spot-value"]');if(!t||!a||!r||!n||!o)return;const l=t.value==="spot",c=String(T("alphaVantageApiKey")||"").trim().length>0;a.hidden=!l,r.disabled=!l,n.hidden=!(l&&c),o.disabled=!(l&&c);const p=o.value.trim().length>0;i&&(i.hidden=!(l&&p&&c)),s&&(s.disabled=!l||!p||!c||D||Date.now()<V)}function Z(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function Et(e){return e.active&&!e.archived}function Lt(){const e=f.inventoryRecords.filter(Et),t=f.categories.filter(o=>!o.isArchived),a=la(e,t),r=new Map(f.categories.map(o=>[o.id,o])),n=new Map;for(const o of e){const i=r.get(o.categoryId);if(i)for(const s of i.pathIds)n.set(s,(n.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:n}}function Nt(e,t){const a=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const r=new Map,n=o=>{const i=r.get(o);if(i!=null)return i;const s=$(o);if(!s||s.isArchived)return r.set(o,0),0;let l=0;const c=a.get(s.id)||[];return c.length>0?l=c.reduce((p,u)=>p+n(u.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,r.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||n(o.id)}),r}function Pt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>qa(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=$(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?S(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>S(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Yes":"No",filterable:!0,filterOp:"eq"}]}function Oa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":S(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function qt(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function Ba(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function ja(){const e=Pt(),t=Oa(),a=t.filter(u=>u.key==="name"||u.key==="parent"||u.key==="path"),r=t.filter(u=>u.key!=="name"&&u.key!=="parent"&&u.key!=="path"),n=Ae(f.categories),o=je(qt(),f.filters,"inventoryTable",e,{categoryDescendantsMap:n}),{categoryTotals:i,categoryQty:s}=Lt(),l=Nt(i,s),c=[...a,{key:"computedQty",label:"Qty",getValue:u=>s.get(u.id)||0,getDisplay:u=>String(s.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:u=>i.get(u.id)||0,getDisplay:u=>S(i.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},...r,{key:"computedTotalCents",label:"Total",getValue:u=>l.get(u.id)||0,getDisplay:u=>S(l.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:u=>u.active&&!u.isArchived,getDisplay:u=>u.active&&!u.isArchived?"Yes":"No",filterable:!0,filterOp:"eq"}],p=je(Ba(),f.filters,"categoriesList",c);return{inventoryColumns:e,categoryColumns:c,categoryDescendantsMap:n,filteredInventoryRecords:o,filteredCategories:p,categoryTotals:i,categoryQty:s}}function ut(e,t,a=""){const r=f.filters.filter(n=>n.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${r.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${r.map(n=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${d(n.label)}"
                  aria-label="Remove filter: ${d(n.label)}"
                  data-action="remove-filter"
                  data-filter-id="${n.id}"
                >${d(n.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function Pe(e,t,a){const r=a.getValue(t),n=a.getDisplay(t),o=r==null?"":String(r),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(n);if(n.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),c=Va(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}</span></button>`}function Vt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function Ga(e,t){const a=e.map((r,n)=>{let o=0,i=!1;for(const l of t){const c=r.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(o+=c,i=!0)}const s=i?String(r.key).toLowerCase().includes("cents")?S(o):Vt(o):n===0?"Totals":"";return`<th class="${Z(r)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function Ua(e,t){const a=new Set(t.map(i=>i.id)),r=t.filter(i=>!i.parentId||!a.has(i.parentId)),n=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=n.has(String(i.key))?r:t;let c=0,p=!1;for(const v of l){const g=i.getValue(v);typeof g=="number"&&Number.isFinite(g)&&(c+=g,p=!0)}const u=p?String(i.key).toLowerCase().includes("cents")?S(c):Vt(c):s===0?"Totals":"";return`<th class="${Z(i)}">${d(u)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function pt(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function _a(e,t){const a=[...e];return a.filter(n=>{for(const o of a){if(o===n)continue;const i=t.get(o);if(i!=null&&i.has(n))return!1}return!0})}function za(e){const t=new Set(f.filters.filter(r=>r.viewId==="categoriesList").map(r=>r.id)),a=new Set(f.filters.filter(r=>r.viewId==="inventoryTable"&&r.field==="categoryId"&&r.op==="inCategorySubtree"&&!!r.linkedToFilterId&&t.has(r.linkedToFilterId)).map(r=>r.value));return a.size>0?_a(a,e):f.categories.filter(r=>!r.isArchived&&r.active&&r.parentId==null).map(r=>r.id)}function Ha(e){const t=za(e),a=Da(),{categoryTotals:r,categoryQty:n}=Lt(),o=Nt(r,n),i=new Map;for(const b of f.inventoryRecords){if(!Et(b))continue;const y=b.baselineValueCents??0;if(!Number.isFinite(y))continue;const h=$(b.categoryId);if(h)for(const x of h.pathIds)i.set(x,(i.get(x)||0)+y)}const s=[],l={};let c=0,p=0,u=0,v=0;const g=b=>{const y=$(b);if(!y)return null;const h=i.get(b)||0,x=o.get(b)||0,F=x-h,Y=h>0?F/h:null;return{marketId:b,marketLabel:y.pathNames.join(" / "),startValueCents:h,endValueCents:x,contributionsCents:x-h,netGrowthCents:F,growthPct:Y}},w=new Set,N=b=>w.has(b)?[]:(w.add(b),(a.get(b)||[]).map(y=>g(y)).filter(y=>y!=null).sort((y,h)=>y.marketLabel.localeCompare(h.marketLabel)));for(const b of t){const y=g(b);y&&(l[b]=N(b),c+=y.startValueCents||0,p+=y.endValueCents||0,u+=y.contributionsCents||0,v+=y.netGrowthCents||0,s.push(y))}return u=p-c,v=p-c,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:c,endTotalCents:p,contributionsTotalCents:u,netGrowthTotalCents:v,hasManualSnapshots:!1}}function qe(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function J(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function Ka(){if(A.kind==="none")return"";const e=T("currencySymbol")||re,t=String(T("alphaVantageApiKey")||"").trim().length>0,a=(r,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(r!=null&&r.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(A.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((T("currencyCode")||ne).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${pa.map(r=>`<option value="${d(r.value)}" ${(T("currencySymbol")||re)===r.value?"selected":""}>${d(r.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-label mb-0">
                  Alpha Vantage API Key
                  <input class="form-control" name="alphaVantageApiKey" autocomplete="off" value="${d(T("alphaVantageApiKey")||"")}" />
                  <span class="form-text">
                    API key required to retrieve live spot pricing. Request one from
                    <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">Alpha Vantage</a>.
                    Free tier limits apply (about 1 request/second and 25 requests/day, shared across all symbols).
                  </span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${T("darkMode")??pe?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${T("showMarketsGraphs")??ke?"checked":""} />
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
    `;if(A.kind==="categoryCreate"||A.kind==="categoryEdit"){const r=A.kind==="categoryEdit",n=A.kind==="categoryEdit"?$(A.categoryId):void 0;if(r&&!n)return"";const o=r&&n?f.inventoryRecords.filter(l=>l.categoryId===n.id).sort((l,c)=>c.purchaseDate.localeCompare(l.purchaseDate)):[],i=r&&n?new Set(wt(f.categories,n.id)):void 0,s=Ae(f.categories);return je(qt(),f.filters,"inventoryTable",Pt(),{categoryDescendantsMap:s}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${r?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${r?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${d((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${d((n==null?void 0:n.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${a(i,(n==null?void 0:n.parentId)||null)}
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
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(ee(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
              ${r?`<span data-spot-refresh-group ${(n==null?void 0:n.evaluationMode)==="spot"&&(n.spotCode||"").trim()&&t?"":"hidden"}>
                     <button
                       type="button"
                       class="baseline-value-link mt-1 small"
                       data-action="refresh-spot-value"
                       ${D||Date.now()<V?"disabled":""}
                     >${D?"Getting latest spot value...":"Get latest spot value"}</button>
                     <span
                       class="small text-body-secondary ms-2"
                       data-role="spot-refresh-status"
                       aria-live="polite"
                     ></span>
                   </span>`:""}
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"&&t?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${d((n==null?void 0:n.spotCode)||"")}"
                ${(n==null?void 0:n.evaluationMode)==="spot"&&t?"":"disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n?n.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
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
                                <td class="text-end">${d(S(l.totalPriceCents))}</td>
                                <td>${d(l.purchaseDate)}</td>
                              </tr>`).join("")}
                          </tbody>
                        </table>
                      </div>`:'<div class="small text-body-secondary">No investments are currently linked to this market.</div>'}
              </div>
            `:""}
            <div class="modal-footer px-0 pb-0">
              ${r&&n?`<button type="button" class="btn btn-danger me-auto" data-action="delete-category-record" data-id="${n.id}">Delete</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${r?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(A.kind==="inventoryCreate")return`
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
                ${a()}
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
    `;if(A.kind==="inventoryEdit"){const r=A,n=f.inventoryRecords.find(o=>o.id===r.inventoryId);return n?`
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
            <input type="hidden" name="baselineValue" value="${d(ee(n.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${d(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId">
                <option value="">Select market</option>
                ${a(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${d(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${d(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(ee(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="${d(ee(n.baselineValueCents??n.totalPriceCents))}" disabled />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(ee(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${d(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <div class="d-flex gap-2 me-auto">
                <button type="button" class="btn btn-danger" data-action="delete-inventory-record" data-id="${n.id}">Delete</button>
              </div>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function L(){const e=window.scrollX,t=window.scrollY,a=C.querySelector('details[data-section="data-tools"]');a&&(ot=a.open);const r=C.querySelector('details[data-section="investments"]');r&&(it=r.open),Ma(),xa();const{inventoryColumns:n,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=ja(),c=Ha(i),p=Aa(c.rows),u=T("showMarketsGraphs")??ke,v=l.some(m=>m.parentId==null),g=u&&v&&p.length>0,w=new Set([...te].filter(m=>{var k;return(((k=c.childRowsByParent[m])==null?void 0:k.length)||0)>0}));w.size!==te.size&&(te=w);const N=c.startTotalCents>0?c.netGrowthTotalCents/c.startTotalCents:null,b=f.exportText||Rt(),y=s.map(m=>`
        <tr class="${[Fa(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${n.map(I=>`<td class="${Z(I)}">${Pe("inventoryTable",m,I)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),h=new Set(l.map(m=>m.id)),x=new Map;for(const m of l){const k=m.parentId&&h.has(m.parentId)?m.parentId:null,I=x.get(k)||[];I.push(m),x.set(k,I)}for(const m of x.values())m.sort((k,I)=>k.sortOrder-I.sortOrder||k.name.localeCompare(I.name));const F=[],Y=(m,k)=>{const I=x.get(m)||[];for(const M of I)F.push({category:M,depth:k}),Y(M.id,k+1)};Y(null,0);const me=String(T("alphaVantageApiKey")||"").trim().length>0,be=F.map(({category:m,depth:k})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${o.map(I=>{if(I.key==="name"){const M=k>0?(k-1)*1.1:0;return`<td class="${Z(I)}"><div class="market-name-wrap" style="padding-left:${M.toFixed(2)}rem">${k>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Pe("categoriesList",m,I)}</div></td>`}return`<td class="${Z(I)}">${Pe("categoriesList",m,I)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            ${m.evaluationMode==="spot"&&(m.spotCode||"").trim()&&me?`<button
                     type="button"
                     class="btn btn-sm btn-outline-primary action-menu-btn"
                     data-action="refresh-category-spot"
                     data-id="${m.id}"
                     title="Get latest spot price"
                     aria-label="Get latest spot price"
                     ${D||Date.now()<V?"disabled":""}
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
        ${de?`<div class="alert alert-${de.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(de.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          ${g?`
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
                  ${c.rows.map(m=>{const k=c.childRowsByParent[m.marketId]||[],I=te.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${k.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${I?"Collapse":"Expand"} child markets">${I?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d(S(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d(S(m.endValueCents))}</td>
                      <td class="text-end ${J(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d(S(m.netGrowthCents))}</td>
                      <td class="text-end ${J(m.growthPct)}">${d(qe(m.growthPct))}</td>
                      </tr>
                      ${k.map(M=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(m.marketId)}" ${I?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(M.marketLabel)}</td>
                              <td class="text-end">${M.startValueCents==null?"—":d(S(M.startValueCents))}</td>
                              <td class="text-end">${M.endValueCents==null?"—":d(S(M.endValueCents))}</td>
                              <td class="text-end ${J(M.netGrowthCents)}">${M.netGrowthCents==null?"—":d(S(M.netGrowthCents))}</td>
                              <td class="text-end ${J(M.growthPct)}">${d(qe(M.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(S(c.startTotalCents))}</th>
                    <th class="text-end">${d(S(c.endTotalCents))}</th>
                    <th class="text-end ${J(c.netGrowthTotalCents)}">${d(S(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${J(N)}">${d(qe(N))}</th>
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
        ${ue?`<div class="alert alert-${ue.tone} py-1 px-2 mb-2 small" role="status">${d(ue.text)}</div>`:""}
        ${ut("categoriesList","Markets","")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(m=>`<th class="${Z(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${be}
            </tbody>
            ${Ua(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${it?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-primary" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${ut("inventoryTable","Investments","")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${n.map(m=>`<th class="${Z(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${y}
              </tbody>
              ${Ga(n,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${ot?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(Ne(f.storageUsageBytes)):`${d(Ne(f.storageUsageBytes))} of ${d(Ne(f.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Export</button>
          </div>
          <label class="form-label mb-0">Export / Copy JSON
            <input class="form-control" id="export-text" readonly value="${d(b)}" />
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
        App version: ${d(ca)}
      </footer>
    </div>
    ${Ka()}
  `;const _=C.querySelector("#inventory-form");_&&(Dt(_),Ze(_),Tt(_));const We=C.querySelector("#category-form");We&&Qe(We),$a(),La(p),Ue(),window.scrollTo(e,t)}function Xa(e,t){const a=C.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const n of a)n.hidden=!t;const r=C.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);r&&(r.textContent=t?"▾":"▸",r.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function Za(){return{schemaVersion:2,exportedAt:B(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function Rt(){return JSON.stringify(Za())}function Qa(e,t,a){const r=new Blob([t],{type:a}),n=URL.createObjectURL(r),o=document.createElement("a");o.href=n,o.download=e,o.click(),URL.revokeObjectURL(n)}async function Wa(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),r=String(t.get("currencySymbol")||"").trim(),n=String(t.get("alphaVantageApiKey")||"").trim(),o=t.get("darkMode")==="on",i=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!r){alert("Select a currency symbol.");return}await G("currencyCode",a),await G("currencySymbol",r),await G("alphaVantageApiKey",n),await G("darkMode",o),await G("showMarketsGraphs",i),U(),await E()}async function Ya(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("categoryId")||"").trim(),n=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),c=t.get("active")==="on",p=i==="spot"||i==="snapshot"?i:void 0,u=p==="spot"&&s?$e(s):void 0,v=p==="spot"&&l?l:void 0;if(!n)return;if(p==="spot"&&s&&u==null){alert("Spot value is invalid.");return}const g=u??void 0,w=o||null;if(w&&!$(w)){alert("Select a valid parent market.");return}if(a==="edit"){if(!r)return;const h=await ht(r);if(!h){alert("Market not found.");return}if(w===h.id){alert("A category cannot be its own parent.");return}if(w&&wt(f.categories,h.id).includes(w)){alert("A category cannot be moved under its own subtree.");return}const x=h.parentId!==w;h.name=n,h.parentId=w,h.evaluationMode=p,h.spotValueCents=g,h.spotCode=v,h.active=c,x&&(h.sortOrder=f.categories.filter(F=>F.parentId===w&&F.id!==h.id).length),h.updatedAt=B(),await Ce(h),U(),await E();return}const N=B(),b=f.categories.filter(h=>h.parentId===w).length,y={id:crypto.randomUUID(),name:n,parentId:w,pathIds:[],pathNames:[],depth:0,sortOrder:b,evaluationMode:p,spotValueCents:g,spotCode:v,active:c,isArchived:!1,createdAt:N,updatedAt:N};await Ce(y),U(),await E()}async function Ja(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("inventoryId")||"").trim(),n=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=$e(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),c=l===""?null:$e(l),p=a==="create"?s??void 0:c??void 0,u=String(t.get("categoryId")||""),v=t.get("active")==="on",g=String(t.get("notes")||"").trim();if(!n||!o){alert("Date and product name are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&c!=null&&c<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&c==null){alert("Baseline value is invalid.");return}if(u&&!$(u)){alert("Select a valid category.");return}const w=Math.round(s/i);if(a==="edit"){if(!r)return;const y=await _e(r);if(!y){alert("Inventory record not found.");return}y.purchaseDate=n,y.productName=o,y.quantity=i,y.totalPriceCents=s,y.baselineValueCents=p,y.unitPriceCents=w,y.unitPriceSource="derived",y.categoryId=u,y.active=v,y.notes=g||void 0,y.updatedAt=B(),await we(y),U(),await E();return}const N=B(),b={id:crypto.randomUUID(),purchaseDate:n,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:p,unitPriceCents:w,unitPriceSource:"derived",categoryId:u,active:v,archived:!1,notes:g||void 0,createdAt:N,updatedAt:N};await we(b),U(),await E()}async function en(e,t){const a=await _e(e);a&&(a.active=t,a.updatedAt=B(),await we(a),await E())}async function tn(e){const t=await _e(e);!t||!window.confirm(`Delete investment record "${t.productName}" permanently? This cannot be undone.`)||(await ea(e),U(),await E())}async function an(e){const t=await ht(e);if(!t)return;const a=f.inventoryRecords.filter(o=>o.categoryId===e).length;if(!window.confirm(`Delete market "${t.pathNames.join(" / ")}"? This cannot be undone.

This will also affect:
- ${a} investment record(s): their Market will be cleared.`))return;const n=B();for(const o of f.inventoryRecords)o.categoryId===e&&(o.categoryId="",o.updatedAt=n,await we(o));for(const o of f.categories)o.parentId===e&&(o.parentId=null,o.updatedAt=n,await Ce(o));await aa(e),U(),await E()}function Ft(e){const t=B();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function nn(e){const t=B(),a=Number(e.quantity),r=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(r))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const n=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:r,baselineValueCents:Number.isFinite(n)?n:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function rn(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=ze(t.categories.map(Ft)),r=new Set(a.map(s=>s.id)),n=t.purchases.map(nn);for(const s of n)if(!r.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:ne},{key:"currencySymbol",value:re},{key:"darkMode",value:pe}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await gt({purchases:n,categories:a,settings:o}),O({importText:ae}),await E()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}async function on(){const e=ze(Ge.categories.map(Ft)),t=Ge.settings.map(r=>({key:String(r.key),value:r.value}));window.confirm("Load default markets template and replace all existing data? This will keep no investments.")&&(await gt({purchases:[],categories:e,settings:t}),O({filters:Ie(),importText:ae}),await E(),$t({tone:"success",text:"Default markets loaded."}))}function Ot(e){return e.target instanceof HTMLElement?e.target:null}function ft(e){const t=e.dataset.viewId,a=e.dataset.field,r=e.dataset.op,n=e.dataset.value,o=e.dataset.label;if(!t||!a||!r||n==null||!o)return;const i=(p,u)=>p.viewId===u.viewId&&p.field===u.field&&p.op===u.op&&p.value===u.value;let s=oa(f.filters,{viewId:t,field:a,op:r,value:n,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const p=$(l);if(p){const u=s.find(v=>i(v,{viewId:t,field:a,op:r,value:n}));if(u){const v=`Market: ${p.pathNames.join(" / ")}`;s=s.filter(w=>w.linkedToFilterId!==u.id);const g=s.findIndex(w=>i(w,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id}));if(g>=0){const w=s[g];s=[...s.slice(0,g),{...w,label:v,linkedToFilterId:u.id},...s.slice(g+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id,label:v,linkedToFilterId:u.id}]}}}let c={filters:s};t==="inventoryTable"&&a==="archived"&&n==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&n==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&n==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),O(c)}function Bt(){ce!=null&&(window.clearTimeout(ce),ce=null)}function sn(e){const t=f.filters.filter(r=>r.viewId===e),a=t[t.length-1];a&&O({filters:vt(f.filters,a.id)})}C.addEventListener("click",async e=>{const t=Ot(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const r=a.dataset.action;if(r){if(r==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Bt(),e.detail>1)return;ce=window.setTimeout(()=>{ce=null,ft(a)},220);return}ft(a);return}if(r==="remove-filter"){const n=a.dataset.filterId;if(!n)return;O({filters:vt(f.filters,n)});return}if(r==="clear-filters"){const n=a.dataset.viewId;if(!n)return;const o=ia(f.filters,n),i=Ie().find(s=>s.viewId===n);O({filters:i?[...o,i]:o});return}if(r==="open-create-category"){X({kind:"categoryCreate"});return}if(r==="open-create-inventory"){X({kind:"inventoryCreate"});return}if(r==="open-settings"){X({kind:"settings"});return}if(r==="apply-report-range"){const n=C.querySelector('input[name="reportDateFrom"]'),o=C.querySelector('input[name="reportDateTo"]');if(!n||!o)return;const i=n.value,s=o.value,l=pt(i),c=pt(s,!0);if(l==null||c==null||l>c){$t({tone:"warning",text:"Select a valid report date range."});return}O({reportDateFrom:i,reportDateTo:s});return}if(r==="reset-report-range"){O({reportDateFrom:It(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(r==="copy-total-to-baseline"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="inventory-form")return;const o=n.querySelector('input[name="totalPrice"]'),i=n.querySelector('input[name="baselineValue"]'),s=n.querySelector('input[name="baselineValueDisplay"]'),l=n.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',he!=null&&window.clearTimeout(he),he=window.setTimeout(()=>{he=null,l.isConnected&&(l.textContent="")},1800));return}if(r==="refresh-spot-value"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="category-form")return;await Ia(n);return}if(r==="toggle-growth-children"){const n=a.dataset.marketId;if(!n)return;const o=new Set(te),i=!o.has(n);i?o.add(n):o.delete(n),te=o,Xa(n,i);return}if(r==="edit-category"){const n=a.dataset.id;n&&X({kind:"categoryEdit",categoryId:n});return}if(r==="refresh-category-spot"){const n=a.dataset.id;n&&await ka(n);return}if(r==="edit-inventory"){const n=a.dataset.id;n&&X({kind:"inventoryEdit",inventoryId:n});return}if(r==="close-modal"||r==="close-modal-backdrop"){if(r==="close-modal-backdrop"&&!t.classList.contains("modal"))return;U();return}if(r==="toggle-inventory-active"){const n=a.dataset.id,o=a.dataset.nextActive==="true";n&&await en(n,o);return}if(r==="delete-inventory-record"){const n=a.dataset.id;n&&await tn(n);return}if(r==="delete-category-record"){const n=a.dataset.id;n&&await an(n);return}if(r==="download-json"){Qa(`investments-app-${new Date().toISOString().slice(0,10)}.json`,Rt(),"application/json");return}if(r==="replace-import"){await rn();return}if(r==="load-default-markets"){await on();return}if(r==="wipe-all"){const n=document.querySelector("#wipe-confirm");if(!n||n.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await ra(),O({filters:Ie(),exportText:"",importText:ae,showArchivedInventory:!1,showArchivedCategories:!1}),await E();return}}});C.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Bt(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const r=t.closest("tr[data-row-edit]");if(!r)return;const n=r.dataset.id,o=r.dataset.rowEdit;if(!(!n||!o)){if(o==="inventory"){X({kind:"inventoryEdit",inventoryId:n});return}o==="category"&&X({kind:"categoryEdit",categoryId:n})}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await Wa(t);return}if(t.id==="category-form"){await Ya(t);return}if(t.id==="inventory-form"){await Ja(t);return}}});C.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="spotCode"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="category-form"&&Qe(a)}if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Ze(a),Tt(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});C.addEventListener("change",async e=>{var n;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(Dt(o),Ze(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&Qe(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(n=t.files)==null?void 0:n[0];if(!a)return;const r=await a.text();try{O({importText:JSON.stringify(JSON.parse(r))})}catch{O({importText:r})}});C.addEventListener("pointermove",e=>{const t=Ot(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");Se=(a==null?void 0:a.dataset.filterSectionViewId)||null});C.addEventListener("pointerleave",()=>{Se=null});document.addEventListener("keydown",e=>{if(A.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!Se)return;e.preventDefault(),sn(Se);return}if(e.key==="Escape"){e.preventDefault(),U();return}if(e.key!=="Tab")return;const t=At();if(!t)return;const a=Mt(t);if(!a.length){e.preventDefault(),t.focus();return}const r=a[0],n=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===r||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),n.focus());return}o===n&&(e.preventDefault(),r.focus())});E();
