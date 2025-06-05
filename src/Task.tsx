import { set, useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { addTask, deleteTask, getTasks, updateTask, type Task } from "./APIs";
import { useQuery } from "@tanstack/react-query";
import { client } from "./main";
import { useState } from "react";


type Inputs = {
  title: string;
  description: string;
};

const Task = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<Inputs>();
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<number | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEdit && editId !== null) {
      await updateTask(editId, data);
      alert("Task updated successfully");
    } else {
      await addTask(data);
      alert("Task added successfully");
    }
    reset()
    client.invalidateQueries({ queryKey: ["tasks"] });
    setIsEdit(false);
    setEditId(null);
  };


  const { data, isPending, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  })

  const deletetask = async (id: number) => {
    const deleteOneTask = await deleteTask(id);
    if (deleteOneTask) {
      alert("Task Deleted successfully");
    }
    client.invalidateQueries({ queryKey: ['tasks'] });
  }

  const editTask = (task: Task) => {
    setIsEdit(true);
    setEditId(task.id);
    setValue("title", task.title);
    setValue("description", task.description);
  };


  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Task Manager</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <div>
          <Input
            placeholder="Title"
            {...register("title", { required: true })}           
          />
          {errors.title && (
            <span className="text-red-500 text-sm block mt-1">This field is required</span>
          )}
        </div>

        <div>
          <Input
            placeholder="Description"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="text-red-500 text-sm block mt-1">This field is required</span>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button type="submit" className="bg-primary">
            {isEdit ? "Edit task" : "Add Task"}
          </Button>
          {isEdit && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsEdit(false);
                setEditId(null);
                reset();
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>


      <div className="grid grid-cols-3 gap-4  mt-4">
        {data.map((task) => {
          return (
            <div key={task.id} className="border p-4 mb-4 rounded m-4 ">
              <h3 className="font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="secondary" onClick={() => editTask(task)}>Edit</Button>
                <Button variant="default" onClick={() => deletetask(task.id)}>Delete</Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Task;
