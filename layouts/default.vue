<template>
  <div v-if="invoicesLoaded">
    <div v-if="!isMobile" class="app flex flex-column">
      <Navigation />

      <div class="app-content flex flex-column">
        <Modal v-if="modalActive" />
        <transition name="invoice">
          <InvoiceModal v-if="invoiceModal" />
        </transition>
        <Nuxt />
        <Footer />
      </div>
    </div>
    <div v-else class="mobile-message flex flex-column">
      <h2>Sorry, this app is not supported on Mobile Devices!</h2>
      <p>To use this app, please use computer or Tablet</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      isMobile: false,
    };
  },
  computed: {
    ...mapState(['invoiceModal', 'modalActive', 'invoicesLoaded']),
  },
  mounted() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen);
  },
  methods: {
    ...mapActions(['GET_INVOICES']),
    checkScreen() {
      const windowWidth = window.innerWidth;
      if (windowWidth < 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
  },
};
</script>
