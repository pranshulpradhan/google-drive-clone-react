import React, { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListIcon from '@material-ui/icons/List';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { db, storage } from '../firebase';
import firebase from "firebase";

const DataContainer = styled.div`
    flex: 1 1;
    padding: 10px 0px 0px 20px;
`

const DataHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid lightgray;
    height: 40px;
    .headerLeft {
        display: flex;
        align-items: center;
    }
    .headerRight svg {
        margin:0px 10px;
    }
`

const DataGrid = styled.div`
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
`

const DataFile = styled.div`
    text-align: center;
    border: 1px solid rgb(204 204 204 / 46%);
    margin: 10px;
    min-width: 200px;
    padding: 10px 0px 0px 0px;
    border-radius: 5px;
    svg {
        font-size: 60px;
        color:gray
    }
    p {
        border-top: 1px solid #ccc;
        margin-top: 5px;
        font-size: 12px;
        background: whitesmoke;
        padding: 10px 0px;
    }
`
const DataListRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    p {
        display: flex;
        align-items: center;
        font-size: 13px;
        b {
            display: flex;
            align-items: center;
        }
        svg {
            font-size: 22px;
            margin:10px
        }
    }
`

// onst [filePath, setFilePath] = useState('');

const Content = () => {
    const [files, setFiles] = useState([])
    
    useEffect(() => {
        db.collection("myfiles").onSnapshot(snapshot => {
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
    })

    const changeBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

  const [filePath, setFilePath] = useState('');
//   const [fileName, setFileName] = useState('');

  const handleGetPath = async (fileName) => {
    try {
        console.log(fileName);
      // Create a reference to the file
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(fileName);

      // Get the full path of the file
      const fullPath = await fileRef.getFullPath();

      setFilePath(fullPath);
      handleDelete(filePath);
    } catch (error) {
      console.error('Error getting file path:', error.message);
    }
  };

  const handleDelete = async (filePath) => {
    try {
      if (!filePath) {
        console.error('File path is not available. Call handleGetPath first.');
        return;
      }

      // Create a reference to the file to be deleted
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(filePath);

      // Delete the file
      await fileRef.delete();

      console.log('File deleted successfully.');
    } catch (error) {
      console.error('Error deleting file:', error.message);
    }
  };




  return (
    <DataContainer>
        <DataHeader>
            <div className='headerLeft'>
                <p>My Drive</p>
                <ArrowDropDownIcon />
            </div>
            <div className='headerRight'>
                <ListIcon />
                <InfoOutlinedIcon />
            </div>
        </DataHeader>
        <div>
            <DataGrid>
                {files.map(file => (
                    <DataFile key={file.id}>
                    <InsertDriveFileIcon />
                    <p>{file.data.filename}</p>
                </DataFile>
                ))}
            </DataGrid>
            <div>
                <DataListRow>
                    <p><b>Name <ArrowDownwardIcon /></b></p>
                    <p><b>Owner</b></p>
                    <p><b>Last Modified</b></p>
                    <p><b>File Size</b></p>
                </DataListRow>
                {files.map(file => (
                    <DataListRow key={file.id}>
                        <a href={file.data.fileURL} target='_blank'>
                            <p><InsertDriveFileIcon /> {file.data.filename}</p>
                        </a>
                        <p>Owner</p>
                        <p>{new Date(file.data.timestamp?.seconds*1000).toUTCString()}</p>
                        <p>{changeBytes(file.data.size)}</p>
                        <DeleteIcon onClick={() => this.handleGetPath(file.filename)}></DeleteIcon>
                        {/* <DeleteIcon onClick={event => DeleteFileButton(event, file.filename)}></DeleteIcon> */}
                </DataListRow>
                ))}
            </div>
        </div>
    </DataContainer>
  )
}

export default Content