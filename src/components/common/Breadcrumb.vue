<template>
  <div>
    <!-- Mobile spacer to avoid content being hidden under fixed bar -->
    <div class="block md:hidden h-12"></div>
    <nav
      class="
        fixed md:static top-[78px] left-0 right-0 z-20
        bg-white/50 md:bg-transparent backdrop-blur-md md:backdrop-blur-0
        border-b border-gray-200 md:border-0
        mb-0 md:mb-4
      "
      aria-label="Breadcrumb"
    >
      <ol class="mx-auto max-w-screen-xl px-4 py-1 md:px-0 md:py-0 flex items-center gap-2 text-sm overflow-x-auto">
        <li v-for="(item, index) in items" :key="index" class="flex items-center gap-2 whitespace-nowrap">
          <template v-if="item.href && index !== items.length - 1">
            <a :href="item.href" class="text-azul hover:underline font-medium">{{ item.label }}</a>
            <span class="text-gray-400">/</span>
          </template>
          <template v-else>
            <span :class="[
              'font-medium',
              index === items.length - 1 ? 'text-gray-500' : 'text-azul hover:underline'
            ]">
              {{ item.label }}
            </span>
          </template>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label: string, href?: string }]
  }
})
</script>

<style scoped>
</style>