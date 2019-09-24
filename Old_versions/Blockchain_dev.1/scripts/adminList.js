
////////////////////////////////////////////////////////
//     Creation de la table listant les users         //
////////////////////////////////////////////////////////

const getUserTable = (_users, _taille) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content");
	var i = 1;

	for (var k=0; k<_taille; k++){

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + i.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
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

	let users = {}; //objet stockant tous les users coté utilisateur (frontend)
	let listAddressNameBalance;
	let name;
	let i = 0;
  
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
	
	//Récupération des listes
	listAddressNameBalance = await getMembersNameBalance();
	let taille = await getTaille();

	//Remplissage de l'objet js users afin de l'afficher dans le tableau html plus tard 
	while (i < taille) {
		var address = listAddressNameBalance[0][i];
		name = web3.toAscii(listAddressNameBalance[1][i]);
		balance = (listAddressNameBalance[2][i])*Math.pow(10,-18);
		users[i]={};
		users[i].address=address;
		users[i].name=name;
		users[i].balance=balance;
		i++;
	}

	//Triage des utilisateurs en fonction de leur balance. Tri bulle décroissant 
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

	//On retourne la fonction pour afficher la table html
	return getUserTable(users, taille)
};

getUsersList();
