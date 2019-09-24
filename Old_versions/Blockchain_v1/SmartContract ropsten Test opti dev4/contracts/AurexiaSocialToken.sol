pragma solidity ^0.5.0;

// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------

contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    //The owner will me always this address even if another address pay ether to launch the contract (need to be check)
    constructor() public {
        owner = 0xc4d446c6B924c431f89214319D5A3e6bb67e7627; // my personnal address with my phone number (it is my public key)
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }

    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}


// ----------------------------------------------------------------------------
// AST contract : The first part is the ERC20 function then advance coin functions
// ----------------------------------------------------------------------------

contract AurexiaSocialToken is Owned, SafeMath {
    bytes32 public symbol;
    bytes32 public name;
    uint8 public decimals;
    uint256 public _totalSupply;
    uint32 public initialSupply;
    bool public openDonation; // when true we can send our token to association 

    struct wording {
      uint256 id;
      address from;
      address to;
      uint256 amountAST;
      bytes32 text;
    }

    //storage of all wordings by their id and their address
    mapping (uint256 => wording) private wordings;
    mapping (address => mapping (uint256 => wording)) private personalWordings;
    uint256 public indexNewWording;

    //storage of all adresses and the size of members of aurexia
    address[] private aurexiaAccounts;
    uint256 public sizeListAccount;

    //storage of all adresses of all charities
    address[] private charityAccounts;
    uint256 public sizeListCharity;

    struct membre{
      address publicKey;
      bytes32 name;    // first name + family Name
      uint8 grade;     // 1 for consultants, 2 for managers, 3 for partners, 4 for admin 
      bool isMember;
      uint256 nbrTransaction;
      uint256 nbrSend;
      uint256 nbrReceive;
      uint256 totalReceive;
      uint256 totalSend;
    }

    struct association{
      address publicKey;
      bytes32 name;
      bool isPartner; // kind of whitelist of association, allowed to add and remove easier
    }

    mapping(address => uint) private balances;
    mapping(address => membre) private aurexiaMembers;
    mapping(address => association) private associationList;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Burn(address indexed from, uint256 value);

    //mapping and event for ERC20 function but we didn't use it. I put it for good recognition of our contract as ERC20
    mapping (address => mapping (address => uint256)) private _allowed;
    event Approval(address indexed owner, address indexed spender, uint256 value);


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------

    constructor() public {
        symbol = "AST";
        name = "AurexiaSocialToken";
        decimals = 18;
        initialSupply = 20000;
        _totalSupply = initialSupply * 10**uint256(decimals); // 1 token = 1 * 10^18 because of 18 decimals
        balances[owner] = _totalSupply;

        emit Transfer(address(0), owner, _totalSupply);
        
        wordings[0].id = 0;
        wordings[0].to = owner;
        wordings[0].amountAST = _totalSupply;
        wordings[0].text = "Contract Creation";
        indexNewWording = 1;

        personalWordings[owner][0].id = 0;
        personalWordings[owner][0].to = owner;
        personalWordings[owner][0].amountAST = _totalSupply;
        personalWordings[owner][0].text = "Contract Creation";

        // add of  the owner in the whitelist aurexiaMembers
        aurexiaMembers[owner].publicKey = owner;
        aurexiaMembers[owner].name = "Administrator";
        aurexiaMembers[owner].grade = 4;
        aurexiaMembers[owner].isMember = true;
        aurexiaMembers[owner].nbrTransaction = 1;
        aurexiaMembers[owner].nbrReceive = 1;
        aurexiaMembers[owner].totalReceive = _totalSupply;

        aurexiaAccounts.push(owner);
        sizeListAccount += 1;

        openDonation = false;

      }

    // ------------------------------------------------------------------------
    // ERC20 Functions (approve and allowed functions are written but we don't use it. There are just here for a good recognition of our contract as an ERC20)
    // ref "https://www.ethereum-france.com/qu-est-ce-qu-un-token-erc20/" to know what do all ERC20 functions
    // ------------------------------------------------------------------------

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
      }

    function balanceOf(address _address) public view returns (uint256) {
        return balances[_address];
      }

    function transfer(address _to, uint256 _value, bytes32 _text) public returns (bool) {
        require (aurexiaMembers[msg.sender].isMember == true);
        _transfer(msg.sender, _to, _value, _text);
        return true;
      }

    function transferFrom(address _from, address _to, uint256 _value, bytes32 _text) public onlyOwner() returns (bool) {
        _transfer(_from, _to, _value, _text);
        return true;
      }

    function _transfer(address from, address to, uint256 tokens, bytes32 text) private {
        require(to != address(0), "address 0x0");
        balances[from] = safeSub(balances[from], tokens);
        balances[to] = safeAdd(balances[to], tokens);

        wording memory newWording;
        newWording.id = indexNewWording;
        newWording.from = from;
        newWording.to = to;
        newWording.amountAST = tokens;
        newWording.text = text;

        wordings[indexNewWording] = newWording;
        indexNewWording = safeAdd(indexNewWording, 1);

        uint256 tailleFrom = aurexiaMembers[from].nbrTransaction;
        uint256 tailleTo = aurexiaMembers[to].nbrTransaction;
        personalWordings[from][tailleFrom] = newWording;
        aurexiaMembers[from].nbrTransaction = safeAdd(aurexiaMembers[from].nbrTransaction,1);
        aurexiaMembers[from].nbrSend = safeAdd(aurexiaMembers[from].nbrSend,1);
        aurexiaMembers[from].totalSend = safeAdd(aurexiaMembers[from].totalSend,tokens);
        aurexiaMembers[to].nbrReceive = safeAdd(aurexiaMembers[to].nbrReceive,1);
        aurexiaMembers[to].totalReceive = safeAdd(aurexiaMembers[to].totalReceive,tokens);

        if (from != to){                //this line is when administrator send to himself some token, it's jsut 1 transaction overall but must be count as 1 transaction send and 1 receive
          personalWordings[to][tailleTo] = newWording;
          aurexiaMembers[to].nbrTransaction = safeAdd(aurexiaMembers[to].nbrTransaction,1);
        }

        emit Transfer(from, to, tokens);
      }


// ***********************************************************************************//
    function approve(address spender, uint256 value) public returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function _approve(address sender, address spender, uint256 value) internal {
        require(spender != address(0), "address 0x0");
        require(sender != address(0), "address 0x0");

        _allowed[sender][spender] = value;
        emit Approval(sender, spender, value);
    }

    function allowance(address sender, address spender) public view returns (uint256) {
        return _allowed[sender][spender];
    }

  // ------------------------------------------------------------------------
  // Advanced functions : AST functions
  // ------------------------------------------------------------------------

  // Creation of token, increase both total supply and the account which receive all the new tokens

//be careful when you create token to be aware of the 18 decimals. For exemple create 300 tokens is 300 * 10^18 in the argument value of the function
    function mint(address _receiver, uint256 _value) public onlyOwner() {
        require(_receiver != address(0), "address 0x0");
        _totalSupply = safeAdd(_totalSupply, _value);
        balances[_receiver] = safeAdd(balances[_receiver],_value);

        wording memory newWording;
        newWording.id = indexNewWording;
        newWording.to = _receiver;
        newWording.amountAST = _value;
        newWording.text = "Token Creation From Admin";

        wordings[indexNewWording] = newWording;
        indexNewWording = safeAdd(indexNewWording, 1);

        uint256 tailleTo = aurexiaMembers[_receiver].nbrTransaction;
        personalWordings[_receiver][tailleTo] = newWording;
        aurexiaMembers[_receiver].nbrTransaction = safeAdd(aurexiaMembers[_receiver].nbrTransaction,1);

        emit Transfer(address(0), _receiver, _value);
    }

  // Destruction of token, erase the amount of token from an account and update the total supply

//be careful when you destroy token to be aware of the 18 decimals. For exemple destroy 300 tokens is 300 * 10^18 in the argument value of the function
    function burn(address _address, uint256 _value) public onlyOwner() returns (bool success) {
        require(balances[_address] >= _value);                        // Check if the sender has enough
        balances[_address] = safeSub(balances[_address], _value);           // Subtract from the sender
        _totalSupply = safeSub(_totalSupply, _value);                   // Updates totalSupply

        wording memory newWording;
        newWording.id = indexNewWording;
        newWording.to = _address;
        newWording.amountAST = _value;
        newWording.text = "Token Suppression From Admin";

        wordings[indexNewWording] = newWording;
        indexNewWording = safeAdd(indexNewWording, 1);

        uint256 tailleTo = aurexiaMembers[_address].nbrTransaction;
        personalWordings[_address][tailleTo] = newWording;
        aurexiaMembers[_address].nbrTransaction = safeAdd(aurexiaMembers[_address].nbrTransaction,1);

        emit Burn(msg.sender, _value);
        return true;
    }

    //transfer tokens to all aurexia members from administrator

    function transferAll(uint256 _value) public onlyOwner() returns (bool success) {
        require(balances[owner] >= safeMul(_value,sizeListAccount));
        for (uint i=0; i<sizeListAccount; i++){
          address account = aurexiaAccounts[i];
          bytes32 text = "initial donation";
          _transfer(owner, account, _value, text);
        }
        return true;
    }

  // Functions to add/remove new members in AurexiaMembers (whitelist)

    function addToAurexiaMembers (address _address, bytes32 _name, uint8 _grade) public returns (bool) {
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
        aurexiaMembers[_address].publicKey = _address;
        aurexiaMembers[_address].name = _name;
        aurexiaMembers[_address].grade = _grade;
        aurexiaMembers[_address].isMember = true;
        for (uint i=0; i<sizeListAccount; i++ ){
          if (_address == aurexiaAccounts[i]){
            return true;
          }
        }
        aurexiaAccounts.push(_address);
        sizeListAccount = safeAdd(sizeListAccount, 1);
        return true;
    }


    function authorizeManyMembers (address[] memory _address, bytes32[] memory _name, uint8[] memory _grade, uint256 taille) public returns (bool){
          require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
          for (uint i=0; i<taille; i++){
            addToAurexiaMembers(_address[i], _name[i], _grade[i]);
          }
          return true;
      }


    function remAurexiaMembers (address _address) public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
        aurexiaMembers[_address].isMember = false;
        for (uint i=0; i<sizeListAccount; i++ ){
          if (_address == aurexiaAccounts[i]){
            aurexiaAccounts[i] = aurexiaAccounts[sizeListAccount - 1];
            delete aurexiaAccounts[sizeListAccount - 1];
            sizeListAccount = safeSub(sizeListAccount, 1);
            break;
          }
        }
        return true;
    }

    
    //function to get all data members from the contract

    function getMembers() public view returns (address[] memory){
        return aurexiaAccounts;
    }

    function getMembersAndName() public view returns (address[] memory, bytes32[] memory){
        bytes32[] memory NameAurexia = new bytes32[](sizeListAccount);
        for (uint i=0; i<sizeListAccount; i++){
          NameAurexia[i] = getName(aurexiaAccounts[i]);
        }
        return (aurexiaAccounts, NameAurexia);
    }

    function getMembersAndNameAndBalance() public view returns (address[] memory, bytes32[] memory, uint256[] memory){
        bytes32[] memory nameAurexia = new bytes32[](sizeListAccount);
        uint256[] memory balanceAurexia = new uint256[](sizeListAccount);
        for (uint i=0; i<sizeListAccount; i++){
          nameAurexia[i] = getName(aurexiaAccounts[i]);
          balanceAurexia[i] = balanceOf(aurexiaAccounts[i]);
        }
        return (aurexiaAccounts, nameAurexia, balanceAurexia);
    }

    function getAddress (uint256 index) public view returns (address){
        return aurexiaAccounts[index];
    }

  
  //function to check member in AurexiaMembers (whitelist)

    function isInAurexiaMembers (address _address) public view returns (bool){
        return aurexiaMembers[_address].isMember;
    }

  //functions to get all information from a member (you must be in the whitelist to have access to this)
    function getName (address _address) public view returns (bytes32){
        return aurexiaMembers[_address].name;
    }

    function getGrade (address _address) public view returns (uint8){
        return aurexiaMembers[_address].grade;
    }

    function getNbrTransaction (address _address) public view returns (uint256){
        return aurexiaMembers[_address].nbrTransaction;
    }

    function getTotalSend (address _address) public view returns (uint256){
        return aurexiaMembers[_address].totalSend;
    }

    function getTotalReceive (address _address) public view returns (uint256){
        return aurexiaMembers[_address].totalReceive;
    }

    function getNbrSend (address _address) public view returns (uint256){
        return aurexiaMembers[_address].nbrSend;
    }

    function getNbrReceive (address _address) public view returns (uint256){
        return aurexiaMembers[_address].nbrReceive;
    }

  //function to modify grade 

    function modifyGrade (address _address, uint8 newGrade) public returns (bool){   // only owner and manager and partner can promote somebody
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
        aurexiaMembers[_address].grade = newGrade;
        return true;
    }

  //function to modify name (only owner and the one who want to change his/her name)

    function modifyName (address _address, bytes32 newName) public returns (bool){
        require (msg.sender == owner || _address == msg.sender);
        aurexiaMembers[_address].name = newName;
    }
  
  //function to manage association 
    
    function addAssociation (address _address, bytes32 _name) public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        associationList[_address].name = _name;
        associationList[_address].publicKey = _address;
        associationList[_address].isPartner = true;
        charityAccounts.push(_address);
        sizeListCharity = safeAdd(sizeListCharity, 1);
        return true;
    }

    function remAssociation (address _address) public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        associationList[_address].isPartner = false;
        for (uint i=0; i<sizeListCharity; i++ ){
          if (_address == charityAccounts[i]){
            charityAccounts[i] = charityAccounts[sizeListCharity - 1];
            delete charityAccounts[sizeListCharity - 1];
            sizeListCharity = safeSub(sizeListCharity, 1);
            break;
          }
        }
        return true; 
    }
    function transferToAssociation (address _address, uint256 _amount) public returns (bool){
        require (aurexiaMembers[msg.sender].isMember == true);
        require (openDonation == true);
        require (associationList[_address].isPartner == true);
        bytes32 donationText = "Sending to Association";
        _transfer (msg.sender, _address, _amount, donationText);
        return true; 
    }

    function getCharityAddress () public view returns (address[] memory){
        return charityAccounts;
    }

    function getCharitySize () public view returns (uint256){
        return sizeListCharity;
    }

    function launchDonation () public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        require (openDonation == false);
        openDonation = true; 
        return true;
    }

    function closeDonation () public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        require (openDonation == true);
        openDonation = false;
        return true;
    }

    function getCharityAddressAndName () public view returns (address[] memory, bytes32[] memory){
        bytes32[] memory nameCharity = new bytes32[](sizeListCharity);
        for (uint256 i=0; i<sizeListCharity; i++){
          nameCharity[i] = getAssoName(charityAccounts[i]);
        }
        return (charityAccounts, nameCharity);
    }

  //Read function for associations

    function isAssoPartner (address _address) public view returns (bool){
        return associationList[_address].isPartner;
    }

    function getAssoName (address _address) public view returns (bytes32){
        return associationList[_address].name;
    }

    function isDonationOpen () public view returns (bool){
        return openDonation;
    }


  // functions transaction : We want to get and store the wording (libellé) of the transaction

    function getAllWordings () public view returns (address[]memory, address[]memory, uint256[]memory, bytes32[]memory){
        address[] memory addressFrom = new address[](indexNewWording);
        address[] memory addressTo = new address[](indexNewWording);
        uint256[] memory amountsAST = new uint256[](indexNewWording);
        bytes32[] memory textWordings = new bytes32[](indexNewWording);
        for (uint256 i=0; i<indexNewWording; i++){
          addressFrom[i] = wordings[i].from;
          addressTo[i] = wordings[i].to;
          amountsAST[i] = wordings[i].amountAST;
          textWordings[i] = wordings[i].text;
        }
        return (addressFrom, addressTo, amountsAST, textWordings);
    }

    function getPersonalWordings (address _address) public view returns (address[]memory, address[]memory, uint256[]memory, bytes32[]memory){
        uint256 taille = aurexiaMembers[_address].nbrTransaction;
        address[] memory addressFrom = new address[](taille);
        address[] memory addressTo = new address[](taille);
        uint256[] memory amountsAST = new uint256[](taille);
        bytes32[] memory textWordings = new bytes32[](taille);
        for (uint256 i=0; i<taille; i++){
          addressFrom[i] = personalWordings[_address][i].from;
          addressTo[i] = personalWordings[_address][i].to;
          amountsAST[i] = personalWordings[_address][i].amountAST;
          textWordings[i] = personalWordings[_address][i].text;
        }
        return (addressFrom, addressTo, amountsAST, textWordings);
    }

    function getPersoInfoTransaction (address _address) public view returns (uint256, uint256, uint256, uint256, uint256){
        uint256 _nbrTransaction = getNbrTransaction(_address);
        uint256 _totalSend = getTotalSend(_address);
        uint256 _totalReceive = getTotalReceive(_address);
        uint256 _nbrSend = getNbrSend(_address);
        uint256 _nbrReceive = getNbrReceive(_address);
        return (_nbrTransaction, _totalSend, _totalReceive, _nbrSend, _nbrReceive);
    }

    function getAllInfoTransaction () public view returns (uint256[]memory, uint256[]memory, uint256[]memory, uint256[]memory, uint256[]memory, bytes32[]memory){
        uint256[] memory _nbrTransaction = new uint256[](sizeListAccount);
        uint256[] memory _nbrSend = new uint256[](sizeListAccount);
        uint256[] memory _totalReceive = new uint256[](sizeListAccount);
        uint256[] memory _totalSend = new uint256[](sizeListAccount);
        uint256[] memory _nbrReceive = new uint256[](sizeListAccount);
        bytes32[] memory _nameUser = new bytes32[](sizeListAccount);
        for (uint256 i=0; i<sizeListAccount; i++){
          _nbrTransaction[i] = getNbrTransaction(aurexiaAccounts[i]);
          _nbrSend[i] = getNbrSend(aurexiaAccounts[i]);
          _totalReceive[i] = getTotalReceive(aurexiaAccounts[i]);
          _totalSend[i] = getTotalSend(aurexiaAccounts[i]);
          _nbrReceive[i] = getNbrReceive(aurexiaAccounts[i]);
          _nameUser[i] = getName(aurexiaAccounts[i]);
        }
        return (_nbrTransaction, _nbrSend, _totalReceive, _totalSend, _nbrReceive, _nameUser);
    }



    
  // ------------------------------------------------------------------------
  // Function for event management
  // ------------------------------------------------------------------------



}




