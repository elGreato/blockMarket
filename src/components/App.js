import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar'
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
      console.log(marketplace)

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
  }


  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>elGreato Dapps</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://elgreato.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>with elGreato! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
