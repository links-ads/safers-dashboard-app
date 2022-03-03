/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';


// index page sections
import Buttons from './IndexSections/Buttons.js';
import Inputs from './IndexSections/Inputs.js';

import Alerts from './IndexSections/Alerts.js';

class Index extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
        
        <main className='container pt-4'>
          <Buttons />
          <Inputs />
          <Alerts />
        </main>
      </>
    );
  }
}

export default Index;
