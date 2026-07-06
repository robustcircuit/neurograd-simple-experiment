
let syncMode=false

if (syncMode==true){
    console.log("Hi");
    console.log("Geek");
    console.log("How are you?");
} else {
    console.log("Hi");
    setTimeout(() => {
        console.log("Geek");
    }, 2000);
    console.log("End");
} 