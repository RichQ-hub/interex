import { ThreadCard, ThreadDetails } from '@/types/threads'

const colors = {
  purple: '#9939D4',
  green: '#39D46E',
  red: '#D43939',
  yellow: '#DFE224'
}

export const threads: ThreadCard[] = [
  {
    id: '1',
    title: '[UPDATE] New changes to this thread!',
    author: 'SorbetMaster102',
    createdAt: 'Dec 12, 2023',
    pinnedBy: null,
    numComments: '127',
    numUpvotes: '82',
    flairs: [
      {
        id: '1',
        name: 'Help',
        hexColor: colors.purple
      },
      {
        id: '2',
        name: 'Support Main',
        hexColor: colors.green
      }
    ]
  },
  {
    id: '2',
    title: 'How can I improve as a support main?',
    author: 'SorbetMaster102',
    pinnedBy: null,
    createdAt: 'Dec 12, 2023',
    numComments: '127',
    numUpvotes: '82',
    flairs: [
      {
        id: '1',
        name: 'Help',
        hexColor: colors.purple
      },
      {
        id: '2',
        name: 'Support Main',
        hexColor: colors.green
      }
    ]
  },
  {
    id: '3',
    title: '[OFFICIAL] New fiddlesticks skin set to release next year!',
    author: 'SorbetMaster102',
    createdAt: 'Dec 12, 2023',
    pinnedBy: null,
    numComments: '127',
    numUpvotes: '82',
    flairs: [
      {
        id: '3',
        name: 'News',
        hexColor: colors.red
      },
      {
        id: '4',
        name: 'Skin',
        hexColor: colors.yellow
      }
    ]
  },
  {
    id: '4',
    title: 'What do you guys think of the new map changes?',
    author: 'Holobrah',
    createdAt: 'Dec 12, 2023',
    pinnedBy: null,
    numComments: '127',
    numUpvotes: '82',
    flairs: [
      {
        id: '1',
        name: 'Help',
        hexColor: colors.purple
      },
      {
        id: '2',
        name: 'Support Main',
        hexColor: colors.green
      }
    ]
  },
]