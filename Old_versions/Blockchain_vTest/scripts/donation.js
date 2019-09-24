	//fonction créant le dropdown en prenant en entrée un objet js contenant les charities
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
	
	//fonction récupérant les charities 
  const getCharity = async () =>{
  
		let charity = {}; //objet js de stockage
	  let listCharity;
	  let name;
	  var i = 0;
	
		//fonctions intéragissant avec le smart contract, récuparant la liste des adresses des charities ainsi que leur nom et la taille de la liste
	  const getCharity = async () =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getCharityAddress((err, charities) => {
				  if (err) return reject(err);
				  resolve(charities);
			})
	  })}
  
	  const getName = async (address) =>{                        
		  return new Promise(function(resolve, reject){
			  Token.getAssoName(address, (err, res) => {
				  if (err) return reject(err);
				  let name = web3.toAscii(res);
					resolve(name);
		  })
	  })}	

	  const getTaille = async () =>{
		return new Promise(function(resolve, reject){
		  Token.sizeListCharity((err, result) => {
			if (err) return reject(err);
			resolve(result);
		})
	  })}
	
		//remplissage de l'objet js
	  listCharity = await getCharity();
	  let taille = await getTaille();
	  while (i < taille) {
		  var address = listCharity[i];
		  name = await getName(address);
		  charity[name]={}
		  charity[name].address=address.toLowerCase();
		  charity[name].name=name
		  i++
	}
	
// call de la fonction d'affichage du dropdown avec l'objet crée en paramètre
	return dropdownListCharity(charity);
  };
  
  getCharity();


	//fonction intéragissant avec le SC lorsqu'on appuie sur transfert. Elle active la fonction transferToAssociation du SC qui transfert tous les tokens de l'utilisateurs à l'association
	const transferCharity = async() => {

		let address = document.getElementById("dest-select1").value
	
		const transferEvent = async (_address) =>{
			return new Promise(function(resolve, reject){
				Token.transferToAssociation(_address, (err, result) => {
					if (err) return reject (err);
					resolve(result);
				})
			})
		};
	
		transferTransaction = await transferEvent(address);
		var frm = document.getElementById("donate");
		frm.reset();
		return transferTransaction
	}