
var eventSent = Token.Transfer()
var transactionSentList = []
eventSent.watch(function(error, result) {
 			if (!error) {
 				transactionSentList.push(result);
 				var curAccount = web3.eth.accounts[0];
 				if (curAccount.toLowerCase() === transactionSentList[transactionSentList.length-1].args.from.toLowerCase()) {
	 				sending=false;
	 				var elmt = document.getElementById("loading");
	 				elmt.innerHTML ="<br><div>Sent! </div><img src='images/checked.png'/>"
	 				window.setTimeout(function() {elmt.innerHTML =""},2000)
	 			}
 				console.log("");
 			}
 		})

/*
var select = document.getElementById("dest-select")

for (var key in users){
	if (users.hasOwnProperty(key) && key !== "admin") {
		var opt = document.createElement('option');
	    opt.value = users[key].adress;
	    opt.innerHTML = users[key].name;
	    select.appendChild(opt);
	}
}
*/
/*
function createHistory() {
	var curAccount = web3.eth.accounts[0]
	if (transactionSentList !== undefined) {
		var name
		var history = document.getElementById("history")
		history.innerHTML = ""
		transactionSentList.forEach(function(transactionSent) {
			if (curAccount.toLowerCase() === transactionSent.args.from.toLowerCase()) {
				for (var key in users) {
					if (users[key].adress.toLowerCase() === transactionSent.args.to.toLowerCase()) {
						name = users[key].name
					}
				}
				for (var key in charity) {
					if (charity[key].adress.toLowerCase() === transactionSent.args.to.toLowerCase()) {
						name = charity[key].name
					}
				}
				var posList = document.createElement("ul")
				posList.id = "sending"
				var notif = document.createElement("li")
				notif.innerHTML = "You sent <strong>" + (parseInt(transactionSent.args.value*Math.pow(10,-18))).toString() + " AST </strong> to <strong>" + name + "</strong>"
				posList.appendChild(notif)
				history.appendChild(posList)
			}
			if (curAccount.toLowerCase() === transactionSent.args.to.toLowerCase()) { 
				for (var key in users) {
					if (users[key].adress.toLowerCase() === transactionSent.args.from.toLowerCase()) {
						name = users[key].name
					}
				}
				if (transactionSent.args.from.toLowerCase() === ("0xe8311b299bad9432d714c6dba0150d89cb3aff36").toLowerCase()) {
					name = "Aurexia Central Bank"
				}
				var negList = document.createElement("ul")
				negList.id = "receiving"
				var notif = document.createElement("li")
				notif.innerHTML = "You received <strong>" + (parseInt(transactionSent.args.value*Math.pow(10,-18))).toString() + " AST </strong> from <strong>" + name + "</strong>"
				negList.appendChild(notif)
				history.appendChild(negList)
			}
		})
	}	
}
*/

function getListMax(list) {
	// returns list of index(es) of maximum (maxima if equal)
	var indexMax = []
	while (list.indexOf(Math.max.apply(null,list),indexMax[indexMax.length-1]+1) !== -1) {
		indexMax.push(list.indexOf(Math.max.apply(null,list),indexMax[indexMax.length-1]+1))
	}
	return indexMax	
}

function makeGraph() {
	var elmt = document.getElementById("rankPage")
	if (elmt!==undefined) {
	    x = ["Dominique","Eric","David","Charles"]
		y = [users.dominique.balance,users.eric.balance,users.david.balance,users.charles.balance]
		data = [
		  {
		    y: y,
		    x: x,
		    type: "bar",
		  }
		]
		Plotly.newPlot('rankPage', data, {displayModeBar: false})
	}
	var leader = document.getElementById("leader")
	var leaders = getListMax(y)
	leader.innerHTML = "Current Leader : "
	if (leaders.length > 1) {leader.innerHTML = "Current Leaders : "}
	leaders.forEach(function(ind) {
		leader.innerHTML = leader.innerHTML + "<img src='" + users[(x[ind]).toLowerCase()].pic + "'/>"
	})
}




var Balance
var thisBalance

function myBalance() {
	var curAccount = web3.eth.accounts[0]
	Token.balanceOf(curAccount, function(err,result) {
		if (!err) {thisBalance = parseInt(result*Math.pow(10,-18)) ; console.log("")}
	})
}


function getBalance(account) {
	Balance=0
	Token.balanceOf(account, function(err,result) {
		if (!err) {Balance=result*Math.pow(10,-18); console.log("")}
	})
}


//Illustration ici du problème de javascript : ne support qu'un seul thread en meme temps. 
//Pour "attendre" dans une boucle, il faut imbriquer les fonctions. 
//Il faut souvent attendre car la console va plus vite que l'exécution d'une fonction sur ethereum

function attributeBalances() {
	var i = 1
	Balance=0
	function balances() {
		keys = Object.keys(users)
		var user = users[keys[i]]
		getBalance(user.adress)
		setTimeout( function () {
			user['balance']=Balance
			i++
			if (i < keys.length) {balances()}
		},600)
	}
	balances()
}

/*
function sendToken(adress,amount) {
	Token.transfer(adress,amount*Math.pow(10,18),function(err,result) {console.log("")})
}

function Transfer() {
	sending=true
	sendToken(document.getElementById("dest-select").value,document.getElementById("amount").value)
	var frm = document.getElementById("send");
	frm.reset();
	return false
}
*/

function loading() {
	var elmt = document.getElementById("loading")
	if (sending) {
		elmt.innerHTML = "<br><div>Sending tokens </div><img src='images/Spinner-1s-40px.gif'/>"
	}
}

function createPage() {
	loading()
	myBalance()
		if (document.getElementById("astValue") !== undefined) {
		document.getElementById("astValue").innerHTML = thisBalance.toString() + " AST"	
	}
	attributeBalances()
	window.setTimeout(function() {makeGraph()},3000)
	createHistory()
}

window.setInterval(function() {
	createPage()
}, 4000)