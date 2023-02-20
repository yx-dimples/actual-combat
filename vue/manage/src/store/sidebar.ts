import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
	state: () => {
		return {
			collapse: true
		}
	},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse
		}
	}
})