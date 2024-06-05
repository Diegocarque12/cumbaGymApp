import { useEffect, useState } from "react";
import { User } from "../interfaces/types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tgbwzhkwhrmmtczxrsgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYnd6aGt3aHJtbXRjenhyc2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NTIzODMsImV4cCI6MjAzMzEyODM4M30.LKEZvOtD-EjSoltmrTna-t6zE1G52semmUSXoy3pdI8"
);

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data } = await supabase.from("users").select();
    if (data) {
      setUsers(data);
    }
  }

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.name}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
