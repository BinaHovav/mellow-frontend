import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'board'

export const boardService = {
  query,
  getBoardById,
  save,
  remove,
  getEmptyBoard,
  addBoardMsg,
}
window.cs = boardService

async function query(filterBy = { txt: '', price: 0 }) {
  var boards = await storageService.query(STORAGE_KEY)
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    boards = boards.filter((board) => regex.test(board.vendor) || regex.test(board.description))
  }
  if (filterBy.price) {
    boards = boards.filter((board) => board.price <= filterBy.price)
  }
  return boards
}

function getBoardById(boardId) {
  return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
  await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    savedBoard = await storageService.put(STORAGE_KEY, board)
  } else {
    // Later, owner is set by the backend
    board.owner = userService.getLoggedinUser()
    savedBoard = await storageService.post(STORAGE_KEY, board)
  }
  return savedBoard
}

async function addBoardMsg(boardId, txt) {
  // Later, this is all done by the backend
  const board = await getById(boardId)
  if (!board.msgs) board.msgs = []

  const msg = {
    id: utilService.makeId(),
    by: userService.getLoggedinUser(),
    txt,
  }
  board.msgs.push(msg)
  await storageService.put(STORAGE_KEY, board)

  return msg
}

function getEmptyBoard() {
  return {
    vendor: 'Susita-' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(1000, 9000),
  }
}

// Initial data
// ;(async () => {
//   await storageService.post(STORAGE_KEY, {
//     _id: 'b101',
//     title: 'Gas station robotics',
//     isStarred: false,
//     archivedAt: null,
//     createdBy: {
//       _id: 'u101',
//       fullname: 'Meitar Mor',
//       imgUrl: '',
//     },
//     style: {
//       backgroundImage: '',
//     },
//     labels: [
//       {
//         id: 'l101',
//         title: 'Timeline',
//         color: '#164b35',
//         backgroundColor: 'green',
//       },
//       {
//         id: 'l102',
//         title: 'Planning',
//         color: '#faa53d',
//         backgroundColor: 'orange',
//       },
//       {
//         id: 'l103',
//         title: 'Techonology',
//         color: '#faa53d',
//         backgroundColor: 'red',
//       },
//       {
//         id: 'l104',
//         title: 'Research',
//         color: '#faa53d',
//         backgroundColor: 'yellow',
//       },
//       {
//         id: 'l105',
//         title: 'Design',
//         color: '#faa53d',
//         backgroundColor: 'pink',
//       },
//       {
//         id: 'l106',
//         title: 'Architecutre',
//         color: '#faa53d',
//         backgroundColor: 'lime',
//       },
//       {
//         id: 'l107',
//         title: 'Analysis',
//         color: '#faa53d',
//         backgroundColor: 'blue',
//       },
//       {
//         id: 'l108',
//         title: 'Finance',
//         color: '#faa53d',
//         backgroundColor: 'sky',
//       },
//       {
//         id: 'l109',
//         title: 'Compliance',
//         color: '#faa53d',
//         backgroundColor: 'purple',
//       },
//     ],
//     members: [
//       {
//         _id: 'u101',
//         fullname: 'Meitar Mor',
//         imgUrl: '',
//       },
//       {
//         _id: 'u102',
//         fullname: 'Tomer Appelman',
//         imgUrl: '',
//       },
//       {
//         _id: 'u103',
//         fullname: 'Bina Hovav',
//         imgUrl: '',
//       },
//     ],
//     groups: [
//       {
//         id: 'g101',
//         title: 'Research and Planning',
//         archivedAt: null,
//         tasks: [
//           {
//             id: 'c101',
//             title: 'Market Research',
//             description: 'Conduct an in-depth market analysis to identify potential opportunities, target markets, and competitor solutions in the gas station automation industry.',
//             members: [
//               {
//                 _id: 'u101',
//                 fullname: 'Meitar Mor',
//                 imgUrl: '',
//               },
//               {
//                 _id: 'u102',
//                 fullname: 'Tomer Appelman',
//                 imgUrl: '',
//               },
//               {
//                 _id: 'u103',
//                 fullname: 'Bina Hovav',
//                 imgUrl: '',
//               },
//             ],
//             labels: ['Research', 'Planning'],
//             dueDate: 1690303727,
//             checklists: [
//               {
//                 title: 'Todo',
//                 todos: [
//                   { id: 't101', txt: 'Gather data on existing gas station automation solutions', isDone: false },
//                   { id: 't102', txt: 'Identify key competitors and their offerings.', isDone: false },
//                   { id: 't103', txt: 'Analyze market trends and customer preferences.', isDone: false },
//                   { id: 't104', txt: 'Compile a comprehensive report on the market analysis findings.', isDone: false },
//                 ],
//               },
//             ],
//             attachment: null,
//             activity: [],
//             cover: 'orange',
//           },
//           {
//             id: 'c102',
//             title: 'Add Samples',
//           },
//         ],
//         style: {},
//       },
//       {
//         id: 'g102',
//         title: 'Group 2',
//         tasks: [
//           {
//             id: 'c103',
//             title: 'Do that',
//             archivedAt: 1589983468418,
//           },
//           {
//             id: 'c104',
//             title: 'Help me',
//             status: 'in-progress', // monday
//             priority: 'high',
//             description: 'description',
//             comments: [
//               {
//                 id: 'ZdPnm',
//                 txt: 'also @yaronb please CR this',
//                 createdAt: 1590999817436,
//                 byMember: {
//                   _id: 'u101',
//                   fullname: 'Tal Tarablus',
//                   imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
//                 },
//               },
//             ],
//             checklists: [
//               {
//                 id: 'YEhmF',
//                 title: 'Checklist',
//                 todos: [
//                   {
//                     id: '212jX',
//                     title: 'To Do 1',
//                     isDone: false,
//                   },
//                 ],
//               },
//             ],
//             memberIds: ['u101'],
//             labelIds: ['l101', 'l102'],
//             dueDate: 16156215211,
//             byMember: {
//               _id: 'u101',
//               username: 'Tal',
//               fullname: 'Tal Tarablus',
//               imgUrl: 'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
//             },
//             style: {
//               bgColor: '#26de81',
//             },
//           },
//         ],
//         style: {},
//       },
//     ],
//     activities: [
//       {
//         id: 'a101',
//         txt: 'Changed Color',
//         createdAt: 154514,
//         byMember: {
//           _id: 'u101',
//           fullname: 'Abi Abambi',
//           imgUrl: 'http://some-img',
//         },
//         task: {
//           id: 'c101',
//           title: 'Replace Logo',
//         },
//       },
//     ],

//     cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
//   })
// })()
