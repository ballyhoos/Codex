(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const Ue=(e,t)=>t.some(a=>e instanceof a);let ot,it;function Xt(){return ot||(ot=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Kt(){return it||(it=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const je=new WeakMap,Le=new WeakMap,Me=new WeakMap;function Yt(e){const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(W(e.result)),n()},i=()=>{r(e.error),n()};e.addEventListener("success",o),e.addEventListener("error",i)});return Me.set(t,e),t}function Qt(e){if(je.has(e))return;const t=new Promise((a,r)=>{const n=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),n()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});je.set(e,t)}let Ge={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return je.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return W(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function It(e){Ge=e(Ge)}function Wt(e){return Kt().includes(e)?function(...t){return e.apply(_e(this),t),W(this.request)}:function(...t){return W(e.apply(_e(this),t))}}function Jt(e){return typeof e=="function"?Wt(e):(e instanceof IDBTransaction&&Qt(e),Ue(e,Xt())?new Proxy(e,Ge):e)}function W(e){if(e instanceof IDBRequest)return Yt(e);if(Le.has(e))return Le.get(e);const t=Jt(e);return t!==e&&(Le.set(e,t),Me.set(t,e)),t}const _e=e=>Me.get(e);function ea(e,t,{blocked:a,upgrade:r,blocking:n,terminated:o}={}){const i=indexedDB.open(e,t),s=W(i);return r&&i.addEventListener("upgradeneeded",l=>{r(W(i.result),l.oldVersion,l.newVersion,W(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),n&&l.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const ta=["get","getKey","getAll","getAllKeys","count"],aa=["put","add","delete","clear"],Ne=new Map;function st(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Ne.get(t))return Ne.get(t);const a=t.replace(/FromIndex$/,""),r=t!==a,n=aa.includes(a);if(!(a in(r?IDBIndex:IDBObjectStore).prototype)||!(n||ta.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,n?"readwrite":"readonly");let c=l.store;return r&&(c=c.index(s.shift())),(await Promise.all([c[a](...s),n&&l.done]))[0]};return Ne.set(t,o),o}It(e=>({...e,get:(t,a,r)=>st(t,a)||e.get(t,a,r),has:(t,a)=>!!st(t,a)||e.has(t,a)}));const na=["continue","continuePrimaryKey","advance"],lt={},ze=new WeakMap,kt=new WeakMap,ra={get(e,t){if(!na.includes(t))return e[t];let a=lt[t];return a||(a=lt[t]=function(...r){ze.set(this,kt.get(this)[t](...r))}),a}};async function*oa(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,ra);for(kt.set(a,t),Me.set(a,_e(t));t;)yield a,t=await(ze.get(a)||t.continue()),ze.delete(a)}function ct(e,t){return t===Symbol.asyncIterator&&Ue(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ue(e,[IDBIndex,IDBObjectStore])}It(e=>({...e,get(t,a,r){return ct(t,a)?oa:e.get(t,a,r)},has(t,a){return ct(t,a)||e.has(t,a)}}));const V=ea("investment_purchase_tracker",3,{async upgrade(e,t,a,r){const n=r,o=e.objectStoreNames.contains("purchases")?n.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?r.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?r.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.archived!="boolean"&&(c.archived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let u=!1;typeof c.active!="boolean"&&(c.active=!0,u=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,u=!0),u&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function ia(){return(await V).getAll("inventory")}async function ke(e){await(await V).put("inventory",e)}async function Ye(e){return(await V).get("inventory",e)}async function sa(e){await(await V).delete("inventory",e)}async function la(){return(await V).getAll("categories")}async function $e(e){await(await V).put("categories",e)}async function $t(e){return(await V).get("categories",e)}async function ca(e){await(await V).delete("categories",e)}async function da(){return(await V).getAll("settings")}async function U(e,t){await(await V).put("settings",{key:e,value:t})}async function xt(e){const a=(await V).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const r of e.purchases)await a.objectStore("inventory").put(r);for(const r of e.categories)await a.objectStore("categories").put(r);for(const r of e.settings)await a.objectStore("settings").put(r);await a.done}async function ua(){const t=(await V).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function dt(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function pa(e,t){return e.some(r=>r.viewId===t.viewId&&r.field===t.field&&r.op===t.op&&r.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function At(e,t){const a=new Set([t]);let r=!0;for(;r;){r=!1;for(const n of e)n.linkedToFilterId&&a.has(n.linkedToFilterId)&&!a.has(n.id)&&(a.add(n.id),r=!0)}return e.filter(n=>!a.has(n.id))}function fa(e,t){return e.filter(a=>a.viewId!==t)}function He(e,t,a,r,n){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(r.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var p;const c=i.get(l.field);if(!c)return!0;const u=c.getValue(s);if(l.op==="eq")return String(u)===l.value;if(l.op==="isEmpty")return dt(u);if(l.op==="isNotEmpty")return!dt(u);if(l.op==="contains")return String(u).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const h=((p=n==null?void 0:n.categoryDescendantsMap)==null?void 0:p.get(l.value))||new Set([l.value]),b=String(u);return h.has(b)}return!0}))}function ma(e){const t=new Map(e.map(r=>[r.id,r])),a=new Map;for(const r of e){const n=a.get(r.parentId)||[];n.push(r),a.set(r.parentId,n)}return{byId:t,children:a}}function Pe(e){const{children:t}=ma(e),a=new Map;function r(n){const o=new Set([n]);for(const i of t.get(n)||[])for(const s of r(i.id))o.add(s);return a.set(n,o),o}for(const n of e)a.has(n.id)||r(n.id);return a}function Qe(e){const t=new Map(e.map(r=>[r.id,r]));function a(r){const n=[],o=[],i=new Set;let s=r;for(;s&&!i.has(s.id);)i.add(s.id),n.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:n,names:o,depth:Math.max(0,n.length-1)}}return e.map(r=>{const n=a(r);return{...r,pathIds:n.ids,pathNames:n.names,depth:n.depth}})}function Tt(e,t){return[...Pe(e).get(t)||new Set([t])]}function ba(e,t){const a=Pe(t),r=new Map;for(const n of t){const o=a.get(n.id)||new Set([n.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);r.set(n.id,i)}return r}const Et=document.querySelector("#app");if(!Et)throw new Error("#app not found");const C=Et;var St;const ya=((St=document.querySelector('meta[name="app-build-version"]'))==null?void 0:St.content)||"dev";let T={kind:"none"},de=null,K=null,Z=null,N=null,R=null,ut=!1,we=null,Re=!1,Fe=null,pe=null,xe=null,pt=!1,ft=!1,ne=new Set,mt=!1,Ce=null,le=null,fe=null,ce=null,me=null,P=!1,F=0,J=null,bt=0;const yt=new Map,Ze={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"themeId",value:"classic"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!0}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,spotCode:"XAU",isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,spotCode:"XAG",isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},re=JSON.stringify(Ze);function Ae(){return[{id:crypto.randomUUID(),viewId:"categoriesList",field:"active",op:"eq",value:"true",label:"Active: Yes"},{id:crypto.randomUUID(),viewId:"inventoryTable",field:"active",op:"eq",value:"true",label:"Active: Yes"}]}let f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:Pt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:Ae(),showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:re,storageUsageBytes:null,storageQuotaBytes:null};const oe="USD",ie="$",Dt="classic",Te=!1,Ee=!0,Mt=15e3,ht=1100,ha=60*60*1e3,ga=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function va(e){return e==="classic"}function We(e){return va(e)?e:Dt}function j(){return new Date().toISOString()}function wa(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function Pt(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function Ve(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,r=0;for(;a>=1024&&r<t.length-1;)a/=1024,r+=1;return`${a>=10||r===0?a.toFixed(0):a.toFixed(1)} ${t[r]}`}function I(e){const t=D("currencySymbol")||ie,a=Math.abs(e)/100,r=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(a);return`${e<0?"-":""}${t}${r}`}function De(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function Ca(e){return e.trim().toUpperCase().replace(/\s+/g,"")}function Sa(e){const t=e.replace(/[\/_-]/g,""),r={XAG:{metal:"XAG"},XAU:{metal:"XAU"},SILVER:{metal:"XAG"},GOLD:{metal:"XAU"},XAGUSD:{metal:"XAG",quoteCurrency:"USD"},XAUUSD:{metal:"XAU",quoteCurrency:"USD"}}[t];if(r)return{kind:"bullion",metal:r.metal,quoteCurrency:r.quoteCurrency,normalizedCode:t};let n=t.match(/^(XAG|XAU)([A-Z]{3})$/);return n?{kind:"bullion",metal:n[1],quoteCurrency:n[2],normalizedCode:t}:(n=t.match(/^(SILVER|GOLD)([A-Z]{3})$/),n?{kind:"bullion",metal:n[1]==="SILVER"?"XAG":"XAU",quoteCurrency:n[2],normalizedCode:t}:null)}function Ia(e){if(!e.startsWith("CRYPTO:"))return null;const t=e.slice(7).trim().toUpperCase();if(!t)return null;const a=t.match(/^([A-Z0-9]{2,20})[\/_-]([A-Z]{3})$/);if(a)return{kind:"crypto",symbol:a[1],quoteCurrency:a[2],normalizedCode:`CRYPTO:${a[1]}${a[2]}`};const r=t.replace(/[\/_-]/g,"");if(!/^[A-Z0-9]{2,24}$/.test(r))return null;const n=r.match(/^([A-Z0-9]{2,21})([A-Z]{3})$/);return n?{kind:"crypto",symbol:n[1],quoteCurrency:n[2],normalizedCode:`CRYPTO:${r}`}:{kind:"crypto",symbol:r,normalizedCode:`CRYPTO:${r}`}}function ka(e){const t=Ca(e);if(!t)return null;const a=Sa(t);if(a)return a;const r=Ia(t);return r||(/^[A-Z0-9][A-Z0-9.-]{0,19}$/.test(t)?{kind:"equity",symbol:t,normalizedCode:t}:null)}function Je(e){if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e!="string")return null;const t=Number(e.replace(/,/g,"").trim());return Number.isFinite(t)?t:null}function be(e,t="",a=[]){if(e==null)return a;const r=Je(e);if(r!=null)return a.push({path:t,value:r}),a;if(Array.isArray(e))return e.forEach((n,o)=>be(n,`${t}[${o}]`,a)),a;if(typeof e=="object")for(const[n,o]of Object.entries(e)){const i=t?`${t}.${n}`:n;be(o,i,a)}return a}function et(e,t){var o;const a=t.map(i=>i.toLowerCase()),r=e.find(i=>{const s=i.path.toLowerCase();return a.some(l=>s.includes(l))});if(r)return r.value;const n=e.find(i=>{const s=i.path.toLowerCase();return s.includes("price")||s.includes("rate")||s.includes("value")});return n?n.value:((o=e[0])==null?void 0:o.value)??null}function $a(e){const t=e.toLowerCase();return t.includes("rate limit")||t.includes("our standard api call frequency is")||t.includes("please consider optimizing your api call frequency")||t.includes("please consider spreading out your free api requests")||t.includes("1 request per second")||t.includes("25 requests per day")}async function te(e,t){const a=new URL("https://www.alphavantage.co/query");for(const[r,n]of Object.entries(e))a.searchParams.set(r,n);a.searchParams.set("apikey",t);for(let r=0;r<2;r+=1){const n=Date.now(),o=Math.max(0,bt+ht-n);o>0&&await new Promise(p=>window.setTimeout(p,o)),bt=Date.now();const i=await fetch(a.toString());if(!i.ok)throw new Error(`Request failed (${i.status}).`);const s=await i.json();if(typeof s["Error Message"]=="string")throw new Error(String(s["Error Message"]));const l=typeof s.Note=="string"?s.Note:null,c=typeof s.Information=="string"?s.Information:null,u=l||c;if(u&&$a(u)){if(r===0){await new Promise(p=>window.setTimeout(p,ht+200));continue}throw new Error("Alpha Vantage limit reached. Please wait and retry (free tier: 1 req/sec, 25/day).")}if(l)throw new Error(l);return s}throw new Error("Alpha Vantage request failed.")}function Ie(e){var n;const t=(n=e["Realtime Currency Exchange Rate"])==null?void 0:n["5. Exchange Rate"],a=Je(t);if(a!=null&&a>0)return a;const r=be(e);return et(r,["exchange rate","rate"])}function xa(e){const t=e["Global Quote"],a=Je(t==null?void 0:t["05. price"]);if(a!=null)return a;const r=be(e);return et(r,["global quote","price","close"])}function Aa(e,t){const a=be(e);return et(a,[...t==="XAG"?["silver","xag"]:["gold","xau"],"price","rate","value"])}function Ta(e){const t=["currency","Currency","quote_currency","QuoteCurrency","to_currency"];for(const r of t){const n=e[r];if(typeof n=="string"){const o=n.trim().toUpperCase();if(/^[A-Z]{3}$/.test(o))return o}}const a=Object.entries(e).filter(([,r])=>typeof r=="string");for(const[r,n]of a){const o=n.trim().toUpperCase();if(!/^[A-Z]{3}$/.test(o))continue;if(r.toLowerCase().includes("currency"))return o}return null}async function Ea(e,t,a){if(e===t)return 1;const r=`${e}->${t}`,n=yt.get(r);if(n&&Date.now()-n.cachedAt<ha)return n.rate;const o=await te({function:"CURRENCY_EXCHANGE_RATE",from_currency:e,to_currency:t},a),i=Ie(o);if(i==null||i<=0)throw new Error("Could not parse FX exchange rate.");return yt.set(r,{rate:i,cachedAt:Date.now()}),i}function Da(e){return e.toUpperCase().endsWith(".AX")?"AUD":null}function tt(){J!=null&&(window.clearTimeout(J),J=null)}function D(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function Ma(e){var o,i;const t=(o=e.find(s=>s.key==="darkMode"))==null?void 0:o.value,a=typeof t=="boolean"?t:Te,r=(i=e.find(s=>s.key==="themeId"))==null?void 0:i.value,n=We(r);document.documentElement.setAttribute("data-bs-theme",a?"dark":"light"),document.documentElement.setAttribute("data-app-theme",n)}function B(e){f={...f,...e},L()}function Xe(e){le!=null&&(window.clearTimeout(le),le=null),fe=e,L(),e&&(le=window.setTimeout(()=>{le=null,fe=null,L()},3500))}function G(e){ce!=null&&(window.clearTimeout(ce),ce=null),me=e,L(),e&&(ce=window.setTimeout(()=>{ce=null,me=null,L()},5e3))}function Y(e){T.kind==="none"&&document.activeElement instanceof HTMLElement&&(de=document.activeElement),T=e,L()}function _(){T.kind!=="none"&&(T={kind:"none"},P=!1,tt(),L(),de&&de.isConnected&&de.focus(),de=null)}function qe(e){const t=e.querySelector('[data-action="refresh-spot-value"]'),a=e.querySelector('[data-role="spot-refresh-status"]');return{button:t,status:a}}function X(e,t,a){const{status:r}=qe(e);if(!r)return;r.textContent=a,r.classList.remove("text-body-secondary","text-success","text-warning","text-danger");const n={muted:"text-body-secondary",success:"text-success",warning:"text-warning",danger:"text-danger"};r.classList.add(n[t])}function ue(e){const{button:t}=qe(e);if(!t)return;const a=Date.now()<F;t.disabled=P||a,t.textContent=P?"Getting latest spot value...":"Get latest spot value"}async function qt(e,t,a){const r=ka(e);if(!r)throw new Error("Unsupported spot code format.");let n=null,o=null;if(r.kind==="bullion"){const s=await te({function:"GOLD_SILVER_SPOT",symbol:r.metal},a);if(n=Aa(s,r.metal),o=r.quoteCurrency||Ta(s)||"USD",n==null||n<=0){const l=r.quoteCurrency||o||"USD",c=await te({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.metal,to_currency:l},a);n=Ie(c),o=l}}else if(r.kind==="equity"){const s=await te({function:"GLOBAL_QUOTE",symbol:r.symbol},a);if(n=xa(s),n==null||n<=0)throw new Error("Could not parse quote price for this symbol.");o=Da(r.symbol)||t}else{const s=r.quoteCurrency||"USD";try{const l=await te({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.symbol,to_currency:s},a);if(n=Ie(l),n==null||n<=0)throw new Error("Could not parse crypto spot price for this symbol.");o=s}catch(l){if(r.quoteCurrency||t==="USD")throw l;const c=await te({function:"CURRENCY_EXCHANGE_RATE",from_currency:r.symbol,to_currency:"USD"},a);if(n=Ie(c),n==null||n<=0)throw new Error("Could not parse crypto spot price for this symbol.");o="USD"}}if(n==null||n<=0)throw new Error("Could not parse a valid price for this code.");(!o||!/^[A-Z]{3}$/.test(o))&&(o=t);let i=n;if(o!==t){const s=await Ea(o,t,a);i=n*s}if(!Number.isFinite(i)||i<=0)throw new Error("Received invalid price after conversion.");return Math.round(i*100)}async function Pa(e){if(P)return;const t=e.querySelector('input[name="mode"]'),a=e.querySelector('select[name="evaluationMode"]'),r=e.querySelector('input[name="spotCode"]'),n=e.querySelector('input[name="spotValue"]');if(!t||t.value!=="edit"||!a||a.value!=="spot"||!r||!n)return;const o=r.value.trim();if(!o){X(e,"warning","Set a code before refreshing.");return}if(Date.now()<F){const l=Math.max(1,Math.ceil((F-Date.now())/1e3));X(e,"muted",`Please wait ${l}s before refreshing again.`),ue(e);return}const i=String(D("alphaVantageApiKey")||"").trim();if(!i){X(e,"warning","Set Alpha Vantage API Key in Settings first.");return}const s=String(D("currencyCode")||oe).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(s)){X(e,"danger","Invalid app currency setting.");return}P=!0,ue(e),X(e,"muted","Refreshing latest value...");try{const l=await qt(o,s,i);n.value=ae(l),X(e,"success","Value refreshed.")}catch(l){const c=l instanceof Error?l.message:"Refresh failed.";X(e,"danger",c)}finally{P=!1,F=Date.now()+Mt,ue(e),tt();const l=Math.max(0,F-Date.now());J=window.setTimeout(()=>{J=null;const c=C.querySelector("#category-form");if(c){ue(c);const{status:u}=qe(c);u&&u.classList.contains("text-body-secondary")&&(u.textContent="")}L()},l)}}async function qa(e){if(P)return;const t=x(e);if(!t){G({tone:"danger",text:"Market not found."});return}if(t.evaluationMode!=="spot"){G({tone:"warning",text:"Refresh is only available for Spot markets."});return}const a=(t.spotCode||"").trim();if(!a){G({tone:"warning",text:"Set a market code before refreshing."});return}if(Date.now()<F){const o=Math.max(1,Math.ceil((F-Date.now())/1e3));G({tone:"warning",text:`Please wait ${o}s before refreshing again.`});return}const r=String(D("alphaVantageApiKey")||"").trim();if(!r){G({tone:"warning",text:"Set Alpha Vantage API Key in Settings first."});return}const n=String(D("currencyCode")||oe).trim().toUpperCase();if(!/^[A-Z]{3}$/.test(n)){G({tone:"danger",text:"Invalid app currency setting."});return}P=!0,G({tone:"warning",text:`Refreshing latest spot price for ${t.name}...`});try{const o=await qt(a,n,r),i={...t,spotValueCents:o,updatedAt:j()};await $e(i),await q(),G({tone:"success",text:`${t.name} spot value updated to ${I(o)}.`})}catch(o){const i=o instanceof Error?o.message:"Refresh failed.";G({tone:"danger",text:i})}finally{P=!1,F=Date.now()+Mt,tt();const o=Math.max(0,F-Date.now());J=window.setTimeout(()=>{J=null;const i=C.querySelector("#category-form");if(i){ue(i);const{status:s}=qe(i);s&&s.classList.contains("text-body-secondary")&&(s.textContent="")}L()},o),L()}}function Lt(){return C.querySelector(".modal-panel")}function Nt(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function La(){if(T.kind==="none")return;const e=Lt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(Nt(e)[0]||e).focus()}function Na(){var e,t;(e=K==null?void 0:K.destroy)==null||e.call(K),(t=Z==null?void 0:Z.destroy)==null||t.call(Z),K=null,Z=null}function Ke(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){Fe==null&&(Fe=window.setTimeout(()=>{Fe=null,Ke(),L()},500)),Re||(Re=!0,window.addEventListener("load",()=>{Re=!1,Ke(),L()},{once:!0}));return}const r=C.querySelector("#categories-table"),n=C.querySelector("#inventory-table"),o=(s,l)=>{var c,u;return t?new t(s,l):a?((u=(c=a(s)).DataTable)==null?void 0:u.call(c,l))??null:null};r&&(K=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),n&&(Z=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),ja(n,Z))}function Ra(e){return e.map(t=>{const a=t.startValueCents??0,r=t.endValueCents??0;return!Number.isFinite(a)||!Number.isFinite(r)||a<=0&&r<=0?null:{id:t.marketId,label:t.marketLabel,startCents:a,endCents:r,changeCents:r-a}}).filter(t=>t!=null).sort((t,a)=>a.endCents-t.endCents)}function Se(e,t){const a=C.querySelector(`#${e}`),r=C.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),r&&(r.textContent=t,r.hidden=!1)}function gt(e){const t=C.querySelector(`#${e}`),a=C.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Fa(){N==null||N.dispose(),R==null||R.dispose(),N=null,R=null}function Va(){ut||(ut=!0,window.addEventListener("resize",()=>{we!=null&&window.clearTimeout(we),we=window.setTimeout(()=>{we=null,N==null||N.resize(),R==null||R.resize()},120)}))}function Oa(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Ba(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function Ua(e){const t="markets-allocation-chart",a="markets-top-chart",r=C.querySelector(`#${t}`),n=C.querySelector(`#${a}`);if(!r||!n)return;if(!window.echarts){Se(t,"Chart unavailable: ECharts not loaded."),Se(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){Se(t,"No eligible market totals to chart."),Se(a,"No eligible market totals to chart.");return}gt(t),gt(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?12:14,l=["#3f6d49","#7f6c52","#5a4027","#f2b544","#dc3545","#6f42c1","#20c997","#0b4c92"],c="#20c997",u="#dc3545",p="#0b4c92",h="rgba(108, 117, 125, 0.1)",b=i?"#e9ecef":"#212529",w=i?"#ced4da":"#495057",O=e.map(g=>({name:g.label,value:g.endCents})),S=e.slice(0,5),y=[...S].reverse();new Map(y.map(g=>[g.label,g]));const v=S.reduce((g,A)=>Math.max(g,A.endCents),0),M=v>0?Math.ceil(v*1.2):1;N=window.echarts.init(r),R=window.echarts.init(n),N.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:g=>`${d(g.name)}: ${I(g.value)} (${g.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,left:12,icon:"circle",textStyle:{color:b,fontSize:s}}:{orient:"vertical",left:12,top:"center",icon:"circle",textStyle:{color:b,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["54%","50%"],data:O,avoidLabelOverlap:!1,itemStyle:{borderColor:i?"#11161d":"#ffffff",borderWidth:3},labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:g=>{const A=g.percent??0;return`${Math.round(A)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:w,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),R.setOption({color:[c],grid:{left:"4%",right:"10%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:g=>{var ge,ve;const A=(ge=g[0])==null?void 0:ge.name;if(!A)return"";const ye=((ve=g.find(H=>H.seriesName==="End"))==null?void 0:ve.value)??0,z=y.find(H=>H.label===A),se=(z==null?void 0:z.changeCents)??0,he=se>0?"+":"";return`${d(A)}<br/>End: ${I(ye)}<br/>Change: ${he}${I(se)}`}},xAxis:{type:"value",max:M,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:y.map(g=>g.label),axisLabel:{color:w,fontSize:s,formatter:g=>Ba(g)},axisTick:{show:!1},axisLine:{show:!1}},series:[{name:"End",type:"bar",data:y.map(g=>({value:g.endCents,itemStyle:{color:g.changeCents>0?c:g.changeCents<0?u:p}})),barWidth:30,barCategoryGap:"12%",barGap:"0%",showBackground:!0,backgroundStyle:{color:h},label:{show:!0,position:"right",distance:6,color:b,fontSize:s,formatter:g=>{const A=y[g.dataIndex];return!A||A.changeCents===0?"":`${A.changeCents>0?"+":""}${I(A.changeCents)}`}}}]}),window.requestAnimationFrame(()=>{N==null||N.resize(),R==null||R.resize()}),Va()}function ja(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var p,h,b;const r=a.target,n=r==null?void 0:r.closest("thead th");if(!n)return;const o=n.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(n);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(p=t.order)==null?void 0:p.call(t),c=Array.isArray(l)?l[0]:void 0,u=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(h=t.order)==null||h.call(t,[[s,u]]),(b=t.draw)==null||b.call(t,!1)},!0)}async function q(){var p,h;const[e,t,a]=await Promise.all([ia(),la(),da()]),r=Qe(t).sort((b,w)=>b.sortOrder-w.sortOrder||b.name.localeCompare(w.name));a.some(b=>b.key==="currencyCode")||(await U("currencyCode",oe),a.push({key:"currencyCode",value:oe})),a.some(b=>b.key==="currencySymbol")||(await U("currencySymbol",ie),a.push({key:"currencySymbol",value:ie})),a.some(b=>b.key==="darkMode")||(await U("darkMode",Te),a.push({key:"darkMode",value:Te}));const n=a.find(b=>b.key==="themeId"),o=We(n==null?void 0:n.value);n?n.value!==o&&(await U("themeId",o),n.value=o):(await U("themeId",o),a.push({key:"themeId",value:o})),a.some(b=>b.key==="showMarketsGraphs")||(await U("showMarketsGraphs",Ee),a.push({key:"showMarketsGraphs",value:Ee})),Ma(a);let i=null,s=null;try{const b=await((h=(p=navigator.storage)==null?void 0:p.estimate)==null?void 0:h.call(p));i=typeof(b==null?void 0:b.usage)=="number"?b.usage:null,s=typeof(b==null?void 0:b.quota)=="number"?b.quota:null}catch{i=null,s=null}let l=f.reportDateFrom,c=f.reportDateTo,u=f.importText;if(r.length>0&&u===re?u="":r.length===0&&!u.trim()&&(u=re),!mt){const b=wa(e);b&&(l=b),c=new Date().toISOString().slice(0,10),mt=!0}f={...f,inventoryRecords:e,categories:r,settings:a,storageUsageBytes:i,storageQuotaBytes:s,reportDateFrom:l,reportDateTo:c,importText:u},L()}function x(e){if(e)return f.categories.find(t=>t.id===e)}function Ga(e){const t=x(e);return t?t.pathNames.join(" / "):"-"}function _a(e){return Ga(e)}function za(e){const t=x(e);return t?t.pathIds.some(a=>{var r;return((r=x(a))==null?void 0:r.active)===!1}):!1}function Ha(e){const t=x(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const r=x(a);if((r==null?void 0:r.active)===!1)return!0}return!1}function Za(e){return e.active&&!Ha(e)}function ae(e){return e==null?"":(e/100).toFixed(2)}function at(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="unitPrice"]');if(!t||!a||!r)return;const n=Number(t.value),o=De(a.value);if(!Number.isFinite(n)||n<=0||o==null||o<0){r.value="";return}r.value=(Math.round(o/n)/100).toFixed(2)}function Rt(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),r=e.querySelector('input[name="baselineValue"]'),n=e.querySelector('input[name="baselineValueDisplay"]');!t||!a||!r||(t.value==="create"&&(r.value=a.value),n&&(n.value=r.value||a.value))}function Ft(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),r=e.querySelector('input[name="quantity"]'),n=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!a||!r)return;const l=x(t.value),c=(l==null?void 0:l.evaluationMode)==="spot",u=(l==null?void 0:l.evaluationMode)==="snapshot";a.hidden=!c,c?r.readOnly=!1:((!Number.isFinite(Number(r.value))||Number(r.value)<=0)&&(r.value="1"),r.readOnly=!0),n&&(n.hidden=!u),u&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function nt(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),r=e.querySelector('input[name="spotValue"]'),n=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]'),i=e.querySelector("[data-spot-refresh-group]"),s=e.querySelector('[data-action="refresh-spot-value"]');if(!t||!a||!r||!n||!o)return;const l=t.value==="spot",c=String(D("alphaVantageApiKey")||"").trim().length>0;a.hidden=!l,r.disabled=!l,n.hidden=!(l&&c),o.disabled=!(l&&c);const u=o.value.trim().length>0;i&&(i.hidden=!(l&&u&&c)),s&&(s.disabled=!l||!u||!c||P||Date.now()<F)}function Q(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function Vt(e){return e.active&&!e.archived}function Ot(){const e=f.inventoryRecords.filter(Vt),t=f.categories.filter(o=>!o.isArchived),a=ba(e,t),r=new Map(f.categories.map(o=>[o.id,o])),n=new Map;for(const o of e){const i=r.get(o.categoryId);if(i)for(const s of i.pathIds)n.set(s,(n.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:n}}function Bt(e,t){const a=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const r=new Map,n=o=>{const i=r.get(o);if(i!=null)return i;const s=x(o);if(!s||s.isArchived)return r.set(o,0),0;let l=0;const c=a.get(s.id)||[];return c.length>0?l=c.reduce((u,p)=>u+n(p.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,r.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||n(o.id)}),r}function Ut(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>_a(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?I(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>I(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Yes":"No",filterable:!0,filterOp:"eq"}]}function Xa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":I(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function jt(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function Ka(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function Ya(){const e=Ut(),t=Xa(),a=t.filter(p=>p.key==="name"||p.key==="parent"||p.key==="path"),r=t.filter(p=>p.key!=="name"&&p.key!=="parent"&&p.key!=="path"),n=Pe(f.categories),o=He(jt(),f.filters,"inventoryTable",e,{categoryDescendantsMap:n}),{categoryTotals:i,categoryQty:s}=Ot(),l=Bt(i,s),c=[...a,{key:"computedQty",label:"Qty",getValue:p=>s.get(p.id)||0,getDisplay:p=>String(s.get(p.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:p=>i.get(p.id)||0,getDisplay:p=>I(i.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},...r,{key:"computedTotalCents",label:"Total",getValue:p=>l.get(p.id)||0,getDisplay:p=>I(l.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:p=>p.active&&!p.isArchived,getDisplay:p=>p.active&&!p.isArchived?"Yes":"No",filterable:!0,filterOp:"eq"}],u=He(Ka(),f.filters,"categoriesList",c);return{inventoryColumns:e,categoryColumns:c,categoryDescendantsMap:n,filteredInventoryRecords:o,filteredCategories:u,categoryTotals:i,categoryQty:s}}function vt(e,t,a=""){const r=f.filters.filter(n=>n.viewId===e);return`
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
  `}function Oe(e,t,a){const r=a.getValue(t),n=a.getDisplay(t),o=r==null?"":String(r),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(n);if(n.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),c=za(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(n)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${n}`)}"><span class="filter-hit">${d(n)}</span></button>`}function Gt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function Qa(e,t){const a=e.map((r,n)=>{let o=0,i=!1;for(const l of t){const c=r.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(o+=c,i=!0)}const s=i?String(r.key).toLowerCase().includes("cents")?I(o):Gt(o):n===0?"Totals":"";return`<th class="${Q(r)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function Wa(e,t){const a=new Set(t.map(i=>i.id)),r=t.filter(i=>!i.parentId||!a.has(i.parentId)),n=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=n.has(String(i.key))?r:t;let c=0,u=!1;for(const h of l){const b=i.getValue(h);typeof b=="number"&&Number.isFinite(b)&&(c+=b,u=!0)}const p=u?String(i.key).toLowerCase().includes("cents")?I(c):Gt(c):s===0?"Totals":"";return`<th class="${Q(i)}">${d(p)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function wt(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function Ja(e,t){const a=[...e];return a.filter(n=>{for(const o of a){if(o===n)continue;const i=t.get(o);if(i!=null&&i.has(n))return!1}return!0})}function en(e){const t=new Set(f.filters.filter(r=>r.viewId==="categoriesList").map(r=>r.id)),a=new Set(f.filters.filter(r=>r.viewId==="inventoryTable"&&r.field==="categoryId"&&r.op==="inCategorySubtree"&&!!r.linkedToFilterId&&t.has(r.linkedToFilterId)).map(r=>r.value));return a.size>0?Ja(a,e):f.categories.filter(r=>!r.isArchived&&r.active&&r.parentId==null).map(r=>r.id)}function tn(e){const t=en(e),a=Oa(),{categoryTotals:r,categoryQty:n}=Ot(),o=Bt(r,n),i=new Map;for(const S of f.inventoryRecords){if(!Vt(S))continue;const y=S.baselineValueCents??0;if(!Number.isFinite(y))continue;const v=x(S.categoryId);if(v)for(const M of v.pathIds)i.set(M,(i.get(M)||0)+y)}const s=[],l={};let c=0,u=0,p=0,h=0;const b=S=>{const y=x(S);if(!y)return null;const v=i.get(S)||0,M=o.get(S)||0,g=M-v,A=v>0?g/v:null;return{marketId:S,marketLabel:y.pathNames.join(" / "),startValueCents:v,endValueCents:M,contributionsCents:M-v,netGrowthCents:g,growthPct:A}},w=new Set,O=S=>w.has(S)?[]:(w.add(S),(a.get(S)||[]).map(y=>b(y)).filter(y=>y!=null).sort((y,v)=>y.marketLabel.localeCompare(v.marketLabel)));for(const S of t){const y=b(S);y&&(l[S]=O(S),c+=y.startValueCents||0,u+=y.endValueCents||0,p+=y.contributionsCents||0,h+=y.netGrowthCents||0,s.push(y))}return p=u-c,h=u-c,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:c,endTotalCents:u,contributionsTotalCents:p,netGrowthTotalCents:h,hasManualSnapshots:!1}}function Be(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function ee(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function an(){if(T.kind==="none")return"";const e=D("currencySymbol")||ie,t=String(D("alphaVantageApiKey")||"").trim().length>0,a=(r,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(r!=null&&r.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(T.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((D("currencyCode")||oe).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${ga.map(r=>`<option value="${d(r.value)}" ${(D("currencySymbol")||ie)===r.value?"selected":""}>${d(r.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-label mb-0">
                  Alpha Vantage API Key
                  <input class="form-control" name="alphaVantageApiKey" autocomplete="off" value="${d(D("alphaVantageApiKey")||"")}" />
                  <span class="form-text">
                    API key required to retrieve live spot pricing. Request one from
                    <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer">Alpha Vantage</a>.
                    Free plan limit: 1 request/second, 25 requests/day.
                  </span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${D("showMarketsGraphs")??Ee?"checked":""} />
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
    `;if(T.kind==="categoryCreate"||T.kind==="categoryEdit"){const r=T.kind==="categoryEdit",n=T.kind==="categoryEdit"?x(T.categoryId):void 0;if(r&&!n)return"";const o=r&&n?f.inventoryRecords.filter(l=>l.categoryId===n.id).sort((l,c)=>c.purchaseDate.localeCompare(l.purchaseDate)):[],i=r&&n?new Set(Tt(f.categories,n.id)):void 0,s=Pe(f.categories);return He(jt(),f.filters,"inventoryTable",Ut(),{categoryDescendantsMap:s}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${r?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form">
            <div class="modal-body d-grid gap-3">
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(ae(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
              ${r?`<span data-spot-refresh-group ${(n==null?void 0:n.evaluationMode)==="spot"&&(n.spotCode||"").trim()&&t?"":"hidden"}>
                     <button
                       type="button"
                       class="baseline-value-link mt-1 small"
                       data-action="refresh-spot-value"
                       ${P||Date.now()<F?"disabled":""}
                     >${P?"Getting latest spot value...":"Get latest spot value"}</button>
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
              <span class="form-text">For crypto, prefix with <code>CRYPTO:</code> (example: <code>CRYPTO:BTC</code>).</span>
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
            </div>
            <div class="modal-footer">
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
          <form id="inventory-form">
            <div class="modal-body d-grid gap-3">
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
            </div>
            <div class="modal-footer">
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
          <form id="inventory-form">
            <div class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${d(n.id)}" />
            <input type="hidden" name="baselineValue" value="${d(ae(n.baselineValueCents))}" />
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(ae(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0" data-baseline-group hidden>Baseline value
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" name="baselineValueDisplay" value="${d(ae(n.baselineValueCents??n.totalPriceCents))}" disabled />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(ae(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${d(n.notes||"")}</textarea></label>
            </div>
            <div class="modal-footer">
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
    `:""}return""}function L(){const e=window.scrollX,t=window.scrollY,a=C.querySelector('details[data-section="data-tools"]');a&&(pt=a.open);const r=C.querySelector('details[data-section="investments"]');r&&(ft=r.open),Fa(),Na();const{inventoryColumns:n,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=Ya(),c="Squirrl",u="Stash, sort, and track your investments locally with fast filters, clear totals, and private storage.",p="Settings",h=tn(i),b=Ra(h.rows),w=f.filters.filter(m=>m.viewId==="categoriesList"),O=w.length?w.map(m=>m.label).join(" > "):"No filters",S=D("showMarketsGraphs")??Ee,y=l.some(m=>m.parentId==null),v=S&&y&&b.length>0,M=new Set([...ne].filter(m=>{var $;return((($=h.childRowsByParent[m])==null?void 0:$.length)||0)>0}));M.size!==ne.size&&(ne=M);const g=h.startTotalCents>0?h.netGrowthTotalCents/h.startTotalCents:null;f.exportText||_t();const A=s.map(m=>`
        <tr class="${[Za(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${n.map(k=>`<td class="${Q(k)}">${Oe("inventoryTable",m,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),ye=new Set(l.map(m=>m.id)),z=new Map;for(const m of l){const $=m.parentId&&ye.has(m.parentId)?m.parentId:null,k=z.get($)||[];k.push(m),z.set($,k)}for(const m of z.values())m.sort(($,k)=>$.sortOrder-k.sortOrder||$.name.localeCompare(k.name));const se=[],he=(m,$)=>{const k=z.get(m)||[];for(const E of k)se.push({category:E,depth:$}),he(E.id,$+1)};he(null,0);const ge=String(D("alphaVantageApiKey")||"").trim().length>0,ve=se.map(({category:m,depth:$})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${o.map(k=>{if(k.key==="name"){const E=$>0?($-1)*1.1:0;return`<td class="${Q(k)}"><div class="market-name-wrap" style="padding-left:${E.toFixed(2)}rem">${$>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Oe("categoriesList",m,k)}</div></td>`}return`<td class="${Q(k)}">${Oe("categoriesList",m,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            ${m.evaluationMode==="spot"&&(m.spotCode||"").trim()&&ge?`<button
                     type="button"
                     class="btn btn-sm btn-outline-primary action-menu-btn"
                     data-action="refresh-category-spot"
                     data-id="${m.id}"
                     title="Get latest spot price"
                     aria-label="Get latest spot price"
                     ${P||Date.now()<F?"disabled":""}
                   >Spot</button><span class="actions-separator" aria-hidden="true">|</span>`:""}
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");C.innerHTML=`
    <div class="app-shell container-fluid pt-0 pb-3 pb-lg-4">
      <header class="page-header">
        <div class="page-header-bar">
          <div class="page-header-brand">
            <div class="page-header-logo-shell">
              <img
                class="page-header-logo-slot"
                src="/squirrl-investment-tracker-logo.png"
                alt="Squirrl investment tracker logo"
                width="64"
                height="64"
              />
            </div>
            <div class="page-header-copy">
              <h1 class="display-6 mb-1">${d(c)}</h1>
              <p class="page-header-subtitle text-body-secondary mb-0">${d(u)}</p>
            </div>
          </div>
          <div class="page-header-actions d-flex align-items-center gap-2">
            <button type="button" class="header-indicator-btn btn btn-primary btn-sm" data-action="open-settings" aria-label="${d(p)}">${d(p)}</button>
          </div>
        </div>
        ${fe?`<div class="alert alert-${fe.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(fe.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth</h2>
          </div>
          ${v?`
            <div class="markets-widget-grid mb-2">
              <article class="markets-widget-card card border-0">
                <div class="card-body p-0">
                  <div class="markets-chart-frame">
                    <div id="markets-top-chart" class="markets-chart-canvas" role="img" aria-label="Top markets by value chart"></div>
                    <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="markets-top-chart" hidden></p>
                  </div>
                </div>
              </article>
              <article class="markets-widget-card card border-0">
                <div class="card-body p-0">
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
                  ${h.rows.map(m=>{const $=h.childRowsByParent[m.marketId]||[],k=ne.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${$.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d(I(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d(I(m.endValueCents))}</td>
                      <td class="text-end ${ee(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d(I(m.netGrowthCents))}</td>
                      <td class="text-end ${ee(m.growthPct)}">${d(Be(m.growthPct))}</td>
                      </tr>
                      ${$.map(E=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(m.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span><span class="growth-child-icon" aria-hidden="true">↳</span> ${d(E.marketLabel)}</td>
                              <td class="text-end">${E.startValueCents==null?"—":d(I(E.startValueCents))}</td>
                              <td class="text-end">${E.endValueCents==null?"—":d(I(E.endValueCents))}</td>
                              <td class="text-end ${ee(E.netGrowthCents)}">${E.netGrowthCents==null?"—":d(I(E.netGrowthCents))}</td>
                              <td class="text-end ${ee(E.growthPct)}">${d(Be(E.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(I(h.startTotalCents))}</th>
                    <th class="text-end">${d(I(h.endTotalCents))}</th>
                    <th class="text-end ${ee(h.netGrowthTotalCents)}">${d(I(h.netGrowthTotalCents))}</th>
                    <th class="text-end ${ee(g)}">${d(Be(g))}</th>
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
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">New</button>
          </div>
        </div>
        ${me?`<div class="alert alert-${me.tone} py-1 px-2 mb-2 small" role="status">${d(me.text)}</div>`:""}
        ${vt("categoriesList","Markets","")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(m=>`<th class="${Q(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${ve}
            </tbody>
            ${Wa(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${ft?"open":""}>
        <summary class="card-header section-head">
          <h2 class="h5 mb-0">Investments</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end">
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-inventory">New</button>
          </div>
        </summary>
        <div class="details-content card-body">
          ${vt("inventoryTable","Investments","")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${n.map(m=>`<th class="${Q(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${A}
              </tbody>
              ${Qa(n,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${pt?"open":""}>
        <summary class="card-header section-head">
          <h2 class="h5 mb-0">Data Tools</h2>
        </summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(Ve(f.storageUsageBytes)):`${d(Ve(f.storageUsageBytes))} of ${d(Ve(f.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block data-tool-block-compact">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Export</button>
          </div>
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
            <input class="form-control" id="import-text" placeholder="Paste import JSON here" value="${d(f.importText)}" />
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
        <span>App version: ${d(ya)}</span>
        <span class="app-footer-separator" aria-hidden="true">|</span>
        <a
          class="app-footer-x-link"
          href="https://x.com/_ballyhoos"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow and contact the creator on X (@_ballyhoos)"
          title="Follow and contact the creator on X"
        >
          <span>@_ballyhoos</span>
          <i class="bi bi-twitter-x" aria-hidden="true"></i>
        </a>
      </footer>
    </div>
    ${an()}
  `;const H=C.querySelector("#inventory-form");H&&(Ft(H),at(H),Rt(H));const rt=C.querySelector("#category-form");rt&&nt(rt),La(),Ua(b),Ke(),window.scrollTo(e,t)}function nn(e,t){const a=C.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const n of a)n.hidden=!t;const r=C.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);r&&(r.textContent=t?"▾":"▸",r.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function rn(){return{schemaVersion:2,exportedAt:j(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function _t(){return JSON.stringify(rn())}function on(e,t,a){const r=new Blob([t],{type:a}),n=URL.createObjectURL(r),o=document.createElement("a");o.href=n,o.download=e,o.click(),URL.revokeObjectURL(n)}async function sn(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),r=String(t.get("currencySymbol")||"").trim(),n=String(t.get("alphaVantageApiKey")||"").trim(),o=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!r){alert("Select a currency symbol.");return}await U("currencyCode",a),await U("currencySymbol",r),await U("alphaVantageApiKey",n),await U("showMarketsGraphs",o),_(),await q()}async function ln(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("categoryId")||"").trim(),n=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),c=t.get("active")==="on",u=i==="spot"||i==="snapshot"?i:void 0,p=u==="spot"&&s?De(s):void 0,h=u==="spot"&&l?l:void 0;if(!n)return;if(u==="spot"&&s&&p==null){alert("Spot value is invalid.");return}const b=p??void 0,w=o||null;if(w&&!x(w)){alert("Select a valid parent market.");return}if(a==="edit"){if(!r)return;const v=await $t(r);if(!v){alert("Market not found.");return}if(w===v.id){alert("A category cannot be its own parent.");return}if(w&&Tt(f.categories,v.id).includes(w)){alert("A category cannot be moved under its own subtree.");return}const M=v.parentId!==w;v.name=n,v.parentId=w,v.evaluationMode=u,v.spotValueCents=b,v.spotCode=h,v.active=c,M&&(v.sortOrder=f.categories.filter(g=>g.parentId===w&&g.id!==v.id).length),v.updatedAt=j(),await $e(v),_(),await q();return}const O=j(),S=f.categories.filter(v=>v.parentId===w).length,y={id:crypto.randomUUID(),name:n,parentId:w,pathIds:[],pathNames:[],depth:0,sortOrder:S,evaluationMode:u,spotValueCents:b,spotCode:h,active:c,isArchived:!1,createdAt:O,updatedAt:O};await $e(y),_(),await q()}async function cn(e){const t=new FormData(e),a=String(t.get("mode")||"create"),r=String(t.get("inventoryId")||"").trim(),n=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=De(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),c=l===""?null:De(l),u=a==="create"?s??void 0:c??void 0,p=String(t.get("categoryId")||""),h=t.get("active")==="on",b=String(t.get("notes")||"").trim();if(!n||!o){alert("Date and product name are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&c!=null&&c<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&c==null){alert("Baseline value is invalid.");return}if(p&&!x(p)){alert("Select a valid category.");return}const w=Math.round(s/i);if(a==="edit"){if(!r)return;const y=await Ye(r);if(!y){alert("Inventory record not found.");return}y.purchaseDate=n,y.productName=o,y.quantity=i,y.totalPriceCents=s,y.baselineValueCents=u,y.unitPriceCents=w,y.unitPriceSource="derived",y.categoryId=p,y.active=h,y.notes=b||void 0,y.updatedAt=j(),await ke(y),_(),await q();return}const O=j(),S={id:crypto.randomUUID(),purchaseDate:n,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:u,unitPriceCents:w,unitPriceSource:"derived",categoryId:p,active:h,archived:!1,notes:b||void 0,createdAt:O,updatedAt:O};await ke(S),_(),await q()}async function dn(e,t){const a=await Ye(e);a&&(a.active=t,a.updatedAt=j(),await ke(a),await q())}async function un(e){const t=await Ye(e);!t||!window.confirm(`Delete investment record "${t.productName}" permanently? This cannot be undone.`)||(await sa(e),_(),await q())}async function pn(e){const t=await $t(e);if(!t)return;const a=f.inventoryRecords.filter(o=>o.categoryId===e).length;if(!window.confirm(`Delete market "${t.pathNames.join(" / ")}"? This cannot be undone.

This will also affect:
- ${a} investment record(s): their Market will be cleared.`))return;const n=j();for(const o of f.inventoryRecords)o.categoryId===e&&(o.categoryId="",o.updatedAt=n,await ke(o));for(const o of f.categories)o.parentId===e&&(o.parentId=null,o.updatedAt=n,await $e(o));await ca(e),_(),await q()}function zt(e){const t=j();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function fn(e){const t=j(),a=Number(e.quantity),r=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(r))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const n=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:r,baselineValueCents:Number.isFinite(n)?n:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function mn(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==2){alert("Unsupported import format.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Qe(t.categories.map(zt)),r=new Set(a.map(s=>s.id)),n=t.purchases.map(fn);for(const s of n)if(!r.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:String(s.key)==="themeId"?We(s.value):s.value})):[{key:"currencyCode",value:oe},{key:"currencySymbol",value:ie},{key:"themeId",value:Dt},{key:"darkMode",value:Te}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await xt({purchases:n,categories:a,settings:o}),B({importText:re}),await q()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}async function bn(){try{const e=Qe(Ze.categories.map(zt)),t=Ze.settings.map(r=>({key:String(r.key),value:r.value}));if(!window.confirm("Load default markets template and replace all existing data? This will keep no investments."))return;await xt({purchases:[],categories:e,settings:t}),B({filters:Ae(),importText:re}),await q(),Xe({tone:"success",text:"Default markets loaded."})}catch(e){const t=e instanceof Error?e.message:"Failed to load default markets.";alert(t),Xe({tone:"danger",text:"Default markets failed to load."})}}function Ht(e){return e.target instanceof HTMLElement?e.target:null}function Ct(e){const t=e.dataset.viewId,a=e.dataset.field,r=e.dataset.op,n=e.dataset.value,o=e.dataset.label;if(!t||!a||!r||n==null||!o)return;const i=(u,p)=>u.viewId===p.viewId&&u.field===p.field&&u.op===p.op&&u.value===p.value;let s=pa(f.filters,{viewId:t,field:a,op:r,value:n,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const u=x(l);if(u){const p=s.find(h=>i(h,{viewId:t,field:a,op:r,value:n}));if(p){const h=`Market: ${u.pathNames.join(" / ")}`;s=s.filter(w=>w.linkedToFilterId!==p.id);const b=s.findIndex(w=>i(w,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id}));if(b>=0){const w=s[b];s=[...s.slice(0,b),{...w,label:h,linkedToFilterId:p.id},...s.slice(b+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:u.id,label:h,linkedToFilterId:p.id}]}}}let c={filters:s};t==="inventoryTable"&&a==="archived"&&n==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&n==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&n==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),B(c)}function Zt(){pe!=null&&(window.clearTimeout(pe),pe=null)}function yn(e){const t=f.filters.filter(r=>r.viewId===e),a=t[t.length-1];a&&B({filters:At(f.filters,a.id)})}C.addEventListener("click",async e=>{const t=Ht(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const r=a.dataset.action;if(r){if(a.closest("summary")&&(e.preventDefault(),e.stopPropagation()),r==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(Zt(),e.detail>1)return;pe=window.setTimeout(()=>{pe=null,Ct(a)},220);return}Ct(a);return}if(r==="remove-filter"){const n=a.dataset.filterId;if(!n)return;B({filters:At(f.filters,n)});return}if(r==="clear-filters"){const n=a.dataset.viewId;if(!n)return;const o=fa(f.filters,n),i=Ae().find(s=>s.viewId===n);B({filters:i?[...o,i]:o});return}if(r==="open-create-category"){Y({kind:"categoryCreate"});return}if(r==="open-create-inventory"){Y({kind:"inventoryCreate"});return}if(r==="open-settings"){Y({kind:"settings"});return}if(r==="apply-report-range"){const n=C.querySelector('input[name="reportDateFrom"]'),o=C.querySelector('input[name="reportDateTo"]');if(!n||!o)return;const i=n.value,s=o.value,l=wt(i),c=wt(s,!0);if(l==null||c==null||l>c){Xe({tone:"warning",text:"Select a valid report date range."});return}B({reportDateFrom:i,reportDateTo:s});return}if(r==="reset-report-range"){B({reportDateFrom:Pt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(r==="copy-total-to-baseline"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="inventory-form")return;const o=n.querySelector('input[name="totalPrice"]'),i=n.querySelector('input[name="baselineValue"]'),s=n.querySelector('input[name="baselineValueDisplay"]'),l=n.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',Ce!=null&&window.clearTimeout(Ce),Ce=window.setTimeout(()=>{Ce=null,l.isConnected&&(l.textContent="")},1800));return}if(r==="refresh-spot-value"){const n=a.closest("form");if(!(n instanceof HTMLFormElement)||n.id!=="category-form")return;await Pa(n);return}if(r==="toggle-growth-children"){const n=a.dataset.marketId;if(!n)return;const o=new Set(ne),i=!o.has(n);i?o.add(n):o.delete(n),ne=o,nn(n,i);return}if(r==="edit-category"){const n=a.dataset.id;n&&Y({kind:"categoryEdit",categoryId:n});return}if(r==="refresh-category-spot"){const n=a.dataset.id;n&&await qa(n);return}if(r==="edit-inventory"){const n=a.dataset.id;n&&Y({kind:"inventoryEdit",inventoryId:n});return}if(r==="close-modal"||r==="close-modal-backdrop"){if(r==="close-modal-backdrop"&&!t.classList.contains("modal"))return;_();return}if(r==="toggle-inventory-active"){const n=a.dataset.id,o=a.dataset.nextActive==="true";n&&await dn(n,o);return}if(r==="delete-inventory-record"){const n=a.dataset.id;n&&await un(n);return}if(r==="delete-category-record"){const n=a.dataset.id;n&&await pn(n);return}if(r==="download-json"){on(`investments-app-${new Date().toISOString().slice(0,10)}.json`,_t(),"application/json");return}if(r==="replace-import"){await mn();return}if(r==="load-default-markets"){await bn();return}if(r==="wipe-all"){const n=document.querySelector("#wipe-confirm");if(!n||n.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await ua(),B({filters:Ae(),exportText:"",importText:re,showArchivedInventory:!1,showArchivedCategories:!1}),await q();return}}});C.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(Zt(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const r=t.closest("tr[data-row-edit]");if(!r)return;const n=r.dataset.id,o=r.dataset.rowEdit;if(!(!n||!o)){if(o==="inventory"){Y({kind:"inventoryEdit",inventoryId:n});return}o==="category"&&Y({kind:"categoryEdit",categoryId:n})}});C.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await sn(t);return}if(t.id==="category-form"){await ln(t);return}if(t.id==="inventory-form"){await cn(t);return}}});C.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="spotCode"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="category-form"&&nt(a)}if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(at(a),Rt(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});C.addEventListener("change",async e=>{var n;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(Ft(o),at(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&nt(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(n=t.files)==null?void 0:n[0];if(!a)return;const r=await a.text();try{B({importText:JSON.stringify(JSON.parse(r))})}catch{B({importText:r})}});C.addEventListener("pointermove",e=>{const t=Ht(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");xe=(a==null?void 0:a.dataset.filterSectionViewId)||null});C.addEventListener("pointerleave",()=>{xe=null});document.addEventListener("keydown",e=>{if(T.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!xe)return;e.preventDefault(),yn(xe);return}if(e.key==="Escape"){e.preventDefault(),_();return}if(e.key!=="Tab")return;const t=Lt();if(!t)return;const a=Nt(t);if(!a.length){e.preventDefault(),t.focus();return}const r=a[0],n=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===r||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),n.focus());return}o===n&&(e.preventDefault(),r.focus())});q();
