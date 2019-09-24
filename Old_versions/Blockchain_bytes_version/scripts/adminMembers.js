const addMember = async () => {
	// Called when clicking on Add button
	var _address = document.getElementById("adress1").value;
	var _name = document.getElementById("name1").value;
	_name = web3.fromAscii(_name);
	var _grade = document.getElementById ("grade1").value;

	const addM = async (address,name,grade) =>{                         
		return new Promise(function(resolve, reject){
			Token.addToAurexiaMembers(address,name,grade,(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	let assigment = await addM(_address,_name,_grade)
	var frm = document.getElementById("addMember");
	frm.reset();
	console.log(assigment)
	return false;
}

function remMember() {
	// Called when clicking on remove button
	var address = document.getElementById("adress2").value
	Token.remAurexiaMembers(address,function(err,result) {console.log("")})
	var frm = document.getElementById("remMember");
	frm.reset();
	return false
}
