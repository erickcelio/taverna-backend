import TextChannel from 'models/textChannel'

export const findTextChannelByIdRepository = id => TextChannel.findById(id)

export const findTextChannelsByIdsRepository = ids =>
  TextChannel.find({ _id: { $in: ids } })

export const createMessageOnTextChannelRepository = (
  sender,
  textChannelId,
  content
) =>
  TextChannel.findByIdAndUpdate(textChannelId, {
    $push: {
      messages: {
        sender,
        content
      }
    }
  })
