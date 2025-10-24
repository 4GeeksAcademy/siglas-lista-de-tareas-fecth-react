import React, { useEffect, useRef, useState } from "react";

const Tareas = () => {
  const [task, setTask] = useState("")
  const [tareas, setTareas] = useState([])
  const [mostrarBoton, setMostrarBoton] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [nameUsuario, setNameUsuario] = useState("nothing")
  const [usuarios, setUsuarios] = useState([])
  const [readTask, setReadTask] = useState("")
  const [userVacio, setUserVacio] = useState(false)
  const taskRef = useRef(null)


  const handlerKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (task.trim() == "" || task.length <= 10) {
        alert("La Tarea no puede estas vacia y debe contener mas de 10 caracteres")
        return
      }
      let newArray = tareas.filter((ele) => ele.label == task)
      if (newArray.length >= 1) {
        alert("Error La Tarea ya existe")
        return
      }
      const crearTask = async () => {
        try {
          let response = await fetch(`https://playground.4geeks.com/todo/todos/${nameUsuario}`, {
            method: "POST",
            body: JSON.stringify({
              label: task,
              done: false
            }),
            headers: {
              "Content-Type": "application/json"
            }
          })
          if (!response.ok) {
            throw new Error("Ocurrio un Error")
          }
          let data = await response.json()
          setTareas([...tareas, data])
        } catch (error) {
          console.log("Aca el Error:", error)
        }
      }
      await crearTask()
      setTask("")
    }
  }


  const eliminar = async (index) => {
    try {
      let eliminar = await fetch(`https://playground.4geeks.com/todo/todos/${index}`, {
        method: "DELETE"
      })
      if (!eliminar.ok) {
        throw new Error("hubo un error")
      }
    } catch (error) {
      console.log("hubo un error", error)
    }
    setTareas(tareas.filter((item) => item.id !== index))
    taskRef.current.focus()
  }

  const handlerChange = (e) => {
    setTask(e.target.value)
  }

  const handlerNameUsuario = (e) => {
    setNameUsuario(e.target.value)
  }

  const handlerSubmit = async () => {
    try {
      if (nameUsuario == "" || nameUsuario.length < 3) {
        alert("El nombre de usuarion esta en blanco y menor a 3 caracteres")
        return
      }
      let newArray = usuarios.filter((ele) => {
        return ele.name == nameUsuario
      })
      if (newArray.length > 0) {
        alert("Error Usuario Ya existe")
        return
      }
      let response = await fetch(`https://playground.4geeks.com/todo/users/${nameUsuario}`, {
        method: "POST"
      })
      if (!response.ok) {
        throw new Error("Ocurrio un Error")
      }
      let data = await response.json()
      setUsuarios([...usuarios, data])
      setNameUsuario("")
      setUserVacio(false)
    } catch (error) {
      console.log("Ocurrio un error", error)
    }
  }

  const actualizarNameUsuario = (name) => {
    setNameUsuario(name)
    setReadTask(name)
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        let response = await fetch("https://playground.4geeks.com/todo/users")
        if (!response.ok) {
          throw new Error("Ocurrio un Error");
        }
        let data = await response.json()
        if (data.users.length > 0) {
          setUsuarios(data.users)
          setNameUsuario((prev) => prev = data.users[0].name)
          setReadTask(data.users[0].name)
          setUserVacio(false)
        } else {
          setUserVacio(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUsers()
  }, [])


  useEffect(() => {
    let consulta = async () => {
      try {
        setCargando(true)
        let res = await fetch(`https://playground.4geeks.com/todo/users/${nameUsuario}`)
        if (!res.ok) {
          throw new Error("Ocurrio un Error")
        }
        let data = await res.json()
        let data2 = data.todos
        setTareas(data2.map(item => item))
      } catch (error) {
        console.error("akika hay un error", error)
      } finally {
        setCargando(false)
      }
    }
    if (readTask != "") consulta()
  }, [readTask])



  if (cargando) return <p className="bg-warning">Cargando...</p>
  return (
    <>
      <div className="card-body sp-4">
        {
          userVacio && <h3>No hay Usuarios Cree Uno Para Sus Tareas</h3>
        }
        <div className="mb-1">
          <label htmlFor="nameUsuario" className="form-label">Crear Nuevo Usuario</label>
          <input type="text" name="nameUsuario" id="nameUsuario" className="form-control1 me-2 ms-2" placeholder="User Name"
            value={nameUsuario}
            onChange={handlerNameUsuario}
          />
          <button className="btn btn-primary" onClick={handlerSubmit}>Submit</button>
        </div>
        <hr />
        <div className="mb-3" >
          {
            usuarios.map((item) => (<button key={item.id} className="me-1 " onClick={() => actualizarNameUsuario(item.name)}>{item.name}</button>
            ))}
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            name="tarea"
            className="form-control "
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
          {tareas.length > 0 && tareas.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-start">
              <li className="list-group-item list-group-item-action d-flex" onMouseEnter={() => setMostrarBoton(item.id)} onMouseLeave={() => setMostrarBoton(null)}>{item.label}
                {mostrarBoton === item.id &&
                  <button className="btn btn-sm text-muted p-0 ms-auto" onClick={() => eliminar(item.id)}>X</button>}

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