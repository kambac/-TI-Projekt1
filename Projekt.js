var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
//Promień kulek
var radius = 30;
//Wartość y umieszczenia kulek na przestrzeni do rysowania
var height_of_circles = HEIGHT*2/3;
//Długość linek
var R = height_of_circles - 20;
var indeks = document.getElementById("choice_number_of_balls").selectedIndex;
var options = document.getElementById("choice_number_of_balls").options;
var indeks2 = document.getElementById("choice_tilted_balls").selectedIndex;
var options2 = document.getElementById("choice_tilted_balls").options;
//Tablica przechowująca współrzędną x dla każdej z kulki
var x_of_balls = [];
//Tablica przechowująca współrzędną y dla każdej z kulki
var y_of_balls = [];
//Tablica przechowująca współrzędną początkową x dla każdej z kulki
var x_of_begin = [];
//Początkowy kąt wychylenia
var angle = Math.PI/6;
//Chwilowy kąt wychylenia, wykorzystywany do animacji, przyjmuje obecją wartość wychylenia kąta
var angle_tmp = Math.PI/6;
//cząstka czasu, po jakim zmiani się klatka animacji
var dt = 20;
//wartość o jaką zmieni się kąt w dt
var d_angle = 0;
var interval;
//przyśpieszenie kątowe
var angle_acceleration = Math.PI/600;

//Funkcja rysująca koło
function circle(x,y,r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}
//Funkcja rysująca linie
function line(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
//Funkcja rysująca prostokąt
function rect(x,y,w,h) {
    ctx.fillRect(x,y,w,h);
}
//Funkcja czyszcząca nasze pole, na którym rysujemy animację
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

//Funkcja wypisująca wartości parametrów początkowych kulek(razem z wychyleniem) i rysująca je. Zeruje tymczasowy kąt i przemieszczenie o kąt w dt.
function draw() {
    indeks = document.getElementById("choice_number_of_balls").selectedIndex;
    indeks2 = document.getElementById("choice_tilted_balls").selectedIndex;
    clear();
    //tło
    ctx.fillStyle = "white";
    rect(0,0,WIDTH,HEIGHT);
    //podpora
    ctx.fillStyle = "black";
    rect(0,0,WIDTH,20);
    //kulki
    ctx.fillStyle = "red";
    
    for (i=0; i<options[indeks].text; i++){
        x_of_balls[i] = (WIDTH/2 - (options[indeks].text-1)*radius + i*(2*radius));
        y_of_balls[i] = height_of_circles;
        x_of_begin[i] = x_of_balls[i];
    }
    
    for(i=0; i<options2[indeks2].text; i++){
        x_of_balls[i] = x_of_balls[i] - R*Math.sin(angle);
        y_of_balls[i] = R*Math.cos(angle) + 20;
    }
    
    for (i=0; i<options[indeks].text; i++){
        line(x_of_balls[i],y_of_balls[i],x_of_begin[i],20);
        circle(x_of_balls[i], y_of_balls[i], radius);
    }
    
    angle_tmp = angle;
    d_angle = 0;
}
//Funkcja obliczająca tymczasowe wychylenie kułek i rysująca je, wykorzystywana do animacji.
function draw2() {
    indeks = document.getElementById("choice_number_of_balls").selectedIndex;
    indeks2 = document.getElementById("choice_tilted_balls").selectedIndex;
    clear();
    //tło
    ctx.fillStyle = "white";
    rect(0,0,WIDTH,HEIGHT);
    //podpora
    ctx.fillStyle = "black";
    rect(0,0,WIDTH,20);
    //kulki
    ctx.fillStyle = "red";

    
    if(angle_tmp >= 0){
        d_angle += angle_acceleration;
        angle_tmp -= d_angle;
        for(i=0; i<options2[indeks2].text; i++){
            x_of_balls[i] = x_of_begin[i] - R*Math.sin(angle_tmp);
            y_of_balls[i] = R*Math.cos(angle_tmp) + 20;
            if(x_of_balls[i] > x_of_begin[i]){
                x_of_balls[i] = x_of_begin[i];
                y_of_balls[i] = R + 20;
            }
        }
    }
    else if(angle_tmp < 0){
        d_angle -= angle_acceleration;
        angle_tmp -= d_angle;
        for(i=options[indeks].text-1; i>(options[indeks].text-1) - options2[indeks2].text; i--){
            x_of_balls[i] = x_of_begin[i] - R*Math.sin(angle_tmp);
            y_of_balls[i] = R*Math.cos(angle_tmp) + 20;
            if(x_of_balls[i] < x_of_begin[i]){
                x_of_balls[i] = x_of_begin[i];
                y_of_balls[i] = R + 20;
            }
        }
    }
    
    
    for (i=0; i<options[indeks].text; i++){
        line(x_of_balls[i],y_of_balls[i],x_of_begin[i],20);
        circle(x_of_balls[i], y_of_balls[i], radius);
    }
    
}
//Funkcja ustawiająca interwał, będzie wykonywać funkcję draw2 co podaną ilość ms
function init() {
    canvas = document.getElementById("canvas");
    ctx= canvas.getContext("2d");
    interval = setInterval(draw2, dt);
}

//Funkcja zatrzymująca interwał
function stop() {
    return clearInterval(interval);
}
//Funkcja, która nadpisze zawartość obiektu start_stop przyciskiem słóżącym do zatrzymania animacji
function change_on_stop(){
    document.getElementById("start_stop").innerHTML = "<input type=\"button\" id=\"stop\" value=\"Zatrzymaj animację\" onclick=\"stop(); change_on_start();\" />";
}
//Funkcja, która nadpisze zawartość obiektu start_stop przyciskiem słóżącym do rozpoczęcia animacji
function change_on_start(){
    document.getElementById("start_stop").innerHTML = "<input type=\"button\" id=\"start\" value=\"Rozpocznij animację\" onclick=\"init(); change_on_stop();\" />";
}
//Funkcja dostosowyjąca ilość możliwych odchyleń kulek od ilości zawieszonych kulek
function change_tilted_balls(){
    indeks = document.getElementById("choice_number_of_balls").selectedIndex;
    while (options2.length) {
        document.getElementById("choice_tilted_balls").remove(0);
    }
    for(i = 0; i <= options[indeks].text; i++) {
        var opt = new Option(i, i);
        options2.add(opt);
    }
    
}
//Funkcja wyświetlająca tekst w obiekcie description, gdzie znajduje się opis kołyski newtona.
function description_show(){
    document.getElementById("description").style.display = 'block';
}
//Funkcja chowająca tekst w obiekcie description.
function description_hide(){
    document.getElementById("description").style.display = 'none';
}
//Funkcja, która nadpisze zawartość obiektu description_manage przyciskiem słóżącym do wyswietlania zawartości description
function description_manage_show(){
    document.getElementById("description_manage").innerHTML = "<input type=\"button\" id=\"desc_show\" value=\"Pokaż opis doświadczenia\" onclick=\"description_show(); description_manage_hide()\" /><br>";
}
//Funkcja, która nadpisze zawartość obiektu description_manage przyciskiem słóżącym do chowania zawartości description
function description_manage_hide(){
    document.getElementById("description_manage").innerHTML = "<input type=\"button\" id=\"desc_hide\" value=\"Schowaj opis doświadczenia\" onclick=\"description_hide(); description_manage_show()\" /><br>";
}
