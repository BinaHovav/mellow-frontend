<template>
    <div class="checklist-container">
        <form @submit.prevent="AddCheckList">
            <label>Title</label>
            <input ref="checklist" class="checklist-title" type="text" value="Checklist" maxlength="512" autofocus>
            <input @click="AddCheckList" class="checklist-add" type="button" value="Add">
        </form>
    </div>
</template>
<script>
import { utilService } from '../../services/util.service';

export default {
    name: 'ListAction',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    created() {
        setTimeout(() => {
            this.$refs.checklist.focus()
        }, 200);
    },
    data() {
        return {
        }
    },
    methods: {
        AddCheckList() {
            const id = utilService.makeId(6)
            const title = this.$refs.checklist.value
            this.info.task.checklists.push({ id, title, todos: [] })

            const groupId = this.$route.params.groupId
            const action = { type: 'added', span: this.info.task.title, txt: `${title} to `, componentId: this.info.task.id, groupId: groupId, movedCmp: '', movedUser: '' }
            this.$emit('setInfo', this.info, action)
            this.$emit('setInfo')
        }
    },
    computed: {
    },
}
</script>
  