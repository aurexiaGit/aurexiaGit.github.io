const addCharity = async () => {
	// Called when clicking on Add button
	var _address = document.getElementById("adress1").value;
	var _name = document.getElementById("name1").value;
	_name = web3.fromAscii(_name);

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

	const addC = async (address, name, curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.addAssociation.sendTransaction(address,name,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	let _curAddress = await getCurAddress();
	let assigment = await addC(_address,_name, _curAddress);
	var frm = document.getElementById("addCharity");
	frm.reset();
	console.log(assigment)
	return false;
}

const remCharity = async () => {
	// Called when clicking on remove button
	var _address = document.getElementById("adress2").value
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

	const remC = async (address, curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.remAssociation.sendTransaction(address,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	let _curAddress = await getCurAddress();
	let assigment = await remC(_address, _curAddress);
	var frm = document.getElementById("remCharity");
	frm.reset();
	console.log(assigment)
	return false;
}

////////////////////////////////////////////////////////
//               ouverture des donations              //
////////////////////////////////////////////////////////


const openDonation = async () => {

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
	})};

	const open = async (curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.launchDonation.sendTransaction({from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	let curAddress = await getCurAddress();
	let result = await open (curAddress);
	console.log(result)
	return result;
}


const closeDonation = async () => {

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
		})};

	const close = async (curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.closeDonation.sendTransaction({from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	let curAddress = await getCurAddress();
	let result = await close (curAddress);
	console.log(result)
	return result;
}


// Cette partie nécessite une modification du smartcontract sur les fonction Charities. En effet il faut faire comme pour les members, une liste stockant toutes les adresses des charities
// afin de pouvoir les récupérer et faire le tableau. 

////////////////////////////////////////////////////////
//     Creation de la table listant les charity         //
////////////////////////////////////////////////////////



const getCharityTable = (_charity) => {
	var table = document.getElementById("content")
	var i = 1

	for (var key in _charity){

		var row = document.createElement('tr')
		row.class = "row" + i.toString() + " body"
		table.appendChild(row)

		var column1 = document.createElement('td')
		column1.className = "column1"
		column1.innerHTML = "<img src = '" + _charity[key].pic + "'>"
		row.appendChild(column1)

		var column2 = document.createElement('td')
		column2.className = "column2"
		column2.innerHTML = _charity[key].name
		row.appendChild(column2)

		var column3 = document.createElement('td')
		column3.className = "column3"
		column3.innerHTML = _charity[key].address
		row.appendChild(column3)

		var column4 = document.createElement('td')
		column4.className = "column4"
		column4.innerHTML = _charity[key].balance
		row.appendChild(column4)

		i++
	}
}

const getCharityList = async () =>{

	let charity = {};
	let listAddress;
	let name;
	let i = 0;
  
	const getCharity = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getCharityAddress((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	const getName = async (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getAssoName(address, (err, res) => {
				if (err) return reject(err);
				let name = web3.hexToUtf8(res);
				resolve(name);
			})
		})
	};
	
	const getBalance = async (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	}

	const getTaille = async () =>{
		return new Promise(function(resolve, reject){
		  Token.getCharitySize((err, result) => {
			if (err) return reject(err);
			console.log(result);
			resolve(result);
		})
	  })}

	listAddress = await getCharity();
	console.log("lsite charities list");
	console.log(listAddress);
	let taille = await getTaille();
	console.log("get taille");
	console.log(taille);
	while (i < taille) {
		var address = listAddress[i];
		console.log(address);
		name = await getName(address);
		balance = await getBalance(address);
		charity[name]={};
		charity[name].address=address;
		charity[name].name=name;
		charity[name].balance=balance;
		i++
		console.log(charity[name].address);
		console.log(charity[name].name);
		console.log(charity[name].balance);
	}

	return getCharityTable(charity)
};

getCharityList();
