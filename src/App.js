import RegistrationPage from './RegistrationPage';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';
import ServicesPage from './ServicesPage';
import Nav from './Components/Nav';
import ServiceDetailPage from './ServiceDetailPage';
import ProfilePage from './ProfilePage';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreateServicePage from './CreateServicePage.js';
import EditServicePage from './EditServicePage.js';


const App = () => {
    
    return (
       
        <div className="App">
             <Nav/>
           <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='*' element={<Home/>}/>
            <Route path='/LoginPage' element={<LoginPage/>}/>
            <Route path='/RegistrationPage' element={<RegistrationPage/>}/>
            <Route path='/Services' element={<ServicesPage/>}/>
            <Route path="/ServiceDetails/:id" element={<ServiceDetailPage />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/CreateService" element={<CreateServicePage />} />
            <Route path="/EditService/:id" element={<EditServicePage />} />
           </Routes>
        </div>
    );
};

export default App;
