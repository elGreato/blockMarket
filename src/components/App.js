import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import { Web3Provider } from 'react';

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

    //now we use the state component of react to save the state of our account      
    this.setState({ account: acc[0] })
  }

  //constructor of React

  constructor(props) {
    super(props)
    this.state = {
      account: ''
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            Ali Tester
          </a>
          <p>
            {this.state.account}
          </p>
        </nav>
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
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
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
