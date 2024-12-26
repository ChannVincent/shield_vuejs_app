<template>
    <div 
    class="h-7 w-fit px-2.5 py-0.5 rounded-full text-sm font-medium" 
    :class="{
        'bg-gray-200 text-gray-600': type === null, 
        'bg-red-100 text-red-800': type === 'danger',
        'bg-green-100 text-green-800': type === 'success',
        'bg-blue-100 text-blue-800': type === 'info',
    }">
        <slot/>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: null,
            required: false,
        },
    },
    methods: {
        tagClass() {
            console.log(this.color)
            bgColor = this.$refs(`bg-${this.color}-100`)
            textColor = this.$refs(`text-${this.color}-800`)
            return [bgColor,textColor]
        }
    }

}
</script>