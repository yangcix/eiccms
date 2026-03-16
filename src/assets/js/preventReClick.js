import Vue from 'vue'
// 在vue上挂载一个指量 preventReClick
const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        console.log(el.disabled)
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                /* el.style.opacity = '0.5'
                el.style.cursor = 'not-allowed' */
                setTimeout(() => {
                    el.disabled = false
                    /* el.style.opacity = '1'
                    el.style.cursor = '' */
                }, binding.value || 3000)
                //binding.value可以自行设置。如果设置了则跟着设置的时间走
                //例如：v-preventReClick='500'
            }
        })
    }
});
export default preventReClick 