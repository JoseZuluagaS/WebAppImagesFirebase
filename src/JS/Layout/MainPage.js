import React, { Component } from 'react'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import { create } from '../Services/firebase.js'
import firebase from 'firebase/app'
import 'react-notifications/lib/notifications.css'
import Compress from 'compress.js'
const compress = new Compress();

class MainPage extends Component {
    constructor() {
        super()
        this.state = {
            image: '',
            metadata: '',
            nombre: '',
            DownURL:''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleOnClick = this.handleOnClick.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleFile = this.handleFile.bind(this)
    }

    handleFile(e) {
        e.persist()
        let reader = new FileReader()
        const files = [...e.target.files]
        compress.compress(files, {
            size: 4,
            quality: .7,
            maxWidth: 500,
            maxHeight: 500,
            resize: true,
        })
            .then((data) => {
                let img = data[0]
                reader.readAsDataURL(Compress.convertBase64ToFile(img.data, img.ext))
                reader.onloadend = () => {
                    this.setState({
                        image: reader.result,
                        metadata: img.ext,
                        nombre: files[0].name
                    })
                }


            })

    }

    handleChange(e) {

        this.setState({
            [e.target.name]: e.target.value


        })
        console.log(this.state)
    }

    handleCancel(e) {
        e.preventDefault()
        this.setState({
            image: ''
        })
    }
    
    handleOnClick() {

        var ref = firebase.storage().ref();
        var InsertImage = new Promise((resolve, reject) => {
            var arr = this.state.image.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var file =  new File([u8arr], this.state.nombre, { type: mime })
            var metadataFile = {
                contentType: this.state.metadata
            }
            ref.child(file.name).put(file,metadataFile)
            
            setTimeout(() => {
                resolve(file)
            }, 3000);
        })
 
        InsertImage.then((file) => {
            ref.child(file.name).getDownloadURL().then( (url) => {
                firebase.database().ref("Imagenes").push().set({
                    Nombre: file.name,
                    DownloadURL: url
                });
                NotificationManager.success('Success message', 'Se ha subido la imagen a la carpeta!!')

                fetch('http://192.168.1.11:5000/Broadcast')
                    .then(function(response) {
                        NotificationManager.success('Success message', 'Se notifico a todos los usuarios de tu envio!!') 
                    });
            })
        })

   }
    

	render() {
    	return (
            <section>
                <div className="content">
                        <h1>Sube una foto a la carpeta compartida!!</h1>
                    <div className="center">
                    <input
                        name="Image"
                        id="newImage"
                        type="file" 
                        accept="image/*"
                        onChange={this.handleFile}
                    />
                    </div>
                    <div>
						{  
							this.state.image &&
							<img className="image" src={this.state.image} alt="imagen" />
                        }
					</div>
                    <div className="center">
                    <button type="submit" className="button" onClick = {this.handleOnClick}>Subir</button>
                        <button type="submit" className="button" onClick = {this.handleCancel}>Cancelar</button>
                        
                    </div>
                </div>
                <NotificationContainer></NotificationContainer>
            </section>
        )
    }
}
export default MainPage