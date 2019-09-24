const addMember = async () => {
	// Called when clicking on Add button
	var _address = document.getElementById("adress1").value;
	var _name = document.getElementById("name1").value;
	_name = web3.fromAscii(_name); //car le smart contract stocke les noms en bytes 
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
	return false;
}

const remMember = async () => {
	// Called when clicking on remove button
	var _address = document.getElementById("adress2").value;

	const remM = async (address) =>{                      
		return new Promise(function(resolve, reject){
			Token.remAurexiaMembers(address,(err,result) => {
				if (err) return reject(err);
				resolve(result);
			})
	  	})
	};
	let assigment = await remM(_address)
	var frm = document.getElementById("remMember");
	frm.reset();
	return false;
}


$(document).ready(function(){
	$('#header').load('../header-ads.html');
    $('#footer').load('../footer-ads.html');
	$('#submit-file').on("click",function(e){
		e.preventDefault();
		$('#files').parse({
			config: {
				delimiter: "",	// auto-detect
				newline: "",	// auto-detect
				header: true,
				complete: CSVaccept,
			},
			before: function(file, inputElem)
			{
				console.log("Parsing file...", file);
			},
			error: function(err, file)
			{
				console.log("ERROR:", err, file);
			},
			complete: function()
			{
				console.log("Done with all files");
			}
		});
	});

	function CSVaccept (results) {
		let object = results.data;
		let taille = object.length;
		console.log("taille");
		console.log(taille);
		let nameList = [];
		let addressList = [];
		let gradeList = [];
		for (let i=0; i<taille; i++){
			nameList[i] = web3.fromAscii(object[i]["Name"]);
			console.log(object[i]["Name"])
			addressList[i] = object[i]["Address"];
			console.log(object[i]["Address"])
			gradeList[i] = object[i]["Grade"];
			console.log(object[i]["Grade"])
		}
		console.log("taille list");
		console.log(nameList.length);
		console.log(addressList.length)
		console.log(gradeList.length)
		console.log("nameList");
		console.log(nameList);
		console.log("addressList");
		console.log(addressList);
		console.log("gradeList");
		console.log(gradeList);
		Token.authorizeManyMembers(addressList, nameList, gradeList, taille, (err, result) =>{
			console.log('done');
		})
	}
});