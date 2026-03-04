(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const ke=(e,t)=>t.some(a=>e instanceof a);let qe,Re;function bt(){return qe||(qe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ht(){return Re||(Re=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ce=new WeakMap,be=new WeakMap,pe=new WeakMap;function yt(e){const t=new Promise((a,n)=>{const o=()=>{e.removeEventListener("success",r),e.removeEventListener("error",i)},r=()=>{a(z(e.result)),o()},i=()=>{n(e.error),o()};e.addEventListener("success",r),e.addEventListener("error",i)});return pe.set(t,e),t}function gt(e){if(Ce.has(e))return;const t=new Promise((a,n)=>{const o=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",i),e.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",r),e.addEventListener("error",i),e.addEventListener("abort",i)});Ce.set(e,t)}let Ie={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return Ce.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return z(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ke(e){Ie=e(Ie)}function vt(e){return ht().includes(e)?function(...t){return e.apply($e(this),t),z(this.request)}:function(...t){return z(e.apply($e(this),t))}}function wt(e){return typeof e=="function"?vt(e):(e instanceof IDBTransaction&&gt(e),ke(e,bt())?new Proxy(e,Ie):e)}function z(e){if(e instanceof IDBRequest)return yt(e);if(be.has(e))return be.get(e);const t=wt(e);return t!==e&&(be.set(e,t),pe.set(t,e)),t}const $e=e=>pe.get(e);function St(e,t,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(e,t),s=z(i);return n&&i.addEventListener("upgradeneeded",c=>{n(z(i.result),c.oldVersion,c.newVersion,z(i.transaction),c)}),a&&i.addEventListener("blocked",c=>a(c.oldVersion,c.newVersion,c)),s.then(c=>{r&&c.addEventListener("close",()=>r()),o&&c.addEventListener("versionchange",u=>o(u.oldVersion,u.newVersion,u))}).catch(()=>{}),s}const kt=["get","getKey","getAll","getAllKeys","count"],Ct=["put","add","delete","clear"],he=new Map;function Oe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(he.get(t))return he.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,o=Ct.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||kt.includes(a)))return;const r=async function(i,...s){const c=this.transaction(i,o?"readwrite":"readonly");let u=c.store;return n&&(u=u.index(s.shift())),(await Promise.all([u[a](...s),o&&c.done]))[0]};return he.set(t,r),r}Ke(e=>({...e,get:(t,a,n)=>Oe(t,a)||e.get(t,a,n),has:(t,a)=>!!Oe(t,a)||e.has(t,a)}));const It=["continue","continuePrimaryKey","advance"],je={},xe=new WeakMap,Ye=new WeakMap,$t={get(e,t){if(!It.includes(t))return e[t];let a=je[t];return a||(a=je[t]=function(...n){xe.set(this,Ye.get(this)[t](...n))}),a}};async function*xt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,$t);for(Ye.set(a,t),pe.set(a,$e(t));t;)yield a,t=await(xe.get(a)||t.continue()),xe.delete(a)}function Be(e,t){return t===Symbol.asyncIterator&&ke(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&ke(e,[IDBIndex,IDBObjectStore])}Ke(e=>({...e,get(t,a,n){return Be(t,a)?xt:e.get(t,a,n)},has(t,a){return Be(t,a)||e.has(t,a)}}));const E=St("investment_purchase_tracker",3,{async upgrade(e,t,a,n){const o=n,r=e.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let c=await r.openCursor();for(;c;)await i.put(c.value),c=await c.continue()}let s=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),!e.objectStoreNames.contains("valuationSnapshots")){const c=e.createObjectStore("valuationSnapshots",{keyPath:"id"});c.createIndex("by_capturedAt","capturedAt"),c.createIndex("by_scope","scope"),c.createIndex("by_marketId","marketId"),c.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let c=await i.openCursor();for(;c;){const u=c.value;let p=!1;typeof u.active!="boolean"&&(u.active=!0,p=!0),typeof u.archived!="boolean"&&(u.archived=!1,p=!0),p&&(u.updatedAt=new Date().toISOString(),await c.update(u)),c=await c.continue()}}if(s){let c=await s.openCursor();for(;c;){const u=c.value;let p=!1;typeof u.active!="boolean"&&(u.active=!0,p=!0),typeof u.isArchived!="boolean"&&(u.isArchived=!1,p=!0),p&&(u.updatedAt=new Date().toISOString(),await c.update(u)),c=await c.continue()}}}});async function Mt(){return(await E).getAll("inventory")}async function ie(e){await(await E).put("inventory",e)}async function Ee(e){return(await E).get("inventory",e)}async function Dt(){return(await E).getAll("categories")}async function Me(e){await(await E).put("categories",e)}async function Xe(e){return(await E).get("categories",e)}async function At(){return(await E).getAll("settings")}async function N(e,t){await(await E).put("settings",{key:e,value:t})}async function Tt(){return(await E).getAll("valuationSnapshots")}async function Et(e){const a=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);for(const n of e.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Lt(){const t=(await E).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.objectStore("valuationSnapshots").clear(),await t.done}async function Ft(){const t=(await E).transaction("valuationSnapshots","readwrite");await t.objectStore("valuationSnapshots").clear(),await t.done}function Ge(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function Nt(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ze(e,t){const a=new Set([t]);let n=!0;for(;n;){n=!1;for(const o of e)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return e.filter(o=>!a.has(o.id))}function Pt(e,t){return e.filter(a=>a.viewId!==t)}function De(e,t,a,n,o){const r=t.filter(s=>s.viewId===a);if(!r.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>r.every(c=>{var l;const u=i.get(c.field);if(!u)return!0;const p=u.getValue(s);if(c.op==="eq")return String(p)===c.value;if(c.op==="isEmpty")return Ge(p);if(c.op==="isNotEmpty")return!Ge(p);if(c.op==="contains")return String(p).toLowerCase().includes(c.value.toLowerCase());if(c.op==="inCategorySubtree"){const b=((l=o==null?void 0:o.categoryDescendantsMap)==null?void 0:l.get(c.value))||new Set([c.value]),h=String(p);return b.has(h)}return!0}))}function Vt(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:t,children:a}}function fe(e){const{children:t}=Vt(e),a=new Map;function n(o){const r=new Set([o]);for(const i of t.get(o)||[])for(const s of n(i.id))r.add(s);return a.set(o,r),r}for(const o of e)a.has(o.id)||n(o.id);return a}function et(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),o.unshift(s.id),r.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return e.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Le(e,t){return[...fe(e).get(t)||new Set([t])]}function qt(e,t){const a=fe(t),n=new Map;for(const o of t){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const s of e)r.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(o.id,i)}return n}const tt=document.querySelector("#app");if(!tt)throw new Error("#app not found");const v=tt;let x={kind:"none"},Y=null,B=null,R=null,P=null,V=null,q=null,Ue=!1,ae=null,ye=!1,ge=null,X=null,se=null,ze=!1,He=!1,Q=new Set,_e=!1,ne=null,K=null,Z=null,f={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:at(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const le="USD",H="$",ee=!1,ce=!1,de=!1,Rt=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function A(){return new Date().toISOString()}function Ot(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function at(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function ve(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function S(e){const t=F("currencySymbol")||H,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function jt(e){const t=F("currencySymbol")||H,n=Math.abs(e)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${e<0?"-":""}${t}${Math.round(o)}${r}`}function ue(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function F(e){var t;return(t=f.settings.find(a=>a.key===e))==null?void 0:t.value}function Bt(e){var n;const t=(n=e.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof t=="boolean"?t:ee;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function L(e){f={...f,...e},O()}function re(e){K!=null&&(window.clearTimeout(K),K=null),Z=e,O(),e&&(K=window.setTimeout(()=>{K=null,Z=null,O()},3500))}function G(e){x.kind==="none"&&document.activeElement instanceof HTMLElement&&(Y=document.activeElement),x=e,O()}function _(){x.kind!=="none"&&(x={kind:"none"},O(),Y&&Y.isConnected&&Y.focus(),Y=null)}function nt(){return v.querySelector(".modal-panel")}function ot(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Gt(){if(x.kind==="none")return;const e=nt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(ot(e)[0]||e).focus()}function Ut(){var e,t;(e=B==null?void 0:B.destroy)==null||e.call(B),(t=R==null?void 0:R.destroy)==null||t.call(R),B=null,R=null}function Ae(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){ge==null&&(ge=window.setTimeout(()=>{ge=null,Ae(),O()},500)),ye||(ye=!0,window.addEventListener("load",()=>{ye=!1,Ae(),O()},{once:!0}));return}const n=v.querySelector("#categories-table"),o=v.querySelector("#inventory-table"),r=(s,c)=>{var u,p;return t?new t(s,c):a?((p=(u=a(s)).DataTable)==null?void 0:p.call(u,c))??null:null};n&&(B=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(R=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),Xt(o,R))}function zt(e,t,a){const n=t.find(r=>r.key==="computedTotalCents");return n?(a?e:e.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function J(e,t){const a=v.querySelector(`#${e}`),n=v.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=t,n.hidden=!1)}function Te(e){const t=v.querySelector(`#${e}`),a=v.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Ht(){P==null||P.dispose(),V==null||V.dispose(),q==null||q.dispose(),P=null,V=null,q=null}function _t(){Ue||(Ue=!0,window.addEventListener("resize",()=>{ae!=null&&window.clearTimeout(ae),ae=window.setTimeout(()=>{ae=null,P==null||P.resize(),V==null||V.resize(),q==null||q.resize()},120)}))}function Wt(){const e=new Map;for(const t of f.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Qt(e){return{labels:[],series:[],overallValues:[],showOverallComparison:!1}}function Jt(e){const t="growth-trend-chart",a=v.querySelector(`#${t}`);if(!a)return;if(!window.echarts){J(t,"Chart unavailable: ECharts not loaded.");return}const n=e.overallValues.some(b=>typeof b=="number"),o=e.series.length>0;if(!e.labels.length||!n&&!o){J(t,"No snapshot trend data for this period yet.");return}Te(t);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",s=window.matchMedia("(max-width: 767.98px)").matches?11:13,c=r?"#e9ecef":"#212529",u=r?"#ced4da":"#495057",p=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],l=e.labels.length>12?Math.ceil(e.labels.length/6):1;q=window.echarts.init(a),q.setOption({color:p,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:c,fontSize:s}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:c,fontSize:s},formatter:b=>{var y;if(!b.length)return"";const h=b.filter(M=>typeof M.value=="number").map(M=>`${d(M.seriesName||"")}: ${S(M.value)}`);return[`<strong>${d(((y=b[0])==null?void 0:y.axisValueLabel)||"")}</strong>`,...h].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:e.labels,boundaryGap:!1,axisLabel:{color:u,fontSize:s,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:b=>b%l===0||b===e.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:u}}},yAxis:{type:"value",position:"left",axisLabel:{color:u,margin:6,fontSize:s,formatter:b=>jt(b)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:e.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...e.series.map((b,h)=>({name:b.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:b.values,lineStyle:{width:h===0?2.6:2}}))]})}function Kt(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function Yt(e){const t="markets-allocation-chart",a="markets-top-chart",n=v.querySelector(`#${t}`),o=v.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){J(t,"Chart unavailable: ECharts not loaded."),J(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){J(t,"No eligible market totals to chart."),J(a,"No eligible market totals to chart.");return}Te(t),Te(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=r?11:13,c=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],u=i?"#e9ecef":"#212529",p=i?"#ced4da":"#495057",l=e.map(g=>({name:g.label,value:g.totalCents})),b=e.slice(0,5),h=[...b].reverse(),y=b.reduce((g,w)=>Math.max(g,w.totalCents),0),M=y>0?Math.ceil(y*1.2):1;P=window.echarts.init(n),V=window.echarts.init(o),P.setOption({color:c,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:g=>`${d(g.name)}: ${S(g.value)} (${g.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:u,fontSize:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:u,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:l,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:g=>{const w=g.percent??0;return`${Math.round(w)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:p,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),V.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:g=>{const w=g[0];return w?`${d(w.name)}: ${S(w.value)}`:""}},xAxis:{type:"value",max:M,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:h.map(g=>g.label),axisLabel:{color:p,fontSize:s,formatter:g=>Kt(g)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:h.map(g=>g.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:u,fontSize:s,formatter:g=>S(g.value)}}]}),_t()}function Xt(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var l,b,h;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),s=i.indexOf(o);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const c=(l=t.order)==null?void 0:l.call(t),u=Array.isArray(c)?c[0]:void 0,p=u&&u[0]===s&&u[1]==="asc"?"desc":"asc";(b=t.order)==null||b.call(t,[[s,p]]),(h=t.draw)==null||h.call(t,!1)},!0)}async function T(){var u,p;const[e,t,a,n]=await Promise.all([Mt(),Dt(),At(),Tt()]),o=et(t).sort((l,b)=>l.sortOrder-b.sortOrder||l.name.localeCompare(b.name));a.some(l=>l.key==="currencyCode")||(await N("currencyCode",le),a.push({key:"currencyCode",value:le})),a.some(l=>l.key==="currencySymbol")||(await N("currencySymbol",H),a.push({key:"currencySymbol",value:H})),a.some(l=>l.key==="darkMode")||(await N("darkMode",ee),a.push({key:"darkMode",value:ee})),a.some(l=>l.key==="showMarketsGraphs")||(await N("showMarketsGraphs",ce),a.push({key:"showMarketsGraphs",value:ce})),a.some(l=>l.key==="showGrowthGraph")||(await N("showGrowthGraph",de),a.push({key:"showGrowthGraph",value:de})),Bt(a);let r=null,i=null;try{const l=await((p=(u=navigator.storage)==null?void 0:u.estimate)==null?void 0:p.call(u));r=typeof(l==null?void 0:l.usage)=="number"?l.usage:null,i=typeof(l==null?void 0:l.quota)=="number"?l.quota:null}catch{r=null,i=null}let s=f.reportDateFrom,c=f.reportDateTo;if(!_e){const l=Ot(e);l&&(s=l),c=new Date().toISOString().slice(0,10),_e=!0}f={...f,inventoryRecords:e,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i,reportDateFrom:s,reportDateTo:c},O()}function D(e){if(e)return f.categories.find(t=>t.id===e)}function Zt(e){const t=D(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function ea(e){return Zt(e)}function ta(e){const t=D(e);return t?t.pathIds.some(a=>{var n;return((n=D(a))==null?void 0:n.active)===!1}):!1}function aa(e){const t=D(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=D(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function na(e){return e.active&&!aa(e)}function oe(e){return e==null?"":(e/100).toFixed(2)}function Fe(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const o=Number(t.value),r=ue(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function rt(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="baselineValue"]');!t||!a||!n||t.value==="create"&&(n.value=a.value)}function it(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),n=e.querySelector('input[name="quantity"]');if(!t||!a||!n)return;const o=D(t.value),r=(o==null?void 0:o.evaluationMode)==="snapshot";a.hidden=r,r?((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0):n.readOnly=!1}function st(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]'),o=e.querySelector("[data-spot-code-group]"),r=e.querySelector('input[name="spotCode"]');if(!t||!a||!n||!o||!r)return;const i=t.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function U(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function oa(e){return e.active&&!e.archived}function ra(){const e=f.inventoryRecords.filter(oa),t=f.categories.filter(r=>!r.isArchived),a=qt(e,t),n=new Map(f.categories.map(r=>[r.id,r])),o=new Map;for(const r of e){const i=n.get(r.categoryId);if(i)for(const s of i.pathIds)o.set(s,(o.get(s)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function ia(e,t){const a=new Map;f.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const i=a.get(r.parentId)||[];i.push(r),a.set(r.parentId,i)});const n=new Map,o=r=>{const i=n.get(r);if(i!=null)return i;const s=D(r);if(!s||s.isArchived)return n.set(r,0),0;let c=0;const u=a.get(s.id)||[];return u.length>0?c=u.reduce((p,l)=>p+o(l.id),0):s.evaluationMode==="snapshot"?c=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?c=(t.get(s.id)||0)*s.spotValueCents:c=e.get(s.id)||0,n.set(r,c),c};return f.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function lt(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>ea(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>e.quantity,getDisplay:e=>String(e.quantity),filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity),getDisplay:e=>S(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)),filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>S(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"baselineValueCents",label:"Baseline value",getValue:e=>e.baselineValueCents??"",getDisplay:e=>e.baselineValueCents==null?"":S(e.baselineValueCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function sa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":S(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function ct(){return f.showArchivedInventory?f.inventoryRecords:f.inventoryRecords.filter(e=>!e.archived)}function la(){return f.showArchivedCategories?f.categories:f.categories.filter(e=>!e.isArchived)}function ca(){const e=lt(),t=sa(),a=t.filter(l=>l.key==="name"||l.key==="parent"||l.key==="path"),n=t.filter(l=>l.key!=="name"&&l.key!=="parent"&&l.key!=="path"),o=fe(f.categories),r=De(ct(),f.filters,"inventoryTable",e,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:s}=ra(),c=ia(i,s),u=[...a,{key:"computedQty",label:"Qty",getValue:l=>s.get(l.id)||0,getDisplay:l=>String(s.get(l.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:l=>i.get(l.id)||0,getDisplay:l=>S(i.get(l.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:l=>c.get(l.id)||0,getDisplay:l=>S(c.get(l.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:l=>l.active&&!l.isArchived,getDisplay:l=>l.active&&!l.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],p=De(la(),f.filters,"categoriesList",u);return{inventoryColumns:e,categoryColumns:u,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:p,categoryTotals:i,categoryQty:s}}async function da(e){re({tone:"warning",text:"Snapshot capture is currently disabled while Growth logic is being redesigned."})}function We(e,t,a=""){const n=f.filters.filter(o=>o.viewId===e);return`
    <div class="chips-wrap mb-2">
      ${n.length?`
        <div class="chips-inline small text-body-secondary">
          <span class="me-1">Filter:</span>
          <nav class="chips-list d-inline-block align-middle" aria-label="${d(t)} filters" style="--bs-breadcrumb-divider: '>';">
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
  `}function we(e,t,a){const n=a.getValue(t),o=a.getDisplay(t),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const c=String(t.categoryId),u=ta(c);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}${u?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const c=t.parentId;if(typeof c=="string"&&c)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(c)}"><span class="filter-hit">${d(o)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const c=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(c)}"><span class="filter-hit">${d(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}</span></button>`}function dt(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function ua(e,t){const a=e.map((n,o)=>{let r=0,i=!1;for(const c of t){const u=n.getValue(c);typeof u=="number"&&Number.isFinite(u)&&(r+=u,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?S(r):dt(r):o===0?"Totals":"";return`<th class="${U(n)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function pa(e,t){const a=new Set(t.map(i=>i.id)),n=t.filter(i=>!i.parentId||!a.has(i.parentId)),o=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),r=e.map((i,s)=>{const c=o.has(String(i.key))?n:t;let u=0,p=!1;for(const b of c){const h=i.getValue(b);typeof h=="number"&&Number.isFinite(h)&&(u+=h,p=!0)}const l=p?String(i.key).toLowerCase().includes("cents")?S(u):dt(u):s===0?"Totals":"";return`<th class="${U(i)}">${d(l)}</th>`});return r.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${r.join("")}</tr></tfoot>`}function Qe(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function fa(e,t){const a=[...e];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=t.get(r);if(i!=null&&i.has(o))return!1}return!0})}function ma(e){const t=new Set(f.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(f.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&t.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?fa(a,e):f.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function ba(e){const t=ma(e),a=Wt(),n=new Map;for(const p of f.inventoryRecords){if(!p.active||p.archived)continue;const l=p.baselineValueCents??0;if(!Number.isFinite(l))continue;const b=D(p.categoryId);if(b)for(const h of b.pathIds)n.set(h,(n.get(h)||0)+l)}const o=[],r={};let i=0;const s=p=>{const l=D(p);if(!l)return null;const b=n.get(p)||0;return{marketId:p,marketLabel:l.pathNames.join(" / "),startValueCents:b,endValueCents:null,contributionsCents:0,netGrowthCents:null,growthPct:null}},c=new Set,u=p=>c.has(p)?[]:(c.add(p),(a.get(p)||[]).map(l=>s(l)).filter(l=>l!=null).sort((l,b)=>l.marketLabel.localeCompare(b.marketLabel)));for(const p of t){const l=s(p);l&&(r[p]=u(p),i+=l.startValueCents||0,o.push(l))}return{scopeMarketIds:t,rows:o,childRowsByParent:r,startTotalCents:i,endTotalCents:0,contributionsTotalCents:0,netGrowthTotalCents:0,hasManualSnapshots:!1}}function Se(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function W(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function ha(){if(x.kind==="none")return"";const e=F("currencySymbol")||H,t=(a,n)=>f.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(x.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((F("currencyCode")||le).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Rt.map(a=>`<option value="${d(a.value)}" ${(F("currencySymbol")||H)===a.value?"selected":""}>${d(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${F("darkMode")??ee?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showGrowthGraph" ${F("showGrowthGraph")??de?"checked":""} />
                  <span class="form-check-label">Show Growth graph</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${F("showMarketsGraphs")??ce?"checked":""} />
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
    `;if(x.kind==="categoryCreate"||x.kind==="categoryEdit"){const a=x.kind==="categoryEdit",n=x.kind==="categoryEdit"?D(x.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Le(f.categories,n.id)):void 0,r=fe(f.categories);return De(ct(),f.filters,"inventoryTable",lt(),{categoryDescendantsMap:r}),`
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(oe(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if(x.kind==="inventoryCreate")return`
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
    `;if(x.kind==="inventoryEdit"){const a=x,n=f.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
            <input type="hidden" name="baselineValue" value="${d(oe(n.baselineValueCents))}" />
            <label class="form-label mb-0">Date<input class="form-control" type="date" name="purchaseDate" required value="${d(n.purchaseDate)}" /></label>
            <label>Market
              <select class="form-select" name="categoryId" required>
                <option value="">Select market</option>
                ${t(void 0,n.categoryId)}
              </select>
            </label>
            <label class="form-label mb-0">Product name<input class="form-control" name="productName" required value="${d(n.productName)}" /></label>
            <label class="form-label mb-0" data-quantity-group>Quantity<input class="form-control" type="number" step="any" min="0" name="quantity" required value="${d(String(n.quantity))}" /></label>
            <label class="form-label mb-0">Total price
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(oe(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(oe(n.unitPriceCents))}" disabled />
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
    `:""}return""}function O(){const e=window.scrollX,t=window.scrollY,a=v.querySelector('details[data-section="data-tools"]');a&&(ze=a.open);const n=v.querySelector('details[data-section="investments"]');n&&(He=n.open),Ht(),Ut();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:c}=ca(),u=f.filters.some(m=>m.viewId==="categoriesList"),p=zt(c,r,u),l=ba(i),b=Qt(),h=F("showGrowthGraph")??de,y=F("showMarketsGraphs")??ce,M=new Set([...Q].filter(m=>{var C;return(((C=l.childRowsByParent[m])==null?void 0:C.length)||0)>0}));M.size!==Q.size&&(Q=M);const g=l.startTotalCents>0?l.netGrowthTotalCents/l.startTotalCents:null,w=f.exportText||ut(),I=s.map(m=>`
        <tr class="${[na(m)?"":"row-inactive",m.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${m.id}">
          ${o.map(k=>`<td class="${U(k)}">${we("inventoryTable",m,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${m.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),me=new Set(c.map(m=>m.id)),j=new Map;for(const m of c){const C=m.parentId&&me.has(m.parentId)?m.parentId:null,k=j.get(C)||[];k.push(m),j.set(C,k)}for(const m of j.values())m.sort((C,k)=>C.sortOrder-k.sortOrder||C.name.localeCompare(k.name));const Ne=[],Pe=(m,C)=>{const k=j.get(m)||[];for(const $ of k)Ne.push({category:$,depth:C}),Pe($.id,C+1)};Pe(null,0);const mt=Ne.map(({category:m,depth:C})=>`
      <tr class="${[m.active?"":"row-inactive",m.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${m.id}">
        ${r.map(k=>{if(k.key==="name"){const $=C>0?(C-1)*1.1:0;return`<td class="${U(k)}"><div class="market-name-wrap" style="padding-left:${$.toFixed(2)}rem">${C>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${we("categoriesList",m,k)}</div></td>`}return`<td class="${U(k)}">${we("categoriesList",m,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${m.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");v.innerHTML=`
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
        ${Z?`<div class="alert alert-${Z.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(Z.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
            <div class="d-flex align-items-center gap-2">
              <span class="small text-body-secondary">
                Scope: ${l.scopeMarketIds.length?`${l.scopeMarketIds.length} market${l.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
              </span>
            </div>
          </div>
          <div class="growth-report-controls d-flex align-items-center gap-2 flex-wrap my-2">
            <label class="form-label mb-0 growth-control-label">From
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateFrom" value="${d(f.reportDateFrom)}" />
            </label>
            <label class="form-label mb-0 growth-control-label">To
              <input class="form-control form-control-sm growth-control-input" type="date" name="reportDateTo" value="${d(f.reportDateTo)}" />
            </label>
            <button type="button" class="btn btn-sm btn-outline-primary" data-action="apply-report-range">Apply</button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="reset-report-range">Reset</button>
          </div>
          ${h?`
            <div class="growth-widget-card card border-0 mb-2">
              <div class="card-body p-1 p-md-2">
                <div class="growth-chart-frame">
                  <div id="growth-trend-chart" class="growth-chart-canvas" role="img" aria-label="Growth over time chart"></div>
                  <p class="markets-chart-empty text-body-secondary small mb-0" data-chart-empty-for="growth-trend-chart" hidden></p>
                </div>
              </div>
            </div>
          `:""}
          ${l.rows.length===0?`
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
                  ${l.rows.map(m=>{const C=l.childRowsByParent[m.marketId]||[],k=Q.has(m.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${C.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(m.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(m.marketLabel)}
                        </td>
                      <td class="text-end">${m.startValueCents==null?"—":d(S(m.startValueCents))}</td>
                      <td class="text-end">${m.endValueCents==null?"—":d(S(m.endValueCents))}</td>
                      <td class="text-end">${d(S(m.contributionsCents))}</td>
                      <td class="text-end ${W(m.netGrowthCents)}">${m.netGrowthCents==null?"—":d(S(m.netGrowthCents))}</td>
                      <td class="text-end ${W(m.growthPct)}">${d(Se(m.growthPct))}</td>
                      </tr>
                      ${C.map($=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(m.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d($.marketLabel)}</td>
                              <td class="text-end">${$.startValueCents==null?"—":d(S($.startValueCents))}</td>
                              <td class="text-end">${$.endValueCents==null?"—":d(S($.endValueCents))}</td>
                              <td class="text-end">${d(S($.contributionsCents))}</td>
                              <td class="text-end ${W($.netGrowthCents)}">${$.netGrowthCents==null?"—":d(S($.netGrowthCents))}</td>
                              <td class="text-end ${W($.growthPct)}">${d(Se($.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(S(l.startTotalCents))}</th>
                    <th class="text-end">${d(S(l.endTotalCents))}</th>
                    <th class="text-end">${d(S(l.contributionsTotalCents))}</th>
                    <th class="text-end ${W(l.netGrowthTotalCents)}">${d(S(l.netGrowthTotalCents))}</th>
                    <th class="text-end ${W(g)}">${d(Se(g))}</th>
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
        ${y?`
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
        ${We("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${f.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(m=>`<th class="${U(m)}">${d(m.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${mt}
            </tbody>
            ${pa(r,c)}
          </table>
        </div>
        </div>
      </section>

      <details class="card shadow-sm details-card" data-filter-section="investments" data-section="investments" data-filter-section-view-id="inventoryTable" ${He?"open":""}>
        <summary class="card-header">Investments</summary>
        <div class="details-content card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Investments</h2>
            <div class="d-flex align-items-center gap-2 justify-content-end">
              <button type="button" class="btn btn-sm btn-success" data-action="open-create-inventory">Create New</button>
            </div>
          </div>
          ${We("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${f.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(m=>`<th class="${U(m)}">${d(m.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${I}
              </tbody>
              ${ua(o,s)}
            </table>
          </div>
        </div>
      </details>

      <details class="card shadow-sm details-card" data-section="data-tools" ${ze?"open":""}>
        <summary class="card-header">Data Tools</summary>
        <div class="details-content card-body">
        <div class="tools-grid">
          <div>
            <div class="toolbar-row">
              <button type="button" class="btn btn-outline-primary btn-sm" data-action="download-json">Download JSON</button>
              <button type="button" class="btn btn-outline-warning btn-sm" data-action="reset-snapshots">Reset Snapshots</button>
            </div>
            <div class="small text-body-secondary mb-2">
              Storage used (browser estimate): ${f.storageUsageBytes==null?"Unavailable":f.storageQuotaBytes==null?d(ve(f.storageUsageBytes)):`${d(ve(f.storageUsageBytes))} of ${d(ve(f.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${d(w)}</textarea>
            </label>
          </div>
          <div>
            <div class="toolbar-row">
              <input class="form-control" type="file" id="import-file" accept="application/json,.json" />
              <button type="button" class="btn btn-warning btn-sm" data-action="replace-import">Replace all from JSON</button>
            </div>
            <label class="form-label">Import JSON (replace all)
              <textarea class="form-control" id="import-text" rows="10" placeholder='Paste ExportBundleV1/V2 JSON here'>${d(f.importText)}</textarea>
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
  `;const te=v.querySelector("#inventory-form");te&&(it(te),Fe(te),rt(te));const Ve=v.querySelector("#category-form");Ve&&st(Ve),Gt(),Yt(p),Jt(b),Ae(),window.scrollTo(e,t)}function ya(e,t){const a=v.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const o of a)o.hidden=!t;const n=v.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);n&&(n.textContent=t?"▾":"▸",n.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function ga(){return{schemaVersion:2,exportedAt:A(),settings:f.settings,categories:f.categories,purchases:f.inventoryRecords,valuationSnapshots:f.valuationSnapshots}}function ut(){return JSON.stringify(ga(),null,2)}function va(e,t,a){const n=new Blob([t],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=e,r.click(),URL.revokeObjectURL(o)}async function wa(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim(),o=t.get("darkMode")==="on",r=t.get("showGrowthGraph")==="on",i=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await N("currencyCode",a),await N("currencySymbol",n),await N("darkMode",o),await N("showGrowthGraph",r),await N("showMarketsGraphs",i),_(),await T()}async function Sa(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),o=String(t.get("name")||"").trim(),r=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),c=String(t.get("spotCode")||"").trim(),u=t.get("active")==="on",p=i==="spot"||i==="snapshot"?i:void 0,l=p==="spot"&&s?ue(s):void 0,b=p==="spot"&&c?c:void 0;if(!o)return;if(p==="spot"&&s&&l==null){alert("Spot value is invalid.");return}const h=l??void 0,y=r||null;if(y&&!D(y)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const I=await Xe(n);if(!I){alert("Market not found.");return}if(y===I.id){alert("A category cannot be its own parent.");return}if(y&&Le(f.categories,I.id).includes(y)){alert("A category cannot be moved under its own subtree.");return}const me=I.parentId!==y;I.name=o,I.parentId=y,I.evaluationMode=p,I.spotValueCents=h,I.spotCode=b,I.active=u,me&&(I.sortOrder=f.categories.filter(j=>j.parentId===y&&j.id!==I.id).length),I.updatedAt=A(),await Me(I),_(),await T();return}const M=A(),g=f.categories.filter(I=>I.parentId===y).length,w={id:crypto.randomUUID(),name:o,parentId:y,pathIds:[],pathNames:[],depth:0,sortOrder:g,evaluationMode:p,spotValueCents:h,spotCode:b,active:u,isArchived:!1,createdAt:M,updatedAt:M};await Me(w),_(),await T()}async function ka(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),o=String(t.get("purchaseDate")||""),r=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=ue(String(t.get("totalPrice")||"")),c=String(t.get("baselineValue")||"").trim(),u=c===""?null:ue(c),p=a==="create"?s??void 0:u??void 0,l=String(t.get("categoryId")||""),b=t.get("active")==="on",h=String(t.get("notes")||"").trim();if(!o||!r||!l){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&u!=null&&u<0){alert("Baseline value is invalid.");return}if(a!=="create"&&c!==""&&u==null){alert("Baseline value is invalid.");return}if(!D(l)){alert("Select a valid category.");return}const y=Math.round(s/i);if(a==="edit"){if(!n)return;const w=await Ee(n);if(!w){alert("Inventory record not found.");return}w.purchaseDate=o,w.productName=r,w.quantity=i,w.totalPriceCents=s,w.baselineValueCents=p,w.unitPriceCents=y,w.unitPriceSource="derived",w.categoryId=l,w.active=b,w.notes=h||void 0,w.updatedAt=A(),await ie(w),_(),await T();return}const M=A(),g={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:s,baselineValueCents:p,unitPriceCents:y,unitPriceSource:"derived",categoryId:l,active:b,archived:!1,notes:h||void 0,createdAt:M,updatedAt:M};await ie(g),_(),await T()}async function Ca(e,t){const a=await Ee(e);a&&(a.active=t,a.updatedAt=A(),await ie(a),await T())}async function Ia(e,t){const a=await Ee(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,t&&(a.active=!1),a.archivedAt=t?A():void 0,a.updatedAt=A(),await ie(a),await T()))}async function $a(e,t){const a=D(e);if(t&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Le(f.categories,e),o=A();for(const r of n){const i=await Xe(r);i&&(i.isArchived=t,t&&(i.active=!1),i.archivedAt=t?o:void 0,i.updatedAt=o,await Me(i))}await T()}function xa(e){const t=A();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Ma(e){const t=A(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const o=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,baselineValueCents:Number.isFinite(o)?o:void 0,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Da(e){const t=A(),a=e.scope==="portfolio"||e.scope==="market"?e.scope:"market",n=e.source==="derived"?"derived":"manual",o=e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:void 0,r=Number(e.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${e.id??"(unknown id)"}`);return{id:String(e.id??crypto.randomUUID()),capturedAt:e.capturedAt?String(e.capturedAt):t,scope:a,marketId:a==="market"&&String(e.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:e.quantity==null||e.quantity===""?void 0:Number(e.quantity),source:n,note:e.note?String(e.note):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function Aa(){const e=f.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=et(t.categories.map(xa)),n=new Set(a.map(c=>c.id)),o=t.purchases.map(Ma);for(const c of o)if(!n.has(c.categoryId))throw new Error(`Inventory record ${c.id} references missing categoryId ${c.categoryId}`);const r=Array.isArray(t.settings)?t.settings.map(c=>({key:String(c.key),value:c.value})):[{key:"currencyCode",value:le},{key:"currencySymbol",value:H},{key:"darkMode",value:ee}],i=t.schemaVersion===2&&Array.isArray(t.valuationSnapshots)?t.valuationSnapshots.map(Da):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Et({purchases:o,categories:a,settings:r,valuationSnapshots:i}),L({importText:""}),await T()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function pt(e){return e.target instanceof HTMLElement?e.target:null}function Je(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,o=e.dataset.value,r=e.dataset.label;if(!t||!a||!n||o==null||!r)return;const i=(p,l)=>p.viewId===l.viewId&&p.field===l.field&&p.op===l.op&&p.value===l.value;let s=Nt(f.filters,{viewId:t,field:a,op:n,value:o,label:r});const c=e.dataset.crossInventoryCategoryId;if(c){const p=D(c);if(p){const l=s.find(b=>i(b,{viewId:t,field:a,op:n,value:o}));if(l){const b=`Market: ${p.pathNames.join(" / ")}`;s=s.filter(y=>y.linkedToFilterId!==l.id);const h=s.findIndex(y=>i(y,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id}));if(h>=0){const y=s[h];s=[...s.slice(0,h),{...y,label:b,linkedToFilterId:l.id},...s.slice(h+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:p.id,label:b,linkedToFilterId:l.id}]}}}let u={filters:s};t==="inventoryTable"&&a==="archived"&&o==="true"&&!f.showArchivedInventory&&(u.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!f.showArchivedCategories&&(u.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&o==="false"&&!f.showArchivedCategories&&(u.showArchivedCategories=!0),L(u)}function ft(){X!=null&&(window.clearTimeout(X),X=null)}function Ta(e){const t=f.filters.filter(n=>n.viewId===e),a=t[t.length-1];a&&L({filters:Ze(f.filters,a.id)})}v.addEventListener("click",async e=>{const t=pt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(ft(),e.detail>1)return;X=window.setTimeout(()=>{X=null,Je(a)},220);return}Je(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;L({filters:Ze(f.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;L({filters:Pt(f.filters,o)});return}if(n==="toggle-show-archived-inventory"){L({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){L({showArchivedCategories:a.checked});return}if(n==="open-create-category"){G({kind:"categoryCreate"});return}if(n==="open-create-inventory"){G({kind:"inventoryCreate"});return}if(n==="open-settings"){G({kind:"settings"});return}if(n==="apply-report-range"){const o=v.querySelector('input[name="reportDateFrom"]'),r=v.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,s=r.value,c=Qe(i),u=Qe(s,!0);if(c==null||u==null||c>u){re({tone:"warning",text:"Select a valid report date range."});return}L({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){L({reportDateFrom:at(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="copy-total-to-baseline"){const o=a.closest("form");if(!(o instanceof HTMLFormElement)||o.id!=="inventory-form")return;const r=o.querySelector('input[name="totalPrice"]'),i=o.querySelector('input[name="baselineValue"]'),s=o.querySelector('[data-role="baseline-copy-status"]');if(!r||!i)return;i.value=r.value.trim(),s&&(s.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',ne!=null&&window.clearTimeout(ne),ne=window.setTimeout(()=>{ne=null,s.isConnected&&(s.textContent="")},1800));return}if(n==="capture-snapshot"){try{await da()}catch{re({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(Q),i=!r.has(o);i?r.add(o):r.delete(o),Q=r,ya(o,i);return}if(n==="edit-category"){const o=a.dataset.id;o&&G({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&G({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;_();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await Ca(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await Ia(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await $a(o,r);return}if(n==="download-json"){va(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,ut(),"application/json");return}if(n==="replace-import"){await Aa();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Ft(),await T(),re({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Lt(),L({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await T();return}}});v.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(ft(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){G({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&G({kind:"categoryEdit",categoryId:o})}});v.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await wa(t);return}if(t.id==="category-form"){await Sa(t);return}if(t.id==="inventory-form"){await ka(t);return}}});v.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Fe(a),rt(a))}if(t.id==="import-text"){f={...f,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?f={...f,reportDateFrom:t.value}:f={...f,reportDateTo:t.value})}});v.addEventListener("change",async e=>{var o;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const r=t.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(it(r),Fe(r));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const r=t.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&st(r);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(o=t.files)==null?void 0:o[0];if(!a)return;const n=await a.text();L({importText:n})});v.addEventListener("pointermove",e=>{const t=pt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");se=(a==null?void 0:a.dataset.filterSectionViewId)||null});v.addEventListener("pointerleave",()=>{se=null});document.addEventListener("keydown",e=>{if(x.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!se)return;e.preventDefault(),Ta(se);return}if(e.key==="Escape"){e.preventDefault(),_();return}if(e.key!=="Tab")return;const t=nt();if(!t)return;const a=ot(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(e.shiftKey){(r===n||r instanceof Node&&!t.contains(r))&&(e.preventDefault(),o.focus());return}r===o&&(e.preventDefault(),n.focus())});window.addEventListener("pagehide",()=>{});window.addEventListener("beforeunload",()=>{});T();
