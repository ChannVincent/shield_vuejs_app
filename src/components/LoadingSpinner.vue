<template>
    <div 
        class="border-gray-600 border-solid rounded-full animate-spin"
        :class="{
            'w-16 h-16 border-t-4': size === null, 
            'w-4 h-4 border-t-2': size === 'xs',
            'w-6 h-6 border-t-2': size === 'sm',
            'w-8 h-8 border-t-3': size === 'md',
            'w-10 h-10 border-t-3': size === 'lg',
            'w-12 h-12 border-t-4': size === 'xl',
            'w-16 h-16 border-t-4': size === 'xxl',
        }"
    />
</template>
<script>
export default {
    props: {
        size: String,
        required: false,
        default: null
    }
}
</script>