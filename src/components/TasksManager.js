import React from 'react';

import { create, load} from '../fetchTask'
class TasksManager extends React.Component {
    state = {
        name: '',
        tasks: [],
        time: 0,
    }
  
    inputChange = e => {
        const value = e.target.value;
        this.setState({
            name: value, 
        })
    }
    submitHandler = e => {
        e.preventDefault();
        const { name, tasks, time} = this.state;
        if(name) {
            const newItem = {
                name: name,
                time: time,
                isRuning: false,
                isDone: false,
                isRemoved: false
            }
          create(newItem)
          .then(task => this.setState({
            tasks: [...tasks, task]
          }))
          .catch(err => console.log(err));
           this.setState({
             name: '',
           })
         
        }
        else {
            alert('add task !');
        }
    }  

    startAndStopTheTask = (e) => {
        const { tasks } = this.state;
        const currentBtn = e.target;
        const currentId = +currentBtn.parentElement.id;
        this.setState(() => {
            const newTask = tasks.map(task => {
               if(task.id === currentId) {
                    return { ...task, isRuning: !task.isRuning}
               }
               return task
            });
            return {
                tasks: newTask,
            }
        })
       const taskTimer = setInterval(() => this.incrementTime(currentId), 1000)
    }

    incrementTime(id) {
        const { tasks } = this.state;
        this.setState(() => {
            const newTask = tasks.map(task => {
               if(task.id === id) {
                    return { ...task, time: task.time + 1}
               }
               return task
            });
            return {
                tasks: newTask,
            }
        })
    }
    renderTasks(arr) {
        const task = arr.map(item => <section className='task__container' key={item.id}>
            <header className='task__header'>{item.name}, {item.time}</header>
            <footer className='task__footer' id={item.id}>
                <button className='task__btn task__btn--start' onClick={ this.startAndStopTheTask }>{item.isRuning ? 'stop' : 'start'}</button>
                <button className='task__btn task__btn--done'>done</button>
                <button disabled={true} className='task__btn task__btn--delete'>delete</button>
            </footer>
        </section>)

        return task;
    }
    componentDidMount() {
        load()
        .then(data => {
            this.setState({ tasks: data })
        })
        .catch(err => console.log(err))
    }
    render() {
        const { name, tasks } = this.state;
        return (
            <>
            <div className='form__container'>
            <form className='form' onSubmit={ this.submitHandler }>
                <label className='form__label'>Name</label>
                <input className='form__input' value={ name } onChange={ this.inputChange }/>
                <button type='submit' className='form__submit--button'>Add Task</button>
            </form>
            </div>
            <div className='task__container'>{this.renderTasks(tasks)}</div>
            </>
        )
    }
   
}

export default TasksManager;