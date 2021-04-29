import React from 'react';
import { Page, View, Document, StyleSheet, Image, Text } from '@react-pdf/renderer';
import logo from '../../assets/img/colegio.jpg'
import { scheduleFormat, formatNumber, typeDocument } from '../../helpers/functions'
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingTop: 30,
        paddingHorizontal: 30,
        paddingBottom: 15
    },
    image: {
        width: 60,
        height: 60,
        marginLeft: 120,
    }
});


const CompromisePDF = ({ compromise, student }) => {

    const fecha = new Date()
    console.log(fecha.getDate())
    const create = new Date(compromise.create)

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 20, textAlign: 'center' }}>
                                COLEGIO ACADÉMICO EL POBLADO
                            </Text>
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>
                                Reconocimiento oficial de estudios Res. No 4143.010.21.05534 Junio 08 de 2018{"\n"}
                                Para Preescolar, Básica Primaria, Básica Secundaria y Media{"\n"}
                                Cra 28 F No. 72 O 08/ 72 P 21   Teléfono: 4370688
                            </Text>
                        </View>
                        <Image style={styles.image} src={logo} />
                    </View>
                    <Text style={{ marginTop: 60, fontSize: 15, textAlign: 'center' }}>
                        COMPROMISO DE PAGO
                    </Text>
                    <Text style={{ marginTop: 60, fontSize: 12, textAlign: 'justify', marginHorizontal: 40, lineHeight: 1.3 }}>
                        Yo {(compromise.person_charge).toUpperCase()}, identificado(a) con C.C No. {formatNumber(compromise.document)}, como
                        acudiente del estudiante {student.last_name} {student.first_name}, identificado(a) con {typeDocument(student.student.document_type)} No. {formatNumber(student.student.document)} del grado {student.student.grade.name} {scheduleFormat(student.student.schedule)}; me
                        comprometo a cancelar la suma de ${formatNumber(compromise.value)} por concepto de {compromise.month_owed} mensualidad(es) atrasada(s) del año lectivo {fecha.getFullYear()}, de la siguiente manera:
                    </Text>
                    <Text style={{ marginTop: 15, fontSize: 12, textAlign: 'justify', marginHorizontal: 40, lineHeight: 1.3 }}>
                        Cuota No 1: por un valor de ${formatNumber(compromise.value)}, para cancelar el dia {compromise.date_pay}
                    </Text>
                    <Text style={{ marginTop: 30, fontSize: 12, textAlign: 'justify', marginHorizontal: 40, lineHeight: 1.3 }}>
                        Para constancia de lo acordado, se firma en Santiago de Cali a los {create.getDate() + 1} dia(s) del mes {create.getMonth() + 1} del {create.getFullYear()}.
                    </Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 200, justifyContent: 'space-around' }}>
                        <View style={{ width: '40%', borderTop: 2 }}>
                            <Text style={{ fontSize: 12, lineHeight: 1.3, paddingTop: 5 }}>
                                {(compromise.person_charge).toUpperCase()}{`\n`}
                                CC. {formatNumber(compromise.document)}{`\n`}
                                Acudiente
                            </Text>
                        </View>
                        <View style={{ width: '40%', borderTop: 2 }}>
                            <Text style={{ fontSize: 12, lineHeight: 1.3, paddingTop: 5 }}>
                                VLADIMIR MORA PEREZ{`\n`}
                                CC. 94.497.531{`\n`}
                                Director Financiero
                            </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
};
export default CompromisePDF