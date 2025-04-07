import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const token = localStorage.getItem('token');
    document.title = "Time Bank | Tranzakciók"

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/Transaction/transaction-history?uId=${token}`);
                setTransactions(response.data);
            } catch (err) {
                setError('Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTransactions();
    }, [token]);
    
    if (loading) return <p>Loading transactions...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='transaction'>
            <table>
            <thead>
                <tr>
                    <th colSpan={7} style={{fontSize:25, backgroundColor:'black', color: 'white'}}>Tranzakcióid</th>
                </tr>
            </thead>
                <thead>
                    <tr>
                        <th>Azonosító</th>
                        <th>Szolgáltatás</th>
                        <th><i className="bi bi-coin"></i></th>
                        <th>Tranzakció dátuma</th>
                        <th>Biztonsági kód</th>
                        <th>Tranzakció típusa</th>
                        <th>Másik fél E-mail címe</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.transactionID}>
                            <td>{tx.transactionID}</td>
                            <td>{tx.serviceName}</td>
                            <td>{tx.timeAmount}</td>
                            <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                            <td>{tx.transactionCode}</td>
                            <td>{tx.type}</td>
                            <td>{tx.counterpartyEmail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <Link to="/profile">
            <button className='btn btn-outline-danger'><i class="bi bi-arrow-left"></i></button>
            </Link>
        </div>
    );
};

export default TransactionsPage;
