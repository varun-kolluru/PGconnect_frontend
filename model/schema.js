import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'chats',
      columns: [
        { name: 'msgfrom', type: 'string' },
        { name: 'msgto', type: 'string' },
        { name: 'msg', type: 'string'},
        { name: 'ts', type:'string'},
        { name: 'room', type: 'string'}
      ]
    }),
  ]
})