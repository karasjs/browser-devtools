import React from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import enums from '../enums';
import Tree from './Tree';
import Attr from './Attr';

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
        chrome.devtools.inspectedWindow.eval("__KARAS_DEVTOOLS__.startInspectCanvas();");
      }
      else {
        chrome.devtools.inspectedWindow.eval("__KARAS_DEVTOOLS__.endInspectCanvas();");
      }
    });
  }

  clickElement() {
    if(this.state.isKarasCanvas) {
      this.setState({
        inspectElement: !this.state.inspectElement,
      }, () => {

      });
    }
  }

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
        <Tree ref={el => this.tree = el}/>
      </div>
      <div className="side">
        <Attr ref={el => this.attr = el}/>
      </div>
    </div>;
  }
}

let app;
ReactDom.render(
  <App ref={el => app = el}/>,
  document.getElementById('root')
);

chrome.runtime.onMessage.addListener((request, sender) => {
  if(request.key === enums.END_INSPECT_CANVAS) {
    app.setState({
      inspectCanvas: false,
    });
  }
  else if(request.key === enums.IS_KARAS_CANVAS) {
    app.setState({
      isKarasCanvas: request.value,
    });
    app.tree.setState({
      json: null,
    });
    app.attr.setState({
      json: null,
      type: null,
    });
  }
  else if(request.key === enums.INIT_ROOT_JSON) {
    app.tree.setState({
      json: request.value,
    });
  }
  else if(request.key === enums.TAB_UPDATE) {
    if(request.value === 'loading') {
      app.setState({
        inspectCanvas: false,
        isKarasCanvas: false,
        inspectElement: false,
      });
      app.tree.setState({
        json: null,
      });
      app.attr.setState({
        json: null,
        type: null,
      });
    }
  }
  else if(request.key === enums.CLICK_ELEMENT) {
    app.attr.setState({
      json: request.value,
    });
  }
  return true;
});
