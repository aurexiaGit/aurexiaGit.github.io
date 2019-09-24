
// for the "sending tokens" loading sentence

var sending = false; 

// hide admin logo 

document.getElementById("adminPage").style.display = "none";

// hide notif banner

var show = false;
var elmt = document.getElementById("notifBanner");
elmt.style.display = "none";


const getLog = async () =>{

  let curAddress;
  let ownerAddress;

  const getCurAddress = () =>{                         
    return new Promise(function(resolve, reject){
      web3.eth.getAccounts((err, accounts) => {
        if (err) return reject(err);
        resolve(accounts[0]);
    })
  })}

  const getOwner = () =>{
    return new Promise(function(resolve, reject){
      Token.owner((err, accounts) => {
        if (err) return reject(err);
        console.log(accounts);
        resolve(accounts);
    })
  })}

  const getName = (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, name) => {
				if (err) return reject(err);
				resolve(name);
			})
		})
	}

  curAddress = await getCurAddress();
  ownerAddress = await getOwner();
  curName = await getName(curAddress);
  console.log("current address");
  console.log(curAddress);
  console.log("owner");
  console.log(ownerAddress);
  console.log("curName");
  console.log(curName);

  return getBanner(curAddress, ownerAddress, curName);
};

const getBanner = (_curAddress, _ownerAddress, _name) => {
  if (_curAddress.toLowerCase() == _ownerAddress.toLowerCase() && _curAddress !== undefined && _ownerAddress!== undefined) {
    var identity = document.getElementById("identity");
    identity.innerHTML= "<br> <img class = 'pic' src= 'images/admin.png' alt='profile pic'> <div id = 'name'> " + _name + "</div> </br> ";
    document.getElementById("adminPage").style.display = "block";
    }
  else {
    var identity = document.getElementById("identity");
    identity.innerHTML= "<br><div id = 'name'> " + _name + "</div> </br> ";
  }
};

getLog();

//update drop-down list
const dropdownList = (_curAddress, _users) => {

  var select = document.getElementById("dest-select");
  for (var key in _users){
	  if (_users.hasOwnProperty(key) && key !== "admin" && _users[key].address.toLowerCase() !== _curAddress.toLowerCase()) {
      console.log(_users[key].address)
      console.log(_users[key].name)
      var opt = document.createElement('option');
      opt.value = _users[key].address.toLowerCase();
      opt.innerHTML = _users[key].name;
      select.appendChild(opt);
    }
  }
}

const getUsers = async () =>{

  let users = {};
	let listAddress;
	let name;
	var i = 0;
  
	const getMembers = () =>{                        
		return new Promise(function(resolve, reject){
			Token.getMembers((err, members) => {
				if (err) return reject(err);
				resolve(members);
	  	})
	})}

	const getName = (address) =>{                        
		return new Promise(function(resolve, reject){
			Token.getName(address, (err, name) => {
				if (err) return reject(err);
				resolve(name);
		})
	})}	

	listAddress = await getMembers();
	console.log("get list of addresses")
	console.log(listAddress);
	while (i < listAddress.length) {
		var address = listAddress[i];
		console.log(address)
		name = await getName(address);
		users[name]={}
		users[name].address=address.toLowerCase();
		users[name].name=name
		i++
		console.log(users[name].address)
		console.log(users[name].name)
  }
  
  //get current address before dropdownlist call, to remove own name from dropdown list
  let curAddress;

  const getCurAddress = () =>{                         
  return new Promise(function(resolve, reject){
    web3.eth.getAccounts((err, accounts) => {
      if (err) return reject(err);
      resolve(accounts[0]);
  })
  })}

  curAddress = await getCurAddress();
  return dropdownList(curAddress, users);
};

getUsers();