<template>
    <draggable delay="250" :delay-on-touch-only="true" v-model="taskList" class="task-list-container u-fancy-scrollbar"
        ghost-class="ghost-task" item-key="name" drag-class="drag-task" @start="drag = true" @end="drag = false"
        group="tasks">
        <!-- <transition-group> -->
        <template #item="{ element }">
            <TaskPreview :key="element.id" :groupId="groupId" :task="element" @onTaskIsDone="onTaskIsDone" />
        </template>
        <template #footer>

            <div class="card-compose" v-if="add" v-clickOutside="toggleAdd">
                <div class="input-title">
                    <div>
                        <textarea ref="textarea" dir="auto" placeholder="Enter a title for this card..."
                            data-autosize="true" v-model="title" @keyup.enter="addTask"></textarea>
                    </div>
                </div>
                <div class="controls">
                    <div @click.stop="addTask" class="btn-add">Add card</div>
                    <span @click.stop="toggleAdd" class="btn-close"></span>
                </div>
            </div>
        </template>
        <!-- </transition-group> -->

    </draggable>
</template>
  
<script>

import TaskPreview from './TaskPreview.vue'
import draggable from 'vuedraggable'

export default {
    name: 'TaskList',
    props: ['tasks', 'groupId', 'add'],
    data() {
        return {
            drag: false,
            title: ''
        }
    },
    computed: {
        taskList: {
            get() {
                return this.tasks
            },
            set(tasks) {
                this.$emit('updateTasksList', tasks, this.groupId)
            }
        }
    },
    created() {
    },
    watch: {
        add: {
            handler() {
                if (this.add) {
                    setTimeout(() => {
                        this.$refs.textarea.focus()
                    }, 200)
                }
            }
        }
    },
    methods: {
        addTask() {
            this.$refs.textarea.focus()
            if (!this.title) return
            this.$emit('addTask', this.title)
            this.title = ''
        },
        onTaskIsDone(taskId, title) {
            const tasks = JSON.parse(JSON.stringify(this.tasks))
            const idx = tasks.findIndex(task => task.id === taskId)
            tasks[idx].date.isDone = !tasks[idx].date.isDone

            let action
            if (tasks[idx].date.isDone) {
                action = { type: 'due date',command:'marked the due date on ', span: tasks[idx].title, txt: ` complete`, componentId: tasks[idx].id, groupId: this.groupId, movedCmp: '', movedUser: '' }
            } else {
                action = { type: 'due date',command:'marked the due date on ', span: tasks[idx].title, txt: ` incomplete`, componentId: tasks[idx].id, groupId: this.groupId, movedCmp: '', movedUser: '' }

            }
            this.$emit('updateTasks', tasks, this.groupId, action)
        },
        toggleAdd() {
            this.$emit('changeAdd')
            this.title = ''
        }
    },
    components: {
        TaskPreview,
        draggable
    }
}
</script>
  