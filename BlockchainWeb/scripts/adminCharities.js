const addCharity = async () => {

	// On récupere les valeurs des champs
	var _address = document.getElementById("adress1").value;
	var _name = document.getElementById("name1").value;
	_name = web3.utils.fromAscii(_name);
	
	//Fonction pour ajouter une association (on appelle une fonction du smart contract)
	const addC = async (address, name) =>{                         
		return new Promise(function(resolve, reject){     // utilisation de promesse pour le await
			TokenABI.methods.addAssociation(address,name).send({from : await getCurAddress()}, (err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	//On assigne les valeurs. Await permet d'attendre la résolution d'une promesse: dans notre cas les fonctions asynchrone getCurAddress et addC. 
	let assigment = await addC(_address,_name);

	//mise a 0 des champes d'input
	var frm = document.getElementById("addCharity");
	frm.reset();
	return false;
}

const remCharity = async () => {
	// Called when clicking on remove button
	var _address = document.getElementById("adress2").value

	//Fonction pour retirer une association (on appelle une fonction du smart contract)
	const remC = async (address) =>{                         
		return new Promise(function(resolve, reject){		 // utilisation de promesse pour le await
			TokenABI.methods.remAssociation(address).send({from : await getCurAddress()}, (err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	//On assigne les valeurs. Await permet d'attendre la résolution d'une promesse: dans notre cas les fonctions asynchrone getCurAddress et addC.
	let assigment = await remC(_address);

	//mise a 0 des champes d'input
	var frm = document.getElementById("remCharity");
	frm.reset();
	console.log(assigment)
	return false;
}



////////////////////////////////////////////////////////
//       ouverture/fermeture des donations            //
////////////////////////////////////////////////////////


const openDonation = async () => {

	//On ouvre les donations aux utilisateurs (fonction du smartcontract). Au niveau du smart contract c'est un booléan qui passe en true et qui active les fonctions transfertToAssociation
	const open = async () =>{                         
		return new Promise(function(resolve, reject){
			TokenABI.methods.launchDonation().send({from : await getCurAddress()}, (err, res) => {
				if (err) return reject(err);
				resolve(res);
			})
	  	})
	};

	//appelle des fonctions d'intéraction au smart contract
	let result = await open ();
	console.log(result)
	return false;
}


const closeDonation = async () => {     //Meme principe que ci dessus 

	const close = async () =>{                         
		return new Promise(function(resolve, reject){
			TokenABI.methods.closeDonation().send({from : await getCurAddress()}, (err,reslt) => {
				if (err) return reject(err);
				resolve(reslt);
			})
	  	})
	};

	let result = await close ();
	console.log(result)
	return false;
}


////////////////////////////////////////////////////////
//     Creation de la table listant les charity         //
////////////////////////////////////////////////////////


//fonction permettant la création d'un tableau dynamique en html/CSS
const getCharityTable = (_charity) => {
	//ciblage de la balise html du tableau
	var table = document.getElementById("content")
	var i = 1

	for (var key in _charity){
		
		//création de la nouvelle ligne
		var row = document.createElement('tr');
		row.class = "row" + i.toString() + " body";
		table.appendChild(row);

		//Remplissage des colonnes de la nouvelle ligne avec les valeurs
		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _charity[key].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = _charity[key].address;
		row.appendChild(column3);

		var column4 = document.createElement('td');
		column4.className = "column4";
		column4.innerHTML = Math.round(_charity[key].balance * Math.pow(10,-18));
		row.appendChild(column4)

		i++
	}
}

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

const getCharityList = async () =>{

	let charity = {}; //objet js permettant de stocker les charity avec toutes leurs caractéristiques 
	let listAddress;
	let name;
	let i = 0;
  

//Création de 4 fonctions intéragissant avec le Smart contract pour récupérer la liste des Charity's address, la taille de la liste, leur nom, leur balance
	const getCharity = async () =>{                        
		return new Promise(function(resolve, reject){
			TokenABI.methods.getCharityAndNameAndBalance().call((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	listAddress = await getCharity();
	let taille = listAddress[0].length;

	//Création d'un objet js des charities (key=name, caracteristique=name, address, balance) afin de les stocker coté utilisateur et les afficher dans le tableau html
	while (i < taille) {
		var address = listAddress[0][i];
		name = web3.toAscii(listAddress[1][i]);
		var balance = listAddress[2][i];

		//création d'un item de l'objet js
		charity[name]={};
		charity[name].address=address;
		charity[name].name=name;
		charity[name].balance=balance;
		console.log("charity balance");
		console.log(charity[name].balance);
		i++
	}

	getCharityTable(charity);
	dropdownListCharity(charity);
	return false;
};

getCharityList();
