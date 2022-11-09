const generateProducts = (req, res) => {
  try{
    const products=[];
    for (let i=0; i<5; i++){
      const prod={
      id:i+1,
      product_name:"Producto",
      product_price: 7.5 * i,
      product_thumbnail: "https://picsum.photos/100"
    }
      products.push(prod);
    }
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

module.exports = generateProducts;