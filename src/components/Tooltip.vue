<template>
  <div class="relative group">
    <slot></slot>
    <div
      class="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2"
    >
      {{ text }}
      <svg
        class="absolute text-gray-800 h-2 w-full left-0 top-full"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
        xml:space="preserve"
      >
        <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: ["text"],
};
</script>
