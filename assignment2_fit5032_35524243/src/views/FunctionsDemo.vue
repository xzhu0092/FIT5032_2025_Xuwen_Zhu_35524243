<template>
  <div class="container" style="max-width: 800px">
    <h4>Cloud Functions Demo</h4>

    <section class="card">
      <div class="card-content">
        <span class="card-title">1) Health Check (GET /ping)</span>
        <button class="btn" @click="callPing" :disabled="loadingPing">
          {{ loadingPing ? 'Loading…' : 'Call /ping' }}
        </button>
        <pre v-if="pingRes" style="white-space: pre-wrap">{{ pingRes }}</pre>
      </div>
    </section>

    <section class="card">
      <div class="card-content">
        <span class="card-title">2) Ratings Summary (POST /ratings-summary)</span>
        <p class="grey-text">把样例评分发给云端，返回平均分/分段/按板块统计。</p>
        <button class="btn" @click="callSummary" :disabled="loadingSum">
          {{ loadingSum ? 'Calculating…' : 'Send sample ratings' }}
        </button>
        <pre v-if="sumRes" style="white-space: pre-wrap">{{ sumRes }}</pre>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loadingPing = ref(false)
const loadingSum = ref(false)
const pingRes = ref('')
const sumRes = ref('')

async function callPing() {
  loadingPing.value = true
  pingRes.value = ''
  try {
    const r = await fetch('/.netlify/functions/ping')
    const j = await r.json()
    pingRes.value = JSON.stringify(j, null, 2)
  } catch (e) {
    pingRes.value = 'Error: ' + (e?.message || e)
  } finally {
    loadingPing.value = false
  }
}

async function callSummary() {
  loadingSum.value = true
  sumRes.value = ''
  try {
    const sample = [
      { name: 'Alice', section: 'For Students', score: 5, date: '2025-08-01' },
      { name: 'Bob', section: 'For Students', score: 3, date: '2025-08-02' },
      { name: 'Eve', section: 'For Professionals', score: 4, date: '2025-08-03' },
      { name: 'Jack', section: 'For Seniors', score: 2, date: '2025-08-04' },
      { name: 'Ivy', section: 'For Seniors', score: 5, date: '2025-08-05' },
    ]
    const r = await fetch('/.netlify/functions/ratings-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratings: sample }),
    })
    const j = await r.json()
    sumRes.value = JSON.stringify(j, null, 2)
  } catch (e) {
    sumRes.value = 'Error: ' + (e?.message || e)
  } finally {
    loadingSum.value = false
  }
}
</script>
