import Proyecto from "../models/Proyecto.js";
import Tareas from "../models/Tareas.js";
import mongoose from "mongoose";


const crearTarea = async (req, res) => {
  const { nombre,proyecto } = req.body;

  // prevenir tareas duplicadas
  const existeTarea =  await Tareas.findOne({proyecto: { $eq: proyecto} ,nombre: { $eq: nombre}});

  if (existeTarea) {
    const error = new Error("La tarea ya existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // GUardar tareas
    const tareas = new Tareas(req.body);
    const tareasGuardado = await tareas.save();

    res.json(tareasGuardado);
  } catch (error) {
    console.log(error);
  }
};




const actualizar = async (req, res) => {
  const { id } = req.params;
  // prevenir tareas duplicadas
  console.log(id)
  const tarea =  await Tareas.findById(id);
  console.log(tarea.creador_id.toString())
  console.log(req.body.creador_id)
  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(400).json({ msg: error.message });
  }
  if (tarea.creador_id.toString() !== req.body.creador_id.toString()) {
    const error = new Error("Sin permiso de Modificar la tarea");
    return res.status(403).json({msg: error.message});
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.estado=req.body.estado || tarea.estado;
  tarea.responsables = req.body.responsables || tarea.responsables;
  tarea.fechaEntrega = req.body.cliente || tarea.fechaEntrega;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.proyecto = req.body.proyecto || tarea.proyecto;

  try {
    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada)
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {

  const { id } = req.params;
  // prevenir tareas duplicadas
  const existeTarea =  await Tareas.findById(id);

  if (!existeTarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(400).json({ msg: error.message });
  }
  if (existeTarea.creador_id.toString() !== req.body.creador_id.toString()) {
    const error = new Error("Sin permiso para eliminar la tarea");
    return res.status(403).json({msg: error.message});
  }

  try {
    // Eliminar tareas
    await existeTarea.deleteOne()

    res.json({ msg: "Tarea eliminada correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const dataTareas = async (req, res) => {
  const {id } = req.params;
  
   const tareas =  await Tareas.find({"proyecto":id});
  if(tareas.length==0){
    const error = new Error("El proyecto no tiene tareas aun ");
    return res.status(400).json({ msg: error.message });
  }
  
  try {

    res.json(tareas)
  } catch (error) {
    console.log(error);
  }
 
};

export {
  crearTarea,
  actualizar,
  eliminar,
  dataTareas,
};