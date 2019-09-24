/***************************************************************** */
/*                     Creation de token                           */
/***************************************************************** */ 

const createTokens = async () => {
	// Creates tokens on an account
	var amount = document.getElementById("amount1").value
	amount = amount * Math.pow(10,18);
	var address = document.getElementById("adress1").value

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
	  })};

	//fonction qui interagit avec le SC pour créer de nouveaux tokens.
	const create = async (_curAddress, _address, _amount) =>{
		return new Promise(function(resolve, reject){
		Token.mint.sendTransaction(_address,_amount, {from: _curAddress}, (err,result) => {
			if (err) return reject (err);
			resolve (result)
		})
	})}

	let curAddress = await getCurAddress();

	//on retourne la fonction interagissant avec le SC
	let creation = await create(curAddress, address, amount);

	//reset des champs
	var frm = document.getElementById("addMember");
	frm.reset();
	return true;
}


/***************************************************************** */
/*                     Suppression de token                        */
/***************************************************************** */

const destroyTokens = async () => {
	var amount = document.getElementById("amount2").value
	amount = amount * Math.pow(10,18);
	var address = document.getElementById("adress2").value

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
	  })};

	//fonction qui interagit avec le SC pour détruire de nouveaux tokens. 
	const destroy = async (_curAddress, _address, _amount) =>{
		return new Promise(function(resolve, reject){
		Token.burn.sendTransaction(_address,_amount, {from:_curAddress}, (err,result) => {
			if (err) return reject(err);
			resolve (result);
		})
	})}

	let curAddress = await getCurAddress();
	
	//on retourne la fonction intéragissant avec le SC
	let destroyed = await destroy(curAddress, address, amount);

	//reset des champs
	var frm = document.getElementById("supMember");
	frm.reset();

	return true;
}