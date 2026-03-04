(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const Ie=(e,t)=>t.some(a=>e instanceof a);let qe,Re;function gt(){return qe||(qe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function vt(){return Re||(Re=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $e=new WeakMap,ye=new WeakMap,be=new WeakMap;function wt(e){const t=new Promise((a,n)=>{const o=()=>{e.removeEventListener("success",r),e.removeEventListener("error",i)},r=()=>{a(H(e.result)),o()},i=()=>{n(e.error),o()};e.addEventListener("success",r),e.addEventListener("error",i)});return be.set(t,e),t}function St(e){if($e.has(e))return;const t=new Promise((a,n)=>{const o=()=>{e.removeEventListener("complete",r),e.removeEventListener("error",i),e.removeEventListener("abort",i)},r=()=>{a(),o()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),o()};e.addEventListener("complete",r),e.addEventListener("error",i),e.addEventListener("abort",i)});$e.set(e,t)}let xe={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return $e.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return H(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ke(e){xe=e(xe)}function Ct(e){return vt().includes(e)?function(...t){return e.apply(Me(this),t),H(this.request)}:function(...t){return H(e.apply(Me(this),t))}}function kt(e){return typeof e=="function"?Ct(e):(e instanceof IDBTransaction&&St(e),Ie(e,gt())?new Proxy(e,xe):e)}function H(e){if(e instanceof IDBRequest)return wt(e);if(ye.has(e))return ye.get(e);const t=kt(e);return t!==e&&(ye.set(e,t),be.set(t,e)),t}const Me=e=>be.get(e);function It(e,t,{blocked:a,upgrade:n,blocking:o,terminated:r}={}){const i=indexedDB.open(e,t),s=H(i);return n&&i.addEventListener("upgradeneeded",l=>{n(H(i.result),l.oldVersion,l.newVersion,H(i.transaction),l)}),a&&i.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),s.then(l=>{r&&l.addEventListener("close",()=>r()),o&&l.addEventListener("versionchange",u=>o(u.oldVersion,u.newVersion,u))}).catch(()=>{}),s}const $t=["get","getKey","getAll","getAllKeys","count"],xt=["put","add","delete","clear"],ge=new Map;function Oe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ge.get(t))return ge.get(t);const a=t.replace(/FromIndex$/,""),n=t!==a,o=xt.includes(a);if(!(a in(n?IDBIndex:IDBObjectStore).prototype)||!(o||$t.includes(a)))return;const r=async function(i,...s){const l=this.transaction(i,o?"readwrite":"readonly");let u=l.store;return n&&(u=u.index(s.shift())),(await Promise.all([u[a](...s),o&&l.done]))[0]};return ge.set(t,r),r}Ke(e=>({...e,get:(t,a,n)=>Oe(t,a)||e.get(t,a,n),has:(t,a)=>!!Oe(t,a)||e.has(t,a)}));const Mt=["continue","continuePrimaryKey","advance"],je={},Ae=new WeakMap,Ye=new WeakMap,At={get(e,t){if(!Mt.includes(t))return e[t];let a=je[t];return a||(a=je[t]=function(...n){Ae.set(this,Ye.get(this)[t](...n))}),a}};async function*Dt(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const a=new Proxy(t,At);for(Ye.set(a,t),be.set(a,Me(t));t;)yield a,t=await(Ae.get(a)||t.continue()),Ae.delete(a)}function Be(e,t){return t===Symbol.asyncIterator&&Ie(e,[IDBIndex,IDBObjectStore,IDBCursor])||t==="iterate"&&Ie(e,[IDBIndex,IDBObjectStore])}Ke(e=>({...e,get(t,a,n){return Be(t,a)?Dt:e.get(t,a,n)},has(t,a){return Be(t,a)||e.has(t,a)}}));const N=It("investment_purchase_tracker",3,{async upgrade(e,t,a,n){const o=n,r=e.objectStoreNames.contains("purchases")?o.objectStore("purchases"):null;let i=e.objectStoreNames.contains("inventory")?n.objectStore("inventory"):null;if(e.objectStoreNames.contains("inventory")||(i=e.createObjectStore("inventory",{keyPath:"id"}),i.createIndex("by_purchaseDate","purchaseDate"),i.createIndex("by_productName","productName"),i.createIndex("by_categoryId","categoryId"),i.createIndex("by_active","active"),i.createIndex("by_archived","archived"),i.createIndex("by_updatedAt","updatedAt")),i&&r){let l=await r.openCursor();for(;l;)await i.put(l.value),l=await l.continue()}let s=e.objectStoreNames.contains("categories")?n.objectStore("categories"):null;if(e.objectStoreNames.contains("categories")||(s=e.createObjectStore("categories",{keyPath:"id"}),s.createIndex("by_parentId","parentId"),s.createIndex("by_name","name"),s.createIndex("by_isArchived","isArchived")),e.objectStoreNames.contains("settings")||e.createObjectStore("settings",{keyPath:"key"}),!e.objectStoreNames.contains("valuationSnapshots")){const l=e.createObjectStore("valuationSnapshots",{keyPath:"id"});l.createIndex("by_capturedAt","capturedAt"),l.createIndex("by_scope","scope"),l.createIndex("by_marketId","marketId"),l.createIndex("by_marketId_capturedAt",["marketId","capturedAt"])}if(i){let l=await i.openCursor();for(;l;){const u=l.value;let f=!1;typeof u.active!="boolean"&&(u.active=!0,f=!0),typeof u.archived!="boolean"&&(u.archived=!1,f=!0),f&&(u.updatedAt=new Date().toISOString(),await l.update(u)),l=await l.continue()}}if(s){let l=await s.openCursor();for(;l;){const u=l.value;let f=!1;typeof u.active!="boolean"&&(u.active=!0,f=!0),typeof u.isArchived!="boolean"&&(u.isArchived=!1,f=!0),f&&(u.updatedAt=new Date().toISOString(),await l.update(u)),l=await l.continue()}}}});async function Tt(){return(await N).getAll("inventory")}async function ce(e){await(await N).put("inventory",e)}async function Ne(e){return(await N).get("inventory",e)}async function Et(){return(await N).getAll("categories")}async function De(e){await(await N).put("categories",e)}async function Xe(e){return(await N).get("categories",e)}async function Lt(){return(await N).getAll("settings")}async function P(e,t){await(await N).put("settings",{key:e,value:t})}async function Nt(){return(await N).getAll("valuationSnapshots")}async function Ft(e){const a=(await N).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await a.objectStore("inventory").clear(),await a.objectStore("categories").clear(),await a.objectStore("settings").clear(),await a.objectStore("valuationSnapshots").clear();for(const n of e.purchases)await a.objectStore("inventory").put(n);for(const n of e.categories)await a.objectStore("categories").put(n);for(const n of e.settings)await a.objectStore("settings").put(n);for(const n of e.valuationSnapshots||[])await a.objectStore("valuationSnapshots").put(n);await a.done}async function Vt(){const t=(await N).transaction(["inventory","categories","settings","valuationSnapshots"],"readwrite");await t.objectStore("inventory").clear(),await t.objectStore("categories").clear(),await t.objectStore("settings").clear(),await t.objectStore("valuationSnapshots").clear(),await t.done}async function Pt(){const t=(await N).transaction("valuationSnapshots","readwrite");await t.objectStore("valuationSnapshots").clear(),await t.done}function Ge(e){return e==null?!0:typeof e=="string"?e.trim()==="":!1}function qt(e,t){return e.some(n=>n.viewId===t.viewId&&n.field===t.field&&n.op===t.op&&n.value===t.value)?e:[...e,{...t,id:crypto.randomUUID()}]}function Ze(e,t){const a=new Set([t]);let n=!0;for(;n;){n=!1;for(const o of e)o.linkedToFilterId&&a.has(o.linkedToFilterId)&&!a.has(o.id)&&(a.add(o.id),n=!0)}return e.filter(o=>!a.has(o.id))}function Rt(e,t){return e.filter(a=>a.viewId!==t)}function Te(e,t,a,n,o){const r=t.filter(s=>s.viewId===a);if(!r.length)return e;const i=new Map(n.map(s=>[s.key,s]));return e.filter(s=>r.every(l=>{var c;const u=i.get(l.field);if(!u)return!0;const f=u.getValue(s);if(l.op==="eq")return String(f)===l.value;if(l.op==="isEmpty")return Ge(f);if(l.op==="isNotEmpty")return!Ge(f);if(l.op==="contains")return String(f).toLowerCase().includes(l.value.toLowerCase());if(l.op==="inCategorySubtree"){const h=((c=o==null?void 0:o.categoryDescendantsMap)==null?void 0:c.get(l.value))||new Set([l.value]),g=String(f);return h.has(g)}return!0}))}function Ot(e){const t=new Map(e.map(n=>[n.id,n])),a=new Map;for(const n of e){const o=a.get(n.parentId)||[];o.push(n),a.set(n.parentId,o)}return{byId:t,children:a}}function he(e){const{children:t}=Ot(e),a=new Map;function n(o){const r=new Set([o]);for(const i of t.get(o)||[])for(const s of n(i.id))r.add(s);return a.set(o,r),r}for(const o of e)a.has(o.id)||n(o.id);return a}function et(e){const t=new Map(e.map(n=>[n.id,n]));function a(n){const o=[],r=[],i=new Set;let s=n;for(;s&&!i.has(s.id);)i.add(s.id),o.unshift(s.id),r.unshift(s.name),s=s.parentId?t.get(s.parentId):void 0;return{ids:o,names:r,depth:Math.max(0,o.length-1)}}return e.map(n=>{const o=a(n);return{...n,pathIds:o.ids,pathNames:o.names,depth:o.depth}})}function Fe(e,t){return[...he(e).get(t)||new Set([t])]}function jt(e,t){const a=he(t),n=new Map;for(const o of t){const r=a.get(o.id)||new Set([o.id]);let i=0;for(const s of e)r.has(s.categoryId)&&(i+=s.totalPriceCents);n.set(o.id,i)}return n}const tt=document.querySelector("#app");if(!tt)throw new Error("#app not found");const S=tt;let D={kind:"none"},Z=null,G=null,j=null,q=null,R=null,O=null,Ue=!1,re=null,ve=!1,we=null,ee=null,de=null,ze=!1,He=!1,J=new Set,_e=!1,ie=null,X=null,te=null,p={inventoryRecords:[],categories:[],settings:[],valuationSnapshots:[],reportDateFrom:at(365),reportDateTo:new Date().toISOString().slice(0,10),filters:[],showArchivedInventory:!1,showArchivedCategories:!1,exportText:"",importText:"",storageUsageBytes:null,storageQuotaBytes:null};const ue="USD",_="$",ae=!1,pe=!1,fe=!1,Bt=[{value:"$",label:"Dollar ($)"},{value:"€",label:"Euro (€)"},{value:"£",label:"Pound (£)"},{value:"¥",label:"Yen/Yuan (¥)"},{value:"₹",label:"Rupee (₹)"},{value:"₩",label:"Won (₩)"},{value:"₽",label:"Ruble (₽)"},{value:"₺",label:"Lira (₺)"},{value:"₫",label:"Dong (₫)"},{value:"₱",label:"Peso (₱)"},{value:"₴",label:"Hryvnia (₴)"}];function E(){return new Date().toISOString()}function Gt(e){let t=null;for(const a of e)!a.active||a.archived||/^\d{4}-\d{2}-\d{2}$/.test(a.purchaseDate)&&(!t||a.purchaseDate<t)&&(t=a.purchaseDate);return t}function at(e){const t=new Date;return t.setDate(t.getDate()-e),t.toISOString().slice(0,10)}function d(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}function Se(e){if(!Number.isFinite(e)||e<0)return"0 B";const t=["B","KB","MB","GB"];let a=e,n=0;for(;a>=1024&&n<t.length-1;)a/=1024,n+=1;return`${a>=10||n===0?a.toFixed(0):a.toFixed(1)} ${t[n]}`}function C(e){const t=V("currencySymbol")||_,a=new Intl.NumberFormat(void 0,{style:"decimal",minimumFractionDigits:2,maximumFractionDigits:2}).format(e/100);return`${t}${a}`}function Ut(e){const t=V("currencySymbol")||_,n=Math.abs(e)/100;let o=n,r="";return n>=1e9?(o=n/1e9,r="b"):n>=1e6?(o=n/1e6,r="m"):n>=1e3&&(o=n/1e3,r="k"),`${e<0?"-":""}${t}${Math.round(o)}${r}`}function me(e){const t=e.trim().replace(/,/g,"");if(!t)return null;const a=Number(t);return Number.isFinite(a)?Math.round(a*100):null}function V(e){var t;return(t=p.settings.find(a=>a.key===e))==null?void 0:t.value}function zt(e){var n;const t=(n=e.find(o=>o.key==="darkMode"))==null?void 0:n.value,a=typeof t=="boolean"?t:ae;document.documentElement.setAttribute("data-bs-theme",a?"dark":"light")}function F(e){p={...p,...e},B()}function le(e){X!=null&&(window.clearTimeout(X),X=null),te=e,B(),e&&(X=window.setTimeout(()=>{X=null,te=null,B()},3500))}function U(e){D.kind==="none"&&document.activeElement instanceof HTMLElement&&(Z=document.activeElement),D=e,B()}function W(){D.kind!=="none"&&(D={kind:"none"},B(),Z&&Z.isConnected&&Z.focus(),Z=null)}function nt(){return S.querySelector(".modal-panel")}function ot(e){return Array.from(e.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("hidden"))}function Ht(){if(D.kind==="none")return;const e=nt();if(!e)return;const t=document.activeElement;if(t instanceof Node&&e.contains(t))return;(ot(e)[0]||e).focus()}function _t(){var e,t;(e=G==null?void 0:G.destroy)==null||e.call(G),(t=j==null?void 0:j.destroy)==null||t.call(j),G=null,j=null}function Ee(){var i;const e=window,t=e.DataTable,a=e.jQuery&&((i=e.jQuery.fn)!=null&&i.DataTable)?e.jQuery:void 0;if(!t&&!a){we==null&&(we=window.setTimeout(()=>{we=null,Ee(),B()},500)),ve||(ve=!0,window.addEventListener("load",()=>{ve=!1,Ee(),B()},{once:!0}));return}const n=S.querySelector("#categories-table"),o=S.querySelector("#inventory-table"),r=(s,l)=>{var u,f;return t?new t(s,l):a?((f=(u=a(s)).DataTable)==null?void 0:f.call(u,l))??null:null};n&&(G=r(n,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No categories"},ordering:!1,order:[],columnDefs:[{targets:-1,orderable:!1}]})),o&&(j=r(o,{dom:"t<'dt-bottom-row row align-items-center g-2 mt-2'<'col-md-6'i><'col-md-6 d-flex justify-content-md-end justify-content-start'p>>",paging:!0,pageLength:100,searching:!1,info:!0,lengthChange:!1,language:{emptyTable:"No inventory records"},ordering:{handler:!0,indicators:!0},order:[[0,"asc"]],columnDefs:[{targets:-1,orderable:!1}]}),ta(o,j))}function Wt(e,t,a){const n=t.find(r=>r.key==="computedTotalCents");return n?(a?e:e.filter(r=>r.parentId==null)).map(r=>{const i=n.getValue(r);return typeof i!="number"||!Number.isFinite(i)||i<=0?null:{id:r.id,label:r.pathNames.join(" / "),totalCents:i}}).filter(r=>r!=null).sort((r,i)=>i.totalCents-r.totalCents):[]}function K(e,t){const a=S.querySelector(`#${e}`),n=S.querySelector(`[data-chart-empty-for="${e}"]`);a&&a.classList.add("d-none"),n&&(n.textContent=t,n.hidden=!1)}function Le(e){const t=S.querySelector(`#${e}`),a=S.querySelector(`[data-chart-empty-for="${e}"]`);t&&t.classList.remove("d-none"),a&&(a.hidden=!0)}function Qt(){q==null||q.dispose(),R==null||R.dispose(),O==null||O.dispose(),q=null,R=null,O=null}function Jt(){Ue||(Ue=!0,window.addEventListener("resize",()=>{re!=null&&window.clearTimeout(re),re=window.setTimeout(()=>{re=null,q==null||q.resize(),R==null||R.resize(),O==null||O.resize()},120)}))}function Kt(){const e=new Map;for(const t of p.categories){if(t.isArchived||!t.active||!t.parentId)continue;const a=e.get(t.parentId)||[];a.push(t.id),e.set(t.parentId,a)}for(const t of e.values())t.sort();return e}function Yt(e){return{labels:[],series:[],overallValues:[],showOverallComparison:!1}}function Xt(e){const t="growth-trend-chart",a=S.querySelector(`#${t}`);if(!a)return;if(!window.echarts){K(t,"Chart unavailable: ECharts not loaded.");return}const n=e.overallValues.some(h=>typeof h=="number"),o=e.series.length>0;if(!e.labels.length||!n&&!o){K(t,"No snapshot trend data for this period yet.");return}Le(t);const r=document.documentElement.getAttribute("data-bs-theme")==="dark",s=window.matchMedia("(max-width: 767.98px)").matches?11:13,l=r?"#e9ecef":"#212529",u=r?"#ced4da":"#495057",f=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#0dcaf0","#198754","#dc3545"],c=e.labels.length>12?Math.ceil(e.labels.length/6):1;O=window.echarts.init(a),O.setOption({color:f,animationDuration:450,legend:{type:"scroll",top:0,textStyle:{color:l,fontSize:s}},tooltip:{trigger:"axis",axisPointer:{type:"line",lineStyle:{color:r?"rgba(255,255,255,0.35)":"rgba(0,0,0,0.3)",width:1}},backgroundColor:r?"rgba(16,18,22,0.94)":"rgba(255,255,255,0.97)",borderColor:r?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)",textStyle:{color:l,fontSize:s},formatter:h=>{var v;if(!h.length)return"";const g=h.filter($=>typeof $.value=="number").map($=>`${d($.seriesName||"")}: ${C($.value)}`);return[`<strong>${d(((v=h[0])==null?void 0:v.axisValueLabel)||"")}</strong>`,...g].join("<br/>")}},grid:{left:"3.5%",right:"3.5%",top:"16%",bottom:"14%",containLabel:!0},xAxis:{type:"category",data:e.labels,boundaryGap:!1,axisLabel:{color:u,fontSize:s,inside:!1,margin:10,hideOverlap:!0,overflow:"truncate",width:72,interval:h=>h%c===0||h===e.labels.length-1},axisTick:{show:!1},axisLine:{lineStyle:{color:u}}},yAxis:{type:"value",position:"left",axisLabel:{color:u,margin:6,fontSize:s,formatter:h=>Ut(h)},axisTick:{show:!1},splitLine:{lineStyle:{color:r?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)"}}},series:[{name:"Overall",type:"line",color:r?"#f8f9fa":"#111827",smooth:.28,symbol:"circle",showSymbol:!0,symbolSize:9,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:e.overallValues,lineStyle:{width:3.2,color:r?"#f8f9fa":"#111827",type:"dashed"},itemStyle:{color:r?"#f8f9fa":"#111827"}},...e.series.map((h,g)=>({name:h.label,type:"line",smooth:.3,symbol:"circle",showSymbol:!0,symbolSize:8,emphasis:{focus:"series",scale:!1},connectNulls:!1,data:h.values,lineStyle:{width:g===0?2.6:2}}))]})}function Zt(e,t=26){return e.length<=t?e:`${e.slice(0,t-1)}…`}function ea(e){const t="markets-allocation-chart",a="markets-top-chart",n=S.querySelector(`#${t}`),o=S.querySelector(`#${a}`);if(!n||!o)return;if(!window.echarts){K(t,"Chart unavailable: ECharts not loaded."),K(a,"Chart unavailable: ECharts not loaded.");return}if(e.length===0){K(t,"No eligible market totals to chart."),K(a,"No eligible market totals to chart.");return}Le(t),Le(a);const r=window.matchMedia("(max-width: 767.98px)").matches,i=document.documentElement.getAttribute("data-bs-theme")==="dark",s=r?11:13,l=["#0d6efd","#20c997","#ffc107","#fd7e14","#6f42c1","#198754","#0dcaf0","#dc3545"],u=i?"#e9ecef":"#212529",f=i?"#ced4da":"#495057",c=e.map(w=>({name:w.label,value:w.totalCents})),h=e.slice(0,5),g=[...h].reverse(),v=h.reduce((w,m)=>Math.max(w,m.totalCents),0),$=v>0?Math.ceil(v*1.2):1;q=window.echarts.init(n),R=window.echarts.init(o),q.setOption({color:l,tooltip:{trigger:"item",textStyle:{fontSize:s},formatter:w=>`${d(w.name)}: ${C(w.value)} (${w.percent??0}%)`},legend:r?{orient:"horizontal",bottom:0,icon:"circle",textStyle:{color:u,fontSize:s}}:{orient:"vertical",right:0,top:"center",icon:"circle",textStyle:{color:u,fontSize:s}},series:[{type:"pie",z:10,radius:["36%","54%"],center:r?["50%","50%"]:["46%","50%"],data:c,avoidLabelOverlap:!1,labelLayout:{hideOverlap:!1},minShowLabelAngle:0,label:{show:!0,position:"outside",color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.92)",borderColor:"rgba(0, 0, 0, 0.2)",borderWidth:1,borderRadius:4,padding:[2,5],fontSize:s,textBorderWidth:0,formatter:w=>{const m=w.percent??0;return`${Math.round(m)}%`}},labelLine:{show:!0,length:8,length2:6,lineStyle:{color:f,width:1}},emphasis:{label:{color:"#212529",backgroundColor:"rgba(255, 255, 255, 0.98)",borderColor:"rgba(0, 0, 0, 0.25)",borderWidth:1,borderRadius:4,padding:[2,5],fontWeight:600}}}]}),R.setOption({color:["#198754"],grid:{left:"4%",right:"4%",top:"8%",bottom:"2%",containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"},textStyle:{fontSize:s},formatter:w=>{const m=w[0];return m?`${d(m.name)}: ${C(m.value)}`:""}},xAxis:{type:"value",max:$,axisLabel:{show:!1},splitLine:{show:!1},axisTick:{show:!1},axisLine:{show:!1}},yAxis:{type:"category",data:g.map(w=>w.label),axisLabel:{color:f,fontSize:s,formatter:w=>Zt(w)},axisTick:{show:!1},axisLine:{show:!1}},series:[{type:"bar",data:g.map(w=>w.totalCents),barMaxWidth:24,showBackground:!0,backgroundStyle:{color:"rgba(25, 135, 84, 0.08)"},label:{show:!0,position:"right",color:u,fontSize:s,formatter:w=>C(w.value)}}]}),Jt()}function ta(e,t){!(t!=null&&t.order)||!t.draw||e.addEventListener("click",a=>{var c,h,g;const n=a.target,o=n==null?void 0:n.closest("thead th");if(!o)return;const r=o.parentElement;if(!(r instanceof HTMLTableRowElement))return;const i=Array.from(r.querySelectorAll("th")),s=i.indexOf(o);if(s<0||s===i.length-1)return;a.preventDefault(),a.stopPropagation();const l=(c=t.order)==null?void 0:c.call(t),u=Array.isArray(l)?l[0]:void 0,f=u&&u[0]===s&&u[1]==="asc"?"desc":"asc";(h=t.order)==null||h.call(t,[[s,f]]),(g=t.draw)==null||g.call(t,!1)},!0)}async function L(){var u,f;const[e,t,a,n]=await Promise.all([Tt(),Et(),Lt(),Nt()]),o=et(t).sort((c,h)=>c.sortOrder-h.sortOrder||c.name.localeCompare(h.name));a.some(c=>c.key==="currencyCode")||(await P("currencyCode",ue),a.push({key:"currencyCode",value:ue})),a.some(c=>c.key==="currencySymbol")||(await P("currencySymbol",_),a.push({key:"currencySymbol",value:_})),a.some(c=>c.key==="darkMode")||(await P("darkMode",ae),a.push({key:"darkMode",value:ae})),a.some(c=>c.key==="showMarketsGraphs")||(await P("showMarketsGraphs",pe),a.push({key:"showMarketsGraphs",value:pe})),a.some(c=>c.key==="showGrowthGraph")||(await P("showGrowthGraph",fe),a.push({key:"showGrowthGraph",value:fe})),zt(a);let r=null,i=null;try{const c=await((f=(u=navigator.storage)==null?void 0:u.estimate)==null?void 0:f.call(u));r=typeof(c==null?void 0:c.usage)=="number"?c.usage:null,i=typeof(c==null?void 0:c.quota)=="number"?c.quota:null}catch{r=null,i=null}let s=p.reportDateFrom,l=p.reportDateTo;if(!_e){const c=Gt(e);c&&(s=c),l=new Date().toISOString().slice(0,10),_e=!0}p={...p,inventoryRecords:e,categories:o,settings:a,valuationSnapshots:n,storageUsageBytes:r,storageQuotaBytes:i,reportDateFrom:s,reportDateTo:l},B()}function x(e){if(e)return p.categories.find(t=>t.id===e)}function aa(e){const t=x(e);return t?t.pathNames.join(" / "):"(Unknown category)"}function na(e){return aa(e)}function oa(e){const t=x(e);return t?t.pathIds.some(a=>{var n;return((n=x(a))==null?void 0:n.active)===!1}):!1}function ra(e){const t=x(e.categoryId);if(!t)return!1;for(const a of t.pathIds){const n=x(a);if((n==null?void 0:n.active)===!1)return!0}return!1}function ia(e){return e.active&&!ra(e)}function se(e){return e==null?"":(e/100).toFixed(2)}function Ve(e){const t=e.querySelector('input[name="quantity"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="unitPrice"]');if(!t||!a||!n)return;const o=Number(t.value),r=me(a.value);if(!Number.isFinite(o)||o<=0||r==null||r<0){n.value="";return}n.value=(Math.round(r/o)/100).toFixed(2)}function rt(e){const t=e.querySelector('input[name="mode"]'),a=e.querySelector('input[name="totalPrice"]'),n=e.querySelector('input[name="baselineValue"]');!t||!a||!n||t.value==="create"&&(n.value=a.value)}function it(e){const t=e.querySelector('select[name="categoryId"]'),a=e.querySelector("[data-quantity-group]"),n=e.querySelector('input[name="quantity"]');if(!t||!a||!n)return;const o=x(t.value),r=(o==null?void 0:o.evaluationMode)==="spot";a.hidden=!r,r?n.readOnly=!1:((!Number.isFinite(Number(n.value))||Number(n.value)<=0)&&(n.value="1"),n.readOnly=!0)}function st(e){const t=e.querySelector('select[name="evaluationMode"]'),a=e.querySelector("[data-spot-value-group]"),n=e.querySelector('input[name="spotValue"]'),o=e.querySelector("[data-spot-code-group]"),r=e.querySelector('input[name="spotCode"]');if(!t||!a||!n||!o||!r)return;const i=t.value==="spot";a.hidden=!i,n.disabled=!i,o.hidden=!i,r.disabled=!i}function z(e){return e.align==="right"?"col-align-right":e.align==="center"?"col-align-center":""}function lt(e){return e.active&&!e.archived}function ct(){const e=p.inventoryRecords.filter(lt),t=p.categories.filter(r=>!r.isArchived),a=jt(e,t),n=new Map(p.categories.map(r=>[r.id,r])),o=new Map;for(const r of e){const i=n.get(r.categoryId);if(i)for(const s of i.pathIds)o.set(s,(o.get(s)||0)+r.quantity)}return{categoryTotals:a,categoryQty:o}}function dt(e,t){const a=new Map;p.categories.forEach(r=>{if(!r.parentId||r.isArchived)return;const i=a.get(r.parentId)||[];i.push(r),a.set(r.parentId,i)});const n=new Map,o=r=>{const i=n.get(r);if(i!=null)return i;const s=x(r);if(!s||s.isArchived)return n.set(r,0),0;let l=0;const u=a.get(s.id)||[];return u.length>0?l=u.reduce((f,c)=>f+o(c.id),0):s.evaluationMode==="snapshot"?l=e.get(s.id)||0:s.evaluationMode==="spot"&&s.spotValueCents!=null?l=(t.get(s.id)||0)*s.spotValueCents:l=e.get(s.id)||0,n.set(r,l),l};return p.categories.forEach(r=>{r.isArchived||o(r.id)}),n}function ut(){return[{key:"productName",label:"Name",getValue:e=>e.productName,getDisplay:e=>e.productName,filterable:!0,filterOp:"contains"},{key:"categoryId",label:"Market",getValue:e=>e.categoryId,getDisplay:e=>na(e.categoryId),filterable:!0,filterOp:"inCategorySubtree"},{key:"quantity",label:"Qty",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.quantity:""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?String(e.quantity):"-"},filterable:!0,filterOp:"eq"},{key:"unitPriceCents",label:"Unit",getValue:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity):""},getDisplay:e=>{var t;return((t=x(e.categoryId))==null?void 0:t.evaluationMode)==="spot"?C(e.unitPriceCents??Math.round(e.totalPriceCents/e.quantity)):"-"},filterable:!0,filterOp:"eq",align:"right"},{key:"totalPriceCents",label:"Total",getValue:e=>e.totalPriceCents,getDisplay:e=>C(e.totalPriceCents),filterable:!0,filterOp:"eq",align:"right"},{key:"baselineValueCents",label:"Baseline value",getValue:e=>e.baselineValueCents??"",getDisplay:e=>e.baselineValueCents==null?"":C(e.baselineValueCents),filterable:!0,filterOp:"eq",align:"right"},{key:"purchaseDate",label:"Date",getValue:e=>e.purchaseDate,getDisplay:e=>e.purchaseDate,filterable:!0,filterOp:"eq"},{key:"active",label:"Active",getValue:e=>e.active,getDisplay:e=>e.active?"Active":"Inactive",filterable:!0,filterOp:"eq"}]}function sa(){return[{key:"name",label:"Name",getValue:e=>e.name,getDisplay:e=>e.name,filterable:!0,filterOp:"contains"},{key:"path",label:"Market",getValue:e=>e.pathNames.join(" / "),getDisplay:e=>e.pathNames.join(" / "),filterable:!0,filterOp:"contains"},{key:"spotValueCents",label:"Spot",getValue:e=>e.spotValueCents??"",getDisplay:e=>e.spotValueCents==null?"":C(e.spotValueCents),filterable:!0,filterOp:"eq",align:"right"}]}function pt(){return p.showArchivedInventory?p.inventoryRecords:p.inventoryRecords.filter(e=>!e.archived)}function la(){return p.showArchivedCategories?p.categories:p.categories.filter(e=>!e.isArchived)}function ca(){const e=ut(),t=sa(),a=t.filter(c=>c.key==="name"||c.key==="parent"||c.key==="path"),n=t.filter(c=>c.key!=="name"&&c.key!=="parent"&&c.key!=="path"),o=he(p.categories),r=Te(pt(),p.filters,"inventoryTable",e,{categoryDescendantsMap:o}),{categoryTotals:i,categoryQty:s}=ct(),l=dt(i,s),u=[...a,{key:"computedQty",label:"Qty",getValue:c=>s.get(c.id)||0,getDisplay:c=>String(s.get(c.id)||0),filterable:!0,filterOp:"eq"},{key:"computedInvestmentCents",label:"Investment",getValue:c=>i.get(c.id)||0,getDisplay:c=>C(i.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},...n,{key:"computedTotalCents",label:"Total",getValue:c=>l.get(c.id)||0,getDisplay:c=>C(l.get(c.id)||0),filterable:!0,filterOp:"eq",align:"right"},{key:"active",label:"Active",getValue:c=>c.active&&!c.isArchived,getDisplay:c=>c.active&&!c.isArchived?"Active":"Inactive",filterable:!0,filterOp:"eq"}],f=Te(la(),p.filters,"categoriesList",u);return{inventoryColumns:e,categoryColumns:u,categoryDescendantsMap:o,filteredInventoryRecords:r,filteredCategories:f,categoryTotals:i,categoryQty:s}}async function da(e){le({tone:"warning",text:"Snapshot capture is currently disabled while Growth logic is being redesigned."})}function We(e,t,a=""){const n=p.filters.filter(o=>o.viewId===e);return`
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
  `}function Ce(e,t,a){const n=a.getValue(t),o=a.getDisplay(t),r=n==null?"":String(n),i=a.align==="right"?"text-end":a.align==="center"?"text-center":"text-start";if(!a.filterable)return d(o);if(o.trim()==="")return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="isEmpty" data-value="" data-label="${d(`${a.label}: Empty`)}" title="Filter ${d(a.label)} by empty value"><span class="filter-hit">—</span></button>`;if(e==="inventoryTable"&&a.key==="categoryId"&&typeof t=="object"&&t&&"categoryId"in t){const l=String(t.categoryId),u=oa(l);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}${u?' <i class="bi bi-exclamation-diamond-fill text-danger ms-1" aria-label="Inactive category path" title="Inactive category path"></i>':""}</span></button>`}if(e==="categoriesList"&&a.key==="parent"&&typeof t=="object"&&t&&"parentId"in t){const l=t.parentId;if(typeof l=="string"&&l)return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(o)}</span></button>`}if(e==="categoriesList"&&(a.key==="name"||a.key==="path")&&typeof t=="object"&&t&&"id"in t){const l=String(t.id);return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}" data-cross-inventory-category-id="${d(l)}"><span class="filter-hit">${d(o)}</span></button>`}return`<button type="button" class="link-cell btn btn-sm p-0 border-0 bg-transparent ${i} align-baseline" data-action="add-filter" data-view-id="${e}" data-field="${d(a.key)}" data-op="${d(a.filterOp||"eq")}" data-value="${d(r)}" data-label="${d(`${a.label}: ${o}`)}"><span class="filter-hit">${d(o)}</span></button>`}function ft(e){return Number.isFinite(e)?Number.isInteger(e)?String(e):new Intl.NumberFormat(void 0,{minimumFractionDigits:0,maximumFractionDigits:4}).format(e):""}function ua(e,t){const a=e.map((n,o)=>{let r=0,i=!1;for(const l of t){const u=n.getValue(l);typeof u=="number"&&Number.isFinite(u)&&(r+=u,i=!0)}const s=i?String(n.key).toLowerCase().includes("cents")?C(r):ft(r):o===0?"Totals":"";return`<th class="${z(n)}">${d(s)}</th>`});return a.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${a.join("")}</tr></tfoot>`}function pa(e,t){const a=new Set(t.map(i=>i.id)),n=t.filter(i=>!i.parentId||!a.has(i.parentId)),o=new Set(["computedQty","computedInvestmentCents","computedTotalCents"]),r=e.map((i,s)=>{const l=o.has(String(i.key))?n:t;let u=0,f=!1;for(const h of l){const g=i.getValue(h);typeof g=="number"&&Number.isFinite(g)&&(u+=g,f=!0)}const c=f?String(i.key).toLowerCase().includes("cents")?C(u):ft(u):s===0?"Totals":"";return`<th class="${z(i)}">${d(c)}</th>`});return r.push('<th class="actions-col" aria-hidden="true"></th>'),`<tfoot><tr>${r.join("")}</tr></tfoot>`}function Qe(e,t=!1){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T${t?"23:59:59":"00:00:00"}Z`):null}function fa(e,t){const a=[...e];return a.filter(o=>{for(const r of a){if(r===o)continue;const i=t.get(r);if(i!=null&&i.has(o))return!1}return!0})}function ma(e){const t=new Set(p.filters.filter(n=>n.viewId==="categoriesList").map(n=>n.id)),a=new Set(p.filters.filter(n=>n.viewId==="inventoryTable"&&n.field==="categoryId"&&n.op==="inCategorySubtree"&&!!n.linkedToFilterId&&t.has(n.linkedToFilterId)).map(n=>n.value));return a.size>0?fa(a,e):p.categories.filter(n=>!n.isArchived&&n.active&&n.parentId==null).map(n=>n.id)}function ba(e){const t=ma(e),a=Kt(),{categoryTotals:n,categoryQty:o}=ct(),r=dt(n,o),i=new Map,s=new Map;for(const m of p.inventoryRecords){if(!lt(m))continue;const y=m.baselineValueCents??0;if(!Number.isFinite(y))continue;const T=x(m.categoryId);if(T)for(const M of T.pathIds)i.set(M,(i.get(M)||0)+y),s.set(M,(s.get(M)||0)+m.totalPriceCents)}for(const m of p.categories)m.isArchived||!m.active||m.evaluationMode==="spot"&&m.spotValueCents!=null&&s.set(m.id,r.get(m.id)||0);const l=[],u={};let f=0,c=0,h=0,g=0;const v=m=>{const y=x(m);if(!y)return null;const T=i.get(m)||0,M=s.get(m)||0,Y=M-T,ne=T>0?Y/T:null;return{marketId:m,marketLabel:y.pathNames.join(" / "),startValueCents:T,endValueCents:M,contributionsCents:M-T,netGrowthCents:Y,growthPct:ne}},$=new Set,w=m=>$.has(m)?[]:($.add(m),(a.get(m)||[]).map(y=>v(y)).filter(y=>y!=null).sort((y,T)=>y.marketLabel.localeCompare(T.marketLabel)));for(const m of t){const y=v(m);y&&(u[m]=w(m),f+=y.startValueCents||0,c+=y.endValueCents||0,h+=y.contributionsCents||0,g+=y.netGrowthCents||0,l.push(y))}return{scopeMarketIds:t,rows:l,childRowsByParent:u,startTotalCents:f,endTotalCents:c,contributionsTotalCents:h,netGrowthTotalCents:g,hasManualSnapshots:!1}}function ke(e){return e==null||!Number.isFinite(e)?"—":`${(e*100).toFixed(2)}%`}function Q(e){return e==null||!Number.isFinite(e)||e===0?"text-body-secondary":e>0?"text-success":"text-danger"}function ha(){if(D.kind==="none")return"";const e=V("currencySymbol")||_,t=(a,n)=>p.categories.filter(o=>!o.isArchived).filter(o=>!(a!=null&&a.has(o.id))).map(o=>`<option value="${o.id}" ${n===o.id?"selected":""}>${d(o.pathNames.join(" / "))}</option>`).join("");if(D.kind==="settings")return`
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
                  <input class="form-control" name="currencyCode" value="${d((V("currencyCode")||ue).toUpperCase())}" maxlength="3" required />
                </label>
                <label class="form-label mb-0">
                  Currency symbol
                  <select class="form-select" name="currencySymbol">
                    ${Bt.map(a=>`<option value="${d(a.value)}" ${(V("currencySymbol")||_)===a.value?"selected":""}>${d(a.label)}</option>`).join("")}
                  </select>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="darkMode" ${V("darkMode")??ae?"checked":""} />
                  <span class="form-check-label">Dark mode</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showGrowthGraph" ${V("showGrowthGraph")??fe?"checked":""} />
                  <span class="form-check-label">Show Growth graph</span>
                </label>
                <label class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" name="showMarketsGraphs" ${V("showMarketsGraphs")??pe?"checked":""} />
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
    `;if(D.kind==="categoryCreate"||D.kind==="categoryEdit"){const a=D.kind==="categoryEdit",n=D.kind==="categoryEdit"?x(D.categoryId):void 0;if(a&&!n)return"";const o=a&&n?new Set(Fe(p.categories,n.id)):void 0,r=he(p.categories);return Te(pt(),p.filters,"inventoryTable",ut(),{categoryDescendantsMap:r}),`
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
                <input class="form-control" type="number" step="0.01" min="0" name="spotValue" value="${d(se(n==null?void 0:n.spotValueCents))}" ${(n==null?void 0:n.evaluationMode)==="spot"?"":"disabled"} />
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
    `}if(D.kind==="inventoryCreate")return`
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
    `;if(D.kind==="inventoryEdit"){const a=D,n=p.inventoryRecords.find(o=>o.id===a.inventoryId);return n?`
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
            <input type="hidden" name="baselineValue" value="${d(se(n.baselineValueCents))}" />
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
                <input class="form-control" type="number" step="0.01" min="0" name="totalPrice" required value="${d(se(n.totalPriceCents))}" />
              </div>
              <button type="button" class="baseline-value-link mt-1 small" data-action="copy-total-to-baseline">Set as baseline value</button>
              <span class="baseline-value-status text-success small ms-2" data-role="baseline-copy-status" aria-live="polite"></span>
            </label>
            <label class="form-label mb-0">Per-item price (auto)
              <div class="input-group">
                <span class="input-group-text">${d(e)}</span>
                <input class="form-control" type="number" step="0.01" min="0" name="unitPrice" value="${d(se(n.unitPriceCents))}" disabled />
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
    `:""}return""}function B(){const e=window.scrollX,t=window.scrollY,a=S.querySelector('details[data-section="data-tools"]');a&&(ze=a.open);const n=S.querySelector('details[data-section="investments"]');n&&(He=n.open),Qt(),_t();const{inventoryColumns:o,categoryColumns:r,categoryDescendantsMap:i,filteredInventoryRecords:s,filteredCategories:l}=ca(),u=p.filters.some(b=>b.viewId==="categoriesList"),f=Wt(l,r,u),c=ba(i),h=Yt(),g=V("showGrowthGraph")??fe,v=V("showMarketsGraphs")??pe,$=new Set([...J].filter(b=>{var I;return(((I=c.childRowsByParent[b])==null?void 0:I.length)||0)>0}));$.size!==J.size&&(J=$);const w=c.startTotalCents>0?c.netGrowthTotalCents/c.startTotalCents:null,m=p.exportText||mt(),y=s.map(b=>`
        <tr class="${[ia(b)?"":"row-inactive",b.archived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="inventory" data-id="${b.id}">
          ${o.map(k=>`<td class="${z(k)}">${Ce("inventoryTable",b,k)}</td>`).join("")}
          <td class="actions-col-cell">
            <div class="actions-cell">
              <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-inventory" data-id="${b.id}">Edit</button>
            </div>
          </td>
        </tr>
      `).join(""),T=new Set(l.map(b=>b.id)),M=new Map;for(const b of l){const I=b.parentId&&T.has(b.parentId)?b.parentId:null,k=M.get(I)||[];k.push(b),M.set(I,k)}for(const b of M.values())b.sort((I,k)=>I.sortOrder-k.sortOrder||I.name.localeCompare(k.name));const Y=[],ne=(b,I)=>{const k=M.get(b)||[];for(const A of k)Y.push({category:A,depth:I}),ne(A.id,I+1)};ne(null,0);const yt=Y.map(({category:b,depth:I})=>`
      <tr class="${[b.active?"":"row-inactive",b.isArchived?"row-archived":""].filter(Boolean).join(" ")}" data-row-edit="category" data-id="${b.id}">
        ${r.map(k=>{if(k.key==="name"){const A=I>0?(I-1)*1.1:0;return`<td class="${z(k)}"><div class="market-name-wrap" style="padding-left:${A.toFixed(2)}rem">${I>0?'<span class="market-child-icon" aria-hidden="true">↳</span>':""}${Ce("categoriesList",b,k)}</div></td>`}return`<td class="${z(k)}">${Ce("categoriesList",b,k)}</td>`}).join("")}
        <td class="actions-col-cell">
          <div class="actions-cell">
            <button type="button" class="btn btn-sm btn-outline-primary action-menu-btn" data-action="edit-category" data-id="${b.id}">Edit</button>
          </div>
        </td>
      </tr>
    `).join("");S.innerHTML=`
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
        ${te?`<div class="alert alert-${te.tone} py-1 px-2 mt-2 mb-0 small" role="status">${d(te.text)}</div>`:""}
      </header>

      <section class="card shadow-sm">
        <div class="card-body">
          <div class="section-head">
            <h2 class="h5 mb-0">Growth Report</h2>
          </div>
          <p class="small text-body-secondary mb-2">
            Scope: ${c.scopeMarketIds.length?`${c.scopeMarketIds.length} market${c.scopeMarketIds.length===1?"":"s"} (Markets filter)`:"No scoped markets"}
          </p>
          ${g?`
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
                  ${c.rows.map(b=>{const I=c.childRowsByParent[b.marketId]||[],k=J.has(b.marketId);return`
                      <tr class="growth-parent-row">
                        <td>
                          ${I.length>0?`<button type="button" class="growth-expand-btn" data-action="toggle-growth-children" data-market-id="${d(b.marketId)}" aria-label="${k?"Collapse":"Expand"} child markets">${k?"▾":"▸"}</button>`:'<span class="growth-expand-placeholder" aria-hidden="true"></span>'}
                          ${d(b.marketLabel)}
                        </td>
                      <td class="text-end">${b.startValueCents==null?"—":d(C(b.startValueCents))}</td>
                      <td class="text-end">${b.endValueCents==null?"—":d(C(b.endValueCents))}</td>
                      <td class="text-end">${d(C(b.contributionsCents))}</td>
                      <td class="text-end ${Q(b.netGrowthCents)}">${b.netGrowthCents==null?"—":d(C(b.netGrowthCents))}</td>
                      <td class="text-end ${Q(b.growthPct)}">${d(ke(b.growthPct))}</td>
                      </tr>
                      ${I.map(A=>`
                            <tr class="growth-child-row" data-parent-market-id="${d(b.marketId)}" ${k?"":"hidden"}>
                              <td class="growth-child-label"><span class="growth-expand-placeholder" aria-hidden="true"></span>↳ ${d(A.marketLabel)}</td>
                              <td class="text-end">${A.startValueCents==null?"—":d(C(A.startValueCents))}</td>
                              <td class="text-end">${A.endValueCents==null?"—":d(C(A.endValueCents))}</td>
                              <td class="text-end">${d(C(A.contributionsCents))}</td>
                              <td class="text-end ${Q(A.netGrowthCents)}">${A.netGrowthCents==null?"—":d(C(A.netGrowthCents))}</td>
                              <td class="text-end ${Q(A.growthPct)}">${d(ke(A.growthPct))}</td>
                            </tr>
                          `).join("")}
                    `}).join("")}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th class="text-end">${d(C(c.startTotalCents))}</th>
                    <th class="text-end">${d(C(c.endTotalCents))}</th>
                    <th class="text-end">${d(C(c.contributionsTotalCents))}</th>
                    <th class="text-end ${Q(c.netGrowthTotalCents)}">${d(C(c.netGrowthTotalCents))}</th>
                    <th class="text-end ${Q(w)}">${d(ke(w))}</th>
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
        ${We("categoriesList","Markets",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-categories" ${p.showArchivedCategories?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
        <div class="table-wrap table-responsive">
          <table id="categories-table" class="table table-striped table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                ${r.map(b=>`<th class="${z(b)}">${d(b.label)}</th>`).join("")}
                <th class="actions-col" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              ${yt}
            </tbody>
            ${pa(r,l)}
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
          ${We("inventoryTable","Investments",`<label class="checkbox-row form-check mb-0"><input class="form-check-input" type="checkbox" data-action="toggle-show-archived-inventory" ${p.showArchivedInventory?"checked":""}/> <span class="form-check-label">Show archived</span></label>`)}
          <div class="table-wrap table-responsive">
            <table id="inventory-table" class="table table-striped table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  ${o.map(b=>`<th class="${z(b)}">${d(b.label)}</th>`).join("")}
                  <th class="actions-col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                ${y}
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
              Storage used (browser estimate): ${p.storageUsageBytes==null?"Unavailable":p.storageQuotaBytes==null?d(Se(p.storageUsageBytes)):`${d(Se(p.storageUsageBytes))} of ${d(Se(p.storageQuotaBytes))}`}
              <span class="d-block">Includes this site origin storage (IndexedDB and possibly other browser storage).</span>
            </div>
            <label class="form-label">Export / Copy JSON
              <textarea class="form-control" id="export-text" rows="10" readonly>${d(m)}</textarea>
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
    ${ha()}
  `;const oe=S.querySelector("#inventory-form");oe&&(it(oe),Ve(oe),rt(oe));const Pe=S.querySelector("#category-form");Pe&&st(Pe),Ht(),ea(f),Xt(h),Ee(),window.scrollTo(e,t)}function ya(e,t){const a=S.querySelectorAll(`tr.growth-child-row[data-parent-market-id="${e}"]`);if(!a.length)return;for(const o of a)o.hidden=!t;const n=S.querySelector(`button[data-action="toggle-growth-children"][data-market-id="${e}"]`);n&&(n.textContent=t?"▾":"▸",n.setAttribute("aria-label",`${t?"Collapse":"Expand"} child markets`))}function ga(){return{schemaVersion:2,exportedAt:E(),settings:p.settings,categories:p.categories,purchases:p.inventoryRecords,valuationSnapshots:p.valuationSnapshots}}function mt(){return JSON.stringify(ga(),null,2)}function va(e,t,a){const n=new Blob([t],{type:a}),o=URL.createObjectURL(n),r=document.createElement("a");r.href=o,r.download=e,r.click(),URL.revokeObjectURL(o)}async function wa(e){const t=new FormData(e),a=String(t.get("currencyCode")||"").trim().toUpperCase(),n=String(t.get("currencySymbol")||"").trim(),o=t.get("darkMode")==="on",r=t.get("showGrowthGraph")==="on",i=t.get("showMarketsGraphs")==="on";if(!/^[A-Z]{3}$/.test(a)){alert("Currency code must be a 3-letter code like USD.");return}if(!n){alert("Select a currency symbol.");return}await P("currencyCode",a),await P("currencySymbol",n),await P("darkMode",o),await P("showGrowthGraph",r),await P("showMarketsGraphs",i),W(),await L()}async function Sa(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("categoryId")||"").trim(),o=String(t.get("name")||"").trim(),r=String(t.get("parentId")||"").trim(),i=String(t.get("evaluationMode")||"").trim(),s=String(t.get("spotValue")||"").trim(),l=String(t.get("spotCode")||"").trim(),u=t.get("active")==="on",f=i==="spot"||i==="snapshot"?i:void 0,c=f==="spot"&&s?me(s):void 0,h=f==="spot"&&l?l:void 0;if(!o)return;if(f==="spot"&&s&&c==null){alert("Spot value is invalid.");return}const g=c??void 0,v=r||null;if(v&&!x(v)){alert("Select a valid parent market.");return}if(a==="edit"){if(!n)return;const y=await Xe(n);if(!y){alert("Market not found.");return}if(v===y.id){alert("A category cannot be its own parent.");return}if(v&&Fe(p.categories,y.id).includes(v)){alert("A category cannot be moved under its own subtree.");return}const T=y.parentId!==v;y.name=o,y.parentId=v,y.evaluationMode=f,y.spotValueCents=g,y.spotCode=h,y.active=u,T&&(y.sortOrder=p.categories.filter(M=>M.parentId===v&&M.id!==y.id).length),y.updatedAt=E(),await De(y),W(),await L();return}const $=E(),w=p.categories.filter(y=>y.parentId===v).length,m={id:crypto.randomUUID(),name:o,parentId:v,pathIds:[],pathNames:[],depth:0,sortOrder:w,evaluationMode:f,spotValueCents:g,spotCode:h,active:u,isArchived:!1,createdAt:$,updatedAt:$};await De(m),W(),await L()}async function Ca(e){const t=new FormData(e),a=String(t.get("mode")||"create"),n=String(t.get("inventoryId")||"").trim(),o=String(t.get("purchaseDate")||""),r=String(t.get("productName")||"").trim(),i=Number(t.get("quantity")),s=me(String(t.get("totalPrice")||"")),l=String(t.get("baselineValue")||"").trim(),u=l===""?null:me(l),f=a==="create"?s??void 0:u??void 0,c=String(t.get("categoryId")||""),h=t.get("active")==="on",g=String(t.get("notes")||"").trim();if(!o||!r||!c){alert("Date, product name, and category are required.");return}if(!Number.isFinite(i)||i<=0){alert("Quantity must be greater than 0.");return}if(s==null||s<0){alert("Total price is invalid.");return}if(a!=="create"&&u!=null&&u<0){alert("Baseline value is invalid.");return}if(a!=="create"&&l!==""&&u==null){alert("Baseline value is invalid.");return}if(!x(c)){alert("Select a valid category.");return}const v=Math.round(s/i);if(a==="edit"){if(!n)return;const m=await Ne(n);if(!m){alert("Inventory record not found.");return}m.purchaseDate=o,m.productName=r,m.quantity=i,m.totalPriceCents=s,m.baselineValueCents=f,m.unitPriceCents=v,m.unitPriceSource="derived",m.categoryId=c,m.active=h,m.notes=g||void 0,m.updatedAt=E(),await ce(m),W(),await L();return}const $=E(),w={id:crypto.randomUUID(),purchaseDate:o,productName:r,quantity:i,totalPriceCents:s,baselineValueCents:f,unitPriceCents:v,unitPriceSource:"derived",categoryId:c,active:h,archived:!1,notes:g||void 0,createdAt:$,updatedAt:$};await ce(w),W(),await L()}async function ka(e,t){const a=await Ne(e);a&&(a.active=t,a.updatedAt=E(),await ce(a),await L())}async function Ia(e,t){const a=await Ne(e);a&&(t&&!window.confirm(`Archive inventory record "${a.productName}"?`)||(a.archived=t,t&&(a.active=!1),a.archivedAt=t?E():void 0,a.updatedAt=E(),await ce(a),await L()))}async function $a(e,t){const a=x(e);if(t&&a&&!window.confirm(`Archive market subtree "${a.pathNames.join(" / ")}"?`))return;const n=Fe(p.categories,e),o=E();for(const r of n){const i=await Xe(r);i&&(i.isArchived=t,t&&(i.active=!1),i.archivedAt=t?o:void 0,i.updatedAt=o,await De(i))}await L()}function xa(e){const t=E();return{id:String(e.id),name:String(e.name),parentId:e.parentId==null||e.parentId===""?null:String(e.parentId),pathIds:Array.isArray(e.pathIds)?e.pathIds.map(String):[],pathNames:Array.isArray(e.pathNames)?e.pathNames.map(String):[],depth:Number.isFinite(e.depth)?Number(e.depth):0,sortOrder:Number.isFinite(e.sortOrder)?Number(e.sortOrder):0,evaluationMode:e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:"snapshot",spotValueCents:e.spotValueCents==null||e.spotValueCents===""?void 0:Number(e.spotValueCents),spotCode:e.spotCode==null||e.spotCode===""?void 0:String(e.spotCode),active:typeof e.active=="boolean"?e.active:!0,isArchived:typeof e.isArchived=="boolean"?e.isArchived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Ma(e){const t=E(),a=Number(e.quantity),n=Number(e.totalPriceCents);if(!Number.isFinite(a)||a<=0)throw new Error(`Invalid quantity for purchase ${e.id}`);if(!Number.isFinite(n))throw new Error(`Invalid totalPriceCents for purchase ${e.id}`);const o=e.baselineValueCents==null||e.baselineValueCents===""?void 0:Number(e.baselineValueCents),r=e.unitPriceCents==null||e.unitPriceCents===""?void 0:Number(e.unitPriceCents);return{id:String(e.id),purchaseDate:String(e.purchaseDate),productName:String(e.productName),quantity:a,totalPriceCents:n,baselineValueCents:Number.isFinite(o)?o:void 0,unitPriceCents:r,unitPriceSource:e.unitPriceSource==="entered"?"entered":"derived",categoryId:String(e.categoryId),active:typeof e.active=="boolean"?e.active:!0,archived:typeof e.archived=="boolean"?e.archived:!1,archivedAt:e.archivedAt?String(e.archivedAt):void 0,notes:e.notes?String(e.notes):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}function Aa(e){const t=E(),a=e.scope==="portfolio"||e.scope==="market"?e.scope:"market",n=e.source==="derived"?"derived":"manual",o=e.evaluationMode==="spot"||e.evaluationMode==="snapshot"?e.evaluationMode:void 0,r=Number(e.valueCents);if(!Number.isFinite(r))throw new Error(`Invalid valuation snapshot valueCents for ${e.id??"(unknown id)"}`);return{id:String(e.id??crypto.randomUUID()),capturedAt:e.capturedAt?String(e.capturedAt):t,scope:a,marketId:a==="market"&&String(e.marketId??"")||void 0,evaluationMode:o,valueCents:r,quantity:e.quantity==null||e.quantity===""?void 0:Number(e.quantity),source:n,note:e.note?String(e.note):void 0,createdAt:e.createdAt?String(e.createdAt):t,updatedAt:e.updatedAt?String(e.updatedAt):t}}async function Da(){const e=p.importText.trim();if(!e){alert("Paste JSON or choose a JSON file first.");return}let t;try{t=JSON.parse(e)}catch{alert("Import JSON is not valid.");return}if((t==null?void 0:t.schemaVersion)!==1&&(t==null?void 0:t.schemaVersion)!==2){alert("Unsupported schemaVersion. Expected 1 or 2.");return}if(!Array.isArray(t.categories)||!Array.isArray(t.purchases)){alert("Import payload must contain categories[] and purchases[].");return}try{const a=et(t.categories.map(xa)),n=new Set(a.map(l=>l.id)),o=t.purchases.map(Ma);for(const l of o)if(!n.has(l.categoryId))throw new Error(`Inventory record ${l.id} references missing categoryId ${l.categoryId}`);const r=Array.isArray(t.settings)?t.settings.map(l=>({key:String(l.key),value:l.value})):[{key:"currencyCode",value:ue},{key:"currencySymbol",value:_},{key:"darkMode",value:ae}],i=t.schemaVersion===2&&Array.isArray(t.valuationSnapshots)?t.valuationSnapshots.map(Aa):[];if(!window.confirm("Replace all existing data with imported data? This cannot be undone."))return;await Ft({purchases:o,categories:a,settings:r,valuationSnapshots:i}),F({importText:""}),await L()}catch(a){alert(a instanceof Error?a.message:"Import failed.")}}function bt(e){return e.target instanceof HTMLElement?e.target:null}function Je(e){const t=e.dataset.viewId,a=e.dataset.field,n=e.dataset.op,o=e.dataset.value,r=e.dataset.label;if(!t||!a||!n||o==null||!r)return;const i=(f,c)=>f.viewId===c.viewId&&f.field===c.field&&f.op===c.op&&f.value===c.value;let s=qt(p.filters,{viewId:t,field:a,op:n,value:o,label:r});const l=e.dataset.crossInventoryCategoryId;if(l){const f=x(l);if(f){const c=s.find(h=>i(h,{viewId:t,field:a,op:n,value:o}));if(c){const h=`Market: ${f.pathNames.join(" / ")}`;s=s.filter(v=>v.linkedToFilterId!==c.id);const g=s.findIndex(v=>i(v,{viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id}));if(g>=0){const v=s[g];s=[...s.slice(0,g),{...v,label:h,linkedToFilterId:c.id},...s.slice(g+1)]}else s=[...s,{id:crypto.randomUUID(),viewId:"inventoryTable",field:"categoryId",op:"inCategorySubtree",value:f.id,label:h,linkedToFilterId:c.id}]}}}let u={filters:s};t==="inventoryTable"&&a==="archived"&&o==="true"&&!p.showArchivedInventory&&(u.showArchivedInventory=!0),t==="categoriesList"&&(a==="isArchived"||a==="archived")&&o==="true"&&!p.showArchivedCategories&&(u.showArchivedCategories=!0),t==="categoriesList"&&a==="active"&&o==="false"&&!p.showArchivedCategories&&(u.showArchivedCategories=!0),F(u)}function ht(){ee!=null&&(window.clearTimeout(ee),ee=null)}function Ta(e){const t=p.filters.filter(n=>n.viewId===e),a=t[t.length-1];a&&F({filters:Ze(p.filters,a.id)})}S.addEventListener("click",async e=>{const t=bt(e);if(!t)return;const a=t.closest("[data-action]");if(!a)return;const n=a.dataset.action;if(n){if(n==="add-filter"){if(!t.closest(".filter-hit"))return;if(e instanceof MouseEvent){if(ht(),e.detail>1)return;ee=window.setTimeout(()=>{ee=null,Je(a)},220);return}Je(a);return}if(n==="remove-filter"){const o=a.dataset.filterId;if(!o)return;F({filters:Ze(p.filters,o)});return}if(n==="clear-filters"){const o=a.dataset.viewId;if(!o)return;F({filters:Rt(p.filters,o)});return}if(n==="toggle-show-archived-inventory"){F({showArchivedInventory:a.checked});return}if(n==="toggle-show-archived-categories"){F({showArchivedCategories:a.checked});return}if(n==="open-create-category"){U({kind:"categoryCreate"});return}if(n==="open-create-inventory"){U({kind:"inventoryCreate"});return}if(n==="open-settings"){U({kind:"settings"});return}if(n==="apply-report-range"){const o=S.querySelector('input[name="reportDateFrom"]'),r=S.querySelector('input[name="reportDateTo"]');if(!o||!r)return;const i=o.value,s=r.value,l=Qe(i),u=Qe(s,!0);if(l==null||u==null||l>u){le({tone:"warning",text:"Select a valid report date range."});return}F({reportDateFrom:i,reportDateTo:s});return}if(n==="reset-report-range"){F({reportDateFrom:at(365),reportDateTo:new Date().toISOString().slice(0,10)});return}if(n==="copy-total-to-baseline"){const o=a.closest("form");if(!(o instanceof HTMLFormElement)||o.id!=="inventory-form")return;const r=o.querySelector('input[name="totalPrice"]'),i=o.querySelector('input[name="baselineValue"]'),s=o.querySelector('[data-role="baseline-copy-status"]');if(!r||!i)return;i.value=r.value.trim(),s&&(s.innerHTML='<i class="bi bi-check-circle-fill" aria-label="Baseline value set" title="Baseline value set"></i>',ie!=null&&window.clearTimeout(ie),ie=window.setTimeout(()=>{ie=null,s.isConnected&&(s.textContent="")},1800));return}if(n==="capture-snapshot"){try{await da()}catch{le({tone:"danger",text:"Failed to capture snapshot."})}return}if(n==="toggle-growth-children"){const o=a.dataset.marketId;if(!o)return;const r=new Set(J),i=!r.has(o);i?r.add(o):r.delete(o),J=r,ya(o,i);return}if(n==="edit-category"){const o=a.dataset.id;o&&U({kind:"categoryEdit",categoryId:o});return}if(n==="edit-inventory"){const o=a.dataset.id;o&&U({kind:"inventoryEdit",inventoryId:o});return}if(n==="close-modal"||n==="close-modal-backdrop"){if(n==="close-modal-backdrop"&&!t.classList.contains("modal"))return;W();return}if(n==="toggle-inventory-active"){const o=a.dataset.id,r=a.dataset.nextActive==="true";o&&await ka(o,r);return}if(n==="toggle-inventory-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await Ia(o,r);return}if(n==="toggle-category-subtree-archived"){const o=a.dataset.id,r=a.dataset.nextArchived==="true";o&&await $a(o,r);return}if(n==="download-json"){va(`investment-tracker-${new Date().toISOString().slice(0,10)}.json`,mt(),"application/json");return}if(n==="replace-import"){await Da();return}if(n==="reset-snapshots"){if(!window.confirm("This will permanently delete all valuation snapshots used by Growth Report. This cannot be undone. Continue?"))return;await Pt(),await L(),le({tone:"warning",text:"All valuation snapshots have been reset."});return}if(n==="wipe-all"){const o=document.querySelector("#wipe-confirm");if(!o||o.value!=="DELETE"){alert("Type DELETE in the confirmation field first.");return}if(!window.confirm("Wipe all IndexedDB data? This cannot be undone."))return;await Vt(),F({filters:[],exportText:"",importText:"",showArchivedInventory:!1,showArchivedCategories:!1}),await L();return}}});S.addEventListener("dblclick",e=>{const t=e.target;if(!(t instanceof HTMLElement)||(ht(),t.closest("input, select, textarea, label")))return;const a=t.closest("button");if(a&&!a.classList.contains("link-cell")||t.closest("a"))return;const n=t.closest("tr[data-row-edit]");if(!n)return;const o=n.dataset.id,r=n.dataset.rowEdit;if(!(!o||!r)){if(r==="inventory"){U({kind:"inventoryEdit",inventoryId:o});return}r==="category"&&U({kind:"categoryEdit",categoryId:o})}});S.addEventListener("submit",async e=>{e.preventDefault();const t=e.target;if(t instanceof HTMLFormElement){if(t.id==="settings-form"){await wa(t);return}if(t.id==="category-form"){await Sa(t);return}if(t.id==="inventory-form"){await Ca(t);return}}});S.addEventListener("input",e=>{const t=e.target;if(t instanceof HTMLTextAreaElement||t instanceof HTMLInputElement){if(t.name==="quantity"||t.name==="totalPrice"){const a=t.closest("form");a instanceof HTMLFormElement&&a.id==="inventory-form"&&(Ve(a),rt(a))}if(t.id==="import-text"){p={...p,importText:t.value};return}(t.name==="reportDateFrom"||t.name==="reportDateTo")&&(t.name==="reportDateFrom"?p={...p,reportDateFrom:t.value}:p={...p,reportDateTo:t.value})}});S.addEventListener("change",async e=>{var o;const t=e.target;if(t instanceof HTMLSelectElement&&t.name==="categoryId"){const r=t.closest("form");r instanceof HTMLFormElement&&r.id==="inventory-form"&&(it(r),Ve(r));return}if(t instanceof HTMLSelectElement&&t.name==="evaluationMode"){const r=t.closest("form");r instanceof HTMLFormElement&&r.id==="category-form"&&st(r);return}if(!(t instanceof HTMLInputElement)||t.id!=="import-file")return;const a=(o=t.files)==null?void 0:o[0];if(!a)return;const n=await a.text();F({importText:n})});S.addEventListener("pointermove",e=>{const t=bt(e);if(!t)return;const a=t.closest("[data-filter-section-view-id]");de=(a==null?void 0:a.dataset.filterSectionViewId)||null});S.addEventListener("pointerleave",()=>{de=null});document.addEventListener("keydown",e=>{if(D.kind==="none"){if(e.key!=="Escape")return;const i=e.target;if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement||i instanceof HTMLSelectElement||!de)return;e.preventDefault(),Ta(de);return}if(e.key==="Escape"){e.preventDefault(),W();return}if(e.key!=="Tab")return;const t=nt();if(!t)return;const a=ot(t);if(!a.length){e.preventDefault(),t.focus();return}const n=a[0],o=a[a.length-1],r=document.activeElement;if(e.shiftKey){(r===n||r instanceof Node&&!t.contains(r))&&(e.preventDefault(),o.focus());return}r===o&&(e.preventDefault(),n.focus())});window.addEventListener("pagehide",()=>{});window.addEventListener("beforeunload",()=>{});L();
