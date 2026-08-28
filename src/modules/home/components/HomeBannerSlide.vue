<script setup>
defineProps({
  banner: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <component
    :is="banner.href ? 'a' : 'article'"
    class="home-banner-slide"
    :href="banner.href || undefined"
    :aria-label="banner.ariaLabel"
  >
    <div class="home-banner-slide__clip" aria-hidden="true">
      <img
        class="home-banner-slide__image"
        :src="banner.image"
        alt=""
        width="1200"
        height="499"
        decoding="async"
      />
    </div>

    <div class="home-banner-slide__content">
      <p class="home-banner-slide__slogan">
        <span
          v-for="(line, index) in banner.sloganLines"
          :key="line"
          class="home-banner-slide__line"
          :style="{ '--line-index': index }"
        >
          {{ line }}
        </span>
      </p>
    </div>
  </component>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.home-banner-slide {
  position: relative;
  display: block;
  height: $banner-height;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-decoration: none;
  background: $gradient-banner;
  border-radius: $radius-2xl;

  &__clip {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 55% center;
  }

  &__content {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: clamp(3.5rem, 16vw, 10rem);
    pointer-events: none;
  }

  &__slogan {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    font-size: clamp(
      $banner-slogan-size-min,
      $banner-slogan-size-preferred + 0.25rem,
      $banner-slogan-size-max
    );
    transform: rotate(-6deg) translateY(0.75rem);
    transform-origin: left center;
    user-select: none;
  }

  &__line {
    @include banner-slogan-text;

    display: block;
    white-space: nowrap;
    transform: translateX(calc(var(--line-index) * #{$banner-slogan-line-shift}));

    & + & {
      margin-top: -0.02em;
    }
  }

  &:is(a) {
    cursor: pointer;
    transition: filter $transition-base;

    &:hover {
      filter: brightness(1.03);
    }
  }
}

@media (max-width: 900px) {
  .home-banner-slide {
    &__content {
      padding-left: clamp(2.5rem, 12vw, 6rem);
    }

    &__slogan {
      font-size: clamp(1.75rem, 4.8vw + 0.35rem, 2.75rem);
    }

    &__line {
      -webkit-text-stroke-width: 3px;
      transform: translateX(calc(var(--line-index) * 1.25rem));
    }

    &__image {
      object-position: 58% center;
    }
  }
}

@media (max-width: 640px) {
  .home-banner-slide {
    &__content {
      padding-left: clamp(1.75rem, 10vw, 3.5rem);
    }

    &__slogan {
      font-size: clamp(1.5rem, 5.8vw, 2rem);
      transform: rotate(-5deg) translateY(0.5rem);
    }

    &__line {
      -webkit-text-stroke-width: 2.5px;
      transform: translateX(calc(var(--line-index) * 0.75rem));
    }

    &__image {
      object-position: 62% center;
    }
  }
}
</style>
