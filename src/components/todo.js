import React ,{Component} from 'react';

export default class extends Component{
  constructor(props){
    super(props);
    this.state={
      inEdit:false //todo是否处于编辑状态，默认为false
    }

    this.editInput = React.createRef();//組件受控

  }

//双击编辑todo
onEdit=()=>{

  let input = this.editInput.current;

  this.setState({
    inEdit:true
  },()=>{
    input.value = this.props.content;
    input.focus();
  }) /*在回调函数中实现，双击编辑框后，要给编辑框焦点（需要拿到真实的DOM元素）,并且拿到已经输入的*/
}

/*失去焦点和按下ENTER时，都会保存数据，则将其提取*/
/*当有数据时，失去焦点，进行保存。当没有数据时，移除焦点，会将该条数据删除*/
 commitAlter=()=>{
   let{current:input} = this.editInput;
   let content = input.value.trim();

   let{id}= this.props; //取出ID

   if(content){
     this.props.alterTodoContent(id,content);
   }else{
     this.props.deleteTodo(id); /*调用删除*/
   }
 }
 /*以上是对下面的改写*/
 // commitAlter=(id,content)=>{
 //   content = content.trim();
 //   if(content){
 //     this.props.alterTodoContent(id,content);
 //   }else{
 //     this.props.deleteTodo(id); /*调用删除*/
 //   }
 // }

  /*失去焦点*/
  /*当通过回车键完成编辑时，实际上也触发了失焦，从而触发了commitAlter,因此需要判断*/
onBlur=()=>{
  if(!this.state.inEdit) return ;
  this.setState({
    inEdit:false
  });

  this.commitAlter();

  /*以下被提取到commitAlert中*/
  // let{current:input} = this.editInput;
  // this.commitAlter(this.props.id, input.value);
  // input.value = '';
}

/*编辑状态下，按ESC退出编辑*/
onKeyDown=(ev)=>{
  // console.log(ev.keyCode);
  if(ev.keyCode === 27 || ev.keyCode ===13 ){ //ESC:27 或 enter:13 都可以让编辑框消失
    this.setState({
      inEdit:false
    })
  }

  if(ev.keyCode ===13){
    this.commitAlter();
  }

}

  render(){
    // console.log('render'); /*若在onBlur处不进行判断，则在编辑完按下回车时触发2次*/
    let{
      content,
      deleteTodo,
      id,
      hasCompleted,
      toggleTodo    //单独完成某一条
    } = this.props;

    let{inEdit} = this.state;

    let className = inEdit? 'editing' : '';

    //如果是inEdit状态且是完成状态，则将className进行字符串拼接，以控制状态
    className = hasCompleted? className+' completed' : className;

    return (
      <li
        className={className}
        //控制类名，就可以控制输入框
        // className="completed" 控制输入框完成
        //className="editing"    控制输入框编辑
      >
        <div className="view">
          {/* 勾选按钮 */}
          <input
            type="checkbox"
            className="toggle"
            checked={hasCompleted}
            onChange={()=>toggleTodo(id)}
          />
          {/* todo 的内容 */}
          {/* 双击todo进行编辑 */}
          <label
          ref="label"
          onDoubleClick={this.onEdit}
          >
            {/*从props中取出*/}
            {content}
          </label>
          {/* 删除按钮 */}
          <button
            className="destroy"
            ref="btn"
            onClick = {()=>deleteTodo(id)}
          >
          </button>
        </div>
        {/* 编辑 todo 的输入框 */}
        <input
          type="text"
          className="edit"
          ref={this.editInput}  /*获取DOM*/
          onBlur={this.onBlur}  /* 失去焦点时，退出编辑还原原始状态*/
          onKeyDown={this.onKeyDown}
        />
      </li>
    )
  }

}
