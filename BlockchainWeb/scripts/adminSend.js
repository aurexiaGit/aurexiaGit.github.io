//fonction affichant les utilisateurs dans le dropdown de la page (uniquement le from car le to est importé par le main)
const dropdownListFrom = (_users, _keyName) => {  //on récupère l'addresse de l'utilisateur et l'objet javascript qui stockent les utilisateurs

	var select = document.getElementById("from-select");
  	for (let i=0; i<_keyName.length; i++){
    var key = _keyName[i];
		if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address !== "0x0000000000000000000000000000000000000000") {
		var opt = document.createElement('option');
		opt.value = _users[key].address.toLowerCase();
		opt.innerHTML = _users[key].name;
		select.appendChild(opt);
	  }
	}
}

const dropdownListTo = (_users, _keyName) => {  //on récupère l'addresse de l'utilisateur et l'objet javascript qui stockent les utilisateurs

	var select = document.getElementById("to-select");
  	for (let i=0; i<_keyName.length; i++){
    var key = _keyName[i];
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

	//Création de l'objet JS users
	listAddressAndName = await getMembersAndName();
  	let taille = await getTaille();
	while (i < taille) {
		var address = listAddressAndName[0][i];
		name = web3.utils.toAscii(listAddressAndName[1][i]);
		users[name]={};
		users[name].address=address;
		users[name].name=name;
		i++
	}

	let keyName = listAddressAndName[1];
  	for (i=0; i<keyName.length; i++){
    	keyName[i]=web3.utils.toAscii(keyName[i]);
	}
	keyName.sort();

	//on retourne l'affichage du dropdown
	dropdownListFrom(users, keyName);
	dropdownListTo(users, keyName);
};
  
getUsersFrom();

//Fonction admin permettant de transferer des tokens depuis le compte de n'importe quel utilisateur
const transferFromTo = async() => {

	//Récupération des différents inputs
	let addressFrom = document.getElementById("from-select").value;
	let addressTo = document.getElementById("to-select").value;
	let amount = document.getElementById("amount").value;
	amount = amount*Math.pow(10,18);
	let message = document.getElementById("wording").value;
	message = web3.utils.fromAscii(message);

	//fonction de transfert de token (formulation différente mais un peu plus rigoureuse que dans index.js)
	const transferEvent = async (_address1, _address2, amount, _message) =>{
		return new Promise(function(resolve, reject){
			TokenABI.methods.transferFrom(_address1, _address2, amount, _message).send( {from : await getCurAddress()}, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};

	let transferTransaction = await transferEvent(addressFrom, addressTo, amount, message);

	//reset des champs input
	var frm = document.getElementById("send");
	frm.reset();
	return false;
}
