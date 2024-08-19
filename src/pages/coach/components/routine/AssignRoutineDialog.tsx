import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from 'react-query';
import supabase from '@/utils/supabaseClient';
import { DialogDescription } from '@radix-ui/react-dialog';
interface AssignRoutineDialogProps {
    routineId: number;
}

interface User {
    id: number;
    name: string;
}

const AssignRoutineDialog = ({ routineId }: AssignRoutineDialogProps) => {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const queryClient = useQueryClient();
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsersWithoutRoutine = async () => {
        const { data: assignedUsers } = await supabase
            .from('userroutines')
            .select('userId')
            .eq('routineId', routineId);

        const assignedUserIds = assignedUsers?.map(user => user.userId) || [];

        const { data: availableUsers } = await supabase
            .from('users')
            .select('id, name')
            .not('id', 'in', `(${assignedUserIds.join(',')})`)
            .order('name');

        return availableUsers || [];
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const userlist = await fetchUsersWithoutRoutine();
            setUsers(userlist);
        };
        fetchUsers();
        console.log(users);

    }, [])

    const assignRoutineMutation = useMutation(
        async ({ userId, routineId }: { userId: string; routineId: number }) => {
            const { data, error } = await supabase
                .from('userroutines')
                .insert({ userId, routineId });
            if (error) throw error;
            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['usersWithoutRoutine', routineId]);
            },
        }
    );

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignRoutine = () => {
        if (selectedUserId) {
            assignRoutineMutation.mutate({ userId: selectedUserId, routineId });
        }
    };

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error fetching users</div>;
    console.log('Raw users data:', users);
    console.log('Filtered users:', filteredUsers);
    console.log('Users type:', typeof users, Array.isArray(users));


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Asignar Rutina</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Rutina</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Selecciona el usuario al que quieres asignar la rutina.
                </DialogDescription>
                <div className="py-4">
                    <input
                        type="text"
                        placeholder="Buscar usuario"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccionar usuario</option>
                        {filteredUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAssignRoutine} disabled={!selectedUserId || assignRoutineMutation.isLoading}>
                        {assignRoutineMutation.isLoading ? 'Asignando...' : 'Asignar Rutina'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRoutineDialog;
