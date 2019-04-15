import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyC6myv9h0Do-AAEA8e7lSY4SY-HpUYuYPk",
    authDomain: "cloudgallery-312c2.firebaseapp.com",
    databaseURL: "https://cloudgallery-312c2.firebaseio.com",
    projectId: "cloudgallery-312c2",
    storageBucket: "cloudgallery-312c2.appspot.com",
    messagingSenderId: "197344455011"
}

firebase.initializeApp(config)
const database = firebase.database()

/*CRUD*/
export function create(collection, obj){
    return database.ref(collection).push(obj)    
}
export function list(collection){
	return database.ref(collection)
}

export function deleteData(collection,id){
    firebase.database().ref(collection).child(id).remove()
}




