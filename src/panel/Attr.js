import React from 'react';
import classnames from 'classnames';

import './attr.less';

function formatWH(s) {
  return s.toFixed(2).replace(/\.0+$/, '').replace(/(\.[1-9])0$/, '$1');
}

class Attr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let json = this.state.json;
    if(json) {
      return <div className="attr">
        <div className="box">
          <div className="margin">
            <div className="border">
              <div className="padding">
                <div className="content">
                  {
                    formatWH(json.width) + ' × ' + formatWH(json.height)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>;
    }
    return null;
  }
}

export default Attr;
