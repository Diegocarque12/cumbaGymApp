import { useState } from "react";
import supabase from "../../../../utils/supabaseClient";
import type { Routine } from "../../../../../interfaces/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


const CreateRoutine = ({ updateRoutineList }: { updateRoutineList: () => void }) => {
  const [open, setOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState<Routine>({
    id: 0,
    name: "",
    description: "",
  });
  const [nameError, setNameError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoutine((prevRoutine) => ({
      ...prevRoutine,
      [name]: value,
    }));
    if (name === "name") {
      setNameError(value.trim() ? "" : "El campo de nombre no puede estar vacío.");
    }
  };

  const handleCreateRoutine = async () => {
    if (!newRoutine.name.trim()) {
      setNameError("El campo de nombre no puede estar vacío.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("routines")
        .insert([{ name: newRoutine.name, description: newRoutine.description }]);
      if (error) {
        console.error("Error Creating", data);
        throw new Error(error.message);
      }
      setNewRoutine({ id: 0, name: "", description: "" });
      setOpen(false);
      setNameError("");
      updateRoutineList();
    } catch (err) {
      console.error("Error al crear la rutina");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Crear una nueva rutina</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Rutina</DialogTitle>
          <DialogDescription>
            Este es el formulario para crear una nueva rutina.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">Crear nueva rutina</h2>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la rutina</label>
            <input
              type="text"
              name="name"
              value={newRoutine.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition duration-200 ease-in-out bg-gray-50"
            />
            {nameError && <p className="mt-2 text-sm text-red-600">{nameError}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              name="description"
              value={newRoutine.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition duration-200 ease-in-out bg-gray-50"
            />
          </div>
          <button
            type="button"
            onClick={handleCreateRoutine}
            disabled={!newRoutine.name.trim()}
            className="w-full px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoutine;