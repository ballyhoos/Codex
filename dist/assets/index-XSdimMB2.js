(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const Ct=(t,e)=>e.some(a=>t instanceof a);let Rt,Ot;function we(){return Rt||(Rt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Se(){return Ot||(Ot=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const It=new WeakMap,mt=new WeakMap,ft=new WeakMap;function Ce(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",s)},r=()=>{a(_(t.result)),o()},s=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",s)});return ft.set(e,t),e}function Ie(t){if(It.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",s),t.removeEventListener("abort",s)},r=()=>{a(),o()},s=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",s),t.addEventListener("abort",s)});It.set(t,e)}let kt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return It.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return _(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Yt(t){kt=t(kt)}function ke(t){return Se().includes(t)?function(...e){return t.apply($t(this),e),_(this.request)}:function(...e){return _(t.apply($t(this),e))}}function $e(t){return typeof t=="function"?ke(t):(t instanceof IDBTransaction&&Ie(t),Ct(t,we())?new Proxy(t,kt):t)}function _(t){if(t instanceof IDBRequest)return Ce(t);if(mt.has(t))return mt.get(t);const e=$e(t);return e!==t&&(mt.set(t,e),ft.set(e,t)),e}const $t=t=>ft.get(t);function xe(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const s=indexedDB.open(t,e),i=_(s);return n&&s.addEventListener("upgradeneeded",l=>{n(_(s.result),l.oldVersion,l.newVersion,_(s.transaction),l)}),a&&s.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),i.then(l=>{r&&l.addEventListener("close",()=>r()),o&&l.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),i}const Ae=["get","getKey","getAll","getAllKeys","count"],De=["put","add","delete","clear"],bt=new Map;function jt(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(bt.get(e))return bt.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=De.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||Ae.includes(a)))return;const r=async function(s,...i){const l=this.transaction(s,o?"readwrite":"readonly");let d=l.store;return n&&(d=d.index(i.shift())),(await Promise.all([d[a](...i),o&&l.done]))[0]};return bt.set(e,r),r}Yt(t=>({...t,get:(e,a,n)=>jt(e,a)||t.get(e,a,n),has:(e,a)=>!!jt(e,a)||t.has(e,a)}));const Me=["continue","continuePrimaryKey","advance"],Bt={},xt=new WeakMap,Zt=new WeakMap,Te={get(t,e){if(!Me.includes(e))return t[e];let a=Bt[e];return a||(a=Bt[e]=function(...n){xt.set(this,Zt.get(this)[e](...n))}),a}};async function*Ee(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,Te);for(Zt.set(a,e),ft.set(a,$t(e));e;)yield a,e=await(xt.get(a)||e.continue()),xt.delete(a)}function Ut(t,e){return e===Symbol.asyncIterator&&Ct(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&Ct(t,[IDBIndex,IDBObjectStore])}Yt(t=>({...t,get(e,a,n){return Ut(e,a)?Ee:t.get(e,a,n)},has(e,a){return Ut(e,a)||t.has(e,a)}}));const V=xe("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let s=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(s=t.createObjectStore("inventory",{keyPath:"id"}),s.createIndex("by_purchaseDate","purchaseDate"),s.createIndex("by_productName","productName"),s.createIndex("by_categoryId","categoryId"),s.createIndex("by_active","active"),s.createIndex("by_archived","archived"),s.createIndex("by_updatedAt","updatedAt")),s&&r){let l=await r.openCursor();for(;l;)await s.put(l.value),l=await l.continue()}let i=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(i=t.createObjectStore("categories",{keyPath:"id"}),i.createIndex("by_parentId","parentId"),i.createIndex("by_name","name"),i.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const l=t.createObjectStore("valuationSnapshots",{keyPath:"id"});l.createIndex("by_capturedAt","capturedAt"),l.createIndex("by_scope","scope"),l.createIndex("by_marketId","marketId"),l.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(s){let l=await s.openCursor();for(;l;){const d=l.value;let y=!1;typeof d.active!="boolean"&&(d.active=!0,y=!0),typeof d.archived!="boolean"&&(d.archived=!1,y=!0),y&&(d.updatedAt=new Date().toISOString(),await l.update(d)),l=await l.continue()}}if(i){let l=await i.openCursor();for(;l;){const d=l.value;let y=!1;typeof d.active!="boolean"&&(d.active=!0,y=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,y=!0),y&&(d.updatedAt=new Date().toISOString(),await l.update(d)),l=await l.continue()}}}});async function Ne(){return(await V).getAll("inventory")}async function dt(t){await(await V).put("inventory",t)}async function Nt(t){return(await V).get("inventory",t)}async function Fe(){return(await V).getAll("categories")}async function At(t){await(await V).put("categories",t)}async function Xt(t){return(await V).get("categories",t)}async function Le(){return(await V).getAll("settings")}async function et(t,e){await(await V).put("settings",{key:t,value:e})}async function Pe(){return(await V).getAll("valuationSnapshots")}async function Ve(t){if(!t.length)return;const a=(await V).transaction("valuationSnapshots","readwrite");for(const n of t)await a.store.put(n);await a.done}async function qe(t){const a=(await V).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Re(){const e=(await V).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Oe(){const e=(await V).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function Gt(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function je(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function te(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function Be(t,e){return t.filter(a=>a.viewId!==e)}function Dt(t,e,a,n,o){const r=e.filter(i=>i.viewId===a);if(!r.length)return t;const s=new Map(n.map(i=>[i.key,i]));return t.filter(i=>r.every(l=>{var p;const d=s.get(l.field);if(!d)return!0;const y=d.getValue(i);if(l.op==="eq")return String(y)===l.value;if(l.op==="isEmpty")return Gt(y);if(l.op==="isNotEmpty")return!Gt(y);if(l.op==="contains")return String(y).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const v=((p=o==null?void 0:o.categoryDescendantsMap)==null?void 0:p.get(l.value))||new Set([l.value]),w=String(y);return v.has(w)}return!0}))}function Ue(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function lt(t){const{children:e}=Ue(t),a=new Map;function n(o){const r=new Set([o]);for(const s of e.get(o)||[])for(const i of n(s.id))r.add(i);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function ee(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],s=new Set;let i=n;for(;i&&!s.has(i.id);)s.add(i.id),o.unshift(i.id),r.unshift(i.name),i=i.parentId?e.get(i.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Ft(t,e){return[...lt(t).get(e)||new Set([e])]}function Ge(t,e){const a=lt(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let s=0;for(const i of t)r.has(i.categoryId)&&(s+=i.totalPriceCents);n.set(o.id,s)}return n}const ae=document.querySelector("#app");if(!ae)throw new Error("#app not found");const x=ae;let N={kind:"none"},nt=null,z=null,U=null,R=null,O=null,j=null,zt=!1,ct=null,ht=!1,yt=null,ot=null,ut=null,Ht=!1,_t=!1,Z=new Set,Wt=!1,at=null,rt=null,f={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:ne(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const pt="USD",W="$",it=!1,ze=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function L(){return new Date().toISOString()}function ne(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function gt(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function D(t){const e=X("currencySymbol")||W,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function He(t){const e=X("currencySymbol")||W,n=Math.abs(t)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${t<0?"-":""}${e}${Math.round(o)}${r}`}function Lt(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function X(t){var e;return(e=f.settings.find(a=>a.key===t))==null?void 0:e.value}function _e(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:it;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function q(t){f={...f,...t},G()}function st(t){at!=null&&(window.clearTimeout(at),at=null),rt=t,G(),t&&(at=window.setTimeout(()=>{at=null,rt=null,G()},3500))}function H(t){N.kind==="none"&&document.activeElement instanceof HTMLElement&&(nt=document.activeElement),N=t,G()}function Q(){N.kind!=="none"&&(N={kind:"none"},G(),nt&&nt.isConnected&&nt.focus(),nt=null)}function oe(){return x.querySelector(".modal-panel")}function re(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function We(){if(N.kind==="none")return;const t=oe();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(re(t)[0]||t).focus()}function Qe(){var t,e;(t=z==null?void 0:z.destroy)==null||t.call(z),(e=U==null?void 0:U.destroy)==null||e.call(U),z=null,U=null}function Mt(){var s;const t=window,e=t.DataTable,a=t.jQuery&&((s=t.jQuery.fn)!=null&&s.DataTable)?t.jQuery:void 0;if(!e&&!a){yt==null&&(yt=window.setTimeout(()=>{yt=null,Mt(),G()},500)),ht||(ht=!0,window.addEventListener("load",()=>{ht=!1,Mt(),G()},{once:!0}));return}const n=x.querySelector("#categories-table"),o=x.querySelector("#inventory-table"),r=(i,l)=>{var d,y;return e?new e(i,l):a?((y=(d=a(i)).DataTable)==null?void 0:y.call(d,l))??null:null};n&&(z=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(U=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),na(o,U))}function Je(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const s=n.getValue(r);return typeof s!="number"||!Number.isFinite(s)||s<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:s}}).filter(r=>r!=null).sort((r,s)=>s.totalCents-r.totalCents):[]}function tt(t,e){const a=x.querySelector(`#${t}`),n=x.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function Tt(t){const e=x.querySelector(`#${t}`),a=x.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Ke(){R==null||R.dispose(),O==null||O.dispose(),j==null||j.dispose(),R=null,O=null,j=null}function Ye(){zt||(zt=!0,window.addEventListener("resize",()=>{ct!=null&&window.clearTimeout(ct),ct=window.setTimeout(()=>{ct=null,R==null||R.resize(),O==null||O.resize(),j==null||j.resize()},120)}))}function se(t){const e=Date.parse(t);return Number.isFinite(e)?new Date(e).toISOString().slice(0,10):null}function Ze(t){const e=new Map;for(const a of t){const n=se(a.capturedAt);if(!n)continue;const r=`${a.scope==="portfolio"?"portfolio":`market:${a.marketId||""}`}::${n}`,s=e.get(r);(!s||Date.parse(a.capturedAt)>Date.parse(s.capturedAt))&&e.set(r,a)}return[...e.values()]}function Xe(t){const e=B(f.reportDateFrom),a=B(f.reportDateTo,!0);if(e==null||a==null||e>a)return{labels:[],series:[],overallValues:[],showOverallComparison:!1};const n=Ze(f.valuationSnapshots);new Set(t);const o=f.filters.some(h=>h.viewId==="categoriesList"),r=new Set,s=new Map,i=f.categories.filter(h=>h.active&&!h.isArchived),l=new Map;for(const h of i){if(!h.parentId)continue;const c=l.get(h.parentId)||[];c.push(h.id),l.set(h.parentId,c)}for(const h of l.values())h.sort();for(const h of n){const c=Date.parse(h.capturedAt);if(!Number.isFinite(c)||c<e||c>a)continue;const b=se(h.capturedAt);if(!b||h.scope!=="market"||!h.marketId)continue;r.add(b);const I=s.get(h.marketId)||[];I.push(h),s.set(h.marketId,I)}for(const h of s.values())h.sort((c,b)=>Date.parse(c.capturedAt)-Date.parse(b.capturedAt));const d=[...r].sort();if(!d.length)return{labels:[],series:[],overallValues:[],showOverallComparison:o};const y=d.map(h=>{const c=new Date(`${h}T00:00:00.000Z`);return Number.isNaN(c.getTime())?h:c.toLocaleDateString()}),p=new Map,v=(h,c)=>{const b=`${h}::${c}`;if(p.has(b))return p.get(b)??null;const I=l.get(h)||[];if(I.length>0){let T=0,E=!1;for(const C of I){const k=v(C,c);k!=null&&(T+=k,E=!0)}const m=E?T:null;return p.set(b,m),m}const M=s.get(h)||[],$=Et(M,c);return p.set(b,$),$},w=t.map(h=>{const c=F(h);if(!c)return null;const b=c.pathNames.join(" / "),I=d.map($=>{const T=B($,!0);return T==null?null:v(h,T)});return I.some($=>typeof $=="number")?{marketId:h,label:b,values:I}:null}).filter(h=>h!=null),g=f.categories.filter(h=>h.active&&!h.isArchived&&h.parentId==null).map(h=>h.id),A=d.map(h=>{const c=B(h,!0);if(c==null)return null;let b=0,I=!1;for(const M of g){const $=v(M,c);$!=null&&(b+=$,I=!0)}return I?b:null});return{labels:y,series:w,overallValues:A,showOverallComparison:o}}function ta(t){const e="growth-trend-chart",a=x.querySelector(`#${e}`);if(!a)return;if(!window.echarts){tt(e,"Chart unavailable: ECharts not loaded.");return}const n=t.overallValues.some(v=>typeof v=="number"),o=t.series.length>0;if(!t.labels.length||!n&&!o){tt(e,"No snapshot trend data for this period yet.");return}Tt(e);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",i=window.matchMedia("(max-width: 767.98px)").matches?11:13,l=r?"#e9ecef":"#212529",d=r?"#ced4da":"#495057",y=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],p=t.labels.length>12?Math.ceil(t.labels.length/6):1;j=window.echarts.init(a),j.setOption({color:y,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:l,fontSize:i}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:l,fontSize:i},formatter:v=>{var g;if(!v.length)return"";const w=v.filter(A=>typeof A.value=="number").map(A=>`${u(A.seriesName||"")}: ${D(A.value)}`);return[`<strong>${u(((g=v[0])==null?void 0:g.axisValueLabel)||"")}</strong>`,...w].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:t.labels,boundaryGap:!1,axisLabel:{color:d,fontSize:i,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:v=>v%p===0||v===t.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:d}}},yAxis:{type:"value",position:"left",axisLabel:{color:d,margin:6,fontSize:i,formatter:v=>He(v)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:t.showOverallComparison?"Overall (All Markets)":"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:t.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...t.series.map((v,w)=>({name:v.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:v.values,lineStyle:{width:w===0?2.6:2}}))]})}function ea(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function aa(t){const e="markets-allocation-chart",a="markets-top-chart",n=x.querySelector(`#${e}`),o=x.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){tt(e,"Chart unavailable: ECharts not loaded."),tt(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){tt(e,"No eligible market totals to chart."),tt(a,"No eligible market totals to chart.");return}Tt(e),Tt(a);const r=window.matchMedia("(max-width: 767.98px)").matches,s=document.documentElement.getAttribute("data-bs-theme")==="dark",i=r?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],d=s?"#e9ecef":"#212529",y=s?"#ced4da":"#495057",p=t.map(h=>({name:h.label,value:h.totalCents})),v=t.slice(0,5),w=[...v].reverse(),g=v.reduce((h,c)=>Math.max(h,c.totalCents),0),A=g>0?Math.ceil(g*1.2):1;R=window.echarts.init(n),O=window.echarts.init(o),R.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:i},formatter:h=>`${u(h.name)}: ${D(h.value)} (${h.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:d,fontSize:i}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:d,fontSize:i}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:p,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:i,textBorderWidth:0,formatter:h=>{const c=h.percent??0;return`${Math.round(c)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:y,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),O.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:i},formatter:h=>{const c=h[0];return c?`${u(c.name)}: ${D(c.value)}`:""}},xAxis:{type:"value",max:A,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:w.map(h=>h.label),axisLabel:{color:y,fontSize:i,formatter:h=>ea(h)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:w.map(h=>h.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:d,fontSize:i,formatter:h=>D(h.value)}}]}),Ye()}function na(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var p,v,w;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const s=Array.from(r.querySelectorAll("th")),i=s.indexOf(o);if(i<0||i===s.length-1)return;a.preventDefault(),a.stopPropagation();const l=(p=e.order)==null?void 0:p.call(e),d=Array.isArray(l)?l[0]:void 0,y=d&&d[0]===i&&d[1]==="asc"?"desc":"asc";(v=e.order)==null||v.call(e,[[i,y]]),(w=e.draw)==null||w.call(e,!1)},!0)}async function P(){var i,l;const[t,e,a,n]=await Promise.all([Ne(),Fe(),Le(),Pe()]),o=ee(e).sort((d,y)=>d.sortOrder-y.sortOrder||d.name.localeCompare(y.name));a.some(d=>d.key==="currencyCode")||(await et("currencyCode",pt),a.push({key:"currencyCode",value:pt})),a.some(d=>d.key==="currencySymbol")||(await et("currencySymbol",W),a.push({key:"currencySymbol",value:W})),a.some(d=>d.key==="darkMode")||(await et("darkMode",it),a.push({key:"darkMode",value:it})),_e(a);let r=null,s=null;try{const d=await((l=(i=navigator.storage)==null?void 0:i.estimate)==null?void 0:l.call(i));r=typeof(d==null?void 0:d.usage)=="number"?d.usage:null,s=typeof(d==null?void 0:d.quota)=="number"?d.quota:null}catch{r=null,s=null}f={...f,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:s},G()}function F(t){if(t)return f.categories.find(e=>e.id===t)}function oa(t){const e=F(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function ra(t){return oa(t)}function sa(t){const e=F(t);return e?e.pathIds.some(a=>{var n;return((n=F(a))==null?void 0:n.active)===!1}):!1}function ia(t){const e=F(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=F(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function la(t){return t.active&&!ia(t)}function vt(t){return t==null?"":(t/100).toFixed(2)}function Pt(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=Lt(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function ie(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=F(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function le(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const s=e.value==="spot";a.hidden=!s,n.disabled=!s,o.hidden=!s,r.disabled=!s}function Y(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function ce(t){return t.active&&!t.archived}function de(){const t=f.inventoryRecords.filter(ce),e=f.categories.filter(r=>!r.isArchived),a=Ge(t,e),n=new Map(f.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const s=n.get(r.categoryId);if(s)for(const i of s.pathIds)o.set(i,(o.get(i)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function ue(t,e){const a=new Map;f.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const s=a.get(r.parentId)||[];s.push(r),a.set(r.parentId,s)});const n=new Map,o=r=>{const s=n.get(r);if(s!=null)return s;const i=F(r);if(!i||i.isArchived)return n.set(r,0),0;let l=0;return i.evaluationMode==="snapshot"?l=t.get(i.id)||0:i.evaluationMode==="spot"&&i.spotValueCents!=null?l=(e.get(i.id)||0)*i.spotValueCents:l=(a.get(i.id)||[]).reduce((y,p)=>y+o(p.id),0),n.set(r,l),l};return f.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function pe(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>ra(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>D(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>D(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ca(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":D(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function fe(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(t=>!t.archived)}function da(){return f.showArchivedCategories?f.categories:f.categories.filter(t=>!t.isArchived)}function ua(){const t=pe(),e=ca(),a=e.filter(p=>p.key==="name"||p.key==="parent"||p.key==="path"),n=e.filter(p=>p.key!=="name"&&p.key!=="parent"&&p.key!=="path"),o=lt(f.categories),r=Dt(fe(),f.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:s,categoryQty:i}=de(),l=ue(s,i),d=[...a,{key:"computedQty",label:"Qty",getValue:p=>i.get(p.id)||0,getDisplay:p=>String(i.get(p.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:p=>s.get(p.id)||0,getDisplay:p=>D(s.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:p=>l.get(p.id)||0,getDisplay:p=>D(l.get(p.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:p=>p.active&&!p.isArchived,getDisplay:p=>p.active&&!p.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],y=Dt(da(),f.filters,"categoriesList",d);return{inventoryColumns:t,categoryColumns:d,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:y,categoryTotals:s,categoryQty:i}}async function me(t){const e=(t==null?void 0:t.source)??"manual",a=(t==null?void 0:t.silent)??!1,n=(t==null?void 0:t.skipReload)??!1,o=L(),{categoryTotals:r,categoryQty:s}=de(),i=ue(r,s),l=f.categories.filter(c=>c.active&&!c.isArchived),d=lt(f.categories),y=f.inventoryRecords.filter(ce),p=new Set(f.valuationSnapshots.filter(c=>c.scope==="market"&&!!c.marketId).map(c=>c.marketId)),v=f.valuationSnapshots.some(c=>c.scope==="portfolio"),w=[];let g=0,A=0;for(const c of l){let b=null;const I=d.get(c.id)||new Set([c.id]);let M=s.get(c.id)||0;const $=!p.has(c.id);let T=o,E=null;if($){for(const m of y){if(!I.has(m.categoryId))continue;const C=m.purchaseDate;/^\d{4}-\d{2}-\d{2}$/.test(C)&&(!E||C<E)&&(E=C)}E&&(T=`${E}T00:00:00.000Z`)}if(c.evaluationMode==="spot"){if(c.spotValueCents==null){A+=1;continue}$&&E&&(M=y.filter(m=>I.has(m.categoryId)&&/^\d{4}-\d{2}-\d{2}$/.test(m.purchaseDate)&&m.purchaseDate<=E).reduce((m,C)=>m+C.quantity,0)),b=Math.round(M*c.spotValueCents)}else c.evaluationMode==="snapshot"?$&&E?b=y.filter(m=>I.has(m.categoryId)&&/^\d{4}-\d{2}-\d{2}$/.test(m.purchaseDate)&&m.purchaseDate<=E).reduce((m,C)=>m+C.totalPriceCents,0):b=r.get(c.id)||0:b=i.get(c.id)||0;g+=b,w.push({id:crypto.randomUUID(),capturedAt:T,scope:"market",marketId:c.id,evaluationMode:c.evaluationMode,valueCents:b,quantity:c.evaluationMode==="spot"?M:void 0,source:e,createdAt:o,updatedAt:o})}if(!w.length){a||st({tone:"warning",text:"No markets were eligible for snapshot capture."});return}const h=!v&&w.length?w.map(c=>c.capturedAt).reduce((c,b)=>Date.parse(b)<Date.parse(c)?b:c):o;if(w.push({id:crypto.randomUUID(),capturedAt:h,scope:"portfolio",valueCents:g,source:e,createdAt:o,updatedAt:o}),await Ve(w),n||await P(),!a){const c=A>0?` (${A} skipped)`:"";st({tone:"success",text:`Snapshot captured ${new Date(o).toLocaleString()} • ${D(g)}${c}`})}}function be(){Wt||(Wt=!0,me({source:"derived",silent:!0,skipReload:!0}).catch(()=>{}))}function Qt(t,e,a=""){const n=f.filters.filter(o=>o.viewId===t);return`
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
  `}function wt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),s=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const l=String(e.categoryId),d=sa(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const l=e.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const l=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(l)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${s} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function pa(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function Jt(t,e){const a=t.map((n,o)=>{let r=0,s=!1;for(const l of e){const d=n.getValue(l);typeof d=="number"&&Number.isFinite(d)&&(r+=d,s=!0)}const i=s?String(n.key).toLowerCase().includes("cents")?D(r):pa(r):o===0?"Totals":"";return`<th class="${Y(n)}">${u(i)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function B(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function fa(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const s=e.get(r);if(s!=null&&s.has(o))return!1}return!0})}function ma(t){const e=new Set(f.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(f.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?fa(a,t):f.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function Et(t,e){if(!t.length)return null;let a=null;for(const n of t){const o=Date.parse(n.capturedAt);if(Number.isFinite(o)){if(o<=e){a=n;continue}return a?a.valueCents:n.valueCents}}return a?a.valueCents:null}function ba(t){const e=B(f.reportDateFrom),a=B(f.reportDateTo,!0);if(e==null||a==null||e>a)return{scopeMarketIds:[],rows:[],childRowsByParent:{},startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0};const n=ma(t),o=new Map;for(const c of f.valuationSnapshots){if(c.scope!=="market"||!c.marketId)continue;const b=o.get(c.marketId)||[];b.push(c),o.set(c.marketId,b)}for(const c of o.values())c.sort((b,I)=>Date.parse(b.capturedAt)-Date.parse(I.capturedAt));const r=f.inventoryRecords.filter(c=>c.active&&!c.archived),s=[],i={},l=f.categories.filter(c=>!c.isArchived&&c.active),d=new Map;for(const c of l){if(!c.parentId)continue;const b=d.get(c.parentId)||[];b.push(c),d.set(c.parentId,b)}for(const c of d.values())c.sort((b,I)=>b.name.localeCompare(I.name));let y=0,p=0,v=0,w=0;const g=c=>{const b=F(c);if(!b)return null;const I=t.get(c)||new Set([c]),M=o.get(c)||[],$=Et(M,e),T=Et(M,a);let E=0;for(const k of r){if(!I.has(k.categoryId))continue;const S=B(k.purchaseDate);S!=null&&S>e&&S<=a&&(E+=k.totalPriceCents)}const m=$==null||T==null?null:T-$,C=m==null||$==null||$<=0?null:m/$;return{marketId:c,marketLabel:b.pathNames.join(" / "),startValueCents:$,endValueCents:T,contributionsCents:E,netGrowthCents:m,growthPct:C}},A=new Map,h=c=>{if(A.has(c))return A.get(c)||null;const b=g(c);if(!b)return A.set(c,null),null;const I=(d.get(c)||[]).map(S=>h(S.id)).filter(S=>S!=null).sort((S,J)=>S.marketLabel.localeCompare(J.marketLabel));if(i[c]=I,!I.length)return A.set(c,b),b;const M=S=>{let J=0,Vt=!1;for(const ve of I){const qt=S(ve);qt!=null&&(J+=qt,Vt=!0)}return Vt?J:null},$=M(S=>S.startValueCents),T=M(S=>S.endValueCents),E=I.reduce((S,J)=>S+J.contributionsCents,0),m=$==null||T==null?null:T-$,C=m==null||$==null||$<=0?null:m/$,k={...b,startValueCents:$,endValueCents:T,contributionsCents:E,netGrowthCents:m,growthPct:C};return A.set(c,k),k};for(const c of n){const b=h(c);b&&(b.startValueCents!=null&&(y+=b.startValueCents),b.endValueCents!=null&&(p+=b.endValueCents),v+=b.contributionsCents,b.netGrowthCents!=null&&(w+=b.netGrowthCents),s.push(b))}return{scopeMarketIds:n,rows:s,childRowsByParent:i,startTotalCents:y,endTotalCents:p,contributionsTotalCents:v,netGrowthTotalCents:w}}function St(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function K(t){return t==null||!Number.isFinite(t)||t===0?"text-body-secondary":t>0?"text-success":"text-danger"}function ha(){if(N.kind==="none")return"";const t=X("currencySymbol")||W,e=(a,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if(N.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((X("currencyCode")||pt).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${ze.map(a=>`<option value="${u(a.value)}" ${(X("currencySymbol")||W)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${X("darkMode")??it?"checked":""} />
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
    `;if(N.kind==="categoryCreate"||N.kind==="categoryEdit"){const a=N.kind==="categoryEdit",n=N.kind==="categoryEdit"?F(N.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Ft(f.categories,n.id)):void 0,r=lt(f.categories);return Dt(fe(),f.filters,"inventoryTable",pe(),{categoryDescendantsMap:r}),`
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(vt(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if(N.kind==="inventoryCreate")return`
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
    `;if(N.kind==="inventoryEdit"){const a=N,n=f.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(vt(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(vt(n.unitPriceCents))}" disabled />
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
    `:""}return""}function G(){const t=window.scrollX,e=window.scrollY,a=x.querySelector('details[data-section="data-tools"]');a&&(Ht=a.open);const n=x.querySelector('details[data-section="investments"]');n&&(_t=n.open),Ke(),Qe();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:s,filteredInventoryRecords:i,filteredCategories:l}=ua(),d=f.filters.some(m=>m.viewId==="categoriesList"),y=Je(l,r,d),p=ba(s),v=Xe(p.scopeMarketIds),w=new Set([...Z].filter(m=>{var C;return(((C=p.childRowsByParent[m])==null?void 0:C.length)||0)>0}));w.size!==Z.size&&(Z=w);const g=p.startTotalCents>0?p.netGrowthTotalCents/p.startTotalCents:null,A=f.exportText||he(),h=i.map(m=>`
        <tr class="${[la(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${o.map(k=>`<td class="${Y(k)}">${wt("inventoryTable",m,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),c=new Set(l.map(m=>m.id)),b=new Map;for(const m of l){const C=m.parentId&&c.has(m.parentId)?m.parentId:null,k=b.get(C)||[];k.push(m),b.set(C,k)}for(const m of b.values())m.sort((C,k)=>C.sortOrder-k.sortOrder||C.name.localeCompare(k.name));const I=[],M=(m,C)=>{const k=b.get(m)||[];for(const S of k)I.push({category:S,depth:C}),M(S.id,C+1)};M(null,0);const $=I.map(({category:m,depth:C})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${r.map(k=>{if(k.key==="name"){const S=C>0?(C-1)*1.1:0;return`<td class="${Y(k)}"><div class="market-name-wrap" style="padding-left:${S.toFixed(2)}rem">${C>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${wt("categoriesList",m,k)}</div></td>`}return`<td class="${Y(k)}">${wt("categoriesList",m,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
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
        ${rt?`<div class="alert alert-${rt.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(rt.text)}</div>`:""}
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
          <div class="growth-widget-card card border-0 mb-2">
            <div class="card-body p-1 p-md-2">
              <div class="growth-chart-frame">
                <div id="growth-trend-chart" class="growth-chart-canvas" role="img" aria-label="Growth over time chart"></div>
                <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="growth-trend-chart" hidden></p>
              </div>
            </div>
          </div>
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
                  ${p.rows.map(m=>{const C=p.childRowsByParent[m.marketId]||[],k=Z.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${C.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${u(m.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${u(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":u(D(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":u(D(m.endValueCents))}</td>
                      <td class="text-end">${u(D(m.contributionsCents))}</td>
                      <td class="text-end ${K(m.netGrowthCents)}">${m.netGrowthCents==null?"—":u(D(m.netGrowthCents))}</td>
                      <td class="text-end ${K(m.growthPct)}">${u(St(m.growthPct))}</td>
                      </tr>
                      ${C.map(S=>`
                            <tr class="growth-child-row" data-parent-market-id="${u(m.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${u(S.marketLabel)}</td>
                              <td class="text-end">${S.startValueCents==null?"—":u(D(S.startValueCents))}</td>
                              <td class="text-end">${S.endValueCents==null?"—":u(D(S.endValueCents))}</td>
                              <td class="text-end">${u(D(S.contributionsCents))}</td>
                              <td class="text-end ${K(S.netGrowthCents)}">${S.netGrowthCents==null?"—":u(D(S.netGrowthCents))}</td>
                              <td class="text-end ${K(S.growthPct)}">${u(St(S.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(D(p.startTotalCents))}</th>
                    <th class="text-end">${u(D(p.endTotalCents))}</th>
                    <th class="text-end">${u(D(p.contributionsTotalCents))}</th>
                    <th class="text-end ${K(p.netGrowthTotalCents)}">${u(D(p.netGrowthTotalCents))}</th>
                    <th class="text-end ${K(g)}">${u(St(g))}</th>
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
        ${Qt("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${f.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(m=>`<th class="${Y(m)}">${u(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${$}
            </tbody>
            ${Jt(r,l)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${_t?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0 visually-hidden">Investments</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap justify-content-end w-100">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Qt("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${f.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(m=>`<th class="${Y(m)}">${u(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${h}
              </tbody>
              ${Jt(o,i)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Ht?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?u(gt(f.storageUsageBytes)):`${u(gt(f.storageUsageBytes))} of ${u(gt(f.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(A)}</textarea>
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
    ${ha()}
  `;const T=x.querySelector("#inventory-form");T&&(ie(T),Pt(T));const E=x.querySelector("#category-form");E&&le(E),We(),aa(y),ta(v),Mt(),window.scrollTo(t,e)}function ya(t,e){const a=x.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${t}"]`);if(!a.length)return;for(const o of a)o.hidden=!e;const n=x.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${t}"]`);n&&(n.textContent=e?"▾":"▸",n.setAttribute("aria-label",`${e?"Collapse":"Expand"} child markets`))}function ga(){return{schemaVersion:2,exportedAt:L(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords,valuationSnapshots:f.valuationSnapshots}}function he(){return JSON.stringify(ga(),null,2)}function va(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function wa(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await et("currencyCode",a),await et("currencySymbol",n),await et("darkMode",o),Q(),await P()}async function Sa(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),s=String(e.get("evaluationMode")||"").trim(),i=String(e.get("spotValue")||"").trim(),l=String(e.get("spotCode")||"").trim(),d=e.get("active")==="on",y=s==="spot"||s==="snapshot"?s:void 0,p=y==="spot"&&i?Lt(i):void 0,v=y==="spot"&&l?l:void 0;if(!o)return;if(y==="spot"&&i&&p==null){alert("Spot value is invalid.");return}const w=p??void 0,g=r||null;if(g&&!F(g)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const b=await Xt(n);if(!b){alert("Market not found.");return}if(g===b.id){alert("A category cannot be its own parent.");return}if(g&&Ft(f.categories,b.id).includes(g)){alert("A category cannot be moved under its own subtree.");return}const I=b.parentId!==g;b.name=o,b.parentId=g,b.evaluationMode=y,b.spotValueCents=w,b.spotCode=v,b.active=d,I&&(b.sortOrder=f.categories.filter(M=>M.parentId===g&&M.id!==b.id).length),b.updatedAt=L(),await At(b),Q(),await P();return}const A=L(),h=f.categories.filter(b=>b.parentId===g).length,c={id:crypto.randomUUID(),name:o,parentId:g,pathIds:[],pathNames:[],depth:0,sortOrder:h,evaluationMode:y,spotValueCents:w,spotCode:v,active:d,isArchived:!1,createdAt:A,updatedAt:A};await At(c),Q(),await P()}async function Ca(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),s=Number(e.get("quantity")),i=Lt(String(e.get("totalPrice")||"")),l=String(e.get("categoryId")||""),d=e.get("active")==="on",y=String(e.get("notes")||"").trim();if(!o||!r||!l){alert("Date, product name, and category are required.");return}if(!Number.isFinite(s)||s<=0){alert("Quantity must be greater than 0.");return}if(i==null||i<0){alert("Total price is invalid.");return}if(!F(l)){alert("Select a valid category.");return}const p=Math.round(i/s);if(a==="edit"){if(!n)return;const g=await Nt(n);if(!g){alert("Inventory record not found.");return}g.purchaseDate=o,g.productName=r,g.quantity=s,g.totalPriceCents=i,g.unitPriceCents=p,g.unitPriceSource="derived",g.categoryId=l,g.active=d,g.notes=y||void 0,g.updatedAt=L(),await dt(g),Q(),await P();return}const v=L(),w={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:s,totalPriceCents:i,unitPriceCents:p,unitPriceSource:"derived",categoryId:l,active:d,archived:!1,notes:y||void 0,createdAt:v,updatedAt:v};await dt(w),Q(),await P()}async function Ia(t,e){const a=await Nt(t);a&&(a.active=e,a.updatedAt=L(),await dt(a),await P())}async function ka(t,e){const a=await Nt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?L():void 0,a.updatedAt=L(),await dt(a),await P()))}async function $a(t,e){const a=F(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Ft(f.categories,t),o=L();for(const r of n){const s=await Xt(r);s&&(s.isArchived=e,e&&(s.active=!1),s.archivedAt=e?o:void 0,s.updatedAt=o,await At(s))}await P()}function xa(t){const e=L();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Aa(t){const e=L(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function Da(t){const e=L(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function Ma(){const t=f.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=ee(e.categories.map(xa)),n=new Set(a.map(l=>l.id)),o=e.purchases.map(Aa);for(const l of o)if(!n.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:pt},{key:"currencySymbol",value:W},{key:"darkMode",value:it}],s=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(Da):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await qe({purchases:o,categories:a,settings:r,valuationSnapshots:s}),q({importText:""}),await P()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function ye(t){return t.target instanceof HTMLElement?t.target:null}function Kt(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const s=(y,p)=>y.viewId===p.viewId&&y.field===p.field&&y.op===p.op&&y.value===p.value;let i=je(f.filters,{viewId:e,field:a,op:n,value:o,label:r});const l=t.dataset.crossInventoryCategoryId;if(l){const y=F(l);if(y){const p=i.find(v=>s(v,{viewId:e,field:a,op:n,value:o}));if(p){const v=`Market: ${y.pathNames.join(" / ")}`;i=i.filter(g=>g.linkedToFilterId!==p.id);const w=i.findIndex(g=>s(g,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:y.id}));if(w>=0){const g=i[w];i=[...i.slice(0,w),{...g,label:v,linkedToFilterId:p.id},...i.slice(w+1)]}else i=[...i,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:y.id,label:v,linkedToFilterId:p.id}]}}}let d={filters:i};e==="inventoryTable"&&a==="archived"&&o==="true"&&!f.showArchivedInventory&&(d.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!f.showArchivedCategories&&(d.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!f.showArchivedCategories&&(d.showArchivedCategories=!0),q(d)}function ge(){ot!=null&&(window.clearTimeout(ot),ot=null)}function Ta(t){const e=f.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&q({filters:te(f.filters,a.id)})}x.addEventListener("click",async t=>{const e=ye(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(ge(),t.detail>1)return;ot=window.setTimeout(()=>{ot=null,Kt(a)},220);return}Kt(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;q({filters:te(f.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;q({filters:Be(f.filters,o)});return}if(n==="toggle-show-archived-inventory"){q({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){q({showArchivedCategories:a.checked});return}if(n==="open-create-category"){H({kind:"categoryCreate"});return}if(n==="open-create-inventory"){H({kind:"inventoryCreate"});return}if(n==="open-settings"){H({kind:"settings"});return}if(n==="apply-report-range"){const o=x.querySelector('input[name="reportDateFrom"]'),r=x.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const s=o.value,i=r.value,l=B(s),d=B(i,!0);if(l==null||d==null||l>d){st({tone:"warning",text:"Select a valid report date range."});return}q({reportDateFrom:s,reportDateTo:i});return}if(n==="reset-report-range"){q({reportDateFrom:ne(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await me()}catch{st({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(Z),s=!r.has(o);s?r.add(o):r.delete(o),Z=r,ya(o,s);return}if(n==="edit-category"){const o=a.dataset.id;o&&H({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&H({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;Q();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await Ia(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await ka(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await $a(o,r);return}if(n==="download-json"){va(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,he(),"application/json");return}if(n==="replace-import"){await Ma();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Oe(),await P(),st({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Re(),q({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await P();return}}});x.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(ge(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){H({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&H({kind:"categoryEdit",categoryId:o})}});x.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await wa(e);return}if(e.id==="category-form"){await Sa(e);return}if(e.id==="inventory-form"){await Ca(e);return}}});x.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Pt(a)}if(e.id==="import-text"){f={...f,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?f={...f,reportDateFrom:e.value}:f={...f,reportDateTo:e.value})}});x.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(ie(r),Pt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&le(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();q({importText:n})});x.addEventListener("pointermove",t=>{const e=ye(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");ut=(a==null?void 0:a.dataset.filterSectionViewId)||null});x.addEventListener("pointerleave",()=>{ut=null});document.addEventListener("keydown",t=>{if(N.kind==="none"){if(t.key!=="Escape")return;const s=t.target;if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement||s instanceof HTMLSelectElement||!ut)return;t.preventDefault(),Ta(ut);return}if(t.key==="Escape"){t.preventDefault(),Q();return}if(t.key!=="Tab")return;const e=oe();if(!e)return;const a=re(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});window.addEventListener("pagehide",()=>{be()});window.addEventListener("beforeunload",()=>{be()});P();
