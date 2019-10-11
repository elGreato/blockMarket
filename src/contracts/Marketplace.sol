pragma solidity  >=0.4.21 <0.6.0;

contract Marketplace {

//state variable
    string public name;
    //we use this to make sure not to point at empty mapping
    uint public productCount =0;

    //this is like linkedlist in java
    mapping(uint => Product) public products;

    constructor() public {
        name = "Whistled marketplace";
    }

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }
    //event is like a logger
    event ProductCreated (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    function createProduct(string memory _name, uint _price) public{
        //require a name
        require(bytes(_name).length > 0);

        //require a valid price
        require(_price > 0);

        //create proeuct and trigger an event to tell the blockchain that somethign happened
        //increament product count
        productCount ++;
        //create products
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //emit the event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable {
        //fetch the product
        Product memory _product = products[_id];
        //fetch owner
        address payable _seller = _product.owner;
        //ensure product has valid id
        require(_product.id > 0 && _product.id <= productCount, "wronge product id");

        //require that it has enough Ether
        require(msg.value >= _product.price, "not enough ether");

        //require that's not prudhced
        require(!_product.purchased, "product already purchsed");

        //require that buyer is not seller
        require(_seller != msg.sender, "can't buy your own products");

        //ensure valid product
        //purchase it - transfer ownershipt to buyer
        _product.owner = msg.sender;
        //mark as purchased
        _product.purchased = true;

        //update the product
        products[_id] = _product;

        //pay the seller
        address(_seller).transfer(msg.value);
        //trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }

}