(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const je=(e,t)=>t.some(a=>e instanceof a);let rt,ot;function Zt(){return rt||(rt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Qt(){return ot||(ot=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ge=new WeakMap,qe=new WeakMap,De=new WeakMap;function Wt(e){const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(W(e.result)),n()},i=()=>{r(e.error),n()};e.addEventListener("success",o),e.addEventListener("error",i)});return De.set(t,e),t}function Yt(e){if(Ge.has(e))return;const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),n()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Ge.set(e,t)}let Ue={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Ge.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return W(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function St(e){Ue=e(Ue)}function Jt(e){return Qt().includes(e)?function(...t){return e.apply(_e(this),t),W(this.request)}:function(...t){return W(e.apply(_e(this),t))}}function ea(e){return typeof e=="function"?Jt(e):(e instanceof IDBTransaction&&Yt(e),je(e,Zt())?new Proxy(e,Ue):e)}function W(e){if(e instanceof IDBRequest)return Wt(e);if(qe.has(e))return qe.get(e);const t=ea(e);return t!==e&&(qe.set(e,t),De.set(t,e)),t}const _e=e=>De.get(e);function ta(e,t,{blocked:a,upgrade:r,blocking:n,terminated:o}={}){const i=indexedDB.open(e,t),s=W(i);return r&&i.addEventListener("upgradeneeded",l=>{r(W(i.result),l.oldVersion,l.newVersion,W(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),n&&l.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const aa=["get","getKey","getAll","getAllKeys","count"],na=["put","add","delete","clear"],Pe=new Map;function it(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Pe.get(t))return Pe.get(t);const a=t.replace(/FromIndex$/,""),r=t!==a,n=na.includes(a);if(!(a in(r?IDBIndex:IDBObjectStore).prototype)||!(n||aa.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,n?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(s.shift())),(await Promise.all([c[a](...s),n&&l.done]))[0]};return Pe.set(t,o),o}St(e=>({...e,get:(t,a,r)=>it(t,a)||e.get(t,a,r),has:(t,a)=>!!it(t,a)||e.has(t,a)}));const ra=["continue","continuePrimaryKey","advance"],st={},ze=new WeakMap,It=new WeakMap,oa={get(e,t){if(!ra.includes(t))return e[t];let a=st[t];return a||(a=st[t]=function(...r){ze.set(this,It.get(this)[t](...r))}),a}};async function*ia(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,oa);for(It.set(a,t),De.set(a,_e(t));t;)yield a,t=await(ze.get(a)||t.continue()),ze.delete(a)}function lt(e,t){return t===Symbol.asyncIterator&&je(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&je(e,[IDBIndex,IDBObjectStore])}St(e=>({...e,get(t,a,r){return lt(t,a)?ia:e.get(t,a,r)},has(t,a){return lt(t,a)||e.has(t,a)}}));const R=ta("investment_purchase_tracker",3,{async upgrade(e,t,a,r){const n=r,o=e.objectStoreNames.contains("purchases")?n.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?r.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?r.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.archived!="boolean"&&(c.archived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function sa(){return(await R).getAll("inventory")}async function $e(e){await(await R).put("inventory",e)}async function Ze(e){return(await R).get("inventory",e)}async function la(e){await(await R).delete("inventory",e)}async function ca(){return(await R).getAll("categories")}async function xe(e){await(await R).put("categories",e)}async function kt(e){return(await R).get("categories",e)}async function da(e){await(await R).delete("categories",e)}async function ua(){return(await R).getAll("settings")}async function B(e,t){await(await R).put("settings",{key:e,value:t})}async function $t(e){const a=(await R).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const r of e.purchases)await a.objectStore("inventory").put(r);for(const r of e.categories)await a.objectStore("categories").put(r);for(const r of e.settings)await a.objectStore("settings").put(r);await a.done}async function pa(){const t=(await R).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function ct(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function fa(e,t){return e.some(r=>r.viewId===t.viewId&&r.field===t.field&&r.op===t.op&&r.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function xt(e,t){const a=new Set([t]);let r=!0;for(;r;){r=!1;for(const n of e)n.linkedToFilterId&&a.has(n.linkedToFilterId)&&!a.has(n.id)&&(a.add(n.id),r=!0)}return e.filter(n=>!a.has(n.id))}function ma(e,t){return e.filter(a=>a.viewId!==t)}function He(e,t,a,r,n){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(r.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var p;const c=i.get(l.field);if(!c)return!0;const u=c.getValue(s);if(l.op==="eq")return String(u)===l.value;if(l.op==="isEmpty")return ct(u);if(l.op==="isNotEmpty")return!ct(u);if(l.op==="contains")return String(u).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const h=((p=n==null?void 0:n.categoryDescendantsMap)==null?void 0:p.get(l.value))||new Set([l.value]),b=String(u);return h.has(b)}return!0}))}function ba(e){const t=new Map(e.map(r=>[r.id,r])),a=new Map;for(const r of e){const n=a.get(r.parentId)||[];n.push(r),a.set(r.parentId,n)}return{byId:t,children:a}}function Le(e){const{children:t}=ba(e),a=new Map;function r(n){const o=new Set([n]);for(const i of t.get(n)||[])for(const s of r(i.id))o.add(s);return a.set(n,o),o}for(const n of e)a.has(n.id)||r(n.id);return a}function Qe(e){const t=new Map(e.map(r=>[r.id,r]));function a(r){const n=[],o=[],i=new Set;let s=r;for(;s&&!i.has(s.id);)i.add(s.id),n.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:n,names:o,depth:Math.max(0,n.length-1)}}return e.map(r=>{const n=a(r);return{...r,pathIds:n.ids,pathNames:n.names,depth:n.depth}})}function At(e,t){return[...Le(e).get(t)||new Set([t])]}function ya(e,t){const a=Le(t),r=new Map;for(const n of t){const o=a.get(n.id)||new Set([n.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);r.set(n.id,i)}return r}const Tt=document.querySelector("#app");if(!Tt)throw new Error("#app not found");const C=Tt;var Ct;const ha=((Ct=document.querySelector('meta[name="app-build-version"]'))==null?void 0:Ct.content)||"dev";let T={kind:"none"},de=null,X=null,z=null,P=null,V=null,dt=!1,Ce=null,Ve=!1,Fe=null,pe=null,Ae=null,ut=!1,pt=!1,te=new Set,ft=!1,Se=null,le=null,fe=null,ce=null,me=null,L=!1,F=0,Y=null,mt=0;const bt=new Map,Ke={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"themeId",value:"classic"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!0}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,spotCode:"XAU",isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,spotCode:"XAG",isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},ae=JSON.stringify(Ke);function Te(){return[{id:crypto.randomUUID(),viewId:"categoriesList",field:"active",op:"eq",value:"true",label:"Active: Yes"},{id:crypto.randomUUID(),viewId:"inventoryTable",field:"active",op:"eq",value:"true",label:"Active: Yes"}]}let f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:Dt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:Te(),showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:ae,storageUsageBytes:null,storageQuotaBytes:null};const ne="USD",re="$",Mt="classic",be=!1,Me=!0,Et=15e3,yt=1100,ga=60*60*1e3,va=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function wa(e){return e==="classic"}function We(e){return wa(e)?e:Mt}function G(){return new Date().toISOString()}function Ca(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function Dt(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function Re(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,r=0;for(;a>=1024&&r<t.length-1;)a/=1024,r+=1;return`${a>=10||r===0?a.toFixed(0):a.toFixed(1)} ${t[r]}`}function I(e){const t=E("currencySymbol")||re,a=Math.abs(e)/100,r=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(a);return`${e<0?"-":""}${t}${r}`}function Ee(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function Sa(e){return e.trim().toUpperCase().replace(/\s+/g,"")}function Ia(e){const t=e.replace(/[\/_-]/g,""),r={XAG:{metal:"XAG"},XAU:{metal:"XAU"},SILVER:{metal:"XAG"},GOLD:{metal:"XAU"},XAGUSD:{metal:"XAG",quoteCurrency:"USD"},XAUUSD:{metal:"XAU",quoteCurrency:"USD"}}[t];if(r)return{kind:"bullion",metal:r.metal,quoteCurrency:r.quoteCurrency,normalizedCode:t};let n=t.match(/^(XAG|XAU)([A-Z]{3})$/);return n?{kind:"bullion",metal:n[1],quoteCurrency:n[2],normalizedCode:t}:(n=t.match(/^(SILVER|GOLD)([A-Z]{3})$/),n?{kind:"bullion",metal:n[1]==="SILVER"?"XAG":"XAU",quoteCurrency:n[2],normalizedCode:t}:null)}function ka(e){const t=Sa(e);if(!t)return null;const a=Ia(t);return a||(/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(t)?{kind:"equity",symbol:t,normalizedCode:t}:null)}function Ye(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string")return null;const t=Number(e.replace(/,/g,"").trim());return Number.isFinite(t)?t:null}function ye(e,t="",a=[]){if(e==null)return a;const r=Ye(e);if(r!=null)return a.push({path:t,value:r}),a;if(Array.isArray(e))return e.forEach((n,o)=>ye(n,`${t}[${o}]`,a)),a;if(typeof e=="object")for(const[n,o]of Object.entries(e)){const i=t?`${t}.${n}`:n;ye(o,i,a)}return a}function Je(e,t){var o;const a=t.map(i=>i.toLowerCase()),r=e.find(i=>{const s=i.path.toLowerCase();return a.some(l=>s.includes(l))});if(r)return r.value;const n=e.find(i=>{const s=i.path.toLowerCase();return s.includes("price")||s.includes("rate")||s.includes("value")});return n?n.value:((o=e[0])==null?void 0:o.value)??null}function $a(e){const t=e.toLowerCase();return t.includes("rate limit")||t.includes("our standard api call frequency is")||t.includes("please consider optimizing your api call frequency")||t.includes("please consider spreading out your free api requests")||t.includes("1 request per second")||t.includes("25 requests per day")}async function ke(e,t){const a=new URL("https://www.alphavantage.co/query");for(const[r,n]of Object.entries(e))a.searchParams.set(r,n);a.searchParams.set("apikey",t);for(let r=0;r<2;r+=1){const n=Date.now(),o=Math.max(0,mt+yt-n);o>0&&await new Promise(p=>window.setTimeout(p,o)),mt=Date.now();const i=await fetch(a.toString());if(!i.ok)throw new Error(`Request failed (${i.status}).`);const s=await i.json();if(typeof s["Error Message"]=="string")throw new Error(String(s["Error Message"]));const l=typeof s.Note=="string"?s.Note:null,c=typeof s.Information=="string"?s.Information:null,u=l||c;if(u&&$a(u)){if(r===0){await new Promise(p=>window.setTimeout(p,yt+200));continue}throw new Error("Alpha Vantage limit reached. Please wait and retry (free tier: 1 req/sec, 25/day).")}if(l)throw new Error(l);return s}throw new Error("Alpha Vantage request failed.")}function Lt(e){var n;const t=(n=e["Realtime Currency Exchange Rate"])==null?void 0:n["5. Exchange Rate"],a=Ye(t);if(a!=null&&a>0)return a;const r=ye(e);return Je(r,["exchange rate","rate"])}function xa(e){const t=e["Global Quote"],a=Ye(t==null?void 0:t["05. price"]);if(a!=null)return a;const r=ye(e);return Je(r,["global quote","price","close"])}function Aa(e,t){const a=ye(e);return Je(a,[...t==="XAG"?["silver","xag"]:["gold","xau"],"price","rate","value"])}function Ta(e){const t=["currency","Currency","quote_currency","QuoteCurrency","to_currency"];for(const r of t){const n=e[r];if(typeof n=="string"){const o=n.trim().toUpperCase();if(/^[A-Z]{3}$/.test(o))return o}}const a=Object.entries(e).filter(([,r])=>typeof r=="string");for(const[r,n]of a){const o=n.trim().toUpperCase();if(!/^[A-Z]{3}$/.test(o))continue;if(r.toLowerCase().includes("currency"))return o}return null}async function Ma(e,t,a){if(e===t)return 1;const r=`${e}->${t}`,n=bt.get(r);if(n&&Date.now()-n.cachedAt<ga)return n.rate;const o=await ke({function:"CURRENCY_EXCHANGE_RATE",from_currency:e,to_currency:t},a),i=Lt(o);if(i==null||i<=0)throw new Error("Could not parse FX exchange rate.");return bt.set(r,{rate:i,cachedAt:Date.now()}),i}function Ea(e){return e.toUpperCase().endsWith(".AX")?"AUD":null}function et(){Y!=null&&(window.clearTimeout(Y),Y=null)}function E(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function Da(e){var o,i;const t=(o=e.find(s=>s.key==="darkMode"))==null?void 0:o.value,a=typeof t=="boolean"?t:be,r=(i=e.find(s=>s.key==="themeId"))==null?void 0:i.value,n=We(r);document.documentElement.setAttribute("data-bs-theme",a?"dark":"light"),document.documentElement.setAttribute("data-app-theme",n)}function j(e){f={...f,...e},q()}function Nt(e){le!=null&&(window.clearTimeout(le),le=null),fe=e,q(),e&&(le=window.setTimeout(()=>{le=null,fe=null,q()},3500))}function U(e){ce!=null&&(window.clearTimeout(ce),ce=null),me=e,q(),e&&(ce=window.setTimeout(()=>{ce=null,me=null,q()},5e3))}function Z(e){T.kind==="none"&&document.activeElement instanceof HTMLElement&&(de=document.activeElement),T=e,q()}function _(){T.kind!=="none"&&(T={kind:"none"},L=!1,et(),q(),de&&de.isConnected&&de.focus(),de=null)}function Ne(e){const t=e.querySelector('[data-action="refresh-spot-value"]'),a=e.querySelector('[data-role="spot-refresh-status"]');return{button:t,status:a}}function K(e,t,a){const{status:r}=Ne(e);if(!r)return;r.textContent=a,r.classList.remove("text-body-secondary","text-success","text-warning","text-danger");const n={muted:"text-body-secondary",success:"text-success",warning:"text-warning",danger:"text-danger"};r.classList.add(n[t])}function ue(e){const{button:t}=Ne(e);if(!t)return;const a=Date.now()<F;t.disabled=L||a,t.textContent=L?"Getting latest spot value...":"Get latest spot value"}async function qt(e,t,a){const r=ka(e);if(!r)throw new Error("Unsupported spot code format.");let n=null,o=null;if(r.kind==="bullion"){const s=await ke({function:"GOLD_SILVER_SPOT",symbol:r.metal},a);if(n=Aa(s,r.metal),o=r.quoteCurrency||Ta(s)||"USD",n==null||n<=0){const l=r.quoteCurrency||o||"USD",c=await ke({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.metal,to_currency:l},a);n=Lt(c),o=l}}else{const s=await ke({function:"GLOBAL_QUOTE",symbol:r.symbol},a);if(n=xa(s),n==null||n<=0)throw new Error("Could not parse quote price for this symbol.");o=Ea(r.symbol)||t}if(n==null||n<=0)throw new Error("Could not parse a valid price for this code.");(!o||!/^[A-Z]{3}$/.test(o))&&(o=t);let i=n;if(o!==t){const s=await Ma(o,t,a);i=n*s}if(!Number.isFinite(i)||i<=0)throw new Error("Received invalid price after conversion.");return Math.round(i*100)}async function La(e){if(L)return;const t=e.querySelector('input[name="mode"]'),a=e.querySelector('select[name="evaluationMode"]'),r=e.querySelector('input[name="spotCode"]'),n=e.querySelector('input[name="spotValue"]');if(!t||t.value!=="edit"||!a||a.value!=="spot"||!r||!n)return;const o=r.value.trim();if(!o){K(e,"warning","Set a code before refreshing.");return}if(Date.now()<F){const l=Math.max(1,Math.ceil((F-Date.now())/1e3));K(e,"muted",`Please wait ${l}s before refreshing again.`),ue(e);return}const i=String(E("alphaVantageApiKey")||"").trim();if(!i){K(e,"warning","Set Alpha Vantage API Key in Settings first.");return}const s=String(E("currencyCode")||ne).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(s)){K(e,"danger","Invalid app currency setting.");return}L=!0,ue(e),K(e,"muted","Refreshing latest value...");try{const l=await qt(o,s,i);n.value=ee(l),K(e,"success","Value refreshed.")}catch(l){const c=l instanceof Error?l.message:"Refresh failed.";K(e,"danger",c)}finally{L=!1,F=Date.now()+Et,ue(e),et();const l=Math.max(0,F-Date.now());Y=window.setTimeout(()=>{Y=null;const c=C.querySelector("#category-form");if(c){ue(c);const{status:u}=Ne(c);u&&u.classList.contains("text-body-secondary")&&(u.textContent="")}q()},l)}}async function Na(e){if(L)return;const t=x(e);if(!t){U({tone:"danger",text:"Market not found."});return}if(t.evaluationMode!=="spot"){U({tone:"warning",text:"Refresh is only available for Spot markets."});return}const a=(t.spotCode||"").trim();if(!a){U({tone:"warning",text:"Set a market code before refreshing."});return}if(Date.now()<F){const o=Math.max(1,Math.ceil((F-Date.now())/1e3));U({tone:"warning",text:`Please wait ${o}s before refreshing again.`});return}const r=String(E("alphaVantageApiKey")||"").trim();if(!r){U({tone:"warning",text:"Set Alpha Vantage API Key in Settings first."});return}const n=String(E("currencyCode")||ne).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(n)){U({tone:"danger",text:"Invalid app currency setting."});return}L=!0,U({tone:"warning",text:`Refreshing latest spot price for ${t.name}...`});try{const o=await qt(a,n,r),i={...t,spotValueCents:o,updatedAt:G()};await xe(i),await N(),U({tone:"success",text:`${t.name} spot value updated to ${I(o)}.`})}catch(o){const i=o instanceof Error?o.message:"Refresh failed.";U({tone:"danger",text:i})}finally{L=!1,F=Date.now()+Et,et();const o=Math.max(0,F-Date.now());Y=window.setTimeout(()=>{Y=null;const i=C.querySelector("#category-form");if(i){ue(i);const{status:s}=Ne(i);s&&s.classList.contains("text-body-secondary")&&(s.textContent="")}q()},o),q()}}function Pt(){return C.querySelector(".modal-panel")}function Vt(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function qa(){if(T.kind==="none")return;const e=Pt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(Vt(e)[0]||e).focus()}function Pa(){var e,t;(e=X==null?void 0:X.destroy)==null||e.call(X),(t=z==null?void 0:z.destroy)==null||t.call(z),X=null,z=null}function Xe(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){Fe==null&&(Fe=window.setTimeout(()=>{Fe=null,Xe(),q()},500)),Ve||(Ve=!0,window.addEventListener("load",()=>{Ve=!1,Xe(),q()},{once:!0}));return}const r=C.querySelector("#categories-table"),n=C.querySelector("#inventory-table"),o=(s,l)=>{var c,u;return t?new t(s,l):a?((u=(c=a(s)).DataTable)==null?void 0:u.call(c,l))??null:null};r&&(X=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),n&&(z=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Ga(n,z))}function Va(e){return e.map(t=>{const a=t.startValueCents??0,r=t.endValueCents??0;return!Number.isFinite(a)||!Number.isFinite(r)||a<=0&&r<=0?null:{id:t.marketId,label:t.marketLabel,startCents:a,endCents:r,changeCents:r-a}}).filter(t=>t!=null).sort((t,a)=>a.endCents-t.endCents)}function Ie(e,t){const a=C.querySelector(`#${e}`),r=C.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),r&&(r.textContent=t,r.hidden=!1)}function ht(e){const t=C.querySelector(`#${e}`),a=C.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Fa(){P==null||P.dispose(),V==null||V.dispose(),P=null,V=null}function Ra(){dt||(dt=!0,window.addEventListener("resize",()=>{Ce!=null&&window.clearTimeout(Ce),Ce=window.setTimeout(()=>{Ce=null,P==null||P.resize(),V==null||V.resize()},120)}))}function Oa(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Ba(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function ja(e){const t="markets-allocation-chart",a="markets-top-chart",r=C.querySelector(`#${t}`),n=C.querySelector(`#${a}`);if(!r||!n)return;if(!window.echarts){Ie(t,"Chart unavailable: ECharts not loaded."),Ie(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){Ie(t,"No eligible market totals to chart."),Ie(a,"No eligible market totals to chart.");return}ht(t),ht(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?12:14,l=["#3f6d49","#7f6c52","#5a4027","#f2b544","#dc3545","#6f42c1","#20c997","#0b4c92"],c="#20c997",u="#dc3545",p="#0b4c92",h="rgba(108, 117, 125, 0.1)",b=i?"#e9ecef":"#212529",w=i?"#ced4da":"#495057",O=e.map(g=>({name:g.label,value:g.endCents})),S=e.slice(0,5),y=[...S].reverse();new Map(y.map(g=>[g.label,g]));const v=S.reduce((g,A)=>Math.max(g,A.endCents),0),D=v>0?Math.ceil(v*1.2):1;P=window.echarts.init(r),V=window.echarts.init(n),P.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:g=>`${d(g.name)}: ${I(g.value)} (${g.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,left:12,icon:"circle",textStyle:{color:b,fontSize:s}}:{orient:"vertical",left:12,top:"center",icon:"circle",textStyle:{color:b,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["54%","50%"],data:O,avoidLabelOverlap:!1,itemStyle:{borderColor:i?"#11161d":"#ffffff",borderWidth:3},labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:g=>{const A=g.percent??0;return`${Math.round(A)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:w,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),V.setOption({color:[c],grid:{left:"4%",right:"10%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:g=>{var ie,ve;const A=(ie=g[0])==null?void 0:ie.name;if(!A)return"";const he=((ve=g.find(se=>se.seriesName==="End"))==null?void 0:ve.value)??0,oe=y.find(se=>se.label===A),H=(oe==null?void 0:oe.changeCents)??0,ge=H>0?"+":"";return`${d(A)}<br/>End: ${I(he)}<br/>Change: ${ge}${I(H)}`}},xAxis:{type:"value",max:D,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:y.map(g=>g.label),axisLabel:{color:w,fontSize:s,formatter:g=>Ba(g)},axisTick:{show:!1},axisLine:{show:!1}},series:[{name:"End",type:"bar",data:y.map(g=>({value:g.endCents,itemStyle:{color:g.changeCents>0?c:g.changeCents<0?u:p}})),barWidth:30,barCategoryGap:"12%",barGap:"0%",showBackground:!0,backgroundStyle:{color:h},label:{show:!0,position:"right",distance:6,color:b,fontSize:s,formatter:g=>{const A=y[g.dataIndex];return!A||A.changeCents===0?"":`${A.changeCents>0?"+":""}${I(A.changeCents)}`}}}]}),window.requestAnimationFrame(()=>{P==null||P.resize(),V==null||V.resize()}),Ra()}function Ga(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var p,h,b;const r=a.target,n=r==null?void 0:r.closest("thead th");if(!n)return;const o=n.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(n);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(p=t.order)==null?void 0:p.call(t),c=Array.isArray(l)?l[0]:void 0,u=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(h=t.order)==null||h.call(t,[[s,u]]),(b=t.draw)==null||b.call(t,!1)},!0)}async function N(){var p,h;const[e,t,a]=await Promise.all([sa(),ca(),ua()]),r=Qe(t).sort((b,w)=>b.sortOrder-w.sortOrder||b.name.localeCompare(w.name));a.some(b=>b.key==="currencyCode")||(await B("currencyCode",ne),a.push({key:"currencyCode",value:ne})),a.some(b=>b.key==="currencySymbol")||(await B("currencySymbol",re),a.push({key:"currencySymbol",value:re})),a.some(b=>b.key==="darkMode")||(await B("darkMode",be),a.push({key:"darkMode",value:be}));const n=a.find(b=>b.key==="themeId"),o=We(n==null?void 0:n.value);n?n.value!==o&&(await B("themeId",o),n.value=o):(await B("themeId",o),a.push({key:"themeId",value:o})),a.some(b=>b.key==="showMarketsGraphs")||(await B("showMarketsGraphs",Me),a.push({key:"showMarketsGraphs",value:Me})),Da(a);let i=null,s=null;try{const b=await((h=(p=navigator.storage)==null?void 0:p.estimate)==null?void 0:h.call(p));i=typeof(b==null?void 0:b.usage)=="number"?b.usage:null,s=typeof(b==null?void 0:b.quota)=="number"?b.quota:null}catch{i=null,s=null}let l=f.reportDateFrom,c=f.reportDateTo,u=f.importText;if(r.length>0&&u===ae?u="":r.length===0&&!u.trim()&&(u=ae),!ft){const b=Ca(e);b&&(l=b),c=new Date().toISOString().slice(0,10),ft=!0}f={...f,inventoryRecords:e,categories:r,settings:a,storageUsageBytes:i,storageQuotaBytes:s,reportDateFrom:l,reportDateTo:c,importText:u},q()}function x(e){if(e)return f.categories.find(t=>t.id===e)}function Ua(e){const t=x(e);return t?t.pathNames.join(" / "):"-"}function _a(e){return Ua(e)}function za(e){const t=x(e);return t?t.pathIds.some(a=>{var r;return((r=x(a))==null?void 0:r.active)===!1}):!1}function Ha(e){const t=x(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const r=x(a);if((r==null?void 0:r.active)===!1)return!0}return!1}function Ka(e){return e.active&&!Ha(e)}function ee(e){return e==null?"":(e/100).toFixed(2)}function tt(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="unitPrice"]');if(!t||!a||!r)return;const n=Number(t.value),o=Ee(a.value);if(!Number.isFinite(n)||n<=0||o==null||o<0){r.value="";return}r.value=(Math.round(o/n)/100).toFixed(2)}function Ft(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="baselineValue"]'),n=e.querySelector('input[name="baselineValueDisplay"]');!t||!a||!r||(t.value==="create"&&(r.value=a.value),n&&(n.value=r.value||a.value))}function Rt(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),r=e.querySelector('input[name="quantity"]'),n=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!a||!r)return;const l=x(t.value),c=(l==null?void 0:l.evaluationMode)==="spot",u=(l==null?void 0:l.evaluationMode)==="snapshot";a.hidden=!c,c?r.readOnly=!1:((!Number.isFinite(Number(r.value))||Number(r.value)<=0)&&(r.value="1"),r.readOnly=!0),n&&(n.hidden=!u),u&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function at(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),r=e.querySelector('input[name="spotValue"]'),n=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]'),i=e.querySelector("[data-spot-refresh-group]"),s=e.querySelector('[data-action="refresh-spot-value"]');if(!t||!a||!r||!n||!o)return;const l=t.value==="spot",c=String(E("alphaVantageApiKey")||"").trim().length>0;a.hidden=!l,r.disabled=!l,n.hidden=!(l&&c),o.disabled=!(l&&c);const u=o.value.trim().length>0;i&&(i.hidden=!(l&&u&&c)),s&&(s.disabled=!l||!u||!c||L||Date.now()<F)}function Q(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function Ot(e){return e.active&&!e.archived}function Bt(){const e=f.inventoryRecords.filter(Ot),t=f.categories.filter(o=>!o.isArchived),a=ya(e,t),r=new Map(f.categories.map(o=>[o.id,o])),n=new Map;for(const o of e){const i=r.get(o.categoryId);if(i)for(const s of i.pathIds)n.set(s,(n.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:n}}function jt(e,t){const a=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const r=new Map,n=o=>{const i=r.get(o);if(i!=null)return i;const s=x(o);if(!s||s.isArchived)return r.set(o,0),0;let l=0;const c=a.get(s.id)||[];return c.length>0?l=c.reduce((u,p)=>u+n(p.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,r.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||n(o.id)}),r}function Gt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>_a(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?I(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>I(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Yes":"No",filterable:!0,filterOp:"eq"}]}function Xa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":I(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function Ut(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function Za(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function Qa(){const e=Gt(),t=Xa(),a=t.filter(p=>p.key==="name"||p.key==="parent"||p.key==="path"),r=t.filter(p=>p.key!=="name"&&p.key!=="parent"&&p.key!=="path"),n=Le(f.categories),o=He(Ut(),f.filters,"inventoryTable",e,{categoryDescendantsMap:n}),{categoryTotals:i,categoryQty:s}=Bt(),l=jt(i,s),c=[...a,{key:"computedQty",label:"Qty",getValue:p=>s.get(p.id)||0,getDisplay:p=>String(s.get(p.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:p=>i.get(p.id)||0,getDisplay:p=>I(i.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},...r,{key:"computedTotalCents",label:"Total",getValue:p=>l.get(p.id)||0,getDisplay:p=>I(l.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:p=>p.active&&!p.isArchived,getDisplay:p=>p.active&&!p.isArchived?"Yes":"No",filterable:!0,filterOp:"eq"}],u=He(Za(),f.filters,"categoriesList",c);return{inventoryColumns:e,categoryColumns:c,categoryDescendantsMap:n,filteredInventoryRecords:o,filteredCategories:u,categoryTotals:i,categoryQty:s}}function gt(e,t,a=""){const r=f.filters.filter(n=>n.viewId===e);return`
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
                >
                  <span class="breadcrumb-filter-text">${d(n.label)}</span><span class="breadcrumb-filter-remove ms-1" aria-hidden="true">×</span>
                </button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function Oe(e,t,a){const r=a.getValue(t),n=a.getDisplay(t),o=r==null?"":String(r),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(n);if(n.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),c=za(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}</span></button>`}function _t(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function Wa(e,t){const a=e.map((r,n)=>{let o=0,i=!1;for(const l of t){const c=r.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(o+=c,i=!0)}const s=i?String(r.key).toLowerCase().includes("cents")?I(o):_t(o):n===0?"Totals":"";return`<th class="${Q(r)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function Ya(e,t){const a=new Set(t.map(i=>i.id)),r=t.filter(i=>!i.parentId||!a.has(i.parentId)),n=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=n.has(String(i.key))?r:t;let c=0,u=!1;for(const h of l){const b=i.getValue(h);typeof b=="number"&&Number.isFinite(b)&&(c+=b,u=!0)}const p=u?String(i.key).toLowerCase().includes("cents")?I(c):_t(c):s===0?"Totals":"";return`<th class="${Q(i)}">${d(p)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function vt(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function Ja(e,t){const a=[...e];return a.filter(n=>{for(const o of a){if(o===n)continue;const i=t.get(o);if(i!=null&&i.has(n))return!1}return!0})}function en(e){const t=new Set(f.filters.filter(r=>r.viewId==="categoriesList").map(r=>r.id)),a=new Set(f.filters.filter(r=>r.viewId==="inventoryTable"&&r.field==="categoryId"&&r.op==="inCategorySubtree"&&!!r.linkedToFilterId&&t.has(r.linkedToFilterId)).map(r=>r.value));return a.size>0?Ja(a,e):f.categories.filter(r=>!r.isArchived&&r.active&&r.parentId==null).map(r=>r.id)}function tn(e){const t=en(e),a=Oa(),{categoryTotals:r,categoryQty:n}=Bt(),o=jt(r,n),i=new Map;for(const S of f.inventoryRecords){if(!Ot(S))continue;const y=S.baselineValueCents??0;if(!Number.isFinite(y))continue;const v=x(S.categoryId);if(v)for(const D of v.pathIds)i.set(D,(i.get(D)||0)+y)}const s=[],l={};let c=0,u=0,p=0,h=0;const b=S=>{const y=x(S);if(!y)return null;const v=i.get(S)||0,D=o.get(S)||0,g=D-v,A=v>0?g/v:null;return{marketId:S,marketLabel:y.pathNames.join(" / "),startValueCents:v,endValueCents:D,contributionsCents:D-v,netGrowthCents:g,growthPct:A}},w=new Set,O=S=>w.has(S)?[]:(w.add(S),(a.get(S)||[]).map(y=>b(y)).filter(y=>y!=null).sort((y,v)=>y.marketLabel.localeCompare(v.marketLabel)));for(const S of t){const y=b(S);y&&(l[S]=O(S),c+=y.startValueCents||0,u+=y.endValueCents||0,p+=y.contributionsCents||0,h+=y.netGrowthCents||0,s.push(y))}return p=u-c,h=u-c,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:c,endTotalCents:u,contributionsTotalCents:p,netGrowthTotalCents:h,hasManualSnapshots:!1}}function Be(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function J(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function an(){if(T.kind==="none")return"";const e=E("currencySymbol")||re,t=String(E("alphaVantageApiKey")||"").trim().length>0,a=(r,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(r!=null&&r.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(T.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((E("currencyCode")||ne).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${va.map(r=>`<option value="${d(r.value)}" ${(E("currencySymbol")||re)===r.value?"selected":""}>${d(r.label)}</option>`).join("")}
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
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${E("showMarketsGraphs")??Me?"checked":""} />
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
    `;if(T.kind==="categoryCreate"||T.kind==="categoryEdit"){const r=T.kind==="categoryEdit",n=T.kind==="categoryEdit"?x(T.categoryId):void 0;if(r&&!n)return"";const o=r&&n?f.inventoryRecords.filter(l=>l.categoryId===n.id).sort((l,c)=>c.purchaseDate.localeCompare(l.purchaseDate)):[],i=r&&n?new Set(At(f.categories,n.id)):void 0,s=Le(f.categories);return He(Ut(),f.filters,"inventoryTable",Gt(),{categoryDescendantsMap:s}),`
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
                       ${L||Date.now()<F?"disabled":""}
                     >${L?"Getting latest spot value...":"Get latest spot value"}</button>
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
                                <td class="text-end">${d(I(l.totalPriceCents))}</td>
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
    `}if(T.kind==="inventoryCreate")return`
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
    `;if(T.kind==="inventoryEdit"){const r=T,n=f.inventoryRecords.find(o=>o.id===r.inventoryId);return n?`
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
    `:""}return""}function q(){const e=window.scrollX,t=window.scrollY,a=C.querySelector('details[data-section="data-tools"]');a&&(ut=a.open);const r=C.querySelector('details[data-section="investments"]');r&&(pt=r.open),Fa(),Pa();const{inventoryColumns:n,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=Qa(),c="Investments",u="Maintain your investments locally with fast filtering, category tracking, and clear totals.",p="Edit settings",h=tn(i),b=Va(h.rows),w=f.filters.filter(m=>m.viewId==="categoriesList"),O=w.length?w.map(m=>m.label).join(" > "):"No filters",S=E("showMarketsGraphs")??Me,y=l.some(m=>m.parentId==null),v=S&&y&&b.length>0,D=new Set([...te].filter(m=>{var $;return((($=h.childRowsByParent[m])==null?void 0:$.length)||0)>0}));D.size!==te.size&&(te=D);const g=h.startTotalCents>0?h.netGrowthTotalCents/h.startTotalCents:null,A=f.exportText||zt(),he=s.map(m=>`
        <tr class="${[Ka(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${n.map(k=>`<td class="${Q(k)}">${Oe("inventoryTable",m,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),oe=new Set(l.map(m=>m.id)),H=new Map;for(const m of l){const $=m.parentId&&oe.has(m.parentId)?m.parentId:null,k=H.get($)||[];k.push(m),H.set($,k)}for(const m of H.values())m.sort(($,k)=>$.sortOrder-k.sortOrder||$.name.localeCompare(k.name));const ge=[],ie=(m,$)=>{const k=H.get(m)||[];for(const M of k)ge.push({category:M,depth:$}),ie(M.id,$+1)};ie(null,0);const ve=String(E("alphaVantageApiKey")||"").trim().length>0,se=ge.map(({category:m,depth:$})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${o.map(k=>{if(k.key==="name"){const M=$>0?($-1)*1.1:0;return`<td class="${Q(k)}"><div class="market-name-wrap" style="padding-left:${M.toFixed(2)}rem">${$>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Oe("categoriesList",m,k)}</div></td>`}return`<td class="${Q(k)}">${Oe("categoriesList",m,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            ${m.evaluationMode==="spot"&&(m.spotCode||"").trim()&&ve?`<button
                     type="button"
                     class="btn btn-sm btn-outline-primary action-menu-btn"
                     data-action="refresh-category-spot"
                     data-id="${m.id}"
                     title="Get latest spot price"
                     aria-label="Get latest spot price"
                     ${L||Date.now()<F?"disabled":""}
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
            <h1 class="display-6 mb-1">${d(c)}</h1>
            <p class="text-body-secondary mb-0">${d(u)}</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="header-indicator-btn btn btn-primary btn-sm" data-action="open-settings" aria-label="${d(p)}">${d(p)}</button>
          </div>
        </div>
        ${fe?`<div class="alert alert-${fe.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(fe.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          ${v?`
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
          <p class="small text-body-secondary mb-2">Filter: ${d(O)}</p>
          ${h.rows.length===0?`
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
                  ${h.rows.map(m=>{const $=h.childRowsByParent[m.marketId]||[],k=te.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${$.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d(I(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d(I(m.endValueCents))}</td>
                      <td class="text-end ${J(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d(I(m.netGrowthCents))}</td>
                      <td class="text-end ${J(m.growthPct)}">${d(Be(m.growthPct))}</td>
                      </tr>
                      ${$.map(M=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(m.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(M.marketLabel)}</td>
                              <td class="text-end">${M.startValueCents==null?"—":d(I(M.startValueCents))}</td>
                              <td class="text-end">${M.endValueCents==null?"—":d(I(M.endValueCents))}</td>
                              <td class="text-end ${J(M.netGrowthCents)}">${M.netGrowthCents==null?"—":d(I(M.netGrowthCents))}</td>
                              <td class="text-end ${J(M.growthPct)}">${d(Be(M.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(I(h.startTotalCents))}</th>
                    <th class="text-end">${d(I(h.endTotalCents))}</th>
                    <th class="text-end ${J(h.netGrowthTotalCents)}">${d(I(h.netGrowthTotalCents))}</th>
                    <th class="text-end ${J(g)}">${d(Be(g))}</th>
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
        ${gt("categoriesList","Markets","")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(m=>`<th class="${Q(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${se}
            </tbody>
            ${Ya(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${pt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-primary" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${gt("inventoryTable","Investments","")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${n.map(m=>`<th class="${Q(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${he}
              </tbody>
              ${Wa(n,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${ut?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(Re(f.storageUsageBytes)):`${d(Re(f.storageUsageBytes))} of ${d(Re(f.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Export</button>
          </div>
          <label class="form-label mb-0">Export / Copy JSON
            <input class="form-control" id="export-text" readonly value="${d(A)}" />
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
        App version: ${d(ha)}
      </footer>
    </div>
    ${an()}
  `;const we=C.querySelector("#inventory-form");we&&(Rt(we),tt(we),Ft(we));const nt=C.querySelector("#category-form");nt&&at(nt),qa(),ja(b),Xe(),window.scrollTo(e,t)}function nn(e,t){const a=C.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const n of a)n.hidden=!t;const r=C.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);r&&(r.textContent=t?"▾":"▸",r.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function rn(){return{schemaVersion:2,exportedAt:G(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function zt(){return JSON.stringify(rn())}function on(e,t,a){const r=new Blob([t],{type:a}),n=URL.createObjectURL(r),o=document.createElement("a");o.href=n,o.download=e,o.click(),URL.revokeObjectURL(n)}async function sn(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),r=String(t.get("currencySymbol")||"").trim(),n=String(t.get("alphaVantageApiKey")||"").trim(),o=t.get("darkMode")==="on",i=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!r){alert("Select a currency symbol.");return}await B("currencyCode",a),await B("currencySymbol",r),await B("alphaVantageApiKey",n),await B("darkMode",o),await B("showMarketsGraphs",i),_(),await N()}async function ln(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("categoryId")||"").trim(),n=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),c=t.get("active")==="on",u=i==="spot"||i==="snapshot"?i:void 0,p=u==="spot"&&s?Ee(s):void 0,h=u==="spot"&&l?l:void 0;if(!n)return;if(u==="spot"&&s&&p==null){alert("Spot value is invalid.");return}const b=p??void 0,w=o||null;if(w&&!x(w)){alert("Select a valid parent market.");return}if(a==="edit"){if(!r)return;const v=await kt(r);if(!v){alert("Market not found.");return}if(w===v.id){alert("A category cannot be its own parent.");return}if(w&&At(f.categories,v.id).includes(w)){alert("A category cannot be moved under its own subtree.");return}const D=v.parentId!==w;v.name=n,v.parentId=w,v.evaluationMode=u,v.spotValueCents=b,v.spotCode=h,v.active=c,D&&(v.sortOrder=f.categories.filter(g=>g.parentId===w&&g.id!==v.id).length),v.updatedAt=G(),await xe(v),_(),await N();return}const O=G(),S=f.categories.filter(v=>v.parentId===w).length,y={id:crypto.randomUUID(),name:n,parentId:w,pathIds:[],pathNames:[],depth:0,sortOrder:S,evaluationMode:u,spotValueCents:b,spotCode:h,active:c,isArchived:!1,createdAt:O,updatedAt:O};await xe(y),_(),await N()}async function cn(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("inventoryId")||"").trim(),n=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=Ee(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),c=l===""?null:Ee(l),u=a==="create"?s??void 0:c??void 0,p=String(t.get("categoryId")||""),h=t.get("active")==="on",b=String(t.get("notes")||"").trim();if(!n||!o){alert("Date and product name are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&c!=null&&c<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&c==null){alert("Baseline value is invalid.");return}if(p&&!x(p)){alert("Select a valid category.");return}const w=Math.round(s/i);if(a==="edit"){if(!r)return;const y=await Ze(r);if(!y){alert("Inventory record not found.");return}y.purchaseDate=n,y.productName=o,y.quantity=i,y.totalPriceCents=s,y.baselineValueCents=u,y.unitPriceCents=w,y.unitPriceSource="derived",y.categoryId=p,y.active=h,y.notes=b||void 0,y.updatedAt=G(),await $e(y),_(),await N();return}const O=G(),S={id:crypto.randomUUID(),purchaseDate:n,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:u,unitPriceCents:w,unitPriceSource:"derived",categoryId:p,active:h,archived:!1,notes:b||void 0,createdAt:O,updatedAt:O};await $e(S),_(),await N()}async function dn(e,t){const a=await Ze(e);a&&(a.active=t,a.updatedAt=G(),await $e(a),await N())}async function un(e){const t=await Ze(e);!t||!window.confirm(`Delete investment record "${t.productName}" permanently? This cannot be undone.`)||(await la(e),_(),await N())}async function pn(e){const t=await kt(e);if(!t)return;const a=f.inventoryRecords.filter(o=>o.categoryId===e).length;if(!window.confirm(`Delete market "${t.pathNames.join(" / ")}"? This cannot be undone.

This will also affect:
- ${a} investment record(s): their Market will be cleared.`))return;const n=G();for(const o of f.inventoryRecords)o.categoryId===e&&(o.categoryId="",o.updatedAt=n,await $e(o));for(const o of f.categories)o.parentId===e&&(o.parentId=null,o.updatedAt=n,await xe(o));await da(e),_(),await N()}function Ht(e){const t=G();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function fn(e){const t=G(),a=Number(e.quantity),r=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(r))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const n=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:r,baselineValueCents:Number.isFinite(n)?n:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function mn(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Qe(t.categories.map(Ht)),r=new Set(a.map(s=>s.id)),n=t.purchases.map(fn);for(const s of n)if(!r.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:String(s.key)==="themeId"?We(s.value):s.value})):[{key:"currencyCode",value:ne},{key:"currencySymbol",value:re},{key:"themeId",value:Mt},{key:"darkMode",value:be}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await $t({purchases:n,categories:a,settings:o}),j({importText:ae}),await N()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}async function bn(){const e=Qe(Ke.categories.map(Ht)),t=Ke.settings.map(r=>({key:String(r.key),value:r.value}));window.confirm("Load default markets template and replace all existing data? This will keep no investments.")&&(await $t({purchases:[],categories:e,settings:t}),j({filters:Te(),importText:ae}),await N(),Nt({tone:"success",text:"Default markets loaded."}))}function Kt(e){return e.target instanceof HTMLElement?e.target:null}function wt(e){const t=e.dataset.viewId,a=e.dataset.field,r=e.dataset.op,n=e.dataset.value,o=e.dataset.label;if(!t||!a||!r||n==null||!o)return;const i=(u,p)=>u.viewId===p.viewId&&u.field===p.field&&u.op===p.op&&u.value===p.value;let s=fa(f.filters,{viewId:t,field:a,op:r,value:n,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const u=x(l);if(u){const p=s.find(h=>i(h,{viewId:t,field:a,op:r,value:n}));if(p){const h=`Market: ${u.pathNames.join(" / ")}`;s=s.filter(w=>w.linkedToFilterId!==p.id);const b=s.findIndex(w=>i(w,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id}));if(b>=0){const w=s[b];s=[...s.slice(0,b),{...w,label:h,linkedToFilterId:p.id},...s.slice(b+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id,label:h,linkedToFilterId:p.id}]}}}let c={filters:s};t==="inventoryTable"&&a==="archived"&&n==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&n==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&n==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),j(c)}function Xt(){pe!=null&&(window.clearTimeout(pe),pe=null)}function yn(e){const t=f.filters.filter(r=>r.viewId===e),a=t[t.length-1];a&&j({filters:xt(f.filters,a.id)})}C.addEventListener("click",async e=>{const t=Kt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const r=a.dataset.action;if(r){if(r==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Xt(),e.detail>1)return;pe=window.setTimeout(()=>{pe=null,wt(a)},220);return}wt(a);return}if(r==="remove-filter"){const n=a.dataset.filterId;if(!n)return;j({filters:xt(f.filters,n)});return}if(r==="clear-filters"){const n=a.dataset.viewId;if(!n)return;const o=ma(f.filters,n),i=Te().find(s=>s.viewId===n);j({filters:i?[...o,i]:o});return}if(r==="open-create-category"){Z({kind:"categoryCreate"});return}if(r==="open-create-inventory"){Z({kind:"inventoryCreate"});return}if(r==="open-settings"){Z({kind:"settings"});return}if(r==="apply-report-range"){const n=C.querySelector('input[name="reportDateFrom"]'),o=C.querySelector('input[name="reportDateTo"]');if(!n||!o)return;const i=n.value,s=o.value,l=vt(i),c=vt(s,!0);if(l==null||c==null||l>c){Nt({tone:"warning",text:"Select a valid report date range."});return}j({reportDateFrom:i,reportDateTo:s});return}if(r==="reset-report-range"){j({reportDateFrom:Dt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(r==="copy-total-to-baseline"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="inventory-form")return;const o=n.querySelector('input[name="totalPrice"]'),i=n.querySelector('input[name="baselineValue"]'),s=n.querySelector('input[name="baselineValueDisplay"]'),l=n.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',Se!=null&&window.clearTimeout(Se),Se=window.setTimeout(()=>{Se=null,l.isConnected&&(l.textContent="")},1800));return}if(r==="refresh-spot-value"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="category-form")return;await La(n);return}if(r==="toggle-growth-children"){const n=a.dataset.marketId;if(!n)return;const o=new Set(te),i=!o.has(n);i?o.add(n):o.delete(n),te=o,nn(n,i);return}if(r==="edit-category"){const n=a.dataset.id;n&&Z({kind:"categoryEdit",categoryId:n});return}if(r==="refresh-category-spot"){const n=a.dataset.id;n&&await Na(n);return}if(r==="edit-inventory"){const n=a.dataset.id;n&&Z({kind:"inventoryEdit",inventoryId:n});return}if(r==="close-modal"||r==="close-modal-backdrop"){if(r==="close-modal-backdrop"&&!t.classList.contains("modal"))return;_();return}if(r==="toggle-inventory-active"){const n=a.dataset.id,o=a.dataset.nextActive==="true";n&&await dn(n,o);return}if(r==="delete-inventory-record"){const n=a.dataset.id;n&&await un(n);return}if(r==="delete-category-record"){const n=a.dataset.id;n&&await pn(n);return}if(r==="download-json"){on(`investments-app-${new Date().toISOString().slice(0,10)}.json`,zt(),"application/json");return}if(r==="replace-import"){await mn();return}if(r==="load-default-markets"){await bn();return}if(r==="wipe-all"){const n=document.querySelector("#wipe-confirm");if(!n||n.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await pa(),j({filters:Te(),exportText:"",importText:ae,showArchivedInventory:!1,showArchivedCategories:!1}),await N();return}}});C.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Xt(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const r=t.closest("tr[data-row-edit]");if(!r)return;const n=r.dataset.id,o=r.dataset.rowEdit;if(!(!n||!o)){if(o==="inventory"){Z({kind:"inventoryEdit",inventoryId:n});return}o==="category"&&Z({kind:"categoryEdit",categoryId:n})}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await sn(t);return}if(t.id==="category-form"){await ln(t);return}if(t.id==="inventory-form"){await cn(t);return}}});C.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="spotCode"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="category-form"&&at(a)}if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(tt(a),Ft(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});C.addEventListener("change",async e=>{var n;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(Rt(o),tt(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&at(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(n=t.files)==null?void 0:n[0];if(!a)return;const r=await a.text();try{j({importText:JSON.stringify(JSON.parse(r))})}catch{j({importText:r})}});C.addEventListener("pointermove",e=>{const t=Kt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");Ae=(a==null?void 0:a.dataset.filterSectionViewId)||null});C.addEventListener("pointerleave",()=>{Ae=null});document.addEventListener("keydown",e=>{if(T.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!Ae)return;e.preventDefault(),yn(Ae);return}if(e.key==="Escape"){e.preventDefault(),_();return}if(e.key!=="Tab")return;const t=Pt();if(!t)return;const a=Vt(t);if(!a.length){e.preventDefault(),t.focus();return}const r=a[0],n=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===r||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),n.focus());return}o===n&&(e.preventDefault(),r.focus())});N();
