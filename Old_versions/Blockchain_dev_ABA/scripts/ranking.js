document.getElementById("RankingTransaction").style.display = "none";
//ABA 26 06 2019 
//document.getElementById("transactionRecu").style.display = "none";
//document.getElementById("transactionSend").style.display = "none";
document.getElementById("table2").style.display = "none";

document.getElementById("RankingSend").style.display = "none";
//ABA 26 06 2019 
//document.getElementById("totalSend").style.display = "none";
document.getElementById("table3").style.display = "none";

document.getElementById("RankingReceive").style.display = "none";
//ABA 26 06 2019 
//document.getElementById("totalReceive").style.display = "none";
document.getElementById("table4").style.display = "none";



const chooseRanking = () =>{
	let type = document.getElementById("dest-select-ranking").value;
	if (type == "balance"){
		document.getElementById("ownRanking").style.display = "inline";
		document.getElementById("table1").style.display = "block";

		document.getElementById("RankingTransaction").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("transactionRecu").style.display = "none";
		//document.getElementById("transactionSend").style.display = "none";

		document.getElementById("table2").style.display = "none";

		document.getElementById("RankingSend").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalSend").style.display = "none";

		document.getElementById("table3").style.display = "none";

		document.getElementById("RankingReceive").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalReceive").style.display = "none";

		document.getElementById("table4").style.display = "none";
	}
	if (type == "transaction"){
		document.getElementById("ownRanking").style.display = "none";
		document.getElementById("table1").style.display = "none";

		document.getElementById("RankingTransaction").style.display = "inline";

		//ABA 26 06 2019 
		//document.getElementById("transactionRecu").style.display = "inline";
		//document.getElementById("transactionSend").style.display = "inline";

		document.getElementById("table2").style.display = "block";

		document.getElementById("RankingSend").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalSend").style.display = "none";

		document.getElementById("table3").style.display = "none";

		document.getElementById("RankingReceive").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalReceive").style.display = "none";

		document.getElementById("table4").style.display = "none";
	}
	if (type == "send"){
		document.getElementById("ownRanking").style.display = "none";
		document.getElementById("table1").style.display = "none";

		document.getElementById("RankingTransaction").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("transactionRecu").style.display = "inline";
		//document.getElementById("transactionSend").style.display = "inline";

		document.getElementById("table2").style.display = "none";

		document.getElementById("RankingSend").style.display = "inline";

		//ABA 26 06 2019 
		//document.getElementById("totalSend").style.display = "none";

		document.getElementById("table3").style.display = "block";

		document.getElementById("RankingReceive").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalReceive").style.display = "none";

		document.getElementById("table4").style.display = "none";
	}
	if (type == "receive"){
		document.getElementById("ownRanking").style.display = "none";
		document.getElementById("table1").style.display = "none";

		document.getElementById("RankingTransaction").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("transactionRecu").style.display = "none";
		//document.getElementById("transactionSend").style.display = "none";

		document.getElementById("table2").style.display = "none";

		document.getElementById("RankingSend").style.display = "none";

		//ABA 26 06 2019 
		//document.getElementById("totalSend").style.display = "none";

		document.getElementById("table3").style.display = "none";

		document.getElementById("RankingReceive").style.display = "inline";

		//ABA 26 06 2019 
		//document.getElementById("totalReceive").style.display = "inline";

		document.getElementById("table4").style.display = "block";
	}
	return false;
}


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
		column1.innerHTML = "#" + _usersTop[key].classement;
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

const getTransactionTable = (_usersTop) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content2");
	var i = 0;

	for (key in _usersTop){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = "#" + _usersTop[key].classement;
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

const getSendTable = (_usersTop) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content3");
	var i = 0;

	for (key in _usersTop){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = "#" + _usersTop[key].classement;
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

const getReceiveTable = (_usersTop) => {
	//ciblage de la borne html du tableau
	var table = document.getElementById("content4");
	var i = 0;

	for (key in _usersTop){

		var number = i + 1;

		//creation d'une nouvelle ligne
		var row = table.insertRow(-1);
		row.className = "row" + number.toString() + " body";

		//Ajout des valeurs pour chacune des colonnes de la nouvelle ligne
		var column1 = document.createElement('td');
		column1.className = "column1";
		column1.innerHTML = "#" + _usersTop[key].classement;
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

	const getName = async (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, res) => {
				if (err) return reject(err);
				let name = web3.toAscii(res);
				resolve(name);
			})
		})
	}

	//Récupération des listes + adresse de l'utilisateur
	listAddressNameBalance = await getMembersNameBalance();
	curAddress = await getCurAddress();
	let userName = await getName(curAddress);
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

	//on affiche le top3 dans le tableau
	getRankingTable(usersTop, usersPerso);

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
	rank.innerHTML="<div class='ownRankingTxt'>" + ownRank.toString() + ownRankEnd  + "</div>";
	

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	//                              Stats transactions Perso                                              //
	////////////////////////////////////////////////////////////////////////////////////////////////////////

	const getPersoTransactions = async (_address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getPersoInfoTransaction(_address, (err, members) => {
			if (err) return reject(err);
			resolve(members);
	  	})
	})}

	let result = await getPersoTransactions(curAddress);
	let nbrRecu = result[4];
	let totalTrans = result[0];
	let nbrEnvoie = result[3];
	let totalSend = Math.round(result[1]*Math.pow(10,-18));
	let totalReceive = Math.round(result[2]*Math.pow(10,-18));


	//ABA 26 06 2019 - No need to display the nb of transactions received and send
	//let recu = document.getElementById("transactionRecu");
	//recu.innerHTML="<p class='ownRankingTxt'>Number of receive transaction : " + nbrRecu.toString() + "</p>";
	//let send = document.getElementById("transactionSend");
	//ABA 26 06 2019 - No need to display the nb of transactions received and send
	//send.innerHTML="<p class='ownRankingTxt'>Number of send transaction : " + nbrEnvoie.toString() + "</p>";


	////////////////////////////////////////////////////////////////////////////////////////////////////////
	//                                Stats all transactions                                              //
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	

	const getTransactions = async () =>{                        
		return new Promise(function(resolve, reject){
			Token.getAllInfoTransaction((err, members) => {
			if (err) return reject(err);
			resolve(members);
	  	})
	})}

	//on retire les stats admins pour le ranking (mais on garde les stats)
	let resultAll = await getTransactions();
	
	resultAll[0].splice(0,1);       
	resultAll[1].splice(0,1);
	resultAll[2].splice(0,1);
	resultAll[3].splice(0,1);
	resultAll[4].splice(0,1);
	resultAll[5].splice(0,1);


	let nbrTransactionPerso = {};
	for (let i=0; i<taille; i++){
		nbrTransactionPerso[i]= {};
		nbrTransactionPerso[i].nbrTransaction = resultAll[1][i];
		nbrTransactionPerso[i].send = resultAll[3][i]*Math.pow(10,-18);
		nbrTransactionPerso[i].receive = resultAll[2][i]*Math.pow(10,-18);
		nbrTransactionPerso[i].name = web3.toAscii(resultAll[5][i]);
	}


	//tri pour le top transaction
	for (var i = taille-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (nbrTransactionPerso[j].nbrTransaction < nbrTransactionPerso[j+1].nbrTransaction){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}
	
	let topTransaction = {};
	
	if (taille <= 3){
		for (var i=0; i<taille; i++){
			topTransaction[i] = {};
			topTransaction[i].nbrTransaction = nbrTransactionPerso[i].nbrTransaction;
			topTransaction[i].name = nbrTransactionPerso[i].name;
			topTransaction[i].classement = i + 1;
		}
	}
	else{
		for (var i=0; i<3; i++){
			topTransaction[i] = {};
			topTransaction[i].nbrTransaction = nbrTransactionPerso[i].nbrTransaction;
			topTransaction[i].name = nbrTransactionPerso[i].name;
			topTransaction[i].classement = i + 1;
		}
	}

	getTransactionTable(topTransaction);



	//Ranking user du nbr transactions
	let rankingNbrTransaction = "err";
	for (let i=0; i<taille; i++){
		if (nbrTransactionPerso[i].name == userName){
			rankingNbrTransaction = i+1;
			break;
		}
	}

	//top pour le send transaction
	for (var i = taille-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (nbrTransactionPerso[j].send < nbrTransactionPerso[j+1].send){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}

	let topTransactionSend = {};
	
	if (taille <= 3){
		for (var i=0; i<taille; i++){
			topTransactionSend[i] = {};
			topTransactionSend[i].send = nbrTransactionPerso[i].send;
			topTransactionSend[i].name = nbrTransactionPerso[i].name;
			topTransactionSend[i].classement = i + 1;
		}
	}
	else{
		for (var i=0; i<3; i++){
			topTransactionSend[i] = {};
			topTransactionSend[i].send = nbrTransactionPerso[i].send;
			topTransactionSend[i].name = nbrTransactionPerso[i].name;
			topTransactionSend[i].classement = i + 1;
		}
	}

	getSendTable(topTransactionSend);

	//Ranking user du nbr transactions
	let rankingSendTransaction = "err";
	for (let i=0; i<taille; i++){
		if (nbrTransactionPerso[i].name == userName){
			rankingSendTransaction = i+1;
			break;
		}
	}

	//top ranking pour le receive transactions
	for (var i = taille-1; i > 0 ; i--){
		for (var j = 0; j < i; j++){
			if (nbrTransactionPerso[j].receive < nbrTransactionPerso[j+1].receive){
				nbrTransactionPerso["tempo"] = nbrTransactionPerso[j];
				nbrTransactionPerso[j] = nbrTransactionPerso[j+1];
				nbrTransactionPerso[j+1] = nbrTransactionPerso["tempo"];
			}
		}
	}
	
	let topTransactionReceive = {};
	
	if (taille <= 3){
		for (var i=0; i<taille; i++){
			topTransactionReceive[i] = {};
			topTransactionReceive[i].receive = nbrTransactionPerso[i].receive;
			topTransactionReceive[i].name = nbrTransactionPerso[i].name;
			topTransactionReceive[i].classement = i + 1;
		}
	}
	else{
		for (var i=0; i<3; i++){
			topTransactionReceive[i] = {};
			topTransactionReceive[i].receive = nbrTransactionPerso[i].receive;
			topTransactionReceive[i].name = nbrTransactionPerso[i].name;
			topTransactionReceive[i].classement = i + 1;
		}
	}


	// Retour de tous les rankings de transactions
	let rankingReceiveTransaction = "err";
	for (let i=0; i<taille; i++){
		if (nbrTransactionPerso[i].name == userName){
			rankingReceiveTransaction = i+1;
			break;
		}
	}

	getReceiveTable(topTransactionReceive);

	let TR = document.getElementById("RankingTransaction");
	//ABA 26 06 2019
	//TR.innerHTML="<p class='ownRankingTxt'>Transaction rank : "+ rankingNbrTransaction.toString() +" - You have done "+ totalTrans.toString() +" transactions</p>";
	if (rankingNbrTransaction == 1){
		TR.innerHTML="<div class='ownRankingTxt'>"+ rankingNbrTransaction.toString() +"st</div>";
	}
	else if (rankingNbrTransaction == 2){
		TR.innerHTML="<div class='ownRankingTxt'>"+ rankingNbrTransaction.toString() +"nd</div>";
	}
	else if (rankingNbrTransaction == 3){
		TR.innerHTML="<div class='ownRankingTxt'>"+ rankingNbrTransaction.toString() +"rd</div>";
	}
	else {
		TR.innerHTML="<div class='ownRankingTxt'>"+ rankingNbrTransaction.toString() +"th</div>";
	}

	//ABA 26 06 2019
	let SR = document.getElementById("RankingSend");
	if (rankingSendTransaction == 1){
		SR.innerHTML="<div class='ownRankingTxt'>"+ rankingSendTransaction.toString() +"st</div>";
	}
	else if (rankingSendTransaction == 2){
		SR.innerHTML="<div class='ownRankingTxt'>"+ rankingSendTransaction.toString() +"nd</div>";
	}
	else if (rankingSendTransaction == 3){
		SR.innerHTML="<div class='ownRankingTxt'>"+ rankingSendTransaction.toString() +"rd</div>";
	}
	else {
		SR.innerHTML="<div class='ownRankingTxt'>"+ rankingSendTransaction.toString() +"</div>";
	}

	let RR = document.getElementById("RankingReceive");
	if (rankingSendTransaction == 1){
		RR.innerHTML="<div class='ownRankingTxt'>"+ rankingReceiveTransaction.toString() +"st</div>";
	}
	else if (rankingSendTransaction == 2){
		RR.innerHTML="<div class='ownRankingTxt'>"+ rankingReceiveTransaction.toString() +"nd</div>";
	}
	else if (rankingSendTransaction == 3){
		RR.innerHTML="<div class='ownRankingTxt'>"+ rankingReceiveTransaction.toString() +"rd</div>";
	}
	else {
		RR.innerHTML="<div class='ownRankingTxt'>"+ rankingReceiveTransaction.toString() +"</div>";
	}
	
	//SR.innerHTML="<p class='ownRankingTxt'>You are currently ranked "+ rankingSendTransaction.toString() +"</p>";
	
	//ABA 26 06 2019
	//let TAS = document.getElementById("totalSend");
	//TAS.innerHTML="<p class='ownRankingTxt'>Total AST Send : "+ totalSend.toString() +"</p>";
	//let RR = document.getElementById("RankingReceive");
	//RR.innerHTML="<p class='ownRankingTxt'>Rank : "+ rankingReceiveTransaction.toString() +"</p>";
	//let TAR = document.getElementById("totalReceive");
	//TAR.innerHTML="<p class='ownRankingTxt'>Total AST Receive : "+ totalReceive.toString() +"</p>";


	
};

getRankingList();