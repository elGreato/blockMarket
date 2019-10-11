import { isTopic } from "web3-utils"

require('chai')
    .use(require('chai-as-promised'))
    .should()

const Marketplace = artifacts.require("./Marketplace.sol")

contract('Marketplace', ([deployer,seller, buyer])=> {
    let marketplace

    before(async() =>{
        marketplace= await Marketplace.deployed()
    })

    describe('deployment', async()=>{

        it('deploys successfully', async()=>{
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)

        })

        it('has a name', async()=>{
            const name= await marketplace.name()
            assert.equal(name, 'Whistled marketplace')
        })
    })



    describe('products', async()=>{
        let result, productCount

        before(async() =>{
            result= await marketplace.createProduct('scandal',web3.utils.toWei('1', 'Ether'), {from: seller})
            productCount = await marketplace.productCount()
        })

        it('creates products', async()=>{
            //SUCCESS
            assert.equal(productCount, 1)
            //extract the logs values
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'scandal' , ' name is correct')
            assert.equal(event.price,'1000000000000000000' , 'price is correct')
            assert.equal(event.owner, seller, ' sender is correct')
            assert.equal(event.purchased, false, 'purchase is correct')
            
        

            //FAILURE
            //product must have a name
            await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;

            //product must have a price
            await marketplace.createProduct('scandal', 0, {from: seller}).should.be.rejected;
    })


        it('Lists products', async()=>{

            const product = await marketplace.products(productCount)
            //SUCCESS
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name, 'scandal' , ' name is correct')
            assert.equal(product.price,'1000000000000000000' , 'price is correct')
            assert.equal(product.owner, seller, ' sender is correct')
            assert.equal(product.purchased, false, 'purchase is correct')
            
        })

        it('sells fucking products', async()=>{
            //track balance of seller (just for testing the receive fund)
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)


            // SUCCCESS buyer makes purchase
            result = await marketplace.purchaseProduct(productCount,{ from: buyer, value: web3.utils.toWei('1', 'Ether')})
            //check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'scandal' , ' name is correct')
            assert.equal(event.price, web3.utils.toWei('1', 'Ether') , 'price is correct')
            assert.equal(event.owner, buyer, ' sender is correct')
            assert.equal(event.purchased, true, 'purchase is correct')

            //console.log(event)
            //check that seller received funds
            //see balance before, then after, then check the difference (tracing is up there)

            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            console.log(oldSellerBalance, newSellerBalance, price)

            const expectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), expectedBalance.toString());

            //Failure: tries to buy a product that doesn't exist - no valid id
            await marketplace.purchaseProduct(99,{ from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

            //Failure: tries to buy with less ether
            await marketplace.purchaseProduct(productCount,{ from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected

            //Failure: deployer tries to buy the product. i.e. product shouldn't be purchased twice
            await marketplace.purchaseProduct(productCount,{ from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
            //Failure to do : buyer tries to buy again ...etc. 
        })
})
})