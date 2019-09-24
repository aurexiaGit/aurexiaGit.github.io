
////////////////////////////////////////////////////////
//     Creation de la table listant les users         //
////////////////////////////////////////////////////////

const getUserTable = (_users, _taille) => {
	var table = document.getElementById("content");
	var i = 1;

	for (var k=0; k<_taille; k++){

		var row = table.insertRow(-1);
		row.className = "row" + i.toString() + " body";

		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = i;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _users[k].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = _users[k].address;
		row.appendChild(column3);

		var column4 = document.createElement('td');
		column4.className = "column4";
		column4.innerHTML = Math.round(_users[k].balance);
		row.appendChild(column4);

		i++;
	}
}

const getUsersList = async () =>{

	let users = {};
	let listAddress;
	let name;
	let i = 0;
  
	const getMembers = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembers((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	const getName = async (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, res) => {
				if (err) return reject(err);
				let name = web3.toAscii(res);
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
	};

	const getTaille = async () =>{
		return new Promise(function(resolve, reject){
		  Token.sizeListAccount((err, result) => {
			if (err) return reject(err);
			resolve(result);
		})
	  })}

	listAddress = await getMembers();
	let taille = await getTaille();
	console.log("get list of addresses")
	console.log(listAddress);
	while (i < taille) {
		var address = listAddress[i];
		name = await getName(address);
		balance = await getBalance(address);
		users[i]={};
		users[i].address=address;
		users[i].name=name;
		users[i].balance=balance;
		i++;
	}

	console.log(users);

	for (var k = taille-1; k > 0 ; k--){
		for (var j = 0; j < k; j++){
			if (users[j].balance < users[j+1].balance){
				users["tempo"] = users[j];
				users[j] = users[j+1];
				users[j+1] = users["tempo"];
			}
		}
	}
	console.log(users);

	return getUserTable(users, taille)
};

getUsersList();
