<script setup>
import { computed, ref } from 'vue'
import { BaseSlider } from '@/core/components/ui'
import { HOME_BANNERS } from '../constants/banners.js'
import HomeBannerSlide from './HomeBannerSlide.vue'

const props = defineProps({
  banners: {
    type: Array,
    default: () => HOME_BANNERS,
  },
})

const activeIndex = ref(0)

const sliderAriaLabel = computed(() => {
  if (props.banners.length > 1) return 'Баннеры'
  return props.banners[0]?.ariaLabel ?? 'Баннер'
})
</script>

<template>
  <BaseSlider
    v-model="activeIndex"
    class="home-banner-slider"
    :items="banners"
    :aria-label="sliderAriaLabel"
    :allow-overflow="true"
  >
    <template #slide="{ item }">
      <HomeBannerSlide :banner="item" />
    </template>
  </BaseSlider>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.home-banner-slider {
  :deep(.base-slider__viewport) {
    overflow: visible;
  }

  :deep(.base-slider__slide) {
    height: $banner-height;
  }
}
</style>
