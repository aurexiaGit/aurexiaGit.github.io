const addCharity = async () => {

	// On récupere les valeurs des champs
	var _address = document.getElementById("adress1").value;
	var _name = document.getElementById("name1").value;
	_name = web3.fromAscii(_name);

	// fonction de recuperation l'adresse de l'utilisateur
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};
	
	//Fonction pour ajouter une association (on appelle une fonction du smart contract)
	const addC = async (address, name, curAddress) =>{                         
		return new Promise(function(resolve, reject){     // utilisation de promesse pour le await
			Token.addAssociation.sendTransaction(address,name,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	//On assigne les valeurs. Await permet d'attendre la résolution d'une promesse: dans notre cas les fonctions asynchrone getCurAddress et addC. 
	let _curAddress = await getCurAddress();
	let assigment = await addC(_address,_name, _curAddress);

	//mise a 0 des champes d'input
	var frm = document.getElementById("addCharity");
	frm.reset();
	return false;
}

const remCharity = async () => {
	// Called when clicking on remove button
	var _address = document.getElementById("adress2").value

	// fonction de recuperation l'adresse de l'utilisateur
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
  	})};

	//Fonction pour retirer une association (on appelle une fonction du smart contract)
	const remC = async (address, curAddress) =>{                         
		return new Promise(function(resolve, reject){		 // utilisation de promesse pour le await
			Token.remAssociation.sendTransaction(address,{from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	//On assigne les valeurs. Await permet d'attendre la résolution d'une promesse: dans notre cas les fonctions asynchrone getCurAddress et addC.
	let _curAddress = await getCurAddress();
	let assigment = await remC(_address, _curAddress);

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

	// fonction de recuperation l'adresse de l'utilisateur
	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
	})};

	//On ouvre les donations aux utilisateurs (fonction du smartcontract). Au niveau du smart contract c'est un booléan qui passe en true et qui active les fonctions transfertToAssociation
	const open = async (curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.launchDonation.sendTransaction({from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	//appelle des fonctions d'intéraction au smart contract
	let curAddress = await getCurAddress();
	let result = await open (curAddress);
	console.log(result)
	return result;
}


const closeDonation = async () => {     //Meme principe que ci dessus 

	const getCurAddress = async () =>{                         
		return new Promise(function(resolve, reject){
		web3.eth.getAccounts((err, accounts) => {
			if (err) return reject(err);
			let result = accounts[0].toLowerCase();
			resolve(result);
		})
		})};

	const close = async (curAddress) =>{                         
		return new Promise(function(resolve, reject){
			Token.closeDonation.sendTransaction({from:curAddress},(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};

	let curAddress = await getCurAddress();
	let result = await close (curAddress);
	console.log(result)
	return result;
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
		column4.innerHTML = Math.round(_charity[key].balance);
		row.appendChild(column4)

		i++
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
			Token.getCharityAddress((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	const getName = async (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getAssoName(address, (err, res) => {
				if (err) return reject(err);
				let name = web3.toAscii(res);     //les noms sont stockés sont forme de bytes dans le smart contract il faut donc les traduire en ascii
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
	}

	const getTaille = async () =>{
		return new Promise(function(resolve, reject){
		  Token.getCharitySize((err, result) => {
			if (err) return reject(err);
			console.log(result);
			resolve(result);
		})
	  })}

	
	listAddress = await getCharity();
	let taille = await getTaille();

	//Création d'un objet js des charities (key=name, caracteristique=name, address, balance) afin de les stocker coté utilisateur et les afficher dans le tableau html
	while (i < taille) {
		var address = listAddress[i];
		name = await getName(address);
		balance = await getBalance(address);

		//création d'un item de l'objet js
		charity[name]={};
		charity[name].address=address;
		charity[name].name=name;
		charity[name].balance=balance;
		console.log("charity balance");
		console.log(charity[name].balance);
		i++
	}

	return getCharityTable(charity)
};

getCharityList();
