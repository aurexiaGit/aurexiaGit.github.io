//fonction affichant les utilisateurs dans le dropdown de la page (uniquement le from car le to est importé par le main)
const dropdownListFrom = (_users) => {  //on récupère l'addresse de l'utilisateur et l'objet javascript qui stockent les utilisateurs

	var select = document.getElementById("from-select");
	for (var key in _users){
		if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address !== "0x0000000000000000000000000000000000000000") {
		var opt = document.createElement('option');
		opt.value = _users[key].address.toLowerCase();
		opt.innerHTML = _users[key].name;
		select.appendChild(opt);
	  }
	}
}


// Création d'un objet javascript qui stocke importe les utilisateurs du smartcontract
const getUsersFrom = async () =>{
  
  let users = {}; //objet js
	let listAddressAndName;
	let name;
	var i = 0;
	
	//fonction interagissant avec le SC recupérant une liste composé des noms et addresse des utilisateurs 
	const getMembersAndName = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembersAndName((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  	})
	})}
	
	//fonction interagissant avec le SC récupérant la taille de la liste 
  const getTaille = async () =>{
    return new Promise(function(resolve, reject){
      Token.sizeListAccount((err, result) => {
        if (err) return reject(err);
        resolve(result);
    })
  })}

	//Création de l'objet JS users
	listAddressAndName = await getMembersAndName();
  let taille = await getTaille();
	while (i < taille) {
		var address = listAddressAndName[0][i];
		name = web3.toAscii(listAddressAndName[1][i]);
		users[name]={};
		users[name].address=address;
		users[name].name=name;
		i++
	}
	//on retourne l'affichage du dropdown
	return dropdownListFrom(users);
};
  
getUsersFrom();

//Fonction admin permettant de transferer des tokens depuis le compte de n'importe quel utilisateur
const transferFromTo = async() => {

	//Récupération des différents inputs
	let addressFrom = document.getElementById("from-select").value;
	let addressTo = document.getElementById("dest-select").value;
	let amount = document.getElementById("amount").value;
	amount = amount*Math.pow(10,18);
	let message = document.getElementById("wording").value;
	message = web3.fromAscii(message);

	//Récupération de l'adresse de l'utilisateur (admin)
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			resolve(accounts[0]);
		})
	  })};
	  
	let curAddress = await getCurAddress();

	//fonction de transfert de token (formulation différente mais un peu plus rigoureuse que dans index.js)
	const transferEvent = async (_address1, _address2, amount, _message, _curAddress) =>{
		return new Promise(function(resolve, reject){
			Token.transferFrom.sendTransaction(_address1, _address2, amount, _message, {from: _curAddress}, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};

	let transferTransaction = await transferEvent(addressFrom, addressTo, amount, message, curAddress);

	//reset des champs input
	var frm = document.getElementById("send");
	frm.reset();
	return transferTransaction
}
