////////////////////////////////////////////////////////
//     Creation de la table ranking                   //
////////////////////////////////////////////////////////

const getRankingTable = (_usersTop) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content");
	var i = 0;

	for (key in _usersTop){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = _usersTop[key].classement;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _usersTop[key].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = Math.round(_usersTop[key].balance);
		row.appendChild(column3);

		i++;
		
	}
}

//récupération des utilisateurs (addresse nom balance pour la ranking table)
const getRankingList = async () =>{

	var users = {}; //objet stockant tous les users coté utilisateur (frontend)
	var listAddressNameBalance;
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

	//fonction interagissant avec le smartcontract pour renvoyer une liste contenant la liste de tous les utilisateurs, leur nom et leur balance
	const getMembersNameBalance = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembersAndNameAndBalance((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  		})
		})
	};

	//fonction interagissant avec le SC et renvoyant la taille de la liste précédente
	const getTaille = async () =>{
		return new Promise(function(resolve, reject){
		  Token.sizeListAccount((err, result) => {
			if (err) return reject(err);
			resolve(result);
		})
	  })}

	//Récupération des listes + adresse de l'utilisateur
	listAddressNameBalance = await getMembersNameBalance();
	curAddress = await getCurAddress();
	var taille = await getTaille();

	//On retire l'administrator de la liste des utilisateurs car ce n'est pas vraiment un utilisateur mais la banque
	listAddressNameBalance[0].splice(0,1);       
	listAddressNameBalance[1].splice(0,1);
	listAddressNameBalance[2].splice(0,1);
	taille = taille - 1;

	//remplissage de l'objet user
	while (i < taille) {
		var address = listAddressNameBalance[0][i];
		name = web3.toAscii(listAddressNameBalance[1][i]);
		balance = (listAddressNameBalance[2][i])*Math.pow(10,-18);
		users[i]={};
		users[i].address=address;
		users[i].name=name;
		users[i].balance=balance;
		i++
	}

	//Création de usersTop qui contiendra le top3 des utilisateurs ayant le plus de token
	var usersTop = {};

	//Création de users Perso qui est un objet contenant les info de l'utilisateur dont son classement. On l'initialise pour avoir une valeur par défaut (notamment pour tester la page coté admin)
	var usersPerso = {
					Perso:{
						name: "err",
						address: "err",
						balance: "err",
						classement: "err"
					}
				};


	//tri bulle décroissant des utilisateurs afin d'avoir le top3 utilisateurs dans les 3 premiers slot de l'objet (la key de cette objet est 0,1,2, ... , n)
	for (var i = taille-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (users[j].balance < users[j+1].balance){
				users["tempo"] = users[j];
				users[j] = users[j+1];
				users[j+1] = users["tempo"];
			}
		}
	}
	
	// Assignation du top3. On crée un condition if si le nombre d'utilisateur est < 3 car dans ce cas ranking devra afficher l'entiereté de user (soit 1 ou 2 ou 3 personnes)
	if (taille <= 3){
		for (var i=0; i<taille; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i + 1;
		}
	}
	else{
		for (var i=0; i<3; i++){
			usersTop[i] = {};
			usersTop[i].name = users[i].name;
			usersTop[i].address = users[i].address;
			usersTop[i].balance = users[i].balance;
			usersTop[i].classement = i+1;
		}
	}

	//Assignation de users perso avec son classement
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