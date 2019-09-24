
/*function initialDonation() {
	// Called when the admin clicks on the button initial donations.
	// The if is a security to prevent the admin to send donations by mistake
	if (window.confirm("Do you really want to send initial donations to all Blockchain members?")) {
		for (key in users) {
			Token.transferFrom(curAccount, users[key].address,50*Math.pow(10,-18),function(err,result) {console.log("")}) // The initial donations were fixed at 50 AST
		}
	}
}*/


const initialDonations = async () =>{

	const getCurAddress = () =>{                         
		return new Promise(function(resolve, reject){
		  web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
		})
	  })}

	let curAddress = await getCurAddress();

	let amount = 50*Math.pow(10,-18);

	Token.transferAll.sendTransaction(amount, {from: curAddress}, (error, result) => {
		if (error) throw error;
		console.log(result)
	})

	return true;
} 