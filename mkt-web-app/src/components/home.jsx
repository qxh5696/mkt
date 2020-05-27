import React, { useState, useEffect } from 'react';
 

const Home = () => {

    const [currentTime, setCurrentTime] = useState(0);


    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
          setCurrentTime(data.time);
        });
      }, []);

    return (
        <div>
            <div className='container'>
                <h1>MKT Exam Creation Tool</h1>
            </div>
        
            <div className='jumbotron'>
                <p>The current time is {currentTime}.</p>
                <p>Jeremy Brown's MKT Examination Creation Tool</p>
            </div>
       </div>
    );
}
 
export default Home;