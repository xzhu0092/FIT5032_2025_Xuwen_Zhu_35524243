<template>
  <div class="rating-box">
    <p><strong>Rate this section:</strong></p>
    <div class="stars">
      <span 
        v-for="n in 5" 
        :key="n" 
        class="star" 
        :class="{ selected: n <= currentRating }"
        @click="submitRating(n)"
      >
        ★
      </span>
    </div>
    <p>Average Rating: {{ averageRating.toFixed(1) }} / 5 ({{ ratingCount }} users)</p>
    <p v-if="hasRated" class="green-text">You have already rated this section.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const STORAGE_KEY = 'ratings'

const currentRating = ref(0)
const hasRated = ref(false)
const ratings = ref([])

const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const section = defineProps({
  sectionName: {
    type: String,
    required: true
  }
})

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  ratings.value = saved

  // 检查当前用户是否已经对该部分评分
  if (currentUser) {
    const existing = saved.find(r => r.user === currentUser.username && r.section === section.sectionName)
    if (existing) {
      currentRating.value = existing.score
      hasRated.value = true
    }
  }
})

function submitRating(score) {
  if (!currentUser) {
    alert('You must be logged in to rate.')
    return
  }

  const savedRatings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

  // 检查是否已经对当前 section 评分
  const existing = savedRatings.find(r => r.user === currentUser.username && r.section === section.sectionName)
  if (existing) {
    alert('You already rated this section.')
    return
  }

  const newRating = {
    user: currentUser.username,
    section: section.sectionName,
    score
  }

  savedRatings.push(newRating) // 保留原数据 + 当前用户评分

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRatings)) // 覆盖写入所有数据

  currentRating.value = score
  hasRated.value = true
  ratings.value = savedRatings // 更新组件的本地状态
}


const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const total = ratings.value.filter(r => r.section === section.sectionName).reduce((sum, r) => sum + r.score, 0)
  return total / ratings.value.filter(r => r.section === section.sectionName).length
})

const ratingCount = computed(() => ratings.value.filter(r => r.section === section.sectionName).length)
</script>

<style scoped>
.stars {
  font-size: 24px;
  cursor: pointer;
}

.star {
  color: lightgray;
}

.star.selected {
  color: orange;
}

.rating-box {
  margin-top: 10px;
}
</style>



