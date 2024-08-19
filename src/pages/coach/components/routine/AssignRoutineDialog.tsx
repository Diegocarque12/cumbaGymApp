import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import supabase from '@/utils/supabaseClient';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useQuery, useQueryClient } from 'react-query';

interface AssignRoutineDialogProps {
    routineId: number;
}

const AssignRoutineDialog = ({ routineId }: AssignRoutineDialogProps) => {
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const queryClient = useQueryClient();

    const fetchUsersWithoutRoutine = async () => {
        try {
            const { data: assignedUsers, error: assignedError } = await supabase
                .from('userroutines')
                .select('userId')
                .eq('routineId', routineId);

            if (assignedError) throw assignedError;

            const assignedUserIds = assignedUsers.map(user => user.userId);

            const { data: availableUsers, error: usersError } = await supabase
                .from('users')
                .select('id, name')
                .not('id', 'in', `(${assignedUserIds.join(',')})`)
                .order('name');

            if (usersError) throw usersError;

            return availableUsers || [];
        } catch (error) {
            console.error('Error fetching users without routine:', error);
            throw error;
        }
    };

    const { data: users, isLoading, error } = useQuery(
        ['usersWithoutRoutine', routineId],
        fetchUsersWithoutRoutine,
        {
            enabled: !!routineId,
            retry: 3,
            retryDelay: 2000,
        }
    );

    const handleAssignRoutine = async () => {
        if (selectedUserId) {
            try {
                const { data, error } = await supabase
                    .from('userroutines')
                    .insert({
                        userId: selectedUserId,
                        routineId: routineId,
                        assigned_at: new Date().toISOString()
                    });

                if (error) throw error;

                queryClient.invalidateQueries(['usersWithoutRoutine', routineId]);

                console.log('Routine assigned successfully:', data);
                // Add any additional logic here, such as updating UI or showing a success message
            } catch (error) {
                console.error('Error assigning routine:', error);
                // Handle the error, such as showing an error message to the user
            }
        }
    };

    const filteredUsers = users ? users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching users</div>;

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
                    En la línea de abajo, selecciona el usuario al que quieres asignar la rutina.
                </DialogDescription>
                <div className="py-4">
                    <div className="flex flex-col items-start gap-4">
                        <label htmlFor="userId" className="text-right">
                            Usuario:
                        </label>
                        <div className="relative col-span-3 w-full">
                            <input
                                type="text"
                                id="userSearch"
                                placeholder="Buscar usuario"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md mb-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                id="userId"
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
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAssignRoutine} disabled={!selectedUserId}>
                        Asignar Rutina
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRoutineDialog;