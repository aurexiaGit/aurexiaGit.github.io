const dropdownList = (_curAddress, _charity) => {

	var select = document.getElementById("dest-select");
	for (var key in _charity){
		if (_charity.hasOwnProperty(key) && key !== "admin" && _charity[key].address.toLowerCase() !== _curAddress.toLowerCase()) {
		console.log(_charity[key].address)
		console.log(_charity[key].name)
		var opt = document.createElement('option');
		opt.value = _charity[key].address.toLowerCase();
		opt.innerHTML = _charity[key].name;
		select.appendChild(opt);
	  }
	}
  }
  
  const getCharity = async () =>{
  
	let charity = {};
	  let listCharity;
	  let name;
	  var i = 0;
	
	  const getCharity = () =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getCharityAddress((err, charities) => {
				  if (err) return reject(err);
				  resolve(charities);
			})
	  })}
  
	  const getName = (address) =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getAssoName(address, (err, name) => {
				  if (err) return reject(err);
				  resolve(name);
		  })
	  })}	
  
	  listCharity = await getCharity();
	  console.log("get list of addresses")
	  console.log(listCharity);
	  while (i < listCharity.length) {
		  var address = listCharity[i];
		  console.log(address)
		  name = await getName(address);
		  charity[name]={}
		  charity[name].address=address.toLowerCase();
		  charity[name].name=name
		  i++
		  console.log(charity[name].address)
		  console.log(charity[name].name)
	}
	
	//get current address before dropdownlist call, to remove own name from dropdown list
	let curAddress;
  
	const getCurAddress = () =>{                         
	return new Promise(function(resolve, reject){
	  web3.eth.getAccounts((err, accounts) => {
		if (err) return reject(err);
		resolve(accounts[0]);
	})
	})}
  
	curAddress = await getCurAddress();
	return dropdownList(curAddress, charity);
  };
  
  getcharity();


  const transferCharity = async() => {

	let address = document.getElementById("dest-select").value
	console.log("adress in Transfer function is:" + address)
	
	sending = true

	const transferEvent = (address, amount) =>{
		return new Promise(function(resolve, reject){
			console.log ("dans la fonction transfert")
			console.log (address)
			amount = amount*Math.pow(10,18);
			web3.eth.getAccounts(function(error, accounts) {
				if (error) throw error;
				// Send ERC20 transaction with web3
				Token.transferToAssociation.sendTransaction(address, {from: accounts[0]}, (error, txnHash) => {
					if (error) return reject (error);
					resolve(txnHash)
					console.log(txnHash);
				});
			});
		})
	};

	
	var frm = document.getElementById("send");
	frm.reset();
	let transferTransaction = await transferEvent(address,amount);
	return transferTransaction;
}