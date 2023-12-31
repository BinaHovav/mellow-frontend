// import { boardService } from '../services/board.service.local'
import { boardService } from '../services/board.service.js'
import { socketService } from '../services/socket.service.js'

export function getActionSetCurrBoard(boardId) {
  return {
    type: 'setCurrBoard',
    boardId,
  }
}
export function getActionRemoveBoard(boardId) {
  return {
    type: 'removeBoard',
    boardId,
  }
}
export function getActionAddBoard(board) {
  return {
    type: 'addBoard',
    board,
  }
}
export function getActionUpdateBoard(board) {
  return {
    type: 'updateBoard',
    board,
  }
}

export function getActionAddBoardMsg(boardId) {
  return {
    type: 'addBoardMsg',
    boardId,
    txt: 'Stam txt',
  }
}

export const boardStore = {
  state: {
    boards: [],
    currLabels: [],
    currBoardId: null,
    labelsShow: false,
    backgroundImg: null,
    taskQEId: null,
    dragCount: 0,
    btnCoords: ''
  },
  getters: {
    boards({ boards }) {
      return boards
    },
    currLabels({ currLabels }) {
      return currLabels
    },
    getCurrBoard({ boards, currBoardId }) {
      return boards.find((board) => board._id === currBoardId)
    },
    labelsShow({ labelsShow }) {
      return labelsShow
    },
    getEmptyActivity() {
      return boardService.getEmptyActivity()
    },
    getBtnCoords(state){
      return state.btnCoords
    },
    // backgroundImg({ backgroundImg }) {
    //   return backgroundImg
    // },
    backgroundImg({ backgroundImg }) {
      return backgroundImg
    },
    boardImgUrl({ boards, currBoardId }) {
      return boards.find((board) => board._id === currBoardId)?.imgUrl
    },
    taskQEId({ taskQEId }) {
      return taskQEId
    },
  },
  mutations: {
    setBoards(state, { boards }) {
      state.boards = boards
    },
    setCurrLabels(state, { labels }) {
      state.currLabels = labels
    },
    addBoard(state, { board }) {
      state.boards.push(board)
    },
    updateBoard(state, { board }) {
      const idx = state.boards.findIndex((c) => c._id === board._id)
      state.boards.splice(idx, 1, board)
    },
    removeBoard(state, { boardId }) {
      state.boards = state.boards.filter((board) => board._id !== boardId)
    },
    addBoardMsg(state, { boardId, msg }) {
      const board = state.boards.find((board) => board._id === boardId)
      if (!board.msgs) board.msgs = []
      board.msgs.push(msg)
    },
    setCurrBoardId(state, { boardId }) {
      state.currBoardId = boardId
    },
    setLabelsShow(state) {
      state.labelsShow = !state.labelsShow
    },
    setBackgroundImg(state, { backgroundImg }) {
      state.backgroundImg = backgroundImg
    },
    onQuickEditor(state, { taskId }) {
      state.taskQEId = taskId
    },
    updateTaskList(state, { groupId, tasks }) {
      const board = state.boards.find((board) => state.currBoardId === board._id)
      const group = board.groups.find((group) => groupId === group.id)
      group.tasks = tasks
      state.dragCount++
    },
    resetCount(state){
      state.dragCount = 0
    },
    setBtnCoords(state,{elCoords}){
      state.btnCoords = elCoords
    }
  },
  actions: {
    async addBoard(context, { board }) {
      try {
        const savedBoard = await boardService.save(board)
        context.commit(getActionAddBoard(savedBoard))
        return savedBoard
      } catch (err) {
        console.log('boardStore: Error in addBoard', err)
        throw err
      }
    },
    async updateBoard(context, { board }) {
      try {
        context.commit(getActionUpdateBoard(JSON.parse(JSON.stringify(board))))
        const savedBoard = await boardService.save(board)
        socketService.emit('update-board')
        return savedBoard
      } catch (err) {
        console.log('boardStore: Error in updateBoard', err)
        throw err
      }
    },
    async loadBoards(context) {
      try {
        const boards = await boardService.query()
        context.commit({ type: 'setBoards', boards })
      } catch (err) {
        console.log('boardStore: Error in loadBoards', err)
        throw err
      }
    },
    async removeBoard(context, { boardId }) {
      try {
        await boardService.remove(boardId)
        context.commit(getActionRemoveBoard(boardId))
      } catch (err) {
        console.log('boardStore: Error in removeBoard', err)
        throw err
      }
    },
    async addBoardMsg(context, { boardId, txt }) {
      try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        context.commit({ type: 'addBoardMsg', boardId, msg })
      } catch (err) {
        console.log('boardStore: Error in addBoardMsg', err)
        throw err
      }
    },
    async updateTaskList(context, payload){
        context.commit(payload)
        if (context.state.dragCount === 2) {
          context.dispatch(getActionUpdateBoard(context.getters.getCurrBoard))
          context.commit({type:'resetCount'})
        }
    }
  },
}
