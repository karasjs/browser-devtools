import React from 'react';
import classnames from 'classnames';

import './attr.less';

function formatLength(s) {
  if(isNaN(s)) {
    return s;
  }
  return s.toFixed(1).replace(/\.0$/, '');
}

const UNIT = {
  AUTO: 0,
  PX: 1,
  PERCENT: 2,
  NUMBER: 3,
  INHERIT: 4,
  DEG: 5,
  STRING: 6,
  RGBA: 7,
  REM: 8,
  EM: 9,
  VW: 10,
  VH: 11,
};
const UNIT_V = {};
Object.keys(UNIT).forEach(k => {
  let v = UNIT[k];
  UNIT_V[v] = k.toLowerCase();
});

function unit2String(v) {
  if(typeof v === 'string') {
    return v;
  }
  if(!v) {
    return '';
  }
  if(v[1] === UNIT.AUTO) {
    return 'auto';
  }
  if(v[1] === UNIT.INHERIT) {
    return 'inherit';
  }
  if(v[1] === UNIT.STRING) {
    return v[0];
  }
  if(v[1] === UNIT.RGBA) {
    return `rgba(${v[0].join(',')})`;
  }
  if(v[1] === UNIT.NUMBER) {
    return v[0];
  }
  if(v[1] === UNIT.PERCENT) {
    return v[0] + '%';
  }
  return v[0] + UNIT_V[v[1]];
}

function formatCurrentStyle(k, v) {
  switch(k) {
    case 'backgroundImage':
      v = v.filter(v => v);
      if(v.length) {
        return JSON.stringify(v.map(item => {
          if(typeof item === 'string') {
            return item;
          }
          let s = `${item.k}Gradient(${item.d},`;
          item.v.forEach(item2 => {
            let s2 = unit2String([item2[0], UNIT.RGBA]);
            if(item[1]) {
              s2 += ' ' + unit2String(item2[1]);
            }
            s += s2 + ',';
          });
          return s.replace(/,$/, '') + ')';
        }));
      }
      return '';
    case 'backgroundSize':
      return JSON.stringify(v.map(item => item.map(item2 => unit2String(item2))));
    case 'backgroundPositionX':
    case 'backgroundPositionY':
    case 'borderTopLeftRadius':
    case 'borderTopRightRadius':
    case 'borderBottomRightRadius':
    case 'borderBottomLeftRadius':
    case 'transformOrigin':
    case 'perspectiveOrigin':
      return JSON.stringify(v.map(item => unit2String(item)));
    case 'backgroundRepeat':
      return JSON.stringify(v);
    case 'flexGrow':
    case 'flexShrink':
    case 'opacity':
    case 'zIndex':
    case 'lineClamp':
    case 'order':
      return v;
    case 'rotate_3d':
      return v.slice(0, 3).join(',') + ',' + unit2String(v[3]);
    case 'filter':
      if(v) {
        return v.map(item => {
          let [k, v] = item;
          return `${k}(${unit2String(v)})`;
        }).join(',');
      }
      return '';
    case 'boxShadow':
      if(v) {
        return v.map(v2 => {
          let length = v2.length;
          return v2.slice(0, length - 2).map(item => unit2String(item))
            .concat(unit2String([v2[length - 2], UNIT.RGBA]))
            .concat(v2[length - 1]).join(' ');
        }).join(',');
      }
      return '';
    default:
      return unit2String(v);
  }
}

function formatComputedStyle(k, v) {
  if(typeof v === 'string') {
    return v;
  }
  switch(k) {
    case 'color':
    case 'backgroundColor':
    case 'borderTopColor':
    case 'borderRightColor':
    case 'borderBottomColor':
    case 'borderLeftColor':
      return unit2String([v, UNIT.RGBA]);
    case 'backgroundRepeat':
      return JSON.stringify(v);
    case 'backgroundPositionX':
    case 'backgroundPositionY':
    case 'borderTopLeftRadius':
    case 'borderTopRightRadius':
    case 'borderBottomRightRadius':
    case 'borderBottomLeftRadius':
    case 'transformOrigin':
    case 'perspectiveOrigin':
      return JSON.stringify(v.map(item => item + 'px'));
    case 'fontWeight':
      return v;
    case 'backgroundImage':
      v = v.filter(v => v);
      if(v.length) {
        return JSON.stringify(v.map(item => {
          if(typeof item === 'string') {
            return item;
          }
          let s = `${item.k}Gradient(${item.d},`;
          item.v.forEach(item2 => {
            let s2 = unit2String([item2[0], UNIT.RGBA]);
            if(item[1]) {
              s2 += ' ' + unit2String(item2[1]);
            }
            s += s2 + ',';
          });
          return s.replace(/,$/, '') + ')';
        }));
      }
      return '';
    case 'flexGrow':
    case 'flexShrink':
    case 'opacity':
    case 'zIndex':
    case 'lineClamp':
    case 'order':
    case 'scaleX':
    case 'scaleY':
    case 'scaleZ':
      return v;
    case 'skewX':
    case 'skewY':
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
      return v + 'deg';
    case 'rotate_3d':
      return v.slice(0, 3).join(',') + ',' + v[3] + 'deg';
    case 'transform':
      if(v.length === 9) {
        return `matrix(${v.join(',')})`;
      }
      return `matrix3d(${v.join(',')})`;
    case 'filter':
      if(v) {
        return v.map(item => {
          let [k, v] = item;
          if(k === 'blur') {
            return `${k}(${v}px)`;
          }
          if(k === 'hue-rotate') {
            return `${k}(${v}deg)`;
          }
          return `${k}(${v}%)`;
        }).join(',');
      }
      return '';
    case 'boxShadow':
      if(v) {
        return v.map(v2 => {
          let length = v2.length;
          return v2.slice(0, length - 2).map(item => item + 'px')
            .concat(unit2String([v2[length - 2], UNIT.RGBA]))
            .concat(v2[length - 1]).join(' ');
        }).join(',');
      }
      return '';
    case 'backgroundSize':
      if(v) {
        return JSON.stringify(v.map(item => {
          return item.map(item2 => {
            if(item2 === -1 || item2 === 'auto') {
              return 'auto';
            }
            if(item2 === -2 || item2 === 'contain') {
              return 'contain';
            }
            if(item2 === -3 || item2 === 'cover') {
              return 'cover';
            }
            return item2 + 'px';
          });
        }));
      }
      return '';
    default:
      return v + 'px';
  }
}

class Attr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
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
        <div className="coords">
          <div>
            <span className="k">x</span>:
            <span className="v">{formatLength(json.x)}</span>
          </div>
          <div>
            <span className="k">y</span>:
            <span className="v">{formatLength(json.y)}</span>
          </div>
          <div>
            <span className="k">ox</span>:
            <span className="v">{formatLength(json.ox)}</span>
          </div>
          <div>
            <span className="k">oy</span>:
            <span className="v">{formatLength(json.oy)}</span>
          </div>
          <div>
            <span className="k">sx</span>:
            <span className="v">{formatLength(json.sx)}</span>
          </div>
          <div>
            <span className="k">sy</span>:
            <span className="v">{formatLength(json.sy)}</span>
          </div>
        </div>
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
        <ul className="tab">
          <li className={this.state.tab === 0 ? 'current' : ''}
              onClick={() => this.setState({tab: 0})}>currentStyle</li>
          <li className={this.state.tab === 1 ? 'current' : ''}
              onClick={() => this.setState({tab: 1})}>computedStyle</li>
        </ul>
        <div className={classnames('current-style', {
          current: this.state.tab === 0,
        })}>
          {
            Object.keys(json.currentStyle).map(k => {
              return <div key={k}><span className="k">{k}</span>:
                <span className="v">{formatCurrentStyle(k, json.currentStyle[k])}</span></div>;
            })
          }
        </div>
        <div className={classnames('computed-style', {
          current: this.state.tab === 1,
        })}>
          {
            Object.keys(json.computedStyle).map(k => {
              return <div key={k}><span className="k">{k}</span>:<span className="v">{formatComputedStyle(k, json.computedStyle[k])}</span></div>;
            })
          }
        </div>
      </div>;
    }
    return null;
  }
}

export default Attr;
