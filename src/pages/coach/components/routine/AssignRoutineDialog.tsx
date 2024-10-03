import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from 'react-query';
import supabase from '@/utils/supabaseClient';
import { DialogDescription } from '@radix-ui/react-dialog';
interface AssignRoutineDialogProps {
    routine_id: number;
}

interface User {
    id: number;
    name: string;
}

const AssignRoutineDialog = ({ routine_id }: AssignRoutineDialogProps) => {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const queryClient = useQueryClient();
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsersWithoutRoutine = async () => {
        const { data: assignedUsers } = await supabase
            .from('profile_routines')
            .select('user_id')
            .eq('routine_id', routine_id);

        const assignedUserIds = assignedUsers?.map(user => user.user_id) || [];

        const { data: availableUsers } = await supabase
            .from('profiles')
            .select('id, name')
            .is('deleted_at', null)
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
    }, [])

    const assignRoutineMutation = useMutation(
        async ({ user_id, routine_id }: { user_id: string; routine_id: number }) => {
            const { data, error } = await supabase
                .from('profile_routines')
                .insert({ user_id, routine_id });
            if (error) throw error;
            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['usersWithoutRoutine', routine_id]);
            },
        }
    );

    const filteredUsers = users.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignRoutine = () => {
        if (selectedUserId) {
            assignRoutineMutation.mutate({ user_id: selectedUserId, routine_id });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Asignar</Button>
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
                                {user.first_name}
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
