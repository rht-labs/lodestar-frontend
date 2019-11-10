<template>
  <main
    id="main-content-page-default-nav"
    role="main"
    class="pf-c-page__main"
    tabindex="-1"
  >
    <div class="pf-c-page__main-section">
      <div class="container">
        <div>
          <h1 class="title">Open Management Portal</h1>
          <h2 class="subtitle">
            Welcome to the OMP. You can request resources here!
          </h2>
          <div class="links">
            <Button text="this is my patternfly button!" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Button from '~/components/patternfly/Button.vue'

export default {
  components: {
    Button
  }
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

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
