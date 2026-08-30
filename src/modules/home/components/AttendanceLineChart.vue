<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  minValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
  yTicks: {
    type: Array,
    default: () => [0, 25, 50, 75, 100],
  },
  valueSuffix: {
    type: String,
    default: '%',
  },
  ariaLabel: {
    type: String,
    default: 'График посещаемости',
  },
})

const CHART_MIN_WIDTH = 200
const CHART_MIN_HEIGHT = 140
const CHART_PADDING = {
  left: 26,
  right: 10,
  top: 44,
  bottom: 26,
}

const TOOLTIP = {
  width: 58,
  height: 38,
  offset: 14,
}

const ACTIVE_DOT_R = 6

const valueSpan = computed(() => {
  const span = props.maxValue - props.minValue
  return span === 0 ? 1 : span
})

function hasNumericValue(value) {
  return typeof value === 'number' && Number.isFinite(value)
}

function valueRatio(value) {
  return (value - props.minValue) / valueSpan.value
}

function formatValue(value) {
  if (value == null || Number.isNaN(value)) return ''
  if (Number.isInteger(value)) return String(value)
  return String(Math.round(value * 100) / 100)
}

function displayValue(value) {
  return `${formatValue(value)}${props.valueSuffix}`
}

const figureRef = ref(null)
const chartSize = ref({ width: 300, height: 168 })
const hoveredIndex = ref(null)

let resizeObserver = null

const chart = computed(() => ({
  width: chartSize.value.width,
  height: chartSize.value.height,
  paddingLeft: CHART_PADDING.left,
  paddingRight: CHART_PADDING.right,
  paddingTop: CHART_PADDING.top,
  paddingBottom: CHART_PADDING.bottom,
}))

const plotWidth = computed(() => chart.value.width - chart.value.paddingLeft - chart.value.paddingRight)
const plotHeight = computed(() => chart.value.height - chart.value.paddingTop - chart.value.paddingBottom)

const points = computed(() => {
  if (!props.data.length) return []

  const step = props.data.length > 1 ? plotWidth.value / (props.data.length - 1) : 0
  const { paddingLeft, paddingTop } = chart.value

  return props.data.map((item, index) => {
    const plottable = hasNumericValue(item.value)
    const ratio = plottable ? Math.min(1, Math.max(0, valueRatio(item.value))) : 0
    return {
      index,
      x: paddingLeft + step * index,
      y: paddingTop + plotHeight.value * (1 - ratio),
      label: item.label,
      value: item.value,
      plottable,
    }
  })
})

const plotPoints = computed(() => points.value.filter((point) => point.plottable))

const activePoint = computed(() => {
  if (hoveredIndex.value == null) return null
  const point = points.value[hoveredIndex.value]
  return point?.plottable ? point : null
})

const tooltipPosition = computed(() => {
  if (!activePoint.value) return null

  const point = activePoint.value
  const { width, paddingLeft, paddingRight } = chart.value
  const x = Math.min(
    Math.max(point.x - TOOLTIP.width / 2, paddingLeft),
    width - paddingRight - TOOLTIP.width,
  )
  const y = Math.max(
    point.y - ACTIVE_DOT_R - TOOLTIP.offset - TOOLTIP.height,
    4,
  )

  return {
    x,
    y,
    stemBottom: y + TOOLTIP.height,
    stemTop: point.y - ACTIVE_DOT_R - 2,
  }
})

const linePath = computed(() =>
  plotPoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' '),
)

const areaPath = computed(() => {
  if (plotPoints.value.length < 2) return ''

  const bottom = chart.value.height - chart.value.paddingBottom
  const first = plotPoints.value[0]
  const last = plotPoints.value[plotPoints.value.length - 1]

  return [
    `M ${first.x} ${bottom}`,
    ...plotPoints.value.map((point) => `L ${point.x} ${point.y}`),
    `L ${last.x} ${bottom}`,
    'Z',
  ].join(' ')
})

function yPosition(tick) {
  return chart.value.paddingTop + plotHeight.value * (1 - valueRatio(tick))
}

function setHovered(index) {
  hoveredIndex.value = index
}

function clearHovered() {
  hoveredIndex.value = null
}

function onChartMove(event) {
  if (!plotPoints.value.length) return

  const svg = event.currentTarget
  const rect = svg.getBoundingClientRect()
  const scaleX = chart.value.width / rect.width
  const svgX = (event.clientX - rect.left) * scaleX

  let nearest = plotPoints.value[0].index
  let minDistance = Infinity

  plotPoints.value.forEach((point) => {
    const distance = Math.abs(point.x - svgX)
    if (distance < minDistance) {
      minDistance = distance
      nearest = point.index
    }
  })

  hoveredIndex.value = nearest
}

function updateChartSize() {
  if (!figureRef.value) return

  chartSize.value = {
    width: Math.max(CHART_MIN_WIDTH, Math.round(figureRef.value.clientWidth)),
    height: Math.max(CHART_MIN_HEIGHT, Math.round(figureRef.value.clientHeight)),
  }
}

onMounted(async () => {
  await nextTick()
  if (!figureRef.value) return

  updateChartSize()
  resizeObserver = new ResizeObserver(() => updateChartSize())
  resizeObserver.observe(figureRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <figure ref="figureRef" class="attendance-line-chart">
    <svg
      class="attendance-line-chart__svg"
      :class="{ 'attendance-line-chart__svg--active': activePoint }"
      :viewBox="`0 0 ${chart.width} ${chart.height}`"
      role="img"
      :aria-label="ariaLabel"
      @mouseleave="clearHovered"
    >
      <g class="attendance-line-chart__grid" aria-hidden="true">
        <line
          v-for="tick in yTicks"
          :key="tick"
          :x1="chart.paddingLeft"
          :x2="chart.width - chart.paddingRight"
          :y1="yPosition(tick)"
          :y2="yPosition(tick)"
        />
      </g>

      <g class="attendance-line-chart__y-labels" aria-hidden="true">
        <text
          v-for="tick in yTicks"
          :key="`y-${tick}`"
          :x="chart.paddingLeft - 6"
          :y="yPosition(tick) + 3"
          text-anchor="end"
        >
          {{ tick }}
        </text>
      </g>

      <path
        v-if="areaPath"
        class="attendance-line-chart__area"
        :d="areaPath"
      />

      <path
        v-if="linePath"
        class="attendance-line-chart__line"
        :d="linePath"
      />

      <line
        v-if="activePoint"
        class="attendance-line-chart__guide"
        aria-hidden="true"
        :x1="activePoint.x"
        :x2="activePoint.x"
        :y1="activePoint.y + ACTIVE_DOT_R + 2"
        :y2="chart.height - chart.paddingBottom"
      />

      <g class="attendance-line-chart__dots">
        <circle
          v-for="point in plotPoints"
          :key="point.index"
          class="attendance-line-chart__dot"
          :class="{ 'attendance-line-chart__dot--active': hoveredIndex === point.index }"
          :cx="point.x"
          :cy="point.y"
          :r="hoveredIndex === point.index ? ACTIVE_DOT_R : 4.5"
        />
      </g>

      <g
        v-if="activePoint && tooltipPosition"
        class="attendance-line-chart__tooltip"
        aria-hidden="true"
      >
        <line
          class="attendance-line-chart__tooltip-stem"
          :x1="activePoint.x"
          :x2="activePoint.x"
          :y1="tooltipPosition.stemBottom"
          :y2="tooltipPosition.stemTop"
        />
        <rect
          class="attendance-line-chart__tooltip-box"
          :x="tooltipPosition.x"
          :y="tooltipPosition.y"
          :width="TOOLTIP.width"
          :height="TOOLTIP.height"
          rx="6"
        />
        <text
          class="attendance-line-chart__tooltip-value"
          :x="tooltipPosition.x + TOOLTIP.width / 2"
          :y="tooltipPosition.y + 16"
          text-anchor="middle"
        >
          {{ displayValue(activePoint.value) }}
        </text>
        <text
          class="attendance-line-chart__tooltip-label"
          :x="tooltipPosition.x + TOOLTIP.width / 2"
          :y="tooltipPosition.y + 30"
          text-anchor="middle"
        >
          {{ activePoint.label }}
        </text>
      </g>

      <g class="attendance-line-chart__x-labels" aria-hidden="true">
        <text
          v-for="(point, index) in points"
          :key="`x-${index}`"
          :x="point.x"
          :y="chart.height - 6"
          text-anchor="middle"
        >
          {{ point.label }}
        </text>
      </g>

      <rect
        class="attendance-line-chart__overlay"
        :x="chart.paddingLeft"
        :y="chart.paddingTop"
        :width="plotWidth"
        :height="plotHeight"
        @mousemove="onChartMove"
      />

      <g class="attendance-line-chart__hits">
        <circle
          v-for="point in plotPoints"
          :key="`hit-${point.index}`"
          class="attendance-line-chart__hit"
          :cx="point.x"
          :cy="point.y"
          r="12"
          tabindex="0"
          :aria-label="`${point.label}: ${displayValue(point.value)}`"
          @mouseenter="setHovered(point.index)"
          @focus="setHovered(point.index)"
          @blur="clearHovered"
        />
      </g>
    </svg>
  </figure>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.attendance-line-chart {
  display: flex;
  flex: 1;
  min-height: 140px;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: visible;

  &__svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;

    &--active {
      cursor: crosshair;
    }
  }

  &__overlay {
    fill: transparent;
    cursor: crosshair;
  }

  &__hit {
    fill: transparent;
    cursor: pointer;

    &:focus-visible {
      outline: none;
      stroke: $color-primary;
      stroke-width: 2;
      fill: rgba(139, 92, 246, 0.08);
    }
  }

  &__grid line {
    stroke: $color-border-light;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  &__y-labels text,
  &__x-labels text {
    fill: $color-text-muted;
    font-size: 10px;
    font-family: $font-family-base;
  }

  &__area {
    fill: rgba(139, 92, 246, 0.1);
    transition: fill $transition-base;
  }

  &__svg--active &__area {
    fill: rgba(139, 92, 246, 0.16);
  }

  &__line {
    fill: none;
    stroke: $color-primary;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  &__guide {
    stroke: $color-primary-muted;
    stroke-width: 1;
    stroke-dasharray: 4 4;
    pointer-events: none;
    vector-effect: non-scaling-stroke;
  }

  &__dot {
    fill: $color-bg-card;
    stroke: $color-primary;
    stroke-width: 2;
    pointer-events: none;
    transition: r $transition-fast, fill $transition-fast, stroke-width $transition-fast;
    vector-effect: non-scaling-stroke;

    &--active {
      fill: $color-primary;
      stroke: $color-bg-card;
      stroke-width: 2.5;
    }
  }

  &__tooltip-stem {
    stroke: $color-primary-muted;
    stroke-width: 1;
    pointer-events: none;
    vector-effect: non-scaling-stroke;
  }

  &__tooltip-box {
    fill: $color-bg-card;
    stroke: $color-border;
    fill-opacity: 1;
    filter: drop-shadow(0 4px 10px rgba(15, 23, 42, 0.12));
  }

  &__tooltip-value {
    fill: $color-primary;
    color: $color-primary;
    font-size: 11px;
    font-weight: $font-weight-bold;
    font-family: $font-family-base;
  }

  &__tooltip-label {
    fill: $color-text-secondary;
    color: $color-text-secondary;
    font-size: 9px;
    font-weight: $font-weight-semibold;
    font-family: $font-family-base;
  }
}
</style>
