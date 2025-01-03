<template>
    <span 
      :class="`material-icons ${sizeClass}`" 
      :style="{ color: iconColor }"
    >
      {{ icon }}
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue'; // Import computed from vue
  
  const props = defineProps({
    // The rank value (e.g., 1, 2, 3...)
    rank: {
      type: Number,
      required: true,
    },
    // The size of the icon (e.g., 'sm', 'md', 'lg', 'xl')
    size: {
      type: String,
      required: false,
      default: 'md',
    },
  });
  
  // Define a computed property to determine icon and color based on rank
  const iconData = computed(() => {
    let icon = '';  // 'military_tech', 'workspace_premium', 'social_leaderboard'
    let iconColor = ''; // Default color
    
    if (props.rank === 1) {
    } 
    else if (props.rank === 2) {
      iconColor = 'gray';
      icon = 'military_tech';
    } 
    else if (props.rank === 3) {
      iconColor = 'gray';
      icon = 'workspace_premium';
    } 
    else if (props.rank === 4) {
      iconColor = '#FFC300';
      icon = 'military_tech';
    } 
    else if (props.rank === 5) {
      iconColor = '#FFC300';
      icon = 'workspace_premium';
    } 
    else if (props.rank === 6) {
      iconColor = '#000000';
      icon = 'military_tech'; 
    }
    else if (props.rank === 7) {
      iconColor = '#000000';
      icon = 'workspace_premium';
    } 
    else if (props.rank === 8) { 
      iconColor = '#008A8A';
      icon = 'military_tech'; 
    } 
    else if (props.rank === 9) {
      iconColor = '#008A8A';
      icon = 'workspace_premium'; 
    }
  
    return { icon, iconColor };
  });
  
  // Use computed values for the icon and color
  const icon = iconData.value.icon;
  const iconColor = iconData.value.iconColor;
  const sizeClass = `text-${props.size}`;
  </script>
  