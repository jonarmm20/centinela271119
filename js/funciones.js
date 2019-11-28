/////////////////////////////////////////
/**        Base de datos local         */
/////////////////////////////////////////

//Abro la base de datos
var db = openDatabase('dbcentinela', '1.0', 'Base de Datos local Centinela', 5*1024*1024);


//Crea tabla login local
function create_tb_log(){
	db.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS log(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, login TEXT)');
	});
}


function check_log(){
	db.transaction(function (tx){
		tx.executeSql('select * from log', [], function(tx, result){
			
      var n = result.rows.length;
      if(n == 0){
        load_page("./views/login/login.html");
      }else{
        var log = result.rows.item(0);
        if(log.login != "true"){
          load_page("./views/login/login.html");
        }else{
          load_page("./views/home/home.html");
        }
      } 

		})	
	})
}



//Crea tabla usuario local
function create_tb_user(){
	db.transaction(function (tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS usuario(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, telefono TEXT, clave TEXT, panicoTrue TEXT, panicoFalse TEXT)');
	});
}


//revisa si esta vacia la tabla usuario
function empty_user(){
	db.transaction(function(tx){
		tx.executeSql('select * from usuario', [], function(tx, result){
			var n = result.rows.length;
			if (n == 0) {return true;}else{return false;}
		});
	});
}

//registra un usuario de forma local, recibe : telefono, clave, panicoTrue, panicoFalse
function crear_user(telefono, clave, panicoTrue, panicoFalse){
	if(empty_user()){
		db.transaction(function(tx){
			tx.executeSql('insert into usuario(telefono, clave, panicoTrue, panicoFalse) values (?, ?, ?, ?)', [telefono, clave, panicoTrue, panicoFalse]);
        })	
        return true;
	}else{
        return false;
    }
}




/////////////////////////////////////////
/**             funciones             **/
/////////////////////////////////////////






function login(form){
    //recibe telefono y clave
    var parametros = $("#"+form).serialize();
    $.ajax({
        data: parametros,
        type: 'post',
        url: 'http://scangoo.com/centinela/APIs/login.php',
        beforeSend: function(){
            $("#load").html("<img src='./image/load-gif.gif' width='30' height='30'>")
        },
        success: function(res){
            $("#load").html("<i class='fas fa-sign-in-alt'>");
            console.clear()
            var data = JSON.parse(res)
            console.log('status:', data.success);
            console.log('message:', data.message);
            if(data.success){
                load_page("./views/home/home.html");
            }else{
                msj(data.message)
            }
            // console.log(res)
        }
    });    
}

var inter,tiempo;
function activarConteo(){
    tiempo=1;
    $("#btn-sos").attr("disabled", "true")
    $("#btn-cancelar").removeAttr('hidden').fadeIn( "slow" )
    inter=setInterval(function(){
        document.getElementById("conteo").innerHTML= '<span class="text-danger lead"> La alarma se enviara al termino del conteo: '+tiempo+++'</span>' ;
        
        if(tiempo==10){
            timeout()
        }
    },1000,"JavaScript");
}

function timeout(){
    clear();
    $("#btn-desactivar").removeAttr('hidden').fadeIn( "slow" )    
    setTimeout(function(){
        document.getElementById("conteo").innerHTML='<span class="text-success lead">La alarma ha sido Activada.</span>';
    },1000,"JavaScript");
    $("#btn-cancelar").attr('hidden', 'true')
}

function clear(){
    clearInterval(inter);
}

function cancelarAlarma(){
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Continuar &rarr;',
        showCancelButton: true,
      }).queue([
        {
          title: 'Cancelar Alarma',
          text: 'Ingresar PIN de segurida para Cancelar'
        }
      ]).then((result) => {
        if (result.value) {
          const answers = JSON.stringify(result.value)
          Swal.fire({
            title: 'All done!',
            html: `
              Your answers:
              <pre><code>${answers}</code></pre>
            `,
            confirmButtonText: 'Lovely!'
          })
        }
      })
}

function desactivarAlarma(){
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Continuar &rarr;',
        showCancelButton: true,
      }).queue([
        {
          title: 'Desactivar Alarma',
          text: 'Ingresar PIN de segurida para Desactivar'
        }
      ]).then((result) => {
        if (result.value) {
          const answers = JSON.stringify(result.value)
          Swal.fire({
            title: 'All done!',
            html: `
              Your answers:
              <pre><code>${answers}</code></pre>
            `,
            confirmButtonText: 'Lovely!'
          })
        }
      })
}




/////////////////////////////////////////
/********    cargar paginas      *******/
/////////////////////////////////////////

function load_page(pagina = ""){

 
    var parametros = {}

    $.ajax({
        url: pagina,
        beforeSend: function(){
            wait(null, "Espere un momento")
        },
        success: function(file){
            swal.close()
            $("#app").html(file)
        }

    });

}


/////////////////////////////////////////
/**           complementos            **/
/////////////////////////////////////////
function wait(titulo = null, texto){
    if(titulo==null)
        titulo = "Centinela"
    Swal.fire({
      title: titulo,
      html: texto,
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()      
      }
    })
}

function stope(titulo = null, texto){
    if(titulo==null)
        titulo = "Centinela"
    Swal.fire({
      title: titulo,
      html: texto,
      onBeforeOpen: () => {
        Swal.showLoading()      
      }
    })
}

function Message(mensaje, type){
    Swal.fire(
        "Centinela",
        mensaje,
        type        
      )
}

function msj(mensaje){
    Swal.fire(mensaje)
}


