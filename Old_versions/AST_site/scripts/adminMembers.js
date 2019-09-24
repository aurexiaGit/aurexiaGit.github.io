const addMember = async () => {
	// Called when clicking on Add button
	var _address = document.getElementById("adress1").value
	var _name = document.getElementById("name1").value
	var _grade = document.getElementById ("grade1").value

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

	const addM = (address, name, grade, curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.addToAurexiaMembers.sendTransaction(address,name,grade,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	var frm = document.getElementById("addMember");
	frm.reset();
	let _curAddress = await getCurAddress();
	let assigment = await addM(_address,_name,_grade, _curAddress)
	console.log(assigment)
	return false;
}

const remMember = async () => {
	// Called when clicking on remove button
	var _address = document.getElementById("adress2").value
	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

	const remM = (address, curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.remAurexiaMembers.sendTransaction(address,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	var frm = document.getElementById("remMember");
	frm.reset();
	let _curAddress = await getCurAddress();
	let assigment = await remM(_address, _curAddress)
	console.log(assigment)
	return false;
}
