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
    let target = e.target;
    let item;
    if(['b'].indexOf(target.tagName.toLowerCase()) > -1) {
      item = target.parentNode.parentNode;
      if(!item.classList.contains('single')) {
        if(item.classList.contains('spread')) {
          item.classList.remove('spread');
        }
        else {
          item.classList.add('spread');
        }
      }
    }
    else if(target.tagName.toLowerCase() === 'div' && target.classList.contains('name')) {
      item = target.parentNode;
    }
    if(item) {
      if(!last || last !== item) {
        last && last.classList.remove('active');
        item.classList.add('active');
        chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.click("${item.title}");`);
      }
      last = item;
    }
    else if(last) {
      last.classList.remove('active');
      last = null;
    }
  }

  dblClick(e) {
    // let last = this.el.querySelector('div.active');
    // if(last) {
    //   last.classList.remove('active');
    // }
    let target = e.target;
    let item;
    if(target.tagName.toLowerCase() === 'div' && target.classList.contains('name')) {
      item = target.parentNode;
    }
    if(item && !item.classList.contains('single')) {
      if(item.classList.contains('spread')) {
        item.classList.remove('spread');
      }
      else {
        item.classList.add('spread');
      }
    }
  }

  enter(e, prefix) {
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.mouseEnter("${prefix}");`);
  }

  leave(e, prefix) {
    chrome.devtools.inspectedWindow.eval(`__KARAS_DEVTOOLS__.mouseLeave("${prefix}");`);
  }

  renderTree(json, prefix) {
    let hasChildren = Array.isArray(json.children) && json.children.length;
    return <div className={classnames('item', {
      single: !hasChildren,
      root: !prefix,
    })} key={prefix} title={prefix}>
      <div className="name"
           onMouseEnter={e => this.enter(e, prefix)}
           onMouseLeave={e => this.leave(e, prefix)}><b/>{json.tagName}</div>
      <div className="children">
      {
        hasChildren && json.children.map((item, i) => this.renderTree(item, (prefix ? prefix + ',' : '') + i))
      }
      </div>
    </div>;
  }

  render() {
    if(this.state.json) {
      return <div className="tree"
                  ref={el => this.el = el}
                  onClick={e => this.click(e)}
                  onDoubleClick={e => this.dblClick(e)}>
        {
          this.renderTree(this.state.json, '')
        }
      </div>;
    }
    return null;
  }
}

export default Tree;
