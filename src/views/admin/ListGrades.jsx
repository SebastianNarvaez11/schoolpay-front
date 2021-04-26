import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteGrade } from '../../redux/actions/gradeActions'
//components
import ModalCreateGrade from '../../components/Admin/ModalCreateGrade'
import ModalUpdateGrade from '../../components/Admin/ModalUpdateGrade'
import { Table, Input as InputAntd, Button as ButtonAntd } from 'antd';
import {Row,  Button } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { formatNumber } from '../../helpers/functions'
import Loader from "react-loader-spinner";


const ListGrades = () => {

    const { grades, isFetchingGrades } = useSelector(state => state.gradeReducer)

    const dispatch = useDispatch()


    // //logica modales
    const [showCreate, setShowCreate] = useState(false)
    const [showUpdate, setShowUpdate] = useState({
        show: false,
        data: null
    })

    const toggleCreate = () => {
        setShowCreate(!showCreate)
    }

    const toggleOpenUpdate = (row) => {
        setShowUpdate({
            show: true,
            data: row
        })
    }

    const toggleCloseUpdate = () => {
        setShowUpdate({
            show: false,
            data: null
        })
    }


    //logica para borrar
    const handleDelete = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar el grado "${row.name}" y todos sus estudiantes ?`)
            .fire().then((result) => {
                if (result.value) {
                    row.deleted = true
                    dispatch(deleteGrade(row))
                }
            })
    }


    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <InputAntd
                    placeholder='Buscar'
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <ButtonAntd
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Buscar
                </ButtonAntd>
                <ButtonAntd onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Limpiar
                </ButtonAntd>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            get(record, dataIndex)
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        render: text =>
            isequal(searchedColumn, dataIndex) ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'Grado',
            dataIndex: "name",
            ...getColumnSearchProps("name"),
            render: (text, row) => `${row.name} `,
        },
        {
            title: 'Abreviación',
            dataIndex: "abbreviation",
            ...getColumnSearchProps("abbreviation"),
            render: (text, row) => `${row.abbreviation} `,
        },
        {
            title: 'Mensualidad',
            dataIndex: 'monthly_pay',
            ...getColumnSearchProps("monthly_pay"),
            render: (text, row) => `$ ${formatNumber(row.monthly_pay)}`,
        },
        {
            title: 'Matricula',
            dataIndex: 'enrollment',
            ...getColumnSearchProps("enrollment"),
            render: (text, row) => `$ ${formatNumber(row.enrollment)}`,
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (<>
                    <span style={{ fontSize: '20px', color: '#faad14' }} className='mr-4' onClick={() => toggleOpenUpdate(row)}>
                        <i id='icon-button' className="far fa-edit"></i>
                    </span>

                    <span style={{ fontSize: '20px', color: '#f5222d' }} onClick={() => handleDelete(row)}>
                        <i id='icon-button' className="far fa-trash-alt"></i>
                    </span>
                </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingGrades
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Grados</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <>
                    <Row style={{ paddingLeft: 50, paddingRight: 50 }}>
                        <Button className='btn mb-4' style={{ backgroundColor: '#6266ea', border: 0 }} type="button" onClick={toggleCreate}  >
                            <i className="fas fa-plus mr-2"></i> Añadir Grado
                        </Button>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn'
                            dataSource={grades}
                            columns={columns}
                            rowKey="id"
                            scroll={{ y: 600 }}
                            pagination={false} />
                    </Row>
                    <ModalCreateGrade show={showCreate} toggle={toggleCreate} />
                    {showUpdate.data && <ModalUpdateGrade show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                </>
            }
        </>
    )
}

export default ListGrades
