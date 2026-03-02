(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const St=(t,e)=>e.some(a=>t instanceof a);let Ft,Pt;function ue(){return Ft||(Ft=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function pe(){return Pt||(Pt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ct=new WeakMap,ft=new WeakMap,dt=new WeakMap;function fe(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{a(z(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return dt.set(e,t),e}function me(t){if(Ct.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});Ct.set(t,e)}let kt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return Ct.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return z(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Wt(t){kt=t(kt)}function be(t){return pe().includes(t)?function(...e){return t.apply(It(this),e),z(this.request)}:function(...e){return z(t.apply(It(this),e))}}function he(t){return typeof t=="function"?be(t):(t instanceof IDBTransaction&&me(t),St(t,ue())?new Proxy(t,kt):t)}function z(t){if(t instanceof IDBRequest)return fe(t);if(ft.has(t))return ft.get(t);const e=he(t);return e!==t&&(ft.set(t,e),dt.set(e,t)),e}const It=t=>dt.get(t);function ye(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),s=z(i);return n&&i.addEventListener("upgradeneeded",l=>{n(z(i.result),l.oldVersion,l.newVersion,z(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{r&&l.addEventListener("close",()=>r()),o&&l.addEventListener("versionchange",c=>o(c.oldVersion,c.newVersion,c))}).catch(()=>{}),s}const ge=["get","getKey","getAll","getAllKeys","count"],ve=["put","add","delete","clear"],mt=new Map;function qt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(mt.get(e))return mt.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=ve.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||ge.includes(a)))return;const r=async function(i,...s){const l=this.transaction(i,o?"readwrite":"readonly");let c=l.store;return n&&(c=c.index(s.shift())),(await Promise.all([c[a](...s),o&&l.done]))[0]};return mt.set(e,r),r}Wt(t=>({...t,get:(e,a,n)=>qt(e,a)||t.get(e,a,n),has:(e,a)=>!!qt(e,a)||t.has(e,a)}));const we=["continue","continuePrimaryKey","advance"],Vt={},$t=new WeakMap,Qt=new WeakMap,Se={get(t,e){if(!we.includes(e))return t[e];let a=Vt[e];return a||(a=Vt[e]=function(...n){$t.set(this,Qt.get(this)[e](...n))}),a}};async function*Ce(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,Se);for(Qt.set(a,e),dt.set(a,It(e));e;)yield a,e=await($t.get(a)||e.continue()),$t.delete(a)}function Ot(t,e){return e===Symbol.asyncIterator&&St(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&St(t,[IDBIndex,IDBObjectStore])}Wt(t=>({...t,get(e,a,n){return Ot(e,a)?Ce:t.get(e,a,n)},has(e,a){return Ot(e,a)||t.has(e,a)}}));const E=ye("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let l=await r.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(s=t.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const l=t.createObjectStore("valuationSnapshots",{keyPath:"id"});l.createIndex("by_capturedAt","capturedAt"),l.createIndex("by_scope","scope"),l.createIndex("by_marketId","marketId"),l.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let l=await i.openCursor();for(;l;){const c=l.value;let b=!1;typeof c.active!="boolean"&&(c.active=!0,b=!0),typeof c.archived!="boolean"&&(c.archived=!1,b=!0),b&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const c=l.value;let b=!1;typeof c.active!="boolean"&&(c.active=!0,b=!0),typeof c.isArchived!="boolean"&&(c.isArchived=!1,b=!0),b&&(c.updatedAt=new Date().toISOString(),await l.update(c)),l=await l.continue()}}}});async function ke(){return(await E).getAll("inventory")}async function st(t){await(await E).put("inventory",t)}async function Tt(t){return(await E).get("inventory",t)}async function Ie(){return(await E).getAll("categories")}async function xt(t){await(await E).put("categories",t)}async function Jt(t){return(await E).get("categories",t)}async function $e(){return(await E).getAll("settings")}async function Z(t,e){await(await E).put("settings",{key:t,value:e})}async function xe(){return(await E).getAll("valuationSnapshots")}async function Ae(t){if(!t.length)return;const a=(await E).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function Me(t){const a=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function De(){const e=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Te(){const e=(await E).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function Rt(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function Ee(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Yt(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function Ne(t,e){return t.filter(a=>a.viewId!==e)}function At(t,e,a,n,o){const r=e.filter(s=>s.viewId===a);if(!r.length)return t;const i=new Map(n.map(s=>[s.key,s]));return t.filter(s=>r.every(l=>{var u;const c=i.get(l.field);if(!c)return!0;const b=c.getValue(s);if(l.op==="eq")return String(b)===l.value;if(l.op==="isEmpty")return Rt(b);if(l.op==="isNotEmpty")return!Rt(b);if(l.op==="contains")return String(b).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const f=((u=o==null?void 0:o.categoryDescendantsMap)==null?void 0:u.get(l.value))||new Set([l.value]),h=String(b);return f.has(h)}return!0}))}function Le(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function ut(t){const{children:e}=Le(t),a=new Map;function n(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const s of n(i.id))r.add(s);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function Kt(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),o.unshift(s.id),r.unshift(s.name),s=s.parentId?e.get(s.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Et(t,e){return[...ut(t).get(e)||new Set([e])]}function Fe(t,e){const a=ut(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const s of t)r.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(o.id,i)}return n}const Xt=document.querySelector("#app");if(!Xt)throw new Error("#app not found");const w=Xt;let A={kind:"none"},et=null,B=null,O=null,P=null,q=null,V=null,jt=!1,it=null,bt=!1,ht=null,at=null,lt=null,Bt=!1,Ut=!1,Y=new Set,tt=null,nt=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:Zt(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const ct="USD",H="$",rt=!1,Pe=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function D(){return new Date().toISOString()}function Zt(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function yt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function C(t){const e=K("currencySymbol")||H,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function qe(t){const e=K("currencySymbol")||H,n=Math.abs(t)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${t<0?"-":""}${e}${Math.round(o)}${r}`}function Nt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function K(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function Ve(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:rt;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function N(t){p={...p,...t},R()}function ot(t){tt!=null&&(window.clearTimeout(tt),tt=null),nt=t,R(),t&&(tt=window.setTimeout(()=>{tt=null,nt=null,R()},3500))}function U(t){A.kind==="none"&&document.activeElement instanceof HTMLElement&&(et=document.activeElement),A=t,R()}function _(){A.kind!=="none"&&(A={kind:"none"},R(),et&&et.isConnected&&et.focus(),et=null)}function te(){return w.querySelector(".modal-panel")}function ee(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function Oe(){if(A.kind==="none")return;const t=te();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(ee(t)[0]||t).focus()}function Re(){var t,e;(t=B==null?void 0:B.destroy)==null||t.call(B),(e=O==null?void 0:O.destroy)==null||e.call(O),B=null,O=null}function Mt(){var i;const t=window,e=t.DataTable,a=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!a){ht==null&&(ht=window.setTimeout(()=>{ht=null,Mt(),R()},500)),bt||(bt=!0,window.addEventListener("load",()=>{bt=!1,Mt(),R()},{once:!0}));return}const n=w.querySelector("#categories-table"),o=w.querySelector("#inventory-table"),r=(s,l)=>{var c,b;return e?new e(s,l):a?((b=(c=a(s)).DataTable)==null?void 0:b.call(c,l))??null:null};n&&(B=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(O=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),We(o,O))}function je(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function X(t,e){const a=w.querySelector(`#${t}`),n=w.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Dt(t){const e=w.querySelector(`#${t}`),a=w.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Be(){P==null||P.dispose(),q==null||q.dispose(),V==null||V.dispose(),P=null,q=null,V=null}function Ue(){jt||(jt=!0,window.addEventListener("resize",()=>{it!=null&&window.clearTimeout(it),it=window.setTimeout(()=>{it=null,P==null||P.resize(),q==null||q.resize(),V==null||V.resize()},120)}))}function ze(t){const e=G(p.reportDateFrom),a=G(p.reportDateTo,!0);if(e==null||a==null||e>a)return{labels:[],series:[],overallValues:[],showOverallComparison:!1};const n=new Set(t),o=p.filters.some(f=>f.viewId==="categoriesList"),r=new Set,i=new Map,s=new Map;for(const f of p.valuationSnapshots){const h=Date.parse(f.capturedAt);if(!(!Number.isFinite(h)||h<e||h>a)){if(f.scope==="portfolio"){r.add(f.capturedAt),s.set(f.capturedAt,f.valueCents);continue}if(!(f.scope!=="market"||!f.marketId)){if(r.add(f.capturedAt),n.has(f.marketId)){const m=`${f.marketId}::${f.capturedAt}`;i.set(m,(i.get(m)||0)+f.valueCents)}s.has(f.capturedAt)?p.valuationSnapshots.some(m=>m.scope==="portfolio"&&m.capturedAt===f.capturedAt)||s.set(f.capturedAt,(s.get(f.capturedAt)||0)+f.valueCents):s.set(f.capturedAt,f.valueCents)}}}const l=[...r].sort((f,h)=>Date.parse(f)-Date.parse(h));if(!l.length)return{labels:[],series:[],overallValues:[],showOverallComparison:o};const c=l.map(f=>{const h=new Date(f);return Number.isNaN(h.getTime())?f.slice(0,10):h.toLocaleDateString()}),b=t.map(f=>{const h=M(f);if(!h)return null;const m=h.pathNames.join(" / "),k=l.map(S=>{const v=`${f}::${S}`,L=i.get(v);return typeof L=="number"?L:null});return k.some(S=>typeof S=="number")?{marketId:f,label:m,values:k}:null}).filter(f=>f!=null),u=l.map(f=>{const h=s.get(f);return typeof h=="number"?h:null});return{labels:c,series:b,overallValues:u,showOverallComparison:o}}function Ge(t){const e="growth-trend-chart",a=w.querySelector(`#${e}`);if(!a)return;if(!window.echarts){X(e,"Chart unavailable: ECharts not loaded.");return}const n=t.overallValues.some(f=>typeof f=="number"),o=t.series.length>0;if(!t.labels.length||!n&&!o){X(e,"No snapshot trend data for this period yet.");return}Dt(e);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",s=window.matchMedia("(max-width: 767.98px)").matches?11:13,l=r?"#e9ecef":"#212529",c=r?"#ced4da":"#495057",b=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],u=t.labels.length>12?Math.ceil(t.labels.length/6):1;V=window.echarts.init(a),V.setOption({color:b,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:l,fontSize:s}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:l,fontSize:s},formatter:f=>{var m;if(!f.length)return"";const h=f.filter(k=>typeof k.value=="number").map(k=>`${d(k.seriesName||"")}: ${C(k.value)}`);return[`<strong>${d(((m=f[0])==null?void 0:m.axisValueLabel)||"")}</strong>`,...h].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:t.labels,boundaryGap:!1,axisLabel:{color:c,fontSize:s,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:f=>f%u===0||f===t.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:c}}},yAxis:{type:"value",position:"left",axisLabel:{color:c,margin:6,fontSize:s,formatter:f=>qe(f)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:t.showOverallComparison?"Overall (All Markets)":"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:t.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...t.series.map((f,h)=>({name:f.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:f.values,lineStyle:{width:h===0?2.6:2}}))]})}function He(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function _e(t){const e="markets-allocation-chart",a="markets-top-chart",n=w.querySelector(`#${e}`),o=w.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){X(e,"Chart unavailable: ECharts not loaded."),X(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){X(e,"No eligible market totals to chart."),X(a,"No eligible market totals to chart.");return}Dt(e),Dt(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=r?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],c=i?"#e9ecef":"#212529",b=i?"#ced4da":"#495057",u=t.map(g=>({name:g.label,value:g.totalCents})),f=t.slice(0,5),h=[...f].reverse(),m=f.reduce((g,S)=>Math.max(g,S.totalCents),0),k=m>0?Math.ceil(m*1.2):1;P=window.echarts.init(n),q=window.echarts.init(o),P.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:g=>`${d(g.name)}: ${C(g.value)} (${g.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:c,fontSize:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:c,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:u,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:g=>{const S=g.percent??0;return`${Math.round(S)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:b,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),q.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:g=>{const S=g[0];return S?`${d(S.name)}: ${C(S.value)}`:""}},xAxis:{type:"value",max:k,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:h.map(g=>g.label),axisLabel:{color:b,fontSize:s,formatter:g=>He(g)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:h.map(g=>g.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:c,fontSize:s,formatter:g=>C(g.value)}}]}),Ue()}function We(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var u,f,h;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),s=i.indexOf(o);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(u=e.order)==null?void 0:u.call(e),c=Array.isArray(l)?l[0]:void 0,b=c&&c[0]===s&&c[1]==="asc"?"desc":"asc";(f=e.order)==null||f.call(e,[[s,b]]),(h=e.draw)==null||h.call(e,!1)},!0)}async function T(){var s,l;const[t,e,a,n]=await Promise.all([ke(),Ie(),$e(),xe()]),o=Kt(e).sort((c,b)=>c.sortOrder-b.sortOrder||c.name.localeCompare(b.name));a.some(c=>c.key==="currencyCode")||(await Z("currencyCode",ct),a.push({key:"currencyCode",value:ct})),a.some(c=>c.key==="currencySymbol")||(await Z("currencySymbol",H),a.push({key:"currencySymbol",value:H})),a.some(c=>c.key==="darkMode")||(await Z("darkMode",rt),a.push({key:"darkMode",value:rt})),Ve(a);let r=null,i=null;try{const c=await((l=(s=navigator.storage)==null?void 0:s.estimate)==null?void 0:l.call(s));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,i=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,i=null}p={...p,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i},R()}function M(t){if(t)return p.categories.find(e=>e.id===t)}function Qe(t){const e=M(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function Je(t){return Qe(t)}function Ye(t){const e=M(t);return e?e.pathIds.some(a=>{var n;return((n=M(a))==null?void 0:n.active)===!1}):!1}function Ke(t){const e=M(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=M(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function Xe(t){return t.active&&!Ke(t)}function gt(t){return t==null?"":(t/100).toFixed(2)}function Lt(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=Nt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function ae(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=M(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function ne(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const i=e.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function J(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function Ze(t){return t.active&&!t.archived}function oe(){const t=p.inventoryRecords.filter(Ze),e=p.categories.filter(r=>!r.isArchived),a=Fe(t,e),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=n.get(r.categoryId);if(i)for(const s of i.pathIds)o.set(s,(o.get(s)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function re(t,e){const a=new Map;p.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const i=a.get(r.parentId)||[];i.push(r),a.set(r.parentId,i)});const n=new Map,o=r=>{const i=n.get(r);if(i!=null)return i;const s=M(r);if(!s||s.isArchived)return n.set(r,0),0;let l=0;return s.evaluationMode==="snapshot"?l=t.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(e.get(s.id)||0)*s.spotValueCents:l=(a.get(s.id)||[]).reduce((b,u)=>b+o(u.id),0),n.set(r,l),l};return p.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function ie(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>Je(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>C(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>C(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ta(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":C(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function se(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function ea(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function aa(){const t=ie(),e=ta(),a=e.filter(u=>u.key==="name"||u.key==="parent"||u.key==="path"),n=e.filter(u=>u.key!=="name"&&u.key!=="parent"&&u.key!=="path"),o=ut(p.categories),r=At(se(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:s}=oe(),l=re(i,s),c=[...a,{key:"computedQty",label:"Qty",getValue:u=>s.get(u.id)||0,getDisplay:u=>String(s.get(u.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:u=>i.get(u.id)||0,getDisplay:u=>C(i.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:u=>l.get(u.id)||0,getDisplay:u=>C(l.get(u.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:u=>u.active&&!u.isArchived,getDisplay:u=>u.active&&!u.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],b=At(ea(),p.filters,"categoriesList",c);return{inventoryColumns:t,categoryColumns:c,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:b,categoryTotals:i,categoryQty:s}}async function na(){const t=D(),{categoryTotals:e,categoryQty:a}=oe(),n=re(e,a),o=p.categories.filter(c=>c.active&&!c.isArchived),r=[];let i=0,s=0;for(const c of o){let b=null;const u=a.get(c.id)||0;if(c.evaluationMode==="spot"){if(c.spotValueCents==null){s+=1;continue}b=Math.round(u*c.spotValueCents)}else c.evaluationMode==="snapshot"?b=e.get(c.id)||0:b=n.get(c.id)||0;i+=b,r.push({id:crypto.randomUUID(),capturedAt:t,scope:"market",marketId:c.id,evaluationMode:c.evaluationMode,valueCents:b,quantity:c.evaluationMode==="spot"?u:void 0,source:"manual",createdAt:t,updatedAt:t})}if(!r.length){ot({tone:"warning",text:"No markets were eligible for snapshot capture."});return}r.push({id:crypto.randomUUID(),capturedAt:t,scope:"portfolio",valueCents:i,source:"manual",createdAt:t,updatedAt:t}),await Ae(r),await T();const l=s>0?` (${s} skipped)`:"";ot({tone:"success",text:`Snapshot captured ${new Date(t).toLocaleString()} • ${C(i)}${l}`})}function zt(t,e,a=""){const n=p.filters.filter(o=>o.viewId===t);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(e)} filters" style="--bs-breadcrumb-divider: '>';">
          <ol class="breadcrumb mb-0 flex-wrap align-items-center">
            ${n.map(o=>`
              <li class="breadcrumb-item">
                <button
                  type="button"
                  class="breadcrumb-filter-btn"
                  title="Remove filter: ${d(o.label)}"
                  aria-label="Remove filter: ${d(o.label)}"
                  data-action="remove-filter"
                  data-filter-id="${o.id}"
                >${d(o.label)}</button>
              </li>
            `).join("")}
          </ol>
          </nav>
        </div>
      `:'<div class="chips-list"><span class="chips-empty text-body-secondary small">No filters</span></div>'}
      ${a?`<div class="chips-clear-btn">${a}</div>`:""}
    </div>
  `}function vt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const l=String(e.categoryId),c=Ye(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}${c?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const l=e.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const l=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}</span></button>`}function oa(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function Gt(t,e){const a=t.map((n,o)=>{let r=0,i=!1;for(const l of e){const c=n.getValue(l);typeof c=="number"&&Number.isFinite(c)&&(r+=c,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?C(r):oa(r):o===0?"Totals":"";return`<th class="${J(n)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function G(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function ra(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function ia(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?ra(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Ht(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function sa(t){const e=G(p.reportDateFrom),a=G(p.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],childRowsByParent:{},startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=ia(t),o=new Map;for(const h of p.valuationSnapshots){if(h.scope!=="market"||!h.marketId)continue;const m=o.get(h.marketId)||[];m.push(h),o.set(h.marketId,m)}for(const h of o.values())h.sort((m,k)=>Date.parse(m.capturedAt)-Date.parse(k.capturedAt));const r=p.inventoryRecords.filter(h=>h.active&&!h.archived),i=[],s={};let l=0,c=0,b=0,u=0;const f=h=>{const m=M(h);if(!m)return null;const k=t.get(h)||new Set([h]),g=o.get(h)||[],S=Ht(g,e),v=Ht(g,a);let L=0;for(const j of r){if(!k.has(j.categoryId))continue;const W=G(j.purchaseDate);W!=null&&W>e&&W<=a&&(L+=j.totalPriceCents)}const F=S==null||v==null?null:v-S,pt=F==null||S==null||S<=0?null:F/S;return{marketId:h,marketLabel:m.pathNames.join(" / "),startValueCents:S,endValueCents:v,contributionsCents:L,netGrowthCents:F,growthPct:pt}};for(const h of n){const m=f(h);if(!m)continue;m.startValueCents!=null&&(l+=m.startValueCents),m.endValueCents!=null&&(c+=m.endValueCents),b+=m.contributionsCents,m.netGrowthCents!=null&&(u+=m.netGrowthCents),i.push(m);const k=p.categories.filter(g=>!g.isArchived&&g.active&&g.parentId===h).map(g=>f(g.id)).filter(g=>g!=null).sort((g,S)=>g.marketLabel.localeCompare(S.marketLabel));s[h]=k}return{scopeMarketIds:n,rows:i,childRowsByParent:s,startTotalCents:l,endTotalCents:c,contributionsTotalCents:b,netGrowthTotalCents:u}}function wt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function Q(t){return t==null||!Number.isFinite(t)||t===0?"text-body-secondary":t>0?"text-success":"text-danger"}function la(){if(A.kind==="none")return"";const t=K("currencySymbol")||H,e=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(A.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((K("currencyCode")||ct).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Pe.map(a=>`<option value="${d(a.value)}" ${(K("currencySymbol")||H)===a.value?"selected":""}>${d(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${K("darkMode")??rt?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
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
    `;if(A.kind==="categoryCreate"||A.kind==="categoryEdit"){const a=A.kind==="categoryEdit",n=A.kind==="categoryEdit"?M(A.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Et(p.categories,n.id)):void 0,r=ut(p.categories);return At(se(),p.filters,"inventoryTable",ie(),{categoryDescendantsMap:r}),`
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
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(gt(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
            <div class="modal-footer px-0 pb-0">
              ${a&&n?`<button type="button" class="btn ${n.isArchived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-category-subtree-archived" data-id="${n.id}" data-next-archived="${String(!n.isArchived)}">${n.isArchived?"Restore Record":"Archive Record"}</button>`:""}
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">${a?"Save":"Create"}</button>
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
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
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
    `;if(A.kind==="inventoryEdit"){const a=A,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${d(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${e(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${d(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${d(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(gt(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(gt(n.unitPriceCents))}" disabled />
              </div>
            </label>
            <label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" name="active" ${n.active?"checked":""} /> <span class="form-check-label">Active (counts in totals)</span></label>
            <label class="form-label mb-0">Notes (optional)<textarea class="form-control" name="notes" rows="3">${d(n.notes||"")}</textarea></label>
            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn ${n.archived?"btn-outline-success":"btn-danger archive-record-btn"} me-auto" data-action="toggle-inventory-archived" data-id="${n.id}" data-next-archived="${String(!n.archived)}">${n.archived?"Restore Record":"Archive Record"}</button>
              <button type="button" class="btn btn-secondary modal-cancel-btn" data-action="close-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    `:""}return""}function R(){const t=window.scrollX,e=window.scrollY,a=w.querySelector('details[data-section="data-tools"]');a&&(Bt=a.open);const n=w.querySelector('details[data-section="investments"]');n&&(Ut=n.open),Be(),Re();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=aa(),c=p.filters.some(y=>y.viewId==="categoriesList"),b=je(l,r,c),u=sa(i),f=ze(u.scopeMarketIds),h=new Set([...Y].filter(y=>{var $;return((($=u.childRowsByParent[y])==null?void 0:$.length)||0)>0}));h.size!==Y.size&&(Y=h);const m=u.startTotalCents>0?u.netGrowthTotalCents/u.startTotalCents:null,k=p.exportText||le(),g=s.map(y=>`
        <tr class="${[Xe(y)?"":"row-inactive",y.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${y.id}">
          ${o.map(I=>`<td class="${J(I)}">${vt("inventoryTable",y,I)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${y.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),S=new Set(l.map(y=>y.id)),v=new Map;for(const y of l){const $=y.parentId&&S.has(y.parentId)?y.parentId:null,I=v.get($)||[];I.push(y),v.set($,I)}for(const y of v.values())y.sort(($,I)=>$.sortOrder-I.sortOrder||$.name.localeCompare(I.name));const L=[],F=(y,$)=>{const I=v.get(y)||[];for(const x of I)L.push({category:x,depth:$}),F(x.id,$+1)};F(null,0);const pt=L.map(({category:y,depth:$})=>`
      <tr class="${[y.active?"":"row-inactive",y.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${y.id}">
        ${r.map(I=>{if(I.key==="name"){const x=$>0?($-1)*1.1:0;return`<td class="${J(I)}"><div class="market-name-wrap" style="padding-left:${x.toFixed(2)}rem">${$>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${vt("categoriesList",y,I)}</div></td>`}return`<td class="${J(I)}">${vt("categoriesList",y,I)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${y.id}">Edit</button>
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
        ${nt?`<div class="alert alert-${nt.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(nt.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${u.scopeMarketIds.length?`${u.scopeMarketIds.length} market${u.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${d(p.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${d(p.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          <div class="growth-widget-card card border-0 mb-2">
            <div class="card-body p-1 p-md-2">
              <div class="growth-chart-frame">
                <div id="growth-trend-chart" class="growth-chart-canvas" role="img" aria-label="Growth over time chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="growth-trend-chart" hidden></p>
              </div>
            </div>
          </div>
          ${u.rows.length===0?`
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
                  ${u.rows.map(y=>{const $=u.childRowsByParent[y.marketId]||[],I=Y.has(y.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${$.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(y.marketId)}" aria-label="${I?"Collapse":"Expand"} child markets">${I?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(y.marketLabel)}
                        </td>
                      <td class="text-end">${y.startValueCents==null?"—":d(C(y.startValueCents))}</td>
                      <td class="text-end">${y.endValueCents==null?"—":d(C(y.endValueCents))}</td>
                      <td class="text-end">${d(C(y.contributionsCents))}</td>
                      <td class="text-end ${Q(y.netGrowthCents)}">${y.netGrowthCents==null?"—":d(C(y.netGrowthCents))}</td>
                      <td class="text-end ${Q(y.growthPct)}">${d(wt(y.growthPct))}</td>
                      </tr>
                      ${$.map(x=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(y.marketId)}" ${I?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(x.marketLabel)}</td>
                              <td class="text-end">${x.startValueCents==null?"—":d(C(x.startValueCents))}</td>
                              <td class="text-end">${x.endValueCents==null?"—":d(C(x.endValueCents))}</td>
                              <td class="text-end">${d(C(x.contributionsCents))}</td>
                              <td class="text-end ${Q(x.netGrowthCents)}">${x.netGrowthCents==null?"—":d(C(x.netGrowthCents))}</td>
                              <td class="text-end ${Q(x.growthPct)}">${d(wt(x.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(C(u.startTotalCents))}</th>
                    <th class="text-end">${d(C(u.endTotalCents))}</th>
                    <th class="text-end">${d(C(u.contributionsTotalCents))}</th>
                    <th class="text-end ${Q(u.netGrowthTotalCents)}">${d(C(u.netGrowthTotalCents))}</th>
                    <th class="text-end ${Q(m)}">${d(wt(m))}</th>
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
        ${zt("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(y=>`<th class="${J(y)}">${d(y.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${pt}
            </tbody>
            ${Gt(r,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${Ut?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0 visually-hidden">Investments</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end w-100">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${zt("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(y=>`<th class="${J(y)}">${d(y.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${g}
              </tbody>
              ${Gt(o,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Bt?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?d(yt(p.storageUsageBytes)):`${d(yt(p.storageUsageBytes))} of ${d(yt(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${d(k)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${d(p.importText)}</textarea>
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
    ${la()}
  `;const j=w.querySelector("#inventory-form");j&&(ae(j),Lt(j));const W=w.querySelector("#category-form");W&&ne(W),Oe(),_e(b),Ge(f),Mt(),window.scrollTo(t,e)}function ca(t,e){const a=w.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${t}"]`);if(!a.length)return;for(const o of a)o.hidden=!e;const n=w.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${t}"]`);n&&(n.textContent=e?"▾":"▸",n.setAttribute("aria-label",`${e?"Collapse":"Expand"} child markets`))}function da(){return{schemaVersion:2,exportedAt:D(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function le(){return JSON.stringify(da(),null,2)}function ua(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function pa(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await Z("currencyCode",a),await Z("currencySymbol",n),await Z("darkMode",o),_(),await T()}async function fa(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),s=String(e.get("spotValue")||"").trim(),l=String(e.get("spotCode")||"").trim(),c=e.get("active")==="on",b=i==="spot"||i==="snapshot"?i:void 0,u=b==="spot"&&s?Nt(s):void 0,f=b==="spot"&&l?l:void 0;if(!o)return;if(b==="spot"&&s&&u==null){alert("Spot value is invalid.");return}const h=u??void 0,m=r||null;if(m&&!M(m)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const v=await Jt(n);if(!v){alert("Market not found.");return}if(m===v.id){alert("A category cannot be its own parent.");return}if(m&&Et(p.categories,v.id).includes(m)){alert("A category cannot be moved under its own subtree.");return}const L=v.parentId!==m;v.name=o,v.parentId=m,v.evaluationMode=b,v.spotValueCents=h,v.spotCode=f,v.active=c,L&&(v.sortOrder=p.categories.filter(F=>F.parentId===m&&F.id!==v.id).length),v.updatedAt=D(),await xt(v),_(),await T();return}const k=D(),g=p.categories.filter(v=>v.parentId===m).length,S={id:crypto.randomUUID(),name:o,parentId:m,pathIds:[],pathNames:[],depth:0,sortOrder:g,evaluationMode:b,spotValueCents:h,spotCode:f,active:c,isArchived:!1,createdAt:k,updatedAt:k};await xt(S),_(),await T()}async function ma(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),s=Nt(String(e.get("totalPrice")||"")),l=String(e.get("categoryId")||""),c=e.get("active")==="on",b=String(e.get("notes")||"").trim();if(!o||!r||!l){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(!M(l)){alert("Select a valid category.");return}const u=Math.round(s/i);if(a==="edit"){if(!n)return;const m=await Tt(n);if(!m){alert("Inventory record not found.");return}m.purchaseDate=o,m.productName=r,m.quantity=i,m.totalPriceCents=s,m.unitPriceCents=u,m.unitPriceSource="derived",m.categoryId=l,m.active=c,m.notes=b||void 0,m.updatedAt=D(),await st(m),_(),await T();return}const f=D(),h={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:s,unitPriceCents:u,unitPriceSource:"derived",categoryId:l,active:c,archived:!1,notes:b||void 0,createdAt:f,updatedAt:f};await st(h),_(),await T()}async function ba(t,e){const a=await Tt(t);a&&(a.active=e,a.updatedAt=D(),await st(a),await T())}async function ha(t,e){const a=await Tt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?D():void 0,a.updatedAt=D(),await st(a),await T()))}async function ya(t,e){const a=M(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Et(p.categories,t),o=D();for(const r of n){const i=await Jt(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await xt(i))}await T()}function ga(t){const e=D();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function va(t){const e=D(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function wa(t){const e=D(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function Sa(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Kt(e.categories.map(ga)),n=new Set(a.map(l=>l.id)),o=e.purchases.map(va);for(const l of o)if(!n.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:ct},{key:"currencySymbol",value:H},{key:"darkMode",value:rt}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(wa):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Me({purchases:o,categories:a,settings:r,valuationSnapshots:i}),N({importText:""}),await T()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ce(t){return t.target instanceof HTMLElement?t.target:null}function _t(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const i=(b,u)=>b.viewId===u.viewId&&b.field===u.field&&b.op===u.op&&b.value===u.value;let s=Ee(p.filters,{viewId:e,field:a,op:n,value:o,label:r});const l=t.dataset.crossInventoryCategoryId;if(l){const b=M(l);if(b){const u=s.find(f=>i(f,{viewId:e,field:a,op:n,value:o}));if(u){const f=`Market: ${b.pathNames.join(" / ")}`;s=s.filter(m=>m.linkedToFilterId!==u.id);const h=s.findIndex(m=>i(m,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:b.id}));if(h>=0){const m=s[h];s=[...s.slice(0,h),{...m,label:f,linkedToFilterId:u.id},...s.slice(h+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:b.id,label:f,linkedToFilterId:u.id}]}}}let c={filters:s};e==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(c.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(c.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(c.showArchivedCategories=!0),N(c)}function de(){at!=null&&(window.clearTimeout(at),at=null)}function Ca(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&N({filters:Yt(p.filters,a.id)})}w.addEventListener("click",async t=>{const e=ce(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(de(),t.detail>1)return;at=window.setTimeout(()=>{at=null,_t(a)},220);return}_t(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;N({filters:Yt(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;N({filters:Ne(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){N({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){N({showArchivedCategories:a.checked});return}if(n==="open-create-category"){U({kind:"categoryCreate"});return}if(n==="open-create-inventory"){U({kind:"inventoryCreate"});return}if(n==="open-settings"){U({kind:"settings"});return}if(n==="apply-report-range"){const o=w.querySelector('input[name="reportDateFrom"]'),r=w.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,s=r.value,l=G(i),c=G(s,!0);if(l==null||c==null||l>c){ot({tone:"warning",text:"Select a valid report date range."});return}N({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){N({reportDateFrom:Zt(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await na()}catch{ot({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(Y),i=!r.has(o);i?r.add(o):r.delete(o),Y=r,ca(o,i);return}if(n==="edit-category"){const o=a.dataset.id;o&&U({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&U({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;_();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await ba(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await ha(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await ya(o,r);return}if(n==="download-json"){ua(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,le(),"application/json");return}if(n==="replace-import"){await Sa();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Te(),await T(),ot({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await De(),N({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await T();return}}});w.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(de(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){U({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&U({kind:"categoryEdit",categoryId:o})}});w.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await pa(e);return}if(e.id==="category-form"){await fa(e);return}if(e.id==="inventory-form"){await ma(e);return}}});w.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Lt(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});w.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(ae(r),Lt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&ne(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();N({importText:n})});w.addEventListener("pointermove",t=>{const e=ce(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");lt=(a==null?void 0:a.dataset.filterSectionViewId)||null});w.addEventListener("pointerleave",()=>{lt=null});document.addEventListener("keydown",t=>{if(A.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!lt)return;t.preventDefault(),Ca(lt);return}if(t.key==="Escape"){t.preventDefault(),_();return}if(t.key!=="Tab")return;const e=te();if(!e)return;const a=ee(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});T();
