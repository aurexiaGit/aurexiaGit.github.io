
var select = document.getElementById("dest-select")

for (var key in users){
	if (users.hasOwnProperty(key) && key !== "admin") {
		var opt = document.createElement('option');
	    opt.value = users[key].adress;
	    opt.innerHTML = users[key].name;
	    select.appendChild(opt);
	}
}

var select = document.getElementById("from-select")

for (var key in users){
	if (users.hasOwnProperty(key) && key !== "admin") {
		var opt = document.createElement('option');
	    opt.value = users[key].adress;
	    opt.innerHTML = users[key].name;
	    select.appendChild(opt);
	}
}


function sendToken(adressFrom,adressTo,amount) {
	Token.transferFrom(adressFrom,adressTo,amount*Math.pow(10,18),function(err,result) {console.log("")})
}

function Transfer() {
	sendToken(document.getElementById("from-select").value,document.getElementById("dest-select").value,document.getElementById("amount").value)
	var frm = document.getElementById("send");
	frm.reset();
	return false
}
