import React from 'react';
import ReactDom from 'react-dom';
import { transaction } from 'mobx';
import { Provider } from 'mobx-react';

import './panel.html';
import './panel.less';

class App extends React.Component {
  render() {
    return <div>123</div>;
  }
}

ReactDom.render(
  <Provider>
    <App/>
  </Provider>,
  document.getElementById('root')
);
