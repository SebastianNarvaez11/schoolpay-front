import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateAdmin, deleteUser } from '../../redux/actions/adminActions'
import { host } from '../../helpers/host.js'
//components
import HeaderAdmin from '../../components/Headers/admin/HeaderAdmin'
import ModalCreateAdmin from '../../components/Admin/ModalCreateAdmin'
import ModalUpdateAdmin from '../../components/Admin/ModalUpdateAdmin'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Col, Button, Spinner } from "reactstrap";
import { ToastDelete } from '../../assets/alerts'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import axios from 'axios'
import Swal from 'sweetalert2'


const ListUser = () => {

    const { users, isFetchingUsers } = useSelector(state => state.adminReducer)

    const dispatch = useDispatch()

    //logica modales
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

    //logica para el cambio de estado
    // primero se actualiza el usuario general
    // despues se manda a actualizar el perfil admin
    const toggleState = (row) => {
        row.is_active = !row.is_active
        let url = `${host}api/v1/users/update/${row.id}/`
        axios.put(url, row)
            .then(response => {
                dispatch(updateAdmin(row.admin, response.data))
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    showConfirmButton: true,
                    text: error
                })
            })
    }

    //logica para borrar
    const handleDelete = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar al usuario "${row.first_name} ${row.last_name}" ?`)
            .fire().then((result) => {
                if (result.value) {
                    row.is_active = false
                    row.deleted = true
                    dispatch(deleteUser(row))
                }
            })
    }


    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
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
            title: 'Usuario',
            dataIndex: ['username'],
            ...getColumnSearchProps("username"),
            render: (text, row) => `${row.username} `,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ...getColumnSearchProps("email"),
            render: (text, row) => `${row.email}`,
        },
        {
            title: 'Cargo',
            dataIndex: 'position',
            ...getColumnSearchProps("admin.position"),
            render: (text, row) => `${row.admin.position}`,
        },
        {
            title: 'Perfil',
            dataIndex: 'type',
            filters: [
                {
                    text: 'Administrador',
                    value: '1',
                },
                {
                    text: 'Asistente',
                    value: '2',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.type).indexOf(value) === 0,
            render: (text, row) => row.type === 1 ? 'Administrador' : 'Asistente'
        },
        {
            title: 'Estado',
            dataIndex: 'is_active',
            filters: [
                {
                    text: 'Activo',
                    value: true,
                },
                {
                    text: 'Inactivo',
                    value: false,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.is_active).indexOf(value) === 0,
            render: (text, row) => row.is_active ?
                <div className="badge badge-success text-wrap">Activo</div> :
                <div className="badge badge-warning text-wrap">Inactivo</div>
        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <Row>
                        <Col>
                            <span style={{ fontSize: '20px', color: '#597ef7' }} onClick={() => toggleState(row)}>
                                <i id='icon-button' className="fas fa-sync-alt rotateMe"></i>
                            </span>

                            <span style={{ fontSize: '20px', color: '#faad14' }} className='ml-4 mr-4' onClick={() => toggleOpenUpdate(row)}>
                                <i id='icon-button' className="far fa-edit"></i>
                            </span>

                            <span style={{ fontSize: '20px', color: '#f5222d' }} onClick={() => handleDelete(row)}>
                                <i id='icon-button' className="far fa-trash-alt"></i>
                            </span>
                        </Col>
                    </Row>
                );
            },
        },
    ];




    return (
        <>
            <HeaderAdmin />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row>
                    <div className="col">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn d-flex justify-content-center">
                            <CardHeader className="border-0">
                                <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Usuarios</h3>
                                <Button className='btn btn-success float-right  mt--5' color="success" type="button" onClick={toggleCreate} >
                                    Nuevo <i className="fas fa-plus ml-1"></i>
                                </Button>
                            </CardHeader>
                            {isFetchingUsers
                                ?
                                <div style={{ margin: 40, alignSelf: 'center' }}>
                                    <Spinner className="float-right" color="primary" />
                                </div>
                                :
                                <Container fluid>
                                    <Table className='table-responsive'
                                        dataSource={users}
                                        columns={columns}
                                        rowKey="id"
                                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
                                </Container>
                            }
                        </Card>
                    </div>
                </Row>
                <ModalCreateAdmin show={showCreate} toggle={toggleCreate} />
                {showUpdate.data && <ModalUpdateAdmin show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
            </Container >
        </>

    )
}

export default ListUser
