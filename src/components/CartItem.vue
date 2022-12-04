<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        srcset="img/phone-square-3@2x.jpg 2x"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.productOffer.title }}
    </h3>
    <p class="product__info" style="{display:inline-flex}">
      {{ item.product.productOffer.product.mainProp.title }}: &nbsp;
      <span
        style="display:inline-block"
        class="colors__value"
        :style="{ 'background-color': getColorCode(item.product.productOffer.propValues[0].value) }"
        v-if="item.product.productOffer.product.mainProp.id == 7"
      >
      </span>
      &nbsp; {{ item.product.productOffer.propValues[0].value }}
    </p>
    <span class="product__code"> Артикул: {{ item.product.productOffer.id }} </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click="decrementQuantity">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="quantity" name="count" />

      <button type="button" aria-label="Добавить один товар" @click="incrementQuantity">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      <p>{{ (item.quantity * item.product.price) | numberFormat }} <span class="rub">i</span></p>
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteCartProduct(item.productBasketId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import getColorCode from "@/helpers/getColorCode";
import { mapMutations, mapActions } from "vuex";

export default {
  props: ["item"],
  filters: { numberFormat },
  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch("updateCartProductQuantity", {
          productBasketId: this.item.productBasketId,
          quantity: value
        });
      }
    }
  },
  methods: {
    ...mapActions(["deleteCartProduct"]),
    getColorCode,
    incrementQuantity() {
      this.$store.commit("updateCartProductQuantity", {
        productBasketId: this.item.productBasketId,
        quantity: ++this.quantity
      });
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.$store.commit("updateCartProductQuantity", {
          productBasketId: this.item.productBasketId,
          quantity: --this.quantity
        });
      }
    }
  }
};
</script>
