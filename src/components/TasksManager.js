import React from 'react';

import { create, load } from '../fetchTask'
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
    startTask = e => {
        const { tasks } = this.state
        const startBtn = e.target; 
        const btnId = startBtn.id;
        console.log(tasks)
    }
    renderTasks(arr) {
      
        const task = arr.map(item => <section className='task__container' key={item.id}>
            <header className='task__header'>{item.name}, {item.time}</header>
            <footer className='task__footer'>
                <button className='task__btn task__btn--start' onClick={ this.startTask } id={item.id}>start/stop</button>
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