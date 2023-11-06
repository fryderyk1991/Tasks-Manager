import React from 'react';

import { get, create } from '../fetchTask'
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
        const { name } = this.state;
        if(name) {
            // tutaj kod z fetchTask
           create(name)
           this.setState({
             name: "",
           })
        }
    }
    render() {
        const { name } = this.state
        return (
            <div className='form__container'>
            <form className='form' onSubmit={ this.submitHandler }>
                <label className='form__label'>Name</label>
                <input className='form__input' value={ name } onChange={ this.inputChange }/>
                <button type='submit' className='form__submit'>Add Task</button>
            </form>
            </div>
        )
    }
}

export default TasksManager;