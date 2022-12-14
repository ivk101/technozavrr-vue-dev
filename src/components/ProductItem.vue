<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price"> {{ currentPrice | numberFormat }} &#8381; </span>

    <ul class="colors colors--black" v-if="product.mainProp.id != 7">
      <li class="colors__item" v-for="(item, index) in product.colors" :key="item.color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            :name="item.id"
            type="radio"
            v-model="pickedColor"
            :value="index"
          />
          <span class="colors__value" :style="{ 'background-color': item.color.code }"> </span>
        </label>
      </li>
    </ul>
    <MainPropPicker
      :products="product.offers"
      :price-update.sync="currentPrice"
      :current-prop.sync="product.id"
      :current-prop-id.sync="product.mainProp.id"
    />
  </li>
</template>

<script>
import gotoPage from "@/helpers/gotoPage";
import numberFormat from "@/helpers/numberFormat";
import MainPropPicker from "@/components/MainPropPicker.vue";

export default {
  data() {
    return {
      currentPrice: null,
      pickedColor: null
    };
  },
  filters: {
    numberFormat
  },
  props: ["product"],
  components: { MainPropPicker },
  methods: {
    gotoPage
  },
  created() {
    this.currentPrice = this.product.offers[0].price;
  },
  mounted() {
    this.pickedColor = 0;
  }
};
</script>

<style>
.colors {
  margin-bottom: 10px;
}
</style>
