import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Pie, Bar, Line } from 'react-chartjs-2';

import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement 
} from 'chart.js';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Form, 
  Card, 
  Alert, 
  Spinner, 
  Badge,
  Navbar,
  Nav,
  ProgressBar
} from 'react-bootstrap';
import { 
  Cpu, 
  Database, 
  Activity, 
  Award, 
  Check, 
  Clock, 
  Layers, 
  Lock, 
  Users,
  TrendingUp 
} from 'lucide-react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register chart components
ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

function App() {
  const [blockData, setBlockData] = useState({});
const [voteOption, setVoteOption] = useState('');
const [voted, setVoted] = useState(false);
const [contract, setContract] = useState(null);
const [voteData, setVoteData] = useState({ candidate1: 0, candidate2: 0 });
const [isLoading, setIsLoading] = useState(true);
const [networkStats, setNetworkStats] = useState({
  gasPrice: '0',
  difficulty: '0',
  activeNodes: 0
});

const contractAddress = "0x42699A7612A82f1d9C36148af9C77354759b210b";
  const abi =   [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidate1",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "candidate2",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "candidateHash",
          "type": "bytes32"
        }
      ],
      "name": "Voted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidateHashes",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasVoted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "validCandidates",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "votesReceived",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidateName",
          "type": "string"
        }
      ],
      "name": "voteForCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidateName",
          "type": "string"
        }
      ],
      "name": "getVotesForCandidate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getCandidateHashes",
      "outputs": [
        {
          "internalType": "bytes32[]",
          "name": "",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "candidateName",
          "type": "string"
        }
      ],
      "name": "isValidCandidate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
const [activeSection, setActiveSection] = useState('dashboard');
const [historyData, setHistoryData] = useState([]);
const [transactionHistory, setTransactionHistory] = useState([]);
const [theme, setTheme] = useState('light');
const [account,setAccount]=useState('');
const web3 = new Web3("http://localhost:8546");

useEffect(()=>{
const fetchweb3data=async()=>{
  
const gasPrice = await web3.eth.getGasPrice();
const gasPriceInGwei = web3.utils.fromWei(gasPrice, 'gwei');
const latestblock = await web3.eth.getBlock('latest');
const difficulty = latestblock.difficulty ;
const peercount = await web3.eth.net.getPeerCount() ;  

const blocknumber = latestblock.number ; 
const blockhash = latestblock.hash ; 
const blockminer = latestblock.miner ; 
const blocktimestamp= latestblock.timestamp ; 

setNetworkStats({
gasPrice:gasPriceInGwei,
difficulty : difficulty,
activeNodes : peercount , 

});
setBlockData({
number: blocknumber,
hash : blockhash,
miner : blockminer,
timestamp : blocktimestamp
});
setIsLoading(false)
};
fetchweb3data();
},[]);


    
  useEffect(() => {
    async function fetchContractEvents() {
      try {
        if (!window.ethereum) {
          console.error("MetaMask not detected");
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        

        const contract = new web3.eth.Contract(abi, contractAddress);

        const logs = await contract.getPastEvents("Voted", { // optional: only if your event has indexed voter
          fromBlock: 0,
          toBlock: "latest",
        });

        const history = await Promise.all(
          logs.map(async (log) => {
            const block = await web3.eth.getBlock(log.blockNumber);
            return {
              id: log.transactionHash,
              type: "Contract Event",
              from: log.returnValues.voter,
              to: contractAddress,
              status: "Confirmed",
              timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
            };
          })
        );

        setTransactionHistory(prev => [...prev, ...history]);

        console.log("Contract Event History:", history);
      } catch (err) {
        console.error("Error fetching contract events:", err);
      }
    }

    fetchContractEvents();
  }, []);

const handleVote = async () => {


  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const web3 = new Web3(window.ethereum);
  const votingContract = new web3.eth.Contract(abi, contractAddress);
  const accounts = await web3.eth.getAccounts();
const account = accounts[0];
setAccount(account);
  const tx = {
    from: account,
    to: contractAddress,
    gas: "30400", // gas limit (in string format)
    gasPrice: "10000000000", // gas price in wei (10 Gwei in this case)
    data: votingContract.methods.voteForCandidate(voteOption).encodeABI(), // encode the function call
  };
  

  
   
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
   
  const candidate1Votes = await votingContract.methods.getVotesForCandidate("candidate1").call(); // Assuming voteForCandidate(1) gets votes for candidate 1
    const candidate2Votes = await votingContract.methods.getVotesForCandidate("candidate2").call(); // Assuming voteForCandidate(2) gets votes for candidate 2
    setVoteData({
      candidate1: parseInt(candidate1Votes),
      candidate2: parseInt(candidate2Votes)
    });
   
  
  
}

useEffect(()=>{
  
  const web3 = new Web3(window.ethereum);
  const votingContract = new web3.eth.Contract(abi, contractAddress);
 const setCandidates = async()=>{
  const candidate1Votes = await votingContract.methods.getVotesForCandidate("candidate1").call(); // Assuming voteForCandidate(1) gets votes for candidate 1
  const candidate2Votes = await votingContract.methods.getVotesForCandidate("candidate2").call(); // Assuming voteForCandidate(2) gets votes for candidate 2
  setVoteData({
    candidate1: parseInt(candidate1Votes),
    candidate2: parseInt(candidate2Votes)
  });
 }
setCandidates();
},[voteData]);

const chartData = {
  labels: ['John Doe', 'Jane Smith'],
  datasets: [
    {
      label: 'Vote Distribution',
      data: [voteData.candidate1, voteData.candidate2],
      backgroundColor: ['#36A2EB', '#FF6384'],
      borderColor: ['#ffffff', '#ffffff'],
      borderWidth: 2,
    },
  ],
};


//toggle theme 
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  localStorage.setItem('blockVisionTheme', newTheme);
};  
  // Return loading spinner if data is loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary" size="lg" />
        <h3 className="mt-3">Connecting to Blockchain...</h3>
        <p>Please wait while we fetch the latest data</p>
      </div>
    );
  }


  return (
    <div className={`app-background ${theme}`}>
      <Navbar bg={theme} variant={theme} expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <Layers className="me-2" />
            <span>BlockVision Pro</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activeSection === 'dashboard'} 
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link 
                active={activeSection === 'voting'} 
                onClick={() => setActiveSection('voting')}
              >
                Voting Platform
              </Nav.Link>
              <Nav.Link 
                active={activeSection === 'transactions'} 
                onClick={() => setActiveSection('transactions')}
              >
                Transactions
              </Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              <Badge bg="success" className="me-3">
                <span className="pulse-dot"></span> Network Active
              </Badge>
              <Button 
                variant={theme === 'light' ? 'outline-dark' : 'outline-light'} 
                size="sm" 
                onClick={toggleTheme}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="main-container mb-4">
      
        {activeSection === 'dashboard' && (
          <>
            <Row className="mb-4">
              <Col md={12}>
                <div className="dashboard-header">
                  <h1>Blockchain Network Dashboard</h1>
                  <p className="text-muted">Real-time metrics and analytics</p>
                </div>
              </Col>
            </Row>
            
            {/* Network Statistics Cards */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-muted">Gas Price</h6>
                        <h3>{networkStats.gasPrice} Gwei</h3>
                      </div>
                      <div className="icon-container">
                        <Activity />
                      </div>
                    </div>
                    
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-muted">Network Difficulty</h6>
                        <h3>{networkStats.difficulty}</h3>
                      </div>
                      <div className="icon-container">
                        <Cpu />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stat-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="text-muted">Active Nodes</h6>
                        <h3>{networkStats.activeNodes}</h3>
                      </div>
                      <div className="icon-container">
                        <Database />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
             
            
            </Row>
            
            {/* Latest Block Info */}
            <Row className="mb-4">
              <Col md={12}>
                <Card className="latest-block-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Card.Title>
                        <Layers className="me-2" /> Latest Block Information
                      </Card.Title>
                      <Badge bg="primary">Updated: {new Date().toLocaleTimeString()}</Badge>
                    </div>
                    
                    <Row>
                      <Col md={6}>
                        <div className="block-info-item">
                          <span className="label">Block Number:</span>
                          <span className="value">{blockData.number}</span>
                        </div>
                        <div className="block-info-item">
                          <span className="label">Block Hash:</span>
                          <span className="value"style={{ wordBreak: 'break-all' }}>{blockData.hash}</span>
                        </div>
                        <div className="block-info-item">
                          <span className="label">Miner:</span>
                          <span className="value">{blockData.miner}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="block-info-item">
                          <span className="label">Timestamp:</span>
                          <span className="value">{blockData.timestamp}</span>
                        </div>
                        
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
          
            
          </>
        )}
        
        {activeSection === 'voting' && (
          <>
            <Row className="mb-4">
              <Col md={12}>
                <div className="dashboard-header">
                  <h1>Decentralized Voting Platform</h1>
                  <p className="text-muted">Cast your vote securely on the blockchain</p>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Card className="voting-card mb-4">
                  <Card.Body>
                    <Card.Title>
                      <Award className="me-2" /> Cast Your Vote
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                      Your vote is anonymous and secure
                    </Card.Subtitle>
                    
                    <Form>
                      <Form.Group className="mb-3" controlId="voteSelection">
                        <Form.Label>Select a Candidate</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={voteOption} 
                          onChange={(e) => setVoteOption(e.target.value)}
                          className="form-select-lg"
                          disabled={voted}
                        >
                          <option value="">-- Choose a candidate --</option>
                          <option value="candidate1">John Doe - Blockchain Progress Party</option>
                          <option value="candidate2">Jane Smith - Decentralization Alliance</option>
                        </Form.Control>
                      </Form.Group>
                      
                      <div className="candidate-info mb-4">
                        {voteOption === 'candidate1' && (
                          <div className="selected-candidate">
                            <div className="candidate-icon">JD</div>
                            <div>
                              <h5>John Doe</h5>
                              <p className="mb-0">Blockchain Progress Party</p>
                              <small className="text-muted">Policy focus: Smart Contract Innovation</small>
                            </div>
                          </div>
                        )}
                        
                        {voteOption === 'candidate2' && (
                          <div className="selected-candidate">
                            <div className="candidate-icon">JS</div>
                            <div>
                              <h5>Jane Smith</h5>
                              <p className="mb-0">Decentralization Alliance</p>
                              <small className="text-muted">Policy focus: Governance Reform</small>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          size="lg"
                          onClick={handleVote} 
                          disabled={voted || !voteOption}
                          className="vote-btn"
                        >
                          {voted ? <><Check size={18} /> Vote Recorded</> : 'Submit Your Vote'}
                        </Button>
                      </div>
                      
                      {voted && (
                        <Alert variant="success" className="mt-4">
                          <div className="d-flex align-items-center">
                            <div className="success-check me-3">
                              <Check size={24} />
                            </div>
                            <div>
                              <h5 className="mb-1">Vote Successfully Recorded</h5>
                              <p className="mb-0">Your vote has been securely stored on the blockchain.</p>
                            </div>
                          </div>
                        </Alert>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="results-card mb-4">
                  <Card.Body>
                    <Card.Title>Current Results</Card.Title>
                    <Card.Subtitle className="mb-4 text-muted">
                      Real-time voting statistics
                    </Card.Subtitle>
                    
                    <div className="chart-container">
                      <Pie 
                        data={chartData} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value} votes (${percentage}%)`;
                                }
                              }
                            }
                          },
                        }}
                      />
                    </div>
                    
                    <div className="vote-stats mt-4">
                      <div className="stat-item">
                        <h5>{voteData.candidate1 + voteData.candidate2}</h5>
                        <span>Total Votes</span>
                      </div>
                      <div className="stat-item">
                        <h5>{voteData.candidate1}</h5>
                        <span>John Doe</span>
                      </div>
                      <div className="stat-item">
                        <h5>{voteData.candidate2}</h5>
                        <span>Jane Smith</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
              
              </Col>
            </Row>
          </>
        )}
        
        {activeSection === 'transactions' && (
          <>
            <Row className="mb-4">
              <Col md={12}>
                <div className="dashboard-header">
                  <h1>Transaction Explorer</h1>
                  <p className="text-muted">Browse recent blockchain activity</p>
                </div>
              </Col>
            </Row>
            
            <Card className="transaction-card mb-4">
              <Card.Body>
                <Card.Title>Recent Transactions</Card.Title>
                
                <div className="transaction-list">
                  <div className="transaction-header">
                    <div className="tx-id">Transaction ID</div>
                    <div className="tx-type">Type</div>
                    <div className="tx-from">From</div>
                    <div className="tx-to">To</div>
                    <div className="tx-status">Status</div>
                    <div className="tx-time">Time</div>
                  </div>
                  
                  {transactionHistory.map((tx, index) => (
                    <div className="transaction-item" key={index}>
                      <div className="tx-id" style={{ wordBreak: 'break-all' }}>{tx.id}</div>
                      <div className="tx-type" style={{ wordBreak: 'break-all' }}>{tx.type}</div>
                      <div className="tx-from" style={{ wordBreak: 'break-all' }}>{tx.from.substring(0, 10)}...</div>
                      <div className="tx-to" style={{ wordBreak: 'break-all' }}>{tx.to.substring(0, 10)}...</div>
                      <div className="tx-status" style={{ wordBreak: 'break-all' }}>
                        <Badge bg={
                          tx.status === 'Confirmed' ? 'success' : 
                          tx.status === 'Pending' ? 'warning' : 'danger'
                        }>
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="tx-time">{tx.timestamp}</div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </>
        )}
        
      </Container>
      
      <footer className="app-footer">
        <Container>
          <Row>
            <Col md={6} className="text-center text-md-start">
              <h5><Layers className="me-2" /> BlockVision Pro</h5>
              <p className="mb-0">Real-time blockchain analytics and voting platform</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0">
                <small>Current block: {blockData.number} | Gas price: {networkStats.gasPrice} Gwei</small>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default App;