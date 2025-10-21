import React, { useRef, useState } from "react";

const Tareas = () => {
  const [task, setTask] = useState("")
  const [tareas, setTareas] = useState([])
  const [mostrarBoton, setMostrarBoton] = useState(null)
  const taskRef = useRef(null)
  const handlerKeyDown = (e) => {
    if (e.key === "Enter") {
      if (task.trim() !== "") {
        setTareas([...tareas, task])
        setTask("")
      }
    }
  }


  const eliminar = (index) => {
    setTareas(tareas.filter((item, idx) => idx !== index))
    taskRef.current.focus()
  }

  const handlerChange = (e) => {
    setTask(e.target.value)
  }
  return (
    <>
      <div className="card-body sp-4">
        <div className="input-group mb-3">
          <input
            type="text"
            name="tarea"
            className="form-control todo-input"
            placeholder="What needs to be done?"
            value={task}
            autoFocus
            onKeyDown={handlerKeyDown}
            ref={taskRef}
            // onChange={(e) => setNuevoItem(e.target.value)}
            onChange={handlerChange}
          />
        </div>
        <ul className="list-group">
          {tareas.length > 0 && tareas.map((item, index) => (
            <div key={index} className="d-flex justify-content-between align-items-start">
              <li className="list-group-item list-group-item-action d-flex" onMouseEnter={() => setMostrarBoton(index)} onMouseLeave={() => setMostrarBoton(null)}>{item}
                {mostrarBoton === index &&
                  // <button class="badge text-bg-light text-dark rounded-pill ms-auto" onClick={() => eliminar(index)}>X</button>}
                  <button class="btn btn-sm text-muted p-0 ms-auto" onClick={() => eliminar(index)}>X</button>}

              </li>
            </div>
          ))}
        </ul>
        <div className="text-start text-muted">
          {tareas.length > 0 ?
            <small >{tareas.length} item left</small>
            :
            <small >there are no pending tasks</small>
          }
        </div>
      </div>
    </>
  )
}

export default Tareas