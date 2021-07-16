import React from 'react';
import classnames from 'classnames';

import './tree.less';

class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  click(e) {
    let last = this.el.querySelector('div.active');
    if(last) {
      last.classList.remove('active');
    }
    let target = e.target;
    let item;
    if(target.tagName.toLowerCase() === 'b') {
      item = target.parentNode.parentNode;
    }
    else if(target.tagName.toLowerCase() === 'div' && target.classList.contains('name')) {
      item = target.parentNode;
    }
    if(item) {
      item.classList.add('active');
      if(!target.classList.contains('single')) {
        if(item.classList.contains('spread')) {
          item.classList.remove('spread');
        }
        else {
          item.classList.add('spread');
        }
      }
    }
  }

  renderTree(json, prefix) {
    let hasChildren = Array.isArray(json.children) && json.children.length;
    return <div className={classnames('item', {
      single: !hasChildren,
    })} key={prefix} title={prefix}>
      <div className="name"><b/>{json.tagName}</div>
      <div className="children">
      {
        hasChildren && json.children.map((item, i) => this.renderTree(item, prefix + ',' + i))
      }
      </div>
    </div>;
  }

  render() {
    if(this.state.json) {
      return <div className="tree"
                  ref={el => this.el = el}
                  onClick={e => this.click(e)}>
        {
          this.renderTree(this.state.json, '0')
        }
      </div>;
    }
    return null;
  }
}

export default Tree;
