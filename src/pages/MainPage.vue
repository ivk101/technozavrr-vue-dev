<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{ countProducts + " " + endingCountProducts(countProducts) }}
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :prop-id.sync="filterPropId"
        :prop-name.sync="filterPropName"
        :color-id.sync="filterColorId"
      />

      <section class="catalog">
        <div v-if="productsLoading">Загрузка товаров...</div>
        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке товаров
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>

        <ProductList :products="products" />
        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from "./../components/ProductList.vue";
import BasePagination from "./../components/BasePagination.vue";
import ProductFilter from "./../components/ProductFilter";
import axios from "axios";
import { API_BASE_URL } from "../config";
import endingCountProducts from "@/helpers/endingCountProducts";

export default {
  name: "App",
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: null,
      filterPriceTo: null,
      filterCategoryId: 0,
      filterPropId: [],
      filterPropName: null,
      filterColorId: [],

      page: 1,
      productsPerPage: 3,
      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false,
      loadProductsTimer: null
    };
  },
  computed: {
    products() {
      function filterColors(a, b) {
        let x = a.reduce((akk, item) => {
          akk.push(b.includes(item.color.id));
          return akk;
        }, []);
        return x.includes(true);
      }
      let data = this.productsData
        ? this.productsData.items.map(product => {
            return {
              ...product,
              image: product.preview.file.url
            };
          })
        : [];
      return this.filterColorId.length > 0
        ? data.filter(item => filterColors(item.colors, this.filterColorId))
        : data;
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    filterName() {
      return this.filterPropName ? `props[${this.filterPropName}]` : null;
    }
  },
  methods: {
    endingCountProducts,
    categoryPatcher() {
      if (this.$route.query.category) {
        this.filterCategoryId = Number(this.$route.query.category);
      }
    },
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + "/api/products", {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
              [this.filterName]: this.filterPropId
            }
          })
          .then(response => (this.productsData = response.data))
          .catch(() => (this.productsLoadingFailed = true))
          .then(() => (this.productsLoading = false));
      }, 0);
    }
  },
  created() {
    this.loadProducts();
    this.categoryPatcher();
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
    filterPropId() {
      this.loadProducts();
    }
  }
};
</script>
