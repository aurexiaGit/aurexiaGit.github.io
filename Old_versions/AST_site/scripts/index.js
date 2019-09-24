// ******************************************* 
//Test update amount value after sending tokens

/*
const refreshBalance= async () => {

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};
	
  	const getBalance = (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	};
	
	let curAddress = await getCurAddress();
	let balance = await getBalance(curAddress);

	const filter = web3.eth.filter('latest');
	filter.watch((err, res) => {
	if (err) {
		console.log(`Watch error: ${err}`);
	} else {
	// Update balance
		const refresh= async (curAddress,balance) => {
			let bal;
			bal = await getBalance(curAddress);
			console.log("Real account balance (bal): " + bal)
			if (balance > bal) {
				alert("Your transaction has been executed!")
				balance = bal;
				console.log("Transaction has been executed, balance is " + balance);
				document.getElementById("astValue").innerHTML = (Math.round(Balance)).toString() + " AST"
				balance = await getBalance(curAddress)
				bal = await getBalance(curAddress)
			} else if (balance < bal) {
				alert("You have received " + (balance - bal).toString() + " AST!")
				balance = bal;
				console.log("Reception of tokens, balance is " + balance);
				document.getElementById("astValue").innerHTML = (Math.round(Balance)).toString() + " AST"
				balance = await getBalance(curAddress)
				bal = await getBalance(curAddress)
			}
		}
		refresh(curAddress,balance);
	}
	});
}
refreshBalance(); */


// *******************************************

function createPage(Balance) {	
	if (document.getElementById("astValue") !== undefined) {
		document.getElementById("astValue").innerHTML = (Math.round(Balance)).toString() + " AST"	
	}
}

const accountManagement = async () => {

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

  	const getBalance = (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	};

	let curAddress = await getCurAddress();
	let balance = await getBalance(curAddress);

	return createPage(balance)
}

accountManagement ();

const loading = (_sending) => {
	var elmt = document.getElementById("loading")
	if (_sending == true) {
		elmt.innerHTML = "<br><div>Sending tokens </div><img src='images/Spinner-1s-40px.gif'/>"
	}
}



//Transfer tokens when clicking on "send" in home page
const Transfer = async() => {

	let address = document.getElementById("dest-select").value
	console.log("adress in Transfer function is:" + address)
	let amount = document.getElementById("amount").value
	
	sending = true

	const transferEvent = (address, amount) =>{
		return new Promise(function(resolve, reject){
			console.log ("dans la fonction transfert")
			console.log (address)
			amount = amount*Math.pow(10,18);
			web3.eth.getAccounts(function(error, accounts) {
				if (error) throw error;
				let account = accounts[0].toLowerCase();
				console.log ('addresse envoyeur');
				console.log(account);
				console.log("addresse receveur");
				console.log(address);
				// Send ERC20 transaction with web3
				Token.transfer.sendTransaction(address, amount, {from: account}, (error, txnHash) => {
					if (error) return reject (error);
					console.log("ca marche !!")
					console.log(txnHash);
					resolve (txnHash)
				});
			});
		})
	};

	
	var frm = document.getElementById("send");
	frm.reset();
	let transferTransaction = await transferEvent(address,amount);
	return transferTransaction;
}

