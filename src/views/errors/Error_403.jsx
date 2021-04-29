import React from 'react'
import error_img from '../../assets/img/403-img.png'
import { Link } from 'react-router-dom'

const Error_403 = () => {
    return (
        <>
            <div className='d-flex justify-content-center mt-7 animate__animated animate__fadeIn'>
                <img width='30%' alt="search" src={error_img} />
            </div>
            <div className='d-flex justify-content-center animate__animated animate__fadeIn mt--4'>
                <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                    Lo sentimos, no tienes permisos para acceder a esta pagina
                </h3>
            </div>
            <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                <Link to='/' className='btn' style={{ backgroundColor: '#6266ea', color:'white' }}>
                <i className="fas fa-arrow-left mr-3" ></i> Volver
                </Link>
            </div>
        </>
    )
}

export default Error_403