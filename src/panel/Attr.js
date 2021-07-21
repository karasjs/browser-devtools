import React from 'react';
import classnames from 'classnames';

import './attr.less';

function formatLength(s) {
  if(isNaN(s)) {
    return s;
  }
  return s.toFixed(1).replace(/\.0$/, '');
}

class Attr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  enter(type) {
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.enterBox("${type}", "${this.state.json.path}");`);
  }

  leave(type) {
    this.setState({
      type: null,
    });
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.leaveBox("${type}");`);
  }

  over(e, type) {
    e.stopPropagation();
    this.setState({
      type,
    });
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.overBox("${type}");`);
  }

  render() {
    let json = this.state.json;
    if(json) {
      return <div className="attr">
        <div className={classnames('box', this.state.type)}
             ref={el => this.box = el}
             onMouseEnter={() => this.enter('box')}
             onMouseLeave={() => this.leave('box')}>
          <div className="margin"
               onMouseOver={e => this.over(e, 'margin')}>
            <span className="label">margin</span>
            <span className="top">{formatLength(json.computedStyle.marginTop || '-')}</span>
            <span className="bottom">{formatLength(json.computedStyle.marginBottom || '-')}</span>
            <span className="left">{formatLength(json.computedStyle.marginLeft || '-')}</span>
            <div className="border"
                 onMouseOver={e => this.over(e, 'border')}>
              <span className="label">border</span>
              <span className="top">{formatLength(json.computedStyle.borderTopWidth || '-')}</span>
              <span className="bottom">{formatLength(json.computedStyle.borderBottomWidth || '-')}</span>
              <span className="left">{formatLength(json.computedStyle.borderLeftWidth || '-')}</span>
              <div className="padding"
                   onMouseOver={e => this.over(e, 'padding')}>
                <span className="label">padding</span>
                <span className="top">{formatLength(json.computedStyle.paddingTop || '-')}</span>
                <span className="bottom">{formatLength(json.computedStyle.paddingBottom || '-')}</span>
                <span className="left">{formatLength(json.computedStyle.paddingLeft || '-')}</span>
                <div className="content"
                     onMouseOver={e => this.over(e, 'content')}>
                  {
                    formatLength(json.width) + ' × ' + formatLength(json.height)
                  }
                </div>
                <span className="right">{formatLength(json.computedStyle.paddingRight || '-')}</span>
              </div>
              <span className="right">{formatLength(json.computedStyle.borderRightWidth || '-')}</span>
            </div>
            <span className="right">{formatLength(json.computedStyle.marginRight || '-')}</span>
          </div>
        </div>
      </div>;
    }
    return null;
  }
}

export default Attr;
