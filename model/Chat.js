import { text } from '@nozbe/watermelondb/decorators'
import { Model } from '@nozbe/watermelondb'

export default class Chat extends Model {
  static table = 'chats'

  @text('msgfrom') msg_from
  @text('msgto') msg_to
  @text('msg') msg
  @text('ts') ts
  @text('room') room
}