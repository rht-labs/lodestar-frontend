<template>
  <main
    id="main-content-page-default-nav"
    role="main"
    class="pf-c-page__main"
    tabindex="-1"
  >
    <section class="pf-c-page__main-section pf-m-light">
      <div class="pf-c-content">
        <h1>New Project</h1>
        <p>Set up a new project to request resources</p>
      </div>
    </section>
    <section class="pf-c-page__main-wizard">
      <div class="pf-c-wizard pf-m-in-page fill-wizard">
        <button
          aria-label="Wizard Header Toggle"
          class="pf-c-wizard__toggle"
          aria-expanded="false"
        >
          <ol class="pf-c-wizard__toggle-list">
            <li class="pf-c-wizard__toggle-list-item">
              <span class="pf-c-wizard__toggle-num">2</span>Point of Contact
              <!-- <i
                class="fas fa-angle-right pf-c-wizard__toggle-separator"
                aria-hidden="true"
              >
              </i> -->
            </li>
            <!-- <li class="pf-c-wizard__toggle-list-item">Substep B</li> -->
          </ol>
          <i
            class="fas fa-caret-down pf-c-wizard__toggle-icon"
            aria-hidden="true"
          >
          </i>
        </button>
        <div class="pf-c-wizard__outer-wrap">
          <div class="pf-c-wizard__inner-wrap">
            <nav class="pf-c-wizard__nav" aria-label="Steps">
              <ol class="pf-c-wizard__nav-list">
                <li class="pf-c-wizard__nav-item">
                  <a href="#" class="pf-c-wizard__nav-link">
                    Basic Information
                  </a>
                </li>
                <li class="pf-c-wizard__nav-item">
                  <a href="#" class="pf-c-wizard__nav-link pf-m-current">
                    Point of Contact
                  </a>
                  <!-- <ol class="pf-c-wizard__nav-list">
                    <li class="pf-c-wizard__nav-item">
                      <a href="#" class="pf-c-wizard__nav-link">Substep A</a>
                    </li>
                    <li class="pf-c-wizard__nav-item">
                      <a
                        href="#"
                        class="pf-c-wizard__nav-link pf-m-current"
                        aria-current="page"
                      >
                        Substep B
                      </a>
                    </li>
                    <li class="pf-c-wizard__nav-item">
                      <a href="#" class="pf-c-wizard__nav-link">Substep C</a>
                    </li>
                  </ol> -->
                </li>
                <li class="pf-c-wizard__nav-item">
                  <a href="#" class="pf-c-wizard__nav-link">
                    OpenShift Cluster
                  </a>
                </li>
                <li class="pf-c-wizard__nav-item">
                  <a href="#" class="pf-c-wizard__nav-link">
                    Tools &amp; Services
                  </a>
                </li>
                <li class="pf-c-wizard__nav-item">
                  <a href="#" class="pf-c-wizard__nav-link">
                    Users
                  </a>
                </li>
                <li class="pf-c-wizard__nav-item">
                  <a
                    href="#"
                    class="pf-c-wizard__nav-link pf-m-disabled"
                    aria-disabled="true"
                    tabindex="-1"
                  >
                    Review
                  </a>
                </li>
              </ol>
            </nav>
            <div class="pf-c-wizard__main">
              <div class="pf-c-wizard__main-body">
                <p>Wizard content goes here</p>
              </div>
            </div>
          </div>
          <footer class="pf-c-wizard__footer">
            <button class="pf-c-button pf-m-primary" type="submit">Next</button>
            <button class="pf-c-button pf-m-secondary" type="button">
              Back
            </button>
            <button class="pf-c-button pf-m-link" type="button">Cancel</button>
          </footer>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  components: {}
}
</script>

<style scoped>
.fill-wizard {
  min-height: calc(100vh - 76px - 112px);
  /*                ^ 100% window height
                            ^ header height
                                    ^ title height
  */
}
</style>
