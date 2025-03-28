'use client'
import axios from 'axios'
import { FieldValues, useForm } from 'react-hook-form' // curly brackets because we are just getting a specific part of the library

function AddTodoModal() {
    const { register, handleSubmit } = useForm<FieldValues>() // returns objects, these objects are specific from useForm
    const onSubmit = (values: { title:string, description:string, dueDate:Date, priority:string }) => {
        axios.post('http://0.0.0.0:8000/todo/', {...values,due_date:values.dueDate})
    }

    const priorityMap = [
      {'label': 'medium', 'key': 'medium'},
      {'label': 'high', 'key': 'high'},
      {'label': 'low', 'key': 'low'}

    ]
    return (
        <div className='w-full max-w-md bg-white shadow-md p-6 border-black border-2 font-[family-name:var(--font-geist-sans)]'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col'>
            <label className='mb-1 font-medium text-black'>Title:</label>
            <input 
              className='px-3 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500' 
              type='text' 
              {...register('title')}
            />
          </div>
          
          <div className='flex flex-col'>
            <label className='mb-1 font-medium text-black'>Description:</label>
            <textarea 
              className='px-3 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24' 
              {...register('description')}
            />
          </div>
          
          <div className='flex flex-col'>
            <label className='mb-1 font-medium text-black'>Due date:</label>
            <input 
              className='px-3 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500' 
              type='date' 
              {...register('dueDate')}
            />
          </div>

          <div className='flex flex-col'>
          <label className='mb-1 font-medium text-black'>Priority:</label>
            <select {...register('priority')}>
              {
                priorityMap.map(({label, key}) => {
                  return(
                    <option value={key}>
                      {label}
                    </option>
                  )

                })
              }
            </select>
          </div>
          
          
          <button 
              type='submit' 
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium mt-4'
            >
            Submit
          </button>
        </form>
      </div>
    );
  }

  export default AddTodoModal