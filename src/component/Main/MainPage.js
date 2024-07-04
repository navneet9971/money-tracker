import React from 'react'
import "../../Styles/Main/MainPage.css";

const MainPage = () => {

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }

  return (
   <div className='main_container'>
    <nav className="navbar">
        <h1>Salay hisab</h1>
        <button className='white_btn' onClick={handleLogout}>
            Logout
        </button>
    </nav>
   </div>
  )
}

export default MainPage