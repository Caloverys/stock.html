  self.onmessage = function(e) {
  fetching_symbol().then(function(result){
      self.postMessage(JSON.stringify(result))
      const all_data = result;
      let symbolname_list = {}
      let character_list = []
       
       all_data.forEach(i=>{
        //i["0"][0] => first character of the symbol
      if(!character_list.includes(i["0"][0])){
         character_list.push(i["0"][0])
         symbolname_list[i["0"][0]] = []
        }
         symbolname_list[i["0"][0]].push(i["0"])
      })


      //convert the object to array contain object
      symbolname_list = Object.keys(symbolname_list).map(key => {
       return  symbolname_list[key];
      })


      self.postMessage(JSON.stringify(symbolname_list))
      const price_list = all_data.map(i=>{
        return i["2"]
      })
      self.postMessage(JSON.stringify(price_list))

      const full_name_list = all_data.map(i=>{

        return i["1"]
      })
      self.postMessage(JSON.stringify(full_name_list))

  });
  };

  function fetching_symbol(){
    return fetch("https://financialmodelingprep.com/api/v3/stock/list?apikey=ee684c5f9b04a3e914f9e39630f0f929")
  .then(res=> res.json())
  .then(data =>{
    let symbol_list = data;
    console.log(symbol_list)
  symbol_list = symbol_list.filter(i=>{
    //check if the symbol contains only the characters (e.g "a1.b" or "ab.ll" will not pass the test)
    //i["name"][0] => The first character in i["name"]
    return i["type"] === 'stock' && /^[a-zA-Z]+$/.test(i["symbol"]) &&  isNaN(i["name"][0]) && i["price"] !== 0;
   }).sort((a,b) =>{
    return a['symbol'].localeCompare(b["symbol"])
  })

  for(let i =0;i<symbol_list.length;i++){
    //rename all the object.keys to integer to minimize the size of JSON string and improve peformance
    
    //Duplictate the values with keys 'symbol' and name as 0
     Object.defineProperty(symbol_list[i], "0",
      Object.getOwnPropertyDescriptor(symbol_list[i], "symbol"));
      Object.defineProperty(symbol_list[i], "1",
      Object.getOwnPropertyDescriptor(symbol_list[i], "name"));
      Object.defineProperty(symbol_list[i], "2",
      Object.getOwnPropertyDescriptor(symbol_list[i], "price"));
        Object.defineProperty(symbol_list[i], "3",
      Object.getOwnPropertyDescriptor(symbol_list[i], "exchange"));
            Object.defineProperty(symbol_list[i], "4",
      Object.getOwnPropertyDescriptor(symbol_list[i], "exchangeShortName"));

      //Now delete now previous Object keys and values
      delete symbol_list[i]['symbol']
     delete symbol_list[i]['name']
     delete symbol_list[i]['price']
     delete symbol_list[i]['exchange']
     delete symbol_list[i]['exchangeShortName']
    delete symbol_list[i]['type']
  }

  /*Now the symbol_list will look something like this:
  {"0":"CMCSA",
  "1":"Comcast Corporation",
  "2":43.8,
  "3":"NASDAQ Global Select",
  "4":"NASDAQ"}
  */
   return symbol_list
 })

  }
