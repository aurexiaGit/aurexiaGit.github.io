const dropdownListFrom = (_curAddress, _users) => {

	var select = document.getElementById("from-select");
	for (var key in _users){
		if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address.toLowerCase() !== _curAddress.toLowerCase() && _users[key].address !== "0x0000000000000000000000000000000000000000") {
		console.log(_users[key].address)
		console.log(_users[key].name)
		var opt = document.createElement('option');
		opt.value = _users[key].address.toLowerCase();
		opt.innerHTML = _users[key].name;
		select.appendChild(opt);
	  }
	}
  }
  
  const getUsersFrom = async () =>{
  
	let users = {};
	  let listAddress;
	  let name;
	  var i = 0;
	
	  const getMembers = async () =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getMembers((err, members) => {
				  if (err) return reject(err);
				  resolve(members);
			})
	  })}
  
	  const getName = async (address) =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getName(address, (err, res) => {
				  if (err) return reject(err);
				  let name = web3.toAscii(res);
					resolve(name);
		  })
	})}	
	
	const getTaille = async () =>{
	  return new Promise(function(resolve, reject){
		Token.sizeListAccount((err, result) => {
		  if (err) return reject(err);
		  resolve(result);
	  })
	})}
  
	  listAddress = await getMembers();
	  console.log("get list of addresses")
	console.log(listAddress);
	let taille = await getTaille();
	  while (i < taille) {
		  var address = listAddress[i];
		  console.log(address)
		  name = await getName(address);
		  users[name]={}
		  users[name].address=address
		  users[name].name=name
		  i++
		  console.log(users[name].address)
		  console.log(users[name].name)
	}
	
	//get current address before dropdownlist call, to remove own name from dropdown list
	let curAddress;
  
	const getCurAddress = async () =>{                         
	return new Promise(function(resolve, reject){
	  web3.eth.getAccounts((err, accounts) => {
		if (err) return reject(err);
		resolve(accounts[0]);
	})
	})}
  
  
	curAddress = await getCurAddress();
	return dropdownListFrom(curAddress, users);
  };
  
getUsersFrom();


const transferFromTo = async() => {

	let addressFrom = document.getElementById("from-select").value;
	console.log(addressFrom)
	let addressTo = document.getElementById("dest-select").value;
	console.log(addressTo)
	let amount = document.getElementById("amount").value;
	console.log(amount)
	amount = amount*Math.pow(10,18);


	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
		})
	  })};
	  
	let curAddress = await getCurAddress();

	const transferEvent = async (_address1, _address2, amount, _curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.transferFrom.sendTransaction(_address1, _address2, amount, {from: _curAddress}, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};

	let transferTransaction = await transferEvent(addressFrom, addressTo, amount, curAddress);
	var frm = document.getElementById("send");
	frm.reset();
	return transferTransaction
}
