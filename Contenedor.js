const fs = require('fs');

class Contenedor{
  constructor(file) {
    this.file = file;
  }

  async save(prod){
    try{
      const data = await fs.promises.readFile(`./files/${this.file}.txt`, 'utf-8');
      const products = (data.length === 0) ? [] : JSON.parse(data);
      let id = products.length ? products[products.length-1].id+1 : 1;
      
      products.push({...prod, id: id});
      await fs.promises.writeFile(`./files/${this.file}.txt`, JSON.stringify(products));
      return id;
    }
    catch(err){
      console.log("error", err);
    }
  }

  async update(prods){
    try{
      await fs.promises.writeFile(`./files/${this.file}.txt`, JSON.stringify(prods));
    }
    catch(err){
      console.log("error", err);
    }
  }

  async getById(id){
    try{
      const data = await fs.promises.readFile(`./files/${this.file}.txt`, 'utf-8');
      return JSON.parse(data).find(p => p.id === id) 
    }
    catch(err){
      console.log(err);
    }
  }

  async getAll(){
    try{
      const data = await fs.promises.readFile(`./files/${this.file}.txt`, 'utf-8');
      return JSON.parse(data);
    }
    catch(err){
      console.log("error", err);
    }
  }

  async deleteById(id){
    try{
      const prod = await this.getById(id);
      if (prod){
        const data = await fs.promises.readFile(`./files/${this.file}.txt`, 'utf-8');
        const products = JSON.parse(data);
        this.update(products.filter(p => p.id !== id));
        return id;
      }
      return 0;
    }
    catch(err){
      console.log("error", err);
    }
  } 

  async deleteAll(){
    try{
      await fs.promises.writeFile(`./files/${this.file}.txt`, '');
    }
    catch(err){
      console.log("error", err);
    }
  }
}

module.exports = Contenedor;