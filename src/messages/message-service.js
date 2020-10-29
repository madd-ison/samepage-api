const MessageService = {
    getAllMessages(knex) {
        return knex
        .select('*').from('messages')
    },
    addMessage(knex, newMessage) {
        return knex
        .insert(newMessage)
        .into('messages')
        .returning('*')
        .then(message => message[0])
    },
    getMessageById(knex, id) {
        return knex.from('messages').select('*').where('id', id).first()
    },
    deleteMessage(knex, id) {
        return knex
        .from('messages')
        .where('id', id)
        .delete()
    },
    updateMessage(knex, id, content) {
        return knex
        .from('messages')
        .where('id', id)
        .update(content)
    },
}   

module.exports = MessageService