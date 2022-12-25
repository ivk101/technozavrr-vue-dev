<template>
  <BaseFormField :title="title" :front="front" :error="error">
    <input class="form__input" v-model="dataValue" type="text" :placeholder="placeholder" />
  </BaseFormField>
</template>

<script>
import formFieldMixin from "@/mixins/formFieldMixin";
import BaseFormField from "@/components/BaseFormField";

export default {
  props: ["title", "error", "placeholder", "front"],
  components: { BaseFormField },
  mixins: [formFieldMixin]
};
</script>
