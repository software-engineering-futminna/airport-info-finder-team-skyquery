/* ── Airport index for typeahead (offline, so it works on any API plan) ── */
const AIRPORT_INDEX=[
  ['LHR','London Heathrow Airport','London, United Kingdom'],['LGW','London Gatwick Airport','London, United Kingdom'],
  ['JFK','John F. Kennedy International Airport','New York, United States'],['LGA','LaGuardia Airport','New York, United States'],
  ['EWR','Newark Liberty International Airport','Newark, United States'],['LAX','Los Angeles International Airport','Los Angeles, United States'],
  ['ORD',"O'Hare International Airport",'Chicago, United States'],['DFW','Dallas/Fort Worth International Airport','Dallas, United States'],
  ['ATL','Hartsfield-Jackson Atlanta International Airport','Atlanta, United States'],['SFO','San Francisco International Airport','San Francisco, United States'],
  ['SEA','Seattle-Tacoma International Airport','Seattle, United States'],['MIA','Miami International Airport','Miami, United States'],
  ['DEN','Denver International Airport','Denver, United States'],['BOS','Logan International Airport','Boston, United States'],
  ['IAD','Washington Dulles International Airport','Washington, United States'],['YYZ','Toronto Pearson International Airport','Toronto, Canada'],
  ['YVR','Vancouver International Airport','Vancouver, Canada'],['HND','Tokyo Haneda Airport','Tokyo, Japan'],
  ['NRT','Narita International Airport','Tokyo, Japan'],['KIX','Kansai International Airport','Osaka, Japan'],
  ['ICN','Incheon International Airport','Seoul, South Korea'],['PVG','Shanghai Pudong International Airport','Shanghai, China'],
  ['PEK','Beijing Capital International Airport','Beijing, China'],['HKG','Hong Kong International Airport','Hong Kong'],
  ['SIN','Singapore Changi Airport','Singapore'],['KUL','Kuala Lumpur International Airport','Kuala Lumpur, Malaysia'],
  ['BKK','Suvarnabhumi Airport','Bangkok, Thailand'],['CGK','Soekarno-Hatta International Airport','Jakarta, Indonesia'],
  ['MNL','Ninoy Aquino International Airport','Manila, Philippines'],['DEL','Indira Gandhi International Airport','New Delhi, India'],
  ['BOM','Chhatrapati Shivaji Maharaj International Airport','Mumbai, India'],['DXB','Dubai International Airport','Dubai, United Arab Emirates'],
  ['AUH','Abu Dhabi International Airport','Abu Dhabi, United Arab Emirates'],['DOH','Hamad International Airport','Doha, Qatar'],
  ['IST','Istanbul Airport','Istanbul, Türkiye'],['CAI','Cairo International Airport','Cairo, Egypt'],
  ['JNB','O.R. Tambo International Airport','Johannesburg, South Africa'],['CPT','Cape Town International Airport','Cape Town, South Africa'],
  ['LOS','Murtala Muhammed International Airport','Lagos, Nigeria'],['ABV','Nnamdi Azikiwe International Airport','Abuja, Nigeria'],
  ['PHC','Port Harcourt International Airport','Port Harcourt, Nigeria'],['KAN','Mallam Aminu Kano International Airport','Kano, Nigeria'],
  ['ENU','Akanu Ibiam International Airport','Enugu, Nigeria'],['CBQ','Margaret Ekpo International Airport','Calabar, Nigeria'],
  ['BNI','Benin Airport','Benin City, Nigeria'],['ILR','Ilorin International Airport','Ilorin, Nigeria'],
  ['JOS','Yakubu Gowon Airport','Jos, Nigeria'],['SKO','Sadiq Abubakar III International Airport','Sokoto, Nigeria'],
  ['QUO','Akwa Ibom International Airport','Uyo, Nigeria'],['ABB','Asaba International Airport','Asaba, Nigeria'],
  ['QOW','Sam Mbakwe International Airport','Owerri, Nigeria'],['MIU','Maiduguri International Airport','Maiduguri, Nigeria'],
  ['NBO','Jomo Kenyatta International Airport','Nairobi, Kenya'],['CDG','Charles de Gaulle Airport','Paris, France'],['ORY','Paris Orly Airport','Paris, France'],
  ['FRA','Frankfurt Airport','Frankfurt, Germany'],['MUC','Munich Airport','Munich, Germany'],
  ['AMS','Amsterdam Schiphol Airport','Amsterdam, Netherlands'],['MAD','Adolfo Suárez Madrid–Barajas Airport','Madrid, Spain'],
  ['BCN','Josep Tarradellas Barcelona-El Prat Airport','Barcelona, Spain'],['FCO','Leonardo da Vinci–Fiumicino Airport','Rome, Italy'],
  ['MXP','Milan Malpensa Airport','Milan, Italy'],['ZRH','Zurich Airport','Zurich, Switzerland'],
  ['VIE','Vienna International Airport','Vienna, Austria'],['CPH','Copenhagen Airport','Copenhagen, Denmark'],
  ['ARN','Stockholm Arlanda Airport','Stockholm, Sweden'],['OSL','Oslo Airport','Oslo, Norway'],
  ['HEL','Helsinki-Vantaa Airport','Helsinki, Finland'],['DUB','Dublin Airport','Dublin, Ireland'],
  ['LIS','Humberto Delgado Airport','Lisbon, Portugal'],['ATH','Athens International Airport','Athens, Greece'],
  ['WAW','Warsaw Chopin Airport','Warsaw, Poland'],['SVO','Sheremetyevo International Airport','Moscow, Russia'],
  ['GRU','São Paulo/Guarulhos International Airport','São Paulo, Brazil'],['GIG','Rio de Janeiro/Galeão International Airport','Rio de Janeiro, Brazil'],
  ['EZE','Ministro Pistarini International Airport','Buenos Aires, Argentina'],['SCL','Arturo Merino Benítez International Airport','Santiago, Chile'],
  ['BOG','El Dorado International Airport','Bogotá, Colombia'],['LIM','Jorge Chávez International Airport','Lima, Peru'],
  ['MEX','Mexico City International Airport','Mexico City, Mexico'],['CUN','Cancún International Airport','Cancún, Mexico'],
  ['SYD','Sydney Kingsford Smith Airport','Sydney, Australia'],['MEL','Melbourne Airport','Melbourne, Australia'],
  ['BNE','Brisbane Airport','Brisbane, Australia'],['AKL','Auckland Airport','Auckland, New Zealand'],
  ['PER','Perth Airport','Perth, Australia'],['HNL','Daniel K. Inouye International Airport','Honolulu, United States'],
];

function suggestMatches(q){
  const query=q.trim().toLowerCase();
  if(!query)return[];
  return AIRPORT_INDEX.filter(([code,name,place])=>
    code.toLowerCase().startsWith(query)||name.toLowerCase().includes(query)||place.toLowerCase().includes(query)
  ).slice(0,8);
}

function renderSuggestions(matches){
  const box=document.getElementById('suggestBox');
  if(!matches.length){box.classList.remove('open');box.innerHTML='';return;}
  box.innerHTML=matches.map(([code,name,place])=>
    '<div class="suggest-item" data-code="'+code+'">'
    +'<div class="suggest-code">'+code+'</div>'
    +'<div class="suggest-text"><div class="suggest-name">'+escapeHtml(name)+'</div><div class="suggest-meta">'+escapeHtml(place)+'</div></div>'
    +'</div>'
  ).join('');
  box.classList.add('open');
  box.querySelectorAll('.suggest-item').forEach(item=>{
    item.addEventListener('click',()=>{
      document.getElementById('searchType').value='iata_code';
      document.getElementById('query').value=item.dataset.code;
      box.classList.remove('open');
      search();
    });
  });
}

function escapeHtml(s){
  return String(s??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ── Bookmarks (persisted via browser localStorage, per the PRD) ── */
const LS_KEY='airport_info_finder_bookmarks';

async function getBookmarks(){
  try{
    const raw=localStorage.getItem(LS_KEY);
    return raw?JSON.parse(raw):[];
  }catch(e){return[];}
}
async function saveBookmarks(arr){
  try{localStorage.setItem(LS_KEY,JSON.stringify(arr));}catch(e){console.error('Storage error',e);}
}

async function toggleBookmark(btn,iata,name,country,timezone){
  let bms=await getBookmarks();
  const idx=bms.findIndex(b=>b.iata===iata);
  if(idx>=0){
    bms.splice(idx,1);
    btn.textContent='☆'; btn.classList.remove('saved'); btn.title='Save airport';
  } else {
    bms.unshift({iata,name,country,timezone});
    btn.textContent='★'; btn.classList.add('saved'); btn.title='Remove bookmark';
  }
  await saveBookmarks(bms);
  renderBookmarks();
}

async function renderBookmarks(){
  const bms=await getBookmarks();
  const el=document.getElementById('bookmarksList');
  if(!bms.length){
    el.innerHTML='<div class="empty">No saved airports yet — tap the bookmark icon on any result card to save it here.</div>';
    return;
  }
  el.innerHTML=bms.map(b=>
    '<div class="bm-item">'
    +'<div><div class="bm-code">'+escapeHtml(b.iata)+'</div>'
    +'<div class="bm-name">'+escapeHtml(b.name)+'</div>'
    +'<div class="bm-meta">'+escapeHtml(b.country)+' &nbsp;·&nbsp; '+escapeHtml(b.timezone)+'</div></div>'
    +'<div class="bm-actions">'
    +'<button class="btn-sm" onclick="quickSearch(\''+escapeHtml(b.iata)+'\')">Search</button>'
    +'<button class="btn-sm danger" onclick="removeBookmark(\''+escapeHtml(b.iata)+'\')">Remove</button>'
    +'</div></div>'
  ).join('');
}

async function removeBookmark(iata){
  const bms=await getBookmarks();
  await saveBookmarks(bms.filter(b=>b.iata!==iata));
  document.querySelectorAll('.bm-btn[data-iata="'+iata+'"]').forEach(b=>{b.textContent='☆';b.classList.remove('saved');});
  renderBookmarks();
}

async function quickSearch(iata){
  document.getElementById('searchType').value='iata_code';
  document.getElementById('query').value=iata;
  window.scrollTo({top:0,behavior:'smooth'});
  search();
}

async function isBookmarked(iata){
  const bms=await getBookmarks();
  return bms.some(b=>b.iata===iata);
}

/* ── Search ── */
/* ── Rate-limit mitigation: local response cache + soft request throttle ──
   Addresses risk register item "AviationStack free-tier rate limit exceeded" */
const API_CACHE_TTL_MS = 5*60*1000;   // cache identical requests for 5 minutes
const MIN_REQUEST_GAP_MS = 900;       // minimum gap between outgoing API calls
const apiCache = new Map();
let lastRequestAt = 0;

async function cachedFetch(url){
  const cached = apiCache.get(url);
  if(cached && (Date.now()-cached.at) < API_CACHE_TTL_MS){
    return cached.data;
  }
  const wait = MIN_REQUEST_GAP_MS - (Date.now()-lastRequestAt);
  if(wait > 0) await new Promise(r=>setTimeout(r,wait));
  lastRequestAt = Date.now();
  const resp = await fetch(url);
  const data = await resp.json();
  apiCache.set(url, {data, at: Date.now()});
  return data;
}

/* ── Session stats: live instrumentation for the PRD's SMART success metrics
   (search success rate + task completion time). Resets each page load. ── */
const sessionStats = {searches:0, successes:0, totalMs:0};

function recordSearch(success, elapsedMs){
  sessionStats.searches++;
  if(success){sessionStats.successes++; sessionStats.totalMs+=elapsedMs;}
  renderSessionStats();
}

function renderSessionStats(){
  const el=document.getElementById('sessionStats');
  if(!el)return;
  if(!sessionStats.searches){el.textContent='';return;}
  const rate=Math.round((sessionStats.successes/sessionStats.searches)*100);
  const avg=sessionStats.successes?(sessionStats.totalMs/sessionStats.successes/1000).toFixed(2):'—';
  el.textContent=sessionStats.searches+' search'+(sessionStats.searches===1?'':'es')+' this session · '
    +rate+'% success · avg '+avg+'s';
}

async function search(){
  const key=document.getElementById('apiKey').value.trim();
  const type=document.getElementById('searchType').value;
  const query=document.getElementById('query').value.trim();
  const statusEl=document.getElementById('searchStatus');
  const resultEl=document.getElementById('resultCard');
  resultEl.innerHTML='';
  if(!key){statusEl.innerHTML='<div class="status error">Enter your AviationStack API key first.</div>';return;}
  if(!query){statusEl.innerHTML='<div class="status error">Enter a code, name, or country to search.</div>';return;}
  statusEl.innerHTML='<div class="status loading">Searching…</div>';
  document.getElementById('searchBtn').disabled=true;
  const startedAt=performance.now();
  try{
    const params=new URLSearchParams({access_key:key});
    params.set(type,type==='iata_code'?query.toUpperCase():query);
    const data=await cachedFetch('https://api.aviationstack.com/v1/airports?'+params);
    if(data.error)throw new Error(data.error.message||data.error.info||'API error');
    const list=data.data||[];
    if(!list.length)throw new Error('No airport found for "'+query+'"');
    const elapsedMs=performance.now()-startedAt;
    statusEl.innerHTML='<div class="status" style="background:#eaf3ee;border:1px solid var(--green);color:#2c7350;">'
      +'Found in '+(elapsedMs/1000).toFixed(2)+'s</div>';
    recordSearch(true, elapsedMs);
    await renderResult(list[0]);
  }catch(err){
    statusEl.innerHTML='<div class="status error">Error: '+escapeHtml(err.message)+'</div>';
    recordSearch(false, 0);
  }finally{document.getElementById('searchBtn').disabled=false;}
}

async function renderResult(a){
  const iata=a.iata_code||'—';
  const saved=await isBookmarked(iata);
  const hasMap=a.latitude&&a.longitude;
  const el=document.getElementById('resultCard');
  el.innerHTML=
    '<div class="card">'
    +'<div class="card-head">'
    +'<div>'
    +'<div class="card-head-top">'
    +'<span class="code-pill">'+escapeHtml(iata)+' / '+escapeHtml(a.icao_code)+'</span>'
    +'<span class="loc-pill">'+escapeHtml(a.city_iata_code||'')+(a.country_name?', '+escapeHtml(a.country_name):'')+'</span>'
    +'</div>'
    +'<h3>'+escapeHtml(a.airport_name)+'</h3>'
    +'</div>'
    +'<button class="bm-btn'+(saved?' saved':'')+'" data-iata="'+escapeHtml(iata)+'" title="'+(saved?'Remove bookmark':'Save airport')+'">'+(saved?'★':'☆')+'</button>'
    +'</div>'
    +'<div class="card-body">'
    +'<div class="field"><div class="k">IATA</div><div class="v">'+escapeHtml(a.iata_code)+'</div></div>'
    +'<div class="field"><div class="k">ICAO</div><div class="v">'+escapeHtml(a.icao_code)+'</div></div>'
    +'<div class="field"><div class="k">Timezone</div><div class="v">'+escapeHtml(a.timezone)+'</div></div>'
    +'<div class="field"><div class="k">GMT offset</div><div class="v">'+escapeHtml(a.gmt)+'</div></div>'
    +'<div class="coords-row"><span>'+escapeHtml(a.latitude)+'° N, '+escapeHtml(a.longitude)+'° W</span></div>'
    +'<div class="airlines" id="airlinesBlock"><div class="k" style="margin-bottom:10px;">Active airlines</div><div class="status loading" style="margin:0;">Loading airline data…</div></div>'
    +(hasMap?'<div class="map-section"><div class="k" style="margin-bottom:10px;">Map</div><div id="resultMap" class="leaflet-map"></div></div>':'')
    +'</div></div>';

  el.querySelector('.bm-btn').addEventListener('click',(e)=>{
    toggleBookmark(e.currentTarget,iata,a.airport_name,a.country_name,a.timezone);
  });

  if(hasMap) setTimeout(()=>initMap('resultMap',parseFloat(a.latitude),parseFloat(a.longitude),a.airport_name||iata),80);
  loadAirlines(a.iata_code,document.getElementById('apiKey').value.trim());
}

async function loadAirlines(iata,key){
  const card=document.getElementById('airlinesBlock');
  if(!card)return;
  try{
    const params=new URLSearchParams({access_key:key,dep_iata:iata,limit:100});
    const data=await cachedFetch('https://api.aviationstack.com/v1/flights?'+params);
    const flights=data.data||[];
    const seen=new Map();
    flights.forEach(f=>{
      const name=f.airline&&f.airline.name;
      if(!name)return;
      const active=f.flight_status==='active';
      if(!seen.has(name)||active)seen.set(name,active);
    });
    card.innerHTML='<div class="k" style="margin-bottom:10px;">Active airlines</div>'
      +(seen.size?[...seen.entries()].map(([n,a])=>'<span class="pill '+(a?'active':'')+'">'+escapeHtml(n)+'</span>').join(''):
        '<span style="color:var(--muted);font-size:13px;">No active flight data available for this airport right now.</span>');
  }catch(e){
    card.innerHTML='<div class="k" style="margin-bottom:10px;">Active airlines</div><span style="color:var(--muted);font-size:13px;">Could not load airline data.</span>';
  }
}

/* ── Map ── */
const leafletMaps={};
function initMap(id,lat,lng,name){
  if(leafletMaps[id]){leafletMaps[id].remove();delete leafletMaps[id];}
  const map=L.map(id,{scrollWheelZoom:false}).setView([lat,lng],11);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
    maxZoom:18
  }).addTo(map);
  const icon=L.divIcon({
    className:'',
    html:'<div style="width:14px;height:14px;background:#d98a34;border-radius:50%;border:2px solid white;box-shadow:0 0 10px #d98a34;"></div>',
    iconSize:[14,14],iconAnchor:[7,7]
  });
  L.marker([lat,lng],{icon}).addTo(map).bindPopup('<b>'+name+'</b>').openPopup();
  leafletMaps[id]=map;
}

/* ── Compare ── */
async function fetchAirport(iata,key){
  const params=new URLSearchParams({access_key:key,iata_code:iata.toUpperCase()});
  const data=await cachedFetch('https://api.aviationstack.com/v1/airports?'+params);
  if(data.error)throw new Error(data.error.message||data.error.info||'API error');
  const list=data.data||[];
  if(!list.length)throw new Error('No airport found for "'+iata+'"');
  return list[0];
}

function renderCompare(a,b){
  const fields=[
    ['City',a.city_iata_code||'—',b.city_iata_code||'—'],
    ['Country',a.country_name||'—',b.country_name||'—'],
    ['Timezone',a.timezone||'—',b.timezone||'—'],
    ['ICAO code',a.icao_code||'—',b.icao_code||'—'],
    ['Latitude',a.latitude||'—',b.latitude||'—'],
    ['Longitude',a.longitude||'—',b.longitude||'—'],
  ];
  const colA=fields.map(([label,vA])=>'<div class="compare-field"><div class="k">'+label+'</div><div class="v">'+escapeHtml(vA)+'</div></div>').join('');
  const colB=fields.map(([label,,vB])=>'<div class="compare-field"><div class="k">'+label+'</div><div class="v">'+escapeHtml(vB)+'</div></div>').join('');
  const hasMapA=a.latitude&&a.longitude;
  const hasMapB=b.latitude&&b.longitude;
  document.getElementById('compareResult').innerHTML=
    '<div class="card"><div class="card-body" style="display:block;padding:26px;">'
    +'<div class="compare-grid">'
    +'<div class="compare-col"><div class="col-head">'+escapeHtml(a.iata_code)+'</div><div class="col-name">'+escapeHtml(a.airport_name)+'</div>'+colA+'</div>'
    +'<div class="compare-divider"></div>'
    +'<div class="compare-col"><div class="col-head">'+escapeHtml(b.iata_code)+'</div><div class="col-name">'+escapeHtml(b.airport_name)+'</div>'+colB+'</div>'
    +'</div>'
    +(hasMapA||hasMapB?'<div style="border-top:1px dashed var(--line);margin-top:20px;padding-top:18px;">'
      +'<div class="maps-label">Maps</div>'
      +'<div style="display:grid;grid-template-columns:'+(hasMapA&&hasMapB?'1fr 1fr':'1fr')+';gap:14px;">'
      +(hasMapA?'<div><div style="font-family:Space Mono,monospace;font-size:11px;color:var(--amber-deep);margin-bottom:8px;">'+escapeHtml(a.iata_code)+'</div><div id="cmap-a" class="leaflet-map"></div></div>':'')
      +(hasMapB?'<div><div style="font-family:Space Mono,monospace;font-size:11px;color:var(--amber-deep);margin-bottom:8px;">'+escapeHtml(b.iata_code)+'</div><div id="cmap-b" class="leaflet-map"></div></div>':'')
      +'</div></div>':'')
    +'</div></div>';
  if(hasMapA) setTimeout(()=>initMap('cmap-a',parseFloat(a.latitude),parseFloat(a.longitude),a.airport_name||a.iata_code),80);
  if(hasMapB) setTimeout(()=>initMap('cmap-b',parseFloat(b.latitude),parseFloat(b.longitude),b.airport_name||b.iata_code),80);
}

document.getElementById('compareBtn').addEventListener('click',async()=>{
  const key=document.getElementById('apiKey').value.trim();
  const a=document.getElementById('cmpA').value.trim();
  const b=document.getElementById('cmpB').value.trim();
  const statusEl=document.getElementById('compareStatus');
  const resultEl=document.getElementById('compareResult');
  resultEl.innerHTML='';
  if(!key){statusEl.innerHTML='<div class="status error">Enter your AviationStack API key first.</div>';return;}
  if(!a||!b){statusEl.innerHTML='<div class="status error">Enter two IATA codes to compare.</div>';return;}
  statusEl.innerHTML='<div class="status loading">Fetching both airports…</div>';
  document.getElementById('compareBtn').disabled=true;
  try{
    const [apA,apB]=await Promise.all([fetchAirport(a,key),fetchAirport(b,key)]);
    statusEl.innerHTML='';
    renderCompare(apA,apB);
  }catch(err){
    statusEl.innerHTML='<div class="status error">Error: '+escapeHtml(err.message)+'</div>';
  }finally{document.getElementById('compareBtn').disabled=false;}
});

/* ── Wire up ── */
document.getElementById('searchBtn').addEventListener('click',search);
document.getElementById('query').addEventListener('keydown',e=>{
  if(e.key==='Enter'){document.getElementById('suggestBox').classList.remove('open');search();}
  if(e.key==='Escape'){document.getElementById('suggestBox').classList.remove('open');}
});
document.getElementById('query').addEventListener('input',e=>{
  renderSuggestions(suggestMatches(e.target.value));
});
document.getElementById('query').addEventListener('focus',e=>{
  if(e.target.value.trim())renderSuggestions(suggestMatches(e.target.value));
});
document.addEventListener('click',e=>{
  const field=document.querySelector('.search-field');
  if(field&&!field.contains(e.target))document.getElementById('suggestBox').classList.remove('open');
});
document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    document.getElementById('searchType').value='iata_code';
    document.getElementById('query').value=chip.dataset.code;
    document.getElementById('suggestBox').classList.remove('open');
    search();
  });
});

renderBookmarks();
