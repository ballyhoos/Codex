(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const ke=(e,t)=>t.some(a=>e instanceof a);let Ve,qe;function It(){return Ve||(Ve=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function St(){return qe||(qe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $e=new WeakMap,ge=new WeakMap,me=new WeakMap;function Ct(e){const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{a(Q(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",i)});return me.set(t,e),t}function kt(e){if($e.has(e))return;const t=new Promise((a,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{a(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});$e.set(e,t)}let xe={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return $e.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return Q(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Je(e){xe=e(xe)}function $t(e){return St().includes(e)?function(...t){return e.apply(Me(this),t),Q(this.request)}:function(...t){return Q(e.apply(Me(this),t))}}function xt(e){return typeof e=="function"?$t(e):(e instanceof IDBTransaction&&kt(e),ke(e,It())?new Proxy(e,xe):e)}function Q(e){if(e instanceof IDBRequest)return Ct(e);if(ge.has(e))return ge.get(e);const t=xt(e);return t!==e&&(ge.set(e,t),me.set(t,e)),t}const Me=e=>me.get(e);function Mt(e,t,{blocked:a,upgrade:n,blocking:r,terminated:o}={}){const i=indexedDB.open(e,t),s=Q(i);return n&&i.addEventListener("upgradeneeded",l=>{n(Q(i.result),l.oldVersion,l.newVersion,Q(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{o&&l.addEventListener("close",()=>o()),r&&l.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const Tt=["get","getKey","getAll","getAllKeys","count"],Dt=["put","add","delete","clear"],he=new Map;function Oe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(he.get(t))return he.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,r=Dt.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(r||Tt.includes(a)))return;const o=async function(i,...s){const l=this.transaction(i,r?"readwrite":"readonly");let c=l.store;return n&&(c=c.index(s.shift())),(await Promise.all([c[a](...s),r&&l.done]))[0]};return he.set(t,o),o}Je(e=>({...e,get:(t,a,n)=>Oe(t,a)||e.get(t,a,n),has:(t,a)=>!!Oe(t,a)||e.has(t,a)}));const Et=["continue","continuePrimaryKey","advance"],Be={},Te=new WeakMap,Ke=new WeakMap,At={get(e,t){if(!Et.includes(t))return e[t];let a=Be[t];return a||(a=Be[t]=function(...n){Te.set(this,Ke.get(this)[t](...n))}),a}};async function*Nt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,At);for(Ke.set(a,t),me.set(a,Me(t));t;)yield a,t=await(Te.get(a)||t.continue()),Te.delete(a)}function Re(e,t){return t===Symbol.asyncIterator&&ke(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&ke(e,[IDBIndex,IDBObjectStore])}Je(e=>({...e,get(t,a,n){return Re(t,a)?Nt:e.get(t,a,n)},has(t,a){return Re(t,a)||e.has(t,a)}}));const L=Mt("investment_purchase_tracker",3,{async upgrade(e,t,a,n){const r=n,o=e.objectStoreNames.contains("purchases")?r.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&o){let l=await o.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),i){let l=await i.openCursor();for(;l;){const c=l.value;let m=!1;typeof c.active!="boolean"&&(c.active=!0,m=!0),typeof c.archived!="boolean"&&(c.archived=!1,m=!0),m&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let m=!1;typeof c.active!="boolean"&&(c.active=!0,m=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,m=!0),m&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function Lt(){return(await L).getAll("inventory")}async function le(e){await(await L).put("inventory",e)}async function Le(e){return(await L).get("inventory",e)}async function Ft(e){await(await L).delete("inventory",e)}async function Pt(){return(await L).getAll("categories")}async function De(e){await(await L).put("categories",e)}async function Xe(e){return(await L).get("categories",e)}async function Vt(e){await(await L).delete("categories",e)}async function qt(){return(await L).getAll("settings")}async function B(e,t){await(await L).put("settings",{key:e,value:t})}async function et(e){const a=(await L).transaction(["inventory","categories","settings"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);await a.done}async function Ot(){const t=(await L).transaction(["inventory","categories","settings"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.done}function je(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function Bt(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function tt(e,t){const a=new Set([t]);let n=!0;for(;n;){n=!1;for(const r of e)r.linkedToFilterId&&a.has(r.linkedToFilterId)&&!a.has(r.id)&&(a.add(r.id),n=!0)}return e.filter(r=>!a.has(r.id))}function Rt(e,t){return e.filter(a=>a.viewId!==t)}function Ee(e,t,a,n,r){const o=t.filter(s=>s.viewId===a);if(!o.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>o.every(l=>{var u;const c=i.get(l.field);if(!c)return!0;const m=c.getValue(s);if(l.op==="eq")return String(m)===l.value;if(l.op==="isEmpty")return je(m);if(l.op==="isNotEmpty")return!je(m);if(l.op==="contains")return String(m).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const g=((u=r==null?void 0:r.categoryDescendantsMap)==null?void 0:u.get(l.value))||new Set([l.value]),h=String(m);return g.has(h)}return!0}))}function jt(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const r=a.get(n.parentId)||[];r.push(n),a.set(n.parentId,r)}return{byId:t,children:a}}function be(e){const{children:t}=jt(e),a=new Map;function n(r){const o=new Set([r]);for(const i of t.get(r)||[])for(const s of n(i.id))o.add(s);return a.set(r,o),o}for(const r of e)a.has(r.id)||n(r.id);return a}function Fe(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const r=[],o=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),r.unshift(s.id),o.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:r,names:o,depth:Math.max(0,r.length-1)}}return e.map(n=>{const r=a(n);return{...n,pathIds:r.ids,pathNames:r.names,depth:r.depth}})}function at(e,t){return[...be(e).get(t)||new Set([t])]}function Gt(e,t){const a=be(t),n=new Map;for(const r of t){const o=a.get(r.id)||new Set([r.id]);let i=0;for(const s of e)o.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(r.id,i)}return n}const nt=document.querySelector("#app");if(!nt)throw new Error("#app not found");const w=nt;let M={kind:"none"},te=null,U=null,O=null,E=null,A=null,Ge=!1,oe=null,ve=!1,we=null,ae=null,ce=null,Ue=!1,ze=!1,Z=new Set,He=!1,ie=null,X=null,ne=null;const Ae={schemaVersion:2,exportedAt:"2026-03-31T21:08:59.630Z",settings:[{key:"currencyCode",value:"USD"},{key:"currencySymbol",value:"$"},{key:"darkMode",value:!1},{key:"showGrowthGraph",value:!1},{key:"showMarketsGraphs",value:!0}],categories:[{id:"127726bf-2b61-431a-b9ef-11d01d836123",name:"Bullion",parentId:null,pathIds:["127726bf-2b61-431a-b9ef-11d01d836123"],pathNames:["Bullion"],depth:0,sortOrder:0,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:49:13.236Z",updatedAt:"2026-03-04T08:14:02.783Z"},{id:"6af66667-7211-44ee-865e-5794bb2f3d3c",name:"Gold",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","6af66667-7211-44ee-865e-5794bb2f3d3c"],pathNames:["Bullion","Gold"],depth:1,sortOrder:0,evaluationMode:"spot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:50:26.185Z",updatedAt:"2026-03-15T23:20:34.173Z"},{id:"364f7799-aa46-43b0-9a23-f9e8ec6b39c2",name:"Mining",parentId:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3","364f7799-aa46-43b0-9a23-f9e8ec6b39c2"],pathNames:["Shares","Mining"],depth:1,sortOrder:0,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:59.580Z",updatedAt:"2026-03-31T21:08:59.580Z"},{id:"5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b",name:"Cash",parentId:null,pathIds:["5c88bcfc-63bc-4c6a-88d4-5fe6c8b68b2b"],pathNames:["Cash"],depth:0,sortOrder:1,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-04T06:14:51.627Z",updatedAt:"2026-03-04T06:14:51.627Z"},{id:"a03c6f4c-bb7f-4520-b49d-c326026634ee",name:"Silver",parentId:"127726bf-2b61-431a-b9ef-11d01d836123",pathIds:["127726bf-2b61-431a-b9ef-11d01d836123","a03c6f4c-bb7f-4520-b49d-c326026634ee"],pathNames:["Bullion","Silver"],depth:1,sortOrder:1,evaluationMode:"spot",active:!0,isArchived:!1,createdAt:"2026-03-04T03:50:41.282Z",updatedAt:"2026-03-15T23:20:48.705Z"},{id:"3dba18e1-41a2-4cc3-a2fd-f09907a599f7",name:"Super",parentId:null,pathIds:["3dba18e1-41a2-4cc3-a2fd-f09907a599f7"],pathNames:["Super"],depth:0,sortOrder:2,evaluationMode:"snapshot",active:!0,isArchived:!1,createdAt:"2026-03-15T23:48:34.636Z",updatedAt:"2026-03-15T23:48:34.636Z"},{id:"7d9cb4a4-385e-4f41-9c89-7a71a6385ca3",name:"Shares",parentId:null,pathIds:["7d9cb4a4-385e-4f41-9c89-7a71a6385ca3"],pathNames:["Shares"],depth:0,sortOrder:3,active:!0,isArchived:!1,createdAt:"2026-03-31T21:08:47.667Z",updatedAt:"2026-03-31T21:08:47.667Z"}],purchases:[]},Y=JSON.stringify(Ae);function de(){return[{id:crypto.randomUUID(),viewId:"categoriesList",field:"active",op:"eq",value:"true",label:"Active: Yes"},{id:crypto.randomUUID(),viewId:"inventoryTable",field:"active",op:"eq",value:"true",label:"Active: Yes"}]}let f={inventoryRecords:[],categories:[],settings:[],reportDateFrom:rt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:de(),showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:Y,storageUsageBytes:null,storageQuotaBytes:null};const ue="USD",J="$",re=!1,pe=!0,Ut=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function V(){return new Date().toISOString()}function zt(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function rt(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function Ie(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function S(e){const t=z("currencySymbol")||J,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function fe(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function z(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function Ht(e){var n;const t=(n=e.find(r=>r.key==="darkMode"))==null?void 0:n.value,a=typeof t=="boolean"?t:re;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function P(e){f={...f,...e},R()}function ot(e){X!=null&&(window.clearTimeout(X),X=null),ne=e,R(),e&&(X=window.setTimeout(()=>{X=null,ne=null,R()},3500))}function H(e){M.kind==="none"&&document.activeElement instanceof HTMLElement&&(te=document.activeElement),M=e,R()}function q(){M.kind!=="none"&&(M={kind:"none"},R(),te&&te.isConnected&&te.focus(),te=null)}function it(){return w.querySelector(".modal-panel")}function st(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function _t(){if(M.kind==="none")return;const e=it();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(st(e)[0]||e).focus()}function Qt(){var e,t;(e=U==null?void 0:U.destroy)==null||e.call(U),(t=O==null?void 0:O.destroy)==null||t.call(O),U=null,O=null}function Ne(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){we==null&&(we=window.setTimeout(()=>{we=null,Ne(),R()},500)),ve||(ve=!0,window.addEventListener("load",()=>{ve=!1,Ne(),R()},{once:!0}));return}const n=w.querySelector("#categories-table"),r=w.querySelector("#inventory-table"),o=(s,l)=>{var c,m;return t?new t(s,l):a?((m=(c=a(s)).DataTable)==null?void 0:m.call(c,l))??null:null};n&&(U=o(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),r&&(O=o(r,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Xt(r,O))}function Wt(e){return e.map(t=>{const a=t.startValueCents??0,n=t.endValueCents??0;return!Number.isFinite(a)||!Number.isFinite(n)||a<=0&&n<=0?null:{id:t.marketId,label:t.marketLabel,startCents:a,endCents:n,changeCents:n-a}}).filter(t=>t!=null).sort((t,a)=>a.endCents-t.endCents)}function se(e,t){const a=w.querySelector(`#${e}`),n=w.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=t,n.hidden=!1)}function _e(e){const t=w.querySelector(`#${e}`),a=w.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Zt(){E==null||E.dispose(),A==null||A.dispose(),E=null,A=null}function Yt(){Ge||(Ge=!0,window.addEventListener("resize",()=>{oe!=null&&window.clearTimeout(oe),oe=window.setTimeout(()=>{oe=null,E==null||E.resize(),A==null||A.resize()},120)}))}function Jt(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Qe(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function Kt(e){const t="markets-allocation-chart",a="markets-top-chart",n=w.querySelector(`#${t}`),r=w.querySelector(`#${a}`);if(!n||!r)return;if(!window.echarts){se(t,"Chart unavailable: ECharts not loaded."),se(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){se(t,"No eligible market totals to chart."),se(a,"No eligible market totals to chart.");return}_e(t),_e(a);const o=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=o?12:14,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],c=i?"#e9ecef":"#212529",m=i?"#ced4da":"#495057",u=e.map(p=>({name:p.label,value:p.endCents})),g=e.slice(0,5),h=[...g].reverse(),v=new Map(h.map(p=>[p.label,p])),D=g.reduce((p,y)=>Math.max(p,y.endCents,y.startCents),0),I=D>0?Math.ceil(D*1.2):1;E=window.echarts.init(n),A=window.echarts.init(r),E.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:p=>`${d(p.name)}: ${S(p.value)} (${p.percent??0}%)`},legend:o?{orient:"horizontal",bottom:0,left:12,icon:"circle",textStyle:{color:c,fontSize:s}}:{orient:"vertical",left:12,top:"center",icon:"circle",textStyle:{color:c,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:o?["50%","50%"]:["54%","50%"],data:u,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:p=>{const y=p.percent??0;return`${Math.round(y)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:m,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),A.setOption({color:["#0d6efd","#20c997"],grid:{left:"4%",right:"10%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:p=>{var G,K,b;const y=(G=p[0])==null?void 0:G.name;if(!y)return"";const $=((K=p.find(C=>C.seriesName==="Start"))==null?void 0:K.value)??0,F=((b=p.find(C=>C.seriesName==="End"))==null?void 0:b.value)??0,j=F-$,ye=j>0?"+":"";return`${d(y)}<br/>Start: ${S($)}<br/>End: ${S(F)}<br/>Change: ${ye}${S(j)}`}},xAxis:{type:"value",max:I,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:h.map(p=>p.label),axisLabel:{color:m,fontSize:s,lineHeight:s+3,formatter:p=>{const y=v.get(p);if(!y)return Qe(p);const $=y.changeCents>0?"Gain ":y.changeCents<0?"Loss ":"Flat ";return`${Qe(p)}
${$}${S(y.changeCents)}`}},axisTick:{show:!1},axisLine:{show:!1}},series:[{name:"Start",type:"bar",data:h.map(p=>p.startCents),barWidth:18,barCategoryGap:"48%",barGap:"20%",showBackground:!0,backgroundStyle:{color:"rgba(13, 110, 253, 0.12)"},label:{show:!0,position:"right",distance:6,color:c,fontSize:s,formatter:p=>S(p.value)}},{name:"End",type:"bar",data:h.map(p=>({value:p.endCents,itemStyle:{color:p.changeCents>0?"#20c997":p.changeCents<0?"#dc3545":"#0dcaf0"}})),barWidth:18,barCategoryGap:"48%",barGap:"20%",showBackground:!0,backgroundStyle:{color:"rgba(108, 117, 125, 0.1)"},label:{show:!0,position:"right",distance:6,color:c,fontSize:s,formatter:p=>S(p.value)}}]}),window.requestAnimationFrame(()=>{E==null||E.resize(),A==null||A.resize()}),Yt()}function Xt(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var u,g,h;const n=a.target,r=n==null?void 0:n.closest("thead th");if(!r)return;const o=r.parentElement;if(!(o instanceof HTMLTableRowElement))return;const i=Array.from(o.querySelectorAll("th")),s=i.indexOf(r);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(u=t.order)==null?void 0:u.call(t),c=Array.isArray(l)?l[0]:void 0,m=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(g=t.order)==null||g.call(t,[[s,m]]),(h=t.draw)==null||h.call(t,!1)},!0)}async function N(){var c,m;const[e,t,a]=await Promise.all([Lt(),Pt(),qt()]),n=Fe(t).sort((u,g)=>u.sortOrder-g.sortOrder||u.name.localeCompare(g.name));a.some(u=>u.key==="currencyCode")||(await B("currencyCode",ue),a.push({key:"currencyCode",value:ue})),a.some(u=>u.key==="currencySymbol")||(await B("currencySymbol",J),a.push({key:"currencySymbol",value:J})),a.some(u=>u.key==="darkMode")||(await B("darkMode",re),a.push({key:"darkMode",value:re})),a.some(u=>u.key==="showMarketsGraphs")||(await B("showMarketsGraphs",pe),a.push({key:"showMarketsGraphs",value:pe})),Ht(a);let r=null,o=null;try{const u=await((m=(c=navigator.storage)==null?void 0:c.estimate)==null?void 0:m.call(c));r=typeof(u==null?void 0:u.usage)=="number"?u.usage:null,o=typeof(u==null?void 0:u.quota)=="number"?u.quota:null}catch{r=null,o=null}let i=f.reportDateFrom,s=f.reportDateTo,l=f.importText;if(n.length>0&&l===Y?l="":n.length===0&&!l.trim()&&(l=Y),!He){const u=zt(e);u&&(i=u),s=new Date().toISOString().slice(0,10),He=!0}f={...f,inventoryRecords:e,categories:n,settings:a,storageUsageBytes:r,storageQuotaBytes:o,reportDateFrom:i,reportDateTo:s,importText:l},R()}function x(e){if(e)return f.categories.find(t=>t.id===e)}function ea(e){const t=x(e);return t?t.pathNames.join(" / "):"-"}function ta(e){return ea(e)}function aa(e){const t=x(e);return t?t.pathIds.some(a=>{var n;return((n=x(a))==null?void 0:n.active)===!1}):!1}function na(e){const t=x(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=x(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function ra(e){return e.active&&!na(e)}function ee(e){return e==null?"":(e/100).toFixed(2)}function Pe(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const r=Number(t.value),o=fe(a.value);if(!Number.isFinite(r)||r<=0||o==null||o<0){n.value="";return}n.value=(Math.round(o/r)/100).toFixed(2)}function lt(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="baselineValue"]'),r=e.querySelector('input[name="baselineValueDisplay"]');!t||!a||!n||(t.value==="create"&&(n.value=a.value),r&&(r.value=n.value||a.value))}function ct(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),n=e.querySelector('input[name="quantity"]'),r=e.querySelector("[data-baseline-group]"),o=e.querySelector('input[name="baselineValueDisplay"]'),i=e.querySelector('input[name="baselineValue"]'),s=e.querySelector('input[name="totalPrice"]');if(!t||!a||!n)return;const l=x(t.value),c=(l==null?void 0:l.evaluationMode)==="spot",m=(l==null?void 0:l.evaluationMode)==="snapshot";a.hidden=!c,c?n.readOnly=!1:((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0),r&&(r.hidden=!m),m&&o&&(o.disabled=!0,o.value=(i==null?void 0:i.value)||(s==null?void 0:s.value)||"")}function dt(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]'),r=e.querySelector("[data-spot-code-group]"),o=e.querySelector('input[name="spotCode"]');if(!t||!a||!n||!r||!o)return;const i=t.value==="spot";a.hidden=!i,n.disabled=!i,r.hidden=!i,o.disabled=!i}function _(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function ut(e){return e.active&&!e.archived}function pt(){const e=f.inventoryRecords.filter(ut),t=f.categories.filter(o=>!o.isArchived),a=Gt(e,t),n=new Map(f.categories.map(o=>[o.id,o])),r=new Map;for(const o of e){const i=n.get(o.categoryId);if(i)for(const s of i.pathIds)r.set(s,(r.get(s)||0)+o.quantity)}return{categoryTotals:a,categoryQty:r}}function ft(e,t){const a=new Map;f.categories.forEach(o=>{if(!o.parentId||o.isArchived)return;const i=a.get(o.parentId)||[];i.push(o),a.set(o.parentId,i)});const n=new Map,r=o=>{const i=n.get(o);if(i!=null)return i;const s=x(o);if(!s||s.isArchived)return n.set(o,0),0;let l=0;const c=a.get(s.id)||[];return c.length>0?l=c.reduce((m,u)=>m+r(u.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,n.set(o,l),l};return f.categories.forEach(o=>{o.isArchived||r(o.id)}),n}function mt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>ta(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?S(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>S(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Yes":"No",filterable:!0,filterOp:"eq"}]}function oa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":S(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function bt(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function ia(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function sa(){const e=mt(),t=oa(),a=t.filter(u=>u.key==="name"||u.key==="parent"||u.key==="path"),n=t.filter(u=>u.key!=="name"&&u.key!=="parent"&&u.key!=="path"),r=be(f.categories),o=Ee(bt(),f.filters,"inventoryTable",e,{categoryDescendantsMap:r}),{categoryTotals:i,categoryQty:s}=pt(),l=ft(i,s),c=[...a,{key:"computedQty",label:"Qty",getValue:u=>s.get(u.id)||0,getDisplay:u=>String(s.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:u=>i.get(u.id)||0,getDisplay:u=>S(i.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:u=>l.get(u.id)||0,getDisplay:u=>S(l.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:u=>u.active&&!u.isArchived,getDisplay:u=>u.active&&!u.isArchived?"Yes":"No",filterable:!0,filterOp:"eq"}],m=Ee(ia(),f.filters,"categoriesList",c);return{inventoryColumns:e,categoryColumns:c,categoryDescendantsMap:r,filteredInventoryRecords:o,filteredCategories:m,categoryTotals:i,categoryQty:s}}function We(e,t,a=""){const n=f.filters.filter(r=>r.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(t)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(r=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${d(r.label)}"
                  aria-label="Remove filter: ${d(r.label)}"
                  data-action="remove-filter"
                  data-filter-id="${r.id}"
                >${d(r.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function Se(e,t,a){const n=a.getValue(t),r=a.getDisplay(t),o=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(r);if(r.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),c=aa(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${r}`)}"><span class="filter-hit">${d(r)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(r)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${r}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(r)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(o)}" data-label="${d(`${a.label}: ${r}`)}"><span class="filter-hit">${d(r)}</span></button>`}function yt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function la(e,t){const a=e.map((n,r)=>{let o=0,i=!1;for(const l of t){const c=n.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(o+=c,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?S(o):yt(o):r===0?"Totals":"";return`<th class="${_(n)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function ca(e,t){const a=new Set(t.map(i=>i.id)),n=t.filter(i=>!i.parentId||!a.has(i.parentId)),r=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),o=e.map((i,s)=>{const l=r.has(String(i.key))?n:t;let c=0,m=!1;for(const g of l){const h=i.getValue(g);typeof h=="number"&&Number.isFinite(h)&&(c+=h,m=!0)}const u=m?String(i.key).toLowerCase().includes("cents")?S(c):yt(c):s===0?"Totals":"";return`<th class="${_(i)}">${d(u)}</th>`});return o.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${o.join("")}</tr></tfoot>`}function Ze(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function da(e,t){const a=[...e];return a.filter(r=>{for(const o of a){if(o===r)continue;const i=t.get(o);if(i!=null&&i.has(r))return!1}return!0})}function ua(e){const t=new Set(f.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(f.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&t.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?da(a,e):f.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function pa(e){const t=ua(e),a=Jt(),{categoryTotals:n,categoryQty:r}=pt(),o=ft(n,r),i=new Map;for(const I of f.inventoryRecords){if(!ut(I))continue;const p=I.baselineValueCents??0;if(!Number.isFinite(p))continue;const y=x(I.categoryId);if(y)for(const $ of y.pathIds)i.set($,(i.get($)||0)+p)}const s=[],l={};let c=0,m=0,u=0,g=0;const h=I=>{const p=x(I);if(!p)return null;const y=i.get(I)||0,$=o.get(I)||0,F=$-y,j=y>0?F/y:null;return{marketId:I,marketLabel:p.pathNames.join(" / "),startValueCents:y,endValueCents:$,contributionsCents:$-y,netGrowthCents:F,growthPct:j}},v=new Set,D=I=>v.has(I)?[]:(v.add(I),(a.get(I)||[]).map(p=>h(p)).filter(p=>p!=null).sort((p,y)=>p.marketLabel.localeCompare(y.marketLabel)));for(const I of t){const p=h(I);p&&(l[I]=D(I),c+=p.startValueCents||0,m+=p.endValueCents||0,u+=p.contributionsCents||0,g+=p.netGrowthCents||0,s.push(p))}return u=m-c,g=m-c,{scopeMarketIds:t,rows:s,childRowsByParent:l,startTotalCents:c,endTotalCents:m,contributionsTotalCents:u,netGrowthTotalCents:g,hasManualSnapshots:!1}}function Ce(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function W(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function fa(){if(M.kind==="none")return"";const e=z("currencySymbol")||J,t=(a,n)=>f.categories.filter(r=>!r.isArchived).filter(r=>!(a!=null&&a.has(r.id))).map(r=>`<option value="${r.id}" ${n===r.id?"selected":""}>${d(r.pathNames.join(" / "))}</option>`).join("");if(M.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((z("currencyCode")||ue).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Ut.map(a=>`<option value="${d(a.value)}" ${(z("currencySymbol")||J)===a.value?"selected":""}>${d(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${z("darkMode")??re?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${z("showMarketsGraphs")??pe?"checked":""} />
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
    `;if(M.kind==="categoryCreate"||M.kind==="categoryEdit"){const a=M.kind==="categoryEdit",n=M.kind==="categoryEdit"?x(M.categoryId):void 0;if(a&&!n)return"";const r=a&&n?f.inventoryRecords.filter(s=>s.categoryId===n.id).sort((s,l)=>l.purchaseDate.localeCompare(s.purchaseDate)):[],o=a&&n?new Set(at(f.categories,n.id)):void 0,i=be(f.categories);return Ee(bt(),f.filters,"inventoryTable",mt(),{categoryDescendantsMap:i}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${d((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${d((n==null?void 0:n.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${t(o,(n==null?void 0:n.parentId)||null)}
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
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${d((n==null?void 0:n.spotCode)||"")}"
                ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n?n.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            ${a?`
              <div>
                <div class="small fw-semibold mb-1">Linked Investments (${r.length})</div>
                ${r.length>0?`<div class="table-wrap table-responsive">
                        <table class="table table-striped table-sm align-middle mb-0 dataTable">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th class="text-end">Value</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${r.map(s=>`<tr>
                                <td><button type="button" class="btn btn-link p-0 align-baseline" data-action="edit-inventory" data-id="${d(s.id)}">${d(s.productName)}</button></td>
                                <td class="text-end">${d(S(s.totalPriceCents))}</td>
                                <td>${d(s.purchaseDate)}</td>
                              </tr>`).join("")}
                          </tbody>
                        </table>
                      </div>`:'<div class="small text-body-secondary">No investments are currently linked to this market.</div>'}
              </div>
            `:""}
            <div class="modal-footer px-0 pb-0">
              ${a&&n?`<button type="button" class="btn btn-danger me-auto" data-action="delete-category-record" data-id="${n.id}">Delete</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${a?"Save":"Create"}</button>
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
                ${t()}
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
    `;if(M.kind==="inventoryEdit"){const a=M,n=f.inventoryRecords.find(r=>r.id===a.inventoryId);return n?`
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
                ${t(void 0,n.categoryId)}
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
    `:""}return""}function R(){const e=window.scrollX,t=window.scrollY,a=w.querySelector('details[data-section="data-tools"]');a&&(Ue=a.open);const n=w.querySelector('details[data-section="investments"]');n&&(ze=n.open),Zt(),Qt();const{inventoryColumns:r,categoryColumns:o,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=sa(),c=pa(i),m=Wt(c.rows),u=z("showMarketsGraphs")??pe,g=l.some(b=>b.parentId==null),h=u&&g&&m.length>0,v=new Set([...Z].filter(b=>{var C;return(((C=c.childRowsByParent[b])==null?void 0:C.length)||0)>0}));v.size!==Z.size&&(Z=v);const D=c.startTotalCents>0?c.netGrowthTotalCents/c.startTotalCents:null,I=f.exportText||gt(),p=s.map(b=>`
        <tr class="${[ra(b)?"":"row-inactive",b.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${b.id}">
          ${r.map(k=>`<td class="${_(k)}">${Se("inventoryTable",b,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${b.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),y=new Set(l.map(b=>b.id)),$=new Map;for(const b of l){const C=b.parentId&&y.has(b.parentId)?b.parentId:null,k=$.get(C)||[];k.push(b),$.set(C,k)}for(const b of $.values())b.sort((C,k)=>C.sortOrder-k.sortOrder||C.name.localeCompare(k.name));const F=[],j=(b,C)=>{const k=$.get(b)||[];for(const T of k)F.push({category:T,depth:C}),j(T.id,C+1)};j(null,0);const ye=F.map(({category:b,depth:C})=>`
      <tr class="${[b.active?"":"row-inactive",b.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${b.id}">
        ${o.map(k=>{if(k.key==="name"){const T=C>0?(C-1)*1.1:0;return`<td class="${_(k)}"><div class="market-name-wrap" style="padding-left:${T.toFixed(2)}rem">${C>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Se("categoriesList",b,k)}</div></td>`}return`<td class="${_(k)}">${Se("categoriesList",b,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${b.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");w.innerHTML=`
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
        ${ne?`<div class="alert alert-${ne.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(ne.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          ${h?`
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
                  ${c.rows.map(b=>{const C=c.childRowsByParent[b.marketId]||[],k=Z.has(b.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${C.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(b.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(b.marketLabel)}
                        </td>
                      <td class="text-end">${b.startValueCents==null?"—":d(S(b.startValueCents))}</td>
                      <td class="text-end">${b.endValueCents==null?"—":d(S(b.endValueCents))}</td>
                      <td class="text-end ${W(b.netGrowthCents)}">${b.netGrowthCents==null?"—":d(S(b.netGrowthCents))}</td>
                      <td class="text-end ${W(b.growthPct)}">${d(Ce(b.growthPct))}</td>
                      </tr>
                      ${C.map(T=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(b.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(T.marketLabel)}</td>
                              <td class="text-end">${T.startValueCents==null?"—":d(S(T.startValueCents))}</td>
                              <td class="text-end">${T.endValueCents==null?"—":d(S(T.endValueCents))}</td>
                              <td class="text-end ${W(T.netGrowthCents)}">${T.netGrowthCents==null?"—":d(S(T.netGrowthCents))}</td>
                              <td class="text-end ${W(T.growthPct)}">${d(Ce(T.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(S(c.startTotalCents))}</th>
                    <th class="text-end">${d(S(c.endTotalCents))}</th>
                    <th class="text-end ${W(c.netGrowthTotalCents)}">${d(S(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${W(D)}">${d(Ce(D))}</th>
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
        ${We("categoriesList","Markets","")}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${o.map(b=>`<th class="${_(b)}">${d(b.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${ye}
            </tbody>
            ${ca(o,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${ze?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-primary" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${We("inventoryTable","Investments","")}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${r.map(b=>`<th class="${_(b)}">${d(b.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${p}
              </tbody>
              ${la(r,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Ue?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="small text-body-secondary mb-3">
          Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(Ie(f.storageUsageBytes)):`${d(Ie(f.storageUsageBytes))} of ${d(Ie(f.storageQuotaBytes))}`}
          <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
        </div>
        <div class="data-tool-block">
          <div class="data-tool-head">
            <span class="h6 mb-0">Export</span>
            <button type="button" class="btn btn-primary btn-sm" data-action="download-json">Export</button>
          </div>
          <label class="form-label mb-0">Export / Copy JSON
            <input class="form-control" id="export-text" readonly value="${d(I)}" />
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
    </div>
    ${fa()}
  `;const G=w.querySelector("#inventory-form");G&&(ct(G),Pe(G),lt(G));const K=w.querySelector("#category-form");K&&dt(K),_t(),Kt(m),Ne(),window.scrollTo(e,t)}function ma(e,t){const a=w.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const r of a)r.hidden=!t;const n=w.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);n&&(n.textContent=t?"▾":"▸",n.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function ba(){return{schemaVersion:2,exportedAt:V(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords}}function gt(){return JSON.stringify(ba())}function ya(e,t,a){const n=new Blob([t],{type:a}),r=URL.createObjectURL(n),o=document.createElement("a");o.href=r,o.download=e,o.click(),URL.revokeObjectURL(r)}async function ga(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim(),r=t.get("darkMode")==="on",o=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await B("currencyCode",a),await B("currencySymbol",n),await B("darkMode",r),await B("showMarketsGraphs",o),q(),await N()}async function ha(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),r=String(t.get("name")||"").trim(),o=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),c=t.get("active")==="on",m=i==="spot"||i==="snapshot"?i:void 0,u=m==="spot"&&s?fe(s):void 0,g=m==="spot"&&l?l:void 0;if(!r)return;if(m==="spot"&&s&&u==null){alert("Spot value is invalid.");return}const h=u??void 0,v=o||null;if(v&&!x(v)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const y=await Xe(n);if(!y){alert("Market not found.");return}if(v===y.id){alert("A category cannot be its own parent.");return}if(v&&at(f.categories,y.id).includes(v)){alert("A category cannot be moved under its own subtree.");return}const $=y.parentId!==v;y.name=r,y.parentId=v,y.evaluationMode=m,y.spotValueCents=h,y.spotCode=g,y.active=c,$&&(y.sortOrder=f.categories.filter(F=>F.parentId===v&&F.id!==y.id).length),y.updatedAt=V(),await De(y),q(),await N();return}const D=V(),I=f.categories.filter(y=>y.parentId===v).length,p={id:crypto.randomUUID(),name:r,parentId:v,pathIds:[],pathNames:[],depth:0,sortOrder:I,evaluationMode:m,spotValueCents:h,spotCode:g,active:c,isArchived:!1,createdAt:D,updatedAt:D};await De(p),q(),await N()}async function va(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),r=String(t.get("purchaseDate")||""),o=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=fe(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),c=l===""?null:fe(l),m=a==="create"?s??void 0:c??void 0,u=String(t.get("categoryId")||""),g=t.get("active")==="on",h=String(t.get("notes")||"").trim();if(!r||!o){alert("Date and product name are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&c!=null&&c<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&c==null){alert("Baseline value is invalid.");return}if(u&&!x(u)){alert("Select a valid category.");return}const v=Math.round(s/i);if(a==="edit"){if(!n)return;const p=await Le(n);if(!p){alert("Inventory record not found.");return}p.purchaseDate=r,p.productName=o,p.quantity=i,p.totalPriceCents=s,p.baselineValueCents=m,p.unitPriceCents=v,p.unitPriceSource="derived",p.categoryId=u,p.active=g,p.notes=h||void 0,p.updatedAt=V(),await le(p),q(),await N();return}const D=V(),I={id:crypto.randomUUID(),purchaseDate:r,productName:o,quantity:i,totalPriceCents:s,baselineValueCents:m,unitPriceCents:v,unitPriceSource:"derived",categoryId:u,active:g,archived:!1,notes:h||void 0,createdAt:D,updatedAt:D};await le(I),q(),await N()}async function wa(e,t){const a=await Le(e);a&&(a.active=t,a.updatedAt=V(),await le(a),await N())}async function Ia(e){const t=await Le(e);!t||!window.confirm(`Delete investment record "${t.productName}" permanently? This cannot be undone.`)||(await Ft(e),q(),await N())}async function Sa(e){const t=await Xe(e);if(!t)return;const a=f.inventoryRecords.filter(o=>o.categoryId===e).length;if(!window.confirm(`Delete market "${t.pathNames.join(" / ")}"? This cannot be undone.

This will also affect:
- ${a} investment record(s): their Market will be cleared.`))return;const r=V();for(const o of f.inventoryRecords)o.categoryId===e&&(o.categoryId="",o.updatedAt=r,await le(o));for(const o of f.categories)o.parentId===e&&(o.parentId=null,o.updatedAt=r,await De(o));await Vt(e),q(),await N()}function ht(e){const t=V();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Ca(e){const t=V(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const r=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),o=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,baselineValueCents:Number.isFinite(r)?r:void 0,unitPriceCents:o,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function ka(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Fe(t.categories.map(ht)),n=new Set(a.map(s=>s.id)),r=t.purchases.map(Ca);for(const s of r)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const o=Array.isArray(t.settings)?t.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:ue},{key:"currencySymbol",value:J},{key:"darkMode",value:re}];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await et({purchases:r,categories:a,settings:o}),P({importText:Y}),await N()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}async function $a(){const e=Fe(Ae.categories.map(ht)),t=Ae.settings.map(n=>({key:String(n.key),value:n.value}));window.confirm("Load default markets template and replace all existing data? This will keep no investments.")&&(await et({purchases:[],categories:e,settings:t}),P({filters:de(),importText:Y}),await N(),ot({tone:"success",text:"Default markets loaded."}))}function vt(e){return e.target instanceof HTMLElement?e.target:null}function Ye(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,r=e.dataset.value,o=e.dataset.label;if(!t||!a||!n||r==null||!o)return;const i=(m,u)=>m.viewId===u.viewId&&m.field===u.field&&m.op===u.op&&m.value===u.value;let s=Bt(f.filters,{viewId:t,field:a,op:n,value:r,label:o});const l=e.dataset.crossInventoryCategoryId;if(l){const m=x(l);if(m){const u=s.find(g=>i(g,{viewId:t,field:a,op:n,value:r}));if(u){const g=`Market: ${m.pathNames.join(" / ")}`;s=s.filter(v=>v.linkedToFilterId!==u.id);const h=s.findIndex(v=>i(v,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:m.id}));if(h>=0){const v=s[h];s=[...s.slice(0,h),{...v,label:g,linkedToFilterId:u.id},...s.slice(h+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:m.id,label:g,linkedToFilterId:u.id}]}}}let c={filters:s};t==="inventoryTable"&&a==="archived"&&r==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&r==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&r==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),P(c)}function wt(){ae!=null&&(window.clearTimeout(ae),ae=null)}function xa(e){const t=f.filters.filter(n=>n.viewId===e),a=t[t.length-1];a&&P({filters:tt(f.filters,a.id)})}w.addEventListener("click",async e=>{const t=vt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(wt(),e.detail>1)return;ae=window.setTimeout(()=>{ae=null,Ye(a)},220);return}Ye(a);return}if(n==="remove-filter"){const r=a.dataset.filterId;if(!r)return;P({filters:tt(f.filters,r)});return}if(n==="clear-filters"){const r=a.dataset.viewId;if(!r)return;const o=Rt(f.filters,r),i=de().find(s=>s.viewId===r);P({filters:i?[...o,i]:o});return}if(n==="open-create-category"){H({kind:"categoryCreate"});return}if(n==="open-create-inventory"){H({kind:"inventoryCreate"});return}if(n==="open-settings"){H({kind:"settings"});return}if(n==="apply-report-range"){const r=w.querySelector('input[name="reportDateFrom"]'),o=w.querySelector('input[name="reportDateTo"]');if(!r||!o)return;const i=r.value,s=o.value,l=Ze(i),c=Ze(s,!0);if(l==null||c==null||l>c){ot({tone:"warning",text:"Select a valid report date range."});return}P({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){P({reportDateFrom:rt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="copy-total-to-baseline"){const r=a.closest("form");if(!(r instanceof HTMLFormElement)||r.id!=="inventory-form")return;const o=r.querySelector('input[name="totalPrice"]'),i=r.querySelector('input[name="baselineValue"]'),s=r.querySelector('input[name="baselineValueDisplay"]'),l=r.querySelector('[data-role="baseline-copy-status"]');if(!o||!i)return;i.value=o.value.trim(),s&&(s.value=i.value),l&&(l.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',ie!=null&&window.clearTimeout(ie),ie=window.setTimeout(()=>{ie=null,l.isConnected&&(l.textContent="")},1800));return}if(n==="toggle-growth-children"){const r=a.dataset.marketId;if(!r)return;const o=new Set(Z),i=!o.has(r);i?o.add(r):o.delete(r),Z=o,ma(r,i);return}if(n==="edit-category"){const r=a.dataset.id;r&&H({kind:"categoryEdit",categoryId:r});return}if(n==="edit-inventory"){const r=a.dataset.id;r&&H({kind:"inventoryEdit",inventoryId:r});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;q();return}if(n==="toggle-inventory-active"){const r=a.dataset.id,o=a.dataset.nextActive==="true";r&&await wa(r,o);return}if(n==="delete-inventory-record"){const r=a.dataset.id;r&&await Ia(r);return}if(n==="delete-category-record"){const r=a.dataset.id;r&&await Sa(r);return}if(n==="download-json"){ya(`investments-app-${new Date().toISOString().slice(0,10)}.json`,gt(),"application/json");return}if(n==="replace-import"){await ka();return}if(n==="load-default-markets"){await $a();return}if(n==="wipe-all"){const r=document.querySelector("#wipe-confirm");if(!r||r.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Ot(),P({filters:de(),exportText:"",importText:Y,showArchivedInventory:!1,showArchivedCategories:!1}),await N();return}}});w.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(wt(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const r=n.dataset.id,o=n.dataset.rowEdit;if(!(!r||!o)){if(o==="inventory"){H({kind:"inventoryEdit",inventoryId:r});return}o==="category"&&H({kind:"categoryEdit",categoryId:r})}});w.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await ga(t);return}if(t.id==="category-form"){await ha(t);return}if(t.id==="inventory-form"){await va(t);return}}});w.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Pe(a),lt(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});w.addEventListener("change",async e=>{var r;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="inventory-form"&&(ct(o),Pe(o));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const o=t.closest("form");o instanceof HTMLFormElement&&o.id==="category-form"&&dt(o);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(r=t.files)==null?void 0:r[0];if(!a)return;const n=await a.text();try{P({importText:JSON.stringify(JSON.parse(n))})}catch{P({importText:n})}});w.addEventListener("pointermove",e=>{const t=vt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");ce=(a==null?void 0:a.dataset.filterSectionViewId)||null});w.addEventListener("pointerleave",()=>{ce=null});document.addEventListener("keydown",e=>{if(M.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!ce)return;e.preventDefault(),xa(ce);return}if(e.key==="Escape"){e.preventDefault(),q();return}if(e.key!=="Tab")return;const t=it();if(!t)return;const a=st(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],r=a[a.length-1],o=document.activeElement;if(e.shiftKey){(o===n||o instanceof Node&&!t.contains(o))&&(e.preventDefault(),r.focus());return}o===r&&(e.preventDefault(),n.focus())});N();
