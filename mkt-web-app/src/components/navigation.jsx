import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/css/navigation.css';

const Navigation = () => {
    return (    
        <nav role='navigation' className='main-nav' id='main-nav'>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/examGeneration">Exam Generation</NavLink></li>
                <li><NavLink to="/examManagement">Exam Management</NavLink></li>
                <li><NavLink to="/questionManagement">Question Management</NavLink></li>
            </ul>    

        </nav>
        
    );
}
 
export default Navigation;