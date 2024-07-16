import { useState } from "react"

const TasksForm = ({onFormSubmit}) => {

    const [task, setTask] = useState()

    const onSubmit = (e) => {
        e.preventDefault()
        onFormSubmit(task)
    }

    return <form onSubmit={onSubmit}>
        <input 
            type="text" 
            placeholder="task" 
            onChange={e => setTask(e.target.value)}/>
        <button>Submit</button>
    </form>
}

export default TasksForm