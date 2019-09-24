const getHistory = async () =>{

	let curAddress;
  
	const getCurAddress = () =>{                         
	  return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
		  if (err) return reject(err);
		  resolve(accounts[0]);
	  })
	})}
  
	curAddress = await getCurAddress();
	
	let users = {};
	let listAddress;
	let name;
	var i = 0;

	const getMembers = () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembers((err, members) => {
				if (err) return reject(err);
				resolve(members);
		})
	})}

	const getName = (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, name) => {
				if (err) return reject(err);
				resolve(name);
		})
	})}	

	listAddress = await getMembers();
	while (i < listAddress.length) {
		var address = listAddress[i];
		name = await getName(address);
		users[name]={}
		users[name].address=address
		users[name].name=name
		i++
	}

	//use of Etherscan API to get the list of transactions for current user. Results are saved in a JSON file
	$.getJSON('https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=' + curAddress + '&startblock=0&endblock=999999999&sort=asc&apikey=NSAMUW521D6CQ63KHUPRQEERSW8FVRAF9B', function(data) {
		var resultArray = data.result

		// fill the history with data from json file. Required/relevant columns from json are:
		//1) timeStamp (nb of seconds since 01/01/1970)
		//2) from: originator of the transaction
		//3) to: receiver of the transaction
		//4) value: transaction value (to divide by 10^18)
		const fillHistory = async (resultArray, curAddress) =>{
			var table = document.getElementById("content-history")
			var i = 1
			for (var key in resultArray){
				var row = document.createElement('tr')
				row.class = "row" + i.toString() + " body"
				table.appendChild(row)

				var column1 = document.createElement('td')
				column1.className = "column1"
				//convert timestamp to date (*1000 below is to get it in ms)
				var d = new Date(parseInt(resultArray[key].timeStamp)*1000);
				var date = d.getDate();
				var month = d.getMonth(); 
				var year = d.getFullYear();
				var dateString = date + "-" + (month + 1) + "-" + year;

				column1.innerHTML = dateString
				row.appendChild(column1)

				var column2 = document.createElement('td')
				column2.className = "column2"
				if (resultArray[key].from == curAddress) {
					column2.innerHTML = "Transfer"
				}
				else {
					column2.innerHTML = "Reception"
				}
				row.appendChild(column2)

				var column3 = document.createElement('td')
				column3.className = "column3"
				column3.innerHTML = await getName(resultArray[key].from)
				row.appendChild(column3)

				var column4 = document.createElement('td')
				column4.className = "column4"
				column4.innerHTML = await getName(resultArray[key].to)
				row.appendChild(column4)
				
				var column5 = document.createElement('td')
				column5.className = "column5"
				column5.innerHTML = Math.round(resultArray[key].value*Math.pow(10,-18))
				row.appendChild(column5)
				
				i++
			}
		}
		fillHistory(resultArray, curAddress);
	});
};
getHistory();