import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
import Main from './Main'
//we need to import the contract that we created to interact with it from the front end
import Marketplace from '../abis/Marketplace.json'

class App extends Component {
  // this runs everytime the compnent gets created (life cycle component)
  async componentWillMount() {
    await this.loadWeb3();
    //call the functions here
    await this.loadBlockchainData();
  }

  //to talk to blockchain we need web3.js 
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }
  //Fetch the account
  async loadBlockchainData() {
    const web3 = window.web3
    //load account
    const acc = await web3.eth.getAccounts();
    console.log(acc)
    //now we use the state component of react to save the state of our account      
    this.setState({ account: acc[0] })

    //load the main contract json where we can access the abi and address of the contract
    //both ABI and Address are needed to instantiate the smart contract
    //console.log(Marketplace.networks[5777].address)
    const abi = Marketplace.abi

    //hardcode network id for ganache
    //const address = Marketplace.networks[5777].address

    //better way to do it
    const networkId= await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkId]

    
    //check if network has an id
    if (networkData){
      const address = networkData.address
      const marketplace = web3.eth.Contract(abi, address)
      //for debudding reasons, check product count
    const productcount = await marketplace.methods.productCount().call();
    console.log(productcount.toString())
      this.setState({marketplace: marketplace})
      this.setState({loading: false})

    }else {
      window.alert('your contract is not deployed to the current network')
    }
  }


  //constructor of React
  //props allows to pass down variables to subcomponents e.g. Navbar
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
    //bind the function to props
    this.createProduct = this.createProduct.bind(this)
  }

  createProduct(name,price){
    //we have to tell react everytime that we are loading to change its state
    this.setState({loading: true})
    this.state.marketplace.methods.createProduct(name,price).send({from: this.state.account}).
    once('receipt',(receipt) => {this.setState({ loading: false })})
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="containter-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading? <p>loading</p> : <Main createProduct ={ this.createProduct} />}
              
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}
export default App;
