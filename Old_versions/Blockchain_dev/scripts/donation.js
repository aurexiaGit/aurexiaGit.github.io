//fonction créant le dropdown en prenant en entrée un objet js contenant les charities
const dropdownListCharity = (_charity) => {
	//ciblage de la borne html
	var select = document.getElementById("dest-select1");
	//creation de la dropdown
	for (var key in _charity){
		if (_charity.hasOwnProperty(key)) {
		var opt = document.createElement('option');
		opt.value = _charity[key].address.toLowerCase();
		opt.innerHTML = _charity[key].name;
		select.appendChild(opt);
		}
	}
}
	
//fonction récupérant les charities 
const getCharity = async () =>{
  
	let charity = {}; //objet js de stockage
	let listCharity;
	let name;
	var i = 0;
	
	//fonctions intéragissant avec le smart contract, récuparant la liste des adresses des charities ainsi que leur nom et la taille de la liste
	const getCharity = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getCharityAndNameAndBalance((err, charities) => {
				if (err) return reject(err);
				resolve(charities);
			})
	})}

	const isOpen = async () =>{
		return new Promise(function(resolve, reject){
			Token.isDonationOpen((err, result) =>{
				if(err) return reject(err);
				resolve(result);
			})
		})
	}

	let donationOpen = await isOpen();
	console.log(donationOpen);
	if (donationOpen == true){
		let open = document.getElementById("opening");
		open.innerHTML="<div id='opening'>Donation Status: <span class='greenText'>Open</span></div>"
	}
	
	//remplissage de l'objet js
	listCharity = await getCharity();
	let taille = listCharity[0].length;
	while (i < taille) {
		var address = listCharity[0][i];
		name = web3.toAscii(listCharity[1][i])
		charity[name]={}
		charity[name].address=address.toLowerCase();
		charity[name].name=name
		i++
	}
	
	// call de la fonction d'affichage du dropdown avec l'objet crée en paramètre
	return dropdownListCharity(charity);
};
  
getCharity();


//fonction intéragissant avec le SC lorsqu'on appuie sur transfert. Elle active la fonction transferToAssociation du SC qui transfert tous les tokens de l'utilisateurs à l'association
const transferCharity = async() => {
	let amount = document.getElementById("amount").value
	let address = document.getElementById("dest-select1").value
	amount = amount*Math.pow(10,18);
	
	const transferEvent = async (_address, _amount) =>{
		return new Promise(function(resolve, reject){
			Token.transferToAssociation(_address, _amount, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};
	
	transferTransaction = await transferEvent(address, amount);
	var frm = document.getElementById("donate");
	frm.reset();
	return transferTransaction
}