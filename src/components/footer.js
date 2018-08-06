import React from 'react';
import {Link} from 'react-router-dom'

export default function(props){
  let {
    clearCompleted,
    showClearButton,
    leftItem,
    pathname  /*代替url*/
    /*以下2个不需要  view  changeView*/
  } = props;
  return (
    <footer className="footer">
      <span className="todo-count">
        {/*未完成数统计*/}
        <strong>{leftItem}</strong>
        <span>item left</span>
      </span>
      <ul className="filters">
        <li>
          {/*通过路由实现，主要的是改造a,以下已经把a标签替换成了link,to后面为跳转的地址，pathname处原始为url,但会存在问题*/}
          <Link
              to="/"
              className={pathname ==='/'? "selected" : ''}
          >All</Link>
        </li>
        <li>
        <Link
            to="/active"
            className={pathname ==='/active'? "selected" : ''}
        >Active</Link>

        </li>
        <li>
        <Link
            to="/completed"
            className={pathname ==='/completed'? "selected" : ''}
        >Completed</Link>

        </li>
      </ul>
      {/* 清除完成按钮 */}
      {/*判断：当有一个为 未完成 时，按钮显示*/}
      {showClearButton && (
        <button
          className="clear-completed"
          onClick={clearCompleted}
        >
          clear all completed
        </button>
      )}
    </footer>
  )
}
