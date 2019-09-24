/***************************************************************** */
/*                     Creation de token                           */
/***************************************************************** */ 

const createTokens = async () => {
	// Creates tokens on an account
	var amount = document.getElementById("amount1").value
	amount = amount * Math.pow(10,18);
	var address = document.getElementById("dest-select-crea").value

	//fonction qui interagit avec le SC pour créer de nouveaux tokens.
	const create = async (_address, _amount) =>{
		return new Promise(function(resolve, reject){
		Token.mint(_address,_amount, (err,result) => {
			if (err) return reject (err);
			resolve (result)
		})
	})}

	//on retourne la fonction interagissant avec le SC
	let creation = await create(address, amount);

	//reset des champs
	var frm = document.getElementById("addMember");
	frm.reset();
	return false;
}


/***************************************************************** */
/*                     Suppression de token                        */
/***************************************************************** */

const destroyTokens = async () => {
	var amount = document.getElementById("amount2").value
	amount = amount * Math.pow(10,18);
	var address = document.getElementById("dest-select-rem").value

	//fonction qui interagit avec le SC pour détruire de nouveaux tokens. 
	const destroy = async (_address, _amount) =>{
		return new Promise(function(resolve, reject){
		Token.burn(_address,_amount, (err,result) => {
			if (err) return reject(err);
			resolve (result);
		})
	})}
	
	//on retourne la fonction intéragissant avec le SC
	let destroyed = await destroy(address, amount);

	//reset des champs
	var frm = document.getElementById("supMember");
	frm.reset();

	return false;
}

/***************************************************************** */
/*                            Dropdown                             */
/***************************************************************** */


const dropdownListCreaRem = (_users, _keyName) => {  //on récupère l'addresse de l'utilisateur et l'objet javascript qui stockent les utilisateurs

	var select = document.getElementById("dest-select-crea");
	for (let i=0; i<_keyName.length; i++){
		key = _keyName[i];
			if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address !== "0x0000000000000000000000000000000000000000") {
			var opt = document.createElement('option');
			opt.value = _users[key].address.toLowerCase();
			opt.innerHTML = _users[key].name;
			select.appendChild(opt);
		}
	}
	var select1 = document.getElementById("dest-select-rem");
  	for (let i=0; i<_keyName.length; i++){
		key = _keyName[i];
			if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address !== "0x0000000000000000000000000000000000000000") {
			var opt = document.createElement('option');
			opt.value = _users[key].address.toLowerCase();
			opt.innerHTML = _users[key].name;
			select1.appendChild(opt);
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

	let keyName = listAddressAndName[1];
  	for (let i=0; i<keyName.length; i++){
    keyName[i]=web3.toAscii(keyName[i]);
	}
	keyName.sort();
	console.log("keyName");
	console.log(keyName);

	//on retourne l'affichage du dropdown
	return dropdownListCreaRem(users, keyName);
};
  
getUsersFrom();