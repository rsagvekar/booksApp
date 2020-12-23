import Firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBgu_-ToppgTaQHsl308yFhyp9FWSgKwVU",
  databaseURL: "https://booksapp-4d306-default-rtdb.firebaseio.com/",
  projectId: "booksapp-4d306",
  appId: "1:877471566187:android:82f7651bcdfc098905a42e",
};

export default Firebase.initializeApp(firebaseConfig);