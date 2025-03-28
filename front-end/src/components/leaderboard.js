import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE;

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(API_BASE + "/user")
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error("Error: ", err));
    }, [])

    return (
        <div className='stats-table leaderboard'>
            <p style={{ color: "#12d77e" }}>(using Express.js serverless functions, refresh if not visible)</p>
            <div id="lead">
            <img src="https://www.chess.com/bundles/web/images/color-icons/leaderboard.4044c4af.svg" alt=""/>
            <h2>Leaderboard</h2>
            </div>
            <table id="customers">
                <tr>
                    <th><div className='wil'>Username</div></th>
                    <th>
                        <div className='wil'>
                        <img src="https://trackercdn.com/cdn/destinytracker.com/elo/Challenger.png" alt="" className='wl'/>
                        ELO
                        </div>
                    </th>
                    <th>
                    <div className='wil'>
                        <img src="https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg" alt="" className='wl'/>
                        Wins
                    </div>
                    </th>
                    <th>
                    <div className='wil'>
                        <img src="https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg" alt="" className='wl'/>
                        Losses
                    </div>
                    </th>
                    <th>
                    <div className='wil'>
                        <img src="https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg" alt="" className='wl'/>
                        Wins
                    </div>
                    </th>
                </tr>
                {users.map(user => (
                <tr>
                    <td>{user.username}</td>
                    <td>{user.elo}</td>
                    <td>{user.wins}</td>
                    <td>{user.losses}</td>
                    <td>{user.compWins}</td>
                </tr>
                ))}
            </table>
        </div>
    );
};

export default Leaderboard;