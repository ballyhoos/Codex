(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const $t=(t,e)=>e.some(a=>t instanceof a);let jt,Bt;function ke(){return jt||(jt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ce(){return Bt||(Bt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const xt=new WeakMap,yt=new WeakMap,bt=new WeakMap;function Ie(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",s)},r=()=>{a(Y(t.result)),o()},s=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",s)});return bt.set(e,t),e}function $e(t){if(xt.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",s),t.removeEventListener("abort",s)},r=()=>{a(),o()},s=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",s),t.addEventListener("abort",s)});xt.set(t,e)}let Mt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return xt.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return Y(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Zt(t){Mt=t(Mt)}function xe(t){return Ce().includes(t)?function(...e){return t.apply(At(this),e),Y(this.request)}:function(...e){return Y(t.apply(At(this),e))}}function Me(t){return typeof t=="function"?xe(t):(t instanceof IDBTransaction&&$e(t),$t(t,ke())?new Proxy(t,Mt):t)}function Y(t){if(t instanceof IDBRequest)return Ie(t);if(yt.has(t))return yt.get(t);const e=Me(t);return e!==t&&(yt.set(t,e),bt.set(e,t)),e}const At=t=>bt.get(t);function Ae(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const s=indexedDB.open(t,e),i=Y(s);return n&&s.addEventListener("upgradeneeded",l=>{n(Y(s.result),l.oldVersion,l.newVersion,Y(s.transaction),l)}),a&&s.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),i.then(l=>{r&&l.addEventListener("close",()=>r()),o&&l.addEventListener("versionchange",c=>o(c.oldVersion,c.newVersion,c))}).catch(()=>{}),i}const De=["get","getKey","getAll","getAllKeys","count"],Te=["put","add","delete","clear"],gt=new Map;function Gt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(gt.get(e))return gt.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=Te.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||De.includes(a)))return;const r=async function(s,...i){const l=this.transaction(s,o?"readwrite":"readonly");let c=l.store;return n&&(c=c.index(i.shift())),(await Promise.all([c[a](...i),o&&l.done]))[0]};return gt.set(e,r),r}Zt(t=>({...t,get:(e,a,n)=>Gt(e,a)||t.get(e,a,n),has:(e,a)=>!!Gt(e,a)||t.has(e,a)}));const Ee=["continue","continuePrimaryKey","advance"],Ut={},Dt=new WeakMap,Xt=new WeakMap,Ne={get(t,e){if(!Ee.includes(e))return t[e];let a=Ut[e];return a||(a=Ut[e]=function(...n){Dt.set(this,Xt.get(this)[e](...n))}),a}};async function*Fe(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,Ne);for(Xt.set(a,e),bt.set(a,At(e));e;)yield a,e=await(Dt.get(a)||e.continue()),Dt.delete(a)}function zt(t,e){return e===Symbol.asyncIterator&&$t(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&$t(t,[IDBIndex,IDBObjectStore])}Zt(t=>({...t,get(e,a,n){return zt(e,a)?Fe:t.get(e,a,n)},has(e,a){return zt(e,a)||t.has(e,a)}}));const q=Ae("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let s=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(s=t.createObjectStore("inventory",{keyPath:"id"}),s.createIndex("by_purchaseDate","purchaseDate"),s.createIndex("by_productName","productName"),s.createIndex("by_categoryId","categoryId"),s.createIndex("by_active","active"),s.createIndex("by_archived","archived"),s.createIndex("by_updatedAt","updatedAt")),s&&r){let l=await r.openCursor();for(;l;)await s.put(l.value),l=await l.continue()}let i=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(i=t.createObjectStore("categories",{keyPath:"id"}),i.createIndex("by_parentId","parentId"),i.createIndex("by_name","name"),i.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const l=t.createObjectStore("valuationSnapshots",{keyPath:"id"});l.createIndex("by_capturedAt","capturedAt"),l.createIndex("by_scope","scope"),l.createIndex("by_marketId","marketId"),l.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let b=!1;typeof c.active!="boolean"&&(c.active=!0,b=!0),typeof c.archived!="boolean"&&(c.archived=!1,b=!0),b&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(i){let l=await i.openCursor();for(;l;){const c=l.value;let b=!1;typeof c.active!="boolean"&&(c.active=!0,b=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,b=!0),b&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function Le(){return(await q).getAll("inventory")}async function ut(t){await(await q).put("inventory",t)}async function Pt(t){return(await q).get("inventory",t)}async function Pe(){return(await q).getAll("categories")}async function Tt(t){await(await q).put("categories",t)}async function te(t){return(await q).get("categories",t)}async function Ve(){return(await q).getAll("settings")}async function B(t,e){await(await q).put("settings",{key:t,value:e})}async function Re(){return(await q).getAll("valuationSnapshots")}async function qe(t){if(!t.length)return;const a=(await q).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function Oe(t){const a=(await q).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function je(){const e=(await q).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Be(){const e=(await q).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function _t(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function Ge(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function ee(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function Ue(t,e){return t.filter(a=>a.viewId!==e)}function Et(t,e,a,n,o){const r=e.filter(i=>i.viewId===a);if(!r.length)return t;const s=new Map(n.map(i=>[i.key,i]));return t.filter(i=>r.every(l=>{var p;const c=s.get(l.field);if(!c)return!0;const b=c.getValue(i);if(l.op==="eq")return String(b)===l.value;if(l.op==="isEmpty")return _t(b);if(l.op==="isNotEmpty")return!_t(b);if(l.op==="contains")return String(b).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const g=((p=o==null?void 0:o.categoryDescendantsMap)==null?void 0:p.get(l.value))||new Set([l.value]),w=String(b);return g.has(w)}return!0}))}function ze(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function ct(t){const{children:e}=ze(t),a=new Map;function n(o){const r=new Set([o]);for(const s of e.get(o)||[])for(const i of n(s.id))r.add(i);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function ae(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],s=new Set;let i=n;for(;i&&!s.has(i.id);)s.add(i.id),o.unshift(i.id),r.unshift(i.name),i=i.parentId?e.get(i.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Vt(t,e){return[...ct(t).get(e)||new Set([e])]}function _e(t,e){const a=ct(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let s=0;for(const i of t)r.has(i.categoryId)&&(s+=i.totalPriceCents);n.set(o.id,s)}return n}const ne=document.querySelector("#app");if(!ne)throw new Error("#app not found");const x=ne;let L={kind:"none"},ot=null,Q=null,H=null,G=null,U=null,z=null,Ht=!1,dt=null,vt=!1,wt=null,rt=null,pt=null,Wt=!1,Qt=!1,et=new Set,Kt=!1,nt=null,st=null,f={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:oe(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const ft="USD",Z="$",lt=!1,mt=!1,ht=!1,He=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function V(){return new Date().toISOString()}function oe(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function St(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function A(t){const e=j("currencySymbol")||Z,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function We(t){const e=j("currencySymbol")||Z,n=Math.abs(t)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${t<0?"-":""}${e}${Math.round(o)}${r}`}function Rt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function j(t){var e;return(e=f.settings.find(a=>a.key===t))==null?void 0:e.value}function Qe(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:lt;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function O(t){f={...f,...t},W()}function it(t){nt!=null&&(window.clearTimeout(nt),nt=null),st=t,W(),t&&(nt=window.setTimeout(()=>{nt=null,st=null,W()},3500))}function K(t){L.kind==="none"&&document.activeElement instanceof HTMLElement&&(ot=document.activeElement),L=t,W()}function X(){L.kind!=="none"&&(L={kind:"none"},W(),ot&&ot.isConnected&&ot.focus(),ot=null)}function re(){return x.querySelector(".modal-panel")}function se(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function Ke(){if(L.kind==="none")return;const t=re();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(se(t)[0]||t).focus()}function Je(){var t,e;(t=Q==null?void 0:Q.destroy)==null||t.call(Q),(e=H==null?void 0:H.destroy)==null||e.call(H),Q=null,H=null}function Nt(){var s;const t=window,e=t.DataTable,a=t.jQuery&&((s=t.jQuery.fn)!=null&&s.DataTable)?t.jQuery:void 0;if(!e&&!a){wt==null&&(wt=window.setTimeout(()=>{wt=null,Nt(),W()},500)),vt||(vt=!0,window.addEventListener("load",()=>{vt=!1,Nt(),W()},{once:!0}));return}const n=x.querySelector("#categories-table"),o=x.querySelector("#inventory-table"),r=(i,l)=>{var c,b;return e?new e(i,l):a?((b=(c=a(i)).DataTable)==null?void 0:b.call(c,l))??null:null};n&&(Q=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(H=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),ra(o,H))}function Ye(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const s=n.getValue(r);return typeof s!="number"||!Number.isFinite(s)||s<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:s}}).filter(r=>r!=null).sort((r,s)=>s.totalCents-r.totalCents):[]}function at(t,e){const a=x.querySelector(`#${t}`),n=x.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Ft(t){const e=x.querySelector(`#${t}`),a=x.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Ze(){G==null||G.dispose(),U==null||U.dispose(),z==null||z.dispose(),G=null,U=null,z=null}function Xe(){Ht||(Ht=!0,window.addEventListener("resize",()=>{dt!=null&&window.clearTimeout(dt),dt=window.setTimeout(()=>{dt=null,G==null||G.resize(),U==null||U.resize(),z==null||z.resize()},120)}))}function ie(t){const e=Date.parse(t);return Number.isFinite(e)?new Date(e).toISOString().slice(0,10):null}function ta(t){const e=new Map;for(const a of t){const n=ie(a.capturedAt);if(!n)continue;const r=`${a.scope==="portfolio"?"portfolio":`market:${a.marketId||""}`}::${n}`,s=e.get(r);(!s||Date.parse(a.capturedAt)>Date.parse(s.capturedAt))&&e.set(r,a)}return[...e.values()]}function ea(t){const e=_(f.reportDateFrom),a=_(f.reportDateTo,!0);if(e==null||a==null||e>a)return{labels:[],series:[],overallValues:[],showOverallComparison:!1};const n=ta(f.valuationSnapshots);new Set(t);const o=f.filters.some(m=>m.viewId==="categoriesList"),r=new Set,s=new Map,i=f.categories.filter(m=>m.active&&!m.isArchived),l=new Map;for(const m of i){if(!m.parentId)continue;const d=l.get(m.parentId)||[];d.push(m.id),l.set(m.parentId,d)}for(const m of l.values())m.sort();for(const m of n){const d=Date.parse(m.capturedAt);if(!Number.isFinite(d)||d<e||d>a)continue;const h=ie(m.capturedAt);if(!h||m.scope!=="market"||!m.marketId)continue;r.add(h);const k=s.get(m.marketId)||[];k.push(m),s.set(m.marketId,k)}for(const m of s.values())m.sort((d,h)=>Date.parse(d.capturedAt)-Date.parse(h.capturedAt));const c=[...r].sort();if(!c.length)return{labels:[],series:[],overallValues:[],showOverallComparison:o};const b=c.map(m=>{const d=new Date(`${m}T00:00:00.000Z`);return Number.isNaN(d.getTime())?m:d.toLocaleDateString()}),p=new Map,g=(m,d)=>{const h=`${m}::${d}`;if(p.has(h))return p.get(h)??null;const k=l.get(m)||[];if(k.length>0){let T=0,E=!1;for(const F of k){const y=g(F,d);y!=null&&(T+=y,E=!0)}const I=E?T:null;return p.set(h,I),I}const D=s.get(m)||[],C=Lt(D,d);return p.set(h,C),C},w=t.map(m=>{const d=P(m);if(!d)return null;const h=d.pathNames.join(" / "),k=c.map(C=>{const T=_(C,!0);return T==null?null:g(m,T)});return k.some(C=>typeof C=="number")?{marketId:m,label:h,values:k}:null}).filter(m=>m!=null),v=f.categories.filter(m=>m.active&&!m.isArchived&&m.parentId==null).map(m=>m.id),M=c.map(m=>{const d=_(m,!0);if(d==null)return null;let h=0,k=!1;for(const D of v){const C=g(D,d);C!=null&&(h+=C,k=!0)}return k?h:null});return{labels:b,series:w,overallValues:M,showOverallComparison:o}}function aa(t){const e="growth-trend-chart",a=x.querySelector(`#${e}`);if(!a)return;if(!window.echarts){at(e,"Chart unavailable: ECharts not loaded.");return}const n=t.overallValues.some(g=>typeof g=="number"),o=t.series.length>0;if(!t.labels.length||!n&&!o){at(e,"No snapshot trend data for this period yet.");return}Ft(e);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",i=window.matchMedia("(max-width: 767.98px)").matches?11:13,l=r?"#e9ecef":"#212529",c=r?"#ced4da":"#495057",b=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],p=t.labels.length>12?Math.ceil(t.labels.length/6):1;z=window.echarts.init(a),z.setOption({color:b,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:l,fontSize:i}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:l,fontSize:i},formatter:g=>{var v;if(!g.length)return"";const w=g.filter(M=>typeof M.value=="number").map(M=>`${u(M.seriesName||"")}: ${A(M.value)}`);return[`<strong>${u(((v=g[0])==null?void 0:v.axisValueLabel)||"")}</strong>`,...w].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:t.labels,boundaryGap:!1,axisLabel:{color:c,fontSize:i,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:g=>g%p===0||g===t.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:c}}},yAxis:{type:"value",position:"left",axisLabel:{color:c,margin:6,fontSize:i,formatter:g=>We(g)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:t.showOverallComparison?"Overall (All Markets)":"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:t.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...t.series.map((g,w)=>({name:g.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:g.values,lineStyle:{width:w===0?2.6:2}}))]})}function na(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function oa(t){const e="markets-allocation-chart",a="markets-top-chart",n=x.querySelector(`#${e}`),o=x.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){at(e,"Chart unavailable: ECharts not loaded."),at(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){at(e,"No eligible market totals to chart."),at(a,"No eligible market totals to chart.");return}Ft(e),Ft(a);const r=window.matchMedia("(max-width: 767.98px)").matches,s=document.documentElement.getAttribute("data-bs-theme")==="dark",i=r?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],c=s?"#e9ecef":"#212529",b=s?"#ced4da":"#495057",p=t.map(m=>({name:m.label,value:m.totalCents})),g=t.slice(0,5),w=[...g].reverse(),v=g.reduce((m,d)=>Math.max(m,d.totalCents),0),M=v>0?Math.ceil(v*1.2):1;G=window.echarts.init(n),U=window.echarts.init(o),G.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:i},formatter:m=>`${u(m.name)}: ${A(m.value)} (${m.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:c,fontSize:i}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:c,fontSize:i}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:p,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:i,textBorderWidth:0,formatter:m=>{const d=m.percent??0;return`${Math.round(d)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:b,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),U.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:i},formatter:m=>{const d=m[0];return d?`${u(d.name)}: ${A(d.value)}`:""}},xAxis:{type:"value",max:M,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:w.map(m=>m.label),axisLabel:{color:b,fontSize:i,formatter:m=>na(m)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:w.map(m=>m.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:c,fontSize:i,formatter:m=>A(m.value)}}]}),Xe()}function ra(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var p,g,w;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const s=Array.from(r.querySelectorAll("th")),i=s.indexOf(o);if(i<0||i===s.length-1)return;a.preventDefault(),a.stopPropagation();const l=(p=e.order)==null?void 0:p.call(e),c=Array.isArray(l)?l[0]:void 0,b=c&&c[0]===i&&c[1]==="asc"?"desc":"asc";(g=e.order)==null||g.call(e,[[i,b]]),(w=e.draw)==null||w.call(e,!1)},!0)}async function R(){var i,l;const[t,e,a,n]=await Promise.all([Le(),Pe(),Ve(),Re()]),o=ae(e).sort((c,b)=>c.sortOrder-b.sortOrder||c.name.localeCompare(b.name));a.some(c=>c.key==="currencyCode")||(await B("currencyCode",ft),a.push({key:"currencyCode",value:ft})),a.some(c=>c.key==="currencySymbol")||(await B("currencySymbol",Z),a.push({key:"currencySymbol",value:Z})),a.some(c=>c.key==="darkMode")||(await B("darkMode",lt),a.push({key:"darkMode",value:lt})),a.some(c=>c.key==="showMarketsGraphs")||(await B("showMarketsGraphs",mt),a.push({key:"showMarketsGraphs",value:mt})),a.some(c=>c.key==="showGrowthGraph")||(await B("showGrowthGraph",ht),a.push({key:"showGrowthGraph",value:ht})),Qe(a);let r=null,s=null;try{const c=await((l=(i=navigator.storage)==null?void 0:i.estimate)==null?void 0:l.call(i));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,s=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,s=null}f={...f,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:s},W()}function P(t){if(t)return f.categories.find(e=>e.id===t)}function sa(t){const e=P(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function ia(t){return sa(t)}function la(t){const e=P(t);return e?e.pathIds.some(a=>{var n;return((n=P(a))==null?void 0:n.active)===!1}):!1}function ca(t){const e=P(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=P(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function da(t){return t.active&&!ca(t)}function kt(t){return t==null?"":(t/100).toFixed(2)}function qt(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=Rt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function le(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=P(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function ce(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const s=e.value==="spot";a.hidden=!s,n.disabled=!s,o.hidden=!s,r.disabled=!s}function J(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function de(t){return t.active&&!t.archived}function ue(){const t=f.inventoryRecords.filter(de),e=f.categories.filter(r=>!r.isArchived),a=_e(t,e),n=new Map(f.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const s=n.get(r.categoryId);if(s)for(const i of s.pathIds)o.set(i,(o.get(i)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function pe(t,e){const a=new Map;f.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const s=a.get(r.parentId)||[];s.push(r),a.set(r.parentId,s)});const n=new Map,o=r=>{const s=n.get(r);if(s!=null)return s;const i=P(r);if(!i||i.isArchived)return n.set(r,0),0;let l=0;return i.evaluationMode==="snapshot"?l=t.get(i.id)||0:i.evaluationMode==="spot"&&i.spotValueCents!=null?l=(e.get(i.id)||0)*i.spotValueCents:l=(a.get(i.id)||[]).reduce((b,p)=>b+o(p.id),0),n.set(r,l),l};return f.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function fe(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>ia(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>A(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>A(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ua(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":A(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function me(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(t=>!t.archived)}function pa(){return f.showArchivedCategories?f.categories:f.categories.filter(t=>!t.isArchived)}function fa(){const t=fe(),e=ua(),a=e.filter(p=>p.key==="name"||p.key==="parent"||p.key==="path"),n=e.filter(p=>p.key!=="name"&&p.key!=="parent"&&p.key!=="path"),o=ct(f.categories),r=Et(me(),f.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:s,categoryQty:i}=ue(),l=pe(s,i),c=[...a,{key:"computedQty",label:"Qty",getValue:p=>i.get(p.id)||0,getDisplay:p=>String(i.get(p.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:p=>s.get(p.id)||0,getDisplay:p=>A(s.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:p=>l.get(p.id)||0,getDisplay:p=>A(l.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:p=>p.active&&!p.isArchived,getDisplay:p=>p.active&&!p.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],b=Et(pa(),f.filters,"categoriesList",c);return{inventoryColumns:t,categoryColumns:c,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:b,categoryTotals:s,categoryQty:i}}async function he(t){const e=(t==null?void 0:t.source)??"manual",a=(t==null?void 0:t.silent)??!1,n=(t==null?void 0:t.skipReload)??!1,o=V(),{categoryTotals:r,categoryQty:s}=ue(),i=pe(r,s),l=f.categories.filter(d=>d.active&&!d.isArchived),c=ct(f.categories),b=f.inventoryRecords.filter(de),p=new Set(f.valuationSnapshots.filter(d=>d.scope==="market"&&!!d.marketId).map(d=>d.marketId)),g=f.valuationSnapshots.some(d=>d.scope==="portfolio"),w=[];let v=0,M=0;for(const d of l){let h=null;const k=c.get(d.id)||new Set([d.id]);let D=s.get(d.id)||0;const C=!p.has(d.id);let T=o,E=null;if(C){for(const I of b){if(!k.has(I.categoryId))continue;const F=I.purchaseDate;/^\d{4}-\d{2}-\d{2}$/.test(F)&&(!E||F<E)&&(E=F)}E&&(T=`${E}T00:00:00.000Z`)}if(d.evaluationMode==="spot"){if(d.spotValueCents==null){M+=1;continue}C&&E&&(D=b.filter(I=>k.has(I.categoryId)&&/^\d{4}-\d{2}-\d{2}$/.test(I.purchaseDate)&&I.purchaseDate<=E).reduce((I,F)=>I+F.quantity,0)),h=Math.round(D*d.spotValueCents)}else d.evaluationMode==="snapshot"?C&&E?h=b.filter(I=>k.has(I.categoryId)&&/^\d{4}-\d{2}-\d{2}$/.test(I.purchaseDate)&&I.purchaseDate<=E).reduce((I,F)=>I+F.totalPriceCents,0):h=r.get(d.id)||0:h=i.get(d.id)||0;v+=h,w.push({id:crypto.randomUUID(),capturedAt:T,scope:"market",marketId:d.id,evaluationMode:d.evaluationMode,valueCents:h,quantity:d.evaluationMode==="spot"?D:void 0,source:e,createdAt:o,updatedAt:o})}if(!w.length){a||it({tone:"warning",text:"No markets were eligible for snapshot capture."});return}const m=!g&&w.length?w.map(d=>d.capturedAt).reduce((d,h)=>Date.parse(h)<Date.parse(d)?h:d):o;if(w.push({id:crypto.randomUUID(),capturedAt:m,scope:"portfolio",valueCents:v,source:e,createdAt:o,updatedAt:o}),await qe(w),n||await R(),!a){const d=M>0?` (${M} skipped)`:"";it({tone:"success",text:`Snapshot captured ${new Date(o).toLocaleString()} • ${A(v)}${d}`})}}function be(){Kt||(Kt=!0,he({source:"derived",silent:!0,skipReload:!0}).catch(()=>{}))}function Jt(t,e,a=""){const n=f.filters.filter(o=>o.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${u(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(o=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${u(o.label)}"
                  aria-label="Remove filter: ${u(o.label)}"
                  data-action="remove-filter"
                  data-filter-id="${o.id}"
                >${u(o.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function Ct(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),s=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const l=String(e.categoryId),c=la(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const l=e.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const l=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function ye(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function ma(t,e){const a=t.map((n,o)=>{let r=0,s=!1;for(const l of e){const c=n.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(r+=c,s=!0)}const i=s?String(n.key).toLowerCase().includes("cents")?A(r):ye(r):o===0?"Totals":"";return`<th class="${J(n)}">${u(i)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function ha(t,e){const a=new Set(e.map(s=>s.id)),n=e.filter(s=>!s.parentId||!a.has(s.parentId)),o=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),r=t.map((s,i)=>{const l=o.has(String(s.key))?n:e;let c=0,b=!1;for(const g of l){const w=s.getValue(g);typeof w=="number"&&Number.isFinite(w)&&(c+=w,b=!0)}const p=b?String(s.key).toLowerCase().includes("cents")?A(c):ye(c):i===0?"Totals":"";return`<th class="${J(s)}">${u(p)}</th>`});return r.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${r.join("")}</tr></tfoot>`}function _(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function ba(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const s=e.get(r);if(s!=null&&s.has(o))return!1}return!0})}function ya(t){const e=new Set(f.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(f.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?ba(a,t):f.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Lt(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function ga(t){const e=_(f.reportDateFrom),a=_(f.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],childRowsByParent:{},startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=ya(t),o=new Map;for(const d of f.valuationSnapshots){if(d.scope!=="market"||!d.marketId)continue;const h=o.get(d.marketId)||[];h.push(d),o.set(d.marketId,h)}for(const d of o.values())d.sort((h,k)=>Date.parse(h.capturedAt)-Date.parse(k.capturedAt));const r=f.inventoryRecords.filter(d=>d.active&&!d.archived),s=[],i={},l=f.categories.filter(d=>!d.isArchived&&d.active),c=new Map;for(const d of l){if(!d.parentId)continue;const h=c.get(d.parentId)||[];h.push(d),c.set(d.parentId,h)}for(const d of c.values())d.sort((h,k)=>h.name.localeCompare(k.name));let b=0,p=0,g=0,w=0;const v=d=>{const h=P(d);if(!h)return null;const k=t.get(d)||new Set([d]),D=o.get(d)||[],C=Lt(D,e),T=Lt(D,a);let E=0;for(const y of r){if(!k.has(y.categoryId))continue;const S=_(y.purchaseDate);S!=null&&S>e&&S<=a&&(E+=y.totalPriceCents)}const I=C==null||T==null?null:T-C,F=I==null||C==null||C<=0?null:I/C;return{marketId:d,marketLabel:h.pathNames.join(" / "),startValueCents:C,endValueCents:T,contributionsCents:E,netGrowthCents:I,growthPct:F}},M=new Map,m=d=>{if(M.has(d))return M.get(d)||null;const h=v(d);if(!h)return M.set(d,null),null;const k=(c.get(d)||[]).map(S=>m(S.id)).filter(S=>S!=null).sort((S,$)=>S.marketLabel.localeCompare($.marketLabel));if(i[d]=k,!k.length)return M.set(d,h),h;const D=S=>{let $=0,N=!1;for(const Se of k){const Ot=S(Se);Ot!=null&&($+=Ot,N=!0)}return N?$:null},C=D(S=>S.startValueCents),T=D(S=>S.endValueCents),E=k.reduce((S,$)=>S+$.contributionsCents,0),I=C==null||T==null?null:T-C,F=I==null||C==null||C<=0?null:I/C,y={...h,startValueCents:C,endValueCents:T,contributionsCents:E,netGrowthCents:I,growthPct:F};return M.set(d,y),y};for(const d of n){const h=m(d);h&&(h.startValueCents!=null&&(b+=h.startValueCents),h.endValueCents!=null&&(p+=h.endValueCents),g+=h.contributionsCents,h.netGrowthCents!=null&&(w+=h.netGrowthCents),s.push(h))}return{scopeMarketIds:n,rows:s,childRowsByParent:i,startTotalCents:b,endTotalCents:p,contributionsTotalCents:g,netGrowthTotalCents:w}}function It(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function tt(t){return t==null||!Number.isFinite(t)||t===0?"text-body-secondary":t>0?"text-success":"text-danger"}function va(){if(L.kind==="none")return"";const t=j("currencySymbol")||Z,e=(a,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if(L.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((j("currencyCode")||ft).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${He.map(a=>`<option value="${u(a.value)}" ${(j("currencySymbol")||Z)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${j("darkMode")??lt?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showGrowthGraph" ${j("showGrowthGraph")??ht?"checked":""} />
                  <span class="form-check-label">Show Growth graph</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${j("showMarketsGraphs")??mt?"checked":""} />
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
    `;if(L.kind==="categoryCreate"||L.kind==="categoryEdit"){const a=L.kind==="categoryEdit",n=L.kind==="categoryEdit"?P(L.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Vt(f.categories,n.id)):void 0,r=ct(f.categories);return Et(me(),f.filters,"inventoryTable",fe(),{categoryDescendantsMap:r}),`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-category" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-category" class="modal-title fs-5">${a?"Edit Market":"Create Market"}</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="category-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="${a?"edit":"create"}" />
            <input type="hidden" name="categoryId" value="${u((n==null?void 0:n.id)||"")}" />
            <label class="form-label mb-0">Name<input class="form-control" name="name" required value="${u((n==null?void 0:n.name)||"")}" /></label>
            <label>Parent market
              <select class="form-select" name="parentId">
                <option value=""></option>
                ${e(o,(n==null?void 0:n.parentId)||null)}
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
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(kt(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
              </div>
            </label>
            <label class="form-label mb-0" data-spot-code-group ${(n==null?void 0:n.evaluationMode)==="spot"?"":"hidden"}>
              Code
              <input
                class="form-control"
                name="spotCode"
                maxlength="64"
                placeholder="e.g. XAGUSD"
                value="${u((n==null?void 0:n.spotCode)||"")}"
                ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"}
              />
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n?n.active!==!1?"checked":"":"checked"} /> <span class="form-check-label">Active</span></label>
            <div class="modal-footer px-0 pb-0">
              ${a&&n?`<button type="button" class="btn ${n.isArchived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-category-subtree-archived" data-id="${n.id}" data-next-archived="${String(!n.isArchived)}">${n.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${a?"Save":"Create"}</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `}if(L.kind==="inventoryCreate")return`
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
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${new Date().toISOString().slice(0,10)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e()}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="" disabled />
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
    `;if(L.kind==="inventoryEdit"){const a=L,n=f.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
      <div class="modal fade show d-block" data-action="close-modal-backdrop" tabindex="-1" role="presentation">
        <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title-purchase" tabindex="-1">
          <div class="modal-header">
            <h2 id="modal-title-purchase" class="modal-title fs-5">Edit Investment Record</h2>
            <button type="button" class="btn-close" aria-label="Close" data-action="close-modal"></button>
          </div>
          <form id="inventory-form" class="modal-body d-grid gap-3">
            <input type="hidden" name="mode" value="edit" />
            <input type="hidden" name="inventoryId" value="${u(n.id)}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${u(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${u(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${u(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(kt(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(kt(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${u(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function W(){const t=window.scrollX,e=window.scrollY,a=x.querySelector('details[data-section="data-tools"]');a&&(Wt=a.open);const n=x.querySelector('details[data-section="investments"]');n&&(Qt=n.open),Ze(),Je();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:s,filteredInventoryRecords:i,filteredCategories:l}=fa(),c=f.filters.some(y=>y.viewId==="categoriesList"),b=Ye(l,r,c),p=ga(s),g=ea(p.scopeMarketIds),w=j("showGrowthGraph")??ht,v=j("showMarketsGraphs")??mt,M=new Set([...et].filter(y=>{var S;return(((S=p.childRowsByParent[y])==null?void 0:S.length)||0)>0}));M.size!==et.size&&(et=M);const m=p.startTotalCents>0?p.netGrowthTotalCents/p.startTotalCents:null,d=f.exportText||ge(),h=i.map(y=>`
        <tr class="${[da(y)?"":"row-inactive",y.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${y.id}">
          ${o.map($=>`<td class="${J($)}">${Ct("inventoryTable",y,$)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${y.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),k=new Set(l.map(y=>y.id)),D=new Map;for(const y of l){const S=y.parentId&&k.has(y.parentId)?y.parentId:null,$=D.get(S)||[];$.push(y),D.set(S,$)}for(const y of D.values())y.sort((S,$)=>S.sortOrder-$.sortOrder||S.name.localeCompare($.name));const C=[],T=(y,S)=>{const $=D.get(y)||[];for(const N of $)C.push({category:N,depth:S}),T(N.id,S+1)};T(null,0);const E=C.map(({category:y,depth:S})=>`
      <tr class="${[y.active?"":"row-inactive",y.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${y.id}">
        ${r.map($=>{if($.key==="name"){const N=S>0?(S-1)*1.1:0;return`<td class="${J($)}"><div class="market-name-wrap" style="padding-left:${N.toFixed(2)}rem">${S>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Ct("categoriesList",y,$)}</div></td>`}return`<td class="${J($)}">${Ct("categoriesList",y,$)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${y.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");x.innerHTML=`
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
        ${st?`<div class="alert alert-${st.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(st.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${p.scopeMarketIds.length?`${p.scopeMarketIds.length} market${p.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${u(f.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${u(f.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${w?`
            <div class="growth-widget-card card border-0 mb-2">
              <div class="card-body p-1 p-md-2">
                <div class="growth-chart-frame">
                  <div id="growth-trend-chart" class="growth-chart-canvas" role="img" aria-label="Growth over time chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="growth-trend-chart" hidden></p>
                </div>
              </div>
            </div>
          `:""}
          ${p.rows.length===0?`
            <p class="mb-0 text-body-secondary">No snapshot data for this scope/range yet.</p>
          `:`
            <div class="table-wrap table-responsive">
              <table class="table table-striped table-sm align-middle mb-0 dataTable">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th class="text-end">Start</th>
                    <th class="text-end">End</th>
                    <th class="text-end">Contributions</th>
                    <th class="text-end">Growth</th>
                    <th class="text-end">Growth %</th>
                  </tr>
                </thead>
                <tbody>
                  ${p.rows.map(y=>{const S=p.childRowsByParent[y.marketId]||[],$=et.has(y.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${S.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${u(y.marketId)}" aria-label="${$?"Collapse":"Expand"} child markets">${$?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${u(y.marketLabel)}
                        </td>
                      <td class="text-end">${y.startValueCents==null?"—":u(A(y.startValueCents))}</td>
                      <td class="text-end">${y.endValueCents==null?"—":u(A(y.endValueCents))}</td>
                      <td class="text-end">${u(A(y.contributionsCents))}</td>
                      <td class="text-end ${tt(y.netGrowthCents)}">${y.netGrowthCents==null?"—":u(A(y.netGrowthCents))}</td>
                      <td class="text-end ${tt(y.growthPct)}">${u(It(y.growthPct))}</td>
                      </tr>
                      ${S.map(N=>`
                            <tr class="growth-child-row" data-parent-market-id="${u(y.marketId)}" ${$?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${u(N.marketLabel)}</td>
                              <td class="text-end">${N.startValueCents==null?"—":u(A(N.startValueCents))}</td>
                              <td class="text-end">${N.endValueCents==null?"—":u(A(N.endValueCents))}</td>
                              <td class="text-end">${u(A(N.contributionsCents))}</td>
                              <td class="text-end ${tt(N.netGrowthCents)}">${N.netGrowthCents==null?"—":u(A(N.netGrowthCents))}</td>
                              <td class="text-end ${tt(N.growthPct)}">${u(It(N.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(A(p.startTotalCents))}</th>
                    <th class="text-end">${u(A(p.endTotalCents))}</th>
                    <th class="text-end">${u(A(p.contributionsTotalCents))}</th>
                    <th class="text-end ${tt(p.netGrowthTotalCents)}">${u(A(p.netGrowthTotalCents))}</th>
                    <th class="text-end ${tt(m)}">${u(It(m))}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          `}
        </div>
      </section>

      <section class="card shadow-sm" data-filter-section-view-id="categoriesList">
        <div class="card-body">
        <div class="section-head markets-section-head">
          <h2 class="h5 mb-0">Markets</h2>
          <div class="d-flex align-items-center gap-2 justify-content-end markets-section-actions">
            <button type="button" class="btn btn-warning capture-snapshot-btn btn-sm" data-action="capture-snapshot">Capture Snapshot</button>
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${v?`
          <div class="markets-widget-grid mb-2">
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
        ${Jt("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${f.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(y=>`<th class="${J(y)}">${u(y.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${E}
            </tbody>
            ${ha(r,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${Qt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Jt("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${f.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(y=>`<th class="${J(y)}">${u(y.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${h}
              </tbody>
              ${ma(o,i)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Wt?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?u(St(f.storageUsageBytes)):`${u(St(f.storageUsageBytes))} of ${u(St(f.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(d)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${u(f.importText)}</textarea>
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
    ${va()}
  `;const I=x.querySelector("#inventory-form");I&&(le(I),qt(I));const F=x.querySelector("#category-form");F&&ce(F),Ke(),oa(b),aa(g),Nt(),window.scrollTo(t,e)}function wa(t,e){const a=x.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${t}"]`);if(!a.length)return;for(const o of a)o.hidden=!e;const n=x.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${t}"]`);n&&(n.textContent=e?"▾":"▸",n.setAttribute("aria-label",`${e?"Collapse":"Expand"} child markets`))}function Sa(){return{schemaVersion:2,exportedAt:V(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords,valuationSnapshots:f.valuationSnapshots}}function ge(){return JSON.stringify(Sa(),null,2)}function ka(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function Ca(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on",r=e.get("showGrowthGraph")==="on",s=e.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await B("currencyCode",a),await B("currencySymbol",n),await B("darkMode",o),await B("showGrowthGraph",r),await B("showMarketsGraphs",s),X(),await R()}async function Ia(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),s=String(e.get("evaluationMode")||"").trim(),i=String(e.get("spotValue")||"").trim(),l=String(e.get("spotCode")||"").trim(),c=e.get("active")==="on",b=s==="spot"||s==="snapshot"?s:void 0,p=b==="spot"&&i?Rt(i):void 0,g=b==="spot"&&l?l:void 0;if(!o)return;if(b==="spot"&&i&&p==null){alert("Spot value is invalid.");return}const w=p??void 0,v=r||null;if(v&&!P(v)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const h=await te(n);if(!h){alert("Market not found.");return}if(v===h.id){alert("A category cannot be its own parent.");return}if(v&&Vt(f.categories,h.id).includes(v)){alert("A category cannot be moved under its own subtree.");return}const k=h.parentId!==v;h.name=o,h.parentId=v,h.evaluationMode=b,h.spotValueCents=w,h.spotCode=g,h.active=c,k&&(h.sortOrder=f.categories.filter(D=>D.parentId===v&&D.id!==h.id).length),h.updatedAt=V(),await Tt(h),X(),await R();return}const M=V(),m=f.categories.filter(h=>h.parentId===v).length,d={id:crypto.randomUUID(),name:o,parentId:v,pathIds:[],pathNames:[],depth:0,sortOrder:m,evaluationMode:b,spotValueCents:w,spotCode:g,active:c,isArchived:!1,createdAt:M,updatedAt:M};await Tt(d),X(),await R()}async function $a(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),s=Number(e.get("quantity")),i=Rt(String(e.get("totalPrice")||"")),l=String(e.get("categoryId")||""),c=e.get("active")==="on",b=String(e.get("notes")||"").trim();if(!o||!r||!l){alert("Date, product name, and category are required.");return}if(!Number.isFinite(s)||s<=0){alert("Quantity must be greater than 0.");return}if(i==null||i<0){alert("Total price is invalid.");return}if(!P(l)){alert("Select a valid category.");return}const p=Math.round(i/s);if(a==="edit"){if(!n)return;const v=await Pt(n);if(!v){alert("Inventory record not found.");return}v.purchaseDate=o,v.productName=r,v.quantity=s,v.totalPriceCents=i,v.unitPriceCents=p,v.unitPriceSource="derived",v.categoryId=l,v.active=c,v.notes=b||void 0,v.updatedAt=V(),await ut(v),X(),await R();return}const g=V(),w={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:s,totalPriceCents:i,unitPriceCents:p,unitPriceSource:"derived",categoryId:l,active:c,archived:!1,notes:b||void 0,createdAt:g,updatedAt:g};await ut(w),X(),await R()}async function xa(t,e){const a=await Pt(t);a&&(a.active=e,a.updatedAt=V(),await ut(a),await R())}async function Ma(t,e){const a=await Pt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?V():void 0,a.updatedAt=V(),await ut(a),await R()))}async function Aa(t,e){const a=P(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Vt(f.categories,t),o=V();for(const r of n){const s=await te(r);s&&(s.isArchived=e,e&&(s.active=!1),s.archivedAt=e?o:void 0,s.updatedAt=o,await Tt(s))}await R()}function Da(t){const e=V();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Ta(t){const e=V(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Ea(t){const e=V(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function Na(){const t=f.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=ae(e.categories.map(Da)),n=new Set(a.map(l=>l.id)),o=e.purchases.map(Ta);for(const l of o)if(!n.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:ft},{key:"currencySymbol",value:Z},{key:"darkMode",value:lt}],s=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(Ea):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Oe({purchases:o,categories:a,settings:r,valuationSnapshots:s}),O({importText:""}),await R()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ve(t){return t.target instanceof HTMLElement?t.target:null}function Yt(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const s=(b,p)=>b.viewId===p.viewId&&b.field===p.field&&b.op===p.op&&b.value===p.value;let i=Ge(f.filters,{viewId:e,field:a,op:n,value:o,label:r});const l=t.dataset.crossInventoryCategoryId;if(l){const b=P(l);if(b){const p=i.find(g=>s(g,{viewId:e,field:a,op:n,value:o}));if(p){const g=`Market: ${b.pathNames.join(" / ")}`;i=i.filter(v=>v.linkedToFilterId!==p.id);const w=i.findIndex(v=>s(v,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:b.id}));if(w>=0){const v=i[w];i=[...i.slice(0,w),{...v,label:g,linkedToFilterId:p.id},...i.slice(w+1)]}else i=[...i,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:b.id,label:g,linkedToFilterId:p.id}]}}}let c={filters:i};e==="inventoryTable"&&a==="archived"&&o==="true"&&!f.showArchivedInventory&&(c.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!f.showArchivedCategories&&(c.showArchivedCategories=!0),O(c)}function we(){rt!=null&&(window.clearTimeout(rt),rt=null)}function Fa(t){const e=f.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&O({filters:ee(f.filters,a.id)})}x.addEventListener("click",async t=>{const e=ve(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(we(),t.detail>1)return;rt=window.setTimeout(()=>{rt=null,Yt(a)},220);return}Yt(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;O({filters:ee(f.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;O({filters:Ue(f.filters,o)});return}if(n==="toggle-show-archived-inventory"){O({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){O({showArchivedCategories:a.checked});return}if(n==="open-create-category"){K({kind:"categoryCreate"});return}if(n==="open-create-inventory"){K({kind:"inventoryCreate"});return}if(n==="open-settings"){K({kind:"settings"});return}if(n==="apply-report-range"){const o=x.querySelector('input[name="reportDateFrom"]'),r=x.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const s=o.value,i=r.value,l=_(s),c=_(i,!0);if(l==null||c==null||l>c){it({tone:"warning",text:"Select a valid report date range."});return}O({reportDateFrom:s,reportDateTo:i});return}if(n==="reset-report-range"){O({reportDateFrom:oe(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await he()}catch{it({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(et),s=!r.has(o);s?r.add(o):r.delete(o),et=r,wa(o,s);return}if(n==="edit-category"){const o=a.dataset.id;o&&K({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&K({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;X();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await xa(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await Ma(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await Aa(o,r);return}if(n==="download-json"){ka(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ge(),"application/json");return}if(n==="replace-import"){await Na();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Be(),await R(),it({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await je(),O({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await R();return}}});x.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(we(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){K({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&K({kind:"categoryEdit",categoryId:o})}});x.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await Ca(e);return}if(e.id==="category-form"){await Ia(e);return}if(e.id==="inventory-form"){await $a(e);return}}});x.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&qt(a)}if(e.id==="import-text"){f={...f,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?f={...f,reportDateFrom:e.value}:f={...f,reportDateTo:e.value})}});x.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(le(r),qt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&ce(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();O({importText:n})});x.addEventListener("pointermove",t=>{const e=ve(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");pt=(a==null?void 0:a.dataset.filterSectionViewId)||null});x.addEventListener("pointerleave",()=>{pt=null});document.addEventListener("keydown",t=>{if(L.kind==="none"){if(t.key!=="Escape")return;const s=t.target;if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement||s instanceof HTMLSelectElement||!pt)return;t.preventDefault(),Fa(pt);return}if(t.key==="Escape"){t.preventDefault(),X();return}if(t.key!=="Tab")return;const e=re();if(!e)return;const a=se(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});window.addEventListener("pagehide",()=>{be()});window.addEventListener("beforeunload",()=>{be()});R();
