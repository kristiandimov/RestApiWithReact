import React from "react";
import MaterialTable from "@material-table/core";

const CustomMaterialTable = (props) => {

    return(
    <MaterialTable
        title={props.title}
        columns={props.columns}
        data={props.data}
        editable={{ 
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                setTimeout(() => {
                    props.update(newData);
                    resolve();
                }, 1000)
                }),
            onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        props.delete(oldData.id)
                        resolve();
                    }, 1000);
            }),
            onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        props.create(newData);                             
                        resolve();
                    }, 1000);
                }),
        }}
        options={{
            filtering: true
        }}     
    />);
}

export default CustomMaterialTable;