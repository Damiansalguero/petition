//Sobald Dokument geladen ist
$(document).ready(function() {
    //Erst bei klick erfolgt Aktivierung
    var click = false;

    //Koordinaten horizonazl und vertikal
    var x = 0;
    var y = 0;

    //Setup der canvas
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    //Drawing Stlye Setup
    context.strokeStyle = "black";
    context.fillStyle = "black";
    context.lineWidth = 4;

    $("#canvas").mousedown(function(e) {
        click = true;
        context.save();
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
    });

    $("#canvas").mousemove(function(e) {
        if (click == true) {
            context.beginPath();
            context.moveTo(
                e.pageX - canvas.offsetLeft,
                e.pageY - canvas.offsetTop
            );
            context.lineTo(x, y);
            context.stroke();
            context.closePath();
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;
        }
        $(canvas).mouseup(function() {
            console.log("Hello");
            click = false;
            $("#signatureField").val(canvas.toDataURL());
        });
    });
});

//data to url (on mouse up) assign it to hidden field
