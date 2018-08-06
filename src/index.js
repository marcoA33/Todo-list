import React, {Fragment, Component, createRef} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Todo from './components/todo.js';
import Footer from './components/footer.js';

import './main.css';

class TodoList extends Component{
  constructor(props){
      super(props);

      this.state ={   //todo数据的数组
          todoList:[],
          view:'all'
      }

      this.todoInput = createRef();//让其受控

  }

  /*改变view*/ /*通过路由改造后，不需要*/
  /* changeView=(view)=>{
    this.setState({
      view
    })
  } */

  //添加一条
  addTodo=(ev)=>{

    let {value} = this.todoInput.current;   //value:文本框中输入的值
    // console.log(value);

    if( ev.keyCode !== 13 || !value.trim() ) return ;  //trim()去除字符串两端的空白
                                                    //此处效果:当没有内容输入时，回车不会添加到list中
    // console.log(value);


    //添加的值，需要放到todolist中
      let {todoList} = this.state;

      this.setState({
        todoList:[
          {
            id:Math.random(), //给添加的数据增加ID
            content:value,
            hasCompleted:false
          },
          ...todoList  //把原来的内容展开
        ]
      },()=>{
        this.todoInput.current.value= ''; //输入完回车之后，输入框清空
      })
  };

  //删除todo
  deleteTodo=(id)=>{
      let{todoList} = this.state;
      todoList = todoList.filter(elt=>{  //进行过滤
          return elt.id !== id;
      })
      this.setState({
        todoList
      })
  }

//单选：单独完成某一条
  toggleTodo=(id)=>{
      let{todoList} = this.state;
      todoList = todoList.map(elt=>{
        if(elt.id==id){
          elt.hasCompleted = !elt.hasCompleted
        }
        return elt;
      });

      this.setState({
        todoList
      })
  }


  //全选：点击后，未被选中的被选中，任务全选时，点击则全部还原为未选中状态
  toggleAll=(ev)=>{
      let{todoList} = this.state;

      todoList = todoList.map(elt=>{
        elt.hasCompleted = ev.target.checked;
        return elt;
      });
      //更新状态
      this.setState({
        todoList
      })
      // console.log(ev.target.value);
      // console.log(ev.target.checked);  //判断状态需要使用该值
    }


  alterTodoContent=(id,content)=>{
  let{todoList} = this.state;

  todoList = todoList.map(elt=>{
    if(elt.id === id) elt.content = content;
    return elt;
  });
  this.setState({
    todoList
  })
}

/*清除全部完成任务*/
  clearCompleted=()=>{
  let{todoList} = this.state;
  todoList = todoList.filter(elt=>{  //进行过滤
      return !elt.hasCompleted; /*保留没有完成的*/
  })
  this.setState({
    todoList
  })
}


  render(){

    let{todoList,/*view*/} = this.state;

    //找元素
    let activeTodo = todoList.find(elt=>elt.hasCompleted === false);

    let completedTodo = todoList.find(elt=>elt.hasCompleted);

    /*统计数据*/
    let leftItem = 0;

    //配置路由 ,此处说明该使用match-url，还是location-pathname
    //使用match配合url ,点击active 和completed 时 match对象中的path为'/' url为'/'
    //因为：我们在Router 中，route一直匹配的是 path='/' ,而目前我们想拿到地址栏的active 和completed
    //而使用location  ， 点击active 和completed 时  location 对象中的pathname 分别为'/active' 和 '/completed'
    //如果想让底层的组件拿到匹配的信息：如 url path pathname 则应该使用location
    //因此，将match改为location
    // let {match:{url}} = this.props;
    //将后续代码中的url 改为pathname 即可
    //Route中有3个Props:match location history
    let {location:{pathname},location} = this.props;
    // console.log(match);
    console.log(location)

    /*过滤出需要的数据*/
    let showTodoDate = todoList.filter(elt=>{
      /*判断值，如果是false,说明有一条没有完成 ，只要存在没有完成的，就让leftItem ++*/
      if(!elt.hasCompleted) leftItem ++;
      {/*view改为url,进行判断,使用配合match使用url也会存在问题，因此将其更换为location配合pathname*/}
      switch (pathname) {
        case '/active':
          return !elt.hasCompleted;
        case '/completed':
          return elt.hasCompleted;
        case 'all':
        default:
          return true;
      }
    })


    //因为todolist是个数组，需要让值进行转换,并且在UL中进行渲染
    /*把过滤后的数据给到下方使用*/
    let todos = showTodoDate.map((elt,i)=>{  // todoList
      return (
        <Todo
          key = {elt.id}//数组里的每条数据需要加key值以处理变化
          {...{
            id:elt.id,    //给删除添加ID
            content:elt.content,
            deleteTodo:this.deleteTodo,
            hasCompleted:elt.hasCompleted,
            toggleTodo:this.toggleTodo,  //单独完成某一条
            alterTodoContent:this.alterTodoContent
          }}
          />
        )
      });
          //以上代码同下
          // id={elt.id} //给删除添加ID
          // content = {elt.content}
          // deleteTodo = {this.deleteTodo}
    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          {/* 输入框 */}
          <input
            type="text"
            className="new-todo"
            placeholder="type something here"
            ref={this.todoInput}
            onKeyDown={this.addTodo}
          />
        </header>
        {/*当没有list时，输入框和footer应该隐藏，才这里需要进行判断*/}
        {/*但是如果把section和footer放入以下表达式的后面,如果表达式的前面成立的话，表达式后面会被整个返回，
          而整个结构相当于独立结构，那么该独立结构需要有闭合标签将其包裹住，因此，需要借助Fragment标签 */}
        {todoList.length>0 && (
          <Fragment>
            <section className="main">
            {/* 全选按钮 */}
              <input
                type="checkbox"
                className="toggle-all"
                checked={!activeTodo && todoList.length>0}
                onChange={this.toggleAll}
              />
              <ul className="todo-list">
                {/*已经过滤好的todolist*/}
                {todos}
              </ul>
            </section>
            {/* Footer */}
            <Footer
            {...{
                clearCompleted:this.clearCompleted,
                showClearButton:completedTodo && todoList.length>0,
                /*不需要传递 changeView 和 view*/
                // view,
                // changeView:this.changeView,
                leftItem,
                pathname  /*此处原始为url*/
            }}
          />
          </Fragment>
        ) }
      </div>
    )
  }
}


ReactDOM.render(
  <Router>
      <Route path="/" component={TodoList}/>
  </Router>
  ,document.getElementById('root')
)
