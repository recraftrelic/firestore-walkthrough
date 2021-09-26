import { getAuth, signOut } from '@firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from '@firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { getDB } from '../utils/firebase';

const Dashboard = ({ history }) => {
    const [ task, setTask ] = useState("");
    const [ tasks, setTasks ] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;

    const logout = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('token')
                history.push('/')
            })
            .catch((e) => alert(e.message))
    }

    const addTask = useCallback(() => {
        const db = getDB();
        const newTaskRef = doc(collection(db, "tasks"));

        setDoc(newTaskRef, {
            name: task,
            user: user.uid,
        }).then(() => fetchTasks())
    }, [task, user])

    const deleteTask = async (id) => {
        const db = getDB();

        try {
            const result = await deleteDoc(doc(db, "tasks", id))
            fetchTasks()
            console.log(result)
        } catch (e) {
            console.log(e)
        } 
    }

    const fetchTasks = useCallback(async () => {
        if (user && user.uid) {
            const db = getDB();
            const q = query(collection(db, "tasks"), where("user", "==", user.uid))
            
            try {
                const results = await getDocs(q); 
                let resultTasks = [];
                results.forEach(doc => {
                    resultTasks.push({
                        ...doc.data(),
                        uid: doc.id,
                    })
                })

                setTasks(resultTasks);
            } catch (e) {
                console.log(e)
            }
        }
    }, [user])

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            history.push('/')
        }
    },[])

    useEffect(() => {
        fetchTasks()
    }, [user])

    return (
        <div className="w-full h-screen bg-gradient-to-r from-yellow-200 via-red-500 to-pink-500 flex justify-center items-center">
            <div className="w-96 bg-white shadow-lg">
                <div className="m-5">
                    <p>{user && user.displayName}</p>
                </div>
                <div className="m-5">
                    <label className="block text-xl font-bold mb-2">Add a task</label>
                    <input
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        name="email"
                        type="email"
                        className="border-grey-200 border-2 rounded w-full p-2 h-10"
                    />
                </div>
                <div className="m-5">
                    <button
                        onClick={addTask}
                        className="bg-pink-500 text-white px-10 py-2 rounded text-xl font-bold w-full"
                    >
                        Add task
                    </button>
                </div>
                {
                    tasks.map(
                        task => (
                            <div className="m-5 flex justify-between" key={task.uid}>
                                <p>{task.name}</p>
                                <button onClick={() => deleteTask(task.uid)} className="bg-red-500 to-yellow-200 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
                            </div>
                        )
                    )
                }
                <div className="m-5">
                    <button
                        onClick={logout}
                        className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-200 text-white px-10 py-2 rounded text-xl font-bold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
