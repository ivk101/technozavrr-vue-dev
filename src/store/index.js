import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { API_BASE_URL } from "../config";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    categoriesData: [],
    colorsData: [],
    userAccessKey: null,
    cartProductsData: [],

    cartLoading: false,
    cartLoadingFailed: false,

    orderInfo: null,
    deliveryPrice: 0
  },
  mutations: {
    updateCartProductQuantity(state, { productBasketId, quantity }) {
      const item = state.cartProducts.find(item => item.productBasketId === productBasketId);

      if (item) {
        item.quantity = quantity;
      }
    },
    deleteCartProduct(state, productBasketId) {
      state.cartProducts = state.cartProducts.filter(
        item => item.productBasketId !== productBasketId
      );
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map(item => ({
        productBasketId: item.id,
        color: item.color.id,
        quantity: item.quantity
      }));
    },
    resetCart(state) {
      (state.cartProducts = []), (state.cartProductsData = []);
    },
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    updateDeliveryPrice(state, price) {
      state.deliveryPrice = price;
    }
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map(item => {
        const product = state.cartProductsData.find(p => p.id === item.productBasketId);
        return {
          ...item,
          product: {
            ...product,
            image: product.productOffer.product.preview.file.url
          }
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.quantity + acc,
        0
      );
    },
    cartTotalPosition(state) {
      return state.cartProducts.length;
    },
    cartLoading(state) {
      return state.cartLoading;
    },
    cartLoadingFailed(state) {
      return state.cartLoadingFailed;
    },
    orderInfo(state) {
      return state.orderInfo;
    },
    orderInfoItems(state) {
      if (state.orderInfo) {
        return state.orderInfo.basket.items;
      }
    },
    totalPriceInfo(state) {
      if (state.orderInfo) {
        return state.orderInfo.basket.items.reduce(
          (acc, item) => item.price * item.quantity + acc,
          0
        );
      }
    },
    totalPositionInfo(state) {
      if (state.orderInfo) {
        return state.orderInfo.basket.items.length;
      }
    },
    getDeliveryPrice(state) {
      return state.deliveryPrice;
    }
  },
  actions: {
    loadCart(context) {
      context.state.cartLoading = true;
      context.state.cartLoadingFailed = false;

      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          if (!context.state.userAccessKey) {
            localStorage.setItem("userAccessKey", response.data.user.accessKey);
            context.commit("updateUserAccessKey", response.data.user.accessKey);
          }
          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        })
        .catch(() => {
          context.state.cartLoadingFailed = true;
        })
        .then(() => {
          context.state.cartLoading = false;
        });
    },
    addProductToCart(context, { productId, colorId, amount }) {
      return axios
        .post(
          `${API_BASE_URL}/api/baskets/products`,
          {
            productOfferId: productId,
            colorId,
            quantity: amount
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
          context.commit("syncCartProducts");
        });
    },
    updateCartProductQuantity(context, { productBasketId, quantity }) {
      context.commit("updateCartProductQuantity", { productBasketId, quantity });

      if (quantity < 1) {
        return;
      }

      return axios
        .put(
          `${API_BASE_URL}/api/baskets/products`,
          {
            basketItemId: productBasketId,
            quantity
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey
            }
          }
        )
        .then(response => {
          context.commit("updateCartProductsData", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
    deleteCartProduct(context, productBasketId) {
      context.commit("deleteCartProduct", productBasketId);

      return axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            basketItemId: productBasketId
          },
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit("deleteCartProduct", response.data.items);
        })
        .catch(() => {
          context.commit("syncCartProducts");
        });
    },
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
        .then(response => {
          context.commit("updateOrderInfo", response.data);
        });
    }
  }
});
