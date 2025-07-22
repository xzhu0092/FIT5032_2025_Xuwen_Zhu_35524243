<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-10 offset-1 col-md-8 offset-md-2 mx-auto">
        <h1 class="text-center mb-4">User Information Form / Credentials</h1>
        <form @submit.prevent="submitForm">

         <div class="row mb-3">
            <div class="col-sm-6"> <label for="username" class="form-label">Username:</label>
              <input type="text" class="form-control" id="username" 
              @blur="() => validateName(true)"
              @input="() => validateName(false)"
              v-model="formData.username">
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-sm-6"> <label for="password" class="form-label">Password:</label>
              <input type="password" class="form-control" id="password" 
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)"
              v-model="formData.password" />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6"> <div class="form-check pt-2">
                <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian">
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-sm-6"> <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" 
              @blur="() => validateGender(true)"      
              @change="() => validateGender(false)"
              v-model="formData.gender">      
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="reason" class="form-label">Reason For Joining:</label>
            <textarea class="form-control" id="reason" rows="3" v-model="formData.reason"></textarea>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  

  <div>
    <hr /> 
    <div class="card">
      <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
        <Column field="username" header="Username"></Column>
        <Column field="password" header="Password"></Column>
        <Column field="isAustralian" header="Australian Resident"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="reason" header="Reason"></Column>
      </DataTable>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: '',
});

const submittedCards = ref([]);

const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null,
});

const validateName = (blur) => {
  if (formData.value.username.trim().length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else {
    errors.value.username = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }
};

const validateReason = (blur) => {
  if (!formData.value.reason.trim()) {
    if (blur) errors.value.reason = "Reason is required.";
  } else {
    errors.value.reason = null;
  }
};

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) errors.value.resident = "You must be an Australian resident.";
  } else {
    errors.value.resident = null;
  }
};

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = "Please select a gender.";
  } else {
    errors.value.gender = null;
  }
};

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: '',
  };
  
  Object.keys(errors.value).forEach(key => errors.value[key] = null);
};

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateReason(true);
  validateResident(true);
  validateGender(true);

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.reason &&
    !errors.value.resident &&
    !errors.value.gender
  ) {
    submittedCards.value.push({ ...formData.value });
    clearForm();
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
.text-danger {
  font-size: 0.9rem;
}
</style>
