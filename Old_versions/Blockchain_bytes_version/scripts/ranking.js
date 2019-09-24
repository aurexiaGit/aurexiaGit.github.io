/*
const getRankingTable = (_usersTop, _usersPerso) => {
	var table = document.getElementById("content")
	var i = 1

	for (var key in _usersTop){

		var row = document.createElement('tr')
		row.class = "row" + i.toString() + " body"
		table.appendChild(row)

		var column1 = document.createElement('td')
		column1.className = "column1"
		column1.innerHTML = _usersTop[key].classement
		row.appendChild(column1)

		var column2 = document.createElement('td')
		column2.className = "column2"
		column2.innerHTML = _usersTop[key].name
		row.appendChild(column2)

		var column3 = document.createElement('td')
		column3.className = "column3"
		column3.innerHTML = _usersTop[key].address
		row.appendChild(column3)

		var column4 = document.createElement('td')
		column4.className = "column4"
		column4.innerHTML = _usersTop[key].balance
		row.appendChild(column4)

		i++
	}

	var table_perso = document.getElementById("content_perso")
	var j = 1

	for (var key in _usersPerso){

		var row = document.createElement('tr')
		row.class = "row" + j.toString() + " body"
		table_perso.appendChild(row)

		var column1 = document.createElement('td')
		column1.className = "column1"
		column1.innerHTML = _usersPerso[key].classement
		row.appendChild(column1)

		var column2 = document.createElement('td')
		column2.className = "column2"
		column2.innerHTML = _usersPerso[key].name
		row.appendChild(column2)

		var column3 = document.createElement('td')
		column3.className = "column3"
		column3.innerHTML = _usersPerso[key].address
		row.appendChild(column3)

		var column4 = document.createElement('td')
		column4.className = "column4"
		column4.innerHTML = _usersPerso[key].balance
		row.appendChild(column4)

		i++
	}
}


const getRankingList = async () =>{

	console.log("ranking")
	var users = {};
	var listAddress;
	var name;
	var i = 0;
	
	const getCurAddress = () =>{                     
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
    	})
	  })
	}

	const getMembers = () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembers((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	const getName = (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, name) => {
				if (err) return reject(err);
				resolve(name);
			})
		})
	};
	
	const getBalance = (_curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.balanceOf(_curAddress, (err, result) => {
				if (err) return reject (err);
				resolve(result*Math.pow(10,-18));
			})
		})
	};
	
	listAddress = await getMembers();
	curAddress = await getCurAddress();

	//listAddress.splice(0,1);       // cette fonction supprime l'administrateur de la liste des personnes (pour ne pas l'afficher). je le garde car on a peu de membre pour le moment mais a terme on activera la fonction

	console.log('cur address')
	console.log(curAddress)
	console.log("list address")
	console.log(listAddress)

	while (i < listAddress.length) {
		var address = listAddress[i];
		name = await getName(address);
		balance = await getBalance(address);
		users[i]={};
		users[i].address=address;
		users[i].name=name;
		users[i].balance=balance;
		i++
	}

	var usersTop = {};
	var usersPerso = {
					Perso:{
						name: "err",
						address: "err",
						balance: "err",
						classement: "err"
					}
				};


	for (var i = listAddress.length-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (users[j].balance < users[j+1].balance){
				users["tempo"] = users[j];
				users[j] = users[j+1];
				users[j+1] = users["tempo"];
			}
		}
	}

	if (listAddress.length <= 3){
		console.log("dans if1")
		for (var i=0; i<listAddress.length; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i + 1;
		}
	}
	else{
		console.log("dans if2")
		for (var i=0; i<3; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i+1;
		}
	}

	for (var i=0; i<listAddress.length; i++){
		if (users[i].address == curAddress){
			usersPerso["Perso"].name = users[i].name;
			usersPerso["Perso"].address = curAddress;
			usersPerso["Perso"].balance = users[i].balance;
			usersPerso["Perso"].classement = i + 1;
			break;
		}
	}


	return getRankingTable(usersTop, usersPerso);
};

getRankingList();

*/

const getRankingTable = (_usersTop) => {
	var table = document.getElementById("content");
	var i = 0;
	console.log("userTop");
	console.log(_usersTop);
	console.log('ranking table');

	for (key in _usersTop){

		var number = i + 2;
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = _usersTop[key].classement;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _usersTop[key].name;
		console.log (_usersTop[key].name);
		row.appendChild(column2);
		
		/*
		var column3 = document.createElement('td')
		column3.className = "column3"
		column3.innerHTML = _usersTop[key].address
		row.appendChild(column3)
		*/

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = Math.round(_usersTop[key].balance);
		row.appendChild(column3);

		console.log(i);
		i++;
		
	}

	/*
	var table_perso = document.getElementById("content_perso")
	var j = 1

	for (var key in _usersPerso){

		var row = document.createElement('tr')
		row.class = "row" + j.toString() + " body"
		table_perso.appendChild(row)

		var column1 = document.createElement('td')
		column1.className = "column1"
		column1.innerHTML = _usersPerso[key].classement
		row.appendChild(column1)

		var column2 = document.createElement('td')
		column2.className = "column2"
		column2.innerHTML = _usersPerso[key].name
		row.appendChild(column2)
		
		
		var column3 = document.createElement('td')
		column3.className = "column3"
		column3.innerHTML = _usersPerso[key].address
		row.appendChild(column3)
		

		var column4 = document.createElement('td')
		column4.className = "column4"
		column4.innerHTML = Math.round(_usersPerso[key].balance)
		row.appendChild(column4)

		i++
	}
	*/
}


const getRankingList = async () =>{

	console.log("ranking")
	var users = {};
	var listAddress;
	var name;
	var i = 0;
	
	const getCurAddress = async () =>{                     
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
    	})
	  })
	}

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
	curAddress = await getCurAddress();
	var taille = await getTaille();
	console.log("taille1");
	console.log(taille);

	listAddress.splice(0,1);       // cette fonction supprime l'administrateur de la liste des personnes (pour ne pas l'afficher). je le garde car on a peu de membre pour le moment mais a terme on activera la fonction
	taille = taille - 1;
	console.log("taille 1");
	console.log(taille);
	
	console.log('cur address')
	console.log(curAddress)
	console.log("list address")
	console.log(listAddress)

	while (i < taille) {
		var address = listAddress[i];
		name = await getName(address);
		balance = await getBalance(address);
		users[i]={};
		users[i].address=address;
		users[i].name=name;
		users[i].balance=balance;
		i++
	}

	var usersTop = {};
	var usersPerso = {
					Perso:{
						name: "err",
						address: "err",
						balance: "err",
						classement: "err"
					}
				};


	for (var i = taille-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (users[j].balance < users[j+1].balance){
				users["tempo"] = users[j];
				users[j] = users[j+1];
				users[j+1] = users["tempo"];
			}
		}
	}
	console.log(users);
	
	if (taille <= 3){
		console.log("dans if1")
		for (var i=0; i<taille; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i + 1;
		}
	}
	else{
		console.log("dans if2")
		for (var i=0; i<3; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i+1;
		}
	}

	for (var i=0; i<taille; i++){
		if (users[i].address.toLowerCase() == curAddress.toLowerCase()){
			usersPerso["Perso"].name = users[i].name;
			usersPerso["Perso"].address = curAddress;
			usersPerso["Perso"].balance = users[i].balance;
			usersPerso["Perso"].classement = i + 1;
			break;
		}
	}

	// Display current user's ranking
	var ownRankEnd = "th";
	var ownRank = usersPerso["Perso"].classement
	switch(ownRank) {
		case 1:
			ownRankEnd = "st"
			break;
		case 2:
			ownRankEnd = "nd"
			break;
		case 3:
			ownRankEnd = "rd"
			break;
	}

	var rank = document.getElementById("ownRanking");
	rank.innerHTML="<p class='ownRankingTxt'>You are currently ranked " + ownRank.toString() + ownRankEnd  + "</p>";

	return getRankingTable(usersTop, usersPerso);
};

getRankingList();