const { faker }= require('@faker-js/faker');

const generateProducts = (req, res) => {
  try{
    const products=[];
    for (let i=0; i<5; i++){
      const prod={
      id:i+1,
      product_name:faker.commerce.productName(),
      product_price:faker.commerce.price(100,5000,0,'$'),
      product_thumbnail:faker.image.image(100, 100, true)
    }
      products.push(prod);
    }
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

module.exports = generateProducts;