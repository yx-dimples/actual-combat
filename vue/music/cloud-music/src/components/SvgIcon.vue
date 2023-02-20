<template>
 <svg :class="svgClass" aria-hidden="true" :width="swidth" :height="sheight">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: ''
    },
    size: {
      type: [String, Number],
      default: 13
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    swidth () {
      if (this.size < 0 || isNaN(this.size)) {
        return 13
      }
      return this.size
    },
    sheight () {
      if (this.size < 0 || isNaN(this.size)) {
        return 13
      }
      return this.size
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
