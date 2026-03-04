(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const wt=(t,e)=>e.some(a=>t instanceof a);let qt,Rt;function fe(){return qt||(qt=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function me(){return Rt||(Rt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const St=new WeakMap,pt=new WeakMap,lt=new WeakMap;function be(t){const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("success",r),t.removeEventListener("error",i)},r=()=>{a(z(t.result)),o()},i=()=>{n(t.error),o()};t.addEventListener("success",r),t.addEventListener("error",i)});return lt.set(e,t),e}function he(t){if(St.has(t))return;const e=new Promise((a,n)=>{const o=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",i),t.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(t.error||new DOMException("AbortError","AbortError")),o()};t.addEventListener("complete",r),t.addEventListener("error",i),t.addEventListener("abort",i)});St.set(t,e)}let kt={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return St.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return z(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Jt(t){kt=t(kt)}function ye(t){return me().includes(t)?function(...e){return t.apply(It(this),e),z(this.request)}:function(...e){return z(t.apply(It(this),e))}}function ge(t){return typeof t=="function"?ye(t):(t instanceof IDBTransaction&&he(t),wt(t,fe())?new Proxy(t,kt):t)}function z(t){if(t instanceof IDBRequest)return be(t);if(pt.has(t))return pt.get(t);const e=ge(t);return e!==t&&(pt.set(t,e),lt.set(e,t)),e}const It=t=>lt.get(t);function ve(t,e,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(t,e),l=z(i);return n&&i.addEventListener("upgradeneeded",s=>{n(z(i.result),s.oldVersion,s.newVersion,z(i.transaction),s)}),a&&i.addEventListener("blocked",s=>a(s.oldVersion,s.newVersion,s)),l.then(s=>{r&&s.addEventListener("close",()=>r()),o&&s.addEventListener("versionchange",d=>o(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const we=["get","getKey","getAll","getAllKeys","count"],Se=["put","add","delete","clear"],ft=new Map;function Ot(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ft.get(e))return ft.get(e);const a=e.replace(/FromIndex$/,""),n=e!==a,o=Se.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||we.includes(a)))return;const r=async function(i,...l){const s=this.transaction(i,o?"readwrite":"readonly");let d=s.store;return n&&(d=d.index(l.shift())),(await Promise.all([d[a](...l),o&&s.done]))[0]};return ft.set(e,r),r}Jt(t=>({...t,get:(e,a,n)=>Ot(e,a)||t.get(e,a,n),has:(e,a)=>!!Ot(e,a)||t.has(e,a)}));const ke=["continue","continuePrimaryKey","advance"],Vt={},Ct=new WeakMap,Kt=new WeakMap,Ie={get(t,e){if(!ke.includes(e))return t[e];let a=Vt[e];return a||(a=Vt[e]=function(...n){Ct.set(this,Kt.get(this)[e](...n))}),a}};async function*Ce(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;const a=new Proxy(e,Ie);for(Kt.set(a,e),lt.set(a,It(e));e;)yield a,e=await(Ct.get(a)||e.continue()),Ct.delete(a)}function jt(t,e){return e===Symbol.asyncIterator&&wt(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&wt(t,[IDBIndex,IDBObjectStore])}Jt(t=>({...t,get(e,a,n){return jt(e,a)?Ce:t.get(e,a,n)},has(e,a){return jt(e,a)||t.has(e,a)}}));const T=ve("investment_purchase_tracker",3,{async upgrade(t,e,a,n){const o=n,r=t.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=t.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(t.objectStoreNames.contains("inventory")||(i=t.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let s=await r.openCursor();for(;s;)await i.put(s.value),s=await s.continue()}let l=t.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(t.objectStoreNames.contains("categories")||(l=t.createObjectStore("categories",{keyPath:"id"}),l.createIndex("by_parentId","parentId"),l.createIndex("by_name","name"),l.createIndex("by_isArchived","isArchived")),t.objectStoreNames.contains("settings")||t.createObjectStore("settings",{keyPath:"key"}),!t.objectStoreNames.contains("valuationSnapshots")){const s=t.createObjectStore("valuationSnapshots",{keyPath:"id"});s.createIndex("by_capturedAt","capturedAt"),s.createIndex("by_scope","scope"),s.createIndex("by_marketId","marketId"),s.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let s=await i.openCursor();for(;s;){const d=s.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.archived!="boolean"&&(d.archived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}if(l){let s=await l.openCursor();for(;s;){const d=s.value;let f=!1;typeof d.active!="boolean"&&(d.active=!0,f=!0),typeof d.isArchived!="boolean"&&(d.isArchived=!1,f=!0),f&&(d.updatedAt=new Date().toISOString(),await s.update(d)),s=await s.continue()}}}});async function $e(){return(await T).getAll("inventory")}async function nt(t){await(await T).put("inventory",t)}async function Dt(t){return(await T).get("inventory",t)}async function xe(){return(await T).getAll("categories")}async function $t(t){await(await T).put("categories",t)}async function Yt(t){return(await T).get("categories",t)}async function Me(){return(await T).getAll("settings")}async function F(t,e){await(await T).put("settings",{key:t,value:e})}async function Ae(){return(await T).getAll("valuationSnapshots")}async function De(t){const a=(await T).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of t.purchases)await a.objectStore("inventory").put(n);for(const n of t.categories)await a.objectStore("categories").put(n);for(const n of t.settings)await a.objectStore("settings").put(n);for(const n of t.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Te(){const e=(await T).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await e.objectStore("inventory").clear(),await e.objectStore("categories").clear(),await e.objectStore("settings").clear(),await e.objectStore("valuationSnapshots").clear(),await e.done}async function Ee(){const e=(await T).transaction("valuationSnapshots","readwrite");await e.objectStore("valuationSnapshots").clear(),await e.done}function Bt(t){return t==null?!0:typeof t=="string"?t.trim()==="":!1}function Le(t,e){return t.some(n=>n.viewId===e.viewId&&n.field===e.field&&n.op===e.op&&n.value===e.value)?t:[...t,{...e,id:crypto.randomUUID()}]}function Xt(t,e){const a=new Set([e]);let n=!0;for(;n;){n=!1;for(const o of t)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return t.filter(o=>!a.has(o.id))}function Ne(t,e){return t.filter(a=>a.viewId!==e)}function xt(t,e,a,n,o){const r=e.filter(l=>l.viewId===a);if(!r.length)return t;const i=new Map(n.map(l=>[l.key,l]));return t.filter(l=>r.every(s=>{var c;const d=i.get(s.field);if(!d)return!0;const f=d.getValue(l);if(s.op==="eq")return String(f)===s.value;if(s.op==="isEmpty")return Bt(f);if(s.op==="isNotEmpty")return!Bt(f);if(s.op==="contains")return String(f).toLowerCase().includes(s.value.toLowerCase());if(s.op==="inCategorySubtree"){const b=((c=o==null?void 0:o.categoryDescendantsMap)==null?void 0:c.get(s.value))||new Set([s.value]),y=String(f);return b.has(y)}return!0}))}function Fe(t){const e=new Map(t.map(n=>[n.id,n])),a=new Map;for(const n of t){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:e,children:a}}function ct(t){const{children:e}=Fe(t),a=new Map;function n(o){const r=new Set([o]);for(const i of e.get(o)||[])for(const l of n(i.id))r.add(l);return a.set(o,r),r}for(const o of t)a.has(o.id)||n(o.id);return a}function Zt(t){const e=new Map(t.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let l=n;for(;l&&!i.has(l.id);)i.add(l.id),o.unshift(l.id),r.unshift(l.name),l=l.parentId?e.get(l.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return t.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Tt(t,e){return[...ct(t).get(e)||new Set([e])]}function Pe(t,e){const a=ct(e),n=new Map;for(const o of e){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const l of t)r.has(l.categoryId)&&(i+=l.totalPriceCents);n.set(o.id,i)}return n}const te=document.querySelector("#app");if(!te)throw new Error("#app not found");const g=te;let $={kind:"none"},Y=null,B=null,O=null,P=null,q=null,R=null,Gt=!1,et=null,mt=!1,bt=null,X=null,ot=null,Ut=!1,zt=!1,Q=new Set,_t=!1,K=null,Z=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:ee(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const rt="USD",_="$",tt=!1,it=!1,st=!1,qe=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function A(){return new Date().toISOString()}function Re(t){let e=null;for(const a of t)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!e||a.purchaseDate<e)&&(e=a.purchaseDate);return e}function ee(t){const e=new Date;return e.setDate(e.getDate()-t),e.toISOString().slice(0,10)}function u(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function ht(t){if(!Number.isFinite(t)||t<0)return"0 B";const e=["B","KB","MB","GB"];let a=t,n=0;for(;a>=1024&&n<e.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${e[n]}`}function w(t){const e=N("currencySymbol")||_,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(t/100);return`${e}${a}`}function Oe(t){const e=N("currencySymbol")||_,n=Math.abs(t)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${t<0?"-":""}${e}${Math.round(o)}${r}`}function Et(t){const e=t.trim().replace(/,/g,"");if(!e)return null;const a=Number(e);return Number.isFinite(a)?Math.round(a*100):null}function N(t){var e;return(e=p.settings.find(a=>a.key===t))==null?void 0:e.value}function Ve(t){var n;const e=(n=t.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof e=="boolean"?e:tt;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function L(t){p={...p,...t},V()}function at(t){K!=null&&(window.clearTimeout(K),K=null),Z=t,V(),t&&(K=window.setTimeout(()=>{K=null,Z=null,V()},3500))}function G(t){$.kind==="none"&&document.activeElement instanceof HTMLElement&&(Y=document.activeElement),$=t,V()}function H(){$.kind!=="none"&&($={kind:"none"},V(),Y&&Y.isConnected&&Y.focus(),Y=null)}function ae(){return g.querySelector(".modal-panel")}function ne(t){return Array.from(t.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(e=>!e.hasAttribute("hidden"))}function je(){if($.kind==="none")return;const t=ae();if(!t)return;const e=document.activeElement;if(e instanceof Node&&t.contains(e))return;(ne(t)[0]||t).focus()}function Be(){var t,e;(t=B==null?void 0:B.destroy)==null||t.call(B),(e=O==null?void 0:O.destroy)==null||e.call(O),B=null,O=null}function Mt(){var i;const t=window,e=t.DataTable,a=t.jQuery&&((i=t.jQuery.fn)!=null&&i.DataTable)?t.jQuery:void 0;if(!e&&!a){bt==null&&(bt=window.setTimeout(()=>{bt=null,Mt(),V()},500)),mt||(mt=!0,window.addEventListener("load",()=>{mt=!1,Mt(),V()},{once:!0}));return}const n=g.querySelector("#categories-table"),o=g.querySelector("#inventory-table"),r=(l,s)=>{var d,f;return e?new e(l,s):a?((f=(d=a(l)).DataTable)==null?void 0:f.call(d,s))??null:null};n&&(B=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(O=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Ke(o,O))}function Ge(t,e,a){const n=e.find(r=>r.key==="computedTotalCents");return n?(a?t:t.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function J(t,e){const a=g.querySelector(`#${t}`),n=g.querySelector(`[data-chart-empty-for="${t}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=e,n.hidden=!1)}function At(t){const e=g.querySelector(`#${t}`),a=g.querySelector(`[data-chart-empty-for="${t}"]`);e&&e.classList.remove("d-none"),a&&(a.hidden=!0)}function Ue(){P==null||P.dispose(),q==null||q.dispose(),R==null||R.dispose(),P=null,q=null,R=null}function ze(){Gt||(Gt=!0,window.addEventListener("resize",()=>{et!=null&&window.clearTimeout(et),et=window.setTimeout(()=>{et=null,P==null||P.resize(),q==null||q.resize(),R==null||R.resize()},120)}))}function _e(){const t=new Map;for(const e of p.categories){if(e.isArchived||!e.active||!e.parentId)continue;const a=t.get(e.parentId)||[];a.push(e.id),t.set(e.parentId,a)}for(const e of t.values())e.sort();return t}function He(t){return{labels:[],series:[],overallValues:[],showOverallComparison:!1}}function We(t){const e="growth-trend-chart",a=g.querySelector(`#${e}`);if(!a)return;if(!window.echarts){J(e,"Chart unavailable: ECharts not loaded.");return}const n=t.overallValues.some(b=>typeof b=="number"),o=t.series.length>0;if(!t.labels.length||!n&&!o){J(e,"No snapshot trend data for this period yet.");return}At(e);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",l=window.matchMedia("(max-width: 767.98px)").matches?11:13,s=r?"#e9ecef":"#212529",d=r?"#ced4da":"#495057",f=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],c=t.labels.length>12?Math.ceil(t.labels.length/6):1;R=window.echarts.init(a),R.setOption({color:f,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:s,fontSize:l}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:s,fontSize:l},formatter:b=>{var h;if(!b.length)return"";const y=b.filter(M=>typeof M.value=="number").map(M=>`${u(M.seriesName||"")}: ${w(M.value)}`);return[`<strong>${u(((h=b[0])==null?void 0:h.axisValueLabel)||"")}</strong>`,...y].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:t.labels,boundaryGap:!1,axisLabel:{color:d,fontSize:l,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:b=>b%c===0||b===t.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:d}}},yAxis:{type:"value",position:"left",axisLabel:{color:d,margin:6,fontSize:l,formatter:b=>Oe(b)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:t.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...t.series.map((b,y)=>({name:b.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:b.values,lineStyle:{width:y===0?2.6:2}}))]})}function Qe(t,e=26){return t.length<=e?t:`${t.slice(0,e-1)}…`}function Je(t){const e="markets-allocation-chart",a="markets-top-chart",n=g.querySelector(`#${e}`),o=g.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){J(e,"Chart unavailable: ECharts not loaded."),J(a,"Chart unavailable: ECharts not loaded.");return}if(t.length===0){J(e,"No eligible market totals to chart."),J(a,"No eligible market totals to chart.");return}At(e),At(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",l=r?11:13,s=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],d=i?"#e9ecef":"#212529",f=i?"#ced4da":"#495057",c=t.map(v=>({name:v.label,value:v.totalCents})),b=t.slice(0,5),y=[...b].reverse(),h=b.reduce((v,E)=>Math.max(v,E.totalCents),0),M=h>0?Math.ceil(h*1.2):1;P=window.echarts.init(n),q=window.echarts.init(o),P.setOption({color:s,tooltip:{trigger:"item",textStyle:{fontSize:l},formatter:v=>`${u(v.name)}: ${w(v.value)} (${v.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:d,fontSize:l}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:d,fontSize:l}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:c,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:l,textBorderWidth:0,formatter:v=>{const E=v.percent??0;return`${Math.round(E)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:f,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),q.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:l},formatter:v=>{const E=v[0];return E?`${u(E.name)}: ${w(E.value)}`:""}},xAxis:{type:"value",max:M,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:y.map(v=>v.label),axisLabel:{color:f,fontSize:l,formatter:v=>Qe(v)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:y.map(v=>v.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:d,fontSize:l,formatter:v=>w(v.value)}}]}),ze()}function Ke(t,e){!(e!=null&&e.order)||!e.draw||t.addEventListener("click",a=>{var c,b,y;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),l=i.indexOf(o);if(l<0||l===i.length-1)return;a.preventDefault(),a.stopPropagation();const s=(c=e.order)==null?void 0:c.call(e),d=Array.isArray(s)?s[0]:void 0,f=d&&d[0]===l&&d[1]==="asc"?"desc":"asc";(b=e.order)==null||b.call(e,[[l,f]]),(y=e.draw)==null||y.call(e,!1)},!0)}async function D(){var d,f;const[t,e,a,n]=await Promise.all([$e(),xe(),Me(),Ae()]),o=Zt(e).sort((c,b)=>c.sortOrder-b.sortOrder||c.name.localeCompare(b.name));a.some(c=>c.key==="currencyCode")||(await F("currencyCode",rt),a.push({key:"currencyCode",value:rt})),a.some(c=>c.key==="currencySymbol")||(await F("currencySymbol",_),a.push({key:"currencySymbol",value:_})),a.some(c=>c.key==="darkMode")||(await F("darkMode",tt),a.push({key:"darkMode",value:tt})),a.some(c=>c.key==="showMarketsGraphs")||(await F("showMarketsGraphs",it),a.push({key:"showMarketsGraphs",value:it})),a.some(c=>c.key==="showGrowthGraph")||(await F("showGrowthGraph",st),a.push({key:"showGrowthGraph",value:st})),Ve(a);let r=null,i=null;try{const c=await((f=(d=navigator.storage)==null?void 0:d.estimate)==null?void 0:f.call(d));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,i=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,i=null}let l=p.reportDateFrom,s=p.reportDateTo;if(!_t){const c=Re(t);c&&(l=c),s=new Date().toISOString().slice(0,10),_t=!0}p={...p,inventoryRecords:t,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i,reportDateFrom:l,reportDateTo:s},V()}function x(t){if(t)return p.categories.find(e=>e.id===t)}function Ye(t){const e=x(t);return e?e.pathNames.join(" / "):"(Unknown category)"}function Xe(t){return Ye(t)}function Ze(t){const e=x(t);return e?e.pathIds.some(a=>{var n;return((n=x(a))==null?void 0:n.active)===!1}):!1}function ta(t){const e=x(t.categoryId);if(!e)return!1;for(const a of e.pathIds){const n=x(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function ea(t){return t.active&&!ta(t)}function yt(t){return t==null?"":(t/100).toFixed(2)}function Lt(t){const e=t.querySelector('input[name="quantity"]'),a=t.querySelector('input[name="totalPrice"]'),n=t.querySelector('input[name="unitPrice"]');if(!e||!a||!n)return;const o=Number(e.value),r=Et(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function oe(t){const e=t.querySelector('select[name="categoryId"]'),a=t.querySelector("[data-quantity-group]"),n=t.querySelector('input[name="quantity"]');if(!e||!a||!n)return;const o=x(e.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function re(t){const e=t.querySelector('select[name="evaluationMode"]'),a=t.querySelector("[data-spot-value-group]"),n=t.querySelector('input[name="spotValue"]'),o=t.querySelector("[data-spot-code-group]"),r=t.querySelector('input[name="spotCode"]');if(!e||!a||!n||!o||!r)return;const i=e.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function U(t){return t.align==="right"?"col-align-right":t.align==="center"?"col-align-center":""}function aa(t){return t.active&&!t.archived}function na(){const t=p.inventoryRecords.filter(aa),e=p.categories.filter(r=>!r.isArchived),a=Pe(t,e),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of t){const i=n.get(r.categoryId);if(i)for(const l of i.pathIds)o.set(l,(o.get(l)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function oa(t,e){const a=new Map;p.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const i=a.get(r.parentId)||[];i.push(r),a.set(r.parentId,i)});const n=new Map,o=r=>{const i=n.get(r);if(i!=null)return i;const l=x(r);if(!l||l.isArchived)return n.set(r,0),0;let s=0;const d=a.get(l.id)||[];return d.length>0?s=d.reduce((f,c)=>f+o(c.id),0):l.evaluationMode==="snapshot"?s=t.get(l.id)||0:l.evaluationMode==="spot"&&l.spotValueCents!=null?s=(e.get(l.id)||0)*l.spotValueCents:s=t.get(l.id)||0,n.set(r,s),s};return p.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function ie(){return[{key:"productName",label:"Name",getValue:t=>t.productName,getDisplay:t=>t.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:t=>t.categoryId,getDisplay:t=>Xe(t.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:t=>t.quantity,getDisplay:t=>String(t.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:t=>t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity),getDisplay:t=>w(t.unitPriceCents??Math.round(t.totalPriceCents/t.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:t=>t.totalPriceCents,getDisplay:t=>w(t.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:t=>t.purchaseDate,getDisplay:t=>t.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:t=>t.active,getDisplay:t=>t.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function ra(){return[{key:"name",label:"Name",getValue:t=>t.name,getDisplay:t=>t.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:t=>t.pathNames.join(" / "),getDisplay:t=>t.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:t=>t.spotValueCents??"",getDisplay:t=>t.spotValueCents==null?"":w(t.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function se(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(t=>!t.archived)}function ia(){return p.showArchivedCategories?p.categories:p.categories.filter(t=>!t.isArchived)}function sa(){const t=ie(),e=ra(),a=e.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),n=e.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),o=ct(p.categories),r=xt(se(),p.filters,"inventoryTable",t,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:l}=na(),s=oa(i,l),d=[...a,{key:"computedQty",label:"Qty",getValue:c=>l.get(c.id)||0,getDisplay:c=>String(l.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>i.get(c.id)||0,getDisplay:c=>w(i.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:c=>s.get(c.id)||0,getDisplay:c=>w(s.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],f=xt(ia(),p.filters,"categoriesList",d);return{inventoryColumns:t,categoryColumns:d,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:f,categoryTotals:i,categoryQty:l}}async function la(t){at({tone:"warning",text:"Snapshot capture is currently disabled while Growth logic is being redesigned."})}function Ht(t,e,a=""){const n=p.filters.filter(o=>o.viewId===t);return`
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
  `}function gt(t,e,a){const n=a.getValue(e),o=a.getDisplay(e),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return u(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="isEmpty" data-value="" data-label="${u(`${a.label}: Empty`)}" title="Filter ${u(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(t==="inventoryTable"&&a.key==="categoryId"&&typeof e=="object"&&e&&"categoryId"in e){const s=String(e.categoryId),d=Ze(s);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}${d?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(t==="categoriesList"&&a.key==="parent"&&typeof e=="object"&&e&&"parentId"in e){const s=e.parentId;if(typeof s=="string"&&s)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}if(t==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof e=="object"&&e&&"id"in e){const s=String(e.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${u(s)}"><span class="filter-hit">${u(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${t}" data-field="${u(a.key)}" data-op="${u(a.filterOp||"eq")}" data-value="${u(r)}" data-label="${u(`${a.label}: ${o}`)}"><span class="filter-hit">${u(o)}</span></button>`}function le(t){return Number.isFinite(t)?Number.isInteger(t)?String(t):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(t):""}function ca(t,e){const a=t.map((n,o)=>{let r=0,i=!1;for(const s of e){const d=n.getValue(s);typeof d=="number"&&Number.isFinite(d)&&(r+=d,i=!0)}const l=i?String(n.key).toLowerCase().includes("cents")?w(r):le(r):o===0?"Totals":"";return`<th class="${U(n)}">${u(l)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function da(t,e){const a=new Set(e.map(i=>i.id)),n=e.filter(i=>!i.parentId||!a.has(i.parentId)),o=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),r=t.map((i,l)=>{const s=o.has(String(i.key))?n:e;let d=0,f=!1;for(const b of s){const y=i.getValue(b);typeof y=="number"&&Number.isFinite(y)&&(d+=y,f=!0)}const c=f?String(i.key).toLowerCase().includes("cents")?w(d):le(d):l===0?"Totals":"";return`<th class="${U(i)}">${u(c)}</th>`});return r.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${r.join("")}</tr></tfoot>`}function Wt(t,e=!1){return/^\d{4}-\d{2}-\d{2}$/.test(t)?Date.parse(`${t}T${e?"23:59:59":"00:00:00"}Z`):null}function ua(t,e){const a=[...t];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=e.get(r);if(i!=null&&i.has(o))return!1}return!0})}function pa(t){const e=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&e.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?ua(a,t):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function fa(t){const e=pa(t),a=_e(),n=[],o={},r=s=>{const d=x(s);return d?{marketId:s,marketLabel:d.pathNames.join(" / "),startValueCents:null,endValueCents:null,contributionsCents:0,netGrowthCents:null,growthPct:null}:null},i=new Set,l=s=>i.has(s)?[]:(i.add(s),(a.get(s)||[]).map(d=>r(d)).filter(d=>d!=null).sort((d,f)=>d.marketLabel.localeCompare(f.marketLabel)));for(const s of e){const d=r(s);d&&(o[s]=l(s),n.push(d))}return{scopeMarketIds:e,rows:n,childRowsByParent:o,startTotalCents:0,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0,hasManualSnapshots:!1}}function vt(t){return t==null||!Number.isFinite(t)?"—":`${(t*100).toFixed(2)}%`}function W(t){return t==null||!Number.isFinite(t)||t===0?"text-body-secondary":t>0?"text-success":"text-danger"}function ma(){if($.kind==="none")return"";const t=N("currencySymbol")||_,e=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${u(o.pathNames.join(" / "))}</option>`).join("");if($.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${u((N("currencyCode")||rt).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${qe.map(a=>`<option value="${u(a.value)}" ${(N("currencySymbol")||_)===a.value?"selected":""}>${u(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${N("darkMode")??tt?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showGrowthGraph" ${N("showGrowthGraph")??st?"checked":""} />
                  <span class="form-check-label">Show Growth graph</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${N("showMarketsGraphs")??it?"checked":""} />
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
    `;if($.kind==="categoryCreate"||$.kind==="categoryEdit"){const a=$.kind==="categoryEdit",n=$.kind==="categoryEdit"?x($.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Tt(p.categories,n.id)):void 0,r=ct(p.categories);return xt(se(),p.filters,"inventoryTable",ie(),{categoryDescendantsMap:r}),`
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${u(yt(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if($.kind==="inventoryCreate")return`
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
    `;if($.kind==="inventoryEdit"){const a=$,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${u(yt(n.totalPriceCents))}" />
              </div>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${u(t)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${u(yt(n.unitPriceCents))}" disabled />
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
    `:""}return""}function V(){const t=window.scrollX,e=window.scrollY,a=g.querySelector('details[data-section="data-tools"]');a&&(Ut=a.open);const n=g.querySelector('details[data-section="investments"]');n&&(zt=n.open),Ue(),Be();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:i,filteredInventoryRecords:l,filteredCategories:s}=sa(),d=p.filters.some(m=>m.viewId==="categoriesList"),f=Ge(s,r,d),c=fa(i),b=He(),y=N("showGrowthGraph")??st,h=N("showMarketsGraphs")??it,M=new Set([...Q].filter(m=>{var k;return(((k=c.childRowsByParent[m])==null?void 0:k.length)||0)>0}));M.size!==Q.size&&(Q=M);const v=null,E=p.exportText||ce(),I=l.map(m=>`
        <tr class="${[ea(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${o.map(S=>`<td class="${U(S)}">${gt("inventoryTable",m,S)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),dt=new Set(s.map(m=>m.id)),j=new Map;for(const m of s){const k=m.parentId&&dt.has(m.parentId)?m.parentId:null,S=j.get(k)||[];S.push(m),j.set(k,S)}for(const m of j.values())m.sort((k,S)=>k.sortOrder-S.sortOrder||k.name.localeCompare(S.name));const Nt=[],Ft=(m,k)=>{const S=j.get(m)||[];for(const C of S)Nt.push({category:C,depth:k}),Ft(C.id,k+1)};Ft(null,0);const pe=Nt.map(({category:m,depth:k})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${r.map(S=>{if(S.key==="name"){const C=k>0?(k-1)*1.1:0;return`<td class="${U(S)}"><div class="market-name-wrap" style="padding-left:${C.toFixed(2)}rem">${k>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${gt("categoriesList",m,S)}</div></td>`}return`<td class="${U(S)}">${gt("categoriesList",m,S)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");g.innerHTML=`
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
        ${Z?`<div class="alert alert-${Z.tone} py-1 px-2 mt-2 mb-0 small" role="status">${u(Z.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${c.scopeMarketIds.length?`${c.scopeMarketIds.length} market${c.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${u(p.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${u(p.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${y?`
            <div class="growth-widget-card card border-0 mb-2">
              <div class="card-body p-1 p-md-2">
                <div class="growth-chart-frame">
                  <div id="growth-trend-chart" class="growth-chart-canvas" role="img" aria-label="Growth over time chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="growth-trend-chart" hidden></p>
                </div>
              </div>
            </div>
          `:""}
          ${c.rows.length===0?`
            <p class="mb-0 text-body-secondary">No manual snapshots yet for this scope/range. Capture Snapshot to begin Growth history.</p>
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
                  ${c.rows.map(m=>{const k=c.childRowsByParent[m.marketId]||[],S=Q.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${k.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${u(m.marketId)}" aria-label="${S?"Collapse":"Expand"} child markets">${S?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${u(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":u(w(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":u(w(m.endValueCents))}</td>
                      <td class="text-end">${u(w(m.contributionsCents))}</td>
                      <td class="text-end ${W(m.netGrowthCents)}">${m.netGrowthCents==null?"—":u(w(m.netGrowthCents))}</td>
                      <td class="text-end ${W(m.growthPct)}">${u(vt(m.growthPct))}</td>
                      </tr>
                      ${k.map(C=>`
                            <tr class="growth-child-row" data-parent-market-id="${u(m.marketId)}" ${S?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${u(C.marketLabel)}</td>
                              <td class="text-end">${C.startValueCents==null?"—":u(w(C.startValueCents))}</td>
                              <td class="text-end">${C.endValueCents==null?"—":u(w(C.endValueCents))}</td>
                              <td class="text-end">${u(w(C.contributionsCents))}</td>
                              <td class="text-end ${W(C.netGrowthCents)}">${C.netGrowthCents==null?"—":u(w(C.netGrowthCents))}</td>
                              <td class="text-end ${W(C.growthPct)}">${u(vt(C.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${u(w(c.startTotalCents))}</th>
                    <th class="text-end">${u(w(c.endTotalCents))}</th>
                    <th class="text-end">${u(w(c.contributionsTotalCents))}</th>
                    <th class="text-end ${W(c.netGrowthTotalCents)}">${u(w(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${W(v)}">${u(vt(v))}</th>
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
            <button type="button" class="btn btn-sm btn-primary" data-action="open-create-category">Create New</button>
          </div>
        </div>
        ${h?`
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
        ${Ht("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(m=>`<th class="${U(m)}">${u(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${pe}
            </tbody>
            ${da(r,s)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${zt?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${Ht("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(m=>`<th class="${U(m)}">${u(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${I}
              </tbody>
              ${ca(o,l)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${Ut?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?u(ht(p.storageUsageBytes)):`${u(ht(p.storageUsageBytes))} of ${u(ht(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${u(E)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${u(p.importText)}</textarea>
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
    ${ma()}
  `;const ut=g.querySelector("#inventory-form");ut&&(oe(ut),Lt(ut));const Pt=g.querySelector("#category-form");Pt&&re(Pt),je(),Je(f),We(b),Mt(),window.scrollTo(t,e)}function ba(t,e){const a=g.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${t}"]`);if(!a.length)return;for(const o of a)o.hidden=!e;const n=g.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${t}"]`);n&&(n.textContent=e?"▾":"▸",n.setAttribute("aria-label",`${e?"Collapse":"Expand"} child markets`))}function ha(){return{schemaVersion:2,exportedAt:A(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function ce(){return JSON.stringify(ha(),null,2)}function ya(t,e,a){const n=new Blob([e],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=t,r.click(),URL.revokeObjectURL(o)}async function ga(t){const e=new FormData(t),a=String(e.get("currencyCode")||"").trim().toUpperCase(),n=String(e.get("currencySymbol")||"").trim(),o=e.get("darkMode")==="on",r=e.get("showGrowthGraph")==="on",i=e.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await F("currencyCode",a),await F("currencySymbol",n),await F("darkMode",o),await F("showGrowthGraph",r),await F("showMarketsGraphs",i),H(),await D()}async function va(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("categoryId")||"").trim(),o=String(e.get("name")||"").trim(),r=String(e.get("parentId")||"").trim(),i=String(e.get("evaluationMode")||"").trim(),l=String(e.get("spotValue")||"").trim(),s=String(e.get("spotCode")||"").trim(),d=e.get("active")==="on",f=i==="spot"||i==="snapshot"?i:void 0,c=f==="spot"&&l?Et(l):void 0,b=f==="spot"&&s?s:void 0;if(!o)return;if(f==="spot"&&l&&c==null){alert("Spot value is invalid.");return}const y=c??void 0,h=r||null;if(h&&!x(h)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const I=await Yt(n);if(!I){alert("Market not found.");return}if(h===I.id){alert("A category cannot be its own parent.");return}if(h&&Tt(p.categories,I.id).includes(h)){alert("A category cannot be moved under its own subtree.");return}const dt=I.parentId!==h;I.name=o,I.parentId=h,I.evaluationMode=f,I.spotValueCents=y,I.spotCode=b,I.active=d,dt&&(I.sortOrder=p.categories.filter(j=>j.parentId===h&&j.id!==I.id).length),I.updatedAt=A(),await $t(I),H(),await D();return}const M=A(),v=p.categories.filter(I=>I.parentId===h).length,E={id:crypto.randomUUID(),name:o,parentId:h,pathIds:[],pathNames:[],depth:0,sortOrder:v,evaluationMode:f,spotValueCents:y,spotCode:b,active:d,isArchived:!1,createdAt:M,updatedAt:M};await $t(E),H(),await D()}async function wa(t){const e=new FormData(t),a=String(e.get("mode")||"create"),n=String(e.get("inventoryId")||"").trim(),o=String(e.get("purchaseDate")||""),r=String(e.get("productName")||"").trim(),i=Number(e.get("quantity")),l=Et(String(e.get("totalPrice")||"")),s=String(e.get("categoryId")||""),d=e.get("active")==="on",f=String(e.get("notes")||"").trim();if(!o||!r||!s){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(l==null||l<0){alert("Total price is invalid.");return}if(!x(s)){alert("Select a valid category.");return}const c=Math.round(l/i);if(a==="edit"){if(!n)return;const h=await Dt(n);if(!h){alert("Inventory record not found.");return}h.purchaseDate=o,h.productName=r,h.quantity=i,h.totalPriceCents=l,h.unitPriceCents=c,h.unitPriceSource="derived",h.categoryId=s,h.active=d,h.notes=f||void 0,h.updatedAt=A(),await nt(h),H(),await D();return}const b=A(),y={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:l,unitPriceCents:c,unitPriceSource:"derived",categoryId:s,active:d,archived:!1,notes:f||void 0,createdAt:b,updatedAt:b};await nt(y),H(),await D()}async function Sa(t,e){const a=await Dt(t);a&&(a.active=e,a.updatedAt=A(),await nt(a),await D())}async function ka(t,e){const a=await Dt(t);a&&(e&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=e,e&&(a.active=!1),a.archivedAt=e?A():void 0,a.updatedAt=A(),await nt(a),await D()))}async function Ia(t,e){const a=x(t);if(e&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Tt(p.categories,t),o=A();for(const r of n){const i=await Yt(r);i&&(i.isArchived=e,e&&(i.active=!1),i.archivedAt=e?o:void 0,i.updatedAt=o,await $t(i))}await D()}function Ca(t){const e=A();return{id:String(t.id),name:String(t.name),parentId:t.parentId==null||t.parentId===""?null:String(t.parentId),pathIds:Array.isArray(t.pathIds)?t.pathIds.map(String):[],pathNames:Array.isArray(t.pathNames)?t.pathNames.map(String):[],depth:Number.isFinite(t.depth)?Number(t.depth):0,sortOrder:Number.isFinite(t.sortOrder)?Number(t.sortOrder):0,evaluationMode:t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:"snapshot",spotValueCents:t.spotValueCents==null||t.spotValueCents===""?void 0:Number(t.spotValueCents),spotCode:t.spotCode==null||t.spotCode===""?void 0:String(t.spotCode),active:typeof t.active=="boolean"?t.active:!0,isArchived:typeof t.isArchived=="boolean"?t.isArchived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function $a(t){const e=A(),a=Number(t.quantity),n=Number(t.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${t.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${t.id}`);const o=t.unitPriceCents==null||t.unitPriceCents===""?void 0:Number(t.unitPriceCents);return{id:String(t.id),purchaseDate:String(t.purchaseDate),productName:String(t.productName),quantity:a,totalPriceCents:n,unitPriceCents:o,unitPriceSource:t.unitPriceSource==="entered"?"entered":"derived",categoryId:String(t.categoryId),active:typeof t.active=="boolean"?t.active:!0,archived:typeof t.archived=="boolean"?t.archived:!1,archivedAt:t.archivedAt?String(t.archivedAt):void 0,notes:t.notes?String(t.notes):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}function xa(t){const e=A(),a=t.scope==="portfolio"||t.scope==="market"?t.scope:"market",n=t.source==="derived"?"derived":"manual",o=t.evaluationMode==="spot"||t.evaluationMode==="snapshot"?t.evaluationMode:void 0,r=Number(t.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${t.id??"(unknown id)"}`);return{id:String(t.id??crypto.randomUUID()),capturedAt:t.capturedAt?String(t.capturedAt):e,scope:a,marketId:a==="market"&&String(t.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:t.quantity==null||t.quantity===""?void 0:Number(t.quantity),source:n,note:t.note?String(t.note):void 0,createdAt:t.createdAt?String(t.createdAt):e,updatedAt:t.updatedAt?String(t.updatedAt):e}}async function Ma(){const t=p.importText.trim();if(!t){alert("Paste JSON or choose a JSON file first.");return}let e;try{e=JSON.parse(t)}catch{alert("Import JSON is not valid.");return}if((e==null?void 0:e.schemaVersion)!==1&&(e==null?void 0:e.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(e.categories)||!Array.isArray(e.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=Zt(e.categories.map(Ca)),n=new Set(a.map(s=>s.id)),o=e.purchases.map($a);for(const s of o)if(!n.has(s.categoryId))throw new Error(`Inventory record ${s.id} references missing categoryId ${s.categoryId}`);const r=Array.isArray(e.settings)?e.settings.map(s=>({key:String(s.key),value:s.value})):[{key:"currencyCode",value:rt},{key:"currencySymbol",value:_},{key:"darkMode",value:tt}],i=e.schemaVersion===2&&Array.isArray(e.valuationSnapshots)?e.valuationSnapshots.map(xa):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await De({purchases:o,categories:a,settings:r,valuationSnapshots:i}),L({importText:""}),await D()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function de(t){return t.target instanceof HTMLElement?t.target:null}function Qt(t){const e=t.dataset.viewId,a=t.dataset.field,n=t.dataset.op,o=t.dataset.value,r=t.dataset.label;if(!e||!a||!n||o==null||!r)return;const i=(f,c)=>f.viewId===c.viewId&&f.field===c.field&&f.op===c.op&&f.value===c.value;let l=Le(p.filters,{viewId:e,field:a,op:n,value:o,label:r});const s=t.dataset.crossInventoryCategoryId;if(s){const f=x(s);if(f){const c=l.find(b=>i(b,{viewId:e,field:a,op:n,value:o}));if(c){const b=`Market: ${f.pathNames.join(" / ")}`;l=l.filter(h=>h.linkedToFilterId!==c.id);const y=l.findIndex(h=>i(h,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id}));if(y>=0){const h=l[y];l=[...l.slice(0,y),{...h,label:b,linkedToFilterId:c.id},...l.slice(y+1)]}else l=[...l,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id,label:b,linkedToFilterId:c.id}]}}}let d={filters:l};e==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(d.showArchivedInventory=!0),e==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),e==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(d.showArchivedCategories=!0),L(d)}function ue(){X!=null&&(window.clearTimeout(X),X=null)}function Aa(t){const e=p.filters.filter(n=>n.viewId===t),a=e[e.length-1];a&&L({filters:Xt(p.filters,a.id)})}g.addEventListener("click",async t=>{const e=de(t);if(!e)return;const a=e.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!e.closest(".filter-hit"))return;if(t instanceof MouseEvent){if(ue(),t.detail>1)return;X=window.setTimeout(()=>{X=null,Qt(a)},220);return}Qt(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;L({filters:Xt(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;L({filters:Ne(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){L({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){L({showArchivedCategories:a.checked});return}if(n==="open-create-category"){G({kind:"categoryCreate"});return}if(n==="open-create-inventory"){G({kind:"inventoryCreate"});return}if(n==="open-settings"){G({kind:"settings"});return}if(n==="apply-report-range"){const o=g.querySelector('input[name="reportDateFrom"]'),r=g.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,l=r.value,s=Wt(i),d=Wt(l,!0);if(s==null||d==null||s>d){at({tone:"warning",text:"Select a valid report date range."});return}L({reportDateFrom:i,reportDateTo:l});return}if(n==="reset-report-range"){L({reportDateFrom:ee(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="capture-snapshot"){try{await la()}catch{at({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(Q),i=!r.has(o);i?r.add(o):r.delete(o),Q=r,ba(o,i);return}if(n==="edit-category"){const o=a.dataset.id;o&&G({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&G({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!e.classList.contains("modal"))return;H();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await Sa(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await ka(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await Ia(o,r);return}if(n==="download-json"){ya(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ce(),"application/json");return}if(n==="replace-import"){await Ma();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Ee(),await D(),at({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Te(),L({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await D();return}}});g.addEventListener("dblclick",t=>{const e=t.target;if(!(e instanceof HTMLElement)||(ue(),e.closest("input, select, textarea, label")))return;const a=e.closest("button");if(a&&!a.classList.contains("link-cell")||e.closest("a"))return;const n=e.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){G({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&G({kind:"categoryEdit",categoryId:o})}});g.addEventListener("submit",async t=>{t.preventDefault();const e=t.target;if(e instanceof HTMLFormElement){if(e.id==="settings-form"){await ga(e);return}if(e.id==="category-form"){await va(e);return}if(e.id==="inventory-form"){await wa(e);return}}});g.addEventListener("input",t=>{const e=t.target;if(e instanceof HTMLTextAreaElement||e instanceof HTMLInputElement){if(e.name==="quantity"||e.name==="totalPrice"){const a=e.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&Lt(a)}if(e.id==="import-text"){p={...p,importText:e.value};return}(e.name==="reportDateFrom"||e.name==="reportDateTo")&&(e.name==="reportDateFrom"?p={...p,reportDateFrom:e.value}:p={...p,reportDateTo:e.value})}});g.addEventListener("change",async t=>{var o;const e=t.target;if(e instanceof HTMLSelectElement&&e.name==="categoryId"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(oe(r),Lt(r));return}if(e instanceof HTMLSelectElement&&e.name==="evaluationMode"){const r=e.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&re(r);return}if(!(e instanceof HTMLInputElement)||e.id!=="import-file")return;const a=(o=e.files)==null?void 0:o[0];if(!a)return;const n=await a.text();L({importText:n})});g.addEventListener("pointermove",t=>{const e=de(t);if(!e)return;const a=e.closest("[data-filter-section-view-id]");ot=(a==null?void 0:a.dataset.filterSectionViewId)||null});g.addEventListener("pointerleave",()=>{ot=null});document.addEventListener("keydown",t=>{if($.kind==="none"){if(t.key!=="Escape")return;const i=t.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!ot)return;t.preventDefault(),Aa(ot);return}if(t.key==="Escape"){t.preventDefault(),H();return}if(t.key!=="Tab")return;const e=ae();if(!e)return;const a=ne(e);if(!a.length){t.preventDefault(),e.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(t.shiftKey){(r===n||r instanceof Node&&!e.contains(r))&&(t.preventDefault(),o.focus());return}r===o&&(t.preventDefault(),n.focus())});window.addEventListener("pagehide",()=>{});window.addEventListener("beforeunload",()=>{});D();
