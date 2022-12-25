<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ totalPosition + " " + endingCountProducts(totalPosition) }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="validateForm">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              v-model="formData.name"
              :error="formError.name"
              title="ФИО"
              placeholder="Введите ваше полное имя"
              :front="front.name"
            />

            <BaseFormText
              v-model="formData.address"
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              :front="front.address"
            />

            <BaseFormText
              v-model="formData.phone"
              title="Телефон"
              :error="formError.phone"
              placeholder="Введите ваш телефон"
              :front="front.phone"
            />

            <BaseFormText
              v-model="formData.email"
              title="Email"
              :error="formError.email"
              placeholder="Введите ваш Email"
              :front="front.email"
            />

            <BaseFormTextarea
              title="Комментарий к заказу"
              v-model="formData.comment"
              :error="formError.comment"
              placeholder="Ваши пожелания"
            />
            <BaseFormTextArea
              v-model="formData.comment"
              title="Комментарий к заказу"
              :error="formError.comment"
              placeholder="Ваши пожелания"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveriesData" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="item.id"
                    v-model="formData.deliveryTypeId"
                  />
                  <span class="options__value">
                    {{ item.title }}
                    <b
                      >{{ item.price == 0 ? "бесплатно" : item.price }}
                      <span class="rub" v-if="item.price > 0">i</span>
                    </b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>

            <ul class="cart__options options">
              <li class="options__item" v-for="item in paymentsData" :key="item.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="item.id"
                    v-model="formData.paymentTypeId"
                  />
                  <span class="options__value">
                    {{ item.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products">
              <div>
                <h3>{{ item.product.productOffer.title }}</h3>
                <p class="cart__order--color">Цвет: {{ item.product.color.color.title }}</p>
              </div>
              <b
                >{{ (item.quantity * item.product.price) | numberFormat }}
                <span class="rub">i</span></b
              >
              <span>Артикул: {{ item.product.productOffer.id || numberFormat }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ deliveryPrice }} <span class="rub">i</span></b>
            </p>
            <p>
              Итого: <b>{{ totalPosition }}</b> {{ endingCountProducts(totalPosition) }} на сумму
              <b>{{ (totalPrice + deliveryPrice) | numberFormat }} <span class="rub">i</span></b>
            </p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
          <div class="loader" v-if="formSending">Отправляем данные...</div>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';
import { API_BASE_URL } from '../config';
import BaseFormText from '@/components/BaseFormText';
import BaseFormTextarea from '@/components/BaseFormTextarea';
import numberFormat from '@/helpers/numberFormat';
import endingCountProducts from '@/helpers/endingCountProducts';

export default {
  data() {
    return {
      formData: {
        deliveryTypeId: null,
        paymentTypeId: null,
      },
      formError: {},
      formSending: false,
      formErrorMessage: '',
      errors: [],
      front: {
        name: '',
        address: '',
        phone: '',
        email: '',
      },
      deliveriesData: [],
      paymentsData: [],
    };
  },
  filters: { numberFormat },
  components: { BaseFormText, BaseFormTextarea },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalPosition: 'cartTotalPosition',
    }),
    deliveryPrice() {
      return this.formData.deliveryTypeId
        ? +this.deliveriesData.find((item) => item.id === this.formData.deliveryTypeId).price
        : 0;
    },
  },
  methods: {
    ...mapMutations(['updateDeliveryPrice']),
    endingCountProducts,
    validEmail(email) {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    },
    validPhone(phone) {
      const pattern = /^\+\d{11}$/;
      return pattern.test(phone);
    },
    validateForm() {
      this.errors = [];
      this.front.name = '';
      this.front.address = '';
      this.front.phone = '';
      this.front.email = '';
      if (!this.formData.name) {
        this.errors.push('Имя');
        this.front.name = 'Введите свое имя пожалуйста';
      }
      if (!this.formData.address) {
        this.errors.push('Адрес');
        this.front.address = 'Введите адрес доставки пожалуйста';
      }
      if (!this.formData.phone) {
        this.errors.push('Телефон');
        this.front.phone = 'Вы забыли указать свой номер телефона';
      } else if (!this.validPhone(this.formData.phone)) {
        this.errors.push('Телефон');
        this.front.phone = 'Укажите корректный номер телефона';
      }
      if (!this.formData.email) {
        this.errors.push('Емейл');
        this.front.email = 'Заполните поле Email пожалуйста';
      } else if (!this.validEmail(this.formData.email)) {
        this.errors.push('Емейл');
        this.front.email = 'Укажите корректный адрес электронной почты';
      }
      if (!this.errors.length) {
        this.order();
      }
    },
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.formSending = true;

      axios
        .post(
          `${API_BASE_URL}/api/orders`,
          {
            ...this.formData,
          },
          {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          },
        )
        .then((response) => {
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        })
        .then(() => (this.formSending = false));
    },
    loadDeliveries() {
      axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => (this.deliveriesData = response.data))
        .then(() => {
          this.formData.deliveryTypeId = this.deliveriesData[0].id;
        })
        .then(() => {
          this.loadPayments(this.formData.deliveryTypeId);
        });
    },
    loadPayments(value) {
      axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: value,
          },
        })
        .then((response) => (this.paymentsData = response.data))
        .then(() => {
          this.formData.paymentTypeId = this.paymentsData[0].id;
        });
    },
  },
  created() {
    this.loadDeliveries();
  },
  watch: {
    'formData.deliveryTypeId': function (val, oldVal) {
      if (oldVal === null) {
        return;
      }
      axios
        .get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.formData.deliveryTypeId,
          },
        })
        .then((response) => {
          this.paymentsData = response.data;
        })
        .then(() => {
          this.formData.paymentTypeId = this.paymentsData[0].id;
        });
    },
    deliveryPrice() {
      this.$store.commit('updateDeliveryPrice', Number(this.deliveryPrice));
    },
  },
};
</script>

<style>
.loader,
.loader:after {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.loader {
  margin: auto;
  margin-top: 20px;
  font-size: 10px;
  position: relative;
  text-indent: -9999px;
  border-top: 1.1px solid rgba(16, 15, 15, 0.2);
  border-right: 1.1px solid rgba(16, 15, 15, 0.2);
  border-bottom: 1.1px solid rgba(16, 15, 15, 0.2);
  border-left: 1.1px solid #100f0f;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
