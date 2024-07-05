import { useEffect, useState } from 'react';
import './Moneytracker.css';
import { useLocation } from 'react-router-dom';

function Moneytracker() {
   const location = useLocation();
   const userData = location.state?.userData;
   const showUser = userData.user


  const [name, setName] = useState();
  const [datetime, setDatetime] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getTransactions()
      .then(data => {
        setTransactions(data.transactions);
      })
      .catch(error => {
        console.log("some error occurred fetch transactions")
      });
  }, []);

  async function getTransactions() {
  const url = 'http://localhost:4000/api/transactions';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }
}

  

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url =  'http://localhost:4000/api/transaction';
    fetch(url, {
      method: 'POST',
      headers: {
          Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        price,
        datetime,
        description
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setPrice('');
      })
    })
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += parseFloat(transaction.price) || 0;
  }

  const balanceFixed = balance.toFixed(2);
  const [integerPart, fractionalPart] = balanceFixed.split('.');


  return (
    <main>
<p className='username-show'>{showUser.firstName + ' ' + showUser.lastName}</p>

      <h1>₹{integerPart}<span>{fractionalPart}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type='text' value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={`title`} />


          <input type='datetime-local'
            value={datetime}
            onChange={ev => setDatetime(ev.target.value)}
          />
        </div>

        <div className='description'>
          <input type='text'
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder={'description'} />
          <input type='number'
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            placeholder={'price'}
          />
        </div>

        <button type='submit'>
          Add new transaction
        </button>
      </form>

      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction'>
            <div className='left-transaction'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>
                {transaction.description}
              </div>
            </div>
            <div className='right-transaction'>
              <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>{transaction.price}</div>
              <div className='datetime'>{transaction.datetime}</div>
            </div>
          </div>
        ))}


      </div>

    </main>
  );
}

export default Moneytracker;
