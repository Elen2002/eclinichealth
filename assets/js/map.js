let map;
let currentMode = typeof MAP_MODE == 'undefined' ? 'view' : MAP_MODE.length > 0 ? MAP_MODE : 'view';
let currentLayer = typeof MAP_TYPE == 'undefined' ? 'normal' : MAP_TYPE || 'normal';
let enablePolygon = typeof ENABLE_POLYGON == 'undefined' ? false : ENABLE_POLYGON || false;
let enableMarker = typeof ENABLE_MARKER == 'undefined' ? false : ENABLE_MARKER || false;
let clickedArr = [];
let boundaryCoords = typeof GEO_POLYGONS_PARENT == 'undefined' ? [] : GEO_POLYGONS_PARENT.length ? GEO_POLYGONS_PARENT : [];
let boundaryPointCoords = typeof GEO_POINTS_PARENT == 'undefined' ? [] : GEO_POINTS_PARENT.length ? GEO_POINTS_PARENT : [];

let clickedDataArray = [];

const normalMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});
const satelliteMap = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google',
    minZoom: typeof MINZOOM == 'undefined' ? 8 : MINZOOM || 8,
    maxZoom: typeof MAXZOOM == 'undefined' ? 20 : MAXZOOM || 20,
    tileSize: 256
});
let greenIcon = L.icon({
    iconUrl: typeof ICON == 'undefined' ? '' : ICON || '',
    iconSize: [24, 24],
});
let yellowIcon = L.icon({
    iconUrl: typeof ICONY == 'undefined' ? '' : ICONY || '',
    iconSize: [24, 24],
});
let sqIcon = L.icon({
    iconUrl: typeof ICONB == 'undefined' ? '' : ICONB || '',
    iconSize: [24, 24],
});
$(document).ready(function () {
    if ($('#map').length === 0) {
        // Check for other map related inputs to avoid errors if map is missing but inputs exist (rare but safe)
        if ($('#address-input').length === 0) {
            return;
        }
    }
    let layerMap = currentLayer === 'satellite' ? satelliteMap : normalMap;

    map = L.map('map', {
        center: [40.20023, 44.50984],
        zoom: typeof MINZOOM == 'undefined' ? 8 + 1 : +MINZOOM + 1,
        maxZoom: typeof MAXZOOM == 'undefined' ? 20 : MAXZOOM,
        attributionControl: false,
        layers: [layerMap]
    });
    L.Marker.prototype.options.icon = greenIcon;

    function isPointInPolygon(point, vs) {
        const x = point[1], y = point[0];
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            const xi = vs[i][1], yi = vs[i][0];
            const xj = vs[j][1], yj = vs[j][0];
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-10) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    let zoom = 8;


    if ((currentMode === 'add-marker' || currentMode === 'edit') && enablePolygon) {
        let polygon = [];
        let polygonLayer = null;

        map.on('click', function (e) {
            let latlng = [e.latlng.lat, e.latlng.lng];

            if (GEO_POLYGONS_PARENT.length && !isPointInPolygon(latlng, GEO_POLYGONS_PARENT[0])) {
                alert("Нельзя кликать вне разрешённого полигона.");
                return;
            }

            if (polygon.length < 2) {
                polygon.push(e.latlng);
            } else if (polygon.length === 2) {
                polygon.push(e.latlng);
                polygon.push(polygon[0]);
            } else {
                polygon.pop();
                polygon.push(e.latlng);
                polygon.push(polygon[0]);
            }

            if (polygonLayer) {
                map.removeLayer(polygonLayer);
            }

            polygonLayer = L.polygon(polygon, { color: 'green' }).addTo(map);

            $('#coordinates').val(polygon + ' Center(' + polygonLayer.getCenter() + ')');

        });
        $('#undo').on('click', function () {
            if (polygon.length > 3) {
                polygon.splice(polygon.length - 2, 1);
                if (polygonLayer) {
                    map.removeLayer(polygonLayer);
                }
                polygonLayer = L.polygon(polygon, { color: 'green', fillOpacity: 0.3 }).addTo(map);
                $('#coordinates').val('');
            }
        });

        $('#clear').on('click', function () {
            if (polygonLayer) {
                map.removeLayer(polygonLayer);
                polygonLayer = null;
            }
            polygon = [];
            $('#coordinates').val('');
        });
    }
    if ((currentMode === 'add-marker' || currentMode === 'edit') && enableMarker) {
        let point = []
        map.on('click', function (e) {
            const latlng = [e.latlng.lat, e.latlng.lng];
            if (GEO_POLYGONS_PARENT.length && !isPointInPolygon(latlng, GEO_POLYGONS_PARENT[0])) {
                alert("Нельзя кликать вне разрешённого полигона.");
                return;
            }
            if (point.lat != 'undefined') {
                map.eachLayer(function (layer) {
                    map.removeLayer(layer);
                });
                layerMap.addTo(map);
            }
            point = e.latlng
            L.marker(point, { icon: greenIcon }).addTo(map);
            $('#coordinates').val(e.latlng)
            drawPolygonAndPoint()
        })
    }


    if (currentMode === 'view' || currentMode === 'edit') {
        if (GEO_POINTS.length != 0 && Array.isArray(GEO_POINTS)) {
            let point = GEO_POINTS;
            map.setView(point, MAXZOOM);
            layerMap.addTo(map, { zoom: MAXZOOM });
            L.marker(point).addTo(map)
        }
        if (GEO_POLYGONS.length != 0 && Array.isArray(GEO_POLYGONS)) {
            let boundaryCoords = GEO_POLYGONS;
            let boundaryPolygon = L.polygon(boundaryCoords, { color: 'green' }).addTo(map);
            map.fitBounds(boundaryPolygon.getBounds());
            // L.marker(boundaryPolygon.getCenter()).addTo(map);
        }
    }
    if (currentMode === 'search' || currentMode === 'search-add') {
        // drawPolygonAndPoint();

        const searchInput = $('#address-input');
        debugger
        if (currentLayer.length > 0 && currentLayer !== 'satellite' && currentLayer !== 'normal') {
            searchInput.val(currentLayer)
        }

        const resultsList = $('#results');
        let searchMarker;
        if (GEO_POINTS.length != 0 && Array.isArray(GEO_POINTS)) {
            let point = GEO_POINTS;
            map.setView(point, MAXZOOM);
            layerMap.addTo(map, { zoom: MAXZOOM });
            searchMarker = L.marker(point, { draggable: true }).addTo(map)
                .openPopup();
        } else {
            map.setView([40.20058, 44.51122])
        }
        searchInput.on('keyup', async (e) => {
            const query = searchInput.val().trim();
            if (query.length < 3) {
                resultsList.text('');
                return;
            }
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=` + query + `&accept-language=en`, {
                headers: {
                    'User-Agent': 'ServiceMarketPlace/1.0'
                }
            });
            const data = await res.json();

            resultsList.text('');

            if (data.length > 0) {
                data.forEach(place => {
                    const li = document.createElement('li');
                    li.textContent = place.display_name;
                    li.addEventListener('click', async () => {
                        const lat = place.lat;
                        const lon = place.lon;

                        const reverseRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
                        const reverseData = await reverseRes.json();

                        const preciseAddress = reverseData.display_name || place.display_name;
                        if (currentMode === 'search-add') {
                            searchMarker = L.marker([lat, lon]).addTo(map)
                                .bindPopup(preciseAddress)
                                .openPopup();

                        }
                        map.setView([lat, lon], 15);
                        resultsList.innerHTML = '';
                        searchInput.val(preciseAddress);
                        if ($('#coordinates').length > 0) {
                            $('#coordinates').val(`LatLng(${lat}, ${lon})`);
                        }

                        if ($('#locationAddress').length > 0) {
                            $('#locationAddress').val(preciseAddress);
                        }
                    });
                    resultsList.append(li);

                });
            }

        });

        if (currentMode === 'search-add') {
            map.on('click', async function (e) {
                const lat = e.latlng.lat;
                const lon = e.latlng.lng;
                if (searchMarker) {
                    map.removeLayer(searchMarker);
                }
                const reverseRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
                const reverseData = await reverseRes.json();
                const preciseAddress = reverseData.display_name || '';

                searchMarker = L.marker([lat, lon], { draggable: true }).addTo(map)
                    .bindPopup(preciseAddress)
                    .openPopup();

                if ($('#coordinates').length > 0) {
                    $('#coordinates').val(`LatLng(${lat}, ${lon})`);
                }
                if ($('#locationAddress').length > 0) {
                    $('#locationAddress').val(preciseAddress);
                }
                searchInput.val(preciseAddress);
            })
        }
    }
})

export function reqBasket(coord = '') {
    if (currentMode === 'view') {
        if (coord != '') {
            coord = '{' + coord + '}'
            let marker = ''
            $.each(boundaryPointCoords, function (key, arr) {
                if (coord == arr['coordinates']) {
                    let boundInfo = 0;
                    let jsArray = arr['coordinates']
                        .replace(/[{}]/g, '')
                        .split(',')
                        .map(Number);
                    if (arr.role_status) {
                        removeMarkerByCoords(jsArray[0], jsArray[1]);
                        marker = L.marker(jsArray, { icon: greenIcon }).addTo(map);
                        marker.boundInfo = arr.bounds;
                        // marker.wasClicked = false;
                        clickMarker(marker)
                    } else {
                        removeMarkerByCoords(jsArray[0], jsArray[1]);
                        marker = L.marker(jsArray, { icon: yellowIcon }).addTo(map)
                        marker.boundInfo = arr.bounds;
                        marker.wasClicked = false;
                        clickMarker(marker)
                    }
                }
            })
        } else {
            $.post('/basket/data', function (response) {
                let items = response.data.items;
                $.each(items, function (i, v) {
                    removeMarkerByCoords(v.coordinates[0], v.coordinates[1]);
                    let marker = L.marker(v.coordinates, { icon: sqIcon }).addTo(map)
                    marker.boundInfo = v.treeId;
                    clickedArr.push(v.treeId)
                    marker.wasClicked = false;
                    clickMarker(marker)
                })
            })
        }
    }
}

function removeMarkerByCoords(lat, lng) {
    let boundInfo = 0
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (Math.abs(pos.lat - lat) < 0.00001 && Math.abs(pos.lng - lng) < 0.00001) {
                boundInfo = layer.boundInfo
                map.removeLayer(layer);
            }
        }
        let index = $.inArray(boundInfo, clickedArr)
        if (index != -1) {
            clickedArr.splice(index, 1);
        }
    });
}

function clickMarker(marker) {
    marker.on('click', function () {
        if (!marker.wasClicked) {
            let index = $.inArray(marker.boundInfo, clickedArr)
            if (index == -1) {
                clickedArr.push(marker.boundInfo)
                marker.setIcon(sqIcon);
                if ($('#treeCount').length <= 0 && $('#order-trees').length <= 0) {
                    $.post('/basket/add/' + marker.boundInfo, function (response) {
                        basketData();
                    });
                    $('#basketModal').modal('show')
                }
            } else {
                clickedArr.splice(index, 1);
                marker.setIcon(greenIcon);
                if ($('#treeCount').length <= 0) {
                    $.post('/basket/remove/by/tree/' + marker.boundInfo, function (response) {
                        basketData();
                    });
                    $('#basketModal').modal('show')
                }
            }
            if ($('#treeCount').length > 0) {
                $('#treeCount').text(clickedArr.length)
                $('#tree_young_buy_form_count').val(JSON.stringify(clickedArr)).trigger('change')
            }
            if ($('#order-trees').length > 0) {
                $('#coordinates').val(JSON.stringify(clickedArr))
            }
        }
    })
}

function reverseGeocode(searchMarker, lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const result = data[0];
                const lat = parseFloat(result.lat);
                const lon = parseFloat(result.lon);

                if (searchMarker) {
                    map.removeLayer(searchMarker);
                }
                debugger
                searchMarker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(result.display_name)
                    .openPopup();

                updateCoordinatesDisplay(lat, lon, result.display_name);
                map.setView([lat, lon], 13);
                // map.on('click', function (e) {
                //     const latlng = [e.latlng.lat, e.latlng.lng];
                //     if (point.lat != 'undefined') {
                //         map.eachLayer(function (layer) {
                //             map.removeLayer(layer);
                //         });
                //         layerMap.addTo(map);
                //     }
                //     point = e.latlng
                //     L.marker(point, {icon: greenIcon}).addTo(map);
                //     $('#coordinates').val(e.latlng)
                // })

            } else {
                alert("Адрес не найден.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Ошибка при поиске адреса.");
        });
}

function updateCoordinatesDisplay(lat, lon, address) {
    if ($('#coordinates').length > 0) {
        $('#coordinates').val(`LatLng(${lat}, ${lon}`)
    }
    if ($('#locationAddress').length > 0) {
        $('#locationAddress').val(address)
    }
    if ($('#coordinates').val() == '' && $('#locationAddress').val() == '') {
        $('#error-txt').val('Map is required');
    }
}

function getCenterFromMarkers(markers) {
    let latSum = 0, lngSum = 0;
    markers.forEach(marker => {
        const latlng = marker.getLatLng();
        latSum += latlng.lat;
        lngSum += latlng.lng;
    });
    const centerLat = latSum / markers.length;
    const centerLng = lngSum / markers.length;
    return [centerLat, centerLng];
}


