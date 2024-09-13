import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    
    const getPasswords = async()=>{
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
        

    }, [])

    const showPassword = () => {
        // alert("show the password");
        if (ref.current.src.includes("src/assets/eyecross.png")) {
            ref.current.src = "src/assets/eye6.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "src/assets/eyecross.png"
            passwordRef.current.type = "text"
        }

    }
    const savePassword = async() => {
        if (form.site.length > -1 && form.username.length > -1 && form.password.length > -1) {
            await fetch("http://localhost:3000/",{method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id:form.id})})
            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...form, id:uuidv4()})})
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            console.log([...passwordArray, form])
            toast('Password Saved!!!', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: Bounce,
            });
            setform({ site: '', username: '', password: '' })
        }
        else {
            toast("Password not saved");
        }
    }
    const deletePassword = async(id) => {
        let c = confirm("Do you really want to delete this password");
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify( passwordArray.filter(item => item.id !== id)))
            await fetch("http://localhost:3000/",{method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id})})
            toast('Password Deleted!', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                // transition: Bounce,
            });
        }
    }

    const editPassword = (id) => {
        setform({...passwordArray.filter(i => i.id === id)[0], id:id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))

    }



    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "bottom-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: Bounce,
        });
        navigator.clipboard.writeText(text);
    }
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    return (
        <>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            // transition="Bounce"
            />
            <div>
                <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>
                <div className="px-2 py-4 md:p-1 md:mycontainer" >

                    <p className='text-green-700 text-2xl text-center font-bold'>Password Manager</p>
                    <div className='text-black flex flex-col p-4 gap-8'>
                        <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full  border border-green-500 w-full p-4 py-2' type="text" name='site' id='site' />
                        <div className="flex flex-col md:flex-row w-full justify-between gap-8 " >
                            <input value={form.username} onChange={handleChange} placeholder='Enter UserID' className='rounded-full border border-green-500 w-full p-4 py-2' type="text" name='username' id='username' />

                            <div className='relative'>
                                <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-2' type="password" name='password' id='password' />
                                <span className='absolute right-[5px] top-[9px] cursor-pointer' onClick={showPassword}><img ref={ref} className='p-1' width={30} src="src/assets/eye6.png" alt="eye" /></span>
                            </div>

                        </div>
                        <button onClick={savePassword} className='flex justify-center items-center bg-green-600 rounded-full px-8 py-2 w-fit mx-auto hover:bg-green-400 gap-4 border border-green-900'>
                            <lord-icon
                                src="https://cdn.lordicon.com/zrkkrrpl.json"
                                trigger="click"
                                delay="1500"
                                stroke="bold"
                                state="hover-swirl"
                            >
                            </lord-icon>
                            Add Credentials</button>
                    </div>

                    <div className="passwords">
                        <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                        {passwordArray.length === 0 && <div>No Passwords to show </div>}
                        {passwordArray.length != 0 &&
                            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                                <thead className='bg-green-800 text-white'>
                                    <tr>
                                        <th className='py-2'>Site</th>
                                        <th className='py-2'>Username</th>
                                        <th className='py-2'>Password</th>
                                        <th className='py-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {passwordArray.map((item, index) => {
                                        return <tr key={index}>
                                            <td className='flex items-center justify-center text-center py-2 '>
                                                <a target='_blank' href={item.site}>{item.site}</a>
                                                <img width={25} onClick={() => { copyText(item.site) }} className='cursor-pointer mx-3 my-1' src="src/assets/copy.png" alt="copy img" />
                                            </td>
                                            <td className='text-center w-32 py-2'>{item.username}</td>
                                            <td className='text-center w-32 py-2'>{item.password}</td>
                                            {/* "*".repeat(item.password.length) */}
                                            <td className='text-center w-32 py-2'>
                                                <span className='cursor-pointer mx-2' onClick={() => { editPassword(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/wuvorxbv.json"
                                                        trigger="hover"
                                                        stroke="bold"
                                                        state="hover-line"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                </span>
                                                <span className='cursor-pointer mx-2' onClick={() => { deletePassword(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/drxwpfop.json"
                                                        trigger="hover"
                                                        stroke="bold"
                                                        state="hover-line"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>}
                    </div>

                </div>
            </div>
        </>
    )
}

export default Manager 