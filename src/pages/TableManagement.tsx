import { useEffect, useState } from "react";

import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../services/tableService";

export default function TableManagement() {

  const [tables, setTables] =
    useState<any[]>([]);

  const [tableNumber, setTableNumber] =
    useState("");

  const [capacity, setCapacity] =
    useState("");

  const [editingId, setEditingId] =
    useState("");

  const loadTables = async () => {

    const data = await getTables();

    setTables(data);
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleSubmit = async () => {

    if (editingId) {

      await updateTable(editingId, {
        tableNumber: Number(tableNumber),
        capacity: Number(capacity),
      });

      setEditingId("");

    } else {

      await createTable({
        tableNumber: Number(tableNumber),
        capacity: Number(capacity),
      });
    }

    setTableNumber("");
    setCapacity("");

    loadTables();
  };

  const handleEdit = (table: any) => {

    setEditingId(table._id);

    setTableNumber(
      table.tableNumber.toString()
    );

    setCapacity(
      table.capacity.toString()
    );
  };

  const handleDelete = async (
    id: string
  ) => {

    await deleteTable(id);

    loadTables();
  };

  return (

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-5">
        Table Management
      </h1>

      

      <div className="bg-white p-5 rounded shadow mb-8">

        <input
          type="number"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(e.target.value)
          }
          className="border p-2 mr-3"
        />

        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) =>
            setCapacity(e.target.value)
          }
          className="border p-2 mr-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {editingId
            ? "Update Table"
            : "Add Table"}
        </button>

      </div>

      {/* Table List */}

      <table className="w-full bg-white shadow rounded">

        <thead>

          <tr className="bg-gray-200">

            <th className="p-3">
              Table No
            </th>

            <th className="p-3">
              Capacity
            </th>

            <th className="p-3">
              Status
            </th>

            <th className="p-3">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {tables.map((table) => (

            <tr
              key={table._id}
              className="text-center border-b"
            >

              <td>
                {table.tableNumber}
              </td>

              <td>
                {table.capacity}
              </td>

              <td>
                {table.status}
              </td>

              <td className="space-x-2">

                <button
                  onClick={() =>
                    handleEdit(table)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(table._id)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}