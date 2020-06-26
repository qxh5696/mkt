import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from './components/navigation';
import Home from './components/home'; 
import ExamGenerationPage from './components/examGenerationPage';
import QuestionManagementPage from './components/questionManagementPage';
import ExamManagementPage from './components/examManagementPage';


class App extends Component {
render() {
  return (
    <Router>
          <div>
            <Navigation/>
              <Switch>
                <Route path="/" component={Home} exact/> {/* "exact" must be specified for routes to render */}
                <Route path="/examGeneration" component={ExamGenerationPage}/>
                <Route path="/examManagement" component={ExamManagementPage}/>
                <Route path="/questionManagement" component={QuestionManagementPage}/>
                <Route component={Error}/>
             </Switch>
          </div> 
      </Router>
    );
  }
}

export default App;
