pragma solidity >=0.4.22 <0.6.0;

contract owned {
    mapping (address => bool) public owners;

    constructor() public {
        owners[msg.sender]=true;
    }

    modifier onlyOwner {
        require(owners[msg.sender]);
        _;
    }

    function addOwner(address newOwner) onlyOwner public {
        owners[newOwner] = true;
    }
    
    function remOwner(address Owner) onlyOwner public {
        owners[Owner] = false;
    }
    
    function isOwner(address _address) onlyOwner public view returns (bool) {
        return owners[_address];
    }
}

interface tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes calldata _extraData) external; }

contract TokenERC20 {
    // Public variables of the token
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;
    uint256 public initialSupply = 100000;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // This generates a public event on the blockchain that will notify clients
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor() public {
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        balanceOf[msg.sender] = totalSupply;                    // Give the creator all initial tokens
        name = "Aurexia Social Token";                                       // Set the name for display purposes
        symbol = "AST";                                   // Set the symbol for display purposes
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        // Prevent transfer to 0x0 address. Use burn() instead
        require(_to != address(0x0));
        // Check if the sender has enough
        require(balanceOf[_from] >= _value);
        // Check for overflows
        require(balanceOf[_to] + _value > balanceOf[_to]);
        // Save this for an assertion in the future
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        // Subtract from the sender
        balanceOf[_from] -= _value;
        // Add the same to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Asserts are used to use static analysis to find bugs in your code. They should never fail
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }


    /**
     * Destroy tokens
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
        balanceOf[msg.sender] -= _value;            // Subtract from the sender
        totalSupply -= _value;                      // Updates totalSupply
        emit Burn(msg.sender, _value);
        return true;
    }
    
}

/******************************************/
/*       ADVANCED TOKEN STARTS HERE       */
/******************************************/

contract MyAurexiaToken is owned, TokenERC20 {

    struct aurexiaMember {
        string name;
        bool isMember;
    }
    
    mapping(address => aurexiaMember) aurexiaMembers;
    // lier le hash de la transaction avec un libellé
    mapping(string => string) transactionLabels;
 
    address[] public membersAccts;

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor() TokenERC20() public {}
    
    modifier onlyMember {
        require(aurexiaMembers[msg.sender].isMember);
        _;
    }
    
    /* Set members */
    
    function setMember(address _address, string memory _name) onlyOwner public {
        aurexiaMember storage member = aurexiaMembers[_address];
        member.name = _name;
        member.isMember = true;
        membersAccts.push(_address) -1;
    }
    
    function remMember(address _address) onlyOwner public {
        aurexiaMember storage member = aurexiaMembers[_address];
        member.isMember = false;
    }
    
    function getMembers() onlyMember view public returns (address[] memory) {
        return membersAccts;
    }
    
    function getName(address ins) onlyMember view public returns (string memory) {
        return (aurexiaMembers[ins].name);
    }
    
    function isMember(address ins) onlyMember view public returns (bool) {
        return (aurexiaMembers[ins].isMember);
    }

    function addTransaction(string memory _hash, string memory _label) onlyMember public {
        transactionLabels[_hash] = _label ;
    }
    
    function getLabel(string memory _hash) onlyMember view public returns (string memory) {
        return (transactionLabels[_hash]);
    }
    

    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        require (_to != address(0x0));                          // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] >= _value);                   // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]);    // Check for overflows
        require(aurexiaMembers[_from].isMember);                         // Check if sender is Aurexia Member
        require(aurexiaMembers[_to].isMember);                           // Check if recipient is Aurexia Member
        balanceOf[_from] -= _value;                             // Subtract from the sender
        balanceOf[_to] += _value;                               // Add the same to the recipient
        emit Transfer(_from, _to, _value);
    }

    /// @notice Create `mintedAmount` tokens and send it to `target`
    /// @param target Address to receive the tokens
    /// @param mintedAmount the amount of tokens it will receive
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        emit Transfer(address(0), address(this), mintedAmount);
        emit Transfer(address(this), target, mintedAmount);
    }


        /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) onlyOwner public returns (bool success) {
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Destroy tokens from other account
     *
     * Remove `_value` tokens from the system irreversibly on behalf of `_from`.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) onlyOwner public returns (bool success) {
        require(balanceOf[_from] >= _value);                // Check if the targeted balance is enough
        balanceOf[_from] -= _value;                         // Subtract from the targeted balance
        totalSupply -= _value;                              // Update totalSupply
        emit Burn(_from, _value);
        return true;
    }

}

