import React, {useState, useEffect} from 'react'
import { useLoaderData, defer, Await } from 'react-router-dom'
import { getData, addData, updateData, deleteData, uploadToStorage } from '../../hooks/firebaseConfig'
import './FirebaseCRUD.css'



const loader = ()=>{
    return defer({tasks: getData()})
}

const FirebaseCRUD = ()=> {
    const [data, setData ] = useState({email:'', password:''})
    const [file, setFile ] = useState({})
    const dataPromise = useLoaderData()

    function handleSubmit(event){
        event.preventDefault()
        addData({email:data.email, password:data.password})
    }  

    function handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setData(prevState => {
            return {...prevState, [name]: value}
        })
    }

    function handleFileSubmit(){
        uploadToStorage(file.name, file)
    }

    return(
        <>
            <h1>Create a document in firebase</h1>
            <br />
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder='email'
                    name="email"
                    value={data.email}
                    type="email" 
                    onChange={handleChange} 
                />
                <input 
                    placeholder='password'
                    name="password"
                    value={data.password}
                    type="password" 
                    onChange={handleChange} 
                />
                <input 
                    type="submit" 
                    value='submit' 
                />
            </form>
            <br />
            <section>
                <h1>Get all docs from a collection in firebase</h1>
                <br />
                <React.Suspense fallback={<h2>Loading tasks...</h2>}>
                    <Await resolve={dataPromise.tasks}>
                        {tasks => {
                            const taskList = tasks.map(item => (
                                <div key={item.id}>
                                    <h2>Email: {item.email}</h2>
                                    <p>Password: {item.password}</p>
                                    <br />
                                    <button id={item.id} onClick={(event)=> deleteData(event.target.id)}>X</button>
                                </div>
                                
                            ))

                            return(
                                <>
                                    {taskList}
                                </>
                            )
                        }}
                    </Await>
                </React.Suspense>
            </section>
            <section>
                <button onClick={(event)=> updateData('QKIniq5KVO8pEXkocldS',{email:data.email, password:data.password})}>Update data</button>
                <br />
                <br />
            </section>
            <section>
                <form onSubmit={handleFileSubmit}></form>
                <input name='file' type="file" onChange={(event)=> setFile(event.target.files[0])} />
                <br />
                <br />
                <input type="submit" value={'Submit File'} onClick={handleFileSubmit} />
            </section>

        </>
    )
}

export {loader, FirebaseCRUD};