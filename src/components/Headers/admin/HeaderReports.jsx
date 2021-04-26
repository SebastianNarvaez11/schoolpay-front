import React, {  useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchDataReports } from '../../../redux/actions/studentActions'

export const HeaderReports = () => {

    const dispatch = useDispatch()
    const { data_reports } = useSelector(state => state.studentReducer)


    useEffect(() => {
        if (data_reports.length === 0) {
            dispatch(fetchDataReports())
        }
        //  eslint-disable-next-line
    }, [dispatch]);



    return (
        <>
            
        </>
    )
}

export default HeaderReports;