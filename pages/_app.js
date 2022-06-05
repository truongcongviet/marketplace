/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'
import { useEffect,  useState } from 'react'
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

export default function MyApp({ Component, pageProps }) {
  const [connectWalletText, setConnectWalletText] = useState('Connect Wallet')
  const [currentWallet, setCurrentWallet] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if(localStorage.getItem('currentWallet')) {
      setCurrentWallet(localStorage.getItem('currentWallet'))
      setBalance(localStorage.getItem('balance'))
    }
  }, []);

  useEffect(() => {
    if(currentWallet != null) {
      localStorage.setItem('currentWallet', currentWallet);
      localStorage.setItem('balance', balance);
    } else {
      localStorage.setItem('currentWallet', '');
      localStorage.setItem('balance', 0);
    }
    
  }, [currentWallet, balance]);

  useEffect(() => {
      checkAccountsChanged()
  }, []);
  
  const checkAccountsChanged = async () => {

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if(accounts[0]){
          await getBalanceAccountCurrent(accounts[0])
          setCurrentWallet(accounts[0])
        }else {
          setCurrentWallet(null)
          setBalance(null)
        }
       
      })
    }
  }

  const clickConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(async(data) => {
        if (data !== undefined) {
        await getBalanceAccountCurrent(data[0])
          setCurrentWallet(data[0])
          setConnectWalletText('Wallet Connected')
        }
      })
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'You need to install Metamask',
        icon: 'warning',
        confirmButtonText: 'Cool'
      })
    }
  }

  const getBalanceAccountCurrent = async (address) => {

    if (typeof window.ethereum !== 'undefined') {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
  
      const totalBalance = await provider.getBalance(address)
      const balanceNumber = Number(totalBalance.toString())/10**18
  
      setBalance(balanceNumber.toFixed(2))
    }
   
  }

  return (
    <div className='bg-[#0f0933] h-screen min-h-full opacity-90'>
      <nav className="border-b p-6 flex justify-between items-start">
        <div>
          <div className='flex gap-6 content-center my-auto mb-4'>
            <img src="./LogoWhite.png" className='w-[50px] h-[50px]'/>
            <p className="text-4xl font-bold text-white">NFT Polygon Marketplace</p>
          </div>
          <div className="flex mt-4">
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 py-1">
              <Link href="/" className="w-full">
                <a className="text-[#0f0933] px-8 font-bold">
                  Home
                </a>
              </Link>
            </div>
            
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 py-1">
              <Link href="/create-nft">
                <a className="text-[#0f0933] px-6 font-bold">
                  Create NFT
                </a>
              </Link>
            </div>
          
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 py-1">
              <Link href="/my-nfts">
                <a className=" text-[#0f0933] px-8 font-bold">
                  My NFTs
                </a>
              </Link>
            </div>
            
            <div className="w-[150px] border-2 mr-6 border-purple-300 text-center rounded-lg bg-gradient-to-r from-blue-700 to-blue-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 py-1">
              <Link href="/dashboard">
                <a className="text-[#0f0933] px-8 font-bold">
                  Dashboard
                </a>
              </Link>
            </div>
            
          </div>
        </div>
        <div className='grid xl:flex w-full justify-end gap-[30px]'>
        {currentWallet && currentWallet != '' && <h4 className='flex gap-2 items-center font-semibold text-white'>Balance: <span className='text-red-600	font-bold'>{balance}</span> <img src="./ether.png" className="w-3 ml-1"/></h4>}
        {currentWallet && currentWallet != '' && 
          <h4 className='font-semibold text-white'>Your Address: 
            <span className='font-bold border border-gray-300 rounded p-1 bg-slate-300 text-black ml-2'>
              {
                currentWallet[0] + 
                currentWallet[1] + 
                currentWallet[2] + 
                currentWallet[3] + 
                currentWallet[4] + 
                currentWallet[5] + 
                currentWallet[6] + 
                "..." + 
                currentWallet[34] + 
                currentWallet[35] + 
                currentWallet[36] + 
                currentWallet[37] + 
                currentWallet[38] + 
                currentWallet[39] + 
                currentWallet[40] 
              }
            </span>
          </h4>
        }
        {(currentWallet == null || currentWallet == '') &&
        <div className="border-2 border-indigo-500/75 rounded-lg max-h-[40px] items-center text-center bg-indigo-600 hover:bg-indigo-800">
          <button className="px-5 py-1.5 font-bold text-white" onClick={() => clickConnectWallet()}>Connect Wallet</button>
        </div>} 
        </div>
        
      </nav>
      <Component {...pageProps} />
    </div>
  )
}
