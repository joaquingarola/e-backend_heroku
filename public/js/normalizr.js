const author = new normalizr.schema.Entity('authors', {}, {idAttribute: 'email'})
const mensaje = new normalizr.schema.Entity('mensajes', {author: author}, {idAttribute: '_id'})

const denormalizeMsg = (data) => {
    const _denormalized = normalizr.denormalize(data.result, [mensaje], data.entities)
    return _denormalized
}
