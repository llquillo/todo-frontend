'use client'
import axios from 'axios'
import { SortAsc, SortDesc, PlusSquareIcon, XCircleIcon, Check, Edit, Search, XIcon, XSquareIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

import AddTodoModal from '@/app/modal' 

export default function Home(){

    const colorPrioMap = {
        'high': 'bg-red-500',
        'low': 'bg-blue-500', 
        'medium': 'bg-amber-500'
      }
    
    const [ todos, setTodos ] = useState([]) // returns arrays

    useEffect(() => {
        fetchTodos()
        
    }, [])

    const fetchTodos = async () => {  // async since future type
        const listOfTodos = await axios.get('http://0.0.0.0:8000/todo/')
        const mapData = listOfTodos.data.map(({ id, title, description, due_date, completed_date, priority }) => {
            if(completed_date==null){
                completed_date = false
            }else{
                completed_date = true
            }
            return { id, title, description, dueDate:due_date, isCompleted:completed_date, priority }
        })
        setTodos(mapData)
    }
    
    const deleteTodo = async (todoId) => {
        try {
            const todoIndex = todos.findIndex(todo => todo.id === todoId);
            if (todoIndex === -1) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }
            const response = await axios.delete(`http://0.0.0.0:8000/todo/${todoId}/`)
            // Re-fetch todos
            fetchTodos()
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    }

    // Function to update a todo by ID
    const updateTodo = async (todoId, updatedFields) => {
        try {
            // Find the todo with the matching ID
            const todoIndex = todos.findIndex(todo => todo.id === todoId);
            if (todoIndex === -1) {
                throw new Error(`Todo with ID ${todoId} not found`);
            }
            
            const todoToUpdate = { ...todos[todoIndex], ...updatedFields };

            const completedDate = new Date()
            const dateOnlyISO = completedDate.toISOString().split('T')[0];
            console.log(dateOnlyISO)
            
            // Convert to format expected by django
            const serverFormat = {
                title: todoToUpdate.title,
                description: todoToUpdate.description,
                due_date: todoToUpdate.dueDate,
                completed_date: todoToUpdate.isCompleted ? dateOnlyISO : null,
                priority: todoToUpdate.priority
            };
            
            // Update using the actual todo ID
            const response = await axios.put(`http://0.0.0.0:8000/todo/${todoId}/`, serverFormat);
            
            // Update the local state
            const updatedTodos = todos.map(todo => 
                todo.id === todoId ? {...todo, ...updatedFields} : todo
            )
            setTodos(updatedTodos)
            
        } catch (err) {
            console.error('Error updating todo:', err)
        }
    };

    const toggleCompletion = (todoId) => {
        const todo = todos.find(todo => todo.id === todoId);
        if (todo) {
            updateTodo(todoId, { isCompleted: !todo.isCompleted });
        }
    };

    const [ modal, setModal ] = useState(false)
    const [ toggleCompleted, setToggleCompleted ] = useState(false)
    const [ search, setSearch ] = useState('')

    return (
        <div className='relative flex flex-col items-center h-screen justify-center min-h-screen p-4 font-[family-name:var(--font-geist-sans)] bg-white text-black'>
          <h1 className='absolute text-2xl font-bold mb-6 top-0 left-0'>To Do List</h1>
          {
            modal &&
            <div className='absolute z-30'>
                <AddTodoModal/>
            </div>
          }
          
          <div className='absolute flex flex-col justify-between w-1/3 h-5/6 border-2 border-black px-2 py-4'>
          <div className='flex flex-row justify-between border-b'>
            <input className='w-full' type='text' onChange={(event) => {
                setSearch(event.target.value)
            }}>
                
            </input>
          </div>
          <div className='overflow-auto h-4.5/5'>
            {
                todos?.filter(({id, title, description, dueDate, isCompleted, priority}) => {
                    return isCompleted == toggleCompleted && (title.includes(search) || description.includes(search))
                }).map(({id, title, description, dueDate, isCompleted, priority}, index) => {
                    if(true){
                        return (
                            <div className='flex flex-row justify-between px-2 py-1 m-1.5 border-2 border-black'>
                                <div className='flex flex-col justify-center'>
                                    <label className='font-bold text-lg'> {title}</label>
                                    <p className='text-sm'> {description} </p>
                                    <label> Due Date: {dueDate} </label>
                                    <label className='text-sm'> <span className={`${colorPrioMap[priority]}`}> {priority} </span> </label>
                                </div>
                                <div className='flex flex-row justify-end w-1/3 items-end'>
                                    <button onClick={() => {}} className='px-0.5'>
                                        <Edit color='gray'/>
                                    </button>
                                    {
                                        !isCompleted && 
                                        <button onClick={() => toggleCompletion(id)} className='px-0.5'>
                                            <Check color='green'/>
                                        </button> 

                                    }
                                    {
                                        isCompleted &&
                                        <button onClick={() => toggleCompletion(id)} className='px-0.5'>
                                            <XIcon color='#FFBF00'/>
                                        </button>     
                                    }
                                    <button onClick={() => deleteTodo(id)} className='px-0.5'>
                                        <XCircleIcon color='red'/>
                                    </button>
                                </div>
                            </div>
                        )
                    }
                })
            }
          </div>
            <div className='flex flex-row-reverse justify-between'>
                {
                    modal &&
                    <button onClick={() => {
                        setModal(false)
                    }}>
                        <XSquareIcon/>
                    </button>
                }
                {
                    !modal &&
                    <button onClick={() => {
                        setModal(true)
                    }}>
                        <PlusSquareIcon/>
                    </button>
                }
                {
                    !toggleCompleted &&
                    <button onClick={()=> setToggleCompleted(true)}>
                        Show Completed
                    </button>
                }
                {
                    toggleCompleted && 
                    <button onClick={()=> setToggleCompleted(false)}>
                        Show Pending
                    </button>
                }
            </div>

          </div>
          
        </div>
      )
    
}