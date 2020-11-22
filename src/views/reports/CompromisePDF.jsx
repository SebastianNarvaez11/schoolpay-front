import React from 'react';
import { Page, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    image: {
        width: 100,
        height: 100,
    }
});

// Create Document Component

const MyDocument = ({ compromise, student }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            <View style={styles.section}>
                <Image style={styles.image} allowDangerousPaths={true}
                    src={window.location.origin + '/img/colegio.png'}
                />
            </View>
        </Page>
    </Document>
);
export default MyDocument