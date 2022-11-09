function randomGenerator(n){
  const randomNumbers=[]

  for (let i=0; i<n; i++){
      randomNumbers.push(
          Math.floor(Math.random()*1000 + 1)
      )
  }
  return randomNumbers
}

process.on('message',(num)=>{
  const numbers=randomGenerator(num)
  process.send(numbers)
})