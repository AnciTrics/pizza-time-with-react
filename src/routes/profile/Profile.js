import React, { useEffect, useState } from "react";
import ResetLocation from "../../helpers/ResetLocation";
// import validateForm from "../../components/validateForm";
import { useNavigate } from "react-router-dom";

const Profile = ({ currentUser, getUser, handleLogout, updateUser }) => {
    const [editForm, setEditForm] = useState(false);
    const [formValue, setFormValue] = useState({ email: '', password: '', fullname: '', address: '', number: '' });
    // const [formError, setFormError] = useState({});
    const [submit, setSubmit] = useState(false);
    const navigate = useNavigate()

    const toggleForm = () => {
        setEditForm(!editForm);
    }

    const handleValidation = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValue, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        window.scrollTo(0, 0)
        let currForm = { ...formValue };
        Object.entries(currForm).map((entry) => {
            if (entry[1] === '') {
                delete currForm[entry[0]];
            }
        });
        const update = await updateUser(currentUser.id, currForm);
        if (update) {
            setSubmit(true);
            setEditForm(false);
            setFormValue({ email: '', password: '', fullname: '', address: '', number: '' })
        }
    }

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_USERS_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.status === 200) {
                navigate("/");
                handleLogout();
                return true;
            }
        }
        catch (err) {
            console.log(err.message);
            return false;
        }
    }
    return (
        <main className="profile">
            <h2>Profile Information</h2>
            <p>Personal details and application</p>
            {editForm ?
                <form className="profile-form" onSubmit={handleSubmit}>
                    <hr />
                    <section className="profile-information-section">
                        <label htmlFor="email">Email</label>
                        <input name="email" type="text" value={formValue.email} placeholder={currentUser.email} onChange={handleValidation} />
                    </section>
                    <hr />
                    <section className="profile-information-section">
                        <label htmlFor="password">Password</label>
                        <input name="password" type="password" value={formValue.password} placeholder="********" onChange={handleValidation} />
                    </section>

                    <hr />
                    <section className="profile-information-section">
                        <label htmlFor="fullname">Fullname</label>
                        <input name="fullname" type="text" value={formValue.fullname} placeholder={currentUser.fullname} onChange={handleValidation} />
                    </section>
                    <hr />
                    <section className="profile-information-section">
                        <label htmlFor="address">Address</label>
                        <input name="address" type="text" value={formValue.address} placeholder={currentUser.address !== null ? currentUser.address : 'Add address...'} onChange={handleValidation} />
                    </section>
                    <hr />
                    <section className="profile-information-section">
                        <label htmlFor="number">Number</label>
                        <input name="number" type="text" value={formValue.number} placeholder={currentUser.number !== null ? currentUser.number : 'Add number...'} onChange={handleValidation} />
                    </section>
                    <hr />
                    <section className="profile-buttons">
                        <button type="button" className="active-button-style" onClick={() => { toggleForm(); ResetLocation() }}>Cancel edit</button>
                        <button className="passive-button-style">Save profile</button>
                    </section>
                </form> :
                <React.Fragment>
                    <article className="profile-information">

                        <hr />
                        <section className="profile-information-section">
                            <h3>Email</h3>
                            <p>{currentUser.email}</p>
                        </section>
                        <hr />
                        <section className="profile-information-section">
                            <h3>Password</h3>
                            <p>*********</p>
                        </section>
                        <hr />
                        <section className="profile-information-section">
                            <h3>Fullname</h3>
                            <p>{currentUser.fullname}</p>
                        </section>
                        <hr />
                        <section className="profile-information-section">
                            <h3>Address</h3>
                            {currentUser.address !== null ?
                                <p>{currentUser.address}</p> :
                                <p>N/A</p>}
                        </section>
                        <hr />
                        <section className="profile-information-section">
                            <h3>Number</h3>
                            {currentUser.number !== null ?
                                <p>{currentUser.number}</p> :
                                <p>N/A</p>}
                        </section>
                        <hr />
                    </article>
                    <section className="profile-buttons">
                        <button className="active-button-style" onClick={() => { toggleForm(); ResetLocation() }}>Edit profile</button>
                        <button className="passive-button-style" onClick={() => deleteUser(currentUser.id)}>Delete account</button>
                    </section>
                </React.Fragment>
            }
        </main >
    )
}



export default Profile;