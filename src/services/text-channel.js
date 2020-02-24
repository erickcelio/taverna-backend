import {
  createMessageOnTextChannelRepository,
  findTextChannelByIdRepository,
  findTextChannelsByIdsRepository
} from 'repository/text-channel'

export const findTextChannelByIdService = id =>
  findTextChannelByIdRepository(id)

export const findTextChannelsByIdsService = ids =>
  findTextChannelsByIdsRepository(ids)

export const sendMessageOnTextChannelService = (
  senderId,
  { textChannelId, content }
) =>
  createMessageOnTextChannelRepository(senderId, textChannelId, content).then(
    _ => ({
      sender: senderId,
      content
    })
  )
