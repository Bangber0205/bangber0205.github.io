    const map = L.map('map').setView([-7.734, 109.006], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:18}).addTo(map);

    // Zona rawan = circle merah
    const zonaRawan = L.circle([-7.730, 109.020], {
      radius: 1500,
      color: 'red',
      weight: 1,
      fillColor: 'red',
      fillOpacity: 0.25
    }).addTo(map);
    zonaRawan.bindPopup("Zona Rawan Tsunami (Merah)");

    // Zona aman = circle hijau
    const zonaAman = L.circle([-7.690, 109.020], {
      radius: 2500,
      color:'green',
      weight:1,
      fillColor:'green',
      fillOpacity:0.25
    }).addTo(map);
    zonaAman.bindPopup("Zona Aman Evakuasi (Hijau)");

    // Fungsi cek dalam lingkaran
    function pointInCircle(point, circle) {
      const center = circle.getLatLng();
      const radius = circle.getRadius();
      const distance = map.distance(point, center);
      return distance <= radius;
    }

    // Titik evakuasi (sudah aman dari zona merah)
    const muster = [
      {name:'Kawasan Tinggi Kesugihan',coord:[-7.6978,109.0049]},
      {name:'Bukit Karang Tengah',coord:[-7.6890,109.0120]},
      {name:'Perbukitan Tritih Lor',coord:[-7.6885,109.0250]},
      {name:'Lapangan Karang Kandri',coord:[-7.7035,109.0305]}
    ];

    const validMuster = [];
    const evacSelect = document.getElementById("evacSelect");

    muster.forEach(m => {
      if (!pointInCircle(m.coord, zonaRawan)) {
        validMuster.push(m);
        let marker = L.marker(m.coord).addTo(map);
        if (pointInCircle(m.coord, zonaAman)) {
          marker.bindPopup("Titik Kumpul (Zona Aman): " + m.name);
        } else {
          marker.bindPopup("Titik Kumpul: " + m.name);
        }
        let opt = document.createElement("option");
        opt.value = m.name;
        opt.textContent = m.name;
        evacSelect.appendChild(opt);
      }
    });

    let userMarker = null, routingControl = null;

    function routeTo(target) {
      if (routingControl) map.removeControl(routingControl);
      routingControl = L.Routing.control({
        waypoints: [L.latLng(userMarker.getLatLng()), L.latLng(target.coord)],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {styles:[{color:"#06b6d4", weight:5, opacity:0.8}]}
      }).addTo(map);
      L.popup().setLatLng(target.coord).setContent("Titik Evakuasi: " + target.name).openOn(map);
    }

    function onLocationFound(e) {
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker(e.latlng).addTo(map).bindPopup("Lokasi Anda").openPopup();

      let nearest = null, minDist = Infinity;
      validMuster.forEach(m => {
        const d = map.distance(e.latlng, m.coord);
        if (d < minDist) {minDist = d; nearest = m;}
      });
      if (nearest) {
        evacSelect.value = nearest.name;
        routeTo(nearest);
      }
    }

    evacSelect.onchange = () => {
      const target = validMuster.find(m => m.name === evacSelect.value);
      if (target) routeTo(target);
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', e => alert("Lokasi tidak dapat ditemukan: " + e.message));
    map.locate({setView:true, watch:true, maxZoom:16});
