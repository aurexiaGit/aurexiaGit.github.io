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

////////////////////////////////////////////////////////
//     Creation de la table listant les charity         //
////////////////////////////////////////////////////////


//fonction permettant la création d'un tableau dynamique en html/CSS
const getCharityTable = (_charity) => {
	//ciblage de la balise html du tableau
	var table = document.getElementById("content-donation")
	var i = 1

	console.log(_charity);
	for (var key in _charity){
		
		//création de la nouvelle ligne
		var row = document.createElement('tr');
		row.class = "row" + i.toString() + " body";
		table.appendChild(row);

		//Remplissage des colonnes de la nouvelle ligne avec les valeurs
		var column4 = document.createElement('td');
		column4.contentEditable = "true";
		column4.innerHTML = 0;
		row.appendChild(column4)

		var column2 = document.createElement('td');
		column2.innerHTML = _charity[key].name;
		row.appendChild(column2);

		console.log('is col editable : ' + column4.contentEditable)
		i++
	}
}

//fonctions intéragissant avec le smart contract, récuparant la liste des adresses des charities ainsi que leur nom et la taille de la liste
const getCharities = async () =>{                        
	return new Promise(function(resolve, reject){
		Token.getCharityAndNameAndBalance((err, charities) => {
			if (err) return reject(err);
			resolve(charities);
		})
})}

//fonction mettant en forme les charities
const formatCharities = async() =>{
	let charity = {}; //objet js de stockage

	//remplissage de l'objet js
	let listCharity = await getCharities();
	let taille = listCharity[0].length;
	for (let i = 0; i < taille; i++) {
		var address = listCharity[0][i];
		let name = web3.toAscii(listCharity[1][i])
		charity[name]={}
		charity[name].address=address.toLowerCase();
		charity[name].name=name
	}
	return charity;
}

//fonction récupérant les charities 
const getCharity = async () =>{

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
	
	let charity = await formatCharities();
	// call de la fonction d'affichage du dropdown avec l'objet crée en paramètre
	return getCharityTable(charity);
};
  
getCharity();

//fonction intéragissant avec le SC lorsqu'on appuie sur transfert. Elle active la fonction transferToAssociation du SC qui transfert tous les tokens de l'utilisateurs à l'association
const transferCharity = async() => {
	/*let amount = document.getElementById("amount").value
	let address = document.getElementById("dest-select1").value
	amount = amount*Math.pow(10,18);*/
	
	const transferEvent = async (_address, _amount) =>{
		return new Promise(function(resolve, reject){
			Token.transferToAssociation(_address, _amount, (err, result) => {
				if (err) return reject (err);
				resolve(result);
			})
		})
	};
	let charities = await formatCharities();
	var table = document.getElementById("content-donation").rows;

	for (let row in table){
		let cells = row.cells
		let amount = cells[0].innerHTML
		if ( amount != 0){
			name = cells[1].innerHTML
			console.log("Send " + amount + " AST to " + name + " at address : " + charities[name].address);
		}
	}

	//let transferTransaction = await transferEvent(address, amount);
	//return transferTransaction
}