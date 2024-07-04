import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Moneytracker from './component/trackerPage/Moneytracker';
import LoginPage from './component/auth/LoginPage';
import SignUpPage from './component/auth/SignUpPage';


function App() {

  return (
    <Router>
    <div className='app-main-container'>
  
        <Routes>
          <Route path="/login" component={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route 
            path="/money" 
           element={<Moneytracker />}
          />
        </Routes>
     
    </div>
    </Router>
  );
}

export default App;
