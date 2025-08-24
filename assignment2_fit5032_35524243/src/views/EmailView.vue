<template>
  <div class="container" style="max-width:720px">
    <h4 class="center-align">Send Email</h4>

    <!-- 表单必须用 ref，sendForm 会抓取里面的字段 -->
    <form ref="formRef" @submit.prevent="onSend" novalidate>
      <!-- 收件人 -->
      <div class="input-field">
        <input
          id="to_email"
          name="to_email"
          type="email"
          v-model="to"
          required
        />
        <label for="to_email">Recipient Email</label>
      </div>

      <!-- 主题 -->
      <div class="input-field">
        <input
          id="subject"
          name="subject"
          type="text"
          v-model="subject"
          required
        />
        <label for="subject">Subject</label>
      </div>

      <!-- 正文 -->
      <div class="input-field">
        <textarea
          id="message"
          name="message"
          class="materialize-textarea"
          v-model="message"
          required
        ></textarea>
        <label for="message">Message</label>
      </div>

      <!-- 附件 -->
      <div class="file-field input-field">
        <div class="btn">
          <span>Attachment</span>
          <input name="my_file" type="file" @change="onPickFile" />
        </div>
        <div class="file-path-wrapper">
          <input
            class="file-path validate"
            type="text"
            :placeholder="fileName || 'Optional'"
          />
        </div>
      </div>

      <p class="red-text" v-if="err">{{ err }}</p>
      <p class="green-text" v-if="ok">Email sent successfully!</p>

      <button class="btn" type="submit" :disabled="loading || !canSubmit">
        <span v-if="!loading">Send</span>
        <span v-else>Sending…</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import emailjs from '@emailjs/browser'

const formRef = ref(null)
const to = ref('')
const subject = ref('')
const message = ref('')
const fileName = ref('')
const loading = ref(false)
const ok = ref(false)
const err = ref('')

const canSubmit = computed(() =>
  !!to.value && !!subject.value && !!message.value && !loading.value
)

function onPickFile(e) {
  const f = e.target.files?.[0]
  fileName.value = f?.name || ''
}

async function onSend() {
  err.value = ''
  ok.value = false
  if (!canSubmit.value) return

  try {
    loading.value = true
    const res = await emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.value,
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    )
    if (res.status !== 200) throw new Error('EmailJS failed')
    ok.value = true
    subject.value = ''
    message.value = ''
    fileName.value = ''
    formRef.value.reset()
  } catch (e) {
    err.value = e?.text || e?.message || 'Send failed'
  } finally {
    loading.value = false
  }
}
</script>
