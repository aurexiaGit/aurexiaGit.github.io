// ******************************************* 
//Test update amount value after sending tokens
const getAccountInfo= async () => {

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
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
	//let accountInfo = [curAddress, balance];

	//return accountInfo;
	return balance;
}

//var accountInfo = getAccountInfo();
var curAddress = "0xc4d446c6B924c431f89214319D5A3e6bb67e7627"
//var curAddress = accountInfo[0]
var balance = getAccountInfo();
//var balance = accountInfo[1]
console.log(curAddress)
console.log(balance)

const filter = web3.eth.filter('latest');
filter.watch((err, res) => {
  if (err) {
    console.log(`Watch error: ${err}`);
  } else {
    // Update balance
    Token.balanceOf(curAddress, (err, bal) => {
      if (err) {
        console.log(`getBalance error: ${err}`);
      } else {
        balance = bal*Math.pow(10,-18);
        console.log(balance);
		console.log("watched")
		document.getElementById("astValue").innerHTML = balance.toString() + " AST"
      }
    });
  }
});

// *******************************************

function createPage(Balance) {	
	if (document.getElementById("astValue") !== undefined) {
		document.getElementById("astValue").innerHTML = Balance.toString() + " AST"	
	}
}

const accountManagement = async () => {

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
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
	let amount = document.getElementById("amount").value
	
	sending = true

	const transferEvent = (address, amount) =>{
		return new Promise(function(resolve, reject){
			Token.transfer(address, amount*Math.pow(10,18), (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};

	var frm = document.getElementById("send");
	frm.reset();
	transferTransaction = await transferEvent(address,amount);
	return transferTransaction
}
  