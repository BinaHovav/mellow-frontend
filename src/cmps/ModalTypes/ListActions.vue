<template>
    <main>
        <div>
            <ul>
                <li>Add card...</li>
                <li>Copy list...</li>
                <li>Move list...</li>
                <li>Watch</li>
            </ul>
            <hr>
            <ul>
                <li>Sort by...</li>
            </ul>
            <hr>
            <ul>
                <li @click="removeGroup">Archive this list</li>
            </ul>
        </div>
    </main>
</template>
<script>
export default {
    name: 'ListAction',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
        }
    },
    methods: {
        removeGroup() {
            setTimeout(() => {
                this.info.removeGroup = this.info.group.id
                const action = { type: 'archived', txt: `list ${this.info.group.title}`, componentId: '', movedCmp: '', movedUser: '' }
                this.$emit('setInfo', this.info, action)
                this.$emit('closeModal')

            }, 300)
        }
    },
    computed: {

    },
}
</script>
  