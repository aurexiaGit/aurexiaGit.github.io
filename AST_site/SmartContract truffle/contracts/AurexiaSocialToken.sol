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
        owner = 0xC8395A6c3d92E661FBf7a97176b4FECd450edE8e; // my personnal address with my phone number (it is my public key)
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
    string public symbol;
    string public name;
    uint8 public decimals;
    uint256 public _totalSupply;
    uint32 public initialSupply;
    bool public openDonation; // when true we can send our token to association 

    //storage of all adresses and the size of members of aurexia
    address[] private aurexiaAccounts;
    uint256 public sizeListAccount;

    struct membre{
      address publicKey;
      string name;    // first name + family Name
      uint8 grade;     // 1 for consultants, 2 for managers, 3 for partners, 4 for admin 
      bool isMember;
    }

    struct association{
      address publicKey;
      string name;
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

        openDonation = false;

        // add of  the owner in the whitelist aurexiaMembers
        aurexiaMembers[owner].publicKey = owner;
        aurexiaMembers[owner].name = "Administrator";
        aurexiaMembers[owner].grade = 4;
        aurexiaMembers[owner].isMember = true;

        aurexiaMembers[0x840e1C551a512851730220c2838f54a2E7068d8F].publicKey = 0x840e1C551a512851730220c2838f54a2E7068d8F;
        aurexiaMembers[0x840e1C551a512851730220c2838f54a2E7068d8F].name = "Amine Badry";
        aurexiaMembers[0x840e1C551a512851730220c2838f54a2E7068d8F].grade = 1;
        aurexiaMembers[0x840e1C551a512851730220c2838f54a2E7068d8F].isMember = true;

        aurexiaAccounts.push(owner);
        sizeListAccount += 1;
        aurexiaAccounts.push(0x840e1C551a512851730220c2838f54a2E7068d8F);
        sizeListAccount += 1;
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

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(aurexiaMembers[msg.sender].isMember == true);
        _transfer(msg.sender, _to, _value);
        return true;
      }

    function transferFrom(address _from, address _to, uint256 _value) public onlyOwner() returns (bool) {
        _transfer(_from, _to, _value);
        return true;
      }

    function _transfer(address from, address to, uint256 tokens) private {
        require(to != address(0), "address 0x0");
        balances[from] = safeSub(balances[from], tokens);
        balances[to] = safeAdd(balances[to], tokens);
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
        emit Transfer(address(0), _receiver, _value);
    }

  // Destruction of token, erase the amount of token from an account and update the total supply

//be careful when you destroy token to be aware of the 18 decimals. For exemple destroy 300 tokens is 300 * 10^18 in the argument value of the function
    function burn(address _address, uint256 _value) public onlyOwner() returns (bool success) {
        require(balances[_address] >= _value);   // Check if the sender has enough
        balances[_address] = safeSub(balances[_address], _value);           // Subtract from the sender
        _totalSupply = safeSub(_totalSupply, _value);                   // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }


    //transfer tokens to all aurexia members from administrator

    function transferAll(uint256 _value) public onlyOwner() returns (bool success) {   // modif lors du passage en front
        require(balances[owner] >= safeMul(_value,sizeListAccount));
        for (uint i=0; i<sizeListAccount; i++){
          address account = aurexiaAccounts[i];
          _transfer(owner, account, _value);
        }
        return true;
    }

  // Functions to add/remove new members in AurexiaMembers (whitelist)

    function addToAurexiaMembers (address _address, string memory _name, uint8 _grade) public returns (bool) {
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
        aurexiaMembers[_address].publicKey = _address;
        aurexiaMembers[_address].name = _name;
        aurexiaMembers[_address].grade = _grade;
        aurexiaMembers[_address].isMember = true;
        for (uint i=0; i<sizeListAccount; i++){
          if (_address == aurexiaAccounts[i]){
            return true;
          }
        }
        aurexiaAccounts.push(_address);
        sizeListAccount = safeAdd(sizeListAccount, 1);
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

    function getMembers() public view returns (address[] memory){
        return aurexiaAccounts;
    }

    function getAddress (uint256 index) public view returns (address){
        return aurexiaAccounts[index];
    }

  
  //function to check member in AurexiaMembers (whitelist)

    function isInAurexiaMembers (address _address) public view returns (bool){
        return aurexiaMembers[_address].isMember;
    }

  //functions to get all information from a member (you must be in the whitelist to have access to this)
    function getName (address _address) public view returns (string memory){
        return aurexiaMembers[_address].name;
    }

    function getGrade (address _address) public view returns (uint8){
        return aurexiaMembers[_address].grade;
    }


  //function to modify grade 

    function modifyGrade (address _address, uint8 newGrade) public returns (bool){   // only owner and manager and partner can promote somebody
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade > 1);
        aurexiaMembers[_address].grade = newGrade;
        return true;
    }

  //function to modify name (only owner and the one who want to change his/her name)

    function modifyName (address _address, string memory newName) public returns (bool){
        require (msg.sender == owner || _address == msg.sender);
        aurexiaMembers[_address].name = newName;
    }
  
  //function to manage association 
    
    function addAssociation (address _address, string memory _name) public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        associationList[_address].name = _name;
        associationList[_address].publicKey = _address;
        associationList[_address].isPartner = true;
        return true;
    }

    function remAssociation (address _address) public returns (bool){
        require (msg.sender == owner || aurexiaMembers[msg.sender].grade == 3);
        associationList[_address].isPartner = false;
        return true; 
    }

    function transferToAssociation (address _address) public returns (bool){
        require (aurexiaMembers[msg.sender].isMember == true);
        require (openDonation == true);
        require (associationList[_address].isPartner == true);
        uint256 value = balanceOf(msg.sender);
        _transfer (msg.sender, _address, value);
        return true; 
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

  //Read function for associations

    function isAssoPartner (address _address) public view returns (bool){
        return associationList[_address].isPartner;
    }

    function getAssoName (address _address) public view returns (string memory){
        return associationList[_address].name;
    }


  // functions hash transaction : We want to get and store the wording (libellé) of the transaction


  // ------------------------------------------------------------------------
  // Function for event management
  // ------------------------------------------------------------------------


            // A faire //


}




