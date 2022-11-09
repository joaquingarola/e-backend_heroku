class Contenedor{
  constructor(name) {
    this.Schema = name;
  }

  async save (object){
    try {
      const obj = await new this.Schema(object).save()
      return obj.id
    } catch (err) {
      logger.log('error',err)
    }
  }

  async getAll() {
    try {
      return await this.Schema.find();
    } catch (err) {
      logger.log('error',err)
    }
  }

}

module.exports = Contenedor;