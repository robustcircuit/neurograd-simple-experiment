
let syncMode=false

if (syncMode){
    console.log("Hi");
    console.log("Geek");
    console.log("How are you?");
}

if (syncMode==false){
    console.log("Hi");
    setTimeout(() => {
        console.log("Geek");
    }, 2000);
    console.log("End");
}