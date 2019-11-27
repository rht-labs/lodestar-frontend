<template>
  <main
    id="main-content-page-default-nav"
    role="main"
    class="pf-c-page__main"
    tabindex="-1"
  >
    <div class="pf-c-page__main-section">
      <div class="container">
        <div class="full-height">
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  auth: false,
  layout: 'empty'
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: calc(
    100vh - 76px - var(--pf-c-page__main-section--PaddingTop) -
      var(--pf-c-page__main-section--PaddingBottom)
  );
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.full-height {
  height: 100vh;
  display: flex;
  align-items: center;
}

.loader {
  border: 16px solid #ffe6e6; /* Light grey */
  border-top: 16px solid #ee0000; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
