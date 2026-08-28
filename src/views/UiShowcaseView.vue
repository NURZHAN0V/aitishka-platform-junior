<script setup>
import { computed, ref } from 'vue'
import AppLayout from '@/core/layouts/AppLayout.vue'
import {
  ALL_ILLUSTRATIONS,
  BRAND_ILLUSTRATIONS,
  MARKET_ILLUSTRATIONS,
  WIDGET_ILLUSTRATIONS,
} from '@/core/constants/illustrations'
import { useSubjectIllustrations } from '@/core/composables/useSubjectIllustration'
import { useConfirm } from '@/core/composables/useConfirm'
import { useToast } from '@/core/composables/useToast'
import { hasIcon } from '@/utils/icons'
import {
  BaseAvatar,
  BaseBadge,
  BaseBadgeWrapper,
  BaseButton,
  BaseCard,
  BaseChip,
  BaseConfirm,
  BaseFileUpload,
  BaseIcon,
  BaseInput,
  BaseModal,
  BaseSelect,
  BaseTabs,
} from '@/core/components/ui'

const toast = useToast()
const { confirm } = useConfirm()

const mockUser = {
  name: 'Алина Петрова',
  group: 'Группа Python-1',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alina',
}

const email = ref('')
const password = ref('')
const emailError = ref('')
const modalSm = ref(false)
const modalMd = ref(false)
const modalLg = ref(false)
const confirmOpen = ref(false)
const scheduleTab = ref('month')
const homeworkFilter = ref('current')
const marketCategory = ref('all')
const uploadFile = ref(null)
const uploadError = ref('')
const uploading = ref(false)

const homeworkStatuses = [
  { variant: 'current', label: 'Текущие' },
  { variant: 'pending', label: 'На проверке' },
  { variant: 'approved', label: 'Проверенные' },
  { variant: 'rejected', label: 'Отклонённые' },
  { variant: 'overdue', label: 'Просроченные' },
]

const homeworkFilterCounts = {
  current: 5,
  pending: 2,
  approved: 12,
  rejected: 1,
  overdue: 3,
}

const homeworkFilters = computed(() => [
  { id: 'current', label: 'Текущие', count: homeworkFilterCounts.current },
  { id: 'pending', label: 'На проверке', count: homeworkFilterCounts.pending },
  { id: 'approved', label: 'Проверенные', count: homeworkFilterCounts.approved },
  { id: 'rejected', label: 'Отклонённые', count: homeworkFilterCounts.rejected },
  { id: 'overdue', label: 'Просроченные', count: homeworkFilterCounts.overdue },
  {
    id: 'missing',
    label: 'Не сданные',
    count:
      homeworkFilterCounts.current
      + homeworkFilterCounts.rejected
      + homeworkFilterCounts.overdue,
  },
])

const scheduleTabs = [
  { id: 'month', label: 'Месяц' },
  { id: 'week', label: 'Неделя' },
  { id: 'day', label: 'День' },
  { id: 'today', label: 'Сегодня' },
]

const marketOptions = [
  { value: 'all', label: 'Все' },
  { value: 'merch', label: 'Мерч' },
  { value: 'stationery', label: 'Канцелярия' },
  { value: 'toys', label: 'Игрушки' },
]

const sampleIcons = [
  'home-01', 'calendar-03', 'coin', 'user', 'book-02',
  'shopping-bag', 'settings-01', 'upload-01', 'missing-icon',
]

const subjectIllustrations = useSubjectIllustrations().filter((item) => item.isAvailable)

const avifCategories = [
  { id: 'brand', label: 'Бренд', items: Object.values(BRAND_ILLUSTRATIONS) },
  { id: 'subjects', label: 'Предметы', items: subjectIllustrations.map((item) => item.name) },
  { id: 'widgets', label: 'Виджеты', items: Object.values(WIDGET_ILLUSTRATIONS) },
  { id: 'market', label: 'Маркет', items: Object.values(MARKET_ILLUSTRATIONS) },
]

const avifSizes = [40, 56, 72, 96]

const avifLoadedCount = ALL_ILLUSTRATIONS.filter((name) => hasIcon(name, 'avif')).length

const paletteColors = [
  { name: 'Primary', var: '--color-primary', hex: '#8B5CF6' },
  { name: 'Success', var: '--color-success', hex: '#10B981' },
  { name: 'Warning', var: '--color-warning', hex: '#F59E0B' },
  { name: 'Error', var: '--color-error', hex: '#EF4444' },
  { name: 'Info', var: '--color-info', hex: '#3B82F6' },
  { name: 'Coin', var: '--color-coin', hex: '#FBBF24' },
]

const radiusTokens = [
  { label: '12px', value: 'var(--radius-md)' },
  { label: '16px', value: 'var(--radius-lg)' },
  { label: '20px', value: 'var(--radius-xl)' },
  { label: '24px', value: 'var(--radius-2xl)' },
]

function validateEmail() {
  emailError.value = email.value.includes('@') ? '' : 'Введите корректный email'
}

function onUploadError(msg) {
  uploadError.value = msg
}

function simulateUpload() {
  if (!uploadFile.value) return
  uploading.value = true
  setTimeout(() => {
    uploading.value = false
    toast.success('Работа отправлена на проверку')
    uploadFile.value = null
  }, 1500)
}

async function confirmPurchase() {
  const ok = await confirm({
    title: 'Купить товар?',
    message: 'С баланса спишется 150 монеток. Забрать в школе на занятиях.',
    confirmText: 'Купить',
    cancelText: 'Отмена',
  })
  if (ok) toast.success('Заказ оформлен')
}

async function confirmDanger() {
  const ok = await confirm({
    title: 'Удалить загрузку?',
    message: 'Файл будет удалён. Это действие нельзя отменить.',
    confirmText: 'Удалить',
    variant: 'danger',
  })
  if (ok) toast.info('Файл удалён')
}
</script>

<template>
  <AppLayout
    :coins="1250"
    :user="mockUser"
    :breadcrumbs="[{ label: 'Главная', href: '/' }, { label: 'UI-kit' }]"
    active-route="home"
  >
    <div class="showcase">
      <header class="showcase__hero">
        <h1 class="showcase__title">UI-kit — Электронный дневник</h1>
        <p class="showcase__subtitle">
          Полный набор Base*-компонентов IT Camp Sochi · демо-страница
        </p>
      </header>

      <!-- Design tokens -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Design tokens</h2>
        <BaseCard>
          <p class="showcase__label">Палитра</p>
          <div class="showcase__palette">
            <div v-for="color in paletteColors" :key="color.name" class="showcase__swatch">
              <span class="showcase__swatch-color" :style="{ background: `var(${color.var})` }" />
              <span class="showcase__swatch-name">{{ color.name }}</span>
              <span class="showcase__swatch-hex">{{ color.hex }}</span>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">Скругления</p>
          <div class="showcase__radii">
            <div v-for="r in radiusTokens" :key="r.label" class="showcase__radius-item">
              <span class="showcase__radius-box" :style="{ borderRadius: r.value }" />
              <span>{{ r.label }}</span>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- BaseButton -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseButton</h2>
        <BaseCard>
          <div class="showcase__row">
            <BaseButton variant="primary">Primary</BaseButton>
            <BaseButton variant="secondary">Secondary</BaseButton>
            <BaseButton variant="link">Link</BaseButton>
            <BaseButton variant="primary" disabled>Disabled</BaseButton>
          </div>
          <div class="showcase__row showcase__row--spaced">
            <BaseButton variant="primary" size="sm">Маленькая</BaseButton>
            <BaseButton variant="primary" size="md">Средняя</BaseButton>
            <BaseButton variant="primary" size="lg">Большая</BaseButton>
          </div>
          <div class="showcase__row showcase__row--spaced">
            <BaseButton variant="primary" icon="download-01">С иконкой</BaseButton>
            <BaseButton variant="secondary" icon="upload-01" icon-position="trailing">
              Загрузить
            </BaseButton>
            <BaseButton as="a" href="#" variant="link">Ссылка</BaseButton>
          </div>
        </BaseCard>
      </section>

      <!-- BaseInput -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseInput</h2>
        <BaseCard>
          <div class="showcase__grid">
            <BaseInput
              v-model="email"
              label="Email"
              placeholder="student@itcampsochi.ru"
              hint="Используется для восстановления пароля"
              @blur="validateEmail"
            />
            <BaseInput
              v-model="password"
              label="Пароль"
              type="password"
              placeholder="••••••••"
            />
            <BaseInput label="С ошибкой" model-value="bad" error="Обязательное поле" />
            <BaseInput label="Отключено" model-value="Только чтение" disabled />
          </div>
          <p v-if="emailError" class="showcase__hint">{{ emailError }}</p>
        </BaseCard>
      </section>

      <!-- BaseCard -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseCard</h2>
        <div class="showcase__grid showcase__grid--cards">
          <BaseCard>
            <template #title>Обычная карточка</template>
            Белый фон, тень, скругление.
          </BaseCard>
          <BaseCard variant="gradient-purple" padding="lg">
            <template #title>Мой рейтинг</template>
            <p>3 место из 12 · 87 баллов</p>
          </BaseCard>
          <BaseCard variant="gradient-green">
            <template #title>Домашние задания</template>
            <p>2 на проверке · 1 просрочено</p>
          </BaseCard>
          <BaseCard variant="gradient-orange">
            <template #title>Серии и монетки</template>
            <p>5 занятий без пропусков</p>
          </BaseCard>
          <BaseCard variant="gradient-blue">
            <template #title>Оценки</template>
            <p>Средний балл: 4.6</p>
          </BaseCard>
        </div>
      </section>

      <!-- BaseChip -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseChip</h2>
        <BaseCard>
          <p class="showcase__label">Статусы ДЗ</p>
          <div class="showcase__row">
            <BaseChip v-for="s in homeworkStatuses" :key="s.variant" :variant="s.variant">
              {{ s.label }}
            </BaseChip>
          </div>
          <p class="showcase__label showcase__label--spaced">Фильтры</p>
          <div class="showcase__row">
            <BaseChip
              v-for="f in homeworkFilters"
              :key="f.id"
              mode="filter"
              :active="homeworkFilter === f.id"
              :count="f.count"
              @click="homeworkFilter = f.id"
            >
              {{ f.label }}
            </BaseChip>
          </div>
        </BaseCard>
      </section>

      <!-- BaseTabs -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseTabs</h2>
        <BaseCard>
          <p class="showcase__label">Расписание</p>
          <BaseTabs v-model="scheduleTab" :tabs="scheduleTabs" />
          <p class="showcase__hint">Выбрано: {{ scheduleTab }}</p>
          <p class="showcase__label showcase__label--spaced">Домашние задания</p>
          <BaseTabs
            v-model="homeworkFilter"
            :tabs="homeworkFilters"
            size="sm"
          />
        </BaseCard>
      </section>

      <!-- BaseSelect -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseSelect</h2>
        <BaseCard>
          <div class="showcase__grid">
            <BaseSelect
              v-model="marketCategory"
              label="Категория маркета"
              :options="marketOptions"
              placeholder="Выберите категорию"
            />
            <BaseSelect
              label="Отключено"
              model-value=""
              :options="marketOptions"
              disabled
            />
          </div>
        </BaseCard>
      </section>

      <!-- BaseFileUpload -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseFileUpload</h2>
        <BaseCard>
          <BaseFileUpload
            v-model="uploadFile"
            accept=".pdf,.doc,.docx,.zip"
            :uploading="uploading"
            @error="onUploadError"
          />
          <p v-if="uploadError" class="showcase__hint showcase__hint--error">{{ uploadError }}</p>
          <div v-if="uploadFile" class="showcase__row showcase__row--spaced">
            <BaseButton variant="primary" :disabled="uploading" @click="simulateUpload">
              Отправить
            </BaseButton>
          </div>
        </BaseCard>
      </section>

      <!-- BaseIcon -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseIcon</h2>
        <BaseCard>
          <p class="showcase__label">SVG (Hugeicons)</p>
          <div class="showcase__row">
            <div v-for="icon in sampleIcons" :key="icon" class="showcase__icon-item">
              <BaseIcon :name="icon" :size="28" />
              <span class="showcase__icon-label">{{ icon }}</span>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">AVIF иллюстрации ({{ avifLoadedCount }})</p>
          <div
            v-for="category in avifCategories"
            :key="category.id"
            class="showcase__avif-category"
          >
            <p class="showcase__label">{{ category.label }}</p>
            <div class="showcase__row">
              <div
                v-for="name in category.items"
                :key="name"
                class="showcase__icon-item"
              >
                <BaseIcon :name="name" type="avif" :size="80" :label="name" />
                <span class="showcase__icon-label">{{ name }}</span>
              </div>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">Размеры (coin-single)</p>
          <div class="showcase__row">
            <div v-for="size in avifSizes" :key="size" class="showcase__icon-item">
              <BaseIcon name="coin-single" type="avif" :size="size" />
              <span class="showcase__icon-label">{{ size }}px</span>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">Предметы (useSubjectIllustration)</p>
          <div class="showcase__row">
            <div
              v-for="subject in subjectIllustrations"
              :key="subject.slug"
              class="showcase__icon-item"
              :style="{ '--subject-color': subject.color }"
            >
              <BaseIcon :name="subject.name" type="avif" :size="56" />
              <span class="showcase__icon-label">{{ subject.slug }}</span>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">Fallback</p>
          <div class="showcase__row">
            <div class="showcase__icon-item">
              <BaseIcon name="missing-illustration" type="avif" :size="48" />
              <span class="showcase__icon-label">missing-illustration</span>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- BaseAvatar -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseAvatar</h2>
        <BaseCard>
          <p class="showcase__label">Инициалы</p>
          <div class="showcase__row showcase__row--align-end">
            <div v-for="sz in ['sm', 'md', 'lg', 'xl']" :key="sz" class="showcase__avatar-item">
              <BaseAvatar name="Алина Петрова" :size="sz" />
              <span>{{ sz }}</span>
            </div>
          </div>
          <p class="showcase__label showcase__label--spaced">С фото и статусом</p>
          <div class="showcase__row">
            <BaseAvatar
              :src="mockUser.avatar"
              name="Алина Петрова"
              size="lg"
              status="online"
            />
            <BaseAvatar name="Анна С." size="lg" status="offline" />
          </div>
        </BaseCard>
      </section>

      <!-- BaseBadge -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseBadge</h2>
        <BaseCard>
          <div class="showcase__row">
            <BaseBadgeWrapper :count="150" variant="coin">
              <BaseIcon name="coin-single" type="avif" :size="32" />
            </BaseBadgeWrapper>
            <BaseBadgeWrapper :count="3" variant="primary">
              <BaseIcon name="book-02" :size="32" />
            </BaseBadgeWrapper>
            <BaseBadgeWrapper dot variant="error">
              <BaseIcon name="user" :size="32" />
            </BaseBadgeWrapper>
            <BaseBadge :count="120" :max="99" variant="default" />
          </div>
        </BaseCard>
      </section>

      <!-- BaseModal -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseModal</h2>
        <BaseCard>
          <div class="showcase__row">
            <BaseButton variant="secondary" @click="modalSm = true">Small</BaseButton>
            <BaseButton variant="primary" @click="modalMd = true">Medium</BaseButton>
            <BaseButton variant="primary" @click="modalLg = true">Large</BaseButton>
          </div>
        </BaseCard>
      </section>

      <!-- BaseConfirm -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseConfirm</h2>
        <BaseCard>
          <div class="showcase__row">
            <BaseButton variant="primary" @click="confirmPurchase">
              Покупка в маркете
            </BaseButton>
            <BaseButton variant="secondary" @click="confirmDanger">
              Опасное действие
            </BaseButton>
            <BaseButton variant="link" @click="confirmOpen = true">
              Декларативный confirm
            </BaseButton>
          </div>
        </BaseCard>
      </section>

      <!-- BaseToast -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">BaseToast</h2>
        <BaseCard>
          <div class="showcase__row">
            <BaseButton variant="primary" @click="toast.success('Работа отправлена на проверку')">
              Success
            </BaseButton>
            <BaseButton variant="secondary" @click="toast.error('Не удалось загрузить файл')">
              Error
            </BaseButton>
            <BaseButton variant="link" @click="toast.info('Новое домашнее задание')">
              Info
            </BaseButton>
          </div>
        </BaseCard>
      </section>

      <BaseConfirm
        v-model="confirmOpen"
        title="Отправить работу?"
        message="Проверьте файл перед отправкой на проверку."
        confirm-text="Отправить"
        @confirm="confirmOpen = false; toast.success('Работа отправлена на проверку')"
        @cancel="confirmOpen = false"
      />

      <BaseModal v-model="modalSm" title="Small modal" size="sm">
        <p>Компактное модальное окно.</p>
      </BaseModal>

      <BaseModal v-model="modalMd" title="Medium modal" size="md">
        <p>Стандартный размер — загрузка ДЗ, подтверждение покупки.</p>
        <template #footer>
          <BaseButton variant="secondary" @click="modalMd = false">Отмена</BaseButton>
          <BaseButton variant="primary" @click="modalMd = false">Готово</BaseButton>
        </template>
      </BaseModal>

      <BaseModal v-model="modalLg" title="Large modal — день расписания" size="lg">
        <p>Список занятий на выбранный день.</p>
        <template #footer>
          <BaseButton variant="primary" @click="modalLg = false">Закрыть</BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.showcase {
  max-width: 960px;
  margin: 0 auto;
  padding: $space-8 $space-6 $space-12;

  &__hero {
    margin-bottom: $space-10;
    text-align: center;
  }

  &__title {
    margin: 0 0 $space-3;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    background: $gradient-primary;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__subtitle {
    margin: 0;
    font-size: $font-size-lg;
    color: $color-text-secondary;
  }

  &__section {
    margin-bottom: $space-8;
  }

  &__section-title {
    margin: 0 0 $space-4;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__label {
    margin: 0 0 $space-3;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;

    &--spaced {
      margin-top: $space-5;
    }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $space-3;

    &--spaced {
      margin-top: $space-4;
    }

    &--align-end {
      align-items: flex-end;
    }
  }

  &__grid {
    display: grid;
    gap: $space-4;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    &--cards {
      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  &__hint {
    margin: $space-4 0 0;
    font-size: $font-size-sm;
    color: $color-text-muted;

    &--error {
      color: $color-error;
    }
  }

  &__palette {
    display: flex;
    flex-wrap: wrap;
    gap: $space-4;
  }

  &__swatch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-1;
    min-width: 72px;
  }

  &__swatch-color {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: $shadow-sm;
  }

  &__swatch-name {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  &__swatch-hex {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__radii {
    display: flex;
    flex-wrap: wrap;
    gap: $space-5;
  }

  &__radius-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }

  &__radius-box {
    width: 64px;
    height: 48px;
    background: $gradient-primary;
  }

  &__icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
    padding: $space-3;
    border-radius: $radius-md;
    background-color: $color-bg-muted;
    color: $color-primary;
  }

  &__icon-label {
    font-size: $font-size-xs;
    color: $color-text-muted;
  }

  &__avif-category {
    margin-bottom: $space-4;
  }

  &__avatar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-2;
    font-size: $font-size-sm;
    color: $color-text-secondary;
  }
}
</style>
