<template>
  <div class="container" style="padding-top:16px">
    <h4 class="center-align">Data Tables</h4>

    <!-- ============ Table 1: Ratings ============ -->
    <section class="card">
      <div class="card-content">
        <div class="row" style="margin-bottom:8px; align-items:center">
          <div class="col s12 m8">
            <span class="card-title">Ratings</span>
          </div>
          <div class="col s12 m4 right-align">
            <button class="btn" @click="exportRatingsCsv" aria-label="Export ratings to CSV">
              Export CSV
            </button>
          </div>
        </div>

        <!-- 列级搜索 -->
        <div class="row" style="margin-bottom:0">
          <div class="input-field col s12 m4">
            <input v-model.trim="f1.name" id="f1_name" type="text" />
            <label for="f1_name">Search by Name</label>
          </div>
          <div class="input-field col s12 m4">
            <input v-model.trim="f1.section" id="f1_section" type="text" />
            <label for="f1_section">Search by Section</label>
          </div>
          <div class="input-field col s12 m4">
            <input v-model.trim="f1.score" id="f1_score" type="text" />
            <label for="f1_score">Search by Score</label>
          </div>
        </div>

        <vue-good-table
          :columns="cols1"
          :rows="rows1Filtered"
          :search-options="{ enabled: true, placeholder: 'Global search…' }"
          :pagination-options="{ enabled: true, perPage: 10 }"
          :sort-options="{ enabled: true }"
        />
      </div>
    </section>

    <!-- ============ Table 2: Users ============ -->
    <section class="card">
      <div class="card-content">
        <div class="row" style="margin-bottom:8px; align-items:center">
          <div class="col s12 m8">
            <span class="card-title">Users</span>
          </div>
          <div class="col s12 m4 right-align">
            <button class="btn" @click="exportUsersCsv" aria-label="Export users to CSV">
              Export CSV
            </button>
          </div>
        </div>

        <!-- 列级搜索 -->
        <div class="row" style="margin-bottom:0">
          <div class="input-field col s12 m3">
            <input v-model.trim="f2.username" id="f2_username" type="text" />
            <label for="f2_username">Search by Username</label>
          </div>
          <div class="input-field col s12 m3">
            <input v-model.trim="f2.email" id="f2_email" type="text" />
            <label for="f2_email">Search by Email</label>
          </div>
          <div class="input-field col s12 m3">
            <input v-model.trim="f2.role" id="f2_role" type="text" />
            <label for="f2_role">Search by Role</label>
          </div>
          <div class="input-field col s12 m3">
            <input v-model.trim="f2.status" id="f2_status" type="text" />
            <label for="f2_status">Search by Status</label>
          </div>
        </div>

        <vue-good-table
          :columns="cols2"
          :rows="rows2Filtered"
          :search-options="{ enabled: true, placeholder: 'Global search…' }"
          :pagination-options="{ enabled: true, perPage: 10 }"
          :sort-options="{ enabled: true }"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'

/** ---------- Ratings Table ---------- **/
const cols1 = [
  { label: 'Name', field: 'name', sortable: true },
  { label: 'Section', field: 'section', sortable: true },
  { label: 'Score', field: 'score', sortable: true, type: 'number' },
  { label: 'Date', field: 'date', sortable: true }
]
const baseRows1 = ref([])
function seedRatings() {
  const sections = ['For Students', 'For Professionals', 'For Seniors']
  const names = ['Alice','Bob','Carol','David','Eve','Frank','Grace','Henry','Ivy','Jack']
  const arr = []
  for (let i=0; i<40; i++) {
    const n = names[i % names.length]
    const s = sections[i % sections.length]
    const score = (i*7) % 5 + 1
    const day = (i%28)+1
    arr.push({ name:n, section:s, score, date:`2025-08-${String(day).padStart(2,'0')}` })
  }
  baseRows1.value = arr
}
const f1 = ref({ name: '', section: '', score: '' })
const rows1Filtered = computed(() =>
  baseRows1.value.filter(r =>
    r.name.toLowerCase().includes(f1.value.name.toLowerCase()) &&
    r.section.toLowerCase().includes(f1.value.section.toLowerCase()) &&
    String(r.score).includes(f1.value.score.trim())
  )
)

/** ---------- Users Table ---------- **/
const cols2 = [
  { label: 'Username', field: 'username', sortable: true },
  { label: 'Email', field: 'email', sortable: true },
  { label: 'Role', field: 'role', sortable: true },
  { label: 'Status', field: 'status', sortable: true },
]
const baseRows2 = ref([])
function seedUsers() {
  const roles = ['admin','user']
  const statuses = ['active','locked']
  const arr = []
  for (let i=1; i<=50; i++) {
    arr.push({
      username: `user${i}`,
      email: `user${i}@demo.com`,
      role: roles[i%2],
      status: statuses[i%2],
    })
  }
  baseRows2.value = arr
}
const f2 = ref({ username: '', email: '', role: '', status: '' })
const rows2Filtered = computed(() =>
  baseRows2.value.filter(r =>
    r.username.toLowerCase().includes(f2.value.username.toLowerCase()) &&
    r.email.toLowerCase().includes(f2.value.email.toLowerCase()) &&
    r.role.toLowerCase().includes(f2.value.role.toLowerCase()) &&
    r.status.toLowerCase().includes(f2.value.status.toLowerCase())
  )
)

/** ---------- CSV Export ---------- **/
function toCSV(columns, rows) {
  // 头部：列标题
  const header = columns.map(c => c.label)
  // 数据：按列 field 顺序取值
  const lines = rows.map(row =>
    columns.map(c => {
      const val = row[c.field] ?? ''
      // CSV 转义：把双引号替换成两个双引号，并用引号包裹
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  )
  return [header.join(','), ...lines].join('\r\n')
}
function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
function timestamp() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`
}
function exportRatingsCsv() {
  const csv = toCSV(cols1, rows1Filtered.value)
  downloadCSV(`ratings_${timestamp()}.csv`, csv)
}
function exportUsersCsv() {
  const csv = toCSV(cols2, rows2Filtered.value)
  downloadCSV(`users_${timestamp()}.csv`, csv)
}

onMounted(() => {
  seedRatings()
  seedUsers()
})
</script>

<style scoped>
.card { margin-bottom: 20px; }
</style>

