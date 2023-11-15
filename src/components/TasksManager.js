import React from 'react';
import { create, load, update, deleteData} from '../fetchTask'
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
    startTask = (id) => {
        const intervalId = setInterval(() => {
            this.incrementTime(id)
        }, 1000)
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    update(id, task)
                    return { ...task, isRuning: task.isRuning = true, intervalId: intervalId};
                }
                return task;
            });
            return {
                tasks: newTasks,
            };
        });
    };
    stopTask = (id) => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    update(id, task)
                    clearInterval(task.intervalId);
                    return { ...task, isRuning: task.isRuning = false, intervalId: task.intervalId = 0};
                }
                return task;
            });
            return {
                tasks: newTasks,
            };
        });
        console.log(this.state.tasks)
    };
    startAndStopTheTask = (e,id) => {
        const currentBtn = e.target;
        if (currentBtn.innerText === 'Start') {
            this.startTask(id);
        } else {
            this.stopTask(id);
        }
    }

    sortTask = (arr) => {
        const sorted = arr.sort((a, b) => (a.isDone ? 1 : 0) - (b.isDone ? 1 : 0));
        return sorted;
    } 

    taskCompleted = id => {
        console.log(this.state.tasks)
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    update(id, task)
                    clearInterval(task.intervalId);
                    if(!task.isDone) {
                        return { ...task, isRuning: task.isRuning = false, isDone: task.isDone = true, intervalId: task.intervalId = 0};
                    }
                }
                return task;
            });

            return {
                tasks: this.sortTask(newTasks),
            };
        });
    }
    filterDeletedTasks (arr) {
        const filtered = arr.filter(task => task.isRemoved === false);
        return filtered;
    }
   
    deleteTask = id => {
        this.setState((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task.id === id) {
                    deleteData(id)
                    return { ...task, isRuning: task.isRuning = false, isDone: task.isDone = true, isRemoved: task.isRemoved = true};
                }
                return task;
            });
            return {
                tasks: this.filterDeletedTasks(newTasks),
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

    addZero(time) {
        return time < 10 ? '0' + time : time;
    }
    renderTasks(arr) {
        const task = arr.map(item => <section className='task__section' key={item.id}>
            <header className='task__header header'>{item.name} <span className='header__span--time'>{this.addZero(item.time.hours)}:{this.addZero(item.time.minutes)}:{this.addZero(item.time.seconds)}</span></header>
            <footer className='task__footer'>
                <button disabled={item.isDone ? 'disabled' : null} className='task__btn task__btn--start' onClick={(e) => this.startAndStopTheTask(e, item.id) }>{item.isRuning ? 'Stop' : 'Start' }</button>
                <button className={`${item.isDone ? 'task__btn task__btn--done-done' : 'task__btn  task__btn--done'}`} onClick={() => this.taskCompleted(item.id) }>Done</button>
                <button disabled={item.isDone ? null : 'disabled'} className='task__btn task__btn--delete' onClick={() => this.deleteTask(item.id) }>Delete</button>
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
            <h1 className='heading'>Task manager</h1>
            <div className='form__container'>
            <form className='form' onSubmit={ this.submitHandler }>
                <input className='form__input form__item' value={ name } onChange={ this.inputChange }/>
                <button type='submit' className='form__submit--button form__item'>Add Task</button>
            </form>
            </div>
            <div className='task__container'>{this.renderTasks(tasks)}</div>
            </>
        )
    }
   
}

export default TasksManager;