<template>
  <div class="container" style="max-width: 1100px">
    <h4 id="page-title">Map & Routes</h4>

    <!-- 搜索与控制区（语义化表单 + label + aria） -->
    <form class="card" @submit.prevent="onSearch" aria-labelledby="search-title">
      <div class="card-content">
        <span class="card-title" id="search-title">Search places of interest</span>

        <div class="row" style="margin-bottom:0">
          <div class="input-field col s12 m8">
            <label for="q" class="active">Keyword (e.g., hospital, library, cafe)</label>
            <input
              id="q"
              v-model.trim="q"
              type="text"
              required
              aria-describedby="search-help"
              :aria-invalid="searchError ? 'true' : 'false'"
            />
            <small id="search-help" class="grey-text">Type a keyword or name, then press Enter or click Search.</small>
            <p v-if="searchError" class="red-text" role="alert">{{ searchError }}</p>
          </div>

          <div class="input-field col s12 m4" style="display:flex;align-items:flex-end;gap:8px">
            <button class="btn" type="submit" :disabled="loadingSearch" aria-label="Search places">
              <span v-if="!loadingSearch">Search</span>
              <span v-else>Searching…</span>
            </button>
            <button class="btn grey" type="button" @click="clearResults" aria-label="Clear results">Clear</button>
            <button class="btn teal" type="button" @click="locateMe" aria-label="Locate me">Locate me</button>
          </div>
        </div>

        <!-- 搜索结果（可键盘操作） -->
        <ul v-if="results.length" class="collection" aria-label="Search results">
          <li
            v-for="(r, i) in results"
            :key="r.place_id"
            class="collection-item"
          >
            <button
              class="linklike"
              @click="selectResult(r)"
              :aria-label="`Select ${r.display_name}`"
            >
              {{ i + 1 }}. {{ r.display_name }}
            </button>
          </li>
        </ul>
        <p v-else class="grey-text" aria-live="polite">No results yet.</p>
      </div>
    </form>

    <!-- 起终点选择与路线规划 -->
    <section class="card" aria-labelledby="route-title">
      <div class="card-content">
        <span class="card-title" id="route-title">Plan a route</span>
        <div class="row" style="margin-bottom:0">
          <div class="input-field col s12 m6">
            <label for="start" class="active">Start</label>
            <select id="start" class="browser-default" v-model="startKey" aria-describedby="start-help">
              <option disabled value="">Select…</option>
              <option value="me" v-if="me">📍 My Location</option>
              <option
                v-for="m in markers"
                :key="m.key"
                :value="m.key"
              >
                {{ m.label }}
              </option>
            </select>
            <small id="start-help" class="grey-text">Choose “My Location” or a searched place as start.</small>
          </div>

          <div class="input-field col s12 m6">
            <label for="end" class="active">Destination</label>
            <select id="end" class="browser-default" v-model="endKey" aria-describedby="end-help">
              <option disabled value="">Select…</option>
              <option value="me" v-if="me">📍 My Location</option>
              <option
                v-for="m in markers"
                :key="m.key"
                :value="m.key"
              >
                {{ m.label }}
              </option>
            </select>
            <small id="end-help" class="grey-text">Pick another place as destination.</small>
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap">
          <button class="btn green" @click="buildRoute" :disabled="!canRoute" aria-label="Build route">Build Route</button>
          <button class="btn grey" @click="clearRoute" aria-label="Clear route">Clear Route</button>
        </div>

        <div v-if="trip" class="trip" aria-live="polite">
          <p><strong>Distance:</strong> {{ (trip.distance/1000).toFixed(2) }} km</p>
          <p><strong>Duration:</strong> {{ Math.round(trip.duration/60) }} min</p>
        </div>
        <p v-if="routeError" class="red-text" role="alert">{{ routeError }}</p>
      </div>
    </section>

    <!-- 地图 -->
    <section class="card" aria-labelledby="map-title">
      <div class="card-content">
        <span class="card-title" id="map-title">Map</span>
        <div id="map" style="height: 520px" role="application" aria-label="Interactive map"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import L from 'leaflet'

// Leaflet 默认 marker 的图标在打包后路径会丢失，这里显式设置（避免空白图钉）
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'
import icon1x from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'
const DefaultIcon = L.icon({ iconUrl: icon1x, iconRetinaUrl: icon2x, shadowUrl: shadow, iconSize: [25,41], iconAnchor:[12,41] })
L.Marker.prototype.options.icon = DefaultIcon

// 地图对象
let map
const markers = ref([])      // { key, label, lat, lon, marker }
const routeLayer = ref(null) // polyline
const trip = ref(null)       // { distance, duration }
const me = ref(null)         // { lat, lon }
const q = ref('')
const results = ref([])
const loadingSearch = ref(false)
const searchError = ref('')
const startKey = ref('')
const endKey = ref('')
const routeError = ref('')

// 地图初始化
onMounted(() => {
  map = L.map('map', { zoomControl: true }).setView([ -37.8136, 144.9631 ], 12) // Melbourne CBD 默认
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
})

// 搜索地点（Nominatim）
async function onSearch() {
  if (!q.value) return
  loadingSearch.value = true
  searchError.value = ''
  results.value = []
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('format', 'json')
    url.searchParams.set('q', q.value)
    url.searchParams.set('limit', '8')
    // Nominatim 要求提供合法的 UA 和 referrer；浏览器会自动带 UA，这里加个 header
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    results.value = data
  } catch (e) {
    searchError.value = 'Search failed. Please try again.'
  } finally {
    loadingSearch.value = false
  }
}

// 选择搜索结果 → 在地图上落点
function selectResult(r) {
  const lat = Number(r.lat), lon = Number(r.lon)
  map.setView([lat, lon], 15)
  const m = L.marker([lat, lon]).addTo(map).bindPopup(r.display_name)
  const key = `${lat},${lon},${Date.now()}`
  markers.value.push({ key, label: r.display_name, lat, lon, marker: m })
}

// 清空结果
function clearResults() {
  results.value = []
  q.value = ''
}

// 定位到我（浏览器 Geolocation）
function locateMe() {
  if (!navigator.geolocation) return alert('Geolocation not supported.')
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      me.value = { lat, lon }
      map.setView([lat, lon], 15)
      const m = L.marker([lat, lon]).addTo(map).bindPopup('📍 My Location')
      const key = 'me'
      // 只保留一个“我的位置” marker（避免重复）
      const exists = markers.value.findIndex(x => x.key === 'me')
      if (exists >= 0) {
        markers.value[exists].marker.remove()
        markers.value.splice(exists, 1)
      }
      markers.value.push({ key, label: '📍 My Location', lat, lon, marker: m })
    },
    err => alert('Failed to locate: ' + err.message),
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

const canRoute = computed(() => !!startKey.value && !!endKey.value && startKey.value !== endKey.value)

// 根据 key 取坐标
function getCoord(k) {
  if (k === 'me' && me.value) return [me.value.lat, me.value.lon]
  const item = markers.value.find(m => m.key === k)
  return item ? [item.lat, item.lon] : null
}

// 规划路线（OSRM）
async function buildRoute() {
  routeError.value = ''
  trip.value = null
  const a = getCoord(startKey.value)
  const b = getCoord(endKey.value)
  if (!a || !b) {
    routeError.value = 'Please select valid start and destination.'
    return
  }
  try {
    // 注意 OSRM demo 服务器仅用于轻量测试，课程演示足够
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`
    const res = await fetch(url)
    const data = await res.json()
    if (!data.routes || !data.routes.length) throw new Error('No route found')

    const route = data.routes[0]
    trip.value = { distance: route.distance, duration: route.duration }

    // 画线
    if (routeLayer.value) routeLayer.value.remove()
    routeLayer.value = L.geoJSON(route.geometry).addTo(map)

    // 适配视野
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]])
    map.fitBounds(coords)
  } catch (e) {
    routeError.value = 'Failed to build route. Please try again.'
  }
}

function clearRoute() {
  if (routeLayer.value) {
    routeLayer.value.remove()
    routeLayer.value = null
  }
  trip.value = null
}
</script>

<style scoped>
.linklike {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  text-align: left;
  padding: 0;
}
.trip { margin-top: 10px; }
</style>

