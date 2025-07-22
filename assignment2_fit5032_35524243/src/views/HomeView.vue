<template>
  <div class="container">
    <!-- 三栏布局：左空、中标题、右按钮 -->
    <div class="header-row">
      <div class="left-space"></div>
      <h4 class="title">Welcome to MindConnect</h4>
      <div class="register-button">
        <a class="btn blue" href="/register">Register Now</a>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="row">
      <div class="col s12 m6 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Students</span>
            <p>Anonymous self-assessment, mental health articles, peer discussions.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Learn More</a>
          </div>
        </div>
      </div>

      <div class="col s12 m6 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Professionals</span>
            <p>Stress management, mood tracking, professional counseling.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Explore</a>
          </div>
        </div>
      </div>

      <div class="col s12 m12 l4">
        <div class="card hoverable">
          <div class="card-content">
            <span class="card-title">For Seniors</span>
            <p>Large text, voice assistance, community support for elderly.</p>
          </div>
          <div class="card-action">
            <a href="#" class="blue-text">Get Started</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

/* 左边空白占位（与按钮宽度一致） */
.left-space {
  width: 120px;
}

/* 右侧按钮区域 */
.register-button {
  width: 120px;
  display: flex;
  justify-content: flex-end;
}

/* 中间标题居中对齐，占满剩余空间 */
.title {
  flex: 1;
  text-align: center;
  margin: 0;
}
</style>

