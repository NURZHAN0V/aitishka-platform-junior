<script setup>
import { ref, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { NAV_ILLUSTRATIONS } from '@/core/constants/illustrations'
import { BaseIcon, BaseTooltip } from '@/core/components/ui'
import campLogo from '@/assets/images/illustrations/brand/it-sochi-camp-logo.png'

const props = defineProps({
  activeRoute: {
    type: String,
    default: 'home',
  },
})

const navGroups = [
  {
    id: 'top',
    illustration: NAV_ILLUSTRATIONS.home,
    items: [{ id: 'home', label: 'Главная', illustration: NAV_ILLUSTRATIONS.home, href: '/' }],
  },
  {
    id: 'study',
    title: 'Учёба',
    illustration: NAV_ILLUSTRATIONS.homework,
    items: [
      { id: 'schedule', label: 'Расписание', illustration: NAV_ILLUSTRATIONS.schedule, href: '/schedule' },
      { id: 'grades', label: 'Оценки', illustration: NAV_ILLUSTRATIONS.grades, href: '/grades' },
      { id: 'homework', label: 'Домашние задания', illustration: NAV_ILLUSTRATIONS.homework, href: '/homework' },
      { id: 'exams', label: 'Экзамены', illustration: NAV_ILLUSTRATIONS.exams, href: '/exams' },
      { id: 'rating', label: 'Рейтинг', illustration: NAV_ILLUSTRATIONS.rating, href: '/rating' },
    ],
  },
  {
    id: 'activity',
    title: 'Активность',
    illustration: NAV_ILLUSTRATIONS.journal,
    items: [
      { id: 'journal', label: 'Журнал', illustration: NAV_ILLUSTRATIONS.journal, href: '#' },
      { id: 'coins', label: 'Монетки', illustration: NAV_ILLUSTRATIONS.coins, href: '#' },
    ],
  },
  {
    id: 'shop',
    title: 'Магазин',
    illustration: NAV_ILLUSTRATIONS.market,
    items: [
      { id: 'market', label: 'Маркет', illustration: NAV_ILLUSTRATIONS.market, href: '/market' },
      { id: 'orders', label: 'Мои заказы', illustration: NAV_ILLUSTRATIONS.orders, href: '#' },
    ],
  },
  {
    id: 'finance',
    title: 'Финансы',
    illustration: NAV_ILLUSTRATIONS.payments,
    items: [{ id: 'payments', label: 'Платежи', illustration: NAV_ILLUSTRATIONS.payments, href: '#' }],
  },
]

const SIDEBAR_STATE_KEY = 'elektronnyj-dnevnik:sidebar-state'
const SIDEBAR_COLLAPSED_KEY_LEGACY = 'elektronnyj-dnevnik:sidebar-collapsed'
const DEFAULT_EXPANDED_GROUPS = ['study', 'shop']
const VALID_GROUP_IDS = new Set(navGroups.map((group) => group.id))

function normalizeExpandedGroups(groupIds) {
  if (!Array.isArray(groupIds)) {
    return [...DEFAULT_EXPANDED_GROUPS]
  }

  const normalized = groupIds.filter((id) => VALID_GROUP_IDS.has(id) && id !== 'top')
  return normalized.length > 0 ? normalized : [...DEFAULT_EXPANDED_GROUPS]
}

function readSidebarState() {
  try {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        collapsed: parsed.collapsed === true,
        expandedGroups: normalizeExpandedGroups(parsed.expandedGroups),
      }
    }

    const legacyCollapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY_LEGACY)
    if (legacyCollapsed === 'true' || legacyCollapsed === 'false') {
      return {
        collapsed: legacyCollapsed === 'true',
        expandedGroups: [...DEFAULT_EXPANDED_GROUPS],
      }
    }
  } catch {
    // localStorage недоступен (приватный режим и т.п.)
  }

  return {
    collapsed: false,
    expandedGroups: [...DEFAULT_EXPANDED_GROUPS],
  }
}

function saveSidebarState(state) {
  try {
    localStorage.setItem(
      SIDEBAR_STATE_KEY,
      JSON.stringify({
        collapsed: state.collapsed,
        expandedGroups: [...state.expandedGroups],
      }),
    )
    localStorage.removeItem(SIDEBAR_COLLAPSED_KEY_LEGACY)
  } catch {
    // ignore
  }
}

const sidebarState = readSidebarState()

const collapsed = ref(sidebarState.collapsed)
const sidebarHovered = ref(false)
const isTransitioning = ref(false)
const navCollapsedMounted = ref(collapsed.value)
const navExpandedMounted = ref(!collapsed.value)
const expandedGroups = ref(new Set(sidebarState.expandedGroups))
const openFlyoutId = ref(null)
let hideFlyoutTimer = null

function isInternalHref(href) {
  return typeof href === 'string' && href.startsWith('/')
}

function findGroupIdForRoute(routeId) {
  const group = navGroups.find((g) => g.items.some((item) => item.id === routeId))
  return group?.id ?? null
}

function isGroupActive(group) {
  return group.items.some((item) => item.id === props.activeRoute)
}

function initExpanded() {
  const groupId = findGroupIdForRoute(props.activeRoute)
  if (groupId && groupId !== 'top') {
    expandedGroups.value = new Set([...expandedGroups.value, groupId])
  }
}

initExpanded()

function persistSidebarState() {
  saveSidebarState({
    collapsed: collapsed.value,
    expandedGroups: expandedGroups.value,
  })
}

watch(
  () => props.activeRoute,
  () => {
    const groupId = findGroupIdForRoute(props.activeRoute)
    if (groupId && groupId !== 'top') {
      expandedGroups.value = new Set([...expandedGroups.value, groupId])
    }
  },
)

watch(collapsed, (value) => {
  if (value) {
    navCollapsedMounted.value = true
  } else {
    navExpandedMounted.value = true
  }

  persistSidebarState()
})

watch(
  expandedGroups,
  () => {
    persistSidebarState()
  },
  { deep: true },
)

onMounted(() => {
  const idle = window.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 200))
  idle(() => {
    navCollapsedMounted.value = true
    navExpandedMounted.value = true
  })
})

function isExpanded(groupId) {
  return expandedGroups.value.has(groupId)
}

function toggleGroup(groupId) {
  const next = new Set(expandedGroups.value)
  if (next.has(groupId)) {
    next.delete(groupId)
  } else {
    next.add(groupId)
  }
  expandedGroups.value = next
}

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  clearHideFlyoutTimer()
  openFlyoutId.value = null
}

function expandSidebar() {
  if (!collapsed.value) return
  collapsed.value = false
  clearHideFlyoutTimer()
  openFlyoutId.value = null
}

function isSidebarInteractiveTarget(target) {
  return Boolean(target.closest('a, button, .app-sidebar__flyout-panel'))
}

function onSidebarContextMenu(event) {
  if (!collapsed.value) return
  if (event.target.closest('.app-sidebar__flyout-link')) return

  event.preventDefault()
  expandSidebar()
}

function onCollapsedBackgroundClick(event) {
  if (!collapsed.value) return
  if (isSidebarInteractiveTarget(event.target)) return

  expandSidebar()
}

function onSidebarTransitionStart(event) {
  if (event.propertyName === 'width') {
    isTransitioning.value = true
  }
}

function onSidebarTransitionEnd(event) {
  if (event.propertyName === 'width') {
    isTransitioning.value = false
  }
}

function onSidebarEnter() {
  sidebarHovered.value = true
}

function onSidebarLeave() {
  sidebarHovered.value = false
}

function clearHideFlyoutTimer() {
  if (hideFlyoutTimer) {
    clearTimeout(hideFlyoutTimer)
    hideFlyoutTimer = null
  }
}

function showFlyout(groupId) {
  clearHideFlyoutTimer()
  openFlyoutId.value = groupId
}

function scheduleHideFlyout() {
  clearHideFlyoutTimer()
  hideFlyoutTimer = setTimeout(() => {
    openFlyoutId.value = null
    hideFlyoutTimer = null
  }, 180)
}
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{
      'app-sidebar--collapsed': collapsed,
      'app-sidebar--transitioning': isTransitioning,
    }"
    :title="collapsed ? 'Клик по пустому месту — развернуть панель' : undefined"
    @mouseenter="onSidebarEnter"
    @mouseleave="onSidebarLeave"
    @contextmenu="onSidebarContextMenu"
    @transitionstart="onSidebarTransitionStart"
    @transitionend="onSidebarTransitionEnd"
  >
    <div class="app-sidebar__brand" @click="onCollapsedBackgroundClick">
      <div class="app-sidebar__brand-mark">
        <img
          v-show="!collapsed || !sidebarHovered"
          :src="campLogo"
          alt="IT ШКОЛА Сочи"
          width="44"
          height="44"
          class="app-sidebar__logo-icon"
        />

        <BaseTooltip
          v-show="collapsed && sidebarHovered"
          class="app-sidebar__expand-tooltip"
          text="Развернуть панель"
          placement="right"
          :disabled="!collapsed || !sidebarHovered"
        >
          <button
            type="button"
            class="app-sidebar__expand app-sidebar__expand--brand"
            aria-label="Развернуть боковую панель"
            :aria-expanded="false"
            @click="toggleCollapsed"
          >
            <BaseIcon name="chevron-right" :size="18" />
          </button>
        </BaseTooltip>
      </div>

      <div v-show="!collapsed" class="app-sidebar__title">
        <span class="app-sidebar__title-main">IT ШКОЛА</span>
        <span class="app-sidebar__title-sub">Сочи</span>
      </div>

      <BaseTooltip
        v-show="!collapsed"
        class="app-sidebar__toggle-tooltip"
        text="Свернуть панель"
        placement="right"
        :disabled="collapsed"
      >
        <button
          type="button"
          class="app-sidebar__toggle"
          aria-label="Свернуть боковую панель"
          :aria-expanded="true"
          @click="toggleCollapsed"
        >
          <BaseIcon name="chevron-left" :size="18" />
        </button>
      </BaseTooltip>
    </div>

    <nav
      class="app-sidebar__nav"
      aria-label="Основная навигация"
      @click="onCollapsedBackgroundClick"
      @contextmenu="onSidebarContextMenu"
    >
      <div
        v-if="navCollapsedMounted"
        v-show="collapsed"
        class="app-sidebar__nav-mode app-sidebar__nav-mode--collapsed"
        :aria-hidden="!collapsed"
      >
        <div
          v-for="group in navGroups"
          :key="`collapsed-${group.id}`"
          class="app-sidebar__section"
          @pointerenter="group.title ? showFlyout(group.id) : undefined"
          @pointerleave="group.title ? scheduleHideFlyout() : undefined"
        >
          <BaseTooltip
            v-if="!group.title"
            :text="group.items[0].label"
            placement="right"
          >
            <component
              :is="isInternalHref(group.items[0].href) ? RouterLink : 'a'"
              :to="isInternalHref(group.items[0].href) ? group.items[0].href : undefined"
              :href="isInternalHref(group.items[0].href) ? undefined : group.items[0].href"
              class="app-sidebar__section-btn"
              :class="{ 'app-sidebar__section-btn--active': activeRoute === group.items[0].id }"
              :aria-label="group.items[0].label"
              :tabindex="collapsed ? 0 : -1"
            >
              <BaseIcon
                :name="group.illustration"
                type="avif"
                :size="32"
                class="app-sidebar__nav-icon"
                :label="group.items[0].label"
              />
            </component>
          </BaseTooltip>

          <div
            v-else
            class="app-sidebar__section-hover"
          >
            <button
              type="button"
              class="app-sidebar__section-btn"
              :class="{
                'app-sidebar__section-btn--active': isGroupActive(group),
                'app-sidebar__section-btn--open': openFlyoutId === group.id,
              }"
              :aria-label="group.title"
              :aria-expanded="openFlyoutId === group.id"
              :tabindex="collapsed ? 0 : -1"
              @pointerenter="showFlyout(group.id)"
              @pointerleave="scheduleHideFlyout"
            >
              <BaseIcon
                :name="group.illustration"
                type="avif"
                :size="32"
                class="app-sidebar__nav-icon"
                :label="group.title"
              />
            </button>

            <div
              v-show="openFlyoutId === group.id"
              class="app-sidebar__flyout"
              role="menu"
              @pointerenter="showFlyout(group.id)"
              @pointerleave="scheduleHideFlyout"
            >
              <div class="app-sidebar__flyout-panel">
                <component
                  :is="isInternalHref(item.href) ? RouterLink : 'a'"
                  v-for="item in group.items"
                  :key="item.id"
                  :to="isInternalHref(item.href) ? item.href : undefined"
                  :href="isInternalHref(item.href) ? undefined : item.href"
                  class="app-sidebar__flyout-link"
                  :class="{ 'app-sidebar__flyout-link--active': activeRoute === item.id }"
                  role="menuitem"
                >
                  {{ item.label }}
                </component>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="collapsed"
        class="app-sidebar__expand-zone"
        aria-hidden="true"
        @click.stop="expandSidebar"
        @contextmenu.prevent="expandSidebar"
      />

      <div
        v-if="navExpandedMounted"
        v-show="!collapsed"
        class="app-sidebar__nav-mode app-sidebar__nav-mode--expanded"
        :aria-hidden="collapsed"
      >
        <template v-for="group in navGroups" :key="`expanded-${group.id}`">
          <div v-if="!group.title" class="app-sidebar__group">
            <component
              :is="isInternalHref(item.href) ? RouterLink : 'a'"
              v-for="item in group.items"
              :key="item.id"
              :to="isInternalHref(item.href) ? item.href : undefined"
              :href="isInternalHref(item.href) ? undefined : item.href"
              class="app-sidebar__link"
              :class="{ 'app-sidebar__link--active': activeRoute === item.id }"
              :tabindex="collapsed ? -1 : 0"
            >
              <BaseIcon
                :name="item.illustration"
                type="avif"
                :size="32"
                class="app-sidebar__nav-icon"
                :label="item.label"
              />
              <span class="app-sidebar__link-label">{{ item.label }}</span>
            </component>
          </div>

          <div v-else class="app-sidebar__group app-sidebar__group--collapsible">
            <button
              type="button"
              class="app-sidebar__spoiler"
              :aria-expanded="isExpanded(group.id)"
              :tabindex="collapsed ? -1 : 0"
              @click="toggleGroup(group.id)"
            >
              <span class="app-sidebar__spoiler-label">{{ group.title }}</span>
              <BaseIcon
                name="chevron-down"
                :size="18"
                class="app-sidebar__spoiler-icon"
                :class="{ 'app-sidebar__spoiler-icon--open': isExpanded(group.id) }"
              />
            </button>

            <div
              v-show="isExpanded(group.id)"
              class="app-sidebar__spoiler-content"
            >
              <component
                :is="isInternalHref(item.href) ? RouterLink : 'a'"
                v-for="item in group.items"
                :key="item.id"
                :to="isInternalHref(item.href) ? item.href : undefined"
                :href="isInternalHref(item.href) ? undefined : item.href"
                class="app-sidebar__link app-sidebar__link--nested"
                :class="{ 'app-sidebar__link--active': activeRoute === item.id }"
                :tabindex="collapsed ? -1 : 0"
              >
                <BaseIcon
                  :name="item.illustration"
                  type="avif"
                  :size="32"
                  class="app-sidebar__nav-icon"
                  :label="item.label"
                />
                <span class="app-sidebar__link-label">{{ item.label }}</span>
              </component>
            </div>
          </div>
        </template>
      </div>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;
@use '@/assets/styles/mixins' as *;

.app-sidebar {
  @include no-select;

  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: $sidebar-width;
  height: 100vh;
  padding: $space-5 $space-4;
  background-color: $color-bg-sidebar;
  overflow: hidden;
  transition: width $transition-sidebar;

  &--transitioning {
    overflow: hidden;
    will-change: width;
  }

  &--collapsed {
    width: $sidebar-width-collapsed;
    padding: $space-5 $space-3;
    z-index: 100;
    cursor: context-menu;

    &:not(.app-sidebar--transitioning) {
      overflow: visible;
    }

    .app-sidebar__brand {
      justify-content: center;
      margin-bottom: $space-6;
      padding: 0;
      overflow: visible;
      cursor: context-menu;
    }

    .app-sidebar__nav {
      overflow: visible;
      cursor: context-menu;
    }

    .app-sidebar__nav-mode--collapsed {
      overflow: visible;
    }

    .app-sidebar__section-btn,
    .app-sidebar__flyout-link,
    .app-sidebar__toggle,
    .app-sidebar__expand,
    .app-sidebar__toggle-tooltip,
    .app-sidebar__expand-tooltip {
      cursor: pointer;
    }

    .app-sidebar__expand-zone {
      cursor: context-menu;
    }
  }

  &__brand {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: $space-3;
    margin-bottom: $space-6;
    padding: 0 $space-2;
  }

  &__brand-mark {
    position: relative;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
  }

  &__logo-icon {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    min-width: 0;
    overflow: hidden;
    transition: opacity $transition-sidebar;
  }

  &__title-main {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    white-space: nowrap;
  }

  &__title-sub {
    font-size: $font-size-xs;
    color: $color-text-muted;
    white-space: nowrap;
  }

  &__toggle-tooltip {
    display: inline-flex;
    flex-shrink: 0;
    margin-left: auto;
    cursor: pointer;
  }

  &__toggle {
    @include flex-center;

    flex-shrink: 0;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color $transition-base, color $transition-base, border-color $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      background-color: $color-primary-light;
      color: $color-primary;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__expand-tooltip {
    position: absolute;
    inset: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
  }

  &__expand {
    @include flex-center;

    flex-shrink: 0;
    padding: 0;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    background-color: $color-bg-card;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color $transition-base, color $transition-base, border-color $transition-base;

    &:hover {
      border-color: $color-primary-muted;
      background-color: $color-primary-light;
      color: $color-primary;
    }

    &:focus-visible {
      @include focus-ring;
    }

    &--brand {
      width: 44px;
      height: 44px;
    }
  }

  &__nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  &__expand-zone {
    flex: 1;
    width: 100%;
    min-height: $space-10;
    flex-shrink: 0;
    cursor: context-menu;
  }

  &__nav-mode {
    display: flex;
    flex-direction: column;
    gap: $space-2;

    &--collapsed {
      align-items: center;
      overflow: visible;
    }
  }

  &__section {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__section-hover {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 100%;
      width: $space-4;
      height: 100%;
    }
  }

  &__section-btn {
    @include flex-center;
    @include no-select;

    position: relative;
    z-index: 1;
    width: 52px;
    height: 52px;
    padding: 0;
    border: none;
    border-radius: $radius-md;
    background: transparent;
    color: $color-text-secondary;
    text-decoration: none;
    cursor: pointer;
    transition: background-color $transition-fast, color $transition-fast;

    &:hover,
    &--open {
      background-color: $color-bg-muted;
      color: $color-text-primary;
    }

    &--active {
      background: $gradient-primary;
      color: $color-text-inverse;
      box-shadow: $shadow-sm;

      &:hover {
        color: $color-text-inverse;
        filter: brightness(1.06);
      }
    }
  }

  &__nav-icon {
    flex-shrink: 0;
    pointer-events: none;
  }

  &__flyout {
    position: absolute;
    top: 0;
    left: 100%;
    z-index: 3000;
    padding-left: $space-4;
  }

  &__flyout-panel {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    min-width: 240px;
    padding: $space-2;
    border: 1px solid $color-border-light;
    border-radius: $radius-lg;
    background-color: $color-bg-card;
    box-shadow: $shadow-lg;
  }

  &__flyout-link {
    display: block;
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    color: $color-text-primary;
    text-decoration: none;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color $transition-fast, color $transition-fast;

    &:hover:not(&--active) {
      background-color: $color-bg-muted;
    }

    &--active {
      color: $color-primary;
      font-weight: $font-weight-semibold;
      background-color: $color-primary-light;

      &:hover {
        color: $color-primary;
        background-color: $color-bg-muted;
      }
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: $space-1;

    &--collapsible {
      gap: 0;
    }
  }

  &__spoiler {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: $space-3 $space-4;
    border: none;
    border-radius: $radius-md;
    background: transparent;
    font-family: inherit;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    cursor: pointer;
    transition: background-color $transition-base;

    &:hover {
      background-color: $color-bg-muted;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__spoiler-label {
    text-align: left;
    white-space: nowrap;
  }

  &__spoiler-icon {
    flex-shrink: 0;
    color: $color-text-muted;
    transition: transform $transition-base;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__spoiler-content {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    padding-bottom: $space-2;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    color: $color-text-secondary;
    text-decoration: none;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: background-color $transition-base, color $transition-base, filter $transition-base;

    &:hover:not(&--active) {
      background-color: $color-primary-light;
      color: $color-primary;
    }

    &--nested {
      padding-left: $space-5;
    }

    &--active {
      background: $gradient-primary;
      color: $color-text-inverse;
      box-shadow: $shadow-sm;

      &:hover {
        color: $color-text-inverse;
        filter: brightness(1.06);
      }
    }
  }

  &__link-label {
    white-space: nowrap;
  }
}
</style>
