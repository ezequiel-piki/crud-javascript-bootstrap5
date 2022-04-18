
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/./firebase-app.js"

import {  getAuth, onAuthStateChanged, signInWithPopup ,GoogleAuthProvider,signOut } from "https://www.gstatic.com/firebasejs/9.6.10/./firebase-auth.js"
import { getFirestore, doc,setDoc,collection, query, onSnapshot,orderBy,addDoc} from "https://www.gstatic.com/firebasejs/9.6.10/./firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtObEfs0Z3pp3GFJ1tpO_xJ8D8YZswrv0",
  authDomain: "argprograma-bootstrap.firebaseapp.com",
  projectId: "argprograma-bootstrap",
  storageBucket: "argprograma-bootstrap.appspot.com",
  messagingSenderId: "1002852051855",
  appId: "1:1002852051855:web:6402c37d34bf8ea17b79fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore(app);











onAuthStateChanged(auth, (user) => {
  
  if (user) {
    contenidoWeb.innerHTML = ''
    nombreUsuario.innerHTML = user.displayName
    accionCerrarSesion()
    contenidoChat(user)
    
  } else {
   
   accionAcceder()
   console.log('usuario no registrado')
   nombreUsuario.innerHTML = 'Chat'
   contenidoWeb.innerHTML = ` 
   <p class='lead mt-5 text-center'>Debes iniciar sesion</p>
`
  }
});  

 
  const accionCerrarSesion = () => {
  console.log('usuario registrado')
formulario.classList.remove('d-none')
btnCerrarSesion.addEventListener('click',() =>{
  console.log('me disteclick, cerrar sesion')
 
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });

} )
  }

  const accionAcceder = () => {
    formulario.classList.add('d-none') 
    
    btnIngreso.addEventListener('click',async ()=>{
      console.log('desea iniciar sesion?')
      
      const provider = new GoogleAuthProvider();
      
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
     
      
    
    })
    }

  const contenidoChat = user => {
  /* capturando formulario para evento submit */
  formulario.addEventListener('submit',e =>{
    e.preventDefault()
    console.log(texto.value)
    if(!texto.value.trim()){
      console.log('texto vacio')
      return
    } 
 
 
    const docRef = addDoc(collection(db, "chat"), {
      texto: texto.value,
      uid: user.uid,
      fecha:Date.now()
    })
    .then(res => {
      console.log("Documento agregado con exito!");
  })
     texto.value=''

  })

/* -----    */


const q = query(collection(db, "chat"),orderBy("fecha"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
       
      console.log(change.doc.data());
      console.log(user.uid)
      console.log(change.doc.data().uid)
       
        if(user.uid===change.doc.data().uid){
        console.log('entró', change.doc.data().texto)
        contenidoWeb.innerHTML += 
       `
        <div class="text-end">
       <span class="badge bg-info">
       ${change.doc.data().texto}
       </span>
       </div>
       `

       } else{
         contenidoWeb.innerHTML +=
        
         ` 
         <div class="text-start">
        <span class="badge bg-secondary">${change.doc.data().texto}</span>
          </div> 
         ` 
       }
       contenidoWeb.scrollTop=contenidoWeb.scrollHeight
      
      }
      if (change.type === "modified") {
        console.log("Modified chat: ", change.doc.data());
    }
      if (change.type === "removed") {
        console.log("Removed chat: ", change.doc.data());
    } 
  });
});


}




