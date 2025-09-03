 const $ = (sel)=>document.querySelector(sel)
  const fmt = (n,dec=1)=>Number(n).toFixed(dec)
  const nowHHMM = ()=> new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})

  const state = {
    lang: localStorage.getItem("ews.lang")||"id",
    thElev: Number(localStorage.getItem("ews.thElev")||60),
    thWarn: Number(localStorage.getItem("ews.thWarn")||80),
    notify: false,
    score: 0,
    level: "normal",
    alerts: []
  }

  const t = (id)=>{
    const s = {
      NORMAL:{id:"NORMAL",en:"NORMAL"},
      WASPADA:{id:"WASPADA",en:"ELEVATED"},
      SIAGA:{id:"SIAGA",en:"WARNING"},
      noAnom:{id:"Tidak ada anomali signifikan.",en:"No significant anomalies."},
      someAnom:{id:"Tren meningkat pada sebagian sensor.",en:"Rising trend on some sensors."},
      multiAnom:{id:"Anomali multi-sensor + magnitudo tinggi.",en:"Multi-sensor anomalies + high magnitude."},
      status:{id:"Status:",en:"Status:"},
      activate:{id:"Aktifkan",en:"Enable"},
      enabled:{id:"Aktif",en:"Enabled"},
      drill:{id:"Uji Sirine (Drill)",en:"Siren Drill"}
    }
    return s[id] ? s[id][state.lang] : id
  }

  const map = L.map('map',{ zoomControl:true, attributionControl:false }).setView([-7.734, 109.006], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map)

  const zonaRawan = L.circle([-7.730, 109.020], {
    radius: 1500,        
    color: 'red',
    weight: 1,
    fillColor: 'red',
    fillOpacity: 0.25
    }).addTo(map);
  zonaRawan.bindPopup("Zona Rawan Tsunami (Merah)")

  const zonaAman = L.circle([-7.690,109.020], {
    radius: 2500,
    color:'green', 
    weight:1,
    fillColor:'green', 
    fillOpacity:0.25}).
    addTo(map);
  zonaAman.bindPopup("Zona Aman Evakuasi (Hijau)")

  const muster = [
    {name:'Kawasan Tinggi Kesugihan',coord:[-7.6978,109.0049]},
    {name:'Bukit Karang Tengah',coord:[-7.6890,109.0120]},
    {name:'Perbukitan Tritih Lor',coord:[-7.6885,109.0250]},
    {name:'Lapangan Karang Kandri',coord:[-7.7035,109.0305]}
  ];
  muster.forEach(m=> L.marker(m.coord).addTo(map).bindPopup('Titik Kumpul: '+m.name))

  const statusChip = $('#statusChip')
  const statusPill = $('#statusPill')
  const statusReason = $('#statusReason')
  const gaugeBar = $('#gaugeBar')
  const alertsEl = $('#alerts')

  const kMag = $('#kpiMag')
  const kDepth = $('#kpiDepth')
  const kTide = $('#kpiTide')
  const kWave = $('#kpiWave')

  const langSel = $('#lang')
  const thElev = $('#thElev')
  const thWarn = $('#thWarn')
  const btnNotif = $('#btnNotif')
  const btnDrill = $('#btnDrill')
  const siren = $('#siren')

  langSel.value = state.lang
  thElev.value = state.thElev
  thWarn.value = state.thWarn
  btnNotif.textContent = state.notify ? t('enabled') : t('activate')

  langSel.onchange = ()=>{ state.lang = langSel.value; localStorage.setItem('ews.lang',state.lang); renderStatus() }
  thElev.onchange = ()=>{ state.thElev = Number(thElev.value); localStorage.setItem('ews.thElev', state.thElev) }
  thWarn.onchange = ()=>{ state.thWarn = Number(thWarn.value); localStorage.setItem('ews.thWarn', state.thWarn) }

  btnNotif.onclick = async ()=>{
    if (!('Notification' in window)) { alert('Peramban tidak mendukung Notification API'); return }
    const perm = await Notification.requestPermission()
    state.notify = (perm === 'granted')
    btnNotif.textContent = state.notify ? t('enabled') : t('activate')
    if (state.notify) new Notification('EWS aktif untuk Cilacap', { body: 'Anda akan menerima notifikasi peringatan.'})
  }

  btnDrill.onclick = ()=>{
    try { siren.currentTime = 0; siren.play() } catch(e) {}
    pushAlert('warning', 'DRILL: Uji sirine & rute evakuasi.')
  }

  let tick = 0
  function simulate(){
    tick++
    const mag = +( (Math.random()*2.2 + 1.2) + (Math.random()>0.94? (Math.random()*2.8+1.2):0) ).toFixed(1)
    const depth = +(Math.random()*45 + 10).toFixed(1)
    const tide = +(0.2 + Math.random()*1.6 + (Math.random()>0.95? Math.random()*0.5:0)).toFixed(2)
    const wave = +(0.4 + Math.random()*2.0 + (Math.random()>0.92? Math.random()*1.1:0)).toFixed(2)

    const tideAnom = tide>1.7
    const waveAnom = wave>2.2
    let score = Math.min(100, Math.round( (mag*14) + (depth<20?8:0) + (tideAnom?15:0) + (waveAnom?15:0) ))
    let level = 'normal'
    if (score>=state.thElev) level='elevated'
    if (score>=state.thWarn || mag>=5) level='warning'

    kMag.textContent = fmt(mag,1)
    kDepth.textContent = fmt(depth,1)
    kTide.textContent = fmt(tide,2)
    kWave.textContent = fmt(wave,2)

    state.score = score
    state.level = level
    renderStatus()

    if (level==='warning') pushAlert('warning', `Peringatan! Skor ${score}/100. Potensi bahaya signifikan.`)
    else if (level==='elevated' && tick%5===0) pushAlert('elevated', `Waspada. Skor ${score}/100. Tren meningkat.`)
  }

  function renderStatus(){
    gaugeBar.style.width = state.score + '%'
    const pill = statusPill
    const chip = statusChip
    pill.className = 'status-pill ' + (state.level==='warning'?'status-warn':state.level==='elevated'?'status-elev':'status-normal')
    pill.textContent = state.level==='warning'? t('SIAGA') : state.level==='elevated'? t('WASPADA') : t('NORMAL')
    chip.textContent = `${t('status')} ${pill.textContent}`
    statusReason.textContent = state.level==='warning'? t('multiAnom'): state.level==='elevated'? t('someAnom'): t('noAnom')
    if (state.level==='warning') { try { siren.play() } catch(e){} }
  }

  function pushAlert(level, msg){
    const when = nowHHMM()
    const wrap = document.createElement('div')
    wrap.className = 'alert ' + (level==='warning'?'warn':'elev')
    wrap.innerHTML = `<div style="font-weight:700">${level==='warning'?'PERINGATAN':'WASPADA'}</div>
                      <div style="flex:1">${msg}<div><small>${when} WIB</small></div></div>`
    alertsEl.prepend(wrap)
    while (alertsEl.children.length>12) alertsEl.removeChild(alertsEl.lastChild)
    if (state.notify && level==='warning') new Notification('EWS Cilacap – PERINGATAN', { body: msg })
  }

  setInterval(simulate, 2000)
  statusChip.onclick = ()=>{ map.fitBounds(rute.getBounds(), {padding:[30,30]}) }

    const quakeBox = document.getElementById('quakeDetails')
    const quakes = []
    let quakeIndex = 0

    function updateQuakeDetails(){
      if(quakes.length === 0){
        quakeBox.innerHTML = "<p>Menunggu data gempa...</p>"
        return
      }
      const q = quakes[quakeIndex]
      quakeBox.innerHTML = `
        <p><strong>Waktu:</strong> ${q.time} WIB</p>
        <p><strong>Magnitudo:</strong> ${q.mag}</p>
        <p><strong>Kedalaman:</strong> ${q.depth} km</p>
        <p><strong>Tide Gauge:</strong> ${q.tide} m</p>
        <p><strong>Wave/Buoy:</strong> ${q.wave} m</p>
        <p><strong>Skor Risiko:</strong> ${q.score}/100</p>
      `
      quakeIndex = (quakeIndex + 1) % quakes.length
    }

    function simulate(){
      tick++
      const mag = +( (Math.random()*2.2 + 1.2) + (Math.random()>0.94? (Math.random()*2.8+1.2):0) ).toFixed(1)
      const depth = +(Math.random()*45 + 10).toFixed(1)
      const tide = +(0.2 + Math.random()*1.6 + (Math.random()>0.95? Math.random()*0.5:0)).toFixed(2)
      const wave = +(0.4 + Math.random()*2.0 + (Math.random()>0.92? Math.random()*1.1:0)).toFixed(2)
    
      const tideAnom = tide>1.7
      const waveAnom = wave>2.2
      let score = Math.min(100, Math.round( (mag*14) + (depth<20?8:0) + (tideAnom?15:0) + (waveAnom?15:0) ))
      let level = 'normal'
      if (score>=state.thElev) level='elevated'
      if (score>=state.thWarn || mag>=5) level='warning'
    
      kMag.textContent = fmt(mag,1)
      kDepth.textContent = fmt(depth,1)
      kTide.textContent = fmt(tide,2)
      kWave.textContent = fmt(wave,2)
    
      state.score = score
      state.level = level
      renderStatus()
    
      if (level==='warning') pushAlert('warning', `Peringatan! Skor ${score}/100. Potensi bahaya signifikan.`)
      else if (level==='elevated' && tick%5===0) pushAlert('elevated', `Waspada. Skor ${score}/100. Tren meningkat.`)
      
      quakes.push({ time: nowHHMM(), mag, depth, tide, wave, score })
      if(quakes.length > 12) quakes.shift()
    }
    setInterval(updateQuakeDetails, 5000)
    function sendAlertNotification(mag, loc) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification("⚠️ Peringatan Tsunami!", {
        body: `Gempa ${mag}M terdeteksi di ${loc}. Segera evakuasi!`,
        icon: "assets/icon.png",
        vibrate: [200, 100, 200],
        tag: "alert-tsunami"
      });
    });
  }
}
function updateStatus(riskScore, mag, loc) {
  const statusPill = document.getElementById("statusPill");
  if (riskScore > 80) {
    statusPill.className = "status-pill status-warn";
    statusPill.innerText = "WARNING";
    sendAlertNotification(mag, loc);
  } else if (riskScore > 60) {
    statusPill.className = "status-pill status-elev";
    statusPill.innerText = "ELEVATED";
  } else {
    statusPill.className = "status-pill status-normal";
    statusPill.innerText = "NORMAL";
  }
}

