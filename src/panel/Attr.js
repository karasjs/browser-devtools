import React from 'react';
import classnames from 'classnames';

import './attr.less';

function formatWH(s) {
  return s.toFixed(1).replace(/\.0$/, '');
}

class Attr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  enter(type) {
    // if(type !== 'box') {
    //   this.box.classList.add(type);
    // }
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.enterBox("${type}", "${this.state.json.prefix}");`);
  }

  leave(type) {
    this.setState({
      type: null,
    });
    // if(type !== 'box') {
    //   this.box.classList.remove(type);
    // }
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
            <span className="top">{json.marginTop || '-'}</span>
            <span className="bottom">{json.marginBottom || '-'}</span>
            <span className="left">{json.marginLeft || '-'}</span>
            <div className="border"
                 onMouseOver={e => this.over(e, 'border')}>
              <span className="label">border</span>
              <span className="top">{json.borderTopWidth || '-'}</span>
              <span className="bottom">{json.borderBottomWidth || '-'}</span>
              <span className="left">{json.borderLeftWidth || '-'}</span>
              <div className="padding"
                   onMouseOver={e => this.over(e, 'padding')}>
                <span className="label">padding</span>
                <span className="top">{json.paddingTop || '-'}</span>
                <span className="bottom">{json.paddingBottom || '-'}</span>
                <span className="left">{json.paddingLeft || '-'}</span>
                <div className="content"
                     onMouseOver={e => this.over(e, 'content')}>
                  {
                    formatWH(json.width) + ' × ' + formatWH(json.height)
                  }
                </div>
                <span className="right">{json.paddingRight || '-'}</span>
              </div>
              <span className="right">{json.borderRightWidth || '-'}</span>
            </div>
            <span className="right">{json.marginRight || '-'}</span>
          </div>
        </div>
      </div>;
    }
    return null;
  }
}

export default Attr;
