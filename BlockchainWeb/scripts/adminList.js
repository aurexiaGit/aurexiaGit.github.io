document.getElementById("table2").style.display = "none";
document.getElementById("table3").style.display = "none";
document.getElementById("table4").style.display = "none";

const chooseList = () =>{
	let type = document.getElementById("dest-select-list").value;
	if (type == "balance"){
		document.getElementById("table1").style.display = "block";
		document.getElementById("table2").style.display = "none";
		document.getElementById("table3").style.display = "none";
		document.getElementById("table4").style.display = "none";
	}
	if (type == "transaction"){
		document.getElementById("table2").style.display = "block";
		document.getElementById("table1").style.display = "none";
		document.getElementById("table3").style.display = "none";
		document.getElementById("table4").style.display = "none";
	}
	if (type == "send"){
		document.getElementById("table3").style.display = "block";
		document.getElementById("table2").style.display = "none";
		document.getElementById("table1").style.display = "none";
		document.getElementById("table4").style.display = "none";
	}
	if (type == "receive"){
		document.getElementById("table4").style.display = "block";
		document.getElementById("table2").style.display = "none";
		document.getElementById("table3").style.display = "none";
		document.getElementById("table1").style.display = "none";
	}
	return false;
}


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

const getTransactionList = (_usersTop, _taille) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content2");
	var i = 0;

	for (var key=0; key<_taille; key++){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = number;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _usersTop[key].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = Math.round(_usersTop[key].nbrTransaction);
		row.appendChild(column3);

		i++;
		
	}
}

const getSendList = (_usersTop, _taille) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content3");
	var i = 0;

	for (var key=0; key<_taille; key++){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = number;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _usersTop[key].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = Math.round(_usersTop[key].send);
		row.appendChild(column3);

		i++;
		
	}
}

const getReceiveList = (_usersTop, _taille) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content4");
	var i = 0;

	for (var key=0; key<_taille; key++){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = number;
		row.appendChild(column1);

		var column2 = document.createElement('td');
		column2.className = "column2";
		column2.innerHTML = _usersTop[key].name;
		row.appendChild(column2);

		var column3 = document.createElement('td');
		column3.className = "column3";
		column3.innerHTML = Math.round(_usersTop[key].receive);
		row.appendChild(column3);

		i++;
		
	}
}

//////////////////////////////////////////////////////////////////////////////////
//                     Récupération des valeurs                                 //
//////////////////////////////////////////////////////////////////////////////////


const getUsersList = async () =>{

	let users = {}; //objet stockant tous les users coté utilisateur (frontend)
	let listAddressNameBalance;
	let name;
	let p = 0;
	
	//Récupération des listes
	listAddressNameBalance = await getMembersNameBalance();
	let taille = await getTaille();

	//Remplissage de l'objet js users afin de l'afficher dans le tableau html plus tard 
	while (p < taille) {
		var address = listAddressNameBalance[0][p];
		name = web3.utils.toAscii(listAddressNameBalance[1][p]);
		var balance = (listAddressNameBalance[2][p])*Math.pow(10,-18);
		users[p]={};
		users[p].address=address;
		users[p].name=name;
		users[p].balance=balance;
		p++;
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
	getUserTable(users, taille)

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	//                                Stats all transactions                                              //
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	const getTransactions = async () =>{                        
		return new Promise(function(resolve, reject){
			TokenABI.methods.getAllInfoTransaction().call((err, members) => {
			if (err) return reject(err);
			resolve(members);
	  	})
	})}

	let resultAll = await getTransactions();

	let nbrTransactionPerso = {};
	for (i=0; i<taille; i++){
		nbrTransactionPerso[i]= {};
		nbrTransactionPerso[i].nbrTransaction = resultAll[1][i];
		nbrTransactionPerso[i].send = resultAll[3][i]*Math.pow(10,-18);
		nbrTransactionPerso[i].receive = resultAll[2][i]*Math.pow(10,-18);
		nbrTransactionPerso[i].name = web3.utils.toAscii(resultAll[5][i]);
	}


	//tri pour le top transaction
	for (var i = taille-1; i > 0 ; i--){
		for (j = 0; j < i; j++){
			if (nbrTransactionPerso[j].nbrTransaction < nbrTransactionPerso[j+1].nbrTransaction){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}

	getTransactionList(nbrTransactionPerso, taille);

	for (i = taille-1; i > 0 ; i--){
		for (j = 0; j < i; j++){
			if (nbrTransactionPerso[j].send < nbrTransactionPerso[j+1].send){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}

	getSendList(nbrTransactionPerso, taille);

	for (i = taille-1; i > 0 ; i--){
		for (j = 0; j < i; j++){
			if (nbrTransactionPerso[j].receive < nbrTransactionPerso[j+1].receive){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}

	getReceiveList(nbrTransactionPerso, taille);

};

getUsersList();