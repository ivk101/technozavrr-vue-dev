<template>
  <BaseFormField :title="title" :error="error">
    <textarea class="form__input form__input--area" v-model="dataValue" :placeholder="placeholder">
    </textarea>
  </BaseFormField>
</template>

<script>
import formFieldMixin from "@/mixins/formFieldMixin";
import BaseFormField from "@/components/BaseFormField";

export default {
  props: ["title", "error", "placeholder"],
  components: { BaseFormField },
  mixins: [formFieldMixin]
};
</script>
