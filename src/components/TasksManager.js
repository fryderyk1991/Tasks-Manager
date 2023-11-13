import React from 'react';

import { create, load} from '../fetchTask'
class TasksManager extends React.Component {
    state = {
        name: '',
        tasks: [],
        time: {
            seconds: 0,
            minutes: 0,
            hours:0
        },
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
            alert('add task!');
        }
    }  
    startTask = (currentId) => {
        const intervalId = setInterval(() => {
            this.incrementTime(currentId)
        }, 1000)
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === currentId) {
                    return { ...task, isRuning: task.isRuning = true, intervalId: intervalId};
                }
                return task;
            });
            return {
                tasks: newTasks,
            };
        });
    };
    stopTask = (currentId) => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === currentId) {
                    clearInterval(task.intervalId);
                    console.log(task)
                    return { ...task, isRuning: task.isRuning = false};
                }
                return task;
            });
            return {
                tasks: newTasks,
            };
        });
    };
    startAndStopTheTask = e => {
        const currentBtn = e.target;
        const currentId = +currentBtn.parentElement.id;
        if (currentBtn.innerText === 'start') {
            this.startTask(currentId);
        } else {
            this.stopTask(currentId);
        }
    }
    
    sortTask = (arr) => {
        const sorted = arr.sort((a, b) => (a.isDone ? 1 : 0) - (b.isDone ? 1 : 0));
        return sorted;
    } 

    taskCompleted = e => {
        const { tasks } = this.state;
        console.log(tasks)
        const currentBtn = e.target;
        const currentId = +currentBtn.parentElement.id;
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === currentId) {
                    clearInterval(task.intervalId);
                    if(!task.isDone) {
                        return { ...task, isRuning: task.isRuning = false, isDone: task.isDone = true};
                    }
                    
                }
                return task;
            });

            return {
                tasks: this.sortTask(newTasks),
            };
        });
    }
    incrementTime(id) {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    let newSeconds = task.time.seconds + 1;
                    let newMinutes = task.time.minutes;
                    
                    if (newSeconds === 60) {
                        newSeconds = 0;
                        newMinutes += 1;
                    }
    
                    const newTime = {
                        ...task.time,
                        seconds: newSeconds,
                        minutes: newMinutes,
                    };
    
                    return { ...task, time: newTime };
                }
                return task;
            });
    
            return {
                tasks: newTasks,
            };
        });
    }
    renderTasks(arr) {
        const task = arr.map(item => <section className='task__container' key={item.id}>
            <header className='task__header'>{item.name},{item.time.hours < 10 ? '0' + item.time.hours : item.time.hours}:{item.time.minutes < 10 ? '0' + item.time.minutes : item.time.minutes}:{item.time.seconds < 10 ? '0' + item.time.seconds : item.time.seconds}</header>
            <footer className='task__footer' id={item.id}>
                <button className='task__btn task__btn--start' onClick={ this.startAndStopTheTask }>{item.isRuning ? 'stop' : 'start'}</button>
                 <button className={`${item.isDone ? 'task__btn--done-done' : 'task__btn--done'}`} onClick={ this.taskCompleted }>done</button>
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