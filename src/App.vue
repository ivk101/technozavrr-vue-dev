<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import CartIndicator from '@/components/CartIndicator';
import Header from './components/Header.vue';
import Footer from '@/components/Footer';

export default {
  components: { CartIndicator, Header, Footer },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
  },
};
</script>
