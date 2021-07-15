import React from 'react';
import ReactDom from 'react-dom';
import { transaction } from 'mobx';
import { Provider } from 'mobx-react';
import classnames from 'classnames';
import enums from '../enums';

import './panel.html';
import './panel.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inspectCanvas: false,
      isKarasCanvas: false,
      inspectElement: false,
    };
  }

  clickCanvas() {
    this.setState({
      inspectCanvas: !this.state.inspectCanvas,
    }, () => {
      if(this.state.inspectCanvas) {
        chrome.devtools.inspectedWindow.eval("__KARAS_DEVTOOLS__.startInspect();");
      }
      else {
        chrome.devtools.inspectedWindow.eval("__KARAS_DEVTOOLS__.endInspect();");
      }
    });
  }

  clickElement() {}

  render() {
    return <div className="page">
      <div className="main">
        <div className="tool">
          <div className={classnames('select-c', {
                 active: this.state.inspectCanvas,
               })}
               title="Select a canvas in the page to inspect it"
               onClick={() => this.clickCanvas()}/>
          <div className={classnames('select-e', {
                 enable: this.state.isKarasCanvas,
                 active: this.state.inspectElement,
               })}
               title="Select an element in the canvas to inspect it"
               onClick={() => this.clickElement()}/>
        </div>
      </div>
      <div className="side">456</div>
    </div>;
  }
}

let app;
ReactDom.render(
  <Provider>
    <App ref={el => app = el}/>
  </Provider>,
  document.getElementById('root')
);

chrome.runtime.onMessage.addListener((request, sender) => {
  if(request.key === enums.END_INSPECT) {
    app.setState({
      inspectCanvas: false,
    });
  }
  else if(request.key === enums.IS_CANVAS_KARAS) {
    console.log(request);
    app.setState({
      isKarasCanvas: request.value,
    });
  }
});
