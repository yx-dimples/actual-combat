import Vue from 'vue'
import SvgIcon from '../components/SvgIcon.vue'

Vue.component('svg-icon', SvgIcon)

// console.log(1)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
