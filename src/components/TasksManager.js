import React from 'react';

import { create, load } from '../fetchTask'
class TasksManager extends React.Component {
    state = {
        name: '',
        tasks: [],
    }
  
    inputChange = e => {
        const value = e.target.value;
        this.setState({
            name: value, 
        })
    }
    submitHandler = e => {
        e.preventDefault();
        const { name, tasks } = this.state;
        if(name) {
            const newItem = {
                name: name,
                time: 0,
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
    
    renderTasks(arr) {
        const task = arr.map(item => <section key={item.id}>
            <header>{item.name}, {item.time}</header>
            <footer>
                <button>start/stop</button>
                <button>done</button>
                <button>delete</button>
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
                <button type='submit' className='form__submit'>Add Task</button>
            </form>
            </div>
            <div className='task__container'>{this.renderTasks(tasks)}</div>
            </>
        )
    }
   
}

export default TasksManager;